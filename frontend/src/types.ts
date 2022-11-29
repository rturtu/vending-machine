export interface Product {
    id: number;
    name: string;
    amount: number;
    price: number;
}

export const enum UserRoles {
    Buyer = "buyer",
    Seller = "seller",
}

export interface ProductSearch {
    name?: string;
    sellerId?: number;
    skip?: number;
    take?: number;
}
