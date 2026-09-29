# FSD·件D 五行呈现词修完工读数（夜窗件①·可夜验）

- sourceOfTruth: 本件（FSD 件D 完工读数卷；判据源=CPO 定稿 cf574b6e 经 COO 12:09 转达+G2① f4407426；夜窗令=BOD 23:11 经 COO 23:15 转）
- syncMode: working
- lastSyncedAt: 2026-09-29T16:1xZ（date 现查=2026-09-30 00:1x +0800）
- 施工席: FSD 小全（m-fsd）
- 交付锚: TriModel **5be7aba**（1 file, 5+/5-，dev 顶）

## 变更清单（五行逐行）

| 行 | 前 | 后 |
| --- | --- | --- |
| ui/index.html L189（策略卡 sub 行） | `LG-035 面 · 常态只读（编辑窗候 CEO 终验）；保存后待应用` | `过渡期形态 · 常态只读（编辑窗候 CEO 终验）；保存后待应用` |
| L404（nav title） | `title: 'LG-035 面 · 常态只读（编辑窗候 CEO 终验）'` | `title: '过渡期形态 · 常态只读（编辑窗候 CEO 终验）'` |
| L358（mmc special 注·①） | `配置更新走机内管理写面（PUT 卡面），` | `配置更新走机内管理写面，` |
| L358（mmc special 注·②） | `注：本 face 卡文件现役=LG-035 策略卡过渡位（trimmc-card.json）` | `注：本卡配置文件现役=策略卡过渡位` |
| L89 | `placeholder="TRIMODEL_API_TOKEN"` | （属性整删） |
| L91 | `placeholder="TRIMODEL_ADMIN_TOKEN"` | （属性整删） |

## 自测读数

1. **残留扫描**（grep ui/ 全目录）：五行目标面（`LG-035` render/attribute + 两 placeholder + `PUT 卡面` + `本 face 卡文件`）**零命中**；残留 `LG-035` 4 处全在 HTML/JS 注释（L183/L758/L1150/L1160=开发者注释非用户呈现面）——不在 CPO 五行清单，如实标记候后续清扫批。
2. **全量回归**：`npm test` → **324 tests/76 suites/309 pass/15 skip/0 fail**（duration 466s）——与今晨基线（324/309/15/0）完全同谱，零回归。

## 技术债务标记

- 注释面 `LG-035` 4 处残留（开发者注释）：非用户可见，候实现域清扫批（与 TriRLC TriLC 残留同族候工时窗）。

## 可夜验声明

- **可夜验**：件D=纯静态文案改动，零逻辑变更；STE 夜验窗=TriModel 全量（上读数）+UI 呈现面点验（浏览器开策略卡页 sub 行+nav hover title+连接区两输入框 placeholder 已空+mmc 卡面 special 注）。
- 候件A/件C 随后（序不变），各自完工另报。

## 使用依据

- CPO 定稿 cf574b6e（COO 12:09 转达）+G2① f4407426
- BOD 23:11 夜窗令（COO 23:15 转）
- TriModel commit 5be7aba diff（5+/5-）
