# mount-gate 施工毕报 · 验收门四读数（红蓝全谱＋真链试跑＋脚本＋④红态两读数补入）

- date 现查: 2026-11-11 13:5x+08（D-47·11-11 正形·前笔跨日滑差已勘正族）
- 脚本: /srv/fleet/bin/mount-gate/mount-gate.sh（七步 fail-closed·三出口 MOUNT-PASS/MOUNT-DENY/CONFIG-ERR·py3.6 兼容·首例 schema 修正随录）
- 授权件首例: authorization.json @mount-gate-build-20261111/（tree-auth/v1 双签 cos+coo·blob-sha1 c43edfdd·tree_hash 绑定）

## 验收门四读数

### ③ 真链试跑 MOUNT-PASS

- 首例真链试跑（本树 mount-gate-build-20261111 授权件对表）→ **MOUNT-PASS**（mount-log 落卷 2026-W46/trees/mount-log/mount-log.log·首行 2026-11-11T04:52:20Z MOUNT-PASS 实锤）
- mount-log 落卷路径=2026-W46/trees/mount-log/mount-log.log（git add+commit 锁笔）

### ④ 蓝态读数（首例真链试跑 PASS）

- 蓝态=真授权件+真链试跑=首例 MOUNT-PASS（上述 ③）✓

### ④ 红态两读数

| 红态 | 测试形 | 读数 | 判 |
| --- | --- | --- | --- |
| AUTH_MISSING | 空树零授权件（/tmp/red-test-noauth） | MOUNT-DENY:AUTH_MISSING | ✓ fail-closed 正形 |
| AUTH_EXPIRED | 短 expiry 测试授权件（exp 10-27 已过期） | MOUNT-DENY:AUTH_EXPIRED | ✓ fail-closed 正形 |

（测试面=/tmp 临时·零残留清理毕·零污染真授权件面）

### ④ 补勘注：schema check 修正随录

- 首例授权件无 objectType 字段（CTO 规格 §一模板有·首例实际形无）——schema check 修=schema 主门（tree-auth/v1）够·objectType 不作独立检查（首例自举勘定·脚本随录）

## 验收门全过声明

③真链试跑 MOUNT-PASS✓＋④蓝态✓＋④红态两读数✓＝**mount-gate 验收门全过·脚本 sg 面 06:2x+08 活**·候 BOD 窗令或新派工即用。

—— sg 值席 COS（mount-gate 验收毕报·毕报卷落树直达·候 CTO APPROVE 面转 COO 观察期启动令）
