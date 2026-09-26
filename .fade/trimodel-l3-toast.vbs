' trimodel-l3-toast.vbs - headless wrapper for L3 toast (D-29: window style 0)
' NOTE: spawn powershell via "cmd /c" routing - direct WshShell.Run "powershell ..."
' drops silently in some wscript/task contexts (2026-09-26 L1 investigation, same-family fix).
Dim sh
Set sh = CreateObject("WScript.Shell")
sh.Run "cmd /c powershell -NoProfile -ExecutionPolicy Bypass -File ""D:\Code\ai\TriMetaverse\.fade\trimodel-l3-toast.ps1"" >> ""D:\Code\ai\TriMetaverse\.fade\trimodel-l3-hop.log"" 2>&1", 0, False
