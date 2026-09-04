# LG-017 pre-receive 立法设计稿（TriRMC 侧防 force-push+身份级写控）

- sourceOfTruth: TriMetaverse/docs/execution/lg017-pre-receive-design-draft.md
- syncMode: draft｜lastSyncedAt: 2026-09-04
- 性质：LG-017 在册项设计面，出稿候裁不实施（压缩令件②）

## 一、前置定谳：TriRMC 仓接收面形态（设计前提）

TriRMC 仓现状**无 push 接收面**（LG-030：仅 cron API+git 拉取；LG-032 实deploy=git bundle scp 直传+fleet ff-merge）——pre-receive hook 的挂点前提是标准 push 面。两案：

- **P-a 立 push 面**（推荐）：河源侧建 bare 仓（/srv/fleet/TriRMC.git）为唯一接收面，工作仓 /srv/fleet/TriRMC 由 bare post-receive/定时 checkout 同步——hook 挂 bare 仓 hooks/pre-receive；
- **P-b 维持 bundle 直传**：pre-receive 无 git 挂点，防护降级为「bundle 导入前校验脚本」（ff-merge 前置检查：目标分支快进性+提交签名）——防护弱（无身份层）。

**推荐 P-a**：LG-032 案 a 后 TriRMC 服务面地位上升（8711 上送对端），写控立法价值随之上升；bundle 直传通道立法保留为应急通道（走 P-a 校验脚本）。

## 二、pre-receive 三闸设计（P-a 形态）

1. **防 force-push 闸**：stdin 读 oldrev newrev refname——检测 non-fast-forward（`git merge-base --is-ancestor oldrev newrev` 失败即拒）+分支删除（newrev 全零拒）+已有 tag rewrite 拒；白名单豁免=无（force-push 一律拒，纠错走 revert）。
2. **身份级写控闸**：pusher 身份（SSH key → `whoami`/environment GIT_PUSH_USER）→ 分支白名单矩阵：`fleet`=deploy/infra 系分支；`MoRen`/CTO 席 key=dev+docs；**dev 主分支保护**=仅白名单身份+fast-forward 双条件。身份未登记=拒（fail-closed）。
3. **tag 保护闸**：v* 版本 tag 仅 CI 系身份可建；已建 tag 不可删改。

技术形态：hooks/pre-receive 单脚本（bash+git plumbing，零依赖），拒绝时 stderr 输出拒因码（LG-017 拒因词表：force_push_denied/identity_not_allowed/branch_protected/tag_protected）。

## 三、与既有面的关系

- sg-bare 中转（现 TriRLC/TriCompany push 面）不动——本设计仅 TriRMC 河源侧；
- LG-032 案 a 服务面（8710 HTTP）与 git 接收面零耦合；
- bundle 应急通道走导入前校验脚本（P-a 同族规则复刻）。

## 四、候裁点

1. P-a/P-b 选型（推荐 P-a）；
2. 身份白名单矩阵初版（fleet/MoRen/CTO 席三分法）；
3. 实施窗（候裁后，避开周日迁移冻结期）。
