import React, { useState } from "react";
import { Container, TextField, Button } from "@mui/material";
import styled from "@emotion/styled";
import { signin } from "../api/session";
import { Navigate, useNavigate } from "react-router-dom";
import { UserRoles } from "../types";
import { setSession } from "../redux/session";
import { connect } from "react-redux";

const Form = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 100vh;
    max-width: 600px;
    margin: 0 auto;
    gap: 1em;
`;

const mapDispatchToProps = { setSession };
type dispatchType = typeof mapDispatchToProps;

interface Props extends dispatchType {}

const Login = (props: Props) => {
    const { setSession } = props;
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const navigate = useNavigate();

    const handleSignIn = () => {
        signin({ email, password }).then(
            (session: {
                role: UserRoles;
                token: string;
                userId: number;
                balance: number;
            }) => {
                setSession(session);
                if (session.role === UserRoles.Buyer) {
                    navigate("/vending-machine");
                } else if (session.role === UserRoles.Seller) {
                    navigate("/products");
                }
            }
        );
    };
    return (
        <Container>
            <Form>
                <TextField
                    label="Username"
                    value={email}
                    onChange={(evt: React.ChangeEvent<HTMLInputElement>) => {
                        setEmail(evt.target.value);
                    }}
                />
                <TextField
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(evt: React.ChangeEvent<HTMLInputElement>) => {
                        setPassword(evt.target.value);
                    }}
                />
                <Button onClick={handleSignIn}>Sign In</Button>
            </Form>
        </Container>
    );
};

export default connect(null, mapDispatchToProps)(Login);
