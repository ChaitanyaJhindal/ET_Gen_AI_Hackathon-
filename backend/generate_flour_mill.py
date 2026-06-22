import os
import pandas as pd
import random
from datetime import datetime

try:
    from docx import Document
    from reportlab.lib.pagesizes import letter
    from reportlab.lib import colors
    from reportlab.lib.units import inch
    from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
    from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
except ImportError:
    print("Missing libraries. Run: pip install pandas python-docx reportlab openpyxl")
    exit(1)

out_dir = "../Shakti_Hackathon_Dataset"
os.makedirs(out_dir, exist_ok=True)

print(f"Generating Flour Mill SCADA Dataset in {out_dir}...")

# Machine definitions
machines = [
    {"id": "SEP-100", "name": "Grain Separator", "subparts": ["Intake Valve", "Aspiration Channel", "Pre-clean Screen", "Main Sieve", "Cyclone Dust Collector", "Vibration Motor A", "Vibration Motor B", "Exhaust Fan", "Discharge Chute", "Control Panel"]},
    {"id": "DST-200", "name": "Destoner", "subparts": ["Feed Gate", "Deck Screen", "Fluidization Fan", "Eccentric Drive", "Stone Discharge", "Product Discharge", "Air Exhaust", "Vibration Damper", "Drive Belt", "Inlet Sensor"]},
    {"id": "RM-301", "name": "Roller Mill A (1st Break)", "subparts": ["Main Drive Motor", "Transmission Belt", "Feeding Roll", "Corrugated Grinding Roll Fast", "Corrugated Grinding Roll Slow", "Roll Gap Sensor", "Scraper Knife", "Lube Oil Pump", "Pneumatic Engagement Cylinder", "Bearing Assembly Top"]},
    {"id": "RM-302", "name": "Roller Mill B (Reduction)", "subparts": ["Main Drive Motor", "Transmission Belt", "Feeding Roll", "Smooth Grinding Roll Fast", "Smooth Grinding Roll Slow", "Roll Gap Sensor", "Scraper Knife", "Water Cooling Jacket", "Pneumatic Engagement Cylinder", "Bearing Assembly Bottom"]},
    {"id": "PUR-400", "name": "Purifier", "subparts": ["Inlet Distributor", "Stratification Deck", "Fine Sieve Mesh", "Coarse Sieve Mesh", "Air Flow Regulator", "Oscillation Motor", "Tailings Trough", "Underflow Collection", "Illumination LED", "Vacuum Manifold"]},
    {"id": "PS-500", "name": "Plansifter", "subparts": ["Suspension Rods", "Drive Counterweight", "Main Bearing", "Sieve Stack 1", "Sieve Stack 2", "Sieve Stack 3", "Sieve Stack 4", "Sieve Cleaners (Pan Cleaner)", "Discharge Sleeves", "Inlet Manifold"]},
    {"id": "BF-600", "name": "Bran Finisher", "subparts": ["Beater Rotor", "Perforated Screen Cylinder", "Main Motor", "Inlet Auger", "Bran Outlet", "Flour Outlet", "Bearing Front", "Bearing Rear", "Screen Tensioner", "Drive Pulley"]},
    {"id": "PB-700", "name": "Pneumatic Blower", "subparts": ["Impeller", "Volute Casing", "Drive Motor", "Inlet Filter", "Silencer", "Pressure Relief Valve", "Discharge Check Valve", "Cooling Fan", "Vibration Isolator", "Flow Meter"]},
    {"id": "MD-800", "name": "Micro-Doser (Vitamins)", "subparts": ["Agitator Motor", "Dosing Screw", "Hopper", "Load Cell", "Discharge Funnel", "Frequency Inverter", "Level Sensor", "Bridging Breaker", "Control PLC", "Air Purge Line"]},
    {"id": "PKG-900", "name": "Packaging Line", "subparts": ["Bag Magazine", "Filler Spout", "Weigh Scale", "Sewing Head", "Conveyor Belt", "Bag Kicker", "Palletizer Arm", "Stretch Wrapper", "Label Printer", "Safety Light Curtain"]}
]

# 1. Generate SCADA Report (Excel)
def create_scada_excel():
    data = []
    
    # Intentionally make RM-301 Grinding Roll at 85% and PUR-400 Sieve at 92% to trigger constraints
    for machine in machines:
        for subpart in machine["subparts"]:
            # Default to healthy
            efficiency = random.randint(95, 100)
            status = "Operational"
            
            if machine["id"] == "RM-301" and "Grinding Roll" in subpart:
                efficiency = 85
                status = "Warning - Wear Detected"
            if machine["id"] == "PUR-400" and "Sieve" in subpart:
                efficiency = 92
                status = "Warning - Partial Blinding"
            if machine["id"] == "PB-700" and "Filter" in subpart:
                efficiency = 78
                status = "Critical - Clogged"
                
            data.append({
                "Timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                "Machine_ID": machine["id"],
                "Machine_Name": machine["name"],
                "Subpart_Name": subpart,
                "Current_Efficiency_%": efficiency,
                "Status": status
            })
            
    df = pd.DataFrame(data)
    filepath = os.path.join(out_dir, "SCADA_Live_Performance_Report.xlsx")
    df.to_excel(filepath, index=False)
    print("Created Excel SCADA Report.")

create_scada_excel()

# 2. Generate PDF Rules & Manuals
def create_pdf_manual(filename, title, content_sections):
    filepath = os.path.join(out_dir, filename)
    doc = SimpleDocTemplate(filepath, pagesize=letter)
    styles = getSampleStyleSheet()
    h1 = styles['Heading1']
    h2 = styles['Heading2']
    normal = styles['Normal']
    
    story = []
    story.append(Paragraph(title, h1))
    story.append(Spacer(1, 0.2 * inch))
    
    for section_title, text_blocks in content_sections.items():
        story.append(Paragraph(section_title, h2))
        story.append(Spacer(1, 0.1 * inch))
        if isinstance(text_blocks, list):
            for block in text_blocks:
                story.append(Paragraph(block, normal))
                story.append(Spacer(1, 0.1 * inch))
        else:
            story.append(Paragraph(text_blocks, normal))
            story.append(Spacer(1, 0.1 * inch))
            
    doc.build(story)
    print(f"Created {filename}")

create_pdf_manual(
    "Flour_Production_Rules.pdf",
    "Flour Mill SCADA - Production Grade Rules",
    {
        "1. Overview": "This document outlines the strict machine efficiency thresholds required for different flour grades. The central SCADA system tracks subpart efficiency across all 10 major milling machines.",
        "2. Ultra-Fine Cake Flour (Premium Grade)": [
            "Requirement: Requires absolute precision in particle size distribution and zero bran contamination.",
            "Machine Thresholds:",
            "- RM-301 and RM-302 (Roller Mills): Corrugated and Smooth Grinding Rolls MUST operate at 100% efficiency. Anything lower will result in off-spec coarse particles.",
            "- PUR-400 (Purifier): Fine and Coarse Sieve Mesh MUST operate at 100% efficiency to guarantee zero ash/bran content.",
            "- PS-500 (Plansifter): Sieve stacks must be >98% efficiency."
        ],
        "3. Standard Bread Flour (Commercial Grade)": [
            "Requirement: Standard industrial baking grade. Tolerates minor variance.",
            "Machine Thresholds:",
            "- Roller Mills (RM-301, RM-302): Grinding rolls can operate down to 90% efficiency. Roll gaps are more forgiving.",
            "- Purifier (PUR-400): Sieve meshes can operate down to 85% efficiency without compromising commercial standards.",
            "- Pneumatic Blower (PB-700): Inlet filters must remain above 80% to maintain adequate conveying velocity."
        ],
        "4. Animal Feed Grade (Lowest Grade)": [
            "Requirement: High volume, low precision.",
            "Machine Thresholds:",
            "- All Roller Mill and Purifier subparts can operate down to 70% efficiency.",
            "- Bran Finisher (BF-600) must operate above 80%."
        ]
    }
)

create_pdf_manual(
    "RM-301_Service_Manual.pdf",
    "RM-301 Roller Mill - Service & Operations Manual",
    {
        "1. Subpart Overview": "The RM-301 Roller Mill consists of 10 primary subparts monitored by the SCADA system: Main Drive Motor, Transmission Belt, Feeding Roll, Corrugated Grinding Roll Fast, Corrugated Grinding Roll Slow, Roll Gap Sensor, Scraper Knife, Lube Oil Pump, Pneumatic Engagement Cylinder, and Bearing Assembly Top.",
        "2. Grinding Roll Wear": "The Corrugated Grinding Rolls are the most critical subparts. Over time, the flutes wear down, dropping efficiency below 100%. A drop in efficiency directly impacts the ability to produce Ultra-Fine Cake Flour.",
        "3. Maintenance Action": "If Grinding Roll efficiency drops below 90%, the rolls must be removed and re-fluted in the machine shop."
    }
)

create_pdf_manual(
    "PUR-400_Service_Manual.pdf",
    "PUR-400 Purifier - Service Manual",
    {
        "1. Subpart Overview": "The PUR-400 Purifier utilizes aerodynamics and oscillation to separate pure endosperm from bran. Key SCADA subparts include: Inlet Distributor, Stratification Deck, Fine Sieve Mesh, Coarse Sieve Mesh, Air Flow Regulator, Oscillation Motor, Tailings Trough, Underflow Collection, Illumination LED, and Vacuum Manifold.",
        "2. Sieve Mesh Blinding": "The most common failure is 'blinding' of the Fine and Coarse Sieve Meshes, where sticky endosperm blocks the holes. This drops efficiency below 100% and prevents Premium grade production."
    }
)

print("Flour Mill dataset generation complete!")
