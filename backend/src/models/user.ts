import { databaseInstance } from "../config/db";
import sequelize from "sequelize";
import bcrypt from "bcrypt";
import { UserRoles } from "../types/user-roles";

const SALT_ROUNDS = 10;
const salt = bcrypt.genSaltSync(SALT_ROUNDS);

export interface IUser {
    id: number;
    email: string;
    password: string;
    role: UserRoles;
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
        role: {
            type: sequelize.ENUM(
                UserRoles.Buyer,
                UserRoles.Seller,
                UserRoles.Admin
            ),
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
