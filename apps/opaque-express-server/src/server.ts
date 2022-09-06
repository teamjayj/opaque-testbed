import "dotenv/config";

import { webcrypto } from "crypto";

if (typeof crypto === "undefined") {
    // @ts-ignore
    global.crypto = webcrypto;
}

import { createApp, isLoadTestingEnvironment } from "./app";
import papaparse from "papaparse";
import { createReadStream } from "fs";
import {
    ExposedOpaqueCredentialStore,
    ExposedOpaqueSessionStore,
} from "./store";
import { OpaqueCredential } from "./types";
import { hexStringToUint8Array } from "@teamjayj/opaque-core";
import { appendFile } from "fs/promises";

const port = process.env.PORT || 3101;

const credentialStore = new ExposedOpaqueCredentialStore();
const sessionStore = new ExposedOpaqueSessionStore();

const credentialStoreMap = credentialStore.getCache();
const sessionStoreMap = sessionStore.getCache();

if (isLoadTestingEnvironment()) {
    papaparse.parse(createReadStream("data/opaque-server-store.csv"), {
        header: true,
        step: (result) => {
            const {
                user_id: userId,
                session_id: sessionId,
                credential_file: credentialFile,
                expected_auth_key: expectedAuthKey,
            } = result.data as OpaqueCredential;

            credentialStoreMap.set(
                userId,
                hexStringToUint8Array(credentialFile)
            );

            sessionStoreMap.set(
                sessionId,
                hexStringToUint8Array(expectedAuthKey)
            );
        },
        complete: () => {
            console.log(
                `Loaded ${credentialStoreMap.size} entries into credential store`
            );

            console.log(
                `Loaded ${sessionStoreMap.size} entries into session store`
            );
        },
    });

    setInterval(async () => {
        const { heapUsed, heapTotal, external, rss, arrayBuffers } =
            process.memoryUsage();
        const date = new Date();

        await appendFile(
            "data/used-memory.json",
            JSON.stringify({
                date,
                heapUsed: heapUsed / 1048576,
                heapTotal: heapTotal / 1048576,
                external: external / 1048576,
                rss: rss / 1048576,
                arrayBuffers: arrayBuffers / 1048576,
            }) + "\n"
        );
    }, 1000);
}

(async () => {
    const app = await createApp(credentialStore, sessionStore);

    app.listen(port, () => {
        console.log(
            `OPAQUE express server is listening to port ${port} with env: ${process.env.NODE_ENV}`
        );
    });
})();
