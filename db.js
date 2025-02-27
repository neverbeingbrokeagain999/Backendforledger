require('dotenv').config();
const sql = require('mssql');

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  server: process.env.DB_SERVER,
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  },
  options: {
    encrypt: false, // for azure
    trustServerCertificate: true // change to true for local dev / self-signed certs
  }
};

// Create a connection pool
const pool = new sql.ConnectionPool(config);
const poolConnect = pool.connect();

// Handle connection errors
poolConnect.catch(err => {
  console.error('Error connecting to database:', err);
});

// Initialize the database
async function initializeDatabase() {
  try {
    await poolConnect;
    
    // Create the ledger entries table if it doesn't exist
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='ledger_entries' AND xtype='U')
      CREATE TABLE ledger_entries (
        id INT IDENTITY(1,1) PRIMARY KEY,
        ledgerName NVARCHAR(255) NOT NULL,
        printName NVARCHAR(255),
        ledgerType NVARCHAR(100),
        address1 NVARCHAR(255),
        address2 NVARCHAR(255),
        address3 NVARCHAR(255),
        state NVARCHAR(100),
        pinCode NVARCHAR(20),
        gstNumber NVARCHAR(50),
        contact NVARCHAR(100),
        mobileNumber NVARCHAR(20),
        phoneNumber NVARCHAR(20),
        email NVARCHAR(100),
        openingBalance DECIMAL(18, 2),
        balanceType NVARCHAR(10),
        isActive BIT DEFAULT 1,
        createdAt DATETIME DEFAULT GETDATE()
      )
    `);
    
    console.log('Database initialized successfully');
    return true;
  } catch (error) {
    console.error('Error initializing database:', error);
    return false;
  }
}

module.exports = { pool, initializeDatabase };
