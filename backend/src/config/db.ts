import sequelize, { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

export default class Database {
    db: string;
    user: string;
    password: string;
    host: string;
    port: number;
    database: Sequelize;

    constructor() {
        this.db = process.env.DB_NAME || "";
        this.user = process.env.DB_USER || "";
        this.password = process.env.DB_PASS || "";
        this.host = process.env.DB_HOST || "localhost";
        this.port = Number(process.env.DB_PORT) || 3306;

        if (process.env.NODE_ENV === "test") {
            this.database = new sequelize("sqlite:memory:");
        } else {
            this.database = new sequelize(this.db, this.user, this.password, {
                host: this.host,
                dialect: "mysql",
                port: this.port,
                logging: false,
                operatorsAliases: false,
            });
        }

        this.database
            .authenticate()
            .then(() => {
                console.log("Connected to database successfully!");
            })
            .catch((err) => {
                console.error("Unable to connect to database ", err);
            });

        this.database.sync({
            force: process.env.NODE_ENV === "test",
        });
    }
}

export const databaseInstance = new Database().database;
