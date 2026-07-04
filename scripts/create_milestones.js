#!/usr/bin/env node
// Usage: GITHUB_TOKEN=xxx node create_milestones.js <repo-name> [org]
const TOKEN = process.env.GITHUB_TOKEN;
const repo = process.argv[2];
const ORG = process.argv[3] || 'Value-intelligence-trust';
const HEADERS = { Authorization: `token ${TOKEN}`, 'User-Agent': 'vit-devops-milestones', Accept: 'application/vnd.github+json' };

const MILESTONES = [
  { title: 'v0.1 — Foundations' },
  { title: 'v1.0 — Ecosystem Launch' },
];

(async () => {
  for (const m of MILESTONES) {
    const res = await fetch(`https://api.github.com/repos/${ORG}/${repo}/milestones`, { method: 'POST', headers: HEADERS, body: JSON.stringify(m) });
    console.log(`${m.title}: ${res.status === 201 ? 'created' : res.status === 422 ? 'exists' : 'fail ' + res.status}`);
  }
})();
