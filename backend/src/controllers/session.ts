import { Request, Response, NextFunction } from "express";
import { Session, ISession } from "../models/session";

export const generateJWT = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (!req.user) return next("User is not set in request");
    console.log("generateJWT", `userId=${req.user.id}`);
    Session.create({
        UserId: req.user.id,
        jwt: "",
    })
        .then((session: ISession) => {
            console.log("created session", session);
            res.status(200).send(session.jwt);
        })
        .catch((err: any) => {
            res.json(err);
        });
};

export default {
    generateJWT,
};
