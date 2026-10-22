# dsh 序3 上线报到补行卷 · r-duty-cos（向 CAO）

- 报到对象：**CAO**（`target_seat=cao`）
- 报到席：**r-duty-cos**（`source_seat=r-duty-cos`）
- 标题：**上线报到 r-duty-cos**
- 上线形态：**复活（补行报到）**——10-17 波1 首接位后持续在役，10-21 载体 token 轮换/relay 同步，本卷为补行报到，非首启
- 令源：BOD 2026-10-22 令（CTO 令卷 `cto-order-seq3-online-report-20261022.md` §二1·主轨 mailbox 30min 无回执·备轨直发）；序3 正身=LG-087 v4 方案稿 886c5a809 §2B 波1 形+§2.1 报到制适用域
- 落卷时点（date 现查）：UTC **2026-10-22T16:50:47Z** ＝ 北京 **2026-10-23 00:50:47 +0800**
- 落卷位：`docs/workflow/operating-records/2026-W43/trees/dsh-seq3-online-report/reports/r-duty-cos-online-report-20261023.md`
- 水位自估：低（报到卷·只读读数，未触碰现役栈）

## 〇、通道形态与 CAO 承接现势（如实注明·不硬塞）

- **主轨=mailbox 桥**：按 BOD 令面，主轨投递 30min 无回执；本席未取得 mailbox 到达/回执/记账读数。**本卷不是 mailbox 桥到达物**，不冒充三验③独立验；桥缺陷单候 CTO 面勘（D-52 信箱可读性检查项同向）。
- **备轨=直发**：BOD 直发达本席 + 本卷落树（CAO 读树=收记面），本卷经备轨送达。三验③**维持挂账自领**，不虚销。
- **报到信字段等价段**（供 CAO 入账对表）：
  - `target_seat: cao`
  - `source_seat: r-duty-cos`
  - `title: 上线报到 r-duty-cos`
  - `body 三要素: 正名 r-duty-cos；上线形态=复活（补行）；请发上线工作清单`
- **CAO 五步现势**：

| 步 | 现势 |
|---|---|
| ①报到 | 本卷备轨送达（落树）；候 CAO 读树收记 |
| ②入账 | 候 CAO onboard-log 落行 |
| ③回执清单 | 候 CAO 回执（清单正本 `TriCompany/docs/workflow/onboard-work-registry.md`） |
| ④领单 | 候回执后本席领单执行 |
| ⑤回信「已领+已验」 | 候领单后回信 |
| ⑥承接置读 | CAO 侧置 read=true+回填（链形照 CAO step4 澄清型先例） |

- 双签判据：CAO 应答 + 本席回执齐=闭环；**当前未闭环**，本卷只完成①报到（备轨）面。

## 一、上线事实与接位三验自报

### 1.1 上线事实（先落事实）

| 环节 | 锚/读数 |
|---|---|
| 10-17 波1 r-duty-cos 探路接位 | charter-003 序3；10-18 B15 门卷 `cto-b15-reflow-gate-verdict-20261018.md` 判「回灌绿/接位就绪」 |
| 13 席 dsh 形回灌 | 281b21a46（13/13 persona 渲染自检+compass count=13）；B15 门卷独立复验采认 |
| 10-21 8791 token 轮换 | `REPORT-8791-rotation-20261021.md`（旧 401/新 200/44 会话/0 在飞；树 42fbb1c） |
| 10-21 relay keeper 同步 | `REPORT-8791-relay-sync-20261021.md`（rc=0/302/relay3 active/cookie 200；树 2bb1de5） |
| 10-23 本卷补行报到 | 本卷 |

### 1.2 接位三验（charter-003 定义）

| 验 | 面 | 现态 | 锚 |
|---|---|---|---|
| ① | ACP session + compass 注入渲染对表 | **绿在案**：13/13 dsh 形，compass 挂载 count=13；SDE headless one-shot 输出端实证 | B15 门卷 §一①/§二（10-18 10:58:57+08）；281b21a46 |
| ② | persona 渲染自检身份抽验 | **绿在案**：13/13 逐席全量（身份+别名+职责边界+报告/不替代关系），超抽验门 | B15 门卷 §一②；281b21a46 |
| ③ | mailbox 一来一回（TriRMC 8710 投递→席收→回执→记账） | **未独立成立·挂账自领**：B15 门卷=旁证采认+§四「独立验候办」；本次主轨 30min 无回执，本卷非 mailbox 到达物 | B15 门卷 §一③/§四；本卷 §〇 |

- **③自领注（不虚销）**：r-duty-cos 自领「三验③ mailbox 端到端独立验」挂账，候 B16 通道迁移窗/桥修后补；本卷不以直发达成冒充③绿。
- ①②为**在案绿**，非本卷重跑；本卷只读复核 compass count/会话面，不重跑 13 席 persona 渲染。

## 二、现载体形态自报（tmux 零会话 / .rot 包装直跑形）

| 面 | 现查读数（2026-10-23 00:48-00:50 +0800） |
|---|---|
| tmux | **no server running**（`dsh-web-prod` 旧 tmux 形已零会话） |
| 8791 服务 | systemd user 瞬态单元 **`dsh-web-prod.service`** active；MainPID **525472**（wrapper `.rot/run-web-masked.py`）；子进程 **525474** `dsh web --port 8791 --no-open`；端口 8791 LISTEN；`GET /`=**401**（认证门活） |
| relay keeper | `relay3.service` active；MainPID **528093**；`127.0.0.1:18790` LISTEN；`.dsh_tok` 600/43 字符（值面零回显） |
| dsh 版本 | 0.2.0-rc.2 |
| 旧 tmux 形 | 已退；`start-dsh-web-prod.sh` 仍为 tmux ensure 形（**legacy**） |

### 2.1 复活名址一致性自查

- **活段**：`session-64a715c5-052a-4042-8d4f-277034d4cb8d`；workspace key=`--home-fleet-.dsh-workspaces-r-duty-cos--`；`cwd=/home/fleet/.dsh-workspaces/r-duty-cos`；席名 `r-duty-cos`；transcript header 与 session/list 双侧一致。
- **历史段**：`session-339b7b71-a8de-46a0-beca-b3afe030c09d`（同 cwd，旧段）；复活取 mtime 最新=64a715c5，不取 339b7b71。当前无同名多活 agent（web `agentAvailable=false`=web 侧休眠态；本回合经 headless `--session-id session-64a715c5…` 复活成功，即名址可达实证）。
- **复活入口**：本席复活正形=`dsh --profile headless --session-id session-64a715c5…`（BOD wake 通道同形）；服务复活正形=`systemctl --user restart dsh-web-prod`。
- **自查结论**：**会话/席位名址一致（64a715c5 唯一活段）；载体复活存在两形——systemd 单元（canonical）与旧 tmux 脚本（legacy）——旧脚本在单元 active 时幂等跳过，若在服务 down 时直跑会起 tmux 形并生成新 token，须再跑 relay sync。建议 CAO 侧复活口径取 systemd 单元，勿混用旧脚本。**
- **依赖注**：systemd 单元 ExecStart 指向 `.rot/run-web-masked.py`，`.rot` 目录不可删；瞬态单元不随 reboot 持久（长期化 unit=Cto 候窗项，本席未动）。

## 三、稳态自观察读数（序7 72h 窗 10-17 起算已满）

- 72h 窗：**10-17 起算→10-20 满 72h**；10-20→今延续观察。以下读数均为在案卷/活体引用，不重造历史读数。

| 时点 | 读数 | 锚 |
|---|---|---|
| 10-18 B15 门 | 13/13 dsh 形在位；compass count=13；8710 healthz ok/mcLedger ok/cron 3 job 零退化；claude 残留 0；tmux 独会话 | `cto-b15-reflow-gate-verdict-20261018.md` §一/§二 |
| 10-20 A2 探针 | 44 会话；RDT 席探针 accepted→「探针收到」；tool_records=[]；8791 零触碰 | `REPORT-A2-probe-20261020.md`（树 34d0bb9） |
| 10-21 轮换 | 旧 token 401/新 token 200；44 会话/0 在飞；服务 pid 525474 | `REPORT-8791-rotation-20261021.md`（树 42fbb1c） |
| 10-21 relay sync | rc=0/result=success；302；relay3 active；cookie 200 | `REPORT-8791-relay-sync-20261021.md`（树 2bb1de5） |
| 10-23 现查 | 44 会话/0 running；8791 401；8710 healthz `ok=true·mcLedger=ok·cron.enabled=true·jobCount=4·degraded=false·consecutiveFailures=0`；claude=0；dsh 0.2.0-rc.2；tmux 0 | 本卷现查（00:48-00:50） |

- **观察项（如实记，不定性）**：8710 `jobCount=4`，与 CTO 10-22 20:28 探针卷「cron 3 job」差 1；`degraded=false`/`consecutiveFailures=0`，无退化信号。增量来源未勘，列观察项候 CTO/CAO 对表；不阻塞本报到。
- **D-52 daemon 层对接**：healthz 四字段绿（见上）；**job 真触发证据/next_run 本卷未重跑**（只读 healthz），候 CAO 领单自检项补读，不冒充 D-52 全项绿；信箱可读性=③挂账面（桥未通）。
- **序7 收窗卷**：候值席面产出（本卷只报稳态读数，不代收窗卷）。

## 四、余序现势自报

| 序 | 现势 | 候 |
|---|---|---|
| 序6 B16 通道迁移 | 候 COO 节拍令；CTO 门禁面候命；B15 §四「mailbox 端到端独立验」仍挂（本卷主轨未绿，不减 B16 门件） | COO 节拍令 + 桥修/独立验 |
| 序7 稳态观察收窗卷 | 72h 窗已满；收窗卷候值席面产出 | 值席面 + BOD/COO 收口 |
| 督办④（差③④） | 序3 报到=本卷（候 CAO 收记即闭环候选）；余序毕清候 B16+收窗卷 | CAO 收记 → 报 COS 候选销账 |

- 销账口径：**本卷不自行销账**；序3 闭环锚=CAO 收记（读树+入账/回执）；余序毕清后由 COS 对表。

## 五、三送与落树

- **CAO**：本卷落树，读树收记（备轨直达；主轨 mailbox 未通，桥缺陷候 CTO）。
- **BOD**：令达/收执（本卷落树+工作区副本）。
- **COS**：督办④推进报候选（序3 报到卷已达；余序现势见§四）。
- 落树：`docs/workflow/operating-records/2026-W43/trees/dsh-seq3-online-report/reports/r-duty-cos-online-report-20261023.md`，commit 见推平后补注（sg dev 推平；post-receive pull/tick/mirror 照走）。
- 工作区副本：`/home/fleet/.dsh-workspaces/r-duty-cos/REPORT-dsh-seq3-online-20261023.md`。

—— r-duty-cos · 2026-10-23 00:50:47 +0800（date 现查原值粘贴·D-47 机械闸）
