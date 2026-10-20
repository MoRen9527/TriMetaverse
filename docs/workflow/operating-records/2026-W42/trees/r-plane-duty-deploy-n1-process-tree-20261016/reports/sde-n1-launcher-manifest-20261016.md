# SDE 施工卷 · n1 启动命令清单（护栏先于首启·形②在案断言）

- tree-id: 1
- charter: charter-2026-W42-001
- syncMode: static（施工在案卷·COO 复核认形②「启动命令文本先落卷→再起树」03:33:20）
- lastSyncedAt: 2026-10-16 03:41:00+08:00（date 现查原值随发）
- 执行席: SDE 小布（m-sde）；施工位=河源 R-HY

## n1 前置链五件（03:32-03:40 全绿）

| # | 件 | R 面读数 | 对表 M 面 |
| --- | --- | --- | --- |
| 1 | bigmodel-h1-proxy.service | active·listen 8460·pid 2739903 | unit 逐字同构·proxy.mjs 2323B+upstream.key 49B 字节级对平 |
| 2 | claude CLI | /home/fleet/.local/bin/claude **v2.1.296**（npm --prefix ~/.local·@2.1.296 精确对版） | 版本对平 M 面 2.1.296 |
| 3 | duty-env | /home/fleet/.trimmc/duty-env 295B·600 fleet | 字节对平 295B·6 键（GLM_API_KEY/GLM_BASE_URL/GLM_MODEL/ANTHROPIC_BASE_URL/ANTHROPIC_AUTH_TOKEN/ANTHROPIC_MODEL）·值面零触（管道直传） |
| 4 | settings.json | /home/fleet/.claude/settings.json 1018B·644 fleet | 字节对平 1018B·4 键（crossSessionInbound/env/skipDangerousModePermissionPrompt/theme）·env 段 8460 代理形+模型 5 组 GLM-5.3-Flash |
| 5 | compass 13 件 | md5 聚合 **04c434c3 双面对平**（10-14 渲染版 c4d150ad5 内容） | tar 流同步（M→R·R 面仓 13 件 tracked modified=预期 dirty·仓版本线不动·候另窗收敛如实记） |

## 启动命令模板（R 面首启形·M 面活体正形同构）

```bash
tmux -u new-session -d -s r-duty-<seat> -c /srv/fleet/TriMetaverse 'source /home/fleet/.trimmc/duty-env && set -a && unset CLAUDE_CODE_CHILD_SESSION && export CLAUDE_CODE_FORCE_SESSION_PERSISTENCE=1 && claude -n r-duty-<seat> --agent <Agent> --verbose --dangerously-skip-permissions --append-system-prompt-file /srv/fleet/TriMetaverse/.claude/compass/<agent-file>.session.md'
```

- **护栏段（先于首启准绳·M 面活体正形）**：`unset CLAUDE_CODE_CHILD_SESSION && export CLAUDE_CODE_FORCE_SESSION_PERSISTENCE=1`——任务书文字面「清+置」的活体实形（unset=清·前缀全形）·COO 03:33:20 认。
- **首启/复活两段语义**（如实记）：首启用 `-n <title>` 新建命名形（R 面无历史 session·--resume 无从恢复）；复活形（n4 启动器面固化）=`--resume <title> -n <title>`（M 面 10-13 冷启同款）。首启毕即建立 title·后续复活切 resume 形。
- cwd=/srv/fleet/TriMetaverse（项目根·M 面同构）。

## 13 席名册（M 面实锚映射 R 面）

| 会话名 | --agent | compass file |
| --- | --- | --- |
| r-duty-cao | ChiefAdministrativeOfficer | chief-administrative-officer |
| r-duty-cfo | ChiefFinancialOfficer | chief-financial-officer |
| r-duty-cho | ChiefHumanResourcesOfficer | chief-human-resources-officer |
| r-duty-cmo | ChiefMarketingOfficer | chief-marketing-officer |
| r-duty-coo | ChiefOperatingOfficer | chief-operating-officer |
| r-duty-cos | CEOChiefOfStaff | ceo-chief-of-staff |
| r-duty-cpo | ChiefProductOfficer | chief-product-officer |
| r-duty-cso | CustomerSuccessOfficer | customer-success-officer |
| r-duty-cto | ChiefTechnologyOfficer | chief-technology-officer |
| r-duty-fsd | FSD | full-stack-developer |
| r-duty-rdt | RAndDTrainer | rd-trainer |
| r-duty-sde | SeniorDeploymentEngineer | senior-deployment-engineer |
| r-duty-ste | STE | senior-test-engineer |

## 施工序（本卷 commit 后执行）

1. 抽验 1 席（r-duty-sde·本席同构位）→pane 活体+env 护栏断言（/proc/<pid>/environ 查两变量·零打印值面只断言在/不在）。
2. 抽验过→其余 12 席批量冷启。
3. 活体断言：tmux 13 会话在册+claude 进程计数+pane command 面。

## 止损（任务书 §二 序1）

- tmux kill-server 全清回零会话态（现态零会话=回退基线即原态）·零残留断言 pgrep。

## 使用依据

- COO 复核 03:30:56+在轨确认 03:33:20（形②认·窗内施工授权·04:30 监控点）
- M 面活体实锚（03:30-03:32 只读勘验）：13 会话正形/启动命令/settings/duty-env/compass/8460 代理 unit
- D-46（值面管道直传零打印）/D-54（消费对象=R 面 13 席 claude CLI 新消费点·非轮换·M 面值不动）/D-47（落款现查）
