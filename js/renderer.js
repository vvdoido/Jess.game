// Motor de Renderização Gráfica Estilizada para "Cyber Slug: Neon Front"
// Cenários da Volta ao Mundo (Tóquio, Brasil, Europa e Egito) & MechaGodzilla HD

class GameRenderer {
  constructor() {
    this.smokeParticles = [];
    this.time = 0;

    // Sprites Oficiais do MechaGodzilla em Alta Definição
    this.mechaSprites = {
      idle: new Image(),
      walk1: new Image(),
      walk2: new Image(),
      stance: new Image(),
      aim: new Image(),
      laser: new Image(),
      loaded: false
    };
    this.mechaSprites.idle.src = 'assets/mecha_idle.png';
    this.mechaSprites.walk1.src = 'assets/mecha_walk1.png';
    this.mechaSprites.walk2.src = 'assets/mecha_walk2.png';
    this.mechaSprites.stance.src = 'assets/mecha_stance.png';
    this.mechaSprites.aim.src = 'assets/mecha_aim.png';
    this.mechaSprites.laser.src = 'assets/mecha_laser.png';
    this.mechaSprites.laser.onload = () => {
      this.mechaSprites.loaded = true;
    };

    // Sprites Oficiais de King Ghidorah (O Dragão Dourado Tricéfalo)
    this.ghidorahSprites = {
      roaring_stand: new Image(),
      fly_1: new Image(),
      fly_2: new Image(),
      fly_3: new Image(),
      front_glide: new Image(),
      walk_1: new Image(),
      walk_2: new Image(),
      gravity_beam: new Image(),
      swoop_1: new Image(),
      battle_pose: new Image(),
      ground_beam_1: new Image(),
      ground_beam_2: new Image(),
      ground_beam_3: new Image(),
      swoop_2: new Image(),
      hit_flip: new Image(),
      energy_burst: new Image(),
      tornado: new Image(),
      crouch_hurt: new Image(),
      dead: new Image(),
      ascend_blast: new Image(),
      loaded: false
    };
    const ghidorahKeys = Object.keys(this.ghidorahSprites).filter(k => k !== 'loaded');
    let loadedGhidorahCount = 0;
    ghidorahKeys.forEach(k => {
      this.ghidorahSprites[k].src = `assets/ghidorah/${k}.png`;
      this.ghidorahSprites[k].onload = () => {
        loadedGhidorahCount++;
        if (loadedGhidorahCount >= ghidorahKeys.length) {
          this.ghidorahSprites.loaded = true;
        }
      };
    });

    // Sprites Oficiais do King Kong (O Titã de Manhattan / Final Boss)
    // Sprites do King Kong - TEMPORARIAMENTE DESATIVADO (renderização procedural)
    this.kongSprites = { loaded: true };

    // Partículas ambientais (Pétalas em Tóquio, Vaga-lumes no Brasil, Tempestade no Egito, Cinzas/Fagulhas em Nova York)
    this.ambientParticles = [];
    for (let i = 0; i < 40; i++) {
      this.ambientParticles.push({
        x: Math.random() * 1000,
        y: Math.random() * 500,
        vx: 0.5 + Math.random() * 1.5,
        vy: 0.2 + Math.random() * 0.8,
        size: 2 + Math.random() * 3,
        rot: Math.random() * Math.PI * 2
      });
    }
  }

  update(dt) {
    this.time += dt;

    // Atualizar partículas ambientais
    this.ambientParticles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.rot += 0.05;
      if (p.x > 1000) p.x = -20;
      if (p.y > 540) p.y = -10;
    });
  }

  // --- CAPA ARCADE DA TELA INICIAL ---
  drawOdysseusCover(ctx, canvasWidth, canvasHeight, time) {
    const coverX = canvasWidth * 0.77;
    const coverY = canvasHeight * 0.57 + Math.sin(time * 1.3) * 4;
    const drawTrooper = (x, y, scale, color, pose) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(scale, scale);
      ctx.fillStyle = color;
      ctx.strokeStyle = '#101827';
      ctx.lineWidth = 3;
      ctx.fillRect(-10, -5, 20, 31);
      ctx.beginPath();
      ctx.arc(0, -16, 11, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#e2b38d';
      ctx.fillRect(-6, -21, 12, 8);
      ctx.strokeStyle = '#c7efff';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(-8, 25);
      ctx.lineTo(-14 - pose, 46);
      ctx.moveTo(8, 25);
      ctx.lineTo(15 + pose, 46);
      ctx.moveTo(-9, 2);
      ctx.lineTo(-21, 14 + pose);
      ctx.moveTo(9, 2);
      ctx.lineTo(24, -7 + pose);
      ctx.stroke();
      ctx.restore();
    };

    ctx.save();
    ctx.globalAlpha = 0.96;
    ctx.globalCompositeOperation = 'screen';
    const glow = ctx.createRadialGradient(coverX, coverY, 12, coverX, coverY, 260);
    glow.addColorStop(0, 'rgba(255, 175, 65, 0.42)');
    glow.addColorStop(0.54, 'rgba(63, 173, 255, 0.16)');
    glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = glow;
    ctx.fillRect(coverX - 270, coverY - 245, 540, 490);
    ctx.globalCompositeOperation = 'source-over';

    // Tropas em camadas: a diferença de altura e pose cria uma capa com
    // sensação de esquadrão, não uma fila rígida de bonecos.
    drawTrooper(coverX - 150, coverY + 53, 0.8, '#24567a', Math.sin(time * 2.1) * 3);
    drawTrooper(coverX - 80, coverY + 26, 0.98, '#61417c', Math.sin(time * 2.1 + 1) * 3);
    drawTrooper(coverX + 100, coverY + 35, 0.92, '#2d6a62', Math.sin(time * 2.1 + 2) * 3);
    drawTrooper(coverX + 160, coverY + 64, 0.76, '#7b3b35', Math.sin(time * 2.1 + 3) * 3);

    // Odisseu no primeiro plano: capacete, lança e escudo inspiram o tema
    // grego, preservando a leitura arcade e sem depender de arte licenciada.
    ctx.save();
    ctx.translate(coverX, coverY);
    const shieldPulse = Math.sin(time * 3) * 0.08;
    ctx.strokeStyle = '#e7c158';
    ctx.lineWidth = 8;
    ctx.shadowColor = '#ffba43';
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.moveTo(42, -122);
    ctx.lineTo(42, 128);
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#9e332f';
    ctx.strokeStyle = '#ffd36f';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(-35, 27, 42 + shieldPulse * 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.strokeStyle = '#ffe9a5';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(-35, 27, 21, 0, Math.PI * 2);
    ctx.moveTo(-56, 27);
    ctx.lineTo(-14, 27);
    ctx.moveTo(-35, 6);
    ctx.lineTo(-35, 48);
    ctx.stroke();
    ctx.fillStyle = '#26466f';
    ctx.strokeStyle = '#101827';
    ctx.lineWidth = 4;
    ctx.fillRect(-18, -13, 38, 66);
    ctx.strokeRect(-18, -13, 38, 66);
    ctx.fillStyle = '#e7b78e';
    ctx.beginPath();
    ctx.arc(1, -43, 20, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#bc9b4f';
    ctx.beginPath();
    ctx.moveTo(-25, -49);
    ctx.lineTo(-13, -78);
    ctx.lineTo(12, -85);
    ctx.lineTo(29, -51);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#fff0a4';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(0, -84);
    ctx.quadraticCurveTo(7, -108, 21, -116);
    ctx.stroke();
    ctx.strokeStyle = '#c9efff';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(-9, 52);
    ctx.lineTo(-25, 96);
    ctx.moveTo(12, 52);
    ctx.lineTo(29, 96);
    ctx.stroke();
    ctx.restore();

    ctx.font = 'bold 10px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#ffe68a';
    ctx.shadowColor = '#ff8426';
    ctx.shadowBlur = 11;
    ctx.fillText('ODYSSEUS // TROJAN SQUAD', coverX, coverY + 132);
    ctx.restore();
  }

  // --- EASTER EGGS DA TELA INICIAL ---
  // Referências desenhadas no próprio Canvas para manter a abertura leve e
  // publicável no GitHub Pages, sem baixar imagens ou marcas externas.
  drawMenuEasterEggs(ctx, canvasWidth, canvasHeight, time) {
    this.drawOdysseusCover(ctx, canvasWidth, canvasHeight, time);
    const drawLabel = (text, x, y, color) => {
      ctx.save();
      ctx.font = '9px "Press Start 2P", monospace';
      ctx.textAlign = 'center';
      ctx.fillStyle = color;
      ctx.shadowColor = color;
      ctx.shadowBlur = 8;
      ctx.fillText(text, x, y);
      ctx.restore();
    };

    ctx.save();
    ctx.globalAlpha = 0.98;

    // Dois irmãos do britpop em uma plataforma voadora: cabelos, postura e
    // micro-movimento distintos evitam que a referência pareça estática.
    const britX = 142 + Math.sin(time * 0.8) * 50;
    const britY = 118 + Math.sin(time * 1.6) * 13;
    ctx.save();
    ctx.translate(britX, britY);
    ctx.rotate(Math.sin(time * 1.6) * 0.04);
    ctx.fillStyle = 'rgba(13, 24, 46, 0.92)';
    ctx.strokeStyle = '#61d8ff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(0, 24, 74, 15, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    [-24, 24].forEach((offset, index) => {
      const bob = Math.sin(time * 2.1 + index * 1.6) * 3;
      ctx.fillStyle = index === 0 ? '#1d2740' : '#41233d';
      ctx.fillRect(offset - 9, -2 + bob, 18, 29);
      ctx.fillStyle = '#f0be9b';
      ctx.beginPath();
      ctx.arc(offset, -11 + bob, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = index === 0 ? '#27242a' : '#6f432d';
      ctx.beginPath();
      ctx.arc(offset - 1, -17 + bob, 11, Math.PI, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#d5f9ff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(offset - 5, 27);
      ctx.lineTo(offset - 10, 42);
      ctx.moveTo(offset + 5, 27);
      ctx.lineTo(offset + 10, 42);
      ctx.stroke();
    });
    ctx.restore();
    drawLabel('BRITPOP BROS', britX, britY + 57, '#8defff');

    // Brasão azul com um galo pixelado: referência futebolística estilizada,
    // sem reproduzir o escudo oficial.
    const crestX = canvasWidth - 118 + Math.sin(time * 0.92 + 1) * 34;
    const crestY = 160 + Math.cos(time * 1.35) * 22;
    ctx.save();
    ctx.translate(crestX, crestY);
    ctx.rotate(Math.sin(time * 1.35) * 0.12);
    ctx.fillStyle = '#e9f5ff';
    ctx.strokeStyle = '#163f77';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(0, -36);
    ctx.lineTo(27, -25);
    ctx.lineTo(22, 27);
    ctx.lineTo(0, 43);
    ctx.lineTo(-22, 27);
    ctx.lineTo(-27, -25);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#173f78';
    ctx.beginPath();
    ctx.arc(0, -7, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(-3, 1, 6, 20);
    ctx.fillRect(-14, 17, 28, 4);
    ctx.beginPath();
    ctx.moveTo(5, -11);
    ctx.lineTo(15, -17);
    ctx.lineTo(9, -3);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
    drawLabel('N17 SKY CREST', crestX, crestY + 58, '#b9e7ff');

    // Corredor e banco flutuante, numa piscadela para filmes de estrada.
    const runnerX = 120 + Math.sin(time * 1.1 + 2) * 46;
    const runnerY = canvasHeight - 112 + Math.sin(time * 1.9 + 1) * 14;
    ctx.save();
    ctx.translate(runnerX, runnerY);
    ctx.rotate(Math.sin(time * 1.9 + 1) * 0.045);
    ctx.strokeStyle = '#ffd77a';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(-48, 20);
    ctx.lineTo(50, 20);
    ctx.moveTo(-40, 20);
    ctx.lineTo(-48, 36);
    ctx.moveTo(40, 20);
    ctx.lineTo(48, 36);
    ctx.stroke();
    const stride = Math.sin(time * 6) * 10;
    ctx.fillStyle = '#dceaff';
    ctx.fillRect(-6, -14, 13, 25);
    ctx.fillStyle = '#f2c39e';
    ctx.beginPath();
    ctx.arc(1, -25, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#e7f4ff';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-2, 10);
    ctx.lineTo(-16, 27 + stride * 0.35);
    ctx.moveTo(4, 10);
    ctx.lineTo(18, 27 - stride * 0.35);
    ctx.moveTo(-5, -5);
    ctx.lineTo(-19, 5 - stride * 0.2);
    ctx.moveTo(7, -5);
    ctx.lineTo(22, 4 + stride * 0.2);
    ctx.stroke();
    ctx.restore();
    drawLabel('RUN, LEGEND, RUN', runnerX, runnerY + 56, '#ffe8a6');

    ctx.restore();
  }

  // --- CENÁRIO PARALLAX DINÂMICO MULTI-PAÍSES (TÓQUIO -> BRASIL -> EUROPA -> EGITO) ---
  // --- CENÁRIO PARALLAX DINÂMICO MULTI-PAÍSES (TÓQUIO -> BRASIL -> EUROPA -> EGITO -> NOVA YORK) ---
  drawParallaxBackground(ctx, camera, canvasWidth, canvasHeight, mapWidth) {
    ctx.save();
    const camX = camera.x;

    // Determinar bioma predominante pelo camX
    // 0 -> 1300: Tóquio | 1300 -> 2500: Brasil | 2500 -> 3700: Europa | 3700 -> 5000: Egito | 5000+: Nova York (Manhattan)
    let region = 'tokyo';
    if (camX > 4800) region = 'newyork';
    else if (camX > 3500) region = 'egypt';
    else if (camX > 2300) region = 'europe';
    else if (camX > 1100) region = 'brazil';

    // 1. CÉU E GRADIENTES POR PAÍS
    const skyGrad = ctx.createLinearGradient(0, 0, 0, canvasHeight);

    if (region === 'tokyo') {
      // Tóquio: Crepúsculo Cyberpunk Magenta / Roxo
      skyGrad.addColorStop(0, '#0a091a');
      skyGrad.addColorStop(0.4, '#1b1233');
      skyGrad.addColorStop(0.7, '#3c184e');
      skyGrad.addColorStop(0.9, '#6d1b5b');
      skyGrad.addColorStop(1, '#ff3366');
    } else if (region === 'brazil') {
      // Brasil: Pôr-do-sol Tropical Dourado / Laranja
      skyGrad.addColorStop(0, '#0c1b24');
      skyGrad.addColorStop(0.35, '#193f40');
      skyGrad.addColorStop(0.65, '#5c481e');
      skyGrad.addColorStop(0.85, '#a6511b');
      skyGrad.addColorStop(1, '#ff8800');
    } else if (region === 'europe') {
      // Europa: Noite Gótica Azul Prateada sob a Lua Cheia
      skyGrad.addColorStop(0, '#050a14');
      skyGrad.addColorStop(0.4, '#0d1829');
      skyGrad.addColorStop(0.7, '#182b45');
      skyGrad.addColorStop(0.9, '#243e61');
      skyGrad.addColorStop(1, '#3a5d8c');
    } else if (region === 'egypt') {
      // Egito: MANHÃ DOURADA NO DESERTO com Sol Nascente
      skyGrad.addColorStop(0, '#ffd89b');
      skyGrad.addColorStop(0.35, '#ff8a5a');
      skyGrad.addColorStop(0.65, '#ff6b45');
      skyGrad.addColorStop(0.85, '#d4855b');
      skyGrad.addColorStop(1, '#c49060');
    } else {
      // Nova York: CÉU APOCALÍPTICO VERMELHO SANGUE / TEMPESTADE DE FOGO E CINZAS
      skyGrad.addColorStop(0, '#0a0208');
      skyGrad.addColorStop(0.25, '#220410');
      skyGrad.addColorStop(0.55, '#4a0b18');
      skyGrad.addColorStop(0.8, '#8c1616');
      skyGrad.addColorStop(1, '#ff3300');
    }

    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // 2. CORPO CELESTE (Sol de Tóquio, Pôr-do-sol no Brasil, Lua Cheia na Europa, Pirâmides do Egito ou Empire State em Nova York)
    const celX = canvasWidth * 0.7 - (camX % 1300) * 0.05;
    const celY = 95;

    if (region === 'tokyo') {
      // Sol Vermelho Neon com Monte Fuji
      const fujiGrad = ctx.createRadialGradient(celX, celY, 10, celX, celY, 65);
      fujiGrad.addColorStop(0, '#ffffff');
      fujiGrad.addColorStop(0.3, '#ff0055');
      fujiGrad.addColorStop(0.8, 'rgba(255, 0, 85, 0)');
      ctx.fillStyle = fujiGrad;
      ctx.beginPath();
      ctx.arc(celX, celY, 65, 0, Math.PI * 2);
      ctx.fill();

      // Silhueta do Monte Fuji
      ctx.fillStyle = '#18122b';
      ctx.beginPath();
      ctx.moveTo(celX - 160, canvasHeight - 120);
      ctx.lineTo(celX - 25, celY + 30);
      ctx.lineTo(celX + 25, celY + 30);
      ctx.lineTo(celX + 160, canvasHeight - 120);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#ff66aa';
      ctx.beginPath();
      ctx.moveTo(celX - 35, celY + 45);
      ctx.lineTo(celX - 25, celY + 30);
      ctx.lineTo(celX + 25, celY + 30);
      ctx.lineTo(celX + 35, celY + 45);
      ctx.closePath();
      ctx.fill();

    } else if (region === 'brazil') {
      // Sol Tropical Dourado
      const sunGrad = ctx.createRadialGradient(celX, celY, 15, celX, celY, 80);
      sunGrad.addColorStop(0, '#fff4cc');
      sunGrad.addColorStop(0.3, '#ffaa00');
      sunGrad.addColorStop(0.7, '#ff4400');
      sunGrad.addColorStop(1, 'rgba(255, 68, 0, 0)');
      ctx.fillStyle = sunGrad;
      ctx.beginPath();
      ctx.arc(celX, celY, 80, 0, Math.PI * 2);
      ctx.fill();

      // Montanhas Tropicais
      ctx.fillStyle = '#0f241a';
      ctx.beginPath();
      ctx.arc(celX - 80, canvasHeight - 40, 130, Math.PI, 0);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(celX + 70, canvasHeight - 20, 150, Math.PI, 0);
      ctx.fill();

    } else if (region === 'europe') {
      // Lua Cheia Prateada Gótica
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.shadowColor = '#00d9ff';
      ctx.shadowBlur = 25;
      ctx.beginPath();
      ctx.arc(celX, celY, 40, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Silhueta da Torre Eiffel
      ctx.fillStyle = '#0d1522';
      ctx.beginPath();
      ctx.moveTo(celX - 45, canvasHeight - 110);
      ctx.lineTo(celX - 5, celY + 50);
      ctx.lineTo(celX, celY + 10);
      ctx.lineTo(celX + 5, celY + 50);
      ctx.lineTo(celX + 45, canvasHeight - 110);
      ctx.closePath();
      ctx.fill();

    } else if (region === 'egypt') {
      // Egito: Pirâmides de Gizé
      const sunGrad = ctx.createRadialGradient(celX, celY, 20, celX, celY, 80);
      sunGrad.addColorStop(0, '#ffffff');
      sunGrad.addColorStop(0.3, '#ffeb3b');
      sunGrad.addColorStop(0.6, '#ff9800');
      sunGrad.addColorStop(1, 'rgba(255, 152, 0, 0)');
      ctx.fillStyle = sunGrad;
      ctx.beginPath();
      ctx.arc(celX, celY, 80, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.fillStyle = '#fff9e6';
      ctx.beginPath();
      ctx.arc(celX, celY, 42, 0, Math.PI * 2);
      ctx.fill();

      const pyrParallax = (camX - 3500) * 0.15;
      const p1x = 240 - pyrParallax;
      ctx.fillStyle = '#2a1f15';
      ctx.beginPath();
      ctx.moveTo(p1x - 280, canvasHeight - 80);
      ctx.lineTo(p1x, canvasHeight - 420);
      ctx.lineTo(p1x + 280, canvasHeight - 80);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#d4a373';
      ctx.beginPath();
      ctx.moveTo(p1x, canvasHeight - 420);
      ctx.lineTo(p1x + 280, canvasHeight - 80);
      ctx.lineTo(p1x, canvasHeight - 80);
      ctx.closePath();
      ctx.fill();

      const p2x = 580 - pyrParallax;
      ctx.fillStyle = '#24190f';
      ctx.beginPath();
      ctx.moveTo(p2x - 230, canvasHeight - 80);
      ctx.lineTo(p2x, canvasHeight - 380);
      ctx.lineTo(p2x + 230, canvasHeight - 80);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#c2956b';
      ctx.beginPath();
      ctx.moveTo(p2x, canvasHeight - 380);
      ctx.lineTo(p2x + 180, canvasHeight - 100);
      ctx.lineTo(p2x, canvasHeight - 100);
      ctx.closePath();
      ctx.fill();

    } else {
      // Nova York: LUA DE SANGUE ECLIPSADA & O EMPIRE STATE BUILDING EM CHAMAS
      const moonGrad = ctx.createRadialGradient(celX, celY, 15, celX, celY, 85);
      moonGrad.addColorStop(0, '#fff0d0');
      moonGrad.addColorStop(0.3, '#ff2200');
      moonGrad.addColorStop(0.7, '#880000');
      moonGrad.addColorStop(1, 'rgba(120, 0, 0, 0)');
      ctx.fillStyle = moonGrad;
      ctx.beginPath();
      ctx.arc(celX, celY, 85, 0, Math.PI * 2);
      ctx.fill();

      // Silhueta do EMPIRE STATE BUILDING no fundo distante
      const nyParallax = (camX - 5000) * 0.12;
      const esbX = 420 - nyParallax;
      
      ctx.fillStyle = '#140810';
      // Base do Empire State
      ctx.fillRect(esbX - 55, canvasHeight - 360, 110, 280);
      // Nível intermediário
      ctx.fillRect(esbX - 38, canvasHeight - 450, 76, 95);
      // Nível superior
      ctx.fillRect(esbX - 22, canvasHeight - 510, 44, 65);
      // Pináculo / Antena com sinalizador vermelho
      ctx.fillRect(esbX - 4, canvasHeight - 570, 8, 65);
      ctx.fillRect(esbX - 1.5, canvasHeight - 595, 3, 28);

      // Luz vermelha pulsante da antena do Empire State
      const beaconGlow = Math.sin(this.time * 6) > 0 ? 1 : 0.2;
      ctx.fillStyle = `rgba(255, 0, 0, ${beaconGlow})`;
      ctx.shadowColor = '#ff0000';
      ctx.shadowBlur = 18;
      ctx.beginPath();
      ctx.arc(esbX, canvasHeight - 596, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Silhueta do Chrysler Building ao lado
      const chryX = 720 - nyParallax;
      ctx.fillStyle = '#11060e';
      ctx.fillRect(chryX - 40, canvasHeight - 380, 80, 300);
      ctx.fillRect(chryX - 25, canvasHeight - 460, 50, 85);
      // Arcos Deco do Chrysler
      ctx.beginPath();
      ctx.moveTo(chryX - 20, canvasHeight - 460);
      ctx.lineTo(chryX, canvasHeight - 530);
      ctx.lineTo(chryX + 20, canvasHeight - 460);
      ctx.closePath();
      ctx.fill();

      // Holofotes Militares de Manhattan cruzando o céu
      for (let s = 0; s < 3; s++) {
        const sweepAngle = Math.sin(this.time * 1.5 + s * 1.8) * 0.4 - 0.2;
        const beamBaseX = 200 + s * 300 - nyParallax;
        ctx.save();
        ctx.translate(beamBaseX, canvasHeight - 80);
        ctx.rotate(sweepAngle);
        const beamGrad = ctx.createLinearGradient(0, 0, 0, -500);
        beamGrad.addColorStop(0, 'rgba(255, 230, 150, 0.25)');
        beamGrad.addColorStop(0.5, 'rgba(255, 200, 100, 0.12)');
        beamGrad.addColorStop(1, 'rgba(255, 100, 0, 0)');
        ctx.fillStyle = beamGrad;
        ctx.beginPath();
        ctx.moveTo(-15, 0);
        ctx.lineTo(-70, -500);
        ctx.lineTo(70, -500);
        ctx.lineTo(15, 0);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }
    }

    // 3. CAMADA MIDGROUND DINÂMICA (Parallax 0.3)
    const midP = camX * 0.3;

    if (region === 'tokyo') {
      // Arranha-céus com Kanji Neon e Pagodes
      ctx.fillStyle = '#131124';
      for (let i = -100; i < canvasWidth + 200; i += 110) {
        const bx = ((i - midP) % (canvasWidth + 250) + canvasWidth + 250) % (canvasWidth + 250) - 100;
        const bh = 180 + Math.sin(i * 9) * 70;
        ctx.fillRect(bx, canvasHeight - bh - 100, 75, bh);

        if (i % 2 === 0) {
          ctx.fillStyle = '#ff0055';
          ctx.beginPath();
          ctx.moveTo(bx - 12, canvasHeight - bh - 100);
          ctx.lineTo(bx + 37, canvasHeight - bh - 120);
          ctx.lineTo(bx + 87, canvasHeight - bh - 100);
          ctx.closePath();
          ctx.fill();
        }

        ctx.fillStyle = (i % 3 === 0) ? '#00d9ff' : ((i % 3 === 1) ? '#ff0055' : '#ffff00');
        ctx.font = '10px sans-serif';
        ctx.fillText(i % 2 === 0 ? '東京' : 'ネオン', bx + 18, canvasHeight - bh - 50);
        ctx.fillStyle = '#131124';
      }

    } else if (region === 'brazil') {
      // Palmeiras Tropicais
      ctx.fillStyle = '#12261a';
      for (let i = -100; i < canvasWidth + 200; i += 130) {
        const tx = ((i - midP) % (canvasWidth + 250) + canvasWidth + 250) % (canvasWidth + 250) - 100;
        const th = 150 + Math.sin(i * 11) * 50;
        ctx.fillRect(tx + 28, canvasHeight - th - 100, 14, th);
        ctx.fillStyle = '#1b4028';
        ctx.beginPath();
        ctx.arc(tx + 35, canvasHeight - th - 105, 45, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#12261a';
      }

    } else if (region === 'europe') {
      // Catedrais Góticas
      ctx.fillStyle = '#181d2e';
      for (let i = -100; i < canvasWidth + 200; i += 140) {
        const cx = ((i - midP) % (canvasWidth + 250) + canvasWidth + 250) % (canvasWidth + 250) - 100;
        const ch = 160 + Math.sin(i * 5) * 60;
        ctx.fillRect(cx, canvasHeight - ch - 100, 90, ch);
        ctx.beginPath();
        ctx.moveTo(cx, canvasHeight - ch - 100);
        ctx.lineTo(cx + 45, canvasHeight - ch - 160);
        ctx.lineTo(cx + 90, canvasHeight - ch - 100);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = '#ffaa00';
        ctx.beginPath();
        ctx.arc(cx + 45, canvasHeight - ch - 60, 14, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#181d2e';
      }

    } else if (region === 'egypt') {
      // Egito: Dunas Onduladas
      ctx.fillStyle = '#422814';
      for (let i = -100; i < canvasWidth + 200; i += 180) {
        const dx = ((i - midP) % (canvasWidth + 300) + canvasWidth + 300) % (canvasWidth + 300) - 100;
        ctx.beginPath();
        ctx.moveTo(dx, canvasHeight - 100);
        ctx.quadraticCurveTo(dx + 90, canvasHeight - 190, dx + 180, canvasHeight - 100);
        ctx.fill();
        if (i % 2 === 0) {
          ctx.fillStyle = '#5c381c';
          ctx.beginPath();
          ctx.moveTo(dx + 75, canvasHeight - 100);
          ctx.lineTo(dx + 82, canvasHeight - 240);
          ctx.lineTo(dx + 85, canvasHeight - 255);
          ctx.lineTo(dx + 88, canvasHeight - 240);
          ctx.lineTo(dx + 95, canvasHeight - 100);
          ctx.closePath();
          ctx.fill();
          ctx.fillStyle = '#422814';
        }
      }

    } else {
      // Nova York: ARRANHA-CÉUS EM RUÍNAS COM PLACAS NEON PISCANDO E VIGAS TORTAS
      ctx.fillStyle = '#1c0c14';
      for (let i = -100; i < canvasWidth + 250; i += 135) {
        const nx = ((i - midP) % (canvasWidth + 300) + canvasWidth + 300) % (canvasWidth + 300) - 100;
        const nh = 210 + Math.sin(i * 7) * 75;

        // Prédio comercial em ruínas
        ctx.fillRect(nx, canvasHeight - nh - 90, 95, nh);

        // Janelas acesas e quebradas
        for (let row = 0; row < nh - 40; row += 22) {
          for (let col = 8; col < 80; col += 18) {
            const isLit = (Math.sin(i + row * 3 + col) > 0.3);
            if (isLit) {
              ctx.fillStyle = (Math.random() < 0.1 && Math.sin(this.time * 15 + i) > 0) ? '#ff0033' : '#ffaa33';
              ctx.fillRect(nx + col, canvasHeight - nh - 75 + row, 10, 12);
              ctx.fillStyle = '#1c0c14';
            }
          }
        }

        // Letreiros luminosos quebrados ("BROADWAY", "HOTEL", "NYC", "CYBER")
        const signs = ['NYC', 'EMPIRE', 'HOTEL', 'BROADWAY'];
        const signText = signs[Math.abs(i) % signs.length];
        const blink = Math.sin(this.time * 8 + i) > -0.2;
        if (blink) {
          ctx.fillStyle = (i % 2 === 0) ? '#ff2200' : '#00ffff';
          ctx.shadowColor = ctx.fillStyle;
          ctx.shadowBlur = 12;
          ctx.font = 'bold 9px "Press Start 2P", monospace';
          ctx.fillText(signText, nx + 12, canvasHeight - nh - 100);
          ctx.shadowBlur = 0;
          ctx.fillStyle = '#1c0c14';
        }

        // Fumaça saindo do topo dos prédios em chamas
        if (i % 2 === 0) {
          ctx.fillStyle = 'rgba(60, 20, 20, 0.4)';
          ctx.beginPath();
          ctx.arc(nx + 45 + Math.sin(this.time * 2 + i) * 15, canvasHeight - nh - 110, 22, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    // 4. PARTÍCULAS AMBIENTAIS ESPECÍFICAS DA REGIÃO
    this.ambientParticles.forEach(p => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);

      if (region === 'tokyo') {
        ctx.fillStyle = 'rgba(255, 180, 210, 0.75)';
        ctx.beginPath();
        ctx.ellipse(0, 0, p.size * 1.5, p.size, 0, 0, Math.PI * 2);
        ctx.fill();
      } else if (region === 'brazil') {
        ctx.fillStyle = 'rgba(160, 255, 60, 0.85)';
        ctx.shadowColor = '#a0ff3c';
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(0, 0, p.size * 0.8, 0, Math.PI * 2);
        ctx.fill();
      } else if (region === 'europe') {
        ctx.fillStyle = 'rgba(255, 180, 60, 0.6)';
        ctx.beginPath();
        ctx.arc(0, 0, p.size * 0.7, 0, Math.PI * 2);
        ctx.fill();
      } else if (region === 'egypt') {
        ctx.fillStyle = 'rgba(255, 204, 102, 0.7)';
        ctx.fillRect(0, 0, p.size * 1.2, p.size * 0.8);
      } else {
        // Nova York: CINZAS, BRASAS E FAGULHAS INCANDESCENTES DO APOCALIPSE
        const isEmber = Math.random() < 0.4;
        ctx.fillStyle = isEmber ? '#ff4400' : 'rgba(180, 160, 160, 0.65)';
        if (isEmber) {
          ctx.shadowColor = '#ff2200';
          ctx.shadowBlur = 6;
        }
        ctx.fillRect(0, 0, p.size * 1.1, p.size * 0.9);
      }

      ctx.restore();
    });

    ctx.restore();
  }

  // --- MAPA / PLATAFORMAS / CHÃO POR REGIÃO DO MUNDO ---
  drawMapElements(ctx, camera, map) {
    ctx.save();
    ctx.translate(-camera.x, -camera.y);

    map.platforms.forEach(plat => {
      const biome = plat.biome || 'tokyo';

      // Sombra projetada no chão
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fillRect(plat.x + 4, plat.y + 4, plat.width, plat.height);

      if (plat.isGround) {
        if (biome === 'tokyo') {
          // Asfalto Cyberpunk de Tóquio com faixas de neon
          const gGrad = ctx.createLinearGradient(0, plat.y, 0, plat.y + plat.height);
          gGrad.addColorStop(0, '#222538');
          gGrad.addColorStop(0.2, '#161928');
          gGrad.addColorStop(1, '#0d0f1a');
          ctx.fillStyle = gGrad;
          ctx.fillRect(plat.x, plat.y, plat.width, plat.height);

          // Faixa de Neon Ciano e Rosa
          ctx.fillStyle = '#00d9ff';
          ctx.fillRect(plat.x, plat.y, plat.width, 3);
          ctx.fillStyle = '#ff0055';
          for (let x = plat.x; x < plat.x + plat.width; x += 100) {
            ctx.fillRect(x + 20, plat.y + 12, 35, 3);
          }

        } else if (biome === 'brazil') {
          // Solo de Terra Tropical da Amazônia com Grama e Raízes
          const gGrad = ctx.createLinearGradient(0, plat.y, 0, plat.y + plat.height);
          gGrad.addColorStop(0, '#382212');
          gGrad.addColorStop(0.2, '#241408');
          gGrad.addColorStop(1, '#120903');
          ctx.fillStyle = gGrad;
          ctx.fillRect(plat.x, plat.y, plat.width, plat.height);

          // Grama tropical exuberante no topo
          ctx.fillStyle = '#2d6a4f';
          ctx.fillRect(plat.x, plat.y, plat.width, 6);
          ctx.fillStyle = '#52b788';
          for (let x = plat.x; x < plat.x + plat.width; x += 12) {
            ctx.fillRect(x, plat.y - 2, 4, 4);
          }

        } else if (biome === 'europe') {
          // Calçada de Pedras Portuguesas / Paralelepípedos Medievais
          const gGrad = ctx.createLinearGradient(0, plat.y, 0, plat.y + plat.height);
          gGrad.addColorStop(0, '#3a4454');
          gGrad.addColorStop(0.2, '#272e3b');
          gGrad.addColorStop(1, '#151921');
          ctx.fillStyle = gGrad;
          ctx.fillRect(plat.x, plat.y, plat.width, plat.height);

          // Padrão de pedras talhadas
          ctx.strokeStyle = '#1b2029';
          ctx.lineWidth = 2;
          for (let x = plat.x; x < plat.x + plat.width; x += 30) {
            ctx.strokeRect(x, plat.y, 30, 20);
            ctx.strokeRect(x + 15, plat.y + 20, 30, 20);
          }

        } else if (biome === 'egypt') {
          // ARENA DO EGITO: Blocos Maciços de Calcário e Arenito Dourado das Pirâmides
          const gGrad = ctx.createLinearGradient(0, plat.y, 0, plat.y + plat.height);
          gGrad.addColorStop(0, '#d4a373');
          gGrad.addColorStop(0.15, '#b07d50');
          gGrad.addColorStop(1, '#4a2f16');
          ctx.fillStyle = gGrad;
          ctx.fillRect(plat.x, plat.y, plat.width, plat.height);

          // Borda dourada polida com areia
          ctx.fillStyle = '#faedcd';
          ctx.fillRect(plat.x, plat.y, plat.width, 5);

          // Grandes lajes de pedra com juntas e relevos de hieróglifos
          ctx.strokeStyle = '#5e3c1e';
          ctx.lineWidth = 3;
          for (let x = plat.x; x < plat.x + plat.width; x += 85) {
            ctx.strokeRect(x, plat.y, 85, 40);
            ctx.fillStyle = '#ffdf7a';
            ctx.font = '10px sans-serif';
            ctx.fillText('𓀀 𓃠 𓆃', x + 15, plat.y + 26);
          }

          // Tochas de Fogo Sagrado do Faraó iluminando a arena
          for (let tx = plat.x + 80; tx < plat.x + plat.width; tx += 360) {
            ctx.fillStyle = '#8f5c38';
            ctx.fillRect(tx - 6, plat.y - 45, 12, 45);
            ctx.fillStyle = '#ffcc00';
            ctx.beginPath();
            ctx.arc(tx, plat.y - 45, 14, 0, Math.PI);
            ctx.fill();

            const flameH = 18 + Math.sin(this.time * 12 + tx) * 5;
            ctx.fillStyle = '#ff3300';
            ctx.beginPath();
            ctx.moveTo(tx - 12, plat.y - 48);
            ctx.lineTo(tx, plat.y - 48 - flameH);
            ctx.lineTo(tx + 12, plat.y - 48);
            ctx.closePath();
            ctx.fill();
            ctx.fillStyle = '#ffcc00';
            ctx.beginPath();
            ctx.moveTo(tx - 6, plat.y - 48);
            ctx.lineTo(tx, plat.y - 52 - flameH * 0.6);
            ctx.lineTo(tx + 6, plat.y - 48);
            ctx.closePath();
            ctx.fill();
          }

        } else {
          // NOVA YORK APOCALÍPTICA: Asfalto Rachado com Escombros e Faixas de Trânsito Amarelas
          const gGrad = ctx.createLinearGradient(0, plat.y, 0, plat.y + plat.height);
          gGrad.addColorStop(0, '#2a2d35');
          gGrad.addColorStop(0.3, '#1a1c22');
          gGrad.addColorStop(1, '#0d0e12');
          ctx.fillStyle = gGrad;
          ctx.fillRect(plat.x, plat.y, plat.width, plat.height);

          // Rachaduras no asfalto
          ctx.strokeStyle = '#0a0b0f';
          ctx.lineWidth = 3;
          for (let x = plat.x; x < plat.x + plat.width; x += 120) {
            ctx.beginPath();
            ctx.moveTo(x, plat.y);
            ctx.lineTo(x + 40, plat.y + 20);
            ctx.lineTo(x + 50, plat.y + 40);
            ctx.stroke();
          }

          // Faixas amarelas de trânsito desgastadas
          ctx.fillStyle = 'rgba(255, 204, 0, 0.4)';
          for (let x = plat.x; x < plat.x + plat.width; x += 60) {
            ctx.fillRect(x, plat.y + 10, 30, 4);
          }

          // Manchas de óleo e sangue
          ctx.fillStyle = 'rgba(50, 20, 20, 0.6)';
          for (let x = plat.x + 40; x < plat.x + plat.width; x += 180) {
            ctx.beginPath();
            ctx.arc(x, plat.y + 25, 8, 0, Math.PI * 2);
            ctx.fill();
          }

          // Detritos e escombros de concreto
          ctx.fillStyle = '#3d4149';
          for (let x = plat.x + 100; x < plat.x + plat.width; x += 250) {
            ctx.fillRect(x, plat.y, 15, 8);
            ctx.fillRect(x + 20, plat.y, 8, 6);
          }
        }

      } else {
        // PLATAFORMAS SUSPENSAS POR BIOMA
        if (biome === 'tokyo') {
          // Telhado tradicional japonês com telhas vermelhas e lanternas
          ctx.fillStyle = '#8a1c1c';
          ctx.fillRect(plat.x, plat.y, plat.width, plat.height);
          ctx.fillStyle = '#ff3344';
          ctx.fillRect(plat.x, plat.y, plat.width, 4);

          // Lanternas vermelhas de papel penduradas
          ctx.fillStyle = '#ff0033';
          ctx.beginPath();
          ctx.arc(plat.x + 25, plat.y + plat.height + 12, 9, 0, Math.PI * 2);
          ctx.arc(plat.x + plat.width - 25, plat.y + plat.height + 12, 9, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#ffcc00';
          ctx.fillRect(plat.x + 23, plat.y + plat.height + 8, 4, 8);
          ctx.fillRect(plat.x + plat.width - 27, plat.y + plat.height + 8, 4, 8);

        } else if (biome === 'brazil') {
          // Ponte rústica de troncos de madeira e cipós
          ctx.fillStyle = '#5c3a21';
          ctx.fillRect(plat.x, plat.y, plat.width, plat.height);
          ctx.strokeStyle = '#2b7a4b';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(plat.x, plat.y);
          ctx.lineTo(plat.x + plat.width, plat.y);
          ctx.stroke();

        } else if (biome === 'europe') {
          // Passarela de pedra de castelo medieval
          ctx.fillStyle = '#3f495a';
          ctx.fillRect(plat.x, plat.y, plat.width, plat.height);
          ctx.fillStyle = '#60728c';
          ctx.fillRect(plat.x, plat.y, plat.width, 4);

        } else if (biome === 'egypt') {
          // Passarela sagrada de arenito egípcio com relevos
          ctx.fillStyle = '#c68b59';
          ctx.fillRect(plat.x, plat.y, plat.width, plat.height);
          ctx.fillStyle = '#faedcd';
          ctx.fillRect(plat.x, plat.y, plat.width, 5);
          ctx.fillStyle = '#5e3c1e';
          ctx.font = '8px sans-serif';
          ctx.fillText('𓇯 𓈖 𓊪 𓋹', plat.x + 20, plat.y + 14);

        } else {
          // NOVA YORK: Vigas de Aço I-Beam Industriais e Concreto Armado com Vergalhões
          ctx.fillStyle = '#7f1d1d'; // Aço enferrujado
          ctx.fillRect(plat.x, plat.y, plat.width, plat.height);
          ctx.fillStyle = '#991b1b';
          ctx.fillRect(plat.x, plat.y, plat.width, 4);
          ctx.fillRect(plat.x, plat.y + plat.height - 4, plat.width, 4);
          
          // Rebites de aço industriais
          ctx.fillStyle = '#1f2937';
          for (let rx = plat.x + 10; rx < plat.x + plat.width; rx += 25) {
            ctx.beginPath();
            ctx.arc(rx, plat.y + plat.height / 2, 3, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
    });

    // Obstáculos Destrutíveis
    if (map.destructibles) {
      map.destructibles.forEach(obj => {
        if (obj.destroyed) return;
        ctx.save();
        ctx.translate(obj.x, obj.y);

        const objectBiome = obj.biome || 'tokyo';
        if (obj.type === 'barrel') {
          const barrelColors = {
            tokyo: ['#4f107a', '#c026d3', '#240044'],
            brazil: ['#31572c', '#76a743', '#18351a'],
            europe: ['#475569', '#94a3b8', '#1e293b'],
            egypt: ['#8f5c38', '#f6bd60', '#4a2f16'],
            newyork: ['#4b5563', '#9ca3af', '#1f2937']
          }[objectBiome] || ['#4b5563', '#9ca3af', '#1f2937'];
          const bGrad = ctx.createLinearGradient(0, 0, obj.width, 0);
          bGrad.addColorStop(0, barrelColors[0]);
          bGrad.addColorStop(0.5, barrelColors[1]);
          bGrad.addColorStop(1, barrelColors[2]);
          ctx.fillStyle = bGrad;
          ctx.fillRect(0, 0, obj.width, obj.height);
          ctx.fillStyle = '#222';
          ctx.fillRect(0, 6, obj.width, 4);
          ctx.fillRect(0, obj.height - 10, obj.width, 4);
          ctx.fillStyle = '#ffcc00';
          ctx.beginPath();
          ctx.arc(obj.width / 2, obj.height / 2, 6, 0, Math.PI * 2);
          ctx.fill();
        } else {
          const crateColors = {
            tokyo: '#1e3a5f', brazil: '#61482b', europe: '#4a5568', egypt: '#a66a3f', newyork: '#3f4650'
          };
          ctx.fillStyle = crateColors[objectBiome] || crateColors.newyork;
          ctx.fillRect(0, 0, obj.width, obj.height);
          ctx.strokeStyle = objectBiome === 'egypt' ? '#ffdf7a' : '#3d2b17';
          ctx.lineWidth = 3;
          ctx.strokeRect(0, 0, obj.width, obj.height);
        }
        ctx.restore();
      });
    }

    ctx.restore();
  }

  // --- RENDERIZAÇÃO DETALHADA DO JOGADOR (CLAUDIO, MARCO, TARMA, FIO) ---
  drawPlayer(ctx, camera, p) {
    if (p.isInvulnerable && Math.floor(this.time * 20) % 2 === 0) {
      return; // Efeito de piscar na invulnerabilidade
    }

    ctx.save();
    ctx.translate(p.x - camera.x + p.width / 2, p.y - camera.y + p.height / 2);

    // SPIN 360° NA HORIZONTAL - Giro como um PIÃO (não inclinado!)
    let spinScaleX = 1;
    if (p.isSpinning && p.weapon === 'AXE') {
      // Usar escala no eixo X para simular rotação horizontal
      // spinAngle varia de 0 a 2π durante o giro
      spinScaleX = Math.cos(p.spinAngle) * p.facing;
      
      // Quando está de costas (cos negativo), inverte a escala vertical também
      if (Math.abs(Math.cos(p.spinAngle)) < 0.1) {
        spinScaleX = 0.1 * p.facing; // Muito fino quando está de lado
      }
    }

    // Direção horizontal (1 = Direita, -1 = Esquerda). Fora do spin, a
    // direção do personagem precisa ser usada diretamente; o valor padrão 1
    // de spinScaleX era o que impedia Jessica de virar para a esquerda.
    const displayDirection = (p.isSpinning && p.weapon === 'AXE') ? spinScaleX : p.facing;
    const characterScale = 1.14;
    ctx.translate(0, -3);
    ctx.scale((displayDirection || p.facing) * characterScale, characterScale);

    // Sombra no chão MAIS REALISTA
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.beginPath();
    ctx.ellipse(0, p.height / 2 - 1, 18, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    const isRunning = Math.abs(p.vx) > 0.1 && p.onGround;
    const isCrouching = p.isCrouching && p.onGround;
    const runCycle = isRunning ? Math.sin(this.time * (p.characterId === 'claudio' ? 20 : 16)) : 0;
    const breathe = Math.sin(this.time * 4) * 1.5;
    const charId = p.characterId || 'claudio';

    // Inclinação dinâmica ao correr - MAIS FLUIDA!
    if (isRunning && !p.isAttacking) {
      ctx.rotate(runCycle * 0.08); // Aumento de 0.05 para 0.08 - mais dinâmico
    }

    // Pose de ataque com machado (inclinação para frente)
    if (p.isAttacking && charId === 'claudio') {
      ctx.rotate(p.facing * 0.15);
      ctx.translate(p.facing * 8, -3);
    }

    // Pose de arco para Jessica - MELHORADA!
    if (p.weapon === 'BOW' && charId === 'jessica' && isRunning) {
      ctx.rotate(p.facing * 0.06); // Leve inclinação ao correr com arco
    }

    // Definição de Cores Base por Personagem
    let skinColor = '#e8b896'; // Tom de pele natural de Claudio
    let pantsColor = '#0f172a'; // Calça preta tática para Claudio
    let bootsColor = '#05070a';
    
    if (charId === 'jessica') {
      skinColor = '#fcd5be'; // Tom de pele delicado e natural de Jessica
      pantsColor = '#64748b'; // Calça cargo cinza para Jessica
      bootsColor = '#0f172a'; // Tênis All Star preto e branco
    } else if (charId === 'marco') {
      skinColor = '#f0be8b';
      pantsColor = '#4a5b3a';
      bootsColor = '#1c1f24';
    } else if (charId === 'tarma') {
      skinColor = '#e6b280';
      pantsColor = '#78654b';
      bootsColor = '#2b1d0c';
    } else if (charId === 'fio') {
      skinColor = '#f5c6a5';
      pantsColor = '#5c4838';
      bootsColor = '#2d241e';
    }

    // --- CORPO E MEMBROS ---
    const hipY = isCrouching ? 8 : 4;
    const torsoY = isCrouching ? 0 : -8 + breathe;

    // 1. Pernas & Calçados (Botas ou Tênis All Star)
    ctx.fillStyle = pantsColor;
    if (isCrouching) {
      // Agachado
      ctx.fillRect(-10, 8, 12, 10);
      ctx.fillRect(2, 10, 10, 8);
      // Calçados
      ctx.fillStyle = bootsColor;
      ctx.fillRect(-12, 16, 14, 6);
      ctx.fillRect(2, 16, 14, 6);
      if (charId === 'jessica') {
        // Biqueira e sola branca do All Star
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(-12, 18, 5, 4);
        ctx.fillRect(11, 18, 5, 4);
        ctx.fillRect(-12, 21, 14, 2);
        ctx.fillRect(2, 21, 14, 2);
      }
    } else if (p.onGround) {
      // Correndo ou Parado
      const leg1Angle = runCycle * 0.6;
      const leg2Angle = -runCycle * 0.6;

      // Perna Esquerda / Trás
      ctx.save();
      ctx.translate(-4, hipY);
      ctx.rotate(leg2Angle);
      ctx.fillRect(-3, 0, 7, 14);
      if (charId === 'jessica') {
        // Bolsos da calça cargo cinza
        ctx.fillStyle = '#475569';
        ctx.fillRect(-4, 4, 2, 6);
        // Tênis All Star
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(-4, 12, 10, 6);
        ctx.fillStyle = '#ffffff'; // Biqueira e sola branca
        ctx.fillRect(-4, 14, 3, 4);
        ctx.fillRect(-4, 17, 10, 2);
      } else {
        ctx.fillStyle = bootsColor; // Bota tática preta
        ctx.fillRect(-4, 12, 10, 6);
      }
      ctx.restore();

      // Perna Direita / Frente
      ctx.save();
      ctx.translate(4, hipY);
      ctx.rotate(leg1Angle);
      ctx.fillStyle = pantsColor;
      ctx.fillRect(-3, 0, 7, 14);
      if (charId === 'jessica') {
        // Bolsos da calça cargo cinza
        ctx.fillStyle = '#475569';
        ctx.fillRect(5, 4, 2, 6);
        // Tênis All Star
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(-4, 12, 10, 6);
        ctx.fillStyle = '#ffffff'; // Biqueira e sola branca
        ctx.fillRect(3, 14, 3, 4);
        ctx.fillRect(-4, 17, 10, 2);
      } else {
        ctx.fillStyle = bootsColor; // Bota tática preta
        ctx.fillRect(-4, 12, 10, 6);
      }
      ctx.restore();
    } else {
      // No Ar / Pulando
      ctx.fillRect(-8, hipY, 7, 10);
      ctx.fillRect(2, hipY - 2, 7, 8);
      ctx.fillStyle = bootsColor;
      ctx.fillRect(-9, hipY + 8, 9, 6);
      ctx.fillRect(2, hipY + 5, 9, 6);
      if (charId === 'jessica') {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(-9, hipY + 12, 9, 2);
        ctx.fillRect(2, hipY + 9, 9, 2);
      }
    }

    // 2. Torso e Vestimentas
    ctx.save();
    ctx.translate(0, torsoY);

    if (charId === 'claudio') {
      // --- CLAUDIO: Camisa Branca Social Tática com Gola Aberta e Calça Preta ---
      // Coldre tático nas costas
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(-15, -9, 8, 14);
      ctx.fillStyle = '#475569';
      ctx.fillRect(-14, -7, 6, 5);
      
      // Camisa Branca Social com Caimento Impecável
      const shirtGrad = ctx.createLinearGradient(-8, -12, 10, 4);
      shirtGrad.addColorStop(0, '#ffffff');
      shirtGrad.addColorStop(0.7, '#f8fafc');
      shirtGrad.addColorStop(1, '#e2e8f0');
      ctx.fillStyle = shirtGrad;
      ctx.fillRect(-8, -12, 18, 16);

      // Borda preta interna do decote / gola em V
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.moveTo(-1, -12);
      ctx.lineTo(4, -5);
      ctx.lineTo(8, -12);
      ctx.closePath();
      ctx.fill();

      // Pele no decote da gola aberta
      ctx.fillStyle = skinColor;
      ctx.beginPath();
      ctx.moveTo(1, -12);
      ctx.lineTo(4, -6);
      ctx.lineTo(7, -12);
      ctx.closePath();
      ctx.fill();

      // Gola Social Branca Estruturada
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(-5, -12);
      ctx.lineTo(-2, -6);
      ctx.lineTo(2, -12);
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(9, -12);
      ctx.lineTo(6, -6);
      ctx.lineTo(3, -12);
      ctx.closePath();
      ctx.fill();

      // Botões da Camisa prateados
      ctx.fillStyle = '#cbd5e1';
      ctx.beginPath();
      ctx.arc(3, -2, 1.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(3, 2, 1.5, 0, Math.PI * 2);
      ctx.fill();

      // Cinto Tático de Couro Escuro com Fivela Prateada
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(-8, 2, 18, 5);
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(-1, 2, 6, 5);

    } else if (charId === 'jessica') {
      // --- JESSICA: Roupa Preta Elegante, Aljava de Flechas e Correia Tática ---
      // Aljava de Flechas nas costas (Quiver)
      ctx.fillStyle = '#1e1b18';
      ctx.fillRect(-14, -14, 7, 18);
      ctx.fillStyle = '#b45309'; // Correias de couro da aljava
      ctx.fillRect(-14, -10, 7, 2);
      ctx.fillRect(-14, -2, 7, 2);
      // Penas das flechas saindo no topo da aljava
      ctx.fillStyle = '#00d9ff';
      ctx.fillRect(-13, -18, 2, 5);
      ctx.fillStyle = '#c084fc';
      ctx.fillRect(-10, -19, 2, 6);
      ctx.fillStyle = '#00d9ff';
      ctx.fillRect(-7, -17, 2, 4);

      // Blusa Preta de Gola Alta / Manga Longa Ajustada
      const topGrad = ctx.createLinearGradient(-8, -12, 10, 4);
      topGrad.addColorStop(0, '#18181b');
      topGrad.addColorStop(0.5, '#09090b');
      topGrad.addColorStop(1, '#000000');
      ctx.fillStyle = topGrad;
      ctx.fillRect(-8, -12, 18, 16);

      // Gola Alta Preta Delicada
      ctx.fillStyle = '#27272a';
      ctx.fillRect(-3, -14, 10, 4);

      // Correia Tática Transversal em Couro com Fivela de Prata
      ctx.fillStyle = '#78350f';
      ctx.beginPath();
      ctx.moveTo(-6, -12);
      ctx.lineTo(8, 2);
      ctx.lineTo(6, 4);
      ctx.lineTo(-8, -10);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#00ffff'; // Broche / Emblema neon
      ctx.fillRect(-1, -5, 3, 3);

      // Cinto da Calça Cargo com fivela
      ctx.fillStyle = '#334155';
      ctx.fillRect(-8, 2, 18, 4);
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(-1, 2, 5, 4);

    } else if (charId === 'marco') {
      // --- MARCO: Colete Vermelho Tático e Camiseta Branca ---
      ctx.fillStyle = '#303b26';
      ctx.fillRect(-15, -10, 8, 14);
      ctx.fillStyle = '#445336';
      ctx.fillRect(-14, -8, 6, 4);

      ctx.fillStyle = '#d92626';
      ctx.fillRect(-8, -12, 18, 16);
      ctx.fillStyle = '#f0f0f0';
      ctx.fillRect(-2, -12, 8, 5);
      ctx.fillStyle = '#222';
      ctx.fillRect(-8, 2, 18, 4);
      ctx.fillStyle = '#ffcc00';
      ctx.fillRect(-1, 2, 5, 4);

    } else if (charId === 'tarma') {
      // --- TARMA: Jaqueta Marrom de Couro de Piloto ---
      ctx.fillStyle = '#4a2f16';
      ctx.fillRect(-14, -10, 7, 14);
      ctx.fillStyle = '#6b4423';
      ctx.fillRect(-8, -12, 18, 16);
      ctx.fillStyle = '#d97706';
      ctx.fillRect(-2, -12, 6, 6);
      ctx.fillStyle = '#1e1b18';
      ctx.fillRect(-8, 2, 18, 4);
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(-1, 2, 5, 4);

    } else if (charId === 'fio') {
      // --- FIO: Camisa Bege Tática com Suspensórios ---
      ctx.fillStyle = '#3a2818';
      ctx.fillRect(-13, -9, 6, 12);
      ctx.fillStyle = '#d7c4a8';
      ctx.fillRect(-8, -12, 18, 16);
      ctx.fillStyle = '#2b2319';
      ctx.fillRect(-5, -12, 3, 14);
      ctx.fillRect(4, -12, 3, 14);
      ctx.fillRect(-8, 2, 18, 4);
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(-1, 2, 4, 4);
    }

    // 3. Cabeça, Cabelo, Face e Acessórios
    ctx.fillStyle = skinColor;
    ctx.fillRect(-4, -22, 12, 10); // Rosto Base

    if (charId === 'claudio') {
      // === CLAUDIO: CABELO FADE DE ALTA DEFINIÇÃO, BIGODE, CAVANHAQUE, BRINCO DE DIAMANTE E PINTURA DE GUERRA ===
      // Cabelo Escuro com Topete e Fade Gradual Suave Fiel à Foto
      ctx.fillStyle = '#171412';
      ctx.fillRect(-5, -25, 14, 5); // Topo do cabelo volumoso
      ctx.fillRect(-6, -23, 3, 4); // Lateral fade

      // Linha do Cabelo / Pezinho Alinhado e Definido
      ctx.fillStyle = '#261f1a';
      ctx.fillRect(-3, -24, 11, 2);

      // Olhos Expressivos e Vivos
      ctx.fillStyle = '#14100e';
      ctx.fillRect(3, -19, 3, 2);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(4, -19, 1, 1); // Brilho no olhar

      // Sobrancelha estilosa e delineada
      ctx.fillStyle = '#181412';
      ctx.fillRect(2, -21, 5, 1.5);

      // Bigode Aparado Fiel à Foto
      ctx.fillStyle = '#181412';
      ctx.fillRect(3, -15, 6, 1.5);

      // Cavanhaque / Barbicha no Queixo Fiel à Foto
      ctx.fillStyle = '#181412';
      ctx.fillRect(3, -13, 4, 2.5);

      // --- PINTURA DE GUERRA VERMELHA PASSANDO PELO OLHO (NORDIC WAR STRIPE) ---
      if (p.hasWarPaint || p.weapon === 'AXE' || charId === 'claudio') {
        ctx.save();
        ctx.fillStyle = '#dc2626'; // Vermelho Sangue / Guerra
        ctx.shadowColor = '#ff0033';
        ctx.shadowBlur = 4;
        ctx.fillRect(4, -24, 2.5, 12);
        ctx.fillStyle = '#ff4466';
        ctx.fillRect(4, -19, 2, 2);
        ctx.restore();
      }

      // Orelha e Brinco de Diamante Brilhante com Efeito Shimmer
      ctx.fillStyle = skinColor;
      ctx.fillRect(-6, -19, 3, 4); // Orelha

      // Brinco de Diamante com Brilho Realista
      ctx.fillStyle = '#f0f0f0';
      ctx.fillRect(-6, -17, 2, 2);

      // Brilho pulsante / Sparkle no brinco de diamante
      const glint = Math.abs(Math.sin(this.time * 8));
      if (glint > 0.4) {
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = '#00ffff';
        ctx.shadowBlur = 10;
        ctx.fillRect(-7, -18, 3, 3);
        ctx.shadowBlur = 0;
      }

    } else if (charId === 'jessica') {
      // === JESSICA: CABELO LONGO CASTANHO ESCURO LISO, OLHOS EXPRESSIVOS E DETALHES FIÉIS À FOTO ===
      // Cabelo Longo Castanho Escuro Sedoso descendo pelas costas e ombros
      ctx.fillStyle = '#1e1510';
      // Parte de trás do cabelo longo
      ctx.fillRect(-7, -25, 16, 26);
      ctx.fillRect(-8, -18, 6, 20); // Mecha esquerda caindo pelas costas
      ctx.fillRect(5, -18, 6, 20); // Mecha direita caindo sobre o ombro

      // Topo e Franja do Cabelo
      ctx.fillStyle = '#2d1e17';
      ctx.fillRect(-5, -26, 14, 6);
      // Divisão do cabelo no meio/lateral e mechas frontais
      ctx.fillStyle = '#3a271e';
      ctx.fillRect(-4, -24, 5, 4);
      ctx.fillRect(2, -24, 6, 4);

      // Olhos Castanhos Expressivos e Bonitos
      ctx.fillStyle = '#1c130d';
      ctx.fillRect(3, -19, 3, 2);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(4, -19, 1, 1); // Brilho encantador no olhar

      // Sobrancelhas Arqueadas Delicadas e Delineadas
      ctx.fillStyle = '#261811';
      ctx.fillRect(2, -21, 5, 1.2);

      // Lábios Suaves com Leve Tom Rosado Natural
      ctx.fillStyle = '#e07a7a';
      ctx.fillRect(3, -14, 4, 1.5);

      // Brinco Discreto e Elegante
      ctx.fillStyle = '#fef08a';
      ctx.fillRect(-5, -17, 1.5, 1.5);

    } else if (charId === 'marco') {
      // === MARCO: BANDANA VERMELHA E CABELO LOIRO ===
      ctx.fillStyle = '#111';
      ctx.fillRect(4, -19, 3, 2);
      ctx.fillStyle = '#d9aa38';
      ctx.fillRect(-6, -24, 14, 4);
      ctx.fillStyle = '#ff1a1a';
      ctx.fillRect(-6, -22, 15, 4);

      const bandanaWave1 = Math.sin(this.time * 22) * 5;
      const bandanaWave2 = Math.cos(this.time * 18) * 6;
      ctx.beginPath();
      ctx.moveTo(-6, -20);
      ctx.quadraticCurveTo(-14, -20 + bandanaWave1, -22, -18 + bandanaWave2);
      ctx.lineTo(-20, -15 + bandanaWave2);
      ctx.quadraticCurveTo(-12, -17 + bandanaWave1, -6, -17);
      ctx.fill();

    } else if (charId === 'tarma') {
      // === TARMA: ÓCULOS ESCUROS E CABELO ESPETADO ===
      ctx.fillStyle = '#18181b';
      ctx.fillRect(-6, -26, 14, 6);
      ctx.beginPath();
      ctx.moveTo(-3, -26);
      ctx.lineTo(0, -29);
      ctx.lineTo(3, -26);
      ctx.fill();

      // Óculos Escuros Aviador com Reflexo Neon
      ctx.fillStyle = '#09090b';
      ctx.fillRect(1, -19, 8, 4);
      ctx.fillStyle = '#00d9ff';
      ctx.fillRect(2, -18, 3, 1.5);

    } else if (charId === 'fio') {
      // === FIO: BOINA MILITAR VERDE E ÓCULOS ===
      ctx.fillStyle = '#452b1b';
      ctx.fillRect(-5, -23, 12, 5); // Cabelo Castanho

      // Boina Verde
      ctx.fillStyle = '#3f5734';
      ctx.beginPath();
      ctx.ellipse(0, -23, 10, 5, -0.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffcc00'; // Emblema
      ctx.fillRect(2, -25, 2, 2);

      // Óculos Redondos Táticos
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(3, -19, 5, 4);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.fillRect(4, -18, 3, 2);
    }

    // 4. Braços e Arma com Rotação de Mira (8 Direções) + ANIMAÇÃO DE ATAQUE VERTICAL/SPIN
    let aimAngle = 0;
    if (p.aimY < 0) {
      aimAngle = p.aimX !== 0 ? -Math.PI / 4 : -Math.PI / 2;
    } else if (p.aimY > 0 && !p.onGround) {
      aimAngle = Math.PI / 2;
    }

    // ANIMAÇÃO ESPECIAL DO MACHADO
    let axeSwingAngle = 0;
    
    if (p.isSpinning && p.weapon === 'AXE') {
      // SPIN 360° - Girar o braço completamente
      axeSwingAngle = p.spinAngle;
      aimAngle = axeSwingAngle;
      
      // Efeito de blur/rastro durante spin
      ctx.globalAlpha = 0.7 + Math.sin(p.spinAngle * 4) * 0.3;
    } else if (p.isAttacking && p.weapon === 'AXE') {
      // ATAQUE VERTICAL ESTILO DARIUS - De CIMA para BAIXO
      const attackProgress = 1 - (p.meleeAttackTime / 0.4);
      
      // Movimento de -90° (topo) até +90° (chão) em arco vertical
      axeSwingAngle = -Math.PI / 2 + (attackProgress * Math.PI); // -90° até +90°
      aimAngle = axeSwingAngle;
    }

    ctx.save();
    ctx.translate(4, -3);
    ctx.rotate(aimAngle);

    // Recoil da Arma quando atira
    const recoil = p.shootRecoil ? -5 : 0;
    ctx.translate(recoil, 0);

    // Desenhar a Arma Atual Segurada
    this.drawWeaponSprite(ctx, p.weapon, p.isAttacking || p.isSpinning, p.meleeAttackTime, p.isSpinning);

    ctx.globalAlpha = 1.0; // Restaurar alpha

    // Manga da Roupa do Braço (MELHORADA)
    if (charId === 'claudio') {
      // Manga branca arregaçada com sombra
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = 'rgba(0,0,0,0.1)';
      ctx.shadowBlur = 2;
      ctx.fillRect(-6, -5, 7, 7);
      ctx.shadowBlur = 0;
      
      // Antebraço com tom de pele melhorado
      ctx.fillStyle = skinColor;
      ctx.fillRect(-1, -4, 7, 6);
      
      // Relógio Tático no Pulso (detalhado)
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(2, -5, 3, 7);
      ctx.fillStyle = '#00d9ff';
      ctx.fillRect(2.5, -4, 2, 2);
      
      // Luva tática sem dedos
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(4, -2, 5, 5);
      ctx.fillStyle = skinColor;
      ctx.fillRect(5, -1, 3, 2); // Dedos visíveis
    } else {
      ctx.fillStyle = skinColor;
      ctx.fillRect(-4, -3, 8, 5);
      ctx.fillStyle = '#222';
      ctx.fillRect(2, -2, 5, 5);
    }

    // Muzzle Flash / Clarão do Tiro
    if (p.shootFlashTimer > 0) {
      this.drawMuzzleFlash(ctx, 22, -2, p.weapon);
    }

    ctx.restore(); // Fim do braço/arma

    // 5. Ataque Corpo a Corpo (Faca Tática ou Machado Nórdico)
    if (p.meleeTimer > 0) {
      this.drawMeleeSlash(ctx, p.meleeTimer, charId, p.weapon === 'AXE');
    }

    ctx.restore(); // Fim do torso

    // 6. Tag Flutuante do Jogador (1P / 2P)
    if (p.playerIndex !== undefined) {
      ctx.fillStyle = p.playerIndex === 0 ? '#00d9ff' : '#ffaa00';
      ctx.font = 'bold 7px "Press Start 2P", monospace';
      ctx.textAlign = 'center';
      ctx.shadowColor = '#000';
      ctx.shadowBlur = 4;
      ctx.fillText(p.playerIndex === 0 ? '1P' : '2P', 0, -32);
      ctx.shadowBlur = 0;
    }

    ctx.restore(); // Fim do player
  }

  // Desenho dos Sprites de Armas (MACHADO MELHORADO)
  drawWeaponSprite(ctx, weapon, isAttacking = false, attackTime = 0, isSpinning = false) {
    switch (weapon) {
      case 'AXE':
        // --- MACHADO NÓRDICO LEVIATHAN (DOURADO E PRETO COM RUNAS DETALHADAS) ---
        ctx.save();
        
        // Efeito de brilho pulsante durante ataque ou spin
        if (isAttacking || isSpinning) {
          ctx.shadowColor = isSpinning ? '#ff3300' : '#ffd700';
          ctx.shadowBlur = isSpinning ? 25 : 15 + Math.sin(this.time * 40) * 5;
        }

        ctx.translate(6, -8);
        
        // Cabo de Madeira Entalhada Nórdica (textura melhorada)
        const handleGrad = ctx.createLinearGradient(0, 8, 0, 12);
        handleGrad.addColorStop(0, '#2d1f0c');
        handleGrad.addColorStop(0.5, '#3d2f1f');
        handleGrad.addColorStop(1, '#1a1816');
        ctx.fillStyle = handleGrad;
        ctx.fillRect(-10, 8, 24, 5);
        
        // Entalhes no cabo
        ctx.strokeStyle = '#4a3625';
        ctx.lineWidth = 1;
        for (let x = -8; x < 14; x += 4) {
          ctx.beginPath();
          ctx.moveTo(x, 8);
          ctx.lineTo(x, 13);
          ctx.stroke();
        }
        
        // Detalhes Dourados no cabo (grip rúnico)
        ctx.fillStyle = '#d4af37';
        ctx.fillRect(-7, 9, 5, 3);
        ctx.fillRect(0, 9, 5, 3);
        ctx.fillRect(7, 9, 5, 3);
        
        // Círculos rúnicos no grip
        ctx.fillStyle = '#ffd700';
        for (let x = -5; x <= 9; x += 7) {
          ctx.beginPath();
          ctx.arc(x, 10.5, 1.5, 0, Math.PI * 2);
          ctx.fill();
        }

        // Anel de Fixação Dourado no Topo (mais detalhado)
        ctx.fillStyle = '#ffd700';
        ctx.fillRect(12, 6, 6, 9);
        ctx.fillStyle = '#b8860b';
        ctx.fillRect(13, 7, 4, 1);
        ctx.fillRect(13, 13, 4, 1);

        // Lâmina Negra Larga (forma mais agressiva)
        ctx.fillStyle = '#0d1117';
        ctx.beginPath();
        ctx.moveTo(15, 7);
        ctx.lineTo(30, -8);
        ctx.quadraticCurveTo(36, 11, 30, 26);
        ctx.lineTo(15, 13);
        ctx.closePath();
        ctx.fill();

        // Fio da Lâmina em Prata Polida (mais brilhante)
        ctx.strokeStyle = '#f0f0f0';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(30, -8);
        ctx.quadraticCurveTo(36, 11, 30, 26);
        ctx.stroke();

        // Entalhes Rúnicos Dourados BRILHANTES na Lâmina
        ctx.fillStyle = '#ffee00';
        ctx.shadowColor = '#ffcc00';
        ctx.shadowBlur = 8;
        
        // Runas nórdicas estilizadas
        ctx.fillRect(19, 5, 8, 2);
        ctx.fillRect(21, 9, 5, 2);
        ctx.fillRect(20, 13, 6, 2);
        
        // Símbolos rúnicos
        ctx.strokeStyle = '#ffd700';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(20, 6);
        ctx.lineTo(24, 6);
        ctx.lineTo(22, 4);
        ctx.stroke();

        ctx.shadowBlur = 0;

        // Espigão Traseiro pontiagudo
        ctx.fillStyle = '#d4af37';
        ctx.beginPath();
        ctx.moveTo(10, 4);
        ctx.lineTo(12, 6);
        ctx.lineTo(12, 14);
        ctx.lineTo(10, 16);
        ctx.fill();

        // Ponta Superior da lâmina (spike)
        ctx.fillStyle = '#ffd700';
        ctx.beginPath();
        ctx.moveTo(27, -9);
        ctx.lineTo(30, -8);
        ctx.lineTo(29, -6);
        ctx.fill();

        // Trilha de energia dourada durante ataque/spin
        if (isAttacking || isSpinning) {
          const trailCount = isSpinning ? 12 : 5; // Mais trilhas no spin!
          for (let i = 0; i < trailCount; i++) {
            ctx.fillStyle = isSpinning ? 
              `rgba(255, 100, 0, ${0.9 - i * 0.06})` : // Laranja intenso no spin
              `rgba(255, 215, 0, ${0.6 - i * 0.1})`;
            ctx.fillRect(25 + i * 3, 6 - i * 1.5, 4, 10 + i * 0.5);
          }
          
          // Círculo de energia no spin
          if (isSpinning) {
            ctx.strokeStyle = `rgba(255, 215, 0, ${0.8 - Math.sin(this.time * 30) * 0.3})`;
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(30, 10, 15 + Math.sin(this.time * 20) * 5, 0, Math.PI * 2);
            ctx.stroke();
          }
        }

        ctx.restore();
        break;

      case 'BOW':
        // --- ARCO TÁTICO CYBER DA JESSICA (CURVAS EM FIBRA DE CARBONO E CORDA DE ENERGIA CIANO) ---
        ctx.save();
        ctx.translate(6, -2);
        
        // Empunhadura Riser Central em Carbono
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, -6, 5, 12);
        ctx.fillStyle = '#00d9ff';
        ctx.fillRect(1, -3, 3, 6); // Núcleo de energia ciano

        // Membros do Arco Recurvo (Laminas Superior e Inferior)
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        // Membro Superior
        ctx.moveTo(2, -5);
        ctx.quadraticCurveTo(8, -16, 2, -24);
        ctx.stroke();
        // Membro Inferior
        ctx.beginPath();
        ctx.moveTo(2, 5);
        ctx.quadraticCurveTo(8, 16, 2, 24);
        ctx.stroke();

        // Linhas de Detalhe Neon nas Lâminas
        ctx.strokeStyle = '#00ffff';
        ctx.lineWidth = 1.5;
        ctx.shadowColor = '#00ffff';
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.moveTo(3, -6);
        ctx.quadraticCurveTo(7, -15, 3, -22);
        ctx.moveTo(3, 6);
        ctx.quadraticCurveTo(7, 15, 3, 22);
        ctx.stroke();

        // Corda de Plasma / Energia Luminescente
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.2;
        ctx.shadowColor = '#00d9ff';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.moveTo(2, -24);
        ctx.lineTo(-4, 0); // Ponto de tração
        ctx.lineTo(2, 24);
        ctx.stroke();

        // Flecha Encaixada Pronta para o Disparo (Nocked Arrow)
        ctx.fillStyle = '#e2e8f0';
        ctx.fillRect(-6, -1, 24, 2); // Haste
        ctx.fillStyle = '#00ffff'; // Ponta de energia brilhante
        ctx.beginPath();
        ctx.moveTo(18, -3);
        ctx.lineTo(24, 0);
        ctx.lineTo(18, 3);
        ctx.closePath();
        ctx.fill();
        // Penas traseiras da flecha
        ctx.fillStyle = '#c084fc';
        ctx.fillRect(-6, -3, 3, 2);
        ctx.fillRect(-6, 1, 3, 2);

        ctx.shadowBlur = 0;
        ctx.restore();
        break;

      case 'HMG':
        // Heavy Machine Gun: Corpo robusto cinza chumbo com tambor de munição e cano duplo
        ctx.fillStyle = '#2d3748';
        ctx.fillRect(0, -5, 18, 7);
        ctx.fillStyle = '#1a202c';
        ctx.fillRect(4, 2, 8, 7); // Tambor redondo
        ctx.fillStyle = '#718096';
        ctx.fillRect(18, -4, 6, 4); // Cano
        ctx.fillStyle = '#ff9900';
        ctx.fillRect(6, -7, 4, 2); // Mira ótica
        break;

      case 'SHOTGUN':
        // Shotgun: Escopeta de cano serrado com coronha de madeira e cano duplo grosso
        ctx.fillStyle = '#61482b'; // Madeira
        ctx.fillRect(-2, -3, 8, 6);
        ctx.fillStyle = '#2d3748'; // Aço
        ctx.fillRect(6, -5, 16, 7);
        ctx.fillStyle = '#111';
        ctx.fillRect(20, -5, 4, 3);
        ctx.fillRect(20, -1, 4, 3);
        break;

      case 'ROCKET':
        // Rocket Launcher / Bazooka militar verde com ogiva
        ctx.fillStyle = '#3b4a2c';
        ctx.fillRect(-6, -7, 26, 9);
        ctx.fillStyle = '#ff3300';
        ctx.fillRect(20, -6, 5, 7); // Ponta do míssil
        ctx.fillStyle = '#111';
        ctx.fillRect(2, -10, 4, 3); // Mira
        break;

      case 'FLAME':
        // Flame Shot: Tanque pressurizado e bico de ignição com chama piloto
        ctx.fillStyle = '#c53030';
        ctx.fillRect(0, -6, 16, 8);
        ctx.fillStyle = '#e2e8f0';
        ctx.fillRect(16, -4, 6, 4);
        ctx.fillStyle = '#00d9ff';
        ctx.fillRect(22, -3, 2, 2); // Piloto azul
        break;

      case 'LASER':
        // Laser Gun: Futurista branca/ciano com bobinas de energia
        ctx.fillStyle = '#edf2f7';
        ctx.fillRect(0, -5, 18, 7);
        ctx.fillStyle = '#00d9ff';
        ctx.fillRect(4, -3, 10, 3); // Núcleo brilhante
        ctx.fillStyle = '#4a5568';
        ctx.fillRect(18, -4, 5, 5);
        break;

      default:
        // Pistola Padrão Semi-Automática Metal Slug
        ctx.fillStyle = '#4a5568';
        ctx.fillRect(0, -4, 12, 5);
        ctx.fillStyle = '#1a202c';
        ctx.fillRect(-2, 0, 5, 6);
        break;
    }
  }

  // Clarão de Tiro (Muzzle Flash)
  drawMuzzleFlash(ctx, x, y, weapon) {
    ctx.save();
    ctx.translate(x, y);

    const size = weapon === 'SHOTGUN' ? 24 : (weapon === 'HMG' ? 16 : 10);
    const colorCore = weapon === 'LASER' ? '#00ffff' : (weapon === 'FLAME' ? '#ff3300' : '#ffffff');
    const colorOuter = weapon === 'LASER' ? '#0088ff' : (weapon === 'FLAME' ? '#ffaa00' : '#ff9900');

    // Espículas de fogo
    ctx.fillStyle = colorOuter;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(size, -size * 0.6);
    ctx.lineTo(size * 0.7, 0);
    ctx.lineTo(size * 1.3, 0);
    ctx.lineTo(size * 0.7, 0);
    ctx.lineTo(size, size * 0.6);
    ctx.closePath();
    ctx.fill();

    // Núcleo branco incandescente
    ctx.fillStyle = colorCore;
    ctx.beginPath();
    ctx.arc(4, 0, size * 0.35, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  // Efeito de Corte de Faca ou Machado Nórdico (Melee Attack)
  drawMeleeSlash(ctx, timer, charId = 'claudio', isAxe = false) {
    ctx.save();
    
    if (isAxe || charId === 'claudio') {
      // --- CORTE ÉPICO DO MACHADO NÓRDICO (ONDA DOURADA MASSIVA EM ARCO LARGO) ---
      const progress = 1 - (timer / 0.4); // Normalizar de 0 a 1
      const startAngle = -Math.PI * 0.7 + progress * 1.2;
      const endAngle = Math.PI * 0.7 + progress * 1.2;

      // Arco externo dourado brilhante
      ctx.strokeStyle = '#ffd700';
      ctx.shadowColor = '#ffaa00';
      ctx.shadowBlur = 20;
      ctx.lineWidth = 8;

      ctx.beginPath();
      ctx.arc(18, 0, 50, startAngle, endAngle);
      ctx.stroke();

      // Arco médio branco incandescente
      ctx.strokeStyle = '#ffffff';
      ctx.shadowBlur = 15;
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.arc(18, 0, 48, startAngle, endAngle);
      ctx.stroke();

      // Arco interno com efeito de energia rúnica
      ctx.strokeStyle = '#ffee00';
      ctx.shadowBlur = 10;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(18, 0, 45, startAngle, endAngle);
      ctx.stroke();

      // Desenhar o machado físico em movimento no arco
      const midAngle = (startAngle + endAngle) / 2;
      const axeX = 18 + Math.cos(midAngle) * 45;
      const axeY = Math.sin(midAngle) * 45;

      ctx.save();
      ctx.translate(axeX, axeY);
      ctx.rotate(midAngle + Math.PI / 2);

      // Lâmina preta do machado
      ctx.fillStyle = '#11161d';
      ctx.beginPath();
      ctx.moveTo(-8, -6);
      ctx.lineTo(8, -12);
      ctx.lineTo(12, 0);
      ctx.lineTo(8, 12);
      ctx.lineTo(-8, 6);
      ctx.closePath();
      ctx.fill();

      // Detalhes dourados na lâmina
      ctx.fillStyle = '#ffd700';
      ctx.fillRect(-4, -8, 10, 3);
      ctx.fillRect(-4, 5, 10, 3);

      // Cabo do machado
      ctx.fillStyle = '#3d2f1f';
      ctx.fillRect(-12, -2, 8, 4);

      ctx.restore();

      // Partículas de energia ao longo do arco
      for (let a = startAngle; a < endAngle; a += 0.3) {
        const px = 18 + Math.cos(a) * (45 + Math.random() * 8);
        const py = Math.sin(a) * (45 + Math.random() * 8);
        ctx.fillStyle = Math.random() > 0.5 ? '#ffcc00' : '#ffffff';
        ctx.fillRect(px - 2, py - 2, 4, 4);
      }

    } else {
      // Corte padrão de facão
      const slashColor = '#00d9ff';
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.95)';
      ctx.shadowColor = slashColor;
      ctx.shadowBlur = 10;
      ctx.lineWidth = 4;

      const progress = 1 - timer;
      const startAngle = -Math.PI / 3 + progress * 0.5;
      const endAngle = Math.PI / 3 + progress * 0.5;

      ctx.beginPath();
      ctx.arc(10, 0, 30, startAngle, endAngle);
      ctx.stroke();

      // Lâmina de aço
      ctx.fillStyle = '#cbd5e0';
      ctx.fillRect(14, -2, 16, 4);
      ctx.fillStyle = '#ff0055';
      ctx.fillRect(10, -3, 4, 6);
    }

    ctx.restore();
  }

  // --- RENDERIZAÇÃO DO VEÍCULO PILOTÁVEL (THE CYBER SLUG - MINI TANK) ---
  drawSlug(ctx, camera, slug, driverChar = 'claudio') {
    ctx.save();
    ctx.translate(slug.x - camera.x + slug.width / 2, slug.y - camera.y + slug.height / 2);
    ctx.scale(slug.facing, 1);

    const bounce = Math.sin(this.time * 12) * (Math.abs(slug.vx) > 0.1 ? 2 : 0.5);

    // 1. Esteiras e Rodas de Trator Bouncing
    ctx.fillStyle = '#1a202c';
    ctx.beginPath();
    ctx.roundRect(-30, 10, 60, 16, 8);
    ctx.fill();

    // Rodas giratórias com detalhes
    ctx.fillStyle = '#4a5568';
    for (let wx = -20; wx <= 20; wx += 13) {
      ctx.beginPath();
      ctx.arc(wx, 18, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffcc00';
      ctx.beginPath();
      ctx.arc(wx, 18, 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#4a5568';
    }

    // 2. Chassis Blindado Azul/Cinza Militar (Dourado se for Tarma Buffed)
    ctx.save();
    ctx.translate(0, bounce);

    const chassisGrad = ctx.createLinearGradient(0, -18, 0, 10);
    if (slug.tarmaBuffed) {
      chassisGrad.addColorStop(0, '#785b2e');
      chassisGrad.addColorStop(0.6, '#4f3b1b');
      chassisGrad.addColorStop(1, '#2d1f0c');
    } else {
      chassisGrad.addColorStop(0, '#4a658a');
      chassisGrad.addColorStop(0.6, '#2e4361');
      chassisGrad.addColorStop(1, '#1b2a3f');
    }
    ctx.fillStyle = chassisGrad;

    // Formato arredondado icônico do Metal Slug Tank
    ctx.beginPath();
    ctx.moveTo(-26, 10);
    ctx.lineTo(26, 10);
    ctx.lineTo(22, -10);
    ctx.lineTo(-20, -10);
    ctx.closePath();
    ctx.fill();

    // Rebites e Emblema de Estrela
    ctx.fillStyle = slug.tarmaBuffed ? '#ffcc00' : '#fff';
    ctx.font = '10px sans-serif';
    ctx.fillText('★', -4, 4);

    // Escapamento com fumaça
    ctx.fillStyle = '#718096';
    ctx.fillRect(-28, -6, 6, 6);
    if (Math.random() < 0.3) {
      ctx.fillStyle = 'rgba(200, 200, 200, 0.5)';
      ctx.beginPath();
      ctx.arc(-32 - Math.random() * 6, -6 - Math.random() * 4, 4 + Math.random() * 4, 0, Math.PI * 2);
      ctx.fill();
    }

    // 3. Torreta Superior com Canhão e Metralhadoras Vulcan
    ctx.fillStyle = slug.tarmaBuffed ? '#5c4520' : '#3b5373';
    ctx.beginPath();
    ctx.arc(0, -12, 14, Math.PI, 0);
    ctx.fill();

    // Escotilha do Comandante
    ctx.fillStyle = '#1a202c';
    ctx.fillRect(-8, -16, 16, 4);

    // Se o jogador estiver dentro, desenhar o herói selecionado aparecendo na escotilha
    if (slug.isOccupied) {
      const dChar = slug.driverCharacterId || driverChar;
      if (dChar === 'claudio') {
        // Claudio no cockpit do tanque com fade, brinco, camisa branca e pintura de guerra
        ctx.fillStyle = '#dfad88';
        ctx.fillRect(-4, -24, 8, 8); // Rosto
        ctx.fillStyle = '#171412';
        ctx.fillRect(-5, -26, 10, 4); // Cabelo Fade
        ctx.fillStyle = '#dc2626';
        ctx.fillRect(0, -25, 2, 8); // Listra de guerra
        ctx.fillStyle = '#181412';
        ctx.fillRect(0, -18, 4, 2); // Bigode/Cavanhaque
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(-5, -20, 2, 2); // Brinco
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(-6, -16, 12, 4); // Camisa branca
      } else if (dChar === 'tarma') {
        ctx.fillStyle = '#e6b280';
        ctx.fillRect(-4, -24, 8, 8);
        ctx.fillStyle = '#18181b';
        ctx.fillRect(-5, -26, 10, 4);
        ctx.fillStyle = '#09090b';
        ctx.fillRect(-1, -21, 6, 3);
        ctx.fillStyle = '#6b4423';
        ctx.fillRect(-6, -16, 12, 4);
      } else if (dChar === 'fio') {
        ctx.fillStyle = '#f5c6a5';
        ctx.fillRect(-4, -24, 8, 8);
        ctx.fillStyle = '#3f5734';
        ctx.fillRect(-5, -26, 10, 4);
        ctx.fillStyle = '#222';
        ctx.strokeRect(0, -21, 4, 3);
        ctx.fillStyle = '#d7c4a8';
        ctx.fillRect(-6, -16, 12, 4);
      } else {
        ctx.fillStyle = '#f0be8b';
        ctx.fillRect(-4, -24, 8, 8);
        ctx.fillStyle = '#ff1a1a';
        ctx.fillRect(-5, -24, 10, 3);
        ctx.fillStyle = '#d92626';
        ctx.fillRect(-6, -16, 12, 4);
      }
    }

    // Canhão Principal de 120mm
    ctx.save();
    ctx.translate(4, -10);
    ctx.rotate(slug.cannonAngle || 0);
    ctx.fillStyle = '#2d3748';
    ctx.fillRect(0, -4, 26, 8);
    ctx.fillStyle = '#1a202c';
    ctx.fillRect(22, -5, 6, 10); // Boca do canhão
    ctx.restore();

    // Metralhadora Vulcan Giratória Inferior
    ctx.fillStyle = '#1a202c';
    ctx.fillRect(12, 0, 14, 4);
    ctx.fillRect(14, 4, 12, 4);

    ctx.restore(); // Fim do chassis
    ctx.restore(); // Fim do slug
  }

  // --- FRAGMENTOS DA EXECUÇÃO DO CLAUDIO ---
  drawExecutionEffects(ctx, camera, effects) {
    if (!effects || effects.length === 0) return;

    const palette = {
      tokyo: ['#1e293b', '#00d9ff'],
      brazil: ['#355e3b', '#a0ff3c'],
      europe: ['#475569', '#ffcc00'],
      egypt: ['#8f5c38', '#ffd700']
    };

    ctx.save();
    effects.forEach(effect => {
      const [armor, accent] = palette[effect.biome] || palette.tokyo;
      const progress = Math.max(0, effect.life / effect.maxLife);
      const split = effect.split * (effect.direction || 1);

      ctx.save();
      ctx.translate(effect.x - camera.x, effect.y - camera.y - effect.rise);
      ctx.globalAlpha = progress;
      ctx.shadowColor = accent;
      ctx.shadowBlur = 14 * progress;

      // Metade esquerda do inimigo, arremessada para fora.
      ctx.save();
      ctx.translate(-split, -effect.split * 0.22);
      ctx.rotate(-0.18 * (effect.direction || 1));
      ctx.fillStyle = armor;
      ctx.beginPath();
      ctx.moveTo(-14, -22);
      ctx.lineTo(-1, -18);
      ctx.lineTo(-2, 19);
      ctx.lineTo(-15, 22);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = accent;
      ctx.fillRect(-12, -8, 9, 3);
      ctx.restore();

      // Metade direita, espelhada, deixando a divisão visual nítida.
      ctx.save();
      ctx.translate(split, effect.split * 0.22);
      ctx.rotate(0.18 * (effect.direction || 1));
      ctx.fillStyle = armor;
      ctx.beginPath();
      ctx.moveTo(14, -22);
      ctx.lineTo(1, -18);
      ctx.lineTo(2, 19);
      ctx.lineTo(15, 22);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = accent;
      ctx.fillRect(3, -8, 9, 3);
      ctx.restore();

      // Traço rúnico do machado no ponto da divisão.
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(-3, -30);
      ctx.lineTo(4, 27);
      ctx.stroke();
      ctx.strokeStyle = accent;
      ctx.lineWidth = 7;
      ctx.globalAlpha = progress * 0.45;
      ctx.beginPath();
      ctx.moveTo(-3, -30);
      ctx.lineTo(4, 27);
      ctx.stroke();
      ctx.restore();
    });
    ctx.restore();
  }

  // --- INIMIGOS ADAPTADOS A CADA BIOMA COM IDENTIDADE VISUAL ÚNICA ---
  drawEnemy(ctx, camera, e) {
    ctx.save();
    ctx.translate(e.x - camera.x + e.width / 2, e.y - camera.y + e.height / 2);
    // Leve aumento visual para os inimigos não parecerem miniaturas perto do
    // cenário, sem alterar as hitboxes e o equilíbrio do combate.
    ctx.translate(0, -2);
    ctx.scale(e.facing * 1.1, 1.1);

    if (e.flashTimer > 0) {
      ctx.filter = 'brightness(2.5)';
    }

    const biome = e.biome || 'tokyo';

    // Sombra projetada
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.beginPath();
    ctx.ellipse(0, e.height / 2 - 1, 14, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    if (e.type === 'soldier') {
      const walk = Math.sin(this.time * 12 + e.id) * 0.4;

      if (biome === 'tokyo') {
        // [TÓQUIO] Soldado Cyberpunk Tático com Visor Neon e Exoesqueleto
        ctx.fillStyle = '#111424';
        ctx.fillRect(-6 + walk * 4, 4, 5, 12);
        ctx.fillRect(2 - walk * 4, 4, 5, 12);
        ctx.fillStyle = '#00d9ff';
        ctx.fillRect(-6 + walk * 4, 8, 5, 2); // Linhas de neon nas pernas
        ctx.fillRect(2 - walk * 4, 8, 5, 2);

        ctx.fillStyle = '#1e243b';
        ctx.fillRect(-7, -8, 14, 14); // Colete blindado
        ctx.fillStyle = '#ff0055';
        ctx.fillRect(-7, -2, 14, 2); // Faixa de neon magenta

        // Capacete Cyber com Visor Ciano Brilhante
        ctx.fillStyle = '#0a0d18';
        ctx.fillRect(-4, -18, 10, 10);
        ctx.fillStyle = '#00d9ff';
        ctx.shadowColor = '#00d9ff';
        ctx.shadowBlur = 6;
        ctx.fillRect(0, -15, 6, 3);
        ctx.shadowBlur = 0;

        // Rifle de Plasma Cyberpunk
        ctx.fillStyle = '#2d3748';
        ctx.fillRect(2, -5, 18, 5);
        ctx.fillStyle = '#00d9ff';
        ctx.fillRect(8, -4, 6, 2);

      } else if (biome === 'brazil') {
        // [BRASIL] Guerrilheiro da Selva com Camuflagem, Bandana Vermelha e Colete
        ctx.fillStyle = '#2d3b24'; // Calça camuflada
        ctx.fillRect(-6 + walk * 4, 4, 5, 12);
        ctx.fillRect(2 - walk * 4, 4, 5, 12);

        ctx.fillStyle = '#415233'; // Camisa militar
        ctx.fillRect(-7, -8, 14, 14);
        ctx.fillStyle = '#61472a'; // Coldre e canivete
        ctx.fillRect(-7, -1, 14, 3);

        // Cabeça com Bandana Vermelha
        ctx.fillStyle = '#e8a974';
        ctx.fillRect(-3, -16, 8, 8);
        ctx.fillStyle = '#d91414'; // Bandana vermelha
        ctx.fillRect(-5, -17, 11, 4);
        ctx.fillRect(-7, -15, 3, 6); // Ponta da bandana ao vento

        // Fuzil com coronha de madeira
        ctx.fillStyle = '#5c3a21';
        ctx.fillRect(-2, -3, 6, 4);
        ctx.fillStyle = '#1a202c';
        ctx.fillRect(2, -4, 16, 4);

      } else if (biome === 'europe') {
        // [EUROPA] Guarda Real do Castelo com Sobretudo Azul-Marinho e Botões Dourados
        ctx.fillStyle = '#1c2233';
        ctx.fillRect(-6 + walk * 4, 4, 5, 12);
        ctx.fillRect(2 - walk * 4, 4, 5, 12);
        ctx.fillStyle = '#000';
        ctx.fillRect(-7 + walk * 4, 12, 7, 5);
        ctx.fillRect(1 - walk * 4, 12, 7, 5);

        ctx.fillStyle = '#203254'; // Casaco clássico
        ctx.fillRect(-7, -8, 14, 14);
        ctx.fillStyle = '#ffcc00'; // Botões dourados
        ctx.fillRect(-1, -6, 2, 2);
        ctx.fillRect(-1, -2, 2, 2);

        // Quepe Militar com Insígnia
        ctx.fillStyle = '#f0be8b';
        ctx.fillRect(-3, -16, 8, 8);
        ctx.fillStyle = '#152238';
        ctx.fillRect(-6, -19, 13, 5);
        ctx.fillStyle = '#ffcc00';
        ctx.fillRect(0, -18, 3, 2);

        // Carabina Clássica
        ctx.fillStyle = '#4a2f1b';
        ctx.fillRect(-2, -4, 18, 4);
        ctx.fillStyle = '#8a99ad';
        ctx.fillRect(12, -4, 6, 3);

      } else {
        // [EGITO] Soldado dos Faraós com Armadura Dourada e Lápis-Lazúli
        ctx.fillStyle = '#2c1e13';
        ctx.fillRect(-6 + walk * 4, 4, 5, 12);
        ctx.fillRect(2 - walk * 4, 4, 5, 12);

        ctx.fillStyle = '#b07d50'; // Túnica do deserto
        ctx.fillRect(-7, -8, 14, 14);
        ctx.fillStyle = '#ffd700'; // Peitoral de ouro
        ctx.fillRect(-6, -8, 12, 6);
        ctx.fillStyle = '#0066cc'; // Lápis-lazúli
        ctx.fillRect(-3, -6, 6, 3);

        // Tocado Egípcio Nemes Dourado e Azul
        ctx.fillStyle = '#e8a974';
        ctx.fillRect(-3, -16, 8, 8);
        ctx.fillStyle = '#ffd700';
        ctx.fillRect(-5, -20, 11, 6);
        ctx.fillStyle = '#0066cc';
        ctx.fillRect(-5, -17, 11, 2);

        // Lança/Fuzil de Energia Dourada
        ctx.fillStyle = '#ffd700';
        ctx.fillRect(2, -4, 18, 4);
        ctx.fillStyle = '#ff3300';
        ctx.fillRect(16, -5, 4, 6);
      }

    } else if (e.type === 'shield') {
      if (biome === 'tokyo') {
        // [TÓQUIO] Tropa de Choque Cyber com Escudo de Barreira Holográfica
        ctx.fillStyle = '#111424';
        ctx.fillRect(-6, 2, 12, 14);
        ctx.fillStyle = '#1a2238';
        ctx.fillRect(-8, -10, 14, 14);

        ctx.fillStyle = '#0a0d18';
        ctx.fillRect(-4, -18, 10, 9);
        ctx.fillStyle = '#ff0055'; // Visor neon rosa
        ctx.fillRect(1, -15, 5, 2);

        // Escudo Holográfico Neon Ciano
        ctx.fillStyle = 'rgba(0, 217, 255, 0.45)';
        ctx.fillRect(6, -20, 10, 36);
        ctx.strokeStyle = '#00d9ff';
        ctx.lineWidth = 2;
        ctx.strokeRect(6, -20, 10, 36);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(9, -10, 4, 14); // Padrão hexagonal de energia

      } else if (biome === 'brazil') {
        // [BRASIL] Guardião Tribal com Escudo de Máscara de Madeira Rústica
        ctx.fillStyle = '#3d2514';
        ctx.fillRect(-6, 2, 12, 14);
        ctx.fillStyle = '#5c3a21';
        ctx.fillRect(-8, -10, 14, 14);

        ctx.fillStyle = '#e8a974';
        ctx.fillRect(-4, -18, 10, 9);
        ctx.fillStyle = '#2b7a4b'; // Pintura de guerra verde
        ctx.fillRect(1, -15, 5, 3);

        // Escudo de Máscara Tribal com Pintura Sagrada
        ctx.fillStyle = '#5c3a21';
        ctx.fillRect(6, -22, 12, 38);
        ctx.strokeStyle = '#a0ff3c'; // Olhos e boca esculpidos brilhantes
        ctx.lineWidth = 2;
        ctx.strokeRect(6, -22, 12, 38);
        ctx.fillStyle = '#ffcc00';
        ctx.fillRect(9, -15, 6, 4); // Olhos da máscara
        ctx.fillStyle = '#ff3300';
        ctx.fillRect(9, -2, 6, 6);  // Boca de guerra

      } else if (biome === 'europe') {
        // [EUROPA] Cavaleiro Gótico com Armadura de Placas de Aço e Escudo com Cruz
        ctx.fillStyle = '#334155';
        ctx.fillRect(-6, 2, 12, 14);
        ctx.fillStyle = '#64748b'; // Cota de malha e placas
        ctx.fillRect(-8, -10, 14, 14);

        // Elmo Medieval com Visor de Fenda
        ctx.fillStyle = '#475569';
        ctx.fillRect(-4, -19, 11, 10);
        ctx.fillStyle = '#000';
        ctx.fillRect(1, -15, 5, 2);

        // Grande Escudo Torre com Cruz Vermelha
        ctx.fillStyle = '#cbd5e1';
        ctx.fillRect(6, -22, 11, 38);
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 2;
        ctx.strokeRect(6, -22, 11, 38);
        // Cruz Templária Vermelha
        ctx.fillStyle = '#d91414';
        ctx.fillRect(7, -6, 9, 4);
        ctx.fillRect(10, -16, 3, 24);

      } else {
        // [EGITO] Guardião de Anúbis com Cabeça de Chacal e Escudo de Ouro
        ctx.fillStyle = '#1c1917';
        ctx.fillRect(-6, 2, 12, 14);
        ctx.fillStyle = '#292524';
        ctx.fillRect(-8, -10, 14, 14);

        // Máscara de Chacal de Anúbis com Olhos Vermelhos
        ctx.fillStyle = '#1c1917';
        ctx.fillRect(-4, -20, 11, 11);
        ctx.beginPath(); // Orelhas pontiagudas de chacal
        ctx.moveTo(-3, -20);
        ctx.lineTo(-1, -26);
        ctx.lineTo(2, -20);
        ctx.moveTo(3, -20);
        ctx.lineTo(5, -26);
        ctx.lineTo(8, -20);
        ctx.fill();
        ctx.fillStyle = '#ff0033'; // Olhos vermelhos
        ctx.fillRect(2, -16, 4, 2);

        // Escudo de Ouro do Faraó com Escaravelho
        ctx.fillStyle = '#ffd700';
        ctx.fillRect(6, -22, 12, 38);
        ctx.strokeStyle = '#b45309';
        ctx.lineWidth = 2;
        ctx.strokeRect(6, -22, 12, 38);
        ctx.fillStyle = '#0284c7'; // Escaravelho de lápis-lazúli
        ctx.beginPath();
        ctx.arc(12, -3, 4, 0, Math.PI * 2);
        ctx.fill();
      }

    } else if (e.type === 'rocket_trooper') {
      if (biome === 'tokyo') {
        ctx.fillStyle = '#111424';
        ctx.fillRect(-6, 4, 12, 12);
        ctx.fillRect(-8, -8, 14, 14);
        ctx.fillStyle = '#0a0d18';
        ctx.fillRect(-3, -16, 8, 8);
        ctx.fillStyle = '#ffaa00';
        ctx.fillRect(1, -15, 4, 3);
        // Lançador de Mísseis Cyber
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(-8, -14, 28, 7);
        ctx.fillStyle = '#00d9ff';
        ctx.fillRect(18, -13, 4, 5);

      } else if (biome === 'brazil') {
        ctx.fillStyle = '#2d3b24';
        ctx.fillRect(-6, 4, 12, 12);
        ctx.fillRect(-8, -8, 14, 14);
        ctx.fillStyle = '#e8a974';
        ctx.fillRect(-3, -16, 8, 8);
        ctx.fillStyle = '#ff4400';
        ctx.fillRect(-5, -18, 12, 5);
        // Bazuca Camuflada de Selva
        ctx.fillStyle = '#1e381f';
        ctx.fillRect(-8, -14, 28, 7);
        ctx.fillStyle = '#ffaa00';
        ctx.fillRect(18, -13, 4, 5);

      } else if (biome === 'europe') {
        ctx.fillStyle = '#334155';
        ctx.fillRect(-6, 4, 12, 12);
        ctx.fillRect(-8, -8, 14, 14);
        ctx.fillStyle = '#f0be8b';
        ctx.fillRect(-3, -16, 8, 8);
        ctx.fillStyle = '#854d0e'; // Óculos de proteção steampunk
        ctx.fillRect(-4, -16, 10, 4);
        // Canhão de Mísseis de Latão Steampunk
        ctx.fillStyle = '#ca8a04';
        ctx.fillRect(-8, -14, 28, 8);
        ctx.fillStyle = '#ea580c';
        ctx.fillRect(18, -14, 4, 8);

      } else {
        ctx.fillStyle = '#451a03';
        ctx.fillRect(-6, 4, 12, 12);
        ctx.fillRect(-8, -8, 14, 14);
        ctx.fillStyle = '#e8a974';
        ctx.fillRect(-3, -16, 8, 8);
        ctx.fillStyle = '#ffd700';
        ctx.fillRect(-4, -18, 10, 6);
        // Canhão Solar de Rá
        ctx.fillStyle = '#ffd700';
        ctx.fillRect(-8, -14, 28, 7);
        ctx.fillStyle = '#ff0033';
        ctx.fillRect(18, -14, 5, 7);
      }

    } else if (e.type === 'drone') {
      const hover = Math.sin(this.time * 8 + e.id) * 3;
      ctx.translate(0, hover);

      if (biome === 'tokyo') {
        // Drone Cyberpunk Quadricóptero com Holo-Scanner
        ctx.fillStyle = 'rgba(0, 217, 255, 0.7)';
        const propW = Math.abs(Math.sin(this.time * 30)) * 36;
        ctx.fillRect(-propW / 2, -16, propW, 3);

        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.ellipse(0, -6, 16, 10, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#00d9ff';
        ctx.shadowColor = '#00d9ff';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(6, -6, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

      } else if (biome === 'brazil') {
        // Drone Camuflado da Selva
        ctx.fillStyle = 'rgba(160, 255, 60, 0.7)';
        const propW = Math.abs(Math.sin(this.time * 30)) * 36;
        ctx.fillRect(-propW / 2, -16, propW, 3);

        ctx.fillStyle = '#1e381f';
        ctx.beginPath();
        ctx.ellipse(0, -6, 16, 10, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#eab308';
        ctx.beginPath();
        ctx.arc(6, -6, 4, 0, Math.PI * 2);
        ctx.fill();

      } else if (biome === 'europe') {
        // Autômato Voador Steampunk de Latão com Engrenagens
        ctx.fillStyle = '#ca8a04';
        const propW = Math.abs(Math.sin(this.time * 25)) * 34;
        ctx.fillRect(-propW / 2, -16, propW, 4);

        ctx.fillStyle = '#78350f';
        ctx.beginPath();
        ctx.arc(0, -6, 12, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#f59e0b'; // Fornalha de vapor brilhante
        ctx.shadowColor = '#f59e0b';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(5, -6, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

      } else {
        // Escaravelho Voador de Ouro do Egito
        ctx.fillStyle = '#ffd700'; // Asas douradas
        const wingFlap = Math.sin(this.time * 35) * 12;
        ctx.beginPath();
        ctx.moveTo(0, -6);
        ctx.lineTo(-18, -16 + wingFlap);
        ctx.lineTo(-6, -6);
        ctx.moveTo(0, -6);
        ctx.lineTo(18, -16 + wingFlap);
        ctx.lineTo(6, -6);
        ctx.fill();

        ctx.fillStyle = '#b45309';
        ctx.beginPath();
        ctx.ellipse(0, -6, 14, 9, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ff0033'; // Joia solar central
        ctx.shadowColor = '#ff0033';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(4, -6, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    ctx.restore();
  }

  // --- REFÉM / POW (PRISONER OF WAR) RESGATÁVEL ---
  drawPOW(ctx, camera, pow) {
    ctx.save();
    ctx.translate(pow.x - camera.x + pow.width / 2, pow.y - camera.y + pow.height / 2);
    ctx.scale(pow.facing, 1);

    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.beginPath();
    ctx.ellipse(0, pow.height / 2 - 1, 10, 3, 0, 0, Math.PI * 2);
    ctx.fill();

    if (!pow.rescued) {
      ctx.fillStyle = '#ffe600';
      ctx.fillRect(-5, 4, 10, 8);
      ctx.fillStyle = '#f0be8b';
      ctx.fillRect(-6, -6, 12, 10);
      ctx.strokeStyle = '#8c6239';
      ctx.lineWidth = 2;
      ctx.strokeRect(-7, -4, 14, 6);

      ctx.fillStyle = '#ffd700';
      ctx.beginPath();
      ctx.moveTo(-5, -12);
      ctx.lineTo(5, -12);
      ctx.lineTo(3, 2);
      ctx.lineTo(-3, 2);
      ctx.fill();

      ctx.fillStyle = '#f0be8b';
      ctx.fillRect(-3, -16, 7, 6);
      ctx.fillStyle = '#ffd700';
      ctx.fillRect(-6, -20, 13, 5);

    } else {
      const salute = pow.saluteTimer > 0;
      ctx.fillStyle = '#ffe600';
      ctx.fillRect(-5, 4, 10, 8);
      ctx.fillStyle = '#f0be8b';
      ctx.fillRect(-6, -8, 12, 12);

      ctx.fillStyle = '#f0be8b';
      ctx.fillRect(-3, -18, 7, 7);
      ctx.fillStyle = '#ffd700';
      ctx.fillRect(-6, -22, 13, 6);
      ctx.fillRect(-4, -14, 8, 8);

      if (salute) {
        ctx.fillStyle = '#f0be8b';
        ctx.beginPath();
        ctx.moveTo(2, -4);
        ctx.lineTo(8, -16);
        ctx.lineTo(5, -18);
        ctx.lineTo(0, -6);
        ctx.fill();

        ctx.fillStyle = '#ffee00';
        ctx.font = 'bold 9px "Press Start 2P", monospace';
        ctx.textAlign = 'center';
        ctx.fillText('THANK YOU!', 0, -28);
      }
    }

    ctx.restore();
  }

  // --- CHEFÃO TITÃ (MECHAGODZILLA DINÂMICO HD - APEX TITAN DO EGITO) ---
  drawBoss(ctx, camera, boss) {
    if (boss.hiddenByDragon) return;
    if (boss.isGhidorah) {
      this.drawKingGhidorah(ctx, camera, boss);
      return;
    }
    if (boss.isKingKong) {
      this.drawKingKong(ctx, camera, boss);
      return;
    }
    ctx.save();
    const renderX = boss.cinematicX ?? boss.x;
    const renderY = boss.cinematicY ?? boss.y;
    const posX = renderX - camera.x + boss.width / 2 + (boss.recoilX || 0);
    const posY = renderY - camera.y + boss.height / 2;
    ctx.translate(posX, posY);
    ctx.rotate(boss.cinematicTilt || 0);
    ctx.scale(boss.cinematicScale || 1, boss.cinematicScale || 1);
    ctx.globalAlpha = boss.cinematicOpacity ?? 1;

    if (boss.flashTimer > 0) {
      ctx.filter = 'brightness(2.6)';
    }

    const hpRatio = boss.hp / boss.maxHp;
    const isCharging = boss.state === 'PREPARE_LASER';
    const isFiring = boss.laserActive || boss.state === 'FIRE_LASER';
    const isWalking = boss.state === 'WALK' || boss.state === 'RUSH';
    const isStomping = boss.state === 'TITAN_STOMP';
    const isMissile = boss.state === 'MISSILE_SALVO';
    const isRecoil = boss.state === 'RECOIL_LASER';

    // 1. Sombra Gigantesca Dinâmica no Solo do Egito
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.beginPath();
    ctx.ellipse(0, boss.height / 2 - 6, boss.width / 2 + 35, 24, 0, 0, Math.PI * 2);
    ctx.fill();

    // Trilhas de plasma deixam o dash impossível de confundir com caminhada.
    if (boss.state === 'RUSH') {
      ctx.save();
      const trailDirection = -(boss.facing || -1);
      ctx.globalCompositeOperation = 'screen';
      ctx.strokeStyle = 'rgba(255, 45, 45, 0.78)';
      ctx.shadowColor = '#ff3b18';
      ctx.shadowBlur = 18;
      ctx.lineWidth = 9;
      for (let trail = 0; trail < 5; trail++) {
        const y = -72 + trail * 30 + Math.sin(boss.animTime * 24 + trail) * 8;
        ctx.beginPath();
        ctx.moveTo(trailDirection * 24, y);
        ctx.lineTo(trailDirection * (150 + trail * 28), y + Math.sin(boss.animTime * 18 + trail) * 9);
        ctx.stroke();
      }
      ctx.restore();
    }

    // 2. Renderização Articulada do MechaGodzilla com Sprites HD
    if (this.mechaSprites && this.mechaSprites.loaded) {
      ctx.save();

      // Inverter horizontalmente com base na direção em que o Titã olha
      ctx.scale(boss.facing || -1, 1);

      // O micro-deslocamento contínuo impede que o sprite pareça preso a uma
      // grade: mesmo parado, o peso do reator e a respiração movem o corpo.
      const gaitSway = Math.sin(boss.animTime * (isWalking ? 7.2 : 3.4)) * (isWalking ? 2.4 : 0.9);
      const impactJitter = (boss.impactWobble || 0) * Math.sin(boss.animTime * 42) * 3;
      ctx.translate(gaitSway + impactJitter, (boss.bodyBob || 0) + (boss.impactOffsetY || 0));
      const totalLean = (boss.bodyLean || 0) + (boss.impactTilt || 0);
      if (totalLean) {
        ctx.rotate(totalLean * (boss.facing || -1));
      }

      // Escolher frame adequado de animação
      let currentSprite = this.mechaSprites.idle;

      if (isFiring) {
        currentSprite = this.mechaSprites.laser;
      } else if (isCharging || isStomping || isRecoil) {
        currentSprite = this.mechaSprites.stance;
      } else if (isWalking) {
        // Ciclo de caminhada com passos pesados
        const walkCycle = [
          this.mechaSprites.walk1,
          this.mechaSprites.stance,
          this.mechaSprites.walk2,
          this.mechaSprites.idle
        ];
        currentSprite = walkCycle[Math.floor(boss.animTime * 6) % 4] || this.mechaSprites.walk1;
      } else if (isMissile || Math.abs(boss.cannonAngle || 0) > 0.08) {
        // A mira só ganha prioridade quando parado. Durante a caminhada, o
        // ciclo de passadas precisa continuar visível para dar peso ao Titã.
        currentSprite = this.mechaSprites.aim;
      } else {
        currentSprite = this.mechaSprites.idle;
      }

      // Brilho pulsante nos espinhos dorsais de titânio
      const spineGlowIntensity = Math.min(45, (boss.spineGlow || 0.4) * 30);
      if (spineGlowIntensity > 5) {
        ctx.shadowColor = '#ff0033';
        ctx.shadowBlur = spineGlowIntensity;
      }

      // Renderizar o Sprite Oficial
      const spriteW = 270;
      const spriteH = 250;
      ctx.drawImage(currentSprite, -spriteW / 2, -spriteH / 2, spriteW, spriteH);
      ctx.shadowBlur = 0;

      // 3. Olhos / Scanner Óptico Vermelho com Feixe de Mira
      const eyeX = 25;
      const eyeY = -72;
      const eyeGlow = ctx.createRadialGradient(eyeX, eyeY, 1, eyeX, eyeY, isCharging ? 22 : 12);
      eyeGlow.addColorStop(0, '#ffffff');
      eyeGlow.addColorStop(0.35, '#ff0033');
      eyeGlow.addColorStop(1, 'rgba(255, 0, 50, 0)');
      ctx.fillStyle = eyeGlow;
      ctx.beginPath();
      ctx.arc(eyeX, eyeY, isCharging ? 22 : 12, 0, Math.PI * 2);
      ctx.fill();

      // Feixe de mira laser vermelho projetado nos olhos durante a carga
      if (isCharging) {
        ctx.strokeStyle = 'rgba(255, 0, 50, 0.8)';
        ctx.lineWidth = 2;
        ctx.setLineDash([8, 6]);
        ctx.beginPath();
        ctx.moveTo(eyeX + 6, eyeY);
        ctx.lineTo(eyeX + 500, eyeY + (boss.headAngle || 0) * 200);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Arcos elétricos de sobrecarga quando HP < 50%
      if (hpRatio < 0.5) {
        ctx.strokeStyle = '#ff0033';
        ctx.lineWidth = 2;
        for (let arc = 0; arc < 4; arc++) {
          const ax = (Math.random() - 0.5) * 160;
          const ay = (Math.random() - 0.5) * 160;
          ctx.beginPath();
          ctx.moveTo(ax, ay);
          ctx.lineTo(ax + (Math.random() - 0.5) * 25, ay + (Math.random() - 0.5) * 25);
          ctx.lineTo(ax + (Math.random() - 0.5) * 40, ay + (Math.random() - 0.5) * 40);
          ctx.stroke();
        }
      }

      ctx.restore();

    } else {
      // Fallback Procedural
      ctx.fillStyle = '#334155';
      ctx.fillRect(-boss.width / 2, -boss.height / 2, boss.width, boss.height);
    }

    // 4. VÓRTICE DE CARREGAMENTO DE ENERGIA (ANTECIPAÇÃO ANTES DO LASER)
    if (isCharging && boss.chargeParticles) {
      ctx.save();
      const mouthX = (boss.facing === 1 ? 80 : -80);
      const mouthY = -42 + (boss.bodyBob || 0);

      // Núcleo de fusão brilhando intensamente na boca
      ctx.fillStyle = '#ff0033';
      ctx.shadowColor = '#ff0033';
      ctx.shadowBlur = 30;
      ctx.beginPath();
      ctx.arc(mouthX, mouthY, 16 + Math.sin(this.time * 25) * 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(mouthX, mouthY, 8, 0, Math.PI * 2);
      ctx.fill();

      // Partículas convergindo para o centro da boca
      boss.chargeParticles.forEach(p => {
        const px = (p.curX || p.x) - (boss.x + boss.width / 2);
        const py = (p.curY || p.y) - (boss.y + boss.height / 2);
        ctx.fillStyle = '#ff3366';
        ctx.beginPath();
        ctx.arc(px, py, 3.5, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.shadowBlur = 0;
      ctx.restore();
    }

    // 5. MEGA FEIXE LASER DE PRÓTONS (PROTON SCREAM) CORTANDO A ARENA DO EGITO
    if (isFiring) {
      ctx.save();
      const mouthX = (boss.facing === 1 ? 80 : -80);
      const mouthY = -42 + (boss.bodyBob || 0);

      // Núcleo atômico incandescente na boca do Titã
      ctx.fillStyle = '#ff0033';
      ctx.shadowColor = '#ff0033';
      ctx.shadowBlur = 40;
      ctx.beginPath();
      ctx.arc(mouthX, mouthY, 32, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(mouthX, mouthY, 16, 0, Math.PI * 2);
      ctx.fill();

      // Trajetória do Mega Raio Laser
      const beamLength = 1050;
      const beamHeight = 42 + Math.sin(this.time * 40) * 10;
      const startX = mouthX;
      const endX = mouthX + (boss.facing * beamLength);
      const drawStartX = Math.min(startX, endX);

      // Camada 1: Corona Externa de Plasma Vermelho
      ctx.fillStyle = 'rgba(255, 0, 50, 0.75)';
      ctx.fillRect(drawStartX, mouthY - beamHeight / 2, beamLength, beamHeight);

      // Camada 2: Chamas e Energia Alaranjada Incandescente
      ctx.fillStyle = 'rgba(255, 120, 0, 0.9)';
      ctx.fillRect(drawStartX, mouthY - beamHeight / 3, beamLength, beamHeight * 0.66);

      // Camada 3: Núcleo Dourado
      ctx.fillStyle = '#ffcc00';
      ctx.fillRect(drawStartX, mouthY - 8, beamLength, 16);

      // Camada 4: Núcleo Branco Puro de Energia Atômica
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(drawStartX, mouthY - 4, beamLength, 8);

      // Anéis de choque e distorção de onda gravitacional
      for (let r = 0; r < 8; r++) {
        const ringOffset = (r * 125 + ((this.time * 800) % 125));
        const ringX = startX + (boss.facing * ringOffset);
        ctx.strokeStyle = '#ff0033';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.ellipse(ringX, mouthY, 16, beamHeight * 0.8, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Arcos de raios no feixe
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      for (let l = 0; l < 4; l++) {
        const lx = startX + (boss.facing * (l * 240 + Math.random() * 80));
        ctx.beginPath();
        ctx.moveTo(lx, mouthY - 10);
        ctx.lineTo(lx + boss.facing * 30, mouthY + (Math.random() - 0.5) * 20);
        ctx.lineTo(lx + boss.facing * 60, mouthY + 10);
        ctx.stroke();
      }

      ctx.shadowBlur = 0;
      ctx.restore();
    }

    ctx.restore();
  }

  // --- CHEFÃO SUPREMO: KING GHIDORAH (O DRAGÃO DOURADO TRICÉFALO) ---
  drawKingGhidorah(ctx, camera, boss) {
    if (!boss) return;
    const isFlying = boss.isFlying || ['ASCEND', 'AERIAL_HOVER', 'AERIAL_BOMBARD', 'AERIAL_SWOOP'].includes(boss.state);
    const groundLevelY = (boss.groundY || 440) - camera.y;
    const renderX = (boss.cinematicX ?? boss.x) + boss.width / 2 + (boss.recoilX || 0);
    const renderY = (boss.cinematicY ?? boss.y) + boss.height / 2 + (boss.bodyBob || 0);
    const screenX = renderX - camera.x;
    const screenY = renderY - camera.y;

    // 1. Sombra Dinâmica no Solo
    ctx.save();
    const altitude = Math.max(0, (groundLevelY - screenY));
    const shadowScale = Math.max(0.35, 1 - altitude / 450);
    const shadowAlpha = Math.max(0.15, 0.55 - altitude / 600);
    ctx.fillStyle = `rgba(15, 10, 2, ${shadowAlpha})`;
    ctx.beginPath();
    ctx.ellipse(screenX, groundLevelY - 8, (boss.width / 2 + 30) * shadowScale, 18 * shadowScale, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 2. Trilhas e Rastros de Velocidade no Rasante Aéreo (Swoop)
    if (boss.state === 'AERIAL_SWOOP') {
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      ctx.strokeStyle = 'rgba(255, 215, 0, 0.6)';
      ctx.shadowColor = '#ffd700';
      ctx.shadowBlur = 24;
      ctx.lineWidth = 14;
      const trailDir = -(boss.facing || -1);
      for (let t = 0; t < 6; t++) {
        const ty = screenY - 50 + t * 20 + Math.sin(boss.animTime * 20 + t) * 10;
        ctx.beginPath();
        ctx.moveTo(screenX + trailDir * 40, ty);
        ctx.lineTo(screenX + trailDir * (220 + t * 45), ty + Math.sin(boss.animTime * 15 + t) * 12);
        ctx.stroke();
      }
      ctx.restore();
    }

    // 3. Renderização Principal do Sprite
    ctx.save();
    ctx.translate(screenX, screenY);
    ctx.rotate(boss.cinematicTilt || boss.impactTilt || 0);
    const baseScale = boss.spriteScale || 1.65;
    ctx.scale((boss.facing || -1) * (boss.cinematicScale || 1) * baseScale, (boss.cinematicScale || 1) * baseScale);
    ctx.globalAlpha = boss.cinematicOpacity ?? 1;

    if (boss.flashTimer > 0) {
      ctx.filter = 'brightness(2.8) contrast(1.2)';
    }

    let currentSprite = null;
    const s = this.ghidorahSprites;

    if (s && s.loaded) {
      switch (boss.state) {
        case 'DYING':
          currentSprite = s.dead;
          break;
        case 'HURT_STAGGER':
          currentSprite = isFlying ? s.hit_flip : s.crouch_hurt;
          break;
        case 'GRAVITY_BEAMS':
          currentSprite = s.gravity_beam;
          break;
        case 'GROUND_SWEEP_BEAMS':
          if (boss.sweepStage === 1) currentSprite = s.ground_beam_1;
          else if (boss.sweepStage === 2) currentSprite = s.ground_beam_2;
          else currentSprite = s.ground_beam_3;
          break;
        case 'GOLDEN_TORNADO':
          currentSprite = s.tornado;
          break;
        case 'ENERGY_BURST':
          currentSprite = s.energy_burst;
          break;
        case 'ASCEND':
          currentSprite = s.ascend_blast;
          break;
        case 'AERIAL_SWOOP':
          currentSprite = (Math.floor(boss.animTime * 8) % 2 === 0) ? s.swoop_1 : s.swoop_2;
          break;
        case 'AERIAL_HOVER':
        case 'AERIAL_BOMBARD':
          if (boss.isBombarding) {
            currentSprite = s.front_glide;
          } else {
            const flyFrames = [s.fly_1, s.fly_2, s.fly_3, s.fly_2];
            currentSprite = flyFrames[Math.floor(boss.animTime * 6) % 4] || s.fly_1;
          }
          break;
        case 'WALK':
          currentSprite = (Math.floor(boss.animTime * 5) % 2 === 0) ? s.walk_1 : s.walk_2;
          break;
        case 'ROAR':
        case 'INTRO_LANDING':
          currentSprite = (boss.stateTimer < 0.6) ? s.roaring_stand : (boss.isLanding ? s.front_glide : s.battle_pose);
          break;
        case 'IDLE':
        case 'BATTLE_STANCE':
        default:
          currentSprite = (Math.sin(boss.animTime * 2.5) > 0.7) ? s.roaring_stand : s.battle_pose;
          break;
      }
    }

    if (currentSprite && currentSprite.width > 0) {
      // Aura Dourada Radiante
      const auraIntensity = (boss.phase === 3 ? 38 : (boss.phase === 2 ? 22 : 12)) + Math.sin(boss.animTime * 8) * 6;
      ctx.shadowColor = (boss.phase === 3) ? '#ffcc00' : '#ffd700';
      ctx.shadowBlur = auraIntensity;

      const sw = currentSprite.width;
      const sh = currentSprite.height;
      ctx.drawImage(currentSprite, -sw / 2, -sh / 2, sw, sh);
      ctx.shadowBlur = 0;

      // Faíscas elétricas de sobrecarga nas cabeças
      if (boss.phase >= 2 || boss.state === 'ROAR' || boss.state === 'GRAVITY_BEAMS') {
        ctx.strokeStyle = '#fff5a0';
        ctx.lineWidth = 2.5;
        for (let arc = 0; arc < (boss.phase === 3 ? 5 : 3); arc++) {
          const ax = 15 + (Math.random() - 0.5) * 50;
          const ay = -40 + (Math.random() - 0.5) * 45;
          ctx.beginPath();
          ctx.moveTo(ax, ay);
          ctx.lineTo(ax + (Math.random() - 0.5) * 22, ay + (Math.random() - 0.5) * 22);
          ctx.lineTo(ax + (Math.random() - 0.5) * 35, ay + (Math.random() - 0.5) * 35);
          ctx.stroke();
        }
      }
    } else {
      // Fallback estilizado dourado caso sprite ainda esteja em carregamento
      ctx.fillStyle = '#d4af37';
      ctx.fillRect(-80, -80, 160, 160);
    }

    ctx.restore();

    // 4. EFEITO: GRAVITY BEAMS (TRIPLE LIGHTNING BEAMS DAS 3 CABEÇAS)
    if (boss.state === 'GRAVITY_BEAMS' && boss.stateTimer > 0.1) {
      ctx.save();
      const mouthX = screenX + (boss.facing === 1 ? 85 : -85);
      const beamDir = boss.facing || -1;
      const beamLength = 1100;
      const headOffsets = [
        { yOff: -48, angle: -0.06 },
        { yOff: -20, angle: 0.02 },
        { yOff: 8, angle: 0.1 }
      ];

      ctx.globalCompositeOperation = 'screen';
      headOffsets.forEach((h, idx) => {
        const startY = screenY + h.yOff;
        const endX = mouthX + beamDir * beamLength;
        const endY = startY + Math.tan(h.angle) * beamLength;

        // Camada 1: Halo de Plasma Dourado
        ctx.strokeStyle = 'rgba(255, 170, 0, 0.7)';
        ctx.shadowColor = '#ffd700';
        ctx.shadowBlur = 28;
        ctx.lineWidth = 24 + Math.sin(boss.animTime * 30 + idx) * 4;
        ctx.beginPath();
        ctx.moveTo(mouthX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();

        // Camada 2: Núcleo de Eletricidade Amarela
        ctx.strokeStyle = '#ffee33';
        ctx.lineWidth = 12 + Math.sin(boss.animTime * 40 + idx) * 3;
        ctx.beginPath();
        ctx.moveTo(mouthX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();

        // Camada 3: Feixe Central Branco Puro
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(mouthX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();

        // Arcos de Relâmpagos em Zig-Zag ao longo do Feixe
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        let curX = mouthX;
        let curY = startY;
        for (let seg = 0; seg < 12; seg++) {
          const nextX = mouthX + (beamDir * (seg + 1) * (beamLength / 12));
          const nextY = startY + (endY - startY) * ((seg + 1) / 12) + (Math.random() - 0.5) * 26;
          ctx.lineTo(nextX, nextY);
          curX = nextX;
          curY = nextY;
        }
        ctx.stroke();

        // Anéis de Choque Gravitacional
        for (let r = 0; r < 5; r++) {
          const ringDist = ((r * 220 + boss.animTime * 900) % beamLength);
          const rx = mouthX + beamDir * ringDist;
          const ry = startY + (endY - startY) * (ringDist / beamLength);
          ctx.strokeStyle = 'rgba(255, 230, 80, 0.85)';
          ctx.lineWidth = 3.5;
          ctx.beginPath();
          ctx.ellipse(rx, ry, 10, 22, 0, 0, Math.PI * 2);
          ctx.stroke();
        }
      });
      ctx.shadowBlur = 0;
      ctx.restore();
    }

    // 5. EFEITO: VARREDURA TRIPLA DE SOLO (GROUND SWEEP BEAMS)
    if (boss.state === 'GROUND_SWEEP_BEAMS') {
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      const mouthX = screenX + (boss.facing === 1 ? 70 : -70);
      const startY = screenY - 20;
      const sweepProgress = 1 - Math.max(0, boss.stateTimer / (boss.maxSweepTime || 1.8));
      const groundImpactX = mouthX + (boss.facing || -1) * (150 + sweepProgress * 700);

      // Três feixes convergindo no solo
      [-25, 0, 25].forEach((yOff, i) => {
        ctx.strokeStyle = 'rgba(255, 190, 0, 0.8)';
        ctx.shadowColor = '#ffaa00';
        ctx.shadowBlur = 20;
        ctx.lineWidth = 10;
        ctx.beginPath();
        ctx.moveTo(mouthX, startY + yOff);
        ctx.lineTo(groundImpactX + (i - 1) * 35, groundLevelY - 10);
        ctx.stroke();

        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(mouthX, startY + yOff);
        ctx.lineTo(groundImpactX + (i - 1) * 35, groundLevelY - 10);
        ctx.stroke();
      });

      // Impacto de Fogo Dourado no Chão
      ctx.fillStyle = 'rgba(255, 220, 50, 0.9)';
      ctx.shadowColor = '#ff6600';
      ctx.shadowBlur = 30;
      ctx.beginPath();
      ctx.ellipse(groundImpactX, groundLevelY - 8, 70, 25, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // 6. EFEITO: VÓRTICE / TORNADO DOURADO (GOLDEN TORNADO)
    if (boss.state === 'GOLDEN_TORNADO') {
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      ctx.shadowColor = '#ffd700';
      ctx.shadowBlur = 32;

      for (let ring = 0; ring < 7; ring++) {
        const ringY = screenY - 120 + ring * 35;
        const ringRadiusX = 40 + ring * 22 + Math.sin(boss.animTime * 18 + ring) * 12;
        const ringRadiusY = 12 + ring * 3.5;
        const rot = (boss.animTime * 14 + ring * 0.8);

        ctx.strokeStyle = `rgba(255, ${200 + ring * 7}, ${ring * 20}, 0.85)`;
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.ellipse(screenX + Math.sin(rot) * 15, ringY, ringRadiusX, ringRadiusY, Math.sin(rot) * 0.2, 0, Math.PI * 2);
        ctx.stroke();

        // Linhas de vento verticais em espiral
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(screenX - ringRadiusX * 0.8, ringY);
        ctx.quadraticCurveTo(screenX, ringY - 25, screenX + ringRadiusX * 0.8, ringY + 25);
        ctx.stroke();
      }
      ctx.restore();
    }

    // 7. EFEITO: SUPERNOVA / ENERGY BURST (EXPLOSÃO RADIAL EM 360°)
    if (boss.state === 'ENERGY_BURST') {
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      const burstProgress = 1 - Math.max(0, boss.stateTimer / (boss.maxBurstTime || 1.2));
      const maxRadius = 380;
      const curRadius = burstProgress * maxRadius;

      // Anel expansivo 1
      ctx.strokeStyle = `rgba(255, 230, 80, ${1 - burstProgress * 0.8})`;
      ctx.shadowColor = '#ffcc00';
      ctx.shadowBlur = 35;
      ctx.lineWidth = 14 * (1 - burstProgress * 0.6);
      ctx.beginPath();
      ctx.arc(screenX, screenY, curRadius, 0, Math.PI * 2);
      ctx.stroke();

      // Anel expansivo secundário
      if (curRadius > 40) {
        ctx.strokeStyle = `rgba(255, 120, 0, ${1 - burstProgress})`;
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.arc(screenX, screenY, curRadius * 0.72, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Raios solares radiantes em 360 graus
      const rayCount = 18;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3;
      for (let i = 0; i < rayCount; i++) {
        const ang = (i / rayCount) * Math.PI * 2 + boss.animTime * 5;
        const rLen = curRadius * (0.85 + Math.sin(boss.animTime * 25 + i) * 0.25);
        ctx.beginPath();
        ctx.moveTo(screenX + Math.cos(ang) * (rLen * 0.3), screenY + Math.sin(ang) * (rLen * 0.3));
        ctx.lineTo(screenX + Math.cos(ang) * rLen, screenY + Math.sin(ang) * rLen);
        ctx.stroke();
      }
      ctx.restore();
    }

    // 8. EFEITO: DECOLAGEM COM PROPULSORES VERTICAIS (ASCEND BLAST)
    if (boss.state === 'ASCEND') {
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      ctx.shadowColor = '#ffd700';
      ctx.shadowBlur = 30;

      // Dois pilares de energia atirados para baixo
      [-28, 28].forEach(xOffset => {
        const bx = screenX + xOffset;
        const by = screenY + 40;
        const bottomY = groundLevelY;

        ctx.strokeStyle = 'rgba(255, 190, 30, 0.85)';
        ctx.lineWidth = 18;
        ctx.beginPath();
        ctx.moveTo(bx, by);
        ctx.lineTo(bx + (Math.random() - 0.5) * 12, bottomY);
        ctx.stroke();

        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.moveTo(bx, by);
        ctx.lineTo(bx, bottomY);
        ctx.stroke();

        // Chamas de impacto no solo
        ctx.fillStyle = '#ffaa00';
        ctx.beginPath();
        ctx.ellipse(bx, bottomY - 5, 35, 12, 0, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.restore();
    }
  }

  // --- CHEFÃO SUPREMO FINAL: KING KONG (O REI DE MANHATTAN) ---
  drawKingKong(ctx, camera, boss) {
    if (!boss) return;
    // RENDERIZAÇÃO PROCEDURAL TEMPORÁRIA (até termos as sprites)
    ctx.save();
    const renderX = (boss.cinematicX ?? boss.x) + boss.width / 2 + (boss.recoilX || 0);
    const renderY = (boss.cinematicY ?? boss.y) + boss.height / 2 + (boss.bodyBob || 0);
    const screenX = renderX - camera.x;
    const screenY = renderY - camera.y;

    ctx.translate(screenX, screenY);
    ctx.scale(boss.facing, 1);
    ctx.rotate(boss.impactTilt || 0);

    // Flash de dano
    if (boss.flashTimer > 0) {
      ctx.globalAlpha = 0.5;
      ctx.fillStyle = '#ff0000';
    }

    // Corpo do Kong (Gorila gigante)
    ctx.fillStyle = '#3d2817';
    ctx.fillRect(-80, -120, 160, 240); // Corpo

    // Cabeça
    ctx.fillStyle = '#2d1d0f';
    ctx.beginPath();
    ctx.ellipse(0, -140, 60, 70, 0, 0, Math.PI * 2);
    ctx.fill();

    // Olhos (vermelhos quando em berserker)
    ctx.fillStyle = boss.isBerserker ? '#ff0000' : '#ffcc00';
    ctx.beginPath();
    ctx.arc(-20, -150, 8, 0, Math.PI * 2);
    ctx.arc(20, -150, 8, 0, Math.PI * 2);
    ctx.fill();

    // Boca rugindo
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(0, -130, 15, 0, Math.PI);
    ctx.fill();

    // Braços musculosos
    ctx.fillStyle = '#3d2817';
    ctx.fillRect(-100, -80, 40, 120); // Braço esquerdo
    ctx.fillRect(60, -80, 40, 120); // Braço direito

    // Pernas
    ctx.fillRect(-70, 60, 50, 100);
    ctx.fillRect(20, 60, 50, 100);

    // Label do boss
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#8b4513';
    ctx.font = 'bold 12px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('KING KONG', 0, -180);

    ctx.restore();

    // Sombra
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.beginPath();
    ctx.ellipse(screenX, renderY + 140, 80, 20, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // --- DRAGÃO TRICÉFALO — CENA FINAL ORGÂNICA ---
  drawDragon(ctx, camera, dragon) {
    if (!dragon) return;
    const s = this.ghidorahSprites;
    const isLoaded = s && s.fly_1 && (s.loaded || (s.fly_1.complete && s.fly_1.naturalWidth > 0));

    ctx.save();
    ctx.translate(dragon.x - camera.x, dragon.y - camera.y);
    ctx.rotate(dragon.bank || 0);
    const sprScale = 1.7 * (dragon.scale || 1);
    ctx.scale((dragon.facing || -1) * sprScale, sprScale);

    // Sombra do Dragão
    ctx.fillStyle = 'rgba(12, 7, 2, 0.35)';
    ctx.beginPath();
    ctx.ellipse(0, 70, 110, 22, 0, 0, Math.PI * 2);
    ctx.fill();

    if (isLoaded) {
      let sprite = s.fly_1;
      if (dragon.state === 'SWEEP' || dragon.state === 'APPROACH') {
        sprite = s.swoop_1 || s.fly_1;
      } else if (dragon.state === 'GRAB' || dragon.state === 'CARRY') {
        sprite = s.fly_2 || s.fly_1;
      } else {
        const flyCycle = [s.fly_1, s.fly_2, s.fly_3, s.fly_2];
        sprite = flyCycle[Math.floor((dragon.wingPhase || 0) * 0.8) % 4] || s.fly_1;
      }

      ctx.shadowColor = '#ffd700';
      ctx.shadowBlur = 25;
      const sw = sprite.width || 160;
      const sh = sprite.height || 160;
      ctx.drawImage(sprite, -sw / 2, -sh / 2, sw, sh);
      ctx.shadowBlur = 0;
    } else {
      // Fallback Dourado
      ctx.fillStyle = '#ffd700';
      ctx.fillRect(-80, -80, 160, 160);
    }
    ctx.restore();
  }

  drawLightningEffects(ctx, camera, bolts) {
    if (!bolts || bolts.length === 0) return;
    ctx.save();
    ctx.translate(-camera.x, -camera.y);
    bolts.forEach(bolt => {
      const alpha = Math.max(0, bolt.life / bolt.maxLife);
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.strokeStyle = '#4de8ff';
      ctx.shadowColor = '#baf7ff';
      ctx.shadowBlur = 18;
      ctx.lineWidth = 9;
      ctx.beginPath();
      ctx.moveTo(bolt.points[0].x, bolt.points[0].y);
      for (let i = 1; i < bolt.points.length; i++) ctx.lineTo(bolt.points[i].x, bolt.points[i].y);
      ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.restore();
    });
    ctx.restore();
  }

  drawCinematicFlash(ctx, intensity, color = '#ffffff') {
    if (!intensity) return;
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    ctx.globalAlpha = Math.min(0.78, intensity);
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.restore();
  }

  // --- PROJÉTEIS E TIROS CINEMÁTICOS ---
  drawProjectiles(ctx, camera, projectiles) {
    ctx.save();
    ctx.translate(-camera.x, -camera.y);

    projectiles.forEach(p => {
      ctx.save();
      ctx.translate(p.x, p.y);

      if (p.type === 'arrow') {
        // --- FLECHA CYBER PERFURANTE DA JESSICA ---
        const angle = Math.atan2(p.vy, p.vx);
        ctx.rotate(angle);

        // Haste da Flecha Prateada/Fibra
        ctx.fillStyle = '#e2e8f0';
        ctx.fillRect(-12, -1, 24, 2);

        // Ponta Perfurante de Energia Ciano / Brilhante
        ctx.fillStyle = '#00ffff';
        ctx.shadowColor = '#00ffff';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.moveTo(12, -4);
        ctx.lineTo(20, 0);
        ctx.lineTo(12, 4);
        ctx.closePath();
        ctx.fill();

        // Penas Traseiras da Flecha
        ctx.fillStyle = '#c084fc';
        ctx.beginPath();
        ctx.moveTo(-12, 0);
        ctx.lineTo(-16, -3);
        ctx.lineTo(-10, -1);
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(-12, 0);
        ctx.lineTo(-16, 3);
        ctx.lineTo(-10, 1);
        ctx.closePath();
        ctx.fill();

        // Rastro de Luz de Fótons
        ctx.strokeStyle = 'rgba(0, 217, 255, 0.7)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(-16, 0);
        ctx.lineTo(-28 - Math.random() * 8, 0);
        ctx.stroke();
        ctx.shadowBlur = 0;

      } else if (p.type === 'bomb_arrow') {
        // --- FLECHA EXPLOSIVA (BOMB ARROW) ---
        const angle = Math.atan2(p.vy, p.vx);
        ctx.rotate(angle);

        ctx.fillStyle = '#e2e8f0';
        ctx.fillRect(-12, -1.5, 24, 3);

        // Ogiva Explosiva Pulsante Vermelho/Laranja
        ctx.fillStyle = '#ff0033';
        ctx.shadowColor = '#ff3300';
        ctx.shadowBlur = 14;
        ctx.beginPath();
        ctx.arc(14, 0, 5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ffcc00';
        ctx.beginPath();
        ctx.arc(14, 0, 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

      } else if (p.type === 'bullet') {
        // Bala Normal / HMG: Traçante Dourado Incandescente
        ctx.fillStyle = '#ffe600';
        ctx.shadowColor = '#ff7700';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.ellipse(0, 0, p.radius || 4, (p.radius || 4) * 0.6, Math.atan2(p.vy, p.vx), 0, Math.PI * 2);
        ctx.fill();

      } else if (p.type === 'shotgun') {
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = '#ffaa00';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(0, 0, p.radius || 5, 0, Math.PI * 2);
        ctx.fill();

      } else if (p.type === 'rocket') {
        const angle = Math.atan2(p.vy, p.vx);
        ctx.rotate(angle);

        ctx.fillStyle = '#374151';
        ctx.fillRect(-10, -4, 20, 8);
        ctx.fillStyle = '#dc2626';
        ctx.beginPath();
        ctx.moveTo(10, -4);
        ctx.lineTo(16, 0);
        ctx.lineTo(10, 4);
        ctx.fill();

        ctx.fillStyle = '#ff9900';
        ctx.beginPath();
        ctx.moveTo(-10, -3);
        ctx.lineTo(-18 - Math.random() * 6, 0);
        ctx.lineTo(-10, 3);
        ctx.fill();

      } else if (p.type === 'laser') {
        ctx.fillStyle = '#00ffff';
        ctx.shadowColor = '#00ffff';
        ctx.shadowBlur = 14;
        ctx.fillRect(-12, -3, 24, 6);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(-10, -1.5, 20, 3);

      } else if (p.type === 'flame') {
        const flameGrad = ctx.createRadialGradient(0, 0, 2, 0, 0, p.radius);
        flameGrad.addColorStop(0, '#ffffff');
        flameGrad.addColorStop(0.3, '#ffcc00');
        flameGrad.addColorStop(0.7, '#ff3300');
        flameGrad.addColorStop(1, 'rgba(255, 0, 0, 0)');
        ctx.fillStyle = flameGrad;
        ctx.beginPath();
        ctx.arc(0, 0, p.radius, 0, Math.PI * 2);
        ctx.fill();

      } else if (p.type === 'grenade') {
        ctx.rotate(p.rotation || 0);
        ctx.fillStyle = '#3f4f2c';
        ctx.beginPath();
        ctx.ellipse(0, 0, 7, 5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#222';
        ctx.fillRect(-2, -6, 4, 3);

        if (Math.floor(this.time * 25) % 2 === 0) {
          ctx.fillStyle = '#ff0033';
          ctx.shadowColor = '#ff0033';
          ctx.shadowBlur = 6;
          ctx.beginPath();
          ctx.arc(0, 0, 2, 0, Math.PI * 2);
          ctx.fill();
        }

      } else if (p.type === 'slug_cannon') {
        ctx.fillStyle = '#ffaa00';
        ctx.shadowColor = '#ff3300';
        ctx.shadowBlur = 20;
        ctx.beginPath();
        ctx.arc(0, 0, 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(0, 0, 6, 0, Math.PI * 2);
        ctx.fill();

      } else if (p.type === 'boulder') {
        // Pedregulho massivo arremessado por King Kong
        ctx.rotate(p.rotation || (this.time * 7));
        const s = this.kongSprites;
        if (s && s.boulder && s.boulder.complete && s.boulder.naturalWidth > 0) {
          const bw = 46, bh = 46;
          ctx.drawImage(s.boulder, -bw / 2, -bh / 2, bw, bh);
        } else {
          ctx.fillStyle = '#6b4c35';
          ctx.beginPath();
          ctx.arc(0, 0, 18, 0, Math.PI * 2);
          ctx.fill();
        }

      } else if (p.type === 'car') {
        // Destroços de Táxi Amarelo de Nova York em chamas rodopiando
        ctx.rotate(p.rotation || (this.time * 5));
        ctx.fillStyle = '#eab308'; // Amarelo táxi NY
        ctx.fillRect(-22, -11, 44, 22);
        ctx.fillStyle = '#111827';
        ctx.fillRect(-16, -13, 9, 3);
        ctx.fillRect(7, -13, 9, 3);
        ctx.fillRect(-16, 10, 9, 3);
        ctx.fillRect(7, 10, 9, 3);
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(-12, -7, 24, 14);
        ctx.fillStyle = '#000';
        for (let tx = -18; tx < 18; tx += 8) {
          ctx.fillRect(tx, -2, 4, 4);
        }
        // Rastro de chamas
        ctx.fillStyle = 'rgba(255, 68, 0, 0.75)';
        ctx.beginPath();
        ctx.arc(-18, 0, 9, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    });

    ctx.restore();
  }

  // --- EXPLOSÕES ARCADE MULTI-CAMADA ---
  drawExplosions(ctx, camera, explosions) {
    ctx.save();
    ctx.translate(-camera.x, -camera.y);

    explosions.forEach(exp => {
      ctx.save();
      ctx.translate(exp.x, exp.y);

      const progress = exp.life / exp.maxLife; // 1 (início) até 0 (fim)
      const currentRadius = exp.radius * (1 - progress * 0.3);

      // 1. Onda de Choque Externa (Shockwave Ring)
      ctx.strokeStyle = `rgba(255, 200, 100, ${progress * 0.7})`;
      ctx.lineWidth = 4 * progress;
      ctx.beginPath();
      ctx.arc(0, 0, currentRadius * 1.3 * (1 - progress), 0, Math.PI * 2);
      ctx.stroke();

      // 2. Bolhas de Fogo e Fumaça Volumétrica
      exp.blobs.forEach(b => {
        const bx = b.x * (1 - progress);
        const by = b.y * (1 - progress);
        const br = b.r * progress;

        const fireGrad = ctx.createRadialGradient(bx, by, br * 0.1, bx, by, br);
        if (progress > 0.5) {
          fireGrad.addColorStop(0, '#ffffff');
          fireGrad.addColorStop(0.3, '#ffee00');
          fireGrad.addColorStop(0.7, '#ff3b00');
          fireGrad.addColorStop(1, 'rgba(100, 20, 0, 0)');
        } else {
          fireGrad.addColorStop(0, '#ff4400');
          fireGrad.addColorStop(0.5, '#4a4a4a');
          fireGrad.addColorStop(1, 'rgba(20, 20, 20, 0)');
        }

        ctx.fillStyle = fireGrad;
        ctx.beginPath();
        ctx.arc(bx, by, br, 0, Math.PI * 2);
        ctx.fill();
      });

      // 3. Núcleo Incandescente
      if (progress > 0.6) {
        ctx.fillStyle = `rgba(255, 255, 255, ${progress})`;
        ctx.beginPath();
        ctx.arc(0, 0, currentRadius * 0.4, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    });

    ctx.restore();
  }

  // --- PARTÍCULAS (CARTUCHOS, FAÍSCAS, FUMAÇA, SANGUE/ÓLEO) ---
  drawParticles(ctx, camera, particles) {
    ctx.save();
    ctx.translate(-camera.x, -camera.y);

    particles.forEach(p => {
      ctx.save();
      ctx.translate(p.x, p.y);

      if (p.type === 'casing') {
        // Cartucho de Latão Dourado Ejetado
        ctx.rotate(p.rotation || 0);
        ctx.fillStyle = '#ffd700';
        ctx.fillRect(-2, -1, 4, 2);

      } else if (p.type === 'spark') {
        // Faísca Brilhante
        ctx.fillStyle = '#ffea00';
        ctx.shadowColor = '#ff7700';
        ctx.shadowBlur = 4;
        ctx.fillRect(-1.5, -1.5, 3, 3);

      } else if (p.type === 'smoke') {
        // Fumaça Translúcida
        ctx.fillStyle = `rgba(180, 190, 200, ${p.alpha * 0.4})`;
        ctx.beginPath();
        // Efeitos podem ser atualizados no mesmo quadro em que são removidos.
        // Clampar aqui evita que uma partícula residual interrompa o canvas.
        ctx.arc(0, 0, Math.max(0.1, p.radius || 0.1), 0, Math.PI * 2);
        ctx.fill();

      } else if (p.type === 'blood') {
        // Sangue / Óleo
        ctx.fillStyle = p.color || '#b91c1c';
        ctx.beginPath();
        ctx.arc(0, 0, p.radius || 2.5, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    });

    ctx.restore();
  }

  // --- ITENS COLETÁVEIS E CAIXAS DE SUPRIMENTOS ---
  drawPickups(ctx, camera, pickups) {
    ctx.save();
    ctx.translate(-camera.x, -camera.y);

    pickups.forEach(item => {
      ctx.save();
      const bob = Math.sin(this.time * 6 + item.x) * 4;
      ctx.translate(item.x, item.y + bob);

      // Aura de Brilho
      ctx.fillStyle = 'rgba(255, 200, 0, 0.25)';
      ctx.beginPath();
      ctx.arc(14, 14, 18, 0, Math.PI * 2);
      ctx.fill();

      // Caixa Metálica com Letra da Arma Estilo Metal Slug
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(0, 0, 28, 28);
      ctx.strokeStyle = item.color || '#ffaa00';
      ctx.lineWidth = 2.5;
      ctx.strokeRect(0, 0, 28, 28);

      // Letra do Ícone [H], [S], [R], [F], [L], [B]
      ctx.fillStyle = item.color || '#ffea00';
      ctx.font = 'bold 13px "Press Start 2P", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(item.icon, 14, 15);

      ctx.restore();
    });

    ctx.restore();
  }

  // --- TEXTOS FLUTUANTES (SCORE, WEAPON PICKUP) ---
  drawFloatingTexts(ctx, camera, texts) {
    ctx.save();
    ctx.translate(-camera.x, -camera.y);

    texts.forEach(t => {
      ctx.save();
      ctx.fillStyle = t.color || '#ffee00';
      ctx.font = `${t.size || 11}px "Press Start 2P", monospace`;
      ctx.textAlign = 'center';
      ctx.shadowColor = '#000';
      ctx.shadowBlur = 4;
      ctx.globalAlpha = Math.max(0, t.alpha);
      ctx.fillText(t.text, t.x, t.y);
      ctx.restore();
    });

    ctx.restore();
  }
}

// Instância global do renderizador
const renderer = new GameRenderer();
