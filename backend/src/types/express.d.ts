import { IUser } from "../models/user";
import { ISession } from "../models/session";
import { IProduct } from "../models/product";
import { IProductSearch } from "./product";

export {};

declare global {
    namespace Express {
        export interface Request {
            user?: IUser;
            session?: ISession;
            product?: IProduct;
            productSearch?: IProductSearch;
            sessionCount?: number;
        }
    }
}
