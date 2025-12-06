@echo off
echo Setting up Sports Stock Exchange Environment...

echo.
echo ===================================================
echo 1. Setting up Backend (Python)
echo ===================================================
cd backend

:: Check if python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Python is not installed or not in PATH.
    pause
    exit /b
)

:: Create venv if it doesn't exist
if not exist venv (
    echo Creating virtual environment...
    python -m venv venv
) else (
    echo Virtual environment already exists.
)

:: Activate and install
echo Activating virtual environment and installing dependencies...
call venv\Scripts\activate
pip install -r requirements.txt

:: Initialize DB
if not exist sports_stock.db (
    echo Initializing database...
    python seed_db.py
)

cd ..

echo.
echo ===================================================
echo 2. Setting up Frontend (Node.js)
echo ===================================================

:: Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Node.js/npm is not installed or not in PATH.
    pause
    exit /b
)

echo Installing Node modules (this might take a minute)...
npm install

echo.
echo ===================================================
echo SETUP COMPLETE!
echo ===================================================
echo.
echo You can now run 'start_app.bat' to launch the website!
pause
