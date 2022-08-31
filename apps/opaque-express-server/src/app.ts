import express, { Application } from "express";
import cors from "cors";
import { createServer } from "@teamjayj/opaque-express-server";
import { OpaqueCloudflareServerDriver } from "@teamjayj/opaque-cloudflare-driver";
import { OpaqueCipherSuite } from "@teamjayj/opaque-core";

export function isLoadTestingEnvironment(): boolean {
    return process.env.NODE_ENV === "load-testing";
}

export async function createApp(): Promise<Application> {
    const app = express();
    app.use(express.json());
    app.use(cors());

    const driver = new OpaqueCloudflareServerDriver(
        "server-id",
        OpaqueCipherSuite.P256_SHA256
    );

    const opaqueServer = await createServer({
        driver,
    });

    opaqueServer.createRoutes(app);

    return app;
}
