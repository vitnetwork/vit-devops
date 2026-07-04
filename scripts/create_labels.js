#!/usr/bin/env node
// Usage: GITHUB_TOKEN=xxx node create_labels.js <repo-name> [org]
const TOKEN = process.env.GITHUB_TOKEN;
const repo = process.argv[2];
const ORG = process.argv[3] || 'vitnetwork';
const HEADERS = { Authorization: `token ${TOKEN}`, 'User-Agent': 'vit-devops-labels', Accept: 'application/vnd.github+json' };

const LABELS = [
  { name: 'bug', color: 'd73a4a' },
  { name: 'enhancement', color: 'a2eeef' },
  { name: 'documentation', color: '0075ca' },
  { name: 'security', color: 'b60205' },
  { name: 'good first issue', color: '7057ff' },
  { name: 'infra', color: 'fbca04' },
  { name: 'breaking-change', color: 'e11d21' },
  { name: 'needs-triage', color: 'ededed' },
];

(async () => {
  for (const label of LABELS) {
    const res = await fetch(`https://api.github.com/repos/${ORG}/${repo}/labels`, { method: 'POST', headers: HEADERS, body: JSON.stringify(label) });
    console.log(`${label.name}: ${res.status === 201 ? 'created' : res.status === 422 ? 'exists' : 'fail ' + res.status}`);
  }
})();

