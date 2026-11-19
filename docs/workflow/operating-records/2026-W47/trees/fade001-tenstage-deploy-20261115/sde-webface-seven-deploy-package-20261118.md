# SDE 七实例部署包备制卷（节 2 deploy 件·notice-192 CEO 裁维持 A·直办链开工件·先例 146 形）

- sourceOfTruth: 本卷（七实例部署命令面正形·BOD 直办执行用）
- syncMode: write-time
- 执行席: SDE 小布；令源=m-duty-cos 派令（notice-192·CEO 裁维持定谳 A=七实例七端口·节 1 反转荐不采）
- 施工窗: 2026-11-18T13:08Z 起笔（date 现查原值·D-47 全程）
- 判定: **七实例部署包备制毕——七目录预建+七端口空闲断言全过+部署命令面落卷；wrapper B 形=form-neutral 照用（权威位不变）；单实例包转候裁 shelf（零废留用·勿自发起）**

## §一 · 勘定表对表（节 1 cto-node1-sevenseat-survey 承）

| 席（拼音序） | 端口 | CWD（workspace 根） | BASE（.rot/） |
|---|---|---|---|
| cos | 8792 | /home/fleet/.dsh-workspaces/r-duty-cos | /home/fleet/.web-faces/r-duty-cos/.rot/ |
| coo | 8793 | /home/fleet/.dsh-workspaces/r-duty-coo | /home/fleet/.web-faces/r-duty-coo/.rot/ |
| cao | 8794 | /home/fleet/.dsh-workspaces/r-duty-cao | /home/fleet/.web-faces/r-duty-cao/.rot/ |
| cpo | 8795 | /home/fleet/.dsh-workspaces/r-duty-cpo | /home/fleet/.web-faces/r-duty-cpo/.rot/ |
| cto | 8796 | /home/fleet/.dsh-workspaces/r-duty-cto | /home/fleet/.web-faces/r-duty-cto/.rot/ |
| cho | 8797 | /home/fleet/.dsh-workspaces/r-duty-cho | /home/fleet/.web-faces/r-duty-cho/.rot/ |
| cfo | 8798 | /home/fleet/.dsh-workspaces/r-duty-cfo | /home/fleet/.web-faces/r-duty-cfo/.rot/ |

- 隧道面 18790/18791 不动（节 1 勘定承）·权威正身=`/home/fleet/.web-faces/run-web-masked.py`（B 形 0600·form-neutral 照用零改）

## §二 · 备制面读数（本席毕）

- 七席 workspace 目录在位断言：r-duty-{cos,coo,cao,cpo,cto,cho,cfo} 七目录全在 ✓
- 七端口空闲断言：8792-8798 全空闲（零现役冲突·8791 唯一 web 监听零扰）✓
- 七 BASE 目录预建：`.web-faces/r-duty-<seat>/.rot/` ×7 全落位 ✓

## §三 · 部署命令面（BOD 直办执行用·逐实例形）

```bash
# 节 2 直办链·七实例启动（河源机·fleet 身份·逐实例一条·拼音序即端口序）
for seat in cos coo cao cpo cto cho cfo; do
  port=$(case $seat in cos) echo 8792;; coo) echo 8793;; cao) echo 8794;;
         cpo) echo 8795;; cto) echo 8796;; cho) echo 8797;; cfo) echo 8798;; esac)
  nohup python3 /home/fleet/.web-faces/run-web-masked.py \
    --port "$port" \
    --cwd "/home/fleet/.dsh-workspaces/r-duty-$seat" \
    --base "/home/fleet/.web-faces/r-duty-$seat/.rot" \
    >/dev/null 2>&1 &
  echo "[webface] r-duty-$seat -> :$port 启动令已发"
done
```

- **启动后自检读数三件**（逐实例·直办链自检用）：
  1. `ls -la /home/fleet/.web-faces/r-duty-<seat>/.rot/`——web.log+new-token 0600 在（wrapper 自产）
  2. `grep -c MASKED /home/fleet/.web-faces/r-duty-<seat>/.rot/web.log`——≥1（stdout 零明文 token 断言·D-46）
  3. `ss -tlnp | grep 87[92-98]`——七监听在·127.0.0.1 形承现役
- 隧道接入面（18790/18791 不动承）——直办链按 notice-192 面接线

## §四 · shelf 面（notice-192 三款承）

- 单实例部署包（ns1-w46/8792/CWD=run 根）=**转候裁 shelf**（包零废留用·BOD 直办勿自发起——临时 face 面候令）·树内先卷=sde-webface-b-deploy-package-20261118.md（77dc1e38b）留用

## §五 · 护栏对表

- 现役 8791 零扰（唯 web 监听·B 形零参兼容零改 unit）✓
- r1/ns1 存档零触（CWD=各席 workspace 根·存档域零触）✓
- D-24 断言（河源 iZf8ziw57ydktu77fsld9yZ 施工）·D-46 承（token 值零出现·路径形 only）·D-47 全程 ✓
- 单笔 revert 一键族：本笔=脚本卷+目录预建（零码面改·正身 form-neutral 零动）✓
- **零启动**：七实例启动=直办链执行面（本席备制毕·零越位留白——ss 断言七端口全空承）

## 使用依据

notice-192（CEO 裁维持定谳 A）；节 1 勘定卷 cto-node1-sevenseat-survey-20261118（端口表 8792-8798 拼音序+BASE 形）；coo-形裁注记-七席全景A（回退面=参数化同正身七实例化零重构）；sde-webface-b-deploy-package-20261118（B 形正身+先例形）；D-24/D-46/D-47。

—— SDE 小布（毕报=落卷+SendMessage 直达值席→BOD 知会·落位时点=本卷 commit %cI·notice-192 二款快核知会义务承）
