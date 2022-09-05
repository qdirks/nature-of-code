@echo off
@rem Run as administrator. Useful for allowing vscode terminal to have administrative priveleges, which is useful so that the newsketch command can be run from within vscode.

cd /d %~dp0
code .
exit /b