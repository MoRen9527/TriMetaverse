from __future__ import annotations

import json
import os
import subprocess
import sys
from pathlib import Path
from typing import Any


DEBUG_ENABLED = os.environ.get("TRICOMPANY_COGNITION_HOOK_DEBUG") == "1"


def _emit(system_message: str | None = None) -> int:
    payload: dict[str, Any] = {"continue": True}
    if system_message:
        payload["systemMessage"] = system_message
    print(json.dumps(payload, ensure_ascii=False))
    return 0


def _extract_command_text(tool_input: Any) -> str:
    if isinstance(tool_input, str):
        return tool_input
    if not isinstance(tool_input, dict):
        return ""

    for key in ("commandLine", "command", "text"):
        value = tool_input.get(key)
        if isinstance(value, str) and value.strip():
            return value

    args = tool_input.get("args")
    if isinstance(args, list):
        return " ".join(str(item) for item in args)
    return ""


def _main() -> int:
    try:
        hook_input = json.load(sys.stdin)
    except json.JSONDecodeError:
        return _emit("hook debug: failed to decode stdin JSON") if DEBUG_ENABLED else _emit()

    tool_name = str(hook_input.get("tool_name") or "").strip().lower()
    if "runinterminal" not in tool_name and "run_in_terminal" not in tool_name:
        return _emit(f"hook debug: unsupported tool_name {tool_name}") if DEBUG_ENABLED else _emit()

    command_text = _extract_command_text(hook_input.get("tool_input")).strip()
    if not command_text:
        return _emit("hook debug: command text missing from tool_input") if DEBUG_ENABLED else _emit()

    normalized_command = command_text.lower()
    if "chief_of_staff_workflow_bridge" not in normalized_command:
        return _emit(f"hook debug: ignored non-workflow command {command_text}") if DEBUG_ENABLED else _emit()
    if "sync-memory" in normalized_command:
        return _emit("hook debug: ignored sync-memory to avoid recursion") if DEBUG_ENABLED else _emit()
    if not any(token in normalized_command for token in ("meeting-start", "meeting-end", "daily-close")):
        return _emit(f"hook debug: workflow command missing target token {command_text}") if DEBUG_ENABLED else _emit()

    repo_root = Path(
        os.environ.get("TRIMETAVERSE_REPO_ROOT")
        or Path(__file__).resolve().parents[2]
    )
    support_root = Path(
        os.environ.get("TRICOMPANY_COGNITION_SUPPORT_ROOT")
        or repo_root / "TriCompany-copilot-host-assets"
    )
    storage_root = os.environ.get("TRICOMPANY_COGNITION_STORAGE_ROOT")

    if not support_root.exists():
        return _emit(
            f"chief-of-staff workflow hook skipped: support root not found at {support_root}"
        )

    sync_command = [
        sys.executable or "python",
        "-m",
        "runtime.cognition.chief_of_staff_workflow_bridge",
        "--workspace-root",
        str(repo_root),
    ]
    if storage_root:
        sync_command.extend(["--storage-root", storage_root])
    sync_command.append("sync-memory")

    result = subprocess.run(
        sync_command,
        cwd=support_root,
        capture_output=True,
        text=True,
        encoding="utf-8",
    )
    sync_stdout = (result.stdout or "").strip()
    parsed_stdout: dict[str, Any] | None = None
    if sync_stdout:
        try:
            parsed_stdout = json.loads(sync_stdout)
        except json.JSONDecodeError:
            parsed_stdout = None

    if result.returncode == 0 and parsed_stdout and parsed_stdout.get("exported"):
        return _emit(
            "chief-of-staff workflow bridge auto-synced repo memory after workflow writeback"
        )

    error_output = (
        result.stderr
        or result.stdout
        or "unknown sync error"
    ).strip()
    return _emit(
        f"chief-of-staff workflow hook could not run sync-memory: {error_output}"
    )


if __name__ == "__main__":
    raise SystemExit(_main())