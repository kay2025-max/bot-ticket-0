import { api } from "#opendiscord";
declare module "#opendiscord-types" {
    interface ODPluginManagerIds_Default {
        "ot-jump-to-top": api.ODPlugin;
    }
    interface ODSlashCommandManagerIds_Default {
        "ot-jump-to-top:top": api.ODSlashCommand;
    }
    interface ODTextCommandManagerIds_Default {
        "ot-jump-to-top:top": api.ODTextCommand;
    }
    interface ODCommandResponderManagerIds_Default {
        "ot-jump-to-top:top": {
            source: "slash" | "text";
            params: {};
            workers: "ot-jump-to-top:top" | "ot-jump-to-top:logs";
        };
    }
    interface ODButtonManagerIds_Default {
        "ot-jump-to-top:top-button": {
            source: "slash" | "text" | "other";
            params: {
                url: string;
            };
            workers: "ot-jump-to-top:top-button";
        };
    }
    interface ODMessageManagerIds_Default {
        "ot-jump-to-top:top-message": {
            source: "slash" | "text" | "other";
            params: {
                url: string;
            };
            workers: "ot-jump-to-top:top-message";
        };
    }
}
