import { Request, Response, NextFunction } from "express";
import { validateEmail } from "../utils/validation";
import { UserRoles } from "../types/user-roles";
import {
    User,
    IUser,
    validatePassword as validateCryptedPassword,
} from "../models/user";

export const validateCreateNewUser = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (!req.body.email) return next("Please provide an email");
    if (!req.body.password) return next("Please provide a password");
    if (!req.body.role) return next("Please provide a role");
    if (!validateEmail(req.body.email))
        return next("Please provide a valid email");
    if (![UserRoles.Seller, UserRoles.Buyer].includes(req.body.role))
        return next("Please provide a valid role");
    next();
};

export const emailDoesntExist = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    User.findOne({
        where: {
            email: req.body.email,
        },
    })
        .then((user: IUser | null) => {
            if (user != null) return next("Email already in use");
            return next();
        })
        .catch((err: any) => next("Something went wrong"));
};

export const setUserByEmail = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.log("setUserByEmail");
    User.findOne({
        where: {
            email: req.body.email,
        },
    })
        .then((user: IUser | null) => {
            if (user == null) return next("User does not exist");
            req.user = user;
            next();
        })
        .catch((err: any) => next("Something went wrong"));
};

export const validatePassword = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (!req.user) return next("User not set in Request");
    console.log("validatePassword");
    if (!validateCryptedPassword(req.body.password, req.user?.password))
        return next("Wrong password");
    return next();
};

export const authenticate = [setUserByEmail, validatePassword];

export default {
    validateCreateNewUser,
    emailDoesntExist,
    validatePassword,
    authenticate,
};
