import { Request, Response, NextFunction } from "express";
import { validateEmail } from "../utils/validation";
import { UserRoles } from "../types/enums";
import { User, IUser } from "../models/user";
import { Session, ISession } from "../models/session";

export const jwtAuthentication = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.log("middlewares.session.jwtAuthentication");
    if (!req.headers.authorization) return next("Missing token header");
    Session.findOne({
        where: {
            jwt: req.headers.authorization,
        },
        include: {
            model: User,
        },
    })
        .then((session: ISession | null) => {
            if (session == null) return next("Invalid authorization token");
            req.user = session.User;
            req.session = session;
            next();
        })
        .catch((err: any) => res.json(err));
};

export default {
    jwtAuthentication,
};
