import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { DataSource } from 'typeorm';
import { SqlDatabase } from 'langchain/sql_db';
import { logger } from '../utils/logger';
import config from '../config';
import { CarVin, CarOption, CarPart, Model, Brand, DealerBrand, ManufacturePlant, Customer, CustomerOwnership, Dealer } from '../entities';

interface DatabaseConnection {
    name: string;
    dataSource: DataSource;
    sqlDb: SqlDatabase;
}

class DatabaseManager {
    private static instance: DatabaseManager;
    private connections: Map<string, DatabaseConnection> = new Map();
    private defaultConnection: DatabaseConnection | null = null;
    private defaultDBPath: string = path.join(__dirname, `../${config.DB_DIR}/${config.DB_NAME}`); // Adjust the path as needed

    private constructor() {}

    static getInstance(): DatabaseManager {
        if (!DatabaseManager.instance) {
            DatabaseManager.instance = new DatabaseManager();
        }
        return DatabaseManager.instance;
    }

    async initializeDefaultDatabase() {
        try {
            const dataSource = new DataSource({
                type: 'sqlite',
                database: this.defaultDBPath, // TODO: Adjust the path as needed
                synchronize: true,
                entities: [CarVin, CarOption, CarPart, Model, Brand, DealerBrand, ManufacturePlant, Customer, CustomerOwnership, Dealer]
            });
            await dataSource.initialize();
            await this.initDefaultDBScript(dataSource);

            const sqlDb = await SqlDatabase.fromDataSourceParams({ appDataSource: dataSource });
            this.defaultConnection = {
                name: 'CarsDB',
                dataSource,
                sqlDb
            };
            this.connections.set('default', this.defaultConnection);
            if (this.defaultConnection.dataSource.isInitialized) {
                logger.info(`Default database ${this.defaultConnection.name} at ||>${this.defaultConnection.dataSource.options.database}<|| has been initialized successfully`);
            }
            else logger.error('Failed to initialize default database');
        } catch (error) {
            logger.error('Error initializing default database:', error);
            throw error;
        }

    }
    async initDefaultDBScript(dataSource: DataSource) {
        //TODO: Refactor initDefaultDB
        //
        // Initialize the SQL database instance if the database is empty
        const sqlScript = path.join(__dirname, `../${config.DB_DIR}/init-cars.sql`);

        logger.info(`Checking if database at ${this.defaultDBPath} exists...`);
        if (fs.existsSync(this.defaultDBPath)) {
            logger.info(`Database file ${this.defaultDBPath} exists.`);
        }

        fs.readFile(sqlScript, 'utf8', (err, data) => {
            if (err) {
                logger.error('Error reading SQL file:', err);
            }
            dataSource.query(data)
            .then(() => {
                logger.info('SQL script executed successfully');
            })
            .catch(err => {
                if (err instanceof Error) {
                    logger.error('Error executing SQL query:', err.message);
                } else {
                    logger.error('Error executing SQL query:', err);
                }
            });
    });
    }

    async addCustomDatabase(databaseUrl: string, databaseName: string): Promise<DatabaseConnection> {
        try {
            // Create databases directory if it doesn't exist
            const databasesDir = path.join(process.cwd(), config.DB_DIR);
            if (!fs.existsSync(databasesDir)) {
                fs.mkdirSync(databasesDir, { recursive: true });
            }

            // Download the database file
            const response = await axios({
                method: 'GET',
                url: databaseUrl,
                responseType: 'arraybuffer'
            });
            console.log("response:>>>>", response)
            console.log("data:>>>>", response.data)
            // Save the database file to db directory
            const databasePath = path.join(databasesDir, `${databaseName}.db`);
            console.log("databasePath:>>>>", databasePath)
            fs.writeFileSync(databasePath, response.data);

            // Create a new data source for the custom database
            const dataSource = new DataSource({
                type: 'sqlite',
                database: databasePath,
                synchronize: config.NODE_ENV === 'development' ? true : false,
                logging: true
            });

            await dataSource.initialize();
            const sqlDb = await SqlDatabase.fromDataSourceParams({ appDataSource: dataSource });

            const connection: DatabaseConnection = {
                name: databaseName,
                dataSource,
                sqlDb
            };

            this.connections.set(databaseName, connection);
            logger.info(`Successfully added and initialized custom database: ${databaseName}`);

            return connection;
        } catch (error) {
            logger.error('Error adding custom database:', error);
            throw new Error(`Failed to add custom database: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    getConnection(databaseName: string = 'default'): DatabaseConnection {
        const connection = this.connections.get(databaseName);
        if (!connection) {
            throw new Error(`Database connection '${databaseName}' not found`);
        }
        return connection;
    }

    getDefaultConnection(): DatabaseConnection {
        if (!this.defaultConnection) {
            throw new Error('Default database connection not initialized');
        }
        return this.defaultConnection;
    }

    listConnections(): string[] {
        return Array.from(this.connections.keys());
    }
}

export const databaseManager = DatabaseManager.getInstance();