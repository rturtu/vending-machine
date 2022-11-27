import { databaseInstance } from "../config/db";
import sequelize from "sequelize";
import { User, IUser } from "./user";

export interface IProduct {
    id: number;
    name: string;
    amount: number;
    price: number;
    UserId: number;
    User?: IUser;
}

const Product: sequelize.Model<IProduct, {}> = databaseInstance.define<
    IProduct,
    {}
>("Product", {
    id: {
        type: sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: sequelize.STRING,
        allowNull: false,
    },
    amount: {
        type: sequelize.INTEGER,
        allowNull: false,
    },
    price: {
        type: sequelize.INTEGER,
        allowNull: false,
    },
});

Product.belongsTo(User, { onDelete: "cascade" });
User.hasMany(Product);

export { Product };
