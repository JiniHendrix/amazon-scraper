function cost(times) {
  let sum = 0;

  for (let i = 1; i <= times; i++) {
    sum += 3 * i;
  }

  return sum;
}

function unitOrUpgrade(numUnits, numUpgrades, type) {
  const ARMOR = 250;

  const unitStats = {
    marine: {
      UPGRADE: 13,
      BASE_DMG: 115,
    },
    dragoon: {
      UPGRADE: 26,
      BASE_DMG: 210,
    },
  };
  // 25% chance of getting a specific unit
  // 20 minerals per roll
  // about 160 minerals to get both units + 10 to combine so 170 minerals
  // but that's without recycling
  // with recycling if i get it on my 4th roll it takes 50 minerals 20 + 5 + 10 + 15
  // so lets say it takes about 100 minerals to get my desired hero

  // for goon
  const {
    UPGRADE,
    BASE_DMG,
  } = unitStats[type];

  const unitDmg = BASE_DMG + numUpgrades * UPGRADE - ARMOR;
  const upgradeDmg = numUnits * UPGRADE;

  const unitDmgPerMineral = unitDmg / 100;
  const upgradeDmgPerMineral = upgradeDmg / ((numUpgrades * 3) + 3);

  console.log('unit damage per mineral:', unitDmgPerMineral);
  console.log('upgrade damage per mineral: ', upgradeDmgPerMineral);
}

unitOrUpgrade(20, 31, 'marine');
unitOrUpgrade(5, 10, 'dragoon');
