const express = require('express');
const router = express.Router();
const db = require('../DB/DBconn');

// Get all heroes
router.get('/', async (req, res) => {
  try {
    const heroes = await db.getHeroes();
    res.json(heroes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get hero by ID
router.get('/:id', async (req, res) => {
  try {
    const hero = await db.getHeroById(req.params.id);
    if (!hero) return res.status(404).json({ error: 'Hero not found' });
    res.json(hero);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a new hero
router.post('/', async (req, res) => {
  const { hero_id, hero_name, hero_description, hero_role, ability1_desc, ability2_desc, ability3_desc, ability4_desc, hero_image, ability1_img, ability2_img, ability3_img, ability4_img } = req.body;
  try {
    const result = await db.addHero(hero_id, hero_name, hero_description, hero_role, ability1_desc, ability2_desc, ability3_desc, ability4_desc, hero_image, ability1_img, ability2_img, ability3_img, ability4_img);
    res.json({ success: true, result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
