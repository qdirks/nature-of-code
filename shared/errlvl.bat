@echo off
setlocal

if "%~1"=="" (
    set /p "input="
) else set "input=%*"

exit /b %input%