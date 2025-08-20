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
//REGISTER SLASH COMMAND
_opendiscord_1.opendiscord.events.get("onSlashCommandLoad").listen((slash) => {
    slash.add(new _opendiscord_1.api.ODSlashCommand("od-shutdown:shutdown", {
        name: "shutdown",
        description: "Turn off the bot by stopping the process! (server & bot owner only)",
        type: discord.ApplicationCommandType.ChatInput,
        contexts: [discord.InteractionContextType.Guild],
        integrationTypes: [discord.ApplicationIntegrationType.GuildInstall],
    }));
});
//REGISTER TEXT COMMAND
_opendiscord_1.opendiscord.events.get("onTextCommandLoad").listen((text) => {
    const generalConfig = _opendiscord_1.opendiscord.configs.get("opendiscord:general");
    text.add(new _opendiscord_1.api.ODTextCommand("od-shutdown:shutdown", {
        name: "shutdown",
        prefix: generalConfig.data.prefix,
        dmPermission: false,
        guildPermission: true,
    }));
});
//REGISTER HELP MENU
_opendiscord_1.opendiscord.events.get("onHelpMenuComponentLoad").listen((menu) => {
    menu.get("opendiscord:extra").add(new _opendiscord_1.api.ODHelpMenuCommandComponent("od-shutdown:shutdown", 0, {
        slashName: "shutdown",
        textName: "shutdown",
        slashDescription: "Turn off the bot!",
        textDescription: "Turn off the bot!",
    }));
});
//REGISTER EMBED BUILDER
_opendiscord_1.opendiscord.events.get("onEmbedBuilderLoad").listen((embeds) => {
    embeds.add(new _opendiscord_1.api.ODEmbed("od-shutdown:shutdown-embed"));
    embeds.get("od-shutdown:shutdown-embed").workers.add(new _opendiscord_1.api.ODWorker("od-shutdown:shutdown-embed", 0, (instance, params, source, cancel) => {
        const generalConfig = _opendiscord_1.opendiscord.configs.get("opendiscord:general");
        instance.setTitle(_opendiscord_1.utilities.emojiTitle("🪫", "Shutdown"));
        instance.setColor(generalConfig.data.mainColor);
        instance.setDescription("The bot will turn off in a few seconds!");
    }));
});
//REGISTER MESSAGE BUILDER
_opendiscord_1.opendiscord.events.get("onMessageBuilderLoad").listen((messages) => {
    messages.add(new _opendiscord_1.api.ODMessage("od-shutdown:shutdown-message"));
    messages.get("od-shutdown:shutdown-message").workers.add(new _opendiscord_1.api.ODWorker("od-shutdown:shutdown-message", 0, async (instance, params, source, cancel) => {
        instance.addEmbed(await _opendiscord_1.opendiscord.builders.embeds
            .getSafe("od-shutdown:shutdown-embed")
            .build(source, {}));
    }));
});
//REGISTER COMMAND RESPONDER
_opendiscord_1.opendiscord.events.get("onCommandResponderLoad").listen((commands) => {
    const generalConfig = _opendiscord_1.opendiscord.configs.get("opendiscord:general");
    commands.add(new _opendiscord_1.api.ODCommandResponder("od-shutdown:shutdown", generalConfig.data.prefix, "shutdown"));
    commands.get("od-shutdown:shutdown").workers.add([
        new _opendiscord_1.api.ODWorker("opendiscord:permissions", 1, async (instance, params, source, cancel) => {
            if (!_opendiscord_1.opendiscord.permissions.hasPermissions("owner", await _opendiscord_1.opendiscord.permissions.getPermissions(instance.user, instance.channel, instance.guild, {
                allowChannelRoleScope: false,
                allowChannelUserScope: false,
                allowGlobalRoleScope: true,
                allowGlobalUserScope: true,
            }))) {
                //no permissions
                instance.reply(await _opendiscord_1.opendiscord.builders.messages
                    .getSafe("opendiscord:error-no-permissions")
                    .build(source, {
                    guild: instance.guild,
                    channel: instance.channel,
                    user: instance.user,
                    permissions: ["admin"],
                }));
                return cancel();
            }
        }),
        new _opendiscord_1.api.ODWorker("od-shutdown:shutdown", 0, async (instance, params, source, cancel) => {
            const { guild, channel, user } = instance;
            if (!guild) {
                instance.reply(await _opendiscord_1.opendiscord.builders.messages
                    .getSafe("opendiscord:error-not-in-guild")
                    .build(source, { channel, user }));
                return cancel();
            }
            await instance.reply(await _opendiscord_1.opendiscord.builders.messages
                .getSafe("od-shutdown:shutdown-message")
                .build(source, {}));
        }),
        new _opendiscord_1.api.ODWorker("od-shutdown:logs", -1, (instance, params, source, cancel) => {
            _opendiscord_1.opendiscord.log(instance.user.displayName + " used the 'shutdown' command!", "plugin", [
                { key: "user", value: instance.user.username },
                { key: "userid", value: instance.user.id, hidden: true },
                { key: "channelid", value: instance.channel.id, hidden: true },
                { key: "method", value: source },
            ]);
        }),
        new _opendiscord_1.api.ODWorker("od-shutdown:exit-process", -2, async (instance, params, source, cancel) => {
            _opendiscord_1.opendiscord.log("Shutting down the bot...", "warning");
            _opendiscord_1.opendiscord.client.activity.setStatus("custom", "shutting down...", "invisible", true);
            await _opendiscord_1.utilities.timer(2000);
            process.exit(0);
        }),
    ]);
});
