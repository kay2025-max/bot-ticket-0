"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OTBetterStatusConfig = exports.betterStatusConfigStructure = exports.allVariables = void 0;
const _opendiscord_1 = require("#opendiscord");
if (_opendiscord_1.utilities.project != "openticket")
    throw new _opendiscord_1.api.ODPluginError("This plugin only works in Open Ticket!");
exports.allVariables = [
    "guild.members.all",
    "guild.members.online",
    "guild.members.offline",
    "guild.admins.all",
    "guild.admins.online",
    "guild.admins.offline",
    "guild.bots",
    "guild.roles",
    "guild.channels",
    "stats.tickets.created",
    "stats.tickets.closed",
    "stats.tickets.deleted",
    "stats.tickets.reopened",
    "stats.tickets.autoclosed",
    "stats.tickets.autodeleted",
    "stats.tickets.claimed",
    "stats.tickets.pinned",
    "stats.tickets.moved",
    "stats.users.blacklisted",
    "stats.transcripts.created",
    "tickets.open",
    "tickets.closed",
    "tickets.claimed",
    "tickets.pinned",
    "system.version",
    "system.uptime.minutes",
    "system.uptime.hours",
    "system.uptime.days",
    "system.plugins",
    "system.tickets",
    "system.questions",
    "system.options",
    "system.panels",
];
exports.betterStatusConfigStructure = new _opendiscord_1.api.ODCheckerObjectStructure("ot-better-status:config", {
    children: [
        {
            key: "stateSwitchDelaySeconds",
            optional: false,
            priority: 0,
            checker: new _opendiscord_1.api.ODCheckerNumberStructure("ot-better-status:state-switch-delay", { min: 10, max: 600, floatAllowed: false }),
        },
        {
            key: "states",
            optional: false,
            priority: 0,
            checker: new _opendiscord_1.api.ODCheckerArrayStructure("ot-better-status:states", {
                disableEmpty: true,
                allowedTypes: ["object"],
                propertyChecker: new _opendiscord_1.api.ODCheckerObjectStructure("ot-better-status:state", {
                    children: [
                        {
                            key: "type",
                            optional: false,
                            priority: 0,
                            checker: new _opendiscord_1.api.ODCheckerStringStructure("ot-better-status:state-type", { choices: ["listening", "watching", "playing", "custom"] }),
                        },
                        {
                            key: "text",
                            optional: false,
                            priority: 0,
                            checker: new _opendiscord_1.api.ODCheckerStringStructure("ot-better-status:state-text", { minLength: 3, maxLength: 50 }),
                        },
                        {
                            key: "status",
                            optional: false,
                            priority: 0,
                            checker: new _opendiscord_1.api.ODCheckerStringStructure("ot-better-status:state-status", { choices: ["online", "invisible", "idle", "dnd"] }),
                        },
                    ],
                }),
            }),
        },
        {
            key: "variables",
            optional: false,
            priority: 0,
            checker: new _opendiscord_1.api.ODCheckerArrayStructure("ot-better-status:variables", {
                disableEmpty: true,
                allowedTypes: ["object"],
                propertyChecker: new _opendiscord_1.api.ODCheckerObjectStructure("ot-better-status:variable", {
                    children: [
                        {
                            key: "name",
                            optional: false,
                            priority: 0,
                            checker: new _opendiscord_1.api.ODCheckerStringStructure("ot-better-status:variable-name", { minLength: 3, startsWith: "{", endsWith: "}" }),
                        },
                        {
                            key: "variable",
                            optional: false,
                            priority: 0,
                            checker: new _opendiscord_1.api.ODCheckerStringStructure("ot-better-status:variable-variable", { choices: exports.allVariables }),
                        },
                    ],
                }),
            }),
        },
    ],
});
//REGISTER CONFIG
class OTBetterStatusConfig extends _opendiscord_1.api.ODJsonConfig {
}
exports.OTBetterStatusConfig = OTBetterStatusConfig;
_opendiscord_1.opendiscord.events.get("onConfigLoad").listen((configs) => {
    configs.add(new OTBetterStatusConfig("ot-better-status:config", "config.json", "./plugins/ot-better-status/"));
});
//REGISTER CONFIG CHECKER
_opendiscord_1.opendiscord.events.get("onCheckerLoad").listen((checkers) => {
    checkers.add(new _opendiscord_1.api.ODChecker("ot-better-status:config", checkers.storage, 0, _opendiscord_1.opendiscord.configs.get("ot-better-status:config"), exports.betterStatusConfigStructure));
});
//ACCESS PRESENCE INTENTS
_opendiscord_1.opendiscord.events.get("onClientLoad").listen((client) => {
    client.privileges.push("Presence");
    client.intents.push("GuildPresences");
});
//DISABLE DEFAULTS (disables the default status behaviour from config/general.json)
_opendiscord_1.opendiscord.defaults.setDefault("clientActivityLoading", false);
_opendiscord_1.opendiscord.defaults.setDefault("clientActivityInitiating", false);
//GET ALL ADMIN MEMBERS
async function getAdminGuildMembers() {
    const globalAdminIds = _opendiscord_1.opendiscord.configs.get("opendiscord:general").data
        .globalAdmins;
    const ticketAdminIds = _opendiscord_1.opendiscord.configs
        .get("opendiscord:options")
        .data.filter((opt) => opt.type == "ticket")
        .map((opt) => opt.ticketAdmins.concat(opt.readonlyAdmins));
    const finalAdminIds = [...globalAdminIds];
    ticketAdminIds.forEach((optAdmins) => {
        optAdmins.forEach((id) => {
            if (!finalAdminIds.includes(id))
                finalAdminIds.push(id);
        });
    });
    //return when not in main server
    const mainServer = _opendiscord_1.opendiscord.client.mainServer;
    if (!mainServer)
        return [];
    //collect all members
    const members = [];
    for (const roleId of finalAdminIds) {
        try {
            const role = await mainServer.roles.fetch(roleId);
            if (role)
                role.members.forEach((member) => {
                    if (!members.find((m) => m.id == member.id))
                        members.push(member);
                });
        }
        catch { }
    }
    return members;
}
//PROCESS VARIABLES
async function processVariables(variables, text) {
    //return when not in main server
    const mainServer = _opendiscord_1.opendiscord.client.mainServer;
    if (!mainServer)
        return "<ERROR: mainServer>";
    let processedText = text;
    for (const vari of variables) {
        let content;
        if (vari.variable == "guild.members.all")
            content = mainServer.memberCount.toString() ?? "0";
        else if (vari.variable == "guild.members.online")
            content = (await mainServer.members.list())
                .filter((m) => m.presence && m.presence.status == "online")
                .size.toString();
        else if (vari.variable == "guild.members.offline")
            content = (await mainServer.members.list())
                .filter((m) => m.presence && m.presence.status == "offline")
                .size.toString();
        else if (vari.variable == "guild.admins.all")
            content = (await getAdminGuildMembers()).length.toString();
        else if (vari.variable == "guild.admins.online")
            content = (await getAdminGuildMembers())
                .filter((m) => m.presence && m.presence.status == "online")
                .length.toString();
        else if (vari.variable == "guild.admins.offline")
            content = (await getAdminGuildMembers())
                .filter((m) => m.presence && m.presence.status == "offline")
                .length.toString();
        else if (vari.variable == "guild.bots")
            content = (await mainServer.members.list())
                .filter((m) => m.user.bot)
                .size.toString();
        else if (vari.variable == "guild.roles")
            content = mainServer.roles.cache.size.toString();
        else if (vari.variable == "guild.channels")
            content = mainServer.channels.cache.size.toString();
        else if (vari.variable == "stats.tickets.created")
            content =
                (await _opendiscord_1.opendiscord.stats
                    .get("opendiscord:global")
                    .getStat("opendiscord:tickets-created"))?.toString() ?? "0";
        else if (vari.variable == "stats.tickets.closed")
            content =
                (await _opendiscord_1.opendiscord.stats
                    .get("opendiscord:global")
                    .getStat("opendiscord:tickets-closed"))?.toString() ?? "0";
        else if (vari.variable == "stats.tickets.deleted")
            content =
                (await _opendiscord_1.opendiscord.stats
                    .get("opendiscord:global")
                    .getStat("opendiscord:tickets-deleted"))?.toString() ?? "0";
        else if (vari.variable == "stats.tickets.reopened")
            content =
                (await _opendiscord_1.opendiscord.stats
                    .get("opendiscord:global")
                    .getStat("opendiscord:tickets-reopened"))?.toString() ?? "0";
        else if (vari.variable == "stats.tickets.autoclosed")
            content =
                (await _opendiscord_1.opendiscord.stats
                    .get("opendiscord:global")
                    .getStat("opendiscord:tickets-autoclosed"))?.toString() ?? "0";
        else if (vari.variable == "stats.tickets.autodeleted")
            content =
                (await _opendiscord_1.opendiscord.stats
                    .get("opendiscord:global")
                    .getStat("opendiscord:tickets-autodeleted"))?.toString() ?? "0";
        else if (vari.variable == "stats.tickets.claimed")
            content =
                (await _opendiscord_1.opendiscord.stats
                    .get("opendiscord:global")
                    .getStat("opendiscord:tickets-claimed"))?.toString() ?? "0";
        else if (vari.variable == "stats.tickets.pinned")
            content =
                (await _opendiscord_1.opendiscord.stats
                    .get("opendiscord:global")
                    .getStat("opendiscord:tickets-pinned"))?.toString() ?? "0";
        else if (vari.variable == "stats.tickets.moved")
            content =
                (await _opendiscord_1.opendiscord.stats
                    .get("opendiscord:global")
                    .getStat("opendiscord:tickets-moved"))?.toString() ?? "0";
        else if (vari.variable == "stats.users.blacklisted")
            content =
                (await _opendiscord_1.opendiscord.stats
                    .get("opendiscord:global")
                    .getStat("opendiscord:users-blacklisted"))?.toString() ?? "0";
        else if (vari.variable == "stats.transcripts.created")
            content =
                (await _opendiscord_1.opendiscord.stats
                    .get("opendiscord:global")
                    .getStat("opendiscord:transcripts-created"))?.toString() ?? "0";
        else if (vari.variable == "tickets.open")
            content = _opendiscord_1.opendiscord.tickets
                .getFiltered((ticket) => !ticket.get("opendiscord:closed").value)
                .length.toString();
        else if (vari.variable == "tickets.closed")
            content = _opendiscord_1.opendiscord.tickets
                .getFiltered((ticket) => ticket.get("opendiscord:closed").value)
                .length.toString();
        else if (vari.variable == "tickets.claimed")
            content = _opendiscord_1.opendiscord.tickets
                .getFiltered((ticket) => ticket.get("opendiscord:claimed").value)
                .length.toString();
        else if (vari.variable == "tickets.pinned")
            content = _opendiscord_1.opendiscord.tickets
                .getFiltered((ticket) => ticket.get("opendiscord:pinned").value)
                .length.toString();
        else if (vari.variable == "system.version")
            content = _opendiscord_1.opendiscord.versions.get("opendiscord:version").toString();
        else if (vari.variable == "system.uptime.minutes")
            content = Math.floor((new Date().getTime() - _opendiscord_1.opendiscord.processStartupDate.getTime()) /
                1000 /
                60).toString();
        else if (vari.variable == "system.uptime.hours")
            content = Math.floor((new Date().getTime() - _opendiscord_1.opendiscord.processStartupDate.getTime()) /
                1000 /
                60 /
                60).toString();
        else if (vari.variable == "system.uptime.days")
            content = Math.floor((new Date().getTime() - _opendiscord_1.opendiscord.processStartupDate.getTime()) /
                1000 /
                60 /
                60 /
                24).toString();
        else if (vari.variable == "system.plugins")
            content = _opendiscord_1.opendiscord.plugins.getLength().toString();
        else if (vari.variable == "system.tickets")
            content = _opendiscord_1.opendiscord.tickets.getLength().toString();
        else if (vari.variable == "system.questions")
            content = _opendiscord_1.opendiscord.questions.getLength().toString();
        else if (vari.variable == "system.options")
            content = _opendiscord_1.opendiscord.options.getLength().toString();
        else if (vari.variable == "system.panels")
            content = _opendiscord_1.opendiscord.panels.getLength().toString();
        else
            content = "";
        processedText = processedText.replaceAll(vari.name, content);
    }
    return processedText;
}
//REGISTER CLIENT ACTIVITY
_opendiscord_1.opendiscord.events.get("onClientActivityInit").listen((activity) => {
    const config = _opendiscord_1.opendiscord.configs.get("ot-better-status:config");
    const switchDelay = config.data.stateSwitchDelaySeconds * 1000;
    const states = config.data.states;
    const variables = config.data.variables;
    let state = 0;
    const maxState = config.data.states.length - 1;
    //first status starts after bot initialisation
    _opendiscord_1.opendiscord.events.get("onReadyForUsage").listen(async () => {
        _opendiscord_1.opendiscord.client.activity.setStatus(states[0].type, await processVariables(variables, states[0].text), states[0].status, true);
        setInterval(async () => {
            state = state >= maxState ? 0 : state + 1;
            _opendiscord_1.opendiscord.client.activity.setStatus(states[state].type, await processVariables(variables, states[state].text), states[state].status, true);
        }, switchDelay);
    });
});
