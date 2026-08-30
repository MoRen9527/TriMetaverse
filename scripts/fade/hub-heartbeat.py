#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""LG-014 件 2：中枢心跳 hook（CC Stop/PostToolUse 挂载）。

每次工具事件/回合结束 append 一行心跳到 .fade/hub/heartbeat.jsonl：
  {ts: ISO8601Z, last_tool: "<tool_name|Stop>", session_id: "..."}

数据边界（§2.7 探针原则，只写追加）：**不读会话正文**——仅消费 hook stdin 的
tool_name/session_id 元数据字段，payload 正文（tool_input/tool_response）不落盘。
会话死则心跳停——watchdog（件 3）据此判活。

设计约束：永不失败（异常吞掉 exit 0）——心跳故障不得反噬宿主会话。
py3.8 兼容（语法面）。自测：--self-test。
"""

import argparse
import json
import os
import sys
from datetime import datetime, timezone
from typing import Dict

HEARTBEAT_PATH = os.path.join(
    os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))),
    ".fade", "hub", "heartbeat.jsonl",
)


def utc_now_iso() -> str:
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def read_stdin_json() -> Dict:
    try:
        raw = sys.stdin.read()
        if not raw.strip():
            return {}
        obj = json.loads(raw)
        return obj if isinstance(obj, dict) else {}
    except Exception:
        return {}


def append_heartbeat(path: str, event: Dict) -> int:
    entry = {
        "ts": utc_now_iso(),
        "last_tool": str(event.get("tool_name") or event.get("hook_event_name") or "unknown"),
        "session_id": str(event.get("session_id") or ""),
    }
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "a", encoding="utf-8") as fh:
        fh.write(json.dumps(entry, ensure_ascii=False) + "\n")
    return 0


def self_test() -> int:
    import tempfile
    cases = 0
    failed = 0

    def check(name: str, cond: bool) -> None:
        nonlocal cases, failed
        cases += 1
        if not cond:
            failed += 1
            print("FAIL %s" % name)
        else:
            print("PASS %s" % name)

    tmp = tempfile.mkdtemp(prefix="hub-heartbeat-test-")
    hb = os.path.join(tmp, "heartbeat.jsonl")

    append_heartbeat(hb, {"tool_name": "Edit", "session_id": "sess-a"})
    append_heartbeat(hb, {"hook_event_name": "Stop", "session_id": "sess-a"})
    append_heartbeat(hb, {}, )  # 空 stdin 兜底
    with open(hb, "r", encoding="utf-8") as fh:
        rows = [json.loads(line) for line in fh if line.strip()]
    check("append-count", len(rows) == 3)
    check("tool-name-field", rows[0]["last_tool"] == "Edit")
    check("stop-fallback-event", rows[1]["last_tool"] == "Stop")
    check("empty-stdin-unknown", rows[2]["last_tool"] == "unknown")
    check("ts-format", rows[0]["ts"].endswith("Z") and len(rows[0]["ts"]) == 20)
    check("ts-monotonic-append", rows[0]["ts"] <= rows[2]["ts"])

    # 数据边界：正文不落盘
    append_heartbeat(hb, {"tool_name": "Bash", "session_id": "s",
                          "tool_input": {"command": "SECRET-CONTENT"}})
    with open(hb, "r", encoding="utf-8") as fh:
        body = fh.read()
    check("no-payload-on-disk", "SECRET-CONTENT" not in body)

    print("self-test: %d/%d PASS" % (cases - failed, cases))
    return 0 if failed == 0 else 1


def main() -> int:
    parser = argparse.ArgumentParser(description="Hub heartbeat hook (LG-014 item 2)")
    parser.add_argument("--path", default=HEARTBEAT_PATH)
    parser.add_argument("--self-test", action="store_true")
    args = parser.parse_args()
    if args.self_test:
        return self_test()
    try:
        event = read_stdin_json()
        append_heartbeat(args.path, event)
    except Exception:
        pass  # 心跳永不反噬宿主会话
    return 0


if __name__ == "__main__":
    sys.exit(main())
