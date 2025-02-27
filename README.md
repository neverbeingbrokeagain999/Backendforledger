# Ledger Master API

This is the backend API for the Ledger Master application. It provides endpoints for managing ledger entries.

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Create a `.env` file with the following variables:
   ```
   DB_USER=sa
   DB_PASSWORD=vision@123
   DB_NAME=test
   DB_SERVER=103.174.102.135
   PORT=3000
   ```

3. Start the server:
   ```
   npm start
   ```

## API Endpoints

### Ledger Entries

- **GET /api/ledger** - Get all ledger entries
- **GET /api/ledger/:id** - Get a single ledger entry by ID
- **POST /api/ledger** - Create a new ledger entry
- **PUT /api/ledger/:id** - Update a ledger entry
- **DELETE /api/ledger/:id** - Delete a ledger entry (soft delete)

## Database Schema

The API uses MS SQL Server with the following schema:

```sql
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
```
