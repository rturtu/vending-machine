import { Request, Response, NextFunction } from "express";
import { validateEmail } from "../utils/validation";
import { UserRoles } from "../types/enums";
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
    if (!validateEmail(req.body.email))
        return next("Please provide a valid email");
    next();
};

export const validateUpdateUser = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (!req.body.password) return next("Please provide a password");
    if (!req.user) return next("User is not set in request");
    if (validateCryptedPassword(req.body.password, req.user?.password))
        return next("The new password can not be the same as the last one");
    return next();
};

export const validateUserRole = (...args: UserRoles[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.body.role) return next("Please provide a role");
        if (!args.includes(req.body.role))
            return next("Please provide a valid role");
        return next();
    };
};

export const validateSignedRole = (...args: UserRoles[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) return next("User is not set in request");
        if (!args.includes(req.user.role))
            return next("User does not have a valid role");
        return next();
    };
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
    validateUserRole,
    validateUpdateUser,
    validateSignedRole,
};
