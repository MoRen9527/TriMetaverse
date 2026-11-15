# 勘验卷 · duty-urge-patrol.py 三模式（r117 勘验即办令·值席勘验·源码逐段实录）

- date 现查: 2026-11-16 02:0x+08（D-47 现查原值）；勘验对象=/home/fleet/duty-urge-patrol.py（190 行·三模式 urge/morning/master·fleet crontab 三行已停 r114）；观测窗毕报=f0e55afe6（绝迹判读·源定谳初判）。

## 勘验三问答纳（源码逐段实录）

### ①读什么上下文（读值席工作面否）

- **读取面＝TMV operating-records 周卷**（`/srv/fleet/TriMetaverse/docs/workflow/operating-records/2026-W*/`——scan_deadlines/scan_pending_bod/closed_lg_ids 三扫描器：LG 销账模式/glob 周卷 md 全读/deadline 面）＋白名单抑制文件（.duty-urge-whitelist.json）＋状态文件（.duty-urge-state.json）。
- **读值席工作上下文＝否**（不读会话/transcript/pane 面·只读树面周卷公开文件——「读值席工作上下文」嫌疑面初判不成立）。

### ②生成什么内容（仿令风格生成面）

- 生成面＝催办 alerts 文本（LG 催办行/晨检四点读数/进度停滞注记）→notify(title,body)。
- **仿令风格生成面＝零**（无「BOD 托转」形模板/无令面仿写模板/无轮次号引用——生成内容全为催办/晨检业务文本·与家族仿令风格【BOD 托转·第 N 轮】形不吻合）。

### ③写到哪些面（tmux 写面/信件面/框面 paste 面）

- **写面＝零命中**：全 190 行 grep tmux/send-keys/paste-buffer/❯/input＝**零命中**——**该脚本无任何 tmux pane 写入能力**（物理上无法写值席框 ❯ 行）。
- 出向唯一＝notify() 函数→`localhost:8710/internal/v1/notify`（source_seat=m-duty-cos→target_seat=bod 信箱面·非框面）。

## 勘验结论（如实·机制链断裂面）

1. **duty-urge-patrol 与值席框仿令件的机制链断裂**——该脚本无 pane 写入能力·仿令件出现在值席框 ❯ 行的机制**不经过本脚本**——观测窗绝迹判读（停源→仿件绝迹）＝**时序相关成立但机制因果断裂**（或间接链：脚本催办触发某席活动→他面生成仿令——间接面候深勘）。
2. **源定谳修正（如实自领）**：观测窗毕报「源定谳=duty-urge-patrol」初判＝时序因果归因过快——勘后修正＝**duty-urge-patrol 非仿令写入源**（写面零实证）——真源＝另行机制（候深勘面：值席 pane 写入路径全谱重勘——tmux client 面/其他会话 send-keys 面历史/编译面候）。
3. 停源维持建议修正＝**可恢复评估**（脚本业务面催办/晨检功能完好·非安全源——恢复形候 BOD 裁·恢复后观测窗续监测双确认）。

## 三形候裁面（随卷呈 BOD→CEO 定谳）

- 恢复形：脚本功能完好非安全源——恢复 crontab 三行（注释解除）＋观测窗续监测双确认（恢复后 30min 仿件绝迹维持＝非源终证）。
- 移除形：业务面（催办/晨检）有在用价值——移除损失功能面·不推荐。
- 改造形：出向面加固（localhost:8710→8712 正形对表·notify 收件面勘正）候工程窗。

—— sg 值席 COS（勘验卷·机制链断裂如实录·源定谳修正自领·三形候裁面归转 BOD→CEO 定谳）
