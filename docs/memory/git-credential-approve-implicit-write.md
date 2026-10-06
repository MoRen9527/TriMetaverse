# git credential approve 隐式写面·「dry-run 零写面」迷思

「git push --dry-run 是零写面读操作」**不成立**：dry-run 走完整认证流程（连 remote 验权限），**认证成功即触发 credential approve→helper=store 把刚用的凭据原样重写回凭证文件**（mtime 变、值同）。repo 对象面确实零写，credential store 面有写。

**纪律句**：凡 credential helper=store 环境的网络操作（含 dry-run/ls-remote/fetch），凭证文件 mtime 面一律**视为有写面**——勘验/取证/冻结场景先声明此面，勿凭「只是 dry-run」断言零写。

**实证锚（2026-09-30 04:04 sg root store 澄清案）**：SDE 备场勘察以 root 语境直跑 push-survey（20×OK——本应 sudo -u fleet），末仓认证成功 approve 同值重写 /root/.git-credentials（04:04:25.6），被 BOD mtime 勘验误判为「施工方自写 store」嫌疑；澄清实证=同值 touch 零新值零注入（approve 语义=fill 所得原样交回）。对照组：同脚本 sudo -u fleet 重跑 20×AUTH-DEAD（store 0 行认证未成无 approve，fleet store 保持 0 行）——「认证成功才有 approve」双向实证。

**连带**：①身份语境漂移坑——root ssh 会话里跑脚本忘降身（sudo -u fleet / su - fleet -c），与「sudo -u fleet 不重置 HOME」坑同族：**身份语境先断言再执行**；②「不知情未报」≠「隐瞒」——认知盲区导致的读数缺面，响应正解=盲区自认+纪律候选，不是认「披露缺失」重罪。

关联 [[sg-github-pat-push-channel]]（坑三连同域）、[[tool-authz-double-layer-testing]]（清单可见≠执行放行同族盲区形态）。
