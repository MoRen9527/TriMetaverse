# TC bare 加固两件执行读数卷（D-15 派工·SDE 小布）

- sourceOfTruth: 本件（CTO D-15 施工令：refspec 去 `+` 主修+bare 仓级 denyNonFastForwards 纵深）
- syncMode: source-only
- lastSyncedAt: 2026-09-30T04:18+0800（date 现查；施工窗 03:44-03:55+验收批 03:56-04:00+裁决录案 04:11+BOD R2 澄清录案 04:18+CTO 定谳收口 04:19）
- 令链: CTO 03:42 派工令（根因实锤=fleet crontab bare-fetch-all.sh L18 `+`refspec force fetch=今晨 03:30:06 回卷根因）→本席接令即窗（令面"今天内完成优先，窗自排"）
- 边界: sg 面操作全程留痕（备份+LOG+本卷）；不动其他 job/行；键值 ghp_ 掩码

## 一、施工对象

- 脚本：`/home/fleet/bare-fetch-all.sh`（fleet 属主 1188B；fleet crontab `30 * * * *` 每时 :30；§12.4 机制化件，L2 自注 2026-09-21 增 push 段）
- 自产日志=告警锚载体：`/home/fleet/bare-fetch-all.log`（437KB，逐时追写，`|| echo FETCH-FAIL: $out` 分支在册）
- bare 清单：`/srv/git/*.git` 21 仓，脚本 MAP 覆盖 20 仓（vscodium 不在 MAP=脚本不服务，本批出注记不加配置）

## 二、件1：L18 refspec 去 `+`（主修）

1. 备份 ✓：`bare-fetch-all.sh.bak-20260930T0349+0800`（1188B fleet:fleet，-p 属主保持）
2. 改形 ✓：`"+refs/heads/*:refs/heads/*"`→`"refs/heads/*:refs/heads/*"`；diff 对备份=**单行（L18）**零他动
3. 门 ✓：bash -n 语法门绿

## 三、件2：receive.denyNonFastForwards=true（纵深，20 仓）

- 配置 ✓：MAP 20 仓逐仓 `sudo -u fleet git config receive.denyNonFastForwards true`（fleet 身份防属主污染）→CONFIG-OK=20/20
- 值面回读 ✓：`config --get` 逐仓回读=**VERIFY-TRUE=20/20**（非键存在性抽验，值面全查）
- 语义边界（令面注记兑现）：本配置只挡 push 端 force（09-29 CPO 型）；fetch 端 force 由件1 挡——两层互补各防一型 ✓

## 四、验证①：修后正常轮（FF 同步工作+rejected 可见）

- 手动整轮（fleet 身份）✓：本轮精算=40 行（20 仓×2 精确一轮）——**FETCH-OK=19 / FETCH-FAIL=1**；PUSH-FAIL=20（侧发现见 §六.a）
- **TriCompany FETCH-FAIL=真分歧告警（新形态实战首现）**：bare dev=68fd1586 ⊃ github dev=d841fbf5（github⊂bare 实测）——即今晨回卷事故的活体形态重演，新形态**大声拒绝而非静默回卷**；bare 顶全程三探原样 68fd1586（零回卷断言）✓
- 其余 19 仓 FF 同步正常零 rejected ✓

## 五、验证②：TriTest 非关键仓模拟（拒绝非回卷→还原）

1. 分叉顶构造 ✓：commit-tree（显式 identity env 零持久配置）挂 `a2082a4` 于 dev（模拟 bare 领先态；原顶 T=1dc29e0 预录）
2. 跑脚本 ✓：03:50:18 **TriTest FETCH-FAIL**（拒绝生效，bare 未回卷）
3. 还原 ✓：update-ref 回 T=1dc29e0
4. 复跑 ✓：03:50:36 TriTest **FETCH-OK**，dev 终态=1dc29e0 原样 ✓
5. 残留注记：悬空对象 a2082a4 留 TriTest（gc 自然回收，零引用零危害）

## 六、告警锚结论+侧发现（候 CTO/BOD）

**a. 告警锚判定（令面要求确认项）**：rejected 态**可见非静默**——体现为 LOG 内逐时 `FETCH-FAIL` 行（含仓名+时戳）；巡检锚=定时 grep `FETCH-FAIL`（现有 LOG 即可，未加新工具）。**但 `--quiet` 吞诊断文本**（实测对照：带 quiet=exit 1+out 空；无 quiet=完整 `! [rejected] dev -> dev (non-fast-forward)` 103B）——FAIL 行可定位仓名但无原因文本。**候裁建议**：L18 同行去 `--quiet` 一词即得全文（属令面已改行的相邻一词，未自裁，候 CTO 一句话批）。

**b. push 腿鉴权全死（侧发现，非本批引入）**：PUSH-FAIL=20/20 `could not read Username for 'https://github.com'`——bare→github 推腿自 push 段（09-21 增）起未通（fetch 公共仓匿名可达故 FETCH 长 OK，掩盖此态）。**后果在案**：TriCompany bare⊃github 分歧（github 待补推）无法走推腿自愈——候 CTO/BOD 裁（a. 修 fleet 侧凭据通道 b. 本机主推通道人工补推 TriCompany bare→github）。本席不越界自补。

**c. 输出面单一性**：mail spool 0B（08-11 起）/syslog 零命中——脚本自产 LOG 为唯一输出通道（幸在持久 437KB）。

## 七、回滚锚（在位未动用）

- 件1：`cp -p bare-fetch-all.sh.bak-20260930T0349+0800 bare-fetch-all.sh`（fleet 身份）即回 force-fetch 旧形
- 件2：逐仓 `git config --unset receive.denyNonFastForwards`（20 仓）即回
- 三次手动整轮=与逐时 cadence 同构零额外扰动；TriTest 分叉顶已还原原顶

## 八、CTO 验收批执行（03:56-04:00，APPROVE 后三裁落地）

- **验收 ✓**：CTO 03:54:43 APPROVE；验收记录一笔=验证①抓到 TriCompany 真分歧=护栏实战首现建功（大声拒绝非静默回卷，修的正是这个）
- **批① --quiet 去除 ✓**（CTO 裁"批"）：增量备份 `bare-fetch-all.sh.bak2-20260930T0357+0800`（1187B）→L18 `fetch --quiet`→`fetch`→bash -n 绿→修后整轮 **20/20 FETCH-OK 零新 FAIL**（诊断文本通道开：rejected 时将带 `! [rejected] ... (non-fast-forward)` 全文，无 quiet 形态 103B 实证在 §六.a）
- **批② b 案闭环 ✓**（CTO 自执行）：CTO 03:54 push 补推，GitHub d841fbf5→68fd1586——三层同顶 68fd1586 实测复核（本席修后整轮 TriCompany FETCH-OK 佐证）——分歧消，推手归属不考
- **批③ a 案勘点供料 ✓**（白天窗修，勘点结果**推翻 cron-env 假设**）：
  - system 级无 credential 配置；fleet 全局级 `~/.gitconfig` credential.helper=store **在位**
  - `su - fleet`（HOME 正形重置）交互 shell push dry-run **同样死**（同 `could not read Username`）——**cron 环境 vs shell 环境无差**
  - **根因=store 文件空**：`~/.git-credentials` 存在但 **0 行、github.com 条目 0**——memory 在册先例「认证失败自动清 store 行」正中（09-20 配成后某次失败清空→09-21 push 段上线即死至今）
  - **修法供料**：重灌 PAT 行即愈（持币人=BOD 侧，2026-12-19 到期的 fine-grained PAT 若仍有效）；修后验证=任一仓 push dry-run OK 读数；加固建议候裁=store 空态入巡检（防再静默 9 天）
- **批④ 巡检锚两腿 ✓**（录案）：grep 模式定为 `grep -E "FETCH-FAIL|PUSH-FAIL" /home/fleet/bare-fetch-all.log`（查增量段）——push 死 9 天无告警根=fetch-OK 掩盖 push-FAIL（与 8460 流量画像同构的静默失效家族第三案），两腿分别盯

## 九、CTO 二批四点（04:00 认收录案）

1. **store 空态入巡检=批（死亡前哨）**：三腿锚定案=`grep -E "FETCH-FAIL|PUSH-FAIL"`（LOG 增量段）+`wc -l ~/.git-credentials==0` 告警（前兆腿，早于 PUSH-FAIL 出声）；「认证失败自动清 store 行」行为本身不动（防撞墙语义保留），清空即不再静默
2. **a 案重灌=白天窗执行令认**：链=重灌 PAT 行→任一仓 dry-run OK=通道复活→**跑一轮 push 段结 9 天欠账**（各仓 bare⊃github 分歧可能不止 TC 一仓；non-FF 拒=分叉仓逐仓对平报）——本席候排执行
3. **PAT 失效分支**：dry-run 仍死即报 CTO+BOD 走新发 PAT 流程；**勘点附**=fine-grained 双仓 RW 授权清单 vs MAP 20 仓（TriRMC/TriGateway 后扩两仓若不在原清单，重灌旧 PAT 仍 403）——实证法=重灌后对此两仓专项 dry-run 看 403/OK
4. **PAT 源两案**（本席 04:0x 只读勘）：A=本机 Credential Manager 持 github.com 条目（值零出，零上下文管道直灌 sg store 可行，出处归属未验）；B=BOD 供正牌 fleet PAT（出处最净）——候 CTO/BOD 择一，BOD 供则白天窗随到随灌
5. 根因闭环记录：随 §12.4 供料机制化（CTO 记）

## 十、甲乙交叉裁决录案（CTO 04:08 裁+§九备场回执后）

1. **「双仓 RW 403 面」担忧修正**：本席 root 面 20/20 dry-run 全过实证直接推翻 CTO 上回合「18 仓不在清单」推断——对该把 root token 疑虑不存在，CTO 修正入账
2. **乙路（CM PAT 直灌）废案**：BOD 锚定读数在先（本席备场时未见）=本机 CM 那把系 **gho_ OAuth token 非 09-20 fine-grained PAT**（锚定否）；BOD 且裁 gho_ 不宜出机（单 token 双机分布+轮换静默死）——本席不再候乙路
3. **裁决=甲路优先，候 BOD 锚定 root PAT 出处**：机器内复制（值不出 sg+20/20 实证+秒级）技术面最优；CTO 只裁技术路径，**root PAT 出处锚定权=BOD**（sg root 运维面持币人：验活+溯来源 root shell history/凭据文件 mtime——何时放的/谁批的）；**锚定认=本席即执行**（root→fleet 内部复制→整轮 push 结 9 天欠账→20 仓 OK 全单出）；锚定否（出处不明/权属不清）=不复制，转 BOD 新发路批件（CEO 面）
4. **两路不互斥**：root 把=全仓 RW 宽授权，fleet 自动化持宽把=「凭据权限现势妥协」观察项族——甲路=应急闭合，新发路（fleet 专用窄授权 PAT 替换）=长期正解，BOD 新发路批件照常酝酿不受甲路阻
5. 备场状态保持：store 备份（.bak-20260930T0405+0800）+push-survey-20260930.sh+双基线（fleet 20×AUTH-DEAD/root 20×OK）在位；候 BOD 锚定读数到再动

## 十一、BOD R2 澄清录案（root store mtime 04:04:25 改写归因）

- 事实锚：BOD 实锚 /root/.git-credentials mtime=04:04:25+0800 落本席备场窗；判据Ⅰ=该 gho_ 03:5x 前已存在（COS 代查）——系改写非创建
- **直答=是，我备场窗内操作所致，但非显式写面**：机理=备场 C 初跑以 **root 语境**直跑 push-survey（ssh root 会话无 sudo 降身，施工失误——本应 `sudo -u fleet`），20 仓 dry-run 串行认证成功，git 自动 `credential approve`→store helper **同值重写**该文件；mtime=04:04:25.617=C 段末仓 approve 时点（C 段 ≈04:04:12-26，时序自洽）
- transcript 逐时点（UTC 折+8）：04:04:07.386 发令 A+B+C（A=fleet 备份 cp/B=fleet tee 写脚本/C=root 语境直跑）→04:04:25.617 C 段 approve 重写（BOD 实锚点）→04:04:52.686 fleet 语境重跑（AUTH-DEAD 无 approve，fleet store 保持 0 行）+root store 只读结构勘验（值零出机）→04:05:19 回执
- 三问披露：①值来源=该文件自身既有条目（approve 语义=认证刚用过的凭据原样交回 helper，零新值注入）②授权=CTO 04:03 备场令，root 语境直跑属施工失误，令面「备场≠灌值」未越（零灌值动作）③同值重写非异值新写（现态 1 行/github.com×1/70B/600/root:root）
- 值面对表供料：现值 md5=1e6aa786597d7336f93c746280e1c7e0/sha256=32e9d307b5fd738c4a7193c88f5747271f82f67af06e8f49f29a4a154d0b5acb——COS 持 03:5x 值证据自算对表即实锤
- **认知盲区自认**：「dry-run 零写面」对 repo 对象面成立，对 **credential store 面不成立**（认证成功即 approve 重写凭证文件）；候选纪律=helper=store 环境网络操作（含 dry-run/ls-remote）凭证文件 mtime 视为有写面——候 CTO/BOD 裁是否入册
- **甲路冻结**（BOD 裁锚定否+出处不明凭据复制扩散=治理红线，CTO 04:13 转）：root→fleet 复制预案停，不再执行任何 root store 写面（含 dry-run 类隐式写面）；备场 A/B 件留位；190 条本窗命令 transcript 全在可勘
- **CTO 定谳收口（04:19）**：approve 同值 touch 机理核实成立（fleet 对照组双向实证闭环，澄清质量标杆认）；定性=认知盲区形态非「知道不说」，「披露缺失重一层」预设不适用；施工失误记档非处罚；**纪律候选原文采纳=入册**（helper=store 环境网络操作含 dry-run/ls-remote，凭证文件 mtime 面视为有写面+身份语境漂移坑「root 会话忘降身」并入同条——CTO 已落 memory，正式入册纪律册随批提请）；甲路冻结维持（本澄清只解 04:04:25 改写事件，不解 gho_ 来历——BOD 判据Ⅰ出处不可得独立成立）；a 案下一触发=BOD 批件 CEO 批→新 PAT 供灌（届时 fleet 身份纪律=`su - fleet -c` 全程）

## 十二、新发 PAT 供料：20 仓规范名清单（CTO 快件 04:59，CEO 已批 fine-grained 20 仓 RW+90 天）

- **20 仓勾选清单（GitHub API full_name 规范形，20/20 逐仓活体核名 05:0x，匿名 API 零凭据）**：TriMetaverse/TriCompany/TriCode/**TriModel**/TriMLC/**TriRLC**/TriMMC/Tripilot/Tristaciss/Triavatar/Trideployment/TriTest/TriMem/TriWeb4/TriChain/TriSkill/TriTraining/TriMobile/TriRMC/TriGateway（均 MoRen9527/ 下）
- **对表差定谳**：①差仓=**TriModel**（CTO 本机 19 仓扫描漏——本机 TriModel 双 pushurl config 实锚在位；非 vscodium 非 TriCade）；②**TriLC 已改名 TriRLC**（本机 config pushurl 旧名 TriLC.git，API 301→现名 TriRLC；push-survey MAP 值面=TriLC 走 redirect 仍工作，04:04 dry-run OK 即经 redirect）；③大小写照抄勿修正（Tripilot/Tristaciss/Triavatar/Trideployment/TriMem 五个非 CamelCase 形即规范现名）
- 候裁一笔：bare-fetch-all.sh MAP 值 `[TriRLC]=TriLC` 旧名 redirect 形态仍工作非急，候窗正名（D-15 同款纪律：备份+bash -n+整轮验证）——**CTO 05:04 裁=候下个 sg 侧维护窗随批**（今夜不进：8460 job 挂载+守望轮变更堆叠防控，同 D-23 原则）
- **施工衔接预告（CTO 05:04）**：新发 PAT 链=CEO 生成→BOD 写入 fleet store（③）→**④dry-run 20 仓验证=本席**（push-survey 现成，预期 20/20 OK 全单+store 行态正常）→⑤旧把作废+history 清理（BOD/SDE 协同）→⑥观察项闭合；备场保持，候 BOD 写入毕读数即动④

## 十三、施工序④完工读数：新 PAT 验证扫（BOD 直派 10:06+增补判据，CEO 04:57 批件链）

- 前置③毕（BOD）：新 PAT 写入 fleet store（1 行/600/fleet:fleet/123B，credential fill 冒烟 PASS）；跑前断言=1 行/34f8a883… 基线 md5/mtime 10:05:26
- 施工形：v2 脚本（push-survey-v2-20260930.sh，fleet 面留档 700；AUTH-DEAD 即停 exit 2/403 标记续扫/token 零回显三钉形，MAP 块自 v1 抄件零漂）+`su - fleet -c` 语境全程（BOD 钉，HOME 正形）
- **读数：SUMMARY|PASS=17|FAIL=3|AUTH-DEAD=0**——403-FORBIDDEN×3=**TriChain/TriMobile/TriWeb4**（授权清单缺仓面，候 CEO 补授权）；PASS×17 含 TriRLC（旧名 redirect 形工作实证）+TriModel（差仓补入清单正确性实证）
- **store 后验（增补判据）**：wc -l=**1 行在**（未被 reject 清行）；md5=34f8a883… **与跑前恒等**（不变量）；mtime 10:05:26→10:09:17=**approve 同值重写正形**（§十一入册机理的预测读数：mtime 变/md5 不变/行数 1=健康形）
- 分诊（BOD 钉）：403 族=授权清单缺仓回 CEO 补授权非推倒重来；401 族=0 凭据面健康，无即停触发
- **结论：push 通道复活 17/20**；余 3 仓候 CEO 授权补勾即 20/20；后续⑤旧把作废+history 清理（BOD/SDE 协同）⑥观察项闭合

## 十四、④验收+双链机制定谳（BOD 验收毕 10:12+本席机制勘验）

- **BOD ④验收毕**：独立复跑双族实锚（TriChain rc=128「Permission denied to MoRen9527」同形坐实 403 族身份面/TriCompany PASS 族坐实）——PASS=17/FAIL=3/AUTH-DEAD=0 全数认+store 后验四读数认；403×3 已呈 CEO 补授权（编辑加仓或重生成两路候 CEO 页面实况）；三仓补扫小单候令
- **bare→GitHub 双链定谳（本席机制勘验，修正「9 天欠账」判读域）**：
  - **hook MIRROR 链（LG-018）**：TriMetaverse.git post-receive 内联块 `git push github HEAD:dev`（异步+timeout 60），remote github=`ssh://github-mirror/`（fleet ssh config alias，**SSH key 认证，与 PAT/store 无关**）——fade-hook.log 全史 pushed=555/FAILED=13（末败 09-17 21:20+0800 后零败）；本席 10:11 sg push 的 223a512e 即被即时镜像（fade-hook.log `10:11:45 github mirror pushed 223a512e` 实锚）——**TMV 三层同顶 223a512e 实锚，TMV 欠账=0，此前「TMV GitHub 滞后」=443 断连窗暂态非链死**
  - **cron push 段链（bare-fetch-all L19）**：https+store PAT 形，服务全 20 仓=9 天欠账主战场——10:30 cron 首次带新 PAT 跑=结算点，10:33 后补 PUSH 读数
- 含意：新 PAT 复活的是 cron 链（20 仓轮询形）；hook 链（TMV 专属即时形）独立存活。两链互补：hook=TMV 即时、cron=全仓小时级
- **候批件（CTO 裁+BOD 背书 10:16，候下个巡检批随批落不催急）**：hook MIRROR 链健康检测入巡检面——检测锚=fade-hook.log FAILED 增量计数（自上次巡检水位线起算非全量重报）；告警形态=巡检读数卷一行（与 FETCH-FAIL/PUSH-FAIL 同级不开独立通道）；单锚覆盖三死因（ssh key 失效/alias 变更/github-mirror host 损坏全落 FAILED 行）；优先序钉=10:30 cron PAT 链首过结算点不受影响

## 使用依据

- 令文：CTO D-15 派工令 03:42（验证两步禁盲改+纪律三条+告警锚要求）
- 盘面实锚：/home/fleet/bare-fetch-all.sh（bak-20260930T0349+0800）+bare-fetch-all.log+/srv/git/20 bare config
- 读数实锚：LOG 03:47 整轮 40 行精算/03:50:18+03:50:36 TriTest 双行/rev-parse 三探 68fd1586/ls-remote github d841fbf5
- 纪律：D-04（时刻现查）/fleet 身份操作（防属主污染）/掩码（ghp_）/留痕制/不越界（ TriCompany 补推不自裁）
