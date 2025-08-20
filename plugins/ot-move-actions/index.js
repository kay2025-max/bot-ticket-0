"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _opendiscord_1 = require("#opendiscord");
if (_opendiscord_1.utilities.project != "openticket")
    throw new _opendiscord_1.api.ODPluginError("This plugin only works in Open Ticket!");
//DECLARATION
class OTMoveActionsConfig extends _opendiscord_1.api.ODJsonConfig {
}
//REGISTER CONFIG
_opendiscord_1.opendiscord.events.get("onConfigLoad").listen((configs) => {
    configs.add(new OTMoveActionsConfig("ot-move-actions:config", "config.json", "./plugins/ot-move-actions/"));
});
//REGISTER CONFIG CHECKER
_opendiscord_1.opendiscord.events.get("onCheckerLoad").listen((checkers) => {
    const config = _opendiscord_1.opendiscord.configs.get("ot-move-actions:config");
    checkers.add(new _opendiscord_1.api.ODChecker("ot-move-actions:config", checkers.storage, 0, config, new _opendiscord_1.api.ODCheckerObjectStructure("ot-move-actions:config", {
        children: [
            {
                key: "unclaimOnMove",
                optional: false,
                priority: 0,
                checker: new _opendiscord_1.api.ODCheckerBooleanStructure("ot-move-actions:unclaim-on-move", {}),
            },
            {
                key: "unpinOnMove",
                optional: false,
                priority: 0,
                checker: new _opendiscord_1.api.ODCheckerBooleanStructure("ot-move-actions:unpin-on-move", {}),
            },
            {
                key: "unclaimOnCategoryChange",
                optional: false,
                priority: 0,
                checker: new _opendiscord_1.api.ODCheckerBooleanStructure("ot-move-actions:unclaim-on-category-change", {}),
            },
            {
                key: "unpinOnCategoryChange",
                optional: false,
                priority: 0,
                checker: new _opendiscord_1.api.ODCheckerBooleanStructure("ot-move-actions:unpin-on-category-change", {}),
            },
        ],
    })));
});
//TRIGGER AFTER TICKET MOVED
_opendiscord_1.opendiscord.events
    .get("afterTicketMoved")
    .listen((ticket, mover, channel, reason) => {
    const config = _opendiscord_1.opendiscord.configs.get("ot-move-actions:config");
    //unclaim ticket
    if (config.data.unclaimOnMove && ticket.get("opendiscord:claimed").value) {
        _opendiscord_1.opendiscord.actions
            .get("opendiscord:unclaim-ticket")
            .run("other", {
            guild: channel.guild,
            channel,
            user: mover,
            ticket,
            reason: "Auto Unclaim (Ticket Moved)",
            sendMessage: true,
        });
    }
    //unpin ticket
    if (config.data.unpinOnMove && ticket.get("opendiscord:pinned").value) {
        _opendiscord_1.opendiscord.actions
            .get("opendiscord:unpin-ticket")
            .run("other", {
            guild: channel.guild,
            channel,
            user: mover,
            ticket,
            reason: "Auto Unpin (Ticket Moved)",
            sendMessage: true,
        });
    }
});
//TRIGGER ON TICKET CHANNEL MOVED
_opendiscord_1.opendiscord.events.get("onClientReady").listen((client) => {
    const config = _opendiscord_1.opendiscord.configs.get("ot-move-actions:config");
    client.client.on("channelUpdate", (oldChannel, newChannel) => {
        if (oldChannel.isDMBased() ||
            newChannel.isDMBased() ||
            !newChannel.isTextBased())
            return;
        //ticket has been moved to another category
        const ticket = _opendiscord_1.opendiscord.tickets.get(newChannel.id);
        if (ticket && oldChannel.parentId !== newChannel.parentId) {
            //unclaim ticket
            if (config.data.unclaimOnCategoryChange &&
                ticket.get("opendiscord:claimed").value) {
                _opendiscord_1.opendiscord.actions
                    .get("opendiscord:unclaim-ticket")
                    .run("other", {
                    guild: newChannel.guild,
                    channel: newChannel,
                    user: client.client.user,
                    ticket,
                    reason: "Auto Unclaim (Category Change)",
                    sendMessage: true,
                    allowCategoryChange: false,
                });
            }
            //unpin ticket
            if (config.data.unpinOnCategoryChange &&
                ticket.get("opendiscord:pinned").value) {
                _opendiscord_1.opendiscord.actions
                    .get("opendiscord:unpin-ticket")
                    .run("other", {
                    guild: newChannel.guild,
                    channel: newChannel,
                    user: client.client.user,
                    ticket,
                    reason: "Auto Unpin (Category Change)",
                    sendMessage: true,
                });
            }
        }
    });
});
