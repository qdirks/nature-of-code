@echo off
@rem Run as administrator. Useful for allowing vscode terminal to have administrative priveleges, which is useful so that the newsketch command can be run from within vscode.

cd /d %~dp0
start /b code .
@rem TODO: figure out how to run the batch script and have the cmd window automatically close after opening vscode
@rem Ideas: get the pid, and use taskkill on the pid
@rem some good answers here https://serverfault.com/questions/126502/how-to-get-own-process-pid-from-the-command-prompt-in-windows
@rem and here https://social.msdn.microsoft.com/Forums/en-US/270f0842-963d-4ed9-b27d-27957628004c/what-is-the-pid-of-the-current-cmdexe?forum=msbuild
exit