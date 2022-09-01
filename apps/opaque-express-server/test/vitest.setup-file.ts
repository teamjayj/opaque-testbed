import { webcrypto } from "crypto";

if (typeof crypto === "undefined") {
    // @ts-ignore
    global.crypto = webcrypto;
}
