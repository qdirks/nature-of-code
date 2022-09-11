@echo off
call gulp
:loop
call gulp reconnect
goto :loop