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
exports.OTKillSwitchManager = void 0;
const _opendiscord_1 = require("#opendiscord");
const discord = __importStar(require("discord.js"));
if (_opendiscord_1.utilities.project != "openticket")
    throw new _opendiscord_1.api.ODPluginError("This plugin only works in Open Ticket!");
//DECLARATION
class OTKillSwitchManager extends _opendiscord_1.api.ODManagerData {
    enabled = false;
}
exports.OTKillSwitchManager = OTKillSwitchManager;
//REGISTER MANAGER CLASS
_opendiscord_1.opendiscord.events.get("onPluginClassLoad").listen((classes) => {
    classes.add(new OTKillSwitchManager("ot-kill-switch:manager"));
});
//REGISTER SLASH COMMAND
_opendiscord_1.opendiscord.events.get("onSlashCommandLoad").listen((slash) => {
    slash.add(new _opendiscord_1.api.ODSlashCommand("ot-kill-switch:kill", {
        name: "kill",
        description: "Temporarily disable the ability to create tickets",
        type: discord.ApplicationCommandType.ChatInput,
        contexts: [discord.InteractionContextType.Guild],
        integrationTypes: [discord.ApplicationIntegrationType.GuildInstall],
        options: [
            {
                type: discord.ApplicationCommandOptionType.String,
                required: true,
                name: "enabled",
                description: "Enable/disable the kill switch.",
                choices: [
                    { name: "Enable", value: "true" },
                    { name: "Disable", value: "false" },
                ],
            },
        ],
    }));
});
//REGISTER TEXT COMMAND
_opendiscord_1.opendiscord.events.get("onTextCommandLoad").listen((text) => {
    const generalConfig = _opendiscord_1.opendiscord.configs.get("opendiscord:general");
    text.add(new _opendiscord_1.api.ODTextCommand("ot-kill-switch:kill", {
        name: "kill",
        prefix: generalConfig.data.prefix,
        dmPermission: false,
        guildPermission: true,
        options: [
            {
                type: "string",
                required: true,
                name: "enabled",
            },
        ],
    }));
});
//REGISTER HELP MENU
_opendiscord_1.opendiscord.events.get("onHelpMenuComponentLoad").listen((menu) => {
    menu.get("opendiscord:extra").add(new _opendiscord_1.api.ODHelpMenuCommandComponent("ot-kill-switch:kill", 0, {
        slashName: "kill",
        textName: "kill",
        slashDescription: "Enable/disable the kill switch.",
        textDescription: "Enable/disable the kill switch.",
        textOptions: [{ name: "enabled", optional: false }],
        slashOptions: [{ name: "enabled", optional: false }],
    }));
});
//REGISTER EMBED BUILDER
_opendiscord_1.opendiscord.events.get("onEmbedBuilderLoad").listen((embeds) => {
    embeds.add(new _opendiscord_1.api.ODEmbed("ot-kill-switch:kill-embed"));
    embeds.get("ot-kill-switch:kill-embed").workers.add(new _opendiscord_1.api.ODWorker("ot-kill-switch:kill-embed", 0, (instance, params, source, cancel) => {
        const generalConfig = _opendiscord_1.opendiscord.configs.get("opendiscord:general");
        instance.setTitle(_opendiscord_1.utilities.emojiTitle("💀", "Kill Switch " + (params.enabled ? "Enabled" : "Disabled")));
        instance.setColor(generalConfig.data.mainColor);
        instance.setDescription("The kill switch has been " +
            (params.enabled ? "enabled" : "disabled") +
            "!");
        instance.setAuthor(params.user.displayName, params.user.displayAvatarURL());
        if (params.enabled)
            instance.addFields({
                name: "What will this do?",
                value: "This will temporarily prevent anyone from creating tickets.",
            });
    }));
    embeds.add(new _opendiscord_1.api.ODEmbed("ot-kill-switch:active-embed"));
    embeds.get("ot-kill-switch:active-embed").workers.add(new _opendiscord_1.api.ODWorker("ot-kill-switch:active-embed", 0, (instance, params, source, cancel) => {
        const generalConfig = _opendiscord_1.opendiscord.configs.get("opendiscord:general");
        instance.setTitle(_opendiscord_1.utilities.emojiTitle("❌", "Temporary Ticket Cooldown!"));
        instance.setColor(generalConfig.data.system.useRedErrorEmbeds
            ? "Red"
            : generalConfig.data.mainColor);
        instance.setDescription("The server is currently in a temporary ticket cooldown! Due to this, no-one is able to create tickets at the moment.");
        instance.setFooter(_opendiscord_1.opendiscord.languages.getTranslation("errors.descriptions.askForInfo"));
    }));
});
//REGISTER MESSAGE BUILDER
_opendiscord_1.opendiscord.events.get("onMessageBuilderLoad").listen((messages) => {
    messages.add(new _opendiscord_1.api.ODMessage("ot-kill-switch:kill-message"));
    messages.get("ot-kill-switch:kill-message").workers.add(new _opendiscord_1.api.ODWorker("ot-kill-switch:kill-message", 0, async (instance, params, source, cancel) => {
        const { enabled, user } = params;
        instance.addEmbed(await _opendiscord_1.opendiscord.builders.embeds
            .getSafe("ot-kill-switch:kill-embed")
            .build(source, { enabled, user }));
    }));
    messages.add(new _opendiscord_1.api.ODMessage("ot-kill-switch:active-message"));
    messages.get("ot-kill-switch:active-message").workers.add(new _opendiscord_1.api.ODWorker("ot-kill-switch:active-message", 0, async (instance, params, source, cancel) => {
        instance.addEmbed(await _opendiscord_1.opendiscord.builders.embeds
            .getSafe("ot-kill-switch:active-embed")
            .build(source, {}));
        instance.setEphemeral(true);
    }));
});
//REGISTER COMMAND RESPONDER
_opendiscord_1.opendiscord.events.get("onCommandResponderLoad").listen((commands) => {
    const generalConfig = _opendiscord_1.opendiscord.configs.get("opendiscord:general");
    const manager = _opendiscord_1.opendiscord.plugins.classes.get("ot-kill-switch:manager");
    commands.add(new _opendiscord_1.api.ODCommandResponder("ot-kill-switch:kill", generalConfig.data.prefix, "kill"));
    commands.get("ot-kill-switch:kill").workers.add([
        new _opendiscord_1.api.ODWorker("opendiscord:permissions", 1, async (instance, params, source, cancel) => {
            if (!_opendiscord_1.opendiscord.permissions.hasPermissions("admin", await _opendiscord_1.opendiscord.permissions.getPermissions(instance.user, instance.channel, instance.guild, {
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
        new _opendiscord_1.api.ODWorker("ot-kill-switch:kill", 0, async (instance, params, source, cancel) => {
            const { guild, channel, user, options } = instance;
            if (!guild) {
                instance.reply(await _opendiscord_1.opendiscord.builders.messages
                    .getSafe("opendiscord:error-not-in-guild")
                    .build(source, { channel, user }));
                return cancel();
            }
            //switch & reply
            const newValue = options.getString("enabled", true) === "true";
            manager.enabled = newValue;
            await instance.reply(await _opendiscord_1.opendiscord.builders.messages
                .getSafe("ot-kill-switch:kill-message")
                .build(source, { enabled: newValue, user }));
        }),
        new _opendiscord_1.api.ODWorker("ot-kill-switch:logs", -1, (instance, params, source, cancel) => {
            _opendiscord_1.opendiscord.log(instance.user.displayName + " used the 'kill' command!", "plugin", [
                { key: "user", value: instance.user.username },
                { key: "userid", value: instance.user.id, hidden: true },
                { key: "channelid", value: instance.channel.id, hidden: true },
                { key: "method", value: source },
                {
                    key: "enabled",
                    value: _opendiscord_1.opendiscord.plugins.classes
                        .get("ot-kill-switch:manager")
                        .enabled.toString(),
                },
            ]);
        }),
    ]);
});
//DISABLE COMMAND RESPONDER (on ticket creation)
_opendiscord_1.opendiscord.events.get("afterCommandRespondersLoaded").listen((commands) => {
    commands.get("opendiscord:ticket").workers.add(new _opendiscord_1.api.ODWorker("ot-kill-switch:switch", 2, async (instance, params, source, cancel) => {
        if (_opendiscord_1.opendiscord.plugins.classes.get("ot-kill-switch:manager").enabled) {
            instance.reply(await _opendiscord_1.opendiscord.builders.messages
                .getSafe("ot-kill-switch:active-message")
                .build(source, {}));
            return cancel();
        }
    }));
});
//DISABLE BUTTON RESPONDER (on ticket creation)
_opendiscord_1.opendiscord.events.get("afterButtonRespondersLoaded").listen((buttons) => {
    buttons.get("opendiscord:ticket-option").workers.add(new _opendiscord_1.api.ODWorker("ot-kill-switch:switch", 2, async (instance, params, source, cancel) => {
        if (_opendiscord_1.opendiscord.plugins.classes.get("ot-kill-switch:manager").enabled) {
            instance.reply(await _opendiscord_1.opendiscord.builders.messages
                .getSafe("ot-kill-switch:active-message")
                .build(source, {}));
            return cancel();
        }
    }));
});
//DISABLE DROPDOWN RESPONDER (on ticket creation)
_opendiscord_1.opendiscord.events.get("afterDropdownRespondersLoaded").listen((dropdowns) => {
    dropdowns.get("opendiscord:panel-dropdown-tickets").workers.add(new _opendiscord_1.api.ODWorker("ot-kill-switch:switch", 2, async (instance, params, source, cancel) => {
        if (_opendiscord_1.opendiscord.plugins.classes.get("ot-kill-switch:manager").enabled) {
            instance.reply(await _opendiscord_1.opendiscord.builders.messages
                .getSafe("ot-kill-switch:active-message")
                .build(source, {}));
            return cancel();
        }
    }));
});
