import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { RootState } from "../redux/root-store";
import { fetchProducts, addProduct, deleteProduct } from "../api/products";
import {
    appendProducts,
    setProducts,
    editProduct as reduxEditProduct,
    deleteProduct as reduxDeleteProduct,
} from "../redux/products";
import { deleteSession } from "../redux/session";
import { signout } from "../api/session";
import { Product as IProduct } from "../types";
import { TextField, Button, Modal, Box } from "@mui/material";
import { DEFAULT_PRODUCT } from "../default-values";
import EditProduct from "../components/edit-product";
import { modalStyle } from "../components/styles";
import styled from "@emotion/styled";
import Products from "../components/products";

export const Container = styled.div`
    display: flex;
    align-items: flex-start;
`;

const mapDispatchToProps = {
    appendProducts,
    setProducts,
    reduxEditProduct,
    reduxDeleteProduct,
    deleteSession,
};
type dispatchType = typeof mapDispatchToProps;

const mapStateToProps = (state: RootState) => ({
    token: state.session.token,
    userId: state.session.userId,
    totalProductsCount: state.products.count,
});

interface Props extends ReturnType<typeof mapStateToProps>, dispatchType {}

const ProductsPage = (props: Props) => {
    const {
        token,
        userId,
        appendProducts,
        setProducts,
        reduxEditProduct,
        reduxDeleteProduct,
        totalProductsCount,
        deleteSession,
    } = props;
    const [newProduct, setNewProduct] = useState<IProduct>(DEFAULT_PRODUCT);
    const [editProduct, setEditProduct] = useState<IProduct | undefined>(
        undefined
    );
    const [editLoading, setEditLoading] = useState<boolean>(false);
    const [newLoading, setNewLoading] = useState<boolean>(false);

    const updateNewProduct = (product: Partial<IProduct>) =>
        setNewProduct({ ...newProduct, ...product });

    const updateEditProduct = (product: Partial<IProduct>) =>
        editProduct && setEditProduct({ ...editProduct, ...product });

    const handleEditProduct = () => {
        if (!editProduct) return;
        setEditLoading(true);
        addProduct({ token, product: editProduct })
            .then((product: IProduct) => {
                reduxEditProduct({ product });
                setEditProduct(undefined);
            })
            .finally(() => {
                setEditLoading(false);
            });
    };

    const handleAddProduct = () => {
        setNewLoading(true);
        addProduct({ token, product: newProduct })
            .then((product: IProduct) => {
                appendProducts({ products: [product], increment: 1 });
            })
            .finally(() => {
                setNewLoading(false);
            });
    };

    const handleDeleteProduct = (product: IProduct) => {
        deleteProduct({ token, productId: product.id }).then(() => {
            reduxDeleteProduct({ productId: product.id, decrement: 1 });
        });
    };

    const handleSignOut = () => {
        signout({ token }).then(() => {
            deleteSession();
        });
    };

    return (
        <Container>
            <div style={{ flex: 2, position: "relative" }}>
                <h3
                    style={{
                        position: "sticky",
                        top: "0px",
                        backgroundColor: "white",
                        width: "100%",
                    }}
                >
                    My products
                </h3>
                <Products
                    defaultSearch={{
                        sellerId: userId,
                    }}
                    onProductEdit={(product: IProduct) =>
                        setEditProduct(product)
                    }
                    onProductDelete={handleDeleteProduct}
                />
            </div>
            <div
                style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    position: "sticky",
                    top: 0,
                }}
            >
                <Button onClick={handleSignOut}>Log out</Button>
                <h3>Add new product</h3>
                <EditProduct
                    product={newProduct}
                    setProduct={updateNewProduct}
                />
                <Button onClick={handleAddProduct} disabled={newLoading}>
                    Add
                </Button>
            </div>
            {editProduct && (
                <Modal open={true} onClose={() => setEditProduct(undefined)}>
                    <Box sx={modalStyle}>
                        <EditProduct
                            product={editProduct}
                            setProduct={updateEditProduct}
                        />{" "}
                        <br />
                        <Button
                            onClick={handleEditProduct}
                            disabled={editLoading}
                        >
                            Save
                        </Button>
                        <Button onClick={() => setEditProduct(undefined)}>
                            Close
                        </Button>
                    </Box>
                </Modal>
            )}
        </Container>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductsPage);
