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
const lang = _opendiscord_1.opendiscord.languages;
const acot = discord.ApplicationCommandOptionType;
//CHECK IF USING DEVCONFIG
function getConfigPath() {
    const devconfigFlag = _opendiscord_1.opendiscord.flags.get("opendiscord:dev-config");
    const isDevconfig = devconfigFlag ? devconfigFlag.value : false;
    return isDevconfig ? "./devconfig/" : "./config/";
}
//REGISTER COMMANDS
_opendiscord_1.opendiscord.events.get("onSlashCommandLoad").listen((slash) => {
    slash.add(new _opendiscord_1.api.ODSlashCommand("ot-config-reload:reload", {
        name: "reload",
        description: "Reload Open Ticket config files without restarting the bot.",
        type: discord.ApplicationCommandType.ChatInput,
        contexts: [discord.InteractionContextType.Guild],
        integrationTypes: [discord.ApplicationIntegrationType.GuildInstall],
        options: [
            {
                name: "config",
                description: "Select the optional config to reload.",
                type: acot.String,
                required: false,
                choices: [
                    { name: "general", value: "general" },
                    { name: "options", value: "options" },
                    { name: "panels", value: "panels" },
                    { name: "questions", value: "questions" },
                    { name: "transcripts", value: "transcripts" },
                ],
            },
        ],
    }));
});
_opendiscord_1.opendiscord.events.get("onTextCommandLoad").listen((text) => {
    const generalConfig = _opendiscord_1.opendiscord.configs.get("opendiscord:general");
    text.add(new _opendiscord_1.api.ODTextCommand("ot-config-reload:reload", {
        name: "reload",
        prefix: generalConfig.data.prefix,
        dmPermission: false,
        guildPermission: true,
        allowBots: false,
        options: [
            {
                name: "config",
                type: "string",
                required: false,
                allowSpaces: false,
                choices: ["general", "options", "panels", "questions", "transcripts"],
            },
        ],
    }));
});
//MESSAGE BUILDER
_opendiscord_1.opendiscord.events.get("onMessageBuilderLoad").listen((messages) => {
    messages.add(new _opendiscord_1.api.ODMessage("ot-config-reload:config-reload-result"));
    messages.get("ot-config-reload:config-reload-result").workers.add(new _opendiscord_1.api.ODWorker("ot-config-reload:config-reload-result", 0, async (instance, params, source) => {
        const { checkerResult } = params;
        const embeds = [];
        if (checkerResult.valid) {
            try {
                const embed = await _opendiscord_1.opendiscord.builders.embeds
                    .getSafe("ot-config-reload:config-reload-success")
                    .build(source, {});
                embeds.push(embed);
            }
            catch (err) {
                _opendiscord_1.opendiscord.log(`Error building embed for valid configuration: ${err}`, "error");
            }
        }
        else {
            try {
                const embed = await _opendiscord_1.opendiscord.builders.embeds
                    .getSafe("ot-config-reload:config-reload-failure")
                    .build(source, {});
                embeds.push(embed);
            }
            catch (err) {
                _opendiscord_1.opendiscord.log(`Error building embed for invalid configuration: ${err}`, "error");
            }
        }
        if (checkerResult.messages.length > 0) {
            const messages = checkerResult.messages.filter((message) => message.type !== "info");
            if (messages.length > 25) {
                const embed = await _opendiscord_1.opendiscord.builders.embeds
                    .getSafe("ot-config-reload:config-reload-result")
                    .build(source, { messages: messages.slice(0, 25), nEmbed: 1 });
                embeds.push(embed);
                for (let i = 25; i < messages.length; i += 25) {
                    const embed = await _opendiscord_1.opendiscord.builders.embeds
                        .getSafe("ot-config-reload:config-reload-result")
                        .build(source, {
                        messages: messages.slice(i, i + 25),
                        nEmbed: i / 25 + 1,
                    });
                    embeds.push(embed);
                }
            }
            else if (messages.length > 0) {
                const embed = await _opendiscord_1.opendiscord.builders.embeds
                    .getSafe("ot-config-reload:config-reload-result")
                    .build(source, { messages: messages });
                embeds.push(embed);
            }
        }
        try {
            embeds.forEach((embed) => {
                instance.addEmbed(embed);
            });
            instance.setEphemeral(true);
        }
        catch (err) {
            _opendiscord_1.opendiscord.log(`Error setting embeds: ${err}`, "error");
        }
    }));
});
//EMBED BUILDERS
_opendiscord_1.opendiscord.events.get("onEmbedBuilderLoad").listen((embeds) => {
    embeds.add(new _opendiscord_1.api.ODEmbed("ot-config-reload:config-reload-result"));
    embeds.get("ot-config-reload:config-reload-result").workers.add(new _opendiscord_1.api.ODWorker("ot-config-reload:config-reload-result", 0, async (instance, params, source) => {
        const { messages, nEmbed } = params;
        instance.setTitle(nEmbed ? `Config Reload Result (${nEmbed})` : "Config Reload Result");
        const hasErrors = messages.some((message) => message.type === "error");
        instance.setColor(hasErrors
            ? "Red"
            : _opendiscord_1.opendiscord.configs.get("opendiscord:general").data.mainColor);
        messages.forEach((message, index) => {
            const fieldMessage = `${message.message}\n=> ${message.filepath}: ${message.path}`;
            instance.addFields({
                name: `[${message.type.toUpperCase()}]`,
                value: fieldMessage,
            });
        });
    }));
    embeds.add(new _opendiscord_1.api.ODEmbed("ot-config-reload:config-reload-failure"));
    embeds.get("ot-config-reload:config-reload-failure").workers.add(new _opendiscord_1.api.ODWorker("ot-config-reload:config-reload-failure", 0, async (instance, params, source) => {
        instance.setTitle(`Config Reload Failed`);
        instance.setDescription("Please correct the following errors and try again.");
        instance.setColor("Red");
    }));
    embeds.add(new _opendiscord_1.api.ODEmbed("ot-config-reload:config-reload-success"));
    embeds.get("ot-config-reload:config-reload-success").workers.add(new _opendiscord_1.api.ODWorker("ot-config-reload:config-reload-success", 0, async (instance, params, source) => {
        instance.setTitle(`Config Reloaded Successfully`);
        instance.setDescription("The configuration has been reloaded successfully!");
        instance.setColor("Green");
    }));
});
// PANEL COMMAND
/* Update the panel command options to match the new panels */
async function reloadPanelCommand() {
    const panelChoices = [];
    try {
        _opendiscord_1.opendiscord.configs.get("opendiscord:panels").data.forEach((panel) => {
            panelChoices.push({ name: panel.name, value: panel.id });
        });
    }
    catch (err) {
        _opendiscord_1.opendiscord.log(`Error fetching panel config: ${err}`, "error");
        return;
    }
    const newOptions = [
        {
            name: "id",
            description: lang.getTranslation("commands.panelId"),
            type: acot.String,
            required: true,
            choices: panelChoices,
        },
        {
            name: "auto-update",
            description: lang.getTranslation("commands.panelAutoUpdate"),
            type: acot.Boolean,
            required: false,
        },
    ];
    try {
        const commands = _opendiscord_1.opendiscord.client.client.application.commands.cache;
        commands.forEach((cmd) => {
            if (cmd.name === "panel") {
                cmd.setOptions(newOptions);
            }
        });
    }
    catch (error) {
        _opendiscord_1.opendiscord.log(`Error updating panel command: ${error}`, "error");
    }
}
// MOVE COMMAND
/* Update the move command options to match the new options */
async function reloadMoveCommand() {
    const ticketChoices = [];
    try {
        _opendiscord_1.opendiscord.configs.get("opendiscord:options").data.forEach((option) => {
            if (option.type !== "ticket")
                return;
            ticketChoices.push({ name: option.name, value: option.id });
        });
    }
    catch (err) {
        _opendiscord_1.opendiscord.log(`Error fetching options config: ${err}`, "error");
        return;
    }
    const newOptions = [
        {
            name: "id",
            description: lang.getTranslation("commands.moveId"),
            type: acot.String,
            required: true,
            choices: ticketChoices,
        },
        {
            name: "reason",
            description: lang.getTranslation("commands.reason"),
            type: acot.String,
            required: false,
        },
    ];
    try {
        const commands = _opendiscord_1.opendiscord.client.client.application.commands.cache;
        commands.forEach((cmd) => {
            if (cmd.name === "move") {
                cmd.setOptions(newOptions);
            }
        });
    }
    catch (error) {
        _opendiscord_1.opendiscord.log(`Error updating move command: ${error}`, "error");
    }
}
//COMMAND RESPONDERS
_opendiscord_1.opendiscord.events.get("onCommandResponderLoad").listen((commands) => {
    const generalConfig = _opendiscord_1.opendiscord.configs.get("opendiscord:general");
    commands.add(new _opendiscord_1.api.ODCommandResponder("ot-config-reload:reload", generalConfig.data.prefix, "reload"));
    commands.get("ot-config-reload:reload").workers.add(new _opendiscord_1.api.ODWorker("ot-config-reload:reload", 0, async (instance, params, source, cancel) => {
        const { guild, channel, user } = instance;
        //check if in guild
        if (!guild) {
            instance.reply(await _opendiscord_1.opendiscord.builders.messages
                .getSafe("opendiscord:error-not-in-guild")
                .build(source, { channel, user }));
            return cancel();
        }
        //check for permissions
        if (!_opendiscord_1.opendiscord.permissions.hasPermissions("developer", await _opendiscord_1.opendiscord.permissions.getPermissions(user, channel, guild))) {
            instance.reply(await _opendiscord_1.opendiscord.builders.messages
                .getSafe("opendiscord:error-no-permissions")
                .build(source, {
                guild: instance.guild,
                channel: instance.channel,
                user: instance.user,
                permissions: ["developer"],
            }));
            return cancel();
        }
        try {
            const config = instance.options.getString("config", false);
            _opendiscord_1.opendiscord.log(`Reloading configuration: ${config || "all"}`, "plugin");
            let checkerResult;
            switch (config) {
                case "general": {
                    const tempGeneral = new _opendiscord_1.api.ODJsonConfig("ot-config-reload:general", "general.json", getConfigPath());
                    await tempGeneral.init();
                    const generalChecker = _opendiscord_1.opendiscord.checkers.get("opendiscord:general");
                    generalChecker.config = tempGeneral;
                    checkerResult = _opendiscord_1.opendiscord.checkers.checkAll(true);
                    if (checkerResult.valid) {
                        _opendiscord_1.opendiscord.configs.get("opendiscord:general").reload();
                        _opendiscord_1.opendiscord.log("General configuration reloaded successfully.", "plugin");
                    }
                    // Reset the config properties checkers to their original state
                    generalChecker.config = _opendiscord_1.opendiscord.configs.get("opendiscord:general");
                    break;
                }
                case "options": {
                    const tempOptions = new _opendiscord_1.api.ODJsonConfig("ot-config-reload:options", "options.json", getConfigPath());
                    await tempOptions.init();
                    const optionsChecker = _opendiscord_1.opendiscord.checkers.get("opendiscord:options");
                    optionsChecker.config = tempOptions;
                    checkerResult = _opendiscord_1.opendiscord.checkers.checkAll(true);
                    if (checkerResult.valid) {
                        _opendiscord_1.opendiscord.configs.get("opendiscord:options").reload();
                        await reloadMoveCommand();
                        _opendiscord_1.opendiscord.log("Options configuration reloaded successfully.", "plugin");
                    }
                    // Reset the config properties checkers to their original state
                    optionsChecker.config = _opendiscord_1.opendiscord.configs.get("opendiscord:options");
                    break;
                }
                case "panels": {
                    const tempPanels = new _opendiscord_1.api.ODJsonConfig("ot-config-reload:panels", "panels.json", getConfigPath());
                    await tempPanels.init();
                    const panelsChecker = _opendiscord_1.opendiscord.checkers.get("opendiscord:panels");
                    panelsChecker.config = tempPanels;
                    checkerResult = _opendiscord_1.opendiscord.checkers.checkAll(true);
                    if (checkerResult.valid) {
                        _opendiscord_1.opendiscord.configs.get("opendiscord:panels").reload();
                        await reloadPanelCommand();
                        _opendiscord_1.opendiscord.log("Panels configuration reloaded successfully.", "plugin");
                    }
                    // Reset the config properties checkers to their original state
                    panelsChecker.config =
                        _opendiscord_1.opendiscord.configs.get("opendiscord:panels");
                    break;
                }
                case "questions": {
                    const tempQuestions = new _opendiscord_1.api.ODJsonConfig("ot-config-reload:questions", "questions.json", getConfigPath());
                    await tempQuestions.init();
                    const questionsChecker = _opendiscord_1.opendiscord.checkers.get("opendiscord:questions");
                    questionsChecker.config = tempQuestions;
                    checkerResult = _opendiscord_1.opendiscord.checkers.checkAll(true);
                    if (checkerResult.valid) {
                        _opendiscord_1.opendiscord.configs.get("opendiscord:questions").reload();
                        _opendiscord_1.opendiscord.log("Questions configuration reloaded successfully.", "plugin");
                    }
                    // Reset the config properties checkers to their original state
                    questionsChecker.config = _opendiscord_1.opendiscord.configs.get("opendiscord:questions");
                    break;
                }
                case "transcripts": {
                    const tempTranscripts = new _opendiscord_1.api.ODJsonConfig("ot-config-reload:transcripts", "transcripts.json", getConfigPath());
                    await tempTranscripts.init();
                    const transcriptsChecker = _opendiscord_1.opendiscord.checkers.get("opendiscord:transcripts");
                    transcriptsChecker.config = tempTranscripts;
                    checkerResult = _opendiscord_1.opendiscord.checkers.checkAll(true);
                    if (checkerResult.valid) {
                        _opendiscord_1.opendiscord.configs.get("opendiscord:transcripts").reload();
                        _opendiscord_1.opendiscord.log("Transcripts configuration reloaded successfully.", "plugin");
                    }
                    // Reset the config properties checkers to their original state
                    transcriptsChecker.config = _opendiscord_1.opendiscord.configs.get("opendiscord:transcripts");
                    break;
                }
                default: {
                    const tempGeneral = new _opendiscord_1.api.ODJsonConfig("ot-config-reload:general", "general.json", getConfigPath());
                    const tempOptions = new _opendiscord_1.api.ODJsonConfig("ot-config-reload:options", "options.json", getConfigPath());
                    const tempPanels = new _opendiscord_1.api.ODJsonConfig("ot-config-reload:panels", "panels.json", getConfigPath());
                    const tempQuestions = new _opendiscord_1.api.ODJsonConfig("ot-config-reload:questions", "questions.json", getConfigPath());
                    const tempTranscripts = new _opendiscord_1.api.ODJsonConfig("ot-config-reload:transcripts", "transcripts.json", getConfigPath());
                    await tempGeneral.init();
                    await tempOptions.init();
                    await tempPanels.init();
                    await tempQuestions.init();
                    await tempTranscripts.init();
                    const generalChecker = _opendiscord_1.opendiscord.checkers.get("opendiscord:general");
                    generalChecker.config = tempGeneral;
                    const optionsChecker = _opendiscord_1.opendiscord.checkers.get("opendiscord:options");
                    optionsChecker.config = tempOptions;
                    const panelsChecker = _opendiscord_1.opendiscord.checkers.get("opendiscord:panels");
                    panelsChecker.config = tempPanels;
                    const questionsChecker = _opendiscord_1.opendiscord.checkers.get("opendiscord:questions");
                    questionsChecker.config = tempQuestions;
                    const transcriptsChecker = _opendiscord_1.opendiscord.checkers.get("opendiscord:transcripts");
                    transcriptsChecker.config = tempTranscripts;
                    checkerResult = _opendiscord_1.opendiscord.checkers.checkAll(true);
                    if (checkerResult.valid) {
                        _opendiscord_1.opendiscord.configs.get("opendiscord:general").reload();
                        _opendiscord_1.opendiscord.configs.get("opendiscord:options").reload();
                        _opendiscord_1.opendiscord.configs.get("opendiscord:panels").reload();
                        _opendiscord_1.opendiscord.configs.get("opendiscord:questions").reload();
                        _opendiscord_1.opendiscord.configs.get("opendiscord:transcripts").reload();
                        await reloadPanelCommand();
                        await reloadMoveCommand();
                        _opendiscord_1.opendiscord.log("All configurations reloaded successfully.", "plugin");
                    }
                    // Reset the config properties checkers to their original state
                    generalChecker.config = _opendiscord_1.opendiscord.configs.get("opendiscord:general");
                    optionsChecker.config = _opendiscord_1.opendiscord.configs.get("opendiscord:options");
                    panelsChecker.config =
                        _opendiscord_1.opendiscord.configs.get("opendiscord:panels");
                    questionsChecker.config = _opendiscord_1.opendiscord.configs.get("opendiscord:questions");
                    transcriptsChecker.config = _opendiscord_1.opendiscord.configs.get("opendiscord:transcripts");
                    break;
                }
            }
            const replyMessage = await _opendiscord_1.opendiscord.builders.messages
                .getSafe("ot-config-reload:config-reload-result")
                .build(source, { checkerResult });
            instance.reply(replyMessage);
        }
        catch (error) {
            _opendiscord_1.opendiscord.log(`Error executing reload command: ${error}`, "error");
            const errorReply = await _opendiscord_1.opendiscord.builders.messages
                .getSafe("opendiscord:error")
                .build(source, {
                guild,
                channel,
                user,
                error: error.message,
                layout: "advanced",
            });
            instance.reply(errorReply);
            return cancel();
        }
    }));
    commands.get("ot-config-reload:reload").workers.add(new _opendiscord_1.api.ODWorker("ot-config-reload:logs", -1, (instance, params, source, cancel) => {
        _opendiscord_1.opendiscord.log(instance.user.displayName + " used the 'reload' command!", "info", [
            { key: "user", value: instance.user.username },
            { key: "userid", value: instance.user.id, hidden: true },
            { key: "channelid", value: instance.channel.id, hidden: true },
            { key: "method", value: source },
        ]);
    }));
});
