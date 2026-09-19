# binding 收尾线·主窗完工证据（FSD 主执行）

- date: 2026-09-19 10:1x +0800（收口 commit 链见下；TriCompany 全量 402/399/2/1）

## 交付全清单（锚 1-4 主体+锚 6 消红+消费者切换）

### 三件收尾

1. **schema v0.2 语义追平（13 profile，commit eeb18ff）**
   - hostStage/status：单值 copilot 态 → `{primary_host: "claude", hosts: {claude/copilot/claude-session 三态}}`
   - liveEntry 主指针：.github/agents → .claude/agents/<seat>.md（claude 位）；copilot 指针归 hostEntries
   - supportObjects 分层如实：`layer: host-asset-knowledge`（4 条 host-assets 知识层）+`layer: host-independent-runtime`（runtimeNamespaces）+claude 支持面补条（.claude/compass session body 位）——**零虚造 claude-assets 树** ✓
   - governedBy 補 FADE-002 管线依据（project-source-doc-sync-manifest.json）
2. **manifest 盲区补登**
   - generation manifest：+objectSet「claude-host-agents-v0.2」（14 publishedCopies=13 席+board .claude/agents 件+seatsJson 派生管线登记）
   - published-copy manifest：+tier「claudeHostFace」（13 session bodies .claude/compass/）
3. **governedBy 補依**：13 profile 各+FADE-002 管线依据（锚 3）

### 锚 5（CHO 五件套面 df46ce8 合流）

13 席 agent-body binding 声明校准「宿主绑定层（binding profile，单点双宿主）承载」17 处/12 席（A 形 8+B 形 9；旧措辞零残留 grep 自证）——CHO 件在库，FSD 侧零重复。

### 锚 6 消红（CHO contract 补 session_body 合流+FSD manifest 侧对称补齐）

- manifest sourceFiles 11 员工席补 session_body 键（错补 bs 悬空键撤回实锚）
- lg025 test_1 口径新态 91=13×7+bs 3+board 2；test_2 契约投影对称绿
- 丙改②互补断言：entry-level sessionBody ×13 闭集（THIRTEEN+bs 悬空防双保险）
- 丙改①等式形态：CTO 裁**维持直接全等**（对称补齐消解减集前提；桥接件退役）

### 消费者切换

- TriMLC puller target_seat 名册化（seats.json 席集校验回退链；baedc02+名册化 commit）
- 8713 启动 cmd NOTIFY 三键持久化加固（TRIMC_NOTIFY_SG_URL/TOKEN/TARGET_SEAT）
- 看门狗/启动脚本：health/revivalPolicy 结构位已入 seats.json（消费面候 revival 器实装，本批零行为）

## 全量读数（自含）

- **validate 门实盘 14 席**：11 席 0 issues+CSO/DE 各 2（soul 既有备案）+board 0=**14 席合计 4 issues，boundary 双锚零漂移**
- TriCompany 测试套件：402/399/2/1——2 红归因：lg024=CHO 渲染等待态（CHO 续批自消）/lg025=锚 6 落位后**已消红**（本线终态零红）+1 skip 原有
- TriMLC 593/588/5、TriMMC 581/577/3（既有备案族原样，与本线零关联）

## commit 链（TriCompany）

eeb18ff（v0.2+manifest+lg025+board alias+丙改②）← 6b9720d（CPO fm 同步）← 63344c5（seats 派生）← df46ce8（CHO 锚 5/6 五件套面）
