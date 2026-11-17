# 白盒补齐毕报·!!js 形族 fixture+契约断言（notice-156 施工要件④·协作面·FD 主刀）

- 执行: m-duty-fsd（生成器白盒面协作·SDE 案 2 自定义 yaml Type=主施工）；令面=BOD notice-156 白盒补齐令（D-39 全域授权面裁·案 2 择形）
- 交付锚: **TriCompany dev acc74e2**（白盒面单笔·已 push sg bare 3dada21..acc74e2）
- 现查: 2026-11-18T00:0xZ（写前现查·D-47）·护栏零写面维持 ✓（本笔=白盒面零触 dsh）

## 一、要件④对表读数

| 面 | 落位 | 读数 |
| --- | --- | --- |
| fixture 三形 | presets-whitebox.test.mjs RAW_JS_FIXTURE | ①裸单行表达式（tool-bash disabled·`!!js process.platform === 'win32'`）②带引号表达式（profileContext 守卫·单引号转义形 `!!js '!ctx.get(''profileContext'')'`）③折叠块 >- 多行表达式（otel url 形）——**顶层 bundle 行+preset 内 plugins 行双位**（保留断言面） |
| 契约断言五面 | 同测试件 | ①全 doc parse 零炸②preset 13 块照常提取（presets_total=13）③降权 scan clean④!!js 行进产物（preset 内行保留断言）⑤round-trip 串值保真（产物回读 tool-bash.disabled===原表达式串） |
| 红基线 | 在册复现 | 当前生成器（3dada21·DEFAULT_FULL_SCHEMA 形）跑本面=**unknown tag !<tag:yaml.org,2002:js>** 红——候 SDE 案 2 落地转绿 |

## 二、案 2 施工输入补勘（SDE 直接受益面）

- **js-yaml 4.3.2 面**（沙箱实测）: Type/Schema API 在 ✓；**DEFAULT_FULL_SCHEMA 经 ESM 互操作 import 形=undefined**（3dada21 `yaml.DEFAULT_FULL_SCHEMA ?? ...` 落 DEFAULT_SCHEMA=修笔无效根因补勘——SDE 案 2 实装经 `createRequire(...).resolve` 后 **require 形取**（`mod.DEFAULT_FULL_SCHEMA` 或 require('js-yaml')）避 ESM 互操作坑）
- 案 2 Type 形参考: `new yaml.Type('!<tag:yaml.org,2002:js>', { kind:'scalar', resolve:()=>true, represent:(s)=>s })` + Schema 组装 load/dump 双面——转绿判据=本白盒面 pass

## 三、转绿判据与运行形

- **转绿判据**: SDE 案 2 落地后 `~/node22/bin/node --test scripts/ops/local/presets/presets-whitebox.test.mjs` → **10/10 pass**（红面转绿=要件④闭）
- 白盒 9/10 现势（红基线 1 面=要件④正身在册·非缺陷面——如实载）
- 部署窗运行形不变（fsd-t3-code-readout §三·--anchor /srv/fleet/dsh）

## 四、使用依据

BOD notice-156（白盒补齐令·案 2 择形裁）；fsd-t3-window-handoff-readout（残阻勘形谱系）；js-yaml 4.3.2 沙箱实测（Type API+ESM 坑补勘）；web patch 实勘三形（dump 行 24 谱系）；TriCompany acc74e2 diff
