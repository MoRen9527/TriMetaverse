# F1 补丁·CTO 复验裁定卷（候批项闭环核·TC a1488a9）

- date 现查: 2026-11-19 00:2x CST（D-47）
- 复验人: CTO 小狄（复验位·bd1786e2d 候批项 F1 闭环面）
- 复验形: diff 全读+白盒自跑+双代 sync 现勘

## 复验裁定：**PASS（F1 候批项闭环成立·ns4 窗前落位达成）——附微观察一条（非阻塞）**

## 复验读数

| 面 | 我席独立复勘 | 判 |
|---|---|---|
| 形 B 勘定采认 | 四点勘据（设计内挂起非异常／催办单值源归 gate 72h／观测面 stdout+journal 零丢失／SMTP 噪音消除）——与我席补丁形两案（distinct subject／静默 log）中**形 B 成立**：催办语义已在 gate 单值源·再发 distinct subject=重复面，静默 log=正确择形 ✓ | ✓ |
| 三案落码 | diff 全读：exit 4→静默 log（stdout flush·零 SMTP·return 0）✓；exit 5→terminated 停用知会 SMTP（distinct subject「terminated 停用知会」·context_id=weekly-shift-terminated·failure 面 stderr+return 5 可观测）✓；其余码→P1 改点 C 原形零动（落穿原链失败告警路径·exit 2 实证钉=白盒第三案）✓；main(argv) 参数化=向后兼容 ✓ | ✓ |
| 白盒 | F1ExitCodeAwareTest **3/3 我席自跑 OK**（exit 4 零 SMTP／exit 5 distinct subject／其余码原形）✓ | ✓ |
| 链面零扰 | trap 语义核：notify 件返回值不影响链 exit（`|| true`+trap 捕获后原 exit 保持）——exit 4 挂起态链退出语义原样 ✓ | ✓ |
| 双代 sync | sg origin/dev HEAD=**a1488a9**（已推 bare ✓）+heyuan HEAD=**a1488a9** 现勘 ✓（双代闭合·无推漏复发） | ✓ |

## 微观察（一条·非阻塞）

exit 5 停用知会=每窗重复（裁决 terminate 在卷且 job 未 disable 期间，下窗 preflight 再 exit 5→再知会）——**重复直至值席执行 cron disable 止**：语义可读作「停用催办提醒」（非缺陷）；若嫌重复，候维护窗可加 .done 防重（同 probe 幂等形）——候裁不阻。

## 闭环确认

bd1786e2d 复验卷候批项 F1=**闭环**（补丁落位+双代 sync+ns4 窗前达成）——ns4 起 awaiting 期零 SMTP 误框、gate 72h 催办=唯一催办语义源、terminated=一次性停用知会面。等待语义线（notice-199 勘定→202 施工→202 复验→F1 补丁→F1 复验）五环全闭。

## 使用依据

TC a1488a9 diff 全读；F1ExitCodeAwareTest 3/3 自跑；py_compile；双代 HEAD 现勘；bd1786e2d 候批项原文；D-47。
