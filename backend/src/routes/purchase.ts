import { Router } from "express";
import productMiddleware from "../middlewares/product";
import userMiddleware from "../middlewares/user";
import sessionMiddleware from "../middlewares/session";
import purchaseMiddleware from "../middlewares/purchase";
import purchaseController from "../controllers/purchase";
import { UserRoles } from "../types/enums";

const purchaseRoutes = (router: Router) => {
    router.post(
        "/deposit",
        sessionMiddleware.jwtAuthentication,
        userMiddleware.validateSignedRole(UserRoles.Buyer),
        purchaseMiddleware.validateCoin,
        purchaseMiddleware.validateMaxBalance,
        purchaseController.deposit
    );

    router.post(
        "/reset",
        sessionMiddleware.jwtAuthentication,
        userMiddleware.validateSignedRole(UserRoles.Buyer),
        purchaseController.resetBalance
    );

    router.post(
        "/buy",
        sessionMiddleware.jwtAuthentication,
        userMiddleware.validateSignedRole(UserRoles.Buyer),
        productMiddleware.existByProductIdBody,
        purchaseMiddleware.validatePurchase,
        purchaseController.buy
    );
};

export default purchaseRoutes;
