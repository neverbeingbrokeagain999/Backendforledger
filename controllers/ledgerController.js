const { pool } = require('../db');

// Get all ledger entries
exports.getLedgerEntries = async (req, res) => {
  try {
    const result = await pool.request().query(`
      SELECT * FROM ledger_entries 
      WHERE isActive = 1
      ORDER BY createdAt DESC
    `);

    res.status(200).json(result.recordset);
  } catch (error) {
    console.error('Error getting ledger entries:', error);
    res.status(500).json({ error: 'Failed to retrieve ledger entries' });
  }
};

// Get a single ledger entry by ID
exports.getLedgerEntryById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.request()
      .input('id', id)
      .query(`
        SELECT * FROM ledger_entries 
        WHERE id = @id AND isActive = 1
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'Ledger entry not found' });
    }

    res.status(200).json(result.recordset[0]);
  } catch (error) {
    console.error('Error getting ledger entry by ID:', error);
    res.status(500).json({ error: 'Failed to retrieve ledger entry' });
  }
};

// Create a new ledger entry
exports.createLedgerEntry = async (req, res) => {
  try {
    const {
      ledgerName,
      printName,
      ledgerType,
      address1,
      address2,
      address3,
      state,
      pinCode,
      gstNumber,
      contact,
      mobileNumber,
      phoneNumber,
      email,
      openingBalance,
      balanceType
    } = req.body;

    // Validate required fields
    if (!ledgerName) {
      return res.status(400).json({ error: 'Ledger name is required' });
    }

    // Insert the data
    const result = await pool.request()
      .input('ledgerName', ledgerName)
      .input('printName', printName || ledgerName)
      .input('ledgerType', ledgerType || '')
      .input('address1', address1 || '')
      .input('address2', address2 || '')
      .input('address3', address3 || '')
      .input('state', state || '')
      .input('pinCode', pinCode || '')
      .input('gstNumber', gstNumber || '')
      .input('contact', contact || '')
      .input('mobileNumber', mobileNumber || '')
      .input('phoneNumber', phoneNumber || '')
      .input('email', email || '')
      .input('openingBalance', parseFloat(openingBalance) || 0)
      .input('balanceType', balanceType || 'Dr')
      .query(`
        INSERT INTO ledger_entries (
          ledgerName, printName, ledgerType, address1, address2, address3,
          state, pinCode, gstNumber, contact, mobileNumber, phoneNumber,
          email, openingBalance, balanceType
        ) VALUES (
          @ledgerName, @printName, @ledgerType, @address1, @address2, @address3,
          @state, @pinCode, @gstNumber, @contact, @mobileNumber, @phoneNumber,
          @email, @openingBalance, @balanceType
        );
        SELECT SCOPE_IDENTITY() AS id;
      `);

    const id = result.recordset[0].id;
    
    res.status(201).json({ 
      success: true, 
      id, 
      message: 'Ledger entry created successfully' 
    });
  } catch (error) {
    console.error('Error creating ledger entry:', error);
    res.status(500).json({ error: 'Failed to create ledger entry' });
  }
};

// Update a ledger entry
exports.updateLedgerEntry = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Validate if entry exists
    const checkResult = await pool.request()
      .input('id', id)
      .query('SELECT id FROM ledger_entries WHERE id = @id AND isActive = 1');

    if (checkResult.recordset.length === 0) {
      return res.status(404).json({ error: 'Ledger entry not found' });
    }

    // Build the SET clause dynamically
    const updateFields = [];
    const request = pool.request().input('id', id);

    Object.keys(updateData).forEach(key => {
      if (key !== 'id' && key !== 'isActive' && key !== 'createdAt') {
        if (key === 'openingBalance') {
          request.input(key, parseFloat(updateData[key]) || 0);
        } else {
          request.input(key, updateData[key]);
        }
        updateFields.push(`${key} = @${key}`);
      }
    });

    if (updateFields.length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }

    // Update the data
    const result = await request.query(`
      UPDATE ledger_entries 
      SET ${updateFields.join(', ')}
      WHERE id = @id
    `);

    res.status(200).json({ 
      success: true, 
      rowsAffected: result.rowsAffected[0],
      message: 'Ledger entry updated successfully' 
    });
  } catch (error) {
    console.error('Error updating ledger entry:', error);
    res.status(500).json({ error: 'Failed to update ledger entry' });
  }
};

// Delete a ledger entry (soft delete)
exports.deleteLedgerEntry = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate if entry exists
    const checkResult = await pool.request()
      .input('id', id)
      .query('SELECT id FROM ledger_entries WHERE id = @id AND isActive = 1');

    if (checkResult.recordset.length === 0) {
      return res.status(404).json({ error: 'Ledger entry not found' });
    }

    // Soft delete by setting isActive to 0
    const result = await pool.request()
      .input('id', id)
      .query(`
        UPDATE ledger_entries 
        SET isActive = 0
        WHERE id = @id
      `);

    res.status(200).json({ 
      success: true, 
      rowsAffected: result.rowsAffected[0],
      message: 'Ledger entry deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting ledger entry:', error);
    res.status(500).json({ error: 'Failed to delete ledger entry' });
  }
};
