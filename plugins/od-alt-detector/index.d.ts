import { api } from "#opendiscord";
import * as discord from "discord.js";
import { AltDetector, AltDetectorResult } from "discord-alt-detector";
export declare class ODAltDetector extends api.ODManagerData {
    detector: AltDetector;
    constructor(id: api.ODValidId, detector: AltDetector);
}
declare module "#opendiscord-types" {
    interface ODPluginManagerIds_Default {
        "od-alt-detector": api.ODPlugin;
    }
    interface ODMessageManagerIds_Default {
        "od-alt-detector:log-message": {
            source: "other";
            params: {
                member: discord.GuildMember;
                result: AltDetectorResult;
            };
            workers: "od-alt-detector:log-message";
        };
    }
    interface ODEmbedManagerIds_Default {
        "od-alt-detector:log-embed": {
            source: "other";
            params: {
                member: discord.GuildMember;
                result: AltDetectorResult;
            };
            workers: "od-alt-detector:log-embed";
        };
    }
    interface ODEventIds_Default {
        "od-alt-detector:onAltDetect": api.ODEvent_Default<(member: discord.GuildMember) => api.ODPromiseVoid>;
        "od-alt-detector:afterAltDetected": api.ODEvent_Default<(member: discord.GuildMember, result: AltDetectorResult) => api.ODPromiseVoid>;
    }
    interface ODPluginClassManagerIds_Default {
        "od-alt-detector:detector": ODAltDetector;
    }
}
