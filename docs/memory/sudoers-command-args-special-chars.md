# sudoers 命令参数白名单三族特殊字符坑

教训一句：sudoers Cmnd_Alias 参数面 `,`/`+`/`%` 全是语法保留字符——参数内逗号=列表分隔符、`+` token=netgroup、`%` token=组引用，visudo 直接红。

正形一句：sudoers 白名单只写**零参数脚本路径**（`/usr/local/sbin/rw2-*.sh` 四行 Alias），复杂命令逻辑封进 root 落地的 shell 脚本（0755 root:root=fleet 可读可执行不可写=防篡改闭环），特殊字符全留 shell 层。

- 三族字符（WO-RW2 v1 实锚 2026-11-20）：`,`（`-aG systemd-journal,adm` 被拆列表）`+`（`{} +` 尾 token 读作 netgroup）`%`（printf `%p|%u` 读作组引用）——引号串同样敏感。
- 防呆硬门首用拦截=visudo -cf 粘贴毕必跑（sudoers 语法错=全机 sudo 瘫痪面·红即删件复验原态零硬闯）。
- 精确等值族同构：白名单变更=403 族温床，执行面命令串变更必须回铸件席改脚本+重 visudo（TriRLC cron ALLOWLIST 同源教训）。
- 首案：`bod-fade001-sprint-plan-20261120/cto-rw2-sudoers-cast-v2-20261120.md` §〇（v1 c92ae9c8f 三族齐爆实录·v2 脚本包装正身）。
