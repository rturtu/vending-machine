import { Request, Response, NextFunction } from "express";
import { Product, IProduct } from "../models/product";
import { Op } from "sequelize";
import { sanitizeProduct } from "../utils/sanitize";

export const add = (req: Request, res: Response, next: NextFunction) => {
    console.log("controller.product.update");
    if (!req.user) return next("User is not set in request");
    Product.create({
        name: req.body.name,
        amount: req.body.amount,
        price: req.body.price,
        UserId: req.user.id,
    })
        .then((product: IProduct) => {
            res.status(200).json(sanitizeProduct(product));
        })
        .catch((err: any) => next(err));
};

export const update = (req: Request, res: Response, next: NextFunction) => {
    console.log("controller.product.update");
    if (!req.product) return next("Product is not set in request");
    Product.update(
        {
            name: req.body.name || req.product.name,
            amount: req.body.amount || req.product.amount,
            price: req.body.price || req.product.price,
        },
        {
            fields: ["name", "amount", "price"],
            where: {
                id: req.params.id,
            },
        }
    )
        .then((affectedRows: [number, IProduct[]]) => {
            const [count, products] = affectedRows;
            if (count === 0) return next("Something went wrong");
            res.status(200).json({
                id: req.product?.id || 0,
                price: req.body.price,
                amount: req.body.amount,
                name: req.body.name,
            });
        })
        .catch((err: any) => next(err));
};

export const deleteProduct = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (!req.product) return next("Product is not set in request");
    Product.destroy({
        where: {
            id: req.product.id,
        },
    })
        .then(() => {
            res.status(200).end();
        })
        .catch((err: any) => next(err));
};

export const get = (req: Request, res: Response, next: NextFunction) => {
    console.log("controller.product.get");
    if (!req.product) return next("Product is not set in request");
    res.status(200).json(sanitizeProduct(req.product));
};

export const getCollection = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.log("controller.product.getCollection");
    if (!req.productSearch) return next("ProdutSearch is not set in request");
    console.log(req.productSearch);
    let sellerFilter = {};
    if (req.productSearch.sellerId)
        sellerFilter = {
            UserId: {
                [Op.eq]: req.productSearch.sellerId,
            },
        };
    Product.findAndCountAll({
        where: {
            name: {
                [Op.like]: `%${req.productSearch.name}%`,
            },
            ...sellerFilter,
            amount: {
                [Op.between]: [
                    req.productSearch.amountMin,
                    req.productSearch.amountMax,
                ],
            },
            price: {
                [Op.between]: [
                    req.productSearch.priceMin,
                    req.productSearch.priceMax,
                ],
            },
        },
        offset: req.productSearch.skip,
        limit: req.productSearch.take,
    })
        .then((result: { count: number; rows: IProduct[] }) => {
            res.status(200).json({
                count: result.count,
                list: result.rows.map(sanitizeProduct),
            });
        })
        .catch((err: any) => next(err));
};

export default {
    add,
    update,
    deleteProduct,
    get,
    getCollection,
};
