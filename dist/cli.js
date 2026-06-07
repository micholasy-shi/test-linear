#!/usr/bin/env node
import __module from 'module';
import { NOVACLAW_EXTENSIONS_DIR, NOVACLAW_CACHE_DIR, Logger, NOVACLAW_CONFIG_PATH, createError, toErrorMessage, ErrorCodes, deepMerge, NOVACLAW_HOME, NOVACLAW_OVERRIDES_PATH, NOVACLAW_WORKSPACE_DIR, __export, NOVACLAW_KEYFILE_PATH, NOVACLAW_AUTH_TOKEN_PATH, formatDuration, formatBytes, NOVACLAW_PID_PATH, generateId, resolveWorkspaceDir, SKILLS_SUBDIR, debounce, NOVACLAW_SKILLS_DIR, mergeInPlace, PathResolver, toErrorName } from './chunk-ZPJWKRPP.js';
import { existsSync, realpathSync, readFileSync, readdirSync, mkdirSync, cpSync, writeFileSync, statSync } from 'fs';
import { pathToFileURL, fileURLToPath } from 'url';
import chalk, { Chalk } from 'chalk';
import { readFile, mkdir, writeFile, chmod, unlink, readdir, stat, rm } from 'fs/promises';
import path, { join, resolve, dirname, extname, basename } from 'path';
import crypto2, { createDecipheriv, randomBytes, createCipheriv, createHash, timingSafeEqual, randomUUID } from 'crypto';
import { performance as performance$1 } from 'perf_hooks';
import { EventEmitter } from 'events';
import { homedir, totalmem, hostname, cpus, freemem } from 'os';
import { Client } from '@modelcontextprotocol/sdk/client';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import { execa } from 'execa';
import { parse, stringify } from 'yaml';
import { watch } from 'chokidar';
import fastifyWebsocket from '@fastify/websocket';
import Fastify from 'fastify';
import { exec, execSync } from 'child_process';
import { promisify } from 'util';
import * as p2 from '@clack/prompts';
import { createInterface } from 'readline';

__module.createRequire(import.meta.url);
var PALETTE = {
  accent: "#6C5CE7",
  accentBright: "#A29BFE",
  accentDim: "#5A4BD1",
  info: "#74B9FF",
  success: "#00B894",
  warn: "#FDCB6E",
  error: "#E17055",
  muted: "#B2BEC3"
};
var hasForceColor = typeof process.env.FORCE_COLOR === "string" && process.env.FORCE_COLOR.trim().length > 0 && process.env.FORCE_COLOR.trim() !== "0";
var base = process.env.NO_COLOR && !hasForceColor ? new Chalk({ level: 0 }) : chalk;
var hex = (v) => base.hex(v);
var t = {
  accent: hex(PALETTE.accent),
  accentBright: hex(PALETTE.accentBright),
  accentDim: hex(PALETTE.accentDim),
  info: hex(PALETTE.info),
  success: hex(PALETTE.success),
  warn: hex(PALETTE.warn),
  error: hex(PALETTE.error),
  muted: hex(PALETTE.muted),
  heading: base.bold.hex(PALETTE.accent),
  bold: base.bold,
  dim: base.dim
};
var isRich = () => base.level > 0;
function banner(version) {
  if (!process.stdout.isTTY) return `NovaClaw v${version}`;
  const logo = t.heading("\u25C7 NovaClaw");
  const ver = t.info(`v${version}`);
  const sep = t.muted("\u2014");
  const tag = t.accentDim("Lightweight AI Gateway");
  return `
${logo} ${ver} ${sep} ${tag}
`;
}
function section(title) {
  return t.heading(title);
}
function item(key, value) {
  return `  ${t.muted("\u25B8")} ${t.bold(key)}  ${value}`;
}
function ok(msg) {
  return `${t.success("\u2714")} ${msg}`;
}
function fail(msg) {
  return `${t.error("\u2716")} ${msg}`;
}
function warn(msg) {
  return `${t.warn("\u26A0")} ${msg}`;
}
function url(href) {
  return t.accentBright(base.underline(href));
}
function cmd(text2) {
  return t.accent(text2);
}
function muted(text2) {
  return t.muted(text2);
}
function keyVal(k, v) {
  return `${t.muted(k + ":")} ${v}`;
}
function divider() {
  const cols = process.stdout.columns ?? 60;
  const w = Math.min(cols, 60);
  return t.muted("\u2500".repeat(w));
}
var cached = null;
function resolvePackageJsonPath() {
  const thisFile = fileURLToPath(import.meta.url);
  return resolve(dirname(thisFile), "../../package.json");
}
function getVersionSync() {
  if (cached) return cached;
  try {
    const pkg = JSON.parse(readFileSync(resolvePackageJsonPath(), "utf-8"));
    cached = pkg.version ?? "0.0.0";
  } catch {
    cached = "0.0.0";
  }
  return cached;
}
async function getVersion() {
  if (cached) return cached;
  try {
    const pkg = JSON.parse(await readFile(resolvePackageJsonPath(), "utf-8"));
    cached = pkg.version ?? "0.0.0";
  } catch {
    cached = "0.0.0";
  }
  return cached;
}

// src/cli/registry.ts
var CommandRegistry = class {
  commands = /* @__PURE__ */ new Map();
  logger;
  constructor(logger3) {
    this.logger = logger3;
  }
  register(command) {
    this.commands.set(command.name, command);
    if (command.aliases) {
      for (const alias of command.aliases) {
        this.commands.set(alias, command);
      }
    }
  }
  registerAll(commands) {
    for (const cmd2 of commands) {
      this.register(cmd2);
    }
  }
  async run(args) {
    const [commandName, ...params] = args;
    const silent = commandName === "version" || commandName === "-v" || commandName === "--version";
    if (!silent) await this.emitBanner();
    try {
      if (!commandName) {
        const helpCmd = this.commands.get("help");
        if (helpCmd) return helpCmd.execute([], this.logger);
        return;
      }
      const cmd2 = this.commands.get(commandName);
      if (!cmd2) {
        console.error(fail(`Unknown command: ${t.bold(String(commandName))}`));
        console.error(muted(`Run ${cmd("novaclaw help")} for usage information`));
        process.exit(1);
      }
      await cmd2.execute(params, this.logger);
    } catch (error) {
      this.logger.error("CLI error", { error: toErrorMessage(error) });
      console.error(fail(toErrorMessage(error)));
      process.exit(1);
    }
  }
  async emitBanner() {
    const v = await getVersion();
    process.stdout.write(banner(v));
  }
};
async function persistAuthToken(token) {
  await mkdir(NOVACLAW_HOME, { recursive: true });
  await writeFile(NOVACLAW_AUTH_TOKEN_PATH, token, "utf-8");
}
async function readAuthToken() {
  try {
    return (await readFile(NOVACLAW_AUTH_TOKEN_PATH, "utf-8")).trim();
  } catch {
    return null;
  }
}
async function writePidFile(pid, port) {
  await mkdir(NOVACLAW_HOME, { recursive: true });
  await writeFile(NOVACLAW_PID_PATH, JSON.stringify({ pid, port, startedAt: Date.now() }), "utf-8");
}
async function readPidFile() {
  try {
    const raw = await readFile(NOVACLAW_PID_PATH, "utf-8");
    return JSON.parse(raw);
  } catch {
    return null;
  }
}
async function removePidFile() {
  try {
    await unlink(NOVACLAW_PID_PATH);
  } catch {
  }
}
function isProcessAlive(pid) {
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}
function getPidFilePath() {
  return NOVACLAW_PID_PATH;
}
var BackgroundIndexer = class {
  constructor(memoryEngine, config, logger3, onComplete) {
    this.memoryEngine = memoryEngine;
    this.config = config;
    this.logger = logger3;
    this.onComplete = onComplete;
  }
  memoryEngine;
  config;
  logger;
  onComplete;
  abort = null;
  promise = null;
  start() {
    if (!this.memoryEngine.enabled) {
      this.logger.debug("Skipping background indexing (memory disabled)");
      return;
    }
    this.logger.info("Starting background indexing...");
    this.abort = new AbortController();
    const signal = this.abort.signal;
    const t0 = performance$1.now();
    this.promise = this.run(signal, t0);
  }
  async cancel() {
    if (this.abort) {
      this.abort.abort();
      this.logger.info("Cancelled background indexing");
    }
    if (this.promise) {
      await this.promise;
    }
  }
  get running() {
    return this.promise !== null;
  }
  async run(signal, t0) {
    try {
      let totalIndexed = 0;
      if (this.config.workspaceDir) {
        if (signal.aborted) return;
        const count = await this.memoryEngine.indexWorkspace(this.config.workspaceDir);
        totalIndexed += count;
        this.logger.info("Workspace indexing done", { indexed: count });
      }
      if (signal.aborted) return;
      const convList = await this.memoryEngine.listConversations();
      let indexed = 0;
      for (const summary of convList) {
        if (signal.aborted) {
          this.logger.info("Background indexing cancelled");
          return;
        }
        try {
          const conv = await this.memoryEngine.getConversation(summary.id);
          if (conv && conv.messages.length > 0) {
            const ok3 = await this.memoryEngine.indexConversation(conv);
            if (ok3) indexed++;
          }
        } catch (err) {
          this.logger.debug("Skipping corrupt conversation", {
            id: summary.id,
            error: toErrorMessage(err)
          });
        }
      }
      totalIndexed += indexed;
      if (indexed > 0) {
        this.logger.info("Conversation indexing done", {
          indexed,
          total: convList.length
        });
      }
      const elapsed = performance$1.now() - t0;
      this.logger.info("Background indexing complete", this.memoryEngine.getStats());
      this.onComplete?.({ indexed: totalIndexed, elapsed });
    } catch (err) {
      if (signal.aborted) return;
      this.logger.warn("Background indexing failed (non-critical)", err);
    } finally {
      this.abort = null;
      this.promise = null;
    }
  }
};

// src/framework/registries/base-registry.ts
var BaseRegistry = class {
  entries = /* @__PURE__ */ new Map();
  label;
  constructor(label) {
    this.label = label;
  }
  register(id, entry) {
    if (!id?.trim()) {
      throw new Error(`${this.label}: id must be a non-empty string`);
    }
    this.entries.set(id, entry);
  }
  unregister(id) {
    return this.entries.delete(id);
  }
  get(id) {
    return this.entries.get(id);
  }
  getAll() {
    return new Map(this.entries);
  }
  listIds() {
    return Array.from(this.entries.keys());
  }
  has(id) {
    return this.entries.has(id);
  }
  get size() {
    return this.entries.size;
  }
  /**
   * Register by explicit id + entry, or by a self-identifying entry.
   * Subclasses with `register(entry: T)` overloads can delegate here.
   */
  registerByIdOrEntry(idOrEntry, entry) {
    if (typeof idOrEntry === "string") {
      if (!entry) throw new Error(`${this.label}: entry is required when registering by id`);
      this.register(idOrEntry, entry);
    } else {
      const id = idOrEntry.id?.trim();
      if (!id) throw new Error(`${this.label}: entry must have a non-empty id`);
      this.register(id, idOrEntry);
    }
  }
};

// src/framework/registries/provider-registry.ts
var ProviderRegistry = class extends BaseRegistry {
  constructor() {
    super("ProviderRegistry");
  }
  register(id, factoryOrEntry, options) {
    if (this.isRegistryEntry(factoryOrEntry)) {
      super.register(id, factoryOrEntry);
    } else {
      super.register(id, {
        factory: factoryOrEntry,
        version: options?.version
      });
    }
  }
  isRegistryEntry(value) {
    return "factory" in value && value.factory != null && typeof value.factory === "object" && "create" in value.factory && typeof value.factory.create === "function";
  }
  getFactory(id) {
    return this.entries.get(id)?.factory;
  }
  create(id, config) {
    const entry = this.entries.get(id);
    if (!entry) return null;
    return entry.factory.create(config);
  }
};

// src/framework/registries/tool-provider-registry.ts
var ToolProviderRegistry = class extends BaseRegistry {
  constructor() {
    super("ToolProviderRegistry");
  }
  register(nameOrId, toolOrEntry, options) {
    if ("tool" in toolOrEntry && typeof toolOrEntry.tool === "object") {
      super.register(nameOrId, toolOrEntry);
    } else {
      if (!toolOrEntry) throw new Error("ToolProviderRegistry: tool must not be null/undefined");
      super.register(nameOrId, {
        tool: toolOrEntry,
        tags: options?.tags,
        version: options?.version
      });
    }
  }
  getTool(name) {
    return this.entries.get(name)?.tool;
  }
  getEntry(name) {
    return this.get(name);
  }
  /** Returns all tools as array. Use getAllEntries() for Map of entries. */
  getAllTools() {
    return Array.from(this.entries.values()).map((e) => e.tool);
  }
  getAllEntries() {
    return new Map(this.entries);
  }
};

// src/framework/registries/channel-plugin-registry.ts
var ChannelPluginRegistry = class extends BaseRegistry {
  constructor() {
    super("ChannelPluginRegistry");
  }
  register(id, pluginOrFactoryOrEntry, options) {
    const isEntry = (x) => typeof x === "object" && x !== null && ("plugin" in x || "factory" in x);
    if (isEntry(pluginOrFactoryOrEntry)) {
      super.register(id, pluginOrFactoryOrEntry);
      return;
    }
    const isFactory = typeof pluginOrFactoryOrEntry === "function";
    const entry = {
      plugin: isFactory ? void 0 : pluginOrFactoryOrEntry,
      factory: isFactory ? pluginOrFactoryOrEntry : void 0,
      version: options?.version
    };
    super.register(id, entry);
  }
};

// src/framework/core/rules/rule-engine.ts
var RuleEngine = class {
  rules = [];
  constructor(options = {}) {
    if (Array.isArray(options.rules)) {
      this.rules = [...options.rules];
      this.sortRules();
    }
  }
  register(rule) {
    const idx = this.rules.findIndex((r) => r.id === rule.id);
    if (idx >= 0) this.rules[idx] = rule;
    else this.rules.push(rule);
    this.sortRules();
  }
  unregister(ruleId) {
    const idx = this.rules.findIndex((r) => r.id === ruleId);
    if (idx < 0) return false;
    this.rules.splice(idx, 1);
    return true;
  }
  get(id) {
    return this.rules.find((r) => r.id === id);
  }
  listIds() {
    return this.rules.map((r) => r.id);
  }
  getAll() {
    return [...this.rules];
  }
  getRulesByPhase(phase) {
    return this.rules.filter((r) => r.phase === phase);
  }
  /**
   * Evaluate context against all rules in priority order.
   * First rule returning a reject/rewrite/transform short-circuits.
   */
  evaluate(ctx) {
    for (const rule of this.rules) {
      const verdict = rule.evaluate(ctx);
      if (verdict === void 0) continue;
      if (verdict.action === "reject" || verdict.action === "rewrite" || verdict.action === "transform") {
        return verdict;
      }
    }
    return { action: "allow" };
  }
  /**
   * Evaluate only rules matching a specific phase and optional scope.
   * Rules without a phase are skipped.
   */
  evaluatePhase(phase, ctx, scope) {
    const contextWithPhase = { ...ctx, phase };
    for (const rule of this.rules) {
      if (rule.phase !== phase) continue;
      if (scope && rule.scope) {
        if (rule.scope.agents?.length && scope.agentId && !rule.scope.agents.includes(scope.agentId)) {
          continue;
        }
        if (rule.scope.channels?.length && scope.channel && !rule.scope.channels.includes(scope.channel)) {
          continue;
        }
      }
      const verdict = rule.evaluate(contextWithPhase);
      if (verdict === void 0) continue;
      if (verdict.action === "reject" || verdict.action === "rewrite" || verdict.action === "transform") {
        return verdict;
      }
    }
    return { action: "allow" };
  }
  sortRules() {
    this.rules.sort((a, b) => b.priority - a.priority);
  }
};

// src/framework/registries/rule-registry.ts
var RuleRegistry = class {
  engine;
  constructor(options = {}) {
    this.engine = new RuleEngine({ rules: options.rules });
  }
  register(rule) {
    this.engine.register(rule);
  }
  unregister(ruleId) {
    return this.engine.unregister(ruleId);
  }
  get(id) {
    return this.engine.get(id);
  }
  listIds() {
    return this.engine.listIds();
  }
  getAll() {
    return this.engine.getAll();
  }
  getRulesByPhase(phase) {
    return this.engine.getRulesByPhase(phase);
  }
  evaluate(ctx) {
    return this.engine.evaluate(ctx);
  }
  evaluatePhase(phase, ctx, scope) {
    return this.engine.evaluatePhase(phase, ctx, scope);
  }
  getEngine() {
    return this.engine;
  }
};

// src/framework/registries/memory-provider-registry.ts
var MemoryProviderRegistry = class extends BaseRegistry {
  constructor() {
    super("MemoryProviderRegistry");
  }
  register(id, factoryOrEntry, options) {
    if ("factory" in factoryOrEntry && typeof factoryOrEntry.factory === "function") {
      super.register(id, factoryOrEntry);
    } else {
      super.register(id, { factory: factoryOrEntry, version: options?.version });
    }
  }
  /**
   * Create a memory provider instance. Uses "local" if id is missing or not registered.
   */
  create(id, config, options) {
    const entry = this.entries.get(id);
    if (!entry) return null;
    return entry.factory(config, options);
  }
};

// src/constants/timeouts.ts
var TOOL_TIMEOUT_MS = 12e5;
var PROCESS_TOOL_TIMEOUT_MS = 12e5;
var LLM_HTTP_TIMEOUT_MS = 9e4;
var LLM_STREAM_STALL_MS = 12e4;
var LLM_COMPLETE_TIMEOUT_MS = 6e4;
var MESSAGE_TIMEOUT_MS = 12e5;
var SESSION_TIMEOUT_MS = 12e4;
var HEALTH_CHECK_INTERVAL_MS = 3e4;
var RESTART_DELAY_MS = 1e3;
var STOP_TIMEOUT_MS = 1e4;
var STOP_POLL_INTERVAL_MS = 300;
var PROVIDER_TEST_TIMEOUT_MS = 1e4;
var DEFAULT_RSS_LIMIT_MB = 512;
var MIN_SYSTEM_MEMORY_MB = 512;
var MIN_NODE_MAJOR_VERSION = 22;

// src/framework/core/provider/sse-reader.ts
async function* readResponseLines(reader, options = {}) {
  const { stallTimeoutMs = LLM_STREAM_STALL_MS, onStall, stats } = options;
  const decoder = new TextDecoder();
  let buffer = "";
  let stallTimer = null;
  const resetStall = () => {
    if (stallTimer) clearTimeout(stallTimer);
    if (onStall) stallTimer = setTimeout(onStall, stallTimeoutMs);
  };
  try {
    resetStall();
    for (; ; ) {
      const { done, value } = await reader.read();
      if (done) break;
      if (stats) {
        stats.readCount++;
        if (stats.firstReadTime === null) stats.firstReadTime = performance.now();
        if (value) stats.totalBytes += value.byteLength;
      }
      buffer += decoder.decode(value, { stream: true });
      let start = 0;
      let nlIdx;
      while ((nlIdx = buffer.indexOf("\n", start)) !== -1) {
        const line = buffer.substring(start, nlIdx);
        start = nlIdx + 1;
        if (line) {
          if (line.charCodeAt(0) !== 58) resetStall();
          yield line;
        }
      }
      if (start > 0) buffer = buffer.substring(start);
    }
    if (buffer.trim()) yield buffer;
  } finally {
    if (stallTimer) clearTimeout(stallTimer);
    reader.releaseLock();
  }
}
function parseSSEData(line) {
  if (!line.startsWith("data: ")) return null;
  const data = line.substring(6).trim();
  if (!data || data === "[DONE]") return null;
  return data;
}

// src/framework/core/provider/errors.ts
var LLMApiError = class extends Error {
  constructor(message, statusCode, retryAfterSeconds, provider) {
    super(message);
    this.statusCode = statusCode;
    this.retryAfterSeconds = retryAfterSeconds;
    this.provider = provider;
    this.name = "LLMApiError";
  }
  statusCode;
  retryAfterSeconds;
  provider;
  get isRateLimit() {
    return this.statusCode === 429;
  }
  get isAuth() {
    return this.statusCode === 401 || this.statusCode === 403;
  }
  get isModelNotFound() {
    return this.statusCode === 404;
  }
  get isBadRequest() {
    return this.statusCode === 422;
  }
};

// src/framework/core/provider/base-stream-provider.ts
var BaseStreamProvider = class _BaseStreamProvider {
  constructor(providerKey, config) {
    this.providerKey = providerKey;
    this.config = config;
    this.logger = new Logger(`LLM:${providerKey}`, config.logLevel ?? "info");
  }
  providerKey;
  config;
  logger;
  // -- chatComplete (shared) ------------------------------------------------
  static COMPLETE_TIMEOUT_MS = LLM_COMPLETE_TIMEOUT_MS;
  async chatComplete(model, messages2, options) {
    const url2 = this.buildCompleteUrl(model);
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), _BaseStreamProvider.COMPLETE_TIMEOUT_MS);
    const linkAbort = () => controller.abort();
    options?.abortSignal?.addEventListener("abort", linkAbort, { once: true });
    try {
      const res = await fetch(url2, {
        method: "POST",
        headers: this.buildHeaders(),
        body: JSON.stringify(this.buildCompleteBody(model, messages2, options?.maxTokens ?? 2048)),
        signal: controller.signal
      });
      if (!res.ok) {
        const errText = await res.text().catch(() => "");
        const retryAfterRaw = res.headers.get("retry-after");
        const retryAfterSec = retryAfterRaw ? parseInt(retryAfterRaw, 10) || null : null;
        this.logger.warn("chatComplete API error", { status: res.status, body: errText.slice(0, 200) });
        throw new LLMApiError(`chatComplete ${res.status}: ${errText}`, res.status, retryAfterSec, this.providerKey);
      }
      return this.extractCompleteContent(await res.json());
    } catch (err) {
      if (err instanceof LLMApiError) throw err;
      const msg = toErrorName(err) === "AbortError" ? "timeout" : toErrorMessage(err);
      this.logger.warn("chatComplete failed", { reason: msg });
      return null;
    } finally {
      clearTimeout(timer);
      options?.abortSignal?.removeEventListener("abort", linkAbort);
    }
  }
  // -- chatStream (shared) --------------------------------------------------
  async *chatStream(model, messages2, options) {
    const url2 = this.buildStreamUrl(model);
    const body = this.buildStreamBody(model, messages2, options);
    const payloadJson = JSON.stringify(body);
    this.logger.debug("Sending request", {
      model,
      messages: messages2.length,
      tools: options?.tools?.length ?? 0,
      payloadKB: (payloadJson.length / 1024).toFixed(1)
    });
    const HTTP_TIMEOUT_MS = this.config.httpTimeoutMs ?? LLM_HTTP_TIMEOUT_MS;
    const STREAM_STALL_TIMEOUT_MS = this.config.streamStallMs ?? LLM_STREAM_STALL_MS;
    const internalController = new AbortController();
    const linkAbort = () => internalController.abort();
    options?.abortSignal?.addEventListener("abort", linkAbort, { once: true });
    const httpTimer = setTimeout(() => {
      this.logger.warn(`HTTP timeout after ${HTTP_TIMEOUT_MS}ms`);
      internalController.abort();
    }, HTTP_TIMEOUT_MS);
    const tFetch0 = performance$1.now();
    const MAX_RETRIES = 2;
    let res;
    let lastErr;
    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      try {
        res = await fetch(url2, {
          method: "POST",
          headers: { ...this.buildHeaders(), Connection: "keep-alive" },
          body: payloadJson,
          signal: internalController.signal
        });
        if (res.ok || res.status < 500 || attempt === MAX_RETRIES) break;
        this.logger.warn(`Transient ${res.status}, retry ${attempt + 1}/${MAX_RETRIES}`);
        const backoff = Math.min(1e3 * 2 ** attempt, 4e3);
        await new Promise((r) => setTimeout(r, backoff));
        continue;
      } catch (err) {
        lastErr = err;
        if (internalController.signal.aborted) break;
        if (attempt < MAX_RETRIES) {
          this.logger.warn(`Fetch error, retry ${attempt + 1}/${MAX_RETRIES}: ${toErrorMessage(err)}`);
          const backoff = Math.min(1e3 * 2 ** attempt, 4e3);
          await new Promise((r) => setTimeout(r, backoff));
          continue;
        }
        break;
      }
    }
    clearTimeout(httpTimer);
    if (!res) {
      options?.abortSignal?.removeEventListener("abort", linkAbort);
      const elapsed = performance$1.now() - tFetch0;
      if (internalController.signal.aborted && elapsed >= HTTP_TIMEOUT_MS - 500) {
        throw new LLMApiError(
          `${this.providerKey} HTTP timeout: no response after ${(elapsed / 1e3).toFixed(1)}s`,
          408,
          null,
          this.providerKey
        );
      }
      throw lastErr;
    }
    const tFetch1 = performance$1.now();
    this.logger.debug(`Response received (${(tFetch1 - tFetch0).toFixed(0)}ms)`, { status: res.status });
    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      const retryAfterRaw = res.headers.get("retry-after");
      const retryAfterSec = retryAfterRaw ? parseInt(retryAfterRaw, 10) || null : null;
      if (res.status === 422) {
        this.logger.warn("422 Unprocessable Entity", { body: errText.slice(0, 300) });
      } else if (res.status === 429) {
        this.logger.warn("429 Rate Limited", { retryAfter: retryAfterSec });
      } else {
        this.logger.warn(`HTTP ${res.status}`, { body: errText.slice(0, 300) });
      }
      throw new LLMApiError(`API ${res.status}: ${errText}`, res.status, retryAfterSec, this.providerKey);
    }
    const reader = res.body?.getReader();
    if (!reader) {
      yield { type: "error", error: "No response body" };
      return;
    }
    let totalInput = 0;
    let totalOutput = 0;
    const toolCallsAccumulator = /* @__PURE__ */ new Map();
    const tStreamBody0 = performance$1.now();
    const stats = { firstReadTime: null, readCount: 0, totalBytes: 0 };
    let finished = false;
    let linesAfterFinish = 0;
    let lineCount = 0;
    try {
      for await (const line of readResponseLines(reader, {
        stallTimeoutMs: STREAM_STALL_TIMEOUT_MS,
        onStall: () => {
          const elapsed = (performance$1.now() - tStreamBody0).toFixed(0);
          this.logger.warn(`Stream stalled for ${STREAM_STALL_TIMEOUT_MS}ms, aborting`, {
            elapsedMs: elapsed,
            reads: stats.readCount,
            bytes: stats.totalBytes
          });
          internalController.abort();
        },
        stats
      })) {
        lineCount++;
        const data = parseSSEData(line);
        if (data) {
          try {
            const json = JSON.parse(data);
            const result = this.parseSSEPayload(json);
            for (const chunk of result.chunks) yield chunk;
            if (result.toolCalls) {
              for (const tc of result.toolCalls) {
                const key = tc.index;
                let acc = toolCallsAccumulator.get(key);
                if (!acc) {
                  acc = {
                    id: tc.id ?? crypto2.randomUUID(),
                    name: tc.name?.trim() || "exec",
                    argsBuffer: ""
                  };
                  toolCallsAccumulator.set(key, acc);
                }
                if (tc.id) acc.id = tc.id;
                if (tc.name) acc.name = tc.name.trim();
                if (tc.argsFragment) acc.argsBuffer += tc.argsFragment;
              }
            }
            if (result.usage) {
              totalInput = result.usage.input;
              totalOutput = result.usage.output;
            }
            if (result.finished) finished = true;
          } catch {
          }
        } else if (line.trim() && !line.startsWith(":")) {
          try {
            const json = JSON.parse(line);
            if (typeof json.content === "string") yield { type: "content", content: json.content };
          } catch {
          }
        }
        if (finished) {
          linesAfterFinish++;
        }
      }
    } finally {
      options?.abortSignal?.removeEventListener("abort", linkAbort);
    }
    yield* this.emitAccumulatedToolCalls(toolCallsAccumulator);
    const tStreamBodyEnd = performance$1.now();
    this.logger.debug(`Stream complete (${(tStreamBodyEnd - tFetch0).toFixed(0)}ms)`, {
      httpWaitMs: +(tFetch1 - tFetch0).toFixed(0),
      streamMs: +(tStreamBodyEnd - tStreamBody0).toFixed(0),
      reads: stats.readCount,
      bytes: stats.totalBytes,
      tokens: { in: totalInput, out: totalOutput },
      toolCalls: toolCallsAccumulator.size
    });
    if (totalInput > 0 || totalOutput > 0) {
      yield {
        type: "usage",
        usage: { totalTokens: totalInput + totalOutput, inputTokens: totalInput, outputTokens: totalOutput }
      };
    }
  }
  *emitAccumulatedToolCalls(accumulator) {
    for (const [, acc] of Array.from(accumulator.entries()).sort(([a], [b]) => {
      if (typeof a === "number" && typeof b === "number") return a - b;
      return String(a).localeCompare(String(b));
    })) {
      this.logger.debug("Tool call parsed", { name: acc.name });
      let args = {};
      try {
        if (acc.argsBuffer.trim()) args = JSON.parse(acc.argsBuffer);
      } catch {
        this.logger.warn("Tool call args parse failed, using raw as command", {
          argsBuffer: acc.argsBuffer.slice(0, 200)
        });
        args = { command: acc.argsBuffer.trim() || "" };
      }
      yield {
        type: "tool_call",
        toolCall: { id: acc.id, name: acc.name, args, status: "running" }
      };
    }
  }
};

// src/framework/core/provider/message-utils.ts
function extractSystemPrompt(messages2) {
  let systemPrompt = "";
  const nonSystemMessages = [];
  for (const msg of messages2) {
    if (msg.role === "system") {
      systemPrompt += typeof msg.content === "string" ? msg.content : JSON.stringify(msg.content);
      continue;
    }
    nonSystemMessages.push(msg);
  }
  return { systemPrompt, nonSystemMessages };
}

// src/framework/core/provider/openai-compatible.ts
var OpenAICompatibleProvider = class extends BaseStreamProvider {
  name = "openai-compatible";
  constructor(providerKey, config) {
    super(providerKey, config);
  }
  // -- Hook implementations -------------------------------------------------
  buildStreamUrl(model) {
    return `${this.config.baseUrl}/v1/chat/completions`;
  }
  buildCompleteUrl(model) {
    return `${this.config.baseUrl}/v1/chat/completions`;
  }
  buildHeaders() {
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${this.config.apiKey}`
    };
    const extra = this.config;
    if (extra.extraHeaders) {
      Object.assign(headers, extra.extraHeaders);
    }
    return headers;
  }
  buildCompleteBody(model, messages2, maxTokens) {
    const { systemPrompt, nonSystemMessages } = extractSystemPrompt(messages2);
    const messagesToSend = systemPrompt ? [{ role: "system", content: systemPrompt }, ...nonSystemMessages] : nonSystemMessages;
    const extra = this.config;
    return {
      model,
      messages: messagesToSend,
      stream: false,
      max_tokens: maxTokens,
      temperature: extra.defaultTemperature ?? 0.7
    };
  }
  extractCompleteContent(json) {
    const data = json;
    const msg = data.choices?.[0]?.message;
    const reasoning = msg?.reasoning_content ?? "";
    const content = msg?.content?.trim() ?? "";
    if (!reasoning && !content) return null;
    return reasoning ? `<think>${reasoning}</think>
${content}` : content;
  }
  buildStreamBody(model, messages2, options) {
    const { systemPrompt, nonSystemMessages } = extractSystemPrompt(messages2);
    const messagesToSend = systemPrompt ? [{ role: "system", content: systemPrompt }, ...nonSystemMessages] : nonSystemMessages;
    const body = {
      model,
      messages: messagesToSend,
      stream: true,
      stream_options: { include_usage: true },
      max_tokens: options?.maxTokens ?? 4096,
      temperature: options?.temperature ?? 0.7,
      top_p: options?.topP ?? 1,
      frequency_penalty: options?.frequencyPenalty ?? 0,
      presence_penalty: options?.presencePenalty ?? 0
    };
    if (options?.stop != null) body.stop = options.stop;
    if (options?.responseFormat) body.response_format = options.responseFormat;
    if (options?.enableThinking != null) body.enable_thinking = options.enableThinking;
    if (options?.tools && options.tools.length > 0) {
      body.tools = options.tools;
      body.tool_choice = "auto";
    }
    return body;
  }
  parseSSEPayload(json) {
    const chunks = [];
    const toolCalls = [];
    let usage;
    let finished = false;
    const choices = json.choices;
    const choice = choices?.[0];
    const delta = choice?.delta;
    if (typeof delta?.content === "string" && delta.content) {
      chunks.push({ type: "content", content: delta.content });
    }
    if (typeof delta?.reasoning_content === "string" && delta.reasoning_content) {
      chunks.push({ type: "reasoning", content: delta.reasoning_content });
    }
    if (Array.isArray(delta?.tool_calls)) {
      for (const tc of delta.tool_calls) {
        const fn = tc.function;
        toolCalls.push({
          index: tc.index ?? 0,
          id: typeof tc.id === "string" ? tc.id : void 0,
          name: fn?.name,
          argsFragment: fn?.arguments
        });
      }
    }
    if (typeof json.content === "string") chunks.push({ type: "content", content: json.content });
    if (typeof json.text === "string") chunks.push({ type: "content", content: json.text });
    const msg = json.message;
    if (typeof msg?.content === "string") chunks.push({ type: "content", content: msg.content });
    if (typeof msg?.reasoning_content === "string" && msg.reasoning_content) {
      chunks.push({ type: "reasoning", content: msg.reasoning_content });
    }
    const choiceUsage = choice?.usage;
    if (choiceUsage) {
      const input = choiceUsage.prompt_tokens ?? 0;
      const output = choiceUsage.completion_tokens ?? 0;
      if (input || output) usage = { input, output };
    }
    const topUsage = json.usage;
    if (topUsage) {
      const input = topUsage.prompt_tokens ?? 0;
      const output = topUsage.completion_tokens ?? 0;
      if (input || output) usage = { input, output };
    }
    const fr = choice?.finish_reason;
    if (typeof fr === "string") finished = true;
    return { chunks, toolCalls: toolCalls.length > 0 ? toolCalls : void 0, usage, finished };
  }
};

// src/framework/core/channel/constants.ts
var BUILTIN_CHANNEL_IDS = ["webchat", "cli", "rest-api"];
var CHANNEL = {
  CLI: "cli",
  WEBCHAT: "webchat"};

// src/framework/core/channel/allowlist.ts
function mergeDmAllowFromSources(sources) {
  const { allowFrom = [], storeAllowFrom = [], dmPolicy } = sources;
  if (dmPolicy?.policy === "allowlist") {
    return [...allowFrom];
  }
  const merged = /* @__PURE__ */ new Set();
  for (const entry of allowFrom) merged.add(entry);
  for (const entry of storeAllowFrom) merged.add(entry);
  return Array.from(merged);
}
function resolveAllowlistMatch(params) {
  const { allowFrom, senderId, senderName, allowNameMatching = false } = params;
  if (allowFrom.length === 0) {
    return { allowed: true, matchedBy: "wildcard" };
  }
  for (const entry of allowFrom) {
    const normalized = String(entry).trim();
    if (normalized === "*") {
      return { allowed: true, matchedBy: "wildcard" };
    }
    if (normalized === senderId) {
      return { allowed: true, matchedBy: "id" };
    }
    if (allowNameMatching && senderName && normalized.toLowerCase() === senderName.toLowerCase()) {
      return { allowed: true, matchedBy: "name" };
    }
  }
  return { allowed: false };
}

// src/framework/core/channel/pipeline/inbound/security-gate.ts
var SecurityGate = class {
  check(plugin, channelId, msg, config) {
    const senderId = msg.senderId ?? msg.userId ?? msg.from ?? "";
    const senderName = msg.fromName;
    const channelCfg = config.channels?.[channelId];
    const configAllowFrom = channelCfg?.allowFrom ?? [];
    const dmPolicy = channelCfg?.dmPolicy;
    let allowFrom = [...configAllowFrom];
    if (plugin?.security?.resolveDmPolicy) {
      const dm = plugin.security.resolveDmPolicy({
        cfg: config,
        accountId: msg.accountId ?? "default"
      });
      if (dm?.allowFrom) {
        allowFrom = mergeDmAllowFromSources({
          allowFrom: [...allowFrom, ...dm.allowFrom],
          dmPolicy: dm
        });
      }
    } else if (configAllowFrom.length > 0 && dmPolicy) {
      allowFrom = mergeDmAllowFromSources({
        allowFrom,
        dmPolicy: { policy: dmPolicy, allowFromPath: "", approveHint: "" }
      });
    }
    if (allowFrom.length === 0) return { allowed: true };
    const match = resolveAllowlistMatch({
      allowFrom,
      senderId,
      senderName,
      allowNameMatching: true
    });
    if (match.allowed) return { allowed: true };
    return {
      allowed: false,
      emitPairing: !!plugin?.pairing,
      senderId,
      senderName
    };
  }
};

// src/framework/core/channel/pipeline/inbound/mention-gate.ts
var MentionGate = class {
  /**
   * Returns `true` if the message should proceed through the pipeline.
   * Returns `false` to silently drop the message.
   */
  check(plugin, channelId, msg, chatType, config) {
    const isGroup = chatType === "group" || chatType === "channel" || chatType === "thread";
    if (!isGroup || !plugin?.mentions) return true;
    const requireMention = plugin.groups?.resolveRequireMention?.({
      cfg: config,
      channelId,
      accountId: msg.accountId ?? "default",
      peerId: msg.to ?? msg.peerId ?? "",
      peerKind: chatType,
      guildId: msg.guildId,
      teamId: msg.teamId
    });
    if (!requireMention) return true;
    const botName = plugin.meta?.label ?? plugin.id;
    const body = msg.body ?? msg.text ?? "";
    return !!plugin.mentions.isMentioned?.({
      text: body,
      botName,
      botId: msg.botId
    });
  }
};

// src/framework/core/channel/pipeline/routing/bindings.ts
var MATCH_SCORES = {
  peer: 100,
  parentPeer: 90,
  guildRoles: 80,
  guild: 70,
  team: 60,
  account: 50,
  channel: 40};
function matchBinding(binding, params) {
  if (binding.channel !== params.channel) return null;
  if (binding.peer && params.peer) {
    if (binding.peer.kind === params.peer.kind && binding.peer.id === params.peer.id) {
      return { binding, matchedBy: "peer", score: MATCH_SCORES.peer };
    }
  }
  if (binding.parentPeer && params.parentPeer) {
    if (binding.parentPeer.kind === params.parentPeer.kind && binding.parentPeer.id === params.parentPeer.id) {
      return { binding, matchedBy: "parentPeer", score: MATCH_SCORES.parentPeer };
    }
  }
  if (binding.guildId && binding.roleIds?.length && params.guildId && params.memberRoleIds) {
    if (binding.guildId === params.guildId && binding.roleIds.some((r) => params.memberRoleIds.includes(r))) {
      return { binding, matchedBy: "guild+roles", score: MATCH_SCORES.guildRoles };
    }
  }
  if (binding.guildId && params.guildId && binding.guildId === params.guildId) {
    return { binding, matchedBy: "guild", score: MATCH_SCORES.guild };
  }
  if (binding.teamId && params.teamId && binding.teamId === params.teamId) {
    return { binding, matchedBy: "team", score: MATCH_SCORES.team };
  }
  if (binding.accountId && params.accountId && binding.accountId === params.accountId) {
    return { binding, matchedBy: "account", score: MATCH_SCORES.account };
  }
  if (!binding.peer && !binding.parentPeer && !binding.guildId && !binding.teamId && !binding.accountId) {
    return { binding, matchedBy: "channel", score: MATCH_SCORES.channel };
  }
  return null;
}
function findBestBinding(bindings, params) {
  let best = null;
  for (const binding of bindings) {
    const result = matchBinding(binding, params);
    if (result && (!best || result.score > best.score)) {
      best = result;
    }
  }
  return best;
}

// src/framework/core/channel/pipeline/routing/session-key.ts
function buildSessionKey(params) {
  const { agentId, channel, accountId, peerKind, peerId, scope = "main" } = params;
  switch (scope) {
    case "main":
      return `agent:${agentId}:main:${channel}:${accountId}:${peerKind}:${peerId}`;
    case "per-peer":
      return `agent:${agentId}:peer:${peerKind}:${peerId}`;
    case "per-channel-peer":
      return `agent:${agentId}:ch:${channel}:${peerKind}:${peerId}`;
    case "per-account-channel-peer":
      return `agent:${agentId}:acct:${accountId}:ch:${channel}:${peerKind}:${peerId}`;
    default:
      return `agent:${agentId}:main:${channel}:${accountId}:${peerKind}:${peerId}`;
  }
}
function buildMainSessionKey(params) {
  return buildSessionKey({ ...params, scope: "main" });
}

// src/framework/core/channel/pipeline/routing/resolve-route.ts
function resolveAgentRoute(input, bindings, defaultAgentId = "default") {
  const { channel, accountId = "default", peer, parentPeer, guildId, teamId, memberRoleIds } = input;
  const matchResult = findBestBinding(bindings, {
    channel,
    accountId,
    peer,
    parentPeer,
    guildId,
    teamId,
    memberRoleIds
  });
  const agentId = matchResult?.binding.agentId ?? defaultAgentId;
  const matchedBy = matchResult?.matchedBy ?? "default";
  const peerKind = peer?.kind ?? "direct";
  const peerId = peer?.id ?? "unknown";
  const sessionKey = buildSessionKey({
    agentId,
    channel,
    accountId,
    peerKind,
    peerId
  });
  const mainSessionKey = buildMainSessionKey({
    agentId,
    channel,
    accountId,
    peerKind: "direct",
    peerId
  });
  return {
    agentId,
    channel,
    accountId,
    sessionKey,
    mainSessionKey,
    matchedBy
  };
}

// src/framework/core/channel/pipeline/inbound/inbound-pipeline.ts
var MAX_MESSAGE_LENGTH = 1e4;
var InboundPipeline = class {
  registry;
  config;
  bindings;
  logger;
  securityGate = new SecurityGate();
  mentionGate = new MentionGate();
  constructor(options) {
    this.registry = options.registry;
    this.config = options.config;
    this.bindings = options.bindings;
    this.logger = options.logger;
  }
  /**
   * Run the full inbound pipeline.
   *
   * @returns The pipeline result, or `null` if the message was dropped.
   *          When a pairing request is needed, it is returned via
   *          the `onPairing` callback so the hub can emit the event.
   */
  process(channelId, message, onPairing) {
    const sanitized = this.sanitize(message);
    const msgObj = typeof sanitized === "object" && sanitized !== null ? sanitized : {};
    const plugin = this.registry.get(channelId);
    const verdict = this.securityGate.check(plugin, channelId, msgObj, this.config);
    if (!verdict.allowed) {
      this.handleSecurityRejection(plugin, channelId, verdict, onPairing);
      return null;
    }
    const chatType = this.extractChatType(msgObj);
    if (!this.mentionGate.check(plugin, channelId, msgObj, chatType, this.config)) {
      this.logger.debug(`Group message from ${channelId} ignored (no mention)`);
      return null;
    }
    const body = (msgObj.body ?? msgObj.text ?? "").trim();
    const peer = {
      kind: chatType,
      id: msgObj.to ?? msgObj.peerId ?? msgObj.roomId ?? "unknown"
    };
    const parentPeer = msgObj.threadId ? { kind: "thread", id: msgObj.threadId } : void 0;
    const route = resolveAgentRoute(
      {
        cfg: this.config,
        channel: channelId,
        accountId: msgObj.accountId ?? "default",
        peer,
        parentPeer,
        guildId: msgObj.guildId,
        teamId: msgObj.teamId,
        memberRoleIds: msgObj.memberRoleIds
      },
      this.bindings
    );
    const from = msgObj.from ?? msgObj.senderId ?? msgObj.userId ?? "anonymous";
    const context = {
      channelId,
      accountId: msgObj.accountId ?? "default",
      sessionKey: route.sessionKey,
      agentId: route.agentId,
      from,
      fromName: msgObj.fromName,
      to: peer.id,
      body,
      chatType,
      surface: msgObj.surface,
      provider: msgObj.provider,
      mediaType: msgObj.mediaType,
      mediaUrl: msgObj.mediaUrl,
      timestamp: msgObj.timestamp ?? Date.now(),
      messageId: msgObj.messageId,
      replyToId: msgObj.replyToId,
      threadId: msgObj.threadId,
      metadata: msgObj.metadata ?? {}
    };
    const sessionHints = {
      sessionKey: context.sessionKey,
      userId: context.from,
      channel: context.channelId,
      metadata: context.metadata ?? {}
    };
    const payload = {
      ...sanitized,
      text: sanitized?.text ?? sanitized?.body ?? context.body,
      body: context.body
    };
    return { context, sessionHints, message: payload };
  }
  // ── Private helpers ─────────────────────────────────────────────────
  sanitize(message) {
    if (typeof message !== "object" || message === null) return message;
    const m = message;
    const text2 = m.text ?? m.body;
    if (typeof text2 !== "string") return message;
    if (text2.length <= MAX_MESSAGE_LENGTH) return message;
    return {
      ...m,
      text: text2.slice(0, MAX_MESSAGE_LENGTH),
      body: text2.slice(0, MAX_MESSAGE_LENGTH)
    };
  }
  extractChatType(msg) {
    if (msg.chatType === "group" || msg.chatType === "channel" || msg.chatType === "thread" || msg.chatType === "direct") {
      return msg.chatType;
    }
    if (msg.isThread) return "thread";
    if (msg.isChannel) return "channel";
    if (msg.isGroup) return "group";
    return "direct";
  }
  handleSecurityRejection(plugin, channelId, verdict, onPairing) {
    if (verdict.emitPairing && plugin?.pairing?.buildPairingReply && onPairing) {
      const reply = plugin.pairing.buildPairingReply({
        cfg: this.config,
        senderId: verdict.senderId,
        senderName: verdict.senderName,
        channelId
      });
      onPairing({
        channelId,
        senderId: verdict.senderId,
        senderName: verdict.senderName,
        reply: reply.text,
        metadata: reply.metadata
      });
    }
  }
};

// src/framework/core/channel/pipeline/inbound/debounce-policy.ts
var DEFAULT_DEBOUNCE_MS = 300;
var InboundDebouncePolicy = class {
  buffers = /* @__PURE__ */ new Map();
  defaultMs;
  perChannel;
  constructor(options) {
    this.defaultMs = options?.defaultMs ?? DEFAULT_DEBOUNCE_MS;
    this.perChannel = options?.perChannel ?? {};
  }
  getDebounceMs(channelId) {
    return this.perChannel[channelId] ?? this.defaultMs;
  }
  debounce(params) {
    const { key, senderId, channelId, text: text2, mediaUrl } = params;
    const debounceMs = this.getDebounceMs(channelId);
    const existing = this.buffers.get(key);
    if (existing) {
      clearTimeout(existing.timer);
      existing.fragments.push({ text: text2, mediaUrl, timestamp: Date.now() });
      return new Promise((resolve5) => {
        existing.resolvers.push(resolve5);
        existing.timer = setTimeout(() => this.flush(key), debounceMs);
      });
    }
    return new Promise((resolve5) => {
      const buffer = {
        senderId,
        channelId,
        fragments: [{ text: text2, mediaUrl, timestamp: Date.now() }],
        timer: setTimeout(() => this.flush(key), debounceMs),
        resolvers: [resolve5]
      };
      this.buffers.set(key, buffer);
    });
  }
  flush(key) {
    const buffer = this.buffers.get(key);
    if (!buffer) return;
    this.buffers.delete(key);
    const texts = buffer.fragments.map((f) => f.text).filter((t3) => !!t3);
    const mediaUrls = buffer.fragments.map((f) => f.mediaUrl).filter((u) => !!u);
    const merged = {
      senderId: buffer.senderId,
      channelId: buffer.channelId,
      text: texts.join("\n"),
      mediaUrls,
      fragmentCount: buffer.fragments.length,
      firstTimestamp: buffer.fragments[0].timestamp,
      lastTimestamp: buffer.fragments[buffer.fragments.length - 1].timestamp
    };
    for (const resolve5 of buffer.resolvers) {
      resolve5(merged);
    }
  }
  clear() {
    for (const [, buffer] of this.buffers) {
      clearTimeout(buffer.timer);
      this.flushDiscard(buffer);
    }
    this.buffers.clear();
  }
  flushDiscard(buffer) {
    const merged = {
      senderId: buffer.senderId,
      channelId: buffer.channelId,
      text: "",
      mediaUrls: [],
      fragmentCount: 0,
      firstTimestamp: Date.now(),
      lastTimestamp: Date.now()
    };
    for (const resolve5 of buffer.resolvers) {
      resolve5(merged);
    }
  }
};

// src/framework/core/channel/pipeline/inbound/extract-text.ts
function extractMessageText(message) {
  if (typeof message === "string") return message || null;
  if (typeof message !== "object" || message === null) return null;
  const m = message;
  for (const key of ["text", "body", "message", "content"]) {
    if (typeof m[key] === "string" && m[key].length > 0) {
      return m[key];
    }
  }
  return null;
}
function resolveInboundBody(ctx) {
  if (typeof ctx.RawBody === "string" && ctx.RawBody.trim()) return ctx.RawBody.trim();
  if (typeof ctx.CommandBody === "string" && ctx.CommandBody.trim()) return ctx.CommandBody.trim();
  if (ctx.Body && typeof ctx.Body === "object") {
    const e = ctx.Body;
    if (typeof e.body === "string" && e.body.trim()) return e.body.trim();
    if (typeof e.text === "string" && e.text.trim()) return e.text.trim();
    if (typeof e.content === "string" && e.content.trim()) return e.content.trim();
  }
  if (typeof ctx.body === "string" && ctx.body.trim()) return ctx.body.trim();
  if (typeof ctx.text === "string" && ctx.text.trim()) return ctx.text.trim();
  return "";
}
var BOT_ROLES = /* @__PURE__ */ new Set(["assistant", "bot", "system", "ai"]);

// src/framework/core/channel/pipeline/outbound/chunker.ts
function chunkText(text2, limit, options) {
  if (!text2 || text2.length <= limit) return text2 ? [text2] : [];
  const mode = options?.mode ?? "text";
  if (mode === "markdown" && options?.preserveCodeBlocks !== false) {
    return chunkMarkdown(text2, limit);
  }
  return chunkPlainText(text2, limit);
}
function chunkPlainText(text2, limit) {
  const chunks = [];
  const lines = text2.split("\n");
  let current = "";
  for (const line of lines) {
    if (line.length > limit) {
      if (current) {
        chunks.push(current);
        current = "";
      }
      let remaining = line;
      while (remaining.length > limit) {
        const breakAt = findWordBreak(remaining, limit);
        chunks.push(remaining.slice(0, breakAt));
        remaining = remaining.slice(breakAt).trimStart();
      }
      if (remaining) current = remaining;
      continue;
    }
    const tentative = current ? `${current}
${line}` : line;
    if (tentative.length > limit) {
      chunks.push(current);
      current = line;
    } else {
      current = tentative;
    }
  }
  if (current) chunks.push(current);
  return chunks;
}
function chunkMarkdown(text2, limit) {
  const chunks = [];
  const lines = text2.split("\n");
  let current = "";
  let insideCodeBlock = false;
  let codeBlockFence = "";
  for (const line of lines) {
    const fenceMatch = line.match(/^(`{3,}|~{3,})/);
    if (fenceMatch) {
      if (!insideCodeBlock) {
        insideCodeBlock = true;
        codeBlockFence = fenceMatch[1];
      } else if (line.startsWith(codeBlockFence)) {
        insideCodeBlock = false;
        codeBlockFence = "";
      }
    }
    const tentative = current ? `${current}
${line}` : line;
    if (tentative.length > limit && !insideCodeBlock) {
      if (current) chunks.push(current);
      current = line.length > limit ? line.slice(0, limit) : line;
    } else if (tentative.length > limit && insideCodeBlock) {
      if (current) {
        chunks.push(current + `
${codeBlockFence}`);
        current = `${codeBlockFence}
${line}`;
      } else {
        current = line.length > limit ? line.slice(0, limit) : line;
      }
    } else {
      current = tentative;
    }
  }
  if (current) {
    if (insideCodeBlock) {
      current += `
${codeBlockFence}`;
    }
    chunks.push(current);
  }
  return chunks;
}
function findWordBreak(text2, limit) {
  if (limit >= text2.length) return text2.length;
  let breakAt = text2.lastIndexOf(" ", limit);
  if (breakAt <= 0) breakAt = limit;
  return breakAt;
}
var CHANNEL_TEXT_LIMITS = {
  telegram: 4e3,
  whatsapp: 4e3,
  discord: 2e3,
  slack: 4e3,
  signal: 4e3,
  irc: 350,
  webchat: 1e4,
  cli: 5e4,
  "rest-api": 1e5
};
function getTextChunkLimit(channelId, pluginLimit) {
  return pluginLimit ?? CHANNEL_TEXT_LIMITS[channelId] ?? 4e3;
}

// src/framework/core/channel/pipeline/outbound/delivery.ts
async function deliverOutboundMessage(request, cfg, registry) {
  const plugin = registry.get(request.channel);
  if (!plugin) {
    return {
      success: false,
      results: [],
      errors: [new Error(`Channel plugin not found: ${request.channel}`)]
    };
  }
  const outbound = plugin.outbound;
  if (!outbound) {
    return {
      success: false,
      results: [],
      errors: [new Error(`Channel ${request.channel} has no outbound adapter`)]
    };
  }
  if (outbound.resolveTarget) {
    const resolved = outbound.resolveTarget({ to: request.to, cfg, accountId: request.accountId });
    if (!resolved.ok) {
      return { success: false, results: [], errors: [resolved.error] };
    }
    request = { ...request, to: resolved.to };
  }
  const results = [];
  const errors = [];
  try {
    if (request.channelData && outbound.sendPayload) {
      const result = await outbound.sendPayload({
        cfg,
        to: request.to,
        text: request.text,
        accountId: request.accountId,
        replyToId: request.replyToId,
        threadId: request.threadId,
        metadata: request.metadata,
        channelData: request.channelData
      });
      results.push(result);
    } else if (request.mediaUrl && outbound.sendMedia) {
      const result = await outbound.sendMedia({
        cfg,
        to: request.to,
        text: request.text,
        mediaUrl: request.mediaUrl,
        mediaType: request.mediaType,
        accountId: request.accountId,
        replyToId: request.replyToId,
        threadId: request.threadId,
        metadata: request.metadata
      });
      results.push(result);
    } else if (request.text && outbound.sendText) {
      const chunks = splitTextForChannel(request.text, plugin);
      for (const chunk of chunks) {
        const result = await outbound.sendText({
          cfg,
          to: request.to,
          text: chunk,
          accountId: request.accountId,
          replyToId: request.replyToId,
          threadId: request.threadId,
          metadata: request.metadata
        });
        results.push(result);
      }
    }
  } catch (err) {
    errors.push(err instanceof Error ? err : new Error(String(err)));
  }
  return {
    success: errors.length === 0 && results.length > 0,
    results,
    errors
  };
}
function splitTextForChannel(text2, plugin) {
  const outbound = plugin.outbound;
  const limit = getTextChunkLimit(plugin.id, outbound.textChunkLimit);
  if (outbound.chunker) {
    return outbound.chunker(text2, limit);
  }
  return chunkText(text2, limit, {
    mode: outbound.chunkerMode ?? "text"
  });
}

// src/framework/core/channel/lifecycle/backoff.ts
var DEFAULT_RESTART_POLICY = {
  initialMs: 5e3,
  maxMs: 5 * 6e4,
  factor: 2,
  jitter: 0.1
};
var MAX_RESTART_ATTEMPTS = 10;
function computeBackoff(policy, attempt) {
  const delay = Math.min(
    policy.initialMs * Math.pow(policy.factor, attempt - 1),
    policy.maxMs
  );
  const jitterRange = delay * policy.jitter;
  const jitter = (Math.random() * 2 - 1) * jitterRange;
  return Math.max(0, Math.round(delay + jitter));
}
function sleepWithAbort(ms, signal) {
  return new Promise((resolve5, reject) => {
    if (signal?.aborted) {
      reject(signal.reason);
      return;
    }
    const timer = setTimeout(resolve5, ms);
    signal?.addEventListener("abort", () => {
      clearTimeout(timer);
      reject(signal.reason);
    }, { once: true });
  });
}

// src/framework/core/channel/lifecycle/health-monitor.ts
var DEGRADED_THRESHOLD = 1;
var UNHEALTHY_THRESHOLD = 3;
var ChannelHealthMonitor = class {
  intervalMs;
  intervalId = null;
  deps = null;
  healthByKey = /* @__PURE__ */ new Map();
  constructor(options = {}) {
    this.intervalMs = options.intervalMs ?? HEALTH_CHECK_INTERVAL_MS;
  }
  start(deps) {
    this.deps = deps;
    this.healthByKey.clear();
    this.intervalId = setInterval(() => this.runHealthCheck(), this.intervalMs);
    if (this.intervalId.unref) {
      this.intervalId.unref();
    }
  }
  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.deps = null;
    this.healthByKey.clear();
  }
  getHealth(channelId) {
    const snapshot = this.deps?.getRuntimeSnapshot();
    const channel = snapshot?.channels[channelId];
    if (!channel) return void 0;
    const accounts = Object.keys(channel.accounts);
    if (accounts.length === 0) return void 0;
    let maxFailures = 0;
    for (const accountId of accounts) {
      const key = `${channelId}:${accountId}`;
      const failures = this.healthByKey.get(key)?.consecutiveFailures ?? 0;
      maxFailures = Math.max(maxFailures, failures);
    }
    const status = maxFailures >= UNHEALTHY_THRESHOLD ? "unhealthy" : maxFailures >= DEGRADED_THRESHOLD ? "degraded" : "healthy";
    return { status, consecutiveFailures: maxFailures };
  }
  getAllHealth() {
    const result = {};
    const snapshot = this.deps?.getRuntimeSnapshot();
    if (!snapshot) return result;
    for (const channelId of Object.keys(snapshot.channels)) {
      const info = this.getHealth(channelId);
      if (info) result[channelId] = info;
    }
    return result;
  }
  runHealthCheck() {
    const deps = this.deps;
    if (!deps) return;
    const config = deps.getConfig();
    const snapshot = deps.getRuntimeSnapshot();
    for (const [channelId, channel] of Object.entries(snapshot.channels)) {
      const plugin = deps.getPlugin(channelId);
      if (!plugin?.heartbeat?.ping) continue;
      for (const [accountId, account] of Object.entries(channel.accounts)) {
        if (!account.running) continue;
        const key = `${channelId}:${accountId}`;
        plugin.heartbeat.ping({ cfg: config, accountId }).then((ok3) => {
          if (ok3) {
            this.healthByKey.set(key, { consecutiveFailures: 0 });
          } else {
            const failures = (this.healthByKey.get(key)?.consecutiveFailures ?? 0) + 1;
            this.healthByKey.set(key, { consecutiveFailures: failures });
          }
        }).catch(() => {
          const failures = (this.healthByKey.get(key)?.consecutiveFailures ?? 0) + 1;
          this.healthByKey.set(key, { consecutiveFailures: failures });
        });
      }
    }
  }
};

// src/framework/core/channel/lifecycle/channel-manager.ts
var ChannelManager = class extends EventEmitter {
  runtimes = /* @__PURE__ */ new Map();
  registry;
  config;
  restartPolicy;
  maxRestartAttempts;
  logger;
  globalAbort = null;
  channelRuntimeFactory;
  healthMonitor;
  constructor(options) {
    super();
    this.registry = options.registry;
    this.config = options.config;
    this.restartPolicy = options.restartPolicy ?? DEFAULT_RESTART_POLICY;
    this.maxRestartAttempts = options.maxRestartAttempts ?? MAX_RESTART_ATTEMPTS;
    this.logger = options.logger ?? new Logger("ChannelManager");
    this.channelRuntimeFactory = options.channelRuntimeFactory;
    this.healthMonitor = new ChannelHealthMonitor();
  }
  getConfig() {
    return this.config;
  }
  getRuntimeSnapshot() {
    const channels = {};
    for (const [_key, runtime] of this.runtimes) {
      const channelId = runtime.channelId;
      if (!channels[channelId]) {
        channels[channelId] = { accounts: {} };
      }
      channels[channelId].accounts[runtime.accountId] = { ...runtime.snapshot };
    }
    return { channels };
  }
  getHealthStatus(channelId) {
    return this.healthMonitor.getHealth(channelId);
  }
  async startChannels() {
    this.globalAbort = new AbortController();
    const plugins = this.registry.listPlugins();
    this.logger.info(`Starting ${plugins.length} channel plugins...`);
    const promises = plugins.map((plugin) => this.startChannelInternal(plugin.id));
    await Promise.allSettled(promises);
    this.healthMonitor.start({
      getConfig: () => this.config,
      getRuntimeSnapshot: () => this.getRuntimeSnapshot(),
      getPlugin: (id) => this.registry.get(id)
    });
    this.logger.info("All channels started");
  }
  async startChannel(channelId, accountId) {
    await this.startChannelInternal(channelId, accountId);
  }
  async stopChannel(channelId, accountId) {
    const keysToStop = this.findRuntimeKeys(channelId, accountId);
    for (const key of keysToStop) {
      const runtime = this.runtimes.get(key);
      if (!runtime) continue;
      runtime.manuallyStopped = true;
      await this.stopAccountRuntime(runtime, "manual");
    }
  }
  markChannelLoggedOut(channelId, cleared, accountId) {
    const keys = this.findRuntimeKeys(channelId, accountId);
    for (const key of keys) {
      const runtime = this.runtimes.get(key);
      if (runtime) {
        runtime.snapshot.connected = false;
        runtime.snapshot.running = false;
        runtime.snapshot.lastError = cleared ? "logged out (cleared)" : "logged out";
      }
    }
  }
  isManuallyStopped(channelId, accountId) {
    const key = this.runtimeKey(channelId, accountId);
    return this.runtimes.get(key)?.manuallyStopped ?? false;
  }
  resetRestartAttempts(channelId, accountId) {
    const key = this.runtimeKey(channelId, accountId);
    const runtime = this.runtimes.get(key);
    if (runtime) runtime.restartAttempts = 0;
  }
  getAccountSnapshot(channelId, accountId) {
    const key = this.runtimeKey(channelId, accountId);
    return this.runtimes.get(key)?.snapshot;
  }
  async stopAll() {
    this.logger.info("Stopping all channels...");
    this.healthMonitor.stop();
    this.globalAbort?.abort();
    const stops = Array.from(this.runtimes.values()).map(
      (rt) => this.stopAccountRuntime(rt)
    );
    await Promise.allSettled(stops);
    this.runtimes.clear();
    this.logger.info("All channels stopped");
  }
  // ── Private ─────────────────────────────────────────────────────────
  async startChannelInternal(channelId, accountId, options) {
    const plugin = this.registry.get(channelId);
    if (!plugin) {
      throw new Error(`Channel plugin not found: ${channelId}`);
    }
    const accountIds = accountId ? [accountId] : plugin.config.listAccountIds(this.config);
    if (accountIds.length === 0) {
      const defaultId = plugin.config.defaultAccountId?.(this.config) ?? "default";
      accountIds.push(defaultId);
    }
    for (const acctId of accountIds) {
      await this.startAccountInternal(plugin, acctId, options);
    }
  }
  async startAccountInternal(plugin, accountId, options) {
    const key = this.runtimeKey(plugin.id, accountId);
    let runtime = this.runtimes.get(key);
    if (!runtime) {
      runtime = {
        channelId: plugin.id,
        accountId,
        snapshot: { accountId, enabled: false },
        abortController: null,
        restartAttempts: 0,
        manuallyStopped: false,
        runPromise: null
      };
      this.runtimes.set(key, runtime);
    }
    if (!options?.preserveRestartAttempts) runtime.restartAttempts = 0;
    if (!options?.preserveManualStop) runtime.manuallyStopped = false;
    let account;
    try {
      account = plugin.config.resolveAccount(this.config, accountId);
    } catch (err) {
      runtime.snapshot = {
        ...runtime.snapshot,
        enabled: false,
        lastError: `Failed to resolve account: ${toErrorMessage(err)}`
      };
      return;
    }
    if (plugin.config.isEnabled && !plugin.config.isEnabled(account, this.config)) {
      runtime.snapshot = {
        ...runtime.snapshot,
        enabled: false,
        lastError: "disabled"
      };
      this.logger.debug(`Channel ${plugin.id}/${accountId} is disabled`);
      return;
    }
    if (plugin.config.isConfigured) {
      const configured = await plugin.config.isConfigured(account, this.config);
      if (!configured) {
        runtime.snapshot = {
          ...runtime.snapshot,
          configured: false,
          lastError: "not configured"
        };
        this.logger.debug(`Channel ${plugin.id}/${accountId} is not configured`);
        return;
      }
    }
    if (!plugin.gateway?.startAccount) {
      runtime.snapshot = {
        ...runtime.snapshot,
        enabled: true,
        configured: true,
        running: false,
        lastError: "no gateway adapter"
      };
      return;
    }
    const abortController = new AbortController();
    runtime.abortController = abortController;
    if (this.globalAbort?.signal.aborted) {
      abortController.abort();
      return;
    }
    this.globalAbort?.signal.addEventListener("abort", () => abortController.abort(), { once: true });
    runtime.snapshot = {
      ...runtime.snapshot,
      enabled: true,
      configured: true,
      running: true,
      lastStartAt: Date.now(),
      lastError: null
    };
    const runtimeEnv = {
      platform: process.platform,
      arch: process.arch,
      nodeVersion: process.version,
      dataDir: this.config.workspaceDir
    };
    const channelRuntime = this.channelRuntimeFactory?.(plugin.id, accountId);
    const ctx = {
      cfg: this.config,
      accountId,
      account,
      runtime: runtimeEnv,
      abortSignal: abortController.signal,
      log: this.logger,
      getStatus: () => ({ ...runtime.snapshot }),
      setStatus: (next) => {
        runtime.snapshot = { ...runtime.snapshot, ...next };
      },
      channelRuntime
    };
    this.logger.info(`Starting channel ${plugin.id}/${accountId}`);
    this.emit("channel:started", { channelId: plugin.id, accountId });
    runtime.runPromise = plugin.gateway.startAccount(ctx).then(() => {
      this.logger.info(`Channel ${plugin.id}/${accountId} exited normally`);
    }).catch((err) => {
      const msg = toErrorMessage(err);
      this.emit("channel:error", {
        channelId: plugin.id,
        accountId,
        error: err instanceof Error ? err : new Error(String(err))
      });
      if (abortController.signal.aborted) {
        this.logger.debug(`Channel ${plugin.id}/${accountId} aborted: ${msg}`);
      } else {
        this.logger.error(`Channel ${plugin.id}/${accountId} crashed: ${msg}`);
      }
      runtime.snapshot.lastError = msg;
    }).finally(() => {
      runtime.snapshot.running = false;
      runtime.snapshot.connected = false;
      runtime.snapshot.lastStopAt = Date.now();
      runtime.abortController = null;
      runtime.runPromise = null;
      if (!runtime.manuallyStopped && !this.globalAbort?.signal.aborted) {
        this.scheduleRestart(plugin.id, accountId).catch((err) => {
          this.logger.error(`Restart scheduling failed for ${plugin.id}/${accountId}`, err);
        });
      }
    });
  }
  async scheduleRestart(channelId, accountId) {
    const key = this.runtimeKey(channelId, accountId);
    const runtime = this.runtimes.get(key);
    if (!runtime) return;
    runtime.restartAttempts++;
    if (runtime.restartAttempts > this.maxRestartAttempts) {
      this.logger.error(
        `Channel ${channelId}/${accountId} exceeded max restart attempts (${this.maxRestartAttempts})`
      );
      runtime.snapshot.lastError = `exceeded max restart attempts (${this.maxRestartAttempts})`;
      return;
    }
    const delay = computeBackoff(this.restartPolicy, runtime.restartAttempts);
    this.emit("channel:restarting", {
      channelId,
      accountId,
      attempt: runtime.restartAttempts,
      delay
    });
    this.logger.info(
      `Restarting ${channelId}/${accountId} in ${delay}ms (attempt ${runtime.restartAttempts}/${this.maxRestartAttempts})`
    );
    try {
      await sleepWithAbort(delay, this.globalAbort?.signal);
    } catch {
      return;
    }
    if (runtime.manuallyStopped || this.globalAbort?.signal.aborted) return;
    await this.startChannelInternal(channelId, accountId, {
      preserveRestartAttempts: true,
      preserveManualStop: true
    });
  }
  async stopAccountRuntime(runtime, reason) {
    const { channelId, accountId } = runtime;
    if (runtime.abortController) {
      runtime.abortController.abort();
    }
    const plugin = this.registry.get(channelId);
    if (plugin?.gateway?.stopAccount && runtime.abortController) {
      try {
        const runtimeEnv = {
          platform: process.platform,
          arch: process.arch,
          nodeVersion: process.version,
          dataDir: this.config.workspaceDir
        };
        let account;
        try {
          account = plugin.config.resolveAccount(this.config, accountId);
        } catch {
          account = {};
        }
        await plugin.gateway.stopAccount({
          cfg: this.config,
          accountId,
          account,
          runtime: runtimeEnv,
          abortSignal: runtime.abortController.signal,
          log: this.logger,
          getStatus: () => ({ ...runtime.snapshot }),
          setStatus: (next) => {
            runtime.snapshot = { ...runtime.snapshot, ...next };
          }
        });
      } catch (err) {
        this.logger.warn(`Error stopping ${channelId}/${accountId}:`, err);
      }
    }
    if (runtime.runPromise) {
      try {
        await Promise.race([
          runtime.runPromise,
          new Promise((r) => setTimeout(r, 5e3))
        ]);
      } catch {
      }
    }
    runtime.snapshot.running = false;
    runtime.snapshot.connected = false;
    runtime.snapshot.lastStopAt = Date.now();
    this.logger.info(`Channel ${channelId}/${accountId} stopped`);
    this.emit("channel:stopped", { channelId, accountId, reason });
  }
  findRuntimeKeys(channelId, accountId) {
    if (accountId) return [this.runtimeKey(channelId, accountId)];
    const keys = [];
    for (const [key, runtime] of this.runtimes) {
      if (runtime.channelId === channelId) keys.push(key);
    }
    return keys;
  }
  runtimeKey(channelId, accountId) {
    return `${channelId}:${accountId}`;
  }
};

// src/framework/core/channel/lifecycle/activity-tracker.ts
var ChannelActivityTracker = class {
  metrics = /* @__PURE__ */ new Map();
  recordReceived(channelId) {
    const m = this.getOrCreate(channelId);
    m.msgReceived++;
    m.lastMessageAt = Date.now();
  }
  recordSent(channelId) {
    const m = this.getOrCreate(channelId);
    m.msgSent++;
    m.lastMessageAt = Date.now();
  }
  recordError(channelId) {
    this.getOrCreate(channelId).errors++;
  }
  get(channelId) {
    return this.metrics.get(channelId);
  }
  getAll() {
    return new Map(this.metrics);
  }
  getOrCreate(channelId) {
    let m = this.metrics.get(channelId);
    if (!m) {
      m = { msgSent: 0, msgReceived: 0, errors: 0 };
      this.metrics.set(channelId, m);
    }
    return m;
  }
};

// src/framework/core/channel/channel-facade.ts
function buildFacadeFromPlugin(plugin) {
  return {
    id: plugin.id,
    capabilities: plugin.capabilities,
    commands: plugin.commands,
    outbound: plugin.outbound ? { textChunkLimit: plugin.outbound.textChunkLimit } : void 0,
    streaming: plugin.streaming ? { blockStreamingCoalesceDefaults: plugin.streaming.blockStreamingCoalesceDefaults } : void 0,
    elevated: plugin.elevated,
    config: plugin.config ? {
      resolveAllowFrom: plugin.config.resolveAllowFrom,
      formatAllowFrom: plugin.config.formatAllowFrom,
      resolveDefaultTo: plugin.config.resolveDefaultTo
    } : void 0,
    groups: plugin.groups,
    mentions: plugin.mentions,
    threading: plugin.threading,
    agentPrompt: plugin.agentPrompt
  };
}
function getChannelFacade(channelId, registry) {
  return registry.getChannelFacade(channelId);
}

// src/framework/core/channel/registry.ts
var BUILTIN_CHANNEL_META = {
  webchat: {
    id: "webchat",
    label: "WebChat",
    selectionLabel: "WebChat (Browser)",
    docsPath: "/channels/webchat",
    blurb: "Browser-based chat widget for web applications",
    systemImage: "bubble.left.and.bubble.right",
    order: 0
  },
  cli: {
    id: "cli",
    label: "CLI",
    selectionLabel: "CLI (Terminal)",
    docsPath: "/channels/cli",
    blurb: "Command-line interface for terminal interactions",
    systemImage: "terminal",
    order: 1
  },
  "rest-api": {
    id: "rest-api",
    label: "REST API",
    selectionLabel: "REST API (HTTP)",
    docsPath: "/channels/rest-api",
    blurb: "RESTful HTTP API for programmatic access",
    systemImage: "arrow.left.arrow.right",
    order: 2
  }
};
var BUILTIN_CHANNEL_ALIASES = {
  web: "webchat",
  chat: "webchat",
  terminal: "cli",
  api: "rest-api",
  rest: "rest-api"
};
var ORIGIN_PRIORITY = {
  config: 0,
  workspace: 1,
  global: 2,
  bundled: 3
};
var ChannelRegistry = class extends BaseRegistry {
  meta = /* @__PURE__ */ new Map();
  aliases = new Map(Object.entries(BUILTIN_CHANNEL_ALIASES));
  version = 0;
  pluginCache = null;
  facadeCache = /* @__PURE__ */ new Map();
  constructor() {
    super("ChannelRegistry");
  }
  /**
   * Register a channel plugin with origin-based priority.
   * Lower-priority origins cannot overwrite higher-priority ones.
   */
  registerPlugin(plugin, origin = "config", version) {
    const existing = this.meta.get(plugin.id);
    if (existing) {
      const existingPriority = ORIGIN_PRIORITY[existing.origin];
      const newPriority = ORIGIN_PRIORITY[origin];
      if (newPriority > existingPriority) return;
    }
    super.register(plugin.id, plugin);
    this.meta.set(plugin.id, { origin, version, registeredAt: Date.now() });
    if (plugin.meta.aliases) {
      for (const alias of plugin.meta.aliases) {
        this.aliases.set(alias.toLowerCase(), plugin.id);
      }
    }
    this.version++;
    this.pluginCache = null;
  }
  unregister(channelId) {
    const plugin = this.get(channelId);
    if (!plugin) return false;
    if (plugin.meta.aliases) {
      for (const alias of plugin.meta.aliases) {
        this.aliases.delete(alias.toLowerCase());
      }
    }
    this.meta.delete(channelId);
    super.unregister(channelId);
    this.version++;
    this.pluginCache = null;
    return true;
  }
  getEntry(channelId) {
    const plugin = this.get(channelId);
    const entryMeta = this.meta.get(channelId);
    if (!plugin || !entryMeta) return void 0;
    return { plugin, ...entryMeta };
  }
  resolveAlias(idOrAlias) {
    return this.aliases.get(idOrAlias.toLowerCase()) ?? idOrAlias;
  }
  normalizeChannelId(idOrAlias) {
    return this.resolveAlias(idOrAlias.toLowerCase());
  }
  listPlugins() {
    return this.resolve().sorted;
  }
  listMeta() {
    return this.resolve().allMeta;
  }
  listIds() {
    return this.resolve().sorted.map((p3) => p3.id);
  }
  getVersion() {
    return this.version;
  }
  isBuiltin(channelId) {
    return BUILTIN_CHANNEL_IDS.includes(channelId);
  }
  getBuiltinMeta(channelId) {
    return BUILTIN_CHANNEL_META[channelId];
  }
  getChannelFacade(channelId) {
    const registryVersion = this.getVersion();
    const cached2 = this.facadeCache.get(channelId);
    if (cached2 && cached2.version === registryVersion) {
      return cached2.facade;
    }
    const plugin = this.get(channelId);
    if (!plugin) return void 0;
    const facade = buildFacadeFromPlugin(plugin);
    this.facadeCache.set(channelId, { version: registryVersion, facade });
    return facade;
  }
  clearFacadeCache() {
    this.facadeCache.clear();
  }
  resolve() {
    if (this.pluginCache && this.pluginCache.registryVersion === this.version) {
      return this.pluginCache;
    }
    const plugins = Array.from(this.entries.values());
    const deduped = this.dedupeByOriginPriority(plugins);
    const sorted = [...deduped].sort((a, b) => {
      const orderA = a.meta.order ?? 999;
      const orderB = b.meta.order ?? 999;
      if (orderA !== orderB) return orderA - orderB;
      return a.meta.label.localeCompare(b.meta.label);
    });
    const byId = /* @__PURE__ */ new Map();
    for (const p3 of sorted) byId.set(p3.id, p3);
    this.pluginCache = {
      registryVersion: this.version,
      sorted,
      byId,
      allMeta: sorted.map((p3) => p3.meta)
    };
    return this.pluginCache;
  }
  dedupeByOriginPriority(plugins) {
    const best = /* @__PURE__ */ new Map();
    for (const plugin of plugins) {
      const entryMeta = this.meta.get(plugin.id);
      const priority = entryMeta ? ORIGIN_PRIORITY[entryMeta.origin] : 999;
      const existing = best.get(plugin.id);
      if (!existing || priority < existing.priority) {
        best.set(plugin.id, { plugin, priority });
      }
    }
    return Array.from(best.values()).map((e) => e.plugin);
  }
};

// src/framework/core/channel/default-adapters.ts
function createWebChatPlugin(bridge) {
  return {
    id: "webchat",
    meta: {
      id: "webchat",
      label: "WebChat",
      selectionLabel: "WebChat (Browser)",
      docsPath: "/channels/webchat",
      blurb: "Browser-based chat widget for web applications",
      systemImage: "bubble.left.and.bubble.right",
      order: 0
    },
    capabilities: {
      chatTypes: ["direct"],
      media: true,
      edit: false,
      reply: true
    },
    config: {
      listAccountIds: () => ["default"],
      resolveAccount: (_cfg, _accountId) => ({
        accountId: "default",
        enabled: true
      }),
      isEnabled: () => true,
      isConfigured: () => true
    },
    gateway: {
      startAccount: async (ctx) => {
        ctx.setStatus({ connected: true, running: true });
        if (bridge) {
          bridge.setMessageHandler("webchat", async () => {
            ctx.setStatus({ lastMessageAt: Date.now() });
          });
        }
        await new Promise((resolve5) => {
          ctx.abortSignal.addEventListener("abort", () => resolve5(), { once: true });
        });
      },
      stopAccount: async (ctx) => {
        ctx.setStatus({ connected: false, running: false });
      }
    },
    outbound: {
      deliveryMode: "direct",
      textChunkLimit: 1e4,
      sendText: async (ctx) => {
        if (bridge) {
          bridge.emit("webchat:send", { target: ctx.to, content: { text: ctx.text } });
        }
        return { channel: "webchat", to: ctx.to };
      }
    }
  };
}
function createCLIPlugin(bridge) {
  return {
    id: "cli",
    meta: {
      id: "cli",
      label: "CLI",
      selectionLabel: "CLI (Terminal)",
      docsPath: "/channels/cli",
      blurb: "Command-line interface for terminal interactions",
      systemImage: "terminal",
      order: 1
    },
    capabilities: {
      chatTypes: ["direct"],
      media: false
    },
    config: {
      listAccountIds: () => ["default"],
      resolveAccount: (_cfg, _accountId) => ({
        accountId: "default",
        enabled: true
      }),
      isEnabled: () => true,
      isConfigured: () => true
    },
    gateway: {
      startAccount: async (ctx) => {
        ctx.setStatus({ connected: true, running: true });
        if (bridge) {
          bridge.setMessageHandler("cli", async () => {
            ctx.setStatus({ lastMessageAt: Date.now() });
          });
        }
        await new Promise((resolve5) => {
          ctx.abortSignal.addEventListener("abort", () => resolve5(), { once: true });
        });
      },
      stopAccount: async (ctx) => {
        ctx.setStatus({ connected: false, running: false });
      }
    },
    outbound: {
      deliveryMode: "direct",
      textChunkLimit: 5e4,
      sendText: async (ctx) => {
        if (bridge) {
          bridge.emit("cli:send", { target: ctx.to, content: { text: ctx.text } });
        } else {
          console.log(`CLI Response: ${ctx.text ?? ""}`);
        }
        return { channel: "cli", to: ctx.to };
      }
    }
  };
}
function createRestApiPlugin(bridge) {
  return {
    id: "rest-api",
    meta: {
      id: "rest-api",
      label: "REST API",
      selectionLabel: "REST API (HTTP)",
      docsPath: "/channels/rest-api",
      blurb: "RESTful HTTP API for programmatic access",
      systemImage: "arrow.left.arrow.right",
      order: 2
    },
    capabilities: {
      chatTypes: ["direct"],
      media: true
    },
    config: {
      listAccountIds: () => ["default"],
      resolveAccount: (_cfg, _accountId) => ({
        accountId: "default",
        enabled: true
      }),
      isEnabled: () => true,
      isConfigured: () => true
    },
    gateway: {
      startAccount: async (ctx) => {
        ctx.setStatus({ connected: true, running: true });
        if (bridge) {
          bridge.setMessageHandler("rest-api", async () => {
            ctx.setStatus({ lastMessageAt: Date.now() });
          });
        }
        await new Promise((resolve5) => {
          ctx.abortSignal.addEventListener("abort", () => resolve5(), { once: true });
        });
      },
      stopAccount: async (ctx) => {
        ctx.setStatus({ connected: false, running: false });
      }
    },
    outbound: {
      deliveryMode: "direct",
      textChunkLimit: 1e5,
      sendText: async (ctx) => {
        if (bridge) {
          bridge.emit("rest-api:send", { target: ctx.to, content: { text: ctx.text } });
        }
        return { channel: "rest-api", to: ctx.to };
      }
    }
  };
}
function createBuiltinPlugin(channelId, bridge) {
  switch (channelId) {
    case "webchat":
      return createWebChatPlugin(bridge);
    case "cli":
      return createCLIPlugin(bridge);
    case "rest-api":
      return createRestApiPlugin(bridge);
    default:
      throw new Error(`Unknown builtin channel: ${channelId}`);
  }
}
var ChannelPluginLoader = class {
  constructor(logger3) {
    this.logger = logger3;
  }
  logger;
  /**
   * Load a channel plugin from an npm package.
   * Tries default export, plugin export, or createPlugin factory.
   */
  async loadFromPackage(packageName, channelConfig) {
    try {
      const mod = await import(packageName);
      let plugin;
      if (mod.default && "id" in mod.default && "meta" in mod.default) {
        plugin = mod.default;
      } else if (mod.plugin && "id" in mod.plugin && "meta" in mod.plugin) {
        plugin = mod.plugin;
      } else if (typeof mod.createPlugin === "function") {
        plugin = mod.createPlugin(channelConfig);
      }
      if (plugin) {
        this.logger.info(`Loaded channel plugin: ${packageName}`);
        return plugin;
      }
      this.logger.warn(`Package '${packageName}' does not export a valid ChannelPlugin`);
      return null;
    } catch (err) {
      const msg = toErrorMessage(err);
      const code = err.code;
      const isNotFound = code === "ERR_MODULE_NOT_FOUND" || msg.includes("Cannot find module") || msg.includes("Cannot find package");
      if (isNotFound) {
        this.logger.debug(`Channel plugin '${packageName}' not installed; skipping.`);
      } else {
        this.logger.warn(`Failed to load channel plugin '${packageName}': ${msg}`);
      }
      return null;
    }
  }
  /**
   * Discover workspace plugins by scanning node_modules for novaclaw-channel-* packages
   * and loading those that declare a NovaClaw.channel manifest.
   */
  async discoverWorkspacePlugins(workspaceDir) {
    const plugins = [];
    const nodeModulesPath = join(workspaceDir, "node_modules");
    if (!existsSync(nodeModulesPath)) {
      this.logger.debug(`No node_modules at ${nodeModulesPath}; skipping workspace discovery`);
      return plugins;
    }
    let entries;
    try {
      entries = readdirSync(nodeModulesPath);
    } catch (err) {
      this.logger.warn(`Cannot read node_modules: ${toErrorMessage(err)}`);
      return plugins;
    }
    const channelPackages = entries.filter(
      (name) => name.startsWith("novaclaw-channel-") && name.length > "novaclaw-channel-".length
    );
    for (const pkgName of channelPackages) {
      const pkgJsonPath = join(nodeModulesPath, pkgName, "package.json");
      if (!existsSync(pkgJsonPath)) continue;
      let pkgJson;
      try {
        const raw = readFileSync(pkgJsonPath, "utf-8");
        pkgJson = JSON.parse(raw);
      } catch {
        this.logger.debug(`Invalid package.json in ${pkgName}; skipping`);
        continue;
      }
      const manifest = pkgJson.NovaClaw;
      if (!manifest?.channel?.id) {
        this.logger.debug(`Package ${pkgName} has no NovaClaw.channel manifest; skipping`);
        continue;
      }
      const channelCfg = {};
      const plugin = await this.loadFromPackage(pkgName, channelCfg);
      if (plugin) {
        plugins.push(plugin);
      }
    }
    return plugins;
  }
};

// src/framework/core/channel/runtime.ts
function buildChannelRuntime(params) {
  const { cfg, channelId, accountId, registry, bindings = [], onReply } = params;
  return {
    reply: {
      resolveEnvelopeFormatOptions: (overrideCfg) => {
        const activeCfg = overrideCfg ?? cfg;
        const channelsCfg = activeCfg.channels;
        const channelCfg = channelsCfg?.[channelId];
        const envelope = channelCfg?.envelope;
        return {
          enabled: envelope?.enabled !== false,
          showTimestamp: envelope?.showTimestamp !== false,
          showChannel: envelope?.showChannel !== false,
          showSender: envelope?.showSender !== false
        };
      },
      formatAgentEnvelope: (fmtParams) => {
        const { channel, from, timestamp, envelope, body } = fmtParams;
        if (!envelope || envelope.enabled === false) return body;
        const parts = [];
        if (envelope.showChannel !== false) parts.push(`[${channel}]`);
        if (envelope.showSender !== false) parts.push(from);
        if (envelope.showTimestamp !== false) {
          const time = new Date(timestamp).toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit"
          });
          parts.push(`(${time})`);
        }
        return parts.length ? `${parts.join(" ")}:
${body}` : body;
      },
      finalizeInboundContext: (ctxParams) => {
        const ctx = {};
        for (const [k, v] of Object.entries(ctxParams)) {
          if (v !== void 0) ctx[k] = v;
        }
        return ctx;
      },
      dispatchReplyWithBufferedBlockDispatcher: async (dispatchParams) => {
        if (onReply) {
          return onReply(dispatchParams.ctx, dispatchParams.cfg, {
            dispatcherOptions: dispatchParams.dispatcherOptions
          });
        }
        return void 0;
      }
    },
    routing: {
      resolveAgentRoute: (input) => {
        return resolveAgentRoute(
          {
            channel: input.channel ?? channelId,
            accountId: input.accountId ?? accountId,
            peer: input.peer,
            parentPeer: input.parentPeer,
            guildId: input.guildId,
            teamId: input.teamId,
            memberRoleIds: input.memberRoleIds
          },
          bindings,
          "default"
        );
      }
    },
    text: {
      chunk: (text2, limit) => chunkText(text2, limit)
    },
    media: {
      fetchRemote: async (url2) => {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 3e4);
        try {
          const res = await fetch(url2, { signal: controller.signal });
          if (!res.ok) {
            throw new Error(`fetchRemote failed: ${res.status} ${res.statusText}`);
          }
          const arrayBuffer = await res.arrayBuffer();
          return Buffer.from(arrayBuffer);
        } finally {
          clearTimeout(timeout);
        }
      }
    },
    groups: {
      resolvePolicy: (params2) => {
        const facade = getChannelFacade(channelId, registry);
        if (!facade?.groups) return void 0;
        const groupCtx = {
          cfg,
          channelId,
          accountId,
          peerId: params2.peerId ?? "",
          peerKind: params2.peerKind ?? "direct",
          guildId: params2.guildId,
          teamId: params2.teamId
        };
        return facade.groups.resolveToolPolicy?.(groupCtx) ?? facade.groups.resolveRequireMention?.(groupCtx);
      }
    },
    debounce: {
      create: (ms) => {
        return (fn) => {
          let timeout = null;
          return () => {
            if (timeout) clearTimeout(timeout);
            timeout = setTimeout(() => {
              fn();
              timeout = null;
            }, ms);
          };
        };
      }
    },
    mentions: {
      buildRegex: (botName) => {
        const escaped = botName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        return new RegExp(`@${escaped}\\b|\\b${escaped}\\b`, "i");
      }
    }
  };
}
var DEFAULT_DIRS = [
  NOVACLAW_EXTENSIONS_DIR,
  join(homedir(), ".openclaw", "extensions")
];
function discoverExtensions(dirs) {
  const searchDirs = dirs?.length ? dirs : DEFAULT_DIRS;
  const results = [];
  const seen = /* @__PURE__ */ new Set();
  for (const dir of searchDirs) {
    if (!existsSync(dir)) continue;
    let entries;
    try {
      entries = readdirSync(dir);
    } catch {
      continue;
    }
    for (const name of entries) {
      if (seen.has(name)) continue;
      const extDir = join(dir, name);
      if (!isExtensionDir(extDir)) continue;
      seen.add(name);
      const manifest = readManifest(extDir);
      results.push({
        id: manifest?.novaclaw?.channel?.id ?? name,
        dir: extDir,
        entryPath: resolveEntryPath(extDir, manifest),
        manifest,
        source: classifySource(extDir, manifest)
      });
    }
  }
  return results;
}
function isExtensionDir(dir) {
  try {
    if (!statSync(dir).isDirectory()) return false;
  } catch {
    return false;
  }
  return existsSync(join(dir, "package.json")) || existsSync(join(dir, "dist", "index.js"));
}
function readManifest(extDir) {
  const pkgPath = join(extDir, "package.json");
  if (!existsSync(pkgPath)) return null;
  try {
    const raw = JSON.parse(readFileSync(pkgPath, "utf-8"));
    if (typeof raw !== "object" || raw === null) return null;
    return raw;
  } catch {
    return null;
  }
}
function resolveEntryPath(extDir, manifest) {
  if (manifest?.openclaw?.extensions?.[0]) {
    const p3 = join(extDir, manifest.openclaw.extensions[0]);
    if (existsSync(p3)) return p3;
  }
  if (manifest?.novaclaw?.channel?.id && manifest.main) {
    const p3 = join(extDir, manifest.main);
    if (existsSync(p3)) return p3;
  }
  if (manifest?.main) {
    const p3 = join(extDir, manifest.main);
    if (existsSync(p3)) return p3;
  }
  const dist = join(extDir, "dist", "index.js");
  if (existsSync(dist)) return dist;
  const root = join(extDir, "index.js");
  if (existsSync(root)) return root;
  return null;
}
function classifySource(dir, manifest) {
  if (manifest?.novaclaw?.channel) return "novaclaw";
  if (manifest?.openclaw?.extensions) return "openclaw";
  if (dir.includes(".openclaw")) return "openclaw";
  return "unknown";
}
var COMPAT_SHIM_FILENAME = "openclaw-compat.mjs";
var PLUGIN_CACHE_DIR = join(NOVACLAW_CACHE_DIR, "plugins");
var RESOLVED_CACHE_DIR = resolve(PLUGIN_CACHE_DIR);
var integrityHashes = /* @__PURE__ */ new Map();
function sha256(content) {
  return createHash("sha256").update(content).digest("hex");
}
function assertInsideCacheDir(filePath) {
  const resolved = resolve(filePath);
  if (!resolved.startsWith(RESOLVED_CACHE_DIR)) {
    throw new Error(`Plugin path escapes cache directory: ${filePath}`);
  }
}
var PLUGIN_SDK_SHIM = [
  'export const DEFAULT_ACCOUNT_ID = "default";',
  "export function emptyPluginConfigSchema() {",
  "  return {",
  "    safeParse(v) {",
  "      if (v === undefined) return { success: true, data: undefined };",
  '      if (!v || typeof v !== "object" || Array.isArray(v)) return { success: false, error: { issues: [{ message: "expected object" }] } };',
  "      return { success: true, data: v };",
  "    },",
  '    jsonSchema: { type: "object", additionalProperties: false, properties: {} },',
  "  };",
  "}"
].join("\n");
var OpenClawAdapter = class {
  id = "openclaw";
  canHandle(ext) {
    return ext.source === "openclaw" || ext.source === "unknown";
  }
  async load(ext, ctx) {
    if (!ext.entryPath) return null;
    try {
      ctx.logger.debug(`OpenClawAdapter: loading '${ext.id}' from ${ext.entryPath}`);
      const patchedPath = patchAndCache(ext.id, ext.entryPath);
      const plugin = await importAndCapture(ext.id, patchedPath, ctx);
      if (plugin) {
        ctx.logger.info(`OpenClawAdapter: loaded channel plugin '${ext.id}'`);
        return bridgeGatewayLifecycle(plugin);
      }
      return plugin;
    } catch (err) {
      ctx.logger.warn(`OpenClawAdapter: failed to load '${ext.id}': ${toErrorMessage(err)}`);
      return null;
    }
  }
};
function bridgeGatewayLifecycle(plugin) {
  const originalGateway = plugin.gateway;
  if (!originalGateway?.startAccount) return plugin;
  return {
    ...plugin,
    gateway: {
      ...originalGateway,
      async startAccount(ctx) {
        ctx.setStatus({ connected: true, lastConnectedAt: Date.now() });
        return originalGateway.startAccount(ctx);
      }
    }
  };
}
function patchAndCache(extensionId, sourcePath) {
  mkdirSync(PLUGIN_CACHE_DIR, { recursive: true });
  const outPath = join(PLUGIN_CACHE_DIR, `${extensionId}.mjs`);
  assertInsideCacheDir(outPath);
  let source = readFileSync(sourcePath, "utf-8");
  source = source.replace(
    /from\s+["']openclaw\/plugin-sdk["']/g,
    `from "./${COMPAT_SHIM_FILENAME}.ts"`
  );
  source = source.replace(
    /import \* as (__WEBPACK_EXTERNAL_MODULE_\w+__) from "(events|http|https|net|tls|stream|crypto|zlib|os|fs|path|url|util|assert|buffer|child_process)"/g,
    'import $1 from "$2"'
  );
  writeIfChanged(outPath, source);
  integrityHashes.set(resolve(outPath), sha256(source));
  const shimPath = join(PLUGIN_CACHE_DIR, COMPAT_SHIM_FILENAME);
  assertInsideCacheDir(shimPath);
  writeIfChanged(shimPath, PLUGIN_SDK_SHIM);
  integrityHashes.set(resolve(shimPath), sha256(PLUGIN_SDK_SHIM));
  return outPath;
}
async function importAndCapture(extensionId, modulePath, ctx) {
  assertInsideCacheDir(modulePath);
  const resolvedPath = resolve(modulePath);
  const expectedHash = integrityHashes.get(resolvedPath);
  if (expectedHash) {
    const onDisk = readFileSync(resolvedPath, "utf-8");
    if (sha256(onDisk) !== expectedHash) {
      throw new Error(`Integrity check failed for plugin '${extensionId}': file was modified after patching`);
    }
  }
  const fileUrl = pathToFileURL(modulePath);
  fileUrl.searchParams.set("t", String(Date.now()));
  const mod = await import(fileUrl.href);
  const defaultExport = mod.default;
  if (defaultExport?.register) {
    return captureViaRegister(extensionId, defaultExport, ctx);
  }
  for (const [key, value] of Object.entries(mod)) {
    if (key === "default") continue;
    if (isChannelPluginShaped(value)) return value;
  }
  if (defaultExport && isChannelPluginShaped(defaultExport)) {
    return defaultExport;
  }
  return null;
}
function buildExtensionRuntime(config, channelRuntime) {
  const noop = () => {
  };
  const asyncNoop = async () => null;
  return {
    version: "0.0.0-novaclaw",
    channel: channelRuntime ?? {},
    config: { loadConfig: async () => config, writeConfigFile: asyncNoop },
    system: { enqueueSystemEvent: noop, requestHeartbeatNow: noop, runCommandWithTimeout: async () => ({ exitCode: 1, stdout: "", stderr: "" }), formatNativeDependencyHint: () => "" },
    media: { loadWebMedia: asyncNoop, detectMime: () => "application/octet-stream", mediaKindFromMime: () => "document", isVoiceCompatibleAudio: () => false, getImageMetadata: asyncNoop, resizeToJpeg: async (b) => b },
    tts: { textToSpeechTelephony: asyncNoop },
    stt: { transcribeAudioFile: asyncNoop },
    tools: { createMemoryGetTool: () => null, createMemorySearchTool: () => null, registerMemoryCli: noop },
    events: { onAgentEvent: () => ({ unsubscribe: noop }), onSessionTranscriptUpdate: () => ({ unsubscribe: noop }) },
    logging: { shouldLogVerbose: () => false, getChildLogger: () => ({ debug: noop, info: noop, warn: noop, error: noop }) },
    state: { resolveStateDir: () => config.workspaceDir ?? "" },
    subagent: { run: async () => ({ runId: "noop" }), waitForRun: async () => ({ status: "error", error: "not available" }), getSessionMessages: async () => ({ messages: [] }), getSession: async () => ({ messages: [] }), deleteSession: asyncNoop }
  };
}
function captureViaRegister(extensionId, definition, ctx) {
  let captured = null;
  const noop = () => {
  };
  const config = ctx.config;
  const api = {
    id: extensionId,
    name: definition.name ?? extensionId,
    version: "0.0.0",
    description: definition.description,
    source: `extension:${extensionId}`,
    config,
    pluginConfig: {},
    runtime: buildExtensionRuntime(config, ctx.channelRuntime),
    logger: {
      debug: (msg) => ctx.logger.debug(`[ext:${extensionId}] ${msg}`),
      info: (msg) => ctx.logger.info(`[ext:${extensionId}] ${msg}`),
      warn: (msg) => ctx.logger.warn(`[ext:${extensionId}] ${msg}`),
      error: (msg) => ctx.logger.error(`[ext:${extensionId}] ${msg}`)
    },
    registerChannel: (reg) => {
      captured = "plugin" in reg && reg.plugin ? reg.plugin : isChannelPluginShaped(reg) ? reg : null;
    },
    registerTool: noop,
    registerHook: noop,
    registerHttpRoute: noop,
    registerGatewayMethod: noop,
    registerCli: noop,
    registerService: noop,
    registerProvider: noop,
    registerCommand: noop,
    registerContextEngine: noop,
    resolvePath: (input) => input,
    on: noop
  };
  return Promise.resolve(definition.register(api)).then(() => captured);
}
function isChannelPluginShaped(value) {
  return typeof value === "object" && value !== null && "id" in value && "meta" in value;
}
function writeIfChanged(filePath, content) {
  if (existsSync(filePath)) {
    const existing = readFileSync(filePath, "utf-8");
    if (existing === content) return;
  }
  writeFileSync(filePath, content);
}

// src/framework/core/channel/extensions/loader.ts
var ChannelExtensionLoader = class {
  extensions = [];
  adapters;
  logger;
  extensionDirs;
  constructor(options) {
    this.logger = options.logger;
    this.extensionDirs = options.extensionDirs;
    this.adapters = options.adapters ?? [new OpenClawAdapter()];
  }
  /**
   * Run discovery and cache results. Safe to call multiple times;
   * re-scans the directories each time.
   */
  discover() {
    this.extensions = discoverExtensions(this.extensionDirs);
    if (this.extensions.length > 0) {
      this.logger.info(`ExtensionLoader: discovered ${this.extensions.length} extension(s)`);
    }
    return this.extensions;
  }
  getDiscoveredExtensions() {
    return this.extensions;
  }
  findExtension(channelId) {
    return this.extensions.find((e) => e.id === channelId);
  }
  registerAdapter(adapter) {
    if (!this.adapters.some((a) => a.id === adapter.id)) {
      this.adapters.push(adapter);
    }
  }
  /**
   * Load a single extension as a ChannelPlugin.
   * Tries native import first, then falls back to registered adapters.
   */
  async loadExtension(ext, config, channelRuntime) {
    if (!ext.entryPath) {
      this.logger.debug(`ExtensionLoader: '${ext.id}' has no entry path, skipping`);
      return null;
    }
    const nativePlugin = await this.tryNativeLoad(ext);
    if (nativePlugin) return nativePlugin;
    const ctx = {
      config,
      logger: this.logger,
      channelRuntime
    };
    for (const adapter of this.adapters) {
      if (!adapter.canHandle(ext)) continue;
      const plugin = await adapter.load(ext, ctx);
      if (plugin) return plugin;
    }
    this.logger.debug(`ExtensionLoader: no adapter could load '${ext.id}'`);
    return null;
  }
  /**
   * Try importing the extension natively — checks for a standard
   * ChannelPlugin export (default, named, or createPlugin factory).
   */
  async tryNativeLoad(ext) {
    if (!ext.entryPath) return null;
    try {
      const fileUrl = pathToFileURL(ext.entryPath);
      fileUrl.searchParams.set("t", String(Date.now()));
      const mod = await import(fileUrl.href);
      if (isChannelPlugin(mod.default)) {
        this.logger.info(`ExtensionLoader: native load '${ext.id}' (default export)`);
        return mod.default;
      }
      if (typeof mod.createPlugin === "function") {
        const plugin = mod.createPlugin({});
        if (isChannelPlugin(plugin)) {
          this.logger.info(`ExtensionLoader: native load '${ext.id}' (createPlugin)`);
          return plugin;
        }
      }
      for (const [key, value] of Object.entries(mod)) {
        if (key === "default") continue;
        if (isChannelPlugin(value)) {
          this.logger.info(`ExtensionLoader: native load '${ext.id}' (named export '${key}')`);
          return value;
        }
      }
    } catch {
    }
    return null;
  }
};
function isChannelPlugin(value) {
  return typeof value === "object" && value !== null && "id" in value && "meta" in value && "capabilities" in value && "config" in value;
}
var ChannelHub = class extends EventEmitter {
  registry;
  manager;
  inboundPipeline;
  debouncePolicy;
  activityTracker;
  pluginLoader;
  extensionLoader;
  messageHandlers = /* @__PURE__ */ new Map();
  config;
  logger;
  pluginRegistry;
  messageProcessor;
  bindings;
  constructor(config, options) {
    super();
    this.config = config;
    this.logger = new Logger("ChannelHub", config.logging?.level || "info");
    this.bindings = options?.bindings ?? [];
    this.messageProcessor = options?.messageProcessor;
    this.pluginRegistry = options?.channelPluginRegistry;
    this.registry = options?.channelRegistry ?? new ChannelRegistry();
    this.manager = new ChannelManager({
      registry: this.registry,
      config: this.config,
      logger: this.logger,
      channelRuntimeFactory: (channelId, accountId) => this.createChannelRuntime(channelId, accountId)
    });
    this.inboundPipeline = new InboundPipeline({
      registry: this.registry,
      config: this.config,
      bindings: this.bindings,
      logger: this.logger
    });
    this.debouncePolicy = new InboundDebouncePolicy();
    this.activityTracker = new ChannelActivityTracker();
    this.pluginLoader = new ChannelPluginLoader(this.logger);
    this.extensionLoader = new ChannelExtensionLoader({ logger: this.logger });
    this.extensionLoader.discover();
  }
  // ── Initialization ──────────────────────────────────────────────────
  async initialize() {
    const startTime = performance.now();
    this.logger.info("Initializing Channel Hub...");
    try {
      const enabledChannels = this.config.channels?.enabled || [];
      this.logger.debug(`Loading ${enabledChannels.length} enabled channels`);
      const bridge = {
        emit: (event, payload) => this.emit(event, payload),
        setMessageHandler: (id, handler) => this.messageHandlers.set(id, handler)
      };
      let successCount = 0;
      let failureCount = 0;
      for (const channelId of enabledChannels) {
        try {
          await this.loadChannel(channelId, bridge);
          successCount++;
        } catch (error) {
          this.logger.warn(`Failed to load channel ${channelId}`, error);
          failureCount++;
        }
      }
      await this.manager.startChannels();
      this.logger.info(`Channel Hub initialized in ${(performance.now() - startTime).toFixed(2)}ms`, {
        successfulChannels: successCount,
        failedChannels: failureCount,
        totalEnabled: enabledChannels.length
      });
    } catch (error) {
      this.logger.error("Failed to initialize Channel Hub", error);
      throw error;
    }
  }
  // ── Inbound ─────────────────────────────────────────────────────────
  async dispatchMessage(channelId, message) {
    const handler = this.messageHandlers.get(channelId);
    if (!handler) {
      throw new Error(`No message handler registered for channel: ${channelId}`);
    }
    await handler(message);
  }
  async routeIncomingMessage(channelId, message) {
    try {
      const result = this.inboundPipeline.process(
        channelId,
        message,
        (pairing) => this.emit("pairing:requested", pairing)
      );
      if (!result) {
        this.activityTracker.recordError(channelId);
        return;
      }
      this.activityTracker.recordReceived(channelId);
      this.emit("channel:message:routed", {
        channelId,
        context: result.context,
        sessionHints: result.sessionHints,
        message: result.message
      });
    } catch (error) {
      this.logger.error(`Error routing message from ${channelId}`, error);
      this.activityTracker.recordError(channelId);
      throw error;
    }
  }
  // ── Outbound ────────────────────────────────────────────────────────
  async sendMessage(channelId, target, content) {
    const result = await deliverOutboundMessage(
      {
        channel: channelId,
        to: target,
        text: content.text ?? content.markdown ?? "",
        mediaUrl: content.mediaUrl,
        metadata: content.metadata
      },
      this.config,
      this.registry
    );
    if (!result.success && result.errors.length > 0) {
      this.activityTracker.recordError(channelId);
      throw result.errors[0];
    }
    this.activityTracker.recordSent(channelId);
    this.emit("message:sent", { channelId, target, content });
  }
  // ── Plugin access ───────────────────────────────────────────────────
  getChannelPlugin(channelId) {
    return this.registry.get(channelId);
  }
  getEffectiveConfig() {
    return this.config;
  }
  getChannelRegistry() {
    return this.registry;
  }
  getChannelManager() {
    return this.manager;
  }
  hasHandler(channelId) {
    return this.messageHandlers.has(channelId);
  }
  setMessageProcessor(mp) {
    this.messageProcessor = mp;
  }
  registerExternalPlugin(channelId, plugin) {
    if (this.registry.has(channelId)) return;
    this.registry.registerPlugin(plugin, "global");
  }
  // ── Status ──────────────────────────────────────────────────────────
  getRuntimeSnapshot() {
    return this.manager.getRuntimeSnapshot();
  }
  getChannelStatus(channelId) {
    const runtimeSnapshot = this.manager.getRuntimeSnapshot();
    const channelState = runtimeSnapshot.channels[channelId];
    if (!channelState) return null;
    return this.buildChannelStatus(channelId, channelState);
  }
  getAllChannelStatuses() {
    const statuses = {};
    const runtimeSnapshot = this.manager.getRuntimeSnapshot();
    for (const [channelId, channelState] of Object.entries(runtimeSnapshot.channels)) {
      statuses[channelId] = this.buildChannelStatus(channelId, channelState);
    }
    return statuses;
  }
  // ── Dynamic channel management ──────────────────────────────────────
  async addChannel(channelId) {
    if (this.registry.has(channelId)) {
      throw new Error(`Channel ${channelId} already exists`);
    }
    const bridge = {
      emit: (event, payload) => this.emit(event, payload),
      setMessageHandler: (id, handler) => this.messageHandlers.set(id, handler)
    };
    await this.loadChannel(channelId, bridge);
    if (!this.registry.has(channelId)) {
      throw new Error(
        `Channel '${channelId}' could not be loaded \u2014 not found as novaclaw-channel-${channelId} or openclaw extension`
      );
    }
    await this.manager.startChannel(channelId);
    this.logger.info(`Channel ${channelId} added`);
    this.emit("channel:added", channelId);
  }
  async removeChannel(channelId) {
    if (!this.registry.has(channelId)) {
      throw new Error(`Channel ${channelId} not found`);
    }
    await this.manager.stopChannel(channelId);
    this.registry.unregister(channelId);
    this.messageHandlers.delete(channelId);
    this.logger.info(`Channel ${channelId} removed`);
    this.emit("channel:removed", channelId);
  }
  // ── Lifecycle ───────────────────────────────────────────────────────
  async cleanup() {
    this.logger.info("Cleaning up Channel Hub...");
    this.debouncePolicy.clear();
    await this.manager.stopAll();
    this.messageHandlers.clear();
    this.removeAllListeners();
    this.logger.info("Channel Hub cleaned up");
  }
  getStats() {
    const snapshot = this.manager.getRuntimeSnapshot();
    const channelCount = Object.keys(snapshot.channels).length;
    const accountCount = Object.values(snapshot.channels).reduce((sum, ch) => sum + Object.keys(ch.accounts).length, 0);
    return {
      channels: channelCount,
      accounts: accountCount,
      handlers: this.messageHandlers.size,
      registryVersion: this.registry.getVersion()
    };
  }
  // ── Private: channel loading ────────────────────────────────────────
  async loadChannel(channelId, bridge) {
    if (this.pluginRegistry) {
      const entry = this.pluginRegistry.get(channelId);
      if (entry?.plugin) {
        this.registry.registerPlugin(entry.plugin, "config", entry.version);
        return;
      }
      if (entry?.factory) {
        const channelCfg = this.config.channels?.[channelId] ?? {};
        const plugin = await entry.factory(channelCfg);
        this.registry.registerPlugin(plugin, "config");
        return;
      }
    }
    if (BUILTIN_CHANNEL_IDS.includes(channelId)) {
      const plugin = createBuiltinPlugin(channelId, bridge);
      this.registry.registerPlugin(plugin, "bundled");
      return;
    }
    await this.loadExternalPlugin(channelId);
  }
  async loadExternalPlugin(channelId) {
    const packageName = `novaclaw-channel-${channelId}`;
    const channelCfg = this.config.channels?.[channelId] ?? {};
    const nativePlugin = await this.pluginLoader.loadFromPackage(packageName, channelCfg);
    if (nativePlugin) {
      this.registry.registerPlugin(nativePlugin, "global");
      return;
    }
    if (this.registry.has(channelId)) return;
    const ext = this.extensionLoader.findExtension(channelId);
    if (ext) {
      const channelRuntime = this.createChannelRuntime(channelId, "default");
      const plugin = await this.extensionLoader.loadExtension(ext, this.config, channelRuntime);
      if (plugin) {
        this.registry.registerPlugin(plugin, "global");
        return;
      }
    }
    this.logger.warn(`Channel '${channelId}' not found as ${packageName} or local extension`);
  }
  // ── Private: channel runtime for plugins ────────────────────────────
  createChannelRuntime(channelId, accountId) {
    const mp = this.messageProcessor;
    if (!mp) return void 0;
    return buildChannelRuntime({
      cfg: this.config,
      channelId,
      accountId,
      registry: this.registry,
      bindings: this.bindings,
      onReply: async (ctx, _cfg, options) => {
        const body = resolveInboundBody(ctx);
        if (!body) return { dispatched: false };
        const senderName = ctx.SenderName?.toLowerCase();
        if (senderName && BOT_ROLES.has(senderName)) return { dispatched: false };
        const userId = ctx.From ?? ctx.SenderId ?? "anonymous";
        const sessionKey = ctx.SessionKey;
        const response = await mp.process({
          message: body,
          sessionKey,
          userId,
          channel: channelId
        });
        const opts = options;
        if (response.success && response.content?.trim() && typeof opts?.dispatcherOptions?.deliver === "function") {
          await opts.dispatcherOptions.deliver({ text: response.content });
        }
        return { dispatched: true };
      }
    });
  }
  // ── Private: status helpers ─────────────────────────────────────────
  buildChannelStatus(channelId, channelState) {
    const activity = this.activityTracker.get(channelId);
    const accounts = Object.entries(channelState.accounts).map(([accountId, snap]) => ({
      accountId,
      connected: snap.connected ?? false,
      error: snap.lastError ?? void 0
    }));
    const bestConnected = accounts.some((a) => a.connected);
    const lastActivity = (activity?.lastMessageAt ?? Math.max(
      ...Object.values(channelState.accounts).map((s) => s.lastMessageAt ?? s.lastStartAt ?? 0).filter(Boolean),
      0
    )) || void 0;
    const errors = Object.values(channelState.accounts).filter((s) => s.lastError).length;
    const allErrors = Object.values(channelState.accounts).map((s) => s.lastError).filter((e) => !!e);
    return {
      connected: bestConnected,
      lastActivity: lastActivity || void 0,
      error: allErrors.length > 0 ? allErrors.join("; ") : void 0,
      metrics: {
        messagesSent: activity?.msgSent ?? 0,
        messagesReceived: activity?.msgReceived ?? 0,
        errors: (activity?.errors ?? 0) + errors
      },
      accounts
    };
  }
};

// src/framework/core/rules/exec-channel-rule.ts
var SENSITIVE_TOOLS = /* @__PURE__ */ new Set(["exec"]);
var DEFAULT_ALLOWED_CHANNELS = ["cli"];
function createExecChannelRule() {
  return {
    id: "exec-channel-allowlist",
    name: "Sensitive tool channel allowlist",
    description: "Allow sensitive tools only on channels listed in allowExecInChannels (defaults to cli)",
    phase: "behavior",
    priority: 10,
    evaluate(ctx) {
      if (ctx.type !== "tool" && !ctx.toolName) return void 0;
      const toolName = ctx.toolName ?? ctx.name;
      if (!toolName || !SENSITIVE_TOOLS.has(toolName)) return void 0;
      const channel = ctx.channel ?? ctx.payload?.channel;
      if (!channel) return void 0;
      const allowList = ctx.payload?.allowExecInChannels;
      const effectiveList = Array.isArray(allowList) ? allowList : DEFAULT_ALLOWED_CHANNELS;
      if (effectiveList.includes("*") || effectiveList.includes(channel)) {
        return { action: "allow" };
      }
      return { action: "reject", reason: `${toolName} is not allowed on channel: ${channel}` };
    }
  };
}

// src/framework/core/rules/output/thinking-strip.ts
var THINK_PATTERN = /<think>[\s\S]*?<\/think>/g;
function createThinkingStripRule() {
  return {
    id: "thinking-strip",
    name: "Strip thinking tags",
    description: "Remove <think>...</think> blocks from agent output",
    phase: "output",
    priority: 90,
    evaluate(ctx) {
      if (ctx.type !== "output" || !ctx.content) return void 0;
      if (!THINK_PATTERN.test(ctx.content)) return void 0;
      THINK_PATTERN.lastIndex = 0;
      const stripped = ctx.content.replace(THINK_PATTERN, "").trim();
      if (stripped !== ctx.content) {
        return { action: "rewrite", content: stripped };
      }
      return void 0;
    }
  };
}

// src/framework/core/rules/output/format-channel.ts
var DEFAULT_FORMATS = {
  telegram: { format: "html", maxLength: 4096 },
  slack: { format: "mrkdwn", maxLength: 4e3 },
  discord: { format: "markdown", maxLength: 2e3 },
  cli: { format: "markdown" },
  api: { format: "markdown" }
};
function markdownToHtml(md) {
  return md.replace(/```[\w]*\n?([\s\S]*?)```/g, "<pre>$1</pre>").replace(/`([^`]+)`/g, "<code>$1</code>").replace(/\*\*(.+?)\*\*/g, "<b>$1</b>").replace(/\*(.+?)\*/g, "<i>$1</i>").replace(/__(.+?)__/g, "<b>$1</b>").replace(/_(.+?)_/g, "<i>$1</i>").replace(/~~(.+?)~~/g, "<s>$1</s>").replace(/^### (.+)$/gm, "<b>$1</b>").replace(/^## (.+)$/gm, "<b>$1</b>").replace(/^# (.+)$/gm, "<b>$1</b>");
}
function markdownToMrkdwn(md) {
  return md.replace(/\*\*(.+?)\*\*/g, "*$1*").replace(/__(.+?)__/g, "*$1*").replace(/~~(.+?)~~/g, "~$1~").replace(/^### (.+)$/gm, "*$1*").replace(/^## (.+)$/gm, "*$1*").replace(/^# (.+)$/gm, "*$1*");
}
function markdownToPlain(md) {
  return md.replace(/```[\w]*\n?([\s\S]*?)```/g, "$1").replace(/`([^`]+)`/g, "$1").replace(/\*\*(.+?)\*\*/g, "$1").replace(/\*(.+?)\*/g, "$1").replace(/__(.+?)__/g, "$1").replace(/_(.+?)_/g, "$1").replace(/~~(.+?)~~/g, "$1").replace(/^#{1,6}\s+(.+)$/gm, "$1");
}
function truncate(text2, maxLength) {
  if (text2.length <= maxLength) return text2;
  return text2.slice(0, maxLength - 3) + "...";
}
function createFormatChannelRule(channelFormats) {
  const formats = { ...DEFAULT_FORMATS };
  return {
    id: "format-channel-adapt",
    name: "Channel format adapter",
    description: "Transform output markdown to channel-native format",
    phase: "output",
    priority: 50,
    evaluate(ctx) {
      if (ctx.type !== "output" || !ctx.content || !ctx.channel) return void 0;
      const config = formats[ctx.channel];
      if (!config) return void 0;
      let transformed = ctx.content;
      switch (config.format) {
        case "html":
          transformed = markdownToHtml(transformed);
          break;
        case "mrkdwn":
          transformed = markdownToMrkdwn(transformed);
          break;
        case "plain":
          transformed = markdownToPlain(transformed);
          break;
      }
      if (config.maxLength) {
        transformed = truncate(transformed, config.maxLength);
      }
      if (transformed !== ctx.content) {
        return { action: "rewrite", content: transformed };
      }
      return void 0;
    }
  };
}

// src/framework/core/rules/input/content-safety.ts
var INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?previous\s+instructions/i,
  /disregard\s+(all\s+)?prior\s+(instructions|prompts)/i,
  /you\s+are\s+now\s+(?:a\s+)?(?:DAN|jailbroken|unfiltered)/i,
  /system\s*:\s*you\s+(?:are|must)/i,
  /\[SYSTEM\]\s*override/i,
  /pretend\s+(?:you\s+(?:are|have)|to\s+be)\s+.*(?:no\s+restrictions|unrestricted)/i
];
function createContentSafetyRule() {
  return {
    id: "content-safety",
    name: "Input content safety",
    description: "Detect potential prompt injection in user messages",
    phase: "input",
    priority: 100,
    evaluate(ctx) {
      if (ctx.type !== "message" || !ctx.message) return void 0;
      for (const pattern of INJECTION_PATTERNS) {
        if (pattern.test(ctx.message)) {
          return {
            action: "reject",
            reason: "Message blocked: potential prompt injection detected"
          };
        }
      }
      return void 0;
    }
  };
}
var CLIENT_NAME = "novaclaw-mcp-client";
var CLIENT_VERSION = "1.0.0";
function isHttpUrl(s) {
  return /^https?:\/\//i.test(s.trim());
}
function parseUrl(endpoint) {
  const s = endpoint.trim();
  if (!isHttpUrl(s)) throw new Error(`Invalid MCP HTTP endpoint: ${endpoint}`);
  return new URL(s);
}
function buildRequestInit(config) {
  if (!config) return void 0;
  const init = {};
  if (config.headers && typeof config.headers === "object") {
    const headers = {};
    for (const [k, v] of Object.entries(config.headers)) {
      if (typeof v === "string" && v.trim() !== "") headers[k] = v;
    }
    if (Object.keys(headers).length > 0) init.headers = headers;
  }
  if (config.method) init.method = config.method;
  if (config.credentials) init.credentials = config.credentials;
  return Object.keys(init).length > 0 ? init : void 0;
}
function hasAuthorizationHeader(init) {
  const h = init?.headers;
  if (h == null) return false;
  if (typeof Headers !== "undefined" && h instanceof Headers) return h.has("Authorization");
  if (typeof h === "object") {
    return Object.keys(h).some((k) => k.toLowerCase() === "authorization");
  }
  return false;
}
function newClient() {
  return new Client({ name: CLIENT_NAME, version: CLIENT_VERSION });
}
function streamableOptions(requestInit) {
  return requestInit != null && Object.keys(requestInit).length > 0 ? { requestInit } : void 0;
}
async function createStdioTransport(command, args, logger3) {
  const client = newClient();
  const transport = new StdioClientTransport({ command, args });
  await client.connect(transport);
  logger3.debug(`Transport connected: stdio ${command}`);
  return { client, transport };
}
async function createHttpTransport(endpoint, requestInit, logger3) {
  const url2 = parseUrl(endpoint);
  const fetchInit = buildRequestInit(requestInit);
  logger3.debug(`HTTP transport: auth=${hasAuthorizationHeader(fetchInit)}, endpoint=${url2.href}`);
  const client = newClient();
  const transport = new StreamableHTTPClientTransport(url2, streamableOptions(fetchInit));
  await client.connect(transport);
  logger3.debug(`Transport connected: ${url2.href}`);
  return { client, transport };
}
async function createTransport(options, logger3) {
  const { endpoint, command, args } = options;
  const type = options.transport ?? (isHttpUrl(endpoint) ? "http" : "stdio");
  if (type === "stdio") {
    if (!command) throw new Error("stdio transport requires command");
    return createStdioTransport(command, args ?? [], logger3);
  }
  if (type === "http" || type === "sse") {
    return createHttpTransport(endpoint, options.requestInit, logger3);
  }
  throw new Error(`Unsupported MCP transport: ${type}. Endpoint: ${endpoint}`);
}

// src/framework/core/mcp/mcp-connection.ts
async function openConnection(options, logger3) {
  const result = await createTransport(options, logger3);
  return {
    endpoint: options.endpoint.trim(),
    client: result.client,
    transport: result.transport,
    closed: false
  };
}
async function closeConnection(conn) {
  if (conn.closed) return;
  conn.closed = true;
  await conn.client.close();
}
async function listTools(conn) {
  const result = await conn.client.listTools();
  const tools = result.tools ?? [];
  return tools.map((t3) => ({ name: t3.name, description: t3.description, inputSchema: t3.inputSchema }));
}
async function callTool(conn, toolName, args) {
  const result = await conn.client.callTool({ name: toolName, arguments: args });
  const typed = result;
  return {
    content: typed.content ?? [],
    isError: typed.isError ?? false
  };
}

// src/framework/core/mcp/mcp-connector.ts
var DEFAULT_ID = "default-mcp";
var DefaultMCPConnector = class {
  id;
  logger;
  connections = /* @__PURE__ */ new Map();
  constructor(options = {}) {
    this.id = options.id ?? DEFAULT_ID;
    this.logger = options.logger ?? new Logger("DefaultMCPConnector");
  }
  get connectionCount() {
    return this.connections.size;
  }
  async connect(options) {
    const key = options.endpoint.trim();
    if (!key) throw new Error("MCP connect: endpoint is required");
    const existing = this.connections.get(key);
    if (existing) {
      await closeConnection(existing).catch(
        (e) => this.logger.warn(`Close existing failed: ${key}`, e)
      );
    }
    this.logger.debug(`Connecting: ${key}`);
    const connection = await openConnection(options, this.logger);
    this.connections.set(key, connection);
    this.logger.info(`Connected: ${key}`);
  }
  async disconnect(endpoint) {
    const key = endpoint.trim();
    const connection = this.connections.get(key);
    if (!connection) return;
    this.connections.delete(key);
    await closeConnection(connection).catch(
      (e) => this.logger.warn(`Close error: ${key}`, e)
    );
    this.logger.info(`Disconnected: ${key}`);
  }
  async listTools(endpoint) {
    return listTools(this.requireConnection(endpoint));
  }
  async callTool(endpoint, toolName, args = {}) {
    this.logger.debug(`Calling tool: ${toolName}`);
    return callTool(this.requireConnection(endpoint), toolName, args);
  }
  async cleanup() {
    const entries = Array.from(this.connections.entries());
    this.connections.clear();
    await Promise.allSettled(
      entries.map(
        ([key, c]) => closeConnection(c).catch((e) => this.logger.warn(`Close error: ${key}`, e))
      )
    );
    this.logger.debug("Cleaned up");
  }
  requireConnection(endpoint) {
    const c = this.connections.get(endpoint.trim());
    if (!c) throw new Error(`MCP endpoint not connected: ${endpoint}`);
    return c;
  }
};

// src/framework/core/mcp/mcp-config-mask.ts
function isSensitiveHeaderKey(key) {
  const lower = key.toLowerCase();
  return lower === "authorization" || lower === "cookie" || lower.includes("x-api-key") || lower.includes("api-key") || lower === "x-auth-token";
}
function maskHeaderValue(key, value) {
  if (isSensitiveHeaderKey(key) || /^Bearer\s+/i.test(value)) {
    return "***";
  }
  return value;
}
function maskMcpListForResponse(entries, showKeys) {
  if (entries == null || showKeys) return entries;
  return entries.map((row) => {
    const ri = row.requestInit;
    if (!ri?.headers || typeof ri.headers !== "object") return row;
    const headers = {};
    for (const [k, v] of Object.entries(ri.headers)) {
      headers[k] = typeof v === "string" ? maskHeaderValue(k, v) : "***";
    }
    return {
      ...row,
      requestInit: {
        ...ri,
        headers
      }
    };
  });
}
function mergeMcpIncomingWithExisting(incoming, existing) {
  const byEndpoint = new Map(
    (existing ?? []).map((e) => [e.endpoint.trim(), e])
  );
  return incoming.map((row) => {
    const ep = row.endpoint.trim();
    const prev = byEndpoint.get(ep);
    const ri = row.requestInit;
    if (!ri?.headers || typeof ri.headers !== "object") return row;
    const prevHeaders = prev?.requestInit?.headers;
    const merged = { ...ri.headers };
    for (const [hk, hv] of Object.entries(merged)) {
      if (hv === "***" && prevHeaders && typeof prevHeaders[hk] === "string") {
        merged[hk] = prevHeaders[hk];
      }
    }
    return {
      ...row,
      requestInit: {
        ...ri,
        headers: merged
      }
    };
  });
}

// src/framework/core/tools/format-result.ts
var MAX_DISPLAY_LEN = 32e3;
function formatToolResultForDisplay(_toolName, result) {
  if (result === void 0 || result === null) return "(no output)";
  if (typeof result === "string") {
    const s = result.trim();
    return s.length <= MAX_DISPLAY_LEN ? s : truncate2(s);
  }
  if (typeof result !== "object") return String(result);
  const obj = result;
  if (Array.isArray(obj.content)) return formatMcpContent(obj.content);
  if (obj.success === false && typeof obj.error === "string") return obj.error;
  if (obj.success === true) {
    const stdout = typeof obj.stdout === "string" ? obj.stdout.trim() : "";
    const stderr = typeof obj.stderr === "string" ? obj.stderr.trim() : "";
    if (stdout && stderr) return truncate2(`stdout:
${stdout}

stderr:
${stderr}`);
    if (stdout) return truncate2(stdout);
    if (stderr) return truncate2(stderr);
  }
  if (obj.success === true && typeof obj.content === "string") {
    return truncate2(obj.content.trim());
  }
  if (obj.success === true && typeof obj.path === "string") {
    return `Written: ${obj.path}`;
  }
  if (obj.success === true && typeof obj.status === "number" && ("content" in obj || "headers" in obj)) {
    const status = obj.status;
    const label = obj.ok === true ? "OK" : "non-2xx";
    const content = typeof obj.content === "string" ? obj.content.trim() : typeof obj.content === "object" && obj.content !== null ? JSON.stringify(obj.content, null, 2) : "";
    if (!content) return `HTTP ${status} (${label})`;
    return `HTTP ${status} (${label})

${truncate2(content)}`;
  }
  try {
    return truncate2(JSON.stringify(obj, null, 2));
  } catch {
    return String(result);
  }
}
function formatMcpContent(content) {
  const parts = [];
  let imageCount = 0;
  for (const item2 of content) {
    if (!item2 || typeof item2 !== "object") continue;
    const typed = item2;
    if (typed.type === "text" && typeof typed.text === "string" && typed.text.trim()) {
      parts.push(typed.text.trim());
    } else if (typed.type === "image") {
      imageCount++;
    }
  }
  let out = parts.join("\n\n").trim();
  if (imageCount > 0) out += `${out ? "\n\n" : ""}[${imageCount} image(s)]`;
  if (!out) return "(MCP: no text content)";
  return out.length > MAX_DISPLAY_LEN ? truncate2(out) : out;
}
function truncate2(text2) {
  if (text2.length <= MAX_DISPLAY_LEN) return text2;
  return `${text2.slice(0, MAX_DISPLAY_LEN)}

... (truncated, ${text2.length} chars total)`;
}
function resolvePathInWorkspace(rawPath, workspaceDir) {
  const base2 = resolveWorkspaceDir(workspaceDir);
  const joined = path.isAbsolute(rawPath) ? path.normalize(rawPath) : path.join(base2, path.normalize(rawPath));
  const resolved = path.resolve(joined);
  const rel = path.relative(base2, resolved);
  if (rel.startsWith("..") || path.isAbsolute(rel)) return null;
  return resolved;
}
var SHELL_BUILTINS = /* @__PURE__ */ new Set([
  "cd",
  "echo",
  "export",
  "source",
  "set",
  "unset",
  "pwd",
  "pushd",
  "popd",
  "alias",
  "unalias",
  "type",
  "hash",
  "read",
  "eval",
  "exec",
  "trap",
  "return",
  "exit",
  "shift",
  "wait",
  "bg",
  "fg",
  "jobs",
  "kill",
  "true",
  "false",
  "test",
  "[",
  "printf",
  "local",
  "declare",
  "typeset",
  "readonly",
  "let",
  "builtin",
  "command",
  "enable",
  "help",
  "logout",
  "mapfile",
  "readarray",
  "dirs",
  "shopt",
  "ulimit",
  "umask"
]);
var BLOCKED_COMMAND_PATTERNS = [
  /rm\s+(-[a-zA-Z]*f[a-zA-Z]*\s+)?\/\s*$/,
  /rm\s+(-[a-zA-Z]*f[a-zA-Z]*\s+)?(\/\*|\/bin|\/usr|\/etc|\/var|\/home)\b/,
  /mkfs\b/,
  /dd\s+if=.*of=\/dev\//,
  /:\(\)\s*\{\s*:\|:\s*&\s*\}\s*;?\s*:/,
  />\s*\/dev\/sd[a-z]/,
  /chmod\s+(-[a-zA-Z]*\s+)*777\s+\//,
  /curl\s.*\|\s*(ba)?sh/,
  /wget\s.*\|\s*(ba)?sh/
];
function extractBinary(segment) {
  const stripped = segment.replace(/^\s*(?:\w+=\S*\s+)*/, "");
  return stripped.split(/\s/)[0]?.replace(/^.*\//, "") ?? "";
}
function isCommandBlocked(command, allowedCommands) {
  const trimmed = command.trim();
  if (!trimmed) return { blocked: true, reason: "Empty command" };
  if (allowedCommands.length > 0) {
    const segments = trimmed.split(/\s*(?:&&|\|\||[;|])\s*/);
    for (const seg of segments) {
      const binary = extractBinary(seg);
      if (!binary) continue;
      if (SHELL_BUILTINS.has(binary)) continue;
      if (!allowedCommands.includes(binary)) {
        return { blocked: true, reason: `Command '${binary}' not in allowedCommands whitelist` };
      }
    }
  }
  for (const pattern of BLOCKED_COMMAND_PATTERNS) {
    if (pattern.test(trimmed)) {
      return { blocked: true, reason: `Command matches blocked pattern: ${pattern.source}` };
    }
  }
  return { blocked: false };
}

// src/framework/core/tools/edit.ts
var EditTool = class {
  constructor(workspaceDir, canRead = true, canWrite = true) {
    this.workspaceDir = workspaceDir;
    this.canRead = canRead;
    this.canWrite = canWrite;
  }
  workspaceDir;
  canRead;
  canWrite;
  name = "edit";
  description = "Edit a file. For partial edit: provide path, old_string, new_string. For full replace: provide path, content.";
  parameters = {
    type: "object",
    properties: {
      path: { type: "string", description: "File path to edit" },
      old_string: { type: "string", description: "Exact text to find and replace" },
      new_string: { type: "string", description: "Replacement text" },
      content: { type: "string", description: "Full file content (for full replace mode)" }
    },
    required: ["path"]
  };
  validate(args) {
    if (!this.canRead || !this.canWrite) return "File system read/write is disabled by permissions";
    const p3 = typeof args?.path === "string" ? args.path.trim() : "";
    if (!p3) return "Missing parameter: path";
    const resolved = resolvePathInWorkspace(p3, this.workspaceDir);
    if (!resolved) return "Path is outside workspace or invalid";
    return null;
  }
  async execute(args) {
    const validationError = this.validate(args);
    if (validationError) return { success: false, error: validationError };
    const p3 = args.path.trim();
    const resolved = resolvePathInWorkspace(p3, this.workspaceDir);
    const oldStr = typeof args?.old_string === "string" ? args.old_string : void 0;
    const newStr = typeof args?.new_string === "string" ? args.new_string : void 0;
    try {
      if (oldStr !== void 0 && newStr !== void 0) {
        const existing = await readFile(resolved, "utf-8");
        const idx = existing.indexOf(oldStr);
        if (idx === -1) return { success: false, error: "old_string not found in file" };
        const lastIdx = existing.lastIndexOf(oldStr);
        if (lastIdx !== idx) {
          return {
            success: false,
            error: "old_string matches multiple locations; provide more context to make it unique"
          };
        }
        const updated = existing.slice(0, idx) + newStr + existing.slice(idx + oldStr.length);
        await writeFile(resolved, updated, "utf-8");
        return { success: true, path: resolved, mode: "partial" };
      }
      const content = args?.content != null ? String(args.content) : "";
      await writeFile(resolved, content, "utf-8");
      return { success: true, path: resolved, mode: "full" };
    } catch (err) {
      return { success: false, error: toErrorMessage(err) };
    }
  }
};
var ExecTool = class _ExecTool {
  constructor(workspaceDir, options) {
    this.workspaceDir = workspaceDir;
    this.options = options;
  }
  workspaceDir;
  options;
  name = "exec";
  description = "Run a shell command. Parameters: command (required), cwd (optional).";
  parameters = {
    type: "object",
    properties: {
      command: { type: "string", description: "Shell command to run" },
      cwd: { type: "string", description: "Working directory" }
    },
    required: ["command"]
  };
  logger = new Logger("ExecTool");
  validate(args) {
    const command = this.extractCommand(args);
    if (!command) return "Missing parameter: command";
    const check = isCommandBlocked(command, this.options.allowedCommands);
    if (check.blocked) return `Command blocked: ${check.reason}`;
    return null;
  }
  async execute(args) {
    const command = this.extractCommand(args);
    if (!command) return { success: false, error: "Missing parameter: command" };
    const check = isCommandBlocked(command, this.options.allowedCommands);
    if (check.blocked) {
      this.logger.warn("Blocked exec command", { command: command.slice(0, 100), reason: check.reason });
      return { success: false, error: `Command blocked: ${check.reason}` };
    }
    const rawCwd = typeof args?.cwd === "string" ? args.cwd.trim() : void 0;
    const cwd = this.validateCwd(rawCwd);
    if (cwd === false) {
      return { success: false, error: `cwd '${rawCwd}' is outside the workspace directory` };
    }
    if (this.options.dockerSandbox?.enabled) {
      return this.runInDocker(command, cwd ?? void 0);
    }
    return this.runCommand(command, cwd ?? void 0);
  }
  /**
   * Returns resolved cwd if valid, null if no cwd given, false if path escapes workspace.
   */
  validateCwd(rawCwd) {
    if (!rawCwd) return null;
    if (!this.workspaceDir) return rawCwd;
    const resolved = resolvePathInWorkspace(rawCwd, this.workspaceDir);
    if (!resolved) {
      this.logger.warn("cwd rejected: outside workspace", { cwd: rawCwd, workspace: this.workspaceDir });
      return false;
    }
    return resolved;
  }
  static COMMAND_KEYS = ["command", "cmd", "shell", "script"];
  extractCommand(args) {
    for (const key of _ExecTool.COMMAND_KEYS) {
      if (typeof args?.[key] === "string" && args[key].trim()) {
        return args[key].trim();
      }
    }
    return "";
  }
  async runCommand(command, cwd) {
    const workDir = cwd ?? this.workspaceDir ?? process.cwd();
    try {
      await mkdir(workDir, { recursive: true });
    } catch (e) {
      if (cwd) {
        const fallbackDir = this.workspaceDir ?? process.cwd();
        this.logger.warn("Provided cwd not usable, falling back", {
          cwd,
          fallbackDir,
          error: toErrorMessage(e)
        });
        return this.runCommand(command, fallbackDir);
      }
      throw e;
    }
    const { timeoutMs, useLoginShell } = this.options;
    const env = process.env;
    try {
      if (useLoginShell && process.platform !== "win32") {
        const loginShell = process.env.SHELL ?? (process.platform === "darwin" ? "/bin/zsh" : "/bin/bash");
        const shellName = path.basename(loginShell);
        const sourceRc = shellName === "zsh" ? "source ~/.zshrc 2>/dev/null; source ~/.zprofile 2>/dev/null; " : shellName === "bash" ? "source ~/.bashrc 2>/dev/null; source ~/.bash_profile 2>/dev/null; " : "";
        const result2 = await execa(loginShell, ["-l", "-c", `${sourceRc}${command}`], {
          cwd: workDir,
          timeout: timeoutMs,
          env,
          reject: false
        });
        if (result2.failed) {
          return {
            success: false,
            error: result2.stderr || result2.message || "Command failed",
            stderr: result2.stderr ?? ""
          };
        }
        return { success: true, stdout: (result2.stdout ?? "").trim(), stderr: (result2.stderr ?? "").trim() };
      }
      const isWin = process.platform === "win32";
      const result = isWin ? await execa("cmd.exe", ["/d", "/s", "/c", command], {
        cwd: workDir,
        timeout: timeoutMs,
        env,
        reject: false
      }) : await execa("sh", ["-c", command], { cwd: workDir, timeout: timeoutMs, env, reject: false });
      if (result.failed) {
        return {
          success: false,
          error: result.stderr || result.message || "Command failed",
          stderr: result.stderr ?? ""
        };
      }
      return { success: true, stdout: (result.stdout ?? "").trim(), stderr: (result.stderr ?? "").trim() };
    } catch (err) {
      const e = err;
      const stderr = typeof e.stderr === "string" ? e.stderr : "";
      return { success: false, error: toErrorMessage(err), stderr };
    }
  }
  async runInDocker(command, cwd) {
    const sandbox = this.options.dockerSandbox;
    const image = sandbox.image ?? "node:22-slim";
    const memLimit = sandbox.memoryLimit ?? "256m";
    const workDir = cwd ?? this.workspaceDir ?? "/workspace";
    const { timeoutMs } = this.options;
    const dockerArgs = [
      "run",
      "--rm",
      "--memory",
      memLimit,
      "--cpus",
      "1",
      "-v",
      `${this.workspaceDir}:/workspace:rw`,
      "-w",
      workDir.startsWith(this.workspaceDir) ? workDir.replace(this.workspaceDir, "/workspace") : "/workspace"
    ];
    if (sandbox.networkDisabled) {
      dockerArgs.push("--network", "none");
    }
    dockerArgs.push(
      "--pids-limit",
      "256",
      "--read-only",
      "--tmpfs",
      "/tmp:rw,exec,size=128m",
      image,
      "sh",
      "-c",
      command
    );
    try {
      const result = await execa("docker", dockerArgs, {
        timeout: timeoutMs,
        reject: false,
        env: process.env
      });
      if (result.failed) {
        return {
          success: false,
          error: result.stderr || result.message || "Docker command failed",
          stderr: result.stderr ?? ""
        };
      }
      return { success: true, stdout: (result.stdout ?? "").trim(), stderr: (result.stderr ?? "").trim() };
    } catch (err) {
      const e = err;
      if (e.message?.includes("Cannot connect to the Docker daemon") || e.message?.includes("docker: not found")) {
        this.logger.warn("Docker not available, falling back to direct execution");
        return this.runCommand(command, cwd);
      }
      const stderr = typeof e.stderr === "string" ? e.stderr : "";
      return { success: false, error: toErrorMessage(err), stderr };
    }
  }
};
var GrepTool = class {
  constructor(workspaceDir) {
    this.workspaceDir = workspaceDir;
  }
  workspaceDir;
  name = "grep";
  description = 'Search file contents by regex pattern. Parameters: pattern (required), path (optional, defaults to workspace), include (optional glob, e.g. "*.ts"), ignore_case (optional boolean).';
  parameters = {
    type: "object",
    properties: {
      pattern: { type: "string", description: "Regex pattern to search for" },
      path: { type: "string", description: "Directory or file to search in (relative to workspace)" },
      include: { type: "string", description: 'Glob filter (e.g. "*.ts", "*.py")' },
      ignore_case: { type: "boolean", description: "Case-insensitive search" },
      max_results: { type: "number", description: "Max results to return (default 50)" }
    },
    required: ["pattern"]
  };
  validate(args) {
    const pattern = typeof args?.pattern === "string" ? args.pattern.trim() : "";
    if (!pattern) return "Missing parameter: pattern";
    return null;
  }
  async execute(args) {
    const err = this.validate(args);
    if (err) return { success: false, error: err };
    const pattern = args.pattern.trim();
    const searchPath = typeof args.path === "string" && args.path.trim() ? resolvePathInWorkspace(args.path.trim(), this.workspaceDir) ?? this.workspaceDir : this.workspaceDir;
    const include = typeof args.include === "string" ? args.include.trim() : "";
    const ignoreCase = args.ignore_case === true;
    const maxResults = typeof args.max_results === "number" ? args.max_results : 50;
    const rgArgs = this.buildRgArgs(pattern, searchPath, include, ignoreCase, maxResults);
    try {
      const result = await execa("rg", rgArgs, {
        cwd: this.workspaceDir,
        timeout: 15e3,
        reject: false
      });
      if (result.exitCode === 0 || result.exitCode === 1) {
        const output = (result.stdout ?? "").trim();
        const lines = output.split("\n").filter(Boolean);
        return {
          success: true,
          matches: lines.length,
          output: output.slice(0, 32e3),
          truncated: output.length > 32e3
        };
      }
      return await this.fallbackGrep(pattern, searchPath, include, ignoreCase, maxResults);
    } catch {
      return this.fallbackGrep(pattern, searchPath, include, ignoreCase, maxResults);
    }
  }
  buildRgArgs(pattern, path4, include, ignoreCase, maxResults) {
    const args = [
      "--line-number",
      "--no-heading",
      "--color",
      "never",
      "--max-count",
      String(maxResults)
    ];
    if (ignoreCase) args.push("--ignore-case");
    if (include) args.push("--glob", include);
    args.push("--", pattern, path4);
    return args;
  }
  async fallbackGrep(pattern, path4, include, ignoreCase, maxResults) {
    try {
      const grepArgs = ["-r", "-n", "--color=never"];
      if (ignoreCase) grepArgs.push("-i");
      if (include) grepArgs.push("--include", include);
      grepArgs.push("-m", String(maxResults));
      grepArgs.push("--", pattern, path4);
      const result = await execa("grep", grepArgs, {
        cwd: this.workspaceDir,
        timeout: 15e3,
        reject: false
      });
      const output = (result.stdout ?? "").trim();
      const lines = output.split("\n").filter(Boolean);
      return {
        success: true,
        matches: lines.length,
        output: output.slice(0, 32e3),
        truncated: output.length > 32e3
      };
    } catch (err) {
      return { success: false, error: `Search failed: ${toErrorMessage(err)}` };
    }
  }
};
var MAX_OUTPUT_LINES = 500;
var MAX_PROCESSES = 20;
var ProcessManager = class {
  processes = /* @__PURE__ */ new Map();
  logger = new Logger("ProcessManager");
  idCounter = 0;
  spawn(command, cwd, timeoutMs) {
    if (this.processes.size >= MAX_PROCESSES) {
      this.cleanup();
      if (this.processes.size >= MAX_PROCESSES) {
        throw new Error(`Max background processes (${MAX_PROCESSES}) reached. Kill some first.`);
      }
    }
    const id = `bg-${++this.idCounter}`;
    const proc = execa("sh", ["-c", command], {
      cwd,
      timeout: timeoutMs,
      reject: false,
      env: process.env
    });
    const entry = {
      id,
      command: command.slice(0, 200),
      pid: void 0,
      startedAt: Date.now(),
      cwd,
      output: [],
      exitCode: null,
      finished: false,
      process: proc
    };
    if (proc.pid) entry.pid = proc.pid;
    proc.stdout?.on("data", (data) => {
      const lines = data.toString().split("\n");
      for (const line of lines) {
        if (entry.output.length < MAX_OUTPUT_LINES) entry.output.push(line);
      }
    });
    proc.stderr?.on("data", (data) => {
      const lines = data.toString().split("\n");
      for (const line of lines) {
        if (entry.output.length < MAX_OUTPUT_LINES) entry.output.push(`[stderr] ${line}`);
      }
    });
    proc.then((result) => {
      entry.finished = true;
      entry.exitCode = result.exitCode ?? null;
    }).catch(() => {
      entry.finished = true;
    });
    this.processes.set(id, entry);
    this.logger.debug("Background process spawned", { id, command: entry.command, pid: entry.pid });
    return entry;
  }
  list() {
    return Array.from(this.processes.values()).map((p3) => ({
      id: p3.id,
      command: p3.command,
      pid: p3.pid,
      running: !p3.finished,
      elapsedMs: Date.now() - p3.startedAt
    }));
  }
  poll(id) {
    const proc = this.processes.get(id);
    if (!proc) return null;
    return {
      output: proc.output.join("\n"),
      finished: proc.finished,
      exitCode: proc.exitCode
    };
  }
  kill(id) {
    const proc = this.processes.get(id);
    if (!proc || proc.finished) return false;
    proc.process.kill("SIGTERM");
    setTimeout(() => {
      if (!proc.finished) proc.process.kill("SIGKILL");
    }, 5e3);
    return true;
  }
  writeStdin(id, input) {
    const proc = this.processes.get(id);
    if (!proc || proc.finished) return false;
    proc.process.stdin?.write(input);
    return true;
  }
  remove(id) {
    const proc = this.processes.get(id);
    if (!proc) return false;
    if (!proc.finished) this.kill(id);
    this.processes.delete(id);
    return true;
  }
  cleanup() {
    for (const [id, proc] of this.processes) {
      if (proc.finished && Date.now() - proc.startedAt > 5 * 6e4) {
        this.processes.delete(id);
      }
    }
  }
};
var ProcessTool = class {
  constructor(workspaceDir, timeoutMs = 3e5, processManager) {
    this.workspaceDir = workspaceDir;
    this.timeoutMs = timeoutMs;
    if (processManager) {
      this.processManager = processManager;
    }
  }
  workspaceDir;
  timeoutMs;
  name = "process";
  description = "Manage background processes. Actions: spawn (run command in background), list, poll (get output), kill, write (stdin), remove.";
  parameters = {
    type: "object",
    properties: {
      action: {
        type: "string",
        enum: ["spawn", "list", "poll", "kill", "write", "remove"],
        description: "Action to perform"
      },
      command: { type: "string", description: "Shell command (for spawn)" },
      id: { type: "string", description: "Process ID (for poll/kill/write/remove)" },
      input: { type: "string", description: "Text to write to stdin (for write)" },
      cwd: { type: "string", description: "Working directory (for spawn)" }
    },
    required: ["action"]
  };
  processManager = null;
  getManager() {
    if (!this.processManager) {
      this.processManager = new ProcessManager();
    }
    return this.processManager;
  }
  validate(args) {
    const action = typeof args?.action === "string" ? args.action : "";
    if (!action) return "Missing parameter: action";
    const valid = ["spawn", "list", "poll", "kill", "write", "remove"];
    if (!valid.includes(action)) return `Unknown action: ${action}. Use: ${valid.join(", ")}`;
    return null;
  }
  async execute(args) {
    const err = this.validate(args);
    if (err) return { success: false, error: err };
    const action = args.action;
    const manager = this.getManager();
    switch (action) {
      case "spawn": {
        const command = typeof args.command === "string" ? args.command.trim() : "";
        if (!command) return { success: false, error: "Missing parameter: command" };
        const cwd = typeof args.cwd === "string" ? args.cwd : this.workspaceDir;
        try {
          const proc = manager.spawn(command, cwd, this.timeoutMs);
          return { success: true, id: proc.id, pid: proc.pid, command: proc.command };
        } catch (err2) {
          return { success: false, error: toErrorMessage(err2) };
        }
      }
      case "list":
        return { success: true, processes: manager.list() };
      case "poll": {
        const id = typeof args.id === "string" ? args.id : "";
        if (!id) return { success: false, error: "Missing parameter: id" };
        const result = manager.poll(id);
        if (!result) return { success: false, error: `Process not found: ${id}` };
        return { success: true, ...result };
      }
      case "kill": {
        const id = typeof args.id === "string" ? args.id : "";
        if (!id) return { success: false, error: "Missing parameter: id" };
        const killed = manager.kill(id);
        return { success: killed, message: killed ? "Process killed" : "Process not found or already finished" };
      }
      case "write": {
        const id = typeof args.id === "string" ? args.id : "";
        const input = typeof args.input === "string" ? args.input : "";
        if (!id) return { success: false, error: "Missing parameter: id" };
        const ok3 = manager.writeStdin(id, input);
        return { success: ok3, message: ok3 ? "Written to stdin" : "Process not found or finished" };
      }
      case "remove": {
        const id = typeof args.id === "string" ? args.id : "";
        if (!id) return { success: false, error: "Missing parameter: id" };
        const removed = manager.remove(id);
        return { success: removed, message: removed ? "Process removed" : "Process not found" };
      }
      default:
        return { success: false, error: `Unknown action: ${action}. Use: spawn, list, poll, kill, write, remove` };
    }
  }
};
var ReadTool = class {
  constructor(workspaceDir, canRead = true) {
    this.workspaceDir = workspaceDir;
    this.canRead = canRead;
  }
  workspaceDir;
  canRead;
  name = "read";
  description = "Read file contents from workspace. Parameters: path (relative to workspace).";
  parameters = {
    type: "object",
    properties: {
      path: { type: "string", description: "File path relative to workspace" }
    },
    required: ["path"]
  };
  validate(args) {
    if (!this.canRead) return "File system read is disabled by permissions";
    const p3 = typeof args?.path === "string" ? args.path.trim() : "";
    if (!p3) return "Missing parameter: path";
    const resolved = resolvePathInWorkspace(p3, this.workspaceDir);
    if (!resolved) return "Path is outside workspace or invalid";
    return null;
  }
  async execute(args) {
    const validationError = this.validate(args);
    if (validationError) return { success: false, error: validationError };
    const p3 = args.path.trim();
    const resolved = resolvePathInWorkspace(p3, this.workspaceDir);
    try {
      const content = await readFile(resolved, "utf-8");
      return { success: true, content };
    } catch (err) {
      const e = err;
      if (e.code === "ENOENT") return { success: false, error: `File not found: ${p3}` };
      if (e.code === "EACCES") return { success: false, error: `Permission denied: ${p3}` };
      return { success: false, error: e.message ?? String(err) };
    }
  }
};

// src/framework/core/tools/skill-tools.ts
function minimalContext() {
  return {
    sessionKey: "",
    sessionId: "",
    userId: "",
    channel: "",
    workspaceDir: process.cwd(),
    startTime: Date.now(),
    lastActivity: Date.now(),
    metadata: {}
  };
}
function toSkillEntry(s, includeContent = false) {
  const entry = {
    name: s.id,
    description: s.description,
    executable: !!s.runScript
  };
  if (s.runScript) entry.runScript = s.runScript;
  if (s.skillDir) entry.skillDir = s.skillDir;
  if (s.childSkills?.length) entry.childSkills = s.childSkills;
  if (includeContent) entry.content = s.content;
  return entry;
}
var ListSkillsTool = class {
  constructor(provider) {
    this.provider = provider;
  }
  provider;
  name = "list_skills";
  description = "List all available skills with name, description, and whether they are executable. No parameters required.";
  parameters = { type: "object", properties: {} };
  async execute() {
    const all = await this.provider.listSkills();
    return {
      success: true,
      count: all.length,
      skills: all.map((s) => toSkillEntry(s))
    };
  }
};
var GetSkillTool = class {
  constructor(provider) {
    this.provider = provider;
  }
  provider;
  name = "get_skill";
  description = "Get a skill document by name, including its full content. Parameters: name (skill name).";
  parameters = {
    type: "object",
    properties: { name: { type: "string", description: "Skill name to fetch" } },
    required: ["name"]
  };
  validate(args) {
    return typeof args?.name === "string" && args.name.trim() ? null : "Missing parameter: name";
  }
  async execute(args, context) {
    const name = args.name.trim();
    if (!name) return { success: false, error: "Missing parameter: name" };
    const all = await this.provider.listSkills();
    const exact = all.find((s) => s.id === name);
    if (exact) return { success: true, ...toSkillEntry(exact, true) };
    const ctx = context ?? minimalContext();
    const results = await this.provider.resolve(name, ctx, { maxSkills: 1 });
    const hit = results[0];
    if (hit) return { success: true, ...toSkillEntry(hit.skill, true) };
    return {
      success: false,
      error: `Skill not found: ${name}`,
      available: all.slice(0, 20).map((s) => s.id)
    };
  }
};
var SearchSkillsTool = class {
  constructor(provider) {
    this.provider = provider;
  }
  provider;
  name = "search_skills";
  description = "Search skills by query and return relevant skill contents. Parameters: query, limit (optional, default 5).";
  parameters = {
    type: "object",
    properties: {
      query: { type: "string", description: "Search query for skills" },
      limit: { type: "number", description: "Max results (default 5)" }
    },
    required: ["query"]
  };
  validate(args) {
    return typeof args?.query === "string" && args.query.trim() ? null : "Missing parameter: query";
  }
  async execute(args, context) {
    const query = args.query.trim();
    if (!query) return { success: false, error: "Missing parameter: query" };
    const limit = typeof args?.limit === "number" ? Math.min(20, Math.max(1, args.limit)) : 5;
    const ctx = context ?? minimalContext();
    const results = await this.provider.resolve(query, ctx, { maxSkills: limit });
    return {
      success: true,
      count: results.length,
      skills: results.map((r) => toSkillEntry(r.skill, true))
    };
  }
};
function createSkillTools(provider) {
  return [new ListSkillsTool(provider), new GetSkillTool(provider), new SearchSkillsTool(provider)];
}

// src/framework/core/tools/stub.ts
var StubTool = class {
  constructor(name, description, errorMessage) {
    this.name = name;
    this.description = description;
    this.errorMessage = errorMessage;
  }
  name;
  description;
  errorMessage;
  parameters = { type: "object", properties: {}, additionalProperties: true };
  async execute() {
    return { success: false, error: this.errorMessage };
  }
};
var webSearchStub = new StubTool(
  "web_search",
  "Search the web. Not configured by default; use config or an extension.",
  "web_search is not configured. Add a search provider in config or use an HTTP/MCP extension."
);
var sendStub = new StubTool(
  "send",
  "Send a message via configured channel. Requires channels config.",
  "Messaging (send) is not configured. Configure channels or use an extension."
);
var channelsStub = new StubTool(
  "channels",
  "List or use channels. Requires channels config.",
  "Channels are not configured. Configure channels in config."
);

// src/framework/core/tools/web-fetch.ts
var RESULT_MAX_CHARS = 1e5;
var DEFAULT_TIMEOUT_MS = 3e4;
var ALLOWED_METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD"];
var WebFetchTool = class {
  constructor(canNetwork = true, timeoutMs = DEFAULT_TIMEOUT_MS) {
    this.canNetwork = canNetwork;
    this.timeoutMs = timeoutMs;
  }
  canNetwork;
  timeoutMs;
  name = "web_fetch";
  description = 'Fetch a URL via HTTP(S). Supports all common methods (GET/POST/PUT/PATCH/DELETE/HEAD), custom headers, and request bodies. HTML responses are automatically converted to readable text. JSON responses are returned parsed. Parameters: url (required), method (optional, default GET), headers (optional object), body (optional string or object \u2014 objects are JSON-serialized), output_format (optional: "text" | "json" | "html" | "auto", default "auto").';
  parameters = {
    type: "object",
    properties: {
      url: { type: "string", description: "URL to fetch (http or https)" },
      method: { type: "string", enum: ALLOWED_METHODS, description: "HTTP method (default GET)" },
      headers: { type: "object", description: "Custom request headers as key-value pairs" },
      body: { description: "Request body \u2014 string sent as-is, object JSON-serialized" },
      output_format: {
        type: "string",
        enum: ["text", "json", "html", "auto"],
        description: 'Force output format. "auto" detects from Content-Type (default)'
      }
    },
    required: ["url"]
  };
  validate(args) {
    if (!this.canNetwork) return "Network access is disabled by permissions";
    const url2 = typeof args?.url === "string" ? args.url.trim() : "";
    if (!url2) return "Missing required parameter: url";
    if (!/^https?:\/\//i.test(url2)) return "Only http and https URLs are allowed";
    if (args.method !== void 0) {
      const m = String(args.method).toUpperCase();
      if (!ALLOWED_METHODS.includes(m)) {
        return `Invalid method "${args.method}". Allowed: ${ALLOWED_METHODS.join(", ")}`;
      }
    }
    if (args.headers !== void 0 && (typeof args.headers !== "object" || Array.isArray(args.headers))) {
      return "headers must be a plain object of key-value pairs";
    }
    return null;
  }
  async execute(args) {
    const err = this.validate(args);
    if (err) return { success: false, error: err };
    const url2 = args.url.trim();
    const method = args.method ? String(args.method).toUpperCase() : "GET";
    const customHeaders = args.headers ?? {};
    const outputFormat = typeof args.output_format === "string" ? args.output_format : "auto";
    const headers = {
      "User-Agent": "NovaClaw/1.0",
      Accept: "text/html,application/json,application/xml;q=0.9,*/*;q=0.8",
      ...customHeaders
    };
    let body;
    if (args.body !== void 0 && method !== "GET" && method !== "HEAD") {
      if (typeof args.body === "string") {
        body = args.body;
      } else {
        body = JSON.stringify(args.body);
        if (!headers["Content-Type"] && !headers["content-type"]) {
          headers["Content-Type"] = "application/json";
        }
      }
    }
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.timeoutMs);
      const res = await fetch(url2, {
        method,
        headers,
        body,
        signal: controller.signal,
        redirect: "follow"
      });
      clearTimeout(timer);
      if (method === "HEAD") {
        return {
          success: true,
          status: res.status,
          ok: res.ok,
          headers: extractHeaders(res)
        };
      }
      const contentType = res.headers.get("content-type") ?? "";
      const format = outputFormat === "auto" ? detectFormat(contentType) : outputFormat;
      const raw = await res.text();
      let content;
      if (format === "json") {
        try {
          content = JSON.parse(raw);
        } catch {
          content = raw.slice(0, RESULT_MAX_CHARS);
        }
      } else if (format === "html" || format === "text") {
        content = htmlToReadableText(raw).slice(0, RESULT_MAX_CHARS);
      } else {
        content = raw.slice(0, RESULT_MAX_CHARS);
      }
      return {
        success: true,
        status: res.status,
        ok: res.ok,
        url: res.url,
        content_type: contentType,
        content
      };
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      if (msg.includes("abort")) {
        return { success: false, error: `Request timed out after ${this.timeoutMs}ms` };
      }
      return { success: false, error: msg };
    }
  }
};
function detectFormat(contentType) {
  const ct = contentType.toLowerCase();
  if (ct.includes("application/json") || ct.includes("+json")) return "json";
  if (ct.includes("text/html") || ct.includes("application/xhtml")) return "html";
  return "text";
}
function extractHeaders(res) {
  const h = {};
  res.headers.forEach((v, k) => {
    h[k] = v;
  });
  return h;
}
var BLOCK_STRIP_TAGS = /< *(script|style|noscript|svg|iframe)[^>]*>[\s\S]*?<\/ *\1 *>/gi;
var TAG_HEADING = /< *(h[1-6])[^>]*>([\s\S]*?)<\/ *\1 *>/gi;
var TAG_A = /< *a[^>]+href *= *["']([^"']*)["'][^>]*>([\s\S]*?)<\/ *a *>/gi;
var TAG_LI = /< *li[^>]*>([\s\S]*?)<\/ *li *>/gi;
var TAG_IMG = /< *img[^>]+alt *= *["']([^"']*)["'][^>]* *\/?>/gi;
var TAG_BR = /< *br\s*\/?>/gi;
var TAG_BLOCK = /< *\/?(p|div|tr|section|article|main|blockquote|pre|ul|ol|dl|dt|dd|table|thead|tbody|tfoot|figcaption|figure)[^>]*>/gi;
var TAG_TD = /< *\/?(td|th)[^>]*>/gi;
var TAG_ANY = /<[^>]+>/g;
var ENTITY_MAP = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#39;": "'",
  "&apos;": "'",
  "&nbsp;": " ",
  "&#x2F;": "/",
  "&ndash;": "\u2013",
  "&mdash;": "\u2014",
  "&hellip;": "\u2026",
  "&laquo;": "\xAB",
  "&raquo;": "\xBB",
  "&copy;": "\xA9"
};
var ENTITY_RE = new RegExp(Object.keys(ENTITY_MAP).join("|") + "|&#(\\d+);|&#x([0-9a-fA-F]+);", "gi");
function decodeEntities(s) {
  return s.replace(ENTITY_RE, (match, dec, hex2) => {
    if (dec) return String.fromCharCode(Number(dec));
    if (hex2) return String.fromCharCode(parseInt(hex2, 16));
    return ENTITY_MAP[match.toLowerCase()] ?? match;
  });
}
function htmlToReadableText(html) {
  let t3 = html;
  t3 = t3.replace(BLOCK_STRIP_TAGS, "");
  t3 = t3.replace(TAG_HEADING, (_, level, inner) => {
    const prefix = "#".repeat(Number(level[1]));
    return `

${prefix} ${inner.replace(TAG_ANY, "").trim()}

`;
  });
  t3 = t3.replace(TAG_A, (_, href, inner) => {
    const text2 = inner.replace(TAG_ANY, "").trim();
    if (!text2) return "";
    if (!href || href.startsWith("#") || href.startsWith("javascript:")) return text2;
    return `[${text2}](${href})`;
  });
  t3 = t3.replace(TAG_LI, (_, inner) => `
- ${inner.replace(TAG_ANY, "").trim()}`);
  t3 = t3.replace(TAG_IMG, (_, alt) => alt ? `[image: ${alt}]` : "");
  t3 = t3.replace(TAG_BR, "\n");
  t3 = t3.replace(TAG_BLOCK, "\n\n");
  t3 = t3.replace(TAG_TD, " | ");
  t3 = t3.replace(TAG_ANY, "");
  t3 = decodeEntities(t3);
  t3 = t3.replace(/[ \t]+/g, " ");
  t3 = t3.replace(/\n{3,}/g, "\n\n");
  return t3.trim();
}

// src/framework/core/tools/web-search.ts
function normalizeDdgRedirectUrl(href) {
  const trimmed = href.trim();
  if (!trimmed) return trimmed;
  try {
    let u = trimmed;
    if (u.startsWith("//")) u = `https:${u}`;
    const parsed = new URL(u);
    const uddg = parsed.searchParams.get("uddg");
    if (uddg) return decodeURIComponent(uddg);
    return u;
  } catch {
    return trimmed;
  }
}
function mapSerperOrganic(data, max) {
  return (data.organic ?? []).slice(0, max).map((r) => ({
    title: String(r.title ?? ""),
    url: normalizeDdgRedirectUrl(String(r.link ?? "")),
    snippet: String(r.snippet ?? "")
  }));
}
function mapTavilyResults(data, max) {
  return (data.results ?? []).slice(0, max).map((r) => ({
    title: String(r.title ?? ""),
    url: normalizeDdgRedirectUrl(String(r.url ?? "")),
    snippet: String(r.content ?? "").slice(0, 400)
  }));
}
function mapBraveWebResults(data, max) {
  const rows = data.web?.results ?? [];
  return rows.slice(0, max).map((r) => ({
    title: String(r.title ?? ""),
    url: normalizeDdgRedirectUrl(String(r.url ?? "")),
    snippet: String(r.description ?? "").slice(0, 400)
  }));
}
function hitsFromDdgInstantJson(data, maxResults) {
  const out = [];
  if (!data || typeof data !== "object") return out;
  const d = data;
  const abstractUrl = typeof d.AbstractURL === "string" ? d.AbstractURL.trim() : "";
  const abstractText = typeof d.AbstractText === "string" ? d.AbstractText.trim() : "";
  const heading = typeof d.Heading === "string" ? d.Heading.trim() : "";
  const abstractSource = typeof d.AbstractSource === "string" ? d.AbstractSource.trim() : "";
  if (abstractUrl && (abstractText || heading)) {
    out.push({
      title: heading || abstractSource || "Instant answer",
      url: abstractUrl,
      snippet: abstractText.slice(0, 500)
    });
  }
  const walkTopic = (t3) => {
    if (out.length >= maxResults) return;
    const url2 = typeof t3.FirstURL === "string" ? t3.FirstURL.trim() : "";
    const text2 = typeof t3.Text === "string" ? t3.Text.trim() : "";
    if (!url2 || !text2) return;
    const dash = text2.indexOf(" - ");
    const title = dash >= 0 ? text2.slice(0, dash).trim() : text2;
    const snippet = dash >= 0 ? text2.slice(dash + 3).trim() : "";
    out.push({ title: title || url2, url: url2, snippet: snippet.slice(0, 500) });
  };
  const topics = d.RelatedTopics;
  if (!Array.isArray(topics)) return out.slice(0, maxResults);
  for (const item2 of topics) {
    if (out.length >= maxResults) break;
    if (!item2 || typeof item2 !== "object") continue;
    const o = item2;
    if (Array.isArray(o.Topics)) {
      for (const sub of o.Topics) {
        if (out.length >= maxResults) break;
        if (sub && typeof sub === "object") walkTopic(sub);
      }
    } else {
      walkTopic(o);
    }
  }
  return out.slice(0, maxResults);
}
function hitsFromWikipediaOpenSearch(json, maxResults) {
  if (!Array.isArray(json) || json.length < 4) return [];
  const titles = json[1];
  const descs = json[2];
  const urls = json[3];
  if (!Array.isArray(titles) || !Array.isArray(urls)) return [];
  const out = [];
  const n = Math.min(titles.length, urls.length, maxResults);
  for (let i = 0; i < n; i++) {
    const title = String(titles[i] ?? "").trim();
    const url2 = String(urls[i] ?? "").trim();
    const snippet = Array.isArray(descs) ? String(descs[i] ?? "").trim() : "";
    if (!url2) continue;
    out.push({ title: title || url2, url: url2, snippet });
  }
  return out;
}
function hitsFromWikipediaRestPage(json, maxResults, wikiOrigin = "https://en.wikipedia.org") {
  if (!json || typeof json !== "object") return [];
  const pages = json.pages;
  if (!Array.isArray(pages)) return [];
  const out = [];
  for (const p3 of pages) {
    if (out.length >= maxResults) break;
    if (!p3 || typeof p3 !== "object") continue;
    const o = p3;
    const key = typeof o.key === "string" ? o.key.trim() : "";
    const title = typeof o.title === "string" ? o.title.trim() : "";
    if (!key) continue;
    const excerpt = typeof o.excerpt === "string" ? stripHtmlToPlain(o.excerpt) : "";
    const description = typeof o.description === "string" ? String(o.description).trim() : "";
    const snippet = (excerpt || description).slice(0, 500);
    out.push({
      title: title || key.replace(/_/g, " "),
      url: `${wikiOrigin}/wiki/${encodeURIComponent(key)}`,
      snippet
    });
  }
  return out;
}
function stripHtmlToPlain(s) {
  return s.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}
function hitsFromBingRss(xml, maxResults) {
  const results = [];
  if (!xml || xml.length < 40) return results;
  const itemRe = /<item>([\s\S]*?)<\/item>/gi;
  let m;
  while ((m = itemRe.exec(xml)) !== null && results.length < maxResults) {
    const block = m[1] ?? "";
    const title = extractXmlTagBody(block, "title");
    const link = extractXmlTagBody(block, "link");
    const desc = extractXmlTagBody(block, "description");
    if (!link || !title) continue;
    results.push({
      title: stripHtmlToPlain(stripCdataXml(title)),
      url: normalizeDdgRedirectUrl(stripCdataXml(link).trim()),
      snippet: stripHtmlToPlain(stripCdataXml(desc)).slice(0, 400)
    });
  }
  return results;
}
function extractXmlTagBody(block, tag) {
  const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i");
  const mm = re.exec(block);
  const inner = mm?.[1];
  return inner !== void 0 ? inner.trim() : "";
}
function stripCdataXml(s) {
  return s.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/gi, "$1");
}
function mergeHitsOrdered(chunks, maxResults) {
  const seen = /* @__PURE__ */ new Set();
  const merged = [];
  for (const h of chunks) {
    const key = h.url.toLowerCase().replace(/\/$/, "");
    if (!key || seen.has(key)) continue;
    seen.add(key);
    merged.push({
      ...h,
      url: normalizeDdgRedirectUrl(h.url)
    });
    if (merged.length >= maxResults) break;
  }
  return merged;
}
function browserFetchHeaders() {
  return {
    Accept: "application/json, application/rss+xml;q=0.9, text/xml;q=0.8, */*;q=0.7",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
    "Accept-Language": "en-US,en;q=0.9"
  };
}
async function fetchJsonOptional(url2, signal, label) {
  const res = await fetch(url2, { headers: browserFetchHeaders(), signal });
  if (!res.ok) throw new Error(`${label}: HTTP ${res.status}`);
  return readJson(res);
}
async function fetchTextOptional(url2, signal, label) {
  const res = await fetch(url2, { headers: browserFetchHeaders(), signal });
  if (!res.ok) throw new Error(`${label}: HTTP ${res.status}`);
  return res.text();
}
function wikipediaOriginsForQuery(query) {
  const origins = /* @__PURE__ */ new Set(["https://en.wikipedia.org"]);
  if (/[\u4e00-\u9fff\u3400-\u4dbf\uf900-\ufaff]/.test(query)) {
    origins.add("https://zh.wikipedia.org");
  }
  if (/[\u3040-\u30ff]/.test(query)) {
    origins.add("https://ja.wikipedia.org");
  }
  return [...origins];
}
var FreeWebSearchProvider = class {
  id = "free";
  async search(req, signal) {
    const q = req.query;
    const max = req.maxResults;
    const limit = Math.min(max, 15);
    const ddgUrl = new URL("https://api.duckduckgo.com/");
    ddgUrl.searchParams.set("q", q);
    ddgUrl.searchParams.set("format", "json");
    ddgUrl.searchParams.set("no_html", "1");
    ddgUrl.searchParams.set("skip_disambig", "1");
    const bingUrl = new URL("https://www.bing.com/search");
    bingUrl.searchParams.set("q", q);
    bingUrl.searchParams.set("format", "rss");
    bingUrl.searchParams.set("count", String(limit));
    const wikiTasks = [];
    for (const origin of wikipediaOriginsForQuery(q)) {
      const osUrl = new URL(`${origin}/w/api.php`);
      osUrl.searchParams.set("action", "opensearch");
      osUrl.searchParams.set("search", q);
      osUrl.searchParams.set("limit", String(limit));
      osUrl.searchParams.set("namespace", "0");
      osUrl.searchParams.set("format", "json");
      const restUrl = new URL(`${origin}/w/rest.php/v1/search/page`);
      restUrl.searchParams.set("q", q);
      restUrl.searchParams.set("limit", String(limit));
      wikiTasks.push(
        fetchJsonOptional(osUrl.toString(), signal, "wikipedia-opensearch").then((j) => hitsFromWikipediaOpenSearch(j, limit)).catch(() => [])
      );
      wikiTasks.push(
        fetchJsonOptional(restUrl.toString(), signal, "wikipedia-rest").then((j) => hitsFromWikipediaRestPage(j, limit, origin)).catch(() => [])
      );
    }
    const settled = await Promise.allSettled([
      fetchJsonOptional(ddgUrl.toString(), signal, "ddg-instant").then((j) => hitsFromDdgInstantJson(j, max)).catch(() => []),
      ...wikiTasks,
      fetchTextOptional(bingUrl.toString(), signal, "bing-rss").then((xml) => hitsFromBingRss(xml, max)).catch(() => [])
    ]);
    const chunks = [];
    for (const s of settled) {
      if (s.status === "fulfilled" && Array.isArray(s.value)) chunks.push(...s.value);
    }
    return mergeHitsOrdered(chunks, max);
  }
};
function coerceMaxResults(raw, fallback) {
  if (typeof raw === "number" && Number.isFinite(raw)) return clampInt(raw, 1, 20, fallback);
  if (typeof raw === "string" && /^\d+$/.test(raw.trim())) {
    return clampInt(parseInt(raw.trim(), 10), 1, 20, fallback);
  }
  return fallback;
}
function clampInt(n, min, max, fallback) {
  if (!Number.isFinite(n)) return fallback;
  const v = Math.trunc(n);
  return Math.min(max, Math.max(min, v));
}
async function readJson(res) {
  return res.json();
}
var SerperSearchProvider = class {
  constructor(apiKey) {
    this.apiKey = apiKey;
  }
  apiKey;
  id = "serper";
  async search(req, signal) {
    const res = await fetch("https://google.serper.dev/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": this.apiKey
      },
      body: JSON.stringify({ q: req.query, num: req.maxResults }),
      signal
    });
    if (!res.ok) throw new Error(`Serper HTTP ${res.status}`);
    return mapSerperOrganic(await readJson(res), req.maxResults);
  }
};
var TavilySearchProvider = class {
  constructor(apiKey) {
    this.apiKey = apiKey;
  }
  apiKey;
  id = "tavily";
  async search(req, signal) {
    const res = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: this.apiKey,
        query: req.query,
        max_results: req.maxResults,
        search_depth: "basic"
      }),
      signal
    });
    if (!res.ok) throw new Error(`Tavily HTTP ${res.status}`);
    return mapTavilyResults(await readJson(res), req.maxResults);
  }
};
var BraveSearchProvider = class {
  constructor(apiKey) {
    this.apiKey = apiKey;
  }
  apiKey;
  id = "brave";
  async search(req, signal) {
    const url2 = new URL("https://api.search.brave.com/res/v1/web/search");
    url2.searchParams.set("q", req.query);
    url2.searchParams.set("count", String(req.maxResults));
    const res = await fetch(url2.toString(), {
      headers: {
        Accept: "application/json",
        "X-Subscription-Token": this.apiKey
      },
      signal
    });
    if (!res.ok) throw new Error(`Brave Search HTTP ${res.status}`);
    return mapBraveWebResults(await readJson(res), req.maxResults);
  }
};
var CustomSearchUrlProvider = class {
  constructor(apiUrl, bearerToken) {
    this.apiUrl = apiUrl;
    this.bearerToken = bearerToken;
  }
  apiUrl;
  bearerToken;
  id = "custom";
  async search(req, signal) {
    const url2 = new URL(this.apiUrl);
    url2.searchParams.set("q", req.query);
    url2.searchParams.set("max_results", String(req.maxResults));
    const headers = { Accept: "application/json" };
    if (this.bearerToken) headers.Authorization = `Bearer ${this.bearerToken}`;
    const res = await fetch(url2.toString(), { headers, signal });
    if (!res.ok) throw new Error(`Custom search HTTP ${res.status}`);
    const data = await readJson(res);
    return normalizeGenericJsonResults(data, req.maxResults);
  }
};
function normalizeGenericJsonResults(data, max) {
  if (Array.isArray(data)) {
    return data.slice(0, max).map((row) => {
      const o = row;
      return {
        title: String(o.title ?? o.name ?? ""),
        url: normalizeDdgRedirectUrl(String(o.url ?? o.link ?? o.href ?? "")),
        snippet: String(o.snippet ?? o.content ?? o.description ?? "").slice(0, 400)
      };
    });
  }
  if (data && typeof data === "object") {
    const o = data;
    if (Array.isArray(o.results)) return normalizeGenericJsonResults(o.results, max);
    if (Array.isArray(o.organic)) return mapSerperOrganic({ organic: o.organic }, max);
  }
  return [];
}
function normalizeEngine(raw) {
  if (raw === "serper" || raw === "tavily" || raw === "brave" || raw === "custom") return raw;
  return null;
}
function createWebSearchProvider(config) {
  const c = config ?? {};
  if (c.apiUrl?.trim()) {
    return new CustomSearchUrlProvider(c.apiUrl.trim(), c.apiKey?.trim());
  }
  let engine = normalizeEngine(c.engine);
  let apiKey = c.apiKey?.trim();
  if (!engine && !apiKey) {
    if (process.env.SERPER_API_KEY?.trim()) {
      engine = "serper";
      apiKey = process.env.SERPER_API_KEY.trim();
    } else if (process.env.TAVILY_API_KEY?.trim()) {
      engine = "tavily";
      apiKey = process.env.TAVILY_API_KEY.trim();
    } else if (process.env.BRAVE_API_KEY?.trim()) {
      engine = "brave";
      apiKey = process.env.BRAVE_API_KEY.trim();
    }
  } else if (!apiKey && engine) {
    switch (engine) {
      case "serper":
        apiKey = process.env.SERPER_API_KEY?.trim();
        break;
      case "tavily":
        apiKey = process.env.TAVILY_API_KEY?.trim();
        break;
      case "brave":
        apiKey = process.env.BRAVE_API_KEY?.trim();
        break;
    }
  } else if (apiKey && !engine) {
    engine = "serper";
  }
  if (engine && apiKey) {
    switch (engine) {
      case "serper":
        return new SerperSearchProvider(apiKey);
      case "tavily":
        return new TavilySearchProvider(apiKey);
      case "brave":
        return new BraveSearchProvider(apiKey);
    }
  }
  return new FreeWebSearchProvider();
}
var WebSearchTool = class {
  constructor(provider, networkAllowed) {
    this.provider = provider;
    this.networkAllowed = networkAllowed;
  }
  provider;
  networkAllowed;
  name = "web_search";
  description = "Search the web. Parameters: query (required), max_results (optional, default 5). Uses your configured search API if set; otherwise public sources (Wikipedia, DuckDuckGo summaries, Bing RSS).";
  parameters = {
    type: "object",
    properties: {
      query: { type: "string", description: "Search query" },
      max_results: { type: "number", description: "Maximum results to return (default 5)" }
    },
    required: ["query"]
  };
  validate(args) {
    if (!this.networkAllowed) return "Network access is disabled";
    const query = typeof args?.query === "string" ? args.query.trim() : "";
    if (!query) return "Missing parameter: query";
    return null;
  }
  async execute(args, _context, abortSignal) {
    const err = this.validate(args);
    if (err) return { success: false, error: err };
    const rawQuery = args.query.trim();
    const query = rawQuery.length > 499 ? rawQuery.slice(0, 499) : rawQuery;
    const maxResults = coerceMaxResults(args.max_results, 5);
    const timeout = AbortSignal.timeout(2e4);
    const signal = abortSignal ? AbortSignal.any([abortSignal, timeout]) : timeout;
    try {
      const results = await this.provider.search({ query, maxResults }, signal);
      if (results.length === 0) {
        return {
          success: true,
          results: [],
          message: "Search returned no results for this query."
        };
      }
      return { success: true, results };
    } catch (e) {
      return {
        success: false,
        error: `${this.provider.id} search failed: ${toErrorMessage(e)}`
      };
    }
  }
};

// src/framework/core/tools/tool-policy-pipeline.ts
var DEFAULT_POLICY = {
  securityLevel: "full",
  allowlist: [],
  denylist: [],
  requireApprovalFor: []
};
var ToolPolicyPipeline = class {
  logger;
  policy;
  beforeHooks = [];
  afterHooks = [];
  constructor(policy) {
    this.policy = { ...DEFAULT_POLICY, ...policy };
    this.logger = new Logger("ToolPolicy");
  }
  registerBeforeHook(hook) {
    this.beforeHooks.push(hook);
  }
  registerAfterHook(hook) {
    this.afterHooks.push(hook);
  }
  updatePolicy(patch) {
    Object.assign(this.policy, patch);
  }
  getPolicy() {
    return this.policy;
  }
  async execute(tool, args, context, abortSignal) {
    const startTime = performance.now();
    const toolName = tool.name;
    if (abortSignal?.aborted) {
      return { success: false, error: "Execution aborted by user" };
    }
    let currentArgs = { ...args };
    for (const hook of this.beforeHooks) {
      try {
        const hookResult = await hook({ toolName, args: currentArgs, context });
        if (hookResult?.blocked) {
          this.logger.debug("Tool blocked by before hook", { tool: toolName, reason: hookResult.reason });
          return { success: false, error: hookResult.reason ?? "Blocked by policy hook" };
        }
        if (hookResult?.patchedArgs) {
          currentArgs = hookResult.patchedArgs;
        }
      } catch (err) {
        this.logger.warn("before_tool_call hook error", { tool: toolName, error: toErrorMessage(err) });
      }
    }
    const policyResult = this.evaluatePolicy(toolName);
    if (!policyResult.allowed) {
      this.logger.debug("Tool denied by policy", { tool: toolName, reason: policyResult.reason });
      return { success: false, error: policyResult.reason ?? "Tool not allowed" };
    }
    if (this.policy.requireApprovalFor.includes(toolName) && this.policy.approvalCallback) {
      try {
        const approved = await this.policy.approvalCallback(toolName, currentArgs);
        if (!approved) {
          return { success: false, error: `Execution of '${toolName}' was not approved` };
        }
      } catch (err) {
        return { success: false, error: `Approval check failed: ${toErrorMessage(err)}` };
      }
    }
    let result;
    try {
      result = await tool.execute(currentArgs, context, abortSignal);
    } catch (err) {
      result = { success: false, error: toErrorMessage(err) };
    }
    const durationMs = performance.now() - startTime;
    for (const hook of this.afterHooks) {
      try {
        await hook({ toolName, args: currentArgs, result, durationMs, context });
      } catch (err) {
        this.logger.warn("after_tool_call hook error", { tool: toolName, error: toErrorMessage(err) });
      }
    }
    return result;
  }
  evaluatePolicy(toolName) {
    if (this.policy.denylist.includes(toolName)) {
      return { allowed: false, reason: `Tool '${toolName}' is in denylist` };
    }
    switch (this.policy.securityLevel) {
      case "deny":
        return { allowed: false, reason: "All tools are denied by security policy" };
      case "allowlist":
        if (this.policy.allowlist.length === 0) {
          return { allowed: false, reason: "Allowlist is empty; no tools permitted" };
        }
        if (!this.matchesAllowlist(toolName)) {
          return { allowed: false, reason: `Tool '${toolName}' is not in allowlist` };
        }
        return { allowed: true };
      case "full":
      default:
        return { allowed: true };
    }
  }
  matchesAllowlist(toolName) {
    for (const pattern of this.policy.allowlist) {
      if (pattern === "*") return true;
      if (pattern === toolName) return true;
      if (pattern.endsWith("*") && toolName.startsWith(pattern.slice(0, -1))) return true;
    }
    return false;
  }
};
var WriteTool = class {
  constructor(workspaceDir, canWrite = true) {
    this.workspaceDir = workspaceDir;
    this.canWrite = canWrite;
  }
  workspaceDir;
  canWrite;
  name = "write";
  description = "Write content to a file in workspace. Parameters: path, content.";
  parameters = {
    type: "object",
    properties: {
      path: { type: "string", description: "File path relative to workspace" },
      content: { type: "string", description: "Content to write" }
    },
    required: ["path", "content"]
  };
  validate(args) {
    if (!this.canWrite) return "File system write is disabled by permissions";
    const p3 = typeof args?.path === "string" ? args.path.trim() : "";
    if (!p3) return "Missing parameter: path";
    const resolved = resolvePathInWorkspace(p3, this.workspaceDir);
    if (!resolved) return "Path is outside workspace or invalid";
    return null;
  }
  async execute(args) {
    const validationError = this.validate(args);
    if (validationError) return { success: false, error: validationError };
    const p3 = args.path.trim();
    const content = args?.content != null ? String(args.content) : "";
    const resolved = resolvePathInWorkspace(p3, this.workspaceDir);
    try {
      await mkdir(path.dirname(resolved), { recursive: true });
      await writeFile(resolved, content, "utf-8");
      return { success: true, path: resolved };
    } catch (err) {
      const e = err;
      if (e.code === "EACCES") return { success: false, error: `Permission denied: ${p3}` };
      return { success: false, error: e.message ?? String(err) };
    }
  }
};

// src/utils/event-emitter.ts
var EventEmitter3 = class {
  listeners = /* @__PURE__ */ new Map();
  on(event, listener) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, /* @__PURE__ */ new Set());
    }
    this.listeners.get(event).add(listener);
  }
  once(event, listener) {
    const wrapper = (...args) => {
      this.listeners.get(event)?.delete(wrapper);
      listener(...args);
    };
    this.on(event, wrapper);
  }
  off(event, listener) {
    this.listeners.get(event)?.delete(listener);
  }
  emit(event, ...args) {
    const set = this.listeners.get(event);
    if (!set) return;
    for (const listener of [...set]) {
      try {
        listener(...args);
      } catch (error) {
        console.error(`Error in event listener for ${String(event)}:`, error);
      }
    }
  }
  listenerCount(event) {
    return this.listeners.get(event)?.size ?? 0;
  }
  removeAllListeners(event) {
    if (event) {
      this.listeners.delete(event);
    } else {
      this.listeners.clear();
    }
  }
};

// src/framework/core/protocol/http-bridge.ts
var HTTPBridge = class {
  logger = new Logger("HTTPBridge");
  webhooks = /* @__PURE__ */ new Map();
  async initialize() {
    this.logger.info("Initializing HTTP Bridge...");
    this.logger.info("HTTP Bridge initialized");
  }
  async registerWebhook(path4, handler) {
    this.webhooks.set(path4, { handler, registered: Date.now(), calls: 0 });
    this.logger.info(`Webhook registered: ${path4}`);
  }
  async handleRequest(path4, request) {
    const webhook = this.webhooks.get(path4);
    if (!webhook) throw new Error(`No webhook registered for path: ${path4}`);
    webhook.calls++;
    try {
      return await webhook.handler(request, {
        json: (data) => data,
        status: (code) => ({ json: (data) => ({ status: code, data }) })
      });
    } catch (error) {
      this.logger.error(`Error handling HTTP request for ${path4}`, error);
      throw error;
    }
  }
  async sendRequest(url2, options = {}) {
    const { method = "GET", headers = {}, body } = options;
    this.logger.debug(`Sending HTTP ${method} request to: ${url2}`);
    const res = await fetch(url2, {
      method,
      headers: { "Content-Type": "application/json", ...headers },
      body: body != null ? typeof body === "string" ? body : JSON.stringify(body) : void 0
    });
    const headersObj = {};
    res.headers.forEach((v, k) => {
      headersObj[k] = v;
    });
    const contentType = res.headers.get("content-type") ?? "";
    const data = contentType.includes("application/json") ? await res.json().catch(() => null) : await res.text();
    return { ok: res.ok, status: res.status, data, headers: headersObj };
  }
  getWebhookStats() {
    const stats = {};
    for (const [path4, webhook] of this.webhooks) stats[path4] = {
      registered: webhook.registered,
      calls: webhook.calls
    };
    return stats;
  }
  async cleanup() {
    this.webhooks.clear();
    this.logger.info("HTTP Bridge cleaned up");
  }
};

// src/framework/core/protocol/protocol-bridge.ts
var ProtocolBridge = class extends EventEmitter3 {
  mcpConnector;
  httpBridge;
  logger;
  configRecord;
  constructor(config, options) {
    super();
    this.configRecord = config;
    const logLevel = config.logging?.level;
    this.logger = options?.logger ?? new Logger("ProtocolBridge", logLevel ?? "info");
    this.mcpConnector = options?.mcpConnector ?? new DefaultMCPConnector({ logger: this.logger });
    this.httpBridge = new HTTPBridge();
  }
  async initialize() {
    const startTime = performance.now();
    const workspace = this.configRecord.workspaceDir;
    this.logger.info("Initializing", { workspace });
    try {
      await this.httpBridge.initialize();
      const mcpConfig = this.configRecord.mcp;
      if (Array.isArray(mcpConfig)) {
        for (const entry of mcpConfig) {
          await this.connectEntry(entry);
        }
      }
      this.logger.info(`Initialized (${(performance.now() - startTime).toFixed(0)}ms)`);
    } catch (error) {
      this.logger.error("Initialization failed", error);
      throw error;
    }
  }
  async connectMCP(endpoint, options = {}) {
    await this.mcpConnector.connect({ endpoint, ...options });
    this.emit("mcp:connected", endpoint);
  }
  /** Drop all MCP sessions and reconnect from config (e.g. after saving overrides). */
  async reloadMcpConnections(entries) {
    await this.mcpConnector.cleanup();
    for (const entry of entries) {
      await this.connectEntry(entry);
    }
  }
  async getMCPTools(endpoint) {
    return this.mcpConnector.listTools(endpoint);
  }
  async callMCPTool(endpoint, toolName, args = {}) {
    const result = await this.mcpConnector.callTool(endpoint, toolName, args);
    this.emit("mcp:tool_called", { endpoint, toolName, args, result });
    return result;
  }
  async registerHTTPWebhook(path4, handler) {
    await this.httpBridge.registerWebhook(path4, handler);
    this.emit("http:webhook_registered", path4);
  }
  async sendHTTPRequest(url2, options = {}) {
    const result = await this.httpBridge.sendRequest(url2, options);
    this.emit("http:request_sent", { url: url2, options, result });
    return result;
  }
  async callExternal(protocol, params) {
    switch (protocol) {
      case "mcp":
        if (params.endpoint == null || params.tool == null) throw new Error("MCP call requires endpoint and tool");
        return this.callMCPTool(params.endpoint, params.tool, params.args ?? {});
      case "http":
        if (params.url == null) throw new Error("HTTP call requires url");
        return this.sendHTTPRequest(params.url, params.options);
      default:
        throw new Error(`Unsupported protocol: ${protocol}`);
    }
  }
  getStats() {
    return {
      mcp: { connections: this.mcpConnector.connectionCount ?? 0 },
      http: { webhooks: this.httpBridge.getWebhookStats() }
    };
  }
  async healthCheck() {
    const connCount = this.mcpConnector.connectionCount ?? 0;
    const components = {
      mcp: { status: "healthy", connections: connCount },
      http: { status: "healthy", webhooks: Object.keys(this.httpBridge.getWebhookStats()).length }
    };
    return {
      status: Object.values(components).every((c) => c.status === "healthy") ? "healthy" : "degraded",
      components
    };
  }
  async cleanup() {
    await Promise.all([this.mcpConnector.cleanup(), this.httpBridge.cleanup()]);
    this.removeAllListeners();
    this.logger.debug("Cleaned up");
  }
  async connectEntry(entry) {
    const endpoint = entry?.endpoint?.trim();
    if (!endpoint) return;
    try {
      await this.mcpConnector.connect({
        endpoint,
        transport: entry.transport,
        command: entry.command,
        args: entry.args,
        requestInit: entry.requestInit
      });
      this.emit("mcp:connected", endpoint);
    } catch (err) {
      this.logMcpConnectFailure(endpoint, err);
    }
  }
  logMcpConnectFailure(endpoint, err) {
    const msg = toErrorMessage(err);
    this.logger.warn(`MCP connect failed: ${endpoint}`, err);
    if (/bearer|no bearer|unauthorized|401|403/i.test(msg)) {
      this.logger.info(
        "Hint: add requestInit.headers.Authorization under this MCP entry in novaclaw.yml or the MCP settings UI"
      );
    }
  }
};

// src/utils/cache.ts
var LRUCache = class {
  cache = /* @__PURE__ */ new Map();
  maxSize;
  constructor(maxSize = 100) {
    this.maxSize = maxSize;
  }
  get(key) {
    const entry = this.cache.get(key);
    if (!entry) return void 0;
    if (entry.ttl && Date.now() - entry.timestamp > entry.ttl * 1e3) {
      this.cache.delete(key);
      return void 0;
    }
    this.cache.delete(key);
    this.cache.set(key, entry);
    return entry.value;
  }
  set(key, value, ttl) {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.maxSize) {
      const oldest = this.cache.keys().next().value;
      if (oldest !== void 0) this.cache.delete(oldest);
    }
    this.cache.set(key, { value, timestamp: Date.now(), ttl });
  }
  has(key) {
    return this.get(key) !== void 0;
  }
  delete(key) {
    return this.cache.delete(key);
  }
  clear() {
    this.cache.clear();
  }
  size() {
    return this.cache.size;
  }
};
var SKILL_FILES = ["SKILL.md", "skill.md"];
var RUN_SCRIPTS = ["run.py", "run.sh", "run.ts", "run.js"];
var FRONTMATTER_RE = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
function findSkillFile(dir) {
  for (const name of SKILL_FILES) {
    const p3 = join(dir, name);
    if (existsSync(p3)) return p3;
  }
  return null;
}
function findRunScript(dir) {
  for (const name of RUN_SCRIPTS) {
    const p3 = join(dir, name);
    if (existsSync(p3)) return p3;
  }
  return null;
}
function parseFrontmatter(raw) {
  const match = FRONTMATTER_RE.exec(raw);
  if (!match?.[1] || !match[2]) {
    return { frontmatter: {}, body: raw.trim() };
  }
  let frontmatter = {};
  try {
    frontmatter = parse(match[1]) ?? {};
  } catch {
    return { frontmatter: {}, body: raw.trim() };
  }
  return { frontmatter, body: match[2].trim() };
}

// src/framework/core/skills/skill-loader.ts
var SkillLoader = class {
  logger;
  constructor(logLevel) {
    this.logger = new Logger("SkillLoader", logLevel);
  }
  async loadFromDir(skillDir) {
    const skillFile = findSkillFile(skillDir);
    if (!skillFile) return null;
    try {
      const raw = await readFile(skillFile, "utf-8");
      return this.parse(raw, skillFile, skillDir);
    } catch (err) {
      this.logger.warn("Failed to read SKILL.md", { skillDir, error: toErrorMessage(err) });
      return null;
    }
  }
  async loadSkillPack(packDir) {
    const results = [];
    const root = await this.loadFromDir(packDir);
    if (root) results.push(root);
    const subsDir = join(packDir, SKILLS_SUBDIR);
    try {
      const subStat = await stat(subsDir);
      if (!subStat.isDirectory()) return results;
    } catch {
      return results;
    }
    const subSkillFile = findSkillFile(subsDir);
    if (subSkillFile) {
      try {
        const raw = await readFile(subSkillFile, "utf-8");
        const indexSkill = this.parse(raw, subSkillFile, subsDir);
        if (indexSkill && !results.some((s) => s.id === indexSkill.id)) {
          results.push(indexSkill);
        }
      } catch {
      }
    }
    const childIds = [];
    try {
      const entries = await readdir(subsDir, { withFileTypes: true });
      for (const entry of entries) {
        if (!entry.isDirectory() || entry.name.startsWith(".")) continue;
        const childDir = join(subsDir, entry.name);
        const child = await this.loadFromDir(childDir);
        if (child) {
          results.push(child);
          childIds.push(child.id);
        }
      }
    } catch {
    }
    if (root && childIds.length > 0) {
      root.childSkills = childIds;
    }
    return results;
  }
  async loadLegacyFile(filePath) {
    try {
      const raw = await readFile(filePath, "utf-8");
      const id = basename(filePath).replace(/\.[^.]+$/, "");
      return this.parse(raw, filePath, dirname(filePath), id);
    } catch (err) {
      this.logger.warn("Failed to read legacy skill file", { filePath, error: toErrorMessage(err) });
      return null;
    }
  }
  parse(raw, filePath, skillDir, overrideId) {
    const { frontmatter: fm, body } = parseFrontmatter(raw);
    if (!body) return null;
    const id = overrideId ?? fm.name ?? basename(skillDir);
    const description = fm.description ?? fm.display_name ?? fm.name ?? id;
    const runScript = findRunScript(skillDir) ?? void 0;
    return {
      id,
      filePath,
      skillDir,
      description,
      content: body,
      globs: fm.globs ?? [],
      alwaysApply: fm.alwaysApply ?? false,
      when: { channels: fm.when?.channels, platforms: fm.when?.platforms ?? fm.platforms },
      tags: fm.tags ?? (fm.category ? [fm.category] : []),
      priority: fm.priority ?? 1,
      runScript
    };
  }
};
var ALGO = "aes-256-gcm";
var SENSITIVE_FIELD_PATTERNS = [
  "sid",
  "key",
  "secret",
  "token",
  "password",
  "credential",
  "api_key",
  "apikey"
];
var logger = new Logger("CredentialManager");
async function getOrCreateKey() {
  try {
    const hex2 = (await readFile(NOVACLAW_KEYFILE_PATH, "utf-8")).trim();
    return Buffer.from(hex2, "hex");
  } catch {
    const key = randomBytes(32);
    await mkdir(NOVACLAW_HOME, { recursive: true });
    await writeFile(NOVACLAW_KEYFILE_PATH, key.toString("hex"), "utf-8");
    try {
      await chmod(NOVACLAW_KEYFILE_PATH, 384);
    } catch {
    }
    return key;
  }
}
async function encryptString(plaintext) {
  const key = await getOrCreateKey();
  const iv = randomBytes(12);
  const cipher = createCipheriv(ALGO, key, iv);
  const enc = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `${iv.toString("hex")}:${tag.toString("hex")}:${enc.toString("hex")}`;
}
async function decryptString(ciphertext) {
  const parts = ciphertext.split(":");
  if (parts.length !== 3) throw new Error("Invalid encrypted format");
  const key = await getOrCreateKey();
  const iv = Buffer.from(parts[0], "hex");
  const tag = Buffer.from(parts[1], "hex");
  const enc = Buffer.from(parts[2], "hex");
  const decipher = createDecipheriv(ALGO, key, iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(enc), decipher.final()]).toString("utf8");
}
function isEncrypted(val) {
  return /^[0-9a-f]{24}:[0-9a-f]{32}:[0-9a-f]+$/.test(val);
}
function isSensitiveField(fieldName) {
  const lower = fieldName.toLowerCase();
  return SENSITIVE_FIELD_PATTERNS.some((p3) => lower.includes(p3));
}
async function encryptApiKeysInPlace(obj) {
  const providers = obj.models?.providers;
  if (!providers) return;
  for (const key of Object.keys(providers)) {
    const p3 = providers[key];
    if (p3?.apiKey && typeof p3.apiKey === "string" && p3.apiKey.trim() && !isEncrypted(p3.apiKey)) {
      try {
        p3.apiKey = await encryptString(p3.apiKey);
      } catch (err) {
        logger.debug(`Failed to encrypt API key for provider '${key}'`, err);
      }
    }
  }
}
async function decryptApiKeysInPlace(obj) {
  const providers = obj.models?.providers;
  if (!providers) return;
  for (const key of Object.keys(providers)) {
    const p3 = providers[key];
    if (p3?.apiKey && typeof p3.apiKey === "string" && isEncrypted(p3.apiKey)) {
      try {
        p3.apiKey = await decryptString(p3.apiKey);
      } catch (err) {
        logger.debug(`Failed to decrypt API key for provider '${key}'`, err);
      }
    }
  }
}
async function encryptChannelCredentials(config) {
  if (!config.channels) return;
  for (const [channelId, detail] of Object.entries(config.channels)) {
    if (!detail.accounts) continue;
    for (const account of Object.values(detail.accounts)) {
      for (const [field, value] of Object.entries(account)) {
        if (typeof value === "string" && value.trim() && isSensitiveField(field) && !isEncrypted(value)) {
          try {
            account[field] = await encryptString(value);
          } catch (err) {
            logger.debug(`Failed to encrypt channel credential: ${channelId}.${field}`, err);
          }
        }
      }
    }
  }
}
async function decryptChannelCredentials(config) {
  if (!config.channels) return;
  for (const [channelId, detail] of Object.entries(config.channels)) {
    if (!detail.accounts) continue;
    for (const account of Object.values(detail.accounts)) {
      for (const [field, value] of Object.entries(account)) {
        if (typeof value === "string" && isEncrypted(value)) {
          try {
            account[field] = await decryptString(value);
          } catch (err) {
            logger.debug(`Failed to decrypt channel credential: ${channelId}.${field}`, err);
          }
        }
      }
    }
  }
}

// src/utils/config-loader.ts
var ConfigLoader = class {
  static logger = new Logger("ConfigLoader");
  // ── Public API ───────────────────────────────────────────────────────
  static async load(configPath) {
    const defaultPaths = [
      "./novaclaw.yml",
      "./novaclaw.yaml",
      NOVACLAW_CONFIG_PATH
    ];
    const paths = configPath ? [configPath, ...defaultPaths] : defaultPaths;
    let baseConfig = null;
    for (const path4 of paths) {
      try {
        const content = await readFile(path4, "utf-8");
        const raw = parse(content);
        baseConfig = this.replaceEnvVars(raw);
        break;
      } catch (error) {
        if (path4 === configPath) {
          throw createError(
            `Failed to load config from ${path4}: ${toErrorMessage(error)}`,
            ErrorCodes.CONFIG_LOAD_FAILED,
            { path: path4, cause: error }
          );
        }
      }
    }
    if (!baseConfig) {
      this.logger.info("No config file found \u2014 scaffolding default config");
      await this.scaffoldGlobalConfig();
      this.logger.info(`Default config written to ${NOVACLAW_CONFIG_PATH}`);
      this.logger.info('Run "novaclaw setup" for interactive configuration with API keys');
      baseConfig = this.getDefaultConfig();
    }
    const overrides = await this.loadOverrides();
    if (Object.keys(overrides).length > 0) {
      baseConfig = deepMerge(baseConfig, overrides);
      this.autoEnableChannels(baseConfig);
    }
    return this.validateAndParse(baseConfig);
  }
  /**
   * Persist a config object to `~/.novaclaw/config.yml`.
   * When called without arguments, writes the built-in defaults.
   */
  static async scaffoldGlobalConfig(config) {
    const effective = config ?? this.getDefaultConfig();
    const yaml = this.serializeToYaml(effective);
    await mkdir(NOVACLAW_HOME, { recursive: true });
    for (const sub of ["workspace", "memory"]) {
      const dir = join(NOVACLAW_HOME, sub);
      if (!existsSync(dir)) {
        await mkdir(dir, { recursive: true });
      }
    }
    await writeFile(NOVACLAW_CONFIG_PATH, yaml, "utf-8");
    return NOVACLAW_CONFIG_PATH;
  }
  static serializeToYaml(config) {
    return stringify(config, {
      lineWidth: 0,
      defaultKeyType: "PLAIN",
      defaultStringType: "PLAIN"
    });
  }
  // ── Overrides (~/.novaclaw/overrides.yml) ──────────────────────────
  static async loadOverrides() {
    try {
      const content = await readFile(NOVACLAW_OVERRIDES_PATH, "utf-8");
      const data = parse(content);
      if (typeof data !== "object" || data === null) return {};
      await decryptApiKeysInPlace(data);
      if (data.channels && typeof data.channels === "object") {
        await decryptChannelCredentials(data);
      }
      return data;
    } catch {
      return {};
    }
  }
  static async saveOverrides(overrides) {
    await mkdir(NOVACLAW_HOME, { recursive: true });
    const copy = JSON.parse(JSON.stringify(overrides));
    await encryptApiKeysInPlace(copy);
    if (copy.channels && typeof copy.channels === "object") {
      await encryptChannelCredentials(copy);
    }
    await writeFile(NOVACLAW_OVERRIDES_PATH, this.serializeToYaml(copy), "utf-8");
    try {
      await chmod(NOVACLAW_OVERRIDES_PATH, 384);
    } catch {
    }
  }
  // ── Channel config (stored in overrides.yml) ────────────────────────
  static async getChannelConfig(channelId) {
    const overrides = await this.loadOverrides();
    const channels = overrides.channels;
    return channels?.[channelId] ?? null;
  }
  static async saveChannelConfig(channelId, detail) {
    const overrides = await this.loadOverrides();
    if (!overrides.channels || typeof overrides.channels !== "object") {
      overrides.channels = {};
    }
    overrides.channels[channelId] = detail;
    await this.saveOverrides(overrides);
  }
  static async removeChannelConfig(channelId) {
    const overrides = await this.loadOverrides();
    const channels = overrides.channels;
    if (!channels?.[channelId]) return false;
    delete channels[channelId];
    await this.saveOverrides(overrides);
    return true;
  }
  // ── Defaults ─────────────────────────────────────────────────────────
  static getDefaultConfig() {
    return {
      port: 3e3,
      bind: "loopback",
      workspaceDir: NOVACLAW_WORKSPACE_DIR,
      models: { primary: "", fallback: "", providers: {} },
      agent: { maxTurns: 10, toolResultContextMax: 16e3, messageTimeoutMs: MESSAGE_TIMEOUT_MS },
      skills: {
        dirs: ["./skills/workspace", "./skills/managed", "./skills/bundled"],
        include: ["**/*.md"],
        exclude: ["**/drafts/**"]
      },
      tools: {
        policy: "balanced",
        sandbox: { enabled: true, docker: false, timeout: 3e4, maxMemory: "256MB", allowedCommands: [] },
        permissions: {
          fileSystem: { read: true, write: true, execute: false, delete: false },
          network: { http: true, https: true, websocket: true },
          system: { shell: false, process: false }
        }
      },
      channels: { enabled: ["webchat", "cli"] },
      performance: {
        skillsCache: { maxSize: 100, ttl: 300 },
        semanticSearch: { enabled: true, threshold: 0.7, maxResults: 5 },
        streaming: { enabled: true, chunkSize: 256, maxConcurrent: 4 },
        memory: { maxHeapSize: "512MB", gcInterval: 1e4, sessionTimeout: 3e5 }
      },
      security: {
        auth: { enabled: false, type: "none" },
        rateLimit: { enabled: false, windowMs: 6e4, maxRequests: 100 },
        cors: { enabled: true, origins: ["*"], credentials: false }
      },
      logging: { level: "info", format: "text" },
      monitoring: { enabled: true, rssLimitMB: 512, health: { enabled: true, path: "/health", interval: 3e4 } }
    };
  }
  // ── Private ──────────────────────────────────────────────────────────
  /**
   * After merging overrides, auto-enable channels that have at least one
   * enabled account — so users don't have to manually add to channels.enabled.
   */
  static autoEnableChannels(config) {
    const channels = config.channels;
    if (!channels) return;
    const enabled = new Set(
      Array.isArray(channels.enabled) ? channels.enabled : []
    );
    for (const [key, value] of Object.entries(channels)) {
      if (key === "enabled" || !value || typeof value !== "object") continue;
      const detail = value;
      const accounts = detail.accounts;
      if (!accounts) continue;
      const hasEnabledAccount = Object.values(accounts).some((a) => a.enabled !== false);
      if (hasEnabledAccount) enabled.add(key);
    }
    channels.enabled = [...enabled];
  }
  static validateAndParse(raw) {
    const result = NovaClawConfigSchema.safeParse(raw);
    if (result.success) return result.data;
    for (const issue of result.error.issues) {
      this.logger.warn(`Config validation: ${issue.path.join(".")} \u2014 ${issue.message}`);
    }
    this.logger.warn("Falling back to defaults for invalid fields");
    return this.mergeWithDefaults(raw);
  }
  static mergeWithDefaults(config) {
    return deepMerge(
      this.getDefaultConfig(),
      config
    );
  }
  /** Substitute ${ENV_VAR} references with process.env values. */
  static replaceEnvVars(config) {
    const json = JSON.stringify(config);
    const safeEnvName = /^[A-Za-z_][A-Za-z0-9_]*$/;
    const replaced = json.replace(/\$\{([^}]+)\}/g, (_, varName) => {
      const name = varName.trim();
      if (!safeEnvName.test(name)) return "";
      return (process.env[name] ?? "").replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/\t/g, "\\t");
    });
    return JSON.parse(replaced);
  }
};

// src/utils/config-validator.ts
function validateNovaClawConfig(config) {
  const diagnostics = [];
  if (!config.workspaceDir) {
    diagnostics.push({
      level: "error",
      field: "workspaceDir",
      message: "workspaceDir is required"
    });
  }
  if (!config.models?.primary) {
    diagnostics.push({
      level: "warning",
      field: "models.primary",
      message: "No primary model configured; LLM features will be limited"
    });
  }
  const port = config.port ?? 3e3;
  if (port < 1 || port > 65535) {
    diagnostics.push({
      level: "error",
      field: "port",
      message: `Invalid port: ${port} (must be 1\u201365535)`
    });
  }
  if (config.channels?.enabled?.length === 0) {
    diagnostics.push({
      level: "warning",
      field: "channels.enabled",
      message: "No channels enabled \u2014 only direct API calls accepted"
    });
  }
  const hasErrors = diagnostics.some((d) => d.level === "error");
  return { valid: !hasErrors, diagnostics };
}

// src/utils/lifecycle.ts
var SHUTDOWN_TIMEOUT_MS = 15e3;
var logger2 = new Logger("Lifecycle");
function gracefulShutdown(onShutdown) {
  let shuttingDown = false;
  const handler = (signal) => {
    if (shuttingDown) return;
    shuttingDown = true;
    logger2.info(`Received ${signal}, shutting down gracefully...`);
    const forceExit = setTimeout(() => {
      logger2.error("Shutdown timed out, forcing exit");
      process.exit(1);
    }, SHUTDOWN_TIMEOUT_MS);
    forceExit.unref();
    onShutdown().then(() => {
      clearTimeout(forceExit);
      process.exit(0);
    }).catch((err) => {
      logger2.error("Error during shutdown", err);
      clearTimeout(forceExit);
      process.exit(1);
    });
  };
  process.once("SIGINT", () => handler("SIGINT"));
  process.once("SIGTERM", () => handler("SIGTERM"));
}

// src/utils/metrics.ts
var MetricsCollector = class {
  data = {
    requests: { total: 0, success: 0, error: 0, averageResponseTime: 0 },
    sessions: { active: 0, total: 0 },
    skills: { loaded: 0, cacheHits: 0, cacheMisses: 0 },
    memory: { used: 0, heap: 0, external: 0 }
  };
  responseTimes = [];
  incrementRequests(type, responseTime) {
    this.data.requests.total++;
    this.data.requests[type]++;
    this.responseTimes.push(responseTime);
    if (this.responseTimes.length > 1e3) this.responseTimes.shift();
    this.data.requests.averageResponseTime = this.responseTimes.reduce((a, b) => a + b, 0) / this.responseTimes.length;
  }
  incrementSessions(type) {
    if (type === "created") {
      this.data.sessions.active++;
      this.data.sessions.total++;
    } else {
      this.data.sessions.active--;
    }
  }
  updateSkillsMetrics(loaded, cacheHits, cacheMisses) {
    this.data.skills.loaded = loaded;
    this.data.skills.cacheHits = cacheHits;
    this.data.skills.cacheMisses = cacheMisses;
  }
  getMetrics() {
    const mem = process.memoryUsage();
    this.data.memory.used = mem.rss;
    this.data.memory.heap = mem.heapUsed;
    this.data.memory.external = mem.external;
    return { ...this.data };
  }
  reset() {
    this.data = {
      requests: { total: 0, success: 0, error: 0, averageResponseTime: 0 },
      sessions: { active: 0, total: 0 },
      skills: { loaded: 0, cacheHits: 0, cacheMisses: 0 },
      memory: { used: 0, heap: 0, external: 0 }
    };
    this.responseTimes = [];
  }
};

// src/framework/utils/path-resolver.ts
function resolvePath(path4, basePath) {
  return PathResolver.resolve(path4, basePath);
}
var OPENCLAW_HOME = join(homedir(), ".openclaw");
var MIGRATION_MARKER = ".migration-done";
var SkillMigrator = class {
  logger;
  targetDir;
  constructor(logger3) {
    this.logger = logger3;
    this.targetDir = NOVACLAW_SKILLS_DIR;
  }
  /**
   * Run the full migration + sync pipeline. Returns total skills seeded.
   * Safe to call on every startup.
   */
  migrate(bundledDirs) {
    mkdirSync(this.targetDir, { recursive: true });
    let seeded = 0;
    seeded += this.migrateLegacy();
    seeded += this.syncBundled(bundledDirs);
    return seeded;
  }
  /**
   * One-time legacy migration from ~/.openclaw/.
   * Skipped if marker already exists.
   */
  migrateLegacy() {
    if (existsSync(join(this.targetDir, MIGRATION_MARKER))) return 0;
    let seeded = 0;
    seeded += this.migrateFrom(join(OPENCLAW_HOME, "skills"), "openclaw/skills");
    seeded += this.migrateExtensionSkills();
    this.writeMarker(seeded);
    return seeded;
  }
  /**
   * Incremental sync: copy new skill directories from bundled dirs into
   * ~/.novaclaw/skills/. Already-existing skills are never overwritten.
   * Runs on every startup so newly added project skills are picked up.
   */
  syncBundled(bundledDirs) {
    let seeded = 0;
    for (const dir of bundledDirs) {
      seeded += this.seedFromBundled(dir);
    }
    if (seeded > 0) {
      this.logger.info(`SkillMigrator: synced ${seeded} new bundled skill(s) to ${this.targetDir}`);
    }
    return seeded;
  }
  migrateFrom(sourceDir, label) {
    if (!existsSync(sourceDir)) return 0;
    let entries;
    try {
      entries = readdirSync(sourceDir);
    } catch {
      return 0;
    }
    let copied = 0;
    for (const name of entries) {
      if (name.startsWith(".")) continue;
      const src = join(sourceDir, name);
      if (!this.isSkillDir(src)) continue;
      if (existsSync(join(this.targetDir, name))) continue;
      try {
        cpSync(src, join(this.targetDir, name), { recursive: true });
        copied++;
      } catch (err) {
        this.logger.debug(`SkillMigrator: failed to copy ${name} from ${label}`, { error: toErrorMessage(err) });
      }
    }
    if (copied > 0) this.logger.info(`SkillMigrator: migrated ${copied} skill(s) from ${label}`);
    return copied;
  }
  migrateExtensionSkills() {
    const extDir = join(OPENCLAW_HOME, "extensions");
    if (!existsSync(extDir)) return 0;
    let entries;
    try {
      entries = readdirSync(extDir);
    } catch {
      return 0;
    }
    let copied = 0;
    for (const extName of entries) {
      const skillRoot = join(extDir, extName, "skills");
      if (!existsSync(skillRoot)) continue;
      const skillDirs = this.discoverLegacySkillDirs(skillRoot);
      for (const srcDir of skillDirs) {
        const dirBase = srcDir === skillRoot ? extName : `${extName}-${basename(srcDir)}`;
        if (existsSync(join(this.targetDir, dirBase))) continue;
        try {
          cpSync(srcDir, join(this.targetDir, dirBase), { recursive: true });
          copied++;
        } catch (err) {
          this.logger.debug(`SkillMigrator: failed to copy extension skill ${dirBase}`, { error: toErrorMessage(err) });
        }
      }
    }
    if (copied > 0) this.logger.info(`SkillMigrator: migrated ${copied} skill(s) from openclaw/extensions`);
    return copied;
  }
  seedFromBundled(bundledDir) {
    if (!existsSync(bundledDir)) return 0;
    let copied = 0;
    const walk = (dir) => {
      let entries;
      try {
        entries = readdirSync(dir);
      } catch {
        return;
      }
      for (const name of entries) {
        if (name.startsWith(".")) continue;
        const full = join(dir, name);
        try {
          if (!statSync(full).isDirectory()) continue;
        } catch {
          continue;
        }
        if (this.isSkillDir(full)) {
          if (!existsSync(join(this.targetDir, name))) {
            try {
              cpSync(full, join(this.targetDir, name), { recursive: true });
              copied++;
            } catch {
            }
          }
        } else {
          walk(full);
        }
      }
    };
    walk(bundledDir);
    return copied;
  }
  isSkillDir(dir) {
    return SKILL_FILES.some((f) => existsSync(join(dir, f)));
  }
  discoverLegacySkillDirs(skillRoot) {
    const dirs = [];
    try {
      for (const entry of readdirSync(skillRoot)) {
        const candidate = join(skillRoot, entry);
        if (this.isSkillDir(candidate)) dirs.push(candidate);
      }
    } catch {
    }
    if (this.isSkillDir(skillRoot)) dirs.push(skillRoot);
    return dirs;
  }
  writeMarker(count) {
    try {
      const content = JSON.stringify({
        migratedAt: (/* @__PURE__ */ new Date()).toISOString(),
        skillsSeeded: count,
        sources: {
          openclawSkills: join(OPENCLAW_HOME, "skills"),
          openclawExtensions: join(OPENCLAW_HOME, "extensions")
        }
      }, null, 2);
      writeFileSync(join(this.targetDir, MIGRATION_MARKER), content, "utf-8");
    } catch {
    }
  }
};

// src/framework/core/skills/skill-registry.ts
function readSkillDirs(config) {
  const dirs = [NOVACLAW_SKILLS_DIR];
  const cfg = config.skills;
  if (!cfg) return dirs;
  const baseDir = process.cwd();
  for (const key of ["dirs", "load"]) {
    const source = key === "dirs" ? cfg.dirs : cfg.load?.extraDirs;
    if (!Array.isArray(source)) continue;
    for (const d of source) {
      const resolved = resolvePath(d, baseDir);
      if (!dirs.includes(resolved)) dirs.push(resolved);
    }
  }
  return dirs;
}
function readBundledDirs(config) {
  const bundledDirs = config.bundledDirs;
  if (bundledDirs === void 0) {
    const projectDir = process.cwd();
    const bundledDir = join(projectDir, "skills");
    return existsSync(bundledDir) ? [bundledDir] : [];
  }
  return bundledDirs;
}
function compileExcludePatterns(patterns) {
  return patterns.filter((p3) => p3.trim()).map((p3) => {
    const re = p3.replace(/[.+^${}()|[\]\\]/g, "\\$&").replace(/\*\*/g, "\0").replace(/\*/g, "[^/]*").replace(/\0/g, ".*");
    return new RegExp(re);
  });
}
var SkillRegistry = class {
  skills = /* @__PURE__ */ new Map();
  watcher = null;
  logger;
  loader;
  dirs;
  bundledDirs;
  excludePatterns;
  constructor(config, loader) {
    const logLevel = config.logging?.level;
    this.logger = new Logger("SkillRegistry", logLevel ?? "info");
    this.loader = loader;
    this.dirs = readSkillDirs(config);
    this.bundledDirs = readBundledDirs(config);
    const cfg = config.skills;
    this.excludePatterns = compileExcludePatterns(
      Array.isArray(cfg?.exclude) ? cfg.exclude : []
    );
  }
  ensureMigrated() {
    const migrator = new SkillMigrator(this.logger);
    migrator.migrate(this.bundledDirs);
  }
  async loadAll() {
    this.skills.clear();
    for (const dir of this.dirs) await this.scanDirectory(dir);
    this.logger.info(`Loaded ${this.skills.size} skills from ${this.dirs.length} directories`);
  }
  getAll() {
    return Array.from(this.skills.values());
  }
  getById(id) {
    return this.skills.get(id);
  }
  listIds() {
    return Array.from(this.skills.keys());
  }
  addSkills(skills) {
    let added = 0;
    for (const skill of skills) {
      if (!this.skills.has(skill.id) && this.platformCheck(skill)) {
        this.skills.set(skill.id, skill);
        added++;
      }
    }
    return added;
  }
  startWatcher(onReload) {
    if (this.watcher || this.dirs.length === 0) return;
    this.watcher = watch(this.dirs, { ignored: /(^|[/\\])\../, persistent: true, depth: 4 });
    const debouncedReload = debounce(async (...args) => {
      const [path4, event] = args;
      this.logger.info(`File ${event}: ${path4}, reloading`);
      try {
        await this.loadAll();
        await onReload();
      } catch (error) {
        this.logger.error("Failed to reload skills after file change", error);
      }
    }, 1e3);
    this.watcher.on("add", (p3) => debouncedReload(p3, "added")).on("change", (p3) => debouncedReload(p3, "changed")).on("unlink", (p3) => debouncedReload(p3, "removed"));
  }
  async stopWatcher() {
    if (this.watcher) {
      await this.watcher.close();
      this.watcher = null;
    }
  }
  // ── Private ──────────────────────────────────────────────────────────
  async scanDirectory(dir) {
    try {
      const dirStat = await stat(dir);
      if (!dirStat.isDirectory()) return;
    } catch {
      return;
    }
    try {
      const entries = await readdir(dir, { withFileTypes: true });
      for (const entry of entries) {
        if (entry.name.startsWith(".")) continue;
        const fullPath = join(dir, entry.name);
        if (entry.isDirectory()) {
          await this.loadSkillDir(fullPath);
        } else if (entry.isFile() && extname(entry.name).toLowerCase() === ".md") {
          await this.loadLegacyMd(fullPath);
        }
      }
    } catch (err) {
      this.logger.warn("Failed to scan skills directory", { dir, error: toErrorMessage(err) });
    }
  }
  async loadSkillDir(dir) {
    const hasSubSkills = existsSync(join(dir, SKILLS_SUBDIR));
    const loaded = hasSubSkills ? await this.loader.loadSkillPack(dir) : [await this.loader.loadFromDir(dir)];
    for (const skill of loaded) {
      if (skill && this.accept(skill)) {
        this.skills.set(skill.id, skill);
      }
    }
  }
  async loadLegacyMd(filePath) {
    const skill = await this.loader.loadLegacyFile(filePath);
    if (skill && this.accept(skill) && !this.skills.has(skill.id)) {
      this.skills.set(skill.id, skill);
    }
  }
  accept(skill) {
    return this.platformCheck(skill) && !this.isExcluded(skill);
  }
  isExcluded(skill) {
    if (this.excludePatterns.length === 0) return false;
    return this.excludePatterns.some((re) => re.test(skill.id) || re.test(skill.filePath));
  }
  platformCheck(skill) {
    const platforms = skill.when?.platforms;
    if (!platforms || platforms.length === 0) return true;
    return platforms.includes(process.platform);
  }
};

// src/framework/core/memory/bm25.ts
var STOPWORDS_EN = /* @__PURE__ */ new Set([
  "the",
  "a",
  "an",
  "is",
  "are",
  "was",
  "were",
  "be",
  "been",
  "being",
  "have",
  "has",
  "had",
  "do",
  "does",
  "did",
  "will",
  "would",
  "could",
  "should",
  "may",
  "might",
  "shall",
  "can",
  "to",
  "of",
  "in",
  "for",
  "on",
  "with",
  "at",
  "by",
  "from",
  "as",
  "into",
  "through",
  "and",
  "but",
  "or",
  "nor",
  "not",
  "so",
  "if",
  "then",
  "than",
  "too",
  "very",
  "this",
  "that",
  "these",
  "those",
  "it",
  "its",
  "my",
  "your",
  "his",
  "her",
  "our",
  "their",
  "what",
  "which",
  "who",
  "whom",
  "i",
  "me",
  "we",
  "he",
  "she",
  "they",
  "them",
  "up",
  "out",
  "about",
  "just",
  "also"
]);
var STOPWORDS_ZH = /* @__PURE__ */ new Set([
  "\u7684",
  "\u4E86",
  "\u5728",
  "\u662F",
  "\u6211",
  "\u6709",
  "\u548C",
  "\u5C31",
  "\u4E0D",
  "\u4EBA",
  "\u90FD",
  "\u4E00",
  "\u4E2A",
  "\u4E0A",
  "\u4E5F",
  "\u5F88",
  "\u5230",
  "\u8BF4",
  "\u8981",
  "\u53BB",
  "\u4F60",
  "\u4F1A",
  "\u7740",
  "\u6CA1\u6709",
  "\u770B",
  "\u597D",
  "\u81EA\u5DF1",
  "\u8FD9",
  "\u4ED6",
  "\u5979",
  "\u5B83",
  "\u4EEC",
  "\u90A3"
]);
var STEM_RULES = [
  [/ies$/, "i"],
  [/sses$/, "ss"],
  [/(\w)s$/, "$1"],
  [/eed$/, "ee"],
  [/ing$/, ""],
  [/ed$/, ""],
  [/tion$/, "t"],
  [/ness$/, ""],
  [/ment$/, ""],
  [/able$/, ""],
  [/ible$/, ""],
  [/ful$/, ""],
  [/ous$/, ""],
  [/ive$/, ""],
  [/ly$/, ""],
  [/er$/, ""],
  [/est$/, ""],
  [/al$/, ""]
];
function stem(word) {
  if (word.length <= 3) return word;
  for (const [pattern, replacement] of STEM_RULES) {
    if (pattern.test(word)) {
      const result = word.replace(pattern, replacement);
      if (result.length >= 2) return result;
    }
  }
  return word;
}
var DEFAULT_PARAMS = { k1: 1.2, b: 0.75, phraseBoost: 2 };
var DEFAULT_FIELD_WEIGHTS = { title: 3, heading: 2, body: 1, path: 1.5 };
var BM25Index = class _BM25Index {
  invertedIndex = /* @__PURE__ */ new Map();
  phraseIndex = /* @__PURE__ */ new Map();
  docLengths = /* @__PURE__ */ new Map();
  docTerms = /* @__PURE__ */ new Map();
  docPhrases = /* @__PURE__ */ new Map();
  totalLength = 0;
  docCount = 0;
  params;
  fieldWeights;
  constructor(params, fieldWeights) {
    this.params = { ...DEFAULT_PARAMS, ...params };
    this.fieldWeights = { ...DEFAULT_FIELD_WEIGHTS, ...fieldWeights };
  }
  addDocument(docId, text2) {
    const firstLine = text2.split("\n", 1)[0] ?? "";
    this.addFieldedDocument(docId, { title: "", heading: firstLine, body: text2, path: "" });
  }
  addFieldedDocument(docId, fields) {
    const w = this.fieldWeights;
    const allTokens = [];
    const weightedTF = /* @__PURE__ */ new Map();
    const processField = (text2, weight) => {
      const tokens = tokenize(text2);
      for (const t3 of tokens) {
        weightedTF.set(t3, (weightedTF.get(t3) || 0) + weight);
        allTokens.push(t3);
      }
    };
    processField(fields.title, w.title);
    processField(fields.heading, w.heading);
    processField(fields.body, w.body);
    processField(fields.path, w.path);
    this.docLengths.set(docId, allTokens.length);
    this.totalLength += allTokens.length;
    this.docCount++;
    const termSet = /* @__PURE__ */ new Set();
    for (const [term, fieldTF] of weightedTF) {
      let postings = this.invertedIndex.get(term);
      if (!postings) {
        postings = [];
        this.invertedIndex.set(term, postings);
      }
      postings.push({ docId, termFrequency: fieldTF, fieldTF });
      termSet.add(term);
    }
    this.docTerms.set(docId, termSet);
    this.indexPhrases(docId, allTokens);
  }
  removeDocument(docId) {
    const dl = this.docLengths.get(docId);
    if (dl !== void 0) {
      this.totalLength -= dl;
      this.docLengths.delete(docId);
      this.docCount = Math.max(0, this.docCount - 1);
    }
    const terms = this.docTerms.get(docId);
    if (terms) {
      for (const term of terms) {
        const postings = this.invertedIndex.get(term);
        if (!postings) continue;
        const filtered = postings.filter((p3) => p3.docId !== docId);
        if (filtered.length === 0) this.invertedIndex.delete(term);
        else this.invertedIndex.set(term, filtered);
      }
      this.docTerms.delete(docId);
    }
    const phrases = this.docPhrases.get(docId);
    if (phrases) {
      for (const phrase of phrases) {
        const entries = this.phraseIndex.get(phrase);
        if (!entries) continue;
        const filtered = entries.filter((e) => e.docId !== docId);
        if (filtered.length === 0) this.phraseIndex.delete(phrase);
        else this.phraseIndex.set(phrase, filtered);
      }
      this.docPhrases.delete(docId);
    }
  }
  search(query, limit) {
    const queryTokens = tokenize(query);
    if (queryTokens.length === 0) return [];
    const scores = /* @__PURE__ */ new Map();
    const { k1, b, phraseBoost } = this.params;
    const N = this.docCount;
    const avgdl = this.docCount > 0 ? this.totalLength / this.docCount : 1;
    const termCounts = /* @__PURE__ */ new Map();
    for (const t3 of queryTokens) termCounts.set(t3, (termCounts.get(t3) || 0) + 1);
    for (const [term, queryTF] of termCounts) {
      const postings = this.invertedIndex.get(term);
      if (!postings) continue;
      const df = postings.length;
      const idf = Math.log(1 + (N - df + 0.5) / (df + 0.5));
      for (const { docId, fieldTF } of postings) {
        const dl = this.docLengths.get(docId) || 1;
        const tfNorm = fieldTF * (k1 + 1) / (fieldTF + k1 * (1 - b + b * (dl / avgdl)));
        scores.set(docId, (scores.get(docId) || 0) + idf * tfNorm * queryTF);
      }
    }
    if (phraseBoost > 1 && queryTokens.length >= 2) {
      for (let i = 0; i < queryTokens.length - 1; i++) {
        const bigram = `${queryTokens[i]}|${queryTokens[i + 1]}`;
        const entries = this.phraseIndex.get(bigram);
        if (!entries) continue;
        for (const { docId, count } of entries) {
          const base2 = scores.get(docId);
          if (base2 !== void 0) scores.set(docId, base2 + base2 * (phraseBoost - 1) * Math.min(count, 3) / 3);
        }
      }
    }
    return Array.from(scores.entries()).map(([docId, score]) => ({ docId, score })).sort((a, b2) => b2.score - a.score).slice(0, limit);
  }
  getDocumentFrequency(term) {
    return this.invertedIndex.get(term)?.length ?? 0;
  }
  getTopTerms(docId, topN) {
    const termScores = [];
    for (const [term, postings] of this.invertedIndex) {
      for (const p3 of postings) {
        if (p3.docId === docId) {
          const df = postings.length;
          const idf = Math.log(1 + this.docCount / (df + 1));
          termScores.push([term, p3.fieldTF * idf]);
          break;
        }
      }
    }
    return termScores.sort((a, b) => b[1] - a[1]).slice(0, topN).map(([t3]) => t3);
  }
  clear() {
    this.invertedIndex.clear();
    this.phraseIndex.clear();
    this.docLengths.clear();
    this.docTerms.clear();
    this.docPhrases.clear();
    this.totalLength = 0;
    this.docCount = 0;
  }
  get size() {
    return this.docCount;
  }
  serialize() {
    const index = {};
    for (const [term, postings] of this.invertedIndex) index[term] = postings;
    const phrases = {};
    for (const [phrase, entries] of this.phraseIndex) phrases[phrase] = entries;
    return {
      index,
      docLengths: Object.fromEntries(this.docLengths),
      totalLength: this.totalLength,
      docCount: this.docCount,
      params: this.params,
      fieldWeights: this.fieldWeights,
      phrases
    };
  }
  /** Restore internal state from a serialized snapshot. Used by deserialize. */
  restoreFromSnapshot(snapshot) {
    this.docCount = snapshot.docCount;
    this.totalLength = snapshot.totalLength ?? 0;
    this.docLengths.clear();
    for (const [docId, len] of Object.entries(snapshot.docLengths)) {
      this.docLengths.set(docId, len);
    }
    this.invertedIndex.clear();
    for (const [term, postings] of Object.entries(snapshot.index)) {
      this.invertedIndex.set(term, postings);
    }
    this.phraseIndex.clear();
    if (snapshot.phrases) {
      for (const [phrase, entries] of Object.entries(snapshot.phrases)) {
        this.phraseIndex.set(phrase, entries);
      }
    }
    this.docTerms.clear();
    for (const [term, postings] of this.invertedIndex) {
      for (const p3 of postings) {
        let set = this.docTerms.get(p3.docId);
        if (!set) {
          set = /* @__PURE__ */ new Set();
          this.docTerms.set(p3.docId, set);
        }
        set.add(term);
      }
    }
    this.docPhrases.clear();
    for (const [phrase, entries] of this.phraseIndex) {
      for (const { docId } of entries) {
        let set = this.docPhrases.get(docId);
        if (!set) {
          set = /* @__PURE__ */ new Set();
          this.docPhrases.set(docId, set);
        }
        set.add(phrase);
      }
    }
  }
  static deserialize(snapshot) {
    const bm25 = new _BM25Index(snapshot.params, snapshot.fieldWeights);
    bm25.restoreFromSnapshot(snapshot);
    return bm25;
  }
  indexPhrases(docId, tokens) {
    if (tokens.length < 2) return;
    const counts = /* @__PURE__ */ new Map();
    for (let i = 0; i < tokens.length - 1; i++) {
      const bigram = `${tokens[i]}|${tokens[i + 1]}`;
      counts.set(bigram, (counts.get(bigram) || 0) + 1);
    }
    const phraseSet = /* @__PURE__ */ new Set();
    for (const [phrase, count] of counts) {
      let entries = this.phraseIndex.get(phrase);
      if (!entries) {
        entries = [];
        this.phraseIndex.set(phrase, entries);
      }
      entries.push({ docId, count });
      phraseSet.add(phrase);
    }
    this.docPhrases.set(docId, phraseSet);
  }
};
function tokenize(text2) {
  const lower = text2.toLowerCase();
  const tokens = [];
  const codeExpanded = lower.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2").replace(/[_\-./\\]+/g, " ");
  const caseExpanded = text2.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2").replace(/[_\-./\\]+/g, " ").toLowerCase();
  const wordSource = `${codeExpanded} ${caseExpanded}`;
  const words = wordSource.split(/[^\p{L}\p{N}]+/u).filter((w) => w.length > 1);
  const seen = /* @__PURE__ */ new Set();
  for (const w of words) {
    if (STOPWORDS_EN.has(w)) continue;
    if (!seen.has(w)) {
      tokens.push(w);
      seen.add(w);
    }
    const stemmed = stem(w);
    if (stemmed !== w && !seen.has(stemmed)) {
      tokens.push(stemmed);
      seen.add(stemmed);
    }
  }
  const cjkChars = lower.replace(/[^\u4e00-\u9fff\u3400-\u4dbf]+/g, " ").trim();
  for (const segment of cjkChars.split(/\s+/)) {
    if (segment.length < 2) continue;
    for (let i = 0; i <= segment.length - 2; i++) {
      const bigram = segment.slice(i, i + 2);
      if (!STOPWORDS_ZH.has(bigram)) tokens.push(bigram);
    }
    for (let i = 0; i <= segment.length - 3; i++) tokens.push(segment.slice(i, i + 3));
  }
  return tokens;
}

// src/framework/core/skills/skill-resolver.ts
var SkillResolver = class {
  bm25 = new BM25Index();
  buildIndex(skills) {
    this.bm25.clear();
    for (const skill of skills) {
      this.bm25.addFieldedDocument(skill.id, {
        title: skill.id.replace(/[/_-]/g, " "),
        heading: skill.description,
        body: skill.content,
        path: skill.tags.join(" ")
      });
    }
  }
  resolve(message, context, allSkills, options) {
    const { maxSkills, mentionedFiles = [] } = options;
    const skillMap = new Map(allSkills.map((s) => [s.id, s]));
    const candidates = /* @__PURE__ */ new Map();
    for (const skill of allSkills) {
      if (skill.alwaysApply) {
        candidates.set(skill.id, { skill, score: 100, source: "alwaysApply" });
      }
    }
    if (mentionedFiles.length > 0) {
      for (const skill of allSkills) {
        if (skill.globs.length === 0 || candidates.has(skill.id)) continue;
        if (this.matchesGlobs(mentionedFiles, skill.globs)) {
          candidates.set(skill.id, { skill, score: 50, source: "glob" });
        }
      }
    }
    const eligibleIds = new Set(
      allSkills.filter((s) => this.passesWhenFilter(s, context)).map((s) => s.id)
    );
    const bm25Hits = this.bm25.search(message, maxSkills * 3);
    for (const hit of bm25Hits) {
      if (!eligibleIds.has(hit.docId) || candidates.has(hit.docId)) continue;
      const skill = skillMap.get(hit.docId);
      if (skill) candidates.set(skill.id, { skill, score: hit.score, source: "bm25" });
    }
    return Array.from(candidates.values()).sort((a, b) => {
      const priDiff = b.skill.priority - a.skill.priority;
      return priDiff !== 0 ? priDiff : b.score - a.score;
    }).slice(0, maxSkills);
  }
  passesWhenFilter(skill, context) {
    const { channels } = skill.when ?? {};
    if (channels?.length && !channels.includes(context.channel)) return false;
    return true;
  }
  matchesGlobs(files, globs) {
    for (const file of files) {
      const fileName = basename(file);
      const fileExt = extname(file).toLowerCase();
      for (const glob of globs) {
        const extMatch = glob.match(/^\*\*\/\*(\.\w+)$/);
        if (extMatch) {
          if (fileExt === extMatch[1]) return true;
          continue;
        }
        const pattern = glob.replace(/\./g, "\\.").replace(/\*\*/g, "\0").replace(/\*/g, "[^/]*").replace(/\0/g, ".*");
        if (new RegExp(`^${pattern}$`).test(file) || new RegExp(`^${pattern}$`).test(fileName)) {
          return true;
        }
      }
    }
    return false;
  }
};

// src/framework/core/skills/file-skill-provider.ts
var FileSkillProvider = class {
  constructor(config) {
    this.config = config;
    const logLevel = config.logging?.level ?? "info";
    this.logger = new Logger("FileSkillProvider", logLevel);
    const loader = new SkillLoader(logLevel);
    this.registry = new SkillRegistry(config, loader);
    this.resolver = new SkillResolver();
    const cacheOpt = config.performance?.skillsCache;
    this.cache = new LRUCache(cacheOpt?.maxSize ?? 100);
  }
  config;
  id = "file";
  version = "2026-03";
  registry;
  resolver;
  cache;
  logger;
  // ── ISkillProvider ───────────────────────────────────────────────────
  async listSkills() {
    return this.registry.getAll();
  }
  async resolve(message, context, options = {}) {
    const maxSkills = options.maxSkills ?? 5;
    const cacheKey = this.buildCacheKey(message, context.channel, maxSkills);
    const cached2 = this.cache.get(cacheKey);
    if (cached2) return cached2.map((s) => ({ skill: s, score: 1, source: "cache" }));
    const results = this.resolver.resolve(message, context, this.registry.getAll(), {
      maxSkills,
      mentionedFiles: options.mentionedFiles
    });
    const perf = this.config.performance?.skillsCache;
    if (perf?.ttl) this.cache.set(cacheKey, results.map((r) => r.skill), perf.ttl);
    return results;
  }
  // ── Lifecycle ────────────────────────────────────────────────────────
  async initialize() {
    this.registry.ensureMigrated();
    await this.registry.loadAll();
    this.resolver.buildIndex(this.registry.getAll());
    this.registry.startWatcher(() => this.onReload());
    this.logger.info("Initialized", { skills: this.registry.getAll().length });
  }
  async cleanup() {
    await this.registry.stopWatcher();
    this.cache.clear();
  }
  // ── Accessors ────────────────────────────────────────────────────────
  getSkillById(id) {
    return this.registry.getById(id);
  }
  listSkillIds() {
    return this.registry.listIds();
  }
  addExternalSkills(skills) {
    const added = this.registry.addSkills(skills);
    if (added > 0) {
      this.rebuildIndex();
      this.logger.info(`Merged ${added} external skill(s)`, { total: this.registry.getAll().length });
    }
    return added;
  }
  async reloadFromDisk() {
    await this.registry.loadAll();
    this.rebuildIndex();
    this.logger.info("Reloaded from disk", { skills: this.registry.getAll().length });
  }
  getStats() {
    return { totalSkills: this.registry.getAll().length };
  }
  // ── Private ──────────────────────────────────────────────────────────
  async onReload() {
    this.rebuildIndex();
  }
  rebuildIndex() {
    this.resolver.buildIndex(this.registry.getAll());
    this.cache.clear();
  }
  buildCacheKey(message, channel, maxSkills) {
    const hash = createHash("sha256").update(message).digest("hex").slice(0, 16);
    return `${hash}:${channel}:${maxSkills}`;
  }
};

// src/framework/core/skills/skills-engine.ts
var SkillsEngine = class {
  id = "skills-engine";
  version = "2026-03";
  fileProvider;
  providerRegistry;
  logger;
  constructor(config, options = {}) {
    const logLevel = config.logging?.level ?? "info";
    this.logger = new Logger("SkillsEngine", logLevel);
    this.fileProvider = new FileSkillProvider(config);
    this.providerRegistry = options.providerRegistry ?? null;
  }
  // ── Lifecycle ────────────────────────────────────────────────────────
  async initialize() {
    await this.fileProvider.initialize();
    if (this.providerRegistry) {
      const providers = this.providerRegistry.getAll();
      this.logger.info(`SkillsEngine has ${providers.length} additional provider(s)`);
    }
  }
  async cleanup() {
    await this.fileProvider.cleanup();
  }
  // ── ISkillProvider ───────────────────────────────────────────────────
  async listSkills() {
    const fileSkills = await this.fileProvider.listSkills();
    const extraSkills = await this.listExternalSkills();
    if (extraSkills.length === 0) return fileSkills;
    const seen = new Set(fileSkills.map((s) => s.id));
    const merged = [...fileSkills];
    for (const skill of extraSkills) {
      if (!seen.has(skill.id)) {
        seen.add(skill.id);
        merged.push(skill);
      }
    }
    return merged;
  }
  async resolve(message, context, options = {}) {
    const fileResults = await this.fileProvider.resolve(message, context, options);
    if (!this.providerRegistry) return fileResults;
    const externalResults = await this.resolveFromExternalProviders(message, context, options);
    if (externalResults.length === 0) return fileResults;
    const maxSkills = options.maxSkills ?? 5;
    const seen = new Set(fileResults.map((r) => r.skill.id));
    const merged = [...fileResults];
    for (const result of externalResults) {
      if (!seen.has(result.skill.id)) {
        seen.add(result.skill.id);
        merged.push(result);
      }
    }
    return merged.sort((a, b) => {
      const priDiff = b.skill.priority - a.skill.priority;
      return priDiff !== 0 ? priDiff : b.score - a.score;
    }).slice(0, maxSkills);
  }
  // ── Convenience accessors ────────────────────────────────────────────
  async findRelevantSkills(message, context, options = {}) {
    const results = await this.resolve(message, context, {
      maxSkills: options.maxSkills ?? 5,
      mentionedFiles: options.mentionedFiles
    });
    return results.map((r) => r.skill);
  }
  async findRelevantSkillsByQuery(query, limit = 5) {
    if (!query?.trim()) return [];
    const ctx = {
      sessionKey: "",
      sessionId: "",
      userId: "",
      channel: "tool",
      workspaceDir: process.cwd(),
      startTime: 0,
      lastActivity: 0,
      metadata: {}
    };
    const results = await this.resolve(query.trim(), ctx, { maxSkills: limit });
    return results.map((r) => r.skill);
  }
  getSkillById(id) {
    return this.fileProvider.getSkillById(id?.trim());
  }
  listSkillIds() {
    return this.fileProvider.listSkillIds();
  }
  addExternalSkills(skills) {
    return this.fileProvider.addExternalSkills(skills);
  }
  async reloadFromDisk() {
    return this.fileProvider.reloadFromDisk();
  }
  getStats() {
    return this.fileProvider.getStats();
  }
  // ── Private ──────────────────────────────────────────────────────────
  async listExternalSkills() {
    if (!this.providerRegistry) return [];
    const all = [];
    for (const provider of this.providerRegistry.getAll()) {
      if (provider.id === this.fileProvider.id) continue;
      try {
        const skills = await provider.listSkills();
        all.push(...skills);
      } catch (err) {
        this.logger.warn(`Failed to list skills from provider '${provider.id}'`, err);
      }
    }
    return all;
  }
  async resolveFromExternalProviders(message, context, options) {
    if (!this.providerRegistry) return [];
    const all = [];
    for (const provider of this.providerRegistry.getAll()) {
      if (provider.id === this.fileProvider.id) continue;
      try {
        const results = await provider.resolve(message, context, options);
        all.push(...results);
      } catch (err) {
        this.logger.warn(`Failed to resolve skills from provider '${provider.id}'`, err);
      }
    }
    return all;
  }
};
var INDEXABLE_EXTENSIONS = /* @__PURE__ */ new Set([
  ".md",
  ".txt",
  ".ts",
  "",
  ".py",
  ".json",
  ".yaml",
  ".yml",
  ".tsx",
  ".jsx",
  ".css",
  ".html",
  ".sh",
  ".bash",
  ".go",
  ".rs",
  ".java",
  ".c",
  ".cpp",
  ".h",
  ".rb",
  ".php",
  ".sql",
  ".toml"
]);
var MB = 1024 * 1024;
var HEADING_RE = /^(#{1,4})\s+(.+)/;
var FUNC_RE = /^(?:export\s+)?(?:async\s+)?(?:function|class|interface|type|const|def |public |private |protected )\s+(\w+)/;
var CONV_RE = /^\[(?:user|assistant)\]:/i;
var DocumentIndexer = class _DocumentIndexer {
  constructor(config, memoryConfig) {
    this.memoryConfig = memoryConfig;
    const logLevel = config.logging?.level;
    this.logger = new Logger("MemoryIndexer", logLevel ?? "info");
    this.chunkSize = memoryConfig.chunkSize ?? 512;
    this.chunkOverlap = memoryConfig.chunkOverlap ?? 64;
  }
  memoryConfig;
  logger;
  chunkSize;
  chunkOverlap;
  async indexConversation(conversation) {
    if (conversation.messages.length === 0) {
      this.logger.debug("[Indexer:conv] Empty conversation, skipping", { id: conversation.id });
      return null;
    }
    const content = conversation.messages.map((m) => `[${m.role}]: ${m.content}`).join("\n\n");
    const hash = this.hashContent(content);
    const title = conversation.title;
    const docId = `conv-${conversation.id}`;
    const chunks = this.chunkDocument(content, docId, title, conversation.id);
    const tree = this.buildStructureTree(content, title);
    return {
      documentId: docId,
      source: "conversation",
      filePath: conversation.id,
      title,
      tree,
      chunks,
      indexedAt: Date.now(),
      contentHash: hash
    };
  }
  async indexFile(filePath, source) {
    try {
      const fileStat = await stat(filePath);
      if (fileStat.size > this.memoryConfig.maxDocumentSizeMB * MB) {
        this.logger.warn("[Indexer:file] File too large, skipping", {
          filePath,
          sizeMB: (fileStat.size / MB).toFixed(1)
        });
        return null;
      }
      const content = await readFile(filePath, "utf-8");
      if (!content.trim()) {
        this.logger.debug("[Indexer:file] Empty file, skipping", { filePath });
        return null;
      }
      const hash = this.hashContent(content);
      const title = filePath.split("/").pop() ?? filePath;
      const docId = `${source}-${hash.slice(0, 12)}`;
      const chunks = this.chunkDocument(content, docId, title, filePath);
      const tree = this.buildStructureTree(content, title);
      return {
        documentId: docId,
        source,
        filePath,
        title,
        tree,
        chunks,
        indexedAt: Date.now(),
        contentHash: hash
      };
    } catch (err) {
      this.logger.warn("Failed to index file", { filePath, error: toErrorMessage(err) });
      return null;
    }
  }
  async scanWorkspaceFiles(workspaceDir) {
    const files = [];
    await this.walkDir(workspaceDir, files, 0);
    return files;
  }
  chunkDocument(content, docId, title, sourcePath) {
    const lines = content.split("\n");
    const headingMap = this.buildHeadingMap(lines);
    const chunks = [];
    let currentLines = [];
    let currentTokenCount = 0;
    let chunkStartLine = 0;
    let chunkIdx = 0;
    for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
      const line = lines[lineIdx];
      const lineTokens = this.estimateTokens(line);
      if (currentTokenCount + lineTokens > this.chunkSize && currentLines.length > 0) {
        chunks.push(this.makeChunk(docId, chunkIdx, currentLines, chunkStartLine, headingMap.get(chunkStartLine) ?? title, sourcePath));
        chunkIdx++;
        const { keptLines, keptTokens } = this.computeOverlap(currentLines);
        currentLines = keptLines;
        currentTokenCount = keptTokens;
        chunkStartLine = lineIdx - keptLines.length;
      }
      currentLines.push(line);
      currentTokenCount += lineTokens;
    }
    if (currentLines.length > 0) {
      chunks.push(this.makeChunk(docId, chunkIdx, currentLines, chunkStartLine, headingMap.get(chunkStartLine) ?? title, sourcePath));
      chunkIdx++;
    }
    for (const chunk of chunks) chunk.siblingCount = chunkIdx;
    return chunks;
  }
  hashContent(content) {
    return createHash("sha256").update(content).digest("hex");
  }
  static MAX_WALK_DEPTH = 6;
  static SKIP_DIRS = /* @__PURE__ */ new Set([
    "node_modules",
    ".git",
    ".svn",
    "dist",
    "build",
    ".next",
    ".cache",
    ".turbo",
    "__pycache__",
    ".venv",
    "venv",
    "coverage",
    ".nyc_output",
    ".novaclaw"
  ]);
  async walkDir(dir, results, depth) {
    if (depth > _DocumentIndexer.MAX_WALK_DEPTH) return;
    try {
      const entries = await readdir(dir, { withFileTypes: true });
      for (const entry of entries) {
        if (entry.name.startsWith(".") && depth > 0) continue;
        const full = join(dir, entry.name);
        if (entry.isDirectory()) {
          if (!_DocumentIndexer.SKIP_DIRS.has(entry.name)) await this.walkDir(full, results, depth + 1);
        } else if (entry.isFile()) {
          const ext = entry.name.includes(".") ? "." + entry.name.split(".").pop().toLowerCase() : "";
          if (INDEXABLE_EXTENSIONS.has(ext)) results.push(full);
        }
      }
    } catch (err) {
      const e = err;
      if (e.code !== "ENOENT" && e.code !== "EACCES") {
        this.logger.warn("Failed to walk directory", { dir, error: toErrorMessage(err) });
      }
    }
  }
  buildHeadingMap(lines) {
    const map = /* @__PURE__ */ new Map();
    let currentHeading = "";
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      const hm = HEADING_RE.exec(line);
      const fm = FUNC_RE.exec(line);
      const cm = CONV_RE.test(line);
      if (hm) currentHeading = hm[2];
      else if (fm) currentHeading = fm[1];
      else if (cm) currentHeading = line.slice(0, 60);
      map.set(i, currentHeading);
    }
    return map;
  }
  makeChunk(docId, idx, lines, startLine, heading, sourcePath) {
    const text2 = lines.join("\n");
    return {
      chunkId: `${docId}#${idx}`,
      documentId: docId,
      text: text2,
      startLine,
      endLine: startLine + lines.length - 1,
      tokenCount: this.estimateTokens(text2),
      heading,
      sourcePath,
      index: idx,
      siblingCount: 0
    };
  }
  computeOverlap(lines) {
    const kept = [];
    let tokens = 0;
    for (let i = lines.length - 1; i >= 0; i--) {
      const lt = this.estimateTokens(lines[i]);
      if (tokens + lt > this.chunkOverlap) break;
      kept.unshift(lines[i]);
      tokens += lt;
    }
    return { keptLines: kept, keptTokens: tokens };
  }
  estimateTokens(text2) {
    const cjkCount = (text2.match(/[\u4e00-\u9fff\u3400-\u4dbf]/g) || []).length;
    const nonCjk = text2.length - cjkCount;
    return Math.ceil(nonCjk / 4 + cjkCount / 1.5);
  }
  buildStructureTree(content, title) {
    const lines = content.split("\n");
    const sections = this.detectSections(lines);
    if (sections.length === 0) {
      return {
        id: "root",
        title,
        summary: `Document with ${lines.length} lines`,
        sourceRange: { start: 0, end: lines.length - 1 },
        children: []
      };
    }
    return {
      id: "root",
      title,
      summary: `Document with ${sections.length} sections`,
      sourceRange: { start: 0, end: lines.length - 1 },
      children: sections.map((s, i) => ({
        id: `s${i}`,
        title: s.title,
        summary: s.preview,
        children: [],
        sourceRange: { start: s.startLine, end: s.endLine }
      }))
    };
  }
  detectSections(lines) {
    const sections = [];
    let currentStart = 0;
    let currentTitle = "";
    const flush = (endLine) => {
      if (endLine < currentStart) return;
      const block = lines.slice(currentStart, endLine + 1).join("\n").trim();
      if (block) sections.push({
        title: currentTitle || block.slice(0, 60),
        startLine: currentStart,
        endLine,
        preview: block.slice(0, 200)
      });
    };
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const headingMatch = HEADING_RE.exec(line);
      const funcMatch = FUNC_RE.exec(line.trim());
      const convMatch = CONV_RE.test(line.trim());
      if ((headingMatch || funcMatch || convMatch) && i > currentStart) {
        flush(i - 1);
        currentStart = i;
        currentTitle = headingMatch?.[2] ?? funcMatch?.[1] ?? line.trim().slice(0, 60);
      }
    }
    flush(lines.length - 1);
    return sections;
  }
};
var DEFAULT_MMR_LAMBDA = 0.7;
var DEFAULT_CONTEXT_WINDOW = 3;
var PRF_TOP_DOCS = 3;
var PRF_EXPANSION_TERMS = 8;
var PRF_ORIGINAL_WEIGHT = 0.75;
var MemoryRetriever = class {
  constructor(config, memoryConfig, llmCall) {
    this.memoryConfig = memoryConfig;
    this.llmCall = llmCall;
    const logLevel = config.logging?.level;
    this.logger = new Logger("MemoryRetriever", logLevel ?? "info");
  }
  memoryConfig;
  llmCall;
  logger;
  bm25 = new BM25Index();
  chunkMap = /* @__PURE__ */ new Map();
  docMap = /* @__PURE__ */ new Map();
  addDocument(doc) {
    this.docMap.set(doc.documentId, doc);
    for (const chunk of doc.chunks) {
      this.chunkMap.set(chunk.chunkId, chunk);
      this.bm25.addFieldedDocument(chunk.chunkId, {
        title: doc.title,
        heading: chunk.heading,
        body: chunk.text,
        path: chunk.sourcePath
      });
    }
    this.logger.debug("[Retriever] Document added to BM25F", {
      docId: doc.documentId,
      chunks: doc.chunks.length,
      totalIndexed: this.bm25.size
    });
  }
  removeDocument(documentId) {
    const doc = this.docMap.get(documentId);
    if (!doc) return;
    for (const chunk of doc.chunks) {
      this.bm25.removeDocument(chunk.chunkId);
      this.chunkMap.delete(chunk.chunkId);
    }
    this.docMap.delete(documentId);
  }
  async retrieve(query, _indexes) {
    if (this.bm25.size === 0) {
      this.logger.debug("[Retriever] BM25 index empty");
      return [];
    }
    const target = this.memoryConfig.maxRetrievalNodes;
    const fetchSize = target * 4;
    let hits = this.bm25.search(query, fetchSize);
    if (hits.length === 0) return [];
    const usePRF = this.memoryConfig.queryExpansion !== false;
    if (usePRF && hits.length >= PRF_TOP_DOCS) {
      const expanded = this.expandQueryWithPRF(query, hits.slice(0, PRF_TOP_DOCS));
      if (expanded) {
        const prfHits = this.bm25.search(expanded, fetchSize);
        hits = this.fuseResults(hits, prfHits, PRF_ORIGINAL_WEIGHT);
      }
    }
    const lambda = this.memoryConfig.mmrLambda ?? DEFAULT_MMR_LAMBDA;
    const mmrSelected = this.applyMMR(hits, target * 2, lambda);
    let finalHits = mmrSelected;
    if (this.memoryConfig.llmReranking && this.llmCall) {
      finalHits = await this.rerankWithLLM(query, mmrSelected);
    }
    finalHits = finalHits.slice(0, target);
    const docGroups = this.groupByDocument(finalHits);
    return this.buildResults(docGroups);
  }
  bm25Search(query, limit) {
    const hits = this.bm25.search(query, limit);
    return hits.map((h) => this.chunkMap.get(h.docId)).filter((c) => c !== void 0);
  }
  clear() {
    this.bm25.clear();
    this.chunkMap.clear();
    this.docMap.clear();
  }
  get indexSize() {
    return this.bm25.size;
  }
  expandQueryWithPRF(query, topHits) {
    const originalTokens = new Set(tokenize(query));
    const termScores = /* @__PURE__ */ new Map();
    for (const hit of topHits) {
      const topTerms = this.bm25.getTopTerms(hit.docId, PRF_EXPANSION_TERMS * 2);
      for (let i = 0; i < topTerms.length; i++) {
        const term = topTerms[i];
        if (originalTokens.has(term)) continue;
        termScores.set(term, (termScores.get(term) || 0) + 1 / (i + 1));
      }
    }
    if (termScores.size === 0) return null;
    const expansionTerms = Array.from(termScores.entries()).sort((a, b) => b[1] - a[1]).slice(0, PRF_EXPANSION_TERMS).map(([term]) => term);
    return `${query} ${expansionTerms.join(" ")}`;
  }
  fuseResults(primary, secondary, primaryWeight) {
    const K = 60;
    const fused = /* @__PURE__ */ new Map();
    primary.forEach((h, rank) => {
      fused.set(h.docId, (fused.get(h.docId) || 0) + primaryWeight / (K + rank + 1));
    });
    secondary.forEach((h, rank) => {
      fused.set(h.docId, (fused.get(h.docId) || 0) + (1 - primaryWeight) / (K + rank + 1));
    });
    return Array.from(fused.entries()).map(([docId, score]) => ({ docId, score })).sort((a, b) => b.score - a.score);
  }
  applyMMR(hits, k, lambda) {
    if (hits.length <= k) return hits;
    const tokenCache = /* @__PURE__ */ new Map();
    const getTokens = (docId) => {
      let cached2 = tokenCache.get(docId);
      if (!cached2) {
        const chunk = this.chunkMap.get(docId);
        cached2 = new Set(chunk ? tokenize(chunk.text) : []);
        tokenCache.set(docId, cached2);
      }
      return cached2;
    };
    const maxScore = hits[0]?.score || 1;
    const remaining = hits.map((h) => ({ ...h, normScore: h.score / maxScore }));
    const selected = [];
    while (selected.length < k && remaining.length > 0) {
      let bestIdx = 0;
      let bestMMR = -Infinity;
      for (let i = 0; i < remaining.length; i++) {
        const candidate = remaining[i];
        let maxSim = 0;
        const candidateTokens = getTokens(candidate.docId);
        for (const sel of selected) {
          const sim = jaccardSimilarity(candidateTokens, getTokens(sel.docId));
          if (sim > maxSim) maxSim = sim;
        }
        const mmrScore = lambda * candidate.normScore - (1 - lambda) * maxSim;
        if (mmrScore > bestMMR) {
          bestMMR = mmrScore;
          bestIdx = i;
        }
      }
      selected.push(remaining[bestIdx]);
      remaining.splice(bestIdx, 1);
    }
    return selected;
  }
  groupByDocument(hits) {
    const groups = /* @__PURE__ */ new Map();
    for (const hit of hits) {
      const chunk = this.chunkMap.get(hit.docId);
      if (!chunk) continue;
      let group = groups.get(chunk.documentId);
      if (!group) {
        group = [];
        groups.set(chunk.documentId, group);
      }
      group.push({ chunk, score: hit.score });
    }
    for (const group of groups.values()) group.sort((a, b) => a.chunk.index - b.chunk.index);
    return groups;
  }
  async buildResults(docGroups) {
    const contextWindow = this.memoryConfig.contextWindowLines ?? DEFAULT_CONTEXT_WINDOW;
    const results = [];
    for (const [documentId, chunks] of docGroups) {
      const doc = this.docMap.get(documentId);
      if (!doc) continue;
      const merged = this.mergeAdjacentChunks(chunks);
      const sections = await Promise.all(
        merged.map(async (group) => {
          const content = await this.resolveContentWithContext(doc, group.chunks, contextWindow);
          const bestChunk = group.chunks[0];
          return {
            nodeId: group.chunks.map((c) => c.chunkId).join("+"),
            nodeTitle: bestChunk.heading || this.extractTitle(bestChunk),
            content,
            score: group.score
          };
        })
      );
      results.push({
        documentId,
        source: doc.source,
        filePath: doc.filePath,
        title: doc.title,
        sections: sections.filter((s) => s.content.length > 0)
      });
    }
    return results;
  }
  mergeAdjacentChunks(chunks) {
    if (chunks.length === 0) return [];
    const groups = [];
    let current = { chunks: [chunks[0].chunk], score: chunks[0].score };
    for (let i = 1; i < chunks.length; i++) {
      const prev = current.chunks[current.chunks.length - 1];
      const curr = chunks[i];
      if (curr.chunk.index - prev.index <= 1) {
        current.chunks.push(curr.chunk);
        current.score = Math.max(current.score, curr.score);
      } else {
        groups.push(current);
        current = { chunks: [curr.chunk], score: curr.score };
      }
    }
    groups.push(current);
    return groups;
  }
  async resolveContentWithContext(doc, chunks, contextWindow) {
    if (doc.source === "conversation") return chunks.map((c) => c.text).join("\n");
    const first = chunks[0];
    const last = chunks[chunks.length - 1];
    try {
      const fileContent = await readFile(doc.filePath, "utf-8");
      const lines = fileContent.split("\n");
      const start = Math.max(0, first.startLine - contextWindow);
      const end = Math.min(lines.length - 1, last.endLine + contextWindow);
      return lines.slice(start, end + 1).join("\n");
    } catch {
      return chunks.map((c) => c.text).join("\n");
    }
  }
  extractTitle(chunk) {
    const firstLine = chunk.text.split("\n")[0] ?? "";
    const heading = firstLine.match(/^#{1,4}\s+(.+)/);
    if (heading) return heading[1];
    const func = firstLine.match(/^(?:export\s+)?(?:async\s+)?(?:function|class|interface)\s+(\w+)/);
    if (func) return func[1];
    return firstLine.slice(0, 60) || chunk.chunkId;
  }
  async rerankWithLLM(query, hits) {
    if (!this.llmCall) return hits;
    try {
      const candidates = hits.map((h, i) => {
        const chunk = this.chunkMap.get(h.docId);
        return `[${i}] ${chunk ? chunk.text.slice(0, 150) : ""}`;
      }).join("\n");
      const prompt = `You are a JSON-only relevance reranker. Output a JSON array of integers. Return at most ${this.memoryConfig.maxRetrievalNodes} indices. Your entire response must be a single JSON array of integers.`;
      const raw = await this.llmCall(prompt, `Query: ${query}

Passages:
${candidates}`, 256);
      if (!raw) return hits;
      const cleaned = raw.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();
      const match = cleaned.match(/\[[\d,\s]+\]/);
      if (!match) return hits;
      const indices = JSON.parse(match[0]);
      const reranked = [];
      for (const idx of indices) {
        if (idx >= 0 && idx < hits.length) reranked.push({ ...hits[idx], score: hits.length - reranked.length });
      }
      for (const hit of hits) {
        if (!reranked.some((r) => r.docId === hit.docId)) reranked.push(hit);
      }
      return reranked;
    } catch (e) {
      this.logger.warn("[Retriever] LLM reranking failed, using BM25 order", e);
      return hits;
    }
  }
};
function jaccardSimilarity(a, b) {
  if (a.size === 0 && b.size === 0) return 1;
  let intersection = 0;
  for (const token of a) {
    if (b.has(token)) intersection++;
  }
  const union = a.size + b.size - intersection;
  return union === 0 ? 0 : intersection / union;
}
var GRAPH_FILENAME = "graph.json";
var SNAPSHOT_VERSION = "1.0";
var KnowledgeGraph = class {
  entities = /* @__PURE__ */ new Map();
  relations = /* @__PURE__ */ new Map();
  communities = [];
  storageDir;
  logger = new Logger("KnowledgeGraph");
  constructor(storageDir) {
    this.storageDir = storageDir;
  }
  async initialize() {
    await mkdir(this.storageDir, { recursive: true });
    await this.load();
  }
  // ---------------------------------------------------------------------------
  // Entity CRUD
  // ---------------------------------------------------------------------------
  upsertEntity(entity) {
    const existing = Array.from(this.entities.values()).find(
      (e) => e.name.toLowerCase() === entity.name.toLowerCase() && e.type === entity.type
    );
    const now = Date.now();
    if (existing) {
      const merged = {
        ...existing,
        description: entity.description ?? existing.description,
        properties: { ...existing.properties, ...entity.properties },
        sourceChunks: [
          .../* @__PURE__ */ new Set([...existing.sourceChunks, ...entity.sourceChunks ?? []])
        ],
        sourceDocuments: [
          .../* @__PURE__ */ new Set([
            ...existing.sourceDocuments,
            ...entity.sourceDocuments ?? []
          ])
        ],
        updatedAt: now
      };
      this.entities.set(existing.id, merged);
      return merged;
    }
    const newEntity = {
      id: randomUUID(),
      name: entity.name,
      type: entity.type,
      description: entity.description ?? "",
      properties: entity.properties ?? {},
      sourceChunks: entity.sourceChunks ?? [],
      sourceDocuments: entity.sourceDocuments ?? [],
      createdAt: now,
      updatedAt: now
    };
    this.entities.set(newEntity.id, newEntity);
    return newEntity;
  }
  getEntity(id) {
    return this.entities.get(id);
  }
  findEntitiesByName(query) {
    const q = query.toLowerCase();
    return Array.from(this.entities.values()).filter(
      (e) => e.name.toLowerCase().includes(q) || e.description && e.description.toLowerCase().includes(q)
    );
  }
  findEntitiesByType(type) {
    return Array.from(this.entities.values()).filter((e) => e.type === type);
  }
  // ---------------------------------------------------------------------------
  // Relation CRUD
  // ---------------------------------------------------------------------------
  upsertRelation(relation) {
    const existing = Array.from(this.relations.values()).find(
      (r) => r.sourceEntityId === relation.sourceEntityId && r.targetEntityId === relation.targetEntityId && r.type === relation.type
    );
    const now = Date.now();
    if (existing) {
      const updated = {
        ...existing,
        weight: relation.weight,
        description: relation.description ?? existing.description,
        sourceChunks: [
          .../* @__PURE__ */ new Set([
            ...existing.sourceChunks,
            ...relation.sourceChunks ?? []
          ])
        ]
      };
      this.relations.set(existing.id, updated);
      return updated;
    }
    const newRelation = {
      id: randomUUID(),
      sourceEntityId: relation.sourceEntityId,
      targetEntityId: relation.targetEntityId,
      type: relation.type,
      description: relation.description,
      weight: relation.weight,
      sourceChunks: relation.sourceChunks ?? [],
      createdAt: now
    };
    this.relations.set(newRelation.id, newRelation);
    return newRelation;
  }
  getRelationsForEntity(entityId) {
    return Array.from(this.relations.values()).filter(
      (r) => r.sourceEntityId === entityId || r.targetEntityId === entityId
    );
  }
  // ---------------------------------------------------------------------------
  // Graph traversal
  // ---------------------------------------------------------------------------
  expandNeighbors(entityIds, depth = 1) {
    const seenEntityIds = new Set(entityIds);
    const seenRelationIds = /* @__PURE__ */ new Set();
    const collectedRelations = [];
    let frontier = [...entityIds];
    for (let d = 0; d < depth; d++) {
      const nextFrontier = [];
      for (const eid of frontier) {
        const rels = this.getRelationsForEntity(eid);
        for (const rel of rels) {
          if (seenRelationIds.has(rel.id)) continue;
          seenRelationIds.add(rel.id);
          collectedRelations.push(rel);
          const neighbor = rel.sourceEntityId === eid ? rel.targetEntityId : rel.sourceEntityId;
          if (!seenEntityIds.has(neighbor)) {
            seenEntityIds.add(neighbor);
            nextFrontier.push(neighbor);
          }
        }
      }
      frontier = nextFrontier;
    }
    const entities = Array.from(seenEntityIds).map((id) => this.entities.get(id)).filter((e) => e !== void 0);
    return { entities, relations: collectedRelations };
  }
  // ---------------------------------------------------------------------------
  // Community management
  // ---------------------------------------------------------------------------
  setCommunities(communities) {
    this.communities = [...communities];
  }
  getCommunities() {
    return [...this.communities];
  }
  findRelevantCommunities(query) {
    const tokens = query.toLowerCase().split(/\s+/).filter((t3) => t3.length > 0);
    if (tokens.length === 0) return this.communities;
    return this.communities.filter((c) => {
      const text2 = `${c.name} ${c.summary}`.toLowerCase();
      return tokens.some((t3) => text2.includes(t3));
    });
  }
  // ---------------------------------------------------------------------------
  // Stats
  // ---------------------------------------------------------------------------
  getStats() {
    return {
      entityCount: this.entities.size,
      relationCount: this.relations.size,
      communityCount: this.communities.length
    };
  }
  // ---------------------------------------------------------------------------
  // Persistence
  // ---------------------------------------------------------------------------
  async save() {
    const snapshot = this.toSnapshot();
    const filePath = join(this.storageDir, GRAPH_FILENAME);
    await writeFile(filePath, JSON.stringify(snapshot, null, 2), "utf-8");
  }
  async load() {
    const filePath = join(this.storageDir, GRAPH_FILENAME);
    try {
      const data = await readFile(filePath, "utf-8");
      const snapshot = JSON.parse(data);
      this.fromSnapshot(snapshot);
    } catch (err) {
      const e = err;
      if (e.code !== "ENOENT") {
        this.logger.warn("Failed to load knowledge graph snapshot, starting fresh", {
          path: filePath,
          error: e.message
        });
      }
    }
  }
  toSnapshot() {
    const now = Date.now();
    const stats = this.getStats();
    return {
      entities: Array.from(this.entities.values()),
      relations: Array.from(this.relations.values()),
      communities: [...this.communities],
      metadata: {
        version: SNAPSHOT_VERSION,
        createdAt: now,
        updatedAt: now,
        entityCount: stats.entityCount,
        relationCount: stats.relationCount,
        communityCount: stats.communityCount
      }
    };
  }
  fromSnapshot(snapshot) {
    this.entities.clear();
    this.relations.clear();
    this.communities = [];
    for (const e of snapshot.entities ?? []) {
      this.entities.set(e.id, e);
    }
    for (const r of snapshot.relations ?? []) {
      this.relations.set(r.id, r);
    }
    this.communities = snapshot.communities ?? [];
  }
  // ---------------------------------------------------------------------------
  // Cleanup
  // ---------------------------------------------------------------------------
  clear() {
    this.entities.clear();
    this.relations.clear();
    this.communities = [];
  }
};

// src/framework/core/memory/graph/types.ts
var ENTITY_TYPES = [
  "person",
  "organization",
  "technology",
  "concept",
  "file",
  "function",
  "class",
  "module",
  "api",
  "service",
  "config",
  "event",
  "custom"
];
var RELATION_TYPES = [
  "depends_on",
  "imports",
  "calls",
  "implements",
  "contains",
  "extends",
  "configures",
  "relates_to",
  "similar_to",
  "contrasts_with",
  "part_of",
  "created_by",
  "used_by",
  "custom"
];
var DEFAULT_HYBRID_RETRIEVAL_CONFIG = {
  bm25Weight: 0.55,
  vectorWeight: 0,
  graphWeight: 0.45,
  rerankWithLLM: true
};

// src/framework/core/memory/graph/entity-extractor.ts
var EntityExtractor = class {
  constructor(llmCall, config = {}) {
    this.llmCall = llmCall;
    this.config = config;
  }
  llmCall;
  config;
  async extract(chunkText2) {
    const systemPrompt = this.buildExtractionPrompt();
    const userContent = chunkText2;
    const maxTokens = 2048;
    const response = await this.llmCall(systemPrompt, userContent, maxTokens);
    if (!response) {
      return { entities: [], relations: [] };
    }
    return this.parseResponse(response);
  }
  async extractBatch(chunks) {
    const results = /* @__PURE__ */ new Map();
    for (const chunk of chunks) {
      const result = await this.extract(chunk.text);
      results.set(chunk.id, result);
    }
    return results;
  }
  buildExtractionPrompt() {
    const maxEntities = this.config.maxEntitiesPerChunk ?? 20;
    const entityTypes = ENTITY_TYPES.join(", ");
    const relationTypes = RELATION_TYPES.join(", ");
    return `You are an entity and relation extractor. Extract entities and their relationships from the given text.

Output a valid JSON object with exactly two keys:
- "entities": array of objects, each with "name" (string), "type" (string), "description" (string)
- "relations": array of objects, each with "source" (string, entity name), "target" (string, entity name), "type" (string), "description" (optional string)

Entity types (use exactly one): ${entityTypes}
Relation types (use exactly one): ${relationTypes}

Rules:
- Extract at most ${maxEntities} entities per chunk
- Entity names must be exact strings from the text
- Relation source/target must match entity names exactly
- Return only valid JSON, no markdown or extra text`;
  }
  parseResponse(response) {
    const jsonStr = this.extractJsonFromResponse(response);
    if (!jsonStr) {
      return { entities: [], relations: [] };
    }
    let parsed;
    try {
      parsed = JSON.parse(jsonStr);
    } catch {
      return { entities: [], relations: [] };
    }
    const entities = this.parseEntities(parsed.entities ?? []);
    const relations = this.parseRelations(parsed.relations ?? [], entities);
    return { entities, relations };
  }
  extractJsonFromResponse(response) {
    let trimmed = response.trim();
    const codeBlockMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (codeBlockMatch) {
      const captured = codeBlockMatch[1];
      trimmed = (captured ?? "").trim();
    }
    const objectMatch = trimmed.match(/\{[\s\S]*\}/);
    if (objectMatch) {
      return objectMatch[0];
    }
    return null;
  }
  parseEntities(raw) {
    const validEntities = [];
    const entityTypeSet = new Set(ENTITY_TYPES);
    for (const item2 of raw) {
      if (item2 && typeof item2 === "object" && "name" in item2 && "type" in item2 && "description" in item2) {
        const name = String(item2.name).trim();
        const typeStr = String(item2.type).trim();
        const description = String(item2.description).trim();
        if (name && entityTypeSet.has(typeStr)) {
          validEntities.push({
            name,
            type: typeStr,
            description
          });
        }
      }
    }
    return validEntities;
  }
  parseRelations(raw, entities) {
    const validRelations = [];
    const relationTypeSet = new Set(RELATION_TYPES);
    const entityNames = new Set(entities.map((e) => e.name));
    for (const item2 of raw) {
      if (item2 && typeof item2 === "object" && "source" in item2 && "target" in item2 && "type" in item2) {
        const source = String(item2.source).trim();
        const target = String(item2.target).trim();
        const typeStr = String(item2.type).trim();
        const description = "description" in item2 && item2.description != null ? String(item2.description).trim() : void 0;
        if (source && target && relationTypeSet.has(typeStr) && entityNames.has(source) && entityNames.has(target)) {
          validRelations.push({
            source,
            target,
            type: typeStr,
            description: description || void 0
          });
        }
      }
    }
    return validRelations;
  }
};

// src/framework/core/memory/graph/entity-resolver.ts
var EntityResolver = class {
  aliasMap = /* @__PURE__ */ new Map();
  // normalized name -> canonical id
  resolve(entities) {
    const byNormalized = /* @__PURE__ */ new Map();
    for (const entity of entities) {
      const key = this.normalize(entity.name);
      const list = byNormalized.get(key);
      if (list) {
        list.push(entity);
      } else {
        byNormalized.set(key, [entity]);
      }
    }
    const result = [];
    const now = Date.now();
    for (const [, group] of byNormalized) {
      const merged = this.mergeGroup(group, now);
      result.push(merged);
      this.aliasMap.set(this.normalize(merged.name), merged.id);
    }
    return result;
  }
  getCanonicalId(name) {
    return this.aliasMap.get(this.normalize(name));
  }
  normalize(name) {
    return name.toLowerCase().trim().replace(/\s+/g, " ").replace(/[.,;:!?]+$/g, "");
  }
  mergeGroup(group, now) {
    const first = group[0];
    if (group.length === 1 && first) {
      return first;
    }
    const sorted = [...group].sort((a, b) => {
      const aScore = this.entityScore(a);
      const bScore = this.entityScore(b);
      return bScore - aScore;
    });
    const primary = sorted[0];
    if (!primary) {
      throw new Error("mergeGroup: empty group");
    }
    const sourceChunks = new Set(primary.sourceChunks);
    const sourceDocuments = new Set(primary.sourceDocuments);
    const properties = { ...primary.properties };
    for (let i = 1; i < sorted.length; i++) {
      const e = sorted[i];
      if (e) {
        for (const c of e.sourceChunks) sourceChunks.add(c);
        for (const d of e.sourceDocuments) sourceDocuments.add(d);
        Object.assign(properties, e.properties);
      }
    }
    return {
      id: primary.id,
      name: primary.name,
      type: primary.type,
      description: primary.description,
      properties,
      sourceChunks: [...sourceChunks],
      sourceDocuments: [...sourceDocuments],
      createdAt: primary.createdAt,
      updatedAt: now
    };
  }
  entityScore(entity) {
    const propCount = Object.keys(entity.properties).length;
    const descLen = entity.description?.length ?? 0;
    return propCount * 10 + descLen;
  }
};

// src/framework/core/memory/graph/graph-retriever.ts
var GraphRetriever = class {
  constructor(graph) {
    this.graph = graph;
  }
  graph;
  query(query, limit = 5) {
    const matchingEntities = this.graph.findEntitiesByName(query);
    const results = [];
    const seenEntityIds = /* @__PURE__ */ new Set();
    for (const entity of matchingEntities) {
      if (seenEntityIds.has(entity.id)) continue;
      seenEntityIds.add(entity.id);
      const { entities: neighbors, relations } = this.graph.expandNeighbors(
        [entity.id],
        1
      );
      const relationsForEntity = relations.filter(
        (r) => r.sourceEntityId === entity.id || r.targetEntityId === entity.id
      );
      const relationInfos = relationsForEntity.map((r) => {
        const targetId = r.sourceEntityId === entity.id ? r.targetEntityId : r.sourceEntityId;
        const targetEntity = neighbors.find((e) => e.id === targetId);
        return {
          targetEntityId: targetId,
          targetEntityName: targetEntity?.name ?? targetId,
          relationType: r.type,
          description: r.description
        };
      });
      const queryLower = query.toLowerCase();
      const nameMatch = entity.name.toLowerCase() === queryLower;
      const partialMatch = entity.name.toLowerCase().includes(queryLower) || entity.description && entity.description.toLowerCase().includes(queryLower);
      let score = 0;
      if (nameMatch) score = 3;
      else if (partialMatch) score = 2;
      else score = 1;
      const sourceChunkIds = [
        .../* @__PURE__ */ new Set([
          ...entity.sourceChunks,
          ...relationsForEntity.flatMap((r) => r.sourceChunks)
        ])
      ];
      results.push({
        entityId: entity.id,
        entityName: entity.name,
        entityType: entity.type,
        relations: relationInfos,
        sourceChunkIds,
        score
      });
    }
    results.sort((a, b) => b.score - a.score);
    return results.slice(0, limit);
  }
};

// src/framework/core/memory/graph/incremental-builder.ts
var IncrementalGraphBuilder = class {
  constructor(graph, extractor, resolver, batchSize = 5) {
    this.graph = graph;
    this.extractor = extractor;
    this.resolver = resolver;
    this.batchSize = batchSize;
    this._logger = new Logger("IncrementalGraphBuilder");
  }
  graph;
  extractor;
  resolver;
  batchSize;
  pendingChunks = [];
  _logger;
  onDocumentIndexed(doc) {
    for (const chunk of doc.chunks) {
      this.pendingChunks.push({ id: chunk.id, text: chunk.text, documentId: doc.id });
    }
  }
  async flush() {
    let entitiesAdded = 0;
    let relationsAdded = 0;
    while (this.pendingChunks.length > 0) {
      const batch = this.pendingChunks.splice(0, this.batchSize);
      const results = await this.extractor.extractBatch(
        batch.map((c) => ({ id: c.id, text: c.text }))
      );
      for (const [chunkId, extraction] of results) {
        const chunk = batch.find((c) => c.id === chunkId);
        if (!chunk) continue;
        const entities = extraction.entities.map((e) => ({
          id: "",
          // will be generated by graph.upsertEntity
          name: e.name,
          type: e.type,
          description: e.description,
          properties: {},
          sourceChunks: [chunkId],
          sourceDocuments: [chunk.documentId],
          createdAt: Date.now(),
          updatedAt: Date.now()
        }));
        const resolved = this.resolver.resolve(entities);
        for (const entity of resolved) {
          this.graph.upsertEntity(entity);
          entitiesAdded++;
        }
        for (const rel of extraction.relations) {
          const sourceEntities = this.graph.findEntitiesByName(rel.source);
          const targetEntities = this.graph.findEntitiesByName(rel.target);
          if (sourceEntities.length > 0 && targetEntities.length > 0) {
            this.graph.upsertRelation({
              sourceEntityId: sourceEntities[0].id,
              targetEntityId: targetEntities[0].id,
              type: rel.type,
              description: rel.description,
              weight: 1,
              sourceChunks: [chunkId]
            });
            relationsAdded++;
          }
        }
      }
    }
    await this.graph.save();
    this._logger.info("Flushed graph batch", { entitiesAdded, relationsAdded });
    return { entitiesAdded, relationsAdded };
  }
  get pendingCount() {
    return this.pendingChunks.length;
  }
};

// src/framework/core/memory/hybrid/rrf-fusion.ts
function rrfFusion(resultSets, weights, k = 60) {
  const fused = /* @__PURE__ */ new Map();
  for (const { source, items } of resultSets) {
    const weightKey = source.toLowerCase();
    const weight = weightKey in weights ? weights[weightKey] : 1;
    if (weight <= 0) continue;
    for (let rank = 0; rank < items.length; rank++) {
      const item2 = items[rank];
      const rrfContrib = weight * (1 / (k + rank + 1));
      const existing = fused.get(item2.id);
      if (existing) {
        existing.fusedScore += rrfContrib;
        if (item2.content && !existing.item.content) {
          existing.item = { ...existing.item, content: item2.content };
        }
        if (item2.metadata && Object.keys(item2.metadata).length > 0) {
          existing.item = {
            ...existing.item,
            metadata: { ...existing.item.metadata, ...item2.metadata }
          };
        }
      } else {
        fused.set(item2.id, {
          item: { ...item2, source },
          fusedScore: rrfContrib
        });
      }
    }
  }
  return Array.from(fused.values()).map(({ item: item2, fusedScore }) => ({ ...item2, score: fusedScore })).sort((a, b) => b.score - a.score);
}

// src/framework/core/memory/hybrid/hybrid-retriever.ts
var HybridRetriever = class {
  constructor(bm25Search, graphRetriever, config) {
    this.bm25Search = bm25Search;
    this.graphRetriever = graphRetriever;
    this.config = config;
  }
  bm25Search;
  graphRetriever;
  config;
  retrieve(query, limit = 10) {
    const resultSets = [];
    const bm25Chunks = this.bm25Search(query, limit * 2);
    const bm25Items = bm25Chunks.map((chunk, i) => ({
      id: chunk.chunkId,
      score: 1 / (i + 1),
      source: "bm25",
      content: chunk.text,
      metadata: {
        documentId: chunk.documentId,
        sourcePath: chunk.sourcePath,
        heading: chunk.heading
      }
    }));
    if (bm25Items.length > 0) {
      resultSets.push({ source: "bm25", items: bm25Items });
    }
    if (this.graphRetriever) {
      const graphResults = this.graphRetriever.query(query, limit * 2);
      const graphItems = graphResults.map((r) => ({
        id: r.entityId,
        score: r.score,
        source: "graph",
        content: `${r.entityName}: ${r.relations.map((rel) => `${rel.relationType} ${rel.targetEntityName}`).join(", ")}`,
        metadata: {
          entityName: r.entityName,
          entityType: r.entityType,
          sourceChunkIds: r.sourceChunkIds
        }
      }));
      if (graphItems.length > 0) {
        resultSets.push({ source: "graph", items: graphItems });
      }
    }
    const weights = this.normalizeWeights();
    const fused = rrfFusion(resultSets, weights);
    return fused.slice(0, limit);
  }
  normalizeWeights() {
    const { bm25Weight, graphWeight } = this.config;
    const total = bm25Weight + graphWeight;
    if (total <= 0) {
      return { bm25: 0.5, vector: 0, graph: 0.5 };
    }
    return {
      bm25: bm25Weight / total,
      vector: 0,
      graph: graphWeight / total
    };
  }
};

// src/framework/core/memory/retrieval-strategy.ts
var BM25Strategy = class {
  constructor(retriever) {
    this.retriever = retriever;
  }
  retriever;
  async retrieve(query, indexes, limit) {
    return this.retriever.retrieve(query, indexes);
  }
  onDocumentIndexed(_index) {
  }
  getGraphStats() {
    return null;
  }
  async initializeGraph() {
  }
  async saveGraph() {
  }
  clearGraph() {
  }
};
var HybridStrategy = class {
  constructor(hybridRetriever, knowledgeGraph, graphBuilder, indexLookup, logger3) {
    this.hybridRetriever = hybridRetriever;
    this.knowledgeGraph = knowledgeGraph;
    this.graphBuilder = graphBuilder;
    this.indexLookup = indexLookup;
    this.logger = logger3;
  }
  hybridRetriever;
  knowledgeGraph;
  graphBuilder;
  indexLookup;
  logger;
  async retrieve(query, _indexes, limit) {
    const ranked = this.hybridRetriever.retrieve(query, limit * 2);
    const docGroups = /* @__PURE__ */ new Map();
    for (const item2 of ranked) {
      const docId = item2.metadata?.documentId;
      if (!docId) continue;
      let sections = docGroups.get(docId);
      if (!sections) {
        sections = [];
        docGroups.set(docId, sections);
      }
      sections.push({
        nodeId: item2.id,
        nodeTitle: item2.metadata?.heading ?? item2.id,
        content: item2.content ?? "",
        score: item2.score
      });
    }
    const results = [];
    for (const [documentId, sections] of docGroups) {
      const index = this.indexLookup(documentId);
      results.push({
        documentId,
        source: index?.source ?? "workspace",
        filePath: index?.filePath ?? "",
        title: index?.title ?? documentId,
        sections: sections.slice(0, limit)
      });
    }
    return results.slice(0, limit);
  }
  onDocumentIndexed(index) {
    this.graphBuilder.onDocumentIndexed({
      id: index.documentId,
      chunks: index.chunks.map((c) => ({ id: c.chunkId, text: c.text }))
    });
    this.graphBuilder.flush().catch((err) => {
      this.logger.warn("GraphRAG flush failed", { error: String(err) });
    });
  }
  getGraphStats() {
    return this.knowledgeGraph.getStats();
  }
  async initializeGraph() {
    await this.knowledgeGraph.initialize();
  }
  async saveGraph() {
    await this.knowledgeGraph.save().catch(() => {
    });
  }
  clearGraph() {
    this.knowledgeGraph.clear();
  }
};
function readMemoryConfig(config) {
  const mem = config.memory ?? {};
  const home = typeof config.homedir === "string" ? config.homedir : homedir();
  const storageDir = typeof mem.storageDir === "string" ? mem.storageDir : `${home}/.novaclaw/memory`;
  return {
    enabled: mem.enabled === true,
    storageDir,
    indexConversations: mem.indexConversations !== false,
    indexWorkspace: mem.indexWorkspace !== false,
    maxDocumentSizeMB: typeof mem.maxDocumentSizeMB === "number" ? mem.maxDocumentSizeMB : 10,
    maxRetrievalNodes: typeof mem.maxRetrievalNodes === "number" ? mem.maxRetrievalNodes : 5,
    chunkSize: typeof mem.chunkSize === "number" ? mem.chunkSize : 512,
    chunkOverlap: typeof mem.chunkOverlap === "number" ? mem.chunkOverlap : 64,
    llmReranking: mem.llmReranking === true,
    queryExpansion: mem.queryExpansion !== false,
    mmrLambda: typeof mem.mmrLambda === "number" ? mem.mmrLambda : 0.7,
    contextWindowLines: typeof mem.contextWindowLines === "number" ? mem.contextWindowLines : 3,
    graphRag: readGraphRagConfig(mem),
    hybridRetrieval: readHybridRetrievalConfig(mem)
  };
}
function readGraphRagConfig(mem) {
  const raw = mem.graphRag;
  if (!raw || raw.enabled !== true) return void 0;
  const extraction = raw.entityExtraction;
  return {
    enabled: true,
    entityExtraction: {
      batchSize: typeof extraction?.batchSize === "number" ? extraction.batchSize : 5,
      maxEntitiesPerChunk: typeof extraction?.maxEntitiesPerChunk === "number" ? extraction.maxEntitiesPerChunk : 10
    }
  };
}
function readHybridRetrievalConfig(mem) {
  const raw = mem.hybridRetrieval;
  if (!raw) return void 0;
  return {
    bm25Weight: typeof raw.bm25Weight === "number" ? raw.bm25Weight : 0.35,
    vectorWeight: typeof raw.vectorWeight === "number" ? raw.vectorWeight : 0.4,
    graphWeight: typeof raw.graphWeight === "number" ? raw.graphWeight : 0.25
  };
}

// src/framework/core/memory/local-memory-provider.ts
var MAX_TITLE_LEN = 30;
function resolveStorageDir(raw) {
  if (raw.startsWith("~")) return join(homedir(), raw.slice(1));
  return raw;
}
function deriveTitle(messages2) {
  const first = messages2.find((m) => m.role === "user");
  if (!first) return "New Chat";
  const text2 = first.content.replace(/\n/g, " ").trim();
  return text2.length > MAX_TITLE_LEN ? text2.slice(0, MAX_TITLE_LEN) + "\u2026" : text2;
}
var LocalMemoryProvider = class {
  constructor(config, options) {
    this.config = config;
    this.memoryConfig = readMemoryConfig(config);
    const logLevel = config.logging?.level;
    this.logger = new Logger("LocalMemoryProvider", logLevel ?? "info");
    this.indexer = new DocumentIndexer(config, this.memoryConfig);
    this.retriever = new MemoryRetriever(
      config,
      this.memoryConfig,
      this.memoryConfig.llmReranking ? options?.llmCall : void 0
    );
    const base2 = resolveStorageDir(this.memoryConfig.storageDir);
    this.indexDir = join(base2, "indexes");
    this.uploadsDir = join(base2, "uploads");
    this.conversationsDir = join(base2, "conversations");
    this.strategy = this.buildStrategy(base2, options?.llmCall);
  }
  config;
  id = "local";
  version = "2025-01";
  logger;
  memoryConfig;
  indexer;
  retriever;
  indexes = /* @__PURE__ */ new Map();
  pathToDocId = /* @__PURE__ */ new Map();
  indexDir;
  uploadsDir;
  conversationsDir;
  convIndex = /* @__PURE__ */ new Map();
  convIndexLoaded = false;
  stats = { indexingCalls: 0, retrievalCalls: 0, totalRetrievalTimeMs: 0 };
  strategy;
  buildStrategy(baseDir, llmCall) {
    if (!this.memoryConfig.graphRag?.enabled || !llmCall) {
      return new BM25Strategy(this.retriever);
    }
    const graphDir = join(baseDir, "graph");
    const knowledgeGraph = new KnowledgeGraph(graphDir);
    const extractor = new EntityExtractor(
      llmCall,
      { maxEntitiesPerChunk: this.memoryConfig.graphRag.entityExtraction?.maxEntitiesPerChunk ?? 10 }
    );
    const resolver = new EntityResolver();
    const graphBuilder = new IncrementalGraphBuilder(
      knowledgeGraph,
      extractor,
      resolver,
      this.memoryConfig.graphRag.entityExtraction?.batchSize ?? 5
    );
    const graphRetriever = new GraphRetriever(knowledgeGraph);
    const hybridConfig = {
      ...DEFAULT_HYBRID_RETRIEVAL_CONFIG,
      ...this.memoryConfig.hybridRetrieval
    };
    const hybridRetriever = new HybridRetriever(
      (query, limit) => this.retriever.bm25Search(query, limit),
      graphRetriever,
      hybridConfig
    );
    return new HybridStrategy(
      hybridRetriever,
      knowledgeGraph,
      graphBuilder,
      (docId) => this.indexes.get(docId),
      this.logger
    );
  }
  get enabled() {
    return this.memoryConfig.enabled;
  }
  async initialize() {
    await mkdir(this.conversationsDir, { recursive: true });
    await this.loadConvIndex();
    if (!this.memoryConfig.enabled) return;
    await mkdir(this.indexDir, { recursive: true });
    await mkdir(this.uploadsDir, { recursive: true });
    await this.loadExistingIndexes();
    await this.strategy.initializeGraph();
    this.logger.info("[Memory:init] Initialized", {
      conversations: this.convIndex.size,
      loadedIndexes: this.indexes.size,
      bm25Chunks: this.retriever.indexSize,
      graphRag: this.strategy.getGraphStats() !== null
    });
  }
  async cleanup() {
    await this.strategy.saveGraph();
    this.retriever.clear();
    this.pathToDocId.clear();
  }
  getStats() {
    return {
      enabled: this.memoryConfig.enabled,
      conversations: this.convIndex.size,
      documentsIndexed: this.indexes.size,
      bm25Chunks: this.retriever.indexSize,
      ...this.stats,
      graphRag: this.strategy.getGraphStats()
    };
  }
  // ── Conversation CRUD ────────────────────────────────────────────────
  async createConversation(userId = "anonymous") {
    const now = Date.now();
    const conv = {
      id: crypto.randomUUID(),
      title: "New Chat",
      userId,
      messages: [],
      createdAt: now,
      updatedAt: now
    };
    await writeFile(this.convFilePath(conv.id), JSON.stringify(conv, null, 2), "utf-8");
    this.upsertConvIndex(conv);
    await this.persistConvIndex();
    return conv;
  }
  async getConversation(id) {
    try {
      const raw = await readFile(this.convFilePath(id), "utf-8");
      return JSON.parse(raw);
    } catch (err) {
      if (err?.code === "ENOENT") return null;
      this.logger.warn("Failed to read conversation", err);
      return null;
    }
  }
  async listConversations() {
    if (!this.convIndexLoaded) await this.loadConvIndex();
    return Array.from(this.convIndex.values()).sort((a, b) => b.updatedAt - a.updatedAt);
  }
  async appendMessages(id, newMessages) {
    const conv = await this.getConversation(id);
    if (!conv) return null;
    conv.messages.push(...newMessages);
    conv.title = deriveTitle(conv.messages);
    conv.updatedAt = Date.now();
    await writeFile(this.convFilePath(id), JSON.stringify(conv, null, 2), "utf-8");
    this.upsertConvIndex(conv);
    await this.persistConvIndex();
    if (this.memoryConfig.enabled && this.memoryConfig.indexConversations) {
      this.indexConversation(conv).catch((err) => {
        this.logger.warn("Background conversation indexing failed", { conversationId: id, error: toErrorMessage(err) });
      });
    }
    return conv;
  }
  async deleteConversation(id) {
    try {
      await rm(this.convFilePath(id));
      this.convIndex.delete(id);
      await this.persistConvIndex();
      this.removeDocument(`conv-${id}`).catch((err) => {
        this.logger.warn("Failed to remove memory index for conversation", { conversationId: id, error: toErrorMessage(err) });
      });
      return true;
    } catch {
      return false;
    }
  }
  async indexDocument(filePath, source) {
    if (!this.memoryConfig.enabled) return null;
    const existing = this.findIndexByPath(filePath);
    if (existing) {
      const content = await this.safeReadFile(filePath);
      if (content && this.indexer.hashContent(content) === existing.contentHash) return existing;
      this.retriever.removeDocument(existing.documentId);
    }
    const index = await this.indexer.indexFile(filePath, source);
    if (index) {
      this.indexes.set(index.documentId, index);
      if (index.filePath) this.pathToDocId.set(index.filePath, index.documentId);
      this.retriever.addDocument(index);
      await this.persistIndex(index);
      this.stats.indexingCalls++;
      this.strategy.onDocumentIndexed(index);
    }
    return index;
  }
  async indexConversation(conversation) {
    if (!this.memoryConfig.enabled || !this.memoryConfig.indexConversations) return null;
    const docId = `conv-${conversation.id}`;
    const existing = this.indexes.get(docId);
    const contentStr = conversation.messages.map((m) => `${m.role}:${m.content}`).join("\n");
    const hash = this.indexer.hashContent(contentStr);
    if (existing && existing.contentHash === hash) return existing;
    if (existing) this.retriever.removeDocument(docId);
    const index = await this.indexer.indexConversation(conversation);
    if (index) {
      this.indexes.set(index.documentId, index);
      this.retriever.addDocument(index);
      await this.persistIndex(index);
      this.stats.indexingCalls++;
      this.strategy.onDocumentIndexed(index);
    }
    return index;
  }
  async indexWorkspace(workspaceDir) {
    if (!this.memoryConfig.enabled || !this.memoryConfig.indexWorkspace) return 0;
    const files = await this.indexer.scanWorkspaceFiles(workspaceDir);
    let count = 0;
    for (const file of files) {
      const idx = await this.indexDocument(file, "workspace");
      if (idx) count++;
    }
    return count;
  }
  async reindex() {
    this.retriever.clear();
    this.strategy.clearGraph();
    for (const id of [...this.indexes.keys()]) {
      try {
        await rm(join(this.indexDir, `${id}.json`));
      } catch {
      }
    }
    this.indexes.clear();
    let count = 0;
    const workspaceDir = this.config.workspaceDir;
    if (this.memoryConfig.indexWorkspace && workspaceDir) count += await this.indexWorkspace(workspaceDir);
    const uploadFiles = await this.listUploadFiles();
    for (const f of uploadFiles) {
      const idx = await this.indexDocument(f, "upload");
      if (idx) count++;
    }
    return count;
  }
  async retrieve(query, _options) {
    const startTime = performance.now();
    this.stats.retrievalCalls++;
    if (!this.memoryConfig.enabled || this.indexes.size === 0) {
      return { query, results: [], retrievalTimeMs: 0 };
    }
    const allIndexes = [...this.indexes.values()];
    const results = await this.strategy.retrieve(query, allIndexes, this.memoryConfig.maxRetrievalNodes);
    const retrievalTimeMs = performance.now() - startTime;
    this.stats.totalRetrievalTimeMs += retrievalTimeMs;
    return { query, results, retrievalTimeMs };
  }
  async search(query) {
    const result = await this.retrieve(query);
    return result.results;
  }
  async getDocumentById(docId) {
    if (!this.memoryConfig.enabled) return null;
    const index = this.indexes.get(docId);
    if (!index) return null;
    const chunks = index.chunks;
    const sections = [...chunks].sort((a, b) => a.index - b.index).map((chunk) => ({
      nodeId: chunk.chunkId,
      nodeTitle: chunk.heading,
      content: chunk.text,
      score: void 0
    }));
    return {
      documentId: index.documentId,
      source: index.source,
      filePath: index.filePath,
      title: index.title,
      sections
    };
  }
  listDocuments() {
    return [...this.indexes.values()].map((idx) => ({
      documentId: idx.documentId,
      source: idx.source,
      title: idx.title,
      indexedAt: idx.indexedAt
    }));
  }
  async removeDocument(documentId) {
    const idx = this.indexes.get(documentId);
    if (!idx) return false;
    this.retriever.removeDocument(documentId);
    if (idx.filePath) this.pathToDocId.delete(idx.filePath);
    this.indexes.delete(documentId);
    try {
      await rm(join(this.indexDir, `${documentId}.json`));
    } catch {
    }
    return true;
  }
  getUploadsDir() {
    return this.uploadsDir;
  }
  async loadExistingIndexes() {
    try {
      const files = await readdir(this.indexDir);
      for (const f of files) {
        if (!f.endsWith(".json")) continue;
        try {
          const raw = await readFile(join(this.indexDir, f), "utf-8");
          const idx = JSON.parse(raw);
          if (idx.documentId && idx.tree && idx.chunks?.length) {
            this.indexes.set(idx.documentId, idx);
            if (idx.filePath) this.pathToDocId.set(idx.filePath, idx.documentId);
            this.retriever.addDocument(idx);
          }
        } catch {
          this.logger.warn("Skipping corrupt index file", { file: f });
        }
      }
    } catch {
    }
  }
  async persistIndex(index) {
    await writeFile(join(this.indexDir, `${index.documentId}.json`), JSON.stringify(index, null, 2), "utf-8");
  }
  findIndexByPath(filePath) {
    const docId = this.pathToDocId.get(filePath);
    return docId ? this.indexes.get(docId) : void 0;
  }
  async safeReadFile(filePath) {
    try {
      return await readFile(filePath, "utf-8");
    } catch {
      return null;
    }
  }
  async listUploadFiles() {
    try {
      const entries = await readdir(this.uploadsDir, { withFileTypes: true });
      return entries.filter((e) => e.isFile()).map((e) => join(this.uploadsDir, e.name));
    } catch {
      return [];
    }
  }
  // ── Conversation persistence helpers ─────────────────────────────────
  convFilePath(id) {
    const safe = id.replace(/[^a-zA-Z0-9_-]/g, "");
    return join(this.conversationsDir, `${safe}.json`);
  }
  get convIndexPath() {
    return join(this.conversationsDir, "_index.json");
  }
  upsertConvIndex(conv) {
    this.convIndex.set(conv.id, {
      id: conv.id,
      title: conv.title,
      userId: conv.userId,
      createdAt: conv.createdAt,
      updatedAt: conv.updatedAt
    });
  }
  async persistConvIndex() {
    try {
      const entries = Array.from(this.convIndex.values());
      await writeFile(this.convIndexPath, JSON.stringify(entries), "utf-8");
    } catch (err) {
      this.logger.warn("Failed to persist conversation index", err);
    }
  }
  async loadConvIndex() {
    try {
      const raw = await readFile(this.convIndexPath, "utf-8");
      const entries = JSON.parse(raw);
      this.convIndex.clear();
      for (const e of entries) this.convIndex.set(e.id, e);
    } catch {
    }
    this.convIndexLoaded = true;
  }
};
var DEFAULT_API_VERSION = "2023-06-01";
var DEFAULT_BETA = "prompt-caching-2024-07-31";
var AnthropicProvider = class extends BaseStreamProvider {
  name = "anthropic";
  get baseApiUrl() {
    return this.config.baseUrl.replace(/\/$/, "");
  }
  buildStreamUrl(_model) {
    return `${this.baseApiUrl}/v1/messages`;
  }
  buildCompleteUrl(_model) {
    return `${this.baseApiUrl}/v1/messages`;
  }
  buildHeaders() {
    const extra = this.config;
    return {
      "Content-Type": "application/json",
      "x-api-key": this.config.apiKey,
      "anthropic-version": extra.anthropicVersion ?? DEFAULT_API_VERSION,
      "anthropic-beta": extra.anthropicBeta ?? DEFAULT_BETA
    };
  }
  buildStreamBody(model, messages2, options) {
    const { system, messages: anthropicMsgs } = this.convertMessages(messages2);
    const tools = this.convertTools(options?.tools);
    const body = {
      model,
      messages: anthropicMsgs,
      max_tokens: options?.maxTokens ?? 4096,
      stream: true
    };
    if (system) body.system = system;
    if (tools?.length) body.tools = tools;
    return body;
  }
  buildCompleteBody(model, messages2, maxTokens) {
    const { system, messages: anthropicMsgs } = this.convertMessages(messages2);
    return {
      model,
      system: system || void 0,
      messages: anthropicMsgs,
      max_tokens: maxTokens,
      stream: false
    };
  }
  extractCompleteContent(json) {
    const data = json;
    const textBlock = data.content?.find((b) => b.type === "text");
    return textBlock?.text?.trim() || null;
  }
  parseSSEPayload(json) {
    const type = json.type;
    const chunks = [];
    const toolCalls = [];
    let usage;
    let finished = false;
    if (type === "content_block_start") {
      const block = json.content_block;
      if (block?.type === "tool_use") {
        const id = block.id ?? crypto2.randomUUID();
        toolCalls.push({
          index: id,
          id,
          name: block.name ?? "exec"
        });
      }
    }
    if (type === "content_block_delta") {
      const delta = json.delta;
      if (delta?.type === "text_delta" && typeof delta.text === "string") {
        chunks.push({ type: "content", content: delta.text });
      }
      if (delta?.type === "input_json_delta" && typeof delta.partial_json === "string") {
        toolCalls.push({
          index: this.lastToolCallId ?? "0",
          argsFragment: delta.partial_json
        });
      }
      if (delta?.type === "thinking_delta" && typeof delta.thinking === "string") {
        chunks.push({ type: "reasoning", content: delta.thinking });
      }
    }
    if (type === "message_delta") {
      const u = json.usage;
      if (u) {
        const input = u.input_tokens ?? 0;
        const output = u.output_tokens ?? 0;
        if (input || output) usage = { input, output };
      }
      finished = true;
    }
    if (type === "message_start") {
      const message = json.message;
      const u = message?.usage;
      if (u) {
        const input = u.input_tokens ?? 0;
        const output = u.output_tokens ?? 0;
        if (input || output) usage = { input, output };
      }
    }
    if (type === "message_stop") {
      finished = true;
    }
    if (toolCalls.length > 0) {
      const latestWithId = toolCalls.find((tc) => tc.id);
      if (latestWithId?.id) this.lastToolCallId = latestWithId.id;
    }
    return {
      chunks,
      toolCalls: toolCalls.length > 0 ? toolCalls : void 0,
      usage,
      finished
    };
  }
  lastToolCallId = null;
  convertMessages(messages2) {
    const { systemPrompt: system, nonSystemMessages } = extractSystemPrompt(messages2);
    const anthropicMessages = [];
    for (const msg of nonSystemMessages) {
      if (msg.role === "tool") {
        anthropicMessages.push({
          role: "user",
          content: [{
            type: "tool_result",
            tool_use_id: msg.tool_call_id,
            content: msg.content
          }]
        });
        continue;
      }
      if (msg.role === "assistant") {
        if (msg.tool_calls?.length) {
          const blocks = [];
          if (msg.content) blocks.push({ type: "text", text: msg.content });
          for (const tc of msg.tool_calls) {
            let input = {};
            try {
              input = JSON.parse(tc.function.arguments);
            } catch {
            }
            blocks.push({ type: "tool_use", id: tc.id, name: tc.function.name, input });
          }
          anthropicMessages.push({ role: "assistant", content: blocks });
        } else {
          anthropicMessages.push({
            role: "assistant",
            content: typeof msg.content === "string" ? msg.content : ""
          });
        }
        continue;
      }
      anthropicMessages.push({
        role: "user",
        content: typeof msg.content === "string" ? msg.content : JSON.stringify(msg.content)
      });
    }
    return { system, messages: anthropicMessages };
  }
  convertTools(tools) {
    if (!tools?.length) return void 0;
    return tools.map((t3) => ({
      name: t3.function.name,
      description: t3.function.description ?? "",
      input_schema: t3.function.parameters ?? { type: "object", properties: {} }
    }));
  }
};
var AnthropicProviderFactory = class {
  create(config) {
    return new AnthropicProvider("anthropic", config);
  }
};
var GeminiProvider = class extends BaseStreamProvider {
  name = "gemini";
  constructor(providerKey, config) {
    super(providerKey, config);
  }
  // -- Hook implementations -------------------------------------------------
  buildStreamUrl(model) {
    const base2 = this.config.baseUrl.replace(/\/$/, "");
    return `${base2}/v1beta/models/${model}:streamGenerateContent?alt=sse`;
  }
  buildCompleteUrl(model) {
    const base2 = this.config.baseUrl.replace(/\/$/, "");
    return `${base2}/v1beta/models/${model}:generateContent`;
  }
  buildHeaders() {
    return {
      "Content-Type": "application/json",
      "x-goog-api-key": this.config.apiKey
    };
  }
  buildCompleteBody(model, messages2, maxTokens) {
    const { systemInstruction, contents } = this.convertMessages(messages2);
    const body = {
      contents,
      generationConfig: { maxOutputTokens: maxTokens }
    };
    if (systemInstruction) body.systemInstruction = systemInstruction;
    return body;
  }
  extractCompleteContent(json) {
    const data = json;
    const text2 = data.candidates?.[0]?.content?.parts?.filter((p3) => "text" in p3).map((p3) => p3.text).join("");
    return text2?.trim() || null;
  }
  buildStreamBody(model, messages2, options) {
    const { systemInstruction, contents } = this.convertMessages(messages2);
    const tools = this.convertTools(options?.tools);
    const body = {
      contents,
      generationConfig: { maxOutputTokens: options?.maxTokens ?? 4096 }
    };
    if (systemInstruction) body.systemInstruction = systemInstruction;
    if (tools) body.tools = tools;
    return body;
  }
  parseSSEPayload(json) {
    const chunks = [];
    let usage;
    let finished = false;
    const candidates = json.candidates;
    const candidate = candidates?.[0];
    const content = candidate?.content;
    const parts = content?.parts ?? [];
    for (const part of parts) {
      if (typeof part.text === "string" && part.text) {
        chunks.push({ type: "content", content: part.text });
      }
      if (part.functionCall) {
        const fc = part.functionCall;
        chunks.push({
          type: "tool_call",
          toolCall: {
            id: crypto2.randomUUID(),
            name: fc.name,
            args: fc.args ?? {},
            status: "running"
          }
        });
      }
    }
    const usageMetadata = json.usageMetadata;
    if (usageMetadata) {
      const input = usageMetadata.promptTokenCount ?? 0;
      const output = usageMetadata.candidatesTokenCount ?? 0;
      if (input || output) usage = { input, output };
    }
    const fr = candidate?.finishReason;
    if (typeof fr === "string") finished = true;
    return { chunks, usage, finished };
  }
  // -- Gemini-specific conversion -------------------------------------------
  convertMessages(messages2) {
    const { systemPrompt: systemText, nonSystemMessages } = extractSystemPrompt(messages2);
    const contents = [];
    const toolCallIdToName = /* @__PURE__ */ new Map();
    for (const msg of nonSystemMessages) {
      if (msg.role === "tool") {
        const functionName = toolCallIdToName.get(msg.tool_call_id) ?? msg.tool_call_id;
        let responseObj;
        try {
          responseObj = JSON.parse(msg.content);
        } catch {
          responseObj = { result: msg.content };
        }
        contents.push({
          role: "user",
          parts: [{ functionResponse: { name: functionName, response: responseObj } }]
        });
        continue;
      }
      if (msg.role === "assistant") {
        const parts = [];
        if (msg.content) parts.push({ text: msg.content });
        if (msg.tool_calls) {
          for (const tc of msg.tool_calls) {
            toolCallIdToName.set(tc.id, tc.function.name);
            let args = {};
            try {
              args = JSON.parse(tc.function.arguments);
            } catch {
            }
            parts.push({ functionCall: { name: tc.function.name, args } });
          }
        }
        if (parts.length > 0) contents.push({ role: "model", parts });
        continue;
      }
      contents.push({
        role: "user",
        parts: [{ text: typeof msg.content === "string" ? msg.content : JSON.stringify(msg.content) }]
      });
    }
    return {
      systemInstruction: systemText ? { parts: [{ text: systemText }] } : void 0,
      contents
    };
  }
  convertTools(tools) {
    if (!tools?.length) return void 0;
    return [{
      functionDeclarations: tools.map((t3) => ({
        name: t3.function.name,
        description: t3.function.description ?? "",
        parameters: t3.function.parameters
      }))
    }];
  }
};
var GeminiProviderFactory = class {
  create(config) {
    return new GeminiProvider("gemini", config);
  }
};

// src/framework/bootstrap.ts
function registerDefaultProviders(registry) {
  registry.register("openai", {
    create(config) {
      return new OpenAICompatibleProvider("openai", config);
    }
  }, { version: "2025-01" });
  registry.register("anthropic", new AnthropicProviderFactory(), { version: "2025-01" });
  registry.register("gemini", new GeminiProviderFactory(), { version: "2025-01" });
  registry.register("google", new GeminiProviderFactory(), { version: "2025-01" });
  for (const key of ["openrouter", "deepseek", "mistral", "moonshot", "qwen", "scnet"]) {
    registry.register(key, {
      create(config) {
        return new OpenAICompatibleProvider(key, config);
      }
    }, { version: "2025-01" });
  }
}
function registerDefaultRules(registry, config) {
  {
    registry.register(createExecChannelRule());
  }
  {
    registry.register(createContentSafetyRule());
  }
  {
    registry.register(createThinkingStripRule());
  }
  {
    registry.register(createFormatChannelRule());
  }
}
function registerDefaultMemoryProviders(registry) {
  registry.register(
    "local",
    (config, options) => new LocalMemoryProvider(config, { llmCall: options?.llmCall }),
    { version: "2025-01" }
  );
}
function registerDefaultChannels(registry) {
  registry.register("webchat", createWebChatPlugin());
  registry.register("cli", createCLIPlugin());
  registry.register("rest-api", createRestApiPlugin());
}
function bootstrapFramework(options) {
  if (options.providerRegistry) registerDefaultProviders(options.providerRegistry);
  if (options.ruleRegistry) registerDefaultRules(options.ruleRegistry);
  if (options.memoryProviderRegistry) registerDefaultMemoryProviders(options.memoryProviderRegistry);
  if (options.channelPluginRegistry) registerDefaultChannels(options.channelPluginRegistry);
}

// node_modules/zod/v3/external.js
var external_exports = {};
__export(external_exports, {
  BRAND: () => BRAND,
  DIRTY: () => DIRTY,
  EMPTY_PATH: () => EMPTY_PATH,
  INVALID: () => INVALID,
  NEVER: () => NEVER,
  OK: () => OK,
  ParseStatus: () => ParseStatus,
  Schema: () => ZodType,
  ZodAny: () => ZodAny,
  ZodArray: () => ZodArray,
  ZodBigInt: () => ZodBigInt,
  ZodBoolean: () => ZodBoolean,
  ZodBranded: () => ZodBranded,
  ZodCatch: () => ZodCatch,
  ZodDate: () => ZodDate,
  ZodDefault: () => ZodDefault,
  ZodDiscriminatedUnion: () => ZodDiscriminatedUnion,
  ZodEffects: () => ZodEffects,
  ZodEnum: () => ZodEnum,
  ZodError: () => ZodError,
  ZodFirstPartyTypeKind: () => ZodFirstPartyTypeKind,
  ZodFunction: () => ZodFunction,
  ZodIntersection: () => ZodIntersection,
  ZodIssueCode: () => ZodIssueCode,
  ZodLazy: () => ZodLazy,
  ZodLiteral: () => ZodLiteral,
  ZodMap: () => ZodMap,
  ZodNaN: () => ZodNaN,
  ZodNativeEnum: () => ZodNativeEnum,
  ZodNever: () => ZodNever,
  ZodNull: () => ZodNull,
  ZodNullable: () => ZodNullable,
  ZodNumber: () => ZodNumber,
  ZodObject: () => ZodObject,
  ZodOptional: () => ZodOptional,
  ZodParsedType: () => ZodParsedType,
  ZodPipeline: () => ZodPipeline,
  ZodPromise: () => ZodPromise,
  ZodReadonly: () => ZodReadonly,
  ZodRecord: () => ZodRecord,
  ZodSchema: () => ZodType,
  ZodSet: () => ZodSet,
  ZodString: () => ZodString,
  ZodSymbol: () => ZodSymbol,
  ZodTransformer: () => ZodEffects,
  ZodTuple: () => ZodTuple,
  ZodType: () => ZodType,
  ZodUndefined: () => ZodUndefined,
  ZodUnion: () => ZodUnion,
  ZodUnknown: () => ZodUnknown,
  ZodVoid: () => ZodVoid,
  addIssueToContext: () => addIssueToContext,
  any: () => anyType,
  array: () => arrayType,
  bigint: () => bigIntType,
  boolean: () => booleanType,
  coerce: () => coerce,
  custom: () => custom,
  date: () => dateType,
  datetimeRegex: () => datetimeRegex,
  defaultErrorMap: () => en_default,
  discriminatedUnion: () => discriminatedUnionType,
  effect: () => effectsType,
  enum: () => enumType,
  function: () => functionType,
  getErrorMap: () => getErrorMap,
  getParsedType: () => getParsedType,
  instanceof: () => instanceOfType,
  intersection: () => intersectionType,
  isAborted: () => isAborted,
  isAsync: () => isAsync,
  isDirty: () => isDirty,
  isValid: () => isValid,
  late: () => late,
  lazy: () => lazyType,
  literal: () => literalType,
  makeIssue: () => makeIssue,
  map: () => mapType,
  nan: () => nanType,
  nativeEnum: () => nativeEnumType,
  never: () => neverType,
  null: () => nullType,
  nullable: () => nullableType,
  number: () => numberType,
  object: () => objectType,
  objectUtil: () => objectUtil,
  oboolean: () => oboolean,
  onumber: () => onumber,
  optional: () => optionalType,
  ostring: () => ostring,
  pipeline: () => pipelineType,
  preprocess: () => preprocessType,
  promise: () => promiseType,
  quotelessJson: () => quotelessJson,
  record: () => recordType,
  set: () => setType,
  setErrorMap: () => setErrorMap,
  strictObject: () => strictObjectType,
  string: () => stringType,
  symbol: () => symbolType,
  transformer: () => effectsType,
  tuple: () => tupleType,
  undefined: () => undefinedType,
  union: () => unionType,
  unknown: () => unknownType,
  util: () => util,
  void: () => voidType
});

// node_modules/zod/v3/helpers/util.js
var util;
(function(util2) {
  util2.assertEqual = (_) => {
  };
  function assertIs(_arg) {
  }
  util2.assertIs = assertIs;
  function assertNever(_x) {
    throw new Error();
  }
  util2.assertNever = assertNever;
  util2.arrayToEnum = (items) => {
    const obj = {};
    for (const item2 of items) {
      obj[item2] = item2;
    }
    return obj;
  };
  util2.getValidEnumValues = (obj) => {
    const validKeys = util2.objectKeys(obj).filter((k) => typeof obj[obj[k]] !== "number");
    const filtered = {};
    for (const k of validKeys) {
      filtered[k] = obj[k];
    }
    return util2.objectValues(filtered);
  };
  util2.objectValues = (obj) => {
    return util2.objectKeys(obj).map(function(e) {
      return obj[e];
    });
  };
  util2.objectKeys = typeof Object.keys === "function" ? (obj) => Object.keys(obj) : (object) => {
    const keys = [];
    for (const key in object) {
      if (Object.prototype.hasOwnProperty.call(object, key)) {
        keys.push(key);
      }
    }
    return keys;
  };
  util2.find = (arr, checker) => {
    for (const item2 of arr) {
      if (checker(item2))
        return item2;
    }
    return void 0;
  };
  util2.isInteger = typeof Number.isInteger === "function" ? (val) => Number.isInteger(val) : (val) => typeof val === "number" && Number.isFinite(val) && Math.floor(val) === val;
  function joinValues(array, separator = " | ") {
    return array.map((val) => typeof val === "string" ? `'${val}'` : val).join(separator);
  }
  util2.joinValues = joinValues;
  util2.jsonStringifyReplacer = (_, value) => {
    if (typeof value === "bigint") {
      return value.toString();
    }
    return value;
  };
})(util || (util = {}));
var objectUtil;
(function(objectUtil2) {
  objectUtil2.mergeShapes = (first, second) => {
    return {
      ...first,
      ...second
      // second overwrites first
    };
  };
})(objectUtil || (objectUtil = {}));
var ZodParsedType = util.arrayToEnum([
  "string",
  "nan",
  "number",
  "integer",
  "float",
  "boolean",
  "date",
  "bigint",
  "symbol",
  "function",
  "undefined",
  "null",
  "array",
  "object",
  "unknown",
  "promise",
  "void",
  "never",
  "map",
  "set"
]);
var getParsedType = (data) => {
  const t3 = typeof data;
  switch (t3) {
    case "undefined":
      return ZodParsedType.undefined;
    case "string":
      return ZodParsedType.string;
    case "number":
      return Number.isNaN(data) ? ZodParsedType.nan : ZodParsedType.number;
    case "boolean":
      return ZodParsedType.boolean;
    case "function":
      return ZodParsedType.function;
    case "bigint":
      return ZodParsedType.bigint;
    case "symbol":
      return ZodParsedType.symbol;
    case "object":
      if (Array.isArray(data)) {
        return ZodParsedType.array;
      }
      if (data === null) {
        return ZodParsedType.null;
      }
      if (data.then && typeof data.then === "function" && data.catch && typeof data.catch === "function") {
        return ZodParsedType.promise;
      }
      if (typeof Map !== "undefined" && data instanceof Map) {
        return ZodParsedType.map;
      }
      if (typeof Set !== "undefined" && data instanceof Set) {
        return ZodParsedType.set;
      }
      if (typeof Date !== "undefined" && data instanceof Date) {
        return ZodParsedType.date;
      }
      return ZodParsedType.object;
    default:
      return ZodParsedType.unknown;
  }
};

// node_modules/zod/v3/ZodError.js
var ZodIssueCode = util.arrayToEnum([
  "invalid_type",
  "invalid_literal",
  "custom",
  "invalid_union",
  "invalid_union_discriminator",
  "invalid_enum_value",
  "unrecognized_keys",
  "invalid_arguments",
  "invalid_return_type",
  "invalid_date",
  "invalid_string",
  "too_small",
  "too_big",
  "invalid_intersection_types",
  "not_multiple_of",
  "not_finite"
]);
var quotelessJson = (obj) => {
  const json = JSON.stringify(obj, null, 2);
  return json.replace(/"([^"]+)":/g, "$1:");
};
var ZodError = class _ZodError extends Error {
  get errors() {
    return this.issues;
  }
  constructor(issues) {
    super();
    this.issues = [];
    this.addIssue = (sub) => {
      this.issues = [...this.issues, sub];
    };
    this.addIssues = (subs = []) => {
      this.issues = [...this.issues, ...subs];
    };
    const actualProto = new.target.prototype;
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(this, actualProto);
    } else {
      this.__proto__ = actualProto;
    }
    this.name = "ZodError";
    this.issues = issues;
  }
  format(_mapper) {
    const mapper = _mapper || function(issue) {
      return issue.message;
    };
    const fieldErrors = { _errors: [] };
    const processError = (error) => {
      for (const issue of error.issues) {
        if (issue.code === "invalid_union") {
          issue.unionErrors.map(processError);
        } else if (issue.code === "invalid_return_type") {
          processError(issue.returnTypeError);
        } else if (issue.code === "invalid_arguments") {
          processError(issue.argumentsError);
        } else if (issue.path.length === 0) {
          fieldErrors._errors.push(mapper(issue));
        } else {
          let curr = fieldErrors;
          let i = 0;
          while (i < issue.path.length) {
            const el = issue.path[i];
            const terminal = i === issue.path.length - 1;
            if (!terminal) {
              curr[el] = curr[el] || { _errors: [] };
            } else {
              curr[el] = curr[el] || { _errors: [] };
              curr[el]._errors.push(mapper(issue));
            }
            curr = curr[el];
            i++;
          }
        }
      }
    };
    processError(this);
    return fieldErrors;
  }
  static assert(value) {
    if (!(value instanceof _ZodError)) {
      throw new Error(`Not a ZodError: ${value}`);
    }
  }
  toString() {
    return this.message;
  }
  get message() {
    return JSON.stringify(this.issues, util.jsonStringifyReplacer, 2);
  }
  get isEmpty() {
    return this.issues.length === 0;
  }
  flatten(mapper = (issue) => issue.message) {
    const fieldErrors = {};
    const formErrors = [];
    for (const sub of this.issues) {
      if (sub.path.length > 0) {
        const firstEl = sub.path[0];
        fieldErrors[firstEl] = fieldErrors[firstEl] || [];
        fieldErrors[firstEl].push(mapper(sub));
      } else {
        formErrors.push(mapper(sub));
      }
    }
    return { formErrors, fieldErrors };
  }
  get formErrors() {
    return this.flatten();
  }
};
ZodError.create = (issues) => {
  const error = new ZodError(issues);
  return error;
};

// node_modules/zod/v3/locales/en.js
var errorMap = (issue, _ctx) => {
  let message;
  switch (issue.code) {
    case ZodIssueCode.invalid_type:
      if (issue.received === ZodParsedType.undefined) {
        message = "Required";
      } else {
        message = `Expected ${issue.expected}, received ${issue.received}`;
      }
      break;
    case ZodIssueCode.invalid_literal:
      message = `Invalid literal value, expected ${JSON.stringify(issue.expected, util.jsonStringifyReplacer)}`;
      break;
    case ZodIssueCode.unrecognized_keys:
      message = `Unrecognized key(s) in object: ${util.joinValues(issue.keys, ", ")}`;
      break;
    case ZodIssueCode.invalid_union:
      message = `Invalid input`;
      break;
    case ZodIssueCode.invalid_union_discriminator:
      message = `Invalid discriminator value. Expected ${util.joinValues(issue.options)}`;
      break;
    case ZodIssueCode.invalid_enum_value:
      message = `Invalid enum value. Expected ${util.joinValues(issue.options)}, received '${issue.received}'`;
      break;
    case ZodIssueCode.invalid_arguments:
      message = `Invalid function arguments`;
      break;
    case ZodIssueCode.invalid_return_type:
      message = `Invalid function return type`;
      break;
    case ZodIssueCode.invalid_date:
      message = `Invalid date`;
      break;
    case ZodIssueCode.invalid_string:
      if (typeof issue.validation === "object") {
        if ("includes" in issue.validation) {
          message = `Invalid input: must include "${issue.validation.includes}"`;
          if (typeof issue.validation.position === "number") {
            message = `${message} at one or more positions greater than or equal to ${issue.validation.position}`;
          }
        } else if ("startsWith" in issue.validation) {
          message = `Invalid input: must start with "${issue.validation.startsWith}"`;
        } else if ("endsWith" in issue.validation) {
          message = `Invalid input: must end with "${issue.validation.endsWith}"`;
        } else {
          util.assertNever(issue.validation);
        }
      } else if (issue.validation !== "regex") {
        message = `Invalid ${issue.validation}`;
      } else {
        message = "Invalid";
      }
      break;
    case ZodIssueCode.too_small:
      if (issue.type === "array")
        message = `Array must contain ${issue.exact ? "exactly" : issue.inclusive ? `at least` : `more than`} ${issue.minimum} element(s)`;
      else if (issue.type === "string")
        message = `String must contain ${issue.exact ? "exactly" : issue.inclusive ? `at least` : `over`} ${issue.minimum} character(s)`;
      else if (issue.type === "number")
        message = `Number must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${issue.minimum}`;
      else if (issue.type === "bigint")
        message = `Number must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${issue.minimum}`;
      else if (issue.type === "date")
        message = `Date must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${new Date(Number(issue.minimum))}`;
      else
        message = "Invalid input";
      break;
    case ZodIssueCode.too_big:
      if (issue.type === "array")
        message = `Array must contain ${issue.exact ? `exactly` : issue.inclusive ? `at most` : `less than`} ${issue.maximum} element(s)`;
      else if (issue.type === "string")
        message = `String must contain ${issue.exact ? `exactly` : issue.inclusive ? `at most` : `under`} ${issue.maximum} character(s)`;
      else if (issue.type === "number")
        message = `Number must be ${issue.exact ? `exactly` : issue.inclusive ? `less than or equal to` : `less than`} ${issue.maximum}`;
      else if (issue.type === "bigint")
        message = `BigInt must be ${issue.exact ? `exactly` : issue.inclusive ? `less than or equal to` : `less than`} ${issue.maximum}`;
      else if (issue.type === "date")
        message = `Date must be ${issue.exact ? `exactly` : issue.inclusive ? `smaller than or equal to` : `smaller than`} ${new Date(Number(issue.maximum))}`;
      else
        message = "Invalid input";
      break;
    case ZodIssueCode.custom:
      message = `Invalid input`;
      break;
    case ZodIssueCode.invalid_intersection_types:
      message = `Intersection results could not be merged`;
      break;
    case ZodIssueCode.not_multiple_of:
      message = `Number must be a multiple of ${issue.multipleOf}`;
      break;
    case ZodIssueCode.not_finite:
      message = "Number must be finite";
      break;
    default:
      message = _ctx.defaultError;
      util.assertNever(issue);
  }
  return { message };
};
var en_default = errorMap;

// node_modules/zod/v3/errors.js
var overrideErrorMap = en_default;
function setErrorMap(map) {
  overrideErrorMap = map;
}
function getErrorMap() {
  return overrideErrorMap;
}

// node_modules/zod/v3/helpers/parseUtil.js
var makeIssue = (params) => {
  const { data, path: path4, errorMaps, issueData } = params;
  const fullPath = [...path4, ...issueData.path || []];
  const fullIssue = {
    ...issueData,
    path: fullPath
  };
  if (issueData.message !== void 0) {
    return {
      ...issueData,
      path: fullPath,
      message: issueData.message
    };
  }
  let errorMessage = "";
  const maps = errorMaps.filter((m) => !!m).slice().reverse();
  for (const map of maps) {
    errorMessage = map(fullIssue, { data, defaultError: errorMessage }).message;
  }
  return {
    ...issueData,
    path: fullPath,
    message: errorMessage
  };
};
var EMPTY_PATH = [];
function addIssueToContext(ctx, issueData) {
  const overrideMap = getErrorMap();
  const issue = makeIssue({
    issueData,
    data: ctx.data,
    path: ctx.path,
    errorMaps: [
      ctx.common.contextualErrorMap,
      // contextual error map is first priority
      ctx.schemaErrorMap,
      // then schema-bound map if available
      overrideMap,
      // then global override map
      overrideMap === en_default ? void 0 : en_default
      // then global default map
    ].filter((x) => !!x)
  });
  ctx.common.issues.push(issue);
}
var ParseStatus = class _ParseStatus {
  constructor() {
    this.value = "valid";
  }
  dirty() {
    if (this.value === "valid")
      this.value = "dirty";
  }
  abort() {
    if (this.value !== "aborted")
      this.value = "aborted";
  }
  static mergeArray(status, results) {
    const arrayValue = [];
    for (const s of results) {
      if (s.status === "aborted")
        return INVALID;
      if (s.status === "dirty")
        status.dirty();
      arrayValue.push(s.value);
    }
    return { status: status.value, value: arrayValue };
  }
  static async mergeObjectAsync(status, pairs) {
    const syncPairs = [];
    for (const pair of pairs) {
      const key = await pair.key;
      const value = await pair.value;
      syncPairs.push({
        key,
        value
      });
    }
    return _ParseStatus.mergeObjectSync(status, syncPairs);
  }
  static mergeObjectSync(status, pairs) {
    const finalObject = {};
    for (const pair of pairs) {
      const { key, value } = pair;
      if (key.status === "aborted")
        return INVALID;
      if (value.status === "aborted")
        return INVALID;
      if (key.status === "dirty")
        status.dirty();
      if (value.status === "dirty")
        status.dirty();
      if (key.value !== "__proto__" && (typeof value.value !== "undefined" || pair.alwaysSet)) {
        finalObject[key.value] = value.value;
      }
    }
    return { status: status.value, value: finalObject };
  }
};
var INVALID = Object.freeze({
  status: "aborted"
});
var DIRTY = (value) => ({ status: "dirty", value });
var OK = (value) => ({ status: "valid", value });
var isAborted = (x) => x.status === "aborted";
var isDirty = (x) => x.status === "dirty";
var isValid = (x) => x.status === "valid";
var isAsync = (x) => typeof Promise !== "undefined" && x instanceof Promise;

// node_modules/zod/v3/helpers/errorUtil.js
var errorUtil;
(function(errorUtil2) {
  errorUtil2.errToObj = (message) => typeof message === "string" ? { message } : message || {};
  errorUtil2.toString = (message) => typeof message === "string" ? message : message?.message;
})(errorUtil || (errorUtil = {}));

// node_modules/zod/v3/types.js
var ParseInputLazyPath = class {
  constructor(parent, value, path4, key) {
    this._cachedPath = [];
    this.parent = parent;
    this.data = value;
    this._path = path4;
    this._key = key;
  }
  get path() {
    if (!this._cachedPath.length) {
      if (Array.isArray(this._key)) {
        this._cachedPath.push(...this._path, ...this._key);
      } else {
        this._cachedPath.push(...this._path, this._key);
      }
    }
    return this._cachedPath;
  }
};
var handleResult = (ctx, result) => {
  if (isValid(result)) {
    return { success: true, data: result.value };
  } else {
    if (!ctx.common.issues.length) {
      throw new Error("Validation failed but no issues detected.");
    }
    return {
      success: false,
      get error() {
        if (this._error)
          return this._error;
        const error = new ZodError(ctx.common.issues);
        this._error = error;
        return this._error;
      }
    };
  }
};
function processCreateParams(params) {
  if (!params)
    return {};
  const { errorMap: errorMap2, invalid_type_error, required_error, description } = params;
  if (errorMap2 && (invalid_type_error || required_error)) {
    throw new Error(`Can't use "invalid_type_error" or "required_error" in conjunction with custom error map.`);
  }
  if (errorMap2)
    return { errorMap: errorMap2, description };
  const customMap = (iss, ctx) => {
    const { message } = params;
    if (iss.code === "invalid_enum_value") {
      return { message: message ?? ctx.defaultError };
    }
    if (typeof ctx.data === "undefined") {
      return { message: message ?? required_error ?? ctx.defaultError };
    }
    if (iss.code !== "invalid_type")
      return { message: ctx.defaultError };
    return { message: message ?? invalid_type_error ?? ctx.defaultError };
  };
  return { errorMap: customMap, description };
}
var ZodType = class {
  get description() {
    return this._def.description;
  }
  _getType(input) {
    return getParsedType(input.data);
  }
  _getOrReturnCtx(input, ctx) {
    return ctx || {
      common: input.parent.common,
      data: input.data,
      parsedType: getParsedType(input.data),
      schemaErrorMap: this._def.errorMap,
      path: input.path,
      parent: input.parent
    };
  }
  _processInputParams(input) {
    return {
      status: new ParseStatus(),
      ctx: {
        common: input.parent.common,
        data: input.data,
        parsedType: getParsedType(input.data),
        schemaErrorMap: this._def.errorMap,
        path: input.path,
        parent: input.parent
      }
    };
  }
  _parseSync(input) {
    const result = this._parse(input);
    if (isAsync(result)) {
      throw new Error("Synchronous parse encountered promise.");
    }
    return result;
  }
  _parseAsync(input) {
    const result = this._parse(input);
    return Promise.resolve(result);
  }
  parse(data, params) {
    const result = this.safeParse(data, params);
    if (result.success)
      return result.data;
    throw result.error;
  }
  safeParse(data, params) {
    const ctx = {
      common: {
        issues: [],
        async: params?.async ?? false,
        contextualErrorMap: params?.errorMap
      },
      path: params?.path || [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data,
      parsedType: getParsedType(data)
    };
    const result = this._parseSync({ data, path: ctx.path, parent: ctx });
    return handleResult(ctx, result);
  }
  "~validate"(data) {
    const ctx = {
      common: {
        issues: [],
        async: !!this["~standard"].async
      },
      path: [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data,
      parsedType: getParsedType(data)
    };
    if (!this["~standard"].async) {
      try {
        const result = this._parseSync({ data, path: [], parent: ctx });
        return isValid(result) ? {
          value: result.value
        } : {
          issues: ctx.common.issues
        };
      } catch (err) {
        if (err?.message?.toLowerCase()?.includes("encountered")) {
          this["~standard"].async = true;
        }
        ctx.common = {
          issues: [],
          async: true
        };
      }
    }
    return this._parseAsync({ data, path: [], parent: ctx }).then((result) => isValid(result) ? {
      value: result.value
    } : {
      issues: ctx.common.issues
    });
  }
  async parseAsync(data, params) {
    const result = await this.safeParseAsync(data, params);
    if (result.success)
      return result.data;
    throw result.error;
  }
  async safeParseAsync(data, params) {
    const ctx = {
      common: {
        issues: [],
        contextualErrorMap: params?.errorMap,
        async: true
      },
      path: params?.path || [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data,
      parsedType: getParsedType(data)
    };
    const maybeAsyncResult = this._parse({ data, path: ctx.path, parent: ctx });
    const result = await (isAsync(maybeAsyncResult) ? maybeAsyncResult : Promise.resolve(maybeAsyncResult));
    return handleResult(ctx, result);
  }
  refine(check, message) {
    const getIssueProperties = (val) => {
      if (typeof message === "string" || typeof message === "undefined") {
        return { message };
      } else if (typeof message === "function") {
        return message(val);
      } else {
        return message;
      }
    };
    return this._refinement((val, ctx) => {
      const result = check(val);
      const setError = () => ctx.addIssue({
        code: ZodIssueCode.custom,
        ...getIssueProperties(val)
      });
      if (typeof Promise !== "undefined" && result instanceof Promise) {
        return result.then((data) => {
          if (!data) {
            setError();
            return false;
          } else {
            return true;
          }
        });
      }
      if (!result) {
        setError();
        return false;
      } else {
        return true;
      }
    });
  }
  refinement(check, refinementData) {
    return this._refinement((val, ctx) => {
      if (!check(val)) {
        ctx.addIssue(typeof refinementData === "function" ? refinementData(val, ctx) : refinementData);
        return false;
      } else {
        return true;
      }
    });
  }
  _refinement(refinement) {
    return new ZodEffects({
      schema: this,
      typeName: ZodFirstPartyTypeKind.ZodEffects,
      effect: { type: "refinement", refinement }
    });
  }
  superRefine(refinement) {
    return this._refinement(refinement);
  }
  constructor(def) {
    this.spa = this.safeParseAsync;
    this._def = def;
    this.parse = this.parse.bind(this);
    this.safeParse = this.safeParse.bind(this);
    this.parseAsync = this.parseAsync.bind(this);
    this.safeParseAsync = this.safeParseAsync.bind(this);
    this.spa = this.spa.bind(this);
    this.refine = this.refine.bind(this);
    this.refinement = this.refinement.bind(this);
    this.superRefine = this.superRefine.bind(this);
    this.optional = this.optional.bind(this);
    this.nullable = this.nullable.bind(this);
    this.nullish = this.nullish.bind(this);
    this.array = this.array.bind(this);
    this.promise = this.promise.bind(this);
    this.or = this.or.bind(this);
    this.and = this.and.bind(this);
    this.transform = this.transform.bind(this);
    this.brand = this.brand.bind(this);
    this.default = this.default.bind(this);
    this.catch = this.catch.bind(this);
    this.describe = this.describe.bind(this);
    this.pipe = this.pipe.bind(this);
    this.readonly = this.readonly.bind(this);
    this.isNullable = this.isNullable.bind(this);
    this.isOptional = this.isOptional.bind(this);
    this["~standard"] = {
      version: 1,
      vendor: "zod",
      validate: (data) => this["~validate"](data)
    };
  }
  optional() {
    return ZodOptional.create(this, this._def);
  }
  nullable() {
    return ZodNullable.create(this, this._def);
  }
  nullish() {
    return this.nullable().optional();
  }
  array() {
    return ZodArray.create(this);
  }
  promise() {
    return ZodPromise.create(this, this._def);
  }
  or(option) {
    return ZodUnion.create([this, option], this._def);
  }
  and(incoming) {
    return ZodIntersection.create(this, incoming, this._def);
  }
  transform(transform) {
    return new ZodEffects({
      ...processCreateParams(this._def),
      schema: this,
      typeName: ZodFirstPartyTypeKind.ZodEffects,
      effect: { type: "transform", transform }
    });
  }
  default(def) {
    const defaultValueFunc = typeof def === "function" ? def : () => def;
    return new ZodDefault({
      ...processCreateParams(this._def),
      innerType: this,
      defaultValue: defaultValueFunc,
      typeName: ZodFirstPartyTypeKind.ZodDefault
    });
  }
  brand() {
    return new ZodBranded({
      typeName: ZodFirstPartyTypeKind.ZodBranded,
      type: this,
      ...processCreateParams(this._def)
    });
  }
  catch(def) {
    const catchValueFunc = typeof def === "function" ? def : () => def;
    return new ZodCatch({
      ...processCreateParams(this._def),
      innerType: this,
      catchValue: catchValueFunc,
      typeName: ZodFirstPartyTypeKind.ZodCatch
    });
  }
  describe(description) {
    const This = this.constructor;
    return new This({
      ...this._def,
      description
    });
  }
  pipe(target) {
    return ZodPipeline.create(this, target);
  }
  readonly() {
    return ZodReadonly.create(this);
  }
  isOptional() {
    return this.safeParse(void 0).success;
  }
  isNullable() {
    return this.safeParse(null).success;
  }
};
var cuidRegex = /^c[^\s-]{8,}$/i;
var cuid2Regex = /^[0-9a-z]+$/;
var ulidRegex = /^[0-9A-HJKMNP-TV-Z]{26}$/i;
var uuidRegex = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i;
var nanoidRegex = /^[a-z0-9_-]{21}$/i;
var jwtRegex = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/;
var durationRegex = /^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/;
var emailRegex = /^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i;
var _emojiRegex = `^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$`;
var emojiRegex;
var ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/;
var ipv4CidrRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/(3[0-2]|[12]?[0-9])$/;
var ipv6Regex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;
var ipv6CidrRegex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/;
var base64Regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
var base64urlRegex = /^([0-9a-zA-Z-_]{4})*(([0-9a-zA-Z-_]{2}(==)?)|([0-9a-zA-Z-_]{3}(=)?))?$/;
var dateRegexSource = `((\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-((0[13578]|1[02])-(0[1-9]|[12]\\d|3[01])|(0[469]|11)-(0[1-9]|[12]\\d|30)|(02)-(0[1-9]|1\\d|2[0-8])))`;
var dateRegex = new RegExp(`^${dateRegexSource}$`);
function timeRegexSource(args) {
  let secondsRegexSource = `[0-5]\\d`;
  if (args.precision) {
    secondsRegexSource = `${secondsRegexSource}\\.\\d{${args.precision}}`;
  } else if (args.precision == null) {
    secondsRegexSource = `${secondsRegexSource}(\\.\\d+)?`;
  }
  const secondsQuantifier = args.precision ? "+" : "?";
  return `([01]\\d|2[0-3]):[0-5]\\d(:${secondsRegexSource})${secondsQuantifier}`;
}
function timeRegex(args) {
  return new RegExp(`^${timeRegexSource(args)}$`);
}
function datetimeRegex(args) {
  let regex = `${dateRegexSource}T${timeRegexSource(args)}`;
  const opts = [];
  opts.push(args.local ? `Z?` : `Z`);
  if (args.offset)
    opts.push(`([+-]\\d{2}:?\\d{2})`);
  regex = `${regex}(${opts.join("|")})`;
  return new RegExp(`^${regex}$`);
}
function isValidIP(ip, version) {
  if ((version === "v4" || !version) && ipv4Regex.test(ip)) {
    return true;
  }
  if ((version === "v6" || !version) && ipv6Regex.test(ip)) {
    return true;
  }
  return false;
}
function isValidJWT(jwt, alg) {
  if (!jwtRegex.test(jwt))
    return false;
  try {
    const [header] = jwt.split(".");
    if (!header)
      return false;
    const base64 = header.replace(/-/g, "+").replace(/_/g, "/").padEnd(header.length + (4 - header.length % 4) % 4, "=");
    const decoded = JSON.parse(atob(base64));
    if (typeof decoded !== "object" || decoded === null)
      return false;
    if ("typ" in decoded && decoded?.typ !== "JWT")
      return false;
    if (!decoded.alg)
      return false;
    if (alg && decoded.alg !== alg)
      return false;
    return true;
  } catch {
    return false;
  }
}
function isValidCidr(ip, version) {
  if ((version === "v4" || !version) && ipv4CidrRegex.test(ip)) {
    return true;
  }
  if ((version === "v6" || !version) && ipv6CidrRegex.test(ip)) {
    return true;
  }
  return false;
}
var ZodString = class _ZodString extends ZodType {
  _parse(input) {
    if (this._def.coerce) {
      input.data = String(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.string) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.string,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    const status = new ParseStatus();
    let ctx = void 0;
    for (const check of this._def.checks) {
      if (check.kind === "min") {
        if (input.data.length < check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            minimum: check.value,
            type: "string",
            inclusive: true,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        if (input.data.length > check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            maximum: check.value,
            type: "string",
            inclusive: true,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "length") {
        const tooBig = input.data.length > check.value;
        const tooSmall = input.data.length < check.value;
        if (tooBig || tooSmall) {
          ctx = this._getOrReturnCtx(input, ctx);
          if (tooBig) {
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_big,
              maximum: check.value,
              type: "string",
              inclusive: true,
              exact: true,
              message: check.message
            });
          } else if (tooSmall) {
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_small,
              minimum: check.value,
              type: "string",
              inclusive: true,
              exact: true,
              message: check.message
            });
          }
          status.dirty();
        }
      } else if (check.kind === "email") {
        if (!emailRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "email",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "emoji") {
        if (!emojiRegex) {
          emojiRegex = new RegExp(_emojiRegex, "u");
        }
        if (!emojiRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "emoji",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "uuid") {
        if (!uuidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "uuid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "nanoid") {
        if (!nanoidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "nanoid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "cuid") {
        if (!cuidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "cuid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "cuid2") {
        if (!cuid2Regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "cuid2",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "ulid") {
        if (!ulidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "ulid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "url") {
        try {
          new URL(input.data);
        } catch {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "url",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "regex") {
        check.regex.lastIndex = 0;
        const testResult = check.regex.test(input.data);
        if (!testResult) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "regex",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "trim") {
        input.data = input.data.trim();
      } else if (check.kind === "includes") {
        if (!input.data.includes(check.value, check.position)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: { includes: check.value, position: check.position },
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "toLowerCase") {
        input.data = input.data.toLowerCase();
      } else if (check.kind === "toUpperCase") {
        input.data = input.data.toUpperCase();
      } else if (check.kind === "startsWith") {
        if (!input.data.startsWith(check.value)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: { startsWith: check.value },
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "endsWith") {
        if (!input.data.endsWith(check.value)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: { endsWith: check.value },
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "datetime") {
        const regex = datetimeRegex(check);
        if (!regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: "datetime",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "date") {
        const regex = dateRegex;
        if (!regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: "date",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "time") {
        const regex = timeRegex(check);
        if (!regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: "time",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "duration") {
        if (!durationRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "duration",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "ip") {
        if (!isValidIP(input.data, check.version)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "ip",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "jwt") {
        if (!isValidJWT(input.data, check.alg)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "jwt",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "cidr") {
        if (!isValidCidr(input.data, check.version)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "cidr",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "base64") {
        if (!base64Regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "base64",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "base64url") {
        if (!base64urlRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "base64url",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return { status: status.value, value: input.data };
  }
  _regex(regex, validation, message) {
    return this.refinement((data) => regex.test(data), {
      validation,
      code: ZodIssueCode.invalid_string,
      ...errorUtil.errToObj(message)
    });
  }
  _addCheck(check) {
    return new _ZodString({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  email(message) {
    return this._addCheck({ kind: "email", ...errorUtil.errToObj(message) });
  }
  url(message) {
    return this._addCheck({ kind: "url", ...errorUtil.errToObj(message) });
  }
  emoji(message) {
    return this._addCheck({ kind: "emoji", ...errorUtil.errToObj(message) });
  }
  uuid(message) {
    return this._addCheck({ kind: "uuid", ...errorUtil.errToObj(message) });
  }
  nanoid(message) {
    return this._addCheck({ kind: "nanoid", ...errorUtil.errToObj(message) });
  }
  cuid(message) {
    return this._addCheck({ kind: "cuid", ...errorUtil.errToObj(message) });
  }
  cuid2(message) {
    return this._addCheck({ kind: "cuid2", ...errorUtil.errToObj(message) });
  }
  ulid(message) {
    return this._addCheck({ kind: "ulid", ...errorUtil.errToObj(message) });
  }
  base64(message) {
    return this._addCheck({ kind: "base64", ...errorUtil.errToObj(message) });
  }
  base64url(message) {
    return this._addCheck({
      kind: "base64url",
      ...errorUtil.errToObj(message)
    });
  }
  jwt(options) {
    return this._addCheck({ kind: "jwt", ...errorUtil.errToObj(options) });
  }
  ip(options) {
    return this._addCheck({ kind: "ip", ...errorUtil.errToObj(options) });
  }
  cidr(options) {
    return this._addCheck({ kind: "cidr", ...errorUtil.errToObj(options) });
  }
  datetime(options) {
    if (typeof options === "string") {
      return this._addCheck({
        kind: "datetime",
        precision: null,
        offset: false,
        local: false,
        message: options
      });
    }
    return this._addCheck({
      kind: "datetime",
      precision: typeof options?.precision === "undefined" ? null : options?.precision,
      offset: options?.offset ?? false,
      local: options?.local ?? false,
      ...errorUtil.errToObj(options?.message)
    });
  }
  date(message) {
    return this._addCheck({ kind: "date", message });
  }
  time(options) {
    if (typeof options === "string") {
      return this._addCheck({
        kind: "time",
        precision: null,
        message: options
      });
    }
    return this._addCheck({
      kind: "time",
      precision: typeof options?.precision === "undefined" ? null : options?.precision,
      ...errorUtil.errToObj(options?.message)
    });
  }
  duration(message) {
    return this._addCheck({ kind: "duration", ...errorUtil.errToObj(message) });
  }
  regex(regex, message) {
    return this._addCheck({
      kind: "regex",
      regex,
      ...errorUtil.errToObj(message)
    });
  }
  includes(value, options) {
    return this._addCheck({
      kind: "includes",
      value,
      position: options?.position,
      ...errorUtil.errToObj(options?.message)
    });
  }
  startsWith(value, message) {
    return this._addCheck({
      kind: "startsWith",
      value,
      ...errorUtil.errToObj(message)
    });
  }
  endsWith(value, message) {
    return this._addCheck({
      kind: "endsWith",
      value,
      ...errorUtil.errToObj(message)
    });
  }
  min(minLength, message) {
    return this._addCheck({
      kind: "min",
      value: minLength,
      ...errorUtil.errToObj(message)
    });
  }
  max(maxLength, message) {
    return this._addCheck({
      kind: "max",
      value: maxLength,
      ...errorUtil.errToObj(message)
    });
  }
  length(len, message) {
    return this._addCheck({
      kind: "length",
      value: len,
      ...errorUtil.errToObj(message)
    });
  }
  /**
   * Equivalent to `.min(1)`
   */
  nonempty(message) {
    return this.min(1, errorUtil.errToObj(message));
  }
  trim() {
    return new _ZodString({
      ...this._def,
      checks: [...this._def.checks, { kind: "trim" }]
    });
  }
  toLowerCase() {
    return new _ZodString({
      ...this._def,
      checks: [...this._def.checks, { kind: "toLowerCase" }]
    });
  }
  toUpperCase() {
    return new _ZodString({
      ...this._def,
      checks: [...this._def.checks, { kind: "toUpperCase" }]
    });
  }
  get isDatetime() {
    return !!this._def.checks.find((ch) => ch.kind === "datetime");
  }
  get isDate() {
    return !!this._def.checks.find((ch) => ch.kind === "date");
  }
  get isTime() {
    return !!this._def.checks.find((ch) => ch.kind === "time");
  }
  get isDuration() {
    return !!this._def.checks.find((ch) => ch.kind === "duration");
  }
  get isEmail() {
    return !!this._def.checks.find((ch) => ch.kind === "email");
  }
  get isURL() {
    return !!this._def.checks.find((ch) => ch.kind === "url");
  }
  get isEmoji() {
    return !!this._def.checks.find((ch) => ch.kind === "emoji");
  }
  get isUUID() {
    return !!this._def.checks.find((ch) => ch.kind === "uuid");
  }
  get isNANOID() {
    return !!this._def.checks.find((ch) => ch.kind === "nanoid");
  }
  get isCUID() {
    return !!this._def.checks.find((ch) => ch.kind === "cuid");
  }
  get isCUID2() {
    return !!this._def.checks.find((ch) => ch.kind === "cuid2");
  }
  get isULID() {
    return !!this._def.checks.find((ch) => ch.kind === "ulid");
  }
  get isIP() {
    return !!this._def.checks.find((ch) => ch.kind === "ip");
  }
  get isCIDR() {
    return !!this._def.checks.find((ch) => ch.kind === "cidr");
  }
  get isBase64() {
    return !!this._def.checks.find((ch) => ch.kind === "base64");
  }
  get isBase64url() {
    return !!this._def.checks.find((ch) => ch.kind === "base64url");
  }
  get minLength() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min;
  }
  get maxLength() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max;
  }
};
ZodString.create = (params) => {
  return new ZodString({
    checks: [],
    typeName: ZodFirstPartyTypeKind.ZodString,
    coerce: params?.coerce ?? false,
    ...processCreateParams(params)
  });
};
function floatSafeRemainder(val, step2) {
  const valDecCount = (val.toString().split(".")[1] || "").length;
  const stepDecCount = (step2.toString().split(".")[1] || "").length;
  const decCount = valDecCount > stepDecCount ? valDecCount : stepDecCount;
  const valInt = Number.parseInt(val.toFixed(decCount).replace(".", ""));
  const stepInt = Number.parseInt(step2.toFixed(decCount).replace(".", ""));
  return valInt % stepInt / 10 ** decCount;
}
var ZodNumber = class _ZodNumber extends ZodType {
  constructor() {
    super(...arguments);
    this.min = this.gte;
    this.max = this.lte;
    this.step = this.multipleOf;
  }
  _parse(input) {
    if (this._def.coerce) {
      input.data = Number(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.number) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.number,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    let ctx = void 0;
    const status = new ParseStatus();
    for (const check of this._def.checks) {
      if (check.kind === "int") {
        if (!util.isInteger(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: "integer",
            received: "float",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "min") {
        const tooSmall = check.inclusive ? input.data < check.value : input.data <= check.value;
        if (tooSmall) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            minimum: check.value,
            type: "number",
            inclusive: check.inclusive,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        const tooBig = check.inclusive ? input.data > check.value : input.data >= check.value;
        if (tooBig) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            maximum: check.value,
            type: "number",
            inclusive: check.inclusive,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "multipleOf") {
        if (floatSafeRemainder(input.data, check.value) !== 0) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.not_multiple_of,
            multipleOf: check.value,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "finite") {
        if (!Number.isFinite(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.not_finite,
            message: check.message
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return { status: status.value, value: input.data };
  }
  gte(value, message) {
    return this.setLimit("min", value, true, errorUtil.toString(message));
  }
  gt(value, message) {
    return this.setLimit("min", value, false, errorUtil.toString(message));
  }
  lte(value, message) {
    return this.setLimit("max", value, true, errorUtil.toString(message));
  }
  lt(value, message) {
    return this.setLimit("max", value, false, errorUtil.toString(message));
  }
  setLimit(kind, value, inclusive, message) {
    return new _ZodNumber({
      ...this._def,
      checks: [
        ...this._def.checks,
        {
          kind,
          value,
          inclusive,
          message: errorUtil.toString(message)
        }
      ]
    });
  }
  _addCheck(check) {
    return new _ZodNumber({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  int(message) {
    return this._addCheck({
      kind: "int",
      message: errorUtil.toString(message)
    });
  }
  positive(message) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  negative(message) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  nonpositive(message) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  nonnegative(message) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  multipleOf(value, message) {
    return this._addCheck({
      kind: "multipleOf",
      value,
      message: errorUtil.toString(message)
    });
  }
  finite(message) {
    return this._addCheck({
      kind: "finite",
      message: errorUtil.toString(message)
    });
  }
  safe(message) {
    return this._addCheck({
      kind: "min",
      inclusive: true,
      value: Number.MIN_SAFE_INTEGER,
      message: errorUtil.toString(message)
    })._addCheck({
      kind: "max",
      inclusive: true,
      value: Number.MAX_SAFE_INTEGER,
      message: errorUtil.toString(message)
    });
  }
  get minValue() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min;
  }
  get maxValue() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max;
  }
  get isInt() {
    return !!this._def.checks.find((ch) => ch.kind === "int" || ch.kind === "multipleOf" && util.isInteger(ch.value));
  }
  get isFinite() {
    let max = null;
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "finite" || ch.kind === "int" || ch.kind === "multipleOf") {
        return true;
      } else if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      } else if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return Number.isFinite(min) && Number.isFinite(max);
  }
};
ZodNumber.create = (params) => {
  return new ZodNumber({
    checks: [],
    typeName: ZodFirstPartyTypeKind.ZodNumber,
    coerce: params?.coerce || false,
    ...processCreateParams(params)
  });
};
var ZodBigInt = class _ZodBigInt extends ZodType {
  constructor() {
    super(...arguments);
    this.min = this.gte;
    this.max = this.lte;
  }
  _parse(input) {
    if (this._def.coerce) {
      try {
        input.data = BigInt(input.data);
      } catch {
        return this._getInvalidInput(input);
      }
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.bigint) {
      return this._getInvalidInput(input);
    }
    let ctx = void 0;
    const status = new ParseStatus();
    for (const check of this._def.checks) {
      if (check.kind === "min") {
        const tooSmall = check.inclusive ? input.data < check.value : input.data <= check.value;
        if (tooSmall) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            type: "bigint",
            minimum: check.value,
            inclusive: check.inclusive,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        const tooBig = check.inclusive ? input.data > check.value : input.data >= check.value;
        if (tooBig) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            type: "bigint",
            maximum: check.value,
            inclusive: check.inclusive,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "multipleOf") {
        if (input.data % check.value !== BigInt(0)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.not_multiple_of,
            multipleOf: check.value,
            message: check.message
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return { status: status.value, value: input.data };
  }
  _getInvalidInput(input) {
    const ctx = this._getOrReturnCtx(input);
    addIssueToContext(ctx, {
      code: ZodIssueCode.invalid_type,
      expected: ZodParsedType.bigint,
      received: ctx.parsedType
    });
    return INVALID;
  }
  gte(value, message) {
    return this.setLimit("min", value, true, errorUtil.toString(message));
  }
  gt(value, message) {
    return this.setLimit("min", value, false, errorUtil.toString(message));
  }
  lte(value, message) {
    return this.setLimit("max", value, true, errorUtil.toString(message));
  }
  lt(value, message) {
    return this.setLimit("max", value, false, errorUtil.toString(message));
  }
  setLimit(kind, value, inclusive, message) {
    return new _ZodBigInt({
      ...this._def,
      checks: [
        ...this._def.checks,
        {
          kind,
          value,
          inclusive,
          message: errorUtil.toString(message)
        }
      ]
    });
  }
  _addCheck(check) {
    return new _ZodBigInt({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  positive(message) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  negative(message) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  nonpositive(message) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  nonnegative(message) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  multipleOf(value, message) {
    return this._addCheck({
      kind: "multipleOf",
      value,
      message: errorUtil.toString(message)
    });
  }
  get minValue() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min;
  }
  get maxValue() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max;
  }
};
ZodBigInt.create = (params) => {
  return new ZodBigInt({
    checks: [],
    typeName: ZodFirstPartyTypeKind.ZodBigInt,
    coerce: params?.coerce ?? false,
    ...processCreateParams(params)
  });
};
var ZodBoolean = class extends ZodType {
  _parse(input) {
    if (this._def.coerce) {
      input.data = Boolean(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.boolean) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.boolean,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
ZodBoolean.create = (params) => {
  return new ZodBoolean({
    typeName: ZodFirstPartyTypeKind.ZodBoolean,
    coerce: params?.coerce || false,
    ...processCreateParams(params)
  });
};
var ZodDate = class _ZodDate extends ZodType {
  _parse(input) {
    if (this._def.coerce) {
      input.data = new Date(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.date) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.date,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    if (Number.isNaN(input.data.getTime())) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_date
      });
      return INVALID;
    }
    const status = new ParseStatus();
    let ctx = void 0;
    for (const check of this._def.checks) {
      if (check.kind === "min") {
        if (input.data.getTime() < check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            message: check.message,
            inclusive: true,
            exact: false,
            minimum: check.value,
            type: "date"
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        if (input.data.getTime() > check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            message: check.message,
            inclusive: true,
            exact: false,
            maximum: check.value,
            type: "date"
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return {
      status: status.value,
      value: new Date(input.data.getTime())
    };
  }
  _addCheck(check) {
    return new _ZodDate({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  min(minDate, message) {
    return this._addCheck({
      kind: "min",
      value: minDate.getTime(),
      message: errorUtil.toString(message)
    });
  }
  max(maxDate, message) {
    return this._addCheck({
      kind: "max",
      value: maxDate.getTime(),
      message: errorUtil.toString(message)
    });
  }
  get minDate() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min != null ? new Date(min) : null;
  }
  get maxDate() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max != null ? new Date(max) : null;
  }
};
ZodDate.create = (params) => {
  return new ZodDate({
    checks: [],
    coerce: params?.coerce || false,
    typeName: ZodFirstPartyTypeKind.ZodDate,
    ...processCreateParams(params)
  });
};
var ZodSymbol = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.symbol) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.symbol,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
ZodSymbol.create = (params) => {
  return new ZodSymbol({
    typeName: ZodFirstPartyTypeKind.ZodSymbol,
    ...processCreateParams(params)
  });
};
var ZodUndefined = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.undefined) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.undefined,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
ZodUndefined.create = (params) => {
  return new ZodUndefined({
    typeName: ZodFirstPartyTypeKind.ZodUndefined,
    ...processCreateParams(params)
  });
};
var ZodNull = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.null) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.null,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
ZodNull.create = (params) => {
  return new ZodNull({
    typeName: ZodFirstPartyTypeKind.ZodNull,
    ...processCreateParams(params)
  });
};
var ZodAny = class extends ZodType {
  constructor() {
    super(...arguments);
    this._any = true;
  }
  _parse(input) {
    return OK(input.data);
  }
};
ZodAny.create = (params) => {
  return new ZodAny({
    typeName: ZodFirstPartyTypeKind.ZodAny,
    ...processCreateParams(params)
  });
};
var ZodUnknown = class extends ZodType {
  constructor() {
    super(...arguments);
    this._unknown = true;
  }
  _parse(input) {
    return OK(input.data);
  }
};
ZodUnknown.create = (params) => {
  return new ZodUnknown({
    typeName: ZodFirstPartyTypeKind.ZodUnknown,
    ...processCreateParams(params)
  });
};
var ZodNever = class extends ZodType {
  _parse(input) {
    const ctx = this._getOrReturnCtx(input);
    addIssueToContext(ctx, {
      code: ZodIssueCode.invalid_type,
      expected: ZodParsedType.never,
      received: ctx.parsedType
    });
    return INVALID;
  }
};
ZodNever.create = (params) => {
  return new ZodNever({
    typeName: ZodFirstPartyTypeKind.ZodNever,
    ...processCreateParams(params)
  });
};
var ZodVoid = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.undefined) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.void,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
ZodVoid.create = (params) => {
  return new ZodVoid({
    typeName: ZodFirstPartyTypeKind.ZodVoid,
    ...processCreateParams(params)
  });
};
var ZodArray = class _ZodArray extends ZodType {
  _parse(input) {
    const { ctx, status } = this._processInputParams(input);
    const def = this._def;
    if (ctx.parsedType !== ZodParsedType.array) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.array,
        received: ctx.parsedType
      });
      return INVALID;
    }
    if (def.exactLength !== null) {
      const tooBig = ctx.data.length > def.exactLength.value;
      const tooSmall = ctx.data.length < def.exactLength.value;
      if (tooBig || tooSmall) {
        addIssueToContext(ctx, {
          code: tooBig ? ZodIssueCode.too_big : ZodIssueCode.too_small,
          minimum: tooSmall ? def.exactLength.value : void 0,
          maximum: tooBig ? def.exactLength.value : void 0,
          type: "array",
          inclusive: true,
          exact: true,
          message: def.exactLength.message
        });
        status.dirty();
      }
    }
    if (def.minLength !== null) {
      if (ctx.data.length < def.minLength.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_small,
          minimum: def.minLength.value,
          type: "array",
          inclusive: true,
          exact: false,
          message: def.minLength.message
        });
        status.dirty();
      }
    }
    if (def.maxLength !== null) {
      if (ctx.data.length > def.maxLength.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_big,
          maximum: def.maxLength.value,
          type: "array",
          inclusive: true,
          exact: false,
          message: def.maxLength.message
        });
        status.dirty();
      }
    }
    if (ctx.common.async) {
      return Promise.all([...ctx.data].map((item2, i) => {
        return def.type._parseAsync(new ParseInputLazyPath(ctx, item2, ctx.path, i));
      })).then((result2) => {
        return ParseStatus.mergeArray(status, result2);
      });
    }
    const result = [...ctx.data].map((item2, i) => {
      return def.type._parseSync(new ParseInputLazyPath(ctx, item2, ctx.path, i));
    });
    return ParseStatus.mergeArray(status, result);
  }
  get element() {
    return this._def.type;
  }
  min(minLength, message) {
    return new _ZodArray({
      ...this._def,
      minLength: { value: minLength, message: errorUtil.toString(message) }
    });
  }
  max(maxLength, message) {
    return new _ZodArray({
      ...this._def,
      maxLength: { value: maxLength, message: errorUtil.toString(message) }
    });
  }
  length(len, message) {
    return new _ZodArray({
      ...this._def,
      exactLength: { value: len, message: errorUtil.toString(message) }
    });
  }
  nonempty(message) {
    return this.min(1, message);
  }
};
ZodArray.create = (schema, params) => {
  return new ZodArray({
    type: schema,
    minLength: null,
    maxLength: null,
    exactLength: null,
    typeName: ZodFirstPartyTypeKind.ZodArray,
    ...processCreateParams(params)
  });
};
function deepPartialify(schema) {
  if (schema instanceof ZodObject) {
    const newShape = {};
    for (const key in schema.shape) {
      const fieldSchema = schema.shape[key];
      newShape[key] = ZodOptional.create(deepPartialify(fieldSchema));
    }
    return new ZodObject({
      ...schema._def,
      shape: () => newShape
    });
  } else if (schema instanceof ZodArray) {
    return new ZodArray({
      ...schema._def,
      type: deepPartialify(schema.element)
    });
  } else if (schema instanceof ZodOptional) {
    return ZodOptional.create(deepPartialify(schema.unwrap()));
  } else if (schema instanceof ZodNullable) {
    return ZodNullable.create(deepPartialify(schema.unwrap()));
  } else if (schema instanceof ZodTuple) {
    return ZodTuple.create(schema.items.map((item2) => deepPartialify(item2)));
  } else {
    return schema;
  }
}
var ZodObject = class _ZodObject extends ZodType {
  constructor() {
    super(...arguments);
    this._cached = null;
    this.nonstrict = this.passthrough;
    this.augment = this.extend;
  }
  _getCached() {
    if (this._cached !== null)
      return this._cached;
    const shape = this._def.shape();
    const keys = util.objectKeys(shape);
    this._cached = { shape, keys };
    return this._cached;
  }
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.object) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.object,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    const { status, ctx } = this._processInputParams(input);
    const { shape, keys: shapeKeys } = this._getCached();
    const extraKeys = [];
    if (!(this._def.catchall instanceof ZodNever && this._def.unknownKeys === "strip")) {
      for (const key in ctx.data) {
        if (!shapeKeys.includes(key)) {
          extraKeys.push(key);
        }
      }
    }
    const pairs = [];
    for (const key of shapeKeys) {
      const keyValidator = shape[key];
      const value = ctx.data[key];
      pairs.push({
        key: { status: "valid", value: key },
        value: keyValidator._parse(new ParseInputLazyPath(ctx, value, ctx.path, key)),
        alwaysSet: key in ctx.data
      });
    }
    if (this._def.catchall instanceof ZodNever) {
      const unknownKeys = this._def.unknownKeys;
      if (unknownKeys === "passthrough") {
        for (const key of extraKeys) {
          pairs.push({
            key: { status: "valid", value: key },
            value: { status: "valid", value: ctx.data[key] }
          });
        }
      } else if (unknownKeys === "strict") {
        if (extraKeys.length > 0) {
          addIssueToContext(ctx, {
            code: ZodIssueCode.unrecognized_keys,
            keys: extraKeys
          });
          status.dirty();
        }
      } else if (unknownKeys === "strip") ; else {
        throw new Error(`Internal ZodObject error: invalid unknownKeys value.`);
      }
    } else {
      const catchall = this._def.catchall;
      for (const key of extraKeys) {
        const value = ctx.data[key];
        pairs.push({
          key: { status: "valid", value: key },
          value: catchall._parse(
            new ParseInputLazyPath(ctx, value, ctx.path, key)
            //, ctx.child(key), value, getParsedType(value)
          ),
          alwaysSet: key in ctx.data
        });
      }
    }
    if (ctx.common.async) {
      return Promise.resolve().then(async () => {
        const syncPairs = [];
        for (const pair of pairs) {
          const key = await pair.key;
          const value = await pair.value;
          syncPairs.push({
            key,
            value,
            alwaysSet: pair.alwaysSet
          });
        }
        return syncPairs;
      }).then((syncPairs) => {
        return ParseStatus.mergeObjectSync(status, syncPairs);
      });
    } else {
      return ParseStatus.mergeObjectSync(status, pairs);
    }
  }
  get shape() {
    return this._def.shape();
  }
  strict(message) {
    errorUtil.errToObj;
    return new _ZodObject({
      ...this._def,
      unknownKeys: "strict",
      ...message !== void 0 ? {
        errorMap: (issue, ctx) => {
          const defaultError = this._def.errorMap?.(issue, ctx).message ?? ctx.defaultError;
          if (issue.code === "unrecognized_keys")
            return {
              message: errorUtil.errToObj(message).message ?? defaultError
            };
          return {
            message: defaultError
          };
        }
      } : {}
    });
  }
  strip() {
    return new _ZodObject({
      ...this._def,
      unknownKeys: "strip"
    });
  }
  passthrough() {
    return new _ZodObject({
      ...this._def,
      unknownKeys: "passthrough"
    });
  }
  // const AugmentFactory =
  //   <Def extends ZodObjectDef>(def: Def) =>
  //   <Augmentation extends ZodRawShape>(
  //     augmentation: Augmentation
  //   ): ZodObject<
  //     extendShape<ReturnType<Def["shape"]>, Augmentation>,
  //     Def["unknownKeys"],
  //     Def["catchall"]
  //   > => {
  //     return new ZodObject({
  //       ...def,
  //       shape: () => ({
  //         ...def.shape(),
  //         ...augmentation,
  //       }),
  //     }) as any;
  //   };
  extend(augmentation) {
    return new _ZodObject({
      ...this._def,
      shape: () => ({
        ...this._def.shape(),
        ...augmentation
      })
    });
  }
  /**
   * Prior to zod@1.0.12 there was a bug in the
   * inferred type of merged objects. Please
   * upgrade if you are experiencing issues.
   */
  merge(merging) {
    const merged = new _ZodObject({
      unknownKeys: merging._def.unknownKeys,
      catchall: merging._def.catchall,
      shape: () => ({
        ...this._def.shape(),
        ...merging._def.shape()
      }),
      typeName: ZodFirstPartyTypeKind.ZodObject
    });
    return merged;
  }
  // merge<
  //   Incoming extends AnyZodObject,
  //   Augmentation extends Incoming["shape"],
  //   NewOutput extends {
  //     [k in keyof Augmentation | keyof Output]: k extends keyof Augmentation
  //       ? Augmentation[k]["_output"]
  //       : k extends keyof Output
  //       ? Output[k]
  //       : never;
  //   },
  //   NewInput extends {
  //     [k in keyof Augmentation | keyof Input]: k extends keyof Augmentation
  //       ? Augmentation[k]["_input"]
  //       : k extends keyof Input
  //       ? Input[k]
  //       : never;
  //   }
  // >(
  //   merging: Incoming
  // ): ZodObject<
  //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
  //   Incoming["_def"]["unknownKeys"],
  //   Incoming["_def"]["catchall"],
  //   NewOutput,
  //   NewInput
  // > {
  //   const merged: any = new ZodObject({
  //     unknownKeys: merging._def.unknownKeys,
  //     catchall: merging._def.catchall,
  //     shape: () =>
  //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
  //     typeName: ZodFirstPartyTypeKind.ZodObject,
  //   }) as any;
  //   return merged;
  // }
  setKey(key, schema) {
    return this.augment({ [key]: schema });
  }
  // merge<Incoming extends AnyZodObject>(
  //   merging: Incoming
  // ): //ZodObject<T & Incoming["_shape"], UnknownKeys, Catchall> = (merging) => {
  // ZodObject<
  //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
  //   Incoming["_def"]["unknownKeys"],
  //   Incoming["_def"]["catchall"]
  // > {
  //   // const mergedShape = objectUtil.mergeShapes(
  //   //   this._def.shape(),
  //   //   merging._def.shape()
  //   // );
  //   const merged: any = new ZodObject({
  //     unknownKeys: merging._def.unknownKeys,
  //     catchall: merging._def.catchall,
  //     shape: () =>
  //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
  //     typeName: ZodFirstPartyTypeKind.ZodObject,
  //   }) as any;
  //   return merged;
  // }
  catchall(index) {
    return new _ZodObject({
      ...this._def,
      catchall: index
    });
  }
  pick(mask) {
    const shape = {};
    for (const key of util.objectKeys(mask)) {
      if (mask[key] && this.shape[key]) {
        shape[key] = this.shape[key];
      }
    }
    return new _ZodObject({
      ...this._def,
      shape: () => shape
    });
  }
  omit(mask) {
    const shape = {};
    for (const key of util.objectKeys(this.shape)) {
      if (!mask[key]) {
        shape[key] = this.shape[key];
      }
    }
    return new _ZodObject({
      ...this._def,
      shape: () => shape
    });
  }
  /**
   * @deprecated
   */
  deepPartial() {
    return deepPartialify(this);
  }
  partial(mask) {
    const newShape = {};
    for (const key of util.objectKeys(this.shape)) {
      const fieldSchema = this.shape[key];
      if (mask && !mask[key]) {
        newShape[key] = fieldSchema;
      } else {
        newShape[key] = fieldSchema.optional();
      }
    }
    return new _ZodObject({
      ...this._def,
      shape: () => newShape
    });
  }
  required(mask) {
    const newShape = {};
    for (const key of util.objectKeys(this.shape)) {
      if (mask && !mask[key]) {
        newShape[key] = this.shape[key];
      } else {
        const fieldSchema = this.shape[key];
        let newField = fieldSchema;
        while (newField instanceof ZodOptional) {
          newField = newField._def.innerType;
        }
        newShape[key] = newField;
      }
    }
    return new _ZodObject({
      ...this._def,
      shape: () => newShape
    });
  }
  keyof() {
    return createZodEnum(util.objectKeys(this.shape));
  }
};
ZodObject.create = (shape, params) => {
  return new ZodObject({
    shape: () => shape,
    unknownKeys: "strip",
    catchall: ZodNever.create(),
    typeName: ZodFirstPartyTypeKind.ZodObject,
    ...processCreateParams(params)
  });
};
ZodObject.strictCreate = (shape, params) => {
  return new ZodObject({
    shape: () => shape,
    unknownKeys: "strict",
    catchall: ZodNever.create(),
    typeName: ZodFirstPartyTypeKind.ZodObject,
    ...processCreateParams(params)
  });
};
ZodObject.lazycreate = (shape, params) => {
  return new ZodObject({
    shape,
    unknownKeys: "strip",
    catchall: ZodNever.create(),
    typeName: ZodFirstPartyTypeKind.ZodObject,
    ...processCreateParams(params)
  });
};
var ZodUnion = class extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const options = this._def.options;
    function handleResults(results) {
      for (const result of results) {
        if (result.result.status === "valid") {
          return result.result;
        }
      }
      for (const result of results) {
        if (result.result.status === "dirty") {
          ctx.common.issues.push(...result.ctx.common.issues);
          return result.result;
        }
      }
      const unionErrors = results.map((result) => new ZodError(result.ctx.common.issues));
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_union,
        unionErrors
      });
      return INVALID;
    }
    if (ctx.common.async) {
      return Promise.all(options.map(async (option) => {
        const childCtx = {
          ...ctx,
          common: {
            ...ctx.common,
            issues: []
          },
          parent: null
        };
        return {
          result: await option._parseAsync({
            data: ctx.data,
            path: ctx.path,
            parent: childCtx
          }),
          ctx: childCtx
        };
      })).then(handleResults);
    } else {
      let dirty = void 0;
      const issues = [];
      for (const option of options) {
        const childCtx = {
          ...ctx,
          common: {
            ...ctx.common,
            issues: []
          },
          parent: null
        };
        const result = option._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: childCtx
        });
        if (result.status === "valid") {
          return result;
        } else if (result.status === "dirty" && !dirty) {
          dirty = { result, ctx: childCtx };
        }
        if (childCtx.common.issues.length) {
          issues.push(childCtx.common.issues);
        }
      }
      if (dirty) {
        ctx.common.issues.push(...dirty.ctx.common.issues);
        return dirty.result;
      }
      const unionErrors = issues.map((issues2) => new ZodError(issues2));
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_union,
        unionErrors
      });
      return INVALID;
    }
  }
  get options() {
    return this._def.options;
  }
};
ZodUnion.create = (types, params) => {
  return new ZodUnion({
    options: types,
    typeName: ZodFirstPartyTypeKind.ZodUnion,
    ...processCreateParams(params)
  });
};
var getDiscriminator = (type) => {
  if (type instanceof ZodLazy) {
    return getDiscriminator(type.schema);
  } else if (type instanceof ZodEffects) {
    return getDiscriminator(type.innerType());
  } else if (type instanceof ZodLiteral) {
    return [type.value];
  } else if (type instanceof ZodEnum) {
    return type.options;
  } else if (type instanceof ZodNativeEnum) {
    return util.objectValues(type.enum);
  } else if (type instanceof ZodDefault) {
    return getDiscriminator(type._def.innerType);
  } else if (type instanceof ZodUndefined) {
    return [void 0];
  } else if (type instanceof ZodNull) {
    return [null];
  } else if (type instanceof ZodOptional) {
    return [void 0, ...getDiscriminator(type.unwrap())];
  } else if (type instanceof ZodNullable) {
    return [null, ...getDiscriminator(type.unwrap())];
  } else if (type instanceof ZodBranded) {
    return getDiscriminator(type.unwrap());
  } else if (type instanceof ZodReadonly) {
    return getDiscriminator(type.unwrap());
  } else if (type instanceof ZodCatch) {
    return getDiscriminator(type._def.innerType);
  } else {
    return [];
  }
};
var ZodDiscriminatedUnion = class _ZodDiscriminatedUnion extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.object) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.object,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const discriminator = this.discriminator;
    const discriminatorValue = ctx.data[discriminator];
    const option = this.optionsMap.get(discriminatorValue);
    if (!option) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_union_discriminator,
        options: Array.from(this.optionsMap.keys()),
        path: [discriminator]
      });
      return INVALID;
    }
    if (ctx.common.async) {
      return option._parseAsync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      });
    } else {
      return option._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      });
    }
  }
  get discriminator() {
    return this._def.discriminator;
  }
  get options() {
    return this._def.options;
  }
  get optionsMap() {
    return this._def.optionsMap;
  }
  /**
   * The constructor of the discriminated union schema. Its behaviour is very similar to that of the normal z.union() constructor.
   * However, it only allows a union of objects, all of which need to share a discriminator property. This property must
   * have a different value for each object in the union.
   * @param discriminator the name of the discriminator property
   * @param types an array of object schemas
   * @param params
   */
  static create(discriminator, options, params) {
    const optionsMap = /* @__PURE__ */ new Map();
    for (const type of options) {
      const discriminatorValues = getDiscriminator(type.shape[discriminator]);
      if (!discriminatorValues.length) {
        throw new Error(`A discriminator value for key \`${discriminator}\` could not be extracted from all schema options`);
      }
      for (const value of discriminatorValues) {
        if (optionsMap.has(value)) {
          throw new Error(`Discriminator property ${String(discriminator)} has duplicate value ${String(value)}`);
        }
        optionsMap.set(value, type);
      }
    }
    return new _ZodDiscriminatedUnion({
      typeName: ZodFirstPartyTypeKind.ZodDiscriminatedUnion,
      discriminator,
      options,
      optionsMap,
      ...processCreateParams(params)
    });
  }
};
function mergeValues(a, b) {
  const aType = getParsedType(a);
  const bType = getParsedType(b);
  if (a === b) {
    return { valid: true, data: a };
  } else if (aType === ZodParsedType.object && bType === ZodParsedType.object) {
    const bKeys = util.objectKeys(b);
    const sharedKeys = util.objectKeys(a).filter((key) => bKeys.indexOf(key) !== -1);
    const newObj = { ...a, ...b };
    for (const key of sharedKeys) {
      const sharedValue = mergeValues(a[key], b[key]);
      if (!sharedValue.valid) {
        return { valid: false };
      }
      newObj[key] = sharedValue.data;
    }
    return { valid: true, data: newObj };
  } else if (aType === ZodParsedType.array && bType === ZodParsedType.array) {
    if (a.length !== b.length) {
      return { valid: false };
    }
    const newArray = [];
    for (let index = 0; index < a.length; index++) {
      const itemA = a[index];
      const itemB = b[index];
      const sharedValue = mergeValues(itemA, itemB);
      if (!sharedValue.valid) {
        return { valid: false };
      }
      newArray.push(sharedValue.data);
    }
    return { valid: true, data: newArray };
  } else if (aType === ZodParsedType.date && bType === ZodParsedType.date && +a === +b) {
    return { valid: true, data: a };
  } else {
    return { valid: false };
  }
}
var ZodIntersection = class extends ZodType {
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    const handleParsed = (parsedLeft, parsedRight) => {
      if (isAborted(parsedLeft) || isAborted(parsedRight)) {
        return INVALID;
      }
      const merged = mergeValues(parsedLeft.value, parsedRight.value);
      if (!merged.valid) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_intersection_types
        });
        return INVALID;
      }
      if (isDirty(parsedLeft) || isDirty(parsedRight)) {
        status.dirty();
      }
      return { status: status.value, value: merged.data };
    };
    if (ctx.common.async) {
      return Promise.all([
        this._def.left._parseAsync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        }),
        this._def.right._parseAsync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        })
      ]).then(([left, right]) => handleParsed(left, right));
    } else {
      return handleParsed(this._def.left._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      }), this._def.right._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      }));
    }
  }
};
ZodIntersection.create = (left, right, params) => {
  return new ZodIntersection({
    left,
    right,
    typeName: ZodFirstPartyTypeKind.ZodIntersection,
    ...processCreateParams(params)
  });
};
var ZodTuple = class _ZodTuple extends ZodType {
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.array) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.array,
        received: ctx.parsedType
      });
      return INVALID;
    }
    if (ctx.data.length < this._def.items.length) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.too_small,
        minimum: this._def.items.length,
        inclusive: true,
        exact: false,
        type: "array"
      });
      return INVALID;
    }
    const rest = this._def.rest;
    if (!rest && ctx.data.length > this._def.items.length) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.too_big,
        maximum: this._def.items.length,
        inclusive: true,
        exact: false,
        type: "array"
      });
      status.dirty();
    }
    const items = [...ctx.data].map((item2, itemIndex) => {
      const schema = this._def.items[itemIndex] || this._def.rest;
      if (!schema)
        return null;
      return schema._parse(new ParseInputLazyPath(ctx, item2, ctx.path, itemIndex));
    }).filter((x) => !!x);
    if (ctx.common.async) {
      return Promise.all(items).then((results) => {
        return ParseStatus.mergeArray(status, results);
      });
    } else {
      return ParseStatus.mergeArray(status, items);
    }
  }
  get items() {
    return this._def.items;
  }
  rest(rest) {
    return new _ZodTuple({
      ...this._def,
      rest
    });
  }
};
ZodTuple.create = (schemas, params) => {
  if (!Array.isArray(schemas)) {
    throw new Error("You must pass an array of schemas to z.tuple([ ... ])");
  }
  return new ZodTuple({
    items: schemas,
    typeName: ZodFirstPartyTypeKind.ZodTuple,
    rest: null,
    ...processCreateParams(params)
  });
};
var ZodRecord = class _ZodRecord extends ZodType {
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.object) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.object,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const pairs = [];
    const keyType = this._def.keyType;
    const valueType = this._def.valueType;
    for (const key in ctx.data) {
      pairs.push({
        key: keyType._parse(new ParseInputLazyPath(ctx, key, ctx.path, key)),
        value: valueType._parse(new ParseInputLazyPath(ctx, ctx.data[key], ctx.path, key)),
        alwaysSet: key in ctx.data
      });
    }
    if (ctx.common.async) {
      return ParseStatus.mergeObjectAsync(status, pairs);
    } else {
      return ParseStatus.mergeObjectSync(status, pairs);
    }
  }
  get element() {
    return this._def.valueType;
  }
  static create(first, second, third) {
    if (second instanceof ZodType) {
      return new _ZodRecord({
        keyType: first,
        valueType: second,
        typeName: ZodFirstPartyTypeKind.ZodRecord,
        ...processCreateParams(third)
      });
    }
    return new _ZodRecord({
      keyType: ZodString.create(),
      valueType: first,
      typeName: ZodFirstPartyTypeKind.ZodRecord,
      ...processCreateParams(second)
    });
  }
};
var ZodMap = class extends ZodType {
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.map) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.map,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const keyType = this._def.keyType;
    const valueType = this._def.valueType;
    const pairs = [...ctx.data.entries()].map(([key, value], index) => {
      return {
        key: keyType._parse(new ParseInputLazyPath(ctx, key, ctx.path, [index, "key"])),
        value: valueType._parse(new ParseInputLazyPath(ctx, value, ctx.path, [index, "value"]))
      };
    });
    if (ctx.common.async) {
      const finalMap = /* @__PURE__ */ new Map();
      return Promise.resolve().then(async () => {
        for (const pair of pairs) {
          const key = await pair.key;
          const value = await pair.value;
          if (key.status === "aborted" || value.status === "aborted") {
            return INVALID;
          }
          if (key.status === "dirty" || value.status === "dirty") {
            status.dirty();
          }
          finalMap.set(key.value, value.value);
        }
        return { status: status.value, value: finalMap };
      });
    } else {
      const finalMap = /* @__PURE__ */ new Map();
      for (const pair of pairs) {
        const key = pair.key;
        const value = pair.value;
        if (key.status === "aborted" || value.status === "aborted") {
          return INVALID;
        }
        if (key.status === "dirty" || value.status === "dirty") {
          status.dirty();
        }
        finalMap.set(key.value, value.value);
      }
      return { status: status.value, value: finalMap };
    }
  }
};
ZodMap.create = (keyType, valueType, params) => {
  return new ZodMap({
    valueType,
    keyType,
    typeName: ZodFirstPartyTypeKind.ZodMap,
    ...processCreateParams(params)
  });
};
var ZodSet = class _ZodSet extends ZodType {
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.set) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.set,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const def = this._def;
    if (def.minSize !== null) {
      if (ctx.data.size < def.minSize.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_small,
          minimum: def.minSize.value,
          type: "set",
          inclusive: true,
          exact: false,
          message: def.minSize.message
        });
        status.dirty();
      }
    }
    if (def.maxSize !== null) {
      if (ctx.data.size > def.maxSize.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_big,
          maximum: def.maxSize.value,
          type: "set",
          inclusive: true,
          exact: false,
          message: def.maxSize.message
        });
        status.dirty();
      }
    }
    const valueType = this._def.valueType;
    function finalizeSet(elements2) {
      const parsedSet = /* @__PURE__ */ new Set();
      for (const element of elements2) {
        if (element.status === "aborted")
          return INVALID;
        if (element.status === "dirty")
          status.dirty();
        parsedSet.add(element.value);
      }
      return { status: status.value, value: parsedSet };
    }
    const elements = [...ctx.data.values()].map((item2, i) => valueType._parse(new ParseInputLazyPath(ctx, item2, ctx.path, i)));
    if (ctx.common.async) {
      return Promise.all(elements).then((elements2) => finalizeSet(elements2));
    } else {
      return finalizeSet(elements);
    }
  }
  min(minSize, message) {
    return new _ZodSet({
      ...this._def,
      minSize: { value: minSize, message: errorUtil.toString(message) }
    });
  }
  max(maxSize, message) {
    return new _ZodSet({
      ...this._def,
      maxSize: { value: maxSize, message: errorUtil.toString(message) }
    });
  }
  size(size, message) {
    return this.min(size, message).max(size, message);
  }
  nonempty(message) {
    return this.min(1, message);
  }
};
ZodSet.create = (valueType, params) => {
  return new ZodSet({
    valueType,
    minSize: null,
    maxSize: null,
    typeName: ZodFirstPartyTypeKind.ZodSet,
    ...processCreateParams(params)
  });
};
var ZodFunction = class _ZodFunction extends ZodType {
  constructor() {
    super(...arguments);
    this.validate = this.implement;
  }
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.function) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.function,
        received: ctx.parsedType
      });
      return INVALID;
    }
    function makeArgsIssue(args, error) {
      return makeIssue({
        data: args,
        path: ctx.path,
        errorMaps: [ctx.common.contextualErrorMap, ctx.schemaErrorMap, getErrorMap(), en_default].filter((x) => !!x),
        issueData: {
          code: ZodIssueCode.invalid_arguments,
          argumentsError: error
        }
      });
    }
    function makeReturnsIssue(returns, error) {
      return makeIssue({
        data: returns,
        path: ctx.path,
        errorMaps: [ctx.common.contextualErrorMap, ctx.schemaErrorMap, getErrorMap(), en_default].filter((x) => !!x),
        issueData: {
          code: ZodIssueCode.invalid_return_type,
          returnTypeError: error
        }
      });
    }
    const params = { errorMap: ctx.common.contextualErrorMap };
    const fn = ctx.data;
    if (this._def.returns instanceof ZodPromise) {
      const me = this;
      return OK(async function(...args) {
        const error = new ZodError([]);
        const parsedArgs = await me._def.args.parseAsync(args, params).catch((e) => {
          error.addIssue(makeArgsIssue(args, e));
          throw error;
        });
        const result = await Reflect.apply(fn, this, parsedArgs);
        const parsedReturns = await me._def.returns._def.type.parseAsync(result, params).catch((e) => {
          error.addIssue(makeReturnsIssue(result, e));
          throw error;
        });
        return parsedReturns;
      });
    } else {
      const me = this;
      return OK(function(...args) {
        const parsedArgs = me._def.args.safeParse(args, params);
        if (!parsedArgs.success) {
          throw new ZodError([makeArgsIssue(args, parsedArgs.error)]);
        }
        const result = Reflect.apply(fn, this, parsedArgs.data);
        const parsedReturns = me._def.returns.safeParse(result, params);
        if (!parsedReturns.success) {
          throw new ZodError([makeReturnsIssue(result, parsedReturns.error)]);
        }
        return parsedReturns.data;
      });
    }
  }
  parameters() {
    return this._def.args;
  }
  returnType() {
    return this._def.returns;
  }
  args(...items) {
    return new _ZodFunction({
      ...this._def,
      args: ZodTuple.create(items).rest(ZodUnknown.create())
    });
  }
  returns(returnType) {
    return new _ZodFunction({
      ...this._def,
      returns: returnType
    });
  }
  implement(func) {
    const validatedFunc = this.parse(func);
    return validatedFunc;
  }
  strictImplement(func) {
    const validatedFunc = this.parse(func);
    return validatedFunc;
  }
  static create(args, returns, params) {
    return new _ZodFunction({
      args: args ? args : ZodTuple.create([]).rest(ZodUnknown.create()),
      returns: returns || ZodUnknown.create(),
      typeName: ZodFirstPartyTypeKind.ZodFunction,
      ...processCreateParams(params)
    });
  }
};
var ZodLazy = class extends ZodType {
  get schema() {
    return this._def.getter();
  }
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const lazySchema = this._def.getter();
    return lazySchema._parse({ data: ctx.data, path: ctx.path, parent: ctx });
  }
};
ZodLazy.create = (getter, params) => {
  return new ZodLazy({
    getter,
    typeName: ZodFirstPartyTypeKind.ZodLazy,
    ...processCreateParams(params)
  });
};
var ZodLiteral = class extends ZodType {
  _parse(input) {
    if (input.data !== this._def.value) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        received: ctx.data,
        code: ZodIssueCode.invalid_literal,
        expected: this._def.value
      });
      return INVALID;
    }
    return { status: "valid", value: input.data };
  }
  get value() {
    return this._def.value;
  }
};
ZodLiteral.create = (value, params) => {
  return new ZodLiteral({
    value,
    typeName: ZodFirstPartyTypeKind.ZodLiteral,
    ...processCreateParams(params)
  });
};
function createZodEnum(values, params) {
  return new ZodEnum({
    values,
    typeName: ZodFirstPartyTypeKind.ZodEnum,
    ...processCreateParams(params)
  });
}
var ZodEnum = class _ZodEnum extends ZodType {
  _parse(input) {
    if (typeof input.data !== "string") {
      const ctx = this._getOrReturnCtx(input);
      const expectedValues = this._def.values;
      addIssueToContext(ctx, {
        expected: util.joinValues(expectedValues),
        received: ctx.parsedType,
        code: ZodIssueCode.invalid_type
      });
      return INVALID;
    }
    if (!this._cache) {
      this._cache = new Set(this._def.values);
    }
    if (!this._cache.has(input.data)) {
      const ctx = this._getOrReturnCtx(input);
      const expectedValues = this._def.values;
      addIssueToContext(ctx, {
        received: ctx.data,
        code: ZodIssueCode.invalid_enum_value,
        options: expectedValues
      });
      return INVALID;
    }
    return OK(input.data);
  }
  get options() {
    return this._def.values;
  }
  get enum() {
    const enumValues = {};
    for (const val of this._def.values) {
      enumValues[val] = val;
    }
    return enumValues;
  }
  get Values() {
    const enumValues = {};
    for (const val of this._def.values) {
      enumValues[val] = val;
    }
    return enumValues;
  }
  get Enum() {
    const enumValues = {};
    for (const val of this._def.values) {
      enumValues[val] = val;
    }
    return enumValues;
  }
  extract(values, newDef = this._def) {
    return _ZodEnum.create(values, {
      ...this._def,
      ...newDef
    });
  }
  exclude(values, newDef = this._def) {
    return _ZodEnum.create(this.options.filter((opt) => !values.includes(opt)), {
      ...this._def,
      ...newDef
    });
  }
};
ZodEnum.create = createZodEnum;
var ZodNativeEnum = class extends ZodType {
  _parse(input) {
    const nativeEnumValues = util.getValidEnumValues(this._def.values);
    const ctx = this._getOrReturnCtx(input);
    if (ctx.parsedType !== ZodParsedType.string && ctx.parsedType !== ZodParsedType.number) {
      const expectedValues = util.objectValues(nativeEnumValues);
      addIssueToContext(ctx, {
        expected: util.joinValues(expectedValues),
        received: ctx.parsedType,
        code: ZodIssueCode.invalid_type
      });
      return INVALID;
    }
    if (!this._cache) {
      this._cache = new Set(util.getValidEnumValues(this._def.values));
    }
    if (!this._cache.has(input.data)) {
      const expectedValues = util.objectValues(nativeEnumValues);
      addIssueToContext(ctx, {
        received: ctx.data,
        code: ZodIssueCode.invalid_enum_value,
        options: expectedValues
      });
      return INVALID;
    }
    return OK(input.data);
  }
  get enum() {
    return this._def.values;
  }
};
ZodNativeEnum.create = (values, params) => {
  return new ZodNativeEnum({
    values,
    typeName: ZodFirstPartyTypeKind.ZodNativeEnum,
    ...processCreateParams(params)
  });
};
var ZodPromise = class extends ZodType {
  unwrap() {
    return this._def.type;
  }
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.promise && ctx.common.async === false) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.promise,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const promisified = ctx.parsedType === ZodParsedType.promise ? ctx.data : Promise.resolve(ctx.data);
    return OK(promisified.then((data) => {
      return this._def.type.parseAsync(data, {
        path: ctx.path,
        errorMap: ctx.common.contextualErrorMap
      });
    }));
  }
};
ZodPromise.create = (schema, params) => {
  return new ZodPromise({
    type: schema,
    typeName: ZodFirstPartyTypeKind.ZodPromise,
    ...processCreateParams(params)
  });
};
var ZodEffects = class extends ZodType {
  innerType() {
    return this._def.schema;
  }
  sourceType() {
    return this._def.schema._def.typeName === ZodFirstPartyTypeKind.ZodEffects ? this._def.schema.sourceType() : this._def.schema;
  }
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    const effect = this._def.effect || null;
    const checkCtx = {
      addIssue: (arg) => {
        addIssueToContext(ctx, arg);
        if (arg.fatal) {
          status.abort();
        } else {
          status.dirty();
        }
      },
      get path() {
        return ctx.path;
      }
    };
    checkCtx.addIssue = checkCtx.addIssue.bind(checkCtx);
    if (effect.type === "preprocess") {
      const processed = effect.transform(ctx.data, checkCtx);
      if (ctx.common.async) {
        return Promise.resolve(processed).then(async (processed2) => {
          if (status.value === "aborted")
            return INVALID;
          const result = await this._def.schema._parseAsync({
            data: processed2,
            path: ctx.path,
            parent: ctx
          });
          if (result.status === "aborted")
            return INVALID;
          if (result.status === "dirty")
            return DIRTY(result.value);
          if (status.value === "dirty")
            return DIRTY(result.value);
          return result;
        });
      } else {
        if (status.value === "aborted")
          return INVALID;
        const result = this._def.schema._parseSync({
          data: processed,
          path: ctx.path,
          parent: ctx
        });
        if (result.status === "aborted")
          return INVALID;
        if (result.status === "dirty")
          return DIRTY(result.value);
        if (status.value === "dirty")
          return DIRTY(result.value);
        return result;
      }
    }
    if (effect.type === "refinement") {
      const executeRefinement = (acc) => {
        const result = effect.refinement(acc, checkCtx);
        if (ctx.common.async) {
          return Promise.resolve(result);
        }
        if (result instanceof Promise) {
          throw new Error("Async refinement encountered during synchronous parse operation. Use .parseAsync instead.");
        }
        return acc;
      };
      if (ctx.common.async === false) {
        const inner = this._def.schema._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        });
        if (inner.status === "aborted")
          return INVALID;
        if (inner.status === "dirty")
          status.dirty();
        executeRefinement(inner.value);
        return { status: status.value, value: inner.value };
      } else {
        return this._def.schema._parseAsync({ data: ctx.data, path: ctx.path, parent: ctx }).then((inner) => {
          if (inner.status === "aborted")
            return INVALID;
          if (inner.status === "dirty")
            status.dirty();
          return executeRefinement(inner.value).then(() => {
            return { status: status.value, value: inner.value };
          });
        });
      }
    }
    if (effect.type === "transform") {
      if (ctx.common.async === false) {
        const base2 = this._def.schema._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        });
        if (!isValid(base2))
          return INVALID;
        const result = effect.transform(base2.value, checkCtx);
        if (result instanceof Promise) {
          throw new Error(`Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead.`);
        }
        return { status: status.value, value: result };
      } else {
        return this._def.schema._parseAsync({ data: ctx.data, path: ctx.path, parent: ctx }).then((base2) => {
          if (!isValid(base2))
            return INVALID;
          return Promise.resolve(effect.transform(base2.value, checkCtx)).then((result) => ({
            status: status.value,
            value: result
          }));
        });
      }
    }
    util.assertNever(effect);
  }
};
ZodEffects.create = (schema, effect, params) => {
  return new ZodEffects({
    schema,
    typeName: ZodFirstPartyTypeKind.ZodEffects,
    effect,
    ...processCreateParams(params)
  });
};
ZodEffects.createWithPreprocess = (preprocess, schema, params) => {
  return new ZodEffects({
    schema,
    effect: { type: "preprocess", transform: preprocess },
    typeName: ZodFirstPartyTypeKind.ZodEffects,
    ...processCreateParams(params)
  });
};
var ZodOptional = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType === ZodParsedType.undefined) {
      return OK(void 0);
    }
    return this._def.innerType._parse(input);
  }
  unwrap() {
    return this._def.innerType;
  }
};
ZodOptional.create = (type, params) => {
  return new ZodOptional({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodOptional,
    ...processCreateParams(params)
  });
};
var ZodNullable = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType === ZodParsedType.null) {
      return OK(null);
    }
    return this._def.innerType._parse(input);
  }
  unwrap() {
    return this._def.innerType;
  }
};
ZodNullable.create = (type, params) => {
  return new ZodNullable({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodNullable,
    ...processCreateParams(params)
  });
};
var ZodDefault = class extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    let data = ctx.data;
    if (ctx.parsedType === ZodParsedType.undefined) {
      data = this._def.defaultValue();
    }
    return this._def.innerType._parse({
      data,
      path: ctx.path,
      parent: ctx
    });
  }
  removeDefault() {
    return this._def.innerType;
  }
};
ZodDefault.create = (type, params) => {
  return new ZodDefault({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodDefault,
    defaultValue: typeof params.default === "function" ? params.default : () => params.default,
    ...processCreateParams(params)
  });
};
var ZodCatch = class extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const newCtx = {
      ...ctx,
      common: {
        ...ctx.common,
        issues: []
      }
    };
    const result = this._def.innerType._parse({
      data: newCtx.data,
      path: newCtx.path,
      parent: {
        ...newCtx
      }
    });
    if (isAsync(result)) {
      return result.then((result2) => {
        return {
          status: "valid",
          value: result2.status === "valid" ? result2.value : this._def.catchValue({
            get error() {
              return new ZodError(newCtx.common.issues);
            },
            input: newCtx.data
          })
        };
      });
    } else {
      return {
        status: "valid",
        value: result.status === "valid" ? result.value : this._def.catchValue({
          get error() {
            return new ZodError(newCtx.common.issues);
          },
          input: newCtx.data
        })
      };
    }
  }
  removeCatch() {
    return this._def.innerType;
  }
};
ZodCatch.create = (type, params) => {
  return new ZodCatch({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodCatch,
    catchValue: typeof params.catch === "function" ? params.catch : () => params.catch,
    ...processCreateParams(params)
  });
};
var ZodNaN = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.nan) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.nan,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return { status: "valid", value: input.data };
  }
};
ZodNaN.create = (params) => {
  return new ZodNaN({
    typeName: ZodFirstPartyTypeKind.ZodNaN,
    ...processCreateParams(params)
  });
};
var BRAND = /* @__PURE__ */ Symbol("zod_brand");
var ZodBranded = class extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const data = ctx.data;
    return this._def.type._parse({
      data,
      path: ctx.path,
      parent: ctx
    });
  }
  unwrap() {
    return this._def.type;
  }
};
var ZodPipeline = class _ZodPipeline extends ZodType {
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.common.async) {
      const handleAsync = async () => {
        const inResult = await this._def.in._parseAsync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        });
        if (inResult.status === "aborted")
          return INVALID;
        if (inResult.status === "dirty") {
          status.dirty();
          return DIRTY(inResult.value);
        } else {
          return this._def.out._parseAsync({
            data: inResult.value,
            path: ctx.path,
            parent: ctx
          });
        }
      };
      return handleAsync();
    } else {
      const inResult = this._def.in._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      });
      if (inResult.status === "aborted")
        return INVALID;
      if (inResult.status === "dirty") {
        status.dirty();
        return {
          status: "dirty",
          value: inResult.value
        };
      } else {
        return this._def.out._parseSync({
          data: inResult.value,
          path: ctx.path,
          parent: ctx
        });
      }
    }
  }
  static create(a, b) {
    return new _ZodPipeline({
      in: a,
      out: b,
      typeName: ZodFirstPartyTypeKind.ZodPipeline
    });
  }
};
var ZodReadonly = class extends ZodType {
  _parse(input) {
    const result = this._def.innerType._parse(input);
    const freeze = (data) => {
      if (isValid(data)) {
        data.value = Object.freeze(data.value);
      }
      return data;
    };
    return isAsync(result) ? result.then((data) => freeze(data)) : freeze(result);
  }
  unwrap() {
    return this._def.innerType;
  }
};
ZodReadonly.create = (type, params) => {
  return new ZodReadonly({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodReadonly,
    ...processCreateParams(params)
  });
};
function cleanParams(params, data) {
  const p3 = typeof params === "function" ? params(data) : typeof params === "string" ? { message: params } : params;
  const p22 = typeof p3 === "string" ? { message: p3 } : p3;
  return p22;
}
function custom(check, _params = {}, fatal) {
  if (check)
    return ZodAny.create().superRefine((data, ctx) => {
      const r = check(data);
      if (r instanceof Promise) {
        return r.then((r2) => {
          if (!r2) {
            const params = cleanParams(_params, data);
            const _fatal = params.fatal ?? fatal ?? true;
            ctx.addIssue({ code: "custom", ...params, fatal: _fatal });
          }
        });
      }
      if (!r) {
        const params = cleanParams(_params, data);
        const _fatal = params.fatal ?? fatal ?? true;
        ctx.addIssue({ code: "custom", ...params, fatal: _fatal });
      }
      return;
    });
  return ZodAny.create();
}
var late = {
  object: ZodObject.lazycreate
};
var ZodFirstPartyTypeKind;
(function(ZodFirstPartyTypeKind2) {
  ZodFirstPartyTypeKind2["ZodString"] = "ZodString";
  ZodFirstPartyTypeKind2["ZodNumber"] = "ZodNumber";
  ZodFirstPartyTypeKind2["ZodNaN"] = "ZodNaN";
  ZodFirstPartyTypeKind2["ZodBigInt"] = "ZodBigInt";
  ZodFirstPartyTypeKind2["ZodBoolean"] = "ZodBoolean";
  ZodFirstPartyTypeKind2["ZodDate"] = "ZodDate";
  ZodFirstPartyTypeKind2["ZodSymbol"] = "ZodSymbol";
  ZodFirstPartyTypeKind2["ZodUndefined"] = "ZodUndefined";
  ZodFirstPartyTypeKind2["ZodNull"] = "ZodNull";
  ZodFirstPartyTypeKind2["ZodAny"] = "ZodAny";
  ZodFirstPartyTypeKind2["ZodUnknown"] = "ZodUnknown";
  ZodFirstPartyTypeKind2["ZodNever"] = "ZodNever";
  ZodFirstPartyTypeKind2["ZodVoid"] = "ZodVoid";
  ZodFirstPartyTypeKind2["ZodArray"] = "ZodArray";
  ZodFirstPartyTypeKind2["ZodObject"] = "ZodObject";
  ZodFirstPartyTypeKind2["ZodUnion"] = "ZodUnion";
  ZodFirstPartyTypeKind2["ZodDiscriminatedUnion"] = "ZodDiscriminatedUnion";
  ZodFirstPartyTypeKind2["ZodIntersection"] = "ZodIntersection";
  ZodFirstPartyTypeKind2["ZodTuple"] = "ZodTuple";
  ZodFirstPartyTypeKind2["ZodRecord"] = "ZodRecord";
  ZodFirstPartyTypeKind2["ZodMap"] = "ZodMap";
  ZodFirstPartyTypeKind2["ZodSet"] = "ZodSet";
  ZodFirstPartyTypeKind2["ZodFunction"] = "ZodFunction";
  ZodFirstPartyTypeKind2["ZodLazy"] = "ZodLazy";
  ZodFirstPartyTypeKind2["ZodLiteral"] = "ZodLiteral";
  ZodFirstPartyTypeKind2["ZodEnum"] = "ZodEnum";
  ZodFirstPartyTypeKind2["ZodEffects"] = "ZodEffects";
  ZodFirstPartyTypeKind2["ZodNativeEnum"] = "ZodNativeEnum";
  ZodFirstPartyTypeKind2["ZodOptional"] = "ZodOptional";
  ZodFirstPartyTypeKind2["ZodNullable"] = "ZodNullable";
  ZodFirstPartyTypeKind2["ZodDefault"] = "ZodDefault";
  ZodFirstPartyTypeKind2["ZodCatch"] = "ZodCatch";
  ZodFirstPartyTypeKind2["ZodPromise"] = "ZodPromise";
  ZodFirstPartyTypeKind2["ZodBranded"] = "ZodBranded";
  ZodFirstPartyTypeKind2["ZodPipeline"] = "ZodPipeline";
  ZodFirstPartyTypeKind2["ZodReadonly"] = "ZodReadonly";
})(ZodFirstPartyTypeKind || (ZodFirstPartyTypeKind = {}));
var instanceOfType = (cls, params = {
  message: `Input not instance of ${cls.name}`
}) => custom((data) => data instanceof cls, params);
var stringType = ZodString.create;
var numberType = ZodNumber.create;
var nanType = ZodNaN.create;
var bigIntType = ZodBigInt.create;
var booleanType = ZodBoolean.create;
var dateType = ZodDate.create;
var symbolType = ZodSymbol.create;
var undefinedType = ZodUndefined.create;
var nullType = ZodNull.create;
var anyType = ZodAny.create;
var unknownType = ZodUnknown.create;
var neverType = ZodNever.create;
var voidType = ZodVoid.create;
var arrayType = ZodArray.create;
var objectType = ZodObject.create;
var strictObjectType = ZodObject.strictCreate;
var unionType = ZodUnion.create;
var discriminatedUnionType = ZodDiscriminatedUnion.create;
var intersectionType = ZodIntersection.create;
var tupleType = ZodTuple.create;
var recordType = ZodRecord.create;
var mapType = ZodMap.create;
var setType = ZodSet.create;
var functionType = ZodFunction.create;
var lazyType = ZodLazy.create;
var literalType = ZodLiteral.create;
var enumType = ZodEnum.create;
var nativeEnumType = ZodNativeEnum.create;
var promiseType = ZodPromise.create;
var effectsType = ZodEffects.create;
var optionalType = ZodOptional.create;
var nullableType = ZodNullable.create;
var preprocessType = ZodEffects.createWithPreprocess;
var pipelineType = ZodPipeline.create;
var ostring = () => stringType().optional();
var onumber = () => numberType().optional();
var oboolean = () => booleanType().optional();
var coerce = {
  string: ((arg) => ZodString.create({ ...arg, coerce: true })),
  number: ((arg) => ZodNumber.create({ ...arg, coerce: true })),
  boolean: ((arg) => ZodBoolean.create({
    ...arg,
    coerce: true
  })),
  bigint: ((arg) => ZodBigInt.create({ ...arg, coerce: true })),
  date: ((arg) => ZodDate.create({ ...arg, coerce: true }))
};
var NEVER = INVALID;

// src/framework/validation/schemas.ts
var ModelProviderConfigSchema = external_exports.object({
  apiKey: external_exports.string().optional(),
  baseUrl: external_exports.string().optional(),
  model: external_exports.string().optional(),
  timeout: external_exports.number().positive().optional(),
  temperature: external_exports.number().min(0).max(2).optional(),
  topP: external_exports.number().min(0).max(1).optional(),
  enableThinking: external_exports.boolean().optional(),
  frequencyPenalty: external_exports.number().optional(),
  presencePenalty: external_exports.number().optional()
}).passthrough();
var ModelsConfigSchema = external_exports.object({
  primary: external_exports.string(),
  fallback: external_exports.string(),
  local: external_exports.string().optional(),
  providers: external_exports.record(ModelProviderConfigSchema).default({})
});
var SkillsConfigSchema = external_exports.object({
  dirs: external_exports.array(external_exports.string()).default(["./skills/workspace", "./skills/managed", "./skills/bundled"]),
  include: external_exports.array(external_exports.string()).optional(),
  exclude: external_exports.array(external_exports.string()).optional()
}).passthrough();
var SandboxConfigSchema = external_exports.object({
  enabled: external_exports.boolean().default(true),
  docker: external_exports.boolean().default(false),
  timeout: external_exports.number().positive().default(3e4),
  maxMemory: external_exports.string().default("256MB"),
  allowedCommands: external_exports.array(external_exports.string()).default([])
});
var PermissionsConfigSchema = external_exports.object({
  fileSystem: external_exports.object({
    read: external_exports.boolean().default(true),
    write: external_exports.boolean().default(true),
    execute: external_exports.boolean().default(false),
    delete: external_exports.boolean().default(false)
  }).default({}),
  network: external_exports.object({
    http: external_exports.boolean().default(true),
    https: external_exports.boolean().default(true),
    websocket: external_exports.boolean().default(true)
  }).default({}),
  system: external_exports.object({
    shell: external_exports.boolean().default(false),
    process: external_exports.boolean().default(false)
  }).default({})
});
var ToolsConfigSchema = external_exports.object({
  policy: external_exports.enum(["minimal", "coding", "messaging", "full", "balanced"]).default("balanced"),
  sandbox: SandboxConfigSchema.default({}),
  permissions: PermissionsConfigSchema.default({}),
  extensions: external_exports.array(external_exports.object({
    type: external_exports.enum(["mcp", "http", "custom"]),
    name: external_exports.string().optional(),
    endpoint: external_exports.string().optional(),
    url: external_exports.string().optional(),
    method: external_exports.string().optional()
  }).passthrough()).optional(),
  execUseLoginShell: external_exports.boolean().optional(),
  formatResultWithLLM: external_exports.boolean().optional(),
  autoExecuteParsedCalls: external_exports.boolean().optional(),
  allowExecInChannels: external_exports.array(external_exports.string()).optional()
});
var SecurityConfigSchema = external_exports.object({
  auth: external_exports.object({
    enabled: external_exports.boolean().default(false),
    type: external_exports.enum(["none", "basic", "bearer", "oauth"]).default("none"),
    token: external_exports.string().optional()
  }).default({}),
  rateLimit: external_exports.object({
    enabled: external_exports.boolean().default(false),
    windowMs: external_exports.number().positive().default(6e4),
    maxRequests: external_exports.number().positive().default(100)
  }).default({}),
  cors: external_exports.object({
    enabled: external_exports.boolean().default(true),
    origins: external_exports.array(external_exports.string()).default(["*"]),
    credentials: external_exports.boolean().default(false)
  }).default({})
});
var PerformanceConfigSchema = external_exports.object({
  skillsCache: external_exports.object({ maxSize: external_exports.number().default(100), ttl: external_exports.number().default(300) }).default({}),
  semanticSearch: external_exports.object({
    enabled: external_exports.boolean().default(true),
    threshold: external_exports.number().min(0).max(1).default(0.7),
    maxResults: external_exports.number().default(5),
    embedModel: external_exports.string().optional()
  }).default({}),
  streaming: external_exports.object({
    enabled: external_exports.boolean().default(true),
    chunkSize: external_exports.number().default(256),
    maxConcurrent: external_exports.number().default(4)
  }).default({}),
  memory: external_exports.object({
    maxHeapSize: external_exports.string().default("512MB"),
    gcInterval: external_exports.number().default(1e4),
    sessionTimeout: external_exports.number().default(3e5)
  }).default({})
});
var GraphRagConfigSchema = external_exports.object({
  enabled: external_exports.boolean().default(false),
  entityExtraction: external_exports.object({
    enabled: external_exports.boolean().default(true),
    model: external_exports.string().optional(),
    batchSize: external_exports.number().positive().default(5),
    maxEntitiesPerChunk: external_exports.number().positive().default(10)
  }).default({}),
  communityDetection: external_exports.object({
    enabled: external_exports.boolean().default(true),
    algorithm: external_exports.enum(["leiden", "louvain"]).default("leiden"),
    resolution: external_exports.number().positive().default(1),
    levels: external_exports.number().positive().default(2)
  }).default({}),
  queryStrategy: external_exports.object({
    directorLevel: external_exports.enum(["community", "entity", "chunk"]).default("community"),
    workerLevel: external_exports.enum(["chunk", "entity"]).default("chunk")
  }).default({})
}).default({});
var HybridRetrievalConfigSchema = external_exports.object({
  bm25Weight: external_exports.number().min(0).max(1).default(0.35),
  vectorWeight: external_exports.number().min(0).max(1).default(0.4),
  graphWeight: external_exports.number().min(0).max(1).default(0.25),
  rerankWithLLM: external_exports.boolean().default(true)
}).default({});
var MemoryConfigSchema = external_exports.object({
  provider: external_exports.string().default("local"),
  enabled: external_exports.boolean().default(false),
  storageDir: external_exports.string().default("~/.novaclaw/memory"),
  indexConversations: external_exports.boolean().default(true),
  indexWorkspace: external_exports.boolean().default(true),
  maxDocumentSizeMB: external_exports.number().positive().default(10),
  maxRetrievalNodes: external_exports.number().positive().default(5),
  chunkSize: external_exports.number().positive().optional(),
  chunkOverlap: external_exports.number().nonnegative().optional(),
  llmReranking: external_exports.boolean().optional(),
  queryExpansion: external_exports.boolean().optional(),
  mmrLambda: external_exports.number().min(0).max(1).optional(),
  contextWindowLines: external_exports.number().positive().optional(),
  graphRag: GraphRagConfigSchema.optional(),
  hybridRetrieval: HybridRetrievalConfigSchema.optional()
});
var ChannelAccountConfigSchema = external_exports.object({
  enabled: external_exports.boolean().optional()
}).passthrough();
var ChannelDetailConfigSchema = external_exports.object({
  accounts: external_exports.record(ChannelAccountConfigSchema).optional(),
  dmPolicy: external_exports.enum(["open", "closed", "allowlist"]).optional(),
  allowFrom: external_exports.array(external_exports.string()).optional()
}).passthrough();
var ChannelsConfigSchema = external_exports.object({
  enabled: external_exports.array(external_exports.string()).default([])
}).passthrough().default({});
var PluginEntrySchema = external_exports.object({
  enabled: external_exports.boolean()
});
var PluginInstallSchema = external_exports.object({
  source: external_exports.string(),
  sourcePath: external_exports.string().optional(),
  installPath: external_exports.string().optional(),
  version: external_exports.string().optional(),
  installedAt: external_exports.string().optional()
});
var PluginsConfigSchema = external_exports.object({
  entries: external_exports.record(PluginEntrySchema).optional(),
  installs: external_exports.record(PluginInstallSchema).optional(),
  allow: external_exports.array(external_exports.string()).optional()
});
var UserConfigMetaSchema = external_exports.object({
  lastTouchedVersion: external_exports.string().optional(),
  lastTouchedAt: external_exports.string().optional()
});
external_exports.object({
  meta: UserConfigMetaSchema.optional(),
  channels: external_exports.record(ChannelDetailConfigSchema).optional(),
  plugins: PluginsConfigSchema.optional()
});
var AgentConfigSchema = external_exports.object({
  maxTurns: external_exports.number().positive().default(10),
  toolResultContextMax: external_exports.number().positive().default(16e3),
  messageTimeoutMs: external_exports.number().positive().default(MESSAGE_TIMEOUT_MS)
});
var WorkerOverrideConfigSchema = external_exports.object({
  enabled: external_exports.boolean().default(true),
  model: external_exports.string().optional(),
  maxTurns: external_exports.number().positive().optional(),
  tools: external_exports.array(external_exports.string()).optional(),
  skillDomains: external_exports.array(external_exports.string()).optional()
}).passthrough();
var MultiAgentConfigSchema = external_exports.object({
  mode: external_exports.enum(["single", "multi"]).default("single"),
  director: external_exports.object({
    model: external_exports.string().optional(),
    maxTurns: external_exports.number().positive().default(5),
    directResponse: external_exports.boolean().default(true)
  }).default({}),
  workers: external_exports.record(WorkerOverrideConfigSchema).optional(),
  pool: external_exports.object({
    maxIdleTime: external_exports.number().positive().default(3e5),
    maxConcurrent: external_exports.number().positive().default(5)
  }).default({})
});
var RulesBuiltinConfigSchema = external_exports.object({
  "exec-channel-allowlist": external_exports.boolean().default(true),
  "content-safety": external_exports.boolean().default(true),
  "input-sanitize": external_exports.boolean().default(true),
  "format-channel-adapt": external_exports.boolean().default(true),
  "citation-enforce": external_exports.boolean().default(false),
  "thinking-strip": external_exports.boolean().default(true)
}).passthrough().default({});
var RulesConfigSchema = external_exports.object({
  builtin: RulesBuiltinConfigSchema.optional(),
  output: external_exports.object({
    channelFormats: external_exports.record(external_exports.object({
      format: external_exports.string().optional(),
      maxLength: external_exports.number().positive().optional()
    }).passthrough()).optional(),
    tone: external_exports.string().optional(),
    piiFilter: external_exports.object({
      enabled: external_exports.boolean().default(false)
    }).optional()
  }).optional(),
  custom: external_exports.array(external_exports.object({
    path: external_exports.string()
  }).passthrough()).optional()
});
var MCPServerRequestInitSchema = external_exports.object({
  headers: external_exports.record(external_exports.string(), external_exports.string()).optional(),
  method: external_exports.enum(["GET", "HEAD", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"]).optional(),
  credentials: external_exports.enum(["omit", "same-origin", "include"]).optional()
}).passthrough();
var MCPServerEntrySchema = external_exports.object({
  endpoint: external_exports.string().min(1),
  transport: external_exports.enum(["http", "sse", "stdio"]).optional(),
  command: external_exports.string().optional(),
  args: external_exports.array(external_exports.string()).optional(),
  requestInit: MCPServerRequestInitSchema.optional()
}).passthrough();
var NovaClawConfigSchema = external_exports.object({
  port: external_exports.number().min(1).max(65535).default(3e3),
  bind: external_exports.string().default("loopback"),
  workspaceDir: external_exports.string().min(1),
  models: ModelsConfigSchema,
  agent: AgentConfigSchema.default({}),
  agents: MultiAgentConfigSchema.optional(),
  rules: RulesConfigSchema.optional(),
  skills: SkillsConfigSchema.default({}),
  tools: ToolsConfigSchema.default({}),
  mcp: external_exports.array(MCPServerEntrySchema).optional(),
  memory: MemoryConfigSchema.optional(),
  channels: ChannelsConfigSchema,
  performance: PerformanceConfigSchema.default({}),
  security: SecurityConfigSchema.default({}),
  logging: external_exports.object({
    level: external_exports.enum(["debug", "info", "warn", "error"]).default("info"),
    format: external_exports.enum(["text", "json", "pretty"]).default("text"),
    file: external_exports.object({
      enabled: external_exports.boolean(),
      path: external_exports.string(),
      maxSize: external_exports.string(),
      maxFiles: external_exports.number()
    }).optional()
  }).default({}),
  monitoring: external_exports.object({
    enabled: external_exports.boolean().default(true),
    rssLimitMB: external_exports.number().positive().default(512),
    metrics: external_exports.object({ enabled: external_exports.boolean(), port: external_exports.number() }).optional(),
    health: external_exports.object({
      enabled: external_exports.boolean().default(true),
      path: external_exports.string().default("/health"),
      interval: external_exports.number().default(3e4)
    }).optional()
  }).default({}),
  cluster: external_exports.object({
    enabled: external_exports.boolean(),
    nodes: external_exports.array(external_exports.string()),
    discovery: external_exports.enum(["static", "consul", "etcd"])
  }).optional()
});
var MessageRequestSchema = external_exports.object({
  sessionKey: external_exports.string(),
  message: external_exports.string().min(1),
  images: external_exports.array(external_exports.object({
    url: external_exports.string().optional(),
    data: external_exports.string().optional(),
    mimeType: external_exports.string(),
    description: external_exports.string().optional()
  })).optional(),
  metadata: external_exports.record(external_exports.unknown()).optional()
});
var ApiChatRequestSchema = MessageRequestSchema.extend({
  sessionKey: external_exports.string().optional()
});
var WebSocketAuthPayloadSchema = external_exports.object({
  token: external_exports.string().optional(),
  userId: external_exports.string().optional(),
  channel: external_exports.string().optional(),
  conversationId: external_exports.string().optional(),
  metadata: external_exports.record(external_exports.unknown()).optional()
});
var WebSocketMessagePayloadSchema = external_exports.object({
  message: external_exports.string().min(1).optional(),
  content: external_exports.string().min(1).optional(),
  images: external_exports.array(external_exports.unknown()).optional(),
  metadata: external_exports.record(external_exports.unknown()).optional()
}).refine(
  (data) => !!(data.message || data.content),
  { message: "Either message or content is required", path: ["message"] }
);

// src/framework/i18n/messages.ts
var messages = {
  "agent.thinking_turn": {
    zh: (turn) => `\u6A21\u578B\u601D\u8003\u4E2D\uFF08\u7B2C ${turn} \u8F6E\uFF09\u2026`,
    en: (turn) => `Model thinking (turn ${turn})\u2026`
  },
  "agent.calling_tool": {
    zh: (name) => `\u8C03\u7528\u5DE5\u5177 ${name}\u2026`,
    en: (name) => `Calling tool ${name}\u2026`
  },
  "agent.tool_success": {
    zh: (name) => `[${name}] \u6267\u884C\u5B8C\u6210`,
    en: (name) => `[${name}] completed`
  },
  "agent.tool_error": {
    zh: (name) => `[${name}] \u6267\u884C\u5931\u8D25`,
    en: (name) => `[${name}] failed`
  },
  "agent.tool_exec_error": {
    zh: (name) => `\u6267\u884C \`${name}\` \u65F6\u51FA\u9519\uFF0C\u8BF7\u68C0\u67E5\u547D\u4EE4\u6216\u53C2\u6570\u540E\u91CD\u8BD5\u3002`,
    en: (name) => `Error executing \`${name}\`. Please check the command or parameters and try again.`
  },
  "agent.empty_response": {
    zh: "\u6A21\u578B\u672A\u8FD4\u56DE\u6709\u6548\u5185\u5BB9\uFF0C\u53EF\u80FD\u662F\u670D\u52A1\u7AEF\u9650\u6D41\u6216\u4E34\u65F6\u5F02\u5E38\uFF0C\u8BF7\u7A0D\u540E\u91CD\u8BD5\u3002",
    en: "The model returned no content. This may be due to rate limiting or a temporary error. Please try again later."
  },
  "agent.stopped_by_user": {
    zh: "\n\n[\u5DF2\u7531\u7528\u6237\u505C\u6B62]",
    en: "\n\n[Stopped by user]"
  },
  "agent.stopped_by_timeout": {
    zh: "\n\n[\u5904\u7406\u8D85\u65F6\uFF0C\u8BF7\u7A0D\u540E\u91CD\u8BD5]",
    en: "\n\n[Request timed out, please try again]"
  },
  "agent.all_models_unavailable": {
    zh: "\u5904\u7406\u6D88\u606F\u65F6\u9047\u5230\u9519\u8BEF\uFF0C\u4E3B\u6A21\u578B\u548C\u5907\u7528\u6A21\u578B\u5747\u4E0D\u53EF\u7528\uFF0C\u8BF7\u7A0D\u540E\u91CD\u8BD5\u3002",
    en: "Error processing message. Both primary and fallback models are unavailable. Please try again later."
  },
  "policy.request_cancelled": {
    zh: "\u8BF7\u6C42\u5DF2\u53D6\u6D88",
    en: "Request cancelled"
  },
  "policy.auth_failed": {
    zh: "API \u8BA4\u8BC1\u5931\u8D25\uFF0C\u8BF7\u68C0\u67E5 API Key \u662F\u5426\u6B63\u786E\u914D\u7F6E\u3002",
    en: "API authentication failed. Please check your API key configuration."
  },
  "policy.rate_limited": {
    zh: (sec) => `\u670D\u52A1\u7AEF\u9650\u6D41\uFF0C${sec}\u79D2\u540E\u81EA\u52A8\u91CD\u8BD5\u2026`,
    en: (sec) => `Rate limited. Retrying in ${sec} seconds\u2026`
  },
  "policy.bad_request": {
    zh: "\u63A5\u53E3\u8FD4\u56DE 422\uFF08\u8BF7\u6C42\u6570\u636E\u6216\u53C2\u6570\u6709\u8BEF\uFF09\uFF0C\u8BF7\u68C0\u67E5\u6A21\u578B\u540D\u3001\u8BF7\u6C42\u683C\u5F0F\u6216 API \u6587\u6863\u3002",
    en: "API returned 422 (invalid request). Please check model name, request format, or API documentation."
  },
  "policy.no_fallback": {
    zh: "\u5F53\u524D\u6A21\u578B\u4E0D\u53EF\u7528\uFF0C\u5907\u7528\u6A21\u578B\u4E5F\u672A\u914D\u7F6E\u6216\u4E0D\u53EF\u7528\uFF0C\u8BF7\u68C0\u67E5\u914D\u7F6E\u3002",
    en: "Current model unavailable and no fallback configured. Please check your configuration."
  },
  "policy.switching_fallback": {
    zh: "\u6A21\u578B\u5F02\u5E38\uFF0C\u6B63\u5728\u5207\u6362\u5907\u7528\u6A21\u578B\u2026",
    en: "Model error. Switching to fallback model\u2026"
  },
  "mock.processing": {
    zh: (preview) => `\u6839\u636E\u60A8\u8BF4\u7684\u300C${preview}\u300D\uFF0C\u6211\u8FD9\u8FB9\u5DF2\u6536\u5230\u3002\u8BF7\u5728\u300C\u914D\u7F6E\u300D\u9875\u586B\u5199\u4E3B/\u5907\u6A21\u578B\u5E76\u4FDD\u5B58\uFF0C\u5373\u53EF\u4F7F\u7528\u771F\u5B9E\u6A21\u578B\u3002`,
    en: (preview) => `Received your message: "${preview}". Please configure primary/fallback models in settings to use a real model.`
  },
  "mock.prompt": {
    zh: "\u8BF7\u76F4\u63A5\u8F93\u5165\u60A8\u7684\u95EE\u9898\u3002",
    en: "Please enter your question."
  },
  "mock.processing_prefix": {
    zh: "\u6B63\u5728\u5904\u7406\u300C",
    en: 'Processing "'
  }
};
var currentLocale = "zh";
function t2(key, ...args) {
  const entry = messages[key];
  const value = entry[currentLocale];
  if (typeof value === "function") {
    return value(...args);
  }
  return value;
}
var Stopwatch = class _Stopwatch {
  t0;
  laps = [];
  constructor() {
    this.t0 = performance$1.now();
  }
  static start() {
    return new _Stopwatch();
  }
  /** Record a lap from the start time. Returns formatted string. */
  lap(label) {
    const ms = performance$1.now() - this.t0;
    this.laps.push({ label, ms });
    return `${label}: ${ms.toFixed(1)}ms`;
  }
  /** Elapsed milliseconds since creation. */
  elapsed() {
    return performance$1.now() - this.t0;
  }
  /** Format elapsed as string. */
  elapsedStr() {
    return `${this.elapsed().toFixed(1)}ms`;
  }
  /** Record final lap and return formatted string. */
  stop(label = "total") {
    return this.lap(label);
  }
  /** One-line summary of all laps. */
  summary() {
    return this.laps.map((l) => `${l.label}=${l.ms.toFixed(1)}ms`).join(" ");
  }
};

// src/framework/core/agent/stream/stream-parser.ts
var OPEN_TAGS = ["<thinking>", "<think>"];
var CLOSE_TAGS = ["</thinking>", "</think>"];
var HOLD_OPEN = Math.max(...OPEN_TAGS.map((t3) => t3.length)) - 1;
var HOLD_CLOSE = Math.max(...CLOSE_TAGS.map((t3) => t3.length)) - 1;
var ThinkTagStreamParser = class {
  inThink = false;
  buf = "";
  feed(chunk) {
    this.buf += chunk;
    return this.drain();
  }
  flush() {
    if (!this.buf) return [];
    const kind = this.inThink ? "thinking" : "text";
    const out = [{ kind, content: this.buf }];
    this.buf = "";
    return out;
  }
  /**
   * Find the earliest occurrence of any tag in the buffer.
   * When multiple tags match at the same position, the longest wins
   * (so `<thinking>` is preferred over `<think>`).
   */
  findTag(tags) {
    const lower = this.buf.toLowerCase();
    let best = null;
    for (const tag of tags) {
      const idx = lower.indexOf(tag);
      if (idx !== -1 && (best === null || idx < best.idx || idx === best.idx && tag.length > best.len)) {
        best = { idx, len: tag.length };
      }
    }
    return best;
  }
  drain() {
    const out = [];
    while (this.buf.length > 0) {
      const tags = this.inThink ? CLOSE_TAGS : OPEN_TAGS;
      const hold = this.inThink ? HOLD_CLOSE : HOLD_OPEN;
      const match = this.findTag(tags);
      if (match) {
        const content = this.buf.slice(0, match.idx);
        if (content) {
          out.push({ kind: this.inThink ? "thinking" : "text", content });
        }
        this.buf = this.buf.slice(match.idx + match.len);
        this.inThink = !this.inThink;
        continue;
      }
      if (this.buf.length > hold) {
        const safe = this.buf.slice(0, -hold);
        if (safe) {
          out.push({ kind: this.inThink ? "thinking" : "text", content: safe });
        }
        this.buf = this.buf.slice(-hold);
      }
      break;
    }
    return out;
  }
};
function stripThinkTags(text2) {
  return text2.replace(/<think(?:ing)?>\s*[\s\S]*?\s*<\/think(?:ing)?>/gi, "").trim();
}

// src/framework/core/agent/stream/stream-consumer.ts
var StreamConsumer = class {
  consume(stream, params) {
    return this.doConsume(stream, params);
  }
  async doConsume(stream, params) {
    const { onText, onThinking, abortSignal } = params;
    let turnContent = "";
    let aborted = false;
    let streamError = null;
    const turnUsage = { totalTokens: 0 };
    const turnToolCalls = [];
    const thinkParser = new ThinkTagStreamParser();
    const emitParsed = (chunks) => {
      for (const p3 of chunks) {
        if (p3.kind === "thinking") {
          onThinking(p3.content);
        } else {
          turnContent += p3.content;
          onText(p3.content);
        }
      }
    };
    try {
      for await (const chunk of stream) {
        if (abortSignal?.aborted) {
          aborted = true;
          break;
        }
        switch (chunk.type) {
          case "content":
            if (chunk.content) emitParsed(thinkParser.feed(chunk.content));
            break;
          case "reasoning":
            if (chunk.content) {
              emitParsed(thinkParser.flush());
              onThinking(chunk.content);
            }
            break;
          case "tool_call":
            if (chunk.toolCall) turnToolCalls.push(chunk.toolCall);
            break;
          case "usage":
            if (chunk.usage) {
              turnUsage.totalTokens = (turnUsage.totalTokens || 0) + (chunk.usage.totalTokens || 0);
              turnUsage.inputTokens = (turnUsage.inputTokens || 0) + (chunk.usage.inputTokens || 0);
              turnUsage.outputTokens = (turnUsage.outputTokens || 0) + (chunk.usage.outputTokens || 0);
            }
            break;
          case "error":
            streamError = chunk.error ?? null;
            break;
        }
      }
      emitParsed(thinkParser.flush());
    } catch (err) {
      emitParsed(thinkParser.flush());
      if (abortSignal?.aborted || err instanceof Error && err.name === "AbortError") {
        aborted = true;
      } else {
        throw err;
      }
    }
    return { turnContent, turnToolCalls, turnUsage, aborted, streamError };
  }
};

// src/framework/core/agent/agent-executor.ts
var AgentExecutor = class {
  constructor(toolRegistry, logLevel = "info", options = {}) {
    this.toolRegistry = toolRegistry;
    this.maxTurns = options.maxTurns ?? 10;
    this.toolResultContextMax = options.toolResultContextMax ?? 16e3;
    this.logger = new Logger("AgentExecutor", logLevel);
  }
  toolRegistry;
  maxTurns;
  toolResultContextMax;
  streamConsumer = new StreamConsumer();
  logger;
  async execute(params) {
    const state = await this.runReActLoop(params);
    this.buildFallbackContent(state, params.executor.onChunk);
    return {
      content: state.content,
      thinking: state.thinking || void 0,
      toolCalls: state.allToolCalls,
      usage: state.usage,
      aborted: state.aborted
    };
  }
  // ── ReAct Loop ──────────────────────────────────────────────────────
  async runReActLoop(params) {
    const { session, message, tools, executor } = params;
    const { onChunk, abortSignal, context } = executor;
    const state = {
      content: "",
      thinking: "",
      allToolCalls: [],
      usage: { totalTokens: 0 },
      aborted: false,
      lastSuccessfulToolResult: "",
      conversationMessages: [{ role: "user", content: message }]
    };
    for (let turn = 0; turn < this.maxTurns; turn++) {
      if (abortSignal?.aborted) {
        state.aborted = true;
        break;
      }
      if (turn > 0) {
        onChunk({ type: "progress", step: "llm", status: "running", content: t2("agent.thinking_turn", turn + 1) });
      }
      const stream = session.processMessageStream({
        message: turn === 0 ? message : "",
        images: turn === 0 ? executor.images : void 0,
        tools,
        rawExtraMessages: turn > 0 ? state.conversationMessages : void 0,
        context: {
          sessionKey: context.sessionKey,
          workspaceDir: context.workspaceDir,
          userId: context.userId,
          channel: context.channel,
          skillsContext: executor.skills.map((s) => s.id),
          messageHistory: context.messageHistory ?? []
        },
        abortSignal
      });
      const turnResult = await this.streamConsumer.consume(stream, {
        onText: (content) => {
          state.content += content;
          onChunk({ type: "text", content });
        },
        onThinking: (content) => {
          state.thinking += content;
          onChunk({ type: "thinking", content });
        },
        abortSignal
      });
      state.usage = {
        totalTokens: (state.usage.totalTokens || 0) + (turnResult.turnUsage.totalTokens || 0),
        inputTokens: (state.usage.inputTokens || 0) + (turnResult.turnUsage.inputTokens || 0),
        outputTokens: (state.usage.outputTokens || 0) + (turnResult.turnUsage.outputTokens || 0)
      };
      state.aborted = turnResult.aborted;
      if (turnResult.streamError && !turnResult.turnContent && turnResult.turnToolCalls.length === 0) {
        this.logger.warn("Stream error with no content, propagating", { error: turnResult.streamError });
        throw new Error(turnResult.streamError);
      }
      if (state.aborted || turnResult.turnToolCalls.length === 0) {
        break;
      }
      state.conversationMessages.push({
        role: "assistant",
        content: turnResult.turnContent || void 0,
        tool_calls: turnResult.turnToolCalls.map((tc) => ({
          id: tc.id,
          type: "function",
          function: { name: tc.name, arguments: JSON.stringify(tc.args ?? {}) }
        }))
      });
      await this.executeToolBatch(turnResult.turnToolCalls, state, executor);
    }
    return state;
  }
  // ── Tool Batch Execution ────────────────────────────────────────────
  async executeToolBatch(toolCalls, state, executor) {
    const { onChunk, context } = executor;
    for (const tc of toolCalls) {
      state.allToolCalls.push(tc);
      onChunk({
        type: "progress",
        step: "tool",
        status: "running",
        content: t2("agent.calling_tool", tc.name),
        tool: tc.name
      });
    }
    const execPromises = toolCalls.map((tc) => {
      const execArgs = { ...tc.args };
      if (tc.name === "exec" && context.workspaceDir) execArgs.cwd = context.workspaceDir;
      return this.toolRegistry.executeTool(tc.name, execArgs, context, executor.abortSignal);
    });
    const execResults = await Promise.allSettled(execPromises);
    for (let i = 0; i < toolCalls.length; i++) {
      const tc = toolCalls[i];
      const settled = execResults[i];
      const execResult = settled.status === "fulfilled" ? settled.value : { error: settled.reason instanceof Error ? settled.reason.message : String(settled.reason) };
      tc.status = execResult.error ? "error" : "success";
      tc.result = execResult.result;
      tc.error = execResult.error;
      onChunk(
        execResult.error ? { type: "progress", step: "tool", status: "error", content: t2("agent.tool_error", tc.name), tool: tc.name } : { type: "progress", step: "tool", status: "completed", content: t2("agent.tool_success", tc.name), tool: tc.name }
      );
      onChunk({
        type: "tool",
        tool: tc.name,
        args: tc.args,
        status: "completed",
        result: execResult.result,
        error: execResult.error
      });
      let resultText;
      if (execResult.error) {
        resultText = `Error: ${execResult.error}`;
      } else {
        const rawDisplay = formatToolResultForDisplay(tc.name, execResult.result);
        resultText = rawDisplay;
        state.lastSuccessfulToolResult = rawDisplay;
      }
      state.conversationMessages.push({
        role: "tool",
        tool_call_id: tc.id,
        content: resultText.slice(0, this.toolResultContextMax)
      });
    }
  }
  // ── Fallback Content ────────────────────────────────────────────────
  buildFallbackContent(state, onChunk) {
    if (state.aborted) return;
    if (state.allToolCalls.length > 0) {
      const visibleBody = stripThinkTags(state.content);
      if (!visibleBody) {
        let fallback = "";
        if (state.lastSuccessfulToolResult) {
          fallback = state.lastSuccessfulToolResult;
        } else {
          const lastErr = state.allToolCalls.filter((tc) => tc.error).pop();
          if (lastErr) {
            fallback = t2("agent.tool_exec_error", lastErr.name);
          }
        }
        if (fallback) {
          state.content += "\n\n" + fallback;
          onChunk({ type: "text", content: "\n\n" + fallback });
        }
      }
    }
    if (state.allToolCalls.length === 0) {
      const visibleBody = stripThinkTags(state.content);
      if (!visibleBody.trim()) {
        const emptyMsg = t2("agent.empty_response");
        this.logger.warn("Empty response from LLM");
        state.content = emptyMsg;
        onChunk({ type: "text", content: emptyMsg });
        onChunk({ type: "error", error: emptyMsg });
      }
    }
  }
};

// src/framework/core/agent/agent-metrics.ts
var AgentMetrics = class {
  totalRequests = 0;
  successfulRequests = 0;
  failedRequests = 0;
  averageResponseTime = 0;
  totalTokensUsed = 0;
  recordRequest(success, processingTime) {
    this.totalRequests++;
    if (success) {
      this.successfulRequests++;
    } else {
      this.failedRequests++;
    }
    const totalTime = this.averageResponseTime * (this.totalRequests - 1) + processingTime;
    this.averageResponseTime = totalTime / this.totalRequests;
  }
  addTokens(tokens) {
    this.totalTokensUsed += tokens;
  }
  getSummary(activeModel) {
    return {
      totalRequests: this.totalRequests,
      successfulRequests: this.successfulRequests,
      failedRequests: this.failedRequests,
      activeModel: activeModel || "none",
      successRate: this.totalRequests > 0 ? (this.successfulRequests / this.totalRequests * 100).toFixed(2) + "%" : "0%",
      averageResponseTime: this.averageResponseTime.toFixed(2) + "ms",
      totalTokensUsed: this.totalTokensUsed
    };
  }
};

// src/framework/core/agent/execution-policy.ts
var DefaultExecutionPolicy = class {
  constructor(logger3) {
    this.logger = logger3;
  }
  logger;
  async handle(error, params, _startTime, ctx) {
    const err = error;
    const apiErr = error !== null && typeof error === "object" && "isAuth" in error ? error : null;
    const isAbort = params.abortSignal?.aborted || err.name === "AbortError";
    if (isAbort || apiErr?.isAuth) {
      const userMsg = isAbort ? t2("policy.request_cancelled") : t2("policy.auth_failed");
      this.logger.error("Non-retriable error", { abort: isAbort, auth: apiErr?.isAuth });
      return { action: "respond", response: ctx.createErrorResponse(userMsg) };
    }
    if (apiErr?.isRateLimit) {
      const waitSec = apiErr.retryAfterSeconds ?? 15;
      this.logger.warn(`Rate limited (429), waiting ${waitSec}s`, { provider: apiErr.provider });
      params.onChunk({ type: "error", error: t2("policy.rate_limited", waitSec) });
      await new Promise((resolve5) => {
        const timer = setTimeout(resolve5, waitSec * 1e3);
        params.abortSignal?.addEventListener("abort", () => {
          clearTimeout(timer);
          resolve5();
        }, { once: true });
      });
      if (params.abortSignal?.aborted) {
        return { action: "respond", response: ctx.createErrorResponse(t2("policy.request_cancelled")) };
      }
      return { action: "retrySameModel" };
    }
    if (apiErr?.isBadRequest) {
      this.logger.error("422 Bad Request, no fallback", {
        model: ctx.getActiveModelName(),
        error: err.message
      });
      return {
        action: "respond",
        response: ctx.createErrorResponse(t2("policy.bad_request"))
      };
    }
    if (apiErr?.isModelNotFound) {
      this.logger.warn("Model not found, trying fallback", { model: ctx.getActiveModelName() });
      return { action: "retryAfterFallback", fallbackMessage: t2("policy.no_fallback") };
    }
    this.logger.warn("Stream error, attempting fallback", { error: err.message });
    params.onChunk({ type: "error", error: t2("policy.switching_fallback") });
    return { action: "retryAfterFallback", fallbackMessage: t2("agent.all_models_unavailable") };
  }
};

// src/framework/core/agent/session/context-compressor.ts
var CHARS_PER_TOKEN_LATIN = 4;
var CHARS_PER_TOKEN_CJK = 1.5;
var CJK_RE = /[\u4e00-\u9fff\u3400-\u4dbf\u3000-\u303f\uff00-\uffef]/g;
function estimateTokens(text2) {
  const cjkChars = text2.match(CJK_RE)?.length ?? 0;
  const latinChars = text2.length - cjkChars;
  return Math.ceil(latinChars / CHARS_PER_TOKEN_LATIN + cjkChars / CHARS_PER_TOKEN_CJK);
}
function compressHistory(history, options) {
  const { maxTokens, recentTurnCount = 4 } = options;
  if (history.length === 0) return [];
  const budget = Math.floor(maxTokens * 0.6);
  const recentCutoff = Math.max(0, history.length - recentTurnCount * 2);
  const recentMessages = history.slice(recentCutoff);
  const olderMessages = history.slice(0, recentCutoff);
  let recentTokens = 0;
  for (const msg of recentMessages) {
    recentTokens += estimateTokens(msg.content);
  }
  if (recentTokens >= budget) {
    const trimmed = [];
    let usedTokens = 0;
    for (let i = recentMessages.length - 1; i >= 0; i--) {
      const msg = recentMessages[i];
      const tokens = estimateTokens(msg.content);
      if (usedTokens + tokens > budget) break;
      trimmed.unshift({ role: msg.role, content: msg.content });
      usedTokens += tokens;
    }
    if (trimmed.length > 0 && olderMessages.length > 0) {
      trimmed.unshift({ role: "assistant", content: "[...earlier context omitted...]" });
    }
    return trimmed;
  }
  let remainingBudget = budget - recentTokens;
  const toolMessages = [];
  const plainMessages = [];
  for (const msg of olderMessages) {
    const tokens = estimateTokens(msg.content);
    if (msg.role === "tool" || msg.content.startsWith("[\u6267\u884C\u7ED3\u679C]") || msg.content.startsWith("[\u6267\u884C\u5931\u8D25]")) {
      toolMessages.push({ msg, tokens });
    } else {
      plainMessages.push({ msg, tokens });
    }
  }
  const keptOlder = [];
  for (const { msg, tokens } of toolMessages) {
    if (tokens <= remainingBudget) {
      keptOlder.push({ role: msg.role, content: msg.content });
      remainingBudget -= tokens;
    }
  }
  for (const { msg, tokens } of plainMessages) {
    if (tokens <= remainingBudget) {
      keptOlder.push({ role: msg.role, content: msg.content });
      remainingBudget -= tokens;
    }
  }
  const dropped = olderMessages.length - keptOlder.length;
  const result = [];
  if (dropped > 0) {
    result.push({ role: "assistant", content: `[...${dropped} earlier messages omitted...]` });
  }
  result.push(...keptOlder);
  for (const msg of recentMessages) {
    result.push({ role: msg.role, content: msg.content });
  }
  return result;
}

// src/framework/core/agent/session/llm-session.ts
var LLMSession = class {
  constructor(modelInfo, provider, modelParams, logger3) {
    this.modelInfo = modelInfo;
    this.provider = provider;
    this.modelParams = modelParams;
    this.logger = logger3;
  }
  modelInfo;
  provider;
  modelParams;
  logger;
  sessionId = crypto2.randomUUID();
  systemPrompt = "";
  async updateSystemPrompt(prompt) {
    this.systemPrompt = prompt;
  }
  getActiveModel() {
    return this.modelInfo.model;
  }
  async close() {
  }
  async *processMessageStream(params) {
    const history = compressHistory(
      params.context.messageHistory ?? [],
      { maxTokens: this.modelInfo.maxTokens }
    );
    const messages2 = [
      ...this.systemPrompt ? [{ role: "system", content: this.systemPrompt }] : [],
      ...history.map((h) => ({ role: h.role, content: h.content }))
    ];
    if (params.rawExtraMessages && params.rawExtraMessages.length > 0) {
      messages2.push(...params.rawExtraMessages);
    } else if (params.message) {
      messages2.push({ role: "user", content: params.message });
    }
    this.logger.debug("processMessageStream", {
      historyIn: (params.context.messageHistory ?? []).length,
      historyOut: history.length,
      totalMessages: messages2.length
    });
    const stream = this.provider.chatStream(
      this.modelInfo.model,
      messages2,
      {
        tools: params.tools && params.tools.length > 0 ? params.tools : void 0,
        maxTokens: this.modelInfo.maxTokens,
        abortSignal: params.abortSignal,
        ...this.modelParams
      }
    );
    for await (const chunk of stream) {
      yield chunk;
    }
  }
};
function createMockSession(modelName = "mock") {
  const sessionId = crypto2.randomUUID();
  return {
    sessionId,
    async updateSystemPrompt() {
    },
    getActiveModel() {
      return modelName;
    },
    async close() {
    },
    async *processMessageStream(params) {
      const msg = params.message.trim();
      const preview = msg.length > 40 ? msg.slice(0, 40) + "\u2026" : msg;
      yield { type: "content", content: t2("mock.processing_prefix") };
      await new Promise((r) => setTimeout(r, 80));
      yield { type: "content", content: preview };
      yield { type: "content", content: "\u2026\n\n" };
      await new Promise((r) => setTimeout(r, 150));
      const reply = msg ? t2("mock.processing", preview) : t2("mock.prompt");
      for (const part of reply) {
        yield { type: "content", content: part };
        await new Promise((r) => setTimeout(r, 20));
      }
      yield { type: "usage", usage: { totalTokens: 100, inputTokens: 20, outputTokens: 80 } };
    }
  };
}

// src/framework/core/agent/model/model-metadata.ts
var DEFAULT_TOKEN_LIMITS = {
  "claude-4": 2e5,
  "claude-3.7": 2e5,
  "claude-3.5-sonnet": 2e5,
  "claude-3.5-haiku": 2e5,
  "claude-3-opus": 2e5,
  "claude-3-sonnet": 2e5,
  "claude-3-haiku": 2e5,
  "gpt-4o": 128e3,
  "gpt-4o-mini": 128e3,
  "gpt-4-turbo": 128e3,
  "gpt-4": 128e3,
  "gpt-3.5-turbo": 16e3,
  "o1": 2e5,
  "o3": 2e5,
  "o4-mini": 2e5,
  "deepseek-chat": 64e3,
  "deepseek-reasoner": 64e3,
  "deepseek-v3": 64e3,
  "deepseek-r1": 64e3,
  "gemini-2": 1e6,
  "gemini-1.5-pro": 1e6,
  "gemini-1.5-flash": 1e6,
  "qwen": 32e3
};
var DEFAULT_COSTS = {
  "claude-4": 15,
  "claude-3.7": 10,
  "claude-3.5-sonnet": 3,
  "claude-3.5-haiku": 0.8,
  "claude-3-opus": 15,
  "gpt-4o": 2.5,
  "gpt-4o-mini": 0.15,
  "gpt-4-turbo": 5,
  "gpt-4": 10,
  "gpt-3.5-turbo": 0.5,
  "o1": 15,
  "o3": 10,
  "o4-mini": 1.1,
  "deepseek": 0.27,
  "gemini-2": 1.25,
  "gemini-1.5-pro": 1.25,
  "gemini-1.5-flash": 0.075,
  "qwen": 0.5
};
var DEFAULT_LATENCIES = {
  "claude": 2e3,
  "gpt-4o": 1500,
  "gpt-4": 3e3,
  "gpt-3.5": 1500,
  "o1": 5e3,
  "o3": 4e3,
  "o4": 3e3,
  "deepseek": 2e3,
  "gemini": 1500,
  "qwen": 2e3,
  "local": 500
};
var FALLBACK_MAX_TOKENS = 4096;
function getMaxTokensForModel(model, configOverrides) {
  const merged = configOverrides ? { ...DEFAULT_TOKEN_LIMITS, ...configOverrides } : DEFAULT_TOKEN_LIMITS;
  for (const [pattern, limit] of Object.entries(merged)) {
    if (model.includes(pattern)) return limit;
  }
  return FALLBACK_MAX_TOKENS;
}
function getCostForModel(model) {
  for (const [pattern, cost] of Object.entries(DEFAULT_COSTS)) {
    if (model.includes(pattern)) return cost;
  }
  return 2;
}
function getExpectedLatency(model) {
  for (const [pattern, latency] of Object.entries(DEFAULT_LATENCIES)) {
    if (model.includes(pattern)) return latency;
  }
  return 2e3;
}
function getModelTokenLimit(model) {
  return getMaxTokensForModel(model);
}

// src/framework/core/agent/model/model-router.ts
var OptimalModelRouter = class _OptimalModelRouter {
  constructor(config) {
    this.config = config;
    this.logger = new Logger("ModelRouter");
    this.performanceCache = new LRUCache(_OptimalModelRouter.PERFORMANCE_CACHE_SIZE);
  }
  config;
  logger;
  performanceCache;
  static FAILURE_THRESHOLD = 3;
  static PERFORMANCE_CACHE_SIZE = 64;
  recordFailure(model) {
    const key = `${model.provider}/${model.model}`;
    const existing = this.performanceCache.get(key);
    const entry = existing ?? {
      averageLatency: 0,
      successRate: 1,
      lastUpdated: Date.now()
    };
    entry.successRate = Math.max(0, entry.successRate - 1 / _OptimalModelRouter.FAILURE_THRESHOLD);
    entry.lastUpdated = Date.now();
    this.performanceCache.set(key, entry);
    this.logger.warn(`Model failure recorded: ${key}, successRate now ${entry.successRate.toFixed(2)}`);
  }
  recordSuccess(model) {
    const key = `${model.provider}/${model.model}`;
    const existing = this.performanceCache.get(key);
    const entry = existing ?? {
      averageLatency: 0,
      successRate: 1,
      lastUpdated: Date.now()
    };
    entry.successRate = Math.min(1, entry.successRate + 0.1);
    entry.lastUpdated = Date.now();
    this.performanceCache.set(key, entry);
  }
  isDemoted(model) {
    const key = `${model.provider}/${model.model}`;
    const entry = this.performanceCache.get(key);
    return !!entry && entry.successRate <= 0;
  }
  async selectOptimalModel() {
    const availableModels = this.getAvailableModels();
    if (availableModels.length === 0) {
      return {
        provider: "mock",
        model: "mock",
        maxTokens: 4096,
        costPer1kTokens: 0,
        latencyMs: 0
      };
    }
    const primaryId = this.config.models.primary?.trim() ?? "";
    const fallbackId = this.config.models.fallback?.trim() ?? "";
    const toId = (m) => `${m.provider}/${m.model}`;
    const primaryModel = primaryId ? availableModels.find((m) => toId(m) === primaryId) : null;
    if (primaryModel && await this.testModelAvailability(primaryModel)) {
      return primaryModel;
    }
    const fallbackModel = fallbackId ? availableModels.find((m) => toId(m) === fallbackId) : null;
    if (fallbackModel && await this.testModelAvailability(fallbackModel)) {
      return fallbackModel;
    }
    for (const model of availableModels) {
      if (await this.testModelAvailability(model)) {
        return model;
      }
    }
    return availableModels[0];
  }
  async selectFallbackModel(excludeModel) {
    const availableModels = this.getAvailableModels();
    const excludeKey = excludeModel ? `${excludeModel.provider}/${excludeModel.model}` : null;
    const toId = (m) => `${m.provider}/${m.model}`;
    for (const model of availableModels) {
      if (toId(model) === excludeKey) continue;
      if (this.isDemoted(model)) continue;
      if (await this.testModelAvailability(model)) {
        this.logger.info(`Fallback model selected: ${toId(model)}`);
        return model;
      }
    }
    return null;
  }
  getAvailableModels() {
    const models = [];
    if (this.config.models.primary) {
      models.push(this.parseModelString(this.config.models.primary));
    }
    if (this.config.models.fallback) {
      models.push(this.parseModelString(this.config.models.fallback));
    }
    if (this.config.models.local) {
      models.push(this.parseModelString(this.config.models.local, true));
    }
    return models;
  }
  parseModelString(modelStr, isLocal = false) {
    let provider;
    let modelName;
    if (modelStr.includes("/")) {
      const parts = modelStr.split("/");
      provider = parts[0] ?? "unknown";
      modelName = parts[1] ?? modelStr;
    } else {
      const providerKeys = Object.keys(this.config.models?.providers ?? {});
      provider = providerKeys.length === 1 ? providerKeys[0] : "unknown";
      modelName = modelStr.trim() || "default";
    }
    const modelsRecord = this.config.models;
    const configOverrides = modelsRecord?.tokenLimits;
    return {
      provider,
      model: modelName,
      maxTokens: getMaxTokensForModel(modelStr, configOverrides),
      costPer1kTokens: isLocal ? 0 : getCostForModel(modelStr),
      latencyMs: getExpectedLatency(modelStr)
    };
  }
  // TODO: implement real availability check (e.g. HEAD request to provider health endpoint)
  async testModelAvailability(model) {
    this.logger.debug(`Testing availability of model: ${model.model}`);
    return !this.isDemoted(model);
  }
};

// src/framework/core/agent/model/model-manager.ts
var ModelManager = class {
  constructor(config, options) {
    this.config = config;
    this.router = new OptimalModelRouter(config);
    this.logger = new Logger("ModelManager", config.logging?.level || "info");
    if (options?.providerRegistry) this.providerRegistry = options.providerRegistry;
  }
  config;
  router;
  logger;
  activeModel = null;
  activeProvider = null;
  providerRegistry = null;
  setProviderRegistry(registry) {
    this.providerRegistry = registry;
  }
  getActiveModel() {
    return this.activeModel;
  }
  getActiveProvider() {
    return this.activeProvider;
  }
  async initialize() {
    const modelInfo = await this.router.selectOptimalModel();
    this.activeModel = modelInfo;
    this.activeProvider = this.createProviderForModel(modelInfo);
    this.logger.info("Model initialized", { provider: modelInfo.provider, model: modelInfo.model });
    return modelInfo;
  }
  async reinitialize() {
    await this.initialize();
  }
  recordSuccess() {
    if (this.activeModel) this.router.recordSuccess(this.activeModel);
  }
  recordFailure() {
    if (this.activeModel) this.router.recordFailure(this.activeModel);
  }
  async switchToFallback() {
    if (this.activeModel) this.router.recordFailure(this.activeModel);
    const fallback = await this.router.selectFallbackModel(this.activeModel ?? void 0);
    if (!fallback) return false;
    this.activeModel = fallback;
    this.activeProvider = this.createProviderForModel(fallback);
    this.logger.info("Switched to fallback model", { provider: fallback.provider, model: fallback.model });
    return true;
  }
  createSession() {
    const modelInfo = this.activeModel;
    const provider = this.activeProvider;
    if (!modelInfo || !provider) {
      return createMockSession(this.activeModel?.model ?? "mock");
    }
    return this.createRealSession(modelInfo, provider);
  }
  async internalLLMCall(systemPrompt, userContent, maxTokens = 2048) {
    const provider = this.activeProvider;
    const model = this.activeModel;
    if (!provider || !model) return null;
    return provider.chatComplete(model.model, [
      { role: "system", content: systemPrompt },
      { role: "user", content: userContent }
    ], { maxTokens });
  }
  // ---------------------------------------------------------------------------
  // Private
  // ---------------------------------------------------------------------------
  getProviderConfig(provider) {
    const prov = this.config.models?.providers?.[provider];
    if (!prov || typeof prov !== "object") return null;
    const apiKey = prov.apiKey?.trim();
    const baseUrl = (prov.baseUrl ?? "").replace(/\/$/, "");
    if (!apiKey || !baseUrl) return null;
    return { apiKey, baseUrl, logLevel: this.config.logging?.level };
  }
  getModelParams(provider) {
    const prov = this.config.models?.providers?.[provider];
    if (!prov || typeof prov !== "object") return {};
    const p3 = prov;
    return {
      temperature: typeof p3.temperature === "number" ? p3.temperature : void 0,
      topP: typeof p3.topP === "number" ? p3.topP : void 0,
      enableThinking: typeof p3.enableThinking === "boolean" ? p3.enableThinking : true,
      frequencyPenalty: typeof p3.frequencyPenalty === "number" ? p3.frequencyPenalty : void 0,
      presencePenalty: typeof p3.presencePenalty === "number" ? p3.presencePenalty : void 0
    };
  }
  createProviderForModel(modelInfo) {
    const providerConfig = this.getProviderConfig(modelInfo.provider);
    if (!providerConfig) {
      this.logger.warn("No API key configured, LLM features limited", { provider: modelInfo.provider });
      return null;
    }
    const factory = this.providerRegistry?.getFactory(modelInfo.provider);
    if (factory) {
      return factory.create(providerConfig);
    }
    return new OpenAICompatibleProvider(modelInfo.provider, providerConfig);
  }
  createRealSession(modelInfo, provider) {
    return new LLMSession(modelInfo, provider, this.getModelParams(modelInfo.provider), this.logger);
  }
};
var INTERPRETER_MAP = {
  ".py": "python",
  ".sh": "bash",
  ".ts": "npx tsx",
  ".js": "node"
};
function interpreterForScript(scriptPath) {
  return INTERPRETER_MAP[extname(scriptPath).toLowerCase()] ?? "python";
}
var INSTRUCTION_FILES = [
  { name: "SOUL.md", section: "Personality & Principles" },
  { name: "IDENTITY.md", section: "Identity" },
  { name: "AGENTS.md", section: "Operational Instructions" },
  { name: "USER.md", section: "User Profile" },
  { name: "TOOLS.md", section: "Tool Notes" }
];
var DEFAULT_SYSTEM_PROMPT = `You are the NovaClaw AI assistant, a lightweight yet powerful intelligent coding assistant.

## Core Capabilities
- File operations (read, write, edit, search)
- Command execution (security-controlled system commands)
- Web browsing and search
- Code analysis and generation
- Task automation
- Multi-channel communication

## Tool Call Guidelines
- Before executing commands, extract key parameters (names, IDs, paths, etc.) from user messages and conversation context
- Strictly follow the command format and parameter names given in Skills documentation
- If execution fails, analyze the error, correct parameters and retry \u2014 do not repeat the same failing command
- If Skills docs provide example commands, prefer those formats

## Thinking
- When you need to reason, plan, or think through a problem, wrap your thinking in <think>...</think> tags
- Content inside <think> tags is hidden from the final response and shown separately \u2014 use it freely for internal reasoning
- Do NOT put your reasoning or planning steps in the visible response; only show conclusions and results

## Output Guidelines
- Tool execution is internal; do not describe which tools you called or what parameters you used
- Only show end results and conclusions to the user, in clear Markdown format
- If a tool fails and cannot be retried, briefly explain why and give suggestions \u2014 do not expose raw error messages

## Safety Guidelines
- Confirm before executing destructive operations
- Respect file permissions and ownership
- Use sandbox for untrusted code
- Follow user preferences and workspace conventions`;
var PromptBuilder = class _PromptBuilder {
  constructor(config) {
    this.config = config;
  }
  config;
  instructionCache = /* @__PURE__ */ new Map();
  cacheLoadedAt = 0;
  static CACHE_TTL_MS = 6e4;
  async loadInstructionFiles() {
    const wsDir = this.config.workspaceDir;
    if (!wsDir) return;
    this.instructionCache.clear();
    for (const { name } of INSTRUCTION_FILES) {
      for (const dir of [wsDir, join(wsDir, ".novaclaw")]) {
        try {
          const content = await readFile(join(dir, name), "utf-8");
          if (content.trim()) {
            this.instructionCache.set(name, content.trim());
            break;
          }
        } catch {
        }
      }
    }
    this.cacheLoadedAt = Date.now();
  }
  isCacheStale() {
    return Date.now() - this.cacheLoadedAt > _PromptBuilder.CACHE_TTL_MS;
  }
  build(params) {
    const { context, skills, allSkills, memoryContext, toolDescriptions, tools } = params;
    const maxChars = params.maxPromptChars ?? this.getDefaultMaxChars();
    const toolsDesc = toolDescriptions ?? (tools?.length ? this.buildDynamicToolsDescription(tools) : this.getDefaultToolsDescription());
    const instructionsSection = this.buildInstructionsSection();
    const soulContent = this.instructionCache.get("SOUL.md");
    const identityContent = this.instructionCache.get("IDENTITY.md");
    const basePrompt = soulContent || identityContent ? (identityContent ?? "") + "\n\n" + (soulContent ?? "") : DEFAULT_SYSTEM_PROMPT;
    const coreParts = [
      basePrompt.trim(),
      `

## Tools
${toolsDesc}`,
      instructionsSection,
      `
## Context
- Session: ${context.sessionKey}
- User: ${context.userId}
- Channel: ${context.channel}
- Workspace: ${this.config.workspaceDir}
`
    ];
    const coreText = coreParts.join("");
    const supplementParts = [
      { label: "catalog", text: this.buildSkillCatalog(allSkills ?? [], skills), priority: 2 },
      { label: "skills", text: this.buildSkillsSection(skills), priority: 3 },
      { label: "memory", text: this.buildMemorySection(memoryContext), priority: 1 }
    ];
    supplementParts.sort((a, b) => b.priority - a.priority);
    let result = coreText;
    let budget = maxChars - coreText.length;
    for (const part of supplementParts) {
      if (!part.text) continue;
      if (part.text.length <= budget) {
        result += "\n" + part.text;
        budget -= part.text.length + 1;
      } else if (budget > 200) {
        result += "\n" + part.text.slice(0, budget - 50) + "\n\n[...truncated due to context limit]";
        budget = 0;
      }
    }
    result += "\nAssist the user professionally and efficiently.";
    return result.trim();
  }
  getDefaultMaxChars() {
    const modelMaxTokens = this.config.models?.primary ? getModelTokenLimit(this.config.models.primary) : 128e3;
    return Math.floor(modelMaxTokens * 0.25 * 4);
  }
  buildInstructionsSection() {
    const parts = [];
    const agents = this.instructionCache.get("AGENTS.md");
    if (agents) parts.push(`
## Operational Instructions
${agents}`);
    const user = this.instructionCache.get("USER.md");
    if (user) parts.push(`
## User Profile
${user}`);
    const toolNotes = this.instructionCache.get("TOOLS.md");
    if (toolNotes) parts.push(`
## Tool Notes
${toolNotes}`);
    return parts.join("\n");
  }
  /**
   * Compact catalog of all installed skills so the agent knows what
   * capabilities are available even when they aren't matched for the
   * current message.  Use `list_skills` / `get_skill` to access details.
   */
  buildSkillCatalog(all, matched) {
    if (all.length === 0) return "";
    const matchedIds = new Set(matched.map((s) => s.id));
    const lines = all.map((s) => {
      const tag = s.runScript ? " [executable]" : "";
      const active = matchedIds.has(s.id) ? " \u2605" : "";
      return `- **${s.id}**${tag}: ${s.description}${active}`;
    });
    return `## Skill Catalog (${all.length} installed)

Use \`list_skills\` to enumerate all skills, \`get_skill\` to read full content.
Skills marked \u2605 are already loaded for the current request.

${lines.join("\n")}
`;
  }
  /**
   * Full content of matched skills, with structured invocation hints
   * for executable skills that ship with a run script.
   */
  buildSkillsSection(skills) {
    if (skills.length === 0) return "";
    const blocks = skills.map((skill) => {
      let header = `### ${skill.id}
${skill.description}`;
      if (skill.runScript && existsSync(skill.runScript)) {
        const interpreter = interpreterForScript(skill.runScript);
        header += `

> **Executable skill** \u2014 invoke via the \`exec\` tool:
> \`\`\`
> ${interpreter} ${skill.runScript} <subcommand> [args...]
> \`\`\``;
        if (skill.skillDir) {
          header += `
> Working directory: \`${skill.skillDir}\``;
        }
      }
      if (skill.childSkills?.length) {
        header += `

Sub-skills: ${skill.childSkills.map((c) => `\`${c}\``).join(", ")}`;
      }
      return `${header}

${skill.content}`;
    });
    return `## Active Skills

The following skill guides are relevant to the current task:

${blocks.join("\n\n---\n\n")}

Follow these Skills to handle the user's request.`;
  }
  buildMemorySection(memoryContext) {
    if (!memoryContext?.trim()) return "";
    return `
## Memory Context
Relevant information retrieved from the memory store:

${memoryContext}
`;
  }
  buildDynamicToolsDescription(tools) {
    return tools.map((t3) => `- ${t3.name}: ${t3.description}`).join("\n");
  }
  getDefaultToolsDescription() {
    return `
- read: Read file contents
- write: Write files
- edit: Edit files (search & replace)
- exec: Execute system commands (sandboxed)
- grep: Search file contents by regex
- process: Manage background processes
- web_search: Web search
- web_fetch: Fetch URLs via HTTP(S) \u2014 supports GET/POST/PUT/PATCH/DELETE/HEAD, custom headers, request body; auto-converts HTML to readable text, auto-parses JSON
`;
  }
};

// src/framework/core/agent/tool/tool-schema.ts
function toolToSchema(tool) {
  return {
    type: "function",
    function: {
      name: tool.name,
      description: tool.description,
      parameters: tool.parameters
    }
  };
}
function toolsToOpenAISchema(tools) {
  return tools.map((t3) => ({
    type: "function",
    function: {
      name: t3.name,
      description: t3.description,
      parameters: compactParameters(t3.parameters)
    }
  }));
}
function compactParameters(params) {
  if (!params || typeof params !== "object") return params ?? {};
  const obj = { ...params };
  delete obj.additionalProperties;
  if (obj.properties && typeof obj.properties === "object") {
    const props = { ...obj.properties };
    for (const key of Object.keys(props)) {
      const prop = { ...props[key] };
      if (typeof prop.description === "string" && prop.description.length > 80) {
        prop.description = prop.description.slice(0, 80);
      }
      delete prop.additionalProperties;
      props[key] = prop;
    }
    obj.properties = props;
  }
  return obj;
}

// src/framework/core/agent/tool/tool-filter.ts
var SKILL_TOOL_NAMES = ["list_skills", "get_skill", "search_skills"];
var DEFAULT_CHANNEL_RULES = [
  {
    channel: CHANNEL.CLI,
    include: ["read", "write", "edit", "exec", "grep", "process", ...SKILL_TOOL_NAMES]
  },
  {
    channel: CHANNEL.WEBCHAT,
    execGated: true
  }
];
var ToolFilter = class {
  constructor(config) {
    this.config = config;
  }
  config;
  getContextualTools(allTools, context) {
    const rule = DEFAULT_CHANNEL_RULES.find((r) => r.channel === context.channel);
    if (!rule) return allTools;
    const allowExecChannels = this.config.tools?.allowExecInChannels;
    return allTools.filter((tool) => {
      const n = tool.name;
      if (rule.include) {
        return rule.include.includes(n) || n.startsWith("mcp_") || n.startsWith("http_");
      }
      if (rule.exclude?.includes(n)) return false;
      if (rule.execGated && n === "exec") {
        return Array.isArray(allowExecChannels) ? allowExecChannels.includes(context.channel) : true;
      }
      return true;
    });
  }
};

// src/framework/core/agent/tool/tool-profiles.ts
var TOOL_PROFILES = {
  minimal: ["web_search", "web_fetch"],
  coding: ["read", "write", "edit", "exec", "grep", "process", "web_search", "web_fetch"],
  messaging: ["send", "channels", "web_search"],
  full: ["read", "write", "edit", "exec", "grep", "process", "web_search", "web_fetch", "send", "channels"],
  balanced: ["read", "write", "edit", "web_search", "web_fetch", "exec", "grep", "process"]
};

// src/framework/core/agent/tool/tool-loader.ts
var ALL_TOOL_NAMES = ["read", "write", "edit", "exec", "grep", "process", "web_search", "web_fetch", "send", "channels"];
var ToolLoader = class {
  constructor(config, options = {}) {
    this.config = config;
    this.options = options;
    this.logger = new Logger("ToolLoader", config.logging?.level || "info");
    this.toolTimeoutMs = config.tools?.sandbox?.timeout ?? TOOL_TIMEOUT_MS;
  }
  config;
  options;
  logger;
  toolTimeoutMs;
  setProtocolBridge(bridge) {
    this.options.protocolBridge = bridge;
  }
  async loadAll() {
    const tools = /* @__PURE__ */ new Map();
    this.loadBuiltinTools(tools);
    this.loadRegistryTools(tools);
    this.loadSkillTools(tools);
    await this.loadExtensionTools(tools);
    await this.loadMCPServerTools(tools);
    this.logger.info(`Loaded ${tools.size} tools (policy: ${this.config.tools?.policy || "balanced"})`);
    return tools;
  }
  /**
   * Load a scoped subset of tools for a worker agent.
   * Only loads the specified builtin tools and optionally MCP extensions.
   */
  async loadForScope(scope) {
    const tools = /* @__PURE__ */ new Map();
    if (scope.builtinTools && scope.builtinTools.length > 0) {
      const allBuiltins = /* @__PURE__ */ new Map();
      this.loadBuiltinTools(allBuiltins);
      for (const name of scope.builtinTools) {
        const tool = allBuiltins.get(name);
        if (tool) tools.set(name, tool);
      }
    }
    if (scope.mcpServer) {
      await this.loadMCPExtension(tools, { type: "mcp", endpoint: scope.mcpServer });
    }
    if (scope.skills) {
      this.loadSkillTools(tools);
    }
    this.logger.debug(`Loaded ${tools.size} scoped tools`, {
      builtinTools: scope.builtinTools,
      mcpServer: scope.mcpServer
    });
    return tools;
  }
  loadBuiltinTools(tools) {
    const policy = this.config.tools?.policy || "balanced";
    const allowed = TOOL_PROFILES[policy] ?? TOOL_PROFILES.balanced ?? [];
    const toolNames = allowed.includes("*") ? ALL_TOOL_NAMES : allowed;
    const perms = this.config.tools?.permissions;
    const canRead = perms?.fileSystem?.read !== false;
    const canWrite = perms?.fileSystem?.write !== false;
    const canNetwork = perms?.network?.http !== false || perms?.network?.https !== false;
    const workspaceDir = this.config.workspaceDir;
    const searchConfig = this.config.webSearch;
    const webSearchTool = !canNetwork ? webSearchStub : new WebSearchTool(createWebSearchProvider(searchConfig), canNetwork);
    const builtinMap = {
      read: new ReadTool(workspaceDir, canRead),
      write: new WriteTool(workspaceDir, canWrite),
      edit: new EditTool(workspaceDir, canRead, canWrite),
      exec: new ExecTool(workspaceDir, {
        allowedCommands: this.config.tools?.sandbox?.allowedCommands ?? [],
        timeoutMs: this.toolTimeoutMs,
        useLoginShell: this.config.tools?.execUseLoginShell ?? false,
        dockerSandbox: this.config.tools?.sandbox?.docker ? {
          enabled: true,
          image: this.config.tools.sandbox.dockerImage,
          memoryLimit: this.config.tools.sandbox.maxMemory,
          networkDisabled: this.config.tools.sandbox.networkDisabled ?? true
        } : void 0
      }),
      grep: new GrepTool(workspaceDir),
      process: new ProcessTool(workspaceDir, Math.max(this.toolTimeoutMs, PROCESS_TOOL_TIMEOUT_MS)),
      web_search: webSearchTool,
      web_fetch: new WebFetchTool(canNetwork, Math.min(this.toolTimeoutMs, 3e4)),
      send: sendStub,
      channels: channelsStub
    };
    for (const name of toolNames) {
      const tool = builtinMap[name];
      if (tool) tools.set(name, tool);
    }
  }
  loadRegistryTools(tools) {
    const reg = this.options.toolProviderRegistry;
    if (!reg) return;
    for (const [, { tool }] of reg.getAllEntries()) {
      tools.set(tool.name, tool);
    }
  }
  loadSkillTools(tools) {
    const engine = this.options.skillsEngine;
    if (!engine) return;
    const skillTools = createSkillTools(engine);
    for (const t3 of skillTools) tools.set(t3.name, t3);
    this.logger.debug("Registered skill tools");
  }
  /**
   * Auto-discover tools from top-level `config.mcp` server entries.
   * Endpoints already covered by `tools.extensions` are skipped to avoid duplicates.
   */
  async loadMCPServerTools(tools) {
    const mcpEntries = this.config.mcp;
    if (!Array.isArray(mcpEntries) || mcpEntries.length === 0) return;
    const extensionEndpoints = new Set(
      (this.config.tools?.extensions ?? []).filter((e) => e.type === "mcp" && e.endpoint).map((e) => e.endpoint.trim())
    );
    for (const entry of mcpEntries) {
      const ep = entry.endpoint?.trim();
      if (!ep || extensionEndpoints.has(ep)) continue;
      await this.loadMCPExtension(tools, { type: "mcp", endpoint: ep, name: entry.endpoint });
    }
  }
  async loadExtensionTools(tools) {
    const extensions = this.config.tools?.extensions;
    if (!Array.isArray(extensions)) return;
    this.logger.debug(`Loading ${extensions.length} extensions`);
    for (const ext of extensions) {
      const type = (ext?.type ?? "").toLowerCase();
      if (type === "http") {
        this.loadHttpExtension(tools, ext);
      } else if (type === "mcp") {
        await this.loadMCPExtension(tools, ext);
      }
    }
  }
  loadHttpExtension(tools, ext) {
    const url2 = ext.endpoint ?? ext.url;
    if (!url2 || typeof url2 !== "string" || !url2.trim()) {
      this.logger.warn("Skipped HTTP extension: missing endpoint", { name: ext.name });
      return;
    }
    const method = (ext.method ?? "POST").toUpperCase();
    const slug = String(ext.name ?? url2).replace(/\W/g, "_").slice(0, 32) || "http";
    const toolName = `http_${slug}`;
    const description = ext.description ?? `Call HTTP ${method} ${url2}`;
    const timeout = Math.min(this.toolTimeoutMs, 6e4);
    tools.set(toolName, {
      name: toolName,
      description,
      parameters: { type: "object", properties: {}, additionalProperties: true },
      async execute(args) {
        try {
          const controller = new AbortController();
          const t3 = setTimeout(() => controller.abort(), timeout);
          const res = await fetch(url2.trim(), {
            method,
            headers: { "Content-Type": "application/json" },
            body: method !== "GET" ? JSON.stringify(args ?? {}) : void 0,
            signal: controller.signal
          });
          clearTimeout(t3);
          const contentType = res.headers.get("content-type") ?? "";
          const data = contentType.includes("application/json") ? await res.json().catch(() => null) : await res.text();
          if (!res.ok) {
            return { success: false, error: `HTTP ${res.status}`, status: res.status, body: data };
          }
          return { success: true, status: res.status, data };
        } catch (err) {
          return { success: false, error: toErrorMessage(err) };
        }
      }
    });
    this.logger.info(`Registered HTTP tool: ${toolName}`);
  }
  async loadMCPExtension(tools, ext) {
    const endpoint = ext.endpoint;
    if (!endpoint || typeof endpoint !== "string" || !endpoint.trim()) {
      this.logger.warn("Skipped MCP extension: missing endpoint", { name: ext.name });
      return;
    }
    const bridge = this.options.protocolBridge;
    if (!bridge) {
      this.logger.warn("Skipped MCP extension: no protocol bridge", { endpoint });
      return;
    }
    let mcpTools;
    try {
      mcpTools = await bridge.getMCPTools(endpoint.trim());
    } catch (err) {
      this.logger.warn("MCP tool discovery failed", { endpoint, error: toErrorMessage(err) });
      return;
    }
    const slug = String(ext.name ?? endpoint).replace(/\W/g, "_").slice(0, 24) || "mcp";
    for (const mt of mcpTools) {
      const toolName = `mcp_${slug}_${mt.name}`;
      const ep = endpoint.trim();
      const mcpName = mt.name;
      const mcpTimeoutMs = this.toolTimeoutMs;
      tools.set(toolName, {
        name: toolName,
        description: mt.description ?? `MCP tool: ${mt.name}`,
        parameters: mt.inputSchema ?? { type: "object", properties: {}, additionalProperties: true },
        async execute(args, _ctx, abortSignal) {
          const controller = new AbortController();
          const timer = setTimeout(() => controller.abort(), mcpTimeoutMs);
          const linkAbort = () => controller.abort();
          abortSignal?.addEventListener("abort", linkAbort, { once: true });
          try {
            const callPromise = bridge.callMCPTool(ep, mcpName, args ?? {});
            const result = await Promise.race([
              callPromise,
              new Promise((_, reject) => {
                controller.signal.addEventListener(
                  "abort",
                  () => reject(new Error(`MCP tool '${mcpName}' timed out after ${mcpTimeoutMs}ms`)),
                  { once: true }
                );
              })
            ]);
            const textParts = (result.content ?? []).filter((c) => c?.type === "text").map((c) => c.text);
            const text2 = textParts.join("\n").trim() || JSON.stringify(result);
            if (result.isError) {
              return { success: false, error: text2 };
            }
            return { success: true, content: result.content, text: text2 };
          } catch (err) {
            return { success: false, error: toErrorMessage(err) };
          } finally {
            clearTimeout(timer);
            abortSignal?.removeEventListener("abort", linkAbort);
          }
        }
      });
    }
    this.logger.info(`Registered ${mcpTools.length} MCP tools`, { endpoint: endpoint.slice(0, 40) });
  }
};

// src/framework/core/agent/tool/tool-registry.ts
var ToolRegistry = class {
  constructor(config, options) {
    this.config = config;
    this.logger = new Logger("ToolRegistry", config.logging?.level || "info");
    this.loader = new ToolLoader(config, {
      protocolBridge: options?.protocolBridge,
      skillsEngine: options?.skillsEngine,
      toolProviderRegistry: options?.toolProviderRegistry
    });
    this.filter = new ToolFilter(config);
    this.policyPipeline = new ToolPolicyPipeline(options?.policyConfig);
    const ruleEngine = options?.ruleEngine ?? new RuleEngine({ rules: [createExecChannelRule()] });
    this.registerRuleEngineHook(ruleEngine);
  }
  config;
  logger;
  tools = /* @__PURE__ */ new Map();
  loader;
  filter;
  policyPipeline;
  // ── Hooks & policy ──────────────────────────────────────────────────
  registerBeforeHook(hook) {
    this.policyPipeline.registerBeforeHook(hook);
  }
  registerAfterHook(hook) {
    this.policyPipeline.registerAfterHook(hook);
  }
  updateToolPolicy(patch) {
    this.policyPipeline.updatePolicy(patch);
  }
  setProtocolBridge(bridge) {
    this.loader.setProtocolBridge(bridge);
  }
  // ── Lifecycle ───────────────────────────────────────────────────────
  async initialize() {
    this.logger.info("Initializing...");
    this.tools = await this.loader.loadAll();
    this.logger.info(`Loaded ${this.tools.size} tools`);
  }
  async initializeForScope(scope) {
    this.logger.info("Initializing (scoped)", scope);
    this.tools = await this.loader.loadForScope(scope);
    this.logger.info(`Loaded ${this.tools.size} scoped tools`);
  }
  // ── Query ───────────────────────────────────────────────────────────
  getAll() {
    return Array.from(this.tools.values());
  }
  getContextualTools(context) {
    return this.filter.getContextualTools(this.getAll(), context);
  }
  getToolSchemas(context) {
    const tools = context ? this.getContextualTools(context) : this.getAll();
    return tools.map(toolToSchema);
  }
  register(tool) {
    this.tools.set(tool.name, tool);
  }
  // ── Execution (unified security path via ToolPolicyPipeline) ────────
  async executeTool(name, args, context, abortSignal) {
    this.logger.debug(`Executing: ${name}`, { args: args ? Object.keys(args) : [] });
    const tool = this.tools.get(name);
    if (!tool) {
      this.logger.warn(`Unknown tool: ${name}`);
      return { error: `Unknown tool: ${name}`, errorCode: "TOOL_NOT_FOUND" };
    }
    if (tool.validate) {
      const validationError = tool.validate(args);
      if (validationError) return { error: validationError, errorCode: "TOOL_VALIDATION_FAILED" };
    }
    try {
      const out = await this.policyPipeline.execute(tool, args, context, abortSignal);
      this.logger.debug(`Completed: ${name}`, { success: out.success });
      if (!out.success) {
        return { error: String(out.error ?? "Tool returned success: false"), errorCode: "TOOL_EXECUTION_FAILED" };
      }
      return { result: out };
    } catch (err) {
      const msg = toErrorMessage(err);
      this.logger.warn(`Tool error: ${name}`, { error: msg });
      return { error: msg, errorCode: "TOOL_EXECUTION_FAILED" };
    }
  }
  // ── Private ─────────────────────────────────────────────────────────
  registerRuleEngineHook(ruleEngine) {
    const config = this.config;
    this.policyPipeline.registerBeforeHook(async (ctx) => {
      const ruleCtx = {
        type: "tool",
        toolName: ctx.toolName,
        name: ctx.toolName,
        channel: ctx.context?.channel,
        payload: {
          channel: ctx.context?.channel,
          toolName: ctx.toolName,
          allowExecInChannels: config.tools?.allowExecInChannels
        }
      };
      const verdict = ruleEngine.evaluate(ruleCtx);
      if (verdict.action === "reject") {
        return { blocked: true, reason: verdict.reason ?? "Blocked by rule engine" };
      }
    });
  }
};

// src/framework/core/agent/agent-runtime.ts
var MAX_FALLBACK_ATTEMPTS = 2;
var AgentRuntime = class {
  modelManager;
  toolRegistry;
  promptBuilder;
  executor;
  executionPolicy;
  logger;
  skillsEngine;
  metrics = new AgentMetrics();
  constructor(config, options = {}) {
    const logLevel = config.logging?.level || "info";
    this.modelManager = new ModelManager(config, { providerRegistry: options.providerRegistry ?? void 0 });
    this.toolRegistry = new ToolRegistry(config, {
      skillsEngine: options.skillsEngine,
      ruleEngine: options.ruleRegistry?.getEngine(),
      toolProviderRegistry: options.toolProviderRegistry ?? void 0
    });
    this.promptBuilder = new PromptBuilder(config);
    this.executor = new AgentExecutor(this.toolRegistry, logLevel, {
      maxTurns: config.agent?.maxTurns ?? 10,
      toolResultContextMax: config.agent?.toolResultContextMax ?? 16e3
    });
    this.logger = new Logger("AgentRuntime", logLevel);
    this.executionPolicy = options.executionPolicy ?? new DefaultExecutionPolicy(this.logger);
    this.skillsEngine = options.skillsEngine;
  }
  setProtocolBridge(bridge) {
    this.toolRegistry.setProtocolBridge(bridge);
  }
  // ---------------------------------------------------------------------------
  // Lifecycle
  // ---------------------------------------------------------------------------
  async initialize() {
    const startTime = performance$1.now();
    this.logger.info("Initializing...");
    try {
      const [modelInfo] = await Promise.all([
        this.modelManager.initialize(),
        this.toolRegistry.initialize(),
        this.promptBuilder.loadInstructionFiles()
      ]);
      const initTime = performance$1.now() - startTime;
      this.logger.info(`Initialized (${initTime.toFixed(0)}ms)`, {
        model: modelInfo.model,
        provider: modelInfo.provider,
        tools: this.toolRegistry.getAll().length
      });
    } catch (error) {
      this.logger.error("Initialization failed", error);
      throw error;
    }
  }
  async reinitializeSession() {
    try {
      await this.modelManager.reinitialize();
      const m = this.modelManager.getActiveModel();
      this.logger.info("Session reinitialized", { provider: m?.provider, model: m?.model });
    } catch (err) {
      this.logger.warn("Reinitialize session failed", err);
    }
  }
  async reinitializeToolRegistry() {
    try {
      await this.toolRegistry.initialize();
      this.logger.info("Tool registry reinitialized");
    } catch (err) {
      this.logger.warn("Reinitialize tool registry failed", err);
    }
  }
  async cleanup() {
    this.logger.debug("Cleaned up");
  }
  // ---------------------------------------------------------------------------
  // Core execution
  // ---------------------------------------------------------------------------
  async execute(params) {
    const startTime = performance$1.now();
    try {
      const result = await this.executeWithRetry(params);
      this.modelManager.recordSuccess();
      return result;
    } catch (error) {
      return this.handleExecutionError(error, params, startTime);
    }
  }
  async internalLLMCall(systemPrompt, userContent, maxTokens = 2048) {
    return this.modelManager.internalLLMCall(systemPrompt, userContent, maxTokens);
  }
  // ---------------------------------------------------------------------------
  // Private — execution with retry
  // ---------------------------------------------------------------------------
  async executeWithRetry(params) {
    const sw = Stopwatch.start();
    const session = this.modelManager.createSession();
    sw.lap("createSession");
    const contextualTools = this.toolRegistry.getContextualTools(params.context);
    const allSkills = this.skillsEngine ? await this.skillsEngine.listSkills() : [];
    const systemPrompt = this.promptBuilder.build({
      context: params.context,
      skills: params.skills,
      allSkills,
      memoryContext: params.memoryContext,
      tools: contextualTools
    });
    await session.updateSystemPrompt(systemPrompt);
    sw.lap("prompt");
    const toolSchemas = toolsToOpenAISchema(contextualTools);
    sw.lap("toolSchemas");
    const result = await this.executor.execute({
      session,
      message: params.message,
      tools: toolSchemas,
      executor: params
    });
    const processingTime = sw.elapsed();
    sw.stop("execute");
    this.metrics.recordRequest(true, processingTime);
    this.metrics.addTokens(result.usage.totalTokens || 0);
    this.logger.info("Request completed", {
      contentLen: result.content.length,
      toolCalls: result.toolCalls.length,
      perf: sw.summary()
    });
    return {
      content: result.content,
      thinking: result.thinking,
      toolCalls: result.toolCalls,
      usage: result.usage,
      model: this.modelManager.getActiveModel()?.model ?? "unknown",
      skillsApplied: params.skills.map((s) => s.id),
      aborted: result.aborted
    };
  }
  // ---------------------------------------------------------------------------
  // Private — error handling (bounded retry, replaces infinite loop)
  // ---------------------------------------------------------------------------
  async handleExecutionError(error, params, startTime) {
    const ctx = {
      getActiveModelName: () => this.modelManager.getActiveModel()?.model ?? "error",
      createErrorResponse: (userMessage) => this.buildErrorResponse(userMessage, startTime),
      onChunk: params.onChunk
    };
    let lastError = error;
    for (let attempt = 0; attempt < MAX_FALLBACK_ATTEMPTS; attempt++) {
      const decision = await this.executionPolicy.handle(lastError, params, startTime, ctx);
      if (decision.action === "respond") {
        return decision.response;
      }
      if (decision.action === "retrySameModel") {
        try {
          const result = await this.executeWithRetry(params);
          this.modelManager.recordSuccess();
          return result;
        } catch (retryErr) {
          lastError = retryErr;
          continue;
        }
      }
      const switched = await this.modelManager.switchToFallback();
      if (switched) {
        try {
          const m = this.modelManager.getActiveModel();
          this.logger.info("Fallback model activated", { model: m?.model, provider: m?.provider });
          const result = await this.executeWithRetry(params);
          this.modelManager.recordSuccess();
          return result;
        } catch (fallbackErr) {
          const msg = fallbackErr instanceof Error ? fallbackErr.message : String(fallbackErr);
          this.logger.error(`Fallback model also failed: ${msg}`, fallbackErr);
          lastError = fallbackErr;
          continue;
        }
      }
      return ctx.createErrorResponse(decision.fallbackMessage);
    }
    return ctx.createErrorResponse(t2("agent.all_models_unavailable"));
  }
  buildErrorResponse(userMessage, startTime) {
    this.metrics.recordRequest(false, performance$1.now() - startTime);
    return {
      content: userMessage,
      toolCalls: [],
      usage: { totalTokens: 0 },
      model: this.modelManager.getActiveModel()?.model ?? "error",
      skillsApplied: []
    };
  }
  getStats() {
    return this.metrics.getSummary(this.modelManager.getActiveModel()?.model);
  }
};

// src/framework/core/agent/session/conversation-resolver.ts
var ConversationResolver = class {
  constructor(memoryEngine, sessionManager, logger3) {
    this.memoryEngine = memoryEngine;
    this.sessionManager = sessionManager;
    this.logger = logger3;
  }
  memoryEngine;
  sessionManager;
  logger;
  pending = /* @__PURE__ */ new Map();
  /**
   * Bind an existing conversation to a session.
   * Loads conversation history into the session for context continuity.
   *
   * @returns `true` if the conversation was found and bound.
   */
  async bind(session, conversationId) {
    try {
      const conv = await this.memoryEngine.getConversation(conversationId);
      if (!conv) {
        this.logger.warn("Conversation not found for binding", { id: conversationId });
        return false;
      }
      session.conversationId = conv.id;
      if (conv.messages.length > 0 && session.messageHistory) {
        session.messageHistory.push(...conv.messages);
        this.sessionManager.trimHistory(session);
      }
      return true;
    } catch (err) {
      this.logger.warn("Failed to bind conversation", { conversationId, error: err });
      return false;
    }
  }
  /**
   * Ensure the session has a conversation bound.
   * If already bound, returns the existing ID immediately.
   * If not, creates a new conversation (coalescing concurrent calls per session).
   *
   * @returns The conversation ID, or `null` if memory is disabled.
   */
  async ensure(session) {
    if (!this.memoryEngine.enabled) return null;
    if (session.conversationId) return session.conversationId;
    const key = session.sessionKey;
    const inflight = this.pending.get(key);
    if (inflight) return inflight;
    const promise = this.createAndBind(session);
    this.pending.set(key, promise);
    try {
      return await promise;
    } finally {
      this.pending.delete(key);
    }
  }
  async createAndBind(session) {
    try {
      const conv = await this.memoryEngine.createConversation(session.userId);
      session.conversationId = conv.id;
      return conv.id;
    } catch (err) {
      this.logger.warn("Failed to auto-create conversation", { error: err });
      return null;
    }
  }
};

// src/utils/async-lock.ts
var AsyncLock = class {
  locks = /* @__PURE__ */ new Map();
  async acquire(key) {
    while (this.locks.has(key)) {
      await this.locks.get(key);
    }
    let release;
    const promise = new Promise((resolve5) => {
      release = resolve5;
    });
    this.locks.set(key, promise);
    return () => {
      this.locks.delete(key);
      release();
    };
  }
};

// src/framework/core/agent/message-processor.ts
var MessageProcessor = class {
  config;
  logger;
  agent;
  skillsEngine;
  memoryEngine;
  sessionLock = new AsyncLock();
  hookManager;
  sessionManager;
  /** Exposed for gateway-level conversation pre-binding (e.g. WS auth). */
  conversationResolver;
  constructor(deps) {
    this.config = deps.config;
    this.logger = new Logger("MessageProcessor", deps.config.logging?.level ?? "info");
    this.agent = deps.agent;
    this.skillsEngine = deps.skillsEngine;
    this.memoryEngine = deps.memoryEngine;
    this.sessionManager = deps.sessionManager;
    this.hookManager = deps.hookManager ?? null;
    this.conversationResolver = deps.memoryEngine ? new ConversationResolver(deps.memoryEngine, deps.sessionManager, this.logger) : null;
  }
  /**
   * Process a single message through the full agent pipeline.
   *
   * 1. Resolve or create a session
   * 2. Ensure a conversation is bound (auto-create if needed)
   * 3. Match skills + retrieve memory in parallel
   * 4. Execute the agent
   * 5. Update conversation history + persist to memory
   */
  async process(params) {
    const t0 = performance$1.now();
    const emit = params.onChunk ?? (() => {
    });
    const session = await this.resolveSession(params);
    await this.conversationResolver?.ensure(session);
    const release = await this.sessionLock.acquire(session.sessionKey);
    const timeoutCtrl = new AbortController();
    const messageTimeoutMs = this.config.agent?.messageTimeoutMs ?? MESSAGE_TIMEOUT_MS;
    const timer = setTimeout(() => {
      const elapsedMs = Math.round(performance$1.now() - t0);
      this.logger.error("Message processing timeout \u2014 aborting", {
        sessionKey: session.sessionKey,
        sessionId: session.sessionId,
        channel: session.channel,
        userId: session.userId,
        timeoutMs: messageTimeoutMs,
        elapsedMs,
        messagePreview: params.message.slice(0, 120),
        historyLength: session.messageHistory?.length ?? 0,
        conversationId: session.conversationId ?? null
      });
      timeoutCtrl.abort();
    }, messageTimeoutMs);
    const signal = params.abortSignal ? AbortSignal.any([params.abortSignal, timeoutCtrl.signal]) : timeoutCtrl.signal;
    try {
      await this.hookManager?.trigger("message:before", {
        message: params.message,
        sessionKey: session.sessionKey,
        channel: session.channel
      });
      return await this.executeAgentTurn(params, session, t0, emit, signal, timeoutCtrl.signal);
    } catch (error) {
      return {
        success: false,
        error: toErrorMessage(error),
        processingTime: performance$1.now() - t0
      };
    } finally {
      clearTimeout(timer);
      release();
    }
  }
  // ── Private — session resolution ────────────────────────────────────
  async resolveSession(params) {
    if (params.sessionKey) {
      const existing = this.sessionManager.get(params.sessionKey);
      if (existing) {
        existing.lastActivity = Date.now();
        if (!existing.messageHistory) existing.messageHistory = [];
        if (existing.workspaceDir?.includes("~")) {
          existing.workspaceDir = resolveWorkspaceDir(existing.workspaceDir);
        }
        return existing;
      }
    }
    const payload = {
      userId: params.userId ?? "anonymous",
      channel: params.channel ?? "unknown",
      metadata: params.metadata
    };
    return this.sessionManager.createSession(payload, params.sessionKey);
  }
  // ── Private — skill matching ────────────────────────────────────────
  async matchSkills(message, session, emit) {
    if (!this.skillsEngine) return [];
    emit({ type: "progress", step: "skills", status: "running", content: "Matching skills..." });
    const skills = await this.skillsEngine.findRelevantSkills(message, session, { maxSkills: 8 });
    emit({
      type: "progress",
      step: "skills",
      status: "completed",
      content: skills.length > 0 ? `Matched ${skills.length} skills` : "No skills matched"
    });
    return skills;
  }
  // ── Private — memory retrieval ──────────────────────────────────────
  async retrieveMemory(message, emit) {
    if (!this.memoryEngine?.enabled) return "";
    emit({ type: "progress", step: "memory", status: "running", content: "Retrieving memory..." });
    const memResult = await this.memoryEngine.retrieve(message).catch((e) => {
      this.logger.warn("Memory retrieval failed (non-critical)", e);
      return null;
    });
    if (memResult && memResult.results.length > 0) {
      const memoryContext = memResult.results.map(
        (r) => r.sections.map((s) => `[${r.title} > ${s.nodeTitle}]
${s.content}`).join("\n\n")
      ).join("\n\n---\n\n");
      emit({
        type: "progress",
        step: "memory",
        status: "completed",
        content: `Retrieved ${memResult.results.length} relevant memories`
      });
      return memoryContext;
    }
    emit({
      type: "progress",
      step: "memory",
      status: memResult === null ? "error" : "completed",
      content: memResult === null ? "Memory retrieval failed" : "No relevant memories"
    });
    return "";
  }
  // ── Private — history & memory persistence ──────────────────────────
  updateHistory(session, message, content) {
    if (session.messageHistory) {
      session.messageHistory.push(
        { role: "user", content: message },
        { role: "assistant", content }
      );
      this.sessionManager.trimHistory(session);
    }
  }
  persistToMemory(session, userMessage, content, response) {
    if (!this.memoryEngine?.enabled || !session.conversationId || !response.success || !content?.trim()) return;
    const toolSummary = response.toolCalls?.map((tc) => ({
      name: tc.name,
      args: condensedArgs(tc.args),
      status: tc.status,
      error: tc.error
    }));
    this.memoryEngine.appendMessages(session.conversationId, [
      { role: "user", content: userMessage },
      {
        role: "assistant",
        content,
        thinking: response.thinking || void 0,
        toolCalls: toolSummary?.length ? toolSummary : void 0
      }
    ]).catch((err) => this.logger.warn("Failed to persist conversation turn", err));
  }
  // ── Private — abort reason classification ───────────────────────────
  classifyAbort(timeoutSignal) {
    if (timeoutSignal.aborted) return { stopped: false, timedOut: true };
    return { stopped: true, timedOut: false };
  }
  // ── Private — orchestrate a single agent turn ───────────────────────
  async executeAgentTurn(params, session, t0, emit, signal, timeoutSignal) {
    try {
      const [skills, memoryContext] = await Promise.all([
        this.matchSkills(params.message, session, emit),
        this.retrieveMemory(params.message, emit)
      ]);
      emit({ type: "progress", step: "llm", status: "running", content: "Generating response..." });
      const result = await this.agent.execute({
        message: params.message,
        context: session,
        skills,
        memoryContext,
        onChunk: emit,
        images: params.images,
        abortSignal: signal
      });
      let content = result?.content ?? "";
      let stopped = false;
      let timedOut = false;
      if (result?.aborted) {
        ;
        ({ stopped, timedOut } = this.classifyAbort(timeoutSignal));
        const suffix = timedOut ? t2("agent.stopped_by_timeout") : t2("agent.stopped_by_user");
        content += suffix;
        emit({ type: "text", content: suffix });
        if (timedOut) {
          const elapsedMs = Math.round(performance$1.now() - t0);
          this.logger.error("Agent turn aborted by timeout", {
            sessionKey: session.sessionKey,
            channel: session.channel,
            elapsedMs,
            contentLength: content.length,
            toolCallCount: result?.toolCalls?.length ?? 0,
            messagePreview: params.message.slice(0, 120)
          });
          emit({ type: "progress", step: "llm", status: "error", content: `Request timed out after ${(elapsedMs / 1e3).toFixed(1)}s` });
        }
      } else {
        emit({ type: "progress", step: "llm", status: "completed", content: "Generation complete" });
      }
      const response = {
        success: true,
        content,
        thinking: result?.thinking,
        toolCalls: result?.toolCalls ?? [],
        sessionId: session.sessionId,
        processingTime: performance$1.now() - t0,
        skillsUsed: result?.skillsApplied ?? [],
        stopped,
        timedOut,
        usage: result?.usage
      };
      this.updateHistory(session, params.message, content);
      this.persistToMemory(session, params.message, content, response);
      await this.hookManager?.trigger("message:after", {
        message: params.message,
        sessionKey: session.sessionKey,
        response: content
      });
      emit({ type: "done" });
      return response;
    } catch (agentError) {
      const { stopped, timedOut } = this.classifyAbort(timeoutSignal);
      const elapsedMs = Math.round(performance$1.now() - t0);
      const errMsg = timedOut ? `Request timed out after ${(elapsedMs / 1e3).toFixed(1)}s, please try again` : toErrorMessage(agentError);
      if (timedOut) {
        emit({ type: "progress", step: "llm", status: "error", content: `Request timed out after ${(elapsedMs / 1e3).toFixed(1)}s` });
      }
      emit({ type: "done" });
      this.logger.error("Agent execution error", {
        timedOut,
        stopped,
        elapsedMs,
        sessionKey: session.sessionKey,
        channel: session.channel,
        userId: session.userId,
        messagePreview: params.message.slice(0, 120),
        error: toErrorMessage(agentError),
        errorName: agentError?.name,
        errorStack: agentError?.stack?.split("\n").slice(0, 5).join("\n")
      });
      return {
        success: false,
        error: errMsg,
        sessionId: session.sessionId,
        processingTime: performance$1.now() - t0,
        stopped,
        timedOut
      };
    }
  }
};
var ARGS_VALUE_MAX = 200;
function condensedArgs(args) {
  if (!args || Object.keys(args).length === 0) return void 0;
  const out = {};
  for (const [k, v] of Object.entries(args)) {
    if (typeof v === "string" && v.length > ARGS_VALUE_MAX) {
      out[k] = v.slice(0, ARGS_VALUE_MAX) + "\u2026";
    } else {
      out[k] = v;
    }
  }
  return out;
}
var SessionManager = class _SessionManager {
  constructor(workspaceDir, timeoutMs) {
    this.workspaceDir = workspaceDir;
    const timeout = timeoutMs ?? _SessionManager.DEFAULT_TIMEOUT_MS;
    this.cleanupInterval = setInterval(() => this.purgeExpired(timeout), 6e4);
    this.cleanupInterval.unref();
  }
  workspaceDir;
  static MAX_SESSION_HISTORY = 20;
  static DEFAULT_TIMEOUT_MS = SESSION_TIMEOUT_MS;
  sessions = /* @__PURE__ */ new Map();
  cleanupInterval = null;
  async createSession(payload, sessionKey) {
    const key = sessionKey ?? generateId();
    const now = Date.now();
    const workDir = resolveWorkspaceDir(this.workspaceDir);
    await mkdir(workDir, { recursive: true });
    const ctx = {
      sessionKey: key,
      sessionId: generateId(),
      userId: payload.userId || "anonymous",
      channel: payload.channel || "unknown",
      workspaceDir: workDir,
      startTime: now,
      lastActivity: now,
      metadata: payload.metadata ?? {},
      messageHistory: []
    };
    this.sessions.set(key, ctx);
    return ctx;
  }
  get(sessionKey) {
    return this.sessions.get(sessionKey);
  }
  set(sessionKey, ctx) {
    this.sessions.set(sessionKey, ctx);
  }
  delete(sessionKey) {
    return this.sessions.delete(sessionKey);
  }
  values() {
    return this.sessions.values();
  }
  entries() {
    return this.sessions.entries();
  }
  get size() {
    return this.sessions.size;
  }
  trimHistory(ctx) {
    if (ctx.messageHistory && ctx.messageHistory.length > _SessionManager.MAX_SESSION_HISTORY) {
      ctx.messageHistory.splice(0, ctx.messageHistory.length - _SessionManager.MAX_SESSION_HISTORY);
    }
  }
  dispose() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
  }
  purgeExpired(timeoutMs) {
    const now = Date.now();
    for (const [key, ctx] of this.sessions) {
      if (now - ctx.lastActivity > timeoutMs) {
        this.sessions.delete(key);
      }
    }
  }
};

// src/framework/core/agent/multi/worker-prompt.ts
var WorkerPromptBuilder = class {
  constructor(workerConfig) {
    this.workerConfig = workerConfig;
  }
  workerConfig;
  build(params) {
    const parts = [];
    parts.push(this.workerConfig.systemPromptTemplate);
    if (params.tools.length > 0) {
      const toolsList = params.tools.map((t3) => `- ${t3.name}: ${t3.description}`).join("\n");
      parts.push(`
## Available Tools
${toolsList}`);
    }
    if (params.skills && params.skills.length > 0) {
      const skillBlocks = params.skills.map(
        (s) => `### ${s.id}
${s.description}

${s.content}`
      );
      parts.push(`
## Active Skills
${skillBlocks.join("\n\n---\n\n")}`);
    }
    if (params.memoryContext?.trim()) {
      parts.push(`
## Memory Context
${params.memoryContext}`);
    }
    parts.push(`
## Context
- Session: ${params.context.sessionKey}
- User: ${params.context.userId}
- Channel: ${params.context.channel}
- Workspace: ${params.context.workspaceDir}`);
    parts.push(`
## Task
${params.task}`);
    return parts.join("\n").trim();
  }
};

// src/framework/core/agent/multi/worker-runtime.ts
var WorkerRuntime = class {
  constructor(workerConfig, novaConfig, options = {}) {
    this.workerConfig = workerConfig;
    const logLevel = novaConfig.logging?.level || "info";
    this.logger = new Logger(`Worker:${workerConfig.id}`, logLevel);
    const configOverride = workerConfig.model ? { ...novaConfig, models: { ...novaConfig.models, primary: workerConfig.model } } : novaConfig;
    this.modelManager = new ModelManager(configOverride, {
      providerRegistry: options.providerRegistry ?? void 0
    });
    this.toolRegistry = new ToolRegistry(novaConfig, {
      skillsEngine: options.skillsEngine ?? void 0,
      ruleEngine: options.ruleRegistry?.getEngine(),
      toolProviderRegistry: options.toolProviderRegistry ?? void 0,
      protocolBridge: options.protocolBridge ?? void 0
    });
    this.promptBuilder = new WorkerPromptBuilder(workerConfig);
    this.executor = new AgentExecutor(this.toolRegistry, logLevel, {
      maxTurns: workerConfig.maxTurns,
      toolResultContextMax: novaConfig.agent?.toolResultContextMax ?? 16e3
    });
  }
  workerConfig;
  modelManager;
  toolRegistry;
  promptBuilder;
  executor;
  logger;
  initialized = false;
  get id() {
    return this.workerConfig.id;
  }
  get role() {
    return this.workerConfig.role;
  }
  get config() {
    return this.workerConfig;
  }
  async initialize() {
    if (this.initialized) return;
    this.logger.info("Initializing...");
    await Promise.all([
      this.modelManager.initialize(),
      this.toolRegistry.initializeForScope({
        builtinTools: this.workerConfig.tools,
        mcpServer: this.workerConfig.mcpServer,
        skills: (this.workerConfig.skillDomains?.length ?? 0) > 0
      })
    ]);
    this.initialized = true;
    this.logger.info("Initialized", {
      tools: this.toolRegistry.getAll().map((t3) => t3.name),
      model: this.modelManager.getActiveModel()?.model
    });
  }
  async execute(params) {
    if (!this.initialized) await this.initialize();
    const { task, context, onChunk, abortSignal } = params;
    try {
      const session = this.modelManager.createSession();
      const tools = this.toolRegistry.getAll();
      const systemPrompt = this.promptBuilder.build({
        task,
        context,
        tools,
        skills: params.skillHints ? [] : void 0,
        memoryContext: params.memoryContext
      });
      await session.updateSystemPrompt(systemPrompt);
      const toolSchemas = toolsToOpenAISchema(tools);
      const sessionContext = {
        sessionKey: context.sessionKey,
        sessionId: `worker-${this.workerConfig.id}-${Date.now()}`,
        userId: context.userId,
        channel: context.channel,
        workspaceDir: context.workspaceDir,
        startTime: Date.now(),
        lastActivity: Date.now(),
        metadata: {},
        messageHistory: context.messageHistory ?? []
      };
      const result = await this.executor.execute({
        session,
        message: task,
        tools: toolSchemas,
        executor: {
          message: task,
          context: sessionContext,
          skills: [],
          onChunk: (chunk) => {
            onChunk({ ...chunk, agentId: this.workerConfig.id });
          },
          abortSignal
        }
      });
      return {
        agentId: this.workerConfig.id,
        content: result.content,
        toolCalls: result.toolCalls,
        usage: result.usage,
        aborted: result.aborted
      };
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      this.logger.error("Execution failed", error);
      return {
        agentId: this.workerConfig.id,
        content: "",
        toolCalls: [],
        usage: { totalTokens: 0 },
        error: errorMsg
      };
    }
  }
  async cleanup() {
    this.logger.debug("Cleaned up");
    this.initialized = false;
  }
};

// src/framework/core/agent/multi/worker-configs.ts
var WORKER_CONFIGS = {
  coder: {
    id: "coder",
    role: "Code & File Operations Specialist",
    tools: ["read", "write", "edit", "exec", "grep", "process"],
    skillDomains: ["file-operations", "coding", "devops"],
    maxTurns: 15,
    systemPromptTemplate: `You are the Coder agent \u2014 a specialist in file operations, code analysis, and command execution.

## Capabilities
- Read, write, and edit files in the workspace
- Execute shell commands (sandboxed)
- Search code with grep
- Manage background processes

## Guidelines
- Focus on code quality and correctness
- Confirm before destructive operations (delete, overwrite)
- Use exec tool for compilation, testing, and running scripts
- Report results concisely \u2014 do not echo entire file contents unless requested`
  },
  web: {
    id: "web",
    role: "Web Research Specialist",
    tools: ["web_search", "web_fetch"],
    skillDomains: ["web-research"],
    maxTurns: 5,
    systemPromptTemplate: `You are the Web agent \u2014 a specialist in web research and information retrieval.

## Capabilities
- Search the web for current information
- Fetch and parse web pages

## Guidelines
- Provide concise, factual summaries
- Cite sources with URLs
- Prefer authoritative sources
- Extract relevant data from fetched pages`
  },
  mcp: {
    id: "mcp",
    role: "MCP Integration Specialist",
    tools: [],
    maxTurns: 8,
    systemPromptTemplate: `You are the MCP agent \u2014 a specialist in interacting with external services via Model Context Protocol.

## Capabilities
- Call MCP tools exposed by connected servers
- Interpret and summarize MCP tool results

## Guidelines
- Use MCP tools as documented
- Handle errors gracefully and report meaningful messages
- Aggregate results from multiple tool calls when needed`
  },
  channel: {
    id: "channel",
    role: "Channel Communication Specialist",
    tools: ["send", "channels"],
    maxTurns: 3,
    systemPromptTemplate: `You are the Channel agent \u2014 a specialist in multi-channel communication.

## Capabilities
- Send messages through various channels
- List and manage channel connections

## Guidelines
- Adapt message format to the target channel
- Keep messages concise and clear
- Handle delivery errors gracefully`
  },
  chat: {
    id: "chat",
    role: "Conversational Assistant",
    tools: [],
    maxTurns: 1,
    systemPromptTemplate: `You are the Chat agent \u2014 a conversational assistant for general questions and discussions.

## Capabilities
- Answer general knowledge questions
- Have natural conversations
- Provide explanations and summaries

## Guidelines
- Be concise and helpful
- If a question requires tools (code, web search, etc.), indicate that you cannot handle it directly
- Focus on providing accurate, well-structured responses`
  }
};
function mergeWorkerOverride(base2, override) {
  return {
    ...base2,
    model: override.model ?? base2.model,
    maxTurns: override.maxTurns ?? base2.maxTurns,
    tools: override.tools ?? base2.tools,
    skillDomains: override.skillDomains ?? base2.skillDomains
  };
}

// src/framework/core/agent/multi/agent-pool.ts
var DEFAULT_POOL_CONFIG = {
  maxIdleTime: 3e5,
  maxConcurrent: 5
};
var AgentPool = class {
  constructor(novaConfig, runtimeOptions, poolConfig, workerOverrides) {
    this.novaConfig = novaConfig;
    this.runtimeOptions = runtimeOptions;
    this.workerOverrides = workerOverrides;
    this.config = { ...DEFAULT_POOL_CONFIG, ...poolConfig };
    this.logger = new Logger("AgentPool", novaConfig.logging?.level || "info");
  }
  novaConfig;
  runtimeOptions;
  workerOverrides;
  pool = /* @__PURE__ */ new Map();
  config;
  cleanupTimer = null;
  logger;
  protocolBridge = null;
  setProtocolBridge(bridge) {
    this.protocolBridge = bridge;
  }
  /**
   * Get or create a worker runtime by agent ID.
   * Returns undefined if the agent ID is not recognized or disabled.
   */
  async getOrCreate(agentId) {
    const existing = this.pool.get(agentId);
    if (existing) {
      existing.lastUsedAt = Date.now();
      return existing.runtime;
    }
    if (this.pool.size >= this.config.maxConcurrent) {
      this.evictOldest();
    }
    const workerConfig = this.resolveWorkerConfig(agentId);
    if (!workerConfig) {
      this.logger.warn(`Unknown agent: ${agentId}`);
      return void 0;
    }
    const override = this.workerOverrides?.[agentId];
    if (override?.enabled === false) {
      this.logger.debug(`Skipped disabled worker: ${agentId}`);
      return void 0;
    }
    const runtime = new WorkerRuntime(workerConfig, this.novaConfig, {
      ...this.runtimeOptions,
      protocolBridge: this.protocolBridge
    });
    await runtime.initialize();
    this.pool.set(agentId, { runtime, lastUsedAt: Date.now() });
    this.logger.info(`Worker created: ${agentId} (pool: ${this.pool.size})`);
    return runtime;
  }
  /**
   * Get the catalog of available agents for the Director prompt.
   */
  getCatalog() {
    const entries = [];
    for (const [id, config] of Object.entries(WORKER_CONFIGS)) {
      const override = this.workerOverrides?.[id];
      if (override?.enabled === false) continue;
      const merged = override ? mergeWorkerOverride(config, override) : config;
      entries.push({
        id: merged.id,
        role: merged.role,
        tools: merged.tools,
        description: merged.systemPromptTemplate.split("\n")[0] ?? merged.role
      });
    }
    return entries;
  }
  /**
   * Get all active worker IDs.
   */
  getActiveWorkerIds() {
    return Array.from(this.pool.keys());
  }
  /**
   * Dispose all idle workers and stop the cleanup timer.
   */
  async cleanup() {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = null;
    }
    const cleanupPromises = Array.from(this.pool.values()).map((e) => e.runtime.cleanup());
    await Promise.allSettled(cleanupPromises);
    this.pool.clear();
    this.logger.debug("Cleaned up");
  }
  /**
   * Start periodic cleanup of idle workers.
   */
  startPeriodicCleanup() {
    if (this.cleanupTimer) return;
    const interval = Math.max(this.config.maxIdleTime / 2, 3e4);
    this.cleanupTimer = setInterval(() => this.evictIdle(), interval);
  }
  get size() {
    return this.pool.size;
  }
  resolveWorkerConfig(agentId) {
    const base2 = WORKER_CONFIGS[agentId];
    if (!base2) return void 0;
    const override = this.workerOverrides?.[agentId];
    if (!override) return base2;
    return mergeWorkerOverride(base2, override);
  }
  evictOldest() {
    let oldest = null;
    let oldestTime = Infinity;
    for (const [id, entry] of this.pool) {
      if (entry.lastUsedAt < oldestTime) {
        oldestTime = entry.lastUsedAt;
        oldest = id;
      }
    }
    if (oldest) {
      const entry = this.pool.get(oldest);
      entry?.runtime.cleanup().catch(() => {
      });
      this.pool.delete(oldest);
      this.logger.debug(`Evicted worker: ${oldest} (LRU)`);
    }
  }
  evictIdle() {
    const now = Date.now();
    for (const [id, entry] of this.pool) {
      if (now - entry.lastUsedAt > this.config.maxIdleTime) {
        entry.runtime.cleanup().catch(() => {
        });
        this.pool.delete(id);
        this.logger.debug(`Evicted worker: ${id} (idle)`);
      }
    }
  }
};

// src/framework/core/agent/multi/director-tools.ts
var DEFAULT_SESSION_KEY = "director-delegate";
var DEFAULT_WORKSPACE = ".";
var DEFAULT_USER_ID = "director";
var DEFAULT_CHANNEL = "internal";
function buildWorkerContext(sessionContext, overrides) {
  const base2 = sessionContext ?? {};
  const extra = overrides ?? {};
  return {
    sessionKey: extra.sessionKey ?? base2.sessionKey ?? DEFAULT_SESSION_KEY,
    workspaceDir: extra.workspaceDir ?? base2.workspaceDir ?? DEFAULT_WORKSPACE,
    userId: extra.userId ?? base2.userId ?? DEFAULT_USER_ID,
    channel: extra.channel ?? base2.channel ?? DEFAULT_CHANNEL,
    messageHistory: extra.messageHistory ?? base2.messageHistory
  };
}
function createDirectorTools(pool, onChunk) {
  const logger3 = new Logger("DirectorTools", "info");
  const delegateTask = {
    name: "delegate_task",
    description: "Delegate a task to a specialized worker agent",
    parameters: {
      type: "object",
      properties: {
        agent: { type: "string", description: "ID of the worker agent to delegate to" },
        task: { type: "string", description: "The task description for the worker" },
        context: {
          type: "object",
          description: "Optional context (sessionKey, workspaceDir, userId, channel, skillHints, etc.)",
          properties: {
            sessionKey: { type: "string" },
            workspaceDir: { type: "string" },
            userId: { type: "string" },
            channel: { type: "string" },
            skillHints: { type: "array", items: { type: "string" } }
          }
        }
      },
      required: ["agent", "task"]
    },
    async execute(args, context, abortSignal) {
      try {
        const agent = args.agent;
        const task = args.task;
        const argsContext = args.context;
        if (!agent || typeof agent !== "string") {
          return { success: false, error: "Missing or invalid required parameter: agent" };
        }
        if (!task || typeof task !== "string") {
          return { success: false, error: "Missing or invalid required parameter: task" };
        }
        const worker = await pool.getOrCreate(agent);
        if (!worker) {
          return { success: false, error: `Worker agent not found or disabled: ${agent}` };
        }
        const workerContext = buildWorkerContext(context, argsContext);
        const result = await worker.execute({
          task,
          context: workerContext,
          skillHints: argsContext && Array.isArray(argsContext.skillHints) ? argsContext.skillHints : void 0,
          onChunk: (chunk) => onChunk(chunk),
          abortSignal
        });
        return {
          success: true,
          content: result.content,
          toolCalls: result.toolCalls,
          usage: result.usage,
          error: result.error
        };
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        logger3.error("delegate_task failed", err);
        return { success: false, error: msg };
      }
    }
  };
  const parallelTasks = {
    name: "parallel_tasks",
    description: "Execute multiple tasks in parallel across different worker agents",
    parameters: {
      type: "object",
      properties: {
        tasks: {
          type: "array",
          description: "Array of tasks to execute in parallel",
          items: {
            type: "object",
            properties: {
              id: { type: "string", description: "Unique identifier for this task result" },
              agent: { type: "string", description: "ID of the worker agent" },
              task: { type: "string", description: "Task description" },
              context: {
                type: "object",
                description: "Optional context overrides for this task"
              }
            },
            required: ["id", "agent", "task"]
          }
        }
      },
      required: ["tasks"]
    },
    async execute(args, context, abortSignal) {
      try {
        const tasks = args.tasks;
        if (!Array.isArray(tasks) || tasks.length === 0) {
          return { success: false, error: "Missing or invalid required parameter: tasks (must be non-empty array)" };
        }
        const promises = tasks.map(async (item2) => {
          const { id, agent, task, context: taskContext } = item2;
          const worker = await pool.getOrCreate(agent);
          if (!worker) {
            return {
              id,
              agentId: agent,
              content: "",
              error: `Worker agent not found or disabled: ${agent}`
            };
          }
          try {
            const workerContext = buildWorkerContext(context, taskContext);
            const result = await worker.execute({
              task,
              context: workerContext,
              skillHints: taskContext && typeof taskContext === "object" && Array.isArray(taskContext.skillHints) ? taskContext.skillHints : void 0,
              onChunk: (chunk) => onChunk(chunk),
              abortSignal
            });
            return {
              id,
              agentId: result.agentId,
              content: result.content,
              error: result.error
            };
          } catch (err) {
            const msg = err instanceof Error ? err.message : String(err);
            logger3.error(`parallel_tasks item ${id} (${agent}) failed`, err);
            return { id, agentId: agent, content: "", error: msg };
          }
        });
        const settled = await Promise.allSettled(promises);
        const results = settled.map(
          (p3) => p3.status === "fulfilled" ? p3.value : { id: "unknown", agentId: "unknown", content: "", error: String(p3.reason) }
        );
        return { success: true, results };
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        logger3.error("parallel_tasks failed", err);
        return { success: false, error: msg };
      }
    }
  };
  return [delegateTask, parallelTasks];
}

// src/framework/core/agent/multi/director-prompt.ts
var DirectorPromptBuilder = class {
  constructor(directResponse = true) {
    this.directResponse = directResponse;
  }
  directResponse;
  build(params) {
    const { agentCatalog, skillSummaries, communitySummaries, context } = params;
    const sections = [];
    sections.push(
      "You are the NovaClaw Director \u2014 an orchestrator that delegates tasks to specialized worker agents."
    );
    sections.push(`
## Key Instructions
- Use the \`delegate_task\` tool when the user's request requires specialized capabilities (code, files, web research, MCP, channel operations).
- For complex or multi-step tasks, delegate to the appropriate worker agent rather than attempting to handle everything yourself.
- You can respond directly when the request is a simple greeting, clarification question, or general Q&A that does not require specialized tools.`);
    if (this.directResponse) {
      sections.push(`
- For simple greetings or straightforward questions, you may respond directly without delegation.`);
    } else {
      sections.push(`
- Prefer delegation over direct response when in doubt.`);
    }
    sections.push(this.buildAgentCatalogSection(agentCatalog));
    if (skillSummaries?.length) {
      sections.push(this.buildSkillsOverviewSection(skillSummaries));
    }
    if (communitySummaries?.length) {
      sections.push(this.buildKnowledgeGraphSection(communitySummaries));
    }
    sections.push(this.buildContextSection(context));
    sections.push(this.buildDelegationGuidelinesSection());
    return sections.join("\n\n").trim();
  }
  buildAgentCatalogSection(catalog) {
    const lines = catalog.map(
      (entry) => `- **${entry.id}** (${entry.role}): ${entry.description}
  Tools: ${entry.tools.join(", ")}`
    );
    return `## Agent Catalog

The following worker agents are available. Use \`delegate_task\` with the agent id to assign work.

${lines.join("\n\n")}`;
  }
  buildSkillsOverviewSection(skillSummaries) {
    const lines = skillSummaries.map((s) => `- **${s.id}**: ${s.description}`);
    return `## Skills Overview

${lines.join("\n")}`;
  }
  buildKnowledgeGraphSection(summaries) {
    return `## Knowledge Graph

${summaries.map((s) => `- ${s}`).join("\n")}`;
  }
  buildContextSection(context) {
    return `## Context
- Session: ${context.sessionKey}
- Workspace: ${context.workspaceDir}
- User: ${context.userId}
- Channel: ${context.channel}`;
  }
  buildDelegationGuidelinesSection() {
    return `## Delegation Guidelines

- **Code / file tasks** (editing, reading, searching, refactoring) \u2192 delegate to **coder**
- **Web research** (lookup, fact-checking, summaries) \u2192 delegate to **web**
- **MCP integration** (external tools, servers, protocols) \u2192 delegate to **mcp**
- **Channel operations** (Slack, Discord, etc.) \u2192 delegate to **channel**
- **Simple Q&A** (greetings, clarifications, general questions) \u2192 use **chat** or respond directly`;
  }
};

// src/framework/core/agent/multi/director-runtime.ts
var DirectorRuntime = class {
  logger;
  modelManager;
  executor;
  agentPool;
  ruleRegistry;
  skillsEngine;
  fallbackAgent;
  promptBuilder;
  constructor(config, options) {
    this.logger = new Logger("DirectorRuntime", config.logging?.level || "info");
    this.modelManager = options.modelManager;
    this.executor = options.executor;
    this.agentPool = options.agentPool;
    this.ruleRegistry = options.ruleRegistry;
    this.skillsEngine = options.skillsEngine;
    this.fallbackAgent = options.fallbackAgent;
    this.promptBuilder = new DirectorPromptBuilder(
      options.directResponse ?? config.agents?.director?.directResponse ?? true
    );
  }
  async initialize() {
    this.logger.info("Initializing...");
    await this.modelManager.initialize();
    this.agentPool.startPeriodicCleanup();
    this.logger.info("Initialized");
  }
  async cleanup() {
    await this.agentPool.cleanup();
    this.logger.debug("Cleaned up");
  }
  async execute(params) {
    const sw = Stopwatch.start();
    try {
      if (this.ruleRegistry) {
        const inputVerdict = this.ruleRegistry.evaluatePhase("input", {
          type: "message",
          message: params.message,
          channel: params.context.channel,
          userId: params.context.userId,
          sessionKey: params.context.sessionKey
        });
        if (inputVerdict.action === "reject") {
          return {
            content: inputVerdict.reason,
            toolCalls: [],
            usage: { totalTokens: 0 },
            model: this.modelManager.getActiveModel()?.model ?? "unknown",
            skillsApplied: []
          };
        }
      }
      const catalog = this.agentPool.getCatalog();
      const skillSummaries = this.skillsEngine ? (await this.skillsEngine.listSkills()).map((s) => ({ id: s.id, description: s.description })) : [];
      const promptParams = {
        agentCatalog: catalog,
        skillSummaries,
        context: {
          sessionKey: params.context.sessionKey,
          workspaceDir: params.context.workspaceDir,
          userId: params.context.userId,
          channel: params.context.channel
        }
      };
      const systemPrompt = this.promptBuilder.build(promptParams);
      sw.lap("prompt");
      const session = this.modelManager.createSession();
      await session.updateSystemPrompt(systemPrompt);
      const directorTools = createDirectorTools(this.agentPool, (chunk) => {
        params.onChunk(chunk);
      });
      const toolSchemas = toolsToOpenAISchema(directorTools);
      sw.lap("tools");
      const result = await this.executor.execute({
        session,
        message: params.message,
        tools: toolSchemas,
        executor: {
          ...params,
          onChunk: params.onChunk
        }
      });
      sw.lap("execute");
      let finalContent = result.content;
      if (this.ruleRegistry) {
        const outputVerdict = this.ruleRegistry.evaluatePhase("output", {
          type: "output",
          content: finalContent,
          channel: params.context.channel,
          toolCalls: result.toolCalls
        }, { channel: params.context.channel });
        if (outputVerdict.action === "rewrite") {
          finalContent = outputVerdict.content;
        } else if (outputVerdict.action === "transform") {
          finalContent = outputVerdict.transformer(finalContent);
        } else if (outputVerdict.action === "reject") {
          finalContent = outputVerdict.reason;
        }
      }
      this.logger.info("Request completed", {
        contentLen: finalContent.length,
        toolCalls: result.toolCalls.length,
        perf: sw.summary()
      });
      return {
        content: finalContent,
        thinking: result.thinking,
        toolCalls: result.toolCalls,
        usage: result.usage,
        model: this.modelManager.getActiveModel()?.model ?? "unknown",
        skillsApplied: params.skills.map((s) => s.id),
        aborted: result.aborted
      };
    } catch (error) {
      this.logger.error("Execution failed, trying fallback", error);
      if (this.fallbackAgent) {
        try {
          return await this.fallbackAgent.execute(params);
        } catch (fallbackError) {
          this.logger.error("Fallback agent also failed", fallbackError);
        }
      }
      const errorMsg = error instanceof Error ? error.message : String(error);
      return {
        content: `I encountered an error processing your request: ${errorMsg}`,
        toolCalls: [],
        usage: { totalTokens: 0 },
        model: this.modelManager.getActiveModel()?.model ?? "error",
        skillsApplied: []
      };
    }
  }
  async internalLLMCall(systemPrompt, userContent, maxTokens) {
    return this.modelManager.internalLLMCall(systemPrompt, userContent, maxTokens);
  }
  setProtocolBridge(bridge) {
    this.fallbackAgent?.setProtocolBridge?.(bridge);
    this.agentPool.setProtocolBridge(bridge);
  }
  async reinitializeToolRegistry() {
    await this.fallbackAgent?.reinitializeToolRegistry?.();
  }
  async reinitializeSession() {
    await this.fallbackAgent?.reinitializeSession?.();
  }
  getStats() {
    return {
      mode: "multi-agent",
      activeWorkers: this.agentPool.getActiveWorkerIds(),
      catalogSize: this.agentPool.getCatalog().length,
      model: this.modelManager.getActiveModel()?.model ?? "unknown"
    };
  }
};
var HookManager = class {
  hooks = /* @__PURE__ */ new Map();
  eventIndex = /* @__PURE__ */ new Map();
  logger;
  constructor(logLevel) {
    this.logger = new Logger("HookManager", logLevel ?? "info");
  }
  register(hook) {
    this.hooks.set(hook.id, hook);
    if (!this.eventIndex.has(hook.event)) {
      this.eventIndex.set(hook.event, /* @__PURE__ */ new Set());
    }
    this.eventIndex.get(hook.event).add(hook.id);
    this.logger.debug("Hook registered", { id: hook.id, event: hook.event });
  }
  unregister(hookId) {
    const hook = this.hooks.get(hookId);
    if (!hook) return false;
    this.hooks.delete(hookId);
    this.eventIndex.get(hook.event)?.delete(hookId);
    return true;
  }
  async trigger(event, data = {}) {
    const hookIds = this.eventIndex.get(event);
    if (!hookIds || hookIds.size === 0) return;
    const context = { event, timestamp: Date.now(), data };
    for (const hookId of hookIds) {
      const hook = this.hooks.get(hookId);
      if (!hook || !hook.enabled) continue;
      try {
        await hook.handler(context);
      } catch (err) {
        this.logger.warn("Hook execution failed", {
          hookId: hook.id,
          event,
          error: toErrorMessage(err)
        });
      }
    }
  }
  async loadFromDirectory(dir) {
    const hooksDir = join(dir, ".novaclaw", "hooks");
    let loaded = 0;
    try {
      const entries = await readdir(hooksDir, { withFileTypes: true });
      for (const entry of entries) {
        if (!entry.isFile()) continue;
        const ext = extname(entry.name);
        if (ext !== ".json" && ext !== ".yaml" && ext !== ".yml") continue;
        try {
          const content = await readFile(join(hooksDir, entry.name), "utf-8");
          const configs = this.parseHookFile(content, ext);
          for (const config of configs) {
            this.registerFromConfig(config);
            loaded++;
          }
        } catch (err) {
          this.logger.warn("Failed to load hook file", {
            file: entry.name,
            error: toErrorMessage(err)
          });
        }
      }
    } catch {
    }
    if (loaded > 0) {
      this.logger.info(`Loaded ${loaded} hooks from ${hooksDir}`);
    }
    return loaded;
  }
  list() {
    return Array.from(this.hooks.values()).map((h) => ({
      id: h.id,
      event: h.event,
      name: h.name,
      enabled: h.enabled
    }));
  }
  setEnabled(hookId, enabled) {
    const hook = this.hooks.get(hookId);
    if (!hook) return false;
    hook.enabled = enabled;
    return true;
  }
  parseHookFile(content, ext) {
    if (ext === ".json") {
      const parsed = JSON.parse(content);
      return Array.isArray(parsed) ? parsed : [parsed];
    }
    return [];
  }
  registerFromConfig(config) {
    const validEvents = [
      "session:start",
      "session:end",
      "message:before",
      "message:after",
      "tool:before",
      "tool:after",
      "boot",
      "shutdown"
    ];
    if (!validEvents.includes(config.event)) {
      this.logger.warn("Invalid hook event", { id: config.id, event: config.event });
      return;
    }
    this.register({
      id: config.id,
      event: config.event,
      name: config.name,
      description: config.description,
      enabled: config.enabled !== false,
      handler: async (ctx) => {
        this.logger.debug("Executing hook script", { id: config.id, event: ctx.event });
        this.logger.info(`[Hook:${config.id}] ${config.script}`, { context: ctx.data });
      }
    });
  }
};
var DEFAULT_UI_DIR = "ui";
function getUiRoot(customDir) {
  const scriptDir = dirname(fileURLToPath(import.meta.url));
  const fromScriptDir = join(scriptDir, DEFAULT_UI_DIR);
  if (existsSync(fromScriptDir)) return fromScriptDir;
  const fromPackageRoot = resolve(scriptDir, "..", DEFAULT_UI_DIR);
  if (existsSync(fromPackageRoot)) return fromPackageRoot;
  return resolve(process.cwd(), DEFAULT_UI_DIR);
}
function resolveUiPath(uiRoot, relativePath) {
  const normalized = join(uiRoot, relativePath).replace(/\\/g, "/");
  const root = uiRoot.replace(/\\/g, "/");
  if (!normalized.startsWith(root) || normalized === root) return null;
  if (normalized.includes("..")) return null;
  return normalized;
}
async function readUiFile(uiRoot, relativePath) {
  const resolved = resolveUiPath(uiRoot, relativePath);
  if (!resolved) throw new Error("Invalid UI path");
  return readFile(resolved);
}
function getMimeType(path4) {
  const ext = path4.split(".").pop()?.toLowerCase() ?? "";
  const MIME_TYPES = {
    html: "text/html",
    css: "text/css",
    js: "application/javascript",
    json: "application/json",
    png: "image/png",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    gif: "image/gif",
    ico: "image/x-icon",
    svg: "image/svg+xml",
    woff: "font/woff",
    woff2: "font/woff2"
  };
  return MIME_TYPES[ext] ?? "application/octet-stream";
}

// src/gateway/routes/route-helpers.ts
function sendError(reply, status, error, code = ErrorCodes.INTERNAL_ERROR) {
  return reply.status(status).send({ success: false, error, code });
}
function sendNotFound(reply, message) {
  return sendError(reply, 404, message, ErrorCodes.NOT_FOUND);
}
function sendUnavailable(reply, message) {
  return sendError(reply, 503, message, ErrorCodes.SERVICE_UNAVAILABLE);
}
function sendInternalError(reply, err) {
  return sendError(reply, 500, toErrorMessage(err), ErrorCodes.INTERNAL_ERROR);
}

// src/gateway/routes/channels.ts
function registerChannelRoutes(server, deps) {
  const { config, logger: logger3, channelHub } = deps;
  async function ensurePluginLoaded(hub, channelId) {
    const registry = hub.getChannelRegistry();
    if (registry.get(channelId)) return "loaded";
    const enabledList = hub.getEffectiveConfig().channels?.enabled ?? [];
    if (!enabledList.includes(channelId)) return "not_found";
    try {
      await hub.addChannel(channelId);
    } catch {
    }
    return registry.get(channelId) ? "loaded" : "load_failed";
  }
  server.get("/api/channels", async (_req, reply) => {
    if (!channelHub) {
      return reply.send({ channels: [] });
    }
    const registry = channelHub.getChannelRegistry();
    const plugins = registry.listPlugins();
    const statuses = channelHub.getAllChannelStatuses();
    const effectiveConfig = channelHub.getEffectiveConfig();
    const enabledList = effectiveConfig.channels?.enabled ?? [];
    const enabledSet = new Set(enabledList);
    const seenIds = /* @__PURE__ */ new Set();
    const channels = plugins.map((plugin) => {
      seenIds.add(plugin.id);
      const status = statuses[plugin.id];
      const health = channelHub.getChannelManager().getHealthStatus(plugin.id);
      return {
        id: plugin.id,
        meta: plugin.meta,
        capabilities: plugin.capabilities,
        enabled: enabledSet.has(plugin.id),
        origin: registry.getEntry(plugin.id)?.origin ?? "unknown",
        status: status ? {
          connected: status.connected,
          lastActivity: status.lastActivity,
          error: status.error,
          metrics: status.metrics,
          accounts: status.accounts
        } : null,
        health: health ? { status: health.status, consecutiveFailures: health.consecutiveFailures } : null
      };
    });
    for (const channelId of enabledList) {
      if (seenIds.has(channelId)) continue;
      channels.push({
        id: channelId,
        meta: { id: channelId, label: channelId, selectionLabel: channelId, docsPath: "", blurb: "" },
        capabilities: { chatTypes: ["direct"], media: false },
        enabled: true,
        origin: "openclaw",
        status: statuses[channelId] ? {
          connected: statuses[channelId].connected,
          lastActivity: statuses[channelId].lastActivity,
          error: statuses[channelId].error,
          metrics: statuses[channelId].metrics,
          accounts: statuses[channelId].accounts
        } : null,
        health: null
      });
    }
    const connectedCount = channels.filter((c) => c.status?.connected).length;
    reply.send({
      channels,
      summary: {
        total: channels.length,
        enabled: enabledSet.size,
        connected: connectedCount
      }
    });
  });
  server.get(
    "/api/channels/:channelId",
    async (request, reply) => {
      if (!channelHub) {
        return sendUnavailable(reply, "Channel hub not available");
      }
      const { channelId } = request.params;
      const registry = channelHub.getChannelRegistry();
      const resolvedId = registry.normalizeChannelId(channelId);
      const plugin = registry.get(resolvedId);
      if (!plugin) {
        return sendNotFound(reply, `Channel '${channelId}' not found`);
      }
      const status = channelHub.getChannelStatus(resolvedId);
      const health = channelHub.getChannelManager().getHealthStatus(resolvedId);
      const effectiveCfg = channelHub.getEffectiveConfig();
      const enabledSet = new Set(effectiveCfg.channels?.enabled ?? []);
      reply.send({
        id: plugin.id,
        meta: plugin.meta,
        capabilities: plugin.capabilities,
        enabled: enabledSet.has(plugin.id),
        origin: registry.getEntry(plugin.id)?.origin ?? "unknown",
        status: status ? {
          connected: status.connected,
          lastActivity: status.lastActivity,
          error: status.error,
          metrics: status.metrics,
          accounts: status.accounts
        } : null,
        health: health ? { status: health.status, consecutiveFailures: health.consecutiveFailures } : null,
        hasGateway: !!plugin.gateway,
        hasOutbound: !!plugin.outbound,
        hasSecurity: !!plugin.security,
        hasPairing: !!plugin.pairing
      });
    }
  );
  server.post(
    "/api/channels/:channelId/start",
    async (request, reply) => {
      if (!channelHub) {
        return sendUnavailable(reply, "Channel hub not available");
      }
      const { channelId } = request.params;
      const body = request.body ?? {};
      const accountId = body.accountId;
      const pluginStatus = await ensurePluginLoaded(channelHub, channelId);
      if (pluginStatus === "not_found") {
        return sendNotFound(reply, `Channel plugin not found: ${channelId}`);
      }
      if (pluginStatus === "load_failed") {
        return sendError(reply, 500, `Channel '${channelId}' is enabled but the plugin could not be loaded`);
      }
      try {
        const manager = channelHub.getChannelManager();
        await manager.startChannel(channelId, accountId);
        logger3.info(`Channel ${channelId} started via API`, { accountId });
        reply.send({ success: true, channelId, accountId });
      } catch (err) {
        logger3.error(`Failed to start channel ${channelId}`, err);
        sendInternalError(reply, err);
      }
    }
  );
  server.post(
    "/api/channels/:channelId/stop",
    async (request, reply) => {
      if (!channelHub) {
        return sendUnavailable(reply, "Channel hub not available");
      }
      const { channelId } = request.params;
      const body = request.body ?? {};
      const accountId = body.accountId;
      const registry = channelHub.getChannelRegistry();
      if (!registry.get(channelId)) {
        const enabledList = channelHub.getEffectiveConfig().channels?.enabled ?? [];
        return sendNotFound(reply, enabledList.includes(channelId) ? `Channel '${channelId}' is enabled but the plugin is not loaded \u2014 nothing to stop` : `Channel plugin not found: ${channelId}`);
      }
      try {
        const manager = channelHub.getChannelManager();
        await manager.stopChannel(channelId, accountId);
        logger3.info(`Channel ${channelId} stopped via API`, { accountId });
        reply.send({ success: true, channelId, accountId });
      } catch (err) {
        logger3.error(`Failed to stop channel ${channelId}`, err);
        sendInternalError(reply, err);
      }
    }
  );
  server.post(
    "/api/channels/:channelId/restart",
    async (request, reply) => {
      if (!channelHub) {
        return sendUnavailable(reply, "Channel hub not available");
      }
      const { channelId } = request.params;
      const body = request.body ?? {};
      const accountId = body.accountId;
      const pluginStatus = await ensurePluginLoaded(channelHub, channelId);
      if (pluginStatus === "not_found") {
        return sendNotFound(reply, `Channel plugin not found: ${channelId}`);
      }
      if (pluginStatus === "load_failed") {
        return sendError(reply, 500, `Channel '${channelId}' is enabled but the plugin could not be loaded`);
      }
      try {
        const manager = channelHub.getChannelManager();
        await manager.stopChannel(channelId, accountId);
        manager.resetRestartAttempts(channelId, accountId ?? "default");
        await manager.startChannel(channelId, accountId);
        logger3.info(`Channel ${channelId} restarted via API`, { accountId });
        reply.send({ success: true, channelId, accountId });
      } catch (err) {
        logger3.error(`Failed to restart channel ${channelId}`, err);
        sendInternalError(reply, err);
      }
    }
  );
  server.post(
    "/api/channels/:channelId/enable",
    async (request, reply) => {
      const { channelId } = request.params;
      try {
        if (!config.channels) {
          config.channels = { enabled: [] };
        }
        const channelsRef = config.channels;
        const enabled = new Set(
          Array.isArray(channelsRef.enabled) ? channelsRef.enabled : []
        );
        enabled.add(channelId);
        channelsRef.enabled = [...enabled];
        if (channelHub) {
          try {
            await channelHub.addChannel(channelId);
          } catch {
            await channelHub.getChannelManager().startChannel(channelId);
          }
        }
        logger3.info(`Channel ${channelId} enabled via API`);
        reply.send({ success: true, channelId, enabled: true });
      } catch (err) {
        logger3.error(`Failed to enable channel ${channelId}`, err);
        sendInternalError(reply, err);
      }
    }
  );
  server.post(
    "/api/channels/:channelId/disable",
    async (request, reply) => {
      const { channelId } = request.params;
      try {
        if (config.channels) {
          const channelsRef = config.channels;
          const enabled = Array.isArray(channelsRef.enabled) ? channelsRef.enabled.filter((id) => id !== channelId) : [];
          channelsRef.enabled = enabled;
        }
        if (channelHub) {
          try {
            await channelHub.removeChannel(channelId);
          } catch {
            await channelHub.getChannelManager().stopChannel(channelId).catch(() => {
            });
          }
        }
        logger3.info(`Channel ${channelId} disabled via API`);
        reply.send({ success: true, channelId, enabled: false });
      } catch (err) {
        logger3.error(`Failed to disable channel ${channelId}`, err);
        sendInternalError(reply, err);
      }
    }
  );
  server.get("/api/channels/registry", async (_req, reply) => {
    if (!channelHub) {
      return reply.send({ entries: [] });
    }
    const registry = channelHub.getChannelRegistry();
    const plugins = registry.listPlugins();
    const entries = plugins.map((p3) => ({
      id: p3.id,
      meta: p3.meta,
      capabilities: p3.capabilities,
      origin: registry.getEntry(p3.id)?.origin ?? "unknown",
      version: registry.getEntry(p3.id)?.version,
      isBuiltin: registry.isBuiltin(p3.id)
    }));
    reply.send({ entries });
  });
}

// src/gateway/routes/chat.ts
function wantsSSE(request) {
  const q = request.query?.stream;
  if (q === "true" || q === "1") return true;
  return request.headers.accept?.includes("text/event-stream") ?? false;
}
function registerChatRoutes(server, deps) {
  const { sessionManager, metrics, logger: logger3, wsHandler } = deps;
  server.post("/api/chat", async (request, reply) => {
    const t0 = performance.now();
    try {
      if (!deps.agent || !wsHandler) {
        return reply.status(503).send({
          success: false,
          error: "Chat service is not ready yet",
          code: ErrorCodes.SERVICE_UNAVAILABLE
        });
      }
      const parsed = ApiChatRequestSchema.safeParse(request.body ?? {});
      if (!parsed.success) {
        const first = parsed.error.issues[0];
        const msg = first ? `${first.path.join(".")}: ${first.message}` : "Invalid request body";
        return reply.status(400).send({
          success: false,
          error: msg,
          code: ErrorCodes.VALIDATION_ERROR
        });
      }
      const body = parsed.data;
      let ctx = sessionManager.get(body.sessionKey);
      if (!ctx) {
        ctx = await sessionManager.createSession({
          userId: request.headers["x-user-id"] || "anonymous",
          channel: "rest-api"
        }, body.sessionKey || void 0);
      }
      if (wantsSSE(request)) {
        return handleSSE(reply, wsHandler, body, ctx, t0, metrics, logger3);
      }
      const response = await wsHandler.processMessage({
        ...body,
        sessionKey: ctx.sessionKey
      });
      const elapsed = performance.now() - t0;
      metrics.incrementRequests(response.success ? "success" : "error", elapsed);
      return response;
    } catch (error) {
      logger3.error("REST chat error", error);
      metrics.incrementRequests("error", 0);
      return reply.status(500).send({
        success: false,
        error: toErrorMessage(error),
        code: ErrorCodes.INTERNAL_ERROR
      });
    }
  });
}
async function handleSSE(reply, wsHandler, body, ctx, t0, metrics, logger3) {
  reply.raw.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    "Connection": "keep-alive",
    "X-Accel-Buffering": "no"
  });
  const write = (data) => {
    if (!reply.raw.destroyed) reply.raw.write(`data: ${data}

`);
  };
  const onChunk = (chunk) => {
    write(JSON.stringify(chunk));
  };
  try {
    const response = await wsHandler.processMessage(
      { ...body, sessionKey: ctx.sessionKey },
      onChunk
    );
    const elapsed = performance.now() - t0;
    metrics.incrementRequests(response.success ? "success" : "error", elapsed);
  } catch (error) {
    logger3.error("SSE chat error", error);
    write(JSON.stringify({ type: "error", error: toErrorMessage(error) }));
    write("[DONE]");
    metrics.incrementRequests("error", 0);
  } finally {
    if (!reply.raw.destroyed) reply.raw.end();
  }
}

// src/gateway/routes/config.ts
function maskSensitiveFields(obj) {
  const SENSITIVE = ["sid", "key", "secret", "token", "password", "credential", "api_key", "apikey"];
  const result = {};
  for (const [k, v] of Object.entries(obj)) {
    if (typeof v === "string" && v.trim() && SENSITIVE.some((s) => k.toLowerCase().includes(s))) {
      result[k] = "***";
    } else if (v && typeof v === "object" && !Array.isArray(v)) {
      result[k] = maskSensitiveFields(v);
    } else {
      result[k] = v;
    }
  }
  return result;
}
function registerConfigRoutes(server, deps) {
  const { config, logger: logger3, protocolBridge } = deps;
  server.get("/api/config", async (req, reply) => {
    const showKeys = req.query?.showKeys === "true";
    const models = config.models;
    const providersRaw = models?.providers ?? {};
    const providers = {};
    for (const key of Object.keys(providersRaw)) {
      const p3 = providersRaw[key];
      if (!p3 || typeof p3 !== "object") continue;
      const hasApiKey = p3.apiKey && p3.apiKey.trim() !== "";
      const hasBaseUrl = p3.baseUrl && p3.baseUrl.trim() !== "";
      if (!hasApiKey && !hasBaseUrl) continue;
      providers[key] = {
        baseUrl: p3.baseUrl ?? "",
        apiKey: hasApiKey ? showKeys ? p3.apiKey : "***" : "",
        ...p3.model != null ? { model: p3.model } : {},
        ...p3.timeout != null ? { timeout: p3.timeout } : {}
      };
    }
    const rawMcp = config.mcp;
    const mcp = maskMcpListForResponse(rawMcp, showKeys);
    const channels = config.channels ?? void 0;
    reply.send({
      models: {
        primary: models?.primary ?? "",
        fallback: models?.fallback ?? "",
        providers
      },
      ...mcp != null ? { mcp } : {},
      ...channels ? { channels } : {}
    });
  });
  server.post("/api/config", async (request, reply) => {
    const body = request.body;
    if (!body || typeof body !== "object") {
      return reply.status(400).send({
        success: false,
        error: "Invalid body",
        code: ErrorCodes.VALIDATION_ERROR
      });
    }
    try {
      if (body.models != null) {
        const result = ModelsConfigSchema.partial().safeParse(body.models);
        if (!result.success) {
          return reply.status(400).send({
            success: false,
            error: "Invalid models config",
            code: ErrorCodes.VALIDATION_ERROR,
            issues: result.error.issues.map((i) => ({
              path: i.path.join("."),
              message: i.message
            }))
          });
        }
      }
      const existingOverrides = await ConfigLoader.loadOverrides();
      const nextOverrides = { ...existingOverrides };
      if (body.models != null && typeof body.models === "object") {
        const modelsPatch = JSON.parse(JSON.stringify(body.models));
        if (!config.models) {
          config.models = {
            primary: "",
            fallback: "",
            providers: {}
          };
        }
        const modelsRef = config.models;
        const existingProviders = modelsRef.providers ?? {};
        if (modelsPatch.providers && typeof modelsPatch.providers === "object") {
          const incoming = modelsPatch.providers;
          const nextProviders = {};
          for (const [key, entry] of Object.entries(incoming)) {
            if (!entry || typeof entry !== "object") continue;
            if (entry.apiKey === "***" || entry.apiKey === void 0) {
              entry.apiKey = existingProviders[key]?.apiKey;
            }
            const apiStr = typeof entry.apiKey === "string" ? entry.apiKey.trim() : "";
            const baseStr = typeof entry.baseUrl === "string" ? entry.baseUrl.trim() : "";
            if (!apiStr && !baseStr) continue;
            nextProviders[key] = entry;
          }
          modelsPatch.providers = nextProviders;
        }
        if (modelsPatch.primary !== void 0) modelsRef.primary = modelsPatch.primary;
        if (modelsPatch.fallback !== void 0) modelsRef.fallback = modelsPatch.fallback;
        if (modelsPatch.providers !== void 0) modelsRef.providers = modelsPatch.providers;
        nextOverrides.models = config.models;
        try {
          await deps.agent?.reinitializeSession?.();
        } catch (err) {
          logger3.warn("Reinit session after config save", err);
        }
      }
      if (body.mcp !== void 0) {
        const parsed = external_exports.array(MCPServerEntrySchema).safeParse(body.mcp);
        if (!parsed.success) {
          return reply.status(400).send({
            success: false,
            error: "Invalid mcp config",
            code: ErrorCodes.VALIDATION_ERROR,
            issues: parsed.error.issues.map((i) => ({
              path: i.path.join("."),
              message: i.message
            }))
          });
        }
        const existingMcp = config.mcp;
        const mergedMcp = mergeMcpIncomingWithExisting(parsed.data, existingMcp);
        config.mcp = mergedMcp;
        nextOverrides.mcp = mergedMcp;
        try {
          await protocolBridge?.reloadMcpConnections(mergedMcp);
        } catch (err) {
          logger3.warn("MCP reconnect after config save failed", err);
        }
        try {
          await deps.agent?.reinitializeToolRegistry?.();
        } catch (err) {
          logger3.warn("Tool registry reinit after MCP save failed", err);
        }
      }
      if (body.channels != null && typeof body.channels === "object") {
        if (!config.channels) {
          config.channels = { enabled: [] };
        }
        mergeInPlace(
          config.channels,
          body.channels
        );
        nextOverrides.channels = config.channels;
      }
      if (Object.keys(nextOverrides).length > 0) {
        await ConfigLoader.saveOverrides(nextOverrides);
      }
      reply.send({ success: true });
    } catch (err) {
      logger3.error("Save config failed", err);
      reply.status(500).send({
        success: false,
        error: toErrorMessage(err),
        code: ErrorCodes.INTERNAL_ERROR
      });
    }
  });
  server.get("/api/config/user", async (_req, reply) => {
    try {
      const overrides = await ConfigLoader.loadOverrides();
      const channels = overrides.channels ?? {};
      const plugins = overrides.plugins ?? {};
      const safeChannels = {};
      for (const [chId, detail] of Object.entries(channels)) {
        if (chId === "enabled" || !detail || typeof detail !== "object") continue;
        safeChannels[chId] = {
          ...detail,
          accounts: detail.accounts ? Object.fromEntries(
            Object.entries(detail.accounts).map(([accId, acc]) => [
              accId,
              maskSensitiveFields(acc)
            ])
          ) : void 0
        };
      }
      reply.send({ channels: safeChannels, plugins });
    } catch (err) {
      logger3.error("Load user config failed", err);
      reply.status(500).send({
        success: false,
        error: toErrorMessage(err),
        code: ErrorCodes.INTERNAL_ERROR
      });
    }
  });
  server.get("/api/config/channels", async (_req, reply) => {
    try {
      const overrides = await ConfigLoader.loadOverrides();
      const channels = overrides.channels ?? {};
      const result = {};
      for (const [chId, detail] of Object.entries(channels)) {
        if (chId === "enabled" || !detail || typeof detail !== "object") continue;
        result[chId] = {
          ...detail,
          accounts: detail.accounts ? Object.fromEntries(
            Object.entries(detail.accounts).map(([accId, acc]) => [
              accId,
              maskSensitiveFields(acc)
            ])
          ) : void 0
        };
      }
      reply.send({ channels: result });
    } catch (err) {
      logger3.error("Load channel configs failed", err);
      reply.status(500).send({
        success: false,
        error: toErrorMessage(err),
        code: ErrorCodes.INTERNAL_ERROR
      });
    }
  });
  server.get(
    "/api/config/channels/:channelId",
    async (request, reply) => {
      try {
        const detail = await ConfigLoader.getChannelConfig(request.params.channelId);
        if (!detail) {
          return reply.status(404).send({
            success: false,
            error: `Channel '${request.params.channelId}' not configured`,
            code: ErrorCodes.NOT_FOUND
          });
        }
        const safe = {
          ...detail,
          accounts: detail.accounts ? Object.fromEntries(
            Object.entries(detail.accounts).map(([accId, acc]) => [
              accId,
              maskSensitiveFields(acc)
            ])
          ) : void 0
        };
        reply.send(safe);
      } catch (err) {
        logger3.error(`Load channel config failed: ${request.params.channelId}`, err);
        reply.status(500).send({
          success: false,
          error: toErrorMessage(err),
          code: ErrorCodes.INTERNAL_ERROR
        });
      }
    }
  );
  server.post(
    "/api/config/channels/:channelId",
    async (request, reply) => {
      const body = request.body;
      if (!body || typeof body !== "object") {
        return reply.status(400).send({
          success: false,
          error: "Invalid body",
          code: ErrorCodes.VALIDATION_ERROR
        });
      }
      try {
        const validation = ChannelDetailConfigSchema.safeParse(body);
        if (!validation.success) {
          return reply.status(400).send({
            success: false,
            error: "Invalid channel config",
            code: ErrorCodes.VALIDATION_ERROR,
            issues: validation.error.issues.map((i) => ({
              path: i.path.join("."),
              message: i.message
            }))
          });
        }
        const channelId = request.params.channelId;
        const existing = await ConfigLoader.getChannelConfig(channelId);
        const merged = existing ? { ...existing, ...body } : body;
        if (merged.accounts && existing?.accounts) {
          for (const [accId, acc] of Object.entries(merged.accounts)) {
            const existingAcc = existing.accounts?.[accId];
            if (!existingAcc) continue;
            for (const [field, value] of Object.entries(acc)) {
              if (value === "***" && existingAcc[field]) {
                acc[field] = existingAcc[field];
              }
            }
          }
        }
        await ConfigLoader.saveChannelConfig(channelId, merged);
        if (!config.channels) {
          config.channels = { enabled: [] };
        }
        const channelsRef = config.channels;
        const enabled = new Set(
          Array.isArray(channelsRef.enabled) ? channelsRef.enabled : []
        );
        const hasEnabledAccount = merged.accounts && Object.values(merged.accounts).some((a) => a.enabled !== false);
        if (hasEnabledAccount) {
          enabled.add(channelId);
        }
        channelsRef.enabled = [...enabled];
        channelsRef[channelId] = merged;
        reply.send({ success: true, channelId });
      } catch (err) {
        logger3.error(`Save channel config failed: ${request.params.channelId}`, err);
        reply.status(500).send({
          success: false,
          error: toErrorMessage(err),
          code: ErrorCodes.INTERNAL_ERROR
        });
      }
    }
  );
  server.delete(
    "/api/config/channels/:channelId",
    async (request, reply) => {
      try {
        const channelId = request.params.channelId;
        const removed = await ConfigLoader.removeChannelConfig(channelId);
        if (!removed) {
          return reply.status(404).send({
            success: false,
            error: `Channel '${channelId}' not configured`,
            code: ErrorCodes.NOT_FOUND
          });
        }
        if (config.channels) {
          const channelsRef = config.channels;
          const enabled = Array.isArray(channelsRef.enabled) ? channelsRef.enabled : [];
          channelsRef.enabled = enabled.filter((id) => id !== channelId);
          delete channelsRef[channelId];
        }
        reply.send({ success: true, channelId });
      } catch (err) {
        logger3.error(`Delete channel config failed: ${request.params.channelId}`, err);
        reply.status(500).send({
          success: false,
          error: toErrorMessage(err),
          code: ErrorCodes.INTERNAL_ERROR
        });
      }
    }
  );
}

// src/gateway/routes/conversations.ts
function registerConversationRoutes(server, deps) {
  const { memoryEngine, logger: logger3 } = deps;
  server.get("/api/conversations", async (_req, reply) => {
    if (!memoryEngine) {
      return reply.send({ conversations: [] });
    }
    try {
      const list = await memoryEngine.listConversations();
      reply.send({ conversations: list });
    } catch (err) {
      logger3.error("List conversations failed", err);
      reply.status(500).send({
        success: false,
        error: toErrorMessage(err),
        code: ErrorCodes.INTERNAL_ERROR
      });
    }
  });
  server.post("/api/conversations", async (request, reply) => {
    if (!memoryEngine) {
      return reply.status(503).send({
        success: false,
        error: "Memory engine not available",
        code: ErrorCodes.INTERNAL_ERROR
      });
    }
    try {
      const body = request.body ?? {};
      const conv = await memoryEngine.createConversation(body.userId);
      reply.send(conv);
    } catch (err) {
      logger3.error("Create conversation failed", err);
      reply.status(500).send({
        success: false,
        error: toErrorMessage(err),
        code: ErrorCodes.INTERNAL_ERROR
      });
    }
  });
  server.get("/api/conversations/:id", async (request, reply) => {
    if (!memoryEngine) {
      return reply.status(503).send({
        success: false,
        error: "Memory engine not available",
        code: ErrorCodes.INTERNAL_ERROR
      });
    }
    const { id } = request.params;
    try {
      const conv = await memoryEngine.getConversation(id);
      if (!conv) {
        return reply.status(404).send({
          success: false,
          error: "Not found",
          code: ErrorCodes.NOT_FOUND
        });
      }
      reply.send(conv);
    } catch (err) {
      logger3.error("Get conversation failed", err);
      reply.status(500).send({
        success: false,
        error: toErrorMessage(err),
        code: ErrorCodes.INTERNAL_ERROR
      });
    }
  });
  server.delete("/api/conversations/:id", async (request, reply) => {
    if (!memoryEngine) {
      return reply.status(503).send({
        success: false,
        error: "Memory engine not available",
        code: ErrorCodes.INTERNAL_ERROR
      });
    }
    const { id } = request.params;
    try {
      const ok3 = await memoryEngine.deleteConversation(id);
      reply.send({ success: ok3 });
    } catch (err) {
      logger3.error("Delete conversation failed", err);
      reply.status(500).send({
        success: false,
        error: toErrorMessage(err),
        code: ErrorCodes.INTERNAL_ERROR
      });
    }
  });
}
function registerMemoryRoutes(server, deps) {
  const { logger: logger3 } = deps;
  server.get("/api/memory/documents", async (_req, reply) => {
    if (!deps.memoryEngine?.enabled) {
      return reply.send({ documents: [], message: "Memory system is disabled" });
    }
    reply.send({ documents: deps.memoryEngine.listDocuments() });
  });
  server.post("/api/memory/upload", async (request, reply) => {
    if (!deps.memoryEngine?.enabled) {
      return reply.status(400).send({
        success: false,
        error: "Memory system is disabled",
        code: ErrorCodes.VALIDATION_ERROR
      });
    }
    const body = request.body;
    if (!body?.name || typeof body.content !== "string") {
      return reply.status(400).send({
        success: false,
        error: "name and content are required",
        code: ErrorCodes.VALIDATION_ERROR
      });
    }
    try {
      const uploadsDir = deps.memoryEngine.getUploadsDir?.();
      if (!uploadsDir) {
        return reply.status(501).send({
          success: false,
          error: "This memory provider does not support file uploads",
          code: ErrorCodes.NOT_IMPLEMENTED
        });
      }
      const safeName = body.name.replace(/[^a-zA-Z0-9_.-]/g, "_");
      await mkdir(uploadsDir, { recursive: true });
      const filePath = join(uploadsDir, safeName);
      await writeFile(filePath, body.content, "utf-8");
      const idx = await deps.memoryEngine.indexDocument(filePath, "upload");
      reply.send({ success: true, documentId: idx?.documentId ?? null, path: safeName });
    } catch (err) {
      logger3.error("Memory upload failed", err);
      reply.status(500).send({
        success: false,
        error: toErrorMessage(err),
        code: ErrorCodes.INTERNAL_ERROR
      });
    }
  });
  server.delete("/api/memory/documents/:id", async (request, reply) => {
    if (!deps.memoryEngine?.enabled) {
      return reply.status(400).send({
        success: false,
        error: "Memory system is disabled",
        code: ErrorCodes.VALIDATION_ERROR
      });
    }
    const { id } = request.params;
    const ok3 = await deps.memoryEngine.removeDocument(id);
    reply.send({ success: ok3 });
  });
  server.post("/api/memory/search", async (request, reply) => {
    if (!deps.memoryEngine?.enabled) {
      return reply.status(400).send({
        success: false,
        error: "Memory system is disabled",
        code: ErrorCodes.VALIDATION_ERROR
      });
    }
    const body = request.body;
    if (!body?.query) {
      return reply.status(400).send({
        success: false,
        error: "query is required",
        code: ErrorCodes.VALIDATION_ERROR
      });
    }
    try {
      const result = await deps.memoryEngine.retrieve(body.query);
      reply.send(result);
    } catch (err) {
      logger3.error("Memory search failed", err);
      reply.status(500).send({
        success: false,
        error: toErrorMessage(err),
        code: ErrorCodes.INTERNAL_ERROR
      });
    }
  });
  server.post("/api/memory/reindex", async (_req, reply) => {
    if (!deps.memoryEngine?.enabled) {
      return reply.status(400).send({
        success: false,
        error: "Memory system is disabled",
        code: ErrorCodes.VALIDATION_ERROR
      });
    }
    if (typeof deps.memoryEngine.reindex !== "function") {
      return reply.status(501).send({
        success: false,
        error: "This memory provider does not support reindex",
        code: ErrorCodes.NOT_IMPLEMENTED
      });
    }
    try {
      const count = await deps.memoryEngine.reindex();
      reply.send({ success: true, documentsIndexed: count });
    } catch (err) {
      logger3.error("Memory reindex failed", err);
      reply.status(500).send({
        success: false,
        error: toErrorMessage(err),
        code: ErrorCodes.INTERNAL_ERROR
      });
    }
  });
}

// src/gateway/routes/sessions.ts
function registerSessionRoutes(server, deps) {
  const { sessionManager } = deps;
  server.get("/api/sessions", async (_req, reply) => {
    const sessions = Array.from(sessionManager.values()).map((s) => ({
      sessionId: s.sessionId,
      userId: s.userId,
      channel: s.channel,
      startTime: s.startTime,
      lastActivity: s.lastActivity
    }));
    reply.send({ sessions });
  });
  server.delete("/api/sessions/:sessionId", async (request, reply) => {
    const { sessionId } = request.params;
    let deleted = false;
    for (const [key, ctx] of Array.from(sessionManager.entries())) {
      if (ctx.sessionId === sessionId || key === sessionId) {
        deleted = sessionManager.delete(key);
        break;
      }
    }
    reply.send({ success: deleted });
  });
}
var execAsync = promisify(exec);
var INSTALL_SCRIPTS = ["install.sh", "setup.sh"];
function findInstallScript(dir) {
  for (const name of INSTALL_SCRIPTS) {
    if (existsSync(join(dir, name))) return name;
  }
  return null;
}
async function parseSkillMeta(skillsDir, dirName) {
  const dir = join(skillsDir, dirName);
  const skillFilePath = findSkillFile(dir);
  const runScript = findRunScript(dir);
  const installScript = findInstallScript(dir);
  const meta = {
    name: dirName,
    skillFile: skillFilePath ? SKILL_FILES.find((f) => skillFilePath.endsWith(f)) ?? null : null,
    hasRunScript: runScript !== null,
    hasInstallScript: installScript !== null
  };
  if (skillFilePath) {
    try {
      const raw = await readFile(skillFilePath, "utf-8");
      const { frontmatter } = parseFrontmatter(raw);
      if (frontmatter.description) meta.description = frontmatter.description;
      if (frontmatter.tags) meta.tags = frontmatter.tags;
    } catch {
    }
  }
  return meta;
}
function registerSkillRoutes(server, deps) {
  const { logger: logger3 } = deps;
  server.get("/api/skills", async (_req, reply) => {
    try {
      await mkdir(NOVACLAW_SKILLS_DIR, { recursive: true });
      const entries = await readdir(NOVACLAW_SKILLS_DIR, { withFileTypes: true });
      const skills = [];
      for (const entry of entries) {
        if (entry.name.startsWith(".") || !entry.isDirectory()) continue;
        skills.push(await parseSkillMeta(NOVACLAW_SKILLS_DIR, entry.name));
      }
      reply.send({ skills, skillsDir: NOVACLAW_SKILLS_DIR });
    } catch (err) {
      logger3.error("List skills failed", err);
      reply.status(500).send({
        success: false,
        error: toErrorMessage(err),
        code: ErrorCodes.INTERNAL_ERROR
      });
    }
  });
  server.get("/api/skills/:name", async (request, reply) => {
    const { name } = request.params;
    const safeName = name.replace(/[^a-zA-Z0-9_-]/g, "-");
    if (!safeName) {
      return reply.status(400).send({
        success: false,
        error: "Invalid skill name",
        code: ErrorCodes.VALIDATION_ERROR
      });
    }
    try {
      const skillDir = join(NOVACLAW_SKILLS_DIR, safeName);
      const skillFilePath = findSkillFile(skillDir);
      if (!skillFilePath) {
        return reply.status(404).send({
          success: false,
          error: "Skill not found",
          code: ErrorCodes.NOT_FOUND
        });
      }
      const content = await readFile(skillFilePath, "utf-8");
      const files = [];
      try {
        const entries = await readdir(skillDir);
        files.push(...entries.filter((e) => !e.startsWith(".")));
      } catch {
      }
      const skillFileName = SKILL_FILES.find((f) => skillFilePath.endsWith(f)) ?? null;
      reply.send({ name: safeName, content, files, skillFile: skillFileName });
    } catch (err) {
      if (isEnoent(err)) {
        return reply.status(404).send({
          success: false,
          error: "Skill not found",
          code: ErrorCodes.NOT_FOUND
        });
      }
      logger3.error("Get skill failed", err);
      reply.status(500).send({
        success: false,
        error: toErrorMessage(err),
        code: ErrorCodes.INTERNAL_ERROR
      });
    }
  });
  server.post("/api/skills/install", async (request, reply) => {
    const body = request.body;
    if (!body?.name || typeof body.content !== "string") {
      return reply.status(400).send({
        success: false,
        error: "name and content required",
        code: ErrorCodes.VALIDATION_ERROR
      });
    }
    const rawName = String(body.name).replace(/\\/g, "/").replace(/^\/+/, "").replace(/\.md$/i, "");
    const dirName = rawName.split("/").pop()?.replace(/[^a-zA-Z0-9_-]/g, "-") ?? "unnamed-skill";
    const skillDir = join(NOVACLAW_SKILLS_DIR, dirName);
    const skillFile = join(skillDir, "SKILL.md");
    try {
      await mkdir(skillDir, { recursive: true });
      await writeFile(skillFile, body.content, "utf-8");
      logger3.info("Skill installed", { dirName, skillFile });
      let installOutput = null;
      if (body.runInstall !== false) {
        const installScript = findInstallScript(skillDir);
        if (installScript) {
          try {
            const { stdout, stderr } = await execAsync(
              `bash "${join(skillDir, installScript)}"`,
              { cwd: skillDir, timeout: 6e4 }
            );
            installOutput = (stdout + stderr).trim() || null;
            logger3.info("Install script completed", { dirName, installScript });
          } catch (err) {
            logger3.warn("Install script failed", { dirName, error: toErrorMessage(err) });
            installOutput = `Install script failed: ${toErrorMessage(err)}`;
          }
        }
      }
      if (deps.skillsEngine && typeof deps.skillsEngine.reloadFromDisk === "function") {
        await deps.skillsEngine.reloadFromDisk();
        logger3.info("Skills engine reloaded after install");
      }
      reply.send({
        success: true,
        path: dirName,
        writtenPath: skillFile,
        ...installOutput ? { installOutput } : {}
      });
    } catch (err) {
      logger3.error("Skill install failed", err);
      reply.status(500).send({
        success: false,
        error: toErrorMessage(err),
        code: ErrorCodes.INTERNAL_ERROR
      });
    }
  });
  server.delete("/api/skills/:name", async (request, reply) => {
    const { name } = request.params;
    const safeName = name.replace(/[^a-zA-Z0-9_-]/g, "-");
    if (!safeName) {
      return reply.status(400).send({
        success: false,
        error: "Invalid skill name",
        code: ErrorCodes.VALIDATION_ERROR
      });
    }
    try {
      const skillDir = join(NOVACLAW_SKILLS_DIR, safeName);
      const dirStat = await stat(skillDir);
      if (!dirStat.isDirectory()) {
        return reply.status(404).send({
          success: false,
          error: "Skill not found",
          code: ErrorCodes.NOT_FOUND
        });
      }
      await rm(skillDir, { recursive: true });
      if (deps.skillsEngine && typeof deps.skillsEngine.reloadFromDisk === "function") {
        await deps.skillsEngine.reloadFromDisk();
      }
      reply.send({ success: true });
    } catch (err) {
      if (isEnoent(err)) {
        return reply.status(404).send({
          success: false,
          error: "Skill not found",
          code: ErrorCodes.NOT_FOUND
        });
      }
      logger3.error("Delete skill failed", err);
      reply.status(500).send({
        success: false,
        error: toErrorMessage(err),
        code: ErrorCodes.INTERNAL_ERROR
      });
    }
  });
}
function isEnoent(err) {
  return err != null && typeof err === "object" && "code" in err && err.code === "ENOENT";
}

// src/gateway/routes/ui.ts
function registerUiRoutes(server, deps) {
  const { config, logger: logger3 } = deps;
  if (!config.channels?.enabled?.includes("webchat")) return;
  const uiRoot = getUiRoot();
  server.get("/chat", async (_req, reply) => {
    try {
      const html = await readUiFile(uiRoot, "index.html");
      reply.type("text/html").send(html);
    } catch (err) {
      try {
        const fallback = await readUiFile(uiRoot, "chat.html");
        reply.type("text/html").send(fallback);
      } catch {
        logger3.warn("UI not found, ensure ui/index.html or ui/chat.html exists", err);
        reply.status(404).send("Chat UI not found.");
      }
    }
  });
  server.get("/chat/assets/*", async (request, reply) => {
    const assetPath = request.params["*"] ?? "";
    const safePath = assetPath.replace(/^\/+/, "").replace(/\\/g, "/");
    if (!safePath) return reply.status(404).send();
    try {
      const content = await readUiFile(uiRoot, safePath);
      reply.type(getMimeType(safePath)).send(content);
    } catch {
      reply.status(404).send();
    }
  });
}

// src/gateway/api-routes.ts
function registerApiRoutes(server, deps) {
  server.get("/", async (_req, reply) => {
    if (deps.config.channels?.enabled?.includes("webchat")) {
      const uiRoot = getUiRoot();
      try {
        const html = await readUiFile(uiRoot, "index.html");
        return reply.type("text/html").send(html);
      } catch {
        return reply.redirect("/chat", 302);
      }
    }
    reply.type("text/html").send(`<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>NovaClaw</title></head>
<body style="font-family:sans-serif;max-width:600px;margin:2rem auto;padding:0 1rem;">
  <h1>NovaClaw</h1>
  <p>Lightweight high-performance AI gateway is running.</p>
  <ul>
    <li><a href="/health">Health</a></li>
    <li><a href="/metrics">Metrics</a></li>
    <li><a href="/api/sessions">Sessions</a></li>
  </ul>
  <p>Enable the webchat channel to use the chat UI at <a href="/chat">/chat</a>.</p>
</body>
</html>`);
  });
  registerChannelRoutes(server, deps);
  registerChatRoutes(server, deps);
  registerSessionRoutes(server, deps);
  registerConversationRoutes(server, deps);
  registerConfigRoutes(server, deps);
  registerSkillRoutes(server, deps);
  registerMemoryRoutes(server, deps);
  registerUiRoutes(server, deps);
}

// src/gateway/chat-stream-service.ts
var ChatStreamService = class {
  processor;
  constructor(deps) {
    this.processor = deps.messageProcessor;
  }
  async run(request, options = {}) {
    return this.processor.process({
      message: request.message,
      sessionKey: request.sessionKey,
      images: request.images,
      metadata: request.metadata,
      channel: request.channel,
      userId: request.userId,
      onChunk: options.onChunk,
      abortSignal: options.abortSignal
    });
  }
};

// src/gateway/middleware/cors.ts
function registerCors(server, corsConfig, preflight) {
  if (!corsConfig.enabled) return;
  server.addHook("onRequest", async (request, reply) => {
    const origin = request.headers.origin;
    const allowed = corsConfig.origins;
    if (allowed.includes("*") || origin && allowed.includes(origin)) {
      reply.header("Access-Control-Allow-Origin", origin || "*");
      reply.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
      reply.header("Access-Control-Allow-Headers", "Content-Type,Authorization,X-Session-Key");
      if (corsConfig.credentials) {
        reply.header("Access-Control-Allow-Credentials", "true");
      }
    }
    if (request.method === "OPTIONS") {
      preflight.add(request);
      reply.status(204).send();
    }
  });
}

// src/gateway/middleware/rate-limit.ts
function registerRateLimit(server, rateLimitConfig, preflight) {
  const noop = { cleanup: () => {
  } };
  if (!rateLimitConfig.enabled) return noop;
  const buckets = /* @__PURE__ */ new Map();
  const { windowMs, maxRequests } = rateLimitConfig;
  const interval = setInterval(() => {
    const now = Date.now();
    for (const [ip, info] of buckets) {
      if (now > info.resetTime) buckets.delete(ip);
    }
  }, windowMs);
  server.addHook("preHandler", async (request, reply) => {
    if (preflight.has(request)) return;
    const ip = request.ip;
    const now = Date.now();
    let bucket = buckets.get(ip);
    if (!bucket || now > bucket.resetTime) {
      bucket = { count: 1, resetTime: now + windowMs };
      buckets.set(ip, bucket);
    } else {
      bucket.count++;
      if (bucket.count > maxRequests) {
        return reply.status(429).send({
          error: "Too Many Requests",
          retryAfter: Math.ceil((bucket.resetTime - now) / 1e3)
        });
      }
    }
    reply.header("X-RateLimit-Limit", maxRequests.toString());
    reply.header("X-RateLimit-Remaining", Math.max(0, maxRequests - bucket.count).toString());
    reply.header("X-RateLimit-Reset", Math.ceil(bucket.resetTime / 1e3).toString());
  });
  return { cleanup: () => clearInterval(interval) };
}
function verifyBearerToken(provided, expected) {
  if (!provided) return false;
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

// src/gateway/middleware/auth.ts
var PUBLIC_PATHS = /* @__PURE__ */ new Set(["/health", "/metrics", "/"]);
function isPublicPath(url2) {
  const path4 = url2.split("?")[0] ?? url2;
  if (PUBLIC_PATHS.has(path4)) return true;
  if (path4 === "/chat" || path4.startsWith("/chat/assets/")) return true;
  if (path4 === "/ws") return true;
  return false;
}
function extractToken(request) {
  const header = request.headers.authorization;
  if (header?.startsWith("Bearer ")) return header.slice(7);
  const idx = request.url.indexOf("?");
  if (idx !== -1) {
    const params = new URLSearchParams(request.url.slice(idx));
    const qToken = params.get("token");
    if (qToken) return qToken;
  }
  return void 0;
}
function registerAuth(server, authConfig, preflight, logger3) {
  if (!authConfig.enabled || authConfig.type !== "bearer") return;
  const expectedToken = authConfig.token;
  if (!expectedToken) {
    logger3.warn("Auth enabled with type=bearer but no token configured");
  }
  server.addHook("preHandler", async (request, reply) => {
    if (preflight.has(request)) return;
    if (isPublicPath(request.url)) return;
    const token = extractToken(request);
    if (!token) {
      return reply.status(401).send({ error: "Unauthorized" });
    }
    if (!verifyBearerToken(token, expectedToken ?? "")) {
      return reply.status(403).send({ error: "Forbidden" });
    }
  });
}

// src/gateway/ws-protocol.ts
var WS_OPEN = 1;
function sendEvent(socket, event, payload) {
  if (socket.readyState !== WS_OPEN) return;
  const isStreamChunk = payload && typeof payload === "object" && "chunk" in payload;
  const body = isStreamChunk ? { type: "stream_chunk", chunk: payload.chunk } : { type: "event", event, payload };
  socket.send(JSON.stringify(body));
}
function sendRes(socket, id, ok3, payload, error) {
  if (socket.readyState !== WS_OPEN) return;
  const body = payload && typeof payload === "object" && "success" in payload ? { type: "message_complete", response: payload } : { type: "res", id, ok: ok3, payload, error };
  socket.send(JSON.stringify(body));
}
function sendLegacy(socket, type, data) {
  if (socket.readyState !== WS_OPEN) return;
  socket.send(JSON.stringify({ type, ...data }));
}
function parseClientMessage(raw) {
  let msg;
  try {
    msg = JSON.parse(raw);
  } catch {
    return null;
  }
  if (!msg || typeof msg !== "object") return null;
  const m = msg;
  if (m.type === "req" && typeof m.method === "string") {
    return { type: "req", id: m.id, method: m.method, params: m.params };
  }
  if (m.type === "event" && typeof m.event === "string") {
    return { type: "event", event: m.event, payload: m.payload };
  }
  if (typeof m.type === "string") {
    return { type: "req", id: m.id, method: m.type, params: m.payload ?? m };
  }
  return null;
}

// src/gateway/websocket-handler.ts
var WebSocketHandler = class {
  constructor(deps) {
    this.deps = deps;
    this.logger = new Logger("WebSocket", deps.config.logging?.level || "info");
  }
  deps;
  connections = /* @__PURE__ */ new Map();
  logger;
  get connectionCount() {
    return this.connections.size;
  }
  closeAll() {
    for (const conn of this.connections.values()) {
      conn.socket.close(1001, "Server shutting down");
    }
  }
  handleConnection(socket, _request) {
    const connId = generateId();
    const conn = {
      id: connId,
      socket,
      lastPing: Date.now(),
      subscriptions: /* @__PURE__ */ new Set()
    };
    this.connections.set(connId, conn);
    this.logger.debug(`Connected: ${connId}`);
    socket.on("message", (data) => {
      const raw = typeof data === "string" ? data : data.toString();
      const frame = parseClientMessage(raw);
      if (!frame) {
        this.logger.warn("Invalid message format");
        sendLegacy(socket, "error", { error: "Invalid message format" });
        return;
      }
      this.handleFrame(conn, frame).catch((err) => {
        this.logger.error("Frame error", err);
        sendLegacy(socket, "error", { error: err instanceof Error ? err.message : String(err) });
      });
    });
    socket.on("error", (err) => this.logger.warn(`Connection error: ${connId}`, err));
    socket.on("close", () => {
      this.connections.delete(connId);
      if (conn.sessionContext) {
        this.deps.sessionManager.delete(conn.sessionContext.sessionKey);
        this.deps.emitter.emit("session:destroyed", conn.sessionContext);
      }
      this.logger.debug(`Disconnected: ${connId}`);
    });
    sendLegacy(conn.socket, "welcome", { connectionId: connId, timestamp: Date.now() });
  }
  async processMessage(request, onChunk, abortSignal) {
    return this.deps.chatStreamService.run(request, { onChunk, abortSignal });
  }
  // ── Private ──────────────────────────────────────────────────────────
  async handleFrame(conn, frame) {
    const method = frame.type === "req" ? frame.method : frame.event;
    const payload = (frame.type === "req" ? frame.params : frame.payload) ?? {};
    const payloadObj = typeof payload === "object" && payload !== null ? payload : {};
    switch (method) {
      case "auth":
        return this.handleAuth(conn, payloadObj);
      case "message":
        return this.handleChatMessage(conn, payloadObj);
      case "stop":
        return this.handleStop(conn);
      case "ping":
        conn.lastPing = Date.now();
        if (conn.sessionContext) conn.sessionContext.lastActivity = Date.now();
        sendLegacy(conn.socket, "pong");
        return;
      case "subscribe":
        conn.subscriptions.add(payloadObj.channel ?? "");
        return;
      case "unsubscribe":
        conn.subscriptions.delete(payloadObj.channel ?? "");
        return;
      default:
        sendLegacy(conn.socket, "error", { error: `Unknown method: ${method}` });
    }
  }
  async handleAuth(conn, payload) {
    const parsed = WebSocketAuthPayloadSchema.safeParse(payload);
    if (!parsed.success) {
      sendLegacy(conn.socket, "error", {
        error: "Invalid auth payload",
        issues: parsed.error.issues.map((i) => ({ path: i.path.join("."), message: i.message }))
      });
      return;
    }
    const authData = parsed.data;
    const authCfg = this.deps.config.security?.auth;
    if (authCfg?.enabled && authCfg.type === "bearer") {
      if (!verifyBearerToken(authData.token, authCfg.token ?? "")) {
        sendLegacy(conn.socket, "auth_failed", { error: "Invalid or missing token" });
        return;
      }
    }
    conn.sessionContext = await this.deps.sessionManager.createSession(authData);
    this.deps.emitter.emit("session:created", conn.sessionContext);
    const resolver = this.deps.messageProcessor.conversationResolver;
    if (authData.conversationId && resolver) {
      await resolver.bind(conn.sessionContext, authData.conversationId);
    }
    sendLegacy(conn.socket, "auth_success", {
      sessionKey: conn.sessionContext.sessionKey,
      conversationId: conn.sessionContext.conversationId ?? null
    });
  }
  async handleChatMessage(conn, payload) {
    if (!conn.sessionContext) {
      sendLegacy(conn.socket, "error", { error: "Session not authenticated" });
      return;
    }
    const parsed = WebSocketMessagePayloadSchema.safeParse(payload);
    if (!parsed.success) {
      sendLegacy(conn.socket, "error", {
        error: "Invalid message payload",
        issues: parsed.error.issues.map((i) => ({ path: i.path.join("."), message: i.message }))
      });
      return;
    }
    const controller = new AbortController();
    conn.currentAbortController = controller;
    try {
      await this.processStreamMessage(conn, parsed.data, controller.signal);
    } catch (err) {
      this.logger.error("Message processing error", err);
      if (!controller.signal.aborted) {
        sendLegacy(conn.socket, "error", { error: err instanceof Error ? err.message : String(err) });
      }
    } finally {
      delete conn.currentAbortController;
    }
  }
  handleStop(conn) {
    if (conn.currentAbortController) {
      conn.currentAbortController.abort();
      this.logger.info("Stop requested", { connectionId: conn.id });
      sendLegacy(conn.socket, "stopped");
    }
  }
  async processStreamMessage(conn, payload, abortSignal) {
    const text2 = payload?.message ?? payload?.content ?? "";
    if (!text2) {
      sendLegacy(conn.socket, "error", { error: "payload.message is required" });
      return;
    }
    const request = {
      requestId: generateId(),
      sessionKey: conn.sessionContext.sessionKey,
      message: text2,
      images: payload.images,
      metadata: payload.metadata,
      channel: conn.sessionContext.channel,
      userId: conn.sessionContext.userId
    };
    const onChunk = (chunk) => {
      try {
        sendEvent(conn.socket, "stream_chunk", { chunk });
      } catch (e) {
        this.logger.warn("Send chunk failed", e);
      }
    };
    this.deps.emitter.emit("message:received", request);
    const response = await this.deps.chatStreamService.run(request, { onChunk, abortSignal });
    sendRes(conn.socket, void 0, response.success, response);
    this.deps.emitter.emit("message:processed", request, response);
  }
};

// src/gateway/gateway.ts
var NovaClawGateway = class extends EventEmitter3 {
  constructor(config, deps) {
    super();
    this.config = config;
    this.logger = new Logger("Gateway", config.logging?.level || "info");
    this.metrics = new MetricsCollector();
    this.server = this.createServer();
    this.skillsEngine = deps.skillsEngine;
    this.agent = deps.agent;
    this.channelHub = deps.channelHub;
    this.protocolBridge = deps.protocolBridge;
    this.memoryEngine = deps.memoryEngine;
    this.messageProcessor = deps.messageProcessor;
    this.sessionManager = deps.messageProcessor.sessionManager;
    this.chatStreamService = new ChatStreamService({
      messageProcessor: this.messageProcessor
    });
    this.wsHandler = new WebSocketHandler({
      config: this.config,
      sessionManager: this.sessionManager,
      messageProcessor: this.messageProcessor,
      chatStreamService: this.chatStreamService,
      emitter: this
    });
    this.wireChannelMessageHandler();
  }
  config;
  server;
  logger;
  metrics;
  sessionManager;
  wsHandler;
  chatStreamService;
  shuttingDown = false;
  healthInterval = null;
  rateLimitState = null;
  skillsEngine;
  agent;
  channelHub;
  protocolBridge;
  memoryEngine;
  messageProcessor;
  async start() {
    try {
      const t0 = performance.now();
      await this.registerRoutes();
      await this.server.listen({
        port: this.config.port || 3e3,
        host: this.config.bind === "loopback" ? "127.0.0.1" : "0.0.0.0"
      });
      this.startHealthMonitoring();
      const elapsed = performance.now() - t0;
      this.logger.info(`Started (${elapsed.toFixed(0)}ms)`, {
        port: this.config.port || 3e3,
        bind: this.config.bind
      });
      this.emit("gateway:started");
    } catch (error) {
      this.logger.error("Start failed", error);
      throw error;
    }
  }
  async stop() {
    if (this.shuttingDown) return;
    this.shuttingDown = true;
    this.logger.info("Shutting down...");
    try {
      this.wsHandler?.closeAll();
      if (this.healthInterval) {
        clearInterval(this.healthInterval);
        this.healthInterval = null;
      }
      this.rateLimitState?.cleanup();
      this.rateLimitState = null;
      await this.server.close();
      this.emit("gateway:stopped");
      this.logger.info("Stopped");
    } catch (error) {
      this.logger.error("Shutdown error", error);
      throw error;
    }
  }
  // ── Private ──────────────────────────────────────────────────────────
  wireChannelMessageHandler() {
    this.on("channel:message", (data) => {
      this.handleChannelMessage(data).catch((err) => {
        this.logger.error("Failed to handle channel message", err);
      });
    });
  }
  async handleChannelMessage(data) {
    const { channelId, sessionHints, message } = data;
    const text2 = extractMessageText(message);
    if (!text2) {
      this.logger.warn("Channel message has no extractable text", { channelId });
      return;
    }
    const sessionKey = sessionHints.sessionKey ?? "";
    const response = await this.messageProcessor.process({
      message: text2,
      sessionKey: sessionKey || void 0,
      userId: sessionHints.userId,
      channel: channelId,
      metadata: sessionHints.metadata
    });
    const request = {
      requestId: generateId(),
      sessionKey: sessionKey || response.sessionId || "",
      message: text2
    };
    this.emit("message:received", request);
    if (response.success && response.content?.trim() && this.channelHub) {
      await this.channelHub.sendMessage(channelId, sessionHints.userId, {
        text: response.content
      });
    }
    this.emit("message:processed", request, response);
  }
  createServer() {
    const webchatCfg = this.config.channels?.webchat;
    const fastify = Fastify({
      logger: false,
      bodyLimit: parseMemorySize(
        String(webchatCfg?.maxMessageSize ?? "10MB")
      ),
      trustProxy: true,
      routerOptions: {
        maxParamLength: 500,
        ignoreTrailingSlash: true,
        caseSensitive: false
      }
    });
    fastify.register(fastifyWebsocket, {
      options: { maxPayload: 1024 * 1024 }
    });
    fastify.setErrorHandler((error, request, reply) => {
      const err = error instanceof Error ? error : new Error(String(error));
      this.logger.error("Request error", {
        method: request.method,
        url: request.url,
        error: err.message,
        stack: err.stack
      });
      reply.status(500).send({
        error: "Internal Server Error",
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      });
    });
    fastify.setNotFoundHandler((request, reply) => {
      reply.status(404).send({
        error: "Not Found",
        message: `Route ${request.method} ${request.url} not found`,
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      });
    });
    return fastify;
  }
  async registerRoutes() {
    const { server } = this;
    const preflight = /* @__PURE__ */ new WeakSet();
    if (this.config.security?.cors) {
      registerCors(server, this.config.security.cors, preflight);
    }
    if (this.config.security?.rateLimit) {
      this.rateLimitState = registerRateLimit(server, this.config.security.rateLimit, preflight);
    }
    if (this.config.security?.auth) {
      registerAuth(server, this.config.security.auth, preflight, this.logger);
    }
    server.get("/health", async (_req, reply) => {
      const health = await this.getHealthStatus();
      reply.status(health.status === "unhealthy" ? 503 : 200).send(health);
    });
    server.get("/metrics", async (_req, reply) => {
      reply.send(this.metrics.getMetrics());
    });
    const wsHandler = this.wsHandler;
    server.register(async function(fastify) {
      fastify.get("/ws", { websocket: true }, (socket, request) => {
        wsHandler.handleConnection(socket, request);
      });
    });
    registerApiRoutes(server, {
      config: this.config,
      sessionManager: this.sessionManager,
      metrics: this.metrics,
      logger: this.logger,
      agent: this.agent,
      skillsEngine: this.skillsEngine,
      memoryEngine: this.memoryEngine,
      wsHandler: this.wsHandler,
      channelHub: this.channelHub,
      protocolBridge: this.protocolBridge
    });
  }
  startHealthMonitoring() {
    if (!this.config.monitoring?.enabled) return;
    const interval = this.config.monitoring.health?.interval || HEALTH_CHECK_INTERVAL_MS;
    this.healthInterval = setInterval(async () => {
      try {
        const health = await this.getHealthStatus();
        this.emit("health:changed", health);
        if (health.status !== "healthy") {
          this.logger.warn("Health check degraded", health);
        }
      } catch (error) {
        this.logger.error("Health monitoring error", error);
      }
    }, interval);
  }
  async getHealthStatus() {
    const now = Date.now();
    const uptime = process.uptime() * 1e3;
    const mem = process.memoryUsage();
    const components = {
      gateway: {
        status: "healthy",
        lastCheck: now,
        metrics: {
          activeConnections: this.wsHandler?.connectionCount ?? 0,
          activeSessions: this.sessionManager.size
        }
      },
      agent: {
        status: this.agent ? "healthy" : "unhealthy",
        lastCheck: now,
        metrics: { initialized: this.agent ? 1 : 0 }
      },
      skills: {
        status: this.skillsEngine ? "healthy" : "degraded",
        lastCheck: now
      },
      memory: {
        status: this.memoryEngine?.enabled ? "healthy" : "degraded",
        lastCheck: now,
        metrics: { enabled: this.memoryEngine?.enabled ? 1 : 0 }
      }
    };
    if (this.channelHub) {
      const channelStatuses = this.channelHub.getAllChannelStatuses();
      const channelErrors = Object.values(channelStatuses).filter((s) => !s.connected).length;
      components.channels = {
        status: channelErrors === 0 ? "healthy" : channelErrors < Object.keys(channelStatuses).length ? "degraded" : "unhealthy",
        lastCheck: now,
        metrics: { total: Object.keys(channelStatuses).length, errors: channelErrors }
      };
    }
    const statuses = Object.values(components).map((c) => c.status);
    const status = statuses.every((s) => s === "healthy") ? "healthy" : statuses.some((s) => s === "healthy") ? "degraded" : "unhealthy";
    return {
      status,
      timestamp: now,
      uptime,
      memory: {
        used: mem.rss,
        total: mem.rss + mem.external,
        percentage: mem.heapUsed / mem.heapTotal * 100
      },
      components
    };
  }
};
function parseMemorySize(size) {
  const units = {
    B: 1,
    KB: 1024,
    MB: 1024 * 1024,
    GB: 1024 * 1024 * 1024
  };
  const match = size.match(/^(\d+(?:\.\d+)?)([A-Z]+)$/);
  if (!match?.[1] || !match[2]) return 10 * 1024 * 1024;
  const value = parseFloat(match[1]);
  const factor = units[match[2]] ?? 1;
  return Math.floor(value * factor);
}
var OPENCLAW_HOME2 = join(homedir(), ".openclaw");
var OPENCLAW_CONFIG_PATH = join(OPENCLAW_HOME2, "openclaw.json");
var OPENCLAW_EXTENSIONS_DIR = join(OPENCLAW_HOME2, "extensions");
var SKILL_DIR_NAME = "skills";
var SKILL_FILES2 = ["SKILL.md", "skill.md"];
function migrateOpenClawConfig(cfg, options) {
  const logger3 = options?.logger;
  const ocCfg = readOpenClawConfig();
  const extensions = discoverExtensions();
  if (extensions.length > 0) {
    logger3?.info(`OpenClawMigrate: discovered ${extensions.length} extension(s)`);
  }
  let merged = cfg;
  if (ocCfg) {
    merged = mergeConfig(merged, ocCfg, extensions, logger3);
  }
  copySkillFiles(cfg.workspaceDir, logger3);
  return merged;
}
function mergeConfig(cfg, ocCfg, extensions, logger3) {
  const mergedChannels = mergeChannelCredentials(cfg, ocCfg, logger3);
  autoEnableExtensionChannels(mergedChannels, extensions, ocCfg, logger3);
  const mergedMcp = mergeMcpServers(cfg, ocCfg, logger3);
  return { ...cfg, channels: mergedChannels, mcp: mergedMcp };
}
function mergeChannelCredentials(cfg, ocCfg, logger3) {
  const mergedChannels = { ...cfg.channels };
  if (!ocCfg.channels) return mergedChannels;
  const mergedIds = [];
  for (const [channelId, ocEntry] of Object.entries(ocCfg.channels)) {
    const flattened = flattenChannelEntry(ocEntry);
    const existing = mergedChannels[channelId];
    if (existing && typeof existing === "object" && !Array.isArray(existing)) {
      mergedChannels[channelId] = { ...flattened, ...existing };
    } else if (!existing) {
      mergedChannels[channelId] = flattened;
    }
    mergedIds.push(channelId);
  }
  if (mergedIds.length > 0) {
    logger3?.debug(`OpenClawMigrate: merged credentials for [${mergedIds.join(", ")}]`);
  }
  return mergedChannels;
}
function autoEnableExtensionChannels(channels, extensions, ocCfg, logger3) {
  const enabled = new Set(channels.enabled ?? []);
  const newlyEnabled = [];
  for (const ext of extensions) {
    if (!ext.entryPath || enabled.has(ext.id)) continue;
    if (!isExtensionEnabled(ext.id, ocCfg)) continue;
    enabled.add(ext.id);
    newlyEnabled.push(ext.id);
  }
  if (newlyEnabled.length > 0) {
    channels.enabled = [...enabled];
    logger3?.info(`OpenClawMigrate: auto-enabled extension channels [${newlyEnabled.join(", ")}]`);
  }
}
function mergeMcpServers(cfg, ocCfg, logger3) {
  if (!ocCfg.mcp?.servers) return cfg.mcp;
  const existingEndpoints = new Set((cfg.mcp ?? []).map((m) => m.endpoint));
  const newEntries = Object.entries(ocCfg.mcp.servers).filter(([, srv]) => srv.enabled !== false).filter(([, srv]) => {
    const endpoint = srv.url ?? srv.command ?? "";
    return endpoint && !existingEndpoints.has(endpoint);
  }).map(([id, srv]) => ({
    endpoint: srv.url ?? srv.command ?? id,
    transport: srv.transport ?? (srv.command ? "stdio" : "http"),
    command: srv.command,
    args: srv.args
  }));
  if (newEntries.length === 0) return cfg.mcp;
  logger3?.info(`OpenClawMigrate: merged ${newEntries.length} MCP server(s)`);
  return [...cfg.mcp ?? [], ...newEntries];
}
function copySkillFiles(_workspaceDir, logger3) {
  if (!existsSync(OPENCLAW_EXTENSIONS_DIR)) return;
  mkdirSync(NOVACLAW_SKILLS_DIR, { recursive: true });
  let entries;
  try {
    entries = readdirSync(OPENCLAW_EXTENSIONS_DIR);
  } catch {
    return;
  }
  let copied = 0;
  for (const extName of entries) {
    const extDir = join(OPENCLAW_EXTENSIONS_DIR, extName);
    const skillRoot = join(extDir, SKILL_DIR_NAME);
    if (!existsSync(skillRoot)) continue;
    const skillDirs = discoverSkillDirs(skillRoot);
    for (const srcDir of skillDirs) {
      const skillFileName = SKILL_FILES2.find((f) => existsSync(join(srcDir, f)));
      if (!skillFileName) continue;
      const dirBaseName = srcDir === skillRoot ? extName : `${extName}-${srcDir.split("/").pop()}`;
      const destDir = join(NOVACLAW_SKILLS_DIR, dirBaseName);
      if (existsSync(destDir)) continue;
      try {
        mkdirSync(destDir, { recursive: true });
        cpSync(srcDir, destDir, { recursive: true });
        copied++;
      } catch (err) {
        logger3?.debug(`OpenClawMigrate: failed to copy skill from ${srcDir}: ${err}`);
      }
    }
  }
  if (copied > 0) {
    logger3?.info(`OpenClawMigrate: copied ${copied} skill(s) to ${NOVACLAW_SKILLS_DIR}`);
  }
}
function readOpenClawConfig() {
  if (!existsSync(OPENCLAW_CONFIG_PATH)) return null;
  try {
    const raw = JSON.parse(readFileSync(OPENCLAW_CONFIG_PATH, "utf-8"));
    if (typeof raw !== "object" || raw === null) return null;
    return raw;
  } catch {
    return null;
  }
}
function isExtensionEnabled(id, cfg) {
  if (cfg.plugins?.entries?.[id]?.enabled === true) return true;
  const channelEntry = cfg.channels?.[id];
  if (!channelEntry?.accounts) return false;
  return Object.values(channelEntry.accounts).some(
    (acc) => acc.enabled !== false
  );
}
function flattenChannelEntry(entry) {
  const { accounts, ...rest } = entry;
  const defaultAccount = accounts?.default;
  if (!defaultAccount) return { ...rest, accounts };
  const { enabled: _enabled, currentUser: _user, ...credentials } = defaultAccount;
  return { ...credentials, ...rest, accounts };
}
function discoverSkillDirs(skillRoot) {
  const dirs = [];
  try {
    for (const entry of readdirSync(skillRoot)) {
      const candidate = join(skillRoot, entry);
      if (SKILL_FILES2.some((f) => existsSync(join(candidate, f)))) {
        dirs.push(candidate);
      }
    }
  } catch {
  }
  if (SKILL_FILES2.some((f) => existsSync(join(skillRoot, f)))) {
    dirs.push(skillRoot);
  }
  return dirs;
}

// src/component-factory.ts
function createRuntimeComponents(config, logger3) {
  const migrated = migrateOpenClawConfig(config, { logger: logger3 });
  const registries = createRegistries();
  const skillsEngine = new SkillsEngine(migrated);
  const agent = createAgent(migrated, registries, skillsEngine, logger3);
  const protocolBridge = new ProtocolBridge(migrated);
  const memoryEngine = createMemoryEngine(migrated, registries.memoryProvider, agent);
  const sessionManager = new SessionManager(migrated.workspaceDir);
  const hookManager = new HookManager(migrated.logging?.level);
  const messageProcessor = new MessageProcessor({
    config: migrated,
    agent,
    skillsEngine,
    memoryEngine,
    sessionManager,
    hookManager
  });
  const channelHub = new ChannelHub(migrated, {
    channelPluginRegistry: registries.channelPlugin,
    messageProcessor
  });
  const gateway = new NovaClawGateway(migrated, {
    skillsEngine,
    agent,
    channelHub,
    protocolBridge,
    memoryEngine,
    messageProcessor
  });
  return {
    registries,
    gateway,
    skillsEngine,
    agent,
    channelHub,
    protocolBridge,
    memoryEngine,
    messageProcessor,
    hookManager
  };
}
function createRegistries(_config) {
  const provider = new ProviderRegistry();
  const rule = new RuleRegistry();
  const toolProvider = new ToolProviderRegistry();
  const memoryProvider = new MemoryProviderRegistry();
  const channelPlugin = new ChannelPluginRegistry();
  bootstrapFramework({
    providerRegistry: provider,
    ruleRegistry: rule,
    memoryProviderRegistry: memoryProvider,
    channelPluginRegistry: channelPlugin
  });
  return { provider, rule, toolProvider, memoryProvider, channelPlugin };
}
function createAgent(config, registries, skillsEngine, logger3) {
  const isMultiAgent = config.agents?.mode === "multi";
  if (isMultiAgent) {
    return createDirectorAgent(config, registries, skillsEngine, logger3);
  }
  return new AgentRuntime(config, {
    skillsEngine,
    providerRegistry: registries.provider,
    ruleRegistry: registries.rule,
    toolProviderRegistry: registries.toolProvider
  });
}
function createDirectorAgent(config, registries, skillsEngine, logger3) {
  const agentPool = new AgentPool(
    config,
    {
      providerRegistry: registries.provider,
      ruleRegistry: registries.rule,
      toolProviderRegistry: registries.toolProvider,
      skillsEngine
    },
    config.agents?.pool,
    config.agents?.workers
  );
  const directorModelConfig = config.agents?.director?.model ? { ...config, models: { ...config.models, primary: config.agents.director.model } } : config;
  const directorModelManager = new ModelManager(directorModelConfig, {
    providerRegistry: registries.provider
  });
  const directorToolRegistry = new ToolRegistry(config, {
    ruleEngine: registries.rule.getEngine()
  });
  const directorExecutor = new AgentExecutor(
    directorToolRegistry,
    config.logging?.level || "info",
    {
      maxTurns: config.agents?.director?.maxTurns ?? 5,
      toolResultContextMax: config.agent?.toolResultContextMax ?? 16e3
    }
  );
  const fallbackAgent = new AgentRuntime(config, {
    skillsEngine,
    providerRegistry: registries.provider,
    ruleRegistry: registries.rule,
    toolProviderRegistry: registries.toolProvider
  });
  logger3.info("Multi-agent mode enabled (Director-Worker)");
  return new DirectorRuntime(config, {
    modelManager: directorModelManager,
    executor: directorExecutor,
    agentPool,
    ruleRegistry: registries.rule,
    skillsEngine,
    fallbackAgent,
    directResponse: config.agents?.director?.directResponse
  });
}
function createMemoryEngine(config, registry, agent) {
  const llmCall = (sys, usr, max) => agent.internalLLMCall(sys, usr, max);
  const providerId = config.memory?.provider ?? "local";
  const configAsRecord = config;
  const engine = registry.create(providerId, configAsRecord, { llmCall }) ?? registry.create("local", configAsRecord, { llmCall });
  if (!engine) {
    throw createError(
      `Failed to create memory provider '${providerId}' (fallback 'local' also unavailable).`,
      ErrorCodes.INTERNAL_ERROR
    );
  }
  return engine;
}

// src/novaclaw.ts
var NovaClaw = class _NovaClaw extends EventEmitter3 {
  config;
  logger;
  metrics;
  components;
  indexer = null;
  running = false;
  startTime = 0;
  perfInterval = null;
  shutdownHandlers = [];
  constructor(config) {
    super();
    this.config = config || {};
    this.logger = new Logger("NovaClaw", this.config.logging?.level || "info");
    this.metrics = new MetricsCollector();
    this.rebuildComponents();
  }
  static async create(configPath) {
    try {
      const config = await ConfigLoader.load(configPath);
      return new _NovaClaw(config);
    } catch (error) {
      const logger3 = new Logger("NovaClaw");
      logger3.error("Failed to load configuration", error);
      throw createError(
        `Failed to initialize NovaClaw: ${toErrorMessage(error)}`,
        ErrorCodes.CONFIG_LOAD_FAILED,
        { cause: error }
      );
    }
  }
  // ── Lifecycle ────────────────────────────────────────────────────────
  async initialize() {
    const t0 = performance$1.now();
    try {
      this.logger.info("Initializing...");
      this.validateConfig();
      const { skillsEngine, agent, protocolBridge, memoryEngine, channelHub } = this.components;
      await Promise.all([
        skillsEngine.initialize(),
        agent.initialize(),
        protocolBridge.initialize(),
        memoryEngine.initialize()
      ]);
      await channelHub.initialize();
      agent.setProtocolBridge?.(protocolBridge);
      await agent.reinitializeToolRegistry?.();
      await this.components.hookManager.loadFromDirectory(this.config.workspaceDir);
      await this.components.hookManager.trigger("boot");
      this.indexer = new BackgroundIndexer(memoryEngine, this.config, this.logger, (result) => {
        this.emit("system:indexing_complete", result);
      });
      this.indexer.start();
      const elapsed = performance$1.now() - t0;
      this.logger.info(`Initialized (${elapsed.toFixed(0)}ms)`, {
        workspace: this.config.workspaceDir,
        port: this.config.port,
        channels: this.config.channels?.enabled?.length || 0
      });
      this.emit("system:initialized");
    } catch (error) {
      this.logger.error("Initialization failed", error);
      throw error;
    }
  }
  async start() {
    if (this.running) {
      this.logger.warn("Already running");
      return;
    }
    try {
      this.logger.info("Starting...");
      this.startTime = Date.now();
      await this.components.gateway.start();
      this.running = true;
      this.startPerformanceMonitoring();
      const bootTime = Date.now() - this.startTime;
      this.logger.info(`Started (${bootTime}ms)`);
      this.emit("system:started");
    } catch (error) {
      this.logger.error("Start failed", error);
      this.running = false;
      throw error;
    }
  }
  async stop() {
    if (!this.running) {
      this.logger.warn("Not running");
      return;
    }
    try {
      this.logger.info("Stopping...");
      this.running = false;
      if (this.indexer) await this.indexer.cancel();
      if (this.perfInterval) {
        clearInterval(this.perfInterval);
        this.perfInterval = null;
      }
      const { gateway, skillsEngine, agent, channelHub, protocolBridge, memoryEngine } = this.components;
      await gateway.stop();
      await Promise.all([
        skillsEngine.cleanup(),
        agent.cleanup(),
        channelHub.cleanup(),
        protocolBridge.cleanup(),
        memoryEngine.cleanup()
      ]);
      for (const handler of this.shutdownHandlers) {
        try {
          await handler();
        } catch (error) {
          this.logger.error("Shutdown handler error", error);
        }
      }
      await this.components.hookManager.trigger("shutdown");
      const uptime = Date.now() - this.startTime;
      this.logger.info("Stopped", {
        uptime: formatDuration(uptime),
        stats: this.getSystemStats()
      });
      this.emit("system:stopped");
    } catch (error) {
      this.logger.error("Error during shutdown", error);
      throw error;
    }
  }
  async restart() {
    this.logger.info("Restarting...");
    await this.stop();
    await new Promise((resolve5) => setTimeout(resolve5, RESTART_DELAY_MS));
    await this.start();
  }
  async reloadConfig(configPath) {
    this.config = await ConfigLoader.load(configPath);
    await this.reloadComponents();
  }
  // ── Diagnostics ──────────────────────────────────────────────────────
  getSystemStats() {
    const mem = process.memoryUsage();
    const uptime = this.running ? Date.now() - this.startTime : 0;
    const { skillsEngine, agent, channelHub, protocolBridge, memoryEngine } = this.components;
    return {
      system: {
        running: this.running,
        uptime: formatDuration(uptime),
        version: getVersionSync(),
        nodeVersion: process.version,
        platform: process.platform,
        arch: process.arch
      },
      performance: {
        memory: {
          rss: formatBytes(mem.rss),
          heapUsed: formatBytes(mem.heapUsed),
          heapTotal: formatBytes(mem.heapTotal),
          external: formatBytes(mem.external)
        },
        metrics: this.metrics.getMetrics()
      },
      components: {
        gateway: { status: "running" },
        skills: skillsEngine.getStats(),
        agent: agent.getStats(),
        channels: channelHub.getAllChannelStatuses(),
        protocol: protocolBridge.getStats(),
        memory: memoryEngine.getStats()
      }
    };
  }
  getRunningPort() {
    return this.config.port || 3e3;
  }
  // ── Private ──────────────────────────────────────────────────────────
  rebuildComponents() {
    this.components = createRuntimeComponents(this.config, this.logger);
    this.wireEvents();
  }
  wireEvents() {
    const { gateway, channelHub } = this.components;
    gateway.on("message:received", (request) => {
      this.emit("message:received", request);
    });
    gateway.on("message:processed", (request, response) => {
      this.emit("message:processed", request, response);
    });
    channelHub.on("channel:message:routed", (data) => {
      gateway.emit("channel:message", data);
    });
    this.on("message:processed", (_request, response) => {
      const r = response;
      if (r?.success) {
        this.metrics.incrementRequests("success", r.processingTime || 0);
      } else {
        this.metrics.incrementRequests("error", 0);
      }
    });
  }
  async reloadComponents() {
    const wasRunning = this.running;
    const { gateway, skillsEngine, agent, channelHub, protocolBridge, memoryEngine } = this.components;
    if (wasRunning) {
      this.logger.info("Stopping for config reload...");
      await gateway.stop();
      await Promise.all([
        skillsEngine.cleanup(),
        agent.cleanup(),
        channelHub.cleanup(),
        protocolBridge.cleanup(),
        memoryEngine.cleanup()
      ]);
    }
    gateway.removeAllListeners();
    channelHub.removeAllListeners();
    protocolBridge.removeAllListeners();
    this.rebuildComponents();
    if (wasRunning) {
      this.logger.info("Reinitializing after reload...");
      const c = this.components;
      await Promise.all([
        c.skillsEngine.initialize(),
        c.agent.initialize(),
        c.protocolBridge.initialize(),
        c.memoryEngine.initialize()
      ]);
      await c.channelHub.initialize();
      c.agent.setProtocolBridge?.(c.protocolBridge);
      await c.agent.reinitializeToolRegistry?.();
      await c.gateway.start();
    }
  }
  validateConfig() {
    const result = validateNovaClawConfig(this.config);
    for (const d of result.diagnostics) {
      if (d.level === "warning") {
        this.logger.warn(d.message);
      }
    }
    if (!result.valid) {
      const errors = result.diagnostics.filter((d) => d.level === "error").map((d) => d.message).join("; ");
      throw createError(errors, ErrorCodes.CONFIG_INVALID);
    }
  }
  startPerformanceMonitoring() {
    if (!this.config.monitoring?.enabled) return;
    const interval = this.config.monitoring.health?.interval || HEALTH_CHECK_INTERVAL_MS;
    this.perfInterval = setInterval(() => {
      try {
        const stats = this.getSystemStats();
        this.emit("performance:stats", stats);
        const rssMB = process.memoryUsage().rss / (1024 * 1024);
        const rssLimitMB = this.config.monitoring?.rssLimitMB ?? DEFAULT_RSS_LIMIT_MB;
        if (rssMB > rssLimitMB) {
          this.logger.warn("High memory usage", {
            rss: formatBytes(process.memoryUsage().rss),
            limitMB: rssLimitMB
          });
        }
      } catch (error) {
        this.logger.error("Performance monitoring error", error);
      }
    }, interval);
  }
};

// src/cli/commands/start.ts
var startCommand = {
  name: "start",
  description: "Start the NovaClaw gateway",
  async execute(params, _logger) {
    const configPath = params.find((p3) => !p3.startsWith("-"));
    const isDaemon = params.includes("--daemon") || params.includes("-d");
    const verbose = params.includes("--verbose") || params.includes("-v");
    if (isDaemon) {
      console.error(warn("Daemon mode is not yet implemented"));
      process.exit(1);
    }
    const authToken = randomBytes(32).toString("hex");
    process.env.NOVACLAW_AUTH_TOKEN = authToken;
    await persistAuthToken(authToken);
    if (verbose) {
      console.log("Configuration:", configPath || "default locations");
    }
    const config = await ConfigLoader.load(configPath);
    const port = config.port ?? 3e3;
    config.security = {
      ...config.security,
      auth: { enabled: true, type: "bearer", token: authToken }
    };
    const novaclaw = new NovaClaw(config);
    await novaclaw.initialize();
    await novaclaw.start();
    await writePidFile(process.pid, port);
    const link = `http://localhost:${port}/chat?token=${authToken}`;
    const model = config.models?.primary || muted("not configured");
    console.log();
    console.log(divider());
    console.log(ok("Gateway ready"));
    console.log();
    console.log(item("Open", url(link)));
    console.log(item("Model", model));
    console.log(item("Token", t.dim(authToken.slice(0, 12) + "\u2026")));
    console.log();
    console.log(divider());
    console.log();
    gracefulShutdown(async () => {
      await novaclaw.stop();
      await removePidFile();
    });
  }
};

// src/cli/commands/stop.ts
var stopCommand = {
  name: "stop",
  description: "Stop the running gateway",
  async execute(_params, logger3) {
    const info = await readPidFile();
    if (!info) {
      console.log(warn("No running NovaClaw instance found"));
      console.log(muted("  PID file not present at ") + t.dim(getPidFilePath()));
      return;
    }
    if (!isProcessAlive(info.pid)) {
      console.log(warn(`Stale PID file (process ${info.pid} is not running)`));
      await removePidFile();
      console.log(muted("  Cleaned up stale PID file"));
      return;
    }
    console.log(muted(`Stopping NovaClaw (PID ${info.pid}, port ${info.port})\u2026`));
    try {
      process.kill(info.pid, "SIGTERM");
    } catch (err) {
      console.error(fail(`Failed to send SIGTERM: ${toErrorMessage(err)}`));
      process.exit(1);
    }
    const deadline = Date.now() + STOP_TIMEOUT_MS;
    while (Date.now() < deadline) {
      await new Promise((r) => setTimeout(r, STOP_POLL_INTERVAL_MS));
      if (!isProcessAlive(info.pid)) {
        await removePidFile();
        console.log(ok("NovaClaw stopped"));
        return;
      }
    }
    console.log(warn(`Process did not exit in ${STOP_TIMEOUT_MS / 1e3}s \u2014 sending SIGKILL`));
    try {
      process.kill(info.pid, "SIGKILL");
    } catch (err) {
      logger3.debug("Failed to send SIGKILL", err);
    }
    await removePidFile();
    console.log(ok("NovaClaw killed"));
  }
};
function createInput(flags) {
  return flags.nonInteractive ? new NonInteractiveInput() : new InteractiveInput();
}
var WizardCancelledError = class extends Error {
  constructor() {
    super("Setup cancelled.");
    this.name = "WizardCancelledError";
  }
};
function guardCancel(value) {
  if (p2.isCancel(value)) {
    p2.cancel("Setup cancelled.");
    throw new WizardCancelledError();
  }
  return value;
}
var InteractiveInput = class {
  interactive = true;
  async ask(question, defaultVal) {
    const result = await p2.text({
      message: question,
      placeholder: defaultVal,
      defaultValue: defaultVal
    });
    return guardCancel(result);
  }
  async confirm(question, defaultYes = true) {
    const result = await p2.confirm({
      message: question,
      initialValue: defaultYes
    });
    return guardCancel(result);
  }
  async select(question, options, defaultIdx = 0) {
    const result = await p2.select({
      message: question,
      options: options.map((o) => ({
        value: o.value,
        label: o.label,
        ...o.hint ? { hint: o.hint } : {}
      })),
      initialValue: options[defaultIdx]?.value ?? options[0]?.value
    });
    return guardCancel(result);
  }
  async secret(question) {
    const result = await p2.password({
      message: question,
      mask: "*"
    });
    return guardCancel(result);
  }
  close() {
  }
};
var NonInteractiveInput = class {
  interactive = false;
  async ask(_question, defaultVal) {
    return defaultVal ?? "";
  }
  async confirm(_question, defaultYes = true) {
    return defaultYes;
  }
  async select(_question, options, defaultIdx = 0) {
    return options[defaultIdx].value;
  }
  async secret(_question) {
    return "";
  }
  close() {
  }
};
function intro2() {
  console.log("");
  p2.intro("NovaClaw Setup");
}
function outro2(msg) {
  p2.outro(msg);
}
function note2(message, title) {
  p2.note(message, title);
}
function log2(msg) {
  p2.log.info(msg);
}
function ok2(msg) {
  p2.log.success(msg);
}
function warn2(msg) {
  p2.log.warn(msg);
}
function fail2(msg) {
  p2.log.error(msg);
}
function step(msg) {
  p2.log.step(msg);
}
function spinner2(label) {
  const s = p2.spinner();
  s.start(label);
  return {
    update(msg) {
      s.message(msg);
    },
    succeed(msg) {
      s.stop(msg);
    },
    fail(msg) {
      s.stop(msg);
    },
    stop() {
      s.stop();
    }
  };
}
function completionBanner(port) {
  const base2 = `http://localhost:${port}`;
  note2(
    [
      `WebChat     ${base2}/chat`,
      `API         ${base2}/api/chat`,
      `Health      ${base2}/health`,
      `WebSocket   ws://localhost:${port}/ws`,
      "",
      "Quick commands:",
      "  novaclaw health        Check service status",
      "  novaclaw chat          Interactive CLI chat",
      "  novaclaw skills list   List loaded skills",
      "",
      "Stop the server:  Ctrl+C"
    ].join("\n"),
    "NovaClaw is ready!"
  );
}

// src/setup/pipeline.ts
var SetupError = class extends Error {
  constructor(message) {
    super(message);
    this.name = "SetupError";
  }
};
var Pipeline = class {
  constructor(steps) {
    this.steps = steps;
  }
  steps;
  async run(initial, input) {
    let ctx = initial;
    const total = this.steps.length;
    for (let i = 0; i < total; i++) {
      const s = this.steps[i];
      step(`Step ${i + 1}/${total}: ${s.name}`);
      const result = await s.execute(ctx, input);
      if (!result.ok) {
        if (result.fatal) {
          fail2(result.error);
          throw new SetupError(result.error);
        }
        warn2(result.error);
        continue;
      }
      ctx = { ...ctx, ...result.context };
    }
    return ctx;
  }
};
function detectPlatform() {
  return {
    os: process.platform,
    arch: process.arch,
    shell: getShellName(),
    homedir: homedir(),
    supportsUnicode: detectUnicodeSupport(),
    supportsColor: detectColorSupport()
  };
}
function getShellName() {
  if (process.platform === "win32") {
    if (process.env.PSModulePath && !process.env.PROMPT) return "powershell";
    return "cmd";
  }
  const shell = process.env.SHELL ?? "";
  const base2 = shell.split("/").pop() ?? "";
  return base2 || "sh";
}
function detectUnicodeSupport() {
  if (process.platform !== "win32") return true;
  if (process.env.WT_SESSION) return true;
  if (process.env.TERM_PROGRAM === "vscode") return true;
  if (process.env.ConEmuPID) return true;
  if (process.env.MSYSTEM || process.env.CYGWIN) return true;
  return false;
}
function detectColorSupport() {
  if (process.env.NO_COLOR) return false;
  if (process.env.FORCE_COLOR) return true;
  if (!process.stdout.isTTY) return false;
  if (process.platform === "win32") {
    return !!(process.env.WT_SESSION || process.env.ConEmuPID || process.env.TERM_PROGRAM);
  }
  return true;
}
function commandExists(cmd2) {
  try {
    const out = execSync(`${cmd2} --version`, {
      encoding: "utf-8",
      stdio: ["pipe", "pipe", "pipe"],
      timeout: 1e4
    }).trim();
    return out.split("\n")[0] ?? out;
  } catch {
    return null;
  }
}
function getNodeVersion() {
  const raw = process.version;
  const m = raw.match(/^v(\d+)\.(\d+)/);
  return {
    major: m ? parseInt(m[1], 10) : 0,
    minor: m ? parseInt(m[2], 10) : 0,
    raw
  };
}
function openBrowser(url2) {
  const cmds = {
    darwin: ["open", url2],
    win32: ["cmd", "/c", "start", "", url2],
    linux: ["xdg-open", url2]
  };
  const args = cmds[process.platform] ?? cmds.linux;
  try {
    execSync(args.map((a) => a.includes(" ") ? `"${a}"` : a).join(" "), {
      stdio: "pipe",
      timeout: 5e3
    });
    return true;
  } catch {
    return false;
  }
}
var CheckEnvironment = class {
  name = "Environment Check";
  async execute(_ctx, _input) {
    const plat = detectPlatform();
    const blocked = !this.checkNode() || !await this.checkPnpm();
    if (blocked) {
      return {
        ok: false,
        error: "Missing required prerequisites. Please install them and re-run setup.",
        fatal: true
      };
    }
    this.checkGit();
    return { ok: true, context: { platform: plat } };
  }
  checkNode() {
    const node = getNodeVersion();
    if (node.major >= MIN_NODE_MAJOR_VERSION) {
      ok2(`Node.js ${node.raw}`);
      return true;
    }
    fail2(`Node.js ${node.raw} is too old \u2014 ${MIN_NODE_MAJOR_VERSION}+ required`);
    log2("Install from https://nodejs.org or use fnm / nvm");
    return false;
  }
  async checkPnpm() {
    let ver = commandExists("pnpm");
    if (ver) {
      ok2(`pnpm ${ver}`);
      return true;
    }
    log2("pnpm not found \u2014 attempting auto-install...");
    ver = await this.autoInstallPnpm();
    if (ver) {
      ok2(`pnpm ${ver} (auto-installed)`);
      return true;
    }
    fail2("Could not install pnpm automatically");
    log2("Install manually: npm install -g pnpm");
    return false;
  }
  checkGit() {
    const ver = commandExists("git");
    if (ver) ok2(`Git ${ver}`);
  }
  async autoInstallPnpm() {
    const s = spinner2("Installing pnpm...");
    try {
      execSync("corepack enable", { stdio: "pipe", timeout: 3e4 });
      execSync("corepack prepare pnpm@latest --activate", {
        stdio: "pipe",
        timeout: 6e4
      });
      const ver = commandExists("pnpm");
      if (ver) {
        s.succeed("pnpm installed via corepack");
        return ver;
      }
    } catch {
    }
    try {
      s.update("Installing pnpm via npm...");
      execSync("npm install -g pnpm", { stdio: "pipe", timeout: 6e4 });
      const ver = commandExists("pnpm");
      if (ver) {
        s.succeed("pnpm installed via npm");
        return ver;
      }
    } catch {
    }
    s.fail("pnpm auto-install failed");
    return null;
  }
};

// src/setup/steps/configure.ts
var PROFILE_OPTIONS = [
  { value: "minimal", label: "Minimal", hint: "core only, no sandbox/rate-limit/memory" },
  { value: "standard", label: "Standard", hint: "recommended \u2014 includes RAG memory" },
  { value: "full", label: "Full", hint: "all features, debug logging" }
];
var ConfigureProfile = class {
  constructor(profileOverride) {
    this.profileOverride = profileOverride;
  }
  profileOverride;
  name = "Configuration";
  async execute(_ctx, input) {
    const profile = this.resolveProfile(this.profileOverride) ?? await input.select("Deployment profile", PROFILE_OPTIONS, 1);
    const features = deriveFeatures(profile);
    ok2(`Profile: ${profile} | Memory: ${features.memory ? "on" : "off"}`);
    return {
      ok: true,
      context: { profile, features }
    };
  }
  resolveProfile(raw) {
    if (!raw) return void 0;
    const valid = ["minimal", "standard", "full"];
    return valid.includes(raw) ? raw : void 0;
  }
};
function deriveFeatures(profile) {
  return {
    memory: profile !== "minimal",
    openBrowser: true
  };
}

// src/setup/config-builder.ts
function buildConfig(ctx) {
  const base2 = ConfigLoader.getDefaultConfig();
  return {
    ...base2,
    port: ctx.port,
    models: {
      ...base2.models,
      primary: ctx.primaryModel,
      fallback: ctx.fallbackModel,
      providers: buildProviderRefs(ctx)
    },
    skills: {
      ...base2.skills,
      dirs: ["./skills/workspace", "./skills/managed", "./skills/bundled"],
      include: ["**/*.md"],
      exclude: ["**/drafts/**"]
    },
    tools: {
      ...base2.tools,
      policy: ctx.profile === "minimal" ? "minimal" : "balanced",
      sandbox: {
        ...base2.tools.sandbox,
        enabled: ctx.profile !== "minimal"
      }
    },
    memory: {
      ...base2.memory,
      enabled: ctx.features.memory,
      indexConversations: ctx.features.memory,
      indexWorkspace: ctx.features.memory
    },
    channels: {
      ...base2.channels,
      enabled: ["webchat", "cli"]
    },
    security: {
      ...base2.security,
      rateLimit: {
        ...base2.security.rateLimit,
        enabled: ctx.profile !== "minimal"
      }
    },
    logging: {
      ...base2.logging,
      level: ctx.profile === "full" ? "debug" : "info",
      format: "pretty"
    },
    monitoring: {
      ...base2.monitoring,
      enabled: ctx.profile !== "minimal"
    }
  };
}
function buildEnvVars(ctx) {
  const vars = {};
  for (const [name, p3] of Object.entries(ctx.providers)) {
    vars[`${name.toUpperCase()}_API_KEY`] = p3.apiKey;
  }
  vars.NODE_ENV = "production";
  return vars;
}
function buildProviderRefs(ctx) {
  const refs = {};
  for (const [name, p3] of Object.entries(ctx.providers)) {
    const entry = {
      apiKey: `\${${name.toUpperCase()}_API_KEY}`
    };
    if (p3.baseUrl) entry.baseUrl = p3.baseUrl;
    refs[name] = entry;
  }
  return refs;
}
var ConfigWriter = class {
  constructor(input) {
    this.input = input;
  }
  input;
  async write(ctx, config, envVars) {
    this.scaffoldDirectories(ctx.projectRoot);
    const configFullPath = resolve(ctx.projectRoot, ctx.configPath);
    await this.writeYaml(configFullPath, config);
    await this.syncGlobalConfig(config);
    if (Object.keys(envVars).length > 0) {
      await this.writeEnv(ctx.projectRoot, envVars);
    }
  }
  // ── Directory Scaffolding ───────────────────────────────────────────
  scaffoldDirectories(projectRoot) {
    const projectDirs = [
      "workspace",
      "skills/workspace",
      "skills/managed",
      "skills/bundled",
      "logs"
    ];
    for (const dir of projectDirs) {
      const full = join(projectRoot, dir);
      if (!existsSync(full)) mkdirSync(full, { recursive: true });
    }
    for (const sub of ["workspace", "memory"]) {
      const full = join(NOVACLAW_HOME, sub);
      if (!existsSync(full)) mkdirSync(full, { recursive: true });
    }
    ok2("Directories created");
  }
  // ── YAML Config ─────────────────────────────────────────────────────
  async writeYaml(path4, config) {
    const name = basename(path4);
    const yaml = ConfigLoader.serializeToYaml(config);
    if (existsSync(path4) && !this.isDefaultConfig(path4)) {
      const overwrite = await this.input.confirm(
        `${name} already exists. Overwrite?`,
        false
      );
      if (!overwrite) {
        log2(`Keeping existing ${name}`);
        return;
      }
    }
    writeFileSync(path4, yaml, "utf-8");
    ok2(`${name} written`);
  }
  isDefaultConfig(path4) {
    try {
      const existing = readFileSync(path4, "utf-8").trim();
      const defaultYaml = ConfigLoader.serializeToYaml(
        ConfigLoader.getDefaultConfig()
      ).trim();
      return existing === defaultYaml;
    } catch {
      return false;
    }
  }
  // ── Global Config Sync ──────────────────────────────────────────────
  async syncGlobalConfig(config) {
    const globalPath = await ConfigLoader.scaffoldGlobalConfig(config);
    ok2(`Global config synced \u2192 ${globalPath}`);
  }
  // ── .env File ───────────────────────────────────────────────────────
  async writeEnv(projectRoot, envVars) {
    const envPath = join(projectRoot, ".env");
    const content = formatEnvFile(envVars);
    if (existsSync(envPath)) {
      const overwrite = await this.input.confirm(
        ".env already exists. Overwrite?",
        false
      );
      if (!overwrite) {
        log2("Keeping existing .env");
        return;
      }
    }
    writeFileSync(envPath, content, "utf-8");
    ok2(".env written");
  }
};
function formatEnvFile(vars) {
  const lines = [
    "# NovaClaw Environment Variables",
    "# Generated by setup wizard",
    ""
  ];
  for (const [key, value] of Object.entries(vars)) {
    if (key === "NODE_ENV") continue;
    lines.push(`${key}=${value}`);
  }
  lines.push("");
  lines.push("NODE_ENV=production");
  lines.push("");
  return lines.join("\n");
}

// src/setup/steps/finalize.ts
var Finalize = class {
  constructor(flags) {
    this.flags = flags;
  }
  flags;
  name = "Finalize";
  async execute(ctx, input) {
    const config = buildConfig(ctx);
    const envVars = buildEnvVars(ctx);
    const writer = new ConfigWriter(input);
    await writer.write(ctx, config, envVars);
    if (this.flags.skipBuild && this.flags.skipStart) {
      ok2("Skipped build & start");
      return { ok: true, context: {} };
    }
    await this.buildIfNeeded(ctx);
    if (!this.flags.skipStart) {
      await this.launch(ctx);
    }
    return { ok: true, context: {} };
  }
  async buildIfNeeded(ctx) {
    if (!isDevEnvironment(ctx.projectRoot)) {
      ok2("Pre-built package \u2014 skipping build");
      return;
    }
    if (!existsSync(join(ctx.projectRoot, "node_modules"))) {
      const s = spinner2("Installing dependencies...");
      try {
        execSync("pnpm install", {
          cwd: ctx.projectRoot,
          stdio: "pipe",
          timeout: 12e4
        });
        s.succeed("Dependencies installed");
      } catch {
        s.fail("Dependency installation failed");
        log2("Run `pnpm install` manually to see full errors.");
        return;
      }
    } else {
      ok2("Dependencies already installed");
    }
    if (!this.flags.skipBuild) {
      const s = spinner2("Building project...");
      try {
        execSync("pnpm run build", {
          cwd: ctx.projectRoot,
          stdio: "pipe",
          timeout: 6e4
        });
        s.succeed("Build successful");
      } catch {
        s.fail("Build failed");
        log2("Run `pnpm run build` manually to see full errors.");
      }
    }
  }
  async launch(ctx) {
    const envVars = buildEnvVars(ctx);
    Object.assign(process.env, envVars);
    if (!process.env.NODE_ENV) process.env.NODE_ENV = "production";
    const s = spinner2("Starting NovaClaw...");
    try {
      const novaclaw = await NovaClaw.create(ctx.configPath);
      await novaclaw.initialize();
      await novaclaw.start();
      s.succeed(`NovaClaw running on port ${ctx.port}`);
      if (ctx.features.openBrowser) {
        const url2 = `http://localhost:${ctx.port}/chat`;
        if (openBrowser(url2)) {
          log2(`Opened ${url2}`);
        } else {
          log2(`Open ${url2} in your browser`);
        }
      }
      gracefulShutdown(() => novaclaw.stop());
    } catch (err) {
      s.fail("Failed to start NovaClaw");
      fail2(`Error: ${toErrorMessage(err)}`);
      log2("Try running `novaclaw start` manually.");
    }
  }
};
function isDevEnvironment(dir) {
  return existsSync(join(dir, "package.json")) && existsSync(join(dir, "src", "index.ts")) && existsSync(join(dir, "tsup.config.ts"));
}

// src/setup/presets.ts
var PROVIDER_PRESETS = {
  openai: {
    label: "OpenAI (GPT-4o, o3-mini, etc.)",
    models: ["openai/gpt-4o", "openai/gpt-4o-mini", "openai/o3-mini"],
    envKey: "OPENAI_API_KEY"
  },
  anthropic: {
    label: "Anthropic (Claude 4 Sonnet, etc.)",
    models: ["anthropic/claude-sonnet-4-20250514", "anthropic/claude-3.5-haiku"],
    envKey: "ANTHROPIC_API_KEY"
  },
  gemini: {
    label: "Google (Gemini 2.5 Pro, etc.)",
    models: ["gemini/gemini-2.5-pro", "gemini/gemini-2.0-flash"],
    envKey: "GEMINI_API_KEY"
  },
  deepseek: {
    label: "DeepSeek (DeepSeek V3, R1, etc.)",
    models: ["deepseek/deepseek-chat", "deepseek/deepseek-reasoner"],
    baseUrl: "https://api.deepseek.com",
    envKey: "DEEPSEEK_API_KEY"
  },
  openrouter: {
    label: "OpenRouter (multi-model gateway)",
    models: ["openrouter/anthropic/claude-sonnet-4-20250514", "openrouter/openai/gpt-4o"],
    baseUrl: "https://openrouter.ai/api/v1",
    envKey: "OPENROUTER_API_KEY"
  },
  custom: {
    label: "Custom OpenAI-compatible endpoint (Ollama, vLLM, etc.)",
    models: [],
    envKey: "CUSTOM_API_KEY"
  }
};

// src/setup/steps/select-provider.ts
var SelectProvider = class {
  name = "AI Provider";
  async execute(ctx, input) {
    const envPath = join(ctx.projectRoot, ".env");
    const existingKeys = detectExistingKeys(envPath);
    const selection = !input.interactive ? autoDetect(existingKeys) : await interactiveSelect(input, existingKeys);
    return {
      ok: true,
      context: {
        providers: selection.providers,
        primaryModel: selection.primaryModel,
        fallbackModel: selection.fallbackModel
      }
    };
  }
};
function detectExistingKeys(envPath) {
  const found = {};
  if (existsSync(envPath)) {
    const content = readFileSync(envPath, "utf-8");
    for (const line of content.split("\n")) {
      const match = line.match(/^([A-Z_]+)=(.+)$/);
      if (match?.[1] && match[2]) found[match[1]] = match[2];
    }
  }
  for (const preset of Object.values(PROVIDER_PRESETS)) {
    const val = process.env[preset.envKey];
    if (val && !found[preset.envKey]) found[preset.envKey] = val;
  }
  return found;
}
function autoDetect(keys) {
  const providers = {};
  let primaryModel = "";
  let fallbackModel = "";
  for (const [id, preset] of Object.entries(PROVIDER_PRESETS)) {
    const key = keys[preset.envKey];
    if (!key || key.includes("_here") || key.length <= 8) continue;
    providers[id] = { apiKey: key, baseUrl: preset.baseUrl };
    if (!primaryModel && preset.models[0]) {
      primaryModel = preset.models[0];
      if (preset.models[1]) fallbackModel = preset.models[1];
    }
  }
  if (Object.keys(providers).length > 0) {
    ok2(`Auto-detected ${Object.keys(providers).length} provider(s)`);
    ok2(`Primary model: ${primaryModel}`);
  } else {
    warn2("No API keys found in environment. Configure providers later.");
  }
  return { providers, primaryModel, fallbackModel };
}
async function interactiveSelect(input, existingKeys) {
  const configured = {};
  let primaryModel = "";
  let fallbackModel = "";
  const entries = Object.entries(PROVIDER_PRESETS);
  let done = false;
  while (!done) {
    const options = entries.map(
      ([id, p3]) => ({
        value: id,
        label: p3.label,
        hint: configured[id] ? "configured" : void 0
      })
    );
    options.push({
      value: "skip",
      label: "Skip \u2014 configure later via web UI",
      hint: Object.keys(configured).length > 0 ? "done adding" : void 0
    });
    const choice = await input.select(
      "Select AI provider",
      options
    );
    if (choice === "skip") {
      done = true;
      continue;
    }
    const providerId = choice;
    const preset = PROVIDER_PRESETS[providerId];
    const existingKey = existingKeys[preset.envKey];
    let apiKey;
    if (existingKey && !existingKey.includes("_here") && existingKey.length > 8) {
      const useExisting = await input.confirm(
        `Found existing ${preset.envKey}. Use it?`
      );
      apiKey = useExisting ? existingKey : await input.secret(`Enter ${preset.envKey}`);
    } else {
      apiKey = await input.secret(`Enter ${preset.envKey}`);
    }
    let baseUrl = preset.baseUrl;
    if (providerId === "custom") {
      baseUrl = await input.ask("API base URL", "http://localhost:11434/v1");
    }
    if (apiKey) {
      configured[providerId] = { apiKey, baseUrl };
      ok2(`${preset.label} configured`);
      if (preset.models.length > 0 && !primaryModel) {
        primaryModel = preset.models[0];
        if (preset.models[1]) fallbackModel = preset.models[1];
      } else if (providerId === "custom") {
        const modelName = await input.ask(
          "Model name (e.g. llama3, mistral)",
          "custom/llama3"
        );
        if (!primaryModel) primaryModel = modelName;
      }
    } else {
      warn2("No API key provided \u2014 skipping this provider");
    }
  }
  if (Object.keys(configured).length === 0) {
    note2(
      "You can configure providers later via:\n  POST /api/config  or  the WebChat settings page",
      "No provider configured"
    );
  } else {
    ok2(`Primary model: ${primaryModel}`);
    if (fallbackModel) ok2(`Fallback: ${fallbackModel}`);
  }
  return { providers: configured, primaryModel, fallbackModel };
}

// src/setup/index.ts
async function runSetupWizard(flags) {
  const input = createInput(flags);
  intro2();
  const pipeline = new Pipeline([
    new CheckEnvironment(),
    new SelectProvider(),
    new ConfigureProfile(flags.profile),
    new Finalize(flags)
  ]);
  const initial = {
    projectRoot: process.cwd(),
    configPath: flags.configPath || "novaclaw.yml",
    platform: detectPlatform(),
    providers: {},
    primaryModel: "",
    fallbackModel: "",
    profile: "standard",
    port: 3e3,
    features: { memory: true, openBrowser: true }
  };
  try {
    const ctx = await pipeline.run(initial, input);
    completionBanner(ctx.port);
    outro2("Setup complete.");
  } catch (err) {
    if (err instanceof WizardCancelledError) return;
    throw err;
  } finally {
    input.close();
  }
}

// src/cli/commands/setup.ts
var setupCommand = {
  name: "setup",
  description: "Interactive setup wizard",
  async execute(params, _logger) {
    const nonInteractive = params.includes("--yes") || params.includes("-y");
    const profile = params.includes("--profile") ? params[params.indexOf("--profile") + 1] : void 0;
    const skipBuild = params.includes("--skip-build");
    const skipStart = params.includes("--skip-start");
    const configPath = params.find((p3) => !p3.startsWith("-"));
    await runSetupWizard({
      nonInteractive,
      profile,
      configPath,
      skipBuild,
      skipStart
    });
  }
};
var doctorCommand = {
  name: "doctor",
  description: "Verify environment & config health",
  async execute(_params, logger3) {
    const checks = [];
    const nodeVer = process.versions.node;
    const [major] = nodeVer.split(".").map(Number);
    checks.push({
      label: "Node.js",
      pass: major >= MIN_NODE_MAJOR_VERSION,
      detail: `v${nodeVer}${major < MIN_NODE_MAJOR_VERSION ? ` (v${MIN_NODE_MAJOR_VERSION}+ required)` : ""}`
    });
    let pnpmVer = "";
    try {
      const { execSync: execSync4 } = await import('child_process');
      pnpmVer = execSync4("pnpm --version", { encoding: "utf-8" }).trim();
      checks.push({ label: "pnpm", pass: true, detail: `v${pnpmVer}` });
    } catch {
      checks.push({ label: "pnpm", pass: false, detail: "not found" });
    }
    let gitVer = "";
    try {
      const { execSync: execSync4 } = await import('child_process');
      gitVer = execSync4("git --version", { encoding: "utf-8" }).trim().replace("git version ", "");
      checks.push({ label: "git", pass: true, detail: `v${gitVer}` });
    } catch {
      checks.push({ label: "git", pass: false, detail: "not found" });
    }
    checks.push({
      label: "Data directory",
      pass: existsSync(NOVACLAW_HOME),
      detail: NOVACLAW_HOME
    });
    checks.push({
      label: "Global config",
      pass: existsSync(NOVACLAW_CONFIG_PATH),
      detail: existsSync(NOVACLAW_CONFIG_PATH) ? NOVACLAW_CONFIG_PATH : "missing \u2014 run novaclaw setup"
    });
    let configValid = false;
    try {
      await ConfigLoader.load();
      configValid = true;
    } catch (err) {
      logger3.debug("Config validation failed", err);
    }
    checks.push({
      label: "Config valid",
      pass: configValid,
      detail: configValid ? "OK" : "failed to parse"
    });
    const hasOverrides = existsSync(NOVACLAW_OVERRIDES_PATH);
    checks.push({
      label: "Overrides",
      pass: true,
      detail: hasOverrides ? "found" : "none (using defaults)"
    });
    const memMb = Math.round(totalmem() / 1024 / 1024);
    checks.push({
      label: "System memory",
      pass: memMb >= MIN_SYSTEM_MEMORY_MB,
      detail: `${memMb} MB`
    });
    console.log();
    console.log(section("  System Doctor"));
    console.log();
    const allOk = checks.every((c) => c.pass);
    for (const c of checks) {
      const icon = c.pass ? t.success("\u2714") : t.error("\u2716");
      console.log(`  ${icon} ${t.bold(c.label.padEnd(18))} ${c.detail}`);
    }
    console.log();
    console.log(allOk ? ok("All checks passed") : warn("Some checks failed \u2014 see above"));
    console.log();
  }
};

// src/cli/commands/config.ts
var configCommand = {
  name: "config",
  description: "Configuration management (validate | show | template)",
  async execute(params, _logger) {
    const [action, target] = params;
    switch (action) {
      case "validate":
        return validateConfig(target);
      case "show":
        return showConfig(target);
      case "template":
        return generateConfigTemplate();
      default:
        console.error(fail(`Unknown config action. Use: ${cmd("validate")}, ${cmd("show")}, or ${cmd("template")}`));
        process.exit(1);
    }
  }
};
async function validateConfig(configPath) {
  const config = await ConfigLoader.load(configPath);
  const result = validateNovaClawConfig(config);
  for (const d of result.diagnostics) {
    if (d.level === "warning") {
      console.log(`  ${t.warn("\u26A0")} ${d.message}`);
    }
  }
  if (!result.valid) {
    console.error(fail("Configuration validation failed"));
    for (const d of result.diagnostics) {
      if (d.level === "error") {
        console.error(`  ${t.error("\u25B8")} ${d.message}`);
      }
    }
    process.exit(1);
  }
  console.log(ok("Configuration is valid"));
  console.log(item("Workspace", config.workspaceDir ?? ""));
  console.log(item("Port", String(config.port || 3e3)));
  console.log(item("Primary Model", config.models?.primary ?? muted("(not set)")));
}
async function showConfig(configPath) {
  const config = await ConfigLoader.load(configPath);
  console.log(section("Current Configuration"));
  console.log();
  console.log(ConfigLoader.serializeToYaml(config));
}
function generateConfigTemplate() {
  const template = `# NovaClaw Configuration Template
# Copy this to novaclaw.yml and customize as needed

port: 3000
bind: "loopback"
workspaceDir: "~/.novaclaw/workspace"

models:
  primary: "anthropic/claude-3.5-sonnet"
  fallback: "openai/gpt-4"
  providers:
    anthropic:
      apiKey: "\${ANTHROPIC_API_KEY}"
    openai:
      apiKey: "\${OPENAI_API_KEY}"

skills:
  dirs:
    - "./skills/workspace"

tools:
  policy: "balanced"
  sandbox:
    enabled: true
    timeout: 30000

channels:
  enabled:
    - "webchat"
    - "cli"

performance:
  skillsCache:
    maxSize: 100
    ttl: 300
  semanticSearch:
    enabled: true
    threshold: 0.7

security:
  rateLimit:
    enabled: true
    windowMs: 60000
    maxRequests: 100

logging:
  level: "info"
  format: "pretty"

monitoring:
  enabled: true
`;
  console.log(template);
}

// src/cli/commands/health.ts
var healthCommand = {
  name: "health",
  description: "Quick health check",
  async execute(params, _logger) {
    const baseUrl = params[0] || "http://localhost:3000";
    const format = params.includes("--format") ? params[params.indexOf("--format") + 1] : "text";
    const healthUrl = baseUrl.endsWith("/health") ? baseUrl : `${baseUrl}/health`;
    const res = await fetch(healthUrl);
    const data = await res.json();
    if (format === "json") {
      console.log(JSON.stringify(data, null, 2));
      return;
    }
    const status = String(data.status ?? "unknown");
    const statusColor = status === "healthy" ? t.success : t.error;
    console.log(item("Status", statusColor(status)));
    if (typeof data.uptime === "number") {
      console.log(item("Uptime", `${Math.floor(data.uptime / 1e3)}s`));
    }
    const components = data.components;
    if (components) {
      console.log();
      console.log(section("  Components"));
      for (const [name, comp] of Object.entries(components)) {
        const s = comp.status === "healthy" ? t.success(comp.status) : t.warn(comp.status);
        console.log(`    ${t.muted("\u25B8")} ${t.bold(name)}  ${s}`);
      }
    }
  }
};

// src/cli/commands/status.ts
var statusCommand = {
  name: "status",
  description: "Show running instance status",
  async execute(params, _logger) {
    const baseUrl = params[0] || "http://localhost:3000";
    const healthUrl = `${baseUrl.replace(/\/$/, "")}/health`;
    let data;
    try {
      const res = await fetch(healthUrl);
      data = await res.json();
    } catch {
      console.log(fail(`Cannot reach NovaClaw at ${url(baseUrl)}`));
      console.log(muted("  Is the gateway running? Start with: ") + cmd("novaclaw start"));
      process.exit(1);
      return;
    }
    console.log();
    console.log(section("  Instance Status"));
    console.log();
    const status = String(data.status ?? "unknown");
    const statusColor = status === "healthy" ? t.success : t.error;
    console.log(item("Status", statusColor(status)));
    if (typeof data.version === "string") console.log(item("Version", data.version));
    if (typeof data.uptime === "number") {
      const s = Math.floor(data.uptime / 1e3);
      const h = Math.floor(s / 3600);
      const m = Math.floor(s % 3600 / 60);
      console.log(item("Uptime", h > 0 ? `${h}h ${m}m` : `${m}m ${s % 60}s`));
    }
    const components = data.components;
    if (components) {
      console.log();
      console.log(section("  Components"));
      for (const [name, comp] of Object.entries(components)) {
        const s = comp.status === "healthy" ? t.success(comp.status) : t.warn(comp.status);
        console.log(`    ${t.muted("\u25B8")} ${t.bold(name.padEnd(16))} ${s}`);
      }
    }
    const metrics = data.metrics;
    if (metrics) {
      console.log();
      console.log(section("  Metrics"));
      for (const [k, v] of Object.entries(metrics)) {
        console.log(`    ${t.muted("\u25B8")} ${t.bold(k.padEnd(16))} ${String(v)}`);
      }
    }
    console.log();
  }
};

// src/cli/commands/providers.ts
var providersCommand = {
  name: "providers",
  description: "Model provider management (list | test)",
  async execute(params, _logger) {
    const [action, target] = params;
    switch (action) {
      case "test":
        return testProvider(target);
      case "list":
      case void 0:
        return listProviders();
      default:
        console.error(fail(`Unknown providers action. Use: ${cmd("list")} or ${cmd("test [name]")}`));
        process.exit(1);
    }
  }
};
async function listProviders() {
  const config = await ConfigLoader.load();
  const providers = config.models?.providers ?? {};
  console.log();
  console.log(section("  Model Providers"));
  console.log();
  if (Object.keys(providers).length === 0) {
    console.log(muted("  No providers configured."));
    console.log(muted(`  Run ${cmd("novaclaw setup")} to add one.`));
    console.log();
    return;
  }
  const primary = config.models?.primary ?? "";
  const fallback = config.models?.fallback ?? "";
  for (const [name, prov] of Object.entries(providers)) {
    const hasKey = prov.apiKey && prov.apiKey !== "";
    const badge = [];
    if (primary.startsWith(name + "/")) badge.push(t.success("primary"));
    if (fallback.startsWith(name + "/")) badge.push(t.info("fallback"));
    const keyStatus = hasKey ? t.success("configured") : t.warn("no key");
    const line = `${t.bold(name.padEnd(16))} ${keyStatus}${badge.length ? "  " + badge.join(" ") : ""}`;
    console.log(`  ${t.muted("\u25B8")} ${line}`);
    if (prov.baseUrl) {
      console.log(`    ${t.dim("base: " + String(prov.baseUrl))}`);
    }
  }
  console.log();
}
async function testProvider(name) {
  const config = await ConfigLoader.load();
  const providers = config.models?.providers ?? {};
  const targets = name ? [name] : Object.keys(providers);
  if (targets.length === 0) {
    console.log(muted("No providers configured."));
    return;
  }
  console.log();
  console.log(section("  Provider Connectivity"));
  console.log();
  for (const provName of targets) {
    const prov = providers[provName];
    if (!prov) {
      console.log(`  ${t.error("\u2716")} ${t.bold(provName)}  not configured`);
      continue;
    }
    const hasKey = prov.apiKey && prov.apiKey !== "";
    if (!hasKey) {
      console.log(`  ${t.warn("\u26A0")} ${t.bold(provName.padEnd(16))} no API key`);
      continue;
    }
    const baseUrl = prov.baseUrl;
    let testUrl = "";
    const headers = {};
    switch (provName) {
      case "openai":
        testUrl = (baseUrl || "https://api.openai.com") + "/v1/models";
        headers["Authorization"] = `Bearer ${prov.apiKey}`;
        break;
      case "anthropic":
        testUrl = (baseUrl || "https://api.anthropic.com") + "/v1/messages";
        headers["x-api-key"] = prov.apiKey;
        headers["anthropic-version"] = "2023-06-01";
        break;
      case "groq":
        testUrl = (baseUrl || "https://api.groq.com") + "/openai/v1/models";
        headers["Authorization"] = `Bearer ${prov.apiKey}`;
        break;
      default:
        if (baseUrl) {
          testUrl = baseUrl.replace(/\/$/, "") + "/v1/models";
          headers["Authorization"] = `Bearer ${prov.apiKey}`;
        } else {
          console.log(`  ${t.warn("\u26A0")} ${t.bold(provName.padEnd(16))} no test endpoint known`);
          continue;
        }
    }
    try {
      const res = await fetch(testUrl, { method: "GET", headers, signal: AbortSignal.timeout(PROVIDER_TEST_TIMEOUT_MS) });
      if (res.ok || res.status === 405) {
        console.log(`  ${t.success("\u2714")} ${t.bold(provName.padEnd(16))} ${t.success("reachable")} ${t.dim(`(${res.status})`)}`);
      } else {
        const body = await res.text().catch(() => "");
        const short = body.slice(0, 80).replace(/\n/g, " ");
        console.log(`  ${t.error("\u2716")} ${t.bold(provName.padEnd(16))} HTTP ${res.status} ${t.dim(short)}`);
      }
    } catch (err) {
      console.log(`  ${t.error("\u2716")} ${t.bold(provName.padEnd(16))} ${t.error(toErrorMessage(err))}`);
    }
  }
  console.log();
}

// src/cli/commands/skills.ts
var skillsCommand = {
  name: "skills",
  description: "Skills management (list | validate)",
  async execute(params, _logger) {
    const [action] = params;
    switch (action) {
      case "list": {
        const config = await ConfigLoader.load();
        const engine = new SkillsEngine(config);
        await engine.initialize();
        const names = engine.listSkillIds();
        if (names.length === 0) {
          console.log(muted("No skills loaded."));
        } else {
          console.log(ok(`${t.bold(String(names.length))} skills loaded`));
          for (const name of names) console.log(`  ${t.muted("\u25B8")} ${name}`);
        }
        await engine.cleanup();
        break;
      }
      case "validate": {
        const config = await ConfigLoader.load();
        const engine = new SkillsEngine(config);
        try {
          await engine.initialize();
          const stats = engine.getStats();
          console.log(ok(`Validation passed \u2014 ${t.bold(String(stats.totalSkills))} skills loaded without errors`));
        } catch (err) {
          console.error(fail(`Validation failed: ${toErrorMessage(err)}`));
          process.exit(1);
        }
        await engine.cleanup();
        break;
      }
      default:
        console.error(fail(`Unknown skills action. Use: ${cmd("list")} or ${cmd("validate")}`));
        process.exit(1);
    }
  }
};
var chatCommand = {
  name: "chat",
  description: "Interactive chat REPL",
  async execute(params, _logger) {
    const chatBaseUrl = params[0] || "http://localhost:3000";
    const chatUrl = `${chatBaseUrl.replace(/\/$/, "")}/api/chat?stream=true`;
    const authToken = await readAuthToken();
    console.log(item("Endpoint", url(chatBaseUrl.replace(/\/$/, "") + "/api/chat")));
    console.log(muted(`  Type ${t.bold('"exit"')} to quit.
`));
    const rl = createInterface({ input: process.stdin, output: process.stdout });
    const DIM = "\x1B[2m";
    const CYAN = "\x1B[36m";
    const RESET = "\x1B[0m";
    const headers = {
      "Content-Type": "application/json",
      "Accept": "text/event-stream"
    };
    if (authToken) headers.Authorization = `Bearer ${authToken}`;
    const prompt = isRich() ? `${t.accent("\u276F")} ` : "You: ";
    const ask = () => {
      rl.question(prompt, async (line) => {
        if (!line || line.trim().toLowerCase() === "exit") {
          rl.close();
          return;
        }
        try {
          const res = await fetch(chatUrl, {
            method: "POST",
            headers,
            body: JSON.stringify({
              sessionKey: "cli-repl",
              message: line.trim()
            })
          });
          if (!res.ok) {
            const body = await res.text();
            console.error(`Error (${res.status}): ${body}`);
            ask();
            return;
          }
          if (res.headers.get("content-type")?.includes("text/event-stream")) {
            await consumeSSE(res, DIM, CYAN, RESET);
          } else {
            const data = await res.json();
            process.stdout.write(`Assistant: ${data.content ?? data.error ?? "(no response)"}
`);
          }
        } catch (err) {
          console.error("Error:", toErrorMessage(err));
        }
        ask();
      });
    };
    ask();
    await new Promise((resolve5) => rl.on("close", resolve5));
  }
};
async function consumeSSE(res, DIM, CYAN, RESET) {
  const reader = res.body?.getReader();
  if (!reader) {
    console.error("No response body");
    return;
  }
  const decoder = new TextDecoder();
  let buf = "";
  let wroteText = false;
  let wroteThinking = false;
  process.stdout.write("Assistant: ");
  for (; ; ) {
    const { done, value } = await reader.read();
    if (done) break;
    buf += decoder.decode(value, { stream: true });
    let nlIdx;
    while ((nlIdx = buf.indexOf("\n")) !== -1) {
      const line = buf.slice(0, nlIdx).trim();
      buf = buf.slice(nlIdx + 1);
      if (!line.startsWith("data: ")) continue;
      const payload = line.slice(6);
      if (payload === "[DONE]") continue;
      let chunk;
      try {
        chunk = JSON.parse(payload);
      } catch {
        continue;
      }
      switch (chunk.type) {
        case "text":
          if (wroteThinking && !wroteText) process.stdout.write(`${RESET}
Assistant: `);
          wroteText = true;
          process.stdout.write(chunk.content ?? "");
          break;
        case "thinking":
          if (!wroteThinking) process.stdout.write(`${DIM}`);
          wroteThinking = true;
          process.stdout.write(chunk.content ?? "");
          break;
        case "tool":
          if (wroteText || wroteThinking) process.stdout.write(RESET + "\n");
          process.stdout.write(`${CYAN}  [tool] ${chunk.tool ?? ""}: ${chunk.status ?? ""}${RESET}
`);
          if (wroteText) process.stdout.write("Assistant: ");
          break;
        case "progress":
          break;
        case "error":
          if (wroteText || wroteThinking) process.stdout.write(RESET + "\n");
          console.error(`Error: ${chunk.error ?? chunk.content ?? "unknown"}`);
          break;
      }
    }
  }
  if (wroteThinking && !wroteText) process.stdout.write(RESET);
  process.stdout.write("\n");
}
var versionCommand = {
  name: "version",
  aliases: ["-v", "--version"],
  description: "Show version info",
  async execute(_params, _logger) {
    const v = await getVersion();
    console.log(`${t.heading("\u25C7 NovaClaw")} ${t.info(`v${v}`)}`);
    console.log(keyVal("  Node.js", process.version));
    console.log(keyVal("  Platform", `${process.platform} ${process.arch}`));
  }
};
var helpCommand = {
  name: "help",
  aliases: ["-h", "--help"],
  description: "Show help message",
  async execute(_params, _logger) {
    const c = cmd;
    const m = muted;
    const h = section;
    const b = t.bold;
    const lines = [
      `  ${m("Usage:")}  ${c("novaclaw")} ${b("<command>")} ${m("[options]")}`,
      "",
      h("  Core"),
      "",
      `    ${c("start")}  ${m("[config]")}       Start the NovaClaw gateway`,
      `      ${m("--daemon, -d")}           Run as a daemon process`,
      `      ${m("--verbose, -v")}          Show verbose output`,
      "",
      `    ${c("stop")}                    Stop the running gateway`,
      "",
      `    ${c("setup")}  ${m("[options]")}       Interactive setup wizard`,
      `      ${m("--yes, -y")}              Non-interactive mode`,
      `      ${m("--profile <p>")}          Deployment profile: minimal | standard | full`,
      `      ${m("--skip-build")}           Skip the build step`,
      `      ${m("--skip-start")}           Skip starting the server`,
      "",
      `    ${c("chat")}   ${m("[url]")}           Interactive chat REPL`,
      "",
      h("  Diagnostics"),
      "",
      `    ${c("doctor")}                  Verify environment & config health`,
      `    ${c("status")} ${m("[url]")}           Show running instance status`,
      `    ${c("health")} ${m("[url]")}           Quick health check`,
      `    ${c("env")}                     Display resolved environment info`,
      "",
      h("  Configuration"),
      "",
      `    ${c("config")} ${b("<action>")}        Configuration management`,
      `      ${m("validate [file]")}        Validate a config file`,
      `      ${m("show [file]")}            Display current config`,
      `      ${m("template")}               Generate a config template`,
      "",
      `    ${c("providers")} ${m("[action]")}     Model provider management`,
      `      ${m("list")}                   List configured providers`,
      `      ${m("test [name]")}            Test provider connectivity`,
      "",
      h("  Tools"),
      "",
      `    ${c("skills")} ${b("<action>")}        Skills management ${m("(list | validate)")}`,
      `    ${c("migrate")} ${m("[options]")}      Migrate from OpenClaw`,
      `    ${c("test")}                    Run system tests`,
      "",
      `    ${c("version")}, ${m("-v")}            Show version info`,
      `    ${c("help")}, ${m("-h")}               Show this help message`,
      "",
      h("  Examples"),
      "",
      `    ${m("$")} ${c("novaclaw setup")}                     ${m("# Interactive one-click deployment")}`,
      `    ${m("$")} ${c("novaclaw start")}                     ${m("# Start with default config")}`,
      `    ${m("$")} ${c("novaclaw stop")}                      ${m("# Gracefully stop the gateway")}`,
      `    ${m("$")} ${c("novaclaw doctor")}                    ${m("# Check system requirements")}`,
      `    ${m("$")} ${c("novaclaw providers test openai")}     ${m("# Test OpenAI connectivity")}`,
      `    ${m("$")} ${c("novaclaw chat")}                      ${m("# Interactive chat REPL")}`,
      "",
      `  ${m("Docs:")} ${url("https://github.com/novaclaw/novaclaw")}`,
      ""
    ];
    console.log(lines.join("\n"));
  }
};
var envCommand = {
  name: "env",
  description: "Display resolved environment info",
  async execute(_params, _logger) {
    const v = await getVersion();
    console.log();
    console.log(section("  Environment"));
    console.log();
    console.log(item("NovaClaw", `v${v}`));
    console.log(item("Node.js", process.version));
    console.log(item("Platform", `${process.platform} ${process.arch}`));
    console.log(item("Hostname", hostname()));
    console.log(item("CPUs", `${cpus().length} \xD7 ${cpus()[0]?.model ?? "unknown"}`));
    console.log(item("Memory", `${Math.round(freemem() / 1024 / 1024)} MB free / ${Math.round(totalmem() / 1024 / 1024)} MB`));
    console.log();
    console.log(section("  Paths"));
    console.log();
    console.log(item("Data dir", NOVACLAW_HOME));
    console.log(item("Config", NOVACLAW_CONFIG_PATH));
    console.log(item("Overrides", NOVACLAW_OVERRIDES_PATH));
    console.log(item("Auth token", NOVACLAW_AUTH_TOKEN_PATH));
    console.log();
    const envVars = [
      "NOVACLAW_AUTH_TOKEN",
      "OPENAI_API_KEY",
      "ANTHROPIC_API_KEY",
      "GOOGLE_API_KEY",
      "DEEPSEEK_API_KEY",
      "GROQ_API_KEY",
      "MISTRAL_API_KEY",
      "XAI_API_KEY",
      "OPENROUTER_API_KEY"
    ];
    const found = envVars.filter((k) => process.env[k]);
    if (found.length > 0) {
      console.log(section("  Environment Variables"));
      console.log();
      for (const k of found) {
        const val = process.env[k];
        const masked = val.length > 8 ? val.slice(0, 4) + "\u2026" + val.slice(-4) : "***";
        console.log(item(k, t.dim(masked)));
      }
      console.log();
    }
  }
};
var testCommand = {
  name: "test",
  description: "Run system tests",
  async execute(_params, _logger) {
    console.log(muted("Use your package manager to run the test suite:"));
    console.log();
    console.log(item("All tests", cmd("pnpm test")));
    console.log(item("Unit tests", cmd("pnpm test -- --run tests/unit/")));
    console.log(item("Integration tests", cmd("pnpm test -- --run tests/unit/integration/")));
  }
};
var migrateCommand = {
  name: "migrate",
  description: "Migrate from OpenClaw",
  async execute(params, _logger) {
    const isDryRun = params.includes("--dry-run");
    const fromSystem = params.includes("--from") ? params[params.indexOf("--from") + 1] : "openclaw";
    const sourcePath = params.find((p3) => !p3.startsWith("--")) || "~/.openclaw";
    if (fromSystem !== "openclaw") {
      console.error(fail(`Unsupported source system: ${t.bold(String(fromSystem))}`));
      process.exit(1);
    }
    console.log(section("Migration Plan") + muted(` (from ${sourcePath})`));
    console.log();
    console.log(item("Source", String(sourcePath)));
    console.log(item("Dry run", isDryRun ? t.warn("yes") : "no"));
    console.log();
    const steps = [
      "Copy configuration files",
      "Migrate skills directory",
      "Convert channel configurations",
      "Update model provider settings"
    ];
    steps.forEach((s, i) => console.log(`  ${t.muted(`${i + 1}.`)} ${s}`));
    if (isDryRun) {
      console.log();
      console.log(warn("Dry run \u2014 no files will be modified"));
      return;
    }
    console.log();
    console.log(muted("Auto-migration is not yet implemented."));
    console.log(muted("NovaClaw automatically migrates OpenClaw config at startup."));
    console.log(muted(`See: ${url("https://docs.novaclaw.dev/migration")}`));
  }
};

// src/cli.ts
function buildRegistry() {
  const logger3 = new Logger("CLI");
  const registry = new CommandRegistry(logger3);
  registry.registerAll([
    startCommand,
    stopCommand,
    setupCommand,
    versionCommand,
    helpCommand,
    configCommand,
    healthCommand,
    doctorCommand,
    statusCommand,
    envCommand,
    providersCommand,
    migrateCommand,
    skillsCommand,
    testCommand,
    chatCommand
  ]);
  return registry;
}
async function main() {
  const registry = buildRegistry();
  await registry.run(process.argv.slice(2));
}
var isMainCli = false;
try {
  const argv1 = process.argv[1];
  isMainCli = import.meta.url === pathToFileURL(argv1).href;
  if (!isMainCli) {
    isMainCli = import.meta.url === pathToFileURL(realpathSync(argv1)).href;
  }
} catch {
  const url2 = import.meta.url;
  const argv = (process.argv[1] ?? "").replace(/\\/g, "/");
  isMainCli = url2.endsWith("/cli.js") || url2.endsWith("/cli.cjs") || argv.endsWith("/novaclaw") || argv.endsWith("/novaclaw.cmd");
}
if (isMainCli) {
  main().catch((error) => {
    console.error("CLI Error:", error);
    process.exit(1);
  });
}

export { CommandRegistry };
//# sourceMappingURL=cli.js.map
//# sourceMappingURL=cli.js.map