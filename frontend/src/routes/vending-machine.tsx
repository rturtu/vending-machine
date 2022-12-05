import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Container } from "./products";
import { Product as IProduct } from "../types";
import Products from "../components/products";
import { RootState } from "../redux/root-store";
import { Button, TextField } from "@mui/material";
import { deposit, buy } from "../api/purchase";
import { setBalance } from "../redux/session";
import Product from "../components/product";
import { editProduct } from "../redux/products";
import { signout } from "../api/session";
import { deleteSession } from "../redux/session";

const mapDispatchToProps = {
    setBalance,
    editProduct,
    deleteSession,
};
type dispatchType = typeof mapDispatchToProps;

const mapStateToProps = (state: RootState) => ({
    token: state.session.token,
    userId: state.session.userId,
    balance: state.session.balance,
});

interface Props extends ReturnType<typeof mapStateToProps>, dispatchType {}

const VendingMachine = (props: Props) => {
    const { balance, setBalance, token, editProduct, deleteSession } = props;
    const [buyProduct, setBuyProduct] = useState<IProduct | undefined>(
        undefined
    );
    const [change, setChange] = useState<number[]>([]);
    const [newCoin, setNewCoin] = useState<number>(0);
    const [purchaseAmount, setPurchaseAmount] = useState<number>(0);

    const handleDeposit = () => {
        deposit({ token, coin: newCoin }).then(
            (response: { balance: number }) => {
                setBalance({ balance: response.balance });
            }
        );
    };

    const handleBuy = () => {
        if (!buyProduct) return;
        buy({ token, productId: buyProduct.id, amount: purchaseAmount }).then(
            (response: {
                balance: number;
                amount: number;
                change: number[];
            }) => {
                setBalance({ balance: response.balance });
                setChange(response.change);
                const newProduct = { ...buyProduct, amount: response.amount };
                editProduct({ product: newProduct });
                setBuyProduct(newProduct);
            }
        );
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
                    All products
                </h3>
                <Products defaultSearch={{}} onProductBuy={setBuyProduct} />
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
                <h3>Balance: ${balance}</h3>
                {!!change.length && (
                    <h3>
                        Change: 5({change[0]}) 10({change[1]}) 20({change[2]})
                        50(
                        {change[3]}) 100({change[4]}){" "}
                    </h3>
                )}
                <h3>Add balance</h3>
                <div>
                    <TextField
                        type="number"
                        label="Coin value"
                        value={newCoin}
                        onChange={(evt: React.ChangeEvent<HTMLInputElement>) =>
                            setNewCoin(Number(evt.target.value))
                        }
                    />
                    <Button onClick={handleDeposit}>Deposit</Button>
                </div>
                {buyProduct && (
                    <div>
                        <h3>Buy product</h3>
                        <Product product={buyProduct} />
                        <TextField
                            type="number"
                            label="Amount"
                            value={purchaseAmount}
                            onChange={(
                                evt: React.ChangeEvent<HTMLInputElement>
                            ) => setPurchaseAmount(Number(evt.target.value))}
                        />
                        <Button onClick={handleBuy}>Buy</Button>
                        <Button
                            onClick={() => {
                                setBuyProduct(undefined);
                                setPurchaseAmount(0);
                            }}
                        >
                            Cancel
                        </Button>
                    </div>
                )}
            </div>
        </Container>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(VendingMachine);
