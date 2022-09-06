@echo off

@REM Change to this directory
cd /d %~dp0

@REM Start code and have the cmd window close afterwards
echo | code . | exit