import { OpaqueCloudflareClientDriver } from "@teamjayj/opaque-cloudflare-driver";
import { OpaqueCipherSuite, OpaqueServerDriver } from "@teamjayj/opaque-core";
import { CredentialGenerator } from "./credential-generator";
import { Credential } from "./types";

export const generateCredential = async (
  userId: string,
  plaintextPassword: string,
  cipherSuite: OpaqueCipherSuite,
  serverId: string,
  server: OpaqueServerDriver
): Promise<Credential> => {
  const client = new OpaqueCloudflareClientDriver(cipherSuite);
  await client.initialize();

  const credentialGenerator = new CredentialGenerator({
    userId,
    plaintextPassword,
    serverId,
    client,
    server,
  });

  return credentialGenerator.generate();
};
