import React from "react";
import { Product as IProduct } from "../types";

interface Props {
    product: IProduct;
}

const Product = (props: Props) => {
    const { product } = props;
    return (
        <div>
            <span>
                ({product.id}) {product.name} (amount: {product.amount}) (price:{" "}
                {product.price})
            </span>
        </div>
    );
};

export default Product;
