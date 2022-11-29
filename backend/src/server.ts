import express, { Express } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import Router from "./routes";

export default class Server {
    expressInstance: Express;

    constructor() {
        this.expressInstance = express();

        this.expressInstance.use(cors());
        this.expressInstance.use(bodyParser.urlencoded({ extended: true }));
        this.expressInstance.use(bodyParser.json());

        this.expressInstance.use(new Router().router);
        this.expressInstance.use((err: any, req: any, res: any, next: any) => {
            res.status(500).json({
                message: err,
            });
        });
    }
}
