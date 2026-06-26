@echo off
setlocal EnableExtensions EnableDelayedExpansion

set "OUTPUT_DIR=%~dp0..\config"
set "OUTPUT_FILE=%OUTPUT_DIR%\admin.generated.json"

for /f %%A in ('powershell -NoProfile -Command "Get-Random -Minimum 10000 -Maximum 99999"') do set "RAND=%%A"
set "ADMIN_ID=ADM%RAND%"
set "ADMIN_NAME=Workshop Admin %RAND%"
set "USERNAME=admin%RAND%"
set "PASSWORD=GH-ADM-%RAND%"

if not exist "%OUTPUT_DIR%" mkdir "%OUTPUT_DIR%"

(
  echo {
  echo   "adminId": "%ADMIN_ID%",
  echo   "adminName": "%ADMIN_NAME%",
  echo   "username": "%USERNAME%",
  echo   "password": "%PASSWORD%"
  echo }
) > "%OUTPUT_FILE%"

echo Generated local admin credentials in %OUTPUT_FILE%
echo Username: %USERNAME%
echo Password: %PASSWORD%
endlocal
