const express = require('express');
const router = express.Router();
const ledgerController = require('../controllers/ledgerController');

// GET all ledger entries
router.get('/', ledgerController.getLedgerEntries);

// GET a single ledger entry
router.get('/:id', ledgerController.getLedgerEntryById);

// POST create a new ledger entry
router.post('/', ledgerController.createLedgerEntry);

// PUT update a ledger entry
router.put('/:id', ledgerController.updateLedgerEntry);

// DELETE a ledger entry (soft delete)
router.delete('/:id', ledgerController.deleteLedgerEntry);

module.exports = router;
