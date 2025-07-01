require('dotenv').config();
const mysql = require('mysql2/promise');

async function testConnection(port) {
    console.log(`\nTesting connection on port ${port}...`);

    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            port: port,
            connectTimeout: 10000,
            enableKeepAlive: true,
            keepAliveInitialDelay: 10000
        });

        console.log(`✅ Successfully connected on port ${port}`);
        await connection.end();
        return true;
    } catch (error) {
        console.error(`❌ Failed to connect on port ${port}:`, error.message);
        return false;
    }
}

async function main() {
    console.log('Testing database connection...');
    console.log('Connection details:', {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        database: process.env.DB_NAME
    });

    // Try different ports
    const ports = [3306, 3307, 3308];
    let connected = false;

    for (const port of ports) {
        if (await testConnection(port)) {
            connected = true;
            console.log(`\n✅ Found working port: ${port}`);
            console.log('Please update your .env file with:');
            console.log(`DB_PORT=${port}`);
            break;
        }
    }

    if (!connected) {
        console.log('\n❌ Could not connect to the database on any port.');
        console.log('Please check:');
        console.log('1. Your database credentials are correct');
        console.log('2. The database host is correct');
        console.log('3. Your IP is whitelisted');
        console.log('4. The database service is running');
    }
}

main().catch(console.error); 