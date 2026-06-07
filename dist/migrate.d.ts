/**
 * NovaClaw Migration Tool
 * 从OpenClaw迁移到NovaClaw的工具
 */
/**
 * 迁移工具主类
 */
declare class MigrationTool {
    private logger;
    migrate(options: {
        fromPath: string;
        toPath?: string;
        dryRun?: boolean;
        verifySkills?: boolean;
    }): Promise<void>;
    /**
     * 验证源路径
     */
    private validateSourcePath;
    /**
     * 创建目标目录结构
     */
    private createTargetStructure;
    /**
     * 迁移配置文件
     */
    private migrateConfiguration;
    /**
     * 迁移Skills
     */
    private migrateSkills;
    /**
     * 迁移工作空间
     */
    private migrateWorkspace;
    /**
     * 迁移渠道配置
     */
    private migrateChannelConfigs;
    /**
     * 查找skill文件
     */
    private findSkillFiles;
    /**
     * 判断是否是skill文件
     */
    private isSkillFile;
    /**
     * 验证skill文件
     */
    private verifySkillFile;
    /**
     * 递归复制目录
     */
    private copyDirectory;
    /**
     * 转换配置格式
     */
    private convertConfig;
    /**
     * 获取默认配置
     */
    private getDefaultConfig;
    /**
     * 生成迁移报告
     */
    private generateMigrationReport;
}

export { MigrationTool };
