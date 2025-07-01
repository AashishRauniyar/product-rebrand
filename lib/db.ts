import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";

// Create a connection pool with more detailed configuration
const createConnectionPool = () => {
  const config = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    connectTimeout: 60000, // Increased timeout for cloud databases
    enableKeepAlive: true,
    keepAliveInitialDelay: 10000,
    multipleStatements: true,
    dateStrings: true,
    timezone: "Z",
    // Enable SSL for cloud databases (helps with authentication)
    ...(process.env.DB_SSL !== 'false' && {
      ssl: {
        rejectUnauthorized: false
      }
    })
  };

  return mysql.createPool(config);
};

const pool = createConnectionPool();

// Create an alternative pool for authentication plugin issues
const createAlternativePool = () => {
  const config = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 5,
    queueLimit: 0,
    connectTimeout: 30000,
    enableKeepAlive: true,
    keepAliveInitialDelay: 5000,
    dateStrings: true,
    timezone: "Z",
    // Force SSL for cloud databases
    ssl: {
      rejectUnauthorized: false
    }
  };

  return mysql.createPool(config);
};

let alternativePool: mysql.Pool | null = null;

// Test the connection with more detailed error handling
console.log("Database connection configuration:", {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  hasPassword: !!process.env.DB_PASSWORD,
});

// Test the connection with fallback mechanism
const testConnection = async () => {
  try {
    console.log("Testing primary database connection...");
    const connection = await pool.getConnection();
    
    try {
      // Test the connection with a simple query
      const [result] = await connection.query("SELECT 1 as test");
      console.log("Primary connection test successful:", result);

      // Check if we can access the database
      if (process.env.DB_NAME) {
        await connection.query(`USE ${process.env.DB_NAME}`);
        console.log(`Successfully connected to database: ${process.env.DB_NAME}`);
      }

      connection.release();
      console.log("Primary connection released successfully");

      // Initialize database and tables
      await initDatabase();
    } catch (error) {
      connection.release();
      console.error("Error during primary connection test:", error);
      throw error;
    }
  } catch (err: any) {
    console.error("Primary database connection failed:", err);
    console.error("Connection details:", {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT || 3306,
    });

    // Check if it's an authentication plugin error
    if (err.code === "ER_PLUGIN_IS_NOT_LOADED" || err.sqlMessage?.includes("mysql_native_password")) {
      console.log("Authentication plugin error detected. Trying alternative connection...");
      
      try {
        alternativePool = createAlternativePool();
        const altConnection = await alternativePool.getConnection();
        
        try {
          const [result] = await altConnection.query("SELECT 1 as test");
          console.log("Alternative connection successful:", result);
          
          if (process.env.DB_NAME) {
            await altConnection.query(`USE ${process.env.DB_NAME}`);
            console.log(`Successfully connected to database with alternative method: ${process.env.DB_NAME}`);
          }
          
          altConnection.release();
          console.log("Alternative connection will be used for database operations");
          
          // Initialize database with alternative pool
          await initDatabaseWithPool(alternativePool);
        } catch (altError) {
          altConnection.release();
          throw altError;
        }
      } catch (altErr) {
        console.error("Alternative connection also failed:", altErr);
        console.error("Both connection methods failed. Please check:");
        console.error("1. Database credentials are correct");
        console.error("2. Database server is accessible");
        console.error("3. MySQL authentication plugin configuration");
        throw altErr;
      }
    } else {
      // Handle other connection errors
      if (err.code === "ENOTFOUND") {
        console.error("DNS resolution failed. Please check if the hostname is correct and your DNS settings.");
      } else if (err.code === "ETIMEDOUT") {
        console.error("Connection timed out. Please check if the database is accessible and the port is correct.");
      } else if (err.code === "ECONNREFUSED") {
        console.error("Connection refused. Please check if the database is running and accessible.");
      } else if (err.code === "ER_ACCESS_DENIED_ERROR") {
        console.error("Access denied. Please check your username and password.");
      } else if (err.code === "ER_BAD_DB_ERROR") {
        console.error(`Database '${process.env.DB_NAME}' does not exist. Please create it first.`);
      }
      throw err;
    }
  }
};

// Test the connection immediately
testConnection();

// Initialize database tables if they don't exist with a specific pool
export async function initDatabaseWithPool(dbPool: mysql.Pool) {
  try {
    console.log("Initializing database with alternative pool...");

    // Create database if it doesn't exist
    if (process.env.DB_NAME) {
      await dbPool.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
      console.log(`Database ${process.env.DB_NAME} created or already exists`);

      // Use the database
      await dbPool.query(`USE ${process.env.DB_NAME}`);
      console.log(`Using database ${process.env.DB_NAME}`);
    }

    // Create users table
    await dbPool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("Users table created or already exists");

    // Check if admin user exists
    const [users] = await dbPool.query<any[]>(
      "SELECT * FROM users WHERE username = ?",
      [process.env.ADMIN_USERNAME]
    );

    if (!users || users.length === 0) {
      // Create admin user if it doesn't exist
      const hashedPassword = await bcrypt.hash(
        process.env.ADMIN_PASSWORD || "admin123",
        10
      );
      await dbPool.query("INSERT INTO users (username, password) VALUES (?, ?)", [
        process.env.ADMIN_USERNAME || "admin",
        hashedPassword,
      ]);
      console.log("Admin user created successfully");
    } else {
      console.log("Admin user already exists");
    }

    console.log("Database initialization with alternative pool completed successfully");
  } catch (error) {
    console.error("Error initializing database with alternative pool:", error);
    throw error;
  }
}

// Initialize database tables if they don't exist
export async function initDatabase() {
  try {
    console.log("Initializing database...");

    // Create database if it doesn't exist
    if (process.env.DB_NAME) {
      await pool.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
      console.log(`Database ${process.env.DB_NAME} created or already exists`);

      // Use the database
      await pool.query(`USE ${process.env.DB_NAME}`);
      console.log(`Using database ${process.env.DB_NAME}`);
    }

    // Create users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("Users table created or already exists");

    // Check if admin user exists
    const [users] = await pool.query<any[]>(
      "SELECT * FROM users WHERE username = ?",
      [process.env.ADMIN_USERNAME]
    );

    if (!users || users.length === 0) {
      // Create admin user if it doesn't exist
      const hashedPassword = await bcrypt.hash(
        process.env.ADMIN_PASSWORD || "admin123",
        10
      );
      await pool.query("INSERT INTO users (username, password) VALUES (?, ?)", [
        process.env.ADMIN_USERNAME || "admin",
        hashedPassword,
      ]);
      console.log("Admin user created successfully");
    } else {
      console.log("Admin user already exists");
    }

    console.log("Database initialization completed successfully");
  } catch (error) {
    console.error("Error initializing database:", error);
    throw error;
  }
}

// Add test data if tables are empty
export async function addTestData() {
  const connection = await pool.getConnection();
  try {
    console.log("Adding test data...");
    await connection.query(`
      INSERT INTO products (
        product_id, name, slug, paragraph, bullet_points, redirect_link, generated_link, product_image
      ) VALUES (
        'TEST001',
        'Test Product',
        'test-product',
        'This is a test product description paragraph.',
        '["Point 1", "Point 2", "Point 3"]',
        'https://example.com/redirect',
        '${
          process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
        }/preview/test-product',
        'test-product.jpg'
      )
    `);
    console.log("Test data added successfully");
  } catch (error) {
    console.error("Error adding test data:", error);
    throw error;
  } finally {
    connection.release();
  }
}

// Drop all tables
export async function dropTables() {
  const connection = await pool.getConnection();
  try {
    console.log("Dropping tables...");
    await connection.query("DROP TABLE IF EXISTS visits");
    await connection.query("DROP TABLE IF EXISTS product_themes");
    await connection.query("DROP TABLE IF EXISTS why_choose");
    await connection.query("DROP TABLE IF EXISTS ingredients");
    await connection.query("DROP TABLE IF EXISTS products");
    console.log("Tables dropped successfully");
  } catch (error) {
    console.error("Error dropping tables:", error);
    throw error;
  } finally {
    connection.release();
  }
}

// Export the appropriate pool based on which one is working
export function getPool() {
  return alternativePool || pool;
}

export default pool;
