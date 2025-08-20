import { api } from "#opendiscord";
declare module "#opendiscord-types" {
    interface ODPluginManagerIds_Default {
        "od-shutdown": api.ODPlugin;
    }
    interface ODSlashCommandManagerIds_Default {
        "od-shutdown:shutdown": api.ODSlashCommand;
    }
    interface ODTextCommandManagerIds_Default {
        "od-shutdown:shutdown": api.ODTextCommand;
    }
    interface ODCommandResponderManagerIds_Default {
        "od-shutdown:shutdown": {
            source: "slash" | "text";
            params: {};
            workers: "od-shutdown:shutdown" | "od-shutdown:logs";
        };
    }
    interface ODMessageManagerIds_Default {
        "od-shutdown:shutdown-message": {
            source: "slash" | "text" | "other";
            params: {};
            workers: "od-shutdown:shutdown-message";
        };
    }
    interface ODEmbedManagerIds_Default {
        "od-shutdown:shutdown-embed": {
            source: "slash" | "text" | "other";
            params: {};
            workers: "od-shutdown:shutdown-embed";
        };
    }
}
