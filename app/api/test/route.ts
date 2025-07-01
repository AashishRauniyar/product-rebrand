import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET() {
  let connection;
  try {
    console.log("Testing database connection...");
    connection = await db.getConnection();
    console.log("Database connection successful");

    // Test query
    const [result] = await connection.query("SELECT 1 as test");
    console.log("Test query result:", result);

    return NextResponse.json({
      status: "ok",
      message: "Database connection successful",
    });
  } catch (error: any) {
    console.error("Database connection test failed:", error);
    console.error("Error details:", {
      message: error.message,
      code: error.code,
      errno: error.errno,
      sqlState: error.sqlState,
      sqlMessage: error.sqlMessage,
    });
    return NextResponse.json(
      { error: "Database connection failed", details: error.message },
      { status: 500 }
    );
  } finally {
    if (connection) {
      connection.release();
    }
  }
}
