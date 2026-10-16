# SDE 施工卷 · tricompany-pull 修复 c' 变体+同族 remote 勘修（COO 13:22 派工·即刻直跑）

- tree-id: 窗后承接件（charter-002 毕报候裁项 1 销项施工·挂同树）
- syncMode: static（施工卷·c'=修树 remote 重指·job 零改动）
- lastSyncedAt: 2026-10-16 13:27:25+08:00（date 现查·验真②③候 13:30 拍毕报段补）
- 执行席: SDE 小布（m-sde）；施工位=河源 R-HY（fleet 身份）+sg M-SG（勘定）

## 派工链与授权

- CTO 13:21 裁决：c' 变体（修树 remote 重指·job 零改动）技术成立——毕报候裁清单三案中 b 案变体（set-url origin·不动 job）。
- COO 13:22:05 排程终裁：白名单外一般任务直跑（D-23 v3 对轨：非 daemon 重启/非不可逆/秒级回滚——set-url 一行还原）·即刻·扩一件同族勘修授权（同判据同施工无需逐树候裁）。

## 勘定读数（13:23-13:25 拍·D-24 活体现探）

| 面 | 读数 |
| --- | --- |
| 河源 /srv/git | **不存在**（ls: No such file or directory）——全树死指实锤 |
| 死指树 | **20 树** remote.origin.url=/srv/git/<X>.git（TriAvatar/Chain/Code/Company/Deployment/Gateway/MEM/Metaverse/MLC/MMC/Mobile/Model/Pilot/RLC/RMC/Skill/Staciss/Test/Training/Web4·全 fleet 属主） |
| 判据外 4 树 | TriLC/TriModel.bak-20260926-pre-lg054/vscodium（github https 外部源）+trimodel-test（指本机 /srv/fleet/TriModel 工作树·存在）——不属「指本机不存在路径」·SKIP 不动 |
| tricompany-pull job | `cd /srv/fleet/TriCompany && git pull --ff-only origin dev`（*/15 拍·runCount 4141·consecutiveErrors=3@13:23 拍）——**用 origin 名**·c' set-url 正对 |
| fleet key | /home/fleet/.ssh/id_ed25519 在（weekly-plane-shift 同款·weekly consecutiveErrors=0 真通旁证） |
| sg /srv/git | **21 bare 全齐**（含全部 20 同形树对应仓）·TriCompany.git 顶=7080a0e（CTO 旁证②对上） |

## 施工（13:25-13:26·fleet 身份）

1. 20 树逐树：`git config core.sshCommand "ssh -i /home/fleet/.ssh/id_ed25519 -o StrictHostKeyChecking=no"`（weekly 同款 key 形·树级持久化）+`git remote set-url origin ssh://fleet@47.245.122.61/srv/git/<X>.git`——**20/20 OK**（逐树改前/改后 url 对表全绿）。
2. 属主对表：.git/config=fleet 保持✓（fleet 身份施工零 root 残留）。
3. SKIP 4 树如实留（判据外·不动·清单在案）。

## 验真三查

| # | 查 | 读数 | 判 |
| --- | --- | --- | --- |
| ① | 手动 pull 真通（job 同命令·fleet 身份） | 13:26 拍：`* branch dev -> FETCH_HEAD`+**Already up to date**·树顶=7080a0e==sg bare dev 顶**对平现证** | ✓ |
| ② | healthz consecutiveErrors 归零+degraded=false | 候 13:30:00 下一拍自然触发后读（job state 真值面） | 候拍 |
| ③ | 拍后仍对平=真触发证据（D-52 款A 同族） | 候 13:30 拍后读 log status=ok+HEAD 对平 | 候拍 |

## 回滚锚

- 任一树还原一行：`git -C <tree> remote set-url origin /srv/git/<X>.git`+`git config --unset core.sshCommand`——秒级·零 store 变更零 daemon 重启（F-3 全消解）。

## 使用依据

- COO 派工令 13:22:05（c' 三步+扩一件同族勘修+验真三查+毕报链直回）·CTO 13:21 裁决旁证
- 勘定活体读数（13:23-13:25 河源/sg 双面）·D-46 值面零打印（token 变量化）·fleet 身份施工（属主保持）
