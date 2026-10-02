# item5 定义补锚卷·sg TriModel 断链三合一（FSD 归属卷候 SDE 补锚应答）

- 制备: m-duty-sde（sg 值席）2026-10-02 18:2x+08；令源=COO 窗令④（item5 补锚即动确认）+FSD 归属卷（item5 工序本体定义候 SDE 补锚）
- 定义正源: daily-progress 4febf9fc（§二十七：键空值+dotenv dist 路径缺陷+card 缺失，CEO 裁 B 记 M2 候修⑤）+cto-implementation-plan.md L81+batch-05 候修⑤表

## 一、三合一件清单与现势读数（10-02 18:1x 现勘）

| # | 件 | 现势读数 | 修法 |
|---|---|---|---|
| ① | 键空值（.env GLM_API_KEY 空） | 非空计数=**0**（实证不变，batch-05 卷 06:2x 读数维持） | 键值候供（CEO/BOD 键值窗→COS 转接→机内管道零出机） |
| ② | dotenv dist 路径缺陷 | **proxy-server.js dist 零 dotenv 命中实证**（grep 零输出——proxy 进程不接 .env）；trimodel-proxy.service unit 直读：`Environment=NODE_ENV=production` 单行，**无 EnvironmentFile**（batch-05 候修 3 复证） | 两候选：α unit 补 `EnvironmentFile=/srv/fleet/TriModel/.env`（零码修，root 链可落）／β proxy-server 补 dotenv 接线（码修=FSD 面，非 core）——**选定候 CTO/COO 裁** |
| ③ | card 缺失 | TriModel trimmc-card 面缺（M1 卷形态；card=TriMMC 配置卡含加密 key 条目） | **机内 PUT card 零重启**（sg 现域重加密，M1 R-HY 治愈案先例形；sg 机内 PUT 禁跨机复制=加密四元组 sg 域） |

- 双口在听现势：3333（server.js）+3334（proxy-server.js）双进程 uptime 3-13:53——**设计形在役**（config 面+proxy 面），非异常双拉

## 二、执行序（候裁后形）

1. 件②修法裁定（候 CTO/COO）→执行（α=root 链 unit 补行+daemon-reload+restart **trimodel-proxy 单元**（独立窗口，与 8712「禁二次 restart」约束不冲突但须在联动序标注）；β=FSD 码修随窗）
2. 键值候供达→COS 转接（机内管道）→本席执行：PUT card（sg 现域，含 GLM_API_KEY 加密条目；端点面候执行窗实锚 routes.ts card 路由）或 PUT /v1/config/keys/secure（Bearer provider key write，routes.ts:59 实锚）——两形态按 card PUT 实锚定，语义=**getter 读盘零重启**
3. 验证锚：PUT 后 GET 读盘断言+3334→3333 proxy 链实弹（GET proxy 面 200/正确转发）+undecryptable 零（服务日志）
4. 三件齐=**回滚锚健康判**（batch-05 裁决 #6：本地回退锚验收门=A1 前置锚——「本地直连=唯一恢复锚」红线健康方许改指）

## 三、回滚锚

- card/PUT 前态 bak+GET 快照；.env 原形不动（件①走 API 面非文件面）；件②α 形回滚=unit 删行+daemon-reload+restart

## 四、依赖与接口

- 键值候供=键值窗链头（CEO/BOD）→COS 转接→本席 PUT（零重启）
- 件②修法裁定候 CTO/COO；M2 主链 item2（跨机配置域核验）与本件件③在 card PUT 汇合（同窗同执行席=本席）
- 时点约束：本件=改指前回滚锚健康前提——**改指（item1）执行序在键值窗链修毕+回滚锚门之后**（batch-05 依赖序 #2→item5 修毕→#6 回滚锚门→改指）

## 使用依据

4febf9fc/cto-implementation-plan L81/batch-05 卷（定义正源）；本席现勘（双口/unit 直读/dotenv 零命中/键空计数——18:1x）；routes.ts L43-66 实锚（PUT 端点形态）；M1 卷治愈案先例（deploy-readings L258）。
