const axios = require('axios');
const db = require('../DB/DBconn');

async function loadHeroData() {
  try {
    // Fetch all heroes and abilities from public API
    const heroesRes = await axios.get('https://assets.deadlock-api.com/v2/heroes');
    const abilitiesRes = await axios.get('https://assets.deadlock-api.com/v2/items');
    const heroesData = heroesRes.data;
    const abilitiesData = abilitiesRes.data;
    for (const hero of Object.values(heroesData)) {
      if (hero.disabled === true) continue;
      // Get up to 4 abilities for this hero
      let heroAbilities = [];
      if (Array.isArray(abilitiesData)) {
        heroAbilities = abilitiesData.filter(item => item.hero === hero.id && item.type === 'ability' && item.ability_type === 'signature');
      }
      // Map ability descriptions and images
      const abilityDescs = [heroAbilities[0]?.description.quip, heroAbilities[1]?.description.quip, heroAbilities[2]?.description.quip, heroAbilities[3]?.description.quip];
      const abilityImgs = [heroAbilities[0]?.image , heroAbilities[1]?.image,  heroAbilities[2]?.image, heroAbilities[3]?.image];
      // Insert each hero into local DB
      await db.addHero(
        hero.id,
        hero.name,
        hero.description.lore|| '',
        hero.description.playstyle || '',
        abilityDescs[0],
        abilityDescs[1],
        abilityDescs[2],
        abilityDescs[3],
        hero.images?.icon_hero_card || '',
        abilityImgs[0],
        abilityImgs[1],
        abilityImgs[2],
        abilityImgs[3]
      );
      console.log(`Inserted hero: ${hero.name}`);
    }
    console.log('All heroes loaded into local DB.');
  } catch (err) {
    console.error('Error loading hero data:', err);
  }
}

if (require.main === module) {
  loadHeroData();
}

module.exports = loadHeroData;
