import {
  OpaqueClientDriver,
  OpaqueServerDriver,
  uint8ArrayToHexString,
} from "@teamjayj/opaque-core";
import { Credential, CredentialConfig } from "./types";

export class CredentialGenerator {
  private client: OpaqueClientDriver;
  private server: OpaqueServerDriver;

  private userId: string;
  private plaintextPassword: string;
  private serverId: string;

  constructor({
    userId,
    plaintextPassword,
    serverId,
    client,
    server,
  }: CredentialConfig) {
    this.userId = userId;
    this.plaintextPassword = plaintextPassword;
    this.serverId = serverId;
    this.client = client;
    this.server = server;
  }

  public async generate(): Promise<Credential> {
    const {
      client: { init: registerInit, finish: registerFinish },
      server: { credentialFile },
    } = await this.register(
      this.userId,
      this.plaintextPassword,
      this.serverId,
      this.client,
      this.server
    );

    const {
      client: { init: authInit, finish: authFinish, sessionKey },
      server: { expectedAuthResult },
    } = await this.login(
      this.userId,
      this.plaintextPassword,
      this.serverId,
      this.client,
      this.server,
      credentialFile.deserialized
    );

    return {
      client: {
        registerInit,
        registerFinish,
        authInit,
        authFinish,
        sessionKey,
      },
      server: {
        credentialFile: credentialFile.serialized,
        expectedAuthResult,
      },
    };
  }

  private async register(
    userId: string,
    plaintextPassword: string,
    serverId: string,
    client: OpaqueClientDriver,
    server: OpaqueServerDriver
  ): Promise<{
    client: {
      init: string;
      finish: string;
    };
    server: {
      credentialFile: {
        deserialized: Uint8Array;
        serialized: string;
      };
    };
  }> {
    const registrationRequest = await client.registerInit(plaintextPassword);

    const credentialId = userId;

    const registrationResponse = await server.registerInit(
      registrationRequest,
      credentialId
    );

    const registrationRecord = await client.registerFinish(
      registrationResponse,
      userId,
      serverId
    );

    const credentialFile = await server.registerFinish(
      registrationRecord,
      credentialId,
      userId
    );

    return {
      client: {
        init: uint8ArrayToHexString(registrationRequest),
        finish: uint8ArrayToHexString(registrationRecord),
      },
      server: {
        credentialFile: {
          deserialized: credentialFile,
          serialized: uint8ArrayToHexString(credentialFile),
        },
      },
    };
  }

  private async login(
    userId: string,
    plaintextPassword: string,
    serverId: string,
    client: OpaqueClientDriver,
    server: OpaqueServerDriver,
    credentialFile: Uint8Array
  ): Promise<{
    client: {
      init: string;
      finish: string;
      sessionKey: string;
    };
    server: { expectedAuthResult: string };
  }> {
    const authRequest = await client.authInit(plaintextPassword);

    const { expectedAuthResult, serverResponse: authResponse } =
      await server.authInit(authRequest, credentialFile);

    const { sessionKey: clientSessionKey, clientRequest: authFinishRequest } =
      await client.authFinish(authResponse, userId, serverId);

    await server.authFinish(authFinishRequest, expectedAuthResult);

    return {
      client: {
        init: uint8ArrayToHexString(authRequest),
        finish: uint8ArrayToHexString(authFinishRequest),
        sessionKey: uint8ArrayToHexString(clientSessionKey),
      },
      server: {
        expectedAuthResult: uint8ArrayToHexString(expectedAuthResult),
      },
    };
  }
}
