# S2 任务书候批稿：wp-cli python 骨架（FADE-012 首单·最后一次手工立单）

- sourceOfTruth: 本文件（候批稿·CEO 晨批前不入任务书面——D-39 纯净性：候裁件留候裁面）
- syncMode: manual
- lastSyncedAt: 2026-10-23
- 拟单: BOD 2026-10-23 晚（CEO 19:33:20 令「今晚拟好 S2 任务书候我晨批」）
- 定稿去向: CEO 晨批后 → COS 于 10-24 首窗执行 wp charter-create 正式立单（CLI 未生前首次手工代行·此后全走新链）

---

## charter 对象（按设计稿 §3.2 schema 拟）

```json
{
  "id": "CH-20261024-001-wpcli",
  "title": "wp-cli python 骨架——周平面三级体系 CLI 最小集（S2）",
  "origin": {
    "ceoOrders": [
      "2026-10-23 10:34:07 整顿令四条（任务进度大表给人看/取消排窗段·任务书拆树串行/重整周平面迁移/COO 派工树链显式+节点报告）",
      "2026-10-23 10:48:47 架构勘正+程序先行原则（树跟任务书走任务书跟周走·FADE 规范 CLI 工作流）",
      "2026-10-23 18:36:43 V3 重审通过·按批改进 S2",
      "2026-10-23 19:33:20 同意明早起链·今晚拟任务书候晨批"
    ],
    "bodRelayAnchor": "bod-rduty 卷 §七十三（9dc9220c5）/§七十四（3e033ca67）/§七十五（本稿落卷 commit）",
    "designDoc": "docs/execution/weekly-plane-charter-tree-redesign-20261023.md（V3.1）"
  },
  "carriedFrom": null,
  "carryCount": 0,
  "status": "open（候批·晨批后 charter-create 时置 open 生效）",
  "priority": "high",
  "order": 1,
  "owner": "COS（起链）",
  "roles": ["cos", "cto", "fsd", "ste"]
}
```

- roles=参与本单的团队成员席别名单（**COO 定组队**·本单 BOD 代拟随批确认）；任务书整体**不走树不走链**——顺序调度在任务树层，由 COS 盯（CEO 2026-10-23 21:01 勘正）。选 roles 不选 employees：任务书排席别角色，具名人员归 staffing 面。

## 树拆分（串行 seq·任务书内严格串行）

### t1 基座（seq 1）：wp 包骨架 + wp.json schema V2 读写核

- python 包骨架（`wp/` 包·入口 `wp` 命令+`weekplane` 别名·解释器正形 `python` 3.12）
- wp.json schema V2 载荷类：load/validate（五条硬规则校验器）/save（原子写 os.replace+回读断言）
- 命令：`wp init`（新周账本初始化）、`wp status`（按 active 定位现势周·全库至多一 active 断言）、`wp check`（账实比对·planeFiles 状态断言）
- 任务树：cos（开树派工）→ cto（架构约束下发的骨架评审）→ fsd（实现+白盒自测）→ ste（门禁验证）→ cos（收口闭树）
- 每节点树文件夹留执行报告（node-reports/NN-<席>-<slug>.md）

### t2 渲染器（seq 2）：大表+平面状态 render（只读·账本 hash 不变证明）

- `wp render`：账本 → task-inventory-日期.md（人看·沿用传统名）+ plane-status.md（机器辅助视图）
- 只读自证：render 前后账本文件 hash 断言不变
- 任务树：cos（开树派工）→ cto → fsd → ste → cos（收口闭树）

### t3 迁移引擎（seq 3）：wp migrate（FADE-011 固化流程的程序体）

- 对表断言：上周末毕清单 == 新周 carryIn 清单（差一件 FAIL 不落账·agent 兜底勘因出口）
- 三类清单执行（§2.2）：整本平移（git mv）/滚动平移/快照新建+周级表
- 旧周降 inactive（快照一字不改）+ plane-shift-log.md 迁移卷自动写（迁出迁入清单+时点+断言读数）
- 新周 render 联动+wp check 收口
- 任务树：cos（开树派工）→ cto → fsd → ste → cos（收口闭树）

## 技术约束（全树适用）

- python 3.12（`python`·`python3` 是 Store 存根禁用）；UTF-8 显式编码；Windows 下 os.replace 原子替换
- 账本只经 CLI 写（唯一写入口）；禁文本行编辑 JSON
- 每命令自检输出（§四 命令族表自检列）
- git 操作注意 CRLF 警告无害；worktree 环境跑通（本仓多 worktree 拓扑）

## 验收门（S2 出口·对设计稿 §十 子集）

1. 三命令最小集（init/status/check）+render+migrate 全部可跑，每命令自检输出在案。
2. schema 校验器对五条硬规则逐条有负例测试（坏账本被拒）。
3. 原子写断言实测（模拟写中断→账本不被半写污染）。
4. render 只读自证（hash 前后一致）。
5. migrate 对表断言负例实测（差一件→FAIL 不落账）。
6. STE 门禁全绿+FSD 白盒自测报告在树文件夹。
7. 首单闭环自证：本任务书自身收口后，大表 render 出现本单 done 行（吃狗粮第一口）。

## 起单序（CEO 批后即时）

1. CEO 批本稿 → BOD 转达 COS（归因锚②）
2. COS `wp charter-create`（手工代行·按本稿 charter 对象录入）→ 触发·十段起算
3. COS 开任务树 t1：cos 开树派工→cto→fsd→ste→cos 收口闭树，逐位派工（每节点留报告）；COS 按树逐位核完成度，断点=故障恢复锚
4. t1 毕串行开 t2 → t3 → 全树毕 charter done → render 消账
