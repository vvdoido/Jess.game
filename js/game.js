


const DEBUG = false;


const debugLog = DEBUG ? console.log.bind(console) : () => {};
const debugWarn = DEBUG ? console.warn.bind(console) : () => {};
const debugError = console.error.bind(console);

class InputManager {
  constructor() {
    this.keys = {};
    this.pressed = {};
    this.gamepadKeys = {};

    window.addEventListener('keydown', (e) => {

      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
        e.preventDefault();
      }
      if (!this.keys[e.code]) {
        this.pressed[e.code] = true;
      }
      this.keys[e.code] = true;
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.code] = false;
    });



    window.addEventListener('blur', () => this.reset());
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) this.reset();
    });




    const preventPageZoom = (e) => e.preventDefault();
    document.addEventListener('gesturestart', preventPageZoom, { passive: false });
    document.addEventListener('gesturechange', preventPageZoom, { passive: false });
    document.addEventListener('gestureend', preventPageZoom, { passive: false });

    const gameWrapper = document.getElementById('game-wrapper');
    if (gameWrapper) {
      gameWrapper.addEventListener('dblclick', preventPageZoom, { passive: false });
    }


    this.initTouchControls();
  }

  isDown(action) {
    switch (action) {

      case 'left': return !!(this.keys['KeyA'] || this.keys['TouchLeft'] || this.gamepadKeys.left);
      case 'right': return !!(this.keys['KeyD'] || this.keys['TouchRight'] || this.gamepadKeys.right);
      case 'up': return !!(this.keys['KeyW'] || this.keys['TouchUp'] || this.gamepadKeys.up);
      case 'down': return !!(this.keys['KeyS'] || this.keys['TouchDown'] || this.gamepadKeys.down);
      case 'jump': return !!(this.keys['Space'] || this.keys['KeyJ'] || this.keys['TouchJump'] || this.gamepadKeys.jump);
      case 'shoot': return !!(this.keys['KeyK'] || this.keys['KeyZ'] || this.keys['TouchShoot'] || this.gamepadKeys.shoot);
      case 'bomb': return !!(this.keys['KeyL'] || this.keys['KeyX'] || this.keys['TouchBomb'] || this.gamepadKeys.bomb);
      case 'enter': return !!(this.keys['KeyE'] || this.keys['KeyC'] || this.gamepadKeys.enter);
      case 'execution': return !!(this.keys['KeyR'] || this.keys['TouchSpecial']);
      case 'pause': return !!(this.keys['Escape'] || this.keys['KeyP']);


      case 'p2_left': return !!(this.keys['ArrowLeft'] || this.keys['Numpad4']);
      case 'p2_right': return !!(this.keys['ArrowRight'] || this.keys['Numpad6']);
      case 'p2_up': return !!(this.keys['ArrowUp'] || this.keys['Numpad8']);
      case 'p2_down': return !!(this.keys['ArrowDown'] || this.keys['Numpad5'] || this.keys['Numpad2']);
      case 'p2_jump': return !!(this.keys['Digit1'] || this.keys['Numpad1'] || this.keys['KeyU']);
      case 'p2_shoot': return !!(this.keys['Digit2'] || this.keys['Numpad2'] || this.keys['KeyI']);
      case 'p2_bomb': return !!(this.keys['Digit3'] || this.keys['Numpad3'] || this.keys['KeyO']);
      case 'p2_execution': return !!(this.keys['Digit4'] || this.keys['Numpad7'] || this.keys['KeyY']);
      case 'p2_enter': return !!(this.keys['Digit0'] || this.keys['Numpad0'] || this.keys['KeyP']);
      default: return false;
    }
  }

  isPressed(action) {
    switch (action) {

      case 'jump': return !!(this.pressed['Space'] || this.pressed['KeyJ'] || this.pressed['TouchJump'] || this.pressed['GamepadJump']);
      case 'shoot': return !!(this.pressed['KeyK'] || this.pressed['KeyZ'] || this.pressed['TouchShoot'] || this.pressed['GamepadShoot']);
      case 'bomb': return !!(this.pressed['KeyL'] || this.pressed['KeyX'] || this.pressed['TouchBomb'] || this.pressed['GamepadBomb']);
      case 'enter': return !!(this.pressed['KeyE'] || this.pressed['KeyC'] || this.pressed['GamepadEnter']);
      case 'execution': return !!(this.pressed['KeyR'] || this.pressed['TouchSpecial']);
      case 'pause': return !!(this.pressed['Escape'] || this.pressed['KeyP']);


      case 'p2_jump': return !!(this.pressed['Digit1'] || this.pressed['Numpad1'] || this.pressed['KeyU']);
      case 'p2_shoot': return !!(this.pressed['Digit2'] || this.pressed['Numpad2'] || this.pressed['KeyI']);
      case 'p2_bomb': return !!(this.pressed['Digit3'] || this.pressed['Numpad3'] || this.pressed['KeyO']);
      case 'p2_execution': return !!(this.pressed['Digit4'] || this.pressed['Numpad7'] || this.pressed['KeyY']);
      case 'p2_enter': return !!(this.pressed['Digit0'] || this.pressed['Numpad0'] || this.pressed['KeyP']);
      default: return false;
    }
  }

  clearPressed() {
    this.pressed = {};
  }

  reset() {
    this.keys = {};
    this.gamepadKeys = {};
    this.clearPressed();
    document.querySelectorAll('#touch-controls .active').forEach(el => el.classList.remove('active'));
  }

  initTouchControls() {
    const bindTouch = (id, key) => {
      const el = document.getElementById(id);
      if (!el) return;
      const press = (e) => {
        if (e.pointerType === 'mouse' && e.button !== 0) return;
        e.preventDefault();
        this.keys[key] = true;
        this.pressed[key] = true;
        el.classList.add('active');
        if (el.setPointerCapture) el.setPointerCapture(e.pointerId);
      };
      const release = (e) => {
        e.preventDefault();
        this.keys[key] = false;
        el.classList.remove('active');
      };

      el.addEventListener('pointerdown', press);
      el.addEventListener('pointerup', release);
      el.addEventListener('pointercancel', release);
      el.addEventListener('lostpointercapture', release);
      el.addEventListener('contextmenu', (e) => e.preventDefault());
    };

    bindTouch('btn-touch-left', 'TouchLeft');
    bindTouch('btn-touch-right', 'TouchRight');
    bindTouch('btn-touch-up', 'TouchUp');
    bindTouch('btn-touch-down', 'TouchDown');
    bindTouch('btn-touch-jump', 'TouchJump');
    bindTouch('btn-touch-shoot', 'TouchShoot');
    bindTouch('btn-touch-bomb', 'TouchBomb');
    bindTouch('btn-touch-special', 'TouchSpecial');
  }

  updateGamepad() {
    const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
    if (!gamepads || !gamepads[0]) {
      this.gamepadKeys = {};
      return;
    }
    const gp = gamepads[0];


    const axX = gp.axes[0];
    const axY = gp.axes[1];
    this.gamepadKeys.left = axX < -0.3 || gp.buttons[14]?.pressed;
    this.gamepadKeys.right = axX > 0.3 || gp.buttons[15]?.pressed;
    this.gamepadKeys.up = axY < -0.3 || gp.buttons[12]?.pressed;
    this.gamepadKeys.down = axY > 0.3 || gp.buttons[13]?.pressed;


    const updateGamepadAction = (name, isDown, pressedKey) => {
      if (isDown && !this.gamepadKeys[name]) this.pressed[pressedKey] = true;
      this.gamepadKeys[name] = !!isDown;
    };
    updateGamepadAction('jump', gp.buttons[0]?.pressed, 'GamepadJump');
    updateGamepadAction('shoot', gp.buttons[2]?.pressed, 'GamepadShoot');
    updateGamepadAction('bomb', gp.buttons[1]?.pressed, 'GamepadBomb');
    updateGamepadAction('enter', gp.buttons[3]?.pressed, 'GamepadEnter');
  }
}

class Game {
  constructor() {
    this.canvas = document.getElementById('game-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.input = new InputManager();


    this.canvas.width = 960;
    this.canvas.height = 540;

    this.camera = { x: 0, y: 0 };
    this.shakePower = 0;
    this.shakeDuration = 0;

    this.time = 0;
    this.lastTime = 0;
    this.runId = 0;
    this.state = 'START';
    this.activeTimers = [];
    this.isPaused = false;
    this.runtimeError = null;


    this.gameMode = '1P';


    this.map = null;
    this.players = [];
    this.enemies = [];
    this.boss = null;


    this.bossStage = 'MECHAGODZILLA';
    this.dragon = null;
    this.lightningEffects = [];
    this.cinematicActive = false;
    this.cinematicFlash = 0;
    this.cinematicFlashColor = '#ffffff';
    this.finaleElapsed = 0;
    this.slugs = [];
    this.pows = [];
    this.projectiles = [];
    this.explosions = [];
    this.particles = [];
    this.executionEffects = [];
    this.pickups = [];
    this.floatingTexts = [];
    

    this.biomeGates = {
      tokyo: { active: false, cleared: false, enemiesRequired: 0, enemiesKilled: 0, x: 1250 },
      brazil: { active: false, cleared: false, enemiesRequired: 0, enemiesKilled: 0, x: 2450 },
      europe: { active: false, cleared: false, enemiesRequired: 0, enemiesKilled: 0, x: 3650 },
      egypt: { active: false, cleared: false, enemiesRequired: 0, enemiesKilled: 0, x: 4900 },
      newyork: { active: false, cleared: false, enemiesRequired: 0, enemiesKilled: 0, x: 6750 }
    };


    this.p1Character = 'claudio';
    this.p2Character = 'jessica';


    this.hudHpFill = document.getElementById('hud-hp-fill');
    this.hudScore = document.getElementById('hud-score');
    this.hudWeaponName = document.getElementById('hud-weapon-name');
    this.hudWeaponAmmo = document.getElementById('hud-weapon-ammo');
    this.hudWeaponIcon = document.getElementById('hud-weapon-icon');
    this.hudGrenades = document.getElementById('hud-grenades');
    this.hudLivesContainer = document.getElementById('hud-lives-icons');
    this.hudCharImg = document.getElementById('hud-char-img');
    this.hudCharName = document.getElementById('hud-char-name');
    

    this.hudP2Group = document.getElementById('hud-p2-group');
    this.hudP2HpFill = document.getElementById('hud-p2-hp-fill');
    this.hudP2WeaponName = document.getElementById('hud-p2-weapon-name');
    this.hudP2WeaponAmmo = document.getElementById('hud-p2-weapon-ammo');
    this.hudP2WeaponIcon = document.getElementById('hud-p2-weapon-icon');
    this.hudP2Grenades = document.getElementById('hud-p2-grenades');
    this.hudP2LivesContainer = document.getElementById('hud-p2-lives-icons');
    this.hudP2CharImg = document.getElementById('hud-p2-char-img');
    this.hudP2CharName = document.getElementById('hud-p2-char-name');
    

    this.bossHud = document.getElementById('boss-hud');
    this.bossTitle = document.getElementById('boss-title') || (this.bossHud ? this.bossHud.querySelector('.boss-title') : null);
    this.bossHpFill = document.getElementById('boss-hp-fill');
    this.bossPhase = document.getElementById('boss-phase');
    this.slugHud = document.getElementById('slug-hud');
    this.slugCannonCount = document.getElementById('slug-cannon-count');

    this.init();
  }

  init() {
    const resetFrameTime = () => {
      this.lastTime = performance.now();
      if (document.hidden) this.input.reset();
    };
    window.addEventListener('resize', resetFrameTime);
    window.addEventListener('orientationchange', resetFrameTime);
    document.addEventListener('visibilitychange', resetFrameTime);


    this.setupModeSelection();
    

    this.setupCharacterSelection();


    const startBtn = document.getElementById('btn-start-game');
    if (startBtn) {
      startBtn.addEventListener('click', () => {
        this.startGame();
      });
    }



    const openGameBtn = document.getElementById('btn-open-game');
    if (openGameBtn) {
      openGameBtn.addEventListener('click', () => {
        const homeScreen = document.getElementById('home-screen');
        const startScreen = document.getElementById('start-screen');
        if (homeScreen) homeScreen.style.display = 'none';
        if (startScreen) startScreen.style.display = 'flex';
        audio.init();
        audio.resume();
        audio.announce('CYBER CLASSICA');
      });
    }


    const restartBtn = document.getElementById('btn-restart-game');
    if (restartBtn) {
      restartBtn.addEventListener('click', () => {
        this.startGame();
      });
    }

    const playAgainBtn = document.getElementById('btn-play-again');
    if (playAgainBtn) {
      playAgainBtn.addEventListener('click', () => {
        this.startGame();
      });
    }


    const resumeBtn = document.getElementById('btn-resume-game');
    if (resumeBtn) {
      resumeBtn.addEventListener('click', () => {
        this.togglePause();
      });
    }

    const restartFromPauseBtn = document.getElementById('btn-restart-from-pause');
    if (restartFromPauseBtn) {
      restartFromPauseBtn.addEventListener('click', () => {
        this.isPaused = false;
        const pauseScreen = document.getElementById('pause-screen');
        if (pauseScreen) pauseScreen.style.display = 'none';
        this.startGame();
      });
    }

    const charSelectPauseBtn = document.getElementById('btn-char-select-pause');
    if (charSelectPauseBtn) {
      charSelectPauseBtn.addEventListener('click', () => {
        this.returnToCharacterSelection();
      });
    }

    const charSelectGameoverBtn = document.getElementById('btn-char-select-gameover');
    if (charSelectGameoverBtn) {
      charSelectGameoverBtn.addEventListener('click', () => {
        this.returnToCharacterSelection();
      });
    }

    const charSelectVictoryBtn = document.getElementById('btn-char-select-victory');
    if (charSelectVictoryBtn) {
      charSelectVictoryBtn.addEventListener('click', () => {
        this.returnToCharacterSelection();
      });
    }


    const audioBtn = document.getElementById('btn-toggle-audio');
    if (audioBtn) {
      audioBtn.addEventListener('click', () => {
        audio.init();
        const muted = audio.toggleMute();
        audioBtn.textContent = muted ? '🔇 SOUND: OFF' : '🔊 SOUND: ON';
      });
    }


    const fullscreenBtn = document.getElementById('btn-toggle-fullscreen');
    if (fullscreenBtn) {
      fullscreenBtn.addEventListener('click', () => {
        this.toggleFullscreen();
      });
    }


    requestAnimationFrame((t) => this.gameLoop(t));
  }

  toggleFullscreen() {
    if (this.isFullscreen()) {
      this.exitFullscreen();
      return;
    }
    this.requestFullscreenForGame();
  }

  isMobileDevice() {
    return window.matchMedia('(pointer: coarse)').matches ||
      (navigator.maxTouchPoints > 0 && Math.min(window.innerWidth, window.innerHeight) <= 1024);
  }

  isFullscreen() {
    return !!(
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.mozFullScreenElement ||
      document.msFullscreenElement ||
      document.webkitIsFullScreen ||
      document.mozFullScreen
    );
  }

  lockLandscape() {
    if (!this.isMobileDevice() || !screen.orientation?.lock) return;
    try {
      const result = screen.orientation.lock('landscape');
      if (result && typeof result.catch === 'function') result.catch(() => {});
    } catch (_) {

    }
  }

  requestFullscreenForGame() {
    const elem = document.getElementById('game-wrapper') || document.documentElement;
    const requestFullscreen =
      elem.requestFullscreen ||
      elem.webkitRequestFullscreen ||
      elem.webkitRequestFullScreen ||
      elem.mozRequestFullScreen ||
      elem.msRequestFullscreen;

    if (!requestFullscreen) return false;

    try {
      const result = requestFullscreen.call(elem);
      if (result && typeof result.then === 'function') {
        result.then(() => this.lockLandscape()).catch(() => {});
      } else {

        this.lockLandscape();
      }
      return true;
    } catch (_) {
      return false;
    }
  }

  exitFullscreen() {
    const exitFullscreen =
      document.exitFullscreen ||
      document.webkitExitFullscreen ||
      document.webkitCancelFullScreen ||
      document.mozCancelFullScreen ||
      document.msExitFullscreen;

    if (!exitFullscreen) return;
    try {
      const result = exitFullscreen.call(document);
      if (result && typeof result.catch === 'function') result.catch(() => {});
    } catch (_) {

    }
  }

  setupModeSelection() {
    const mode1PBtn = document.getElementById('btn-mode-1p');
    const mode2PBtn = document.getElementById('btn-mode-2p');
    const p2SelectSection = document.getElementById('p2-select-section');

    if (mode1PBtn) {
      mode1PBtn.addEventListener('click', () => {
        this.gameMode = '1P';
        mode1PBtn.classList.add('active');
        mode2PBtn.classList.remove('active');
        if (p2SelectSection) p2SelectSection.style.display = 'none';
      });
    }

    if (mode2PBtn) {
      mode2PBtn.addEventListener('click', () => {
        this.gameMode = '2P';
        mode2PBtn.classList.add('active');
        mode1PBtn.classList.remove('active');
        if (p2SelectSection) p2SelectSection.style.display = 'block';
        audio.init();
        audio.announce('CO-OP MODE');
      });
    }
  }

  setupCharacterSelection() {

    const cardsP1 = document.querySelectorAll('.char-card[data-player="1"]');
    cardsP1.forEach(card => {
      card.addEventListener('click', () => {
        const charId = card.dataset.char;
        if (!charId) return;

        this.p1Character = charId;
        cardsP1.forEach(c => c.classList.remove('active'));
        card.classList.add('active');

        audio.init();
        audio.resume();
        audio.announce(charId.toUpperCase() + " SELECTED");
      });
    });


    const cardsP2 = document.querySelectorAll('.char-card[data-player="2"]');
    cardsP2.forEach(card => {
      card.addEventListener('click', () => {
        const charId = card.dataset.char;
        if (!charId) return;

        this.p2Character = charId;
        cardsP2.forEach(c => c.classList.remove('active'));
        card.classList.add('active');

        audio.init();
        audio.resume();
        audio.announce(charId.toUpperCase() + " PLAYER 2");
      });
    });
  }

  updateHUDCharacter(charId, name, playerIndex = 0) {
    if (playerIndex === 0) {
      if (this.hudCharName) this.hudCharName.textContent = name;
      if (this.hudCharImg) {
        if (charId === 'claudio') {
          this.hudCharImg.src = 'assets/claudio.png';
          this.hudCharImg.style.display = 'block';
        } else if (charId === 'jessica') {
          this.hudCharImg.src = 'assets/jessica.png';
          this.hudCharImg.style.display = 'block';
        } else {
          this.hudCharImg.src = 'assets/claudio.png';
        }
      }
    } else if (playerIndex === 1) {
      if (this.hudP2CharName) this.hudP2CharName.textContent = name;
      if (this.hudP2CharImg) {
        if (charId === 'claudio') {
          this.hudP2CharImg.src = 'assets/claudio.png';
          this.hudP2CharImg.style.display = 'block';
        } else if (charId === 'jessica') {
          this.hudP2CharImg.src = 'assets/jessica.png';
          this.hudP2CharImg.style.display = 'block';
        } else {
          this.hudP2CharImg.src = 'assets/claudio.png';
        }
      }
    }
  }

  startGame() {
    this.runId++;
    this.runtimeError = null;



    if (this.isMobileDevice() && !this.isFullscreen()) {
      this.requestFullscreenForGame();
    }


    if (this.activeTimers && this.activeTimers.length > 0) {
      this.activeTimers.forEach(timerId => clearTimeout(timerId));
      this.activeTimers = [];
    }
    

    this.isPaused = false;
    const pauseScreen = document.getElementById('pause-screen');
    if (pauseScreen) pauseScreen.style.display = 'none';
    
    audio.init();
    audio.resume();
    audio.startBGM();

    const charAnnounce1 = this.p1Character.toUpperCase();
    const charAnnounce2 = this.p2Character.toUpperCase();
    
    if (this.gameMode === '2P') {
      audio.announce(`2 PLAYERS MISSION START! ${charAnnounce1} AND ${charAnnounce2}!`);
    } else {
      audio.announce(`${charAnnounce1}! MISSION 1 START`);
    }

    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('gameover-screen').style.display = 'none';
    document.getElementById('victory-screen').style.display = 'none';

    this.map = new LevelMap(this.canvas.width, this.canvas.height);
    

    if (this.gameMode === '2P') {
      this.players = [
        new Player(60, this.canvas.height - 180, this.p1Character, 0),
        new Player(130, this.canvas.height - 180, this.p2Character, 1)
      ];
      if (this.hudP2Group) this.hudP2Group.style.display = 'flex';
      this.updateHUDCharacter(this.p2Character, charAnnounce2, 1);
    } else {
      this.players = [
        new Player(60, this.canvas.height - 180, this.p1Character, 0)
      ];
      if (this.hudP2Group) this.hudP2Group.style.display = 'none';
    }

    this.player = this.players[0];

    this.enemies = [];
    this.boss = null;
    this.bossStage = 'MECHAGODZILLA';
    this.dragon = null;
    this.lightningEffects = [];
    this.cinematicActive = false;
    this.cinematicFlash = 0;
    this.cinematicFlashColor = '#ffffff';
    this.finaleElapsed = 0;
    this.slugs = [];
    this.pows = [];
    this.projectiles = [];
    this.explosions = [];
    this.particles = [];
    this.executionEffects = [];
    this.pickups = [];
    this.floatingTexts = [];



    Object.entries(this.biomeGates).forEach(([biome, gate]) => {
      gate.active = false;
      gate.cleared = false;
      gate.enemiesKilled = 0;
      gate.enemiesRequired = this.map.enemySpawners.filter(spawner => spawner.biome === biome).length;
    });


    this.map.powSpawns.forEach(p => {
      this.pows.push(new POW(p.x, p.y, p.reward));
    });


    this.map.slugSpawns.forEach(s => {
      this.slugs.push(new SlugVehicle(s.x, s.y));
    });


    this.updateHUDCharacter(this.p1Character, charAnnounce1, 0);


    this.players.forEach(p => {
      const badge = p.characterId === 'claudio' ? '★ CLAUDIO NORDIC WARRIOR ★' : 
                   (p.characterId === 'jessica' ? '🏹 JESSICA PHANTOM HUNTRESS 🏹' : `${p.characterId.toUpperCase()} READY!`);
      this.addFloatingText(p.x + 10, p.y - 35, badge, p.playerIndex === 0 ? '#ffcc00' : '#00d9ff', 13);
    });

    this.announcedRegions = {};

    this.state = 'PLAYING';
    this.lastTime = performance.now();
  }

  returnToCharacterSelection() {
    this.state = 'MENU';
    this.isPaused = false;

    document.getElementById('pause-screen').style.display = 'none';
    document.getElementById('gameover-screen').style.display = 'none';
    document.getElementById('victory-screen').style.display = 'none';
    document.getElementById('start-screen').style.display = 'flex';

    this.players = [];
    this.player = null;
    this.enemies = [];
    this.projectiles = [];
    this.particles = [];
    this.boss = null;
    this.enemies.length = 0;
    this.projectiles.length = 0;
    this.particles.length = 0;

    if (this.bossHud) {
      this.bossHud.style.display = 'none';
    }

    this.clearAllTimers();

    audio.stopAnnounce();
    audio.stopBossMusic();
  }

  gameLoop(currentTime) {


    if (this.runtimeError) {
      requestAnimationFrame((t) => this.gameLoop(t));
      return;
    }

    const dt = Math.min((currentTime - this.lastTime) / 1000, 0.1);
    this.lastTime = currentTime;
    try {
      this.time += dt;
      this.input.updateGamepad();


      if (this.state === 'PLAYING' && this.input.isPressed('pause')) {
        this.togglePause();
      }


      if (this.state === 'PLAYING' && !this.isPaused) {
        this.update(dt);
      }

      this.render();
    } catch (error) {
      this.runtimeError = error;
      this.isPaused = true;
      this.input.reset();
      

      debugError('=== ERRO CRÍTICO NO LOOP DO JOGO ===');
      debugError('Mensagem:', error.message);
      debugError('Stack:', error.stack);
      debugError('Estado atual:', this.state);
      debugError('Boss existe?', !!this.boss);
      if (this.boss) {
        debugError('Boss tipo:', this.boss.type || 'MECHAGODZILLA');
        debugError('Boss morto?', this.boss.isDead);
        debugError('Boss isGhidorah?', this.boss.isGhidorah);
        debugError('Boss isKingKong?', this.boss.isKingKong);
      }
      debugError('Cinemática ativa?', this.cinematicActive);
      debugError('Dragão existe?', !!this.dragon);
      debugError('=====================================');
      
      const pauseScreen = document.getElementById('pause-screen');
      if (pauseScreen) {
        pauseScreen.innerHTML = `
          <h1 class="game-title-logo" style="color: #ff3333;">⚠️ ERRO NO JOGO</h1>
          <p class="subtitle" style="color: #ffcc00;">Ocorreu um erro: ${error.message}</p>
          <div class="menu-card">
            <p style="color: #88a0c7; font-size: 10px;">Aperte F12 e veja o Console para mais detalhes</p>
          </div>
          <button onclick="location.reload()" class="btn-arcade">🔄 RECARREGAR PÁGINA</button>
        `;
        pauseScreen.style.display = 'flex';
      }
    } finally {
      this.input.clearPressed();
      requestAnimationFrame((t) => this.gameLoop(t));
    }
  }

  togglePause() {
    this.isPaused = !this.isPaused;
    
    const pauseScreen = document.getElementById('pause-screen');
    if (pauseScreen) {
      pauseScreen.style.display = this.isPaused ? 'flex' : 'none';
    }
    

    if (this.isPaused) {
      audio.pauseBGM();
    } else {
      audio.resumeBGM();
    }
  }

  update(dt) {
    renderer.update(dt);



    if (this.cinematicActive) {
      this.updateFinaleCinematic(dt);
      return;
    }


    this.players.forEach(p => {
      p.update(dt, this.input, this);
    });


    this.slugs.forEach(slug => {
      slug.update(dt, this.input, this);
    });


    const leadPlayerX = Math.max(...this.players.map(p => p.x));


    if (!this.announcedRegions['tokyo'] && leadPlayerX > 30) {
      this.announcedRegions['tokyo'] = true;
      this.addFloatingText(this.camera.x + 480, 80, '⛩️ SETOR 1: TÓQUIO, JAPÃO (CYBER NEO-TOKYO) ⛩️', '#00d9ff', 15);
    }
    if (!this.announcedRegions['brazil'] && leadPlayerX > 1300) {
      this.announcedRegions['brazil'] = true;
      this.addFloatingText(this.camera.x + 480, 80, '🌴 SETOR 2: AMAZÔNIA & RUÍNAS TROPICAIS, BRASIL 🌴', '#52b788', 15);
      audio.announce("SECTOR TWO BRAZIL");
    }
    if (!this.announcedRegions['europe'] && leadPlayerX > 2500) {
      this.announcedRegions['europe'] = true;
      this.addFloatingText(this.camera.x + 480, 80, '🏰 SETOR 3: PARIS & CASTELO MEDIEVAL, FRANÇA 🏰', '#ffaa00', 15);
      audio.announce("SECTOR THREE EUROPE");
    }
    if (!this.announcedRegions['egypt'] && leadPlayerX > 3700) {
      this.announcedRegions['egypt'] = true;
      this.addFloatingText(this.camera.x + 480, 80, '🏜️ ARENA FINAL: PIRÂMIDES DE GIZÉ & ESFINGE, EGITO 🏜️', '#ffcc00', 16);
      audio.announce("FINAL ARENA EGYPT DETECTED");
    }
    if (!this.announcedRegions['newyork'] && leadPlayerX > 5150) {
      this.announcedRegions['newyork'] = true;
      this.addFloatingText(this.camera.x + 480, 80, '🗽 APOCALIPSE: MANHATTAN DESTRUÍDA, NOVA YORK 🗽', '#ff3333', 17);
      audio.announce("APOCALYPSE NEW YORK CITY");
      this.triggerScreenShake(15, 0.6);
    }

    this.map.enemySpawners.forEach(spawner => {
      if (!spawner.spawned && leadPlayerX > spawner.triggerX) {
        spawner.spawned = true;
        const b = spawner.biome || this.getBiomeAt(spawner.x);
        const enemy = new Enemy(spawner.x, spawner.y, spawner.type, b);
        enemy.biome = spawner.biome;
        this.enemies.push(enemy);
        

        if (spawner.biome && this.biomeGates[spawner.biome]) {
          this.biomeGates[spawner.biome].active = true;
        }
      }
    });


    this.enemies = this.enemies.filter(e => {
      if (e.hp <= 0) {

        if (e.biome && this.biomeGates[e.biome] && !this.biomeGates[e.biome].cleared) {
          this.biomeGates[e.biome].enemiesKilled++;
          

          const gate = this.biomeGates[e.biome];
          if (gate.enemiesKilled >= gate.enemiesRequired && gate.active) {
            gate.cleared = true;
            gate.active = false;
            audio.announce(`${e.biome.toUpperCase()} CLEARED!`);
            this.addFloatingText(gate.x, 200, `🎯 ${e.biome.toUpperCase()} ZONE CLEARED! 🎯`, '#00ff00', 16);
            this.triggerScreenShake(8, 0.4);
          }
        }
        return false;
      }
      return true;
    });
    this.enemies.forEach(e => {

      const targetP = this.getClosestPlayer(e.x, e.y);
      e.update(dt, targetP, this);
    });



    if (this.bossStage === 'MECHAGODZILLA' && !this.boss && this.map.bossSpawn && leadPlayerX > this.map.bossSpawn.triggerX) {
      this.boss = new Boss(this.map.bossSpawn.x, this.map.bossSpawn.y);
      audio.playBossWarning();
      audio.playMechaRoar();
      audio.announce("WARNING! MECHAGODZILLA DETECTED");
      this.bossHud.style.display = 'flex';
      this.addFloatingText(this.boss.x, this.boss.y - 30, '⚠️ WARNING! MECHAGODZILLA APEX TITAN! ⚠️', '#ff0033', 15);
    }

    if (this.bossStage === 'KONG' && !this.boss && this.map.finalBossSpawn && leadPlayerX > this.map.finalBossSpawn.triggerX) {

      this.cinematicFlash = 0;
      this.cinematicFlashColor = '#ffffff';
      this.lightningEffects = [];
      
      this.boss = new KingKongBoss(this.map.finalBossSpawn.x, this.map.finalBossSpawn.y);
      audio.playBossWarning();
      audio.playKongRoar();
      audio.announce("EXTREME DANGER! KING KONG DETECTED");
      this.bossHud.style.display = 'flex';
      this.addFloatingText(this.boss.x, this.boss.y - 40, '🦍 ALERTA MÁXIMO! KING KONG TITÃ! 🦍', '#ff3300', 18);
      this.triggerScreenShake(24, 0.8);
    }

    if (this.boss) {
      const targetP = this.getClosestPlayer(this.boss.x, this.boss.y);
      

      if (!this.cinematicActive || this.boss.isGhidorah || this.boss.isKingKong) {
        this.boss.update(dt, targetP, this);
      }



      if (this.boss.isDead && !this.boss.isGhidorah && !this.boss.isKingKong && !this.cinematicActive && !this.dragon) {
        this.beginGhidorahTransition(this.boss);
      }
    }



    if (this.cinematicActive && this.dragon && this.dragon.state !== 'DONE' && this.dragon.update) {
      try {

        this.dragon.update(dt, this);
      } catch (dragonError) {
        debugError('Erro ao atualizar dragão durante cinemática:', dragonError);
        this.dragon = null;
        this.cinematicActive = false;
        if (!this.boss || !this.boss.isGhidorah) {
          this.spawnGhidorahBoss();
        }
      }
    }


    this.pows.forEach(pow => {
      const targetP = this.getClosestPlayer(pow.x, pow.y);
      pow.update(dt, targetP, this);
    });


    this.updateProjectiles(dt);


    this.explosions.forEach(exp => {
      exp.life -= dt;
    });
    this.explosions = this.explosions.filter(exp => exp.life > 0);


    this.updateParticles(dt);
    this.updateExecutionEffects(dt);
    this.updateLightningEffects(dt);


    this.floatingTexts.forEach(t => {
      t.y -= 24 * dt;
      t.alpha -= 1.1 * dt;
    });
    this.floatingTexts = this.floatingTexts.filter(t => t.alpha > 0);


    this.checkPickupCollisions();


    this.updateCamera(dt);


    this.updateHUD();
    

    this.updateBiomeGates();
  }

  getClosestPlayer(x, y) {

    if (!this.players || this.players.length === 0) {
      return this.player || { x: x, y: y, width: 40, height: 40, isDead: true };
    }
    
    const activePlayers = this.players.filter(p => p && !p.isDead);
    if (activePlayers.length === 0) {

      return this.players[0] || this.player || { x: x, y: y, width: 40, height: 40, isDead: true };
    }
    
    let closest = activePlayers[0];
    let minDist = Infinity;
    activePlayers.forEach(p => {
      const d = Math.hypot((p.x + p.width / 2) - x, (p.y + p.height / 2) - y);
      if (d < minDist) {
        minDist = d;
        closest = p;
      }
    });
    return closest;
  }


  updateBiomeGates() {

    Object.keys(this.biomeGates).forEach(biome => {
      const gate = this.biomeGates[biome];
      
      if (gate.active && !gate.cleared) {

        this.players.forEach(p => {
          if (p && !p.isDead) {

            if (p.x > gate.x) {
              p.x = gate.x;
              p.vx = Math.min(0, p.vx);
              

              if (Math.random() < 0.05) {
                this.addFloatingText(gate.x + 50, 250, `⚠️ CLEAR ALL ENEMIES! ${gate.enemiesKilled}/${gate.enemiesRequired} ⚠️`, '#ff3300', 12);
              }
            }
          }
        });
      }
    });
  }

  getBiomeAt(x) {
    if (x > 5200) return 'newyork';
    if (x > 3700) return 'egypt';
    if (x > 2500) return 'europe';
    if (x > 1250) return 'brazil';
    return 'tokyo';
  }

  checkAllPlayersDead() {
    const anyAlive = this.players.some(p => p.lives >= 0 || !p.isDead);
    if (!anyAlive) {
      this.gameOver();
    }
  }

  updateProjectiles(dt) {
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const p = this.projectiles[i];
      

      if (!p || typeof p.update !== 'function') {
        debugWarn(`Projétil inválido no índice ${i}, removendo`);
        this.projectiles.splice(i, 1);
        continue;
      }
      
      const alive = p.update(dt, this);
      if (!alive) {
        if (p.type === 'grenade' || p.type === 'slug_cannon') {
          this.spawnExplosion(p.x, p.y, p.type === 'slug_cannon' ? 65 : 45);
          audio.playExplosion(true);
        }
        this.projectiles.splice(i, 1);
        continue;
      }


      if (p.isPlayer) {
        let hit = false;


        for (let j = this.enemies.length - 1; j >= 0; j--) {
          const e = this.enemies[j];
          if (p.x > e.x && p.x < e.x + e.width && p.y > e.y && p.y < e.y + e.height) {
            e.takeDamage(p.damage, Math.atan2(p.vy, p.vx), this);
            hit = true;
            break;
          }
        }


        if (!hit && this.boss && !this.boss.isDead) {
          if (p.x > this.boss.x && p.x < this.boss.x + this.boss.width && p.y > this.boss.y && p.y < this.boss.y + this.boss.height) {
            this.boss.takeDamage(p.damage, this);
            hit = true;
          }
        }


        if (!hit) {
          for (let k = 0; k < this.map.destructibles.length; k++) {
            const obj = this.map.destructibles[k];
            if (!obj.destroyed && p.x > obj.x && p.x < obj.x + obj.width && p.y > obj.y && p.y < obj.y + obj.height) {
              obj.hp -= p.damage;
              hit = true;
              if (obj.hp <= 0) {
                obj.destroyed = true;
                if (obj.type === 'barrel') {
                  this.spawnExplosion(obj.x + obj.width / 2, obj.y + obj.height / 2, 60);
                  audio.playExplosion(true);

                  this.enemies.forEach(e => {
                    if (Math.hypot((e.x + e.width / 2) - (obj.x + obj.width / 2), (e.y + e.height / 2) - (obj.y + obj.height / 2)) < 110) {
                      e.takeDamage(120, 0, this);
                    }
                  });
                } else {
                  this.spawnExplosion(obj.x + obj.width / 2, obj.y + obj.height / 2, 25);
                  audio.playExplosion(false);

                  this.pickups.push(new Pickup(obj.x, obj.y, 'BOMB'));
                }
              }
              break;
            }
          }
        }

        if (hit && p.type !== 'laser' && p.type !== 'flame') {
          if (p.type === 'rocket' || p.type === 'grenade' || p.type === 'slug_cannon') {
            this.spawnExplosion(p.x, p.y, p.type === 'slug_cannon' ? 65 : 45);
            audio.playExplosion(true);
          } else {
            this.spawnSpark(p.x, p.y);
          }
          this.projectiles.splice(i, 1);
        }

      } else {

        let hitAny = false;
        for (let pi = 0; pi < this.players.length; pi++) {
          const pl = this.players[pi];
          if (pl.isDead) continue;
          const target = (pl.inSlug && pl.slugRef) ? pl.slugRef : pl;
          if (p.x > target.x && p.x < target.x + target.width && p.y > target.y && p.y < target.y + target.height) {
            target.takeDamage(p.damage, this);
            if (p.type === 'rocket' || p.type === 'grenade') {
              this.spawnExplosion(p.x, p.y, 40);
              audio.playExplosion(true);
            }
            hitAny = true;
            break;
          }
        }
        if (hitAny) {
          this.projectiles.splice(i, 1);
        }
      }
    }
  }

  checkPickupCollisions() {
    for (let i = this.pickups.length - 1; i >= 0; i--) {
      const item = this.pickups[i];
      for (let pIdx = 0; pIdx < this.players.length; pIdx++) {
        const p = this.players[pIdx];
        if (p.isDead) continue;
        const dist = Math.hypot((p.x + p.width / 2) - (item.x + 14), (p.y + p.height / 2) - (item.y + 14));

        if (dist < 36) {
          audio.playItemPickup();

          if (item.type === 'FOOD') {
            p.score += 500;
            p.hp = Math.min(p.maxHp, p.hp + 25);
            this.addFloatingText(item.x, item.y - 15, '+500 FOOD!', '#00ff66');
          } else if (item.type === 'BOMB') {
            p.grenades += 10;
            this.addFloatingText(item.x, item.y - 15, '+10 BOMBS!', '#ff3300');
          } else {
            p.equipWeapon(item.type, item.ammo, this);
          }

          this.pickups.splice(i, 1);
          break;
        }
      }
    }
  }

  updateParticles(dt) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life -= dt;
      if (p.life <= 0) {
        this.particles.splice(i, 1);
        continue;
      }

      if (p.type === 'casing') {
        p.vy += 0.4;
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += 0.3;

        if (p.y > this.canvas.height - 80) {
          p.y = this.canvas.height - 80;
          p.vy = -p.vy * 0.4;
          p.vx *= 0.7;
        }
      } else if (p.type === 'smoke') {
        p.x += p.vx;
        p.y += p.vy;
        p.radius += 8 * dt;
        p.alpha = p.life / p.maxLife;
      } else if (p.type === 'spark' || p.type === 'blood') {
        p.vy += 0.3;
        p.x += p.vx;
        p.y += p.vy;
      }
    }
  }

  updateExecutionEffects(dt) {
    for (let i = this.executionEffects.length - 1; i >= 0; i--) {
      const effect = this.executionEffects[i];
      effect.life -= dt;
      effect.split = Math.min(28, effect.split + 64 * dt);
      effect.rise += 36 * dt;
      if (effect.life <= 0) this.executionEffects.splice(i, 1);
    }
  }

  updateFinaleCinematic(dt) {
    this.finaleElapsed += dt;
    

    if (!this.dragon || !this.dragon.update) {
      debugWarn('Dragão não encontrado ou inválido durante cinemática, forçando spawn do Ghidorah');
      this.cinematicActive = false;
      this.dragon = null;
      this.spawnGhidorahBoss();
      return;
    }
    

    if (!this.boss) {
      debugWarn('Boss não encontrado durante cinemática, forçando spawn do Ghidorah');
      this.cinematicActive = false;
      this.dragon = null;
      this.spawnGhidorahBoss();
      return;
    }
    
    try {
      if (this.dragon && this.dragon.state !== 'DONE') {
        this.dragon.update(dt, this);
      }
    } catch (error) {
      debugError('Falha na cinemática do dragão:', error);
      this.cinematicActive = false;
      this.dragon = null;
      this.spawnGhidorahBoss();
      return;
    }

    if (this.state !== 'PLAYING') return;


    if (this.finaleElapsed >= 2.5 && (!this.boss || !this.boss.isGhidorah)) {
      debugLog('Timeout de segurança atingido, spawning Ghidorah');
      this.spawnGhidorahBoss();
      return;
    }


    if (!this.dragon || this.dragon.state === 'DONE') {
      if (this.boss && this.boss.isGhidorah) {
        debugLog('Cinemática completa, King Ghidorah está ativo');
        this.cinematicActive = false;
        return;
      } else {

        debugLog('Dragão terminou mas Ghidorah não foi spawnado, corrigindo...');
        this.spawnGhidorahBoss();
        return;
      }
    }
    this.cinematicFlash = Math.max(0, this.cinematicFlash - dt * 1.8);



    this.players.forEach(player => {
      player.isInvulnerable = true;
      player.vx = 0;
    });
    this.explosions.forEach(explosion => { explosion.life -= dt; });
    this.explosions = this.explosions.filter(explosion => explosion.life > 0);
    this.updateParticles(dt);
    this.updateExecutionEffects(dt);
    this.updateLightningEffects(dt);
    this.floatingTexts.forEach(text => {
      text.y -= 24 * dt;
      text.alpha -= 1.1 * dt;
    });
    this.floatingTexts = this.floatingTexts.filter(text => text.alpha > 0);

    if (this.boss) {
      const targetCameraX = Math.max(0, Math.min(
        this.map.width - this.canvas.width,
        this.boss.x + this.boss.width / 2 - this.canvas.width * 0.52
      ));
      this.camera.x += (targetCameraX - this.camera.x) * Math.min(1, dt * 4);
      this.camera.y = 0;
    }
    this.updateHUD();
  }

  updateLightningEffects(dt) {
    for (let i = this.lightningEffects.length - 1; i >= 0; i--) {
      const bolt = this.lightningEffects[i];
      bolt.life -= dt;
      if (bolt.life <= 0) this.lightningEffects.splice(i, 1);
    }
  }

  updateCamera(dt) {
    const activeTargets = this.players
      .filter(p => !p.isDead)
      .map(p => (p.inSlug && p.slugRef) ? p.slugRef : p);
    
    let avgX = 0;
    if (activeTargets.length > 0) {
      avgX = activeTargets.reduce((sum, t) => sum + t.x, 0) / activeTargets.length;
    } else if (this.player) {
      avgX = this.player.x;
    }

    let targetX = avgX - this.canvas.width * 0.35;
    const maxCamX = Math.max(0, this.map.width - this.canvas.width);


    if (this.boss && !this.boss.isDead) {
      const arenaMinX = this.boss.isKingKong
        ? Math.min(maxCamX, (this.map.finalBossSpawn ? this.map.finalBossSpawn.triggerX - 80 : 6400))
        : Math.min(maxCamX, (this.map.bossSpawn ? this.map.bossSpawn.triggerX - 80 : 3800));
      targetX = Math.max(arenaMinX, Math.min(maxCamX, targetX));
    } else {
      targetX = Math.max(0, Math.min(maxCamX, targetX));
    }


    this.camera.x += (targetX - this.camera.x) * 0.1;
    this.camera.y = 0;


    if (this.shakeDuration > 0) {
      this.shakeDuration -= dt;
      this.camera.x += (Math.random() - 0.5) * this.shakePower * 2;
      this.camera.y += (Math.random() - 0.5) * this.shakePower * 2;
    }
  }

  triggerScreenShake(power, duration) {
    this.shakePower = power;
    this.shakeDuration = duration;
  }


  resolveHorizontalCollision(ent) {
    this.map.platforms.forEach(p => {
      if (ent.x + ent.width > p.x && ent.x < p.x + p.width && ent.y + ent.height > p.y && ent.y < p.y + p.height) {
        if (p.isGround) {
          if (ent.vx > 0) ent.x = p.x - ent.width;
          else if (ent.vx < 0) ent.x = p.x + p.width;
          ent.vx = 0;
        }
      }
    });
  }

  resolveVerticalCollision(ent) {
    this.map.platforms.forEach(p => {
      if (ent.x + ent.width * 0.7 > p.x && ent.x + ent.width * 0.3 < p.x + p.width) {

        if (ent.y + ent.height >= p.y && ent.y + ent.height <= p.y + 18 && ent.vy >= 0) {
          ent.y = p.y - ent.height;
          ent.vy = 0;
          ent.onGround = true;
        }
      }
    });
  }


  spawnExplosion(x, y, radius = 40) {
    const blobs = [];
    const count = 6;
    for (let i = 0; i < count; i++) {
      blobs.push({
        x: (Math.random() - 0.5) * radius * 0.8,
        y: (Math.random() - 0.5) * radius * 0.8,
        r: radius * (0.4 + Math.random() * 0.4)
      });
    }
    this.explosions.push({
      x, y, radius,
      life: 0.45,
      maxLife: 0.45,
      blobs
    });
  }

  spawnCasing(x, y, dir) {
    this.particles.push({
      type: 'casing',
      x, y,
      vx: dir * (2 + Math.random() * 2),
      vy: -3 - Math.random() * 2,
      rotation: Math.random() * Math.PI,
      life: 1.2,
      maxLife: 1.2
    });
  }

  spawnSpark(x, y) {
    for (let i = 0; i < 4; i++) {
      this.particles.push({
        type: 'spark',
        x, y,
        vx: (Math.random() - 0.5) * 6,
        vy: (Math.random() - 0.5) * 6,
        life: 0.25,
        maxLife: 0.25
      });
    }
  }

  spawnSmoke(x, y, radius = 6) {
    this.particles.push({
      type: 'smoke',
      x, y,
      vx: (Math.random() - 0.5) * 1.5,
      vy: -1 - Math.random() * 1.5,
      radius,
      alpha: 1,
      life: 0.5,
      maxLife: 0.5
    });
  }

  spawnBlood(x, y) {
    for (let i = 0; i < 5; i++) {
      this.particles.push({
        type: 'blood',
        x, y,
        vx: (Math.random() - 0.5) * 4,
        vy: -2 - Math.random() * 3,
        radius: 2 + Math.random() * 2,
        life: 0.4,
        maxLife: 0.4
      });
    }
  }

  spawnDust(x, y) {
    for (let i = 0; i < 3; i++) {
      this.spawnSmoke(x + (Math.random() - 0.5) * 12, y - 2, 4);
    }
  }

  addExecutionSplit(enemy, direction) {
    this.executionEffects.push({
      x: enemy.x + enemy.width / 2,
      y: enemy.y + enemy.height / 2,
      width: enemy.width,
      height: enemy.height,
      biome: enemy.biome || 'tokyo',
      direction,
      split: 0,
      rise: 0,
      life: 0.6,
      maxLife: 0.6
    });
  }

  startDragonFinale(boss) {
    if (this.dragon || !boss) {
      debugWarn('startDragonFinale: dragão já existe ou boss é nulo');
      return;
    }
    
    debugLog('Iniciando cinemática do dragão...');
    this.bossStage = 'TRANSITION_TO_GHIDORAH';
    this.cinematicActive = true;
    this.finaleElapsed = 0;
    this.projectiles = [];
    this.players.forEach(player => {
      player.isInvulnerable = true;
      player.vx = 0;
    });



    const transitionRunId = this.runId;
    const transitionTimer = setTimeout(() => {
      this.activeTimers = this.activeTimers.filter(id => id !== transitionTimer);
      if (
        this.runId === transitionRunId &&
        this.state === 'PLAYING' &&
        this.bossStage === 'TRANSITION_TO_GHIDORAH' &&
        (!this.boss || !this.boss.isGhidorah)
      ) {
        this.spawnGhidorahBoss();
      }
    }, 1900);
    this.activeTimers.push(transitionTimer);
    
    try {
      this.dragon = new DragonCinematic(boss, this);
      debugLog('DragonCinematic criado com sucesso');
    } catch (error) {
      debugError('Erro ao criar DragonCinematic:', error);

      this.spawnGhidorahBoss();
    }
  }

  beginGhidorahTransition(defeatedBoss) {
    if (this.bossStage !== 'MECHAGODZILLA' || this.state !== 'PLAYING') return;



    this.bossStage = 'TRANSITION_TO_GHIDORAH';
    

    const hasDragonCinematic = this.dragon && this.dragon.state !== 'DONE';
    
    if (!hasDragonCinematic) {

      this.cinematicActive = false;
      this.dragon = null;
      if (this.boss === defeatedBoss) this.boss = null;
    } else {

      debugLog('Mantendo referência do boss para cinemática do dragão');
      if (this.boss === defeatedBoss) {
        this.boss.hiddenByDragon = true;
      }
    }
    
    this.projectiles = [];
    if (this.bossHud) this.bossHud.style.display = 'none';

    const x = defeatedBoss ? defeatedBoss.x + defeatedBoss.width / 2 : this.camera.x + this.canvas.width * 0.7;
    const y = defeatedBoss ? defeatedBoss.y + defeatedBoss.height / 2 : this.canvas.height * 0.45;
    this.triggerScreenShake(18, 0.45);
    this.cinematicFlash = 0.4;
    this.cinematicFlashColor = '#ff5500';
    this.addFloatingText(x, y - 120, '⚡ KING GHIDORAH SE APROXIMA! ⚡', '#ffd700', 17);
    audio.playBossWarning();
    audio.playGhidorahRoar();

    const transitionRunId = this.runId;
    const timerId = setTimeout(() => {
      this.activeTimers = this.activeTimers.filter(id => id !== timerId);
      if (this.runId !== transitionRunId || this.state !== 'PLAYING' || this.bossStage !== 'TRANSITION_TO_GHIDORAH') return;
      this.spawnGhidorahBoss();
    }, 850);
    this.activeTimers.push(timerId);
  }

  startGhidorahBossTransition() {
    this.cinematicActive = true;
    this.dragon = null;
    this.projectiles = [];
    this.lightningEffects = [];
    

    this.cinematicFlash = 0.6;
    this.cinematicFlashColor = '#ffd700';
    this.triggerScreenShake(20, 0.8);
    audio.playBossWarning();
    audio.playGhidorahRoar();
    audio.announce("WARNING! KING GHIDORAH HAS AWAKENED");

    this.addFloatingText(this.camera.x + this.canvas.width / 2, 120, '⚡ ALERTA MÁXIMO! O DRAGÃO DOURADO RETORNA! ⚡', '#ffd700', 18);


    const currentRunId = this.runId;
    for (let i = 0; i < 6; i++) {
      setTimeout(() => {
        if (this.runId !== currentRunId || this.state !== 'PLAYING') return;
        const lx = this.camera.x + 80 + Math.random() * (this.canvas.width - 160);
        this.addLightningBolt(lx, 0, lx + (Math.random() - 0.5) * 80, 440);
        this.spawnExplosion(lx, 440, 30);
        audio.playExplosion(false);
      }, i * 180);
    }

    setTimeout(() => {
      if (this.runId === currentRunId && this.state === 'PLAYING') {
        this.spawnGhidorahBoss();
      }
    }, 1400);
  }

  spawnGhidorahBoss() {

    if (this.boss && this.boss.isGhidorah) {
      debugLog('King Ghidorah já existe, pulando spawn');
      return;
    }

    debugLog('Spawning King Ghidorah Boss...');
    

    this.cinematicActive = false;
    this.dragon = null;
    this.finaleElapsed = 0;
    this.bossStage = 'GHIDORAH';
    

    this.players.forEach(player => {
      player.isInvulnerable = false;
    });


    const spawnX = Math.min(this.map.bossSpawn ? this.map.bossSpawn.x : 4600, this.camera.x + this.canvas.width * 0.72);
    const spawnY = this.map.bossSpawn ? this.map.bossSpawn.y : 220;
    this.boss = new KingGhidorahBoss(spawnX, spawnY);
    

    if (this.bossHud) {
      this.bossHud.style.display = 'flex';
    }
    
    debugLog('King Ghidorah Boss spawned successfully at', spawnX, spawnY);
  }

  completeGhidorahBattle(ghidorah) {
    if (this.bossStage !== 'GHIDORAH') return;



    this.bossStage = 'KONG';
    const completedRunId = this.runId;
    const timerId = setTimeout(() => {
      this.activeTimers = this.activeTimers.filter(id => id !== timerId);
      if (this.runId !== completedRunId || this.state !== 'PLAYING') return;
      if (this.boss === ghidorah) this.boss = null;
      if (this.bossHud) this.bossHud.style.display = 'none';
      this.addFloatingText(this.camera.x + 480, 120, '🗽 AVANCE PARA NOVA YORK! A BATALHA FINAL COMEÇA! 🗽', '#00ffcc', 18);
      audio.announce('ADVANCE TO NEW YORK! FINAL MISSION');
    }, 2200);
    this.activeTimers.push(timerId);
  }

  completeKongBattle(kong) {
    if (this.bossStage !== 'KONG') return;

    this.bossStage = 'COMPLETE';
    const completedRunId = this.runId;
    const timerId = setTimeout(() => {
      this.activeTimers = this.activeTimers.filter(id => id !== timerId);
      if (this.runId === completedRunId && this.state === 'PLAYING' && this.boss === kong) {
        this.missionComplete();
      }
    }, 2800);
    this.activeTimers.push(timerId);
  }

  finishDragonFinale() {
    if (this.state === 'VICTORY') return;
    this.cinematicActive = false;
    this.lightningEffects = [];
    this.missionComplete();
  }

  triggerDragonClawStrike(boss) {
    if (!boss) return;
    const x = boss.x + boss.width * 0.62;
    const y = boss.y + boss.height * 0.42;
    this.triggerScreenShake(21, 0.48);
    this.cinematicFlash = Math.max(this.cinematicFlash, 0.42);
    this.cinematicFlashColor = '#fff0a8';
    audio.playExplosion(true);
    audio.playMechaRoar();
    this.addFloatingText(x, y - 110, '💥 RASANTE DAS TRÊS CABEÇAS! 💥', '#ffe066', 15);



    for (let i = 0; i < 7; i++) {
      const angle = -2.7 + i * 0.24;
      const reach = 90 + i * 20;
      const ex = x + Math.cos(angle) * reach;
      const ey = y + Math.sin(angle) * reach * 0.52;
      this.spawnExplosion(ex, ey, 24 + Math.random() * 20);
      this.addLightningBolt(x, y - 28, ex, ey);
    }
    for (let i = 0; i < 32; i++) {
      this.particles.push({
        type: 'spark', x, y,
        vx: (Math.random() - 0.5) * 22,
        vy: -Math.random() * 14 + (Math.random() - 0.5) * 6,
        life: 0.52, maxLife: 0.52
      });
    }
    boss.cinematicTilt = (boss.facing || -1) * 0.3;
    boss.cinematicOpacity = 0.72;
  }

  triggerDragonAftershock(x, y, pulse) {
    const radius = 170 + pulse * 85;
    this.triggerScreenShake(14 + pulse * 3, 0.3);
    this.cinematicFlash = Math.max(this.cinematicFlash, 0.2 + pulse * 0.035);
    this.cinematicFlashColor = '#9ef4ff';
    audio.playExplosion(false);

    for (let i = 0; i < 5 + pulse; i++) {
      const angle = (Math.PI * 2 * i) / (5 + pulse) + pulse * 0.38;
      const ex = x + Math.cos(angle) * radius;
      const ey = y + Math.sin(angle) * radius * 0.46;
      this.spawnExplosion(ex, ey, 22 + pulse * 7);
      this.addLightningBolt(x, y - 38, ex, ey);
    }
  }

  triggerDragonImpact(x, y, radius) {
    this.triggerScreenShake(30, 0.9);
    this.cinematicFlash = 0.72;
    this.cinematicFlashColor = '#d7fbff';
    audio.playExplosion(true);
    audio.playMechaRoar();
    this.addFloatingText(this.camera.x + this.canvas.width / 2, 105, '⚡ DRAGON STORM — APOCALYPSE AOE! ⚡', '#f8e16c', 16);



    this.enemies.forEach(enemy => {
      if (Math.hypot((enemy.x + enemy.width / 2) - x, (enemy.y + enemy.height / 2) - y) <= radius) {
        enemy.takeDamage(9999, 0, this);
      }
    });
    this.projectiles = this.projectiles.filter(projectile => projectile.isPlayer);

    for (let i = 0; i < 12; i++) {
      const angle = (Math.PI * 2 * i) / 12;
      const distance = 90 + Math.random() * radius * 0.6;
      const ex = x + Math.cos(angle) * distance;
      const ey = y + Math.sin(angle) * distance * 0.42;
      this.spawnExplosion(ex, ey, 35 + Math.random() * 35);
      this.addLightningBolt(x, y - 45, ex, ey);
    }
    for (let i = 0; i < 38; i++) {
      this.particles.push({
        type: 'spark', x, y,
        vx: (Math.random() - 0.5) * 24,
        vy: (Math.random() - 0.5) * 20,
        life: 0.65, maxLife: 0.65
      });
    }
  }

  addLightningBolt(startX, startY, endX, endY) {
    const points = [{ x: startX, y: startY }];
    const segments = 7;
    for (let i = 1; i < segments; i++) {
      const progress = i / segments;
      points.push({
        x: startX + (endX - startX) * progress + (Math.random() - 0.5) * 55,
        y: startY + (endY - startY) * progress + (Math.random() - 0.5) * 38
      });
    }
    points.push({ x: endX, y: endY });
    this.lightningEffects.push({ points, life: 0.48, maxLife: 0.48 });
  }

  addFloatingText(x, y, text, color = '#ffee00', size = 11) {
    this.floatingTexts.push({ x, y, text, color, size, alpha: 1.0 });
  }

  getClosestEnemy(x, y) {
    let closest = null;
    let minDist = 600;
    this.enemies.forEach(e => {
      const d = Math.hypot((e.x + e.width / 2) - x, (e.y + e.height / 2) - y);
      if (d < minDist) {
        minDist = d;
        closest = e;
      }
    });
    if (!closest && this.boss && !this.boss.isDead) {
      closest = this.boss;
    }
    return closest;
  }


  updateHUD() {

    const p1 = this.players[0] || this.player;
    if (p1) {
      const hpPct1 = Math.max(0, Math.min(100, (p1.hp / p1.maxHp) * 100));
      this.hudHpFill.style.width = `${hpPct1}%`;
      this.hudScore.textContent = String(p1.score).padStart(6, '0');
      this.hudWeaponName.textContent = p1.weapon;
      this.hudWeaponAmmo.textContent = p1.ammo === Infinity ? '∞' : p1.ammo;
      this.hudWeaponIcon.textContent = p1.weapon === 'AXE' ? '🪓' : (p1.weapon === 'BOW' ? '🏹' : p1.weapon[0]);
      this.hudGrenades.textContent = `x${p1.grenades}`;
      this.hudLivesContainer.innerHTML = '';
      for (let i = 0; i < Math.max(0, p1.lives); i++) {
        const lifeIcon = document.createElement('span');
        lifeIcon.className = 'life-icon';
        this.hudLivesContainer.appendChild(lifeIcon);
      }
    }


    if (this.gameMode === '2P' && this.players[1]) {
      const p2 = this.players[1];
      if (this.hudP2HpFill) {
        const hpPct2 = Math.max(0, Math.min(100, (p2.hp / p2.maxHp) * 100));
        this.hudP2HpFill.style.width = `${hpPct2}%`;
      }
      if (this.hudP2WeaponName) this.hudP2WeaponName.textContent = p2.weapon;
      if (this.hudP2WeaponAmmo) this.hudP2WeaponAmmo.textContent = p2.ammo === Infinity ? '∞' : p2.ammo;
      if (this.hudP2WeaponIcon) this.hudP2WeaponIcon.textContent = p2.weapon === 'AXE' ? '🪓' : (p2.weapon === 'BOW' ? '🏹' : p2.weapon[0]);
      if (this.hudP2Grenades) this.hudP2Grenades.textContent = `x${p2.grenades}`;
      if (this.hudP2LivesContainer) {
        this.hudP2LivesContainer.innerHTML = '';
        for (let i = 0; i < Math.max(0, p2.lives); i++) {
          const lifeIcon = document.createElement('span');
          lifeIcon.className = 'life-icon';
          this.hudP2LivesContainer.appendChild(lifeIcon);
        }
      }
    }


    const pInSlug = this.players.find(p => p.inSlug && p.slugRef);
    if (pInSlug && pInSlug.slugRef) {
      this.slugHud.style.display = 'flex';
      this.slugCannonCount.textContent = `HP: ${pInSlug.slugRef.hp} | CANNON: x${pInSlug.slugRef.cannons}`;
    } else {
      this.slugHud.style.display = 'none';
    }


    if (this.boss && !this.boss.isDead) {
      this.bossHud.style.display = 'flex';
      const bossHpPct = Math.max(0, Math.min(100, (this.boss.hp / this.boss.maxHp) * 100));
      this.bossHpFill.style.width = `${bossHpPct}%`;
      if (this.boss.isKingKong) {
        if (this.bossTitle) this.bossTitle.textContent = '👑 TITÃ SUPREMO: KING KONG 👑';
        this.bossHpFill.style.background = 'linear-gradient(90deg, #ff2200, #ff7700, #ffcc00)';
        this.bossHpFill.style.boxShadow = '0 0 16px #ff4400';
        if (this.bossPhase) {
          const kongLabels = this.boss.phaseLabels || ['FÚRIA URBANA', 'DESTRUIÇÃO TOTAL', 'APOCALIPSE PRIMORDIAL'];
          this.bossPhase.textContent = `FASE ${this.boss.phase} · ${kongLabels[this.boss.phase - 1] || 'BATALHA FINAL'}`;
        }
      } else if (this.boss.isGhidorah) {
        if (this.bossTitle) this.bossTitle.textContent = '👑 TITÃ ANCESTRAL: KING GHIDORAH 👑';
        this.bossHpFill.style.background = 'linear-gradient(90deg, #ffd700, #ff9900, #fff580)';
        this.bossHpFill.style.boxShadow = '0 0 15px #ffd700';
        if (this.bossPhase) {
          const ghidorahLabels = this.boss.phaseLabels || ['TEMPESTADE DOURADA', 'SOBRECARGA GRAVITACIONAL', 'APOCALIPSE ANCESTRAL'];
          this.bossPhase.textContent = `FASE ${this.boss.phase} · ${ghidorahLabels[this.boss.phase - 1] || 'BATALHA FINAL'}`;
        }
      } else {
        if (this.bossTitle) this.bossTitle.textContent = '⚠️ APEX TITAN: MECHAGODZILLA ⚠️';
        this.bossHpFill.style.background = 'linear-gradient(90deg, #ff0033, #ff6600, #ffee00)';
        this.bossHpFill.style.boxShadow = '0 0 12px #ff0033';
        if (this.bossPhase) {
          const phaseLabels = ['SISTEMAS ONLINE', 'PROTOCOLO DE CAÇA', 'NÚCLEO EM FUSÃO'];
          this.bossPhase.textContent = `FASE ${this.boss.phase} · ${phaseLabels[this.boss.phase - 1]}`;
        }
      }
    } else {
      this.bossHud.style.display = 'none';
    }
  }


  gameOver() {
    this.state = 'GAMEOVER';
    audio.announce("GAME OVER");
    const totalScore = this.players.reduce((sum, p) => sum + (p.score || 0), 0);
    document.getElementById('final-score-gameover').textContent = totalScore;
    document.getElementById('gameover-screen').style.display = 'flex';
  }

  missionComplete() {
    this.state = 'VICTORY';
    audio.playMissionComplete();
    audio.announce("MISSION ALL OVER");
    const totalScore = this.players.reduce((sum, p) => sum + (p.score || 0), 0);
    document.getElementById('final-score-victory').textContent = totalScore;
    document.getElementById('victory-screen').style.display = 'flex';
  }


  render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    if (this.state === 'START') {

      renderer.drawParallaxBackground(this.ctx, { x: this.time * 20, y: 0 }, this.canvas.width, this.canvas.height, 4000);
      renderer.drawMenuEasterEggs(this.ctx, this.canvas.width, this.canvas.height, this.time);
      return;
    }


    renderer.drawParallaxBackground(this.ctx, this.camera, this.canvas.width, this.canvas.height, this.map.width);


    renderer.drawMapElements(this.ctx, this.camera, this.map);


    this.slugs.forEach(s => {
      if (!s.destroyed) renderer.drawSlug(this.ctx, this.camera, s, (s.driverCharacterId || 'claudio'));
    });


    this.pows.forEach(pow => {
      renderer.drawPOW(this.ctx, this.camera, pow);
    });


    this.enemies.forEach(e => {
      renderer.drawEnemy(this.ctx, this.camera, e);
    });



    renderer.drawExecutionEffects(this.ctx, this.camera, this.executionEffects);


    if (this.boss && !this.boss.hiddenByDragon) {
      renderer.drawBoss(this.ctx, this.camera, this.boss);
    }

    if (this.dragon && this.dragon.state !== 'DONE') {
      renderer.drawDragon(this.ctx, this.camera, this.dragon);
    }


    this.players.forEach(p => {
      if (!p.inSlug && !p.isDead) {
        renderer.drawPlayer(this.ctx, this.camera, p);
      }
    });

    renderer.drawPickups(this.ctx, this.camera, this.pickups);


    renderer.drawProjectiles(this.ctx, this.camera, this.projectiles);


    renderer.drawParticles(this.ctx, this.camera, this.particles);

    renderer.drawLightningEffects(this.ctx, this.camera, this.lightningEffects);


    renderer.drawExplosions(this.ctx, this.camera, this.explosions);

    renderer.drawCinematicFlash(this.ctx, this.cinematicFlash, this.cinematicFlashColor);


    renderer.drawFloatingTexts(this.ctx, this.camera, this.floatingTexts);
  }
}


window.addEventListener('DOMContentLoaded', () => {
  window.gameEngine = new Game();
  window.game = window.gameEngine;
});

