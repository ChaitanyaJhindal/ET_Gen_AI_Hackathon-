@echo off
echo ===================================================
echo   Industrial Knowledge Intelligence Platform
echo ===================================================
echo.
echo Starting Backend Server (FastAPI)...
start "Backend Server" cmd /k "cd backend && uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"

echo Starting Frontend Server (Vite + React)...
start "Frontend Server" cmd /k "cd frontend && npm run dev"

echo.
echo Both servers are launching in separate windows!
echo.
echo - Frontend URL: http://localhost:5173
echo - Backend API:  http://localhost:8000
echo - API Docs:     http://localhost:8000/docs
echo.
echo You can close this window now. Close the newly opened terminal windows to stop the servers.
pause
