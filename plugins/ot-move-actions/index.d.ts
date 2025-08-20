import { api } from "#opendiscord";
declare class OTMoveActionsConfig extends api.ODJsonConfig {
    data: {
        unclaimOnMove: boolean;
        unpinOnMove: boolean;
        unclaimOnCategoryChange: boolean;
        unpinOnCategoryChange: boolean;
    };
}
declare module "#opendiscord-types" {
    interface ODPluginManagerIds_Default {
        "ot-move-actions": api.ODPlugin;
    }
    interface ODConfigManagerIds_Default {
        "ot-move-actions:config": OTMoveActionsConfig;
    }
    interface ODCheckerManagerIds_Default {
        "ot-move-actions:config": api.ODChecker;
    }
}
export {};
