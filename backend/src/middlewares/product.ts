import { Request, Response, NextFunction } from "express";
import { Product, IProduct } from "../models/product";
import { normalizeSearchParam } from "../utils/validation";
import { MAX_INTEGER } from "../utils/max-values";

export const validateProduct = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.log("middlewares.product.validateProduct");
    if (!req.body.name) return next("Please provide a product name");
    if (req.body.amount == null) return next("Please provide an amount");
    if (req.body.price == null) return next("Please provide a price");
    if (req.body.amount < 0) return next("Amount can not be negative");
    if (req.body.price < 0) return next("Price can not be negative");
    if (req.body.amount > MAX_INTEGER)
        return next(`Amount max value ${MAX_INTEGER}`);
    if (req.body.price > MAX_INTEGER)
        return next(`Price max value ${MAX_INTEGER}`);
    return next();
};

export const existByIdParam = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.log("middlewares.product.existByIdParam");
    if (!req.params.id) return next("Please provide a product id");
    Product.findOne({
        where: {
            id: req.params.id,
        },
    })
        .then((product: IProduct | null) => {
            if (product == null) return next("Product does not exist");
            req.product = product;
            next();
        })
        .catch((err: any) => next(err));
};

export const userOwnsProduct = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.log("middlewares.product.userOwnsProduct");
    if (!req.user) return next("User is not set in request");
    if (!req.product) return next("Product is not set in request");
    if (req.user.id !== req.product.UserId)
        return next("You are not the seller of this product");
    next();
};

export const validateSearch = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.log("middlewares.product.validateSearch");
    req.productSearch = {
        skip: <number>normalizeSearchParam(Number(req.query.skip), 0, 0),
        take: <number>normalizeSearchParam(Number(req.query.take), 20, 0, 100),
        name: <string>normalizeSearchParam(req.query.name, ""),
        priceMin: <number>(
            normalizeSearchParam(Number(req.query.priceMin), 0, 0)
        ),
        priceMax: <number>(
            normalizeSearchParam(
                Number(req.query.priceMax),
                MAX_INTEGER,
                0,
                MAX_INTEGER
            )
        ),
        amountMin: <number>(
            normalizeSearchParam(Number(req.query.amountMin), 0, 0)
        ),
        amountMax: <number>(
            normalizeSearchParam(
                Number(req.query.amountMax),
                MAX_INTEGER,
                0,
                MAX_INTEGER
            )
        ),
    };
    return next();
};

export default {
    validateProduct,
    existByIdParam,
    userOwnsProduct,
    validateSearch,
};
