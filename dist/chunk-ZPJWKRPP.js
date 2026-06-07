#!/usr/bin/env node
import __module from 'module';
import { homedir } from 'os';
import { join, resolve } from 'path';
import { Logger as Logger$1 } from 'tslog';

__module.createRequire(import.meta.url);

var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/constants/errors.ts
var NovaClawError = class extends Error {
  code;
  details;
  constructor(message, code, details) {
    super(message);
    this.name = "NovaClawError";
    this.code = code;
    this.details = details;
  }
};
var ErrorCodes = {
  CONFIG_INVALID: "CONFIG_INVALID",
  CONFIG_LOAD_FAILED: "CONFIG_LOAD_FAILED",
  INIT_FAILED: "INIT_FAILED",
  PROTOCOL_ERROR: "PROTOCOL_ERROR",
  CHANNEL_NOT_FOUND: "CHANNEL_NOT_FOUND",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  SERVICE_UNAVAILABLE: "SERVICE_UNAVAILABLE",
  AUTH_ERROR: "AUTH_ERROR",
  NOT_FOUND: "NOT_FOUND",
  NOT_IMPLEMENTED: "NOT_IMPLEMENTED",
  INTERNAL_ERROR: "INTERNAL_ERROR",
  // Provider layer
  PROVIDER_UNAVAILABLE: "PROVIDER_UNAVAILABLE",
  PROVIDER_RATE_LIMITED: "PROVIDER_RATE_LIMITED",
  PROVIDER_AUTH_FAILED: "PROVIDER_AUTH_FAILED",
  PROVIDER_MODEL_NOT_FOUND: "PROVIDER_MODEL_NOT_FOUND",
  PROVIDER_TIMEOUT: "PROVIDER_TIMEOUT",
  // Tool layer
  TOOL_EXECUTION_FAILED: "TOOL_EXECUTION_FAILED",
  TOOL_NOT_FOUND: "TOOL_NOT_FOUND",
  TOOL_TIMEOUT: "TOOL_TIMEOUT",
  TOOL_VALIDATION_FAILED: "TOOL_VALIDATION_FAILED",
  // Agent layer
  AGENT_MAX_TURNS: "AGENT_MAX_TURNS",
  AGENT_EXECUTION_FAILED: "AGENT_EXECUTION_FAILED",
  AGENT_FALLBACK_EXHAUSTED: "AGENT_FALLBACK_EXHAUSTED",
  // Session
  SESSION_NOT_FOUND: "SESSION_NOT_FOUND",
  SESSION_EXPIRED: "SESSION_EXPIRED"
};
function createError(message, code, details) {
  return new NovaClawError(message, code, details);
}
function toErrorMessage(err) {
  return err instanceof Error ? err.message : String(err);
}
function toErrorName(err) {
  return err instanceof Error ? err.name : "";
}
var NOVACLAW_HOME = process.env.NOVACLAW_HOME ?? join(homedir(), ".novaclaw");
var NOVACLAW_CONFIG_PATH = join(NOVACLAW_HOME, "config.yml");
var NOVACLAW_OVERRIDES_PATH = join(NOVACLAW_HOME, "overrides.yml");
var NOVACLAW_SKILLS_DIR = process.env.NOVACLAW_SKILLS_DIR ?? join(NOVACLAW_HOME, "skills");
var SKILLS_SUBDIR = "skills";
var NOVACLAW_WORKSPACE_DIR = join(NOVACLAW_HOME, "workspace");
join(NOVACLAW_HOME, "memory");
var NOVACLAW_CACHE_DIR = join(NOVACLAW_HOME, "cache");
var NOVACLAW_EXTENSIONS_DIR = join(NOVACLAW_HOME, "extensions");
var NOVACLAW_KEYFILE_PATH = join(NOVACLAW_HOME, ".keyfile");
var NOVACLAW_AUTH_TOKEN_PATH = join(NOVACLAW_HOME, ".auth-token");
var NOVACLAW_PID_PATH = join(NOVACLAW_HOME, ".pid");
var LEVEL_MAP = {
  debug: 2,
  info: 3,
  warn: 4,
  error: 5
};
var Logger = class _Logger {
  static _showCaller = false;
  _log;
  /**
   * Turn caller-location tagging on/off for all Logger instances.
   * Call once at startup; the setting is intentionally global because
   * source-location display is a cross-cutting debugging concern.
   */
  static enableCallerInfo(enabled) {
    _Logger._showCaller = enabled;
  }
  constructor(component, level = "info") {
    this._log = new Logger$1({
      name: component,
      minLevel: LEVEL_MAP[level] ?? LEVEL_MAP.info,
      hideLogPositionForProduction: !_Logger._showCaller,
      stylePrettyLogs: true
    });
  }
  debug(message, data) {
    this.syncCallerSetting();
    if (data !== void 0) this._log.debug(message, data);
    else this._log.debug(message);
  }
  info(message, data) {
    this.syncCallerSetting();
    if (data !== void 0) this._log.info(message, data);
    else this._log.info(message);
  }
  warn(message, data) {
    this.syncCallerSetting();
    if (data !== void 0) this._log.warn(message, data);
    else this._log.warn(message);
  }
  error(message, error) {
    this.syncCallerSetting();
    if (error !== void 0) this._log.error(message, error);
    else this._log.error(message);
  }
  /**
   * Keeps the tslog instance in sync with the global showCaller flag.
   * Handles loggers created before {@link enableCallerInfo} is called
   * (e.g. static class-level properties).
   */
  syncCallerSetting() {
    this._log.settings.hideLogPositionForProduction = !_Logger._showCaller;
  }
};
function generateId() {
  return crypto.randomUUID();
}
function debounce(fn, ms) {
  let timer;
  return ((...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  });
}
function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = Math.max(0, decimals);
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}
function formatDuration(ms) {
  if (ms < 1e3) return `${ms}ms`;
  if (ms < 6e4) return `${(ms / 1e3).toFixed(1)}s`;
  if (ms < 36e5) return `${(ms / 6e4).toFixed(1)}m`;
  return `${(ms / 36e5).toFixed(1)}h`;
}
function deepMerge(target, source) {
  const result = { ...target };
  for (const key in source) {
    if (!Object.prototype.hasOwnProperty.call(source, key)) continue;
    const src = source[key];
    const dst = result[key];
    if (src === null || src === void 0) {
      result[key] = src;
    } else if (typeof src === "object" && !Array.isArray(src)) {
      result[key] = deepMerge(
        dst && typeof dst === "object" && !Array.isArray(dst) ? dst : {},
        src
      );
    } else {
      result[key] = src;
    }
  }
  return result;
}
function mergeInPlace(target, source) {
  for (const key of Object.keys(source)) {
    const val = source[key];
    if (val != null && typeof val === "object" && !Array.isArray(val)) {
      if (!target[key] || typeof target[key] !== "object" || Array.isArray(target[key])) {
        target[key] = {};
      }
      mergeInPlace(target[key], val);
    } else {
      target[key] = val;
    }
  }
}
function resolveWorkspaceDir(dir) {
  if (!dir?.trim()) return process.cwd();
  const s = dir.trim();
  const expanded = s.startsWith("~") ? join(homedir(), s.slice(1)) : s;
  return resolve(expanded);
}
var PathResolver = class {
  static resolve(path, basePath) {
    if (path.startsWith("~")) return resolve(homedir(), path.slice(1));
    if (path.startsWith("/")) return resolve(path);
    return resolve(basePath || process.cwd(), path);
  }
  static resolveMultiple(paths, basePath) {
    return paths.map((p) => this.resolve(p, basePath));
  }
};

export { ErrorCodes, Logger, NOVACLAW_AUTH_TOKEN_PATH, NOVACLAW_CACHE_DIR, NOVACLAW_CONFIG_PATH, NOVACLAW_EXTENSIONS_DIR, NOVACLAW_HOME, NOVACLAW_KEYFILE_PATH, NOVACLAW_OVERRIDES_PATH, NOVACLAW_PID_PATH, NOVACLAW_SKILLS_DIR, NOVACLAW_WORKSPACE_DIR, PathResolver, SKILLS_SUBDIR, __export, createError, debounce, deepMerge, formatBytes, formatDuration, generateId, mergeInPlace, resolveWorkspaceDir, toErrorMessage, toErrorName };
//# sourceMappingURL=chunk-ZPJWKRPP.js.map
//# sourceMappingURL=chunk-ZPJWKRPP.js.map