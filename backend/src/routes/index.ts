import { Router } from "express";
import { add, readAll, logIn } from "../controllers/user";

export default class MainRouter {
    router: Router;

    constructor() {
        this.router = Router({ mergeParams: true });

        this.router.get("/", (req, res) => {
            res.status(200).send("Hello world!");
        });

        this.router.post("/user", add);
        this.router.get("/users", readAll);
        this.router.post("/login", logIn);
    }
}
