import { Router } from "express";
import userController from "../controllers/user";
import userMiddleware from "../middlewares/user";

const userRoutes = (router: Router) => {
    router.post(
        "/user",
        userMiddleware.validateCreateNewUser,
        userMiddleware.emailDoesntExist,
        userController.add
    );
};

export default userRoutes;
