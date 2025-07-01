require('dotenv').config();
const mysql = require('mysql2/promise');

async function testConnection() {
    console.log('Testing database connection...');
    console.log('Connection details:', {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT || 3306,
    });

    try {
        console.log('Creating connection...');
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
            connectTimeout: 30000,
            ssl: process.env.DB_SSL === "true" ? {
                rejectUnauthorized: false
            } : undefined
        });

        console.log('Connection successful!');
        console.log('Executing test query...');
        const [rows] = await connection.query('SELECT 1');
        console.log('Test query result:', rows);

        console.log('Testing users table...');
        const [users] = await connection.query('SELECT * FROM users');
        console.log('Users in database:', users);

        await connection.end();
        console.log('Connection closed successfully');
    } catch (error) {
        console.error('Connection failed with error:', error);
        console.error('Error details:', {
            code: error.code,
            errno: error.errno,
            sqlState: error.sqlState,
            sqlMessage: error.sqlMessage
        });

        if (error.code === 'ETIMEDOUT') {
            console.error('Connection timed out. Please check:');
            console.error('1. Database host is correct');
            console.error('2. Port is correct');
            console.error('3. Firewall settings');
            console.error('4. Network connectivity');
        } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
            console.error('Access denied. Please check:');
            console.error('1. Username is correct');
            console.error('2. Password is correct');
            console.error('3. User has proper permissions');
        } else if (error.code === 'ECONNREFUSED') {
            console.error('Connection refused. Please check:');
            console.error('1. Database server is running');
            console.error('2. Port is correct');
            console.error('3. IP is whitelisted');
        }
    }
}

testConnection(); 