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
exports.ODAltDetector = void 0;
const _opendiscord_1 = require("#opendiscord");
const discord = __importStar(require("discord.js"));
const discord_alt_detector_1 = require("discord-alt-detector");
///////// ADVANCED ///////////
const showRawOutput = false; //show the raw alt detector output in the embed.
//////////////////////////////
//DECLARATION
class ODAltDetector extends _opendiscord_1.api.ODManagerData {
    detector;
    constructor(id, detector) {
        super(id);
        this.detector = detector;
    }
}
exports.ODAltDetector = ODAltDetector;
//ACCESS PRESENCE INTENTS
_opendiscord_1.opendiscord.events.get("onClientLoad").listen((client) => {
    client.privileges.push("Presence");
    client.intents.push("GuildPresences");
});
//REGISTER PLUGIN CLASS
_opendiscord_1.opendiscord.events.get("onPluginClassLoad").listen((classes) => {
    classes.add(new ODAltDetector("od-alt-detector:detector", new discord_alt_detector_1.AltDetector()));
});
//REGISTER EMBED BUILDER
_opendiscord_1.opendiscord.events.get("onEmbedBuilderLoad").listen((embeds) => {
    embeds.add(new _opendiscord_1.api.ODEmbed("od-alt-detector:log-embed"));
    embeds.get("od-alt-detector:log-embed").workers.add(new _opendiscord_1.api.ODWorker("od-alt-detector:log-embed", 0, (instance, params, source, cancel) => {
        const { result, member } = params;
        const generalConfig = _opendiscord_1.opendiscord.configs.get("opendiscord:general");
        const { detector } = _opendiscord_1.opendiscord.plugins.classes.get("od-alt-detector:detector");
        const category = detector.getCategory(result);
        const details = JSON.stringify(result.categories);
        instance.setTitle(_opendiscord_1.utilities.emojiTitle("📌", "Alt Detector Logs"));
        instance.setColor(generalConfig.data.mainColor);
        instance.setDescription(discord.userMention(member.id) + " joined the server!");
        instance.setThumbnail(member.displayAvatarURL());
        instance.setAuthor(member.displayName, member.displayAvatarURL());
        instance.setFooter(member.user.username + " - " + member.id);
        instance.setTimestamp(new Date());
        instance.addFields({
            name: "Account Age",
            value: discord.time(member.user.createdAt, "f"),
            inline: true,
        }, {
            name: "Trust Level",
            value: "```" + category + "```",
            inline: true,
        });
        if (showRawOutput)
            instance.addFields({
                name: "Trust Details",
                value: "```" + details + "```",
                inline: false,
            });
    }));
});
//REGISTER MESSAGE BUILDER
_opendiscord_1.opendiscord.events.get("onMessageBuilderLoad").listen((messages) => {
    messages.add(new _opendiscord_1.api.ODMessage("od-alt-detector:log-message"));
    messages.get("od-alt-detector:log-message").workers.add(new _opendiscord_1.api.ODWorker("od-alt-detector:log-message", 0, async (instance, params, source, cancel) => {
        const { result, member } = params;
        instance.addEmbed(await _opendiscord_1.opendiscord.builders.embeds
            .getSafe("od-alt-detector:log-embed")
            .build(source, { result, member }));
    }));
});
//LISTEN FOR MEMBER JOIN
_opendiscord_1.opendiscord.events.get("onClientReady").listen((clientManager) => {
    const { client } = clientManager;
    const generalConfig = _opendiscord_1.opendiscord.configs.get("opendiscord:general");
    const { detector } = _opendiscord_1.opendiscord.plugins.classes.get("od-alt-detector:detector");
    //send result to log channel when logging is enabled
    client.on("guildMemberAdd", async (member) => {
        if (generalConfig.data.system.logs.enabled) {
            const logChannel = _opendiscord_1.opendiscord.posts.get("opendiscord:logs");
            if (!logChannel)
                return;
            const result = detector.check(member);
            await logChannel.send(await _opendiscord_1.opendiscord.builders.messages
                .getSafe("od-alt-detector:log-message")
                .build("other", { result, member }));
        }
    });
});
