# fleet PAT 生成操作指引（CEO 版·CTO 出件）

- sourceOfTruth: 本件（CEO 新发 PAT 网页生成操作指引正身，经 BOD 转呈）
- syncMode: final
- lastSyncedAt: 2026-09-30 05:03:45 +0800（date 现查原样粘贴）
- 令链: CEO 2026-09-30 04:57 批示③（新发 PAT 批准）→施工序第①步=CTO 出指引→BOD 转 CEO→CEO 网页生成→BOD 承接写入
- 清单来源: SDE push-survey 实证清单（GitHub API full_name 20/20 逐仓活体核名，2026-09-30 05:04 读数卷 §十二录案）

## 你要做什么

在 GitHub 网页上生成一把新钥匙（token），给新加坡服务器（sg）的自动推送程序用。生成后复制，写入服务器环节由 BOD 承接——你不需要碰服务器。

## 操作步骤（约 2 分钟）

1. **打开网页**：浏览器登录 GitHub 后访问：
   `https://github.com/settings/personal-access-tokens/new`
   （菜单路径：右上角头像 → Settings → 左栏最底 Developer settings → Personal access tokens → Fine-grained tokens → Generate new token）

2. **Token name**（名字栏）填：`fleet-sg-push-20260930`

3. **Expiration**（有效期）选：**90 days**

4. **Resource owner**：**MoRen9527**（默认即是，确认无误）

5. **Repository access**：选 **Only select repositories**，然后逐个添加以下 **20 个仓**（照抄、注意大小写，加完数一遍必须是 20 个）：

   | # | 仓 | # | 仓 |
   |---|---|---|---|
   | 1 | MoRen9527/TriMetaverse | 11 | MoRen9527/Trideployment |
   | 2 | MoRen9527/TriCompany | 12 | MoRen9527/TriTest |
   | 3 | MoRen9527/TriCode | 13 | MoRen9527/TriMem |
   | 4 | MoRen9527/TriModel | 14 | MoRen9527/TriWeb4 |
   | 5 | MoRen9527/TriMLC | 15 | MoRen9527/TriChain |
   | 6 | MoRen9527/TriRLC | 16 | MoRen9527/TriSkill |
   | 7 | MoRen9527/TriMMC | 17 | MoRen9527/TriTraining |
   | 8 | MoRen9527/Tripilot | 18 | MoRen9527/TriMobile |
   | 9 | MoRen9527/Tristaciss | 19 | MoRen9527/TriRMC |
   | 10 | MoRen9527/Triavatar | 20 | MoRen9527/TriGateway |

   ⚠️ 第 8/9/10/11/13 项（Tripilot/Tristaciss/Triavatar/Trideployment/TriMem）在 GitHub 上就是这个拼写（非驼峰形），**照抄即可，不是笔误**，勿「修正」——搜索框输入时选择 GitHub 下拉提示的原名。

6. **Permissions → Repository permissions**：只改一项——
   - **Contents**：选 **Read and write**
   - 其余全部保持默认（No access），不用动；页顶 Metadata (Read-only) 系自带项，正常。

7. 拉到页底点绿色 **Generate token**。

8. **生成后立即全选复制**页面显示的 token（`github_pat_` 开头一长串）——**此页只显示这一次**。

## 交接与安全

- 复制到的 token **直接交给 BOD**（BOD 已备好写入通道：SSH 管道直写、值零出机、不落对话记录）。
- **不要**把 token 贴进任何对话、文档、邮件或截图。
- 90 天到期（约 2026-12-29），到期前一周 BOD 会提请换新。

## 施工后续（供知情，无需 CEO 操作）

新 token 写入 sg fleet 凭据文件后：dry-run 20 仓验证 → 旧钥匙全作废（含 root 下不明来历旧串+历史记录驻留串）→ 历史记录清理。全部由 BOD/SDE 按施工序执行，读数留痕可审计。

## 使用依据

CEO 04:57 批示（候批三件全批）；SDE 05:04 清单供料（API full_name 实锚+TriModel 差仓定谳+改名 redirect 注记+大小写五仓注记）；90 天与轮换惯例=批件口径。
