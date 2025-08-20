import { api } from "#opendiscord";
import * as discord from "discord.js";
export declare class OTKillSwitchManager extends api.ODManagerData {
    enabled: boolean;
}
declare module "#opendiscord-types" {
    interface ODPluginManagerIds_Default {
        "ot-kill-switch": api.ODPlugin;
    }
    interface ODSlashCommandManagerIds_Default {
        "ot-kill-switch:kill": api.ODSlashCommand;
    }
    interface ODTextCommandManagerIds_Default {
        "ot-kill-switch:kill": api.ODTextCommand;
    }
    interface ODCommandResponderManagerIds_Default {
        "ot-kill-switch:kill": {
            source: "slash" | "text";
            params: {};
            workers: "ot-kill-switch:kill" | "ot-kill-switch:logs";
        };
    }
    interface ODMessageManagerIds_Default {
        "ot-kill-switch:kill-message": {
            source: "slash" | "text" | "other";
            params: {
                enabled: boolean;
                user: discord.User;
            };
            workers: "ot-kill-switch:kill-message";
        };
        "ot-kill-switch:active-message": {
            source: "slash" | "text" | "button" | "dropdown" | "other";
            params: {};
            workers: "ot-kill-switch:active-message";
        };
    }
    interface ODEmbedManagerIds_Default {
        "ot-kill-switch:kill-embed": {
            source: "slash" | "text" | "other";
            params: {
                enabled: boolean;
                user: discord.User;
            };
            workers: "ot-kill-switch:kill-embed";
        };
        "ot-kill-switch:active-embed": {
            source: "slash" | "text" | "button" | "dropdown" | "other";
            params: {};
            workers: "ot-kill-switch:active-embed";
        };
    }
    interface ODPluginClassManagerIds_Default {
        "ot-kill-switch:manager": OTKillSwitchManager;
    }
}
