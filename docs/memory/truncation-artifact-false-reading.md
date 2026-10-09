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

