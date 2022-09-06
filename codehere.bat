@echo off

@REM When running as administrator, the prompt starts at C:\WINDOWS\system32
@REM Change to the directory of this batch script
cd /d %~dp0

@REM start code in a manner that allows the window to close afterwards
echo | code . | exit

@REM You can run more commands here if needed...
@REM No more commands? The window closes very quickly.