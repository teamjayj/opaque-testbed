import { beforeAll, beforeEach, describe, expect, it } from "vitest";
import request from "supertest";
import { createApp } from "./app";
import { Application } from "express";

describe("Password-over-TLS express server test", () => {
    let app: Application;

    const userDatabase: Map<string, string> = new Map();
    const user = { username: "bob", password: "password" };

    beforeAll(() => {
        app = createApp(userDatabase);
    });

    beforeEach(() => {
        userDatabase.clear();
    });

    it("should successfully register a user", async () => {
        const registerResponse = await request(app)
            .post("/register")
            .send(user);

        expect(registerResponse.statusCode).toEqual(200);
        expect(registerResponse.body).toEqual({
            message: "Successfully registered",
        });
    });

    it("should not register user if already exists", async () => {
        await request(app).post("/register").send(user);

        const registerResponse = await request(app)
            .post("/register")
            .send(user);

        expect(registerResponse.statusCode).toEqual(500);
        expect(registerResponse.body).toEqual({
            message: `User '${user.username}' is already registered`,
        });
    });

    it("should successfully login a user", async () => {
        await request(app).post("/register").send(user);

        const loginResponse = await request(app).post("/login").send(user);

        expect(loginResponse.statusCode).toEqual(200);
    });

    it("should not login a user if it does not exist", async () => {
        const loginResponse = await request(app).post("/login").send(user);

        expect(loginResponse.statusCode).toEqual(500);
        expect(loginResponse.body).toEqual({
            message: `Cannot find user: ${user.username}`,
        });
    });

    it("should not login a user if incorrect password", async () => {
        await request(app).post("/register").send(user);

        const loginResponse = await request(app).post("/login").send({
            username: "bob",
            password: "notmypassword",
        });

        expect(loginResponse.statusCode).toEqual(401);
        expect(loginResponse.body).toEqual({
            message: "Invalid login",
        });
    });
});
