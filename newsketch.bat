@echo off
@rem Create a new sketch from template. Must be run as administrator in order to copy symbolic links.

cd /d %~dp0
setlocal
set fname=""
set /p fname="New Sketch Name: "
if %fname%=="" (
    echo A sketch project name was not specified. Closing the creation process...
) else (
    xcopy /s /b /i template %fname%
)