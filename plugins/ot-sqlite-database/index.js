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
exports.ODSQLiteDatabase = exports.ODSqliteManager = void 0;
const _opendiscord_1 = require("#opendiscord");
const sqlite = __importStar(require("sqlite3"));
const fs = __importStar(require("fs"));
if (_opendiscord_1.utilities.project != "openticket")
    throw new _opendiscord_1.api.ODPluginError("This plugin only works in Open Ticket!");
//DECLARATION
class OTSQLiteDatabaseConfig extends _opendiscord_1.api.ODJsonConfig {
}
//REGISTER CONFIG
_opendiscord_1.opendiscord.events.get("onConfigLoad").listen((configs) => {
    configs.add(new OTSQLiteDatabaseConfig("ot-sqlite-database:config", "config.json", "./plugins/ot-sqlite-database/"));
});
//REGISTER CONFIG CHECKER
_opendiscord_1.opendiscord.events.get("onCheckerLoad").listen((checkers) => {
    const config = _opendiscord_1.opendiscord.configs.get("ot-sqlite-database:config");
    const structure = new _opendiscord_1.api.ODCheckerObjectStructure("ot-sqlite-database:config", {
        children: [
            {
                key: "migrateFromJson",
                optional: false,
                priority: 0,
                checker: new _opendiscord_1.api.ODCheckerBooleanStructure("ot-feedback:migrate-from-json", {}),
            },
            {
                key: "migrateToJson",
                optional: false,
                priority: 0,
                checker: new _opendiscord_1.api.ODCheckerBooleanStructure("ot-feedback:migrate-to-json", {}),
            },
        ],
    });
    checkers.add(new _opendiscord_1.api.ODChecker("ot-sqlite-database:config", checkers.storage, 0, config, structure));
});
//SQLITE MANAGER
class ODSqliteManager extends _opendiscord_1.api.ODManagerData {
    database;
    file;
    #tables = [];
    constructor(id, file) {
        super(id);
        this.file = file;
        this.database = new sqlite.Database(file, (err) => {
            if (err)
                throw new _opendiscord_1.api.ODPluginError("Failed to init SQLite database! err:" + err);
        });
    }
    /**Add a new table to the database. */
    async addTable(name) {
        this.#tables.push(name);
        return new Promise((resolve, reject) => {
            this.database.serialize(() => {
                this.database
                    .prepare("CREATE TABLE IF NOT EXISTS " +
                    name +
                    " (category TEXT NOT NULL, key TEXT NOT NULL, value TEXT)")
                    .run((err) => {
                    if (err)
                        reject(err);
                    else
                        resolve();
                });
            });
        });
    }
    /**Remove a table from the database. */
    async removeTable(name) {
        const i = this.#tables.findIndex((v) => v == name);
        if (i > -1)
            this.#tables.splice(i, 1);
        return new Promise((resolve, reject) => {
            this.database.serialize(() => {
                this.database.prepare("DROP TABLE IF EXISTS " + name).run((err) => {
                    if (err)
                        reject(err);
                    else
                        resolve();
                });
            });
        });
    }
    /**Get a single value by category & key. */
    async getValue(table, category, key) {
        const i = this.#tables.findIndex((v) => v == table);
        if (i < 0)
            throw new _opendiscord_1.api.ODPluginError("ODSqliteManager.getValue() => Unknown Table!");
        return new Promise((resolve, reject) => {
            this.database
                .prepare("SELECT value FROM " + table + " WHERE category=? AND key=?", category, key)
                .get((err, row) => {
                if (err)
                    reject(err);
                else
                    resolve(row?.value ?? null);
            });
        });
    }
    /**Set a value by category, key & value. */
    async setValue(table, category, key, value) {
        const i = this.#tables.findIndex((v) => v == table);
        if (i < 0)
            throw new _opendiscord_1.api.ODPluginError("ODSqliteManager.setValue() => Unknown Table!");
        const currentValue = await this.getValue(table, category, key);
        if (currentValue === null) {
            //doesn't exist yet
            return new Promise((resolve, reject) => {
                this.database.serialize(() => {
                    this.database
                        .prepare("INSERT INTO " + table + " VALUES (?,?,?)", category, key, value)
                        .run((err) => {
                        if (err)
                            reject(err);
                        else
                            resolve(false);
                    });
                });
            });
        }
        else {
            //already exists
            return new Promise((resolve, reject) => {
                this.database
                    .prepare("UPDATE " + table + " SET value = ? WHERE category=? AND key=?", value, category, key)
                    .run((err) => {
                    if (err)
                        reject(err);
                    else
                        resolve(true);
                });
            });
        }
    }
    /**Delete a value by category & key. */
    async deleteValue(table, category, key) {
        const i = this.#tables.findIndex((v) => v == table);
        if (i < 0)
            throw new _opendiscord_1.api.ODPluginError("ODSqliteManager.deleteValue() => Unknown Table!");
        return new Promise((resolve, reject) => {
            this.database.serialize(() => {
                this.database
                    .prepare("DELETE FROM " + table + " WHERE category=? AND key=?", category, key)
                    .run((err) => {
                    if (err)
                        reject(err);
                    else
                        resolve();
                });
            });
        });
    }
    /**Check if a value exists by category & key. */
    async existsValue(table, category, key) {
        const value = await this.getValue(table, category, key);
        return value !== null;
    }
    /**Get all values from a category. */
    async getCategory(table, category) {
        const i = this.#tables.findIndex((v) => v == table);
        if (i < 0)
            throw new _opendiscord_1.api.ODPluginError("ODSqliteManager.getCategory() => Unknown Table!");
        return new Promise((resolve, reject) => {
            this.database
                .prepare("SELECT key,value FROM " + table + " WHERE category=?", category)
                .all((err, row) => {
                if (err)
                    reject(err);
                else
                    resolve(row ?? null);
            });
        });
    }
    /**Get all values from a table. */
    async getAll(table) {
        const i = this.#tables.findIndex((v) => v == table);
        if (i < 0)
            throw new _opendiscord_1.api.ODPluginError("ODSqliteManager.getAll() => Unknown Table!");
        return new Promise((resolve, reject) => {
            this.database
                .prepare("SELECT category,key,value FROM " + table)
                .all((err, row) => {
                if (err)
                    reject(err);
                else
                    resolve(row ?? null);
            });
        });
    }
}
exports.ODSqliteManager = ODSqliteManager;
//SQLITE DATABASE
class ODSQLiteDatabase extends _opendiscord_1.api.ODDatabase {
    sqlite;
    table;
    constructor(id, name, sqlite) {
        super(id);
        this.sqlite = sqlite;
        this.path = sqlite.file;
        this.file = sqlite.file.split("/").at(-1) ?? "";
        this.table = name;
    }
    /**Init the database. */
    async init() {
        await this.sqlite.addTable(this.table);
        //TEMPORARY!!! (also check database loader at row ~240)
        if (_opendiscord_1.api.TEMP_migrateDatabaseStructurePrefix) {
            const data = await this.getAll();
            const newData = _opendiscord_1.api.TEMP_migrateDatabaseStructurePrefix(data);
            for (const d of data) {
                await this.delete(d.category, d.key);
            }
            for (const d of newData) {
                await this.set(d.category, d.key, d.value);
            }
        }
    }
    /**Add/Overwrite a specific category & key in the database. Returns `true` when overwritten. */
    async set(category, key, value) {
        return await this.sqlite.setValue(this.table, category, key, JSON.stringify(value));
    }
    /**Get a specific category & key in the database */
    async get(category, key) {
        const rawResult = await this.sqlite.getValue(this.table, category, key);
        if (rawResult === null)
            return undefined;
        else
            return JSON.parse(rawResult);
    }
    /**Delete a specific category & key in the database */
    async delete(category, key) {
        await this.sqlite.deleteValue(this.table, category, key);
        return true;
    }
    /**Check if a specific category & key exists in the database */
    async exists(category, key) {
        return await this.sqlite.existsValue(this.table, category, key);
    }
    /**Get a specific category in the database */
    async getCategory(category) {
        const rawResult = await this.sqlite.getCategory(this.table, category);
        if (rawResult === null)
            return undefined;
        else
            return rawResult.map((r) => {
                return { key: r.key, value: JSON.parse(r.value) };
            });
    }
    /**Get all values in the database */
    async getAll() {
        const rawResult = await this.sqlite.getAll(this.table);
        if (rawResult === null)
            return [];
        else
            return rawResult.map((r) => {
                return { category: r.category, key: r.key, value: JSON.parse(r.value) };
            });
    }
}
exports.ODSQLiteDatabase = ODSQLiteDatabase;
//CREATE SQLITE DATABASE MANAGER
_opendiscord_1.opendiscord.events.get("onDatabaseLoad").listen(() => {
    const devDatabaseFlag = _opendiscord_1.opendiscord.flags.get("opendiscord:dev-database");
    const isDevDatabase = devDatabaseFlag ? devDatabaseFlag.value : false;
    //TEMPORARY!!!
    if (fs.existsSync(isDevDatabase
        ? "./devdatabase/openticket.sqlite"
        : "./database/openticket.sqlite")) {
        fs.copyFileSync(isDevDatabase
            ? "./devdatabase/openticket.sqlite"
            : "./database/openticket.sqlite", isDevDatabase
            ? "./devdatabase/opendiscord.sqlite"
            : "./database/opendiscord.sqlite");
        fs.rmSync(isDevDatabase
            ? "./devdatabase/openticket.sqlite"
            : "./database/openticket.sqlite");
    }
    _opendiscord_1.opendiscord.plugins.classes.add(new ODSqliteManager("ot-sqlite-database:manager", isDevDatabase
        ? "./devdatabase/opendiscord.sqlite"
        : "./database/opendiscord.sqlite"));
});
//REPLACE ALL DATABASES WITH SQLITE VARIANT
const oldDatabases = [];
_opendiscord_1.opendiscord.events.get("afterDatabasesLoaded").listen(async (databases) => {
    const sqlite = _opendiscord_1.opendiscord.plugins.classes.get("ot-sqlite-database:manager");
    oldDatabases.push(...databases.getAll());
    oldDatabases.forEach((db) => {
        const name = db.file.replace(".json", "");
        databases.add(new ODSQLiteDatabase(db.id, name, sqlite), true);
    });
});
//MIGRATE FROM & TO JSON DATABASE
_opendiscord_1.opendiscord.events.get("afterDatabasesInitiated").listen(async (databases) => {
    const config = _opendiscord_1.opendiscord.configs.get("ot-sqlite-database:config");
    if (config.data.migrateFromJson) {
        //migrate to sqlite database
        await databases.loopAll(async (database, id) => {
            //get old data
            const oldDb = oldDatabases.find((db) => db.id.value === id.value);
            if (!oldDb)
                return;
            await oldDb.init();
            const oldData = await oldDb.getAll();
            for (const d of oldData) {
                if (!(await database.exists(d.category, d.key)))
                    await database.set(d.category, d.key, d.value);
                await oldDb.delete(d.category, d.key);
            }
        });
    }
    else if (config.data.migrateToJson) {
        //migrate to json database
        await databases.loopAll(async (database, id) => {
            //get old data
            const oldDb = oldDatabases.find((db) => db.id.value === id.value);
            if (!oldDb)
                return;
            await oldDb.init();
            const newData = await database.getAll();
            for (const d of newData) {
                if (!(await oldDb.exists(d.category, d.key)))
                    await oldDb.set(d.category, d.key, d.value);
                await database.delete(d.category, d.key);
            }
        });
    }
});
