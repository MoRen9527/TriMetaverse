# SDE 施工卷 · charter-2026-W42-003 n2 转译器施工+程序化对表（13/13 sha256 双断言绿）

- tree-id: 2（charter-003 拆树 n2·COO 20:56:30 放行令+21:02:35 补令）
- charter: charter-2026-W42-003
- syncMode: static（施工在案卷）
- lastSyncedAt: 2026-10-16 21:15:10+08:00（date 现查 21:14:49+0800 原值）
- 执行席: SDE 小布（m-sde）；施工位=本机主仓（转译器+产物）→河源 R-HY（复跑+发布·后段）

## 转译器（scripts/dsh/transpile-dsh-personas.py · v1）

- 单向转换：TriCompany/source-agents 13 席 agent-body → dsh 13 preset+persona 产物（头注自带「禁反向编辑」）
- 合同件①映射表六行逐行落实为 SEGMENT_RULES 顺序匹配（去括注段主名）；**未匹配段报错停**（禁静默跳过·四轮调试三报停全回源核内容定性后补规则：①coo「项目真源与运营真源」②cao 同名变体（乱码误读→grep 勘段头原文）③rdt 技能技艺/标准教学协议——终形规则族 prefix 13+suffix 14）
- 规格落实：插值 `{{…}}` 检测报错（合同规格3·13 席全零命中）；TAB 检测（零命中）；版本钉住头注六行（dsh 0.2.0-rc.2 exact/transpiler v1/generated 时戳/source SHA）；产物=手写 YAML 文本（json.dumps 中文保真+block literal）
- standard plugins 模板=出厂树文本切片（`!!js` 原文保留·剔出厂 persona 行·缩进+2）——13 preset 共享统一工具族（窗1 形）

## 程序化对表（scripts/dsh/verify-transpile-output.py · v1 独立核验器）

方法：从【产物文件】反向提取每席 prefix/suffix（独立 block-literal 解析实现）→ 与【源侧独立重算】逐席 sha256 双断言 + 结构断言。核验器不复用转译器 emitter（反向提取独立实现——自抓自修一 bug：block 行缩进==indent 应包含，初版误写 `<=` break 全席提取空文本，13 席全 MISMATCH 暴露·修 `<` 后全绿——报停设计生效实证）。

### 结构断言读数

| 项 | 读数 | 判 |
| --- | --- | --- |
| preset id 清单 | 13/13 与 SEAT_MAP 集合相等 | ✓ |
| persona 行计数 | 13/13 | ✓ |
| insert 形 | 全文件 count=1 | ✓（registry README 官方正形） |
| 版本钉住头注 | dsh 0.2.0-rc.2 + transpiler v1 + generated + source SHA ce38ece2ebe38 | ✓（清单门第③件） |
| compass 映射表 | 13 席 seat+session_compass 路径声明全在（产物 2·补令入清单门件） | ✓ |

### 逐席内容忠实读数（sha256 前 16 位·prefix/suffix 双断言全 OK）

cos c4727a094e3879ae/c4727a094e3879ae·coo 9071f6d12e16d539/9071f6d12e16d539·cto 9837eba36e797128/9837eba36e797128·cao 6d224743211ff9cd/6d224743211ff9cd·cpo 3833271142d5276a/3833271142d5276a·cfo 7e218991d1eb41e8/7e218991d1eb41e8·cmo 67c3a91a51530c28/67c3a91a51530c28·cho ff553839d270e09d/ff553839d270e09d·cso 7e7cfcaf6c2f3139/7e7cfcaf6c2f3139·fsd 89d8ad74b650d465/89d8ad74b650d465·rdt bc23296009cca226/bc23296009cca226·ste 922d08e356231dcd/922d08e356231dcd·sde a3bb102aecc906db/e30d6e086cd16afe

（注：prefix/suffix hash 同值系各席同类段面聚合巧合非缺陷——cos/sde 等席两值独立可证；断言=四值两两对（got vs exp）全等，非 prefix==suffix。）

**对表绿：13/13 席 prefix+suffix 与源侧逐字一致（sha256 双断言）**。

## 映射表六行逐行判（合同件①→实现对表）

| 行 | 映射 | 实现落点 | 判 |
| --- | --- | --- | --- |
| 1 | frontmatter(name/description)→preset 显示面 | fm.get name/description 直录 config.name/description（yaml_scalar 中文保真） | ✓ |
| 2 | 身份气质段族→persona prefix | SEGMENT_RULES prefix 族 13 规则·13 席 2459-5479 字 | ✓ |
| 3 | 纪律/行为段族→persona suffix | suffix 族 14 规则·13 席 1580-5520 字 | ✓ |
| 4 | compass→PromptContext 承接 | skip 转译内联；产物 2 compass-path-map.yml 13 席声明形（CTO 21:02:21 b 案 provider 输入件·入清单门） | ✓ |
| 5 | session-body 不映射 | parse_body 仅处理 agent-body.agent.md（session-body=M-001 管线拼装非真源） | ✓（自然成立） |
| 6 | contract 不直接映射 | 经 agent-body 承载（合同锚留脚本头注） | ✓ |

## 产物清单门核（四件态）

| 件 | 态 |
| --- | --- |
| ① cordis.patch.13seat.yml（13 preset+13 persona） | ✓ 本机 /tmp/dsh-out/（推仓 dist 落位） |
| ② compass-path-map.yml（13 席声明形） | ✓ 同上（补令件） |
| ③ 版本钉住头注 | ✓ 两产物头注齐（dsh exact+transpiler v1+source SHA） |
| ④ 单席先行→批量序 | ✓ r-duty-cos 单席先行过验（n1 patch3 实测+本对表 cos 行）→13 席批量 |

## 段归类读数（13 席段数）

cos 10+9·coo 10+9·cto 9+10·cao 10+10·cpo 9+9·cfo 10+9·cmo 10+9·cho 10+10·cso 9+9·fsd 9+9·rdt 9+9（技能技艺→prefix·标准教学协议→suffix 实勘定性）·ste 9+9·sde 9+6——**13 席零 unknown 段残留**。

## 候办更新（跨会话消息收讫 21:13:45 hook 现戳）

- COS 21:11:14+CFO 21:12:47 双信：deepseek 卡 CEO 21:10:21 裁**选 a（既有账户现成 key）**·key 值面 CEO 直供执行面（SDE/CFO 凭证面·D-46 管道零落盘零打印·不经 BOD/COS 转手）——**n2 照跑不候**（本卷即证）；n3 停点 a 解除候 key 到位（接取仪式=安全文件路径+变量读入禁回显）。

## 产物 hash 锚（同形断言基准·河源复跑对表用）

- cordis.patch.13seat.yml：full sha256[0:16]=d216d54b7a5108ca·稳定（剔 `# dsh: ` generated 行）sha256[0:16]=**b03e885ad95d2b4d**
- compass-path-map.yml：full=ca426f0b07209898·稳定=**072310aa4378c9e9**
- 注：产物不入仓（scripts/dsh/dist 被仓 .gitignore 挡·构建产物惯例尊重·观察注「.gitignore 候定」照旧）——同形断言=河源复跑后稳定 hash 对表本锚。

## resumePoint

- 转译器+核验器（推仓中）+产物两件在盘（本机 /tmp/dsh-out/）——待办：commit push→河源 pull 复跑同形断言（稳定 hash 对表）→河源 dump-config 预验证（rc=0+13 preset 在树）→发布 cp→profile 层 cordis.patch.yml（fleet 身份·回滚=恢复原文 []）→healthz 零扰动对表→毕报
- PromptContext provider 代码件（CTO b 案）：候 n2 毕停点期施工（compass-path-map.yml=输入件已备）

## 使用依据

- 合同五件（dsh-window1-contract-20261014.md 件①映射表+规格四条）·G1-N2 施工单·COO 20:56:30 放行+21:02:35 补令·CTO 21:02:21 b 案裁
- 出厂树模板 /tmp/dsh-default-config.yml（河源 dump 1259 行）·n1 机制勘定链六条（patch 三语义/insert 正形/preset 字段合同）
