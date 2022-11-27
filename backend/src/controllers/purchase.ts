import { Request, Response, NextFunction } from "express";
import { User, IUser } from "../models/user";
import { Product, IProduct } from "../models/product";
import { databaseInstance } from "../config/db";

export const deposit = (req: Request, res: Response, next: NextFunction) => {
    console.log("controller.purchase.deposit");
    if (!req.user) return next("User is not set in request");
    const newBalance = req.user.balance + req.body.coin;
    User.update(
        {
            balance: newBalance,
        },
        {
            where: {
                id: req.user.id,
            },
            fields: ["balance"],
        }
    )
        .then(() => {
            res.status(200).json({
                balance: newBalance,
            });
        })
        .catch((err: any) => next(err));
};

export const resetBalance = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.log("controller.purchase.resetBalance");
    if (!req.user) return next("User is not set in request");
    User.update(
        {
            balance: 0,
        },
        {
            where: {
                id: req.user.id,
            },
            fields: ["balance"],
        }
    )
        .then(() => {
            res.status(200).json({
                balance: 0,
            });
        })
        .catch((err: any) => next(err));
};

export const buy = (req: Request, res: Response, next: NextFunction) => {
    console.log("controller.purchase.buy");
    if (!req.user) return next("User is not set in request");
    if (!req.product) return next("Product is not set in request");
    const newBalance = req.user.balance - req.body.amount * req.product.price;
    const newAmount = req.product.amount - req.body.amount;
    try {
        databaseInstance.transaction((t: any) => {
            return User.update(
                {
                    balance: newBalance,
                },
                {
                    where: {
                        id: req.user?.id || 0, // type guard fails
                    },
                    fields: ["balance"],
                    transaction: t,
                }
            )
                .then(() => {
                    return Product.update(
                        {
                            amount: newAmount,
                        },
                        {
                            where: {
                                id: req.product?.id || 0, // type guard fails
                            },
                            fields: ["amount"],
                            transaction: t,
                        }
                    )
                        .then(() => {
                            res.status(200).send({ balance: newBalance });
                        })
                        .catch((err: any) => {
                            return next(err);
                        });
                })
                .catch((err: any) => {
                    return next(err);
                });
        });
    } catch (err: any) {
        return next(err);
    }
};

export default {
    deposit,
    resetBalance,
    buy,
};
