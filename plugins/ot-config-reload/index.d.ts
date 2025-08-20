import { api } from "#opendiscord";
declare module "#opendiscord-types" {
    interface ODPluginManagerIds_Default {
        "ot-config-reload": api.ODPlugin;
    }
    interface ODConfigManagerIds_Default {
        "ot-config-reload:general": api.ODJsonConfig_DefaultGeneral;
        "ot-config-reload:options": api.ODJsonConfig_DefaultOptions;
        "ot-config-reload:panels": api.ODJsonConfig_DefaultPanels;
        "ot-config-reload:questions": api.ODJsonConfig_DefaultQuestions;
        "ot-config-reload:transcripts": api.ODJsonConfig_DefaultTranscripts;
    }
    interface ODSlashCommandManagerIds_Default {
        "ot-config-reload:reload": api.ODSlashCommand;
    }
    interface ODTextCommandManagerIds_Default {
        "ot-config-reload:reload": api.ODTextCommand;
    }
    interface ODCommandResponderManagerIds_Default {
        "ot-config-reload:reload": {
            source: "slash" | "text";
            params: {};
            workers: "ot-config-reload:reload";
        };
    }
    interface ODMessageManagerIds_Default {
        "ot-config-reload:config-reload-result": {
            source: "slash" | "text" | "other";
            params: {
                checkerResult: api.ODCheckerResult;
            };
            workers: "ot-config-reload:config-reload-result";
        };
    }
    interface ODEmbedManagerIds_Default {
        "ot-config-reload:config-reload-result": {
            source: "slash" | "text" | "other";
            params: {
                messages: api.ODCheckerMessage[];
                nEmbed?: number;
            };
            workers: "ot-config-reload:config-reload-result";
        };
        "ot-config-reload:config-reload-failure": {
            source: "slash" | "text" | "other";
            params: {};
            workers: "ot-config-reload:config-reload-failure";
        };
        "ot-config-reload:config-reload-success": {
            source: "slash" | "text" | "other";
            params: {};
            workers: "ot-config-reload:config-reload-success";
        };
    }
}
