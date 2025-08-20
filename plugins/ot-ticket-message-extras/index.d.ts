import { api } from "#opendiscord";
declare class OTTicketMessageExtrasConfig extends api.ODJsonConfig {
    data: {
        ticketCreatorPfpInThumbnail: boolean;
    };
}
declare module "#opendiscord-types" {
    interface ODPluginManagerIds_Default {
        "ot-ticket-message-extras": api.ODPlugin;
    }
    interface ODConfigManagerIds_Default {
        "ot-ticket-message-extras:config": OTTicketMessageExtrasConfig;
    }
    interface ODCheckerManagerIds_Default {
        "ot-ticket-message-extras:config": api.ODChecker;
    }
}
export {};
