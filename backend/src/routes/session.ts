import { Router } from "express";

import userMiddleware from "../middlewares/user";
import sessionController from "../controllers/session";

const sessionRoutes = (router: Router) => {
    router.post(
        "/token",
        userMiddleware.authenticate,
        sessionController.generateJWT
    );
};

export default sessionRoutes;
