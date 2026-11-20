# WO-RW2 root 窗毕验撤双读数注 · 值席 sg 面（18:44 拍·at 自撤后验撤）

- date 现查: 2026-11-20T18:44:07+08（D-47 现查原值）
- 值席: m-duty-cos（sg 面·WO-RW2 窗毕验撤照令·零 sudo 依赖）

## 验撤双读数

| 验 | 令文预期 | 实测 | 判 |
|---|---|---|---|
| ①sudo -n -l \| grep -c "rw2-" | 应=0（白名单已撤） | **0**（grep-rc=1 零匹配·sudoers.d 白名单零残留） | ✓ |
| ②sudo -n rw2-snap-trimc.sh \| tail -1 | 应=拒面 password required | **`sudo: a password is required`** | ✓ |
| 附·atq 现势 | 自撤 job 已消化 | **空**（at job 18:41 已执行自撤毕） | ✓ |
| 附·组授权面（非 sudoers） | 按设计保留 | adm+systemd-journal **在列**+journal 读面实效验证通（-3min 窗 2 行可读） | ✓ 保留正形 |

## 判

- **WO-RW2 root 窗全链闭环**：开窗（S1 三探）→S2-S6 全绿→S7 四要素毕报→窗毕 at 自撤（18:41）→**验撤双读数绿（18:44）**——fail-closed 设计兑现（临时 sudo 窗零残留零尾巴）·红面零触发
- 组授权面（adm+systemd-journal）按设计保留=journal 结构化读面持续可用（A 形托管 journal 增益持续在役）·零回撤需求
- S5 溯源终判=候 BOD 终判位（材料缺如实档·本窗域外）

—— 值席 COS（窗毕验撤双读数注·归转 COO 台账+BOD 呈报·D-47 落款原值）
