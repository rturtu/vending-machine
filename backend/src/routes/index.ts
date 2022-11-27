import { Router } from "express";
import { readAll, logIn } from "../controllers/user";
import userRoutes from "./user";
import sessionRoutes from "./session";

export default class MainRouter {
    router: Router;

    constructor() {
        this.router = Router({ mergeParams: true });

        this.router.get("/", (req, res) => {
            res.status(200).send("API is running");
        });

        userRoutes(this.router);
        sessionRoutes(this.router);
    }
}
