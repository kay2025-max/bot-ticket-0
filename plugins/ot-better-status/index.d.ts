import { api } from "#opendiscord";
declare module "#opendiscord-types" {
    interface ODPluginManagerIds_Default {
        "ot-better-status": api.ODPlugin;
    }
    interface ODConfigManagerIds_Default {
        "ot-better-status:config": OTBetterStatusConfig;
    }
    interface ODCheckerManagerIds_Default {
        "ot-better-status:config": api.ODChecker;
    }
}
export declare const allVariables: string[];
export type OTBetterStatusAllVariables = "guild.members.all" | "guild.members.online" | "guild.members.offline" | "guild.admins.all" | "guild.admins.online" | "guild.admins.offline" | "guild.bots" | "guild.roles" | "guild.channels" | "stats.tickets.created" | "stats.tickets.closed" | "stats.tickets.deleted" | "stats.tickets.reopened" | "stats.tickets.autoclosed" | "stats.tickets.autodeleted" | "stats.tickets.claimed" | "stats.tickets.pinned" | "stats.tickets.moved" | "stats.users.blacklisted" | "stats.transcripts.created" | "tickets.open" | "tickets.closed" | "tickets.claimed" | "tickets.pinned" | "system.version" | "system.uptime.minutes" | "system.uptime.hours" | "system.uptime.days" | "system.plugins" | "system.tickets" | "system.questions" | "system.options" | "system.panels";
export declare const betterStatusConfigStructure: api.ODCheckerObjectStructure;
export declare class OTBetterStatusConfig extends api.ODJsonConfig {
    data: {
        stateSwitchDelaySeconds: number;
        states: {
            type: "listening" | "watching" | "playing" | "custom";
            text: string;
            status: "online" | "invisible" | "idle" | "dnd";
        }[];
        variables: {
            name: string;
            variable: OTBetterStatusAllVariables;
        }[];
    };
}
