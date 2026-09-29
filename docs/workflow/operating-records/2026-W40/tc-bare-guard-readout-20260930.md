# TC bare 加固两件执行读数卷（D-15 派工·SDE 小布）

- sourceOfTruth: 本件（CTO D-15 施工令：refspec 去 `+` 主修+bare 仓级 denyNonFastForwards 纵深）
- syncMode: source-only
- lastSyncedAt: 2026-09-30T04:02+0800（date 现查；施工窗 03:44-03:55+CTO 验收批执行 03:56-04:00 sg 面）
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

## 使用依据

- 令文：CTO D-15 派工令 03:42（验证两步禁盲改+纪律三条+告警锚要求）
- 盘面实锚：/home/fleet/bare-fetch-all.sh（bak-20260930T0349+0800）+bare-fetch-all.log+/srv/git/20 bare config
- 读数实锚：LOG 03:47 整轮 40 行精算/03:50:18+03:50:36 TriTest 双行/rev-parse 三探 68fd1586/ls-remote github d841fbf5
- 纪律：D-04（时刻现查）/fleet 身份操作（防属主污染）/掩码（ghp_）/留痕制/不越界（ TriCompany 补推不自裁）
