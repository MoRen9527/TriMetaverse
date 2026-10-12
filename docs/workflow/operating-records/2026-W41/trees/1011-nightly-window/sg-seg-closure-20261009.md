# sg 段闭卷 · TriMMC 8712 两锚修复部署（10-11 深夜窗·sg 值席带）

- 执行位: sg duty 值席；窗框 22:30-01:00 硬锚（BOD 22:43 直派·窗偏 13 分=触发缺口第四起候 10-10 联审）
- **段态: 闭（CTO 技术判读采信 23:1x）**·毕报两刻已达（COO/CTO）
- 施工正形: TriCompany agent-core @1713614（锚 1 stale 守卫＋锚 2 settle 兜底）＋交接要点 @39c2fba4

## 部署读数终态

| 项 | 读数 | 判 |
|---|---|---|
| 门禁第四条 | 10 job 全谱最大 timeoutMs=180000（3min）；四 job 显式（180000/90000/60000/30000）＋六 job ∅=DEFAULT 10min——零超 10min | ✓ DEFAULT 20min 免调免重 build |
| build | 独立工作树（/srv/fleet/TriCompany-sgb-deploy·sg bare 分支 fsd-sgb-fix-20261009@1713614）node22 tsc 0 错＋test:scheduler 69/0 | ✓ |
| 部署形 | node_modules symlink 外科重链（file: 重链手术形·TriCompany 主树零触）；BOD 复合块 stop/注入/start | ✓ 新 PID 1959958／TS 22:55:33 CST＞施工时点 |
| 调度活 | 重启后四笔新 fire log（23:00 daily-progress-watcher/23:02/23:03/23:05 sg-watchlist-patrol CST）＋healthz jobCount=10 degraded=false consecutiveFailures=0 | ✓ 铁证 |
| 探针清退 | API DELETE（TRIMC_INTERNAL_TOKEN 服务端取用·65 长断言零回显）→removed:true·jobCount 10 复位 | ✓ |

## 验证面判读（CTO 裁采信）

- stale-guard live 孤证未立＝boot 清（service.ts:102·jobs.json mtime 22:55:34.58 实锚）于首 tick 前消费 stale mark——设计使然混淆源非缺陷。
- 守卫行为学证据＝G1 单测四案（在库）；**live 形态裁：不排专用挂起窗**（YAGNI·向生产调度面注入 20min 停滞=风险收益不对称）——两路随线候窗：①自然 stale 复现按四证法留痕搭车；②维护窗测试 worktree 影子短 staleRunningMs 受控验证（非生产面）。
- 挂账：修复分级①②（skip 埋点＋空壳检出）候排窗＝COO 面知悉。

## 纪律与插曲

- token 值面零回显（sed 提取＋长度断言形两用：R-HY 掩形/本机取用）；备份锚先行（jobs.json @20261009T144921Z＋symlink 回拨锚＋旧 dist 未触）；零滑步零超锚。
- 插曲自领两笔（入册素材·CTO 确认）：①`--dry` 旗标未实现致注入早序（幂等复原位零损——教训=旗标须实现或删·禁假 dry）；②R-4 卷 sudoers `-l` 免密/索密两态判据（有 NOPASSWD 条目则 -l 免密显形·撤净转索密）＋读数禁预限行数（head -3 自盲教训）。

—— sg 值席 COS，2026-10-09 23:1x +0800（段闭·候本机 FSD 带毕后窗收口毕报 BOD）
