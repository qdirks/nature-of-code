@echo off
@rem Run as administrator. Useful for allowing vscode terminal to have administrative priveleges, which is useful so that the newsketch command can be run from within vscode.

cd /d %~dp0
start /b code .

@REM Closing the command window after opening vscode with administrative privelege
@REM How to get the PID: https://serverfault.com/questions/126502/how-to-get-own-process-pid-from-the-command-prompt-in-windows
@REM Passing piped input to set variable: https://stackoverflow.com/questions/31839307/passing-on-piped-data-in-batch-file
@REM Setting the errorlevel to the PID: https://stackoverflow.com/questions/20892882/set-errorlevel-in-windows-batch-file
powershell (Get-WmiObject Win32_Process -Filter ProcessId=$PID).ParentProcessId | shared\errlvl
set pid=%errorlevel%
echo process id is: %pid%
taskkill /pid %pid%
exit /b