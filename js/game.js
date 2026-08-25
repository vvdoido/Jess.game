// Motor Principal do Jogo: Loop, Câmera, Colisões, Spawner e Interface

// Sistema de Debug - Desabilitar em produção para melhor performance
const DEBUG = false;

// Funções de log condicionais
const debugLog = DEBUG ? console.log.bind(console) : () => {};
const debugWarn = DEBUG ? console.warn.bind(console) : () => {};
const debugError = console.error.bind(console); // Erros sempre aparecem

class InputManager {
  constructor() {
    this.keys = {};
    this.pressed = {};
    this.gamepadKeys = {};

    window.addEventListener('keydown', (e) => {
      // Prevenir scroll padrão com setas e espaço
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

    // Um toque interrompido por chamada, troca de aba ou gesto do sistema não
    // pode deixar o personagem correndo ou atirando para sempre.
    window.addEventListener('blur', () => this.reset());
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) this.reset();
    });

    // Touch Controls Setup
    this.initTouchControls();
  }

  isDown(action) {
    switch (action) {
      // 1P Controls: WASD + J/K/L/E/R ou Touch/Gamepad
      case 'left': return !!(this.keys['KeyA'] || this.keys['TouchLeft'] || this.gamepadKeys.left);
      case 'right': return !!(this.keys['KeyD'] || this.keys['TouchRight'] || this.gamepadKeys.right);
      case 'up': return !!(this.keys['KeyW'] || this.keys['TouchUp'] || this.gamepadKeys.up);
      case 'down': return !!(this.keys['KeyS'] || this.keys['TouchDown'] || this.gamepadKeys.down);
      case 'jump': return !!(this.keys['Space'] || this.keys['KeyJ'] || this.keys['TouchJump'] || this.gamepadKeys.jump);
      case 'shoot': return !!(this.keys['KeyK'] || this.keys['KeyZ'] || this.keys['TouchShoot'] || this.gamepadKeys.shoot);
      case 'bomb': return !!(this.keys['KeyL'] || this.keys['KeyX'] || this.keys['TouchBomb'] || this.gamepadKeys.bomb);
      case 'enter': return !!(this.keys['KeyE'] || this.keys['KeyC'] || this.keys['TouchEnter'] || this.gamepadKeys.enter);
      case 'execution': return !!this.keys['KeyR'];
      case 'pause': return !!(this.keys['Escape'] || this.keys['KeyP']); // Pause com ESC ou P

      // 2P Controls: Setas + Teclado Numérico / Linha de Números (1, 2, 3, 4, 0) + U/I/O/P/Y
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
      // 1P
      case 'jump': return !!(this.pressed['Space'] || this.pressed['KeyJ'] || this.pressed['TouchJump'] || this.pressed['GamepadJump']);
      case 'shoot': return !!(this.pressed['KeyK'] || this.pressed['KeyZ'] || this.pressed['TouchShoot'] || this.pressed['GamepadShoot']);
      case 'bomb': return !!(this.pressed['KeyL'] || this.pressed['KeyX'] || this.pressed['TouchBomb'] || this.pressed['GamepadBomb']);
      case 'enter': return !!(this.pressed['KeyE'] || this.pressed['KeyC'] || this.pressed['TouchEnter'] || this.pressed['GamepadEnter']);
      case 'execution': return !!this.pressed['KeyR'];
      case 'pause': return !!(this.pressed['Escape'] || this.pressed['KeyP']); // Pause pressed once

      // 2P
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
    bindTouch('btn-touch-enter', 'TouchEnter');
  }

  updateGamepad() {
    const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
    if (!gamepads || !gamepads[0]) {
      this.gamepadKeys = {};
      return;
    }
    const gp = gamepads[0];

    // D-pad / Analógico
    const axX = gp.axes[0];
    const axY = gp.axes[1];
    this.gamepadKeys.left = axX < -0.3 || gp.buttons[14]?.pressed;
    this.gamepadKeys.right = axX > 0.3 || gp.buttons[15]?.pressed;
    this.gamepadKeys.up = axY < -0.3 || gp.buttons[12]?.pressed;
    this.gamepadKeys.down = axY > 0.3 || gp.buttons[13]?.pressed;

    // Botões de Ação
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

    // Dimensões Virtuais do Jogo (Resolução Arcade 16:9)
    this.canvas.width = 960;
    this.canvas.height = 540;

    this.camera = { x: 0, y: 0 };
    this.shakePower = 0;
    this.shakeDuration = 0;

    this.time = 0;
    this.lastTime = 0;
    this.runId = 0;
    this.state = 'START'; // 'START', 'PLAYING', 'GAMEOVER', 'VICTORY'
    this.activeTimers = []; // Array para armazenar IDs de timers e evitar memory leak
    this.isPaused = false; // Sistema de pause
    this.runtimeError = null;

    // Modo de Jogo
    this.gameMode = '1P'; // '1P' ou '2P'

    // Entidades
    this.map = null;
    this.players = []; // Array de jogadores para suportar multiplayer
    this.enemies = [];
    this.boss = null;
    // A ordem dos chefes é controlada em um único lugar. Isso evita que um
    // chefe derrotado seja criado novamente quando a arena é liberada.
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
    
    // SISTEMA DE PORTÕES/BARREIRAS POR BIOMA!
    this.biomeGates = {
      tokyo: { active: false, cleared: false, enemiesRequired: 0, enemiesKilled: 0, x: 1250 },
      brazil: { active: false, cleared: false, enemiesRequired: 0, enemiesKilled: 0, x: 2450 },
      europe: { active: false, cleared: false, enemiesRequired: 0, enemiesKilled: 0, x: 3650 },
      egypt: { active: false, cleared: false, enemiesRequired: 0, enemiesKilled: 0, x: 4900 },
      newyork: { active: false, cleared: false, enemiesRequired: 0, enemiesKilled: 0, x: 6750 }
    };

    // Seleções de Personagens
    this.p1Character = 'claudio';
    this.p2Character = 'jessica';

    // Cache de elementos do HUD - Player 1
    this.hudHpFill = document.getElementById('hud-hp-fill');
    this.hudScore = document.getElementById('hud-score');
    this.hudWeaponName = document.getElementById('hud-weapon-name');
    this.hudWeaponAmmo = document.getElementById('hud-weapon-ammo');
    this.hudWeaponIcon = document.getElementById('hud-weapon-icon');
    this.hudGrenades = document.getElementById('hud-grenades');
    this.hudLivesContainer = document.getElementById('hud-lives-icons');
    this.hudCharImg = document.getElementById('hud-char-img');
    this.hudCharName = document.getElementById('hud-char-name');
    
    // Cache de elementos do HUD - Player 2
    this.hudP2Group = document.getElementById('hud-p2-group');
    this.hudP2HpFill = document.getElementById('hud-p2-hp-fill');
    this.hudP2WeaponName = document.getElementById('hud-p2-weapon-name');
    this.hudP2WeaponAmmo = document.getElementById('hud-p2-weapon-ammo');
    this.hudP2WeaponIcon = document.getElementById('hud-p2-weapon-icon');
    this.hudP2Grenades = document.getElementById('hud-p2-grenades');
    this.hudP2LivesContainer = document.getElementById('hud-p2-lives-icons');
    this.hudP2CharImg = document.getElementById('hud-p2-char-img');
    this.hudP2CharName = document.getElementById('hud-p2-char-name');
    
    // Boss e Slug HUD
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

    // Configuração do Seletor de Modo (1P / 2P)
    this.setupModeSelection();
    
    // Configuração da Seleção de Personagens
    this.setupCharacterSelection();

    // Botão Iniciar
    const startBtn = document.getElementById('btn-start-game');
    if (startBtn) {
      startBtn.addEventListener('click', () => {
        this.startGame();
      });
    }

    // A capa abre primeiro. O botão leva à seleção de personagem sem perder
    // a escolha de Claudio/Jessica antes da missão começar.
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

    // Botão Reiniciar
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

    // Botões da tela de Pause
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

    // Botão Mute
    const audioBtn = document.getElementById('btn-toggle-audio');
    if (audioBtn) {
      audioBtn.addEventListener('click', () => {
        audio.init();
        const muted = audio.toggleMute();
        audioBtn.textContent = muted ? '🔇 SOUND: OFF' : '🔊 SOUND: ON';
      });
    }

    // Botão Fullscreen
    const fullscreenBtn = document.getElementById('btn-toggle-fullscreen');
    if (fullscreenBtn) {
      fullscreenBtn.addEventListener('click', () => {
        this.toggleFullscreen();
      });
    }

    // Iniciar loop de animação
    requestAnimationFrame((t) => this.gameLoop(t));
  }

  toggleFullscreen() {
    // Melhor suporte para celulares e tablets
    const elem = document.documentElement;
    const isFullscreen = !!(
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.mozFullScreenElement ||
      document.msFullscreenElement ||
      document.webkitIsFullScreen ||
      document.mozFullScreen
    );

    if (!isFullscreen) {
      // Entrar em fullscreen
      const requestFullscreen =
        elem.requestFullscreen ||
        elem.webkitRequestFullscreen ||
        elem.webkitRequestFullScreen || // iOS Safari
        elem.mozRequestFullScreen ||
        elem.msRequestFullscreen;

      if (requestFullscreen) {
        requestFullscreen.call(elem).then(() => {
          // Forçar orientação landscape em celulares
          if (screen.orientation && screen.orientation.lock) {
            screen.orientation.lock('landscape').catch(() => {
              console.log('Não foi possível travar orientação landscape');
            });
          }
        }).catch((err) => {
          console.log('Erro ao entrar em fullscreen:', err);
        });
      } else {
        console.log('Fullscreen API não suportada neste dispositivo');
      }
    } else {
      // Sair de fullscreen
      const exitFullscreen =
        document.exitFullscreen ||
        document.webkitExitFullscreen ||
        document.webkitCancelFullScreen ||
        document.mozCancelFullScreen ||
        document.msExitFullscreen;

      if (exitFullscreen) {
        exitFullscreen.call(document).catch((err) => {
          console.log('Erro ao sair do fullscreen:', err);
        });
      }
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
    // Seleção P1
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

    // Seleção P2
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

    // Limpar todos os timers ativos do jogo anterior (evita memory leak)
    if (this.activeTimers && this.activeTimers.length > 0) {
      this.activeTimers.forEach(timerId => clearTimeout(timerId));
      this.activeTimers = [];
    }
    
    // Garantir que não está pausado
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
    
    // Instanciar Jogadores (1P e 2P)
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

    this.player = this.players[0]; // Referência de compatibilidade para 1P

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

    // Cada portal só abre quando o setor inteiro foi limpo. O contador era
    // sempre zero, o que fazia os biomas serem liberados após o primeiro KO.
    Object.entries(this.biomeGates).forEach(([biome, gate]) => {
      gate.active = false;
      gate.cleared = false;
      gate.enemiesKilled = 0;
      gate.enemiesRequired = this.map.enemySpawners.filter(spawner => spawner.biome === biome).length;
    });

    // Spawna os Reféns POW
    this.map.powSpawns.forEach(p => {
      this.pows.push(new POW(p.x, p.y, p.reward));
    });

    // Spawna o Tanque Slug
    this.map.slugSpawns.forEach(s => {
      this.slugs.push(new SlugVehicle(s.x, s.y));
    });

    // Atualizar HUD com os personagens
    this.updateHUDCharacter(this.p1Character, charAnnounce1, 0);

    // Texto de Entrada Triunfal
    this.players.forEach(p => {
      const badge = p.characterId === 'claudio' ? '★ CLAUDIO NORDIC WARRIOR ★' : 
                   (p.characterId === 'jessica' ? '🏹 JESSICA PHANTOM HUNTRESS 🏹' : `${p.characterId.toUpperCase()} READY!`);
      this.addFloatingText(p.x + 10, p.y - 35, badge, p.playerIndex === 0 ? '#ffcc00' : '#00d9ff', 13);
    });

    this.announcedRegions = {};

    this.state = 'PLAYING';
    this.lastTime = performance.now();
  }

  gameLoop(currentTime) {
    // Um erro inesperado não pode matar o requestAnimationFrame e deixar a
    // página parecendo congelada. A missão fica em pausa e pode ser reiniciada.
    if (this.runtimeError) {
      requestAnimationFrame((t) => this.gameLoop(t));
      return;
    }

    const dt = Math.min((currentTime - this.lastTime) / 1000, 0.1);
    this.lastTime = currentTime;
    try {
      this.time += dt;
      this.input.updateGamepad();

      // Verificar se pause foi pressionado durante o jogo
      if (this.state === 'PLAYING' && this.input.isPressed('pause')) {
        this.togglePause();
      }

      // Se está pausado, não atualizar o jogo, apenas renderizar
      if (this.state === 'PLAYING' && !this.isPaused) {
        this.update(dt);
      }

      this.render();
    } catch (error) {
      this.runtimeError = error;
      this.isPaused = true;
      this.input.reset();
      debugError('Falha recuperável no loop do jogo:', error);
      const pauseScreen = document.getElementById('pause-screen');
      if (pauseScreen) pauseScreen.style.display = 'flex';
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
    
    // Pausar/Resumir áudio
    if (this.isPaused) {
      audio.pauseBGM();
    } else {
      audio.resumeBGM();
    }
  }

  update(dt) {
    renderer.update(dt);

    // A vitória final é uma cena controlada pelo motor. Manter esta rota
    // separada impede que tiros ou inimigos comuns interrompam o dragão.
    if (this.cinematicActive) {
      this.updateFinaleCinematic(dt);
      return;
    }

    // 1. Atualizar Todos os Jogadores Ativos
    this.players.forEach(p => {
      p.update(dt, this.input, this);
    });

    // 2. Atualizar Tanques Slug
    this.slugs.forEach(slug => {
      slug.update(dt, this.input, this);
    });

    // 3. Atualizar e Spawnar Inimigos por Proximidade dos Jogadores
    const leadPlayerX = Math.max(...this.players.map(p => p.x));

    // Anúncios de Chegada em Novos Países
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
        enemy.biome = spawner.biome; // Marcar bioma para sistema de portões
        this.enemies.push(enemy);
        
        // Ativar portão do bioma quando primeiro inimigo aparecer
        if (spawner.biome && this.biomeGates[spawner.biome]) {
          this.biomeGates[spawner.biome].active = true;
        }
      }
    });

    // Atualizar Inimigos
    this.enemies = this.enemies.filter(e => {
      if (e.hp <= 0) {
        // Contar morte do inimigo para o portão do bioma
        if (e.biome && this.biomeGates[e.biome] && !this.biomeGates[e.biome].cleared) {
          this.biomeGates[e.biome].enemiesKilled++;
          
          // Verificar se todos os inimigos do bioma foram mortos
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
      // Persegue o jogador mais próximo
      const targetP = this.getClosestPlayer(e.x, e.y);
      e.update(dt, targetP, this);
    });

    // A progressão de chefes não depende apenas da posição: cada encontro só
    // pode nascer depois que o anterior tiver sido encerrado.
    if (this.bossStage === 'MECHAGODZILLA' && !this.boss && this.map.bossSpawn && leadPlayerX > this.map.bossSpawn.triggerX) {
      this.boss = new Boss(this.map.bossSpawn.x, this.map.bossSpawn.y);
      audio.playBossWarning();
      audio.playMechaRoar();
      audio.announce("WARNING! MECHAGODZILLA DETECTED");
      this.bossHud.style.display = 'flex';
      this.addFloatingText(this.boss.x, this.boss.y - 30, '⚠️ WARNING! MECHAGODZILLA APEX TITAN! ⚠️', '#ff0033', 15);
    }

    if (this.bossStage === 'KONG' && !this.boss && this.map.finalBossSpawn && leadPlayerX > this.map.finalBossSpawn.triggerX) {
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
      
      // Só atualiza o boss se não estiver na cinemática do dragão
      if (!this.cinematicActive || this.boss.isGhidorah || this.boss.isKingKong) {
        this.boss.update(dt, targetP, this);
      }

      // Salvaguarda: Se o MechaGodzilla foi derrotado e a cinemática ainda não iniciou, dispara agora
      if (this.boss.isDead && !this.boss.isGhidorah && !this.boss.isKingKong && !this.cinematicActive && !this.dragon) {
        this.startDragonFinale(this.boss);
      }
    }

    // A cinemática é atualizada pelo motor, não por timers soltos: assim as
    // asas, a carcaça carregada e o mergulho respeitam cada frame do jogo.
    if (this.dragon && this.dragon.state !== 'DONE') {
      // Verificar se o boss ainda existe antes de atualizar o dragão
      if (this.boss && !this.boss.isGhidorah) {
        this.dragon.update(dt, this);
      } else if (!this.boss) {
        // Se o boss foi removido, pular para o Ghidorah
        debugWarn('Boss foi removido durante cinemática, spawnando Ghidorah');
        this.dragon = null;
        this.spawnGhidorahBoss();
      }
    }

    // 5. Atualizar Reféns POW
    this.pows.forEach(pow => {
      const targetP = this.getClosestPlayer(pow.x, pow.y);
      pow.update(dt, targetP, this);
    });

    // 6. Atualizar Projéteis e Checar Colisões
    this.updateProjectiles(dt);

    // 7. Atualizar Explosões
    this.explosions.forEach(exp => {
      exp.life -= dt;
    });
    this.explosions = this.explosions.filter(exp => exp.life > 0);

    // 8. Atualizar Partículas (Fumaça, Cartuchos, Faíscas)
    this.updateParticles(dt);
    this.updateExecutionEffects(dt);
    this.updateLightningEffects(dt);

    // 9. Atualizar Textos Flutuantes
    this.floatingTexts.forEach(t => {
      t.y -= 24 * dt;
      t.alpha -= 1.1 * dt;
    });
    this.floatingTexts = this.floatingTexts.filter(t => t.alpha > 0);

    // 10. Coleta de Itens Pickups por Todos os Jogadores
    this.checkPickupCollisions();

    // 11. Atualizar Câmera e Screen Shake
    this.updateCamera(dt);

    // 12. Atualizar HUD de Ambos os Jogadores
    this.updateHUD();
    
    // 13. Sistema de Portões - Bloquear jogador se não matou todos os inimigos!
    this.updateBiomeGates();
  }

  getClosestPlayer(x, y) {
    // Garantir que sempre retorna um player válido
    if (!this.players || this.players.length === 0) {
      return this.player || { x: x, y: y, width: 40, height: 40, isDead: true };
    }
    
    const activePlayers = this.players.filter(p => p && !p.isDead);
    if (activePlayers.length === 0) {
      // Se todos estão mortos, retorna o primeiro player mesmo assim
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

  // SISTEMA DE PORTÕES/BARREIRAS POR BIOMA
  updateBiomeGates() {
    // Verificar cada portão ativo
    Object.keys(this.biomeGates).forEach(biome => {
      const gate = this.biomeGates[biome];
      
      if (gate.active && !gate.cleared) {
        // Bloquear todos os jogadores neste portão!
        this.players.forEach(p => {
          if (p && !p.isDead) {
            // Jogador tentando passar do portão antes de matar todos
            if (p.x > gate.x) {
              p.x = gate.x; // Parede invisível
              p.vx = Math.min(0, p.vx); // Não deixa ir para frente
              
              // Aviso visual
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
      const alive = p.update(dt, this);
      if (!alive) {
        if (p.type === 'grenade' || p.type === 'slug_cannon') {
          this.spawnExplosion(p.x, p.y, p.type === 'slug_cannon' ? 65 : 45);
          audio.playExplosion(true);
        }
        this.projectiles.splice(i, 1);
        continue;
      }

      // Colisão de Projéteis do Jogador contra Inimigos, Chefão e Barris
      if (p.isPlayer) {
        let hit = false;

        // Contra Inimigos Comuns
        for (let j = this.enemies.length - 1; j >= 0; j--) {
          const e = this.enemies[j];
          if (p.x > e.x && p.x < e.x + e.width && p.y > e.y && p.y < e.y + e.height) {
            e.takeDamage(p.damage, Math.atan2(p.vy, p.vx), this);
            hit = true;
            break;
          }
        }

        // Contra o Chefão
        if (!hit && this.boss && !this.boss.isDead) {
          if (p.x > this.boss.x && p.x < this.boss.x + this.boss.width && p.y > this.boss.y && p.y < this.boss.y + this.boss.height) {
            this.boss.takeDamage(p.damage, this);
            hit = true;
          }
        }

        // Contra Barris e Caixas Destrutíveis
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
                  // Dano em área nos inimigos próximos
                  this.enemies.forEach(e => {
                    if (Math.hypot((e.x + e.width / 2) - (obj.x + obj.width / 2), (e.y + e.height / 2) - (obj.y + obj.height / 2)) < 110) {
                      e.takeDamage(120, 0, this);
                    }
                  });
                } else {
                  this.spawnExplosion(obj.x + obj.width / 2, obj.y + obj.height / 2, 25);
                  audio.playExplosion(false);
                  // Drop de item na caixa
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
        // Projétil Inimigo contra TODOS os Jogadores ou Tanque Slug
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
        // Quique no chão
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
    
    // Verificar se ainda temos um boss válido antes de tentar atualizar o dragão
    if (!this.boss) {
      debugWarn('Boss não encontrado durante cinemática, forçando spawn do Ghidorah');
      this.spawnGhidorahBoss();
      return;
    }
    
    try {
      if (this.dragon && this.dragon.state !== 'DONE') {
        this.dragon.update(dt, this);
      }
    } catch (error) {
      debugError('Falha na cinemática do dragão:', error);
      this.spawnGhidorahBoss();
      return;
    }

    if (this.state !== 'PLAYING') return;

    // Timeout de segurança: se passar de 2.5s por qualquer motivo, força o spawn imediato do King Ghidorah
    if (this.finaleElapsed >= 2.5 && (!this.boss || !this.boss.isGhidorah)) {
      debugLog('Timeout de segurança atingido, spawning Ghidorah');
      this.spawnGhidorahBoss();
      return;
    }

    // Se o dragão já levou o MechaGodzilla embora e King Ghidorah está pronto
    if (!this.dragon || this.dragon.state === 'DONE') {
      if (this.boss && this.boss.isGhidorah) {
        debugLog('Cinemática completa, King Ghidorah está ativo');
        this.cinematicActive = false;
        return;
      } else {
        // Se o dragão acabou mas o Ghidorah não foi spawnado, spawnar agora
        debugLog('Dragão terminou mas Ghidorah não foi spawnado, corrigindo...');
        this.spawnGhidorahBoss();
        return;
      }
    }
    this.cinematicFlash = Math.max(0, this.cinematicFlash - dt * 1.8);

    // A carcaça, explosões e raios continuam vivos durante a cena, mas os
    // jogadores ficam seguros e não há novas colisões de combate.
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

    // Se o Chefão estiver ativado, travar a câmera suavemente na arena correta
    if (this.boss && !this.boss.isDead) {
      const arenaMinX = this.boss.isKingKong
        ? Math.min(maxCamX, (this.map.finalBossSpawn ? this.map.finalBossSpawn.triggerX - 80 : 6400))
        : Math.min(maxCamX, (this.map.bossSpawn ? this.map.bossSpawn.triggerX - 80 : 3800));
      targetX = Math.max(arenaMinX, Math.min(maxCamX, targetX));
    } else {
      targetX = Math.max(0, Math.min(maxCamX, targetX));
    }

    // Interpolação suave
    this.camera.x += (targetX - this.camera.x) * 0.1;
    this.camera.y = 0;

    // Screen Shake
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

  // --- RESOLUÇÃO DE COLISÕES DE PLATAFORMAS ---
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
        // Aterrissagem no topo da plataforma
        if (ent.y + ent.height >= p.y && ent.y + ent.height <= p.y + 18 && ent.vy >= 0) {
          ent.y = p.y - ent.height;
          ent.vy = 0;
          ent.onGround = true;
        }
      }
    });
  }

  // --- SPAWNERS DE EFEITOS E PARTÍCULAS ---
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
    
    try {
      this.dragon = new DragonCinematic(boss, this);
      debugLog('DragonCinematic criado com sucesso');
    } catch (error) {
      debugError('Erro ao criar DragonCinematic:', error);
      // Se falhar, spawnar Ghidorah diretamente
      this.spawnGhidorahBoss();
    }
  }

  startGhidorahBossTransition() {
    this.cinematicActive = true;
    this.dragon = null;
    this.projectiles = [];
    this.lightningEffects = [];
    
    // Trovoadas e escurecimento elétrico do céu
    this.cinematicFlash = 0.6;
    this.cinematicFlashColor = '#ffd700';
    this.triggerScreenShake(20, 0.8);
    audio.playBossWarning();
    audio.playGhidorahRoar();
    audio.announce("WARNING! KING GHIDORAH HAS AWAKENED");

    this.addFloatingText(this.camera.x + this.canvas.width / 2, 120, '⚡ ALERTA MÁXIMO! O DRAGÃO DOURADO RETORNA! ⚡', '#ffd700', 18);

    // Gerar relâmpagos pelo cenário antes do pouso
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
    // Garantir que não spawna múltiplas vezes
    if (this.boss && this.boss.isGhidorah) {
      debugLog('King Ghidorah já existe, pulando spawn');
      return;
    }

    debugLog('Spawning King Ghidorah Boss...');
    
    // CRÍTICO: Limpar completamente o estado da cinemática
    this.cinematicActive = false;
    this.dragon = null;
    this.finaleElapsed = 0;
    this.bossStage = 'GHIDORAH';
    
    // Remover invulnerabilidade dos jogadores
    this.players.forEach(player => {
      player.isInvulnerable = false;
    });

    // Criar o novo boss (King Ghidorah)
    const spawnX = Math.min(this.map.bossSpawn ? this.map.bossSpawn.x : 4600, this.camera.x + this.canvas.width * 0.72);
    const spawnY = this.map.bossSpawn ? this.map.bossSpawn.y : 220;
    this.boss = new KingGhidorahBoss(spawnX, spawnY);
    
    // Atualizar HUD
    if (this.bossHud) {
      this.bossHud.style.display = 'flex';
    }
    
    debugLog('King Ghidorah Boss spawned successfully at', spawnX, spawnY);
  }

  completeGhidorahBattle(ghidorah) {
    if (this.bossStage !== 'GHIDORAH') return;

    // Marcar a próxima etapa antes do intervalo de saída impede um novo
    // Mechagodzilla caso a câmera seja atualizada nesse intervalo.
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

    // A garra deixa uma trajetória violenta: faíscas, impacto e arcos de
    // eletricidade acompanham a queda da carcaça, sem alterar o visual dela.
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

    // O impacto limpa qualquer ameaça ainda ativa na arena, mas não pune os
    // jogadores durante a cena de vitória.
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

  // --- ATUALIZAÇÃO DO HUD EM TEMPO REAL ---
  updateHUD() {
    // Player 1 HUD
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

    // Player 2 HUD (se ativo em modo 2P)
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

    // Tanque Slug HUD
    const pInSlug = this.players.find(p => p.inSlug && p.slugRef);
    if (pInSlug && pInSlug.slugRef) {
      this.slugHud.style.display = 'flex';
      this.slugCannonCount.textContent = `HP: ${pInSlug.slugRef.hp} | CANNON: x${pInSlug.slugRef.cannons}`;
    } else {
      this.slugHud.style.display = 'none';
    }

    // Barra de Vida do Chefão
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

  // --- FINALIZAÇÃO DE MISSÃO & GAME OVER ---
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

  // --- RENDERIZAÇÃO DO FRAME ---
  render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    if (this.state === 'START') {
      // Desenhar fundo arcade animado
      renderer.drawParallaxBackground(this.ctx, { x: this.time * 20, y: 0 }, this.canvas.width, this.canvas.height, 4000);
      renderer.drawMenuEasterEggs(this.ctx, this.canvas.width, this.canvas.height, this.time);
      return;
    }

    // 1. Cenário Parallax
    renderer.drawParallaxBackground(this.ctx, this.camera, this.canvas.width, this.canvas.height, this.map.width);

    // 2. Plataformas e Obstáculos
    renderer.drawMapElements(this.ctx, this.camera, this.map);

    // 3. Tanques Slug
    this.slugs.forEach(s => {
      if (!s.destroyed) renderer.drawSlug(this.ctx, this.camera, s, (s.driverCharacterId || 'claudio'));
    });

    // 4. Reféns POW
    this.pows.forEach(pow => {
      renderer.drawPOW(this.ctx, this.camera, pow);
    });

    // 5. Inimigos Comuns
    this.enemies.forEach(e => {
      renderer.drawEnemy(this.ctx, this.camera, e);
    });

    // Fragmentos temporários da execução do Claudio, exibidos mesmo depois de
    // o inimigo já ter sido removido da lista de entidades.
    renderer.drawExecutionEffects(this.ctx, this.camera, this.executionEffects);

    // 6. Chefão Goliath
    if (this.boss && !this.boss.hiddenByDragon) {
      renderer.drawBoss(this.ctx, this.camera, this.boss);
    }

    if (this.dragon && this.dragon.state !== 'DONE') {
      renderer.drawDragon(this.ctx, this.camera, this.dragon);
    }

    // 7. Todos os Jogadores Ativos (se não estiverem dentro do tanque)
    this.players.forEach(p => {
      if (!p.inSlug && !p.isDead) {
        renderer.drawPlayer(this.ctx, this.camera, p);
      }
    });
    // 8. Itens Coletáveis Pickups
    renderer.drawPickups(this.ctx, this.camera, this.pickups);

    // 9. Projéteis e Granadas
    renderer.drawProjectiles(this.ctx, this.camera, this.projectiles);

    // 10. Partículas
    renderer.drawParticles(this.ctx, this.camera, this.particles);

    renderer.drawLightningEffects(this.ctx, this.camera, this.lightningEffects);

    // 11. Explosões
    renderer.drawExplosions(this.ctx, this.camera, this.explosions);

    renderer.drawCinematicFlash(this.ctx, this.cinematicFlash, this.cinematicFlashColor);

    // 12. Textos Flutuantes
    renderer.drawFloatingTexts(this.ctx, this.camera, this.floatingTexts);
  }
}

// Inicializar motor de jogo quando a página carregar
window.addEventListener('DOMContentLoaded', () => {
  window.gameEngine = new Game();
  window.game = window.gameEngine;
});
