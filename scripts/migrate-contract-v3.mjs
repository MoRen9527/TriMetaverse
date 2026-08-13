#!/usr/bin/env node
// migrate-contract-v3.mjs — r13-2 Step 2 一次性迁移工具
//
// 把 11 份有 v1 对应者的 source-agents v2 合同合并为 v3.0：
//   v2 保留：paths / decision_rights / runtime_baseline / contract.family
//   v1 搬运：identity（去 family）/ responsibilities / collaborators / tools / io_contract / instructions
// 注意 colleagues_social 合并字段必须拆成 colleagues + social（CTO 标注的坑）。
//
// 用法（在 TriLC 目录跑，复用其 yaml 依赖）：
//   node ../TriMetaverse/scripts/migrate-contract-v3.mjs

import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { createRequire } from 'node:module';

// yaml 依赖取自 TriLC node_modules（脚本所在 TriMetaverse 仓库无此依赖）
const require = createRequire('file:///D:/Code/ai/TriLC/package.json');
const { parse: parseYaml, stringify: stringifyYaml } = require('yaml');

const TRI_COMPANY = 'D:/Code/ai/TriCompany';
const REGISTRY = join(TRI_COMPANY, 'docs/registry');
const SOURCE = join(TRI_COMPANY, 'source-agents');

// 11 份映射：v1 文件名（无扩展） → v2 agent_id（kebab，目录名）
const PAIRS = [
  ['CEOChiefOfStaff', 'ceo-chief-of-staff'],
  ['ChiefAdministrativeOfficer', 'chief-administrative-officer'],
  ['ChiefFinancialOfficer', 'chief-financial-officer'],
  ['ChiefHumanResourcesOfficer', 'chief-human-resources-officer'],
  ['ChiefMarketingOfficer', 'chief-marketing-officer'],
  ['ChiefOperatingOfficer', 'chief-operating-officer'],
  ['ChiefProductOfficer', 'chief-product-officer'],
  ['ChiefTechnologyOfficer', 'chief-technology-officer'],
  ['FullStackDeveloper', 'full-stack-developer'],
  ['RAndDTrainer', 'rd-trainer'],
  ['TestEngineer', 'test-engineer'],
];

function load(path) {
  return parseYaml(readFileSync(path, 'utf-8'));
}

/** colleagues_social 合并字段拆分（对齐 TriLC 归一化逻辑）。 */
function splitPaths(paths) {
  const out = { ...paths };
  if (out.colleagues_social) {
    if (!out.colleagues) out.colleagues = out.colleagues_social;
    if (!out.social) out.social = out.colleagues_social;
    delete out.colleagues_social;
  }
  return out;
}

/** decision_rights 四键补齐（v2 缺键补空数组）。 */
function fourKeys(dr = {}) {
  return {
    approve: dr.approve || [],
    freeze: dr.freeze || [],
    escalate: dr.escalate || [],
    forbidden: dr.forbidden || [],
  };
}

/** identity：v1 搬运并去掉 family（v3 的 family 在 contract 层）。 */
function migrateIdentity(v1Identity, v2Family) {
  const id = {
    display_name: v1Identity.display_name,
    role: v1Identity.role,
    description: v1Identity.description,
  };
  if (v1Identity.user_invocable !== undefined) id.user_invocable = v1Identity.user_invocable;
  return id;
}

function migrate(v1Name, v2Id) {
  const v1 = load(join(REGISTRY, `${v1Name}.contract.yaml`));
  const v2Path = join(SOURCE, v2Id, `${v2Id}.contract.yaml`);
  const v2 = load(v2Path);

  const v3 = {
    contract: {
      version: '3.0',
      type: 'agent-contract',
      agent_id: v2Id,
      family: v2.contract?.family || v1.identity?.family || 'Role',
    },
    identity: migrateIdentity(v1.identity, v2.contract?.family),
    paths: splitPaths(v2.paths),
    responsibilities: v1.responsibilities,
    decision_rights: fourKeys(v2.decision_rights),
    collaborators: v1.collaborators,
    tools: v1.tools || [],
    io_contract: v1.io_contract,
  };
  if (v1.instructions !== undefined) v3.instructions = v1.instructions;
  if (v2.runtime_baseline !== undefined) v3.runtime_baseline = v2.runtime_baseline;

  const header = '# Agent Contract v3\n';
  writeFileSync(v2Path, header + stringifyYaml(v3), 'utf-8');
  return v2Path;
}

let migrated = 0;
for (const [v1Name, v2Id] of PAIRS) {
  const out = migrate(v1Name, v2Id);
  console.log(`migrated: ${v2Id} ← ${v1Name} (${out})`);
  migrated++;
}
console.log(`\ndone: ${migrated} contracts migrated to v3.0`);
