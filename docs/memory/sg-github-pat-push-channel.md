---
name: sg-github-pat-push-channel
description: sg GitHub 直推通道（fleet store PAT）——2026-09-30 新发 20 仓 Contents RW/90 天期约 2026-12-29；CEO 自己经手 token 不进对话；access 面可网页编辑加仓（09-30 实证）
metadata:
  node_type: memory
  type: project
  originSessionId: e11343a2-e97e-4a90-8c4a-5ac637545af8
  modified: 2026-09-30T03:31:44.033Z
---

2026-09-20 配成（CEO 选 A 路径：token 自己生成自己写入 sg，不进对话 transcript）：

- **通道**：sg fleet 用户 git credential store（`/home/fleet/.git-credentials`，600）+fine-grained PAT。**权限范围扩全仓（CEO 09-21 09:36 知会+TriCode/TriModel 抽样实证）：全部仓库 Read/Write 拉推，不局限双仓**；90 天期（首版生成 09-20）。
- **拓扑定谳**：GitHub 推进=本机主推（凭据在 Windows 凭据管理器；2026-09-30 实锚=gho_ OAuth token len40 非 PAT，两把不同源勿互锚）+sg 备援直推（本件通道）——两仓 github remote 均已在 sg 配齐（TC 09-20 补）。
- **坑三连**（配置过程实证）：①sudo -u fleet 不重置 HOME→config/凭据读写歪到 root 家——**fleet git 操作一律 su - fleet -c**；②fine-grained token 权限面【09-30 勘正】：**repository access 面生成后可网页编辑加仓**（A 路实证：Edit 加 TriChain/TriMobile/TriWeb4 三仓保存即时生效零延迟，token 值不变服务器零改动）——旧记录「权限生成时定死不可改」勘废；**permissions 面改动仍词慎以页面实况为准**（Contents 选错时重生成仍是最稳兜底）；③**git 认证失败自动 reject 清空 store 行**（Authentication failed 后 .git-credentials 变空文件是机制非事故）——验证用 push --dry-run 分仓隔离+先备份凭据文件。
- **轮换**：【09-30 终态更新】现行把=fine-grained `fleet-sg-push-20260930`（20 仓 Contents RW），90 天期约 2026-12-29 到期，**到期前一周（12-22 左右）BOD 提请 CEO 轮换重写**。旧把全废毕（09-30）：网页侧 CEO 删 1 把（余 1 推定 09-21 轮换时已废）+root store gho_ 本地清（出处不可定位，自然失效闭合）+root history 三行明文清零。【史：fleet store 历史=fine-grained 两串轮换过一次（初版双仓 RW→09-21 扩全仓重生成；COS root history 取证）——两串均已消失。】
- **【2026-09-30 勘·两串轮换史】**：fleet PAT 系 fine-grained **两串轮换过一次**（初版双仓→09-21 权限扩全仓=fine-grained 权限生成时定死故重新生成；COS history 取证，BOD R2 转述）——本条早前「首版生成 09-20」单把表述随勘。旁证注【09-30 再勘】：坑②已勘正（access 面可编辑），两串轮换史应读为「当时选择重生成」非「被迫重生成」。
- 公开仓 ls-remote 匿名可读——读权验证是假阳性，写权验证必须 dry-run/实推。

**How to apply:** sg 侧急件需推 GitHub 时：su - fleet -c "git -C /srv/fleet/<仓> push github dev"（凭据自动带）；验证用 --dry-run；403=授权清单缺仓（denied to <user>=身份面认得 token 有效），网页 Edit repository access 补加即时生效（09-30 实证）；store 空文件=曾被 reject，查 token 有效性后重写。关联 [[m-sg-r-hy-server-naming]]。
**【B 方案落地 2026-09-20】CEO 裁「折中双推」（否 A 真源搬迁/否 C 纯现状）**：本地 20 仓（vscodium 除外——sg 浅态不推）origin 全配**双 push url**（GitHub canonical+ssh://fleet@sg bare）+**双 fetch url**（fetch 取并集，sg watcher 件本地可直接取）——`git push origin` 一次推双落点，GitHub 抖动时 sg 腿照落。fleet SSH key 已配（本机 id_ed25519→fleet authorized_keys）。canonical 仍=GitHub（灾备等级不降）。配置坑：git config 无 --push 选项（pushurl 直接 add）；中文截断致比对假不符（hash 级比对才准）。

**【2026-09-30 现势更新（TC force 回卷事件实证）】**：①【10:03 二次更新】**fleet store 新 PAT 已落位**（CEO 04:57 批新发：fine-grained 93 字符/20 仓 Contents RW/90 天期约 2026-12-29；CEO 网页生成→BOD 剪贴板→SSH 管道直写零出机，1 行/600 权限/fill 接线冒烟 username+password 双命中 PASS；20 仓 push --dry-run 扫=SDE 施工序④【10:31 闭账 20/20 全 PASS：17 首轮+3 补扫，403 三仓（TriChain/TriMobile/TriWeb4）CEO 10:29 网页补授权即时生效，BOD 独立复跑双族实锚】——fleet 备援直推恢复；root store gho_ 代推路降旁路（root 身份自动化=妥协观察项族不变）；旧把两串⑤毕⑥闭（11:3x 收官：CEO 11:30 网页删 1 把+gho_ 本地清自然失效+history 清零残留——凭据线全链终态）。**坑新增「PS→ssh stdin CRLF 行尾」**：PowerShell 管道进 ssh stdin 行尾带 \r\n，store 行尾粘 \r 致 host 匹配 `github.com\r` 永不命中（fill 零命中假死似写入失败）——写后必 sed 剥 \r 或字节级验文件整（内容+\n 无第三字节）。原勘：**root credential store 在位活**（helper=store 含 github 行），COS 已实证 root 身份 FF push 代推路可用（root 身份跑自动化=现势妥协观察项族，候优化）。**fleet 历史 PAT 轮换史（09-30 代查六读数勘明）**：github_pat_ fine-grained 型、**轮换过一次共两串**（root history L877-887 配置链先 append 后 overwrite 写 fleet store）——BOD 裁=列轮换候选**随 CEO 新发批件一并自然作废**，不单独轮换动作；root store 现行=**gho_ OAuth 型 1 行**（非 PAT 型，04:04:25 新写，出处候澄清单）——「本机把=gho_ OAuth」与「root store 把=gho_」为不同机器不同把，勿互锚。②**「读通写败」分诊形态**：GitHub 故障时匿名 ls-remote 通+push 败≠整条网络死——先分写路径族（PAT/代理写）再定网络死；本机与 sg 网络面独立，可互为探针。③**bare-fetch-all.sh 结构雷**（fleet crontab 每小时 :30）：refspec 带 `+` force fetch 以 GitHub heads 无条件覆写 bare——席推 bare 后 GitHub 未同步即有回卷暴露；修案归 SDE（refspec 去 `+`），TC 仓同步结构缺口候 CTO 权衡（SDE D-15）。④本机直连 GitHub 抖动期形态：git 零 proxy 配置裸直连，connect timeout/reset 交替=纯网络死无排障空间，候自然恢复。⑤**零真值令执行纪律（BOD 09-30 立）**：取证类读数（history/日志/配置原文）须先脱敏再输出（sed 掩 token 中段）；遇结构冲突（如须原文取证 vs 零真值令）→**先报冲突请示拆解法再动，勿自行权衡溢出**——09-30 grep 未脱敏致两串 PAT 明文溢出 transcript（观察非处罚，但勿二犯）。关联 [[root-identity-automation-observation]]（候建）与 [[bigmodel-h1-proxy-mitigation]]。
⑥**bare→GitHub 双链机制（09-30 SDE 勘验亲锚）**：TMV 仓=hook MIRROR 链（post-receive 内联→ssh://github-mirror/ alias，SSH key 认证**与 PAT/store 无关**，fade-hook.log 可查，09-17 21:20 末败后零败）；其余仓=bare-fetch-all.sh push 段（PAT 认证）——「某仓 GitHub 滞后」先分链归因再定因，勿把 TMV 滞后归 PAT 族（09-30 晨 443 断连窗暂态曾被误判推腿死）。
