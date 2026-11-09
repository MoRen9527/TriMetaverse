# 编码链缺陷勘定 · notify 转发段（BOD ㊿+92 候修料·值席取证）· 2026-11-04

- date 现查: 2026-11-04T22:22:05+08（D-47）；勘对象: ntf-mw26rv1lawvw1p（E1-4 b2 recovered 拍·22:02:34 发·BOD 面收 U+FFFD 全损）
- 取证铁证: **同 run 同文本的落卷副本零损**——window-reminders/提醒-8713心跳-2026-11-04T220234+0800.md 字节勘=FFFD 计数 0＋中文三字节 UTF-8 序列 45＋解码 OK（job 内存文本与 fs 写面全净）

## 缺陷链定谳（sg 侧证据面）

| hop | 编码行为 | 判 |
| --- | --- | --- |
| job 内存文本→fs 落卷 | node writeFileSync（默认 utf-8）——副本零损 | ✅ 净 |
| job→sg notify API | fetch JSON.stringify（utf-8 wire）——API 200 accepted | ✅ 净（accepted 面无校验但路由 parse utf-8 显式〔echo-routes.ts:11〕） |
| sg 箱存储 | notify-mailbox.json **root 属主 600**（10-20 11:40 起 root 通道接管写面） | ⚠ **root 通道写面=嫌疑 hop**（实现面换手·fleet 侧旧写法 python ensure_ascii=False→现 root 通道实现不明） |
| sg→dev 转发 | 转发实现（root 通道族）——信已出 sg 箱达 dev 面损坏形 | ⚠ **转发/写链=损码定型 hop**（BOD 面收 U+FFFD=EF BF BD 字节=曾经 latin1 族误解码再编码的典型产物） |
| BOD 读面 | U+FFFD 全替换显示 | 受害面 |

## 修复候选（候 BOD/CTO 裁）

1. **转发/箱写序列化 ensure_ascii=True 形**（JSON 中文全 \uXXXX 转义——ASCII 载体过任何 latin1 hop 零损·读端 json.parse 自动还原）——最小侵入根治形
2. root 通道 face 通行 locale 断言（LANG/LC_ALL=UTF-8 检查行·root 操作纪律附录候选）
3. 读端显式 utf-8 解码断言（dev 箱读面/确认 face）
4. 回勘触发: 修复后下一封含中文 notify 信做往返字节抽验（EFBFBD 零命中断言）

## 对照铁证摘要

- 落卷副本（同文本）：零 FFFD＋45 中文序列✓
- dev 面收信：全 FFFD✗
- 差值定位：**sg 箱后→dev 面读前**之间（转发段为主嫌·箱写段并存嫌疑）——精确 hop 钉死需 dev 箱字节取证（BOD/dev 面）

—— sg 值席 COS（取证恪守：D-46 零值出机·字节级证据随卷）
