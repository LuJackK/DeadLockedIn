const express = require('express');
const router = express.Router();
const db = require('../DB/DBconn');

// Get all items
router.get('/', async (req, res) => {
  try {
    const items = await db.getItemAll();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get item by ID
router.get('/:id', async (req, res) => {
  try {
    const item = await db.getItemById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Item not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
