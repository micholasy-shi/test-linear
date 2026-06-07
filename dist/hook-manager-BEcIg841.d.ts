import { z } from 'zod';

declare const ModelProviderConfigSchema: z.ZodObject<{
    apiKey: z.ZodOptional<z.ZodString>;
    baseUrl: z.ZodOptional<z.ZodString>;
    model: z.ZodOptional<z.ZodString>;
    timeout: z.ZodOptional<z.ZodNumber>;
    temperature: z.ZodOptional<z.ZodNumber>;
    topP: z.ZodOptional<z.ZodNumber>;
    enableThinking: z.ZodOptional<z.ZodBoolean>;
    frequencyPenalty: z.ZodOptional<z.ZodNumber>;
    presencePenalty: z.ZodOptional<z.ZodNumber>;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
    apiKey: z.ZodOptional<z.ZodString>;
    baseUrl: z.ZodOptional<z.ZodString>;
    model: z.ZodOptional<z.ZodString>;
    timeout: z.ZodOptional<z.ZodNumber>;
    temperature: z.ZodOptional<z.ZodNumber>;
    topP: z.ZodOptional<z.ZodNumber>;
    enableThinking: z.ZodOptional<z.ZodBoolean>;
    frequencyPenalty: z.ZodOptional<z.ZodNumber>;
    presencePenalty: z.ZodOptional<z.ZodNumber>;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
    apiKey: z.ZodOptional<z.ZodString>;
    baseUrl: z.ZodOptional<z.ZodString>;
    model: z.ZodOptional<z.ZodString>;
    timeout: z.ZodOptional<z.ZodNumber>;
    temperature: z.ZodOptional<z.ZodNumber>;
    topP: z.ZodOptional<z.ZodNumber>;
    enableThinking: z.ZodOptional<z.ZodBoolean>;
    frequencyPenalty: z.ZodOptional<z.ZodNumber>;
    presencePenalty: z.ZodOptional<z.ZodNumber>;
}, z.ZodTypeAny, "passthrough">>;
declare const ModelsConfigSchema: z.ZodObject<{
    primary: z.ZodString;
    fallback: z.ZodString;
    local: z.ZodOptional<z.ZodString>;
    providers: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodObject<{
        apiKey: z.ZodOptional<z.ZodString>;
        baseUrl: z.ZodOptional<z.ZodString>;
        model: z.ZodOptional<z.ZodString>;
        timeout: z.ZodOptional<z.ZodNumber>;
        temperature: z.ZodOptional<z.ZodNumber>;
        topP: z.ZodOptional<z.ZodNumber>;
        enableThinking: z.ZodOptional<z.ZodBoolean>;
        frequencyPenalty: z.ZodOptional<z.ZodNumber>;
        presencePenalty: z.ZodOptional<z.ZodNumber>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        apiKey: z.ZodOptional<z.ZodString>;
        baseUrl: z.ZodOptional<z.ZodString>;
        model: z.ZodOptional<z.ZodString>;
        timeout: z.ZodOptional<z.ZodNumber>;
        temperature: z.ZodOptional<z.ZodNumber>;
        topP: z.ZodOptional<z.ZodNumber>;
        enableThinking: z.ZodOptional<z.ZodBoolean>;
        frequencyPenalty: z.ZodOptional<z.ZodNumber>;
        presencePenalty: z.ZodOptional<z.ZodNumber>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        apiKey: z.ZodOptional<z.ZodString>;
        baseUrl: z.ZodOptional<z.ZodString>;
        model: z.ZodOptional<z.ZodString>;
        timeout: z.ZodOptional<z.ZodNumber>;
        temperature: z.ZodOptional<z.ZodNumber>;
        topP: z.ZodOptional<z.ZodNumber>;
        enableThinking: z.ZodOptional<z.ZodBoolean>;
        frequencyPenalty: z.ZodOptional<z.ZodNumber>;
        presencePenalty: z.ZodOptional<z.ZodNumber>;
    }, z.ZodTypeAny, "passthrough">>>>;
}, "strip", z.ZodTypeAny, {
    primary: string;
    fallback: string;
    providers: Record<string, z.objectOutputType<{
        apiKey: z.ZodOptional<z.ZodString>;
        baseUrl: z.ZodOptional<z.ZodString>;
        model: z.ZodOptional<z.ZodString>;
        timeout: z.ZodOptional<z.ZodNumber>;
        temperature: z.ZodOptional<z.ZodNumber>;
        topP: z.ZodOptional<z.ZodNumber>;
        enableThinking: z.ZodOptional<z.ZodBoolean>;
        frequencyPenalty: z.ZodOptional<z.ZodNumber>;
        presencePenalty: z.ZodOptional<z.ZodNumber>;
    }, z.ZodTypeAny, "passthrough">>;
    local?: string | undefined;
}, {
    primary: string;
    fallback: string;
    local?: string | undefined;
    providers?: Record<string, z.objectInputType<{
        apiKey: z.ZodOptional<z.ZodString>;
        baseUrl: z.ZodOptional<z.ZodString>;
        model: z.ZodOptional<z.ZodString>;
        timeout: z.ZodOptional<z.ZodNumber>;
        temperature: z.ZodOptional<z.ZodNumber>;
        topP: z.ZodOptional<z.ZodNumber>;
        enableThinking: z.ZodOptional<z.ZodBoolean>;
        frequencyPenalty: z.ZodOptional<z.ZodNumber>;
        presencePenalty: z.ZodOptional<z.ZodNumber>;
    }, z.ZodTypeAny, "passthrough">> | undefined;
}>;
declare const SkillsConfigSchema: z.ZodObject<{
    dirs: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    include: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    exclude: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
    dirs: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    include: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    exclude: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
    dirs: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    include: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    exclude: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, z.ZodTypeAny, "passthrough">>;
declare const SandboxConfigSchema: z.ZodObject<{
    enabled: z.ZodDefault<z.ZodBoolean>;
    docker: z.ZodDefault<z.ZodBoolean>;
    timeout: z.ZodDefault<z.ZodNumber>;
    maxMemory: z.ZodDefault<z.ZodString>;
    allowedCommands: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    timeout: number;
    enabled: boolean;
    docker: boolean;
    maxMemory: string;
    allowedCommands: string[];
}, {
    timeout?: number | undefined;
    enabled?: boolean | undefined;
    docker?: boolean | undefined;
    maxMemory?: string | undefined;
    allowedCommands?: string[] | undefined;
}>;
declare const PermissionsConfigSchema: z.ZodObject<{
    fileSystem: z.ZodDefault<z.ZodObject<{
        read: z.ZodDefault<z.ZodBoolean>;
        write: z.ZodDefault<z.ZodBoolean>;
        execute: z.ZodDefault<z.ZodBoolean>;
        delete: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        read: boolean;
        write: boolean;
        execute: boolean;
        delete: boolean;
    }, {
        read?: boolean | undefined;
        write?: boolean | undefined;
        execute?: boolean | undefined;
        delete?: boolean | undefined;
    }>>;
    network: z.ZodDefault<z.ZodObject<{
        http: z.ZodDefault<z.ZodBoolean>;
        https: z.ZodDefault<z.ZodBoolean>;
        websocket: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        http: boolean;
        https: boolean;
        websocket: boolean;
    }, {
        http?: boolean | undefined;
        https?: boolean | undefined;
        websocket?: boolean | undefined;
    }>>;
    system: z.ZodDefault<z.ZodObject<{
        shell: z.ZodDefault<z.ZodBoolean>;
        process: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        shell: boolean;
        process: boolean;
    }, {
        shell?: boolean | undefined;
        process?: boolean | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    fileSystem: {
        read: boolean;
        write: boolean;
        execute: boolean;
        delete: boolean;
    };
    network: {
        http: boolean;
        https: boolean;
        websocket: boolean;
    };
    system: {
        shell: boolean;
        process: boolean;
    };
}, {
    fileSystem?: {
        read?: boolean | undefined;
        write?: boolean | undefined;
        execute?: boolean | undefined;
        delete?: boolean | undefined;
    } | undefined;
    network?: {
        http?: boolean | undefined;
        https?: boolean | undefined;
        websocket?: boolean | undefined;
    } | undefined;
    system?: {
        shell?: boolean | undefined;
        process?: boolean | undefined;
    } | undefined;
}>;
declare const ToolsConfigSchema: z.ZodObject<{
    policy: z.ZodDefault<z.ZodEnum<["minimal", "coding", "messaging", "full", "balanced"]>>;
    sandbox: z.ZodDefault<z.ZodObject<{
        enabled: z.ZodDefault<z.ZodBoolean>;
        docker: z.ZodDefault<z.ZodBoolean>;
        timeout: z.ZodDefault<z.ZodNumber>;
        maxMemory: z.ZodDefault<z.ZodString>;
        allowedCommands: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        timeout: number;
        enabled: boolean;
        docker: boolean;
        maxMemory: string;
        allowedCommands: string[];
    }, {
        timeout?: number | undefined;
        enabled?: boolean | undefined;
        docker?: boolean | undefined;
        maxMemory?: string | undefined;
        allowedCommands?: string[] | undefined;
    }>>;
    permissions: z.ZodDefault<z.ZodObject<{
        fileSystem: z.ZodDefault<z.ZodObject<{
            read: z.ZodDefault<z.ZodBoolean>;
            write: z.ZodDefault<z.ZodBoolean>;
            execute: z.ZodDefault<z.ZodBoolean>;
            delete: z.ZodDefault<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            read: boolean;
            write: boolean;
            execute: boolean;
            delete: boolean;
        }, {
            read?: boolean | undefined;
            write?: boolean | undefined;
            execute?: boolean | undefined;
            delete?: boolean | undefined;
        }>>;
        network: z.ZodDefault<z.ZodObject<{
            http: z.ZodDefault<z.ZodBoolean>;
            https: z.ZodDefault<z.ZodBoolean>;
            websocket: z.ZodDefault<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            http: boolean;
            https: boolean;
            websocket: boolean;
        }, {
            http?: boolean | undefined;
            https?: boolean | undefined;
            websocket?: boolean | undefined;
        }>>;
        system: z.ZodDefault<z.ZodObject<{
            shell: z.ZodDefault<z.ZodBoolean>;
            process: z.ZodDefault<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            shell: boolean;
            process: boolean;
        }, {
            shell?: boolean | undefined;
            process?: boolean | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        fileSystem: {
            read: boolean;
            write: boolean;
            execute: boolean;
            delete: boolean;
        };
        network: {
            http: boolean;
            https: boolean;
            websocket: boolean;
        };
        system: {
            shell: boolean;
            process: boolean;
        };
    }, {
        fileSystem?: {
            read?: boolean | undefined;
            write?: boolean | undefined;
            execute?: boolean | undefined;
            delete?: boolean | undefined;
        } | undefined;
        network?: {
            http?: boolean | undefined;
            https?: boolean | undefined;
            websocket?: boolean | undefined;
        } | undefined;
        system?: {
            shell?: boolean | undefined;
            process?: boolean | undefined;
        } | undefined;
    }>>;
    extensions: z.ZodOptional<z.ZodArray<z.ZodObject<{
        type: z.ZodEnum<["mcp", "http", "custom"]>;
        name: z.ZodOptional<z.ZodString>;
        endpoint: z.ZodOptional<z.ZodString>;
        url: z.ZodOptional<z.ZodString>;
        method: z.ZodOptional<z.ZodString>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        type: z.ZodEnum<["mcp", "http", "custom"]>;
        name: z.ZodOptional<z.ZodString>;
        endpoint: z.ZodOptional<z.ZodString>;
        url: z.ZodOptional<z.ZodString>;
        method: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        type: z.ZodEnum<["mcp", "http", "custom"]>;
        name: z.ZodOptional<z.ZodString>;
        endpoint: z.ZodOptional<z.ZodString>;
        url: z.ZodOptional<z.ZodString>;
        method: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">>, "many">>;
    execUseLoginShell: z.ZodOptional<z.ZodBoolean>;
    formatResultWithLLM: z.ZodOptional<z.ZodBoolean>;
    autoExecuteParsedCalls: z.ZodOptional<z.ZodBoolean>;
    allowExecInChannels: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    policy: "minimal" | "coding" | "messaging" | "full" | "balanced";
    sandbox: {
        timeout: number;
        enabled: boolean;
        docker: boolean;
        maxMemory: string;
        allowedCommands: string[];
    };
    permissions: {
        fileSystem: {
            read: boolean;
            write: boolean;
            execute: boolean;
            delete: boolean;
        };
        network: {
            http: boolean;
            https: boolean;
            websocket: boolean;
        };
        system: {
            shell: boolean;
            process: boolean;
        };
    };
    extensions?: z.objectOutputType<{
        type: z.ZodEnum<["mcp", "http", "custom"]>;
        name: z.ZodOptional<z.ZodString>;
        endpoint: z.ZodOptional<z.ZodString>;
        url: z.ZodOptional<z.ZodString>;
        method: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">[] | undefined;
    execUseLoginShell?: boolean | undefined;
    formatResultWithLLM?: boolean | undefined;
    autoExecuteParsedCalls?: boolean | undefined;
    allowExecInChannels?: string[] | undefined;
}, {
    policy?: "minimal" | "coding" | "messaging" | "full" | "balanced" | undefined;
    sandbox?: {
        timeout?: number | undefined;
        enabled?: boolean | undefined;
        docker?: boolean | undefined;
        maxMemory?: string | undefined;
        allowedCommands?: string[] | undefined;
    } | undefined;
    permissions?: {
        fileSystem?: {
            read?: boolean | undefined;
            write?: boolean | undefined;
            execute?: boolean | undefined;
            delete?: boolean | undefined;
        } | undefined;
        network?: {
            http?: boolean | undefined;
            https?: boolean | undefined;
            websocket?: boolean | undefined;
        } | undefined;
        system?: {
            shell?: boolean | undefined;
            process?: boolean | undefined;
        } | undefined;
    } | undefined;
    extensions?: z.objectInputType<{
        type: z.ZodEnum<["mcp", "http", "custom"]>;
        name: z.ZodOptional<z.ZodString>;
        endpoint: z.ZodOptional<z.ZodString>;
        url: z.ZodOptional<z.ZodString>;
        method: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">[] | undefined;
    execUseLoginShell?: boolean | undefined;
    formatResultWithLLM?: boolean | undefined;
    autoExecuteParsedCalls?: boolean | undefined;
    allowExecInChannels?: string[] | undefined;
}>;
declare const SecurityConfigSchema: z.ZodObject<{
    auth: z.ZodDefault<z.ZodObject<{
        enabled: z.ZodDefault<z.ZodBoolean>;
        type: z.ZodDefault<z.ZodEnum<["none", "basic", "bearer", "oauth"]>>;
        token: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        type: "none" | "basic" | "bearer" | "oauth";
        enabled: boolean;
        token?: string | undefined;
    }, {
        type?: "none" | "basic" | "bearer" | "oauth" | undefined;
        enabled?: boolean | undefined;
        token?: string | undefined;
    }>>;
    rateLimit: z.ZodDefault<z.ZodObject<{
        enabled: z.ZodDefault<z.ZodBoolean>;
        windowMs: z.ZodDefault<z.ZodNumber>;
        maxRequests: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        enabled: boolean;
        windowMs: number;
        maxRequests: number;
    }, {
        enabled?: boolean | undefined;
        windowMs?: number | undefined;
        maxRequests?: number | undefined;
    }>>;
    cors: z.ZodDefault<z.ZodObject<{
        enabled: z.ZodDefault<z.ZodBoolean>;
        origins: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        credentials: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        enabled: boolean;
        origins: string[];
        credentials: boolean;
    }, {
        enabled?: boolean | undefined;
        origins?: string[] | undefined;
        credentials?: boolean | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    auth: {
        type: "none" | "basic" | "bearer" | "oauth";
        enabled: boolean;
        token?: string | undefined;
    };
    rateLimit: {
        enabled: boolean;
        windowMs: number;
        maxRequests: number;
    };
    cors: {
        enabled: boolean;
        origins: string[];
        credentials: boolean;
    };
}, {
    auth?: {
        type?: "none" | "basic" | "bearer" | "oauth" | undefined;
        enabled?: boolean | undefined;
        token?: string | undefined;
    } | undefined;
    rateLimit?: {
        enabled?: boolean | undefined;
        windowMs?: number | undefined;
        maxRequests?: number | undefined;
    } | undefined;
    cors?: {
        enabled?: boolean | undefined;
        origins?: string[] | undefined;
        credentials?: boolean | undefined;
    } | undefined;
}>;
declare const PerformanceConfigSchema: z.ZodObject<{
    skillsCache: z.ZodDefault<z.ZodObject<{
        maxSize: z.ZodDefault<z.ZodNumber>;
        ttl: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        maxSize: number;
        ttl: number;
    }, {
        maxSize?: number | undefined;
        ttl?: number | undefined;
    }>>;
    semanticSearch: z.ZodDefault<z.ZodObject<{
        enabled: z.ZodDefault<z.ZodBoolean>;
        threshold: z.ZodDefault<z.ZodNumber>;
        maxResults: z.ZodDefault<z.ZodNumber>;
        embedModel: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        enabled: boolean;
        threshold: number;
        maxResults: number;
        embedModel?: string | undefined;
    }, {
        enabled?: boolean | undefined;
        threshold?: number | undefined;
        maxResults?: number | undefined;
        embedModel?: string | undefined;
    }>>;
    streaming: z.ZodDefault<z.ZodObject<{
        enabled: z.ZodDefault<z.ZodBoolean>;
        chunkSize: z.ZodDefault<z.ZodNumber>;
        maxConcurrent: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        enabled: boolean;
        chunkSize: number;
        maxConcurrent: number;
    }, {
        enabled?: boolean | undefined;
        chunkSize?: number | undefined;
        maxConcurrent?: number | undefined;
    }>>;
    memory: z.ZodDefault<z.ZodObject<{
        maxHeapSize: z.ZodDefault<z.ZodString>;
        gcInterval: z.ZodDefault<z.ZodNumber>;
        sessionTimeout: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        maxHeapSize: string;
        gcInterval: number;
        sessionTimeout: number;
    }, {
        maxHeapSize?: string | undefined;
        gcInterval?: number | undefined;
        sessionTimeout?: number | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    skillsCache: {
        maxSize: number;
        ttl: number;
    };
    semanticSearch: {
        enabled: boolean;
        threshold: number;
        maxResults: number;
        embedModel?: string | undefined;
    };
    streaming: {
        enabled: boolean;
        chunkSize: number;
        maxConcurrent: number;
    };
    memory: {
        maxHeapSize: string;
        gcInterval: number;
        sessionTimeout: number;
    };
}, {
    skillsCache?: {
        maxSize?: number | undefined;
        ttl?: number | undefined;
    } | undefined;
    semanticSearch?: {
        enabled?: boolean | undefined;
        threshold?: number | undefined;
        maxResults?: number | undefined;
        embedModel?: string | undefined;
    } | undefined;
    streaming?: {
        enabled?: boolean | undefined;
        chunkSize?: number | undefined;
        maxConcurrent?: number | undefined;
    } | undefined;
    memory?: {
        maxHeapSize?: string | undefined;
        gcInterval?: number | undefined;
        sessionTimeout?: number | undefined;
    } | undefined;
}>;
declare const MemoryConfigSchema: z.ZodObject<{
    provider: z.ZodDefault<z.ZodString>;
    enabled: z.ZodDefault<z.ZodBoolean>;
    storageDir: z.ZodDefault<z.ZodString>;
    indexConversations: z.ZodDefault<z.ZodBoolean>;
    indexWorkspace: z.ZodDefault<z.ZodBoolean>;
    maxDocumentSizeMB: z.ZodDefault<z.ZodNumber>;
    maxRetrievalNodes: z.ZodDefault<z.ZodNumber>;
    chunkSize: z.ZodOptional<z.ZodNumber>;
    chunkOverlap: z.ZodOptional<z.ZodNumber>;
    llmReranking: z.ZodOptional<z.ZodBoolean>;
    queryExpansion: z.ZodOptional<z.ZodBoolean>;
    mmrLambda: z.ZodOptional<z.ZodNumber>;
    contextWindowLines: z.ZodOptional<z.ZodNumber>;
    graphRag: z.ZodOptional<z.ZodDefault<z.ZodObject<{
        enabled: z.ZodDefault<z.ZodBoolean>;
        entityExtraction: z.ZodDefault<z.ZodObject<{
            enabled: z.ZodDefault<z.ZodBoolean>;
            model: z.ZodOptional<z.ZodString>;
            batchSize: z.ZodDefault<z.ZodNumber>;
            maxEntitiesPerChunk: z.ZodDefault<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            enabled: boolean;
            batchSize: number;
            maxEntitiesPerChunk: number;
            model?: string | undefined;
        }, {
            model?: string | undefined;
            enabled?: boolean | undefined;
            batchSize?: number | undefined;
            maxEntitiesPerChunk?: number | undefined;
        }>>;
        communityDetection: z.ZodDefault<z.ZodObject<{
            enabled: z.ZodDefault<z.ZodBoolean>;
            algorithm: z.ZodDefault<z.ZodEnum<["leiden", "louvain"]>>;
            resolution: z.ZodDefault<z.ZodNumber>;
            levels: z.ZodDefault<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            enabled: boolean;
            algorithm: "leiden" | "louvain";
            resolution: number;
            levels: number;
        }, {
            enabled?: boolean | undefined;
            algorithm?: "leiden" | "louvain" | undefined;
            resolution?: number | undefined;
            levels?: number | undefined;
        }>>;
        queryStrategy: z.ZodDefault<z.ZodObject<{
            directorLevel: z.ZodDefault<z.ZodEnum<["community", "entity", "chunk"]>>;
            workerLevel: z.ZodDefault<z.ZodEnum<["chunk", "entity"]>>;
        }, "strip", z.ZodTypeAny, {
            directorLevel: "community" | "entity" | "chunk";
            workerLevel: "entity" | "chunk";
        }, {
            directorLevel?: "community" | "entity" | "chunk" | undefined;
            workerLevel?: "entity" | "chunk" | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        enabled: boolean;
        entityExtraction: {
            enabled: boolean;
            batchSize: number;
            maxEntitiesPerChunk: number;
            model?: string | undefined;
        };
        communityDetection: {
            enabled: boolean;
            algorithm: "leiden" | "louvain";
            resolution: number;
            levels: number;
        };
        queryStrategy: {
            directorLevel: "community" | "entity" | "chunk";
            workerLevel: "entity" | "chunk";
        };
    }, {
        enabled?: boolean | undefined;
        entityExtraction?: {
            model?: string | undefined;
            enabled?: boolean | undefined;
            batchSize?: number | undefined;
            maxEntitiesPerChunk?: number | undefined;
        } | undefined;
        communityDetection?: {
            enabled?: boolean | undefined;
            algorithm?: "leiden" | "louvain" | undefined;
            resolution?: number | undefined;
            levels?: number | undefined;
        } | undefined;
        queryStrategy?: {
            directorLevel?: "community" | "entity" | "chunk" | undefined;
            workerLevel?: "entity" | "chunk" | undefined;
        } | undefined;
    }>>>;
    hybridRetrieval: z.ZodOptional<z.ZodDefault<z.ZodObject<{
        bm25Weight: z.ZodDefault<z.ZodNumber>;
        vectorWeight: z.ZodDefault<z.ZodNumber>;
        graphWeight: z.ZodDefault<z.ZodNumber>;
        rerankWithLLM: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        bm25Weight: number;
        vectorWeight: number;
        graphWeight: number;
        rerankWithLLM: boolean;
    }, {
        bm25Weight?: number | undefined;
        vectorWeight?: number | undefined;
        graphWeight?: number | undefined;
        rerankWithLLM?: boolean | undefined;
    }>>>;
}, "strip", z.ZodTypeAny, {
    enabled: boolean;
    provider: string;
    storageDir: string;
    indexConversations: boolean;
    indexWorkspace: boolean;
    maxDocumentSizeMB: number;
    maxRetrievalNodes: number;
    chunkSize?: number | undefined;
    chunkOverlap?: number | undefined;
    llmReranking?: boolean | undefined;
    queryExpansion?: boolean | undefined;
    mmrLambda?: number | undefined;
    contextWindowLines?: number | undefined;
    graphRag?: {
        enabled: boolean;
        entityExtraction: {
            enabled: boolean;
            batchSize: number;
            maxEntitiesPerChunk: number;
            model?: string | undefined;
        };
        communityDetection: {
            enabled: boolean;
            algorithm: "leiden" | "louvain";
            resolution: number;
            levels: number;
        };
        queryStrategy: {
            directorLevel: "community" | "entity" | "chunk";
            workerLevel: "entity" | "chunk";
        };
    } | undefined;
    hybridRetrieval?: {
        bm25Weight: number;
        vectorWeight: number;
        graphWeight: number;
        rerankWithLLM: boolean;
    } | undefined;
}, {
    enabled?: boolean | undefined;
    chunkSize?: number | undefined;
    provider?: string | undefined;
    storageDir?: string | undefined;
    indexConversations?: boolean | undefined;
    indexWorkspace?: boolean | undefined;
    maxDocumentSizeMB?: number | undefined;
    maxRetrievalNodes?: number | undefined;
    chunkOverlap?: number | undefined;
    llmReranking?: boolean | undefined;
    queryExpansion?: boolean | undefined;
    mmrLambda?: number | undefined;
    contextWindowLines?: number | undefined;
    graphRag?: {
        enabled?: boolean | undefined;
        entityExtraction?: {
            model?: string | undefined;
            enabled?: boolean | undefined;
            batchSize?: number | undefined;
            maxEntitiesPerChunk?: number | undefined;
        } | undefined;
        communityDetection?: {
            enabled?: boolean | undefined;
            algorithm?: "leiden" | "louvain" | undefined;
            resolution?: number | undefined;
            levels?: number | undefined;
        } | undefined;
        queryStrategy?: {
            directorLevel?: "community" | "entity" | "chunk" | undefined;
            workerLevel?: "entity" | "chunk" | undefined;
        } | undefined;
    } | undefined;
    hybridRetrieval?: {
        bm25Weight?: number | undefined;
        vectorWeight?: number | undefined;
        graphWeight?: number | undefined;
        rerankWithLLM?: boolean | undefined;
    } | undefined;
}>;
declare const ChannelAccountConfigSchema: z.ZodObject<{
    enabled: z.ZodOptional<z.ZodBoolean>;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
    enabled: z.ZodOptional<z.ZodBoolean>;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
    enabled: z.ZodOptional<z.ZodBoolean>;
}, z.ZodTypeAny, "passthrough">>;
declare const ChannelDetailConfigSchema: z.ZodObject<{
    accounts: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
        enabled: z.ZodOptional<z.ZodBoolean>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        enabled: z.ZodOptional<z.ZodBoolean>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        enabled: z.ZodOptional<z.ZodBoolean>;
    }, z.ZodTypeAny, "passthrough">>>>;
    dmPolicy: z.ZodOptional<z.ZodEnum<["open", "closed", "allowlist"]>>;
    allowFrom: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
    accounts: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
        enabled: z.ZodOptional<z.ZodBoolean>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        enabled: z.ZodOptional<z.ZodBoolean>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        enabled: z.ZodOptional<z.ZodBoolean>;
    }, z.ZodTypeAny, "passthrough">>>>;
    dmPolicy: z.ZodOptional<z.ZodEnum<["open", "closed", "allowlist"]>>;
    allowFrom: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
    accounts: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
        enabled: z.ZodOptional<z.ZodBoolean>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        enabled: z.ZodOptional<z.ZodBoolean>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        enabled: z.ZodOptional<z.ZodBoolean>;
    }, z.ZodTypeAny, "passthrough">>>>;
    dmPolicy: z.ZodOptional<z.ZodEnum<["open", "closed", "allowlist"]>>;
    allowFrom: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, z.ZodTypeAny, "passthrough">>;
declare const ChannelsConfigSchema: z.ZodDefault<z.ZodObject<{
    enabled: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
    enabled: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
    enabled: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
}, z.ZodTypeAny, "passthrough">>>;
declare const PluginEntrySchema: z.ZodObject<{
    enabled: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    enabled: boolean;
}, {
    enabled: boolean;
}>;
declare const PluginInstallSchema: z.ZodObject<{
    source: z.ZodString;
    sourcePath: z.ZodOptional<z.ZodString>;
    installPath: z.ZodOptional<z.ZodString>;
    version: z.ZodOptional<z.ZodString>;
    installedAt: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    source: string;
    sourcePath?: string | undefined;
    installPath?: string | undefined;
    version?: string | undefined;
    installedAt?: string | undefined;
}, {
    source: string;
    sourcePath?: string | undefined;
    installPath?: string | undefined;
    version?: string | undefined;
    installedAt?: string | undefined;
}>;
declare const PluginsConfigSchema: z.ZodObject<{
    entries: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
        enabled: z.ZodBoolean;
    }, "strip", z.ZodTypeAny, {
        enabled: boolean;
    }, {
        enabled: boolean;
    }>>>;
    installs: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
        source: z.ZodString;
        sourcePath: z.ZodOptional<z.ZodString>;
        installPath: z.ZodOptional<z.ZodString>;
        version: z.ZodOptional<z.ZodString>;
        installedAt: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        source: string;
        sourcePath?: string | undefined;
        installPath?: string | undefined;
        version?: string | undefined;
        installedAt?: string | undefined;
    }, {
        source: string;
        sourcePath?: string | undefined;
        installPath?: string | undefined;
        version?: string | undefined;
        installedAt?: string | undefined;
    }>>>;
    allow: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    entries?: Record<string, {
        enabled: boolean;
    }> | undefined;
    installs?: Record<string, {
        source: string;
        sourcePath?: string | undefined;
        installPath?: string | undefined;
        version?: string | undefined;
        installedAt?: string | undefined;
    }> | undefined;
    allow?: string[] | undefined;
}, {
    entries?: Record<string, {
        enabled: boolean;
    }> | undefined;
    installs?: Record<string, {
        source: string;
        sourcePath?: string | undefined;
        installPath?: string | undefined;
        version?: string | undefined;
        installedAt?: string | undefined;
    }> | undefined;
    allow?: string[] | undefined;
}>;
declare const UserConfigMetaSchema: z.ZodObject<{
    lastTouchedVersion: z.ZodOptional<z.ZodString>;
    lastTouchedAt: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    lastTouchedVersion?: string | undefined;
    lastTouchedAt?: string | undefined;
}, {
    lastTouchedVersion?: string | undefined;
    lastTouchedAt?: string | undefined;
}>;
declare const UserConfigSchema: z.ZodObject<{
    meta: z.ZodOptional<z.ZodObject<{
        lastTouchedVersion: z.ZodOptional<z.ZodString>;
        lastTouchedAt: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        lastTouchedVersion?: string | undefined;
        lastTouchedAt?: string | undefined;
    }, {
        lastTouchedVersion?: string | undefined;
        lastTouchedAt?: string | undefined;
    }>>;
    channels: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
        accounts: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
            enabled: z.ZodOptional<z.ZodBoolean>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            enabled: z.ZodOptional<z.ZodBoolean>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            enabled: z.ZodOptional<z.ZodBoolean>;
        }, z.ZodTypeAny, "passthrough">>>>;
        dmPolicy: z.ZodOptional<z.ZodEnum<["open", "closed", "allowlist"]>>;
        allowFrom: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        accounts: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
            enabled: z.ZodOptional<z.ZodBoolean>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            enabled: z.ZodOptional<z.ZodBoolean>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            enabled: z.ZodOptional<z.ZodBoolean>;
        }, z.ZodTypeAny, "passthrough">>>>;
        dmPolicy: z.ZodOptional<z.ZodEnum<["open", "closed", "allowlist"]>>;
        allowFrom: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        accounts: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
            enabled: z.ZodOptional<z.ZodBoolean>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            enabled: z.ZodOptional<z.ZodBoolean>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            enabled: z.ZodOptional<z.ZodBoolean>;
        }, z.ZodTypeAny, "passthrough">>>>;
        dmPolicy: z.ZodOptional<z.ZodEnum<["open", "closed", "allowlist"]>>;
        allowFrom: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, z.ZodTypeAny, "passthrough">>>>;
    plugins: z.ZodOptional<z.ZodObject<{
        entries: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
            enabled: z.ZodBoolean;
        }, "strip", z.ZodTypeAny, {
            enabled: boolean;
        }, {
            enabled: boolean;
        }>>>;
        installs: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
            source: z.ZodString;
            sourcePath: z.ZodOptional<z.ZodString>;
            installPath: z.ZodOptional<z.ZodString>;
            version: z.ZodOptional<z.ZodString>;
            installedAt: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            source: string;
            sourcePath?: string | undefined;
            installPath?: string | undefined;
            version?: string | undefined;
            installedAt?: string | undefined;
        }, {
            source: string;
            sourcePath?: string | undefined;
            installPath?: string | undefined;
            version?: string | undefined;
            installedAt?: string | undefined;
        }>>>;
        allow: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        entries?: Record<string, {
            enabled: boolean;
        }> | undefined;
        installs?: Record<string, {
            source: string;
            sourcePath?: string | undefined;
            installPath?: string | undefined;
            version?: string | undefined;
            installedAt?: string | undefined;
        }> | undefined;
        allow?: string[] | undefined;
    }, {
        entries?: Record<string, {
            enabled: boolean;
        }> | undefined;
        installs?: Record<string, {
            source: string;
            sourcePath?: string | undefined;
            installPath?: string | undefined;
            version?: string | undefined;
            installedAt?: string | undefined;
        }> | undefined;
        allow?: string[] | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    meta?: {
        lastTouchedVersion?: string | undefined;
        lastTouchedAt?: string | undefined;
    } | undefined;
    channels?: Record<string, z.objectOutputType<{
        accounts: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
            enabled: z.ZodOptional<z.ZodBoolean>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            enabled: z.ZodOptional<z.ZodBoolean>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            enabled: z.ZodOptional<z.ZodBoolean>;
        }, z.ZodTypeAny, "passthrough">>>>;
        dmPolicy: z.ZodOptional<z.ZodEnum<["open", "closed", "allowlist"]>>;
        allowFrom: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, z.ZodTypeAny, "passthrough">> | undefined;
    plugins?: {
        entries?: Record<string, {
            enabled: boolean;
        }> | undefined;
        installs?: Record<string, {
            source: string;
            sourcePath?: string | undefined;
            installPath?: string | undefined;
            version?: string | undefined;
            installedAt?: string | undefined;
        }> | undefined;
        allow?: string[] | undefined;
    } | undefined;
}, {
    meta?: {
        lastTouchedVersion?: string | undefined;
        lastTouchedAt?: string | undefined;
    } | undefined;
    channels?: Record<string, z.objectInputType<{
        accounts: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
            enabled: z.ZodOptional<z.ZodBoolean>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            enabled: z.ZodOptional<z.ZodBoolean>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            enabled: z.ZodOptional<z.ZodBoolean>;
        }, z.ZodTypeAny, "passthrough">>>>;
        dmPolicy: z.ZodOptional<z.ZodEnum<["open", "closed", "allowlist"]>>;
        allowFrom: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, z.ZodTypeAny, "passthrough">> | undefined;
    plugins?: {
        entries?: Record<string, {
            enabled: boolean;
        }> | undefined;
        installs?: Record<string, {
            source: string;
            sourcePath?: string | undefined;
            installPath?: string | undefined;
            version?: string | undefined;
            installedAt?: string | undefined;
        }> | undefined;
        allow?: string[] | undefined;
    } | undefined;
}>;
declare const MCPServerRequestInitSchema: z.ZodObject<{
    headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    method: z.ZodOptional<z.ZodEnum<["GET", "HEAD", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"]>>;
    credentials: z.ZodOptional<z.ZodEnum<["omit", "same-origin", "include"]>>;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
    headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    method: z.ZodOptional<z.ZodEnum<["GET", "HEAD", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"]>>;
    credentials: z.ZodOptional<z.ZodEnum<["omit", "same-origin", "include"]>>;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
    headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    method: z.ZodOptional<z.ZodEnum<["GET", "HEAD", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"]>>;
    credentials: z.ZodOptional<z.ZodEnum<["omit", "same-origin", "include"]>>;
}, z.ZodTypeAny, "passthrough">>;
declare const MCPServerEntrySchema: z.ZodObject<{
    endpoint: z.ZodString;
    transport: z.ZodOptional<z.ZodEnum<["http", "sse", "stdio"]>>;
    command: z.ZodOptional<z.ZodString>;
    args: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    requestInit: z.ZodOptional<z.ZodObject<{
        headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
        method: z.ZodOptional<z.ZodEnum<["GET", "HEAD", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"]>>;
        credentials: z.ZodOptional<z.ZodEnum<["omit", "same-origin", "include"]>>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
        method: z.ZodOptional<z.ZodEnum<["GET", "HEAD", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"]>>;
        credentials: z.ZodOptional<z.ZodEnum<["omit", "same-origin", "include"]>>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
        method: z.ZodOptional<z.ZodEnum<["GET", "HEAD", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"]>>;
        credentials: z.ZodOptional<z.ZodEnum<["omit", "same-origin", "include"]>>;
    }, z.ZodTypeAny, "passthrough">>>;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
    endpoint: z.ZodString;
    transport: z.ZodOptional<z.ZodEnum<["http", "sse", "stdio"]>>;
    command: z.ZodOptional<z.ZodString>;
    args: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    requestInit: z.ZodOptional<z.ZodObject<{
        headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
        method: z.ZodOptional<z.ZodEnum<["GET", "HEAD", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"]>>;
        credentials: z.ZodOptional<z.ZodEnum<["omit", "same-origin", "include"]>>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
        method: z.ZodOptional<z.ZodEnum<["GET", "HEAD", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"]>>;
        credentials: z.ZodOptional<z.ZodEnum<["omit", "same-origin", "include"]>>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
        method: z.ZodOptional<z.ZodEnum<["GET", "HEAD", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"]>>;
        credentials: z.ZodOptional<z.ZodEnum<["omit", "same-origin", "include"]>>;
    }, z.ZodTypeAny, "passthrough">>>;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
    endpoint: z.ZodString;
    transport: z.ZodOptional<z.ZodEnum<["http", "sse", "stdio"]>>;
    command: z.ZodOptional<z.ZodString>;
    args: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    requestInit: z.ZodOptional<z.ZodObject<{
        headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
        method: z.ZodOptional<z.ZodEnum<["GET", "HEAD", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"]>>;
        credentials: z.ZodOptional<z.ZodEnum<["omit", "same-origin", "include"]>>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
        method: z.ZodOptional<z.ZodEnum<["GET", "HEAD", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"]>>;
        credentials: z.ZodOptional<z.ZodEnum<["omit", "same-origin", "include"]>>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
        method: z.ZodOptional<z.ZodEnum<["GET", "HEAD", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"]>>;
        credentials: z.ZodOptional<z.ZodEnum<["omit", "same-origin", "include"]>>;
    }, z.ZodTypeAny, "passthrough">>>;
}, z.ZodTypeAny, "passthrough">>;
declare const NovaClawConfigSchema: z.ZodObject<{
    port: z.ZodDefault<z.ZodNumber>;
    bind: z.ZodDefault<z.ZodString>;
    workspaceDir: z.ZodString;
    models: z.ZodObject<{
        primary: z.ZodString;
        fallback: z.ZodString;
        local: z.ZodOptional<z.ZodString>;
        providers: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodObject<{
            apiKey: z.ZodOptional<z.ZodString>;
            baseUrl: z.ZodOptional<z.ZodString>;
            model: z.ZodOptional<z.ZodString>;
            timeout: z.ZodOptional<z.ZodNumber>;
            temperature: z.ZodOptional<z.ZodNumber>;
            topP: z.ZodOptional<z.ZodNumber>;
            enableThinking: z.ZodOptional<z.ZodBoolean>;
            frequencyPenalty: z.ZodOptional<z.ZodNumber>;
            presencePenalty: z.ZodOptional<z.ZodNumber>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            apiKey: z.ZodOptional<z.ZodString>;
            baseUrl: z.ZodOptional<z.ZodString>;
            model: z.ZodOptional<z.ZodString>;
            timeout: z.ZodOptional<z.ZodNumber>;
            temperature: z.ZodOptional<z.ZodNumber>;
            topP: z.ZodOptional<z.ZodNumber>;
            enableThinking: z.ZodOptional<z.ZodBoolean>;
            frequencyPenalty: z.ZodOptional<z.ZodNumber>;
            presencePenalty: z.ZodOptional<z.ZodNumber>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            apiKey: z.ZodOptional<z.ZodString>;
            baseUrl: z.ZodOptional<z.ZodString>;
            model: z.ZodOptional<z.ZodString>;
            timeout: z.ZodOptional<z.ZodNumber>;
            temperature: z.ZodOptional<z.ZodNumber>;
            topP: z.ZodOptional<z.ZodNumber>;
            enableThinking: z.ZodOptional<z.ZodBoolean>;
            frequencyPenalty: z.ZodOptional<z.ZodNumber>;
            presencePenalty: z.ZodOptional<z.ZodNumber>;
        }, z.ZodTypeAny, "passthrough">>>>;
    }, "strip", z.ZodTypeAny, {
        primary: string;
        fallback: string;
        providers: Record<string, z.objectOutputType<{
            apiKey: z.ZodOptional<z.ZodString>;
            baseUrl: z.ZodOptional<z.ZodString>;
            model: z.ZodOptional<z.ZodString>;
            timeout: z.ZodOptional<z.ZodNumber>;
            temperature: z.ZodOptional<z.ZodNumber>;
            topP: z.ZodOptional<z.ZodNumber>;
            enableThinking: z.ZodOptional<z.ZodBoolean>;
            frequencyPenalty: z.ZodOptional<z.ZodNumber>;
            presencePenalty: z.ZodOptional<z.ZodNumber>;
        }, z.ZodTypeAny, "passthrough">>;
        local?: string | undefined;
    }, {
        primary: string;
        fallback: string;
        local?: string | undefined;
        providers?: Record<string, z.objectInputType<{
            apiKey: z.ZodOptional<z.ZodString>;
            baseUrl: z.ZodOptional<z.ZodString>;
            model: z.ZodOptional<z.ZodString>;
            timeout: z.ZodOptional<z.ZodNumber>;
            temperature: z.ZodOptional<z.ZodNumber>;
            topP: z.ZodOptional<z.ZodNumber>;
            enableThinking: z.ZodOptional<z.ZodBoolean>;
            frequencyPenalty: z.ZodOptional<z.ZodNumber>;
            presencePenalty: z.ZodOptional<z.ZodNumber>;
        }, z.ZodTypeAny, "passthrough">> | undefined;
    }>;
    agent: z.ZodDefault<z.ZodObject<{
        maxTurns: z.ZodDefault<z.ZodNumber>;
        toolResultContextMax: z.ZodDefault<z.ZodNumber>;
        messageTimeoutMs: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        maxTurns: number;
        toolResultContextMax: number;
        messageTimeoutMs: number;
    }, {
        maxTurns?: number | undefined;
        toolResultContextMax?: number | undefined;
        messageTimeoutMs?: number | undefined;
    }>>;
    agents: z.ZodOptional<z.ZodObject<{
        mode: z.ZodDefault<z.ZodEnum<["single", "multi"]>>;
        director: z.ZodDefault<z.ZodObject<{
            model: z.ZodOptional<z.ZodString>;
            maxTurns: z.ZodDefault<z.ZodNumber>;
            directResponse: z.ZodDefault<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            maxTurns: number;
            directResponse: boolean;
            model?: string | undefined;
        }, {
            model?: string | undefined;
            maxTurns?: number | undefined;
            directResponse?: boolean | undefined;
        }>>;
        workers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
            enabled: z.ZodDefault<z.ZodBoolean>;
            model: z.ZodOptional<z.ZodString>;
            maxTurns: z.ZodOptional<z.ZodNumber>;
            tools: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            skillDomains: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            enabled: z.ZodDefault<z.ZodBoolean>;
            model: z.ZodOptional<z.ZodString>;
            maxTurns: z.ZodOptional<z.ZodNumber>;
            tools: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            skillDomains: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            enabled: z.ZodDefault<z.ZodBoolean>;
            model: z.ZodOptional<z.ZodString>;
            maxTurns: z.ZodOptional<z.ZodNumber>;
            tools: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            skillDomains: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        }, z.ZodTypeAny, "passthrough">>>>;
        pool: z.ZodDefault<z.ZodObject<{
            maxIdleTime: z.ZodDefault<z.ZodNumber>;
            maxConcurrent: z.ZodDefault<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            maxConcurrent: number;
            maxIdleTime: number;
        }, {
            maxConcurrent?: number | undefined;
            maxIdleTime?: number | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        mode: "single" | "multi";
        director: {
            maxTurns: number;
            directResponse: boolean;
            model?: string | undefined;
        };
        pool: {
            maxConcurrent: number;
            maxIdleTime: number;
        };
        workers?: Record<string, z.objectOutputType<{
            enabled: z.ZodDefault<z.ZodBoolean>;
            model: z.ZodOptional<z.ZodString>;
            maxTurns: z.ZodOptional<z.ZodNumber>;
            tools: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            skillDomains: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        }, z.ZodTypeAny, "passthrough">> | undefined;
    }, {
        mode?: "single" | "multi" | undefined;
        director?: {
            model?: string | undefined;
            maxTurns?: number | undefined;
            directResponse?: boolean | undefined;
        } | undefined;
        workers?: Record<string, z.objectInputType<{
            enabled: z.ZodDefault<z.ZodBoolean>;
            model: z.ZodOptional<z.ZodString>;
            maxTurns: z.ZodOptional<z.ZodNumber>;
            tools: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            skillDomains: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        }, z.ZodTypeAny, "passthrough">> | undefined;
        pool?: {
            maxConcurrent?: number | undefined;
            maxIdleTime?: number | undefined;
        } | undefined;
    }>>;
    rules: z.ZodOptional<z.ZodObject<{
        builtin: z.ZodOptional<z.ZodDefault<z.ZodObject<{
            'exec-channel-allowlist': z.ZodDefault<z.ZodBoolean>;
            'content-safety': z.ZodDefault<z.ZodBoolean>;
            'input-sanitize': z.ZodDefault<z.ZodBoolean>;
            'format-channel-adapt': z.ZodDefault<z.ZodBoolean>;
            'citation-enforce': z.ZodDefault<z.ZodBoolean>;
            'thinking-strip': z.ZodDefault<z.ZodBoolean>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            'exec-channel-allowlist': z.ZodDefault<z.ZodBoolean>;
            'content-safety': z.ZodDefault<z.ZodBoolean>;
            'input-sanitize': z.ZodDefault<z.ZodBoolean>;
            'format-channel-adapt': z.ZodDefault<z.ZodBoolean>;
            'citation-enforce': z.ZodDefault<z.ZodBoolean>;
            'thinking-strip': z.ZodDefault<z.ZodBoolean>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            'exec-channel-allowlist': z.ZodDefault<z.ZodBoolean>;
            'content-safety': z.ZodDefault<z.ZodBoolean>;
            'input-sanitize': z.ZodDefault<z.ZodBoolean>;
            'format-channel-adapt': z.ZodDefault<z.ZodBoolean>;
            'citation-enforce': z.ZodDefault<z.ZodBoolean>;
            'thinking-strip': z.ZodDefault<z.ZodBoolean>;
        }, z.ZodTypeAny, "passthrough">>>>;
        output: z.ZodOptional<z.ZodObject<{
            channelFormats: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
                format: z.ZodOptional<z.ZodString>;
                maxLength: z.ZodOptional<z.ZodNumber>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                format: z.ZodOptional<z.ZodString>;
                maxLength: z.ZodOptional<z.ZodNumber>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                format: z.ZodOptional<z.ZodString>;
                maxLength: z.ZodOptional<z.ZodNumber>;
            }, z.ZodTypeAny, "passthrough">>>>;
            tone: z.ZodOptional<z.ZodString>;
            piiFilter: z.ZodOptional<z.ZodObject<{
                enabled: z.ZodDefault<z.ZodBoolean>;
            }, "strip", z.ZodTypeAny, {
                enabled: boolean;
            }, {
                enabled?: boolean | undefined;
            }>>;
        }, "strip", z.ZodTypeAny, {
            channelFormats?: Record<string, z.objectOutputType<{
                format: z.ZodOptional<z.ZodString>;
                maxLength: z.ZodOptional<z.ZodNumber>;
            }, z.ZodTypeAny, "passthrough">> | undefined;
            tone?: string | undefined;
            piiFilter?: {
                enabled: boolean;
            } | undefined;
        }, {
            channelFormats?: Record<string, z.objectInputType<{
                format: z.ZodOptional<z.ZodString>;
                maxLength: z.ZodOptional<z.ZodNumber>;
            }, z.ZodTypeAny, "passthrough">> | undefined;
            tone?: string | undefined;
            piiFilter?: {
                enabled?: boolean | undefined;
            } | undefined;
        }>>;
        custom: z.ZodOptional<z.ZodArray<z.ZodObject<{
            path: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            path: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            path: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>, "many">>;
    }, "strip", z.ZodTypeAny, {
        custom?: z.objectOutputType<{
            path: z.ZodString;
        }, z.ZodTypeAny, "passthrough">[] | undefined;
        builtin?: z.objectOutputType<{
            'exec-channel-allowlist': z.ZodDefault<z.ZodBoolean>;
            'content-safety': z.ZodDefault<z.ZodBoolean>;
            'input-sanitize': z.ZodDefault<z.ZodBoolean>;
            'format-channel-adapt': z.ZodDefault<z.ZodBoolean>;
            'citation-enforce': z.ZodDefault<z.ZodBoolean>;
            'thinking-strip': z.ZodDefault<z.ZodBoolean>;
        }, z.ZodTypeAny, "passthrough"> | undefined;
        output?: {
            channelFormats?: Record<string, z.objectOutputType<{
                format: z.ZodOptional<z.ZodString>;
                maxLength: z.ZodOptional<z.ZodNumber>;
            }, z.ZodTypeAny, "passthrough">> | undefined;
            tone?: string | undefined;
            piiFilter?: {
                enabled: boolean;
            } | undefined;
        } | undefined;
    }, {
        custom?: z.objectInputType<{
            path: z.ZodString;
        }, z.ZodTypeAny, "passthrough">[] | undefined;
        builtin?: z.objectInputType<{
            'exec-channel-allowlist': z.ZodDefault<z.ZodBoolean>;
            'content-safety': z.ZodDefault<z.ZodBoolean>;
            'input-sanitize': z.ZodDefault<z.ZodBoolean>;
            'format-channel-adapt': z.ZodDefault<z.ZodBoolean>;
            'citation-enforce': z.ZodDefault<z.ZodBoolean>;
            'thinking-strip': z.ZodDefault<z.ZodBoolean>;
        }, z.ZodTypeAny, "passthrough"> | undefined;
        output?: {
            channelFormats?: Record<string, z.objectInputType<{
                format: z.ZodOptional<z.ZodString>;
                maxLength: z.ZodOptional<z.ZodNumber>;
            }, z.ZodTypeAny, "passthrough">> | undefined;
            tone?: string | undefined;
            piiFilter?: {
                enabled?: boolean | undefined;
            } | undefined;
        } | undefined;
    }>>;
    skills: z.ZodDefault<z.ZodObject<{
        dirs: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        include: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        exclude: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        dirs: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        include: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        exclude: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        dirs: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        include: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        exclude: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, z.ZodTypeAny, "passthrough">>>;
    tools: z.ZodDefault<z.ZodObject<{
        policy: z.ZodDefault<z.ZodEnum<["minimal", "coding", "messaging", "full", "balanced"]>>;
        sandbox: z.ZodDefault<z.ZodObject<{
            enabled: z.ZodDefault<z.ZodBoolean>;
            docker: z.ZodDefault<z.ZodBoolean>;
            timeout: z.ZodDefault<z.ZodNumber>;
            maxMemory: z.ZodDefault<z.ZodString>;
            allowedCommands: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        }, "strip", z.ZodTypeAny, {
            timeout: number;
            enabled: boolean;
            docker: boolean;
            maxMemory: string;
            allowedCommands: string[];
        }, {
            timeout?: number | undefined;
            enabled?: boolean | undefined;
            docker?: boolean | undefined;
            maxMemory?: string | undefined;
            allowedCommands?: string[] | undefined;
        }>>;
        permissions: z.ZodDefault<z.ZodObject<{
            fileSystem: z.ZodDefault<z.ZodObject<{
                read: z.ZodDefault<z.ZodBoolean>;
                write: z.ZodDefault<z.ZodBoolean>;
                execute: z.ZodDefault<z.ZodBoolean>;
                delete: z.ZodDefault<z.ZodBoolean>;
            }, "strip", z.ZodTypeAny, {
                read: boolean;
                write: boolean;
                execute: boolean;
                delete: boolean;
            }, {
                read?: boolean | undefined;
                write?: boolean | undefined;
                execute?: boolean | undefined;
                delete?: boolean | undefined;
            }>>;
            network: z.ZodDefault<z.ZodObject<{
                http: z.ZodDefault<z.ZodBoolean>;
                https: z.ZodDefault<z.ZodBoolean>;
                websocket: z.ZodDefault<z.ZodBoolean>;
            }, "strip", z.ZodTypeAny, {
                http: boolean;
                https: boolean;
                websocket: boolean;
            }, {
                http?: boolean | undefined;
                https?: boolean | undefined;
                websocket?: boolean | undefined;
            }>>;
            system: z.ZodDefault<z.ZodObject<{
                shell: z.ZodDefault<z.ZodBoolean>;
                process: z.ZodDefault<z.ZodBoolean>;
            }, "strip", z.ZodTypeAny, {
                shell: boolean;
                process: boolean;
            }, {
                shell?: boolean | undefined;
                process?: boolean | undefined;
            }>>;
        }, "strip", z.ZodTypeAny, {
            fileSystem: {
                read: boolean;
                write: boolean;
                execute: boolean;
                delete: boolean;
            };
            network: {
                http: boolean;
                https: boolean;
                websocket: boolean;
            };
            system: {
                shell: boolean;
                process: boolean;
            };
        }, {
            fileSystem?: {
                read?: boolean | undefined;
                write?: boolean | undefined;
                execute?: boolean | undefined;
                delete?: boolean | undefined;
            } | undefined;
            network?: {
                http?: boolean | undefined;
                https?: boolean | undefined;
                websocket?: boolean | undefined;
            } | undefined;
            system?: {
                shell?: boolean | undefined;
                process?: boolean | undefined;
            } | undefined;
        }>>;
        extensions: z.ZodOptional<z.ZodArray<z.ZodObject<{
            type: z.ZodEnum<["mcp", "http", "custom"]>;
            name: z.ZodOptional<z.ZodString>;
            endpoint: z.ZodOptional<z.ZodString>;
            url: z.ZodOptional<z.ZodString>;
            method: z.ZodOptional<z.ZodString>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            type: z.ZodEnum<["mcp", "http", "custom"]>;
            name: z.ZodOptional<z.ZodString>;
            endpoint: z.ZodOptional<z.ZodString>;
            url: z.ZodOptional<z.ZodString>;
            method: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            type: z.ZodEnum<["mcp", "http", "custom"]>;
            name: z.ZodOptional<z.ZodString>;
            endpoint: z.ZodOptional<z.ZodString>;
            url: z.ZodOptional<z.ZodString>;
            method: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">>, "many">>;
        execUseLoginShell: z.ZodOptional<z.ZodBoolean>;
        formatResultWithLLM: z.ZodOptional<z.ZodBoolean>;
        autoExecuteParsedCalls: z.ZodOptional<z.ZodBoolean>;
        allowExecInChannels: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        policy: "minimal" | "coding" | "messaging" | "full" | "balanced";
        sandbox: {
            timeout: number;
            enabled: boolean;
            docker: boolean;
            maxMemory: string;
            allowedCommands: string[];
        };
        permissions: {
            fileSystem: {
                read: boolean;
                write: boolean;
                execute: boolean;
                delete: boolean;
            };
            network: {
                http: boolean;
                https: boolean;
                websocket: boolean;
            };
            system: {
                shell: boolean;
                process: boolean;
            };
        };
        extensions?: z.objectOutputType<{
            type: z.ZodEnum<["mcp", "http", "custom"]>;
            name: z.ZodOptional<z.ZodString>;
            endpoint: z.ZodOptional<z.ZodString>;
            url: z.ZodOptional<z.ZodString>;
            method: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">[] | undefined;
        execUseLoginShell?: boolean | undefined;
        formatResultWithLLM?: boolean | undefined;
        autoExecuteParsedCalls?: boolean | undefined;
        allowExecInChannels?: string[] | undefined;
    }, {
        policy?: "minimal" | "coding" | "messaging" | "full" | "balanced" | undefined;
        sandbox?: {
            timeout?: number | undefined;
            enabled?: boolean | undefined;
            docker?: boolean | undefined;
            maxMemory?: string | undefined;
            allowedCommands?: string[] | undefined;
        } | undefined;
        permissions?: {
            fileSystem?: {
                read?: boolean | undefined;
                write?: boolean | undefined;
                execute?: boolean | undefined;
                delete?: boolean | undefined;
            } | undefined;
            network?: {
                http?: boolean | undefined;
                https?: boolean | undefined;
                websocket?: boolean | undefined;
            } | undefined;
            system?: {
                shell?: boolean | undefined;
                process?: boolean | undefined;
            } | undefined;
        } | undefined;
        extensions?: z.objectInputType<{
            type: z.ZodEnum<["mcp", "http", "custom"]>;
            name: z.ZodOptional<z.ZodString>;
            endpoint: z.ZodOptional<z.ZodString>;
            url: z.ZodOptional<z.ZodString>;
            method: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">[] | undefined;
        execUseLoginShell?: boolean | undefined;
        formatResultWithLLM?: boolean | undefined;
        autoExecuteParsedCalls?: boolean | undefined;
        allowExecInChannels?: string[] | undefined;
    }>>;
    mcp: z.ZodOptional<z.ZodArray<z.ZodObject<{
        endpoint: z.ZodString;
        transport: z.ZodOptional<z.ZodEnum<["http", "sse", "stdio"]>>;
        command: z.ZodOptional<z.ZodString>;
        args: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        requestInit: z.ZodOptional<z.ZodObject<{
            headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
            method: z.ZodOptional<z.ZodEnum<["GET", "HEAD", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"]>>;
            credentials: z.ZodOptional<z.ZodEnum<["omit", "same-origin", "include"]>>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
            method: z.ZodOptional<z.ZodEnum<["GET", "HEAD", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"]>>;
            credentials: z.ZodOptional<z.ZodEnum<["omit", "same-origin", "include"]>>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
            method: z.ZodOptional<z.ZodEnum<["GET", "HEAD", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"]>>;
            credentials: z.ZodOptional<z.ZodEnum<["omit", "same-origin", "include"]>>;
        }, z.ZodTypeAny, "passthrough">>>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        endpoint: z.ZodString;
        transport: z.ZodOptional<z.ZodEnum<["http", "sse", "stdio"]>>;
        command: z.ZodOptional<z.ZodString>;
        args: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        requestInit: z.ZodOptional<z.ZodObject<{
            headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
            method: z.ZodOptional<z.ZodEnum<["GET", "HEAD", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"]>>;
            credentials: z.ZodOptional<z.ZodEnum<["omit", "same-origin", "include"]>>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
            method: z.ZodOptional<z.ZodEnum<["GET", "HEAD", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"]>>;
            credentials: z.ZodOptional<z.ZodEnum<["omit", "same-origin", "include"]>>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
            method: z.ZodOptional<z.ZodEnum<["GET", "HEAD", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"]>>;
            credentials: z.ZodOptional<z.ZodEnum<["omit", "same-origin", "include"]>>;
        }, z.ZodTypeAny, "passthrough">>>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        endpoint: z.ZodString;
        transport: z.ZodOptional<z.ZodEnum<["http", "sse", "stdio"]>>;
        command: z.ZodOptional<z.ZodString>;
        args: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        requestInit: z.ZodOptional<z.ZodObject<{
            headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
            method: z.ZodOptional<z.ZodEnum<["GET", "HEAD", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"]>>;
            credentials: z.ZodOptional<z.ZodEnum<["omit", "same-origin", "include"]>>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
            method: z.ZodOptional<z.ZodEnum<["GET", "HEAD", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"]>>;
            credentials: z.ZodOptional<z.ZodEnum<["omit", "same-origin", "include"]>>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
            method: z.ZodOptional<z.ZodEnum<["GET", "HEAD", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"]>>;
            credentials: z.ZodOptional<z.ZodEnum<["omit", "same-origin", "include"]>>;
        }, z.ZodTypeAny, "passthrough">>>;
    }, z.ZodTypeAny, "passthrough">>, "many">>;
    memory: z.ZodOptional<z.ZodObject<{
        provider: z.ZodDefault<z.ZodString>;
        enabled: z.ZodDefault<z.ZodBoolean>;
        storageDir: z.ZodDefault<z.ZodString>;
        indexConversations: z.ZodDefault<z.ZodBoolean>;
        indexWorkspace: z.ZodDefault<z.ZodBoolean>;
        maxDocumentSizeMB: z.ZodDefault<z.ZodNumber>;
        maxRetrievalNodes: z.ZodDefault<z.ZodNumber>;
        chunkSize: z.ZodOptional<z.ZodNumber>;
        chunkOverlap: z.ZodOptional<z.ZodNumber>;
        llmReranking: z.ZodOptional<z.ZodBoolean>;
        queryExpansion: z.ZodOptional<z.ZodBoolean>;
        mmrLambda: z.ZodOptional<z.ZodNumber>;
        contextWindowLines: z.ZodOptional<z.ZodNumber>;
        graphRag: z.ZodOptional<z.ZodDefault<z.ZodObject<{
            enabled: z.ZodDefault<z.ZodBoolean>;
            entityExtraction: z.ZodDefault<z.ZodObject<{
                enabled: z.ZodDefault<z.ZodBoolean>;
                model: z.ZodOptional<z.ZodString>;
                batchSize: z.ZodDefault<z.ZodNumber>;
                maxEntitiesPerChunk: z.ZodDefault<z.ZodNumber>;
            }, "strip", z.ZodTypeAny, {
                enabled: boolean;
                batchSize: number;
                maxEntitiesPerChunk: number;
                model?: string | undefined;
            }, {
                model?: string | undefined;
                enabled?: boolean | undefined;
                batchSize?: number | undefined;
                maxEntitiesPerChunk?: number | undefined;
            }>>;
            communityDetection: z.ZodDefault<z.ZodObject<{
                enabled: z.ZodDefault<z.ZodBoolean>;
                algorithm: z.ZodDefault<z.ZodEnum<["leiden", "louvain"]>>;
                resolution: z.ZodDefault<z.ZodNumber>;
                levels: z.ZodDefault<z.ZodNumber>;
            }, "strip", z.ZodTypeAny, {
                enabled: boolean;
                algorithm: "leiden" | "louvain";
                resolution: number;
                levels: number;
            }, {
                enabled?: boolean | undefined;
                algorithm?: "leiden" | "louvain" | undefined;
                resolution?: number | undefined;
                levels?: number | undefined;
            }>>;
            queryStrategy: z.ZodDefault<z.ZodObject<{
                directorLevel: z.ZodDefault<z.ZodEnum<["community", "entity", "chunk"]>>;
                workerLevel: z.ZodDefault<z.ZodEnum<["chunk", "entity"]>>;
            }, "strip", z.ZodTypeAny, {
                directorLevel: "community" | "entity" | "chunk";
                workerLevel: "entity" | "chunk";
            }, {
                directorLevel?: "community" | "entity" | "chunk" | undefined;
                workerLevel?: "entity" | "chunk" | undefined;
            }>>;
        }, "strip", z.ZodTypeAny, {
            enabled: boolean;
            entityExtraction: {
                enabled: boolean;
                batchSize: number;
                maxEntitiesPerChunk: number;
                model?: string | undefined;
            };
            communityDetection: {
                enabled: boolean;
                algorithm: "leiden" | "louvain";
                resolution: number;
                levels: number;
            };
            queryStrategy: {
                directorLevel: "community" | "entity" | "chunk";
                workerLevel: "entity" | "chunk";
            };
        }, {
            enabled?: boolean | undefined;
            entityExtraction?: {
                model?: string | undefined;
                enabled?: boolean | undefined;
                batchSize?: number | undefined;
                maxEntitiesPerChunk?: number | undefined;
            } | undefined;
            communityDetection?: {
                enabled?: boolean | undefined;
                algorithm?: "leiden" | "louvain" | undefined;
                resolution?: number | undefined;
                levels?: number | undefined;
            } | undefined;
            queryStrategy?: {
                directorLevel?: "community" | "entity" | "chunk" | undefined;
                workerLevel?: "entity" | "chunk" | undefined;
            } | undefined;
        }>>>;
        hybridRetrieval: z.ZodOptional<z.ZodDefault<z.ZodObject<{
            bm25Weight: z.ZodDefault<z.ZodNumber>;
            vectorWeight: z.ZodDefault<z.ZodNumber>;
            graphWeight: z.ZodDefault<z.ZodNumber>;
            rerankWithLLM: z.ZodDefault<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            bm25Weight: number;
            vectorWeight: number;
            graphWeight: number;
            rerankWithLLM: boolean;
        }, {
            bm25Weight?: number | undefined;
            vectorWeight?: number | undefined;
            graphWeight?: number | undefined;
            rerankWithLLM?: boolean | undefined;
        }>>>;
    }, "strip", z.ZodTypeAny, {
        enabled: boolean;
        provider: string;
        storageDir: string;
        indexConversations: boolean;
        indexWorkspace: boolean;
        maxDocumentSizeMB: number;
        maxRetrievalNodes: number;
        chunkSize?: number | undefined;
        chunkOverlap?: number | undefined;
        llmReranking?: boolean | undefined;
        queryExpansion?: boolean | undefined;
        mmrLambda?: number | undefined;
        contextWindowLines?: number | undefined;
        graphRag?: {
            enabled: boolean;
            entityExtraction: {
                enabled: boolean;
                batchSize: number;
                maxEntitiesPerChunk: number;
                model?: string | undefined;
            };
            communityDetection: {
                enabled: boolean;
                algorithm: "leiden" | "louvain";
                resolution: number;
                levels: number;
            };
            queryStrategy: {
                directorLevel: "community" | "entity" | "chunk";
                workerLevel: "entity" | "chunk";
            };
        } | undefined;
        hybridRetrieval?: {
            bm25Weight: number;
            vectorWeight: number;
            graphWeight: number;
            rerankWithLLM: boolean;
        } | undefined;
    }, {
        enabled?: boolean | undefined;
        chunkSize?: number | undefined;
        provider?: string | undefined;
        storageDir?: string | undefined;
        indexConversations?: boolean | undefined;
        indexWorkspace?: boolean | undefined;
        maxDocumentSizeMB?: number | undefined;
        maxRetrievalNodes?: number | undefined;
        chunkOverlap?: number | undefined;
        llmReranking?: boolean | undefined;
        queryExpansion?: boolean | undefined;
        mmrLambda?: number | undefined;
        contextWindowLines?: number | undefined;
        graphRag?: {
            enabled?: boolean | undefined;
            entityExtraction?: {
                model?: string | undefined;
                enabled?: boolean | undefined;
                batchSize?: number | undefined;
                maxEntitiesPerChunk?: number | undefined;
            } | undefined;
            communityDetection?: {
                enabled?: boolean | undefined;
                algorithm?: "leiden" | "louvain" | undefined;
                resolution?: number | undefined;
                levels?: number | undefined;
            } | undefined;
            queryStrategy?: {
                directorLevel?: "community" | "entity" | "chunk" | undefined;
                workerLevel?: "entity" | "chunk" | undefined;
            } | undefined;
        } | undefined;
        hybridRetrieval?: {
            bm25Weight?: number | undefined;
            vectorWeight?: number | undefined;
            graphWeight?: number | undefined;
            rerankWithLLM?: boolean | undefined;
        } | undefined;
    }>>;
    channels: z.ZodDefault<z.ZodObject<{
        enabled: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        enabled: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        enabled: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    }, z.ZodTypeAny, "passthrough">>>;
    performance: z.ZodDefault<z.ZodObject<{
        skillsCache: z.ZodDefault<z.ZodObject<{
            maxSize: z.ZodDefault<z.ZodNumber>;
            ttl: z.ZodDefault<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            maxSize: number;
            ttl: number;
        }, {
            maxSize?: number | undefined;
            ttl?: number | undefined;
        }>>;
        semanticSearch: z.ZodDefault<z.ZodObject<{
            enabled: z.ZodDefault<z.ZodBoolean>;
            threshold: z.ZodDefault<z.ZodNumber>;
            maxResults: z.ZodDefault<z.ZodNumber>;
            embedModel: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            enabled: boolean;
            threshold: number;
            maxResults: number;
            embedModel?: string | undefined;
        }, {
            enabled?: boolean | undefined;
            threshold?: number | undefined;
            maxResults?: number | undefined;
            embedModel?: string | undefined;
        }>>;
        streaming: z.ZodDefault<z.ZodObject<{
            enabled: z.ZodDefault<z.ZodBoolean>;
            chunkSize: z.ZodDefault<z.ZodNumber>;
            maxConcurrent: z.ZodDefault<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            enabled: boolean;
            chunkSize: number;
            maxConcurrent: number;
        }, {
            enabled?: boolean | undefined;
            chunkSize?: number | undefined;
            maxConcurrent?: number | undefined;
        }>>;
        memory: z.ZodDefault<z.ZodObject<{
            maxHeapSize: z.ZodDefault<z.ZodString>;
            gcInterval: z.ZodDefault<z.ZodNumber>;
            sessionTimeout: z.ZodDefault<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            maxHeapSize: string;
            gcInterval: number;
            sessionTimeout: number;
        }, {
            maxHeapSize?: string | undefined;
            gcInterval?: number | undefined;
            sessionTimeout?: number | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        skillsCache: {
            maxSize: number;
            ttl: number;
        };
        semanticSearch: {
            enabled: boolean;
            threshold: number;
            maxResults: number;
            embedModel?: string | undefined;
        };
        streaming: {
            enabled: boolean;
            chunkSize: number;
            maxConcurrent: number;
        };
        memory: {
            maxHeapSize: string;
            gcInterval: number;
            sessionTimeout: number;
        };
    }, {
        skillsCache?: {
            maxSize?: number | undefined;
            ttl?: number | undefined;
        } | undefined;
        semanticSearch?: {
            enabled?: boolean | undefined;
            threshold?: number | undefined;
            maxResults?: number | undefined;
            embedModel?: string | undefined;
        } | undefined;
        streaming?: {
            enabled?: boolean | undefined;
            chunkSize?: number | undefined;
            maxConcurrent?: number | undefined;
        } | undefined;
        memory?: {
            maxHeapSize?: string | undefined;
            gcInterval?: number | undefined;
            sessionTimeout?: number | undefined;
        } | undefined;
    }>>;
    security: z.ZodDefault<z.ZodObject<{
        auth: z.ZodDefault<z.ZodObject<{
            enabled: z.ZodDefault<z.ZodBoolean>;
            type: z.ZodDefault<z.ZodEnum<["none", "basic", "bearer", "oauth"]>>;
            token: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            type: "none" | "basic" | "bearer" | "oauth";
            enabled: boolean;
            token?: string | undefined;
        }, {
            type?: "none" | "basic" | "bearer" | "oauth" | undefined;
            enabled?: boolean | undefined;
            token?: string | undefined;
        }>>;
        rateLimit: z.ZodDefault<z.ZodObject<{
            enabled: z.ZodDefault<z.ZodBoolean>;
            windowMs: z.ZodDefault<z.ZodNumber>;
            maxRequests: z.ZodDefault<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            enabled: boolean;
            windowMs: number;
            maxRequests: number;
        }, {
            enabled?: boolean | undefined;
            windowMs?: number | undefined;
            maxRequests?: number | undefined;
        }>>;
        cors: z.ZodDefault<z.ZodObject<{
            enabled: z.ZodDefault<z.ZodBoolean>;
            origins: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
            credentials: z.ZodDefault<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            enabled: boolean;
            origins: string[];
            credentials: boolean;
        }, {
            enabled?: boolean | undefined;
            origins?: string[] | undefined;
            credentials?: boolean | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        auth: {
            type: "none" | "basic" | "bearer" | "oauth";
            enabled: boolean;
            token?: string | undefined;
        };
        rateLimit: {
            enabled: boolean;
            windowMs: number;
            maxRequests: number;
        };
        cors: {
            enabled: boolean;
            origins: string[];
            credentials: boolean;
        };
    }, {
        auth?: {
            type?: "none" | "basic" | "bearer" | "oauth" | undefined;
            enabled?: boolean | undefined;
            token?: string | undefined;
        } | undefined;
        rateLimit?: {
            enabled?: boolean | undefined;
            windowMs?: number | undefined;
            maxRequests?: number | undefined;
        } | undefined;
        cors?: {
            enabled?: boolean | undefined;
            origins?: string[] | undefined;
            credentials?: boolean | undefined;
        } | undefined;
    }>>;
    logging: z.ZodDefault<z.ZodObject<{
        level: z.ZodDefault<z.ZodEnum<["debug", "info", "warn", "error"]>>;
        format: z.ZodDefault<z.ZodEnum<["text", "json", "pretty"]>>;
        file: z.ZodOptional<z.ZodObject<{
            enabled: z.ZodBoolean;
            path: z.ZodString;
            maxSize: z.ZodString;
            maxFiles: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            path: string;
            enabled: boolean;
            maxSize: string;
            maxFiles: number;
        }, {
            path: string;
            enabled: boolean;
            maxSize: string;
            maxFiles: number;
        }>>;
    }, "strip", z.ZodTypeAny, {
        format: "text" | "json" | "pretty";
        level: "debug" | "info" | "warn" | "error";
        file?: {
            path: string;
            enabled: boolean;
            maxSize: string;
            maxFiles: number;
        } | undefined;
    }, {
        format?: "text" | "json" | "pretty" | undefined;
        level?: "debug" | "info" | "warn" | "error" | undefined;
        file?: {
            path: string;
            enabled: boolean;
            maxSize: string;
            maxFiles: number;
        } | undefined;
    }>>;
    monitoring: z.ZodDefault<z.ZodObject<{
        enabled: z.ZodDefault<z.ZodBoolean>;
        rssLimitMB: z.ZodDefault<z.ZodNumber>;
        metrics: z.ZodOptional<z.ZodObject<{
            enabled: z.ZodBoolean;
            port: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            enabled: boolean;
            port: number;
        }, {
            enabled: boolean;
            port: number;
        }>>;
        health: z.ZodOptional<z.ZodObject<{
            enabled: z.ZodDefault<z.ZodBoolean>;
            path: z.ZodDefault<z.ZodString>;
            interval: z.ZodDefault<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            path: string;
            enabled: boolean;
            interval: number;
        }, {
            path?: string | undefined;
            enabled?: boolean | undefined;
            interval?: number | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        enabled: boolean;
        rssLimitMB: number;
        metrics?: {
            enabled: boolean;
            port: number;
        } | undefined;
        health?: {
            path: string;
            enabled: boolean;
            interval: number;
        } | undefined;
    }, {
        enabled?: boolean | undefined;
        rssLimitMB?: number | undefined;
        metrics?: {
            enabled: boolean;
            port: number;
        } | undefined;
        health?: {
            path?: string | undefined;
            enabled?: boolean | undefined;
            interval?: number | undefined;
        } | undefined;
    }>>;
    cluster: z.ZodOptional<z.ZodObject<{
        enabled: z.ZodBoolean;
        nodes: z.ZodArray<z.ZodString, "many">;
        discovery: z.ZodEnum<["static", "consul", "etcd"]>;
    }, "strip", z.ZodTypeAny, {
        enabled: boolean;
        nodes: string[];
        discovery: "static" | "consul" | "etcd";
    }, {
        enabled: boolean;
        nodes: string[];
        discovery: "static" | "consul" | "etcd";
    }>>;
}, "strip", z.ZodTypeAny, {
    channels: {
        enabled: string[];
    } & {
        [k: string]: unknown;
    };
    tools: {
        policy: "minimal" | "coding" | "messaging" | "full" | "balanced";
        sandbox: {
            timeout: number;
            enabled: boolean;
            docker: boolean;
            maxMemory: string;
            allowedCommands: string[];
        };
        permissions: {
            fileSystem: {
                read: boolean;
                write: boolean;
                execute: boolean;
                delete: boolean;
            };
            network: {
                http: boolean;
                https: boolean;
                websocket: boolean;
            };
            system: {
                shell: boolean;
                process: boolean;
            };
        };
        extensions?: z.objectOutputType<{
            type: z.ZodEnum<["mcp", "http", "custom"]>;
            name: z.ZodOptional<z.ZodString>;
            endpoint: z.ZodOptional<z.ZodString>;
            url: z.ZodOptional<z.ZodString>;
            method: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">[] | undefined;
        execUseLoginShell?: boolean | undefined;
        formatResultWithLLM?: boolean | undefined;
        autoExecuteParsedCalls?: boolean | undefined;
        allowExecInChannels?: string[] | undefined;
    };
    port: number;
    bind: string;
    workspaceDir: string;
    models: {
        primary: string;
        fallback: string;
        providers: Record<string, z.objectOutputType<{
            apiKey: z.ZodOptional<z.ZodString>;
            baseUrl: z.ZodOptional<z.ZodString>;
            model: z.ZodOptional<z.ZodString>;
            timeout: z.ZodOptional<z.ZodNumber>;
            temperature: z.ZodOptional<z.ZodNumber>;
            topP: z.ZodOptional<z.ZodNumber>;
            enableThinking: z.ZodOptional<z.ZodBoolean>;
            frequencyPenalty: z.ZodOptional<z.ZodNumber>;
            presencePenalty: z.ZodOptional<z.ZodNumber>;
        }, z.ZodTypeAny, "passthrough">>;
        local?: string | undefined;
    };
    agent: {
        maxTurns: number;
        toolResultContextMax: number;
        messageTimeoutMs: number;
    };
    skills: {
        dirs: string[];
        include?: string[] | undefined;
        exclude?: string[] | undefined;
    } & {
        [k: string]: unknown;
    };
    performance: {
        skillsCache: {
            maxSize: number;
            ttl: number;
        };
        semanticSearch: {
            enabled: boolean;
            threshold: number;
            maxResults: number;
            embedModel?: string | undefined;
        };
        streaming: {
            enabled: boolean;
            chunkSize: number;
            maxConcurrent: number;
        };
        memory: {
            maxHeapSize: string;
            gcInterval: number;
            sessionTimeout: number;
        };
    };
    security: {
        auth: {
            type: "none" | "basic" | "bearer" | "oauth";
            enabled: boolean;
            token?: string | undefined;
        };
        rateLimit: {
            enabled: boolean;
            windowMs: number;
            maxRequests: number;
        };
        cors: {
            enabled: boolean;
            origins: string[];
            credentials: boolean;
        };
    };
    logging: {
        format: "text" | "json" | "pretty";
        level: "debug" | "info" | "warn" | "error";
        file?: {
            path: string;
            enabled: boolean;
            maxSize: string;
            maxFiles: number;
        } | undefined;
    };
    monitoring: {
        enabled: boolean;
        rssLimitMB: number;
        metrics?: {
            enabled: boolean;
            port: number;
        } | undefined;
        health?: {
            path: string;
            enabled: boolean;
            interval: number;
        } | undefined;
    };
    mcp?: z.objectOutputType<{
        endpoint: z.ZodString;
        transport: z.ZodOptional<z.ZodEnum<["http", "sse", "stdio"]>>;
        command: z.ZodOptional<z.ZodString>;
        args: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        requestInit: z.ZodOptional<z.ZodObject<{
            headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
            method: z.ZodOptional<z.ZodEnum<["GET", "HEAD", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"]>>;
            credentials: z.ZodOptional<z.ZodEnum<["omit", "same-origin", "include"]>>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
            method: z.ZodOptional<z.ZodEnum<["GET", "HEAD", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"]>>;
            credentials: z.ZodOptional<z.ZodEnum<["omit", "same-origin", "include"]>>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
            method: z.ZodOptional<z.ZodEnum<["GET", "HEAD", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"]>>;
            credentials: z.ZodOptional<z.ZodEnum<["omit", "same-origin", "include"]>>;
        }, z.ZodTypeAny, "passthrough">>>;
    }, z.ZodTypeAny, "passthrough">[] | undefined;
    memory?: {
        enabled: boolean;
        provider: string;
        storageDir: string;
        indexConversations: boolean;
        indexWorkspace: boolean;
        maxDocumentSizeMB: number;
        maxRetrievalNodes: number;
        chunkSize?: number | undefined;
        chunkOverlap?: number | undefined;
        llmReranking?: boolean | undefined;
        queryExpansion?: boolean | undefined;
        mmrLambda?: number | undefined;
        contextWindowLines?: number | undefined;
        graphRag?: {
            enabled: boolean;
            entityExtraction: {
                enabled: boolean;
                batchSize: number;
                maxEntitiesPerChunk: number;
                model?: string | undefined;
            };
            communityDetection: {
                enabled: boolean;
                algorithm: "leiden" | "louvain";
                resolution: number;
                levels: number;
            };
            queryStrategy: {
                directorLevel: "community" | "entity" | "chunk";
                workerLevel: "entity" | "chunk";
            };
        } | undefined;
        hybridRetrieval?: {
            bm25Weight: number;
            vectorWeight: number;
            graphWeight: number;
            rerankWithLLM: boolean;
        } | undefined;
    } | undefined;
    agents?: {
        mode: "single" | "multi";
        director: {
            maxTurns: number;
            directResponse: boolean;
            model?: string | undefined;
        };
        pool: {
            maxConcurrent: number;
            maxIdleTime: number;
        };
        workers?: Record<string, z.objectOutputType<{
            enabled: z.ZodDefault<z.ZodBoolean>;
            model: z.ZodOptional<z.ZodString>;
            maxTurns: z.ZodOptional<z.ZodNumber>;
            tools: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            skillDomains: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        }, z.ZodTypeAny, "passthrough">> | undefined;
    } | undefined;
    rules?: {
        custom?: z.objectOutputType<{
            path: z.ZodString;
        }, z.ZodTypeAny, "passthrough">[] | undefined;
        builtin?: z.objectOutputType<{
            'exec-channel-allowlist': z.ZodDefault<z.ZodBoolean>;
            'content-safety': z.ZodDefault<z.ZodBoolean>;
            'input-sanitize': z.ZodDefault<z.ZodBoolean>;
            'format-channel-adapt': z.ZodDefault<z.ZodBoolean>;
            'citation-enforce': z.ZodDefault<z.ZodBoolean>;
            'thinking-strip': z.ZodDefault<z.ZodBoolean>;
        }, z.ZodTypeAny, "passthrough"> | undefined;
        output?: {
            channelFormats?: Record<string, z.objectOutputType<{
                format: z.ZodOptional<z.ZodString>;
                maxLength: z.ZodOptional<z.ZodNumber>;
            }, z.ZodTypeAny, "passthrough">> | undefined;
            tone?: string | undefined;
            piiFilter?: {
                enabled: boolean;
            } | undefined;
        } | undefined;
    } | undefined;
    cluster?: {
        enabled: boolean;
        nodes: string[];
        discovery: "static" | "consul" | "etcd";
    } | undefined;
}, {
    workspaceDir: string;
    models: {
        primary: string;
        fallback: string;
        local?: string | undefined;
        providers?: Record<string, z.objectInputType<{
            apiKey: z.ZodOptional<z.ZodString>;
            baseUrl: z.ZodOptional<z.ZodString>;
            model: z.ZodOptional<z.ZodString>;
            timeout: z.ZodOptional<z.ZodNumber>;
            temperature: z.ZodOptional<z.ZodNumber>;
            topP: z.ZodOptional<z.ZodNumber>;
            enableThinking: z.ZodOptional<z.ZodBoolean>;
            frequencyPenalty: z.ZodOptional<z.ZodNumber>;
            presencePenalty: z.ZodOptional<z.ZodNumber>;
        }, z.ZodTypeAny, "passthrough">> | undefined;
    };
    mcp?: z.objectInputType<{
        endpoint: z.ZodString;
        transport: z.ZodOptional<z.ZodEnum<["http", "sse", "stdio"]>>;
        command: z.ZodOptional<z.ZodString>;
        args: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        requestInit: z.ZodOptional<z.ZodObject<{
            headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
            method: z.ZodOptional<z.ZodEnum<["GET", "HEAD", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"]>>;
            credentials: z.ZodOptional<z.ZodEnum<["omit", "same-origin", "include"]>>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
            method: z.ZodOptional<z.ZodEnum<["GET", "HEAD", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"]>>;
            credentials: z.ZodOptional<z.ZodEnum<["omit", "same-origin", "include"]>>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
            method: z.ZodOptional<z.ZodEnum<["GET", "HEAD", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"]>>;
            credentials: z.ZodOptional<z.ZodEnum<["omit", "same-origin", "include"]>>;
        }, z.ZodTypeAny, "passthrough">>>;
    }, z.ZodTypeAny, "passthrough">[] | undefined;
    memory?: {
        enabled?: boolean | undefined;
        chunkSize?: number | undefined;
        provider?: string | undefined;
        storageDir?: string | undefined;
        indexConversations?: boolean | undefined;
        indexWorkspace?: boolean | undefined;
        maxDocumentSizeMB?: number | undefined;
        maxRetrievalNodes?: number | undefined;
        chunkOverlap?: number | undefined;
        llmReranking?: boolean | undefined;
        queryExpansion?: boolean | undefined;
        mmrLambda?: number | undefined;
        contextWindowLines?: number | undefined;
        graphRag?: {
            enabled?: boolean | undefined;
            entityExtraction?: {
                model?: string | undefined;
                enabled?: boolean | undefined;
                batchSize?: number | undefined;
                maxEntitiesPerChunk?: number | undefined;
            } | undefined;
            communityDetection?: {
                enabled?: boolean | undefined;
                algorithm?: "leiden" | "louvain" | undefined;
                resolution?: number | undefined;
                levels?: number | undefined;
            } | undefined;
            queryStrategy?: {
                directorLevel?: "community" | "entity" | "chunk" | undefined;
                workerLevel?: "entity" | "chunk" | undefined;
            } | undefined;
        } | undefined;
        hybridRetrieval?: {
            bm25Weight?: number | undefined;
            vectorWeight?: number | undefined;
            graphWeight?: number | undefined;
            rerankWithLLM?: boolean | undefined;
        } | undefined;
    } | undefined;
    channels?: z.objectInputType<{
        enabled: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    }, z.ZodTypeAny, "passthrough"> | undefined;
    tools?: {
        policy?: "minimal" | "coding" | "messaging" | "full" | "balanced" | undefined;
        sandbox?: {
            timeout?: number | undefined;
            enabled?: boolean | undefined;
            docker?: boolean | undefined;
            maxMemory?: string | undefined;
            allowedCommands?: string[] | undefined;
        } | undefined;
        permissions?: {
            fileSystem?: {
                read?: boolean | undefined;
                write?: boolean | undefined;
                execute?: boolean | undefined;
                delete?: boolean | undefined;
            } | undefined;
            network?: {
                http?: boolean | undefined;
                https?: boolean | undefined;
                websocket?: boolean | undefined;
            } | undefined;
            system?: {
                shell?: boolean | undefined;
                process?: boolean | undefined;
            } | undefined;
        } | undefined;
        extensions?: z.objectInputType<{
            type: z.ZodEnum<["mcp", "http", "custom"]>;
            name: z.ZodOptional<z.ZodString>;
            endpoint: z.ZodOptional<z.ZodString>;
            url: z.ZodOptional<z.ZodString>;
            method: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">[] | undefined;
        execUseLoginShell?: boolean | undefined;
        formatResultWithLLM?: boolean | undefined;
        autoExecuteParsedCalls?: boolean | undefined;
        allowExecInChannels?: string[] | undefined;
    } | undefined;
    port?: number | undefined;
    bind?: string | undefined;
    agent?: {
        maxTurns?: number | undefined;
        toolResultContextMax?: number | undefined;
        messageTimeoutMs?: number | undefined;
    } | undefined;
    agents?: {
        mode?: "single" | "multi" | undefined;
        director?: {
            model?: string | undefined;
            maxTurns?: number | undefined;
            directResponse?: boolean | undefined;
        } | undefined;
        workers?: Record<string, z.objectInputType<{
            enabled: z.ZodDefault<z.ZodBoolean>;
            model: z.ZodOptional<z.ZodString>;
            maxTurns: z.ZodOptional<z.ZodNumber>;
            tools: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            skillDomains: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        }, z.ZodTypeAny, "passthrough">> | undefined;
        pool?: {
            maxConcurrent?: number | undefined;
            maxIdleTime?: number | undefined;
        } | undefined;
    } | undefined;
    rules?: {
        custom?: z.objectInputType<{
            path: z.ZodString;
        }, z.ZodTypeAny, "passthrough">[] | undefined;
        builtin?: z.objectInputType<{
            'exec-channel-allowlist': z.ZodDefault<z.ZodBoolean>;
            'content-safety': z.ZodDefault<z.ZodBoolean>;
            'input-sanitize': z.ZodDefault<z.ZodBoolean>;
            'format-channel-adapt': z.ZodDefault<z.ZodBoolean>;
            'citation-enforce': z.ZodDefault<z.ZodBoolean>;
            'thinking-strip': z.ZodDefault<z.ZodBoolean>;
        }, z.ZodTypeAny, "passthrough"> | undefined;
        output?: {
            channelFormats?: Record<string, z.objectInputType<{
                format: z.ZodOptional<z.ZodString>;
                maxLength: z.ZodOptional<z.ZodNumber>;
            }, z.ZodTypeAny, "passthrough">> | undefined;
            tone?: string | undefined;
            piiFilter?: {
                enabled?: boolean | undefined;
            } | undefined;
        } | undefined;
    } | undefined;
    skills?: z.objectInputType<{
        dirs: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        include: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        exclude: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, z.ZodTypeAny, "passthrough"> | undefined;
    performance?: {
        skillsCache?: {
            maxSize?: number | undefined;
            ttl?: number | undefined;
        } | undefined;
        semanticSearch?: {
            enabled?: boolean | undefined;
            threshold?: number | undefined;
            maxResults?: number | undefined;
            embedModel?: string | undefined;
        } | undefined;
        streaming?: {
            enabled?: boolean | undefined;
            chunkSize?: number | undefined;
            maxConcurrent?: number | undefined;
        } | undefined;
        memory?: {
            maxHeapSize?: string | undefined;
            gcInterval?: number | undefined;
            sessionTimeout?: number | undefined;
        } | undefined;
    } | undefined;
    security?: {
        auth?: {
            type?: "none" | "basic" | "bearer" | "oauth" | undefined;
            enabled?: boolean | undefined;
            token?: string | undefined;
        } | undefined;
        rateLimit?: {
            enabled?: boolean | undefined;
            windowMs?: number | undefined;
            maxRequests?: number | undefined;
        } | undefined;
        cors?: {
            enabled?: boolean | undefined;
            origins?: string[] | undefined;
            credentials?: boolean | undefined;
        } | undefined;
    } | undefined;
    logging?: {
        format?: "text" | "json" | "pretty" | undefined;
        level?: "debug" | "info" | "warn" | "error" | undefined;
        file?: {
            path: string;
            enabled: boolean;
            maxSize: string;
            maxFiles: number;
        } | undefined;
    } | undefined;
    monitoring?: {
        enabled?: boolean | undefined;
        rssLimitMB?: number | undefined;
        metrics?: {
            enabled: boolean;
            port: number;
        } | undefined;
        health?: {
            path?: string | undefined;
            enabled?: boolean | undefined;
            interval?: number | undefined;
        } | undefined;
    } | undefined;
    cluster?: {
        enabled: boolean;
        nodes: string[];
        discovery: "static" | "consul" | "etcd";
    } | undefined;
}>;

type MCPServerRequestInit = z.infer<typeof MCPServerRequestInitSchema>;
type MCPServerEntry = z.infer<typeof MCPServerEntrySchema>;

type ModelProviderConfig = z.infer<typeof ModelProviderConfigSchema>;
type ModelsConfig = z.infer<typeof ModelsConfigSchema>;
type SkillsConfig = z.infer<typeof SkillsConfigSchema>;
type SandboxConfig = z.infer<typeof SandboxConfigSchema>;
type PermissionsConfig = z.infer<typeof PermissionsConfigSchema>;
type ToolsConfig = z.infer<typeof ToolsConfigSchema>;
type SecurityConfig = z.infer<typeof SecurityConfigSchema>;
type PerformanceConfig = z.infer<typeof PerformanceConfigSchema>;
type MemoryConfig = z.infer<typeof MemoryConfigSchema>;
type ChannelAccountConfig = z.infer<typeof ChannelAccountConfigSchema>;
type ChannelDetailConfig = z.infer<typeof ChannelDetailConfigSchema> & {
    [key: string]: unknown;
};
type ChannelsConfig = z.infer<typeof ChannelsConfigSchema> & Record<string, unknown>;
type PluginEntry = z.infer<typeof PluginEntrySchema>;
type PluginInstall = z.infer<typeof PluginInstallSchema>;
type PluginsConfig = z.infer<typeof PluginsConfigSchema>;
type UserConfigMeta = z.infer<typeof UserConfigMetaSchema>;
type UserConfig = z.infer<typeof UserConfigSchema>;
type NovaClawConfig = z.infer<typeof NovaClawConfigSchema>;

type MCPConfig = MCPServerEntry[];
interface LoggingConfig {
    level: 'debug' | 'info' | 'warn' | 'error';
    format: 'text' | 'json' | 'pretty';
    file?: {
        enabled: boolean;
        path: string;
        maxSize: string;
        maxFiles: number;
    };
}
interface MonitoringConfig {
    enabled: boolean;
    metrics?: {
        enabled: boolean;
        port: number;
    };
    health?: {
        enabled: boolean;
        path: string;
        interval: number;
    };
}
interface ClusterConfig {
    enabled: boolean;
    nodes: string[];
    discovery: 'static' | 'consul' | 'etcd';
}
interface ToolExtension {
    type: 'mcp' | 'http' | 'custom';
    name?: string;
    endpoint?: string;
    url?: string;
    method?: string;
    [key: string]: unknown;
}

interface ImageContent {
    url?: string;
    data?: string;
    mimeType: string;
    description?: string;
}
interface MessageRequest {
    requestId?: string;
    sessionKey: string;
    message: string;
    images?: ImageContent[];
    metadata?: Record<string, unknown>;
    channel?: string;
    userId?: string;
}
interface ToolCall {
    id: string;
    name: string;
    args: Record<string, unknown>;
    result?: unknown;
    error?: string;
    status: 'pending' | 'running' | 'success' | 'error';
}
interface TokenUsage {
    totalTokens: number;
    inputTokens?: number;
    outputTokens?: number;
}
interface AgentResponse {
    content: string;
    thinking?: string;
    toolCalls: ToolCall[];
    usage: TokenUsage;
    model: string;
    skillsApplied: string[];
    aborted?: boolean;
}
interface MessageResponse {
    success: boolean;
    content?: string;
    thinking?: string;
    toolCalls?: ToolCall[];
    sessionId?: string;
    processingTime?: number;
    skillsUsed?: string[];
    error?: string;
    stopped?: boolean;
    timedOut?: boolean;
    usage?: TokenUsage;
}
interface StreamChunk {
    type: 'text' | 'tool' | 'error' | 'done' | 'thinking' | 'progress';
    content?: string;
    tool?: string;
    args?: Record<string, unknown>;
    status?: 'started' | 'running' | 'completed' | 'error';
    step?: string;
    result?: unknown;
    error?: string;
    agentId?: string;
}
interface ComponentHealth {
    status: 'healthy' | 'degraded' | 'unhealthy';
    message?: string;
    lastCheck: number;
    metrics?: Record<string, number>;
}
interface HealthStatus {
    status: 'healthy' | 'degraded' | 'unhealthy';
    timestamp: number;
    uptime: number;
    memory: {
        used: number;
        total: number;
        percentage: number;
    };
    components: Record<string, ComponentHealth>;
}
interface Lifecycle {
    initialize(): Promise<void>;
    cleanup(): Promise<void>;
    getStats(): Record<string, unknown>;
}
interface PluginInterface extends Lifecycle {
    name: string;
    version: string;
}
interface PluginMetadata {
    name: string;
    version: string;
    description: string;
    author: string;
    dependencies?: string[];
    compatibility: {
        novaclaw: string;
        node: string;
    };
}
interface CacheInterface<T> {
    get(key: string): T | undefined;
    set(key: string, value: T, ttl?: number): void;
    has(key: string): boolean;
    delete(key: string): boolean;
    clear(): void;
    size(): number;
}
interface Metrics {
    requests: {
        total: number;
        success: number;
        error: number;
        averageResponseTime: number;
    };
    sessions: {
        active: number;
        total: number;
    };
    skills: {
        loaded: number;
        cacheHits: number;
        cacheMisses: number;
    };
    memory: {
        used: number;
        heap: number;
        external: number;
    };
}
interface Attachment {
    name: string;
    data: Buffer | string;
    mimeType: string;
    size: number;
}
interface ChatTurn {
    role: 'user' | 'assistant';
    content: string;
    thinking?: string;
    toolCalls?: Array<{
        name: string;
        args?: Record<string, unknown>;
        status?: string;
        error?: string;
    }>;
}
interface SessionContext {
    sessionKey: string;
    sessionId: string;
    userId: string;
    channel: string;
    workspaceDir: string;
    startTime: number;
    lastActivity: number;
    metadata: Record<string, unknown>;
    messageHistory?: ChatTurn[];
    /** Bound conversation ID for memory persistence (auto-resolved or explicitly set). */
    conversationId?: string;
}

/**
 * Channel core types — identifiers, metadata, capabilities.
 * Lightweight; safe to import from any module without triggering eager loading.
 */
type ChannelId = string;
interface ChannelMeta {
    id: ChannelId;
    label: string;
    selectionLabel: string;
    detailLabel?: string;
    docsPath: string;
    blurb: string;
    systemImage?: string;
    aliases?: string[];
    order?: number;
    quickstartAllowFrom?: boolean;
    forceAccountBinding?: boolean;
}
interface ChannelCapabilities {
    chatTypes: Array<'direct' | 'group' | 'channel' | 'thread'>;
    polls?: boolean;
    reactions?: boolean;
    edit?: boolean;
    unsend?: boolean;
    reply?: boolean;
    effects?: boolean;
    groupManagement?: boolean;
    threads?: boolean;
    media?: boolean;
    nativeCommands?: boolean;
    blockStreaming?: boolean;
}

/**
 * Channel runtime snapshot types — track per-account state.
 */
interface ChannelAccountSnapshot {
    accountId: string;
    enabled?: boolean;
    configured?: boolean;
    running?: boolean;
    connected?: boolean;
    reconnectAttempts?: number;
    lastConnectedAt?: number | null;
    lastMessageAt?: number | null;
    lastError?: string | null;
    lastStartAt?: number | null;
    lastStopAt?: number | null;
    busy?: boolean;
    activeRuns?: number;
}
interface ChannelRuntimeSnapshot {
    channels: Record<string, {
        accounts: Record<string, ChannelAccountSnapshot>;
    }>;
}

/**
 * Channel context types — runtime contexts passed to adapters.
 */

interface ChannelLogSink {
    debug?: (message: string, ...args: unknown[]) => void;
    info?: (message: string, ...args: unknown[]) => void;
    warn?: (message: string, ...args: unknown[]) => void;
    error?: (message: string, ...args: unknown[]) => void;
}
interface EnvelopeFormatOptions {
    enabled?: boolean;
    showTimestamp?: boolean;
    showChannel?: boolean;
    showSender?: boolean;
}
interface FormatEnvelopeParams {
    channel: string;
    from: string;
    timestamp: number;
    envelope: EnvelopeFormatOptions;
    body: string;
}
interface PluginChannelRuntime {
    reply: {
        resolveEnvelopeFormatOptions: (cfg: NovaClawConfig) => EnvelopeFormatOptions;
        formatAgentEnvelope: (params: FormatEnvelopeParams) => string;
        finalizeInboundContext: (params: Record<string, unknown>) => Record<string, unknown>;
        dispatchReplyWithBufferedBlockDispatcher: (params: {
            ctx: Record<string, unknown>;
            cfg: NovaClawConfig;
            dispatcherOptions: {
                deliver: (payload: unknown) => Promise<void>;
            };
        }) => Promise<unknown>;
    };
    routing: {
        resolveAgentRoute: (input: Record<string, unknown>) => unknown;
    };
    text: {
        chunk: (text: string, limit: number) => string[];
    };
    media: {
        fetchRemote: (url: string) => Promise<Buffer>;
    };
    groups: {
        resolvePolicy: (params: Record<string, unknown>) => unknown;
    };
    debounce: {
        create: (ms: number) => (fn: () => void) => () => void;
    };
    mentions: {
        buildRegex: (botName: string) => RegExp;
    };
}
interface RuntimeEnv {
    platform: string;
    arch: string;
    nodeVersion: string;
    dataDir: string;
}
interface ChannelGatewayContext<ResolvedAccount = unknown> {
    cfg: NovaClawConfig;
    accountId: string;
    account: ResolvedAccount;
    runtime: RuntimeEnv;
    abortSignal: AbortSignal;
    log?: ChannelLogSink;
    getStatus: () => ChannelAccountSnapshot;
    setStatus: (next: Partial<ChannelAccountSnapshot>) => void;
    channelRuntime?: PluginChannelRuntime;
}
interface ChannelOutboundContext {
    cfg: NovaClawConfig;
    to: string;
    text?: string;
    mediaUrl?: string;
    mediaType?: string;
    accountId?: string;
    replyToId?: string;
    threadId?: string;
    metadata?: Record<string, unknown>;
}
interface ChannelOutboundPayloadContext extends ChannelOutboundContext {
    channelData: Record<string, unknown>;
}
interface ChannelPollContext {
    cfg: NovaClawConfig;
    to: string;
    question: string;
    options: string[];
    accountId?: string;
}
interface ChannelGroupContext {
    cfg: NovaClawConfig;
    channelId: string;
    accountId?: string;
    peerId: string;
    peerKind: 'group' | 'channel' | 'thread';
    guildId?: string;
    teamId?: string;
}
interface OutboundDeliveryResult {
    channel: string;
    messageId?: string;
    to: string;
    error?: string;
}
interface ChannelPollResult {
    channel: string;
    messageId?: string;
    to: string;
    error?: string;
}
interface ChannelLoginWithQrStartResult {
    qrCode?: string;
    qrDataUrl?: string;
    expiresAt?: number;
}
interface ChannelLoginWithQrWaitResult {
    success: boolean;
    error?: string;
    accountId?: string;
}
interface ChannelLogoutResult {
    success: boolean;
    cleared?: boolean;
    error?: string;
}

/**
 * Channel adapter interfaces — each adapter handles a specific concern.
 * A ChannelPlugin composes these adapters to form a complete channel implementation.
 */

interface ChannelConfigAdapter<ResolvedAccount = unknown> {
    listAccountIds: (cfg: NovaClawConfig) => string[];
    resolveAccount: (cfg: NovaClawConfig, accountId?: string | null) => ResolvedAccount;
    defaultAccountId?: (cfg: NovaClawConfig) => string;
    setAccountEnabled?: (params: {
        cfg: NovaClawConfig;
        accountId: string;
        enabled: boolean;
    }) => NovaClawConfig;
    deleteAccount?: (params: {
        cfg: NovaClawConfig;
        accountId: string;
    }) => NovaClawConfig;
    isEnabled?: (account: ResolvedAccount, cfg: NovaClawConfig) => boolean;
    isConfigured?: (account: ResolvedAccount, cfg: NovaClawConfig) => boolean | Promise<boolean>;
    resolveAllowFrom?: (params: {
        account: ResolvedAccount;
        cfg: NovaClawConfig;
    }) => Array<string | number> | undefined;
    formatAllowFrom?: (params: {
        entries: Array<string | number>;
        account: ResolvedAccount;
    }) => string[];
    resolveDefaultTo?: (params: {
        account: ResolvedAccount;
        cfg: NovaClawConfig;
    }) => string | undefined;
    describeAccount?: (account: ResolvedAccount, cfg: NovaClawConfig) => ChannelAccountSnapshot;
}
interface ChannelGatewayAdapter<ResolvedAccount = unknown> {
    startAccount?: (ctx: ChannelGatewayContext<ResolvedAccount>) => Promise<unknown>;
    stopAccount?: (ctx: ChannelGatewayContext<ResolvedAccount>) => Promise<void>;
    loginWithQrStart?: (params: {
        cfg: NovaClawConfig;
        accountId: string;
        account: ResolvedAccount;
    }) => Promise<ChannelLoginWithQrStartResult>;
    loginWithQrWait?: (params: {
        cfg: NovaClawConfig;
        accountId: string;
        account: ResolvedAccount;
        abortSignal?: AbortSignal;
    }) => Promise<ChannelLoginWithQrWaitResult>;
    logoutAccount?: (ctx: ChannelGatewayContext<ResolvedAccount>) => Promise<ChannelLogoutResult>;
}
interface ChannelOutboundAdapter {
    deliveryMode: 'direct' | 'gateway' | 'hybrid';
    chunker?: (text: string, limit: number) => string[];
    chunkerMode?: 'text' | 'markdown';
    textChunkLimit?: number;
    pollMaxOptions?: number;
    resolveTarget?: (params: {
        to?: string;
        cfg: NovaClawConfig;
        accountId?: string;
    }) => {
        ok: true;
        to: string;
    } | {
        ok: false;
        error: Error;
    };
    sendText?: (ctx: ChannelOutboundContext) => Promise<OutboundDeliveryResult>;
    sendMedia?: (ctx: ChannelOutboundContext) => Promise<OutboundDeliveryResult>;
    sendPayload?: (ctx: ChannelOutboundPayloadContext) => Promise<OutboundDeliveryResult>;
    sendPoll?: (ctx: ChannelPollContext) => Promise<ChannelPollResult>;
}
interface ChannelSecurityDmPolicy {
    policy: string;
    allowFrom?: Array<string | number>;
    policyPath?: string;
    allowFromPath: string;
    approveHint: string;
    normalizeEntry?: (raw: string) => string;
}
interface ChannelSecurityAdapter {
    resolveDmPolicy?: (params: {
        cfg: NovaClawConfig;
        accountId: string;
    }) => ChannelSecurityDmPolicy | undefined;
}
interface ChannelAuthAdapter {
    authenticate?: (params: {
        cfg: NovaClawConfig;
        accountId: string;
        credentials: Record<string, unknown>;
    }) => Promise<boolean>;
}
interface ChannelHeartbeatAdapter {
    ping?: (params: {
        cfg: NovaClawConfig;
        accountId: string;
    }) => Promise<boolean>;
    intervalMs?: number;
}
interface ChannelPairingAdapter {
    buildPairingReply?: (params: {
        cfg: NovaClawConfig;
        senderId: string;
        senderName?: string;
        channelId: string;
    }) => {
        text: string;
        metadata?: Record<string, unknown>;
    };
    notifyApproval?: (params: {
        cfg: NovaClawConfig;
        id: string;
        runtime?: unknown;
    }) => Promise<void>;
}
interface ChannelCommandAdapter {
    parseCommand?: (text: string) => {
        command: string;
        args: string[];
    } | null;
    isControlCommand?: (text: string) => boolean;
    getAvailableCommands?: () => Array<{
        name: string;
        description: string;
        usage?: string;
    }>;
}
interface ChannelElevatedAdapter {
    isElevated?: (params: {
        senderId: string;
        cfg: NovaClawConfig;
        accountId?: string;
    }) => boolean;
}
interface ChannelMentionAdapter {
    buildMentionRegex?: (params: {
        botName: string;
        botId?: string;
    }) => RegExp;
    isMentioned?: (params: {
        text: string;
        botName: string;
        botId?: string;
    }) => boolean;
    stripMention?: (params: {
        text: string;
        botName: string;
        botId?: string;
    }) => string;
}
type GroupToolPolicyConfig = {
    allow?: string[];
    deny?: string[];
};
interface ChannelGroupAdapter {
    resolveRequireMention?: (params: ChannelGroupContext) => boolean | undefined;
    resolveToolPolicy?: (params: ChannelGroupContext) => GroupToolPolicyConfig | undefined;
    resolveGroupIntroHint?: (params: ChannelGroupContext) => string | undefined;
}
interface ChannelThreadingAdapter {
    mode?: 'flat' | 'thread' | 'reply';
    resolveThreadId?: (params: {
        messageId: string;
        channelId: string;
    }) => string | undefined;
}
interface ChannelStreamingAdapter {
    blockStreamingCoalesceDefaults?: {
        minChars?: number;
        idleMs?: number;
    };
}
interface ChannelMessagingAdapter {
    normalizeTarget?: (to: string) => {
        ok: true;
        to: string;
    } | {
        ok: false;
        error: Error;
    };
}
interface ChannelDirectoryAdapter {
    listContacts?: (params: {
        cfg: NovaClawConfig;
        accountId: string;
        query?: string;
    }) => Promise<Array<{
        id: string;
        name: string;
        metadata?: Record<string, unknown>;
    }>>;
    listGroups?: (params: {
        cfg: NovaClawConfig;
        accountId: string;
        query?: string;
    }) => Promise<Array<{
        id: string;
        name: string;
        memberCount?: number;
    }>>;
}
interface ChannelResolverAdapter {
    resolveTarget?: (params: {
        to: string;
        cfg: NovaClawConfig;
        accountId?: string;
    }) => Promise<{
        ok: true;
        to: string;
        displayName?: string;
    } | {
        ok: false;
        error: Error;
    }>;
}
interface ChannelMessageActionAdapter {
    react?: (params: {
        cfg: NovaClawConfig;
        messageId: string;
        to: string;
        emoji: string;
        accountId?: string;
    }) => Promise<void>;
    edit?: (params: {
        cfg: NovaClawConfig;
        messageId: string;
        to: string;
        newText: string;
        accountId?: string;
    }) => Promise<void>;
    unsend?: (params: {
        cfg: NovaClawConfig;
        messageId: string;
        to: string;
        accountId?: string;
    }) => Promise<void>;
}
interface ChannelAgentPromptAdapter {
    systemPromptSuffix?: (params: {
        channelId: string;
        accountId?: string;
        peerKind?: string;
    }) => string | undefined;
}
interface ChannelAgentToolFactory {
    createTools?: (params: {
        cfg: NovaClawConfig;
        channelId: string;
        accountId?: string;
    }) => Array<{
        name: string;
        description: string;
        parameters: Record<string, unknown>;
        execute: (args: Record<string, unknown>) => Promise<unknown>;
    }>;
}
interface ChannelStatusAdapter {
    describeIssues?: (params: {
        cfg: NovaClawConfig;
        accountId: string;
        snapshot: ChannelAccountSnapshot;
    }) => Array<{
        severity: 'info' | 'warning' | 'error';
        message: string;
    }>;
}
interface ChannelSetupAdapter {
    writeConfig?: (params: {
        cfg: NovaClawConfig;
        values: Record<string, unknown>;
    }) => NovaClawConfig;
}
interface ChannelOnboardingAdapter {
    steps?: Array<{
        id: string;
        label: string;
        description?: string;
    }>;
    execute?: (params: {
        cfg: NovaClawConfig;
        stepId: string;
        input: Record<string, unknown>;
    }) => Promise<{
        cfg: NovaClawConfig;
        next?: string;
        message?: string;
    }>;
}
interface ChannelConfigSchema {
    jsonSchema?: Record<string, unknown>;
}

/**
 * ChannelPlugin — the complete interface contract for a channel implementation.
 * All channels (builtin and extension) implement this interface.
 */

interface ChannelPlugin<ResolvedAccount = unknown, Probe = unknown, Audit = unknown> {
    id: ChannelId;
    meta: ChannelMeta;
    capabilities: ChannelCapabilities;
    config: ChannelConfigAdapter<ResolvedAccount>;
    configSchema?: ChannelConfigSchema;
    setup?: ChannelSetupAdapter;
    onboarding?: ChannelOnboardingAdapter;
    gateway?: ChannelGatewayAdapter<ResolvedAccount>;
    outbound?: ChannelOutboundAdapter;
    auth?: ChannelAuthAdapter;
    heartbeat?: ChannelHeartbeatAdapter;
    security?: ChannelSecurityAdapter;
    pairing?: ChannelPairingAdapter;
    commands?: ChannelCommandAdapter;
    elevated?: ChannelElevatedAdapter;
    mentions?: ChannelMentionAdapter;
    groups?: ChannelGroupAdapter;
    threading?: ChannelThreadingAdapter;
    streaming?: ChannelStreamingAdapter;
    messaging?: ChannelMessagingAdapter;
    directory?: ChannelDirectoryAdapter;
    resolver?: ChannelResolverAdapter;
    actions?: ChannelMessageActionAdapter;
    agentPrompt?: ChannelAgentPromptAdapter;
    agentTools?: ChannelAgentToolFactory;
    status?: ChannelStatusAdapter;
    defaults?: {
        queue?: {
            debounceMs?: number;
        };
    };
    reload?: {
        configPrefixes: string[];
    };
    gatewayMethods?: string[];
    _probe?: Probe;
    _audit?: Audit;
}

/**
 * User-configurable hook system.
 * Hooks are scripts or functions triggered on system events.
 * Supports loading from workspace .novaclaw/hooks/ directory.
 */
type HookEvent = 'session:start' | 'session:end' | 'message:before' | 'message:after' | 'tool:before' | 'tool:after' | 'boot' | 'shutdown';
interface HookDefinition {
    id: string;
    event: HookEvent;
    name: string;
    description?: string;
    enabled: boolean;
    handler: (context: HookContext) => Promise<void>;
}
interface HookContext {
    event: HookEvent;
    timestamp: number;
    data: Record<string, unknown>;
}
declare class HookManager {
    private hooks;
    private eventIndex;
    private logger;
    constructor(logLevel?: string);
    register(hook: HookDefinition): void;
    unregister(hookId: string): boolean;
    trigger(event: HookEvent, data?: Record<string, unknown>): Promise<void>;
    loadFromDirectory(dir: string): Promise<number>;
    list(): Array<{
        id: string;
        event: HookEvent;
        name: string;
        enabled: boolean;
    }>;
    setEnabled(hookId: string, enabled: boolean): boolean;
    private parseHookFile;
    private registerFromConfig;
}

export { type ChannelSecurityDmPolicy as $, type AgentResponse as A, type ChannelDirectoryAdapter as B, type ChannelId as C, type ChannelGatewayAdapter as D, type ChannelGatewayContext as E, type ChannelGroupContext as F, type ChannelHeartbeatAdapter as G, HookManager as H, type ImageContent as I, type ChannelLogSink as J, type ChannelMessageActionAdapter as K, type Lifecycle as L, type MCPServerRequestInit as M, type NovaClawConfig as N, type ChannelMessagingAdapter as O, type PluginChannelRuntime as P, type ChannelOnboardingAdapter as Q, type ChannelOutboundAdapter as R, type SessionContext as S, type ToolCall as T, type ChannelOutboundContext as U, type ChannelOutboundPayloadContext as V, type ChannelPairingAdapter as W, type ChannelPollContext as X, type ChannelPollResult as Y, type ChannelResolverAdapter as Z, type ChannelSecurityAdapter as _, type ChannelCapabilities as a, type ChannelSetupAdapter as a0, type ChannelStatusAdapter as a1, type ChannelStreamingAdapter as a2, type ChannelsConfig as a3, type ClusterConfig as a4, type ComponentHealth as a5, type LoggingConfig as a6, type MCPConfig as a7, type MemoryConfig as a8, type ModelProviderConfig as a9, type ModelsConfig as aa, type MonitoringConfig as ab, type OutboundDeliveryResult as ac, type PerformanceConfig as ad, type PermissionsConfig as ae, type PluginEntry as af, type PluginInstall as ag, type PluginInterface as ah, type PluginMetadata as ai, type PluginsConfig as aj, type RuntimeEnv as ak, type SandboxConfig as al, type SecurityConfig as am, type SkillsConfig as an, type TokenUsage as ao, type ToolExtension as ap, type ToolsConfig as aq, type UserConfig as ar, type UserConfigMeta as as, type HookContext as at, type HookDefinition as au, type HookEvent as av, type ChannelCommandAdapter as b, type ChannelElevatedAdapter as c, type ChannelConfigAdapter as d, type ChannelGroupAdapter as e, type ChannelMentionAdapter as f, type ChannelThreadingAdapter as g, type ChannelAgentPromptAdapter as h, type ChannelPlugin as i, type ChannelMeta as j, type ChannelRuntimeSnapshot as k, type ChannelAccountSnapshot as l, type ChatTurn as m, type MCPServerEntry as n, type StreamChunk as o, type MessageResponse as p, type CacheInterface as q, type ChannelDetailConfig as r, type Metrics as s, type MessageRequest as t, type HealthStatus as u, type Attachment as v, type ChannelAccountConfig as w, type ChannelAgentToolFactory as x, type ChannelAuthAdapter as y, type ChannelConfigSchema as z };
