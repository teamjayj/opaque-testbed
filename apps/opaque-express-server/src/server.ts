import "dotenv/config";

import { webcrypto } from "crypto";

if (typeof crypto === "undefined") {
    // @ts-ignore
    global.crypto = webcrypto;
}

import { createApp } from "./app";

const port = process.env.PORT || 3101;

(async () => {
    const app = await createApp();

    app.listen(port, () => {
        console.log(
            `OPAQUE express server is listening to port ${port} with env: ${process.env.NODE_ENV}`
        );
    });
})();
