# SDE 案2 生成段复跑+四步③④毕收口卷（R-HY 部署窗·14 条目 headless patch 落位·smoke 全门 PASS·勘位误正名承录）

- sourceOfTruth: 本卷（案2 复跑收口卷正形·deployment log 审计面）
- syncMode: write-time
- 执行席: SDE 小布；令源=BOD 164 三步令+COS 值席面勘正回执（HOLD 解除·复跑即启照 notice-156）
- 执行窗: 2026-11-17T20:56:55Z→21:0xZ（date 现查原值·全 D-47 现采）
- 判定: **生成段真跑毕（14 条目·deep-equal 零损全 PASS）+headless patch 落位毕（回滚锚先行）+smoke 全门 PASS——四步全闭环·CTO readiness 终审候呈**

## §一 · 勘位误正名承录（COS 回执定谳收讫）

- 前卷 sde-case2-step1-done-genhold-readout-20261118.md「dsh 生产面整域消失」=**勘位误**：河源 face 资产（web patch/dsh 安装面/sessions）勘成 sg 面资产——双机同构目录布局（/srv/fleet + /home/fleet 同名形）致勘位混淆·**非真异常**·HOLD 解除
- 跨机纪律自省：D-24 机位断言未先行走=前卷误根因·本卷起 SSH 面 ops 全程 D-24 断言先行
- 树面实勘差答（COS 候核项）：树面=t3a-cos-entry-block-dump-9-395.yml 单块 387 行 ✓ 与 COS 实勘同——「4700 行留档双件」语出 FSD 交棒卷（fsd-t3-window-handoff）非本席卷·如实对表零争议

## §二 · D-24 机位断言读数（R-HY=8.155.54.79@fleet）

| 断言面 | 读数 |
|---|---|
| host 异名 | iZf8ziw57ydktu77fsld9yZ（≠sg）✓ |
| web patch | **4700 行健在**·13 条目·pm 零在·头注全套（回滚=恢复原文 [] 注记自带）✓ |
| dsh anchor | /srv/fleet/dsh + js-yaml **4.3.2** + dsh bin ✓ |
| node | v22.23.2 ✓ |
| TriCompany | 9ef548b→**ff 拉 e7befe7** ✓（工作树仅无关 untracked dist.bak·presets 面零触） |
| headless 现役 | 4 行 `[]` 骨架（md5 7390256202c2b81f4dcdcd743a9875b3） |
| sessions | ~/.dsh/sessions r-duty-* 族在 ✓（零触碰承录） |

## §三 · 生成段真跑读数（步②·现役 web patch 直读零写照承）

- 运行形：`node generate-headless-preset-patch.mjs --web-patch ~/.dsh/profiles/web/cordis.patch.yml --anchor /srv/fleet/dsh --seats cos,coo,cto,cao,cpo,cfo,cmo,cho,cso,fsd,rdt,ste,sde --append-entry-text scripts/ops/local/presets/pm-entry-r-duty-pm.yml --out /tmp/headless-cordis-14.patch.yml`（R-HY 面）
- readout：presets_total=13·seats_emitted=13·extra_seats=[]·carrier=insert·danger_full_access_scan=clean·comment_scan=clean·appended_entries=[pm]
- **终验（同 anchor 4.3.2 双 load deep-equal）**：src 13 / dst 14·**13 现役条目零损断言=PASS（逐条 deep-equal）**·**pm 条目零损断言=PASS**·!!js 值保真=deep-equal 全覆盖（!!js 行 28=web preset 域 26 dump 重发射+pm 续员 2·数量吻合）·4337 行·注释行面=296 处均为 persona 块域 markdown 头（状态机正确域判·dsh smoke exit=0 实证 loader 全parse）

## §四 · DEPLOY 门+落位+smoke（三分法 DEPLOY 全项）

1. **回滚锚先行**：现役 4 行骨架备份 `cordis.patch.yml.bak-20261117T205902Z`（md5 7390256202c2b81f4dcdcd743a9875b3=安装前原物）·恢复法=`cp` 回置·验证=md5 双录 ✓
2. **安装**：/tmp staging → ~/.dsh/profiles/headless/cordis.patch.yml（md5 8f922c7df7022ba3b29cdeb40af244d3=staging 吻合·4337 行）✓
3. **smoke（dsh --dump-config --profile headless）四门**：
   - exit=0（dsh loader 全链 parse 过·含 !!js 表达式+persona 块内容）✓
   - preset-r-duty 命中 **14**+r-duty-pm 命中 2 ✓
   - persona「当前角色定位」**14 全保留** ✓
   - danger-full-access：headless dump=3=**web dump=3 基座齐平**（permission policy 表达式+mode schema=平台基座形·**patch 引入零命中**·降权链生效判 PASS）✓
- 零触承录：web patch 只读零写 ✓·sessions 族零触碰 ✓·现役运行态 R 面会话零中断（patch=新会话生效形）✓

## §五 · 收口与候呈

- **四步全闭环**：①Type 实装（e7befe7·白盒 12/12）②生成段真跑（14 条目 deep-equal 零损）③headless patch 落位（回滚锚先行）④值面勘 smoke（四门 PASS）
- **CTO readiness 终审候呈**（裁决归 CTO·本席执行面毕）；COS 台账收口转呈 BOD/CEO
- 残面如实：a) web patch 本体刷新 14 形=转译器面候窗（考古项·CTO 定谳承录）b) 河源 TriCompany remote=github https 形（fetch 通·推面候勘非本窗）c) /tmp 审计件族留 R-HY（staging/dump-config outs·审计面）
- next_agent 判断：CTO（readiness+R 面 headless session 重载窗）

## 使用依据

BOD 164 三步令；COS 值席面三仓实勘定谳回执（勘位勘正·HOLD 解除）；notice-156 主线；fsd-l130-srcpm §二（实装正身）；cto-ta-rootcause-verdict（时点差定谳）；D-24 机位断言纪律；本席合同部署三分法；本卷读数=现采实锚（md5/exit/readout 全 machine-read）。

—— SDE 小布（毕报=落卷+SendMessage 直达值席→m-cos→BOD→CEO·CTO readiness 候呈·卷面时戳=commit %cI）
