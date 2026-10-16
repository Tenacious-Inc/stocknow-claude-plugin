#!/usr/bin/env node
// Repository contract checks plus Claude Code's official offline validator/loader.
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, readdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const staticOnly = process.argv.slice(2).includes('--static-only');
assert(process.argv.slice(2).every((arg) => arg === '--static-only'),
  'Usage: node scripts/validate.mjs [--static-only]');

const readJson = (path) => JSON.parse(readFileSync(join(root, path), 'utf8'));
const keys = (value) => Object.keys(value).sort();
const plugin = readJson('.claude-plugin/plugin.json');
const marketplace = readJson('.claude-plugin/marketplace.json');
const mcp = readJson('.mcp.json');

assert.equal(plugin.name, 'stocknow');
assert.match(plugin.version, /^\d+\.\d+\.\d+$/);
assert.equal(typeof plugin.description, 'string');
assert(plugin.description.trim().length > 0);
assert.equal(plugin.author.name, 'Tenacious Inc.');
assert.equal(plugin.author.url, 'https://stocknow.ai/en');
assert.equal(plugin.homepage, 'https://stocknow.ai/en/mcp');
assert.deepEqual(keys(plugin),
  ['author', 'description', 'homepage', 'keywords', 'name', 'version']);
assert(Array.isArray(plugin.keywords) && plugin.keywords.every((tag) => typeof tag === 'string'));
assert.deepEqual(mcp, {
  mcpServers: {
    stocknow: { type: 'http', url: 'https://mcp.stocknow.ai/mcp' },
  },
}, 'MCP config must contain only the public HTTP endpoint, without credentials or commands');
assert.deepEqual(marketplace, {
  name: 'stocknow-plugins',
  description: 'StockNow market data MCP plugin for Claude Code by Tenacious Inc.',
  owner: { name: 'Tenacious Inc.' },
  plugins: [{ name: plugin.name, source: '.' }],
}, 'The marketplace must resolve the plugin to this repository root');

// Scan even ignored files: accidental credentials/build output should fail locally.
const forbiddenNames = /^(?:\.env(?:\..*)?|\.DS_Store|\._.*|node_modules|dist|build|coverage|\.cache|\.mcpb-cache|__pycache__|\.claude|\.codex|\.agents|\.omc|\.?credentials(?:\.json)?|\.claude\.json)$/i;
const forbiddenExtensions = /\.(?:pem|key|p12|pfx|pyc|pyo|log|zip|tgz)$/i;
const secretPatterns = [
  /-----BEGIN (?:[A-Z ]+ )?PRIVATE KEY-----/,
  /\b(?:ghp|gho|ghu|ghs|ghr)_[A-Za-z0-9]{20,}\b/,
  /\bgithub_pat_[A-Za-z0-9_]{30,}\b/,
  /\bsk-(?:ant-)?[A-Za-z0-9_-]{24,}\b/,
  /\b(?:AKIA|ASIA)[A-Z0-9]{16}\b/,
  /\beyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\b/,
];
let fileCount = 0;
function scan(directory) {
  for (const entry of readdirSync(join(root, directory), { withFileTypes: true })) {
    if (directory === '' && entry.name === '.git') continue;
    const path = directory ? `${directory}/${entry.name}` : entry.name;
    assert(!entry.isSymbolicLink(), `Unexpected symlink: ${path}`);
    assert(!forbiddenNames.test(entry.name) && !forbiddenExtensions.test(entry.name),
      `Local credential or generated file found: ${path}`);
    if (entry.isDirectory()) {
      scan(path);
    } else {
      assert(entry.isFile(), `Unexpected filesystem entry: ${path}`);
      const content = readFileSync(join(root, path), 'utf8');
      assert(!content.includes('\0'), `Unexpected binary file: ${path}`);
      for (const pattern of secretPatterns) {
        assert(!pattern.test(content), `Potential secret found in ${path}; value withheld`);
      }
      fileCount += 1;
    }
  }
}
scan('');
console.log(`PASS static: manifests, HTTP endpoint, marketplace path, ${fileCount} source files, basic secret/debris scan`);
if (staticOnly) process.exit(0);

// Fresh config and cwd isolate all CLI writes from the user's real settings.
// These commands never start a chat, invoke a model, install a plugin, or log in.
const temporary = mkdtempSync(join(tmpdir(), 'stocknow-claude-validation-'));
const env = {
  ...process.env,
  CLAUDE_CONFIG_DIR: temporary,
  CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC: '1',
  DISABLE_TELEMETRY: '1',
  DISABLE_ERROR_REPORTING: '1',
};
function claude(args) {
  const result = spawnSync('claude', ['--bare', '--setting-sources', '', ...args], {
    cwd: temporary, env, encoding: 'utf8', timeout: 30_000,
    maxBuffer: 4 * 1024 * 1024,
  });
  if (result.error) throw result.error;
  assert.equal(result.status, 0,
    `claude ${args.join(' ')} failed:\n${result.stdout}\n${result.stderr}`);
  return result.stdout;
}
try {
  for (const path of ['.claude-plugin/plugin.json', '.claude-plugin/marketplace.json']) {
    // Explicit files ensure BOTH manifests are checked when they share a root.
    const output = claude(['plugin', 'validate', join(root, path), '--strict']);
    assert.match(output, /Validation passed/);
    console.log(`PASS Claude strict validation: ${path}`);
  }
  const inventory = JSON.parse(claude(['--plugin-dir', root, 'plugin', 'list', '--json']));
  const loaded = inventory.find((item) => item.id === 'stocknow@inline');
  assert(loaded, 'Session-only StockNow plugin missing from Claude inventory');
  assert.equal(loaded.scope, 'session');
  assert.equal(loaded.enabled, true);
  assert.equal(loaded.version, plugin.version);
  assert.equal(resolve(loaded.installPath), root);
  console.log('PASS Claude session-only plugin loading: stocknow@inline');
  const details = claude(['--plugin-dir', root, 'plugin', 'details', 'stocknow']);
  assert.match(details, /stocknow/);
  assert.match(details, /MCP servers\s*\(1\)/i);
  console.log('PASS Claude component inventory: one MCP server');
  console.log('Authenticated MCP tool calls were not tested; OAuth + StockNow PRO are required.');
} finally {
  rmSync(temporary, { recursive: true, force: true });
}
