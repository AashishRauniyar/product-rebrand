import { NextResponse } from "next/server";
import { dropTables, initDatabase, addTestData } from "@/lib/db";

export async function POST() {
  try {
    console.log("API: Starting database reset...");
    console.log("API: Dropping tables...");
    await dropTables();
    console.log("API: Tables dropped.");

    console.log("API: Initializing database...");
    await initDatabase();
    console.log("API: Database initialized.");

    console.log("API: Adding test data...");
    await addTestData();
    console.log("API: Test data added.");

    console.log("API: Database reset complete!");
    return NextResponse.json({ message: "Database reset complete!" });
  } catch (error) {
    console.error("API: Error resetting database:", error);
    return NextResponse.json(
      { error: "Failed to reset database" },
      { status: 500 }
    );
  }
}
