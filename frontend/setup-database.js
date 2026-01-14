const { Client, Databases } = require("node-appwrite");
const fs = require("fs");
const path = require("path");

// Simple .env file reader
function loadEnv() {
  const envPath = path.join(__dirname, ".env");
  const envFile = fs.readFileSync(envPath, "utf8");
  const env = {};

  envFile.split("\n").forEach((line) => {
    const [key, value] = line.split("=");
    if (key && value) {
      env[key.trim()] = value.trim().replace(/"/g, "");
    }
  });

  return env;
}

const env = loadEnv();

// Create client with proper configuration for Appwrite SDK
const client = new Client()
  .setEndpoint(env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
  .setProject(env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
  .setKey(env.APPWRITE_API_KEY);

console.log("✅ Client configured successfully");

const databases = new Databases(client);

async function setupDatabase() {
  const databaseId = env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;

  try {
    console.log("Creating collections if they don't exist...");

    // Create knowledge_base collection
    try {
      await databases.createCollection(
        databaseId,
        "knowledge_base",
        "Knowledge Base",
        [],
        false
      );
      console.log("✅ knowledge_base collection created");
    } catch (error) {
      if (error.message.includes("already exists")) {
        console.log("⚠️ knowledge_base collection already exists");
      } else {
        console.log(
          "knowledge_base collection might already exist, continuing..."
        );
      }
    }

    // Create conversations collection
    try {
      await databases.createCollection(
        databaseId,
        "conversations",
        "Conversations",
        [],
        false
      );
      console.log("✅ conversations collection created");
    } catch (error) {
      if (error.message.includes("already exists")) {
        console.log("⚠️ conversations collection already exists");
      } else {
        console.log(
          "conversations collection might already exist, continuing..."
        );
      }
    }

    // Wait a moment for collections to be ready
    await new Promise((resolve) => setTimeout(resolve, 2000));

    console.log("Setting up knowledge_base collection attributes...");

    // Create attributes for knowledge_base collection
    await databases.createStringAttribute(
      databaseId,
      "knowledge_base",
      "title",
      255,
      true
    );
    await databases.createStringAttribute(
      databaseId,
      "knowledge_base",
      "content",
      65535,
      true
    );
    await databases.createStringAttribute(
      databaseId,
      "knowledge_base",
      "summary",
      1000,
      false
    );
    await databases.createStringAttribute(
      databaseId,
      "knowledge_base",
      "projectId",
      100,
      true
    );
    await databases.createStringAttribute(
      databaseId,
      "knowledge_base",
      "category",
      50,
      true
    );
    await databases.createStringAttribute(
      databaseId,
      "knowledge_base",
      "createdAt",
      50,
      true
    );
    await databases.createStringAttribute(
      databaseId,
      "knowledge_base",
      "updatedAt",
      50,
      true
    );

    // Wait a bit for attributes to be created
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Create index for projectId
    await databases.createIndex(
      databaseId,
      "knowledge_base",
      "projectId_index",
      "key",
      ["projectId"]
    );

    console.log("✅ knowledge_base collection setup complete!");

    console.log("Setting up conversations collection attributes...");

    // Create conversations collection attributes
    try {
      await databases.createStringAttribute(
        databaseId,
        "conversations",
        "projectId",
        100,
        true
      );
      await databases.createStringAttribute(
        databaseId,
        "conversations",
        "userId",
        100,
        true
      );
      await databases.createStringAttribute(
        databaseId,
        "conversations",
        "sessionId",
        100,
        true
      );
      await databases.createStringAttribute(
        databaseId,
        "conversations",
        "userMessage",
        10000,
        true
      );
      await databases.createStringAttribute(
        databaseId,
        "conversations",
        "aiResponse",
        10000,
        true
      );
      await databases.createStringAttribute(
        databaseId,
        "conversations",
        "timestamp",
        50,
        true
      );
      await databases.createBooleanAttribute(
        databaseId,
        "conversations",
        "includeKnowledgeBase",
        true
      );

      // Wait a bit for attributes to be created
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Create index for projectId
      await databases.createIndex(
        databaseId,
        "conversations",
        "conversations_projectId_index",
        "key",
        ["projectId"]
      );

      console.log("✅ conversations collection setup complete!");
    } catch (error) {
      if (error.message.includes("already exists")) {
        console.log("⚠️ conversations attributes already exist, skipping...");
      } else {
        console.error(
          "❌ Error setting up conversations collection:",
          error.message
        );
      }
    }

    console.log("🎉 Database setup completed successfully!");
    console.log("You can now use your knowledge base and chat features!");
  } catch (error) {
    if (error.message.includes("already exists")) {
      console.log("⚠️ Attributes already exist, database is already set up!");
    } else {
      console.error("❌ Error setting up database:", error.message);
      console.log("Make sure you have:");
      console.log("1. Added APPWRITE_API_KEY to your .env file");
      console.log("2. Your API key has the correct permissions");
      console.log("3. The database exists in your Appwrite project");
    }
  }
}

setupDatabase();
