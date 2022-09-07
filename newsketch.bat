@echo off

@REM When running as administrator, a new cmd instance starts in a different directory
@REM Change to the same directory as this script
cd /d %~dp0

@REM Check for a command line argument passed to the batch script
if -%1-==-- (
    echo A sketch project name was not specified. Closing the creation process...
    exit /b
) else (
    xcopy /s /b /i template %1
)

@REM Create the index.html file and insert the title of the project
cd %1
type ..\shared\index1.html > index.html
echo.>> index.html
echo     ^<title^>%1^</title^>>> index.html
type ..\shared\index2.html >> index.html

gulp