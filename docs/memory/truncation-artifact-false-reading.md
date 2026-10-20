# 截断伪影=假读数家族（泄值与缺失双向）

> 2026-10-03 A 层窗实证，BOD 定性案二笔（值面回显族 10-02 首笔+本笔缺失变体）

- **机制**：对含值行做定长截断显示（awk substr(...,N,len)/cut -c/head -c）时，截断边界落点制造两类假读数——①**泄值向**：键名提取截错边界把值头带进输出（10-02 channel.cmd 三 token 案）；②**缺失向**：值尾被切掉产生假名/假短值，被当完整值引用（本笔：`substr(toupper($0),5,40)` 40 字符恰丢行尾「NEL」，`trilc-channel` 显成假名「TRILC-CHAN」，据此误报「切空数据面」观察点，CTO 勘定销案 b4bf42b8）。
- **防线**：键名面输出用 `-F= '{print $1}'`（按分隔符取段，不定长）；必须显示值片段时只取**尾部**固定 N 字符（指纹面）不取头部不定长段；显示段长度 vs 全行长（length($0)）不一致=伪影信号禁放过；截断边界读数禁当完整值写卷。
- **同族坑**：schtasks CSV GBK 编码 grep 假阴性（编码向假读数）；bash `$` 双引号展开毁 WQL（转义向假读数）——假读数家族三向并档：编码毁匹配/转义毁语法/截断毁值面。
- **第四向·PS5.1 引号吞噬（LG-064 2026-10-05）**：计划任务 powershell.exe 5.1 原生传参吃内层双引号→远程 `find -newermt "-90 minutes"` 静默失败→假读数 LOGSFRESH=no（同串无引号段全好=单点伤极难察）。修=PS 字符串内远程命令一律单引号形（`''…''`）。
- **第五向·JSON 反序列化类型变形（LG-064 2026-10-05）**：pwsh7 ConvertFrom-Json 把 ISO-Z 串转 DateTime 对象，经 culture ToString 丢 Kind→裸数字按本地时区读→+8h 幻影 stale（6 健康job 全误报；PS5.1 同 API 保持 String 恒正确=双宿主分叉）；修=DateTime→`ToString('o')` 回环保 Z→`[DateTimeOffset]::Parse(s, InvariantCulture, AssumeUniversal)`。教训=跨宿主解析面禁依赖隐式类型转换，时间戳全程字符串形态传递。
- **家族总图（五向）**：编码毁匹配/转义毁语法/截断毁值面/PS5.1 引号吞噬毁远程命令/JSON 类型变形毁时戳。共同根式=「中间层隐式变形+静默失败无报错」——假读数识别信号=单点伤（同串他段全好）/双宿主行为分叉/读数与旁证矛盾。
- **超限向处置正形（LG-058 R2 2026-10-06，STE 供料并档）**：工具输出超限被截断时禁凭截断显示下结论——正形=先 token 正则族扫描判 NONE/非 NONE，后 raw_decode 切片+SCRIPT 排除收敛重跑取全量；「显示长≠全行长」时切片重跑是唯一可入卷读数。锚=2026-W41/trees/lg058-remediation-20261006/ste-r2/ste-r2-walkthrough-20261006.md §五 安全注记。
- **第六向·grep 猜名假阴性（LG-066 实勘 2026-10-09 01:2x，CTO 自勘自纠）**：找 trirmc 系服务却 `grep -i trim`——`trirmc` 不含连续子串 `trim`（t-r-i-**r**-m-c），连续两轮读数「unit 不在 list」全系模式假阴性，第三轮 `systemctl show -p FragmentPath` 推翻（双 unit enabled 在位）。识别信号=「缺席断言」与旁证矛盾（systemctl cat 却有内容）。正形=**服务名探查禁 grep 猜名，直接 systemctl show/status/cat 定名定路径**；缺席断言前先验模式本身能否命中已知真值（grep trim 预置 trimodel 作阳性对照）。
- **第七向·ETS 注记属性经序列化毁 payload（LG-066 耦合缺陷 2026-10-10 FSD 勘呈·CTO 裁 APPROVE）**：PS 5.1 `Get-Content` 返回的字符串带 ETS 注记属性（PSPath/PSDrive/ReadCount 系），ConvertTo-Json 深度序列化时把注记一并打包→payload 里 title 从纯字符串变嵌套对象（1044B vs pwsh7 288B 抓包实证）→服务端 title 严格校验拒 400——**静默失效 3 天**（10-07→10-10）才被 FSD 抓包勘出。同族坑分野：新鲜告警 title 系脚本内拼串无注记故 200 不受影响=只有特定路径死（单点伤典型形）。修=`[string]$pl[0]` 强转剥注记（最小面正形）；防线=**跨网络 payload 禁把 Get-Content 原始对象直接入 ConvertTo-Json，序列化前强转标量**+外部通道失败必落 status 日志（静默失效=观测缺口是缺陷的第二半，本次 catch 升必做即此教训）。
- **第八向·date -uFormat 返回本地值贴 Z 尾（mc_link token 窗 2026-10-14 11:06 FSD 自检抓获）**：毕报落款前 date 现查用 `date -uFormat '%Y-%m-%dT%H:%M:%SZ'` 单跑，返回 `11:06:36Z`——**Z 尾贴在本地时间上**（同秒 Get-Date=11:06:36·而 healthz serverTime 旁证=03:05Z 同窗）——该调用形在本机工具环境未按 UTC 输出（期望 UTC 实得本地·静默差 8h·机理未究如实注）。识别信号兑现=「读数与旁证矛盾」（daemon 时钟 03:0xZ vs date 读数 11:0xZ 同窗并见即抓获）。与第五向同族异形：第五向=JSON Kind 丢失误按本地读 ISO 串；第八向=UTC 取值函数本身返本地值。正形=**UTC 落款源用 `[DateTime]::UtcNow.ToString('yyyy-MM-ddTHH:mm:ssZ')`（权威·零中间层）或 Get-Date -AsUTC；`date -uFormat` 单跑禁作 UTC 落款源**；落款前对旁证时钟（服务 serverTime/daemon log）交叉一眼。
- **hash 比对形态律（同窗 BOD 复核定谳 2026-10-14 11:09 并档）**：BOD 令① hash 读数（943e/ac52）与 FSD 侧实测（fd9d）对不上——根因=**BOD 两侧管道形态不同**（河源 Linux 管道无 tr·本机 Git Bash 管道 tr -d '\r'+尾态差异）→hash 跨形态比对无意义（BOD 自领方法论瑕疵·核心定性由修复实证独立背书不受影响）。正形=**hash 比对须同法同源同管道形态**（FSD 14 组合法：多算法×多形态双面测+活体 environ 直读为终极正确源）；跨形态 hash 矛盾先疑比对方法非值本身。
- **第九向·跑法分叉 glob 部分集（STE 段 2a 验证窗 2026-10-20 自查入卷·卷=TriCompany/docs/testing/trilc-dp-seg2a-acp-verify-20261020.md 3b0d430）**：bash 直跑 `node --test **/*.test.ts` 系 `**` glob **单层退化**得 235 案部分集（非全量·静默无报错）——与 npm test 正形 758 对平才暴露。识别信号=「全量」断言值面与已知基线对不上（757→235 差距过大）。正形=**仓测试全量验证一律走 package.json 定义入口（npm test）**，直跑 glob/通配形态禁作「全量」读数源；跨跑法读数矛盾先疑 glob 展开层非测试本体。
- **家族总图（九向）**：编码毁匹配/转义毁语法/截断毁值面/PS5.1 引号吞噬毁远程命令/JSON 类型变形毁时戳/grep 猜名毁模式命中/ETS 注记毁序列化 payload/date -uFormat 时区变形毁 UTC 落款/**跑法分叉 glob 单层退化毁全量面**。共同根式=「中间层隐式变形+静默失败无报错」——假读数识别信号=单点伤（同串他段全好）/双宿主行为分叉/读数与旁证矛盾/**静默期与故障起点时点对不上就先抓包对值面**。


## 索引行全量快照（2026-10-13 16:0x CAO 压缩施工·MEMORY.md 裁短前存档·细节权威位=本文件历史段+本快照）

- [截断伪影=假读数家族](truncation-artifact-false-reading.md) — 定长截断显示双向造假：泄值向（10-02 值头带出案）+缺失向（substr 40 字符丢行尾 NEL→trilc-channel 显成假名 TRILC-CHAN→误报切空面观察点，CTO 勘定销案 b4bf42b8）；键名面用 -F= 取段不定长、值片段只取尾指纹、显示长≠全行长=伪影信号；家族五向并档（10-05 LG-064 扩）：编码毁匹配/转义毁语法/截断毁值面/**PS5.1 引号吞噬毁远程命令**/**pwsh7 JSON DateTime 类型变形毁时戳（+8h 幻影，'o' 回环+Invariant+AssumeUniversal 修）**；共同根式=中间层隐式变形+静默失败，识别信号=单点伤/双宿主分叉/读数与旁证矛盾
