import logging
from app.services.llm_service import llm_service
from app.services.vector_service import vector_service
from app.services.knowledge_service import knowledge_service

logger = logging.getLogger(__name__)

class RCAService:
    def generate_rca(self, asset_id: str) -> dict:
        # Standardize asset ID (e.g. "MD 800" -> "MD-800")
        asset_id_clean = str(asset_id).upper().replace(" ", "-")
        
        # Load asset data
        data = knowledge_service.get_asset(asset_id_clean)
        if not data:
            # Fallback to original just in case
            data = knowledge_service.get_asset(asset_id)
            if not data:
                return {"root_cause": "Asset not found in knowledge base.", "recommendation": "Verify asset ID."}
            
        def safe_join(items):
            result = []
            for item in items:
                if isinstance(item, str):
                    result.append(item)
                elif isinstance(item, dict):
                    # Extract values if it's a SCADA subpart dict
                    vals = [str(v) for k, v in item.items() if v]
                    result.append(" ".join(vals))
            return ", ".join(result)
            
        failures = safe_join(data.get("failures", []))
        maintenance = safe_join(data.get("maintenance_events", []))
        
        # Retrieve context
        query = f"Failures and maintenance for equipment {asset_id} {failures}"
        retrieved_chunks = vector_service.retrieve(query, n_results=5)
        doc_context = "\n".join(retrieved_chunks)
        
        prompt = f"""ASSET: {asset_id}
FAILURE HISTORY: {failures}
MAINTENANCE HISTORY: {maintenance}
RELATED DOCUMENTS: {doc_context}

Perform a Root Cause Analysis for {asset_id}.
Return STRICT JSON exactly matching this structure:
{{
  "root_cause": "Detailed explanation of the likely root cause",
  "recommendation": "Actionable recommendations",
  "severity": "Low, Medium, High, or Critical",
  "confidence": "<number between 60 and 99>",
  "reasoning_chain": [
    "Initial symptom or event (e.g., Continuous vibration)",
    "Secondary effect (e.g., Bearing degradation)",
    "Final failure (e.g., Flow reduced by 12%)"
  ]
}}
CRITICAL INSTRUCTION: The `reasoning_chain` MUST be an array of 3 to 5 strings representing the exact chronological chain of events that led to the failure. Do not include arrows, just the plain text of each step."""

        system_prompt = "You are an Industrial RCA Expert. Output ONLY valid JSON."
        result = llm_service.generate_json(prompt, system_prompt)
        
        # Ensure confidence is a number
        try:
            confidence = int(result.get("confidence", 85))
        except ValueError:
            confidence = 85

        # Subagent Workflow: Use Llama-3.3-70b-versatile specifically to draw the Mermaid graph
        reasoning_chain = result.get("reasoning_chain", [])
        mermaid_chart = ""
        
        if reasoning_chain and isinstance(reasoning_chain, list) and len(reasoning_chain) >= 2:
            chain_text = "\\n".join(f"- {step}" for step in reasoning_chain)
            
            subagent_prompt = f"""You are an expert systems architect. I have performed a Root Cause Analysis and established the following chronological chain of events that led to a machine failure:
{chain_text}

Your ONLY task is to convert this chain of events into a highly detailed Mermaid.js flowchart (graph TD).
- DO NOT just make a simple straight line. If multiple events occur concurrently or contribute to the same outcome, branch them out so they appear at the same height/rank (e.g., A-->C and B-->C).
- You MUST use descriptive edge labels to explain the reasoning between nodes. STRICT SYNTAX RULE: You must use EXACTLY the syntax `A -->|text| B`. Do NOT add an extra arrow head after the pipe (e.g. NEVER use `-->|text|>`).
- If you use 'style' tags to color-code nodes by severity, you MUST use deep/dark colors (e.g., fill:#7f1d1d for critical red, fill:#1e3a8a for blue, fill:#78350f for orange) and explicitly set the text color to white (e.g., color:#ffffff) to maintain contrast against our dark UI theme! Never use light pastel colors.
- Output ONLY the raw Mermaid code starting with 'graph TD'.
- Do NOT wrap the code in markdown backticks (e.g., no ```mermaid). Just the raw code."""
            
            subagent_system = "You are a Mermaid code generator. Output ONLY raw Mermaid code. No markdown, no explanations."
            
            # Spin up the specialized subagent!
            mermaid_chart = llm_service.generate_text(
                prompt=subagent_prompt, 
                system_prompt=subagent_system, 
                model_override="llama-3.3-70b-versatile"
            )
            
            # Final sanity cleanup just in case Llama disobeys the "no markdown" rule
            if mermaid_chart.startswith("```mermaid"):
                mermaid_chart = mermaid_chart.replace("```mermaid", "").replace("```", "").strip()
            elif mermaid_chart.startswith("```"):
                mermaid_chart = mermaid_chart.replace("```", "").strip()
                
            # Automatically fix the LLM's persistent hallucination of `-->|text|>` to the valid `-->|text|`
            mermaid_chart = mermaid_chart.replace("|>", "|")
        else:
            mermaid_chart = ""

        return {
            "root_cause": result.get("root_cause", "Analysis failed."),
            "recommendation": result.get("recommendation", "Analysis failed."),
            "mermaid_chart": mermaid_chart,
            "severity": result.get("severity", "High"),
            "confidence": confidence
        }

rca_service = RCAService()
