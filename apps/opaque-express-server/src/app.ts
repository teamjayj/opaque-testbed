import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import { createServer } from "@teamjayj/opaque-express-server";
import { OpaqueCloudflareServerDriver } from "@teamjayj/opaque-cloudflare-driver";
import {
    OpaqueCipherSuite,
    OpaqueCredentialStore,
    OpaqueSessionStore,
} from "@teamjayj/opaque-core";

export function isLoadTestingEnvironment(): boolean {
    return process.env.NODE_ENV === "load-testing";
}

export async function createApp(
    credentialStore: OpaqueCredentialStore,
    sessionStore: OpaqueSessionStore
): Promise<Application> {
    const app = express();
    app.use(express.json());
    app.use(cors());

    const driver = new OpaqueCloudflareServerDriver(
        "server-id",
        OpaqueCipherSuite.P256_SHA256
    );

    const opaqueServer = await createServer({
        driver,
        stores: {
            credentialStore,
            sessionStore,
        },
    });

    opaqueServer.createRoutes(app);

    app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
        return res.status(500).json({ message: err.message });
    });

    return app;
}
