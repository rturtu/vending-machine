const server = require("../dist/index.js");
const supertest = require("supertest");
const requestWithSupertest = supertest(server);

describe("Test create user", () => {
    let sellerToken = "";
    let buyerToken = "";
    let firstProductId = 0;
    let secondProductId = 0;
    let totalBalance = 0;

    it("POST /user create seller", async () => {
        await new Promise((r) => setTimeout(r, 100));
        // expect(true).toBe(true);
        const res = await requestWithSupertest.post("/user").send({
            email: "seller@email.com",
            password: "seller_password",
            role: "seller",
        });
        expect(res.statusCode).toBe(200);
    });

    it("POST /user Should fail re-creating the same user", async () => {
        const res = await requestWithSupertest.post("/user").send({
            email: "seller@email.com",
            password: "seller_password",
            role: "seller",
        });
        console.log(res.body);
        expect(res.statusCode).toBe(500);
        expect(res.body.message).toBe("Email already in use");
    });

    it("POST /token Log into seller", async () => {
        const res = await requestWithSupertest.post("/token").send({
            email: "seller@email.com",
            password: "seller_password",
        });
        console.log(res.body);
        expect(res.statusCode).toBe(200);
        expect(res.body.sessionCount).toBe(0);
        sellerToken = res.body.token;
    });

    it("POST /deposit should not allow seller to deposit", async () => {
        const res = await requestWithSupertest
            .post("/deposit")
            .set({ Authorization: sellerToken })
            .send({
                coin: 50,
            });
        console.log(res.body);
        expect(res.statusCode).toBe(500);
        expect(res.body.message).toBe("User does not have a valid role");
    });

    it("POST /product should not allow negative price and amount products", async () => {
        const res = await requestWithSupertest
            .post("/product")
            .set({ Authorization: sellerToken })
            .send({
                name: "product 1",
                amount: 10,
                price: -5,
            });
        console.log(res.body);
        expect(res.statusCode).toBe(500);
        expect(res.body.message).toBe("Price can not be negative");
        const res2 = await requestWithSupertest
            .post("/product")
            .set({ Authorization: sellerToken })
            .send({
                name: "product 1",
                amount: -10,
                price: 5,
            });
        console.log(res.body);
        expect(res2.statusCode).toBe(500);
        expect(res2.body.message).toBe("Amount can not be negative");
    });

    it("POST /product should create 2 products", async () => {
        const res = await requestWithSupertest
            .post("/product")
            .set({ Authorization: sellerToken })
            .send({
                name: "product 1",
                amount: 10,
                price: 5,
            });
        expect(res.statusCode).toBe(200);
        firstProductId = res.body.id;
        const res2 = await requestWithSupertest
            .post("/product")
            .set({ Authorization: sellerToken })
            .send({
                name: "product 2",
                amount: 10,
                price: 5000,
            });
        expect(res2.statusCode).toBe(200);
        secondProductId = res2.body.id;
    });

    it("POST /user create buyer", async () => {
        const res = await requestWithSupertest.post("/user").send({
            email: "buyer@email.com",
            password: "buyer_password",
            role: "buyer",
        });
        expect(res.statusCode).toBe(200);
    });

    it("POST /token Log into buyer", async () => {
        const res = await requestWithSupertest.post("/token").send({
            email: "buyer@email.com",
            password: "buyer_password",
        });
        console.log(res.body);
        expect(res.statusCode).toBe(200);
        expect(res.body.sessionCount).toBe(0);
        buyerToken = res.body.token;
    });

    it("POST /product should not allow buyer to create products", async () => {
        const res = await requestWithSupertest
            .post("/product")
            .set({ Authorization: buyerToken })
            .send({
                name: "product 1",
                amount: 10,
                price: 5,
            });
        console.log(res.body);
        expect(res.statusCode).toBe(500);
        expect(res.body.message).toBe("User does not have a valid role");
    });

    it("POST /deposit should not allow user to deposit invalid coins", async () => {
        const invalidCoinValues = [12, -5, 13, 1233, "invalid", "12", "10"];
        for (let i = 0; i < invalidCoinValues.length; i++) {
            const coin = invalidCoinValues[i];
            const res = await requestWithSupertest
                .post("/deposit")
                .set({ Authorization: buyerToken })
                .send({
                    coin: coin,
                });
            console.log(res.body);
            expect(res.statusCode).toBe(500);
            expect(res.body.message).toBe("Please provide a valid coin value");
        }
    });

    it("POST /deposit should deposit all valid coins", async () => {
        const invalidCoinValues = [5, 10, 20, 50, 100];
        for (let i = 0; i < invalidCoinValues.length; i++) {
            const coin = invalidCoinValues[i];
            totalBalance = totalBalance + coin;
            const res = await requestWithSupertest
                .post("/deposit")
                .set({ Authorization: buyerToken })
                .send({
                    coin: coin,
                });
            console.log(res.body);
            expect(res.statusCode).toBe(200);
            expect(res.body.balance).toBe(totalBalance);
        }
    });

    it("POST /buy should not allow negative amount", async () => {
        const res = await requestWithSupertest
            .post("/buy")
            .set({ Authorization: buyerToken })
            .send({
                productId: firstProductId,
                amount: -3,
                price: 5,
            });
        console.log(res.body);
        expect(res.statusCode).toBe(500);
        expect(res.body.message).toBe("Please provide a positive amount");
        const res2 = await requestWithSupertest
            .post("/buy")
            .set({ Authorization: buyerToken })
            .send({
                productId: firstProductId,
                amount: 0,
                price: 5,
            });
        console.log(res2.body);
        expect(res2.statusCode).toBe(500);
        expect(res2.body.message).toBe("Please provide an amount");
    });

    it("POST /buy should not allow too much amount or too low balance", async () => {
        const res = await requestWithSupertest
            .post("/buy")
            .set({ Authorization: buyerToken })
            .send({
                productId: firstProductId,
                amount: 11,
            });
        console.log(res.body);
        expect(res.statusCode).toBe(500);
        expect(res.body.message).toBe(
            "Product is not available in such high amounts"
        );
        const res2 = await requestWithSupertest
            .post("/buy")
            .set({ Authorization: buyerToken })
            .send({
                productId: secondProductId,
                amount: 1,
            });
        console.log(res2.body);
        expect(res2.statusCode).toBe(500);
        expect(res2.body.message).toBe("User balance is not enough");
    });

    it("POST /buy should buy first product", async () => {
        const res = await requestWithSupertest
            .post("/buy")
            .set({ Authorization: buyerToken })
            .send({
                productId: firstProductId,
                amount: 10,
            });
        totalBalance = 0;
        console.log(res.body);
        expect(res.statusCode).toBe(200);
        expect(res.body.balance).toBe(0);
        expect(res.body.amount).toBe(0);
        expect(res.body.change).toStrictEqual([1, 1, 1, 0, 1]);
    });

    it("PUT /product should update second product", async () => {
        const res = await requestWithSupertest
            .put("/product/" + secondProductId)
            .set({ Authorization: sellerToken })
            .send({
                name: "product 2",
                amount: 1000,
                price: 1,
            });
        console.log(res.body);
        expect(res.statusCode).toBe(200);
    });

    it("DELETE /product delete second product", async () => {
        const res = await requestWithSupertest
            .delete("/product/" + secondProductId)
            .set({ Authorization: sellerToken })
            .send();
        console.log(res.body);
        expect(res.statusCode).toBe(200);
    });

    it("GET /products should have a single product", async () => {
        const res = await requestWithSupertest
            .get("/products")
            .set({ Authorization: sellerToken })
            .send();
        console.log(res.body);
        expect(res.statusCode).toBe(200);
        expect(res.body.count).toBe(1);
    });
});
