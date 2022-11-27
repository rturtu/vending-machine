import { Router } from "express";

import userMiddleware from "../middlewares/user";
import sessionController from "../controllers/session";
import sessionMiddleware from "../middlewares/session";

const sessionRoutes = (router: Router) => {
    router.post(
        "/token",
        userMiddleware.authenticate,
        sessionController.generateJWT
    );

    router.delete(
        "/token",
        sessionMiddleware.jwtAuthentication,
        sessionController.deleteSession
    );
};

export default sessionRoutes;
