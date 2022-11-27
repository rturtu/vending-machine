import { Router } from "express";
import userController from "../controllers/user";
import userMiddleware from "../middlewares/user";
import sessionMiddleware from "../middlewares/session";
import { UserRoles } from "../types/user-roles";

const userRoutes = (router: Router) => {
    router.post(
        "/user",
        userMiddleware.validateCreateNewUser,
        userMiddleware.validateUserRole(UserRoles.Buyer, UserRoles.Seller),
        userMiddleware.emailDoesntExist,
        userController.add
    );

    router.put(
        "/user",
        sessionMiddleware.jwtAuthentication,
        userMiddleware.validateUpdateUser,
        userController.update
    );

    router.delete(
        "/user",
        sessionMiddleware.jwtAuthentication,
        userController.deleteUser
    );

    router.post(
        "/admin",
        userMiddleware.validateCreateNewUser,
        userMiddleware.validateUserRole(UserRoles.Admin),
        userMiddleware.emailDoesntExist,
        userController.add
    );
};

export default userRoutes;
