#!/usr/bin/env node
import __module from 'module';
import { toErrorMessage, Logger, NOVACLAW_HOME, PathResolver } from './chunk-ZPJWKRPP.js';
import { stat, mkdir, readFile, writeFile, copyFile, readdir } from 'fs/promises';
import { join, dirname, basename } from 'path';
import { pathToFileURL } from 'url';
import { parse, stringify } from 'yaml';

__module.createRequire(import.meta.url);
var MigrationTool = class {
  logger = new Logger("Migration");
  async migrate(options) {
    const { fromPath, toPath = NOVACLAW_HOME, dryRun = false, verifySkills = false } = options;
    this.logger.info(`Starting migration from ${fromPath} to ${toPath}`);
    if (dryRun) {
      this.logger.info("DRY RUN MODE - No files will be modified");
    }
    try {
      const resolvedFromPath = PathResolver.resolve(fromPath);
      await this.validateSourcePath(resolvedFromPath);
      const resolvedToPath = PathResolver.resolve(toPath);
      if (!dryRun) {
        await this.createTargetStructure(resolvedToPath);
      }
      const migrationSteps = [
        () => this.migrateConfiguration(resolvedFromPath, resolvedToPath, dryRun),
        () => this.migrateSkills(resolvedFromPath, resolvedToPath, dryRun, verifySkills),
        () => this.migrateWorkspace(resolvedFromPath, resolvedToPath, dryRun),
        () => this.migrateChannelConfigs(resolvedFromPath, resolvedToPath, dryRun)
      ];
      for (const step of migrationSteps) {
        await step();
      }
      await this.generateMigrationReport(resolvedFromPath, resolvedToPath, dryRun);
      this.logger.info("\u2705 Migration completed successfully!");
    } catch (error) {
      this.logger.error("Migration failed:", error);
      throw error;
    }
  }
  /**
   * 验证源路径
   */
  async validateSourcePath(sourcePath) {
    try {
      const stats = await stat(sourcePath);
      if (!stats.isDirectory()) {
        throw new Error(`Source path is not a directory: ${sourcePath}`);
      }
      const expectedFiles = ["config.yml", "config.yaml"];
      let hasConfig = false;
      for (const file of expectedFiles) {
        try {
          await stat(join(sourcePath, file));
          hasConfig = true;
          break;
        } catch {
        }
      }
      if (!hasConfig) {
        this.logger.warn("No OpenClaw configuration file found, continuing anyway...");
      }
    } catch (error) {
      throw new Error(`Cannot access source path: ${sourcePath}`, { cause: error });
    }
  }
  /**
   * 创建目标目录结构
   */
  async createTargetStructure(targetPath) {
    const directories = [
      targetPath,
      join(targetPath, "workspace"),
      join(targetPath, "skills"),
      join(targetPath, "skills", "workspace"),
      join(targetPath, "skills", "managed"),
      join(targetPath, "skills", "bundled"),
      join(targetPath, "logs"),
      join(targetPath, "cache")
    ];
    for (const dir of directories) {
      try {
        await mkdir(dir, { recursive: true });
        this.logger.debug(`Created directory: ${dir}`);
      } catch (error) {
        if (error.code !== "EEXIST") {
          throw error;
        }
      }
    }
  }
  /**
   * 迁移配置文件
   */
  async migrateConfiguration(sourcePath, targetPath, dryRun) {
    this.logger.info("\u{1F527} Migrating configuration...");
    const configFiles = ["config.yml", "config.yaml", "config.json"];
    let sourceConfig = null;
    let sourceConfigFile = "";
    for (const file of configFiles) {
      try {
        const configPath = join(sourcePath, file);
        const configContent = await readFile(configPath, "utf-8");
        if (file.endsWith(".json")) {
          sourceConfig = JSON.parse(configContent);
        } else {
          sourceConfig = parse(configContent);
        }
        sourceConfigFile = file;
        break;
      } catch {
      }
    }
    if (!sourceConfig) {
      this.logger.warn("No OpenClaw configuration found, creating default NovaClaw configuration");
      sourceConfig = this.getDefaultConfig();
    }
    const novaClawConfig = this.convertConfig(sourceConfig);
    const targetConfigPath = join(targetPath, "novaclaw.yml");
    const configYaml = stringify(novaClawConfig);
    if (!dryRun) {
      await writeFile(targetConfigPath, configYaml, "utf-8");
    }
    this.logger.info(`\u2705 Configuration migrated: ${sourceConfigFile} -> novaclaw.yml`);
  }
  /**
   * 迁移Skills
   */
  async migrateSkills(sourcePath, targetPath, dryRun, verify) {
    this.logger.info("\u{1F4DA} Migrating skills...");
    const sourceSkillsPath = join(sourcePath, "skills");
    const targetSkillsPath = join(targetPath, "skills");
    try {
      await stat(sourceSkillsPath);
    } catch {
      this.logger.warn("No skills directory found in source, skipping skills migration");
      return;
    }
    const skillTypes = [
      { source: "workspace", target: "workspace" },
      { source: "managed", target: "managed" },
      { source: "bundled", target: "bundled" },
      { source: ".", target: "workspace" }
      // 根目录的skills
    ];
    let totalSkills = 0;
    let migratedSkills = 0;
    let errors = 0;
    for (const { source, target } of skillTypes) {
      const sourceDir = source === "." ? sourceSkillsPath : join(sourceSkillsPath, source);
      const targetDir = join(targetSkillsPath, target);
      try {
        await stat(sourceDir);
        const skills = await this.findSkillFiles(sourceDir);
        totalSkills += skills.length;
        for (const skill of skills) {
          try {
            if (verify) {
              await this.verifySkillFile(skill);
            }
            if (!dryRun) {
              const relativePath = skill.replace(sourceDir, "");
              const targetFile = join(targetDir, relativePath);
              await mkdir(dirname(targetFile), { recursive: true });
              await copyFile(skill, targetFile);
            }
            migratedSkills++;
            this.logger.debug(`Migrated skill: ${basename(skill)}`);
          } catch (error) {
            errors++;
            this.logger.warn(`Failed to migrate skill ${basename(skill)}:`, error);
          }
        }
      } catch {
      }
    }
    this.logger.info(`\u2705 Skills migration: ${migratedSkills}/${totalSkills} successful, ${errors} errors`);
  }
  /**
   * 迁移工作空间
   */
  async migrateWorkspace(sourcePath, targetPath, dryRun) {
    this.logger.info("\u{1F4BC} Migrating workspace...");
    const sourceWorkspace = join(sourcePath, "workspace");
    const targetWorkspace = join(targetPath, "workspace");
    try {
      await stat(sourceWorkspace);
      if (!dryRun) {
        await this.copyDirectory(sourceWorkspace, targetWorkspace);
      }
      this.logger.info("\u2705 Workspace migrated successfully");
    } catch {
      this.logger.info("No workspace directory found, creating empty workspace");
    }
  }
  /**
   * 迁移渠道配置
   */
  async migrateChannelConfigs(sourcePath, targetPath, dryRun) {
    this.logger.info("\u{1F4E1} Migrating channel configurations...");
    const sourceChannelsPath = join(sourcePath, "channels");
    try {
      await stat(sourceChannelsPath);
      const files = await readdir(sourceChannelsPath);
      let migratedChannels = 0;
      for (const file of files) {
        if (file.endsWith(".json") || file.endsWith(".yml") || file.endsWith(".yaml")) {
          try {
            const sourceFile = join(sourceChannelsPath, file);
            const targetFile = join(targetPath, "channels", file);
            if (!dryRun) {
              await mkdir(join(targetPath, "channels"), { recursive: true });
              await copyFile(sourceFile, targetFile);
            }
            migratedChannels++;
            this.logger.debug(`Migrated channel config: ${file}`);
          } catch (error) {
            this.logger.warn(`Failed to migrate channel config ${file}:`, error);
          }
        }
      }
      this.logger.info(`\u2705 Channel configurations: ${migratedChannels} files migrated`);
    } catch {
      this.logger.info("No channel configurations found, using defaults");
    }
  }
  /**
   * 查找skill文件
   */
  async findSkillFiles(directory) {
    const skills = [];
    try {
      const entries = await readdir(directory, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = join(directory, entry.name);
        if (entry.isDirectory()) {
          const subSkills = await this.findSkillFiles(fullPath);
          skills.push(...subSkills);
        } else if (entry.isFile() && this.isSkillFile(entry.name)) {
          skills.push(fullPath);
        }
      }
    } catch (error) {
      this.logger.debug(`Cannot read directory ${directory}:`, error);
    }
    return skills;
  }
  /**
   * 判断是否是skill文件
   */
  isSkillFile(filename) {
    const skillExtensions = [".md", ".txt", ".skill"];
    return skillExtensions.some((ext) => filename.toLowerCase().endsWith(ext));
  }
  /**
   * 验证skill文件
   */
  async verifySkillFile(skillPath) {
    try {
      const content = await readFile(skillPath, "utf-8");
      const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
      if (frontmatterMatch && frontmatterMatch[1] !== void 0) {
        try {
          parse(frontmatterMatch[1]);
        } catch (error) {
          throw new Error(`Invalid YAML frontmatter: ${error}`);
        }
      }
      if (content.trim().length === 0) {
        throw new Error("Empty skill file");
      }
    } catch (error) {
      throw new Error(`Skill verification failed: ${error}`);
    }
  }
  /**
   * 递归复制目录
   */
  async copyDirectory(source, target) {
    await mkdir(target, { recursive: true });
    const entries = await readdir(source, { withFileTypes: true });
    for (const entry of entries) {
      const sourcePath = join(source, entry.name);
      const targetPath = join(target, entry.name);
      if (entry.isDirectory()) {
        await this.copyDirectory(sourcePath, targetPath);
      } else {
        await copyFile(sourcePath, targetPath);
      }
    }
  }
  /**
   * 转换配置格式
   */
  convertConfig(openClawConfig) {
    const oc = openClawConfig;
    const novaClawConfig = {
      port: oc.port || 3e3,
      bind: oc.bind || "loopback",
      workspaceDir: oc.workspaceDir || "~/.novaclaw/workspace"
    };
    if (oc.models) {
      novaClawConfig.models = {
        primary: oc.models.primary || oc.model,
        fallback: oc.models.fallback,
        providers: oc.models.providers || {}
      };
    }
    if (oc.skills) {
      novaClawConfig.skills = {
        allowBundled: oc.skills.allowBundled !== false,
        load: {
          extraDirs: oc.skills.load?.extraDirs || []
        },
        priority: oc.skills.priority || {
          workspace: 3,
          managed: 2,
          bundled: 1
        }
      };
    }
    if (oc.tools) {
      novaClawConfig.tools = {
        policy: oc.tools.policy || "balanced",
        sandbox: {
          enabled: oc.tools.sandbox?.enabled !== false,
          docker: oc.tools.sandbox?.docker || false,
          timeout: oc.tools.sandbox?.timeout || 3e4,
          maxMemory: oc.tools.sandbox?.maxMemory || "256MB",
          allowedCommands: oc.tools.sandbox?.allowedCommands || []
        },
        permissions: oc.tools.permissions || {
          fileSystem: { read: true, write: true, execute: false, delete: false },
          network: { http: true, https: true, websocket: true },
          system: { shell: false, process: false }
        }
      };
    }
    if (oc.channels) {
      const chCfg = {
        enabled: oc.channels.enabled || ["webchat", "cli"]
      };
      for (const channel of chCfg.enabled) {
        if (oc.channels[channel]) {
          chCfg[channel] = oc.channels[channel];
        }
      }
      novaClawConfig.channels = chCfg;
    }
    novaClawConfig.performance = {
      skillsCache: {
        maxSize: 100,
        ttl: 300
      },
      semanticSearch: {
        enabled: true,
        threshold: 0.7,
        maxResults: 5
      },
      streaming: {
        enabled: true,
        chunkSize: 256,
        maxConcurrent: 3
      },
      memory: {
        maxHeapSize: "256MB",
        gcInterval: 3e4,
        sessionTimeout: 3e5
      }
    };
    novaClawConfig.security = {
      auth: oc.security?.auth || { enabled: false, type: "none" },
      rateLimit: oc.security?.rateLimit || { enabled: false, windowMs: 6e4, maxRequests: 100 },
      cors: oc.security?.cors || { enabled: true, origins: ["*"], credentials: false }
    };
    novaClawConfig.logging = {
      level: oc.logging?.level || "info",
      format: oc.logging?.format || "pretty"
    };
    novaClawConfig.monitoring = {
      enabled: oc.monitoring?.enabled !== false,
      health: {
        enabled: true,
        path: "/health",
        interval: 3e4
      }
    };
    return novaClawConfig;
  }
  /**
   * 获取默认配置
   */
  getDefaultConfig() {
    return {
      port: 3e3,
      workspaceDir: "~/.novaclaw/workspace",
      models: {
        primary: "anthropic/claude-3.5-sonnet"
      },
      skills: {
        allowBundled: true
      },
      tools: {
        policy: "balanced"
      },
      channels: {
        enabled: ["webchat", "cli"]
      }
    };
  }
  /**
   * 生成迁移报告
   */
  async generateMigrationReport(sourcePath, targetPath, dryRun) {
    const report = {
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      sourcePath,
      targetPath,
      dryRun,
      summary: "Migration completed successfully"
    };
    const reportPath = join(targetPath, "migration-report.json");
    if (!dryRun) {
      await writeFile(reportPath, JSON.stringify(report, null, 2), "utf-8");
      this.logger.info(`\u{1F4CB} Migration report saved: ${reportPath}`);
    } else {
      this.logger.info("\u{1F4CB} Migration report (dry run):", report);
    }
  }
};
async function main() {
  const args = process.argv.slice(2);
  if (args.includes("--help") || args.includes("-h")) {
    console.log(`
NovaClaw Migration Tool

Usage: novaclaw migrate <source> [options]

Arguments:
  <source>              Source OpenClaw installation path

Options:
  --to <path>           Target NovaClaw installation path (default: ~/.novaclaw)
  --dry-run            Show what would be migrated without making changes
  --verify-skills      Verify skill files during migration
  --help, -h           Show this help message

Examples:
  novaclaw migrate ~/.openclaw
  novaclaw migrate ~/.openclaw --to ~/.novaclaw --dry-run
  novaclaw migrate /opt/openclaw --verify-skills

`);
    process.exit(0);
  }
  const sourcePath = args[0];
  if (!sourcePath) {
    console.error("Error: Source path is required");
    console.error("Usage: novaclaw migrate <source> [options]");
    process.exit(1);
  }
  const options = {
    fromPath: sourcePath,
    toPath: args.includes("--to") ? args[args.indexOf("--to") + 1] : void 0,
    dryRun: args.includes("--dry-run"),
    verifySkills: args.includes("--verify-skills")
  };
  const migrationTool = new MigrationTool();
  try {
    await migrationTool.migrate(options);
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", toErrorMessage(error));
    process.exit(1);
  }
}
var _isMainMigrate = false;
try {
  _isMainMigrate = import.meta.url === pathToFileURL(process.argv[1]).href;
} catch {
  _isMainMigrate = import.meta.url.endsWith("migrate") || (process.argv[1] ?? "").replace(/\\/g, "/").endsWith("migrate");
}
if (_isMainMigrate) {
  main().catch(console.error);
}

export { MigrationTool };
//# sourceMappingURL=migrate.js.map
//# sourceMappingURL=migrate.js.map