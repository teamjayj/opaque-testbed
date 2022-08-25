import { OpaqueCloudflareServerDriver } from "@teamjayj/opaque-cloudflare-driver";
import { OpaqueCipherSuite } from "@teamjayj/opaque-core";
import { top100Passwords, randomUserNames } from "users-and-passwords";
import {
  OpaqueClientAuthRecord,
  OpaqueClientRegisterRecord,
  OpaqueServerRecord,
} from "./types";
import { generateCredential } from "./util";
import { createObjectCsvWriter } from "csv-writer";
import { v4 as uuidv4 } from "uuid";
import { webcrypto } from "crypto";

if (typeof crypto === "undefined") {
  // @ts-ignore
  global.crypto = webcrypto;
}

const serverId = "server-id";
const cipherSuite = OpaqueCipherSuite.P256_SHA256;
const server = new OpaqueCloudflareServerDriver(serverId, cipherSuite);

const clientRegisterCsv = createObjectCsvWriter({
  path: "./data/opaque-client-register.csv",
  header: [
    { id: "userId", title: "user_id" },
    { id: "plaintextPassword", title: "plaintext_password" },
    { id: "registerInit", title: "register_init" },
    { id: "registerFinish", title: "register_finish" },
  ],
});

const clientLoginCsv = createObjectCsvWriter({
  path: "./data/opaque-client-login.csv",
  header: [
    { id: "userId", title: "user_id" },
    { id: "sessionId", title: "session_id" },
    { id: "authInit", title: "auth_init" },
    { id: "authFinish", title: "auth_finish" },
    { id: "sessionKey", title: "session_key" },
  ],
});

const serverStoreCsv = createObjectCsvWriter({
  path: "./data/opaque-server-store.csv",
  header: [
    { id: "userId", title: "user_id" },
    { id: "sessionId", title: "session_id" },
    { id: "credentialFile", title: "credential_file" },
    { id: "expectedAuthKey", title: "expected_auth_key" },
  ],
});

const clientRegisterRecords: OpaqueClientRegisterRecord[] = [];
const clientAuthRecords: OpaqueClientAuthRecord[] = [];
const serverRecords: OpaqueServerRecord[] = [];

(async () => {
  await server.initialize();

  for (let userIndex = 0; userIndex < randomUserNames.length; userIndex++) {
    const userId = randomUserNames[userIndex];
    const plaintextPassword = top100Passwords[userIndex];
    const sessionId = uuidv4();

    const { client: clientCredentials, server: serverStore } =
      await generateCredential(
        userId,
        plaintextPassword,
        cipherSuite,
        serverId,
        server
      );

    clientRegisterRecords.push({
      userId,
      registerInit: clientCredentials.registerInit,
      registerFinish: clientCredentials.registerFinish,
    });

    clientAuthRecords.push({
      userId,
      sessionId,
      authInit: clientCredentials.authInit,
      authFinish: clientCredentials.authFinish,
      sessionKey: clientCredentials.sessionKey,
    });

    serverRecords.push({
      userId,
      sessionId,
      credentialFile: serverStore.credentialFile,
      expectedAuthKey: serverStore.expectedAuthResult,
    });

    break;
  }

  await clientRegisterCsv.writeRecords(clientRegisterRecords);
  await clientLoginCsv.writeRecords(clientAuthRecords);
  await serverStoreCsv.writeRecords(serverRecords);
})();
