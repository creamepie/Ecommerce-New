@echo off

:: Get the directory of the current batch file
SET BASE_DIR=%~dp0

:: Start Backend (Ensure it runs on port 5000)
start cmd /k "cd /d %BASE_DIR%ecommerce-backend && node server.js"

:: Start Frontend (Ensure it runs on port 3000)
start cmd /k "cd /d %BASE_DIR%frontend && npm start"

echo Backend is running on http://localhost:5000
echo Frontend is running on http://localhost:3000
echo ensure mongoDB is running and link is default(mongodb://localhost:27017)
pause
