import { Request, Response, NextFunction } from "express";
import { Product, IProduct } from "../models/product";
import { normalizeSearchParam } from "../utils/validation";
import { MAX_INTEGER } from "../utils/max-values";
import { Coin } from "../types/enums";

export const validateCoin = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.log("middlewares.purchase.validateCoin");
    console.log(req.body);
    if (!req.body.coin) return next("Please provide a coin value");
    if (
        ![Coin.five, Coin.ten, Coin.twenty, Coin.fifty, Coin.hundred].includes(
            req.body.coin
        )
    )
        return next("Please provide a valid coin value");
    return next();
};

export const validateMaxBalance = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (!req.user) return next("User is not set in request");
    if (req.user.balance + req.body.coin > MAX_INTEGER)
        return next("New balance exceeds maximum balance");
    return next();
};

export const validatePurchase = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (!req.user) return next("User is not set in request");
    if (!req.product) return next("Product is not set in request");
    if (!req.body.amount) return next("Please provide an amount");
    if (typeof req.body.amount !== "number")
        return next("Please provide a number amount");
    if (req.body.amount <= 0) return next("Please provide a positive amount");
    if (req.body.amount > req.product.amount)
        return next("Product is not available in such high amounts");
    if (req.body.amount * req.product.price > req.user.balance)
        return next("User balance is not enough");
    return next();
};

export default {
    validateCoin,
    validateMaxBalance,
    validatePurchase,
};
