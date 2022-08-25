import { top100Passwords, randomUserNames } from "users-and-passwords";
import { createObjectCsvWriter } from "csv-writer";
import { hash } from "bcrypt";

const clientCsv = createObjectCsvWriter({
  path: "./data/potls-client-login-register.csv",
  header: [
    { id: "userId", title: "user_id" },
    { id: "plaintextPassword", title: "plaintext_password" },
  ],
});

const serverCsv = createObjectCsvWriter({
  path: "./data/potls-server-store.csv",
  header: [
    { id: "userId", title: "user_id" },
    { id: "hashedPassword", title: "hashed_password" },
  ],
});

type PotlsPlaintextCredential = { userId: string; plaintextPassword: string };
type PotlsHashedCredential = { userId: string; hashedPassword: string };

const clientRecords: PotlsPlaintextCredential[] = [];
const serverRecords: PotlsHashedCredential[] = [];

const generateRecords = async (saltRounds: number) => {
  for (let userIndex = 0; userIndex < randomUserNames.length; userIndex++) {
    const userId = randomUserNames[userIndex];
    const plaintextPassword = top100Passwords[userIndex];
    const hashedPassword = await hash(plaintextPassword, saltRounds);

    clientRecords.push({
      userId,
      plaintextPassword,
    });

    serverRecords.push({
      userId,
      hashedPassword,
    });
  }
};

(async () => {
  await generateRecords(10);
  await clientCsv.writeRecords(clientRecords);
  await serverCsv.writeRecords(serverRecords);
})();
