require('dotenv').config();
const { initDatabase, initAdminUser } = require('./lib/db');

console.log('Starting admin user setup...');

// Check if required environment variables are set
if (!process.env.ADMIN_USERNAME || !process.env.ADMIN_PASSWORD) {
    console.error('Error: ADMIN_USERNAME and ADMIN_PASSWORD must be set in .env file');
    process.exit(1);
}

// Check if database credentials are set
if (!process.env.DB_USER || !process.env.DB_PASSWORD) {
    console.error('Error: DB_USER and DB_PASSWORD must be set in .env file');
    process.exit(1);
}

console.log('Environment variables loaded successfully');

// Initialize database and admin user
initDatabase()
    .then(() => {
        console.log('Database initialization completed');
        return initAdminUser();
    })
    .then(() => {
        console.log('Admin user setup completed successfully');
        process.exit(0);
    })
    .catch((error) => {
        console.error('Error during setup:', error);
        process.exit(1);
    }); 