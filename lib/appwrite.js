import { Client, Account, Databases, ID } from "appwrite";

const client = new Client();

// Configure client
client
  .setEndpoint(
    process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT ||
      "https://nyc.cloud.appwrite.io/v1"
  )
  .setProject(
    process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || "685cf091002e2e313766"
  );

export const account = new Account(client);
export const databases = new Databases(client);
export { ID };

export default client;
