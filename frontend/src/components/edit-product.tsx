import React from "react";
import { TextField, Button } from "@mui/material";
import { Product } from "../types";
import styled from "@emotion/styled";

const StyledTextField = styled(TextField)`
    margin-bottom: 10px;
`;

interface Props {
    product: Partial<Product>;
    setProduct: (product: Partial<Product>) => void;
}
const EditProduct = (props: Props) => {
    const { product, setProduct } = props;
    return (
        <>
            <StyledTextField
                label="Name"
                value={product?.name}
                onChange={(evt: React.ChangeEvent<HTMLInputElement>) =>
                    setProduct({ name: evt.target.value })
                }
            />
            <StyledTextField
                label="Amount"
                type="number"
                value={product?.amount}
                onChange={(evt: React.ChangeEvent<HTMLInputElement>) =>
                    setProduct({ amount: Number(evt.target.value) })
                }
            />
            <StyledTextField
                label="Price"
                type="number"
                value={product?.price}
                onChange={(evt: React.ChangeEvent<HTMLInputElement>) =>
                    setProduct({ price: Number(evt.target.value) })
                }
            />
        </>
    );
};

export default EditProduct;
