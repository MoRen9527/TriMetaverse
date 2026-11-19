# FSD 执行卷·TriOrchKit sg 首推毕（D-15 令 2 配合面·C2 收官判据落锚）

- **sourceOfTruth**: TriMetaverse/docs/workflow/operating-records/2026-W47/trees/agentcore-convergence-eval-20261119/
- **syncMode**: 落卷即真源（operating-records 树文件）
- **lastSyncedAt**: 2026-11-19T23:46:03Z（date 现查原值粘贴·+8=11-20 07:46）

## 一·触发面与执行

- **令面**: D-15 排工令令 2=sg 裸仓建仓（值席窗）·本席推送面配合（COS 派工单 cos-c2-kit-sgbare-dispatch-20261120.md·33295ef442）
- **触发实况**: r668d 08:10 档+C2 毕短报「sg 裸仓建仓毕·验真锚三项全过·候 FSD 首推」（值席 pane 直读转呈）
- **卷面差异如实注**: COS 派工单触发条件细文=「值席毕报回执卷到树后我转你触发」——**回执卷（cos-kit-sgbare-built-回执-20261120.md）fetch 后 origin/dev 树面+工作区未跟踪面双零**（短报先发·卷推在途）——本席取**活体先行**正形：ls-remote 直探 sg 仓=活体二次确认（比纸面卷硬）·通则推·不通则回候卷形。活体 RC=0 通过·执行。

## 二·执行读数（三步全锚）

1. **remote add sg**: `ssh://fleet@47.245.122.61/srv/git/TriOrchKit.git`（活体 get-url 字面回填·照 TriMetaverse sg-server 形 fleet@47.245.122.61）
   - 实锚：首探裸 IP 形（缺 fleet@）→Permission denied (publickey)——TriMetaverse remote 配置对照勘定（fleet 用户面）→set-url 修复——**跨仓 remote 配置照活体权威面抄·不凭记忆拼**（值面纪律）
2. **活体探仓**: `git ls-remote sg` → RC=0 空输出=**仓活体+bare 零 ref**（新仓实证·建仓读数活体复确认）
3. **首推+验真**: `git push sg dev` → `* [new branch] dev -> dev` ✓ → 双端 hash 40 位全等活体读数：
   - `git ls-remote sg refs/heads/dev` = `366cd0c8d4730cd69ec234d1a1639aa16d46bc4d`
   - `git rev-parse dev`（本机顶） = `366cd0c8d4730cd69ec234d1a1639aa16d46bc4d`——**hash 级同顶双证** ✓

## 三·C2 收官判据面

- 令 2 落锚毕（本卷）→ **C2 sprint 收官判据四面齐**：套件 58/58（366cd0c）+安装双验（0b78db4da）+终审门禁 APPROVE（f9a5c005a）+**sg 落锚（本卷·sg 顶=366cd0c8d47）**
- kit 本体三 commit 锚链双宿主可达：本机 dev 顶+sg bare dev 顶同 hash

## 四·候链面（如实注）

- 值席回执卷（cos-kit-sgbare-built-回执-20261120.md）候链补推——本卷活体三步读数已代建仓事实双证，值席卷到树后为纸面归档面补齐·零 block
- TriOrchKit 单 remote 形（origin 缺省面+sg 首推位）——后续镜像/双通道拓扑（照 TriMetaverse 双 pushurl 形）候接线窗统排

## 五·使用依据

- D-15 排工令令 2（0ba8e3959）+COS 派工单 cos-c2-kit-sgbare-dispatch-20261120.md（33295ef442）
- C2 毕短报 r668d 08:10 档（值席 pane 直读转呈·候 FSD 首推触发面）
- TriMetaverse remote 配置活体对照（fleet@ 形实锚）
- 本机 git 实跑读数（本卷全部读数为实跑非推演·ls-remote hash 级双证）

---
落卷=FSD 小全（m-fsd）·令 2 配合面毕（07:46+8）·next_agent=COS（值席卷补推归档+收官窗知会面）·CTO 知会（C2 收官判据四面齐）
