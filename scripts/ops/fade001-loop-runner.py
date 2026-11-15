#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
fade001-loop-runner.py — fade-001 自进化 loop 自动轮次 runner（r89 架构令·SDE 主刀）
真源=TriMetaverse scripts/ops/（D-30 先源后部）·部署位=/srv/fleet/fade001-loop-runner/（sg 侧）

循环体五步（每轮）：
  1. POST run 触发（{"force":true} 通道正形·-m 240·触发时刻现查锚）
  2. 候 run_dir 终态（manifest run_state=ok 轮询·cap 300s）
  3. 读三域分数+verdict（score.json machine/collection/subjective）
  4. 落轮记录 json 台账（轮次/run_dir/三域分/verdict/锚自检/毕报指针）
  5. 机械分叉四条件判定 → 下一轮（间隔 ≥2min）或停机

机械分叉四条件（写死）：
  A. verdict 非 pass 或锚自检漂移 → 停机+告警（回退至轮起点锚候人工令——恢复禁自主 r76④）
  B. 23:30 北京冻结闸 → 冻结最优形收口停机
  C. 联审 OK 卷在位（TMV deploy 树 loop-ok*.md）→ loop 关停机
  D. 8 轮封顶（防失控保险丝）→ 停机

护栏三写死：零 payload 触（全程 GET/POST run API 面）+cron 机械锚零动断言每轮自检
（enabled=False/next=1794757800000/payload len=2750 md5=4e1c7df5…漂移即停告警）+R2 断言族每轮自检+轮间隔 2min。

起跑接续：第 4 轮起（前 3 轮人工编排·轮次号接续防混）。
联审不在脚本内（agent 异步旁路·值席按轮召集）。
"""
import json, subprocess, time, hashlib, os, sys, glob
from datetime import datetime, timezone, timedelta

RHY = "R-HY"
JOB_ID = "9c81c7ec-ed76-4489-98c0-81c6601f541b"
RUNS = "/var/lib/trirmc/cron/runs"
ROUND_START = 4
ROUND_CAP = 8
INTERVAL_S = 120
FREEZE_GATE_MIN = 23 * 60 + 30  # 北京 23:30 → 当日分钟数
LEDGER_DIR = "/srv/fleet/fade001-loop-runner"
LEDGER = LEDGER_DIR + "/loop-ledger.json"
STATE = LEDGER_DIR + "/runner-state.json"
LOG = LEDGER_DIR + "/runner.log"
TMV_TREE = "/srv/fleet/TriMetaverse/docs/workflow/operating-records/2026-W46/trees/fade001-tenstage-deploy-20261115"
# 机械锚（漂移即停）
ANCHOR = {"len": 2750, "md5": "4e1c7df5c78e083a77a0be7f2a371672",
          "next": 1794757800000, "enabled": False, "jobcount": 4}
TOK_CMD = ("cat /proc/$(systemctl show trirmc -p MainPID --value)/environ "
           "| tr '\\0' '\\n' | grep '^TRIRMC_INTERNAL_TOKEN=' | cut -d= -f2-")

def log(msg):
    line = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ") + " [runner] " + msg
    print(line, flush=True)
    with open(LOG, "a") as f: f.write(line + "\n")

def ssh(cmd, timeout=280):
    # python3.6 兼容（sg 系统 python=3.6·capture_output 参数 3.7+ 才有）
    # 根修（崩溃修令①）：PIPE 返回 bytes——统一 decode 为 str 返回（bytes/str 类型错根因消灭）
    r = subprocess.run(["ssh", "-o", "BatchMode=yes", "-o", "ConnectTimeout=10", RHY, cmd],
                       stdout=subprocess.PIPE, stderr=subprocess.PIPE,
                       timeout=timeout)
    return subprocess.CompletedProcess(r.args, r.returncode,
                                       r.stdout.decode("utf-8", "replace"),
                                       r.stderr.decode("utf-8", "replace"))

def remote_json(py_src, curl_cmd, timeout=90):
    # base64 干净传码+远端临时件零残留（三层引号嵌套规避）
    import base64
    b64 = base64.b64encode(py_src.encode()).decode()
    cmd = (curl_cmd + ' > /tmp/lr-$$.json && echo ' + b64 +
           ' | base64 -d | python3 - /tmp/lr-$$.json; RC=$?; rm -f /tmp/lr-$$.json; exit $RC')
    r = ssh(cmd, timeout=timeout)
    if r.returncode != 0:
        raise RuntimeError("remote fail rc=%d %s" % (r.returncode, (r.stderr or r.stdout)[:180]))
    return json.loads(r.stdout)

CURL_JOBS = ('TOK=$(' + TOK_CMD + '); curl -s -m 8 -H "X-Internal-Token: $TOK" '
             'http://localhost:8710/internal/v1/cron/jobs')
CURL_HEALTH = 'curl -s -m 8 http://localhost:8710/healthz'

# ── 护栏：cron 机械锚零动断言（每轮自检·漂移即停）──
def anchor_check():
    py = ('import json,sys,hashlib\n'
          'jobs=json.load(open(sys.argv[1]))\n'
          'js=[j for j in (jobs if isinstance(jobs,list) else jobs.get("jobs",[])) if "plane-shift" in j.get("name","")]\n'
          'j=js[0];c=j["payload"]["command"];s=j.get("state",{})\n'
          'print(json.dumps({"len":len(c),"md5":hashlib.md5(c.encode()).hexdigest(),'
          '"next":s.get("nextRunAtMs"),"enabled":j.get("enabled"),"runCount":s.get("runCount")}))')
    d = remote_json(py, CURL_JOBS)
    bad = []
    if d["len"] != ANCHOR["len"]: bad.append("payload len 漂移 %s" % d["len"])
    if d["md5"] != ANCHOR["md5"]: bad.append("payload md5 漂移")
    if d["next"] != ANCHOR["next"]: bad.append("nextRunAtMs 漂移 %s" % d["next"])
    if d["enabled"] is not ANCHOR["enabled"]: bad.append("enabled 漂移 %s" % d["enabled"])
    return d, bad

def r2_check():
    py = ('import json,sys\n'
          'h=json.load(open(sys.argv[1]))\n'
          'print(json.dumps(h))')
    h = remote_json(py, CURL_HEALTH)
    bad = []
    if not h.get("ok"): bad.append("healthz ok!=true")
    if h.get("cron", {}).get("jobCount") != ANCHOR["jobcount"]: bad.append("jobCount 漂移")
    if h.get("cron", {}).get("degraded"): bad.append("degraded=true")
    return h, bad

def latest_run_dir(prev):
    r = ssh('ls -1t %s | head -1' % RUNS)
    d = r.stdout.strip()
    return d if d != prev and d.startswith("shift-WW46-2026") else None

def trigger():
    ts = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    r = ssh('TOK=$(' + TOK_CMD + '); curl -s -m 240 -X POST -H "X-Internal-Token: $TOK" '
            '-H "content-type: application/json" -d \'{"force": true}\' '
            'http://localhost:8710/internal/v1/cron/jobs/%s/run' % JOB_ID, timeout=280)
    return ts, r.stdout.strip(), r.returncode

def wait_run_dir(prev, cap_s=300):
    t0 = time.time()
    while time.time() - t0 < cap_s:
        d = latest_run_dir(prev)
        if d:
            for _ in range(50):
                r = ssh('cat %s/%s/manifest.json 2>/dev/null' % (RUNS, d))
                if r.returncode == 0 and r.stdout.strip():
                    try:
                        if json.loads(r.stdout).get("run_state") == "ok":
                            return d
                    except Exception: pass
                time.sleep(6)
            return d  # cap 到·dir 在但未 ok——上层按读数判
        time.sleep(6)
    return None

def read_scores(d):
    py = ('import json,sys\n'
          'D="%s/%s"\n'
          's=json.load(open(D+"/score.json"));sc=s.get("score") or {}\n'
          'm=json.load(open(D+"/manifest.json"))\n'
          'print(json.dumps({"verdict":s.get("verdict"),"engine":s.get("engine_state"),'
          '"total":sc.get("total_score"),"breakdown":sc.get("domain_breakdown"),'
          '"run_state":m.get("run_state"),"run_id":m.get("run_id")}))' % (RUNS, d))
    return remote_json(py, "true")

def evidence_check(d):
    py = ('import json,sys\n'
          'D="%s/%s"\n'
          'c=json.load(open(D+"/close.json"))\n'
          'ev=c.get("evidence")\n'
          'print(json.dumps({"ev":ev is not None,"n":len(ev) if ev else 0}))' % (RUNS, d))
    return remote_json(py, "true")

def ok_roll_present():
    # 联审 OK 卷在位检测（fetch 后 glob deploy 树 loop-ok*.md）
    try:
        subprocess.run(["git", "-C", "/srv/fleet/TriMetaverse", "fetch", "origin", "dev"],
                       stdout=subprocess.PIPE, stderr=subprocess.PIPE, timeout=60)
    except Exception as e:
        log("fetch 异常（联审卷检测降级 glob 本地）: %s" % e)
    return bool(glob.glob(TMV_TREE + "/loop-ok*.md"))

def freeze_gate_hit():
    now = datetime.now(timezone(timedelta(hours=8)))
    return now.hour * 60 + now.minute >= FREEZE_GATE_MIN

def main():
    os.makedirs(LEDGER_DIR, exist_ok=True)
    state = {"round": ROUND_START - 1, "status": "init"}
    if os.path.exists(STATE):
        state = json.load(open(STATE))
    ledger = json.load(open(LEDGER)) if os.path.exists(LEDGER) else {"rounds": []}

    log("runner 启动·接续轮次=%d（cap=%d）" % (state["round"] + 1, ROUND_CAP))

    while True:
        rnd = state["round"] + 1
        # 分叉 D：8 轮封顶
        if rnd > ROUND_CAP:
            log("STOP：8 轮封顶（防失控保险丝）"); state["status"] = "capped"; break
        # 分叉 B：23:30 北京冻结闸
        if freeze_gate_hit():
            log("STOP：23:30 冻结闸（北京）——冻结最优形收口"); state["status"] = "freeze-gate"; break
        # 分叉 C：联审 OK 卷在位
        if ok_roll_present():
            log("STOP：联审 OK 卷在位（loop 关）"); state["status"] = "loop-ok"; break

        log("── 第 %d 轮开始 ──" % rnd)
        rec = {"round": rnd}

        # 护栏自检（触发前）
        d0, bad0 = anchor_check()
        if bad0: log("STOP：触发前锚漂移——" + "; ".join(bad0)); state["status"] = "anchor-drift-pre"; rec["stop"] = bad0; break
        h0, hb0 = r2_check()
        if hb0: log("STOP：触发前 R2 红——" + "; ".join(hb0)); state["status"] = "r2-red-pre"; rec["stop"] = hb0; break

        prev_dir = ssh('ls -1t %s | head -1' % RUNS).stdout.strip()
        ts, resp, rc = trigger()
        rec["trigger_at"] = ts; rec["trigger_resp"] = resp[:120]
        log("触发 %s resp=%s" % (ts, resp[:80]))
        # 崩溃修令①：dict 判定形（原字串查形 bytes/str TypeError 根因点·同族全勘根修覆盖）
        try:
            data = json.loads(resp)
        except Exception:
            log("STOP：触发响应非 JSON（%s）" % resp[:80]); state["status"] = "trigger-badresp"; rec["stop"] = "badresp"; break
        if not (isinstance(data, dict) and data.get("ran") is True):
            log("STOP：触发未受理（ran!=true·reason=%s）" % data.get("reason")); state["status"] = "trigger-fail"; rec["stop"] = "trigger"; break

        d = wait_run_dir(prev_dir)
        if not d:
            log("STOP：run_dir 终态候超（cap 300s）"); state["status"] = "run-timeout"; rec["stop"] = "timeout"; break
        rec["run_dir"] = d

        sc = read_scores(d)
        rec.update({"verdict": sc.get("verdict"), "engine": sc.get("engine_state"),
                    "total": sc.get("total"), "breakdown": sc.get("breakdown"),
                    "run_state": sc.get("run_state")})
        log("分数 verdict=%s breakdown=%s" % (sc.get("verdict"), sc.get("breakdown")))

        ev = evidence_check(d)
        rec["evidence_anchor_n"] = ev.get("n")

        # 护栏自检（跑毕后）
        d1, bad1 = anchor_check()
        h1, hb1 = r2_check()
        rec["anchor_post"] = d1; rec["r2_post"] = h1.get("cron")
        drift = bad1 + hb1
        if drift:
            log("STOP：跑毕后锚/R2 漂移——" + "; ".join(drift))
            state["status"] = "anchor-drift-post"; rec["stop"] = drift
            ledger["rounds"].append(rec); break

        ledger["rounds"].append(rec)
        json.dump(ledger, open(LEDGER, "w"), ensure_ascii=False, indent=1)
        state["round"] = rnd
        json.dump(state, open(STATE, "w"))

        # 分叉 A：verdict 非 pass（顶层）→ 停+回退候人工令（恢复禁自主）
        if sc.get("verdict") != "pass":
            log("STOP：verdict=%s 非 pass——停机·回退至轮起点锚候人工令（r76④ 恢复禁自主）" % sc.get("verdict"))
            state["status"] = "verdict-fail"; break

        log("第 %d 轮毕·间隔 %ds" % (rnd, INTERVAL_S))
        time.sleep(INTERVAL_S)

    json.dump(state, open(STATE, "w"))
    json.dump(ledger, open(LEDGER, "w"), ensure_ascii=False, indent=1)
    log("runner 停机·status=%s·round=%d" % (state.get("status"), state.get("round")))

if __name__ == "__main__":
    if "--run" in sys.argv:
        main()
    elif "--check" in sys.argv:
        # 只读自检模式（STE 机械面复验用·零触发零写面）
        d, bad = anchor_check()
        print("锚自检:", json.dumps(d), "漂移=", bad or "无")
        h, hb = r2_check()
        print("R2 自检:", json.dumps(h.get("cron")), "红=", hb or "无")
        print("联审 OK 卷在位=", ok_roll_present())
        print("冻结闸命中=", freeze_gate_hit())
    else:
        print("用法：fade001-loop-runner.py --run（实跑轮次）｜--check（只读自检·零触发）")
        print("防护：无参拒启 main（误触发教训 2026-11-15T14:15Z·argparse 防护增补）")
        sys.exit(0)
