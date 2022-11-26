import Database from "../config/db";
import sequelize from "sequelize";
import bcrypt from "bcrypt";

let databaseInstance = new Database().database;
const SALT_ROUNDS = 10;
const salt = bcrypt.genSaltSync(SALT_ROUNDS);

export interface IUser {
    email: string;
    password: string;
}

const User: sequelize.Model<IUser, {}> = databaseInstance.define<IUser, {}>(
    "User",
    {
        id: {
            type: sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        email: {
            type: sequelize.STRING,
            allowNull: false,
            unique: true,
        },
        password: {
            type: sequelize.STRING,
            allowNull: false,
        },
    },
    {
        hooks: {
            beforeCreate: (user: IUser) => {
                const cryptedPassword = bcrypt.hashSync(user.password, salt);
                user.password = cryptedPassword;
            },
        },
    }
);

const validatePassword = (password: string, cryptedPassword: string) => {
    return bcrypt.compareSync(password, cryptedPassword);
};

export { User, validatePassword };
