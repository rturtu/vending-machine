import React from "react";
import {
    BrowserRouter,
    Routes as Switch,
    Route,
    RouteProps,
    Navigate,
} from "react-router-dom";
import Login from "./login";
import VendingMachine from "./vending-machine";
import ProductsPage from "./products";
import { RootState } from "../redux/root-store";
import { UserRoles } from "../types";
import { connect } from "react-redux";

const mapStateToProps = (state: RootState) => ({
    token: state.session.token,
    role: state.session.role,
});

interface AuthRouteProps extends ReturnType<typeof mapStateToProps> {
    children: React.ReactElement;
}

const _AuthRoute = (props: AuthRouteProps) => {
    const { token, role } = props;
    if (token) {
        if (role === UserRoles.Buyer)
            return <Navigate to="/vending-machine" replace={true} />;
        else return <Navigate to="/products" replace={true} />;
    }
    return props.children;
};
const AuthRoute = connect(mapStateToProps)(_AuthRoute);

const _ProtectedRoute = (props: AuthRouteProps) => {
    const { token } = props;
    if (!token) return <Navigate to="/login" replace={true} />;
    return props.children;
};
const ProtectedRoute = connect(mapStateToProps)(_ProtectedRoute);

const RoutesIndex: React.FC = () => {
    return (
        <BrowserRouter>
            <Switch>
                <Route
                    path={"/login"}
                    element={
                        <AuthRoute>
                            <Login />
                        </AuthRoute>
                    }
                />
                <Route
                    path={"/vending-machine"}
                    element={
                        <ProtectedRoute>
                            <VendingMachine />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path={"/products"}
                    element={
                        <ProtectedRoute>
                            <ProductsPage />
                        </ProtectedRoute>
                    }
                />
            </Switch>
        </BrowserRouter>
    );
};

export default RoutesIndex;
