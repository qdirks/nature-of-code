@echo off
@rem Create a new sketch from template. Must be run as administrator in order to copy symbolic links.

cd /d %~dp0
set /p fname="New Sketch Name: "
xcopy /s /b /i template %fname%