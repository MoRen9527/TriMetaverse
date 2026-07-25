import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const METAVERSE_ROOT = resolve(__dirname, '..');
const TRICOMPANY_ROOT = resolve(METAVERSE_ROOT, '..', 'TriCompany');
const SOURCE_AGENTS_ROOT = resolve(TRICOMPANY_ROOT, '.github', 'source-agents');
const AGENTS_DIR = resolve(METAVERSE_ROOT, '.github', 'agents');

function toKebab(s) {
  return s.replace(/([a-z])([A-Z])/g, '$1-$2').replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2').toLowerCase();
}

function splitBody(body, agentType) {
  const sections = body.split(/(?=^## )/m).filter(s => s.trim());
  const soulSections = [], agentBodySections = [];
  
  for (const section of sections) {
    const title = (section.match(/^## (.+)/m) || [])[1] || '';
    if (/认知分层|角色气质|对话风格|禁止退化|人格化/.test(title)) {
      soulSections.push(section.trim());
    } else {
      agentBodySections.push(section.trim());
    }
  }

  const soul = agentType === 'Registry'
    ? '# Registry Agent\n\nRegistry Agent 不使用人格化或角色扮演语气。\n'
    : (soulSections.join('\n\n') || '# Agent\n\n人格层待定义。\n');

  return { soul, agentBody: agentBodySections.join('\n\n').trim() };
}

function generateContract(agentId, agentType) {
  const k = toKebab(agentId);
  return `# Agent Contract v2\ncontract:\n  version: "2.0"\n  type: agent-contract\n  agent_id: "${agentId}"\n  family: "${agentType}"\n\npaths:\n  soul: "${k}/soul.agent.md"\n  agent_body: "${k}/agent-body.agent.md"\n  agent_frontmatter: "${k}/agent-frontmatter.agent.md"\n  memory: "${k}/memory.agent.md"\n    colleagues: "${k}/colleagues.agent.md"
  social: "${k}/social.agent.md"\n\ndecision_rights:\n  approve: []\n  freeze: []\n  escalate: []\n\nruntime_baseline:\n  host: copilot-host\n  tri_mc_status: planned\n  tri_mc_migration_ready: false\n`;
}

const MEMORY_TPL = '# Memory Layer Contract\n\n当前阶段：空模板。实际阶段记忆由 employee knowledge workspace 承载。\n';
const COLLEAGUES_TPL = '# Colleagues & Social Layer Contract\n\n当前阶段：空模板。实际协作关系由 runtime cognition state 承载。\n';
const SOCIAL_TPL = '# Social Layer Contract\n\n当前阶段：空模板。实际社交连续性由 runtime cognition state 承载。\n';

async function main() {
  const agentName = process.argv[2];
  if (!agentName) { console.error('Usage: node scripts/migrate-agent.mjs <agent-name>'); process.exit(1); }

  const agentFile = resolve(AGENTS_DIR, agentName + '.agent.md');
  if (!existsSync(agentFile)) { console.error('Not found: ' + agentFile); process.exit(1); }

  const kebab = toKebab(agentName);
  const targetDir = resolve(SOURCE_AGENTS_ROOT, kebab);
  mkdirSync(targetDir, { recursive: true });

  const content = readFileSync(agentFile, 'utf-8');
  const m = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  const frontmatter = m ? m[1] : '';
  const body = m ? m[2] : content;

  const isRegistry = (agentName === 'BusinessStrategy' || agentName.includes('Registry'));
  const agentType = isRegistry ? 'Registry' : 'Role';

  const { soul, agentBody } = splitBody(body, agentType);

  const files = {
    'soul.agent.md': soul + '\n',
    'agent-body.agent.md': agentBody + '\n',
    'agent-frontmatter.agent.md': '---\n' + frontmatter + '\n---\n',
    'memory.agent.md': MEMORY_TPL,
    'colleagues.agent.md': COLLEAGUES_TPL,
    'social.agent.md': SOCIAL_TPL,
  };

  for (const [fn, fc] of Object.entries(files)) {
    writeFileSync(resolve(targetDir, fn), fc, 'utf-8');
    console.log('  OK ' + kebab + '/' + fn);
  }

  writeFileSync(resolve(targetDir, agentName + '.contract.yaml'), generateContract(agentName, agentType), 'utf-8');
  console.log('  OK ' + kebab + '/' + agentName + '.contract.yaml');
  console.log('\nMigrated: ' + agentName + ' -> source-agents/' + kebab + '/');
}

main().catch(e => { console.error(e); process.exit(1); });