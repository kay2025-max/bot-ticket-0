"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const _opendiscord_1 = require("#opendiscord");
const discord = __importStar(require("discord.js"));
if (_opendiscord_1.utilities.project != "openticket")
    throw new _opendiscord_1.api.ODPluginError("This plugin only works in Open Ticket!");
//REGISTER SLASH COMMAND
_opendiscord_1.opendiscord.events.get("onSlashCommandLoad").listen((slash) => {
    slash.add(new _opendiscord_1.api.ODSlashCommand("ot-jump-to-top:top", {
        name: "top",
        description: "Jump to the top of the ticket.",
        type: discord.ApplicationCommandType.ChatInput,
        contexts: [discord.InteractionContextType.Guild],
        integrationTypes: [discord.ApplicationIntegrationType.GuildInstall],
    }));
});
//REGISTER TEXT COMMAND
_opendiscord_1.opendiscord.events.get("onTextCommandLoad").listen((text) => {
    const generalConfig = _opendiscord_1.opendiscord.configs.get("opendiscord:general");
    text.add(new _opendiscord_1.api.ODTextCommand("ot-jump-to-top:top", {
        name: "top",
        prefix: generalConfig.data.prefix,
        dmPermission: false,
        guildPermission: true,
    }));
});
//REGISTER HELP MENU
_opendiscord_1.opendiscord.events.get("onHelpMenuComponentLoad").listen((menu) => {
    menu.get("opendiscord:extra").add(new _opendiscord_1.api.ODHelpMenuCommandComponent("ot-jump-to-top:top", 0, {
        slashName: "top",
        textName: "top",
        slashDescription: "Jump to the top of the ticket.",
        textDescription: "Jump to the top of the ticket.",
    }));
});
//REGISTER BUILDERS
_opendiscord_1.opendiscord.events.get("onButtonBuilderLoad").listen((buttons) => {
    buttons.add(new _opendiscord_1.api.ODButton("ot-jump-to-top:top-button"));
    buttons.get("ot-jump-to-top:top-button").workers.add(new _opendiscord_1.api.ODWorker("ot-jump-to-top:top-button", 0, (instance, params, source, cancel) => {
        instance.setMode("url");
        instance.setUrl(params.url);
        instance.setEmoji("⬆️");
        instance.setLabel("Back To Top");
    }));
});
_opendiscord_1.opendiscord.events.get("onMessageBuilderLoad").listen((messages) => {
    messages.add(new _opendiscord_1.api.ODMessage("ot-jump-to-top:top-message"));
    messages.get("ot-jump-to-top:top-message").workers.add(new _opendiscord_1.api.ODWorker("ot-jump-to-top:top-message", 0, async (instance, params, source, cancel) => {
        instance.addComponent(await _opendiscord_1.opendiscord.builders.buttons
            .getSafe("ot-jump-to-top:top-button")
            .build(source, { url: params.url }));
        instance.setContent("**Click to go to the top of this ticket.**");
    }));
});
//REGISTER COMMAND RESPONDER
_opendiscord_1.opendiscord.events.get("onCommandResponderLoad").listen((commands) => {
    const generalConfig = _opendiscord_1.opendiscord.configs.get("opendiscord:general");
    commands.add(new _opendiscord_1.api.ODCommandResponder("ot-jump-to-top:top", generalConfig.data.prefix, "top"));
    commands.get("ot-jump-to-top:top").workers.add([
        new _opendiscord_1.api.ODWorker("ot-jump-to-top:top", 0, async (instance, params, source, cancel) => {
            const { guild, channel, user } = instance;
            if (!guild) {
                instance.reply(await _opendiscord_1.opendiscord.builders.messages
                    .getSafe("opendiscord:error-not-in-guild")
                    .build(source, { channel, user }));
                return cancel();
            }
            const ticket = _opendiscord_1.opendiscord.tickets.get(channel.id);
            if (!ticket || channel.isDMBased()) {
                instance.reply(await _opendiscord_1.opendiscord.builders.messages
                    .getSafe("opendiscord:error-ticket-unknown")
                    .build(source, { guild, channel, user }));
                return cancel();
            }
            //return when busy
            if (ticket.get("opendiscord:busy").value) {
                instance.reply(await _opendiscord_1.opendiscord.builders.messages
                    .getSafe("opendiscord:error-ticket-busy")
                    .build(source, { guild, channel, user }));
                return cancel();
            }
            const msg = await _opendiscord_1.opendiscord.tickets.getTicketMessage(ticket);
            if (!msg) {
                instance.reply(await _opendiscord_1.opendiscord.builders.messages
                    .getSafe("opendiscord:error")
                    .build(source, {
                    guild,
                    channel,
                    user,
                    error: "Unable to find ticket message!",
                    layout: "simple",
                }));
                return cancel();
            }
            await instance.reply(await _opendiscord_1.opendiscord.builders.messages
                .getSafe("ot-jump-to-top:top-message")
                .build(source, { url: msg.url }));
        }),
        new _opendiscord_1.api.ODWorker("ot-jump-to-top:logs", -1, (instance, params, source, cancel) => {
            _opendiscord_1.opendiscord.log(instance.user.displayName + " used the 'top' command!", "plugin", [
                { key: "user", value: instance.user.username },
                { key: "userid", value: instance.user.id, hidden: true },
                { key: "channelid", value: instance.channel.id, hidden: true },
                { key: "method", value: source },
            ]);
        }),
    ]);
});
