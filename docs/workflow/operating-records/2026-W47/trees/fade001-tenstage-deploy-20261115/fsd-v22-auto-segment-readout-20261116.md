# V2-2 脚本件施工读数卷·联审召集自动段自动化脚本面（COO 派工·BOD 143 轮承）

- 执行: m-duty-fsd（脚本件本体车道）；协同=值席 COS（值守循环 SOP 化·过程正身 COS 域）；谱系=V2-1 966f99d 续
- 交付锚: TriCompany 分支 **v22-2-auto-segment @ b8fbdb0**（loop_convene_auto.py 脚本面·V2-1 谱系续零主链触）

## 一、脚本面读数

- `loop_convene_auto.py`：run_auto_segment 全链自动段——convene_mode 读（trigger 面）→dimB 初判（机判可验族草卷）→召集件渲染（七席信箱 dispatch payload 形）→**convene staging 落位**（run_dir/convene/ 面·convene-letters.json+dimb-initial.json 双件——控制面 m-duty-cos 值守拾取发送·本脚本零直接投递零 POST）
- mode 门控：auto=召集件七席渲染；manual=值守循环 SOP 召集形（零自动件产出·零 letters——过渡形对照跑面）
- dry=全链渲染零落位（预演面）；护栏照 §六 v2（TC 面脚本·零触河源·回滚锚谱系续用）

## 二、过渡形对照跑读数（新旧召集形对照·双态并出）

| 形 | mode | 读数 |
| --- | --- | --- |
| auto（新召集形） | convene_mode=auto | 召集件七席渲染+dimB 初判卷 1 entries·staging 落位 |
| manual（旧召集形） | convene_mode=manual | 零自动件产出（召集动作=值守循环 SOP 面） |

- 对照读数并出：auto/manual 双态 dry 实测（过渡形对照跑面零写·读数面全落卷）

## 三、门禁读数（dry 全链预演+过渡形对照跑）

- dry 全链预演: **auto/manual 双态并出全过**（dry=渲染零落位·预演面）✓
- 白盒回归: loop_convene 8/8 保持 ✓
- 常规门: cognition 全量（identity env 注入形）✓（T1-2 py3.9+ dict-union 环境面预存如实注）

## 四、链位

V2-2 毕报（本卷·C 节点面读数随卷）→V2-3 真值首跑（值席+七席·CEO 验收四句门）——脚本面=值席 SOP 对接面（staging payload 形·值席面拾取发送），交接面就绪

## 五、使用依据

COO 派工令（V2-2 脚本件即开·双 owner 双车道）；V2-1 交付 966f99d 谱系；§六 v2 表隔离裁量（案 α+γ）；loop_convene_auto 端到端自测实录
