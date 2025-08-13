const axios = require('axios');
const db = require('../DB/DBconn');

async function loadHeroData() {
  try {
    // Fetch all heroes and abilities from public API
    const heroesRes = await axios.get('https://assets.deadlock-api.com/v2/heroes');
    const abilitiesRes = await axios.get('https://assets.deadlock-api.com/v2/items');
    const heroesData = Object.values(heroesRes.data);
    const abilitiesData = Object.values(abilitiesRes.data);
    console.log(`Fetched ${Object.keys(heroesData).length} heroes and ${abilitiesData.length} abilities from API.`);
    for (const hero of heroesData) {
      if (hero.disabled === true || hero.in_development === true) continue;
      console.log(`Processing hero: ${hero.name}`);
      heroAbilities = abilitiesData.filter(item => item.hero === hero.id && item.type === 'ability' && item.ability_type === 'signature');
      heroUltimate = abilitiesData.filter(item => item.hero === hero.id && item.type === 'ability' && item.ability_type === 'ultimate');
      let heroWeapon = abilitiesData.find(item => item.hero === hero.id && item.type === 'weapon');
     
      await db.addHero(
        hero.id,
        hero.name,
        hero.description.lore, 
        hero.description.role,
        heroAbilities[0].name,
        heroAbilities[1].name,
        heroAbilities[2].name,
        heroUltimate[0].name,
        hero.images.icon_hero_card,
        heroAbilities[0].image,
        heroAbilities[1].image,
        heroAbilities[2].image,
        heroUltimate[0].image,
        heroAbilities[0].description.quip,
        heroAbilities[1].description.quip,
        heroAbilities[2].description.quip,
        heroUltimate[0].description.quip,
        null, // Placeholder for hero weapon name
        hero.shop_stat_display.weapon_stats_display.weapon_image,
        hero.description.playstyle,
        heroAbilities[0].id,
        heroAbilities[1].id,
        heroAbilities[2].id,
        heroUltimate[0].id,
        heroWeapon.id
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
