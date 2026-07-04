#!/usr/bin/env node
// Applies standard community/health files to a single repo.
// Usage: GITHUB_TOKEN=xxx node bootstrap_repo.js <repo-name> [org]
const TOKEN = process.env.GITHUB_TOKEN;
const repo = process.argv[2];
const ORG = process.argv[3] || 'Value-intelligence-trust';
if (!TOKEN || !repo) {
  console.error('Usage: GITHUB_TOKEN=xxx node bootstrap_repo.js <repo-name> [org]');
  process.exit(1);
}
const HEADERS = { Authorization: `token ${TOKEN}`, 'User-Agent': 'vit-devops-bootstrap', Accept: 'application/vnd.github+json' };

async function getFile(path) {
  const res = await fetch(`https://api.github.com/repos/${ORG}/${repo}/contents/${path}`, { headers: HEADERS });
  return res.status === 200 ? res.json() : null;
}
async function putFile(path, content, message) {
  const existing = await getFile(path);
  const body = { message, content: Buffer.from(content, 'utf-8').toString('base64'), branch: 'main' };
  if (existing) body.sha = existing.sha;
  const res = await fetch(`https://api.github.com/repos/${ORG}/${repo}/contents/${path}`, { method: 'PUT', headers: HEADERS, body: JSON.stringify(body) });
  console.log(res.ok ? `OK ${path}` : `FAIL ${path} ${res.status}`);
}

const STANDARD_FILES = {
  'SECURITY.md': '# Security Policy\n\nReport vulnerabilities privately to security@vitnetwork.io.\n',
  '.github/CODEOWNERS': '* @nemesistip-cloud\n',
  '.editorconfig': 'root = true\n\n[*]\ncharset = utf-8\nend_of_line = lf\ninsert_final_newline = true\nindent_style = space\nindent_size = 2\n',
  '.github/dependabot.yml': 'version: 2\nupdates:\n  - package-ecosystem: "github-actions"\n    directory: "/"\n    schedule:\n      interval: "weekly"\n',
};

(async () => {
  for (const [path, content] of Object.entries(STANDARD_FILES)) {
    if (!(await getFile(path))) await putFile(path, content, `chore: bootstrap ${path}`);
    else console.log(`skip ${path} (exists)`);
  }
})();
