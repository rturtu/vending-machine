import { IProduct } from "../models/product";

export const sanitizeProduct = (product: IProduct) => ({
    id: product.id,
    name: product.name,
    amount: product.amount,
    price: product.price,
});
