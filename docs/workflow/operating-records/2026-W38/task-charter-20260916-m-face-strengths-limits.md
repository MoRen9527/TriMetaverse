# 任务书 20260916-M面优劣档案（M 面优势与局限·项目真源文档）

- sourceOfTruth: 本件（BOD 铸，2026-09-16 22:1x 现查）；CEO 令：建专门文档记录 M 面的优势与局限，项目真源文档级别，以后 M 面直接对照 checklist 突出优势
- face: local-executable → **CAO+CPO 双席共建**（CAO=治理文档归属与真源规范；CPO=产品视角优势/局限提炼与 checklist 形态）；CTO 技术事实核；BOD 收口
- PACE: P=本件 → A=已挂 W38 平面 → C=M-004 直达（m-cao/m-cpo）→ E=节点收口回写本文件

## 交付物（一件）

**`docs/product/m-face-strengths-and-limits.md`**（项目真源级；元信息头 sourceOfTruth/syncMode/lastSyncedAt 照 §3.4 规范；结构候 CAO/CPO 合议，最低须含）：
1. **优势清单**（每条：现象→机制→对经营的意义）——初稿供料：本地低延迟/本机直连按量模型无配额墙/单机双核心（M 面承载 M+R 双面编排）/真机 Ops 直达（SSH/服务面）/开发-运行同机（改码即生效）等
2. **局限清单**（每条：现象→根因→状态分档【已解决|可绕过|需开发|平台外】→对策/进展指针）
3. **M 面对照 checklist**（突出优势的可执行核对单；局限项带状态标签）
4. **变更记录**节（档案随 M 面形态演进持续维护——本件=活文档非一次性）

## 首批局限条目（BOD 供料，含判定）

**L1（已判定=记录）**：Windows 宿主 SSH 伪终端链缺陷——Claude Code + VS Code 终端下 `ssh -t <host> tmux attach` 类命令退出码 255（"open terminal failed"/Pseudo-terminal 分配失败），直连 Linux tmux 会话不可用。
- 根因：Windows OpenSSH/终端层伪终端分配与 Linux 远端 tmux 的兼容缺陷（M 面=Windows 宿主特有；sg/R 等 Linux 面原生无此问题）
- **状态=可绕过**（已实证三条绕法：两跳登录后手动 attach；`ssh -tt` 强制；BOD 代 capture-pane 转述）——**非"需开发"**；但"一键丝滑 attach"若要产品化属 TriPilot/TriCode 线候选（候 CPO 判是否入产品待办）
- 判定依据：CEO 2026-09-16 22:1x 令（"算不算局限性？如果算，记录下来"）+ BOD 实测复现（22:1x，两条命令路径均断于 SSH 层）
- 对照：**R 面/Linux 宿主无此局限**（原生 PTY）——写档案时作 M 面 vs R 面对照示例

**L2（供 CTO 核后定档）**：本机 TriModel 配置面服务非自启（今晚实测 3333 未在跑，HTTP 000；sg 侧有 systemd 常驻）——M 面服务常驻形态待统一（候选：计划任务/服务化/自启脚本），状态候 CTO 判【需开发|可绕过】

（CAO/CPO 可按各自域增补；每条须带现象+根因+状态档+对照面）

## 分工与门

- CAO：文档骨架/真源规范/归属定谳（product/ 目录适配性核）/变更记录机制
- CPO：优势提炼（经营语义）/checklist 可用性形态/L1"是否产品化"判定
- CTO：L1/L2 技术事实核与状态档终判（一句话级，不另稿）
- BOD：收口核（元信息头/结构最低集/判定依据在卷）+ 推仓

## 收口区

（执行席追加：## 收口-<席> + 时间（现查）+ 交付指针 + 读数）
