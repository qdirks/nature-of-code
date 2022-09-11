@echo off

@REM Detect if script has the required permissions
net session >nul 2>&1
if not %errorLevel% == 0 (
    echo Error: Retry running this script as administrator.
    exit /b %errorlevel%
)

@REM When running as administrator, a new cmd instance starts in a different directory
@REM Change to the same directory as this script
cd /d %~dp0

@REM Check for a command line argument passed to the batch script
if -%1-==-- (
    set /p __new_directory__="Enter sketch name: "
) else (
    set __new_directory__=%1
)
if -%__new_directory__%-==-- (
    echo Error: A sketch name was not specified.
    exit /b 1
)
xcopy /s /b /i template %__new_directory__%
cd %__new_directory__%

@REM Create the index.html file and insert the title of the project
type ..\shared\index1.html > index.html
echo.>> index.html
echo     ^<title^>%__new_directory__%^</title^>>> index.html
type ..\shared\index2.html >> index.html

gulp
