' trimodel-watchdog.vbs - headless wrapper for L1 watchdog (D-29: window style 0)
' NOTE: spawn powershell via "cmd /c" routing - direct WshShell.Run "powershell ..."
' drops silently in some wscript/task contexts (2026-09-26 L1 enable investigation,
' evidence: tmp-debug-l1 run, direct spawn empty vs cmd/c route resident pid=38480).
' stdout/stderr appended to hop log for forensics (normal operation writes nothing).
Dim sh
Set sh = CreateObject("WScript.Shell")
sh.Run "cmd /c powershell -NoProfile -NonInteractive -ExecutionPolicy Bypass -File ""D:\Code\ai\TriMetaverse\.fade\trimodel-watchdog.ps1"" >> ""D:\Code\ai\TriMetaverse\.fade\trimodel-watchdog-hop.log"" 2>&1", 0, False
