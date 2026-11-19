# -*- coding: utf-8 -*-
"""W2-d 预勘：TriMLC cron.db.json 只读扫描（job 族值面概览+快照对照基线）
SDE 小布 2026-11-20 · D-46: token 值面零回显（本扫描只读结构性字段，cmd 字段不打印全文）
"""
import json
import sys

sys.stdout.reconfigure(encoding="utf-8")

SRC = r"C:/Users/jedih/AppData/Local/trilc-channel/cron.db.json"

d = json.load(open(SRC, encoding="utf-8"))
print("top type:", type(d).__name__, "| len:", len(d))
jobs = [x for x in d if isinstance(x, dict)]
print("dict count:", len(jobs))
print()

for j in jobs:
    raw_state = j.get("state")
    if isinstance(raw_state, str):
        try:
            st = json.loads(raw_state)
            state_form = f"str->parsed({type(st).__name__})"
        except (ValueError, TypeError):
            st = {}
            state_form = f"str-unparseable({raw_state[:40]!r})"
    elif isinstance(raw_state, dict):
        st = raw_state
        state_form = "dict-inline"
    else:
        st = {}
        state_form = f"{type(raw_state).__name__}({raw_state!r})"
    jid = j.get("id")
    name = j.get("name")
    enabled = j.get("enabled")
    sched = j.get("schedule")
    cmd = j.get("command") or ""
    has_cmd_key = "command" in j
    ce = st.get("consecutiveFailures") if isinstance(st, dict) else None
    nxt = st.get("nextRunAtMs") if isinstance(st, dict) else None
    lastrun = st.get("lastRunStatus") if isinstance(st, dict) else None
    lastrun_at = j.get("lastRunAt")
    run_count = j.get("runCount")
    err_count = j.get("errorCount")
    top_lastrun_status = j.get("lastRunStatus")
    top_next = j.get("nextRunAt")
    print(f"id={jid!r} name={name!r}")
    print(f"  enabled={enabled} schedule={sched!r}")
    print(f"  command_key_present={has_cmd_key} cmd_len={len(cmd)} cmd_head={cmd[:60]!r}")
    print(f"  state_field[{state_form}]: {raw_state!r}" if not isinstance(raw_state, dict) else f"  state_field[dict]: ce={ce} next={nxt}")
    print(f"  top-level: lastRunAt={lastrun_at!r} lastRunStatus={top_lastrun_status!r} nextRunAt={top_next!r} runCount={run_count} errorCount={err_count}")
    print()

# D-46 断言：扫描输出不含 token 形态值（结构性字段零值面外泄）
print("[D-46] cmd 字段仅 head60 截断展示；token 类键零打印")
