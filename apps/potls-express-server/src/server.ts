import "dotenv/config";
import { createApp, isLoadTestingEnvironment } from "./app";
import papaparse from "papaparse";
import { createReadStream } from "fs";
import { PotlsHashedCredential } from "./types";
import { appendFile } from "fs/promises";

const port = process.env.PORT || 3100;

const userDatabase: Map<string, string> = new Map();

if (isLoadTestingEnvironment()) {
    papaparse.parse(createReadStream("data/potls-server-store.csv"), {
        header: true,
        step: (result) => {
            const { user_id: username, hashed_password: hashedPassword } =
                result.data as PotlsHashedCredential;
            userDatabase.set(username, hashedPassword);
        },
        complete: () => {
            console.log(
                `Loaded ${userDatabase.size} entries into user database`
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

createApp(userDatabase).listen(port, () => {
    console.log(
        `PoTLS express server is listening to port ${port} with env: ${process.env.NODE_ENV}`
    );
});
