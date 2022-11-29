import React, { useEffect } from "react";
import { connect } from "react-redux";
import { RootState } from "../redux/root-store";
import { fetchProducts } from "../api/products";

const mapStateToProps = (state: RootState) => ({
    token: state.session.token,
});

interface Props extends ReturnType<typeof mapStateToProps> {}

const ProductsPage = (props: Props) => {
    const { token } = props;

    useEffect(() => {
        console.log("test");
        fetchProducts({ token, search: {} });
    }, []);

    return <div>{token}</div>;
};

export default connect(mapStateToProps)(ProductsPage);
