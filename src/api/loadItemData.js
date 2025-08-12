const axios = require('axios');
const db = require('../DB/DBconn');

async function loadItemData() {
  try {
    // Fetch all items from public API
    const itemsRes = await axios.get('https://assets.deadlock-api.com/v2/items');
    const itemsData = itemsRes.data;
    for (const item of itemsData) {
      if (item.type !== 'item') continue; // Only load items, not abilities
      if (!item.shop_image) continue; // Only load items with shop_image
      // Prepare builds_into as a comma-separated string if it's an array
      const buildsInto = Array.isArray(item.builds_into) ? item.builds_into.join(',') : (item.builds_into || '');
      await db.addItem(
        item.name || '',
        item.description?.desc,
        item.item_tier || '',
        item.item_slot_type || '',
        'null',
        item.shop_image || ''
      );
      console.log(`Inserted item: ${item.name}`);
    }
    console.log('All items loaded into local DB.');
  } catch (err) {
    console.error('Error loading item data:', err);
  }
}

if (require.main === module) {
  loadItemData();
}

module.exports = loadItemData;
