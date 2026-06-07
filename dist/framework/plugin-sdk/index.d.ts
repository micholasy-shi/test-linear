import { C as ChannelId, j as ChannelMeta, a as ChannelCapabilities, d as ChannelConfigAdapter, z as ChannelConfigSchema, a0 as ChannelSetupAdapter, Q as ChannelOnboardingAdapter, D as ChannelGatewayAdapter, R as ChannelOutboundAdapter, y as ChannelAuthAdapter, G as ChannelHeartbeatAdapter, _ as ChannelSecurityAdapter, W as ChannelPairingAdapter, b as ChannelCommandAdapter, c as ChannelElevatedAdapter, f as ChannelMentionAdapter, e as ChannelGroupAdapter, g as ChannelThreadingAdapter, a2 as ChannelStreamingAdapter, O as ChannelMessagingAdapter, B as ChannelDirectoryAdapter, Z as ChannelResolverAdapter, K as ChannelMessageActionAdapter, h as ChannelAgentPromptAdapter, x as ChannelAgentToolFactory, a1 as ChannelStatusAdapter, i as ChannelPlugin } from '../../hook-manager-BEcIg841.js';
export { w as ChannelAccountConfig, r as ChannelDetailConfig, E as ChannelGatewayContext, U as ChannelOutboundContext, a3 as ChannelsConfig, at as HookContext, au as HookDefinition, av as HookEvent, p as MessageResponse, N as NovaClawConfig, P as PluginChannelRuntime, S as SessionContext, o as StreamChunk } from '../../hook-manager-BEcIg841.js';
import 'zod';

/**
 * Channel Plugin SDK — helper to define channel plugins for external extensions.
 * Provides a type-safe builder for constructing ChannelPlugin instances.
 */

interface PluginMetadata {
    name: string;
    version: string;
    description?: string;
    author?: string;
}
interface DefineChannelPluginOptions<ResolvedAccount = unknown> {
    id: ChannelId;
    meta: ChannelMeta;
    capabilities: ChannelCapabilities;
    pluginMetadata?: PluginMetadata;
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
}
declare function defineChannelPlugin<ResolvedAccount = unknown>(opts: DefineChannelPluginOptions<ResolvedAccount>): ChannelPlugin<ResolvedAccount>;

export { ChannelCapabilities, ChannelCommandAdapter, ChannelConfigAdapter, ChannelConfigSchema, ChannelGatewayAdapter, ChannelId, ChannelMeta, ChannelOutboundAdapter, ChannelPairingAdapter, ChannelPlugin, ChannelSecurityAdapter, type DefineChannelPluginOptions, type PluginMetadata, defineChannelPlugin };
