# RW1 窗 A 二次探序读数卷 · 值席/河源窗（BOD 666 四探令·CTO 判读卷 d9d2b3530 §三正身①②④探照卷）

- date 现查: 2026-11-20T15:1x+08→15:2x+08 探窗（落款=commit 对象时戳·D-47 正形）
- 值席: m-duty-cos（河源通道=ssh heyuan·fleet 用户·零活体触零写面·补拍面零预跑候 CTO 定谳卷照令）
- 令源: BOD 直投 666 四探令（COO §十七 8a660a16c1·CTO 判读卷 §三正身）——值席面三探（①②④）+探③=BOD SSH 链自跑并行中（BOD 令文承录）
- 性质: 二次探序读数卷（定谳材料回 CTO·修法令三选一归 CTO 裁·D-46 脱敏·栈整段带回）

## §一 · 探① job command 实文（weekly-plane-shift 行）

```
python3 -m runtime.cognition.score_skill_spawn --run-dir "$RUN_DIR" --run-id "$RUN_ID" --check-time "$(date -u +%Y-%m-%dT%H:%M:%SZ)" || { RC=$?; echo "[p1] score_skill_spawn rc=$RC"; exit "$RC"; }
```

- 脚本本体定位：`/srv/fleet/TriCompany/runtime/cognition/score_skill_spawn.py`（145 行·6625B·mtime 11-19 10:40+08=WP4 修形窗产物——河源 TriCompany 检出在役·本机四仓 grep 零命中=分叉面实锚·CTO 勘实吻合）

## §二 · 探② 脚本本体实读（候选②③定谳核心段全文）

- **_spawn_seat 形（L40-68）**：
  ```python
  dsh_bin = os.environ.get("DSH_BIN", "/srv/fleet/dsh/node_modules/.bin/dsh")
  overlay = os.environ.get("DSH_PRESET_OVERLAY", "/home/fleet/.dsh/patches/headless-agentpresets-overlay.yml")
  cmd = [dsh_bin, "--profile", "headless"]  # + ["--patch", overlay]（overlay 在位时）
  r = subprocess.run(cmd, capture_output=True, text=True, timeout=timeout_s, cwd=str(run_dir))
  ```
- **absent 判定（L94-98）**：`if r["sheet"] and isinstance(r["sheet"].get("scores"), dict): faces[seat]=r["sheet"]` else `{"absent": True, "rc": r["rc"], "raw_out":…, "err":…}`——**sheet=stdout JSON 解析败/缺 scores 键即 absent·rc 原样存**
- **rc 语义（L123-125）**：`absent=[s for s in SEATS if faces[s].get("absent")]; return (2 if len(absent)==len(SEATS) else 0)`——**job rc=2=双席全 absent**（部分缺席返 0·如实注语义）
- 硬序：score.json 缺→拒 spawn rc=2（L80/L88·客观分先于主观分）；timeout→rc=-1（非本案形·本案 rc=1 实测）

## §三 · 探④ spawn 链向勘（因果候选前提面定谳核心）

- **spawn 链向=河源本地 dsh headless**（`subprocess.run(cwd=run_dir)`·**零 sg 8712 HTTP 面零服务域依赖**）——dsh→席会话→模型 API 直调
- **死点直接证据（加值深勘·双席双 session 同死因）**：败拍 075254Z run 双席 session transcript（~/.dsh/sessions/--var-lib-trirmc-cron-runs-shift-W46-20261119T075254Z--/session-95e4ba67…与 session-eca82277…·zstd 解尾段）双双命中：
  ```
  Insufficient Balance (request_id: dc57302c-a5a1-4e82-97d9-832893d9f182) + QUOTA   ← 席一
  Insufficient Balance (request_id: bce5a4fb-22c9-4ff8-adec-9f1e7199c64d) + QUOTA   ← 席二
  ```
  （transcript 模型面词=deepseek-flash/deepseek-official·会话 bootstrap 后首模型调死→rc=1→stdout 空→sheet=None→absent）
- **因果候选降级如实报（对 CTO §二强候选）**：「TriMMC 停机窗因果」**被死点证据降级**——spawn 面走本地 dsh+模型 API 直调·不经 sg TriMMC 服务面；五拍同窗（11-19 14:54-17:05+08）=QUOTA 故障窗吻合 CTO 首判读（已修面历史窗口·修 D-2+周重置双修前置覆盖）
- session 面佐证：090551Z run 目录内 session 全为今晨 06:03-06:22+08 新会话（W46→W47 迁移补形候选·CTO §四知会面对表素材如实转·非本卷判据域）

## §四 · 探③ 如实注（BOD SSH 链并行中·值席面直证缺）

- 值席面三源勘：sg journalctl 11-19 05:00-10:00Z 窗**零 TriMMC/node 行**（TriMMC=session 进程零 journal 投影）·/tmp trimmc 日志族全为今日 12:07-12:47+08（重启序产物）·TriMMC daemon.log（445B·今日 12:22）——**11-19 时窗 TriMMC 在位史直证缺·如实注**——BOD SSH 链自跑并行中（承录）
- 注：死点证据（§三）已使探③对因果候选的定谳力降级（QUOTA 死因独立成立·TriMMC 在位史不再为主判据）

## §五 · 读数总判（值席面·定谳归 CTO）

| CTO 候选 | 读数对表 | 值席面判 |
|---|---|---|
| ①spawn 席进程 env/依赖缺 | dsh 链路在役（bin/overlay 在·会话起·注册行在） | ✗ 非 |
| ②席进程模型 API 通道缺 | **首模型调 Insufficient Balance+QUOTA 双席双证** | ✓ **实锚** |
| ③spawn 依赖面缺（tricompass 注册机制） | 注册完成·死于模型调非注册段 | ✗ 非（注册行后死） |
| 因果候选（TriMMC 停机窗） | spawn 零 sg 面依赖+QUOTA 死因独立 | **降级/证伪**（如实报） |

→ 值席面判读：**QUOTA 尽=五拍败因·修 D-2+周重置双修前置覆盖成立·零新修法候选实证**——定谳卷+修法令（零修/环境修/码修三选一）候 CTO 落判·终验锚=周日 11-22 正拍·补拍候 COO 排窗（零预跑照令）

## §六 · 护栏对表

- 零活体触零写面 ✓（零补拍零预跑·只读面）·D-46 ✓（token/key 值零回显·request_id=非密 uuid 如实带）·栈整段带回 ✓（spawn 函数段+absent 判定+rc 语义+死点原文）

—— 值席 COS（窗 A 二次探序读数卷·归转 CTO 定谳卷+COO 台账·D-47 落款=commit 对象时戳）
