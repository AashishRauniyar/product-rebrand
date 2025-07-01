import { dropTables, initDatabase, addTestData } from "./lib/db";

async function resetDatabase() {
  try {
    console.log("Dropping tables...");
    await dropTables();

    console.log("Initializing database...");
    await initDatabase();

    console.log("Adding test data...");
    await addTestData();

    console.log("Database reset complete!");
    process.exit(0);
  } catch (error) {
    console.error("Error resetting database:", error);
    process.exit(1);
  }
}

resetDatabase();
