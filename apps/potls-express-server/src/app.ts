import express, { Application, NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import cors from "cors";

function throwErrorIfEmptyUsernameOrPassword(
    username: string,
    password: string
): void {
    if (username == null || username.length === 0) {
        throw new Error("Username cannot be empty");
    }

    if (password == null || password.length === 0) {
        throw new Error("Password cannot be empty");
    }
}

export function isLoadTestingEnvironment(): boolean {
    return process.env.NODE_ENV === "load-testing";
}

export function createApp(userDatabase: Map<string, string>): Application {
    const app = express();

    app.use(express.json());
    app.use(cors());

    app.post(
        "/register",
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const { username, password: plaintextPassword } = req.body;

                throwErrorIfEmptyUsernameOrPassword(
                    username,
                    plaintextPassword
                );

                const hashedPassword = await bcrypt.hash(plaintextPassword, 10);

                if (!isLoadTestingEnvironment()) {
                    if (userDatabase.has(username)) {
                        throw new Error(
                            `User '${username}' is already registered`
                        );
                    }

                    userDatabase.set(username, hashedPassword);
                }

                return res.json({ message: "Successfully registered" });
            } catch (error) {
                next(error);
            }
        }
    );

    app.post(
        "/login",
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const { username, password: plaintextPasswordAttempt } =
                    req.body;

                throwErrorIfEmptyUsernameOrPassword(
                    username,
                    plaintextPasswordAttempt
                );

                const hashedPassword = userDatabase.get(username);

                if (hashedPassword == null) {
                    throw new Error(`Cannot find user: ${username}`);
                }

                const isValidLogin = await bcrypt.compare(
                    plaintextPasswordAttempt,
                    hashedPassword
                );

                if (isValidLogin) {
                    return res.json({ message: "Successfully logged in" });
                } else {
                    return res.status(401).json({ message: "Invalid login" });
                }
            } catch (error) {
                next(error);
            }
        }
    );

    app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
        return res.status(500).json({ message: err.message });
    });

    return app;
}
