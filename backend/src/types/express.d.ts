import { IUser } from "../models/user";
import { ISession } from "../models/session";

export {};

declare global {
    namespace Express {
        export interface Request {
            user?: IUser;
            session?: ISession;
        }
    }
}
