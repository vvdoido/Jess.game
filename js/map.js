

class LevelMap {
  constructor(canvasWidth, canvasHeight) {
    this.width = 7200;
    this.height = canvasHeight || 600;

    this.platforms = [];
    this.destructibles = [];
    this.enemySpawners = [];
    this.powSpawns = [];
    this.slugSpawns = [];
    this.bossSpawn = null;
    this.finalBossSpawn = null;

    this.initLevel();
  }

  initLevel() {
    const H = this.height;





    this.platforms.push({ x: 0, y: H - 80, width: 1280, height: 80, isGround: true, biome: 'tokyo' });


    this.platforms.push({ x: 1280, y: H - 80, width: 1250, height: 80, isGround: true, biome: 'brazil' });


    this.platforms.push({ x: 2530, y: H - 80, width: 1220, height: 80, isGround: true, biome: 'europe' });


    this.platforms.push({ x: 3750, y: H - 80, width: 1450, height: 80, isGround: true, biome: 'egypt' });


    this.platforms.push({ x: 5200, y: H - 80, width: 2000, height: 80, isGround: true, biome: 'newyork' });



    this.platforms.push({ x: 250, y: H - 180, width: 220, height: 18, isGround: false, biome: 'tokyo' });
    this.platforms.push({ x: 550, y: H - 240, width: 260, height: 18, isGround: false, biome: 'tokyo' });
    this.platforms.push({ x: 880, y: H - 190, width: 240, height: 18, isGround: false, biome: 'tokyo' });
    this.platforms.push({ x: 1080, y: H - 280, width: 140, height: 18, isGround: false, biome: 'tokyo' });


    this.platforms.push({ x: 1400, y: H - 180, width: 240, height: 18, isGround: false, biome: 'brazil' });
    this.platforms.push({ x: 1700, y: H - 240, width: 280, height: 18, isGround: false, biome: 'brazil' });
    this.platforms.push({ x: 2050, y: H - 180, width: 260, height: 18, isGround: false, biome: 'brazil' });
    this.platforms.push({ x: 2240, y: H - 275, width: 150, height: 18, isGround: false, biome: 'brazil' });


    this.platforms.push({ x: 2650, y: H - 190, width: 240, height: 18, isGround: false, biome: 'europe' });
    this.platforms.push({ x: 2950, y: H - 260, width: 300, height: 18, isGround: false, biome: 'europe' });
    this.platforms.push({ x: 3320, y: H - 190, width: 240, height: 18, isGround: false, biome: 'europe' });
    this.platforms.push({ x: 3500, y: H - 275, width: 150, height: 18, isGround: false, biome: 'europe' });


    this.platforms.push({ x: 3850, y: H - 210, width: 260, height: 20, isGround: false, biome: 'egypt' });
    this.platforms.push({ x: 4180, y: H - 260, width: 210, height: 20, isGround: false, biome: 'egypt' });
    this.platforms.push({ x: 4480, y: H - 190, width: 180, height: 20, isGround: false, biome: 'egypt' });



    this.platforms.push({ x: 5300, y: H - 170, width: 200, height: 20, isGround: false, biome: 'newyork' });
    this.platforms.push({ x: 5550, y: H - 250, width: 240, height: 20, isGround: false, biome: 'newyork' });
    this.platforms.push({ x: 5850, y: H - 200, width: 180, height: 20, isGround: false, biome: 'newyork' });
    this.platforms.push({ x: 6100, y: H - 290, width: 220, height: 20, isGround: false, biome: 'newyork' });
    this.platforms.push({ x: 6380, y: H - 210, width: 200, height: 20, isGround: false, biome: 'newyork' });
    this.platforms.push({ x: 6650, y: H - 260, width: 250, height: 20, isGround: false, biome: 'newyork' });
    this.platforms.push({ x: 6950, y: H - 190, width: 180, height: 20, isGround: false, biome: 'newyork' });


    this.destructibles = [

      { id: 1, x: 420, y: H - 116, width: 24, height: 36, type: 'barrel', biome: 'tokyo', hp: 20, destroyed: false },
      { id: 2, x: 740, y: H - 116, width: 24, height: 36, type: 'barrel', biome: 'tokyo', hp: 20, destroyed: false },
      { id: 3, x: 300, y: H - 112, width: 32, height: 32, type: 'crate', biome: 'tokyo', hp: 30, destroyed: false },
      { id: 4, x: 620, y: H - 272, width: 32, height: 32, type: 'crate', biome: 'tokyo', hp: 30, destroyed: false },


      { id: 5, x: 1550, y: H - 116, width: 24, height: 36, type: 'barrel', biome: 'brazil', hp: 20, destroyed: false },
      { id: 6, x: 1850, y: H - 116, width: 24, height: 36, type: 'barrel', biome: 'brazil', hp: 20, destroyed: false },
      { id: 7, x: 1480, y: H - 212, width: 32, height: 32, type: 'crate', biome: 'brazil', hp: 30, destroyed: false },


      { id: 8, x: 2750, y: H - 116, width: 24, height: 36, type: 'barrel', biome: 'europe', hp: 20, destroyed: false },
      { id: 9, x: 3100, y: H - 116, width: 24, height: 36, type: 'barrel', biome: 'europe', hp: 20, destroyed: false },
      { id: 10, x: 3450, y: H - 112, width: 32, height: 32, type: 'crate', biome: 'europe', hp: 30, destroyed: false },


      { id: 11, x: 4020, y: H - 116, width: 24, height: 36, type: 'barrel', biome: 'egypt', hp: 20, destroyed: false },
      { id: 12, x: 4330, y: H - 116, width: 24, height: 36, type: 'barrel', biome: 'egypt', hp: 20, destroyed: false },
      { id: 13, x: 4210, y: H - 292, width: 32, height: 32, type: 'crate', biome: 'egypt', hp: 30, destroyed: false },


      { id: 14, x: 5350, y: H - 116, width: 24, height: 36, type: 'barrel', biome: 'newyork', hp: 20, destroyed: false },
      { id: 15, x: 5620, y: H - 116, width: 24, height: 36, type: 'barrel', biome: 'newyork', hp: 20, destroyed: false },
      { id: 16, x: 5760, y: H - 112, width: 32, height: 32, type: 'crate', biome: 'newyork', hp: 30, destroyed: false },
      { id: 17, x: 6000, y: H - 116, width: 24, height: 36, type: 'barrel', biome: 'newyork', hp: 20, destroyed: false },
      { id: 18, x: 6280, y: H - 282, width: 32, height: 32, type: 'crate', biome: 'newyork', hp: 30, destroyed: false },
      { id: 19, x: 6500, y: H - 116, width: 24, height: 36, type: 'barrel', biome: 'newyork', hp: 20, destroyed: false },
      { id: 20, x: 6800, y: H - 116, width: 24, height: 36, type: 'barrel', biome: 'newyork', hp: 20, destroyed: false }
    ];


    this.powSpawns = [
      { x: 340, y: H - 222, reward: 'HMG' },
      { x: 1050, y: H - 122, reward: 'SHOTGUN' },
      { x: 1750, y: H - 282, reward: 'ROCKET' },
      { x: 2850, y: H - 122, reward: 'FLAME' },
      { x: 3500, y: H - 122, reward: 'LASER' },
      { x: 5600, y: H - 292, reward: 'HMG' },
      { x: 6150, y: H - 332, reward: 'ROCKET' }
    ];


    this.slugSpawns = [
      { x: 1600, y: H - 140 },
      { x: 3350, y: H - 140 },
      { x: 5900, y: H - 140 }
    ];


    this.enemySpawners = [

      { x: 450, y: H - 130, type: 'soldier', biome: 'tokyo', triggerX: 100 },
      { x: 600, y: H - 130, type: 'soldier', biome: 'tokyo', triggerX: 150 },
      { x: 700, y: H - 286, type: 'soldier', biome: 'tokyo', triggerX: 250 },
      { x: 800, y: H - 130, type: 'shield', biome: 'tokyo', triggerX: 350 },
      { x: 950, y: 120, type: 'drone', biome: 'tokyo', triggerX: 500 },


      { x: 1450, y: H - 130, type: 'soldier', biome: 'brazil', triggerX: 1100 },
      { x: 1600, y: H - 130, type: 'rocket_trooper', biome: 'brazil', triggerX: 1250 },
      { x: 1800, y: H - 286, type: 'soldier', biome: 'brazil', triggerX: 1450 },
      { x: 1950, y: H - 130, type: 'shield', biome: 'brazil', triggerX: 1600 },
      { x: 2150, y: 130, type: 'drone', biome: 'brazil', triggerX: 1800 },
      { x: 2350, y: H - 130, type: 'rocket_trooper', biome: 'brazil', triggerX: 2000 },


      { x: 2680, y: H - 130, type: 'soldier', biome: 'europe', triggerX: 2350 },
      { x: 2850, y: H - 130, type: 'shield', biome: 'europe', triggerX: 2500 },
      { x: 3050, y: H - 306, type: 'soldier', biome: 'europe', triggerX: 2700 },
      { x: 3200, y: H - 130, type: 'rocket_trooper', biome: 'europe', triggerX: 2850 },
      { x: 3400, y: 130, type: 'drone', biome: 'europe', triggerX: 3050 },
      { x: 3600, y: H - 130, type: 'shield', biome: 'europe', triggerX: 3250 },


      { x: 3850, y: H - 130, type: 'soldier', biome: 'egypt', triggerX: 3450 },
      { x: 3900, y: H - 130, type: 'shield', biome: 'egypt', triggerX: 3500 },
      { x: 4000, y: H - 286, type: 'soldier', biome: 'egypt', triggerX: 3580 },
      { x: 4050, y: H - 130, type: 'soldier', biome: 'egypt', triggerX: 3650 },
      { x: 4150, y: H - 130, type: 'shield', biome: 'egypt', triggerX: 3700 },
      { x: 4200, y: 120, type: 'drone', biome: 'egypt', triggerX: 3750 },
      { x: 4280, y: H - 130, type: 'rocket_trooper', biome: 'egypt', triggerX: 3800 },
      { x: 4350, y: H - 286, type: 'soldier', biome: 'egypt', triggerX: 3850 },
      { x: 4450, y: H - 130, type: 'shield', biome: 'egypt', triggerX: 3900 },
      { x: 4550, y: 120, type: 'drone', biome: 'egypt', triggerX: 3950 },
      { x: 4650, y: H - 130, type: 'rocket_trooper', biome: 'egypt', triggerX: 4000 },
      { x: 4750, y: H - 130, type: 'soldier', biome: 'egypt', triggerX: 4050 },


      { x: 5280, y: H - 130, type: 'soldier', biome: 'newyork', triggerX: 5000 },
      { x: 5350, y: H - 130, type: 'shield', biome: 'newyork', triggerX: 5050 },
      { x: 5420, y: H - 202, type: 'soldier', biome: 'newyork', triggerX: 5100 },
      { x: 5500, y: H - 130, type: 'rocket_trooper', biome: 'newyork', triggerX: 5150 },
      { x: 5600, y: 100, type: 'drone', biome: 'newyork', triggerX: 5200 },
      { x: 5700, y: H - 282, type: 'soldier', biome: 'newyork', triggerX: 5280 },
      { x: 5780, y: H - 130, type: 'shield', biome: 'newyork', triggerX: 5350 },
      { x: 5900, y: H - 232, type: 'rocket_trooper', biome: 'newyork', triggerX: 5450 },
      { x: 6000, y: H - 130, type: 'soldier', biome: 'newyork', triggerX: 5550 },
      { x: 6100, y: H - 130, type: 'shield', biome: 'newyork', triggerX: 5650 },
      { x: 6180, y: 110, type: 'drone', biome: 'newyork', triggerX: 5750 },
      { x: 6250, y: H - 322, type: 'soldier', biome: 'newyork', triggerX: 5850 },
      { x: 6350, y: H - 130, type: 'rocket_trooper', biome: 'newyork', triggerX: 5950 },
      { x: 6450, y: H - 242, type: 'shield', biome: 'newyork', triggerX: 6050 },
      { x: 6550, y: H - 130, type: 'soldier', biome: 'newyork', triggerX: 6150 },
      { x: 6650, y: 100, type: 'drone', biome: 'newyork', triggerX: 6250 },
      { x: 6750, y: H - 292, type: 'rocket_trooper', biome: 'newyork', triggerX: 6350 },
      { x: 6850, y: H - 130, type: 'shield', biome: 'newyork', triggerX: 6450 },
      { x: 6950, y: H - 222, type: 'soldier', biome: 'newyork', triggerX: 6550 },
      { x: 7050, y: H - 130, type: 'rocket_trooper', biome: 'newyork', triggerX: 6650 }
    ];


    this.bossSpawn = { x: 4600, y: H - 320, triggerX: 3950 };





    this.finalBossSpawn = { x: 6800, y: H - 360, triggerX: 6500 };
  }
}
