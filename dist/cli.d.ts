/**
 * Structured logger backed by tslog.
 *
 * Caller-location display (file + line) is a native tslog feature,
 * controlled globally via {@link Logger.enableCallerInfo} — typically
 * driven by `config.logging.showCaller` at application startup.
 */
interface ILogger {
    debug(message: string, data?: unknown): void;
    info(message: string, data?: unknown): void;
    warn(message: string, data?: unknown): void;
    error(message: string, error?: unknown): void;
}
declare class Logger implements ILogger {
    private static _showCaller;
    private readonly _log;
    /**
     * Turn caller-location tagging on/off for all Logger instances.
     * Call once at startup; the setting is intentionally global because
     * source-location display is a cross-cutting debugging concern.
     */
    static enableCallerInfo(enabled: boolean): void;
    constructor(component: string, level?: string);
    debug(message: string, data?: unknown): void;
    info(message: string, data?: unknown): void;
    warn(message: string, data?: unknown): void;
    error(message: string, error?: unknown): void;
    /**
     * Keeps the tslog instance in sync with the global showCaller flag.
     * Handles loggers created before {@link enableCallerInfo} is called
     * (e.g. static class-level properties).
     */
    private syncCallerSetting;
}

/**
 * Command interface — every CLI command implements this contract.
 */

interface Command {
    readonly name: string;
    readonly aliases?: string[];
    readonly description: string;
    execute(params: string[], logger: Logger): Promise<void>;
}

/**
 * Command registry — maps command names and aliases to handlers,
 * dispatches execution from CLI args.
 */

declare class CommandRegistry {
    private commands;
    private logger;
    constructor(logger: Logger);
    register(command: Command): void;
    registerAll(commands: Command[]): void;
    run(args: string[]): Promise<void>;
    private emitBanner;
}

export { type Command, CommandRegistry };
