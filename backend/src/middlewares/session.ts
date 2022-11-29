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

export const countActiveSessions = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (!req.user) return next("User is not set in request");
    Session.findAndCountAll({
        where: {
            UserId: req.user.id,
        },
        offset: 0,
        limit: 0,
    }).then((result: { count: number }) => {
        req.sessionCount = result.count;
        next();
    });
};

export default {
    jwtAuthentication,
    countActiveSessions,
};
