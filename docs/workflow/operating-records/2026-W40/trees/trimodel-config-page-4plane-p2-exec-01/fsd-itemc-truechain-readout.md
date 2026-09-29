# FSD·件C 四 face 真链两案完工读数（夜窗件③·可夜验）

- sourceOfTruth: 本件（FSD 件C 完工读数卷；判据源=CTO R3 6bf7a596+LG-035 R3 原文经 COO 11:06 转达；恢复令=CEO 02:21 经 BOD 02:24 转）
- syncMode: working
- lastSyncedAt: 2026-09-29T19:2xZ（date 现查=2026-09-30 03:1x +0800）
- 施工席: FSD 小全（m-fsd）
- 交付锚: TriModel **754fc96**（新文件 test/ui-e13-4plane-truechain.test.ts，193 行）

## 两案形状（CTO R3 判据逐项）

- **案1 真链**：UI 注入 admin 同值→boot→loadFaceCards 四 face（FACE_UI_IDS=mlc/rlc/mmc/rmc）并发 GET `/v1/config/cards/<face>?view=managed`（**真 handleGetConfigCard**：requireAdmin→handleGetTrimmcCard→200 body 扩 {face, ledger}）。断言：①server 侧四 face 请求全到且 auth 头=`Bearer admin`×4 ②mlc（沙箱预写 v4 applied 卡）→「已生效」+applied class ③rlc/mmc/rmc（无卡）→「未配置」诚实 none 徽标不造数 ④ledger 台账行+拉取源行渲染活。
- **案2 错 token**：UI 填错值→探针真链 401（server 侧状态码序列断言）→「已填入未验证」诚实黄态（conn-save L542-546 分支）+`#cf-mlc-badge`=「未连接」（不静默装成功）。

## 沙箱与零重启

- `TRIMODEL_CARDS_DIR`/`TRIMODEL_DATA_DIR` 双 env 钉 tmp（STE seam①/卡目录 seam 在案）——活体生产面零接触；自足 createServer 零重启（CTO R3 原文）；teardown 三件套同套（15s 超时+taskkill /T /F+closeAllConnections+吞错防遮蔽）。
- conn-save 探针卡与 face 卡路径隔离：探针=显式 cardPath opt（mmc 同名文件未写=200 未配置诚实态），face 族=env 钉位。

## 自测读数

| 面 | 读数 |
| --- | --- |
| env 实测（本机 Chrome） | **e13 两案 2/2 pass 0 fail**（tsc 零错） |
| 全量（无 env 基线态） | **326 tests/77 suites/309 pass/17 skip/0 fail**（+2 skip=e13 两案 env 门，零回归） |

## 技术债务标记

- 案2 的 managed 401 断言走探针面（conn-save 401 分支不触发 refreshAll→loadFaceCards 不发 managed）——「managed 面 401→徽标未连接」的 UI 终态断言等价覆盖（faceState null 同源）；若 STE 认为需 managed 请求独立 401 读数（server 侧观察面分离探针/managed 序列），候增强非阻塞。
- E0 对照钩兼容性同件A 注记（e13 无历史态需求，不适用）。

## 可夜验声明

- **可夜验**：STE 夜验窗=env 跑 e13 两案+全量 326 对照。至此夜窗三件（件D 5be7aba/件A d3fda84+69ea6ac/件C 754fc96）**全部落位闭环**，TriModel 仓 dev 顶=754fc96。

## 使用依据

- CTO R3 6bf7a596+LG-035 R3 原文+BOD 23:11 夜窗令+CEO 02:21 恢复令
- 实读：ui/index.html loadFaceCards L580-651（faceBadge 三态/badge/pull/audit 渲染）+FACE_UI_IDS L335+src/card-faces.ts FACES L29-63（TRIMODEL_CARDS_DIR seam）+src/api/config-cards.ts handleGetConfigCard L86-112
- 夜窗同批预读定形卷 fsd-tonight-p2-preread-shape.md §二/§三a
