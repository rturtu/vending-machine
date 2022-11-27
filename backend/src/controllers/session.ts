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

export const deleteSession = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (!req.session) return next("Session is not set in request");
    console.log("delete session ", req.session.id);
    Session.destroy({
        where: {
            id: req.session.id,
        },
    })
        .then(() => {
            res.status(200).send("Signed out successfully");
        })
        .catch((err: any) => next(err));
};

export const deleteAllSessions = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (!req.session) return next("Session is not set in request");
    Session.destroy({
        where: {
            UserId: req.session.UserId,
        },
    })
        .then(() => {
            res.status(200).json("Signed out from every session successfully");
        })
        .catch((err: any) => next(err));
};

export default {
    generateJWT,
    deleteSession,
    deleteAllSessions,
};
