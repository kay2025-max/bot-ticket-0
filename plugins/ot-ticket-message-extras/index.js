"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _opendiscord_1 = require("#opendiscord");
if (_opendiscord_1.utilities.project != "openticket")
    throw new _opendiscord_1.api.ODPluginError("This plugin only works in Open Ticket!");
//DECLARATION
class OTTicketMessageExtrasConfig extends _opendiscord_1.api.ODJsonConfig {
}
//REGISTER CONFIG
_opendiscord_1.opendiscord.events.get("onConfigLoad").listen((configs) => {
    configs.add(new OTTicketMessageExtrasConfig("ot-ticket-message-extras:config", "config.json", "./plugins/ot-ticket-message-extras/"));
});
//REGISTER CONFIG CHECKER
_opendiscord_1.opendiscord.events.get("onCheckerLoad").listen((checkers) => {
    const config = _opendiscord_1.opendiscord.configs.get("ot-ticket-message-extras:config");
    const structure = new _opendiscord_1.api.ODCheckerObjectStructure("ot-ticket-message-extras:config", {
        children: [
            {
                key: "ticketCreatorPfpInThumbnail",
                optional: false,
                priority: 0,
                checker: new _opendiscord_1.api.ODCheckerBooleanStructure("ot-feedback:ticket-creator-pfp-in-thumbnail", {}),
            },
        ],
    });
    checkers.add(new _opendiscord_1.api.ODChecker("ot-ticket-message-extras:config", checkers.storage, 0, config, structure));
});
//FEATURE: ticketCreatorPfpInThumbnail
_opendiscord_1.opendiscord.events.get("afterEmbedBuildersLoaded").listen((embeds) => {
    const config = _opendiscord_1.opendiscord.configs.get("ot-ticket-message-extras:config");
    embeds.get("opendiscord:ticket-message").workers.add(new _opendiscord_1.api.ODWorker("ot-ticket-message-extras:creator-pfp", 1, (instance, params, source, cancel) => {
        const { user } = params;
        if (config.data.ticketCreatorPfpInThumbnail)
            instance.setThumbnail(user.displayAvatarURL());
    }));
});
