import { M as MCPServerRequestInit, S as SessionContext, C as ChannelId, a as ChannelCapabilities, b as ChannelCommandAdapter, c as ChannelElevatedAdapter, d as ChannelConfigAdapter, e as ChannelGroupAdapter, f as ChannelMentionAdapter, g as ChannelThreadingAdapter, h as ChannelAgentPromptAdapter, i as ChannelPlugin, j as ChannelMeta, N as NovaClawConfig, k as ChannelRuntimeSnapshot, L as Lifecycle, l as ChannelAccountSnapshot, T as ToolCall, m as ChatTurn, P as PluginChannelRuntime, n as MCPServerEntry, o as StreamChunk, I as ImageContent, A as AgentResponse, H as HookManager, p as MessageResponse, q as CacheInterface, r as ChannelDetailConfig, s as Metrics, t as MessageRequest, u as HealthStatus } from './hook-manager-BEcIg841.js';
export { v as Attachment, w as ChannelAccountConfig, x as ChannelAgentToolFactory, y as ChannelAuthAdapter, z as ChannelConfigSchema, B as ChannelDirectoryAdapter, D as ChannelGatewayAdapter, E as ChannelGatewayContext, F as ChannelGroupContext, G as ChannelHeartbeatAdapter, J as ChannelLogSink, K as ChannelMessageActionAdapter, O as ChannelMessagingAdapter, Q as ChannelOnboardingAdapter, R as ChannelOutboundAdapter, U as ChannelOutboundContext, V as ChannelOutboundPayloadContext, W as ChannelPairingAdapter, X as ChannelPollContext, Y as ChannelPollResult, Z as ChannelResolverAdapter, _ as ChannelSecurityAdapter, $ as ChannelSecurityDmPolicy, a0 as ChannelSetupAdapter, a1 as ChannelStatusAdapter, a2 as ChannelStreamingAdapter, a3 as ChannelsConfig, a4 as ClusterConfig, a5 as ComponentHealth, a6 as LoggingConfig, a7 as MCPConfig, a8 as MemoryConfig, a9 as ModelProviderConfig, aa as ModelsConfig, ab as MonitoringConfig, ac as OutboundDeliveryResult, ad as PerformanceConfig, ae as PermissionsConfig, af as PluginEntry, ag as PluginInstall, ah as PluginInterface, ai as PluginMetadata, aj as PluginsConfig, ak as RuntimeEnv, al as SandboxConfig, am as SecurityConfig, an as SkillsConfig, ao as TokenUsage, ap as ToolExtension, aq as ToolsConfig, ar as UserConfig, as as UserConfigMeta } from './hook-manager-BEcIg841.js';
import { EventEmitter as EventEmitter$1 } from 'node:events';
import 'zod';

interface MCPTool {
    name: string;
    description?: string;
    inputSchema?: Record<string, unknown>;
}
interface MCPCallToolResult {
    content: Array<{
        type: 'text';
        text: string;
    } | {
        type: 'image';
        data: string;
        mimeType: string;
    }>;
    isError?: boolean;
}
interface MCPConnectOptions {
    endpoint: string;
    transport?: 'http' | 'sse' | 'stdio';
    command?: string;
    args?: string[];
    requestInit?: MCPServerRequestInit;
}
interface IMCPConnector {
    readonly id: string;
    connect(options: MCPConnectOptions): Promise<void>;
    disconnect(endpoint: string): Promise<void>;
    listTools(endpoint: string): Promise<MCPTool[]>;
    /** Returns raw result — callers decide how to handle `isError`. */
    callTool(endpoint: string, toolName: string, args: Record<string, unknown>): Promise<MCPCallToolResult>;
    cleanup(): Promise<void>;
}

/**
 * Shared message conversion utilities for LLM providers.
 */
interface ToolCallEntry {
    id: string;
    function: {
        name: string;
        arguments: string;
    };
}
type ProviderMessage = {
    role: 'system';
    content: string;
} | {
    role: 'user';
    content: string | object;
} | {
    role: 'assistant';
    content?: string;
    tool_calls?: ToolCallEntry[];
} | {
    role: 'tool';
    tool_call_id: string;
    content: string;
};

interface LLMProviderConfig {
    apiKey: string;
    baseUrl: string;
    logLevel?: string;
    /** Max time (ms) to wait for the LLM HTTP response headers. Default: 45000. */
    httpTimeoutMs?: number;
    /** Max time (ms) of silence before treating the stream as stalled. Default: 60000. */
    streamStallMs?: number;
}
interface StreamingChunk {
    type: string;
    content?: string;
    error?: string;
    usage?: {
        totalTokens?: number;
        inputTokens?: number;
        outputTokens?: number;
    };
    [key: string]: unknown;
}
interface ChatStreamOptions {
    tools?: Array<{
        type: string;
        function: {
            name: string;
            description?: string;
            parameters?: object;
        };
    }>;
    maxTokens?: number;
    abortSignal?: AbortSignal;
    temperature?: number;
    topP?: number;
    stop?: string | string[];
    frequencyPenalty?: number;
    presencePenalty?: number;
    responseFormat?: {
        type: string;
    };
    enableThinking?: boolean;
}

interface LLMProvider {
    readonly name: string;
    chatStream(model: string, messages: ProviderMessage[], options?: ChatStreamOptions): AsyncGenerator<StreamingChunk>;
    chatComplete(model: string, messages: ProviderMessage[], options?: {
        maxTokens?: number;
        abortSignal?: AbortSignal;
    }): Promise<string | null>;
}
interface LLMProviderFactory {
    create(config: LLMProviderConfig): LLMProvider;
}

interface SkillDefinition {
    id: string;
    filePath: string;
    /** Directory containing the SKILL.md (and optional run.py / requirements.txt). */
    skillDir: string;
    description: string;
    content: string;
    globs: string[];
    alwaysApply: boolean;
    when: {
        channels?: string[];
        platforms?: string[];
    };
    tags: string[];
    priority: number;
    /** Path to an executable script (e.g. run.py) shipped with the skill. */
    runScript?: string;
    /** IDs of child skills (for hierarchical skill packs). */
    childSkills?: string[];
}
interface SkillSearchResult {
    skill: SkillDefinition;
    score: number;
    source: string;
}
interface ISkillProvider {
    readonly id: string;
    version?: string;
    listSkills(): Promise<SkillDefinition[]>;
    resolve(message: string, context: SessionContext, options: {
        maxSkills?: number;
        mentionedFiles?: string[];
    }): Promise<SkillSearchResult[]>;
}

interface ToolExecutionResult {
    success: boolean;
    /** Human-readable output for successful executions (e.g. file content, search results). */
    result?: unknown;
    /** Standard output from command execution. */
    stdout?: string;
    /** Standard error output from command execution. */
    stderr?: string;
    /** Error description when success is false. */
    error?: string;
    [key: string]: unknown;
}
interface Tool {
    readonly name: string;
    readonly description: string;
    readonly parameters: object;
    validate?(args: Record<string, unknown>): string | null;
    execute(args: Record<string, unknown>, context?: SessionContext, abortSignal?: AbortSignal): Promise<ToolExecutionResult>;
}
interface ToolFunctionSchema {
    type: 'function';
    function: {
        name: string;
        description: string;
        parameters?: object;
    };
}
interface ToolDescriptor {
    name: string;
    description: string;
    parameters?: object;
    version?: string;
}
interface ToolDefinition {
    name: string;
    description: string;
    parameters?: Record<string, unknown>;
    implementation: (args: Record<string, unknown>) => Promise<ToolExecutionResult>;
}

/**
 * Channel Facade — lightweight adapter layer for shared code paths.
 *
 * Facade provides channel metadata without triggering eager loading of heavy
 * channel implementations (e.g. discord.js, puppeteer, baileys).
 * Shared code should import from channel-facade.ts rather than the full plugin.
 */

interface ChannelFacade {
    id: ChannelId;
    capabilities: ChannelCapabilities;
    commands?: ChannelCommandAdapter;
    outbound?: {
        textChunkLimit?: number;
    };
    streaming?: {
        blockStreamingCoalesceDefaults?: {
            minChars?: number;
            idleMs?: number;
        };
    };
    elevated?: ChannelElevatedAdapter;
    config?: Pick<ChannelConfigAdapter, 'resolveAllowFrom' | 'formatAllowFrom' | 'resolveDefaultTo'>;
    groups?: ChannelGroupAdapter;
    mentions?: ChannelMentionAdapter;
    threading?: ChannelThreadingAdapter;
    agentPrompt?: ChannelAgentPromptAdapter;
}

/** Channel identifiers — single source of truth for the channel layer. */
declare const BUILTIN_CHANNEL_IDS: readonly ["webchat", "cli", "rest-api"];
type BuiltinChannelId = (typeof BUILTIN_CHANNEL_IDS)[number];

/**
 * Base registry — shared Map-backed implementation for all framework registries.
 * Provides consistent register/unregister/get/getAll/listIds/has across every registry.
 */
interface IRegistry<T> {
    register(id: string, entry: T): void;
    unregister(id: string): boolean;
    get(id: string): T | undefined;
    /** Returns Map or T[] depending on registry implementation */
    getAll(): Map<string, T> | T[];
    listIds(): string[];
    has(id: string): boolean;
}
/** Interface for entries that carry their own `id` field. */
interface Identifiable {
    readonly id: string;
}
declare class BaseRegistry<T> implements IRegistry<T> {
    protected readonly entries: Map<string, T>;
    private readonly label;
    constructor(label: string);
    register(id: string, entry: T): void;
    unregister(id: string): boolean;
    get(id: string): T | undefined;
    getAll(): Map<string, T> | T[];
    listIds(): string[];
    has(id: string): boolean;
    get size(): number;
    /**
     * Register by explicit id + entry, or by a self-identifying entry.
     * Subclasses with `register(entry: T)` overloads can delegate here.
     */
    protected registerByIdOrEntry(idOrEntry: string | (T & Identifiable), entry?: T): void;
}

/**
 * Channel Registry — extends BaseRegistry<ChannelPlugin> with ordering,
 * alias resolution, and facade caching on top of the framework's standard
 * registry pattern.
 */

type PluginOrigin = 'config' | 'workspace' | 'global' | 'bundled';
interface ChannelRegistryEntry {
    plugin: ChannelPlugin;
    origin: PluginOrigin;
    version?: string;
    registeredAt: number;
}
declare class ChannelRegistry extends BaseRegistry<ChannelPlugin> {
    private readonly meta;
    private aliases;
    private version;
    private pluginCache;
    private facadeCache;
    constructor();
    /**
     * Register a channel plugin with origin-based priority.
     * Lower-priority origins cannot overwrite higher-priority ones.
     */
    registerPlugin(plugin: ChannelPlugin, origin?: PluginOrigin, version?: string): void;
    unregister(channelId: ChannelId): boolean;
    getEntry(channelId: ChannelId): ChannelRegistryEntry | undefined;
    resolveAlias(idOrAlias: string): ChannelId;
    normalizeChannelId(idOrAlias: string): ChannelId;
    listPlugins(): ChannelPlugin[];
    listMeta(): ChannelMeta[];
    listIds(): ChannelId[];
    getVersion(): number;
    isBuiltin(channelId: string): boolean;
    getBuiltinMeta(channelId: BuiltinChannelId): ChannelMeta;
    getChannelFacade(channelId: ChannelId): ChannelFacade | undefined;
    clearFacadeCache(): void;
    private resolve;
    private dedupeByOriginPriority;
}

/**
 * ChannelHealthMonitor — periodic heartbeat probes for channel accounts.
 *
 * Tracks consecutive failures per account and derives a tri-state health
 * status (healthy / degraded / unhealthy) used by the gateway health endpoint.
 */

type ChannelHealthStatus = 'healthy' | 'degraded' | 'unhealthy';
interface ChannelHealthInfo {
    status: ChannelHealthStatus;
    consecutiveFailures: number;
}
interface HealthMonitorDeps {
    getConfig(): NovaClawConfig;
    getRuntimeSnapshot(): ChannelRuntimeSnapshot;
    getPlugin(channelId: ChannelId): ChannelPlugin | undefined;
}
interface ChannelHealthMonitorOptions {
    intervalMs?: number;
}
declare class ChannelHealthMonitor {
    private intervalMs;
    private intervalId;
    private deps;
    private healthByKey;
    constructor(options?: ChannelHealthMonitorOptions);
    start(deps: HealthMonitorDeps): void;
    stop(): void;
    getHealth(channelId: string): ChannelHealthInfo | undefined;
    getAllHealth(): Record<string, ChannelHealthInfo>;
    private runHealthCheck;
}

/**
 * Channel API — service interfaces, DTOs, and type re-exports.
 *
 * Follows the framework's dependency-inversion pattern:
 *   apis/channel.ts defines contracts → registries/ stores plugins →
 *   core/channel/ implements → bootstrap.ts wires defaults.
 *
 * Consumers (gateway, routes) depend on IChannelHub, never on the
 * concrete ChannelHub class.
 */

interface OutboundContent {
    text?: string;
    markdown?: string;
    mediaUrl?: string;
    metadata?: Record<string, unknown>;
}
interface ChannelStatus {
    connected: boolean;
    lastActivity?: number;
    error?: string;
    metrics?: {
        messagesSent: number;
        messagesReceived: number;
        errors: number;
    };
    accounts?: Array<{
        accountId: string;
        connected: boolean;
        error?: string;
    }>;
}
/**
 * IChannelHub — primary service interface for the channel subsystem.
 *
 * All external consumers (gateway, routes, tests) should depend on this
 * interface rather than the concrete ChannelHub implementation.
 */
interface IChannelHub extends Lifecycle {
    routeIncomingMessage(channelId: string, message: unknown): Promise<void>;
    dispatchMessage(channelId: string, message: unknown): Promise<void>;
    sendMessage(channelId: string, target: string, content: OutboundContent): Promise<void>;
    getChannelPlugin(channelId: string): ChannelPlugin | undefined;
    hasHandler(channelId: string): boolean;
    registerExternalPlugin(channelId: string, plugin: ChannelPlugin): void;
    getRuntimeSnapshot(): ChannelRuntimeSnapshot;
    getChannelStatus(channelId: string): ChannelStatus | null;
    getAllChannelStatuses(): Record<string, ChannelStatus>;
    addChannel(channelId: string): Promise<void>;
    removeChannel(channelId: string): Promise<void>;
    getChannelRegistry(): ChannelRegistry;
    getChannelManager(): IChannelManager;
    getEffectiveConfig(): NovaClawConfig;
}
/**
 * IChannelManager — lifecycle controller for channel accounts.
 *
 * Manages start/stop, auto-restart, and per-account state snapshots.
 */
interface IChannelManager {
    startChannels(): Promise<void>;
    stopAll(): Promise<void>;
    startChannel(channelId: ChannelId, accountId?: string): Promise<void>;
    stopChannel(channelId: ChannelId, accountId?: string): Promise<void>;
    getRuntimeSnapshot(): ChannelRuntimeSnapshot;
    getAccountSnapshot(channelId: ChannelId, accountId: string): ChannelAccountSnapshot | undefined;
    getHealthStatus(channelId: string): ChannelHealthInfo | undefined;
    isManuallyStopped(channelId: ChannelId, accountId: string): boolean;
    markChannelLoggedOut(channelId: ChannelId, cleared: boolean, accountId?: string): void;
    resetRestartAttempts(channelId: ChannelId, accountId: string): void;
}

type RulePhase = 'input' | 'behavior' | 'output';
interface ToolRulePayload {
    channel?: string;
    toolName?: string;
    allowExecInChannels?: boolean | string[];
}
interface RuleContext {
    phase?: RulePhase;
    type: 'message' | 'tool' | 'agent' | 'output' | 'channel';
    message?: string;
    channel?: string;
    userId?: string;
    sessionKey?: string;
    agentId?: string;
    toolName?: string;
    toolArgs?: Record<string, unknown>;
    content?: string;
    toolCalls?: ToolCall[];
    ragSources?: string[];
    name?: string;
    payload?: ToolRulePayload | Record<string, unknown>;
}
type RuleVerdictAllow = {
    action: 'allow';
};
type RuleVerdictReject = {
    action: 'reject';
    reason: string;
};
type RuleVerdictRewrite = {
    action: 'rewrite';
    content: string;
    reason?: string;
};
type RuleVerdictTransform = {
    action: 'transform';
    transformer: (content: string) => string;
};
type RuleVerdict = RuleVerdictAllow | RuleVerdictReject | RuleVerdictRewrite | RuleVerdictTransform;
interface RuleScope {
    agents?: string[];
    channels?: string[];
}
interface IRule {
    id: string;
    name: string;
    description?: string;
    phase?: RulePhase;
    priority: number;
    scope?: RuleScope;
    /**
     * Evaluate the rule against the given context.
     * Return a verdict to short-circuit (reject/rewrite/transform),
     * or `undefined` to pass through to the next rule in the chain.
     */
    evaluate(ctx: RuleContext): RuleVerdict | undefined;
}
interface RuleDescriptor {
    id: string;
    name: string;
    description?: string;
    phase?: RulePhase;
    priority: number;
    version?: string;
}

interface ConversationRecord {
    id: string;
    title: string;
    userId: string;
    messages: ChatTurn[];
    createdAt: number;
    updatedAt: number;
}
type ConversationSummary = Omit<ConversationRecord, 'messages'>;
interface DocumentIndex {
    documentId: string;
    source: 'conversation' | 'workspace' | 'upload';
    filePath: string;
    title: string;
    tree: unknown;
    chunks: unknown[];
    indexedAt: number;
    contentHash: string;
}
interface RetrievalResult {
    documentId: string;
    source: DocumentIndex['source'];
    filePath: string;
    title: string;
    sections: Array<{
        nodeId: string;
        nodeTitle: string;
        content: string;
        score?: number;
    }>;
}
interface MemorySearchResult {
    query: string;
    results: RetrievalResult[];
    retrievalTimeMs: number;
}
interface DocumentSummary {
    documentId: string;
    source: string;
    title: string;
    indexedAt: number;
}
interface DocumentResult {
    documentId: string;
    source: DocumentIndex['source'];
    filePath: string;
    title: string;
    sections: Array<{
        nodeId: string;
        nodeTitle: string;
        content: string;
        score?: number;
    }>;
}
interface RetrievalOptions {
    maxResults?: number;
}
type MemoryStats = Record<string, unknown>;
interface MemoryProviderOptions {
    llmCall?: (systemPrompt: string, userContent: string, maxTokens?: number) => Promise<string | null>;
    embed?: unknown;
}
interface IConversationStore {
    createConversation(userId?: string): Promise<ConversationRecord>;
    getConversation(id: string): Promise<ConversationRecord | null>;
    listConversations(): Promise<ConversationSummary[]>;
    appendMessages(conversationId: string, messages: ChatTurn[]): Promise<ConversationRecord | null>;
    deleteConversation(id: string): Promise<boolean>;
    indexConversation(conversation: ConversationRecord): Promise<DocumentIndex | null>;
}
interface IDocumentIndex {
    indexWorkspace(dir: string): Promise<number>;
    indexDocument(filePath: string, source: 'workspace' | 'upload'): Promise<DocumentIndex | null>;
    listDocuments(): DocumentSummary[];
    getDocumentById(docId: string): Promise<DocumentResult | null>;
    removeDocument(docId: string): Promise<boolean>;
}
interface IRetrieval {
    retrieve(query: string, options?: RetrievalOptions): Promise<MemorySearchResult>;
    search(query: string): Promise<RetrievalResult[]>;
}
interface IMemoryProvider extends IConversationStore, IDocumentIndex, IRetrieval {
    readonly id: string;
    version?: string;
    readonly enabled: boolean;
    initialize(): Promise<void>;
    cleanup(): Promise<void>;
    getStats(): MemoryStats;
    getUploadsDir?(): string;
    reindex?(): Promise<number>;
}
/** Factory: (config, options?) => IMemoryProvider. Config is project-specific; use Record<string, unknown> in framework. */
type MemoryProviderFactory = (config: Record<string, unknown>, options?: MemoryProviderOptions) => IMemoryProvider;

/**
 * Provider registry — register LLM provider factories by key.
 * ModelManager uses this to create provider instances by provider name.
 */

interface ProviderRegistryEntry {
    factory: LLMProviderFactory;
    /** Optional contract version for multi-version support */
    version?: string;
}
declare class ProviderRegistry extends BaseRegistry<ProviderRegistryEntry> {
    constructor();
    register(id: string, factory: LLMProviderFactory, options?: {
        version?: string;
    }): void;
    register(id: string, entry: ProviderRegistryEntry): void;
    private isRegistryEntry;
    getFactory(id: string): LLMProviderFactory | undefined;
    create(id: string, config: LLMProviderConfig): ReturnType<LLMProviderFactory['create']> | null;
}

/**
 * Skill provider registry — register skill providers (e.g. file-based, remote API).
 * SkillsEngine can aggregate from all registered providers.
 */

interface SkillProviderRegistryOptions {
    /** Initial providers to register */
    providers?: ISkillProvider[];
}
declare class SkillProviderRegistry extends BaseRegistry<ISkillProvider> {
    constructor(options?: SkillProviderRegistryOptions);
    register(provider: ISkillProvider): void;
    register(id: string, provider: ISkillProvider): void;
    getAll(): ISkillProvider[];
}

/**
 * Tool provider registry — register tools by name.
 * ToolRegistry can merge tools from this registry with builtins and config-driven extensions.
 */

interface ToolProviderRegistryEntry {
    tool: Tool;
    /** Optional; e.g. for filtering by profile */
    tags?: string[];
    version?: string;
}
declare class ToolProviderRegistry extends BaseRegistry<ToolProviderRegistryEntry> {
    constructor();
    register(name: string, tool: Tool, options?: {
        tags?: string[];
        version?: string;
    }): void;
    register(id: string, entry: ToolProviderRegistryEntry): void;
    getTool(name: string): Tool | undefined;
    getEntry(name: string): ToolProviderRegistryEntry | undefined;
    /** Returns all tools as array. Use getAllEntries() for Map of entries. */
    getAllTools(): Tool[];
    getAllEntries(): Map<string, ToolProviderRegistryEntry>;
}

/**
 * Channel plugin registry — register ChannelPlugin instances or factories.
 */

type ChannelPluginFactory = (config: Record<string, unknown>) => ChannelPlugin | Promise<ChannelPlugin>;
interface ChannelPluginRegistryEntry {
    plugin?: ChannelPlugin;
    factory?: ChannelPluginFactory;
    version?: string;
}
declare class ChannelPluginRegistry extends BaseRegistry<ChannelPluginRegistryEntry> {
    constructor();
    register(id: string, pluginOrFactory: ChannelPlugin | ChannelPluginFactory, options?: {
        version?: string;
    }): void;
    register(id: string, entry: ChannelPluginRegistryEntry): void;
}

/**
 * Rule engine — evaluates registered rules in priority order (chain of responsibility).
 * Supports three evaluation phases: input, behavior, output.
 */

interface RuleEngineOptions {
    rules?: IRule[];
}
declare class RuleEngine {
    private rules;
    constructor(options?: RuleEngineOptions);
    register(rule: IRule): void;
    unregister(ruleId: string): boolean;
    get(id: string): IRule | undefined;
    listIds(): string[];
    getAll(): IRule[];
    getRulesByPhase(phase: RulePhase): IRule[];
    /**
     * Evaluate context against all rules in priority order.
     * First rule returning a reject/rewrite/transform short-circuits.
     */
    evaluate(ctx: RuleContext): RuleVerdict;
    /**
     * Evaluate only rules matching a specific phase and optional scope.
     * Rules without a phase are skipped.
     */
    evaluatePhase(phase: RulePhase, ctx: RuleContext, scope?: {
        agentId?: string;
        channel?: string;
    }): RuleVerdict;
    private sortRules;
}

/**
 * Rule registry — register rules for tool/channel policy.
 * Wraps RuleEngine so the same rules can be shared (e.g. with ToolRegistry).
 */

interface RuleRegistryOptions {
    rules?: IRule[];
}
declare class RuleRegistry {
    private engine;
    constructor(options?: RuleRegistryOptions);
    register(rule: IRule): void;
    unregister(ruleId: string): boolean;
    get(id: string): IRule | undefined;
    listIds(): string[];
    getAll(): IRule[];
    getRulesByPhase(phase: RulePhase): IRule[];
    evaluate(ctx: RuleContext): RuleVerdict;
    evaluatePhase(phase: RulePhase, ctx: RuleContext, scope?: {
        agentId?: string;
        channel?: string;
    }): RuleVerdict;
    getEngine(): RuleEngine;
}

/**
 * Memory provider registry — register RAG backends (local, vector DB, etc.).
 * NovaClaw creates the active memory from this registry using config.memory.provider.
 */

interface MemoryProviderRegistryEntry {
    factory: MemoryProviderFactory;
    version?: string;
}
declare class MemoryProviderRegistry extends BaseRegistry<MemoryProviderRegistryEntry> {
    constructor();
    register(id: string, factory: MemoryProviderFactory, options?: {
        version?: string;
    }): void;
    register(id: string, entry: MemoryProviderRegistryEntry): void;
    /**
     * Create a memory provider instance. Uses "local" if id is missing or not registered.
     */
    create(id: string, config: Record<string, unknown>, options?: MemoryProviderOptions): IMemoryProvider | null;
}

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
 * LLM provider error types.
 * Extracted to avoid circular imports between BaseStreamProvider and OpenAICompatibleProvider.
 */
declare class LLMApiError extends Error {
    readonly statusCode: number;
    readonly retryAfterSeconds: number | null;
    readonly provider: string;
    constructor(message: string, statusCode: number, retryAfterSeconds: number | null, provider: string);
    get isRateLimit(): boolean;
    get isAuth(): boolean;
    get isModelNotFound(): boolean;
    get isBadRequest(): boolean;
}

/**
 * Channel routing bindings — maps channel+peer to agent configurations.
 */
interface RoutePeer {
    kind: 'direct' | 'group' | 'channel' | 'thread';
    id: string;
}
interface ChannelBinding {
    channel: string;
    accountId?: string;
    agentId: string;
    peer?: RoutePeer;
    parentPeer?: RoutePeer;
    guildId?: string;
    teamId?: string;
    roleIds?: string[];
    priority?: number;
    metadata?: Record<string, unknown>;
}

/**
 * Backoff policy — exponential backoff with jitter for channel restart scheduling.
 */
interface BackoffPolicy {
    initialMs: number;
    maxMs: number;
    factor: number;
    jitter: number;
}

type ChannelRuntimeFactory = (channelId: string, accountId: string) => PluginChannelRuntime | undefined;
interface ChannelManagerOptions {
    registry: ChannelRegistry;
    config: NovaClawConfig;
    restartPolicy?: BackoffPolicy;
    maxRestartAttempts?: number;
    logger?: Logger;
    channelRuntimeFactory?: ChannelRuntimeFactory;
}
declare class ChannelManager extends EventEmitter$1 implements IChannelManager {
    private runtimes;
    private registry;
    private config;
    private restartPolicy;
    private maxRestartAttempts;
    private logger;
    private globalAbort;
    private channelRuntimeFactory?;
    readonly healthMonitor: ChannelHealthMonitor;
    constructor(options: ChannelManagerOptions);
    getConfig(): NovaClawConfig;
    getRuntimeSnapshot(): ChannelRuntimeSnapshot;
    getHealthStatus(channelId: string): ChannelHealthInfo | undefined;
    startChannels(): Promise<void>;
    startChannel(channelId: ChannelId, accountId?: string): Promise<void>;
    stopChannel(channelId: ChannelId, accountId?: string): Promise<void>;
    markChannelLoggedOut(channelId: ChannelId, cleared: boolean, accountId?: string): void;
    isManuallyStopped(channelId: ChannelId, accountId: string): boolean;
    resetRestartAttempts(channelId: ChannelId, accountId: string): void;
    getAccountSnapshot(channelId: ChannelId, accountId: string): ChannelAccountSnapshot | undefined;
    stopAll(): Promise<void>;
    private startChannelInternal;
    private startAccountInternal;
    private scheduleRestart;
    private stopAccountRuntime;
    private findRuntimeKeys;
    private runtimeKey;
}

/**
 * SkillsEngine — aggregates skills from all registered providers.
 *
 * Primary provider: FileSkillProvider (always present).
 * Additional providers can be registered via SkillProviderRegistry.
 */

interface SkillsEngineOptions {
    providerRegistry?: SkillProviderRegistry | null;
}
declare class SkillsEngine implements ISkillProvider {
    readonly id = "skills-engine";
    readonly version = "2026-03";
    private fileProvider;
    private providerRegistry;
    private logger;
    constructor(config: NovaClawConfig, options?: SkillsEngineOptions);
    initialize(): Promise<void>;
    cleanup(): Promise<void>;
    listSkills(): Promise<SkillDefinition[]>;
    resolve(message: string, context: SessionContext, options?: {
        maxSkills?: number;
        mentionedFiles?: string[];
    }): Promise<SkillSearchResult[]>;
    findRelevantSkills(message: string, context: SessionContext, options?: {
        useCache?: boolean;
        maxSkills?: number;
        mentionedFiles?: string[];
    }): Promise<SkillDefinition[]>;
    findRelevantSkillsByQuery(query: string, limit?: number): Promise<SkillDefinition[]>;
    getSkillById(id: string): SkillDefinition | undefined;
    listSkillIds(): string[];
    addExternalSkills(skills: SkillDefinition[]): number;
    reloadFromDisk(): Promise<void>;
    getStats(): {
        totalSkills: number;
    };
    private listExternalSkills;
    private resolveFromExternalProviders;
}

/**
 * Type-safe event emitter — lighter alternative to node:events for internal use.
 */
declare class EventEmitter<T extends Record<string, unknown[]>> {
    private listeners;
    on<K extends keyof T>(event: K, listener: (...args: T[K]) => void): void;
    once<K extends keyof T>(event: K, listener: (...args: T[K]) => void): void;
    off<K extends keyof T>(event: K, listener: (...args: T[K]) => void): void;
    emit<K extends keyof T>(event: K, ...args: T[K]): void;
    listenerCount<K extends keyof T>(event: K): number;
    removeAllListeners(event?: keyof T): void;
}

/**
 * HTTPBridge — HTTP webhook management and outbound request client.
 * Extracted from ProtocolBridge for single-responsibility.
 */
interface HttpSendOptions {
    method?: string;
    headers?: Record<string, string>;
    body?: unknown;
}
interface HttpSendResult {
    ok: boolean;
    status: number;
    data?: unknown;
    headers?: Record<string, string>;
}
type WebhookHandler = (req: unknown, res: {
    json: (data: unknown) => unknown;
    status: (code: number) => {
        json: (data: unknown) => {
            status: number;
            data: unknown;
        };
    };
}) => Promise<unknown>;

interface ProtocolBridgeEventMap extends Record<string, unknown[]> {
    'mcp:connected': [endpoint: string];
    'mcp:tool_called': [data: {
        endpoint: string;
        toolName: string;
        args: Record<string, unknown>;
        result: MCPCallToolResult;
    }];
    'http:webhook_registered': [path: string];
    'http:request_sent': [data: {
        url: string;
        options: HttpSendOptions;
        result: HttpSendResult;
    }];
}

interface ProtocolBridgeOptions {
    mcpConnector?: IMCPConnector;
    logger?: Logger;
}
/** 协议桥接主类：MCP + HTTP，配置为 Record 以保持 framework 无项目依赖。 */
declare class ProtocolBridge extends EventEmitter<ProtocolBridgeEventMap> {
    private readonly mcpConnector;
    private readonly httpBridge;
    private readonly logger;
    private readonly configRecord;
    constructor(config: Record<string, string> | NovaClawConfig, options?: ProtocolBridgeOptions);
    initialize(): Promise<void>;
    connectMCP(endpoint: string, options?: Omit<MCPConnectOptions, 'endpoint'>): Promise<void>;
    /** Drop all MCP sessions and reconnect from config (e.g. after saving overrides). */
    reloadMcpConnections(entries: MCPServerEntry[]): Promise<void>;
    getMCPTools(endpoint: string): Promise<MCPTool[]>;
    callMCPTool(endpoint: string, toolName: string, args?: Record<string, unknown>): Promise<MCPCallToolResult>;
    registerHTTPWebhook(path: string, handler: WebhookHandler): Promise<void>;
    sendHTTPRequest(url: string, options?: HttpSendOptions): Promise<HttpSendResult>;
    callExternal(protocol: 'mcp' | 'http', params: {
        endpoint?: string;
        tool?: string;
        args?: Record<string, unknown>;
        url?: string;
        options?: HttpSendOptions;
    }): Promise<unknown>;
    getStats(): Record<string, unknown>;
    healthCheck(): Promise<{
        status: 'healthy' | 'degraded' | 'unhealthy';
        components: Record<string, {
            status: string;
            connections?: number;
            webhooks?: number;
        }>;
    }>;
    cleanup(): Promise<void>;
    private connectEntry;
    private logMcpConnectFailure;
}

interface Agent extends Lifecycle {
    execute(params: ExecutorParams): Promise<AgentResponse>;
    internalLLMCall(systemPrompt: string, userContent: string, maxTokens?: number): Promise<string | null>;
    setProtocolBridge?(bridge: ProtocolBridge | null): void;
    reinitializeToolRegistry?(): Promise<void>;
    reinitializeSession?(): Promise<void>;
}
interface ExecutorParams {
    message: string;
    context: SessionContext;
    skills: SkillDefinition[];
    memoryContext?: string;
    onChunk: (chunk: StreamChunk) => void;
    images?: ImageContent[];
    abortSignal?: AbortSignal;
}

/**
 * In-memory session store with automatic expiration.
 *
 * Lives in the agent layer so that MessageProcessor, the gateway,
 * and any other consumer can share a single session pool.
 */

interface CreateSessionPayload {
    userId?: string;
    channel?: string;
    conversationId?: string;
    metadata?: Record<string, unknown>;
    token?: string;
}
declare class SessionManager {
    private workspaceDir;
    static readonly MAX_SESSION_HISTORY = 20;
    private static readonly DEFAULT_TIMEOUT_MS;
    private sessions;
    private cleanupInterval;
    constructor(workspaceDir: string, timeoutMs?: number);
    createSession(payload: CreateSessionPayload, sessionKey?: string): Promise<SessionContext>;
    get(sessionKey: string): SessionContext | undefined;
    set(sessionKey: string, ctx: SessionContext): void;
    delete(sessionKey: string): boolean;
    values(): IterableIterator<SessionContext>;
    entries(): IterableIterator<[string, SessionContext]>;
    get size(): number;
    trimHistory(ctx: SessionContext): void;
    dispose(): void;
    private purgeExpired;
}

/**
 * ConversationResolver — framework-level conversation lifecycle manager.
 *
 * Ensures every session has a conversation bound when memory is enabled,
 * regardless of which channel originated the message. This decouples
 * conversation management from individual gateway handlers (WebSocket,
 * REST, channel plugins) and makes it a single framework concern.
 *
 * Two operations:
 *   bind()   — attach an existing conversation (e.g. webchat resuming a chat)
 *   ensure() — lazy-create a conversation on first message if none is bound
 */

declare class ConversationResolver {
    private readonly memoryEngine;
    private readonly sessionManager;
    private readonly logger;
    private readonly pending;
    constructor(memoryEngine: IMemoryProvider, sessionManager: SessionManager, logger: Logger);
    /**
     * Bind an existing conversation to a session.
     * Loads conversation history into the session for context continuity.
     *
     * @returns `true` if the conversation was found and bound.
     */
    bind(session: SessionContext, conversationId: string): Promise<boolean>;
    /**
     * Ensure the session has a conversation bound.
     * If already bound, returns the existing ID immediately.
     * If not, creates a new conversation (coalescing concurrent calls per session).
     *
     * @returns The conversation ID, or `null` if memory is disabled.
     */
    ensure(session: SessionContext): Promise<string | null>;
    private createAndBind;
}

/**
 * Generic message processing pipeline.
 *
 * Encapsulates the full cycle: session management, conversation resolution,
 * skill matching, memory retrieval, agent execution, and history + memory
 * persistence.
 *
 * Any consumer — the HTTP gateway, WebSocket handler, channel plugin,
 * or future integrations — calls `process()` with a message and gets back
 * a `MessageResponse`. Conversation lifecycle is managed transparently
 * by the framework (via ConversationResolver) so callers never need to
 * worry about memory persistence.
 */

interface MessageProcessorDeps {
    config: NovaClawConfig;
    agent: Agent;
    skillsEngine: SkillsEngine;
    memoryEngine: IMemoryProvider | null;
    sessionManager: SessionManager;
    hookManager?: HookManager | null;
}
interface ProcessMessageParams {
    message: string;
    sessionKey?: string;
    userId?: string;
    channel?: string;
    metadata?: Record<string, unknown>;
    images?: Array<{
        url?: string;
        data?: string;
        mimeType: string;
        description?: string;
    }>;
    onChunk?: (chunk: StreamChunk) => void;
    abortSignal?: AbortSignal;
}
declare class MessageProcessor {
    private readonly config;
    private readonly logger;
    private readonly agent;
    private readonly skillsEngine;
    private readonly memoryEngine;
    private readonly sessionLock;
    private readonly hookManager;
    readonly sessionManager: SessionManager;
    /** Exposed for gateway-level conversation pre-binding (e.g. WS auth). */
    readonly conversationResolver: ConversationResolver | null;
    constructor(deps: MessageProcessorDeps);
    /**
     * Process a single message through the full agent pipeline.
     *
     * 1. Resolve or create a session
     * 2. Ensure a conversation is bound (auto-create if needed)
     * 3. Match skills + retrieve memory in parallel
     * 4. Execute the agent
     * 5. Update conversation history + persist to memory
     */
    process(params: ProcessMessageParams): Promise<MessageResponse>;
    private resolveSession;
    private matchSkills;
    private retrieveMemory;
    private updateHistory;
    private persistToMemory;
    private classifyAbort;
    private executeAgentTurn;
}

/**
 * ChannelHub — thin orchestrator façade for the channel subsystem.
 *
 * Composes the pipeline, lifecycle, and registry layers into a single
 * entry point consumed by the gateway and NovaClaw core.
 *
 * ┌────────────────────────────────────────────────────────┐
 * │                      ChannelHub                        │
 * │  ┌──────────┐  ┌──────────────┐  ┌────────────────┐   │
 * │  │ Registry │  │   Pipeline   │  │   Lifecycle     │   │
 * │  │          │  │ inbound  out │  │ manager  health │   │
 * │  └──────────┘  └──────────────┘  └────────────────┘   │
 * └────────────────────────────────────────────────────────┘
 */

interface ChannelHubOptions {
    channelRegistry?: ChannelRegistry;
    channelPluginRegistry?: ChannelPluginRegistry;
    bindings?: ChannelBinding[];
    skipConfigMerge?: boolean;
    messageProcessor?: MessageProcessor;
}
declare class ChannelHub extends EventEmitter$1 implements IChannelHub {
    private registry;
    private manager;
    private inboundPipeline;
    private debouncePolicy;
    private activityTracker;
    private pluginLoader;
    private extensionLoader;
    private messageHandlers;
    private config;
    private logger;
    private pluginRegistry?;
    private messageProcessor?;
    private bindings;
    constructor(config: NovaClawConfig, options?: ChannelHubOptions);
    initialize(): Promise<void>;
    dispatchMessage(channelId: string, message: unknown): Promise<void>;
    routeIncomingMessage(channelId: string, message: unknown): Promise<void>;
    sendMessage(channelId: string, target: string, content: OutboundContent): Promise<void>;
    getChannelPlugin(channelId: string): ChannelPlugin | undefined;
    getEffectiveConfig(): NovaClawConfig;
    getChannelRegistry(): ChannelRegistry;
    getChannelManager(): ChannelManager;
    hasHandler(channelId: string): boolean;
    setMessageProcessor(mp: MessageProcessor): void;
    registerExternalPlugin(channelId: string, plugin: ChannelPlugin): void;
    getRuntimeSnapshot(): ChannelRuntimeSnapshot;
    getChannelStatus(channelId: string): ChannelStatus | null;
    getAllChannelStatuses(): Record<string, ChannelStatus>;
    addChannel(channelId: string): Promise<void>;
    removeChannel(channelId: string): Promise<void>;
    cleanup(): Promise<void>;
    getStats(): Record<string, unknown>;
    private loadChannel;
    private loadExternalPlugin;
    private createChannelRuntime;
    private buildChannelStatus;
}

/**
 * Framework bootstrap — register default implementations into registries.
 * The framework is the agent: apis + default provider, rules, memory, MCP.
 * Project only wires config and optionally adds custom registrations.
 */

interface FrameworkBootstrapOptions {
    providerRegistry?: ProviderRegistry;
    ruleRegistry?: RuleRegistry;
    memoryProviderRegistry?: MemoryProviderRegistry;
    channelPluginRegistry?: ChannelPluginRegistry;
}
/**
 * Register default LLM provider factories (openai-compatible) for keys: openai, anthropic.
 * Caller passes provider key; config (apiKey, baseUrl) is passed when creating the provider.
 */
declare function registerDefaultProviders$1(registry: ProviderRegistry): void;
/**
 * Register default rules across all three phases: input, behavior, and output.
 */
declare function registerDefaultRules$1(registry: RuleRegistry, config?: {
    builtin?: Record<string, boolean>;
    channelFormats?: Record<string, {
        format?: string;
        maxLength?: number;
    }>;
    piiFilter?: {
        enabled?: boolean;
    };
}): void;
/**
 * Register default local memory provider (BM25 RAG).
 */
declare function registerDefaultMemoryProviders$1(registry: MemoryProviderRegistry): void;

type ExecutionDecision = {
    action: 'respond';
    response: AgentResponse;
} | {
    action: 'retrySameModel';
} | {
    action: 'retryAfterFallback';
    fallbackMessage: string;
};
interface ExecutionPolicyContext {
    getActiveModelName(): string;
    createErrorResponse(userMessage: string): AgentResponse;
    onChunk: ExecutorParams['onChunk'];
}
interface IExecutionPolicy {
    handle(error: unknown, params: ExecutorParams, startTime: number, ctx: ExecutionPolicyContext): Promise<ExecutionDecision>;
}

interface AgentRuntimeOptions {
    skillsEngine?: SkillsEngine;
    providerRegistry?: ProviderRegistry | null;
    ruleRegistry?: RuleRegistry | null;
    toolProviderRegistry?: ToolProviderRegistry | null;
    executionPolicy?: IExecutionPolicy;
}
declare class AgentRuntime implements Agent {
    private modelManager;
    private toolRegistry;
    private promptBuilder;
    private executor;
    private executionPolicy;
    private logger;
    private skillsEngine?;
    private metrics;
    constructor(config: NovaClawConfig, options?: AgentRuntimeOptions);
    setProtocolBridge(bridge: ProtocolBridge | null): void;
    initialize(): Promise<void>;
    reinitializeSession(): Promise<void>;
    reinitializeToolRegistry(): Promise<void>;
    cleanup(): Promise<void>;
    execute(params: ExecutorParams): Promise<AgentResponse>;
    internalLLMCall(systemPrompt: string, userContent: string, maxTokens?: number): Promise<string | null>;
    private executeWithRetry;
    private handleExecutionError;
    private buildErrorResponse;
    getStats(): Record<string, unknown>;
}

/**
 * Centralized error codes, error class, and factory for consistent error handling.
 */
declare class NovaClawError extends Error {
    readonly code: string;
    readonly details?: unknown;
    constructor(message: string, code: string, details?: unknown);
}
declare const ErrorCodes: {
    readonly CONFIG_INVALID: "CONFIG_INVALID";
    readonly CONFIG_LOAD_FAILED: "CONFIG_LOAD_FAILED";
    readonly INIT_FAILED: "INIT_FAILED";
    readonly PROTOCOL_ERROR: "PROTOCOL_ERROR";
    readonly CHANNEL_NOT_FOUND: "CHANNEL_NOT_FOUND";
    readonly VALIDATION_ERROR: "VALIDATION_ERROR";
    readonly SERVICE_UNAVAILABLE: "SERVICE_UNAVAILABLE";
    readonly AUTH_ERROR: "AUTH_ERROR";
    readonly NOT_FOUND: "NOT_FOUND";
    readonly NOT_IMPLEMENTED: "NOT_IMPLEMENTED";
    readonly INTERNAL_ERROR: "INTERNAL_ERROR";
    readonly PROVIDER_UNAVAILABLE: "PROVIDER_UNAVAILABLE";
    readonly PROVIDER_RATE_LIMITED: "PROVIDER_RATE_LIMITED";
    readonly PROVIDER_AUTH_FAILED: "PROVIDER_AUTH_FAILED";
    readonly PROVIDER_MODEL_NOT_FOUND: "PROVIDER_MODEL_NOT_FOUND";
    readonly PROVIDER_TIMEOUT: "PROVIDER_TIMEOUT";
    readonly TOOL_EXECUTION_FAILED: "TOOL_EXECUTION_FAILED";
    readonly TOOL_NOT_FOUND: "TOOL_NOT_FOUND";
    readonly TOOL_TIMEOUT: "TOOL_TIMEOUT";
    readonly TOOL_VALIDATION_FAILED: "TOOL_VALIDATION_FAILED";
    readonly AGENT_MAX_TURNS: "AGENT_MAX_TURNS";
    readonly AGENT_EXECUTION_FAILED: "AGENT_EXECUTION_FAILED";
    readonly AGENT_FALLBACK_EXHAUSTED: "AGENT_FALLBACK_EXHAUSTED";
    readonly SESSION_NOT_FOUND: "SESSION_NOT_FOUND";
    readonly SESSION_EXPIRED: "SESSION_EXPIRED";
};
type ErrorCode = (typeof ErrorCodes)[keyof typeof ErrorCodes];
declare function createError(message: string, code: ErrorCode, details?: unknown): NovaClawError;

/**
 * Simple LRU cache with optional per-key TTL.
 */

declare class LRUCache<T> implements CacheInterface<T> {
    private cache;
    private readonly maxSize;
    constructor(maxSize?: number);
    get(key: string): T | undefined;
    set(key: string, value: T, ttl?: number): void;
    has(key: string): boolean;
    delete(key: string): boolean;
    clear(): void;
    size(): number;
}

/**
 * Config loader — YAML-based configuration with env-var substitution,
 * Zod validation, and layered config merging.
 *
 * Config merge order (later wins):
 *   defaults < novaclaw.yml < ~/.novaclaw/overrides.yml
 *
 * Credential encryption / decryption is delegated to credential-manager.ts.
 */

declare class ConfigLoader {
    private static logger;
    static load(configPath?: string): Promise<NovaClawConfig>;
    /**
     * Persist a config object to `~/.novaclaw/config.yml`.
     * When called without arguments, writes the built-in defaults.
     */
    static scaffoldGlobalConfig(config?: NovaClawConfig): Promise<string>;
    static serializeToYaml(config: NovaClawConfig | Record<string, unknown>): string;
    static loadOverrides(): Promise<Record<string, unknown>>;
    static saveOverrides(overrides: Record<string, unknown>): Promise<void>;
    static getChannelConfig(channelId: string): Promise<ChannelDetailConfig | null>;
    static saveChannelConfig(channelId: string, detail: ChannelDetailConfig): Promise<void>;
    static removeChannelConfig(channelId: string): Promise<boolean>;
    static getDefaultConfig(): NovaClawConfig;
    /**
     * After merging overrides, auto-enable channels that have at least one
     * enabled account — so users don't have to manually add to channels.enabled.
     */
    private static autoEnableChannels;
    private static validateAndParse;
    private static mergeWithDefaults;
    /** Substitute ${ENV_VAR} references with process.env values. */
    private static replaceEnvVars;
}

/**
 * In-memory metrics collector for requests, sessions, skills, and memory usage.
 */

declare class MetricsCollector {
    private data;
    private responseTimes;
    incrementRequests(type: 'success' | 'error', responseTime: number): void;
    incrementSessions(type: 'created' | 'destroyed'): void;
    updateSkillsMetrics(loaded: number, cacheHits: number, cacheMisses: number): void;
    getMetrics(): Metrics;
    reset(): void;
}

type CoreEventMap = {
    'system:initialized': [];
    'system:started': [];
    'system:stopped': [];
    'system:indexing_complete': [{
        indexed: number;
        elapsed: number;
    }];
    'gateway:started': [];
    'gateway:stopped': [];
    'session:created': [SessionContext];
    'session:destroyed': [SessionContext];
    'message:received': [MessageRequest];
    'message:processed': [MessageRequest, MessageResponse?];
    'skill:loaded': [string];
    'skill:error': [string];
    'channel:connected': [{
        channelId: string;
    }];
    'channel:disconnected': [{
        channelId: string;
        reason?: string;
    }];
    'channel:message': [
        {
            channelId: string;
            sessionHints: {
                sessionKey?: string;
                userId: string;
                channel: string;
                metadata: Record<string, unknown>;
            };
            message: unknown;
        }
    ];
    'health:changed': [HealthStatus];
    'performance:stats': [{
        system: Record<string, unknown>;
        components: Record<string, unknown>;
    }];
};
interface BootstrapOptions {
    config: NovaClawConfig;
    providerRegistry?: ProviderRegistry;
    ruleRegistry?: RuleRegistry;
    memoryProviderRegistry?: MemoryProviderRegistry;
    channelPluginRegistry?: ChannelPluginRegistry;
}
declare const registerDefaultProviders: typeof registerDefaultProviders$1;
declare const registerDefaultRules: typeof registerDefaultRules$1;
declare const registerDefaultMemoryProviders: typeof registerDefaultMemoryProviders$1;
declare function bootstrapRegistries(options: BootstrapOptions): void;
declare class NovaClaw extends EventEmitter<CoreEventMap> {
    private config;
    private readonly logger;
    private readonly metrics;
    private components;
    private indexer;
    private running;
    private startTime;
    private perfInterval;
    private shutdownHandlers;
    constructor(config?: NovaClawConfig);
    static create(configPath?: string): Promise<NovaClaw>;
    initialize(): Promise<void>;
    start(): Promise<void>;
    stop(): Promise<void>;
    restart(): Promise<void>;
    reloadConfig(configPath: string): Promise<void>;
    getSystemStats(): {
        system: {
            running: boolean;
            uptime: string;
            version: string;
            nodeVersion: string;
            platform: NodeJS.Platform;
            arch: NodeJS.Architecture;
        };
        performance: {
            memory: {
                rss: string;
                heapUsed: string;
                heapTotal: string;
                external: string;
            };
            metrics: Metrics;
        };
        components: {
            gateway: {
                status: string;
            };
            skills: {
                totalSkills: number;
            };
            agent: Record<string, unknown>;
            channels: Record<string, ChannelStatus>;
            protocol: Record<string, unknown>;
            memory: MemoryStats;
        };
    };
    getRunningPort(): number;
    private rebuildComponents;
    private wireEvents;
    private reloadComponents;
    private validateConfig;
    private startPerformanceMonitoring;
}

/**
 * HTTP/WebSocket gateway — Fastify server, routing, and connection management.
 * Security middleware (CORS, rate-limit, auth) is delegated to gateway/middleware/.
 */

interface GatewayDeps {
    skillsEngine: SkillsEngine;
    agent: Agent;
    channelHub: IChannelHub;
    protocolBridge: ProtocolBridge;
    memoryEngine: IMemoryProvider;
    messageProcessor: MessageProcessor;
}
declare class NovaClawGateway extends EventEmitter<CoreEventMap> {
    private config;
    private server;
    private readonly logger;
    private readonly metrics;
    private readonly sessionManager;
    private readonly wsHandler;
    private readonly chatStreamService;
    private shuttingDown;
    private healthInterval;
    private rateLimitState;
    private readonly skillsEngine;
    private readonly agent;
    private readonly channelHub;
    private readonly protocolBridge;
    private readonly memoryEngine;
    private readonly messageProcessor;
    constructor(config: NovaClawConfig, deps: GatewayDeps);
    start(): Promise<void>;
    stop(): Promise<void>;
    private wireChannelMessageHandler;
    private handleChannelMessage;
    private createServer;
    private registerRoutes;
    private startHealthMonitoring;
    private getHealthStatus;
}

/**
 * Component factory — creates all runtime components from a config.
 *
 * Separates construction logic from lifecycle orchestration so NovaClaw
 * stays focused on init/start/stop/restart and event wiring.
 */

interface RuntimeRegistries {
    provider: ProviderRegistry;
    rule: RuleRegistry;
    toolProvider: ToolProviderRegistry;
    memoryProvider: MemoryProviderRegistry;
    channelPlugin: ChannelPluginRegistry;
}
interface RuntimeComponents {
    registries: RuntimeRegistries;
    gateway: NovaClawGateway;
    skillsEngine: SkillsEngine;
    agent: Agent;
    channelHub: ChannelHub;
    protocolBridge: ProtocolBridge;
    memoryEngine: IMemoryProvider;
    messageProcessor: MessageProcessor;
    hookManager: HookManager;
}
declare function createRuntimeComponents(config: NovaClawConfig, logger: Logger): RuntimeComponents;

/**
 * NovaClaw — Lightweight High-Performance AI Gateway
 *
 * Public API surface. Internal implementation classes should be imported
 * directly from their module paths rather than from this barrel.
 */

declare function startNovaClaw(configPath?: string): Promise<NovaClaw>;

export { AgentResponse, AgentRuntime, CacheInterface, ChannelAccountSnapshot, ChannelAgentPromptAdapter, ChannelCapabilities, ChannelCommandAdapter, ChannelConfigAdapter, ChannelDetailConfig, ChannelElevatedAdapter, ChannelGroupAdapter, ChannelId, ChannelMentionAdapter, ChannelMeta, ChannelPlugin, ChannelPluginRegistry, ChannelRuntimeSnapshot, type ChannelStatus, ChannelThreadingAdapter, type ChatStreamOptions, ChatTurn, ConfigLoader, type ConversationRecord, type ConversationSummary, type CoreEventMap, type DocumentIndex, type DocumentResult, type DocumentSummary, ErrorCodes, type FrameworkBootstrapOptions, HealthStatus, type IChannelHub, type IChannelManager, type IConversationStore, type IDocumentIndex, type ILogger, type IMCPConnector, type IMemoryProvider, type IRetrieval, type IRule, type ISkillProvider, ImageContent, LLMApiError, type LLMProvider, type LLMProviderConfig, type LLMProviderFactory, LRUCache, Lifecycle, Logger, type MCPCallToolResult, type MCPConnectOptions, MCPServerEntry, MCPServerRequestInit, type MCPTool, type MemoryProviderFactory, type MemoryProviderOptions, MemoryProviderRegistry, type MemorySearchResult, type MemoryStats, MessageRequest, MessageResponse, Metrics, MetricsCollector, NovaClaw, NovaClawConfig, NovaClawError, NovaClawGateway, type OutboundContent, PluginChannelRuntime, type ProviderMessage, ProviderRegistry, type RetrievalOptions, type RetrievalResult, type RuleContext, type RuleDescriptor, RuleEngine, type RulePhase, RuleRegistry, type RuleScope, type RuleVerdict, type RuleVerdictAllow, type RuleVerdictReject, type RuleVerdictRewrite, type RuleVerdictTransform, type RuntimeComponents, type RuntimeRegistries, SessionContext, type SkillDefinition, type SkillSearchResult, StreamChunk, type StreamingChunk, type Tool, ToolCall, type ToolDefinition, type ToolDescriptor, type ToolExecutionResult, type ToolFunctionSchema, ToolProviderRegistry, type ToolRulePayload, bootstrapRegistries, createError, createRuntimeComponents, registerDefaultMemoryProviders, registerDefaultProviders, registerDefaultRules, startNovaClaw };
