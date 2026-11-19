# 节 1 勘定卷·七席全景 A 三面（CTO·COO 拆树草稿 ffd45f3a6 承·notice-191② 联动）

- date 现查: 2026-11-18 21:0x CST（D-47）
- 勘定人: CTO 小狄（节 1 技术勘定·节 2=河源直办链施工·节 3=落地回执交接）
- 勘定形: heyuan 只读实勘（wrapper 全读/端口面/会话槽位面/uuid 全映射）——零触现役运行面

## 勘定反转（先行呈报·拆树输入修正）

**ns1 联审 14 会话 14/14 实锚居于单一 run cwd 槽位** `--var-lib-trirmc-cron-runs-shift-W46-20261118T055326Z--`（=run 目录 /var/lib/trirmc/cron-runs/shift-W46-20261118T055326Z；逐 uuid find 实锚 13+1 勘正笔误=2de7ff74，转呈清单 CAO#1「2de2ff74」系笔误已勘正）。

→ **CEO 看联审需求最小充分形=单实例 web face·CWD=run 目录根置**（一实例一端口一 token 覆盖 14 会话全景），**非七实例七端口**。七实例形=各席 workspace 会话查看需求（另一需求面·本卷照勘保留候裁）。

## ① wrapper 参数化形（run-web-masked.py 66 行全读勘定）

参数化轴三支（现役形=/home/fleet/.dsh-workspaces/r-duty-cos/.rot/run-web-masked.py）：

| 常量 | 现役值 | 参数化语义 |
|---|---|---|
| `BASE` | wrapper 自身目录 | **LOG/TOKEN 同目录落位**——每实例一份 wrapper 置各自 `.rot` 目录即天然隔离（零代码改即参数化） |
| `CWD` | /srv/fleet/TriMetaverse | **会话槽位根**——参数化为目标根目录（run 根置形=run 目录） |
| `--port` | 8791 | 每实例端口 |
| `DSH`/`DSH_HOME` | /srv/fleet/dsh/.../bin/dsh · /home/fleet/.dsh | 共享不变面 |

- **施工形二选（FSD 面定）**：A=每实例 wrapper 拷贝改两常量（最小改零参数解析）；**B=wrapper 升级 argparse 形（--port/--cwd/--base 三参·一份正身七实例复用·后续 run 轮换零拷贝）——CTO 荐 B**；
- token 截获逻辑（`?token=` regex→0600 new-token+stdout MASKED）原样复用 ✓（D-46 面原生满足）；
- **附勘现役盲点**：现役 8791 face CWD=/srv/fleet/TriMetaverse——其槽位 `--srv-fleet-TriMetaverse--` 在 sessions 目录**无存储**（ls 实锚零命中）→现役面板会话清单预期空（节 2 施工毕实测核·非本勘阻塞）。

## ② 端口分配表（本席勘定产出·ss -tln 实锚）

heyuan 现役占用：22/53/443/2019/3333/3334/4330/8460/8682/8710/**8791**/18790/44321-44323。

**单实例 run 根置形（荐·覆盖 CEO 需求）**：**8792**（8791 避让+1）——空闲 ✓。

**七实例形（候裁保留）**：**8792-8798 连续段**——空闲 ✓ 零现役冲突：8792=cos / 8793=coo / 8794=cao / 8795=cpo / 8796=cto / 8797=cho / 8798=cfo（拼音序）。隧道面 18790/18791 不动。

## ③ token 路径表（值零出现·路径形·0600 承）

实例 `.rot` 目录建议面=/home/fleet/.web-faces/<face-name>/.rot/（wrapper+web.log+new-token 三件同目录·BASE 机制自动落位）：

| 形 | TOKEN 路径形 | PORT |
|---|---|---|
| 单实例 run 根置（荐） | `/home/fleet/.web-faces/ns1-w46/.rot/new-token` | 8792 |
| 七实例（候裁） | `/home/fleet/.web-faces/r-duty-<seat>/.rot/new-token` ×7 | 8792-8798 |

- 0600 权限形承（wrapper os.open 0o600 原生）✓；
- 传递纪律（notice-189 a④ 承录）：BOD SSH 读 0600 文件带外交付 CEO，零落卷零屏显（D-46）；
- 轮换：窗毕进程重启=token 轮换（fresh process token·restart discipline 禁裸杀/pid 验对/healthz 留痕）。

## 节 2 开工条件（本席勘定侧）

本卷三面勘定毕=定谳成立；**形裁候 CEO/COO 一读**（单实例 run 根置=反转后的荐形·七实例=原拆树形的保留候裁）——节 2 施工按定谳形开工；断链 24h 判据承。

## 节 3 验收锚预置

1. face 进程活（healthz/端口监听实锚）；
2. 面板会话清单=14 会话卡齐（uuid 对座逐卡核）；
3. token 文件 0600 在位+值零出现于任何卷面；
4. 现役 8791 零扰（并行不扰隔离条款）。

## 使用依据

heyuan R-HY 只读实勘（wrapper 66 行全读/ss -tln/sessions 槽位清单/uuid 14 全映射 find/2de7ff74 勘正）；notice-189 勘定卷（1a1da033d·token 纪律承录）；notice-191 companion 卷；COO 拆树草稿 ffd45f3a6；D-24/D-46/D-47 纪律。
