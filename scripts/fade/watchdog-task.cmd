@echo off
rem LG-014 item 3 launcher: TriHubWatchdog scheduled task (every 5 min)
rem Runs as SYSTEM (session 0, no desktop) => zero console flash.
rem --projects-dir is explicit: SYSTEM's expanduser(~) does not resolve to jedih's profile.
"C:\Python312\python.exe" "D:\Code\ai\TriMetaverse\scripts\fade\hub-watchdog.py" --quiet --projects-dir "C:\Users\jedih\.claude\projects\D--Code-ai-TriMetaverse" > "D:\Code\ai\TriMetaverse\.fade\hub\watchdog-task.log" 2>&1
