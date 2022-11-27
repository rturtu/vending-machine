import { Request, Response, NextFunction } from "express";
import { User, IUser, validatePassword } from "../models/user";

export const readAll = (req: Request, res: Response) => {
    User.findAll()
        .then((users: IUser[]) => {
            res.json(users);
        })
        .catch((err: any) => {
            res.json(err);
        });
};

export const logIn = (req: Request, res: Response, next: NextFunction) => {
    User.findOne({
        where: {
            email: req.body.email,
        },
    })
        .then((user: IUser | null) => {
            if (user == null) {
                return res.status(403).send("Email or password do not match!");
            }
            if (validatePassword(req.body.password, user.password)) {
                res.status(200).send("Successful log in!");
            } else {
                res.status(403).send("Email or password do not match!");
            }
        })
        .catch(() => {
            res.status(403).send("Email or password do not match!");
        });
};

export const add = (req: Request, res: Response) => {
    User.create({
        email: req.body.email,
        password: req.body.password,
        role: req.body.role,
    })
        .then((user: IUser) => {
            res.json({
                email: req.body.email,
                role: req.body.role,
            });
        })
        .catch((err: any) => {
            res.json(err);
        });
};

export default {
    logIn,
    add,
    readAll,
};
