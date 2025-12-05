@echo off
echo Starting Sports Stock Exchange...

:: Start Backend
echo Starting Backend Server...
start "Sports Stock Backend" cmd /k "cd backend && venv\Scripts\activate && uvicorn main:app --reload --port 8000"

:: Start Frontend
echo Starting Frontend Server...
start "Sports Stock Frontend" cmd /k "npm run dev"

echo.
echo ===================================================
echo App is starting!
echo Backend will be at: http://localhost:8000
echo Frontend will be at: http://localhost:3000
echo.
echo Please wait a few seconds for servers to boot up.
echo ===================================================
pause
