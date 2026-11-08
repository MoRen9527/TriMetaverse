# N-D3 接线施工执行读数卷（COS 径裁令 11-08T10:47+0800）

- 执行: m-duty-fsd（FD/sg 值席）；裁据=N-D1 正身 d3c2e8898 双署终形（§三归属治理+§四施工序）
- 交付锚: TriCompany dev **3e0994b**（fade_protocol 五件+patrol 接线+spec/registry 升版登记）

## 一、四骨架落位（施工序照令：①→②→③→④）

| 序 | 骨架 | 模块 | 通用面（零实例域词实证） |
| --- | --- | --- | --- |
| ① | Verify runner | runtime/fade_protocol/verify_runner.py | 断言清单装载形+exists/non-empty/format 三运行形+注册扩展点+失败上报形 |
| ② | Score 引擎抽取 | runtime/fade_protocol/score_engine.py | 判据结果原语/不可验原语（离线=不可验非 FAIL）/三态输出原语（labels 实例可改名）/双类计数门/阈值判定原语/envelope 装配原语 |
| ③ | Close 三件骨架 | runtime/fade_protocol/close_framework.py | 时序法条（STAGE_ORDER 五段判序）/Skill 三态框架（pass·retry·escalated+证据引用接口）/收口载体行 schema+校验形 |
| ④ | Plan 门 | runtime/fade_protocol/plan_gate.py | 存在性门（键在场判）+模板 schema 四必答校验形+复核仪式形 |

- **换实例测试法验收锚**: 四骨架零实例域词残留断言过（grep 域词族 0 行命中）+中性实例冒烟全过（py3.8：verify 三断言/score 原语组/close 判序+三态+载体/plan 两门分层）
- **落点定锚如实注**: 协议层代码=TriCompany `runtime/fade_protocol/`（协议层 spec/registry 同仓 docs/engineering/，归属治理正形位）；实例个性化件=registry 登记面（判据集/断言集本体留 patrol 载体随迁移候批）

## 二、现役接线（拆分不破现役实证）

- patrol --score 三态/双类门原语接引擎（ImportError 灰度序=引擎缺席现行为不回退）；T1-T8 判据集留载体（N-D1 §三实例面归属）
- **自测接线前后逐数一致对表**：failed:1（S3 subtotal 环境预存）两侧同形=非接线引入 ✓（git identity env 注入后实测；stash 双跑对表法）
- 生产面守护: dev cron（python3.8）兼容（from __future__ annotations=3.7+；typing 泛型 3.8 形）

## 三、施工中自bug实证修（如实）

- plan_gate 存在性门 truthy 误判（`not payload.get('plan')` 将空 dict plan 误判无 plan）——两门分层修（存在性=键在场判；完整性=四必答校验面）+冒烟断言补两门分层案

## 四、registry/spec 升版登记

- fade-protocol-spec.md §协议升版登记（四骨架条目+首绑+灰度纪律）
- fade-registry.md §FADE-001 实例配置件登记（两断言集/五约束判据集/Close 择型声明/plan 沿用现役四条）

## 五、候办与边界

- 引擎完整抽取批（envelope 装配自 patrol 迁引擎面+T1-T8 判据集迁移）候排窗（现役绑定面灰度序先行）
- 骨架单元测试族（逐原语单测）候 STE 验段补充（本卷=中性实例冒烟+域词断言+接线对表三面读数）
- 使用依据: N-D1 正身 d3c2e8898；COS 径裁令 11-08T10:47（残稿勘处注如实入账）；patrol/协议 spec/registry 现势实读
