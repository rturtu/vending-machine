import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { RootState } from "../redux/root-store";
import { fetchProducts, addProduct, deleteProduct } from "../api/products";
import {
    appendProducts,
    setProducts,
    editProduct as reduxEditProduct,
    deleteProduct as reduxDeleteProduct,
} from "../redux/products";
import Product from "../components/product";
import { Product as IProduct, ProductSearch } from "../types";
import { Button } from "@mui/material";

const mapDispatchToProps = {
    appendProducts,
    setProducts,
    reduxEditProduct,
    reduxDeleteProduct,
};
type dispatchType = typeof mapDispatchToProps;

const mapStateToProps = (state: RootState) => ({
    token: state.session.token,
    products: state.products.list,
    totalProductsCount: state.products.count,
});

interface Props extends ReturnType<typeof mapStateToProps>, dispatchType {
    onProductEdit?: (product: IProduct) => void;
    onProductDelete?: (product: IProduct) => void;
    onProductBuy?: (product: IProduct) => void;
    defaultSearch?: ProductSearch;
}

const PAGE_SIZE = 10;

const Products = (props: Props) => {
    const {
        products,
        totalProductsCount,
        token,
        onProductEdit,
        onProductDelete,
        onProductBuy,
        defaultSearch,
        setProducts,
        appendProducts,
        reduxEditProduct,
        reduxDeleteProduct,
    } = props;
    const [fetchLoading, setFetchLoading] = useState<boolean>(false);
    const [productsLoaded, setProductsLoaded] = useState<number>(0);

    useEffect(() => {
        setFetchLoading(true);
        fetchProducts({ token, search: { ...defaultSearch, take: PAGE_SIZE } })
            .then((response: { list: IProduct[]; count: number }) => {
                setProducts({ products: response.list, count: response.count });
                setProductsLoaded(PAGE_SIZE);
            })
            .finally(() => {
                setFetchLoading(false);
            });
    }, []);

    const handleLoadMore = () => {
        setFetchLoading(true);
        fetchProducts({
            token,
            search: { ...defaultSearch, take: PAGE_SIZE, skip: productsLoaded },
        })
            .then((response: { list: IProduct[] }) => {
                appendProducts({ products: response.list });
                setProductsLoaded(
                    (productsLoaded) => productsLoaded + PAGE_SIZE
                );
            })
            .finally(() => {
                setFetchLoading(false);
            });
    };

    return (
        <>
            {products.map((product: IProduct) => (
                <Product
                    key={product.id}
                    product={product}
                    onEdit={onProductEdit}
                    onDelete={onProductDelete}
                    onBuy={onProductBuy}
                />
            ))}
            {totalProductsCount !== products.length && (
                <Button
                    onClick={() => handleLoadMore()}
                    disabled={fetchLoading}
                >
                    Load More
                </Button>
            )}
        </>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(Products);
