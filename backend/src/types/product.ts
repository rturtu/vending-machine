export interface IProductSearch {
    skip: number;
    take: number;
    name: string;
    priceMin: number;
    priceMax: number;
    amountMin: number;
    amountMax: number;
    sellerId: number;
}
