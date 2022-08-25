import express, { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import cors from "cors";

const app = express();
const port = process.env.PORT || 6969;

app.use(express.json());
app.use(cors());

const userDatabase: Map<string, string> = new Map();

function throwErrorIfMissing(username: string, password: string): void {
    if (username == null) {
        throw new Error("Username cannot be null");
    }

    if (password == null) {
        throw new Error("Password cannot be null");
    }
}

app.post(
    "/register",
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { username, password: plaintextPassword } = req.body;

            throwErrorIfMissing(username, plaintextPassword);

            if (userDatabase.has(username)) {
                throw new Error(`User '${username}' is already registered`);
            }

            const hashedPassword = await bcrypt.hash(plaintextPassword, 10);

            userDatabase.set(username, hashedPassword);

            return res.json({ message: "Successfully registered" });
        } catch (error) {
            next(error);
        }
    }
);

app.post("/login", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { username, password: plaintextPasswordAttempt } = req.body;

        throwErrorIfMissing(username, plaintextPasswordAttempt);

        const hashedPassword = userDatabase.get(username);

        if (hashedPassword == null) {
            throw new Error(`Cannot find user: ${username}`);
        }

        const isValidLogin = await bcrypt.compare(
            plaintextPasswordAttempt,
            hashedPassword
        );

        if (isValidLogin) {
            return res.json({ success: true });
        } else {
            return res.status(401).json({ message: "Invalid login" });
        }
    } catch (error) {
        next(error);
    }
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err);
    return res.status(500).json({ message: err.message });
});

app.listen(port, () => {
    console.log("App is listening to port: " + port);
});
