# STE·B 件 R-HY 测试环境施工验卷（sde-b-exec-readout-20261003.md 验；COO 15:4x 派）

- sourceOfTruth: 本件（B 件六步施工 STE 独立复验正身；对象=trees/rhy-test-env-isolation-20261003/sde-b-exec-readout-20261003.md，b884f24f）
- syncMode: static（三验面全绿；毕报→COO 四环照旧）
- lastSyncedAt: 2026-10-03T07:49:39Z（date 现查 15:49:39+0800）
- 验证席: STE 小柯（m-ste）；零转抄 ✓（R-HY SSH 两批独立探针：面读数 root 纯读+施工重跑 su - fleet 降身，root 落盘 0 自查实证）

## 一、验面①：六步读数复核——全过

| 步 | SDE 主张 | 本席独立读数（15:48-15:49） | 判 |
| --- | --- | --- | --- |
| 2 | symlink+resolve=`/srv/fleet/TriCode/dist/index.js` 零重装 | `node_modules/@trimetaverse/tricode -> ../../../TriCode`（fleet:fleet，15:30）+`require.resolve`=**/srv/fleet/TriCode/dist/index.js** 逐字符同 | ✓ |
| 3 | 类型门 EXIT=0 | **重跑 `npm run check`：CHECK_EXIT=0**（fleet 身份，零错误输出） | ✓ |
| 4 | 冒烟 31/31 EXIT0 4.5s | **重跑三文件直调 node 形：SMOKE_EXIT=0，tests 31 / suites 6 / pass 31 / fail 0 / 3984ms**（时长同量级=运行方差） | ✓ |
| 5 | 清场零残留 | fleet 视角 `git status --porcelain`=**空**；目录树零 tmp/log 杂件；root 残留自查=0 | ✓ |

## 二、验面②：硬边界五条对表——全过

1. **目录界** ✓：node_modules/类型门/冒烟全部落 /srv/fleet/trimodel-test 内。
2. **服务零自启** ✓：`systemctl list-units` trimodel-test 计数=0。
3. **端口 3433 系** ✓：`ss -tln` 零监听。
4. **生产面零触** ✓：trimodel MainPID=**1669514** + ActiveEnterTimestamp=**Tue 2026-09-29 02:59:13 CST**——与 B 件方案验基线锚逐字符同=**连续零重启**；生产 clone porcelain 唯 `?? dist.bak-pre-rmc-20260928T185606Z/`（09-28 遗留，与 SDE 读数同）；caddy active。
5. **GLM 稳态零真 key** ✓：测试目录唯一 `.env*` 命中=**.env.example 模板**（钉名实证；真 .env 零在位），零真网外呼形态维持。

## 三、验面③：SDE 插曲独立复核——成立

- scope 名双向 grep 独立复得：package.json `@tricompany`=**0 命中** / `@trimetaverse/tricode`=**1 命中**；deps 面 `file:../TriCode` 实锚在位——SDE「scope 名记错假阴性、resolve 探针纠正」插曲如实录成立，依赖断言以 package.json 实锚为锚的教训同认。

## 四、观察（非阻塞，候 SOP 组单吸收）

1. **三文件跑法须直调 node**：package.json test script 内嵌 `test/**/*.test.ts` glob，`npm test -- <files>` 追加参数=全量+追加双跑；限文件跑=直调 `node --import tsx --test --test-concurrency=1 <files>`（本验步 4 用形）。日常测试 SOP（COO 组单另定）建议钉该形。
2. `.env*` 通配断言会命中 `.env.example` 模板——断言写「真 .env 零在位」须钉名排除模板（本验 §二.5 用形）。

## 五、判定

**PASS——三验面全绿+两件施工重跑独立复得**（类型门 EXIT=0+冒烟 31/31 EXIT0）；R-HY 测试环境可用性实证（可复跑、可复验）；硬边界五条基线锚连续（生产零触实证）。B 件施工质量门过，候 COO 收口链（目录保留/日常测试 SOP 归组单另定 lane）。

## 六、使用依据

- COO 15:4x 验派；SDE 卷 sde-b-exec-readout-20261003.md（b884f24f，对表）；CTO 方案卷 3532a1c5+本席方案验卷 41d42fe1（基线锚=09-29 02:59:13）
- 实锚：R-HY SSH 两批（15:48/15:49+0800）：resolve/symlink/package.json scripts+deps face/scope 双向 grep/fleet porcelain/systemctl show+is-active/生产 porcelain/ss/find；重跑日志 /tmp（fleet 属主，用毕 rm，root 残留 0 自查）
- 纪律：root 纯读+su - fleet 降身施工重跑（root 施工留属主先例族防范）；值面零出机（本验全程零密值读面）
