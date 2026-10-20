// tricompass-context · v1 (2026-10-16) — TriCompany compass PromptContext provider
//
// 合同锚: docs/execution/dsh-window1-contract-20261014.md 件⑤（compass 承接位=PromptContext·
//         ctx.systemPrompt.context 注册·cache-safe durable user-role snapshot）
// 裁锚:   CTO 2026-10-16 21:02:21 裁 b 案（provider=代码形·n2 毕停点期施工·不入产物清单门）
//         补令四条: ①provider 代码形 ②compass 路径映射表=声明形（compass-path-map.yml）
//         ③scope+required:true 留 n3 三验①实测钉死 ④承载位=河源仓现役 compass 文件直读零复制
// mount 形: preset plugins 行（agent-scoped·13 席各挂一行·config.file=该席 compass 路径）
// 语义:   每 assembly 活读 compass 文件（真源单源·compass 更新零 Host 重启即反映）；
//         文件缺失降级空文本（assembly contributes nothing）+stderr warn 留痕。
// 注:     dsh 0.2.0-rc.2 实测——PromptContext 契约=name/order/text 三字段（required 字段
//         现版 types 不存在·合同 §五 required:true 候定项无从实现·n3 实测如实报裁）。
// 本件=构建物源码·禁 dsh 侧手改（修订走本仓+重发布）。

import { readFileSync } from 'node:fs'

export const name = 'tricompass-context'
export const inject = ['systemPrompt']

export function apply(ctx, config) {
  const root = config && config.workspaceRoot
  const rel = config && config.file
  if (!root || !rel) {
    console.error('[tricompass-context] config incomplete (workspaceRoot/file required) — context not registered')
    return
  }
  const path = String(root).replace(/\/+$/, '') + '/' + String(rel).replace(/^\/+/, '')
  ctx.systemPrompt.context({
    name: 'compass',
    order: 9900,
    text: () => {
      try {
        return readFileSync(path, 'utf8')
      } catch (err) {
        console.error('[tricompass-context] compass read failed:', path, String((err && err.message) || err))
        return ''
      }
    },
  })
  console.error('[tricompass-context] context registered: compass <-', path)
}
