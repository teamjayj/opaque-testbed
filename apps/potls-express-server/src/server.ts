import { createApp, isLoadTestingEnvironment } from "./app";
import { parse } from "papaparse";
import { createReadStream } from "fs";
import { PotlsHashedCredential } from "./types";

const port = process.env.PORT || 8000;

const userDatabase: Map<string, string> = new Map();

if (isLoadTestingEnvironment()) {
    parse(createReadStream("data/potls-server-store.csv"), {
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
}

createApp(userDatabase).listen(port, () => {
    console.log(
        `PoTLS express server is listening to port ${port} with env: ${process.env.NODE_ENV}`
    );
});
