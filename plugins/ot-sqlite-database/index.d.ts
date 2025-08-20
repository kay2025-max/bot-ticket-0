import { api } from "#opendiscord";
import * as sqlite from "sqlite3";
declare class OTSQLiteDatabaseConfig extends api.ODJsonConfig {
    data: {
        migrateFromJson: boolean;
        migrateToJson: boolean;
    };
}
declare module "#opendiscord-types" {
    interface ODPluginManagerIds_Default {
        "ot-sqlite-database": api.ODPlugin;
    }
    interface ODConfigManagerIds_Default {
        "ot-sqlite-database:config": OTSQLiteDatabaseConfig;
    }
    interface ODCheckerManagerIds_Default {
        "ot-sqlite-database:config": api.ODChecker;
    }
    interface ODPluginClassManagerIds_Default {
        "ot-sqlite-database:manager": ODSqliteManager;
    }
}
export declare class ODSqliteManager extends api.ODManagerData {
    #private;
    database: sqlite.Database;
    file: string;
    constructor(id: api.ODValidId, file: string);
    /**Add a new table to the database. */
    addTable(name: string): Promise<void>;
    /**Remove a table from the database. */
    removeTable(name: string): Promise<void>;
    /**Get a single value by category & key. */
    getValue(table: string, category: string, key: string): Promise<string | null>;
    /**Set a value by category, key & value. */
    setValue(table: string, category: string, key: string, value: string): Promise<boolean>;
    /**Delete a value by category & key. */
    deleteValue(table: string, category: string, key: string): Promise<void>;
    /**Check if a value exists by category & key. */
    existsValue(table: string, category: string, key: string): Promise<boolean>;
    /**Get all values from a category. */
    getCategory(table: string, category: string): Promise<{
        key: string;
        value: string;
    }[] | null>;
    /**Get all values from a table. */
    getAll(table: string): Promise<{
        category: string;
        key: string;
        value: string;
    }[] | null>;
}
export declare class ODSQLiteDatabase extends api.ODDatabase {
    sqlite: ODSqliteManager;
    table: string;
    constructor(id: api.ODValidId, name: string, sqlite: ODSqliteManager);
    /**Init the database. */
    init(): Promise<void>;
    /**Add/Overwrite a specific category & key in the database. Returns `true` when overwritten. */
    set(category: string, key: string, value: api.ODValidJsonType): Promise<boolean>;
    /**Get a specific category & key in the database */
    get(category: string, key: string): Promise<api.ODValidJsonType | undefined>;
    /**Delete a specific category & key in the database */
    delete(category: string, key: string): Promise<boolean>;
    /**Check if a specific category & key exists in the database */
    exists(category: string, key: string): Promise<boolean>;
    /**Get a specific category in the database */
    getCategory(category: string): Promise<{
        key: string;
        value: api.ODValidJsonType;
    }[] | undefined>;
    /**Get all values in the database */
    getAll(): Promise<api.ODJsonDatabaseStructure>;
}
export {};
