@echo off
rem LG-014 item 3 launcher: TriHubWatchdog scheduled task (every 5 min)
rem Thin wrapper avoids schtasks /TR quote-nesting; logs stdout+stderr for diagnosis.
"C:\Python312\python.exe" "D:\Code\ai\TriMetaverse\scripts\fade\hub-watchdog.py" --quiet > "D:\Code\ai\TriMetaverse\.fade\hub\watchdog-task.log" 2>&1
