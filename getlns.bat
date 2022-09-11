@echo off

if -%1-==-- (
    echo Error: Expected command line parameter not found.
    exit /b
)

echo @echo off> names.bat
echo.>> names.bat
dir /s /al /b | find "%1" >> names.bat
