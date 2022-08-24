import { OpaqueClientDriver, OpaqueServerDriver } from "@teamjayj/opaque-core";

export type CredentialConfig = {
  userId: string;
  plaintextPassword: string;
  serverId: string;
  client: OpaqueClientDriver;
  server: OpaqueServerDriver;
};

export type Credential = {
  client: {
    registerInit: string;
    registerFinish: string;
    authInit: string;
    authFinish: string;
    sessionKey: string;
  };

  server: {
    credentialFile: string;
    expectedAuthResult: string;
  };
};

export type OpaqueClientRegisterRecord = {
  userId: string;
  registerInit: string;
  registerFinish: string;
};

export type OpaqueClientAuthRecord = {
  userId: string;
  sessionId: string;
  authInit: string;
  authFinish: string;
  sessionKey: string;
};

export type OpaqueServerRecord = {
  userId: string;
  sessionId: string;
  credentialFile: string;
  expectedAuthKey: string;
};
