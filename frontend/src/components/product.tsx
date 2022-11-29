import React from "react";
import { Product as IProduct } from "../types";
import { Button } from "@mui/material";

interface Props {
    product: IProduct;
    onEdit?: (product: IProduct) => void;
    onBuy?: (product: IProduct) => void;
    onDelete?: (product: IProduct) => void;
}

const Product = (props: Props) => {
    const { product, onEdit, onBuy, onDelete } = props;
    return (
        <div>
            <span>
                [id={product.id}] {product.name} (amount: {product.amount})
                (price: {product.price}cents)
            </span>
            {onEdit && <Button onClick={() => onEdit(product)}>Edit</Button>}
            {onBuy && <Button onClick={() => onBuy(product)}>Buy</Button>}
            {onDelete && (
                <Button onClick={() => onDelete(product)}>Delete</Button>
            )}
        </div>
    );
};

export default Product;
