




class Player {
  constructor(x, y, characterId = 'claudio', playerIndex = 0) {
    this.x = x;
    this.y = y;
    this.width = 30;
    this.height = 46;
    this.vx = 0;
    this.vy = 0;
    this.jumpForce = -10.5;
    this.gravity = 0.48;
    this.onGround = false;
    this.facing = 1;
    this.isCrouching = false;
    this.aimX = 1;
    this.aimY = 0;


    this.characterId = characterId;
    this.playerIndex = playerIndex;
    this.hasWarPaint = (this.characterId === 'claudio');

    this.speed = 4.2;
    this.fireRateMultiplier = 1.0;
    this.damageResistance = 1.0;
    this.meleeDamage = 75;
    this.meleeRange = 40;
    this.pickupMultiplier = 1.0;
    this.slugBonus = false;

    
    this.hp = 100;
    this.maxHp = 100;
    this.lives = 4;
    this.score = 0;
    this.grenades = 10;
    

    this.weapon = 'PISTOL';
    this.ammo = Infinity;
    this.shootCooldown = 0;
    this.shootRecoil = false;
    this.shootFlashTimer = 0;
    this.meleeTimer = 0;
    this.meleeComboStep = 0;
    this.meleeAttackTime = 0;
    this.isAttacking = false;
    this.isSpinning = false;
    this.spinAngle = 0;
    this.attackDirection = 'vertical';
    this.isExecuting = false;
    this.executionPhase = 0;
    this.executionDirection = 1;
    this.coyoteTimer = 0;
    this.jumpBufferTimer = 0;


    if (this.characterId === 'claudio') {

      this.speed = 5.2;
      this.grenades = 15;
      this.meleeDamage = 350;
      this.meleeRange = 75;
      this.hasWarPaint = true;
      this.weapon = 'AXE';
      this.ammo = Infinity;
    } else if (this.characterId === 'jessica') {

      this.speed = 5.2;
      this.grenades = 12;
      this.meleeDamage = 95;
      this.meleeRange = 45;
      this.weapon = 'BOW';
      this.ammo = 180;
      this.pickupMultiplier = 1.35;
      this.bowCombo = 0;
      this.damageResistance = 0.75;
      this.maxHp = 120;
      this.hp = 120;
    } else if (this.characterId === 'marco') {

      this.speed = 4.2;
      this.fireRateMultiplier = 1.25;
    } else if (this.characterId === 'tarma') {

      this.speed = 4.2;
      this.damageResistance = 0.85;
      this.slugBonus = true;
    } else if (this.characterId === 'fio') {

      this.speed = 4.2;
      this.weapon = 'HMG';
      this.ammo = 300;
      this.pickupMultiplier = 1.5;
    }


    this.isInvulnerable = false;
    this.invulnerableTimer = 0;
    this.inSlug = false;
    this.slugRef = null;
    this.isDead = false;
    this.respawnTimer = 0;
  }

  update(dt, input, game) {
    if (this.isDead) {
      this.respawnTimer -= dt;
      if (this.respawnTimer <= 0) {
        this.respawn(game);
      }
      return;
    }



    const abyssLevel = game.canvas.height + 120;
    if (this.y > abyssLevel && !this.isDead) {
      audio.playPitFall();
      game.addFloatingText(this.x, game.canvas.height - 60, 'CAIU NO ABISMO!', '#ff2222', 13);
      this.die(game);
      return;
    }


    if (this.inSlug && this.slugRef) {
      this.x = this.slugRef.x + 20;
      this.y = this.slugRef.y - 10;
      return;
    }


    if (this.shootCooldown > 0) this.shootCooldown -= dt;
    if (this.shootFlashTimer > 0) this.shootFlashTimer -= dt;
    if (this.meleeTimer > 0) this.meleeTimer -= dt;
    if (this.meleeAttackTime > 0) {
      this.meleeAttackTime -= dt;
      if (this.meleeAttackTime <= 0) {
        this.isAttacking = false;
      }
    }


    if (this.isSpinning) {
      this.spinAngle += dt * 18;
      if (this.spinAngle >= Math.PI * 2) {
        this.isSpinning = false;
        this.spinAngle = 0;
      }
    }

    if (this.isInvulnerable) {
      this.invulnerableTimer -= dt;
      if (this.invulnerableTimer <= 0) this.isInvulnerable = false;
    }




    let moveLeft, moveRight, lookUp, lookDown, jumpPressed, shootPressed, bombPressed, enterPressed, executionPressed;
    
    if (this.playerIndex === 0) {

      moveLeft = input.isDown('left');
      moveRight = input.isDown('right');
      lookUp = input.isDown('up');
      lookDown = input.isDown('down');
      jumpPressed = input.isPressed('jump');
      shootPressed = input.isDown('shoot');
      bombPressed = input.isPressed('bomb');
      enterPressed = input.isPressed('enter');
      executionPressed = input.isPressed('execution');
    } else {

      moveLeft = input.isDown('p2_left');
      moveRight = input.isDown('p2_right');
      lookUp = input.isDown('p2_up');
      lookDown = input.isDown('p2_down');
      jumpPressed = input.isPressed('p2_jump');
      shootPressed = input.isDown('p2_shoot');
      bombPressed = input.isPressed('p2_bomb');
      enterPressed = input.isPressed('p2_enter');
      executionPressed = input.isPressed('p2_execution');
    }



    this.coyoteTimer = this.onGround ? 0.1 : Math.max(0, this.coyoteTimer - dt);
    if (jumpPressed) this.jumpBufferTimer = 0.12;
    else this.jumpBufferTimer = Math.max(0, this.jumpBufferTimer - dt);


    this.isCrouching = lookDown && this.onGround;


    if (this.isExecuting) {


      this.vx = this.executionDirection * 8.5;
      this.facing = this.executionDirection;
    } else if (!this.isCrouching) {
      if (moveLeft && !moveRight) {
        this.vx = -this.speed;
        this.facing = -1;
      } else if (moveRight && !moveLeft) {
        this.vx = this.speed;
        this.facing = 1;
      } else {
        this.vx = 0;
      }
    } else {
      this.vx = 0;
    }


    this.aimX = (moveLeft && !moveRight) ? -1 : ((moveRight && !moveLeft) ? 1 : this.facing);
    this.aimY = lookUp ? -1 : (lookDown ? 1 : 0);


    if (this.jumpBufferTimer > 0 && this.coyoteTimer > 0 && !this.isExecuting) {
      this.vy = this.jumpForce;
      this.onGround = false;
      this.coyoteTimer = 0;
      this.jumpBufferTimer = 0;
      audio.playJump();
      game.spawnDust(this.x + this.width / 2, this.y + this.height);
    }


    this.vy += this.gravity;
    if (this.vy > 14) this.vy = 14;


    this.x += this.vx;
    game.resolveHorizontalCollision(this);

    this.y += this.vy;
    this.onGround = false;
    game.resolveVerticalCollision(this);


    if (this.isExecuting) {
      game.spawnBlood(this.x + this.width / 2, this.y + this.height / 2);
      game.spawnSpark(this.x + this.width / 2, this.y + this.height / 2);
      if (this.onGround && this.vy >= 0) {
        this.finishExecutionImpact(game);
      }
    }


    if (shootPressed) {

      if (this.weapon === 'AXE') {

        if (lookDown) {

          this.attackDirection = 'vertical';
        } else {

          this.attackDirection = 'horizontal';
        }
        this.tryAxeMeleeAttack(game);
      } else {
        this.tryShoot(game);
      }
    }


    if (bombPressed) {
      if (this.weapon === 'AXE' && this.grenades > 0) {

        this.tryAxeSpinAttack(game);
      } else if (this.grenades > 0) {
        this.throwGrenade(game);
      }
    }


    if (enterPressed) {
      this.tryEnterSlug(game);
    }


    if (executionPressed) {
      if (!this.inSlug) {
        if (this.weapon === 'AXE' || this.characterId === 'claudio') {
          this.tryAxeExecutionJump(game);
        } else if (this.weapon === 'BOW' || this.characterId === 'jessica') {
          this.tryBowSpecialRain(game);
        }
      }
    }
  }


  tryAxeMeleeAttack(game) {
    if (this.meleeTimer > 0) return;


    this.isAttacking = true;
    this.meleeAttackTime = 0.4;
    
    const attackRange = this.meleeRange || 70;
    const hitEnemies = [];
    const dashDistance = 12;
    this.x += this.facing * dashDistance;


    game.enemies.forEach(e => {
      const dist = Math.hypot((e.x + e.width / 2) - (this.x + this.width / 2), (e.y + e.height / 2) - (this.y + this.height / 2));
      const angle = Math.atan2((e.y + e.height / 2) - (this.y + this.height / 2), (e.x + e.width / 2) - (this.x + this.width / 2));
      const facingAngle = this.facing === 1 ? 0 : Math.PI;
      const angleDiff = Math.abs(angle - facingAngle);
      
      if (dist < attackRange && angleDiff < Math.PI / 2 && Math.abs(e.y - this.y) < 60) {
        hitEnemies.push(e);
      }
    });

    if (game.boss && !game.boss.isDead) {
      const bDist = Math.hypot((game.boss.x + game.boss.width / 2) - (this.x + this.width / 2), (game.boss.y + game.boss.height / 2) - (this.y + this.height / 2));
      if (bDist < attackRange + 90) {
        hitEnemies.push(game.boss);
      }
    }

    if (hitEnemies.length > 0) {
      this.meleeTimer = 0.28;
      this.meleeComboStep = (this.meleeComboStep + 1) % 3;

      if (this.meleeComboStep === 0) {
        audio.playAxeSwing();
      } else if (this.meleeComboStep === 1) {
        audio.playAxeHit();
      } else {
        audio.playAxeSwing();
        setTimeout(() => audio.playExplosion(false), 120);
      }
      
      const shakeIntensity = 7 + this.meleeComboStep * 2;
      game.triggerScreenShake(shakeIntensity, 0.2);

      hitEnemies.forEach(enemy => {
        const baseDamage = this.meleeDamage || 180;
        const comboDamage = baseDamage * (1 + this.meleeComboStep * 0.35);
        
        if (enemy.takeDamage) {
          enemy.takeDamage(comboDamage, Math.atan2(0, this.facing), game);
        }
        

        if (this.attackDirection === 'vertical') {

          game.spawnSpark(enemy.x + enemy.width / 2, enemy.y + enemy.height);
          
          for (let i = 0; i < 15; i++) {
            const angle = Math.PI / 2 + (Math.random() - 0.5) * Math.PI / 3;
            game.particles.push({
              type: 'blood',
              x: enemy.x + enemy.width / 2,
              y: enemy.y + enemy.height,
              vx: Math.cos(angle) * (3 + Math.random() * 8),
              vy: Math.sin(angle) * (-8 - Math.random() * 6),
              radius: 3 + Math.random() * 2,
              life: 0.7,
              maxLife: 0.7,
              color: this.meleeComboStep === 2 ? '#ff1a1a' : '#ffd700'
            });
          }

          if (enemy.vx !== undefined) {
            enemy.vx = this.facing * 10;
            enemy.vy = -8;
          }
        } else {

          game.spawnSpark(enemy.x + (this.facing === 1 ? enemy.width : 0), enemy.y + enemy.height / 2);
          
          for (let i = 0; i < 15; i++) {
            const angle = this.facing === 1 ? 0 : Math.PI;
            const spread = (Math.random() - 0.5) * Math.PI / 4;
            game.particles.push({
              type: 'blood',
              x: enemy.x + enemy.width / 2,
              y: enemy.y + enemy.height / 2,
              vx: Math.cos(angle + spread) * (8 + Math.random() * 6),
              vy: Math.sin(spread) * (4 + Math.random() * 4),
              radius: 3 + Math.random() * 2,
              life: 0.7,
              maxLife: 0.7,
              color: this.meleeComboStep === 2 ? '#ff3300' : '#ffd700'
            });
          }

          if (enemy.vx !== undefined) {
            enemy.vx = this.facing * 14;
            enemy.vy = -4;
          }
        }
      });


      const verticalTexts = ['⚡ SLAM!', '💥 ESMAGAR!', '🔥 EXECUÇÃO!'];
      const horizontalTexts = ['⚔️ CORTE!', '💫 CLEAVE!', '⚡ DEVASTAR!'];
      const comboColors = ['#ffcc00', '#ff6600', '#ff0000'];
      const texts = this.attackDirection === 'vertical' ? verticalTexts : horizontalTexts;
      
      game.addFloatingText(
        this.x, 
        this.y - 30, 
        texts[this.meleeComboStep] + ` ${Math.floor(this.meleeDamage * (1 + this.meleeComboStep * 0.35))}`, 
        comboColors[this.meleeComboStep], 
        14
      );


      const impactX = this.x + this.width / 2 + (this.attackDirection === 'horizontal' ? this.facing * 35 : 0);
      const impactY = this.attackDirection === 'vertical' ? this.y + this.height + 5 : this.y + this.height / 2;
      
      for (let i = 0; i < 20; i++) {
        const angle = this.attackDirection === 'vertical' ? 
          Math.PI / 2 + (Math.random() - 0.5) * Math.PI :
          (this.facing === 1 ? 0 : Math.PI) + (Math.random() - 0.5) * Math.PI / 2;
        
        game.particles.push({
          type: 'spark',
          x: impactX + (Math.random() - 0.5) * 20,
          y: impactY + (Math.random() - 0.5) * 20,
          vx: Math.cos(angle) * (5 + Math.random() * 8),
          vy: Math.sin(angle) * (5 + Math.random() * 8),
          life: 0.5,
          maxLife: 0.5
        });
      }

      for (let i = 0; i < 8; i++) {
        game.spawnSmoke(
          impactX + (Math.random() - 0.5) * 50, 
          impactY, 
          10
        );
      }

      return true;
    }


    if (this.meleeTimer <= 0) {
      this.meleeTimer = 0.25;
      audio.playAxeSwing();
      
      for (let i = 0; i < 5; i++) {
        game.particles.push({
          type: 'spark',
          x: this.x + this.width / 2 + this.facing * 25,
          y: this.y + (Math.random() - 0.5) * 20,
          vx: this.facing * (3 + Math.random() * 4),
          vy: (Math.random() - 0.5) * 6,
          life: 0.2,
          maxLife: 0.2
        });
      }
      
      game.addFloatingText(this.x, this.y - 10, '~whoosh~', '#888888', 8);
      return false;
    }

    return false;
  }


  tryAxeSpinAttack(game) {
    if (this.meleeTimer > 0 || this.isSpinning) return;


    this.grenades--;
    

    this.isSpinning = true;
    this.spinAngle = 0;
    this.meleeTimer = 0.6;
    

    audio.playAxeSwing();
    setTimeout(() => audio.playAxeHit(), 150);
    setTimeout(() => audio.playExplosion(true), 300);
    

    game.triggerScreenShake(10, 0.6);
    

    game.addFloatingText(this.x, this.y - 35, '⚔️ SPIN DEVASTADOR 360° ⚔️', '#ff3300', 15);
    

    let hitCount = 0;
    const spinDamage = (this.meleeDamage || 180) * 1.5;
    
    const spinInterval = setInterval(() => {
      if (!this.isSpinning) {
        clearInterval(spinInterval);
        return;
      }
      
      hitCount++;
      

      const spinRange = 85;
      
      game.enemies.forEach(e => {
        const dist = Math.hypot((e.x + e.width / 2) - (this.x + this.width / 2), (e.y + e.height / 2) - (this.y + this.height / 2));
        if (dist < spinRange) {
          if (e.takeDamage) {
            e.takeDamage(spinDamage / 4, Math.atan2(e.y - this.y, e.x - this.x), game);
          }
          

          if (e.vx !== undefined) {
            const angle = Math.atan2(e.y - this.y, e.x - this.x);
            e.vx = Math.cos(angle) * 12;
            e.vy = Math.sin(angle) * 12 - 4;
          }
        }
      });
      

      if (game.boss && !game.boss.isDead) {
        const bDist = Math.hypot((game.boss.x + game.boss.width / 2) - (this.x + this.width / 2), (game.boss.y + game.boss.height / 2) - (this.y + this.height / 2));
        if (bDist < spinRange + 100) {
          game.boss.takeDamage(spinDamage / 4, game);
        }
      }
      

      for (let a = 0; a < Math.PI * 2; a += Math.PI / 6) {
        const radius = 50 + Math.sin(this.spinAngle * 3) * 10;
        game.particles.push({
          type: 'spark',
          x: this.x + this.width / 2 + Math.cos(a + this.spinAngle) * radius,
          y: this.y + this.height / 2 + Math.sin(a + this.spinAngle) * radius,
          vx: Math.cos(a + this.spinAngle) * 12,
          vy: Math.sin(a + this.spinAngle) * 12,
          life: 0.5,
          maxLife: 0.5
        });
      }
      

      for (let i = 0; i < 3; i++) {
        const angle = this.spinAngle + (Math.random() - 0.5) * 0.3;
        game.particles.push({
          type: 'spark',
          x: this.x + this.width / 2 + Math.cos(angle) * 45,
          y: this.y + this.height / 2 + Math.sin(angle) * 45,
          vx: 0,
          vy: 0,
          life: 0.3,
          maxLife: 0.3
        });
      }
      
    }, 80);
    
    return true;
  }


  tryAxeExecutionJump(game) {
    if (this.meleeTimer > 0 || this.isExecuting) return false;

    this.isExecuting = true;
    this.isAttacking = true;
    this.meleeAttackTime = 1.2;
    this.meleeTimer = 1.0;


    this.vy = -13.5;
    this.executionDirection = this.facing;
    this.vx = this.executionDirection * 8.5;
    this.onGround = false;

    audio.playAxeSwing();
    game.triggerScreenShake(8, 0.25);
    game.addFloatingText(this.x + this.width / 2, this.y - 25, '⚡ DEGOLAR! ⚡', '#ff0000', 16);

    for (let i = 0; i < 25; i++) {
      game.particles.push({
        type: 'spark',
        x: this.x + this.width / 2,
        y: this.y + this.height,
        vx: (Math.random() - 0.5) * 10,
        vy: -Math.random() * 12,
        life: 0.5,
        maxLife: 0.5
      });
    }
    return true;
  }

  finishExecutionImpact(game) {
    this.isExecuting = false;
    this.isAttacking = false;
    this.vx = 0;

    audio.playExplosion(true);
    audio.playAxeHit();
    game.triggerScreenShake(18, 0.45);

    const impactX = this.x + this.facing * 35;
    const impactY = this.y + this.height;


    game.spawnExplosion(impactX, impactY, 70);


    const cleaveRadius = 140;
    let hitCount = 0;

    game.enemies.forEach(e => {
      const dist = Math.hypot((e.x + e.width / 2) - impactX, (e.y + e.height / 2) - impactY);
      if (dist < cleaveRadius) {
        const damage = 650;
        if (game.addExecutionSplit) game.addExecutionSplit(e, this.facing);
        e.takeDamage(damage, Math.atan2(0, this.facing), game);
        hitCount++;


        const ex = e.x + e.width / 2;
        const ey = e.y + e.height / 2;
        for (let i = 0; i < 35; i++) {
          const side = (i % 2 === 0) ? -1 : 1;
          game.particles.push({
            type: 'blood',
            x: ex,
            y: ey + (Math.random() - 0.5) * e.height,
            vx: side * (6 + Math.random() * 10),
            vy: -4 - Math.random() * 8,
            radius: 4 + Math.random() * 3,
            life: 0.8,
            maxLife: 0.8
          });
        }
      }
    });

    if (game.boss && !game.boss.isDead) {
      const bDist = Math.hypot((game.boss.x + game.boss.width / 2) - impactX, (game.boss.y + game.boss.height / 2) - impactY);
      if (bDist < cleaveRadius + 80) {
        game.boss.takeDamage(500, game);
        hitCount++;
      }
    }

    if (hitCount > 0) {
      game.addFloatingText(impactX, impactY - 50, '💀 DIVIDIDO AO MEIO! 💀', '#ff0000', 18);
    }


    for (let i = 0; i < 35; i++) {
      const angle = (Math.random() * Math.PI) - Math.PI / 2;
      game.particles.push({
        type: 'spark',
        x: impactX,
        y: impactY,
        vx: Math.cos(angle) * (8 + Math.random() * 12),
        vy: Math.sin(angle) * (8 + Math.random() * 12),
        life: 0.6,
        maxLife: 0.6
      });
    }
  }

  tryBowSpecialRain(game) {
    if (this.shootCooldown > 0) return false;
    this.shootCooldown = 0.8;

    audio.playBowSpecial();
    game.triggerScreenShake(8, 0.3);
    game.addFloatingText(this.x, this.y - 25, '🏹 CHUVA DE FLECHAS! 🏹', '#00d9ff', 15);


    for (let i = 0; i < 6; i++) {
      setTimeout(() => {
        const arrowX = this.x - 100 + i * 50;
        game.projectiles.push(new Projectile(arrowX, -30, (Math.random() - 0.5) * 2, 16, 'arrow', 60, true, 8, 1.5));
        audio.playBowShot();
      }, i * 60);
    }
    return true;
  }

  tryShoot(game) {
    if (this.shootCooldown > 0) return;


    let fireDelay = 0.18;
    switch (this.weapon) {
      case 'BOW': fireDelay = 0.14; break;
      case 'HMG': fireDelay = 0.08; break;
      case 'SHOTGUN': fireDelay = 0.45; break;
      case 'ROCKET': fireDelay = 0.35; break;
      case 'FLAME': fireDelay = 0.06; break;
      case 'LASER': fireDelay = 0.05; break;
      default: fireDelay = 0.16; break;
    }
    

    fireDelay /= this.fireRateMultiplier;

    this.shootCooldown = fireDelay;
    this.shootFlashTimer = 0.06;
    this.shootRecoil = true;
    setTimeout(() => { this.shootRecoil = false; }, 70);


    let spawnX = this.x + (this.facing === 1 ? this.width + 4 : -4);
    let spawnY = this.y + (this.isCrouching ? 28 : 18);

    let dirX = this.facing;
    let dirY = 0;

    if (this.aimY < 0) {
      dirY = -1;
      dirX = (this.aimX !== 0) ? this.aimX * 0.7 : 0;
      spawnX = this.x + this.width / 2;
      spawnY = this.y - 6;
    } else if (this.aimY > 0 && !this.onGround) {
      dirY = 1;
      dirX = 0;
      spawnX = this.x + this.width / 2;
      spawnY = this.y + this.height + 4;
    }

    const norm = Math.hypot(dirX, dirY) || 1;
    const ndx = dirX / norm;
    const ndy = dirY / norm;


    this.spawnWeaponProjectiles(game, spawnX, spawnY, ndx, ndy);


    if (this.weapon !== 'AXE' && this.weapon !== 'BOW') {
      game.spawnCasing(this.x + this.width / 2, this.y + 16, -this.facing);
    }


    if (this.weapon !== 'PISTOL' && this.weapon !== 'AXE') {
      this.ammo--;
      if (this.ammo <= 0) {
        this.weapon = 'PISTOL';
        this.ammo = Infinity;
        game.addFloatingText(this.x, this.y - 10, 'PISTOL', '#ffffff');
      }
    }
  }

  spawnWeaponProjectiles(game, sx, sy, dx, dy) {
    const speed = 14;

    switch (this.weapon) {
      case 'BOW':

        audio.playBowShot();
        this.bowCombo = (this.bowCombo || 0) + 1;
        if (this.bowCombo % 3 === 0) {

          audio.playBowSpecial();
          for (let i = -1; i <= 1; i++) {
            const spread = i * 0.12;
            const adx = dx * Math.cos(spread) - dy * Math.sin(spread);
            const ady = dx * Math.sin(spread) + dy * Math.cos(spread);
            game.projectiles.push(new Projectile(sx, sy, adx * 22, ady * 22, 'arrow', 85, true, 5, 1.6));
          }
          game.triggerScreenShake(3, 0.08);
          game.addFloatingText(sx, sy - 20, '🏹 TRIPLE ARROW!', '#00d9ff', 12);
        } else {

          game.projectiles.push(new Projectile(sx, sy, dx * 24, dy * 24, 'arrow', 75, true, 5, 1.8));
          game.triggerScreenShake(1.5, 0.04);
        }
        break;

      case 'HMG':
        audio.playShootHMG();
        const spreadAngle = (Math.random() - 0.5) * 0.08;
        const hmgDx = dx * Math.cos(spreadAngle) - dy * Math.sin(spreadAngle);
        const hmgDy = dx * Math.sin(spreadAngle) + dy * Math.cos(spreadAngle);
        game.projectiles.push(new Projectile(sx, sy, hmgDx * 16, hmgDy * 16, 'bullet', 22, true, 4.5));
        game.triggerScreenShake(1.5, 0.05);
        break;

      case 'SHOTGUN':
        audio.playShootShotgun();
        for (let i = -3; i <= 3; i++) {
          const sAngle = i * 0.09;
          const sdx = dx * Math.cos(sAngle) - dy * Math.sin(sAngle);
          const sdy = dx * Math.sin(sAngle) + dy * Math.cos(sAngle);
          const pelletSpeed = 13 + Math.random() * 3;
          game.projectiles.push(new Projectile(sx, sy, sdx * pelletSpeed, sdy * pelletSpeed, 'shotgun', 38, true, 5, 0.35));
        }
        game.triggerScreenShake(5, 0.15);
        break;

      case 'ROCKET':
        audio.playShootRocket();
        game.projectiles.push(new Projectile(sx, sy, dx * 9, dy * 9, 'rocket', 90, true, 6, 2.5, true));
        game.triggerScreenShake(3, 0.1);
        break;

      case 'FLAME':
        audio.playShootFlame();
        for (let i = 0; i < 2; i++) {
          const fAngle = (Math.random() - 0.5) * 0.2;
          const fdx = dx * Math.cos(fAngle) - dy * Math.sin(fAngle);
          const fdy = dx * Math.sin(fAngle) + dy * Math.cos(fAngle);
          game.projectiles.push(new Projectile(sx, sy, fdx * (8 + Math.random() * 3), fdy * (8 + Math.random() * 3), 'flame', 15, true, 10 + Math.random() * 6, 0.3));
        }
        break;

      case 'LASER':
        audio.playShootLaser();
        game.projectiles.push(new Projectile(sx, sy, dx * 20, dy * 20, 'laser', 28, true, 4, 0.8));
        game.triggerScreenShake(1, 0.05);
        break;

      default:
        audio.playShootPistol();
        game.projectiles.push(new Projectile(sx, sy, dx * speed, dy * speed, 'bullet', 18, true, 3.5));
        game.triggerScreenShake(1, 0.04);
        break;
    }
  }

  throwGrenade(game) {
    if (this.grenades <= 0) return;
    this.grenades--;

    if (this.characterId === 'jessica' && this.weapon === 'BOW') {

      audio.playBowShot();
      audio.playBowSpecial();
      const gvx = this.facing * 18;
      const gvy = -3;
      game.projectiles.push(new Projectile(this.x + this.width / 2, this.y + 12, gvx, gvy, 'bomb_arrow', 200, true, 7, 2.0));
      game.addFloatingText(this.x, this.y - 15, '💥 BOMB ARROW!', '#00d9ff', 12);
      return;
    }

    const gvx = this.facing * 7 + this.vx * 0.5;
    const gvy = -7;
    game.projectiles.push(new Projectile(this.x + this.width / 2, this.y + 10, gvx, gvy, 'grenade', 140, true, 6, 1.8, false, true));
    game.addFloatingText(this.x, this.y - 12, 'BOMB!', '#ff3300');
  }

  checkMeleeAttack(game) {

    if (this.weapon === 'AXE') return false;

    const meleeRange = this.meleeRange || 40;
    const nearbyEnemy = game.enemies.find(e => {
      const dist = Math.hypot((e.x + e.width / 2) - (this.x + this.width / 2), (e.y + e.height / 2) - (this.y + this.height / 2));
      return dist < meleeRange && Math.abs(e.y - this.y) < 35;
    });

    if (nearbyEnemy && this.meleeTimer <= 0) {
      this.meleeTimer = 0.3;
      audio.playMeleeSlash();
      const dmg = this.meleeDamage || 75;
      nearbyEnemy.takeDamage(dmg, Math.atan2(0, this.facing), game);
      const slashText = this.characterId === 'jessica' ? 'PHANTOM KICK!' : 'SLASH!';
      const slashColor = this.characterId === 'jessica' ? '#c084fc' : '#00d9ff';
      game.addFloatingText(nearbyEnemy.x, nearbyEnemy.y - 10, slashText, slashColor);
      game.triggerScreenShake(3, 0.08);
      return true;
    }
    return false;
  }

  tryEnterSlug(game) {
    if (this.inSlug) {

      this.inSlug = false;
      if (this.slugRef) {
        this.slugRef.isOccupied = false;
        this.x = this.slugRef.x - 20;
        this.y = this.slugRef.y - 20;
        this.vy = -7;
        this.slugRef = null;
      }
      this.isInvulnerable = true;
      this.invulnerableTimer = 1.0;
      return;
    }


    const slug = game.slugs.find(s => {
      const dist = Math.hypot((s.x + s.width / 2) - (this.x + this.width / 2), (s.y + s.height / 2) - (this.y + this.height / 2));
      return dist < 65 && !s.isOccupied;
    });

    if (slug) {
      this.inSlug = true;
      this.slugRef = slug;
      slug.isOccupied = true;
      slug.driverCharacterId = this.characterId;
      slug.driverPlayerIndex = this.playerIndex;


      if (this.slugBonus && !slug.tarmaBuffed) {
        slug.tarmaBuffed = true;
        slug.maxHp = 400;
        slug.hp = Math.min(slug.maxHp, slug.hp + 100);
        slug.cannons += 5;
        slug.speed = 5.4;
        game.addFloatingText(slug.x + 20, slug.y - 35, 'TARMA SLUG UPGRADE! +100 HP +5 CANNONS', '#ffcc00', 12);
      }

      audio.playSlugEnter();
      audio.announce("OK!");
      game.addFloatingText(slug.x + 20, slug.y - 20, 'SLUG READY!', '#00d9ff');
    }
  }

  takeDamage(amount, game) {
    if (this.isInvulnerable || this.isDead) return;

    if (this.inSlug && this.slugRef) {
      this.slugRef.takeDamage(amount, game);
      return;
    }


    if (this.damageResistance) {
      amount *= this.damageResistance;
    }

    this.hp -= amount;
    this.isInvulnerable = true;
    this.invulnerableTimer = 1.2;
    audio.playHit();
    game.triggerScreenShake(4, 0.12);
    game.spawnBlood(this.x + this.width / 2, this.y + this.height / 2);

    if (this.hp <= 0) {
      this.die(game);
    }
  }

  die(game) {
    this.isDead = true;
    this.lives--;
    this.respawnTimer = 2.5;
    game.spawnExplosion(this.x + this.width / 2, this.y + this.height / 2, 40);
    audio.playExplosion(false);

    if (this.lives < 0) {

      game.checkAllPlayersDead();
    }
  }

  respawn(game) {
    this.isDead = false;
    this.hp = 100;
    
    if (this.characterId === 'claudio') {
      this.weapon = 'AXE';
      this.ammo = Infinity;
      this.hasWarPaint = true;
      this.grenades = 15;
    } else if (this.characterId === 'jessica') {
      this.weapon = 'BOW';
      this.ammo = 180;
      this.grenades = 12;
    } else if (this.characterId === 'fio') {
      this.weapon = 'HMG';
      this.ammo = 150;
      this.grenades = 10;
    } else {
      this.weapon = 'PISTOL';
      this.ammo = Infinity;
      this.grenades = 10;
    }

    this.isInvulnerable = true;
    this.invulnerableTimer = 2.5;
    this.x = game.camera.x + 80 + (this.playerIndex * 40);
    this.y = 80;
    this.vx = 0;
    this.vy = 0;
  }

  equipWeapon(type, ammoCount, game) {

    if (this.characterId === 'claudio' && type !== 'AXE') {
      game.addFloatingText(this.x, this.y - 20, 'MACHADO ETERNO!', '#ffcc00', 11);
      audio.announce("LEVIATHAN AXE");
      return;
    }

    this.weapon = type;
    if (type === 'AXE') {
      this.hasWarPaint = true;
    }
    const finalAmmo = Math.round(ammoCount * (this.pickupMultiplier || 1.0));
    this.ammo = finalAmmo;
    this.score += 500;

    let announceName = "OK!";
    switch (type) {
      case 'AXE': announceName = "LEVIATHAN AXE"; audio.playAxeHit(); break;
      case 'BOW': announceName = "CYBER BOW"; audio.playBowSpecial(); break;
      case 'HMG': announceName = "HEAVY MACHINE GUN"; break;
      case 'SHOTGUN': announceName = "SHOTGUN"; break;
      case 'ROCKET': announceName = "ROCKET LAUNCHER"; break;
      case 'FLAME': announceName = "FLAME SHOT"; break;
      case 'LASER': announceName = "LASER GUN"; break;
    }

    audio.announce(announceName);
    game.addFloatingText(this.x, this.y - 20, announceName + "!", '#ffcc00', 13);
  }
}




class Enemy {
  constructor(x, y, type = 'soldier', biome = 'tokyo') {
    this.id = Math.random();
    this.x = x;
    this.y = y;
    this.type = type;
    this.biome = biome;
    this.facing = -1;
    this.vx = 0;
    this.vy = 0;
    this.onGround = false;
    this.flashTimer = 0;
    this.shootTimer = 0.8 + Math.random() * 1.5;
    this.animTime = Math.random() * 10;


    switch (type) {
      case 'shield':
        this.width = 34;
        this.height = 46;
        this.hp = biome === 'egypt' ? 120 : (biome === 'europe' ? 100 : 90);
        this.maxHp = this.hp;
        this.speed = 1.6;
        this.scoreValue = 300;
        break;

      case 'rocket_trooper':
        this.width = 30;
        this.height = 46;
        this.hp = biome === 'egypt' ? 60 : 45;
        this.maxHp = this.hp;
        this.speed = 1.8;
        this.scoreValue = 250;
        break;

      case 'drone':
        this.width = 36;
        this.height = 28;
        this.hp = biome === 'egypt' ? 65 : 50;
        this.maxHp = this.hp;
        this.speed = 2.4;
        this.scoreValue = 400;
        this.baseY = y;
        break;

      default:
        this.width = 28;
        this.height = 44;
        this.hp = biome === 'egypt' ? 45 : (biome === 'europe' ? 40 : 35);
        this.maxHp = this.hp;
        this.speed = 2.2;
        this.scoreValue = 150;
        break;
    }
  }

  update(dt, player, game) {
    this.animTime += dt;
    if (this.flashTimer > 0) this.flashTimer -= dt;
    this.shootTimer -= dt;

    const distToPlayer = player.x - this.x;
    const absDist = Math.abs(distToPlayer);


    if (this.type !== 'drone') {
      this.facing = distToPlayer > 0 ? 1 : -1;
    }

    if (this.type === 'drone') {

      this.x += Math.sign(distToPlayer) * this.speed * 0.8;
      this.y = this.baseY + Math.sin(game.time * 4 + this.id) * 35;

      if (this.shootTimer <= 0 && absDist < 480) {
        this.shootTimer = 2.0 + Math.random();
        const angle = Math.atan2((player.y + 20) - this.y, (player.x + 15) - this.x);
        game.projectiles.push(new Projectile(this.x + this.width / 2, this.y + this.height, Math.cos(angle) * 7.5, Math.sin(angle) * 7.5, 'bullet', 15, false, 4));
        audio.playShootPistol();
      }
      return;
    }


    if (absDist > 220) {
      this.vx = this.facing * this.speed;
    } else if (absDist < 80 && this.type !== 'shield') {
      this.vx = -this.facing * this.speed * 0.7;
    } else {
      this.vx = 0;
    }


    if (this.shootTimer <= 0 && absDist < 520) {
      this.shootTimer = 1.6 + Math.random() * 1.2;
      this.performAttack(player, game);
    }


    this.vy += 0.48;
    if (this.vy > 14) this.vy = 14;

    this.x += this.vx;
    game.resolveHorizontalCollision(this);

    this.y += this.vy;
    this.onGround = false;
    game.resolveVerticalCollision(this);
  }

  performAttack(player, game) {
    const sx = this.x + (this.facing === 1 ? this.width + 4 : -4);
    const sy = this.y + 18;

    if (this.type === 'rocket_trooper') {
      game.projectiles.push(new Projectile(sx, sy, this.facing * 7.5, 0, 'rocket', 25, false, 5, 3.0, true));
      audio.playShootRocket();
    } else if (this.type === 'shield') {
      game.projectiles.push(new Projectile(sx, sy, this.facing * 8.5, 0, 'bullet', 12, false, 3.5));
      audio.playShootPistol();
    } else {
      if (Math.random() < 0.25) {
        game.projectiles.push(new Projectile(sx, sy - 8, this.facing * 5, -6, 'grenade', 30, false, 5, 2.0, false, true));
      } else {
        game.projectiles.push(new Projectile(sx, sy, this.facing * 9, 0, 'bullet', 14, false, 3.5));
        audio.playShootPistol();
      }
    }
  }

  takeDamage(amount, bulletAngle, game) {
    if (this.type === 'shield') {
      const isFromFront = (this.facing === 1 && Math.cos(bulletAngle) < 0) || (this.facing === -1 && Math.cos(bulletAngle) > 0);
      if (isFromFront) {
        amount *= 0.15;
        game.spawnSpark(this.x + (this.facing === 1 ? this.width : 0), this.y + 20);
      }
    }

    this.hp -= amount;
    this.flashTimer = 0.08;
    game.spawnBlood(this.x + this.width / 2, this.y + this.height / 2);

    if (this.hp <= 0) {
      this.die(game);
    }
  }

  die(game) {
    this.hp = 0;
    game.players.forEach(p => { p.score += this.scoreValue; });
    game.addFloatingText(this.x, this.y - 12, `+${this.scoreValue}`, '#ffcc00');
    game.spawnExplosion(this.x + this.width / 2, this.y + this.height / 2, 28);
    audio.playExplosion(false);

    if (Math.random() < 0.2) {
      game.pickups.push(new Pickup(this.x, this.y, 'FOOD'));
    }
  }
}




class Boss {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.baseY = y;
    this.width = 260;
    this.height = 240;



    this.hp = 21000;
    this.maxHp = 21000;
    this.flashTimer = 0;
    this.phase = 1;
    this.isDead = false;
    this.lastAttack = null;



    this.state = 'INTRO';
    this.stateTimer = 1.4;
    this.attackCooldown = 1.45;


    this.vx = 0;
    this.vy = 0;
    this.facing = -1;
    this.targetFacing = -1;
    this.turnTimer = 0;
    this.speed = 2.35;
    this.chaseDistance = 230;
    this.stepTimer = 0;
    this.stepCount = 0;
    this.rushDamageTimer = 0;
    this.rushPulseTimer = 0;


    this.animTime = 0;
    this.bodyBob = 0;
    this.targetBodyBob = 0;
    this.bodyLean = 0;
    this.targetBodyLean = 0;
    this.headAngle = 0;
    this.targetHeadAngle = 0;
    this.cannonAngle = 0;
    this.spineGlow = 0.3;
    this.recoilX = 0;
    this.impactWobble = 0;
    this.impactTilt = 0;
    this.impactOffsetY = 0;
    this.chargeParticles = [];
    this.cinematicX = null;
    this.cinematicY = null;
    this.cinematicScale = 1;
    this.cinematicOpacity = 1;
    this.cinematicTilt = 0;
    this.hiddenByDragon = false;


    this.laserActive = false;
    this.laserTimer = 0;
    this.laserDamageCooldown = 0;


    this.minArenaX = 3800;
    this.maxArenaX = 5120;
  }

  update(dt, player, game) {
    this.animTime += dt;
    if (this.flashTimer > 0) this.flashTimer -= dt;



    if (this.isDead || this.state === 'DYING') {
      this.laserActive = false;
      return;
    }

    if (this.stateTimer > 0) this.stateTimer -= dt;
    if (this.attackCooldown > 0) this.attackCooldown -= dt;
    if (this.laserDamageCooldown > 0) this.laserDamageCooldown -= dt;
    this.impactWobble = Math.max(0, this.impactWobble - dt * 2.8);
    this.impactTilt += (0 - this.impactTilt) * 7 * dt;
    this.impactOffsetY += (0 - this.impactOffsetY) * 11 * dt;


    this.recoilX += (0 - this.recoilX) * 5 * dt;
    

    this.bodyBob += (this.targetBodyBob - this.bodyBob) * 8 * dt;
    this.bodyLean += (this.targetBodyLean - this.bodyLean) * 6 * dt;
    this.headAngle += (this.targetHeadAngle - this.headAngle) * 10 * dt;



    const hpRatio = this.hp / this.maxHp;
    const nextPhase = hpRatio < 0.35 ? 3 : (hpRatio < 0.7 ? 2 : 1);
    if (nextPhase > this.phase) this.enterPhase(nextPhase, game);


    const targetP = game.getClosestPlayer(this.x + this.width / 2, this.y + this.height / 2);
    const distToTarget = (targetP.x + targetP.width / 2) - (this.x + this.width / 2);
    const absDist = Math.abs(distToTarget);

    this.targetFacing = distToTarget > 0 ? 1 : -1;

    const angleToTarget = Math.atan2((targetP.y + 20) - (this.y + 60), (targetP.x + 15) - (this.x + (this.facing === 1 ? this.width : 0)));
    this.targetHeadAngle = Math.max(-0.45, Math.min(0.45, angleToTarget));
    this.cannonAngle = this.headAngle;


    this.updateChargeParticles(dt);




    switch (this.state) {
      case 'INTRO':

        this.spineGlow = 0.5 + Math.sin(this.animTime * 10) * 0.4;
        if (this.stateTimer <= 0) {
          game.triggerScreenShake(14, 0.5);
          audio.playMechaRoar();
          game.spawnExplosion(this.x + 40, this.y + this.height - 10, 45);
          game.spawnExplosion(this.x + this.width - 40, this.y + this.height - 10, 45);
          this.state = 'IDLE';
          this.stateTimer = 1.0;
        }
        break;

      case 'IDLE':
        this.vx = 0;
        this.targetBodyBob = Math.sin(this.animTime * 3) * 4;
        this.targetBodyLean = 0;
        this.spineGlow = 0.3 + Math.sin(this.animTime * 4) * 0.2;


        if (this.facing !== this.targetFacing) {
          this.turnTimer += dt;
          if (this.turnTimer > 0.35) {
            this.facing = this.targetFacing;
            this.turnTimer = 0;
          }
        } else {
          this.turnTimer = 0;
        }


        if (this.attackCooldown <= 0 && this.stateTimer <= 0) {
          this.decideNextAction(absDist, game);
        }
        break;

      case 'WALK': {


        const chaseDirection = distToTarget >= 0 ? 1 : -1;
        this.facing = chaseDirection;
        this.targetFacing = chaseDirection;
        this.vx = chaseDirection * this.speed;
        const walkGait = Math.sin(this.animTime * 7.2);
        this.targetBodyBob = walkGait * 3.5 + Math.abs(walkGait) * 5;
        this.targetBodyLean = this.facing * (0.07 + walkGait * 0.035);
        this.spineGlow = 0.4 + Math.sin(this.animTime * 6) * 0.2;


        this.stepTimer += dt;
        if (this.stepTimer >= 0.32) {
          this.stepTimer = 0;
          this.stepCount++;
          game.triggerScreenShake(4, 0.15);
          audio.playMechaStep();
          const footX = this.x + (this.stepCount % 2 === 0 ? 50 : this.width - 50);
          game.spawnDust(footX, this.y + this.height - 5);
        }


        if ((this.facing === -1 && this.x <= this.minArenaX) || (this.facing === 1 && this.x >= this.maxArenaX)) {
          this.vx = 0;
          this.state = 'IDLE';
          this.stateTimer = 0.5;
        }



        if (absDist <= this.chaseDistance || this.stateTimer <= 0) {
          this.vx = 0;
          this.decideNextAction(absDist, game);
        }
        break;
      }

      case 'RUSH': {


        const rushDirection = this.rushDirection || this.facing;
        this.facing = rushDirection;
        const rushMultiplier = this.phase === 3 ? 5.1 : (this.phase === 2 ? 4.45 : 3.8);
        this.vx = rushDirection * this.speed * rushMultiplier;
        const rushGait = Math.sin(this.animTime * 13);
        this.targetBodyBob = rushGait * 5 + Math.abs(rushGait) * 7;
        this.targetBodyLean = rushDirection * (0.16 + rushGait * 0.05);
        this.spineGlow = 1.2;

        this.stepTimer += dt;
        if (this.stepTimer >= 0.11) {
          this.stepTimer = 0;
          game.triggerScreenShake(8, 0.14);
          game.spawnDust(this.x + this.width / 2, this.y + this.height - 5);
          game.spawnSpark(this.x + (rushDirection === 1 ? 12 : this.width - 12), this.y + this.height - 46);
        }

        this.rushDamageTimer = Math.max(0, (this.rushDamageTimer || 0) - dt);
        if (this.rushDamageTimer <= 0) {
          this.rushDamageTimer = 0.2;
          const impactX = this.x + (rushDirection === 1 ? this.width + 52 : -52);
          const rushDamage = this.phase === 3 ? 78 : (this.phase === 2 ? 64 : 50);
          this.damagePlayersNear(impactX, this.y + this.height * 0.58, 205, rushDamage, game);
          game.spawnExplosion(impactX, this.y + this.height * 0.62, 26);
        }

        if (this.stateTimer <= 0 || (rushDirection === -1 && this.x <= this.minArenaX) || (rushDirection === 1 && this.x >= this.maxArenaX)) {
          this.vx = 0;
          this.state = 'IDLE';
          this.stateTimer = 0.45;
          this.attackCooldown = 1.1;
        }
        break;
      }

      case 'PREPARE_LASER':

        this.vx = 0;
        this.targetBodyBob = -6;
        this.targetBodyLean = -this.facing * 0.15;
        this.spineGlow = 1.0 + (1 - this.stateTimer / 0.7) * 1.2;


        if (Math.random() < 0.6) {
          const mouthX = this.x + (this.facing === 1 ? this.width + 10 : -10);
          const mouthY = this.y + 65;
          const rad = 60 + Math.random() * 50;
          const ang = Math.random() * Math.PI * 2;
          this.chargeParticles.push({
            x: mouthX + Math.cos(ang) * rad,
            y: mouthY + Math.sin(ang) * rad,
            tx: mouthX,
            ty: mouthY,
            life: 0.35,
            maxLife: 0.35
          });
        }

        if (this.stateTimer <= 0) {

          this.state = 'FIRE_LASER';
          this.stateTimer = 1.3;
          this.laserActive = true;
          audio.playProtonBeam();
          game.addFloatingText(this.x + this.width / 2, this.y - 30, '⚡ PROTON SCREAM! ⚡', '#ff0033', 16);
          this.recoilX = -this.facing * 18;
        }
        break;

      case 'FIRE_LASER':

        this.vx = 0;
        this.laserActive = true;
        this.spineGlow = 2.0;
        this.bodyBob = Math.sin(this.animTime * 30) * 2;
        this.bodyLean = -this.facing * 0.14;
        this.recoilX -= this.facing * 12 * dt;


        game.triggerScreenShake(7.5, 0.15);


        if (this.laserDamageCooldown <= 0) {
          this.laserDamageCooldown = 0.12;
          this.checkLaserCollisions(game);
        }


        if (Math.random() < 0.7) {
          const beamLen = 950;
          const hitX = this.x + (this.facing === 1 ? this.width + Math.random() * beamLen : -Math.random() * beamLen);
          game.spawnSpark(hitX, this.y + 65 + (Math.random() - 0.5) * 20);
        }

        if (this.stateTimer <= 0) {
          this.laserActive = false;
          this.state = 'RECOIL_LASER';
          this.stateTimer = 0.5;
          this.attackCooldown = this.phase === 3 ? 1.8 : 2.5;
        }
        break;

      case 'RECOIL_LASER':

        this.laserActive = false;
        this.spineGlow = Math.max(0.3, this.stateTimer / 0.5);
        this.bodyBob = 0;
        this.bodyLean = 0;


        if (Math.random() < 0.5) {
          game.spawnSmoke(this.x + (this.facing === 1 ? 30 : this.width - 30), this.y + 40, 10);
        }

        if (this.stateTimer <= 0) {
          this.state = 'IDLE';
          this.stateTimer = 0.6;
        }
        break;

      case 'MISSILE_SALVO':
        this.vx = 0;
        this.bodyBob = -2;
        this.spineGlow = 0.8;

        if (this.stateTimer <= 0) {
          this.state = 'IDLE';
          this.stateTimer = 0.8;
          this.attackCooldown = 2.4;
        }
        break;

      case 'TITAN_STOMP':
        this.vx = 0;
        if (this.stateTimer <= 0) {
          this.state = 'IDLE';
          this.stateTimer = 0.7;
          this.attackCooldown = 2.2;
        }
        break;

      case 'DYING':
        this.vx = 0;
        this.laserActive = false;
        this.spineGlow = Math.random() * 2.0;
        this.bodyBob = Math.sin(this.animTime * 20) * 3;
        break;
    }


    this.x += this.vx;
    this.x = Math.max(this.minArenaX, Math.min(this.maxArenaX, this.x));
  }

  decideNextAction(distToPlayer, game) {

    const choices = [];



    if (distToPlayer > 440) {
      choices.push('WALK', 'WALK', 'WALK', 'MISSILE_SALVO');
    } else if (distToPlayer > this.chaseDistance) {
      choices.push('WALK', 'PREPARE_LASER', 'MISSILE_SALVO', 'WALK');
    } else {

      choices.push('TITAN_STOMP', 'TITAN_STOMP', 'PREPARE_LASER');
    }



    if (distToPlayer > 180 && distToPlayer < 980) {
      choices.push('RUSH');
      if (this.phase >= 2) choices.push('RUSH', 'RUSH');
      if (this.phase === 3) choices.push('RUSH');
    }



    let nextAction = choices[Math.floor(Math.random() * choices.length)];
    if (nextAction === this.lastAttack && choices.length > 1) {
      const alternatives = choices.filter(choice => choice !== this.lastAttack);
      nextAction = alternatives[Math.floor(Math.random() * alternatives.length)];
    }
    this.lastAttack = nextAction;

    if (nextAction === 'WALK') {
      this.state = 'WALK';


      this.stateTimer = 2.8 + Math.random() * 1.4;
      this.stepTimer = 0;
    } else if (nextAction === 'RUSH') {
      this.executeRush(game);
    } else if (nextAction === 'PREPARE_LASER') {
      this.state = 'PREPARE_LASER';
      this.stateTimer = 0.65;
      audio.playLaserCharge();
    } else if (nextAction === 'MISSILE_SALVO') {
      this.executeMissileSalvo(game);
    } else if (nextAction === 'TITAN_STOMP') {
      this.executeTitanStomp(game);
    }
  }

  executeRush(game) {
    this.state = 'RUSH';
    this.stateTimer = this.phase === 3 ? 1.45 : (this.phase === 2 ? 1.22 : 1.05);
    this.rushDirection = this.targetFacing;
    this.facing = this.rushDirection;
    this.stepTimer = 0;
    this.rushDamageTimer = 0;
    this.rushPulseTimer = 0;
    audio.playMechaRoar();
    game.triggerScreenShake(12, 0.25);
    game.addFloatingText(this.x + this.width / 2, this.y - 25, '⚠️ TITAN BREAKER CHARGE! ⚠️', '#ff3300', 15);
  }

  executeMissileSalvo(game) {
    this.state = 'MISSILE_SALVO';
    this.stateTimer = 1.2;
    const attackRunId = game.runId;
    audio.playBossWarning();
    game.addFloatingText(this.x + this.width / 2, this.y - 25, '🚀 MISSILE SWARM! 🚀', '#ffaa00', 14);

    const count = this.phase === 3 ? 10 : (this.phase === 2 ? 7 : 5);
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        if (game.runId !== attackRunId || game.boss !== this || this.isDead || game.cinematicActive || game.state !== 'PLAYING') return;
        const sx = this.x + (this.facing === 1 ? 40 + i * 15 : this.width - 40 - i * 15);
        const sy = this.y - 15;
        const target = game.getClosestPlayer(sx, sy);
        const tx = target.x + target.width / 2;
        const ty = target.y + target.height / 2;
        const angle = Math.atan2(ty - sy, tx - sx);
        const spread = (i - (count - 1) / 2) * 0.08;
        const speed = 8.5;
        game.projectiles.push(new Projectile(
          sx, sy, Math.cos(angle + spread) * speed, Math.sin(angle + spread) * speed,
          'rocket', this.phase === 3 ? 48 : 40, false, 6, 3.5, true
        ));
        audio.playShootRocket();
        game.spawnSmoke(sx, sy, 8);
      }, i * 140);
    }
  }

  executeTitanStomp(game) {
    this.state = 'TITAN_STOMP';
    this.stateTimer = 1.0;
    const attackRunId = game.runId;
    audio.playExplosion(true);
    game.triggerScreenShake(14, 0.45);
    game.addFloatingText(this.x + this.width / 2, this.y + this.height - 20, '💥 TITAN SEISMIC STOMP! 💥', '#ff3300', 15);


    const waveCount = this.phase === 3 ? 16 : 13;
    for (let i = 0; i < waveCount; i++) {
      setTimeout(() => {
        if (game.runId !== attackRunId || game.boss !== this || this.isDead || game.cinematicActive || game.state !== 'PLAYING') return;
        const groundY = this.y + this.height - 10;
        const sx1 = this.x - i * 40;
        const sx2 = this.x + this.width + i * 40;

        game.spawnExplosion(sx1, groundY, 28);
        game.spawnExplosion(sx2, groundY, 28);
        const stompDamage = this.phase === 3 ? 42 : 34;
        this.damagePlayersNear(sx1, groundY, 64, stompDamage, game);
        this.damagePlayersNear(sx2, groundY, 64, stompDamage, game);


        if (i % 3 === 0) {
          const cannonY = this.y + 90;
          const cannonX = this.x + (this.facing === 1 ? this.width + 10 : -10);
          game.projectiles.push(new Projectile(cannonX, cannonY, this.facing * 17, (Math.random() - 0.5) * 1.5, 'laser', this.phase === 3 ? 36 : 29, false, 6, 1.2));
          audio.playShootLaser();
        }
      }, i * 55);
    }
  }

  checkLaserCollisions(game) {
    const mouthX = this.x + (this.facing === 1 ? this.width + 15 : -15);
    const mouthY = this.y + 65;
    const beamLength = 1000;
    const beamHeight = 44;

    const beamMinX = this.facing === 1 ? mouthX : mouthX - beamLength;
    const beamMaxX = this.facing === 1 ? mouthX + beamLength : mouthX;
    const beamMinY = mouthY - beamHeight / 2;
    const beamMaxY = mouthY + beamHeight / 2;


    game.players.forEach(p => {
      if (p.isDead || p.isInvulnerable) return;
      if (p.x + p.width > beamMinX && p.x < beamMaxX && p.y + p.height > beamMinY && p.y < beamMaxY) {
        p.takeDamage(this.phase === 3 ? 38 : 32, game);
        game.spawnBlood(p.x + p.width / 2, p.y + p.height / 2);
      }
    });


    game.slugs.forEach(s => {
      if (s.destroyed) return;
      if (s.x + s.width > beamMinX && s.x < beamMaxX && s.y + s.height > beamMinY && s.y < beamMaxY) {
        s.takeDamage(20, game);
        game.spawnSpark(s.x + s.width / 2, s.y + s.height / 2);
      }
    });
  }

  enterPhase(phase, game) {
    this.phase = phase;
    this.speed = phase === 3 ? 4.1 : 3.15;
    this.chaseDistance = phase === 3 ? 175 : 205;
    this.attackCooldown = 0.8;
    game.triggerScreenShake(phase === 3 ? 12 : 8, 0.35);
    audio.playMechaRoar();
    const label = phase === 3 ? '☢️ NÚCLEO EM FUSÃO! ☢️' : '⚠️ PROTOCOLO DE CAÇA ATIVO! ⚠️';
    game.addFloatingText(this.x + this.width / 2, this.y - 45, label, phase === 3 ? '#ff3300' : '#ffaa00', 16);
  }

  damagePlayersNear(x, y, radius, damage, game) {
    const titanDamage = Math.round(damage * (this.phase === 3 ? 1.22 : 1.12));
    game.players.forEach(player => {
      if (player.isDead || player.isInvulnerable) return;
      const target = player.inSlug && player.slugRef ? player.slugRef : player;
      const centerX = target.x + target.width / 2;
      const centerY = target.y + target.height / 2;
      if (Math.hypot(centerX - x, centerY - y) <= radius) {
        player.takeDamage(titanDamage, game);
        game.spawnDust(centerX, target.y + target.height);
      }
    });
  }

  updateChargeParticles(dt) {
    for (let i = this.chargeParticles.length - 1; i >= 0; i--) {
      const p = this.chargeParticles[i];
      p.life -= dt;
      const progress = 1 - (p.life / p.maxLife);
      p.curX = p.x + (p.tx - p.x) * progress;
      p.curY = p.y + (p.ty - p.y) * progress;
      if (p.life <= 0) {
        this.chargeParticles.splice(i, 1);
      }
    }
  }

  takeDamage(amount, arg2, arg3) {
    if (this.isDead) return;
    const game = (arg2 && typeof arg2 === 'object' && arg2.spawnSpark) ? arg2 : (arg3 && typeof arg3 === 'object' && arg3.spawnSpark ? arg3 : (window.game || window.gameEngine || null));



    const effectiveDamage = amount >= 300 ? Math.round(amount * 0.35) : Math.round(amount * 0.85);
    this.hp -= effectiveDamage;
    this.flashTimer = 0.08;
    const impactStrength = Math.min(1, effectiveDamage / 360);
    this.recoilX += (this.facing === -1 ? 3 : -3) * (1 + impactStrength * 1.8);
    this.impactWobble = Math.min(1.2, this.impactWobble + impactStrength);
    this.impactTilt += -this.facing * impactStrength * 0.13;
    this.impactOffsetY -= impactStrength * 5;

    if (game && game.spawnSpark) {
      game.spawnSpark(this.x + Math.random() * this.width, this.y + Math.random() * this.height);
    }

    if (this.hp <= 0) {
      this.die(game);
    }
  }

  die(game) {
    if (this.isDead && this.state === 'DYING') return;
    this.isDead = true;
    this.state = 'DYING';
    this.hp = 0;
    this.laserActive = false;
    this.cinematicX = this.x;
    this.cinematicY = this.y;
    this.cinematicScale = 1;
    this.cinematicOpacity = 1;
    this.cinematicTilt = this.facing * 0.035;
    const g = game || window.game || window.gameEngine;
    const finaleRunId = g ? g.runId : null;
    if (g && g.players) {
      g.players.forEach(p => { p.score += 50000; });
    }
    if (g && g.addFloatingText) {
      g.addFloatingText(this.x + this.width / 2, this.y - 25, '👑 MECHAGODZILLA DESTROYED! +50000 👑', '#ffcc00', 18);
    }
    audio.playMechaRoar();


    if (g && !g.activeTimers) g.activeTimers = [];
    
    for (let i = 0; i < 10; i++) {
      const timerId = setTimeout(() => {
        if (g && g.runId === finaleRunId && g.spawnExplosion) {
          g.spawnExplosion(this.x + Math.random() * this.width, this.y + Math.random() * this.height, 65 + Math.random() * 45);
          audio.playExplosion(true);
          if (g.triggerScreenShake) g.triggerScreenShake(11, 0.3);
        }
      }, i * 110);
      

      if (g && g.activeTimers) {
        g.activeTimers.push(timerId);
      }
    }

    if (g && g.beginGhidorahTransition) {
      g.beginGhidorahTransition(this);
    } else if (g && g.spawnGhidorahBoss) {
      g.spawnGhidorahBoss();
    } else if (g && g.missionComplete) {
      g.missionComplete();
    }
  }
}




class DragonCinematic {
  constructor(boss, game) {
    this.boss = boss;
    this.state = 'APPROACH';
    this.stateTime = 0;
    this.totalTime = 0;
    this.x = boss.x + 450;
    this.y = boss.y - 250;
    this.scale = 1.2;
    this.facing = -1;
    this.bank = 0;
    this.wingPhase = 0;
    this.tailPhase = 0;
    this.headPhase = 0;
    this.carrying = false;
    this.sweepHit = false;
    this.originX = this.x;
    this.originY = this.y;
    this.game = game;
  }

  transition(nextState) {
    this.state = nextState;
    this.stateTime = 0;
  }

  update(dt, game) {

    if (!this.boss || this.boss.hiddenByDragon) {
      if (typeof debugWarn !== 'undefined') debugWarn('Boss não encontrado no DragonCinematic, pulando para DONE');
      this.state = 'DONE';
      if (game && game.spawnGhidorahBoss) {
        game.spawnGhidorahBoss();
      }
      return;
    }
    
    this.stateTime += dt;
    this.totalTime += dt;
    const wingSpeed = this.state === 'CARRY' ? 14 : 10;
    this.wingPhase += dt * wingSpeed;
    this.tailPhase += dt * 6;
    this.headPhase += dt * 5;

    const boss = this.boss;
    

    if (!boss || typeof boss.x === 'undefined' || typeof boss.y === 'undefined') {
      if (typeof debugWarn !== 'undefined') debugWarn('Boss perdeu propriedades essenciais, finalizando cinemática');
      this.state = 'DONE';
      if (game && game.spawnGhidorahBoss) {
        game.spawnGhidorahBoss();
      }
      return;
    }
    
    const easeOut = t => 1 - Math.pow(1 - Math.min(1, t), 3);

    if (this.state === 'APPROACH') {
      this.facing = -1;
      this.bank = 0.12;
      const progress = easeOut(this.stateTime / 0.55);
      this.x = this.originX + ((boss.x + 20) - this.originX) * progress;
      this.y = this.originY + ((boss.y - 60) - this.originY) * progress;
      this.setFallingBossPose(progress);
      if (this.stateTime >= 0.55) {
        audio.playGhidorahRoar();
        game.triggerDragonClawStrike(boss);
        this.originX = this.x;
        this.originY = this.y;
        this.transition('GRAB');
      }
      return;
    }

    if (this.state === 'GRAB') {
      this.facing = -1;
      this.y = boss.y - 60 + Math.sin(this.wingPhase * 0.7) * 5;
      this.x = boss.x + 20;
      this.carrying = true;
      this.attachBoss();
      if (this.stateTime >= 0.35) {
        game.triggerScreenShake(12, 0.3);
        game.addFloatingText(this.x + 50, this.y - 60, '⚡ O DRAGÃO RECLAMA O TITÃ! ⚡', '#ffd700', 16);
        this.originX = this.x;
        this.originY = this.y;
        this.transition('CARRY');
      }
      return;
    }

    if (this.state === 'CARRY') {
      this.facing = 1;
      this.bank = -0.15;
      const progress = easeOut(this.stateTime / 0.85);
      this.x = this.originX + 750 * progress;
      this.y = this.originY - 350 * progress;
      this.attachBoss();
      if (this.stateTime >= 0.85) {
        if (typeof debugLog !== 'undefined') debugLog('Dragão terminou de carregar o MechaGodzilla, preparando King Ghidorah...');
        if (boss) {
          boss.hiddenByDragon = true;
        }
        this.carrying = false;
        this.state = 'DONE';
        

        if (game) {
          game.cinematicActive = false;
          game.dragon = null;
          

          if (game.spawnGhidorahBoss) {
            if (typeof debugLog !== 'undefined') debugLog('Chamando spawnGhidorahBoss...');
            game.spawnGhidorahBoss();
          } else {
            if (typeof debugError !== 'undefined') debugError('game.spawnGhidorahBoss não encontrado!');
          }
        }
      }
      return;
    }
  }

  attachBoss() {
    if (!this.boss) return;
    this.boss.cinematicX = this.x - (this.facing === 1 ? 70 : 30);
    this.boss.cinematicY = this.y + 35;
    this.boss.cinematicScale = 0.65;
    this.boss.cinematicOpacity = 0.92;
    this.boss.cinematicTilt = this.facing * 0.28;
  }

  setFallingBossPose(progress) {
    if (!this.boss) return;
    this.boss.cinematicX = this.boss.x;
    this.boss.cinematicY = this.boss.y + progress * 8;
    this.boss.cinematicScale = 1;
    this.boss.cinematicOpacity = 0.9;
    this.boss.cinematicTilt = this.boss.facing * 0.15;
  }
}




class KingGhidorahBoss {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.groundY = y;
    this.width = 250;
    this.height = 250;
    this.spriteScale = 1.7;

    this.hp = 26000;
    this.maxHp = 26000;
    this.flashTimer = 0;
    this.phase = 1;
    this.isDead = false;
    this.isGhidorah = true;
    this.type = 'GHIDORAH';
    this.phaseLabels = ['TEMPESTADE DOURADA', 'SOBRECARGA GRAVITACIONAL', 'APOCALIPSE ANCESTRAL'];
    this.lastAttack = null;


    this.state = 'INTRO_LANDING';
    this.stateTimer = 2.2;
    this.attackCooldown = 0.85;

    this.vx = 0;
    this.vy = 0;
    this.facing = -1;
    this.targetFacing = -1;
    this.turnTimer = 0;
    this.speed = 3.0;
    this.chaseDistance = 260;
    this.stepTimer = 0;
    this.stepCount = 0;

    this.isFlying = false;
    this.isLanding = false;
    this.isBombarding = false;
    this.sweepStage = 1;
    this.maxSweepTime = 1.8;
    this.maxBurstTime = 1.2;
    this.tornadoDamageTimer = 0;
    this.gravityBeamDamageCooldown = 0;

    this.animTime = 0;
    this.bodyBob = 0;
    this.impactTilt = 0;
    this.recoilX = 0;
    this.cinematicScale = 1;
    this.cinematicOpacity = 1;
    this.cinematicTilt = 0;

    this.minArenaX = 3800;
    this.maxArenaX = 5120;
  }

  update(dt, player, game) {
    this.animTime += dt;
    if (this.flashTimer > 0) this.flashTimer -= dt;
    if (this.stateTimer > 0) this.stateTimer -= dt;
    if (this.attackCooldown > 0) this.attackCooldown -= dt;
    if (this.gravityBeamDamageCooldown > 0) this.gravityBeamDamageCooldown -= dt;
    if (this.tornadoDamageTimer > 0) this.tornadoDamageTimer -= dt;

    this.impactTilt += (0 - this.impactTilt) * 7 * dt;
    this.recoilX += (0 - this.recoilX) * 6 * dt;

    if (this.isDead || this.state === 'DYING') {
      this.vx = 0;
      this.vy = 0;
      return;
    }


    const hpRatio = this.hp / this.maxHp;
    const nextPhase = hpRatio < 0.33 ? 3 : (hpRatio < 0.66 ? 2 : 1);
    if (nextPhase > this.phase) {
      this.enterPhase(nextPhase, game);
    }

    const targetP = game.getClosestPlayer(this.x + this.width / 2, this.y + this.height / 2);
    const distToTarget = (targetP.x + targetP.width / 2) - (this.x + this.width / 2);
    const absDist = Math.abs(distToTarget);

    if (this.state !== 'AERIAL_SWOOP' && this.state !== 'GOLDEN_TORNADO') {
      this.targetFacing = distToTarget >= 0 ? 1 : -1;
    }




    switch (this.state) {
      case 'INTRO_LANDING':
        this.isFlying = false;
        this.bodyBob = Math.sin(this.animTime * 15) * 4;
        if (this.stateTimer <= 0) {
          audio.playGhidorahRoar();
          game.triggerScreenShake(18, 0.6);
          game.cinematicFlash = 0.5;
          game.cinematicFlashColor = '#ffd700';
          game.addFloatingText(this.x + this.width / 2, this.y - 45, '👑 KING GHIDORAH: O TITÃ ANCESTRAL! 👑', '#ffd700', 17);
          this.state = 'ROAR';
          this.stateTimer = 1.4;
          this.attackCooldown = 0.8;
        }
        break;

      case 'IDLE':
      case 'BATTLE_STANCE':
        this.vx = 0;
        this.bodyBob = Math.sin(this.animTime * 3) * 5;


        if (this.facing !== this.targetFacing) {
          this.turnTimer += dt;
          if (this.turnTimer > 0.2) {
            this.facing = this.targetFacing;
            this.turnTimer = 0;
          }
        } else {
          this.turnTimer = 0;
        }

        if (this.attackCooldown <= 0 && this.stateTimer <= 0) {
          this.decideNextAction(absDist, game);
        }
        break;

      case 'WALK': {
        const chaseDir = distToTarget >= 0 ? 1 : -1;
        this.facing = chaseDir;
        this.vx = chaseDir * this.speed * (this.phase === 3 ? 1.4 : (this.phase === 2 ? 1.2 : 1.0));
        this.bodyBob = Math.sin(this.animTime * 8) * 6;

        this.stepTimer += dt;
        if (this.stepTimer >= 0.28) {
          this.stepTimer = 0;
          this.stepCount++;
          game.triggerScreenShake(4, 0.12);
          audio.playMechaStep();
          game.spawnDust(this.x + (this.stepCount % 2 === 0 ? 50 : this.width - 50), this.groundY + this.height - 10);
        }

        if (absDist <= this.chaseDistance || this.stateTimer <= 0) {
          this.vx = 0;
          this.decideNextAction(absDist, game);
        }
        break;
      }

      case 'ROAR':
        this.vx = 0;
        this.bodyBob = Math.sin(this.animTime * 20) * 3;

        if (Math.random() < 0.2) {
          const rx = targetP.x + (Math.random() - 0.5) * 300;
          const ry = targetP.y;
          game.addLightningBolt(rx + (Math.random() - 0.5) * 100, 0, rx, ry);
          game.spawnExplosion(rx, ry, 25);
          this.damagePlayersNear(rx, ry, 60, 25, game);
        }
        if (this.stateTimer <= 0) {
          this.state = 'BATTLE_STANCE';
          this.stateTimer = 0.5;
          this.attackCooldown = 1.0;
        }
        break;

      case 'GRAVITY_BEAMS':
        this.vx = 0;
        this.bodyBob = Math.sin(this.animTime * 35) * 2;
        this.recoilX -= this.facing * 14 * dt;
        game.triggerScreenShake(7, 0.1);

        if (this.gravityBeamDamageCooldown <= 0) {
          this.gravityBeamDamageCooldown = 0.1;
          this.checkGravityBeamCollisions(game);
        }

        if (Math.random() < 0.7) {
          const hitX = this.x + (this.facing === 1 ? this.width + Math.random() * 950 : -Math.random() * 950);
          game.spawnSpark(hitX, this.y + 60 + (Math.random() - 0.5) * 30);
        }

        if (this.stateTimer <= 0) {
          this.state = 'BATTLE_STANCE';
          this.stateTimer = 0.6;
          this.attackCooldown = this.phase === 3 ? 1.2 : 2.0;
        }
        break;

      case 'GROUND_SWEEP_BEAMS':
        this.vx = 0;
        const sweepProgress = 1 - Math.max(0, this.stateTimer / this.maxSweepTime);
        if (sweepProgress < 0.33) this.sweepStage = 1;
        else if (sweepProgress < 0.66) this.sweepStage = 2;
        else this.sweepStage = 3;

        game.triggerScreenShake(6, 0.1);
        const sweepImpactX = this.x + (this.facing === 1 ? 70 : -70) + (this.facing || -1) * (150 + sweepProgress * 700);
        const sweepImpactY = this.groundY + this.height - 15;

        if (Math.random() < 0.6) {
          game.spawnExplosion(sweepImpactX + (Math.random() - 0.5) * 40, sweepImpactY, 30);
          this.damagePlayersNear(sweepImpactX, sweepImpactY, 75, this.phase === 3 ? 38 : 30, game);
        }

        if (this.stateTimer <= 0) {
          this.state = 'BATTLE_STANCE';
          this.stateTimer = 0.5;
          this.attackCooldown = 1.8;
        }
        break;

      case 'GOLDEN_TORNADO': {
        const tornadoDir = this.tornadoDir || this.facing;
        this.facing = tornadoDir;
        this.vx = tornadoDir * 7.5;
        this.bodyBob = Math.sin(this.animTime * 25) * 6;
        game.triggerScreenShake(8, 0.15);


        if (this.tornadoDamageTimer <= 0) {
          this.tornadoDamageTimer = 0.12;
          this.damagePlayersNear(this.x + this.width / 2, this.y + this.height / 2, 130, this.phase === 3 ? 42 : 32, game);
          game.spawnDust(this.x + this.width / 2, this.groundY + this.height - 10);
        }


        if (Math.random() < 0.15) {
          const cycAngle = (Math.random() - 0.5) * 1.2;
          const cycSpeed = 8.0;
          game.projectiles.push(new Projectile(
            this.x + this.width / 2, this.y + this.height / 2,
            Math.cos(cycAngle) * cycSpeed * tornadoDir, Math.sin(cycAngle) * cycSpeed,
            'laser', this.phase === 3 ? 35 : 28, false, 5, 2.5
          ));
        }

        if (this.stateTimer <= 0 || (tornadoDir === -1 && this.x <= this.minArenaX) || (tornadoDir === 1 && this.x >= this.maxArenaX)) {
          this.vx = 0;
          this.state = 'BATTLE_STANCE';
          this.stateTimer = 0.6;
          this.attackCooldown = 1.5;
        }
        break;
      }

      case 'ENERGY_BURST': {
        this.vx = 0;
        const burstProgress = 1 - Math.max(0, this.stateTimer / this.maxBurstTime);
        const curRadius = burstProgress * 380;
        this.damagePlayersNear(this.x + this.width / 2, this.y + this.height / 2, curRadius, this.phase === 3 ? 55 : 45, game);

        if (this.stateTimer <= 0) {
          this.state = 'BATTLE_STANCE';
          this.stateTimer = 0.7;
          this.attackCooldown = 2.0;
        }
        break;
      }

      case 'ASCEND':
        this.vx = 0;
        this.isFlying = true;
        this.y -= 140 * dt;
        this.bodyBob = Math.sin(this.animTime * 12) * 3;
        game.triggerScreenShake(5, 0.1);
        if (this.y <= this.groundY - 220 || this.stateTimer <= 0) {
          this.y = this.groundY - 220;
          this.state = 'AERIAL_HOVER';
          this.stateTimer = 3.5;
        }
        break;

      case 'AERIAL_HOVER':
        this.isFlying = true;
        this.vx = (targetP.x > this.x ? 1 : -1) * 2.2;
        this.y = this.groundY - 220 + Math.sin(this.animTime * 4) * 25;
        this.facing = targetP.x > this.x ? 1 : -1;


        if (Math.random() < (this.phase === 3 ? 0.28 : 0.18)) {
          this.isBombarding = true;
          const sx = this.x + this.width / 2 + (Math.random() - 0.5) * 80;
          const sy = this.y + this.height * 0.7;
          const angle = Math.atan2(targetP.y - sy, targetP.x - sx);
          game.projectiles.push(new Projectile(
            sx, sy, Math.cos(angle) * 7.5, Math.sin(angle) * 7.5,
            'rocket', this.phase === 3 ? 45 : 35, false, 6, 3.0, true
          ));
          audio.playShootRocket();
        } else {
          this.isBombarding = false;
        }

        if (this.stateTimer <= 0) {

          if (Math.random() < 0.6) {
            this.executeAerialSwoop(game);
          } else {
            this.landGround(game);
          }
        }
        break;

      case 'AERIAL_SWOOP': {
        const swoopDir = this.swoopDir || this.facing;
        this.facing = swoopDir;
        this.vx = swoopDir * (this.phase === 3 ? 12.0 : 10.0);

        const swoopProgress = 1 - Math.max(0, this.stateTimer / (this.maxSwoopTime || 1.3));
        this.y = (this.groundY - 220) + Math.sin(swoopProgress * Math.PI) * 190;

        game.triggerScreenShake(9, 0.12);
        this.damagePlayersNear(this.x + this.width / 2, this.y + this.height * 0.7, 140, this.phase === 3 ? 60 : 48, game);

        if (this.stateTimer <= 0 || (swoopDir === -1 && this.x <= this.minArenaX) || (swoopDir === 1 && this.x >= this.maxArenaX)) {
          this.landGround(game);
        }
        break;
      }

      case 'HURT_STAGGER':
        this.vx = 0;
        if (this.stateTimer <= 0) {
          this.state = 'BATTLE_STANCE';
          this.stateTimer = 0.4;
          this.attackCooldown = 0.8;
        }
        break;

      case 'DYING':
        this.vx = 0;
        this.vy = 0;
        this.y = this.groundY;
        this.isFlying = false;
        break;
    }


    this.x += this.vx;
    this.x = Math.max(this.minArenaX, Math.min(this.maxArenaX, this.x));
  }

  landGround(game) {
    this.isFlying = false;
    this.y = this.groundY;
    this.vx = 0;
    this.state = 'BATTLE_STANCE';
    this.stateTimer = 0.6;
    this.attackCooldown = 1.0;
    game.triggerScreenShake(12, 0.3);
    audio.playExplosion(true);
    game.spawnDust(this.x + this.width / 2, this.groundY + this.height - 10);
  }

  executeGravityBeams(game) {
    this.state = 'GRAVITY_BEAMS';
    this.stateTimer = this.phase === 3 ? 1.6 : 1.3;
    audio.playGravityBeams();
    game.triggerScreenShake(8, 0.3);
    game.addFloatingText(this.x + this.width / 2, this.y - 35, '⚡ GRAVITY BEAMS! ⚡', '#ffd700', 16);
  }

  executeGroundSweep(game) {
    this.state = 'GROUND_SWEEP_BEAMS';
    this.maxSweepTime = 1.6;
    this.stateTimer = 1.6;
    audio.playGravityBeams();
    game.addFloatingText(this.x + this.width / 2, this.y - 35, '🔥 VARREDURA TRÍPLICE! 🔥', '#ffaa00', 15);
  }

  executeGoldenTornado(game) {
    this.state = 'GOLDEN_TORNADO';
    this.stateTimer = 1.4;
    this.tornadoDir = this.targetFacing;
    this.facing = this.tornadoDir;
    this.tornadoDamageTimer = 0;
    audio.playGhidorahTornado();
    game.triggerScreenShake(10, 0.35);
    game.addFloatingText(this.x + this.width / 2, this.y - 35, '🌪️ GOLDEN HURRICANE! 🌪️', '#ffd700', 16);
  }

  executeEnergyBurst(game) {
    this.state = 'ENERGY_BURST';
    this.maxBurstTime = 1.1;
    this.stateTimer = 1.1;
    audio.playGhidorahBurst();
    game.triggerScreenShake(16, 0.5);
    game.cinematicFlash = 0.45;
    game.cinematicFlashColor = '#ffd700';
    game.addFloatingText(this.x + this.width / 2, this.y - 45, '💥 GOLDEN SUPERNOVA! 💥', '#ffea00', 17);
  }

  executeAscend(game) {
    this.state = 'ASCEND';
    this.stateTimer = 1.0;
    this.isFlying = true;
    audio.playGhidorahAscend();
    game.triggerScreenShake(9, 0.3);
    game.addFloatingText(this.x + this.width / 2, this.y - 35, '🚀 DECOLAGEM TITÂNICA! 🚀', '#ffe066', 15);
  }

  executeAerialSwoop(game) {
    this.state = 'AERIAL_SWOOP';
    this.maxSwoopTime = 1.3;
    this.stateTimer = 1.3;
    this.swoopDir = this.targetFacing;
    this.facing = this.swoopDir;
    audio.playGhidorahRoar();
    game.triggerScreenShake(12, 0.35);
    game.addFloatingText(this.x + this.width / 2, this.y - 35, '⚡ RASANTE DOURADO! ⚡', '#ffd700', 16);
  }

  decideNextAction(distToPlayer, game) {
    const choices = [];

    if (distToPlayer > 480) {
      choices.push('WALK', 'WALK', 'GRAVITY_BEAMS', 'ASCEND');
      if (this.phase >= 2) choices.push('GOLDEN_TORNADO', 'GROUND_SWEEP');
    } else if (distToPlayer > this.chaseDistance) {
      choices.push('WALK', 'GRAVITY_BEAMS', 'GROUND_SWEEP', 'ROAR');
      if (this.phase >= 2) choices.push('GOLDEN_TORNADO', 'ASCEND');
      if (this.phase === 3) choices.push('ENERGY_BURST');
    } else {

      choices.push('ENERGY_BURST', 'ROAR', 'GROUND_SWEEP', 'GRAVITY_BEAMS');
      if (this.phase >= 2) choices.push('GOLDEN_TORNADO', 'ENERGY_BURST');
    }

    let nextAction = choices[Math.floor(Math.random() * choices.length)];
    if (nextAction === this.lastAttack && choices.length > 1) {
      const alt = choices.filter(c => c !== this.lastAttack);
      nextAction = alt[Math.floor(Math.random() * alt.length)];
    }
    this.lastAttack = nextAction;

    if (nextAction === 'WALK') {
      this.state = 'WALK';
      this.stateTimer = 2.0 + Math.random() * 1.0;
      this.stepTimer = 0;
    } else if (nextAction === 'GRAVITY_BEAMS') {
      this.executeGravityBeams(game);
    } else if (nextAction === 'GROUND_SWEEP') {
      this.executeGroundSweep(game);
    } else if (nextAction === 'GOLDEN_TORNADO') {
      this.executeGoldenTornado(game);
    } else if (nextAction === 'ENERGY_BURST') {
      this.executeEnergyBurst(game);
    } else if (nextAction === 'ASCEND') {
      this.executeAscend(game);
    } else if (nextAction === 'ROAR') {
      this.state = 'ROAR';
      this.stateTimer = 1.3;
      audio.playGhidorahRoar();
      game.triggerScreenShake(12, 0.4);
      game.addFloatingText(this.x + this.width / 2, this.y - 35, '👑 RUGIDO DEVASTADOR! 👑', '#ffd700', 16);
    }
  }

  checkGravityBeamCollisions(game) {
    const mouthX = this.x + (this.facing === 1 ? this.width + 10 : -10);
    const mouthY = this.y + 60;
    const beamLength = 1100;
    const beamHeight = 65;

    const bMinX = this.facing === 1 ? mouthX : mouthX - beamLength;
    const bMaxX = this.facing === 1 ? mouthX + beamLength : mouthX;
    const bMinY = mouthY - beamHeight / 2;
    const bMaxY = mouthY + beamHeight / 2;

    game.players.forEach(p => {
      if (p.isDead || p.isInvulnerable) return;
      if (p.x + p.width > bMinX && p.x < bMaxX && p.y + p.height > bMinY && p.y < bMaxY) {
        p.takeDamage(this.phase === 3 ? 36 : 30, game);
        game.spawnBlood(p.x + p.width / 2, p.y + p.height / 2);
      }
    });

    game.slugs.forEach(s => {
      if (s.destroyed) return;
      if (s.x + s.width > bMinX && s.x < bMaxX && s.y + s.height > bMinY && s.y < bMaxY) {
        s.takeDamage(22, game);
        game.spawnSpark(s.x + s.width / 2, s.y + s.height / 2);
      }
    });
  }

  damagePlayersNear(x, y, radius, damage, game) {
    const titanDamage = Math.round(damage * (this.phase === 3 ? 1.22 : 1.12));
    game.players.forEach(player => {
      if (player.isDead || player.isInvulnerable) return;
      const target = player.inSlug && player.slugRef ? player.slugRef : player;
      const cx = target.x + target.width / 2;
      const cy = target.y + target.height / 2;
      if (Math.hypot(cx - x, cy - y) <= radius) {
        player.takeDamage(titanDamage, game);
        game.spawnDust(cx, target.y + target.height);
      }
    });
  }

  enterPhase(phase, game) {
    this.phase = phase;
    this.speed = phase === 3 ? 4.4 : 3.6;
    this.attackCooldown = 0.6;
    game.triggerScreenShake(phase === 3 ? 16 : 10, 0.4);
    audio.playGhidorahRoar();
    const label = phase === 3 ? '⚡ APOCALIPSE ANCESTRAL! ⚡' : '🌩️ SOBRECARGA GRAVITACIONAL! 🌩️';
    game.addFloatingText(this.x + this.width / 2, this.y - 45, label, phase === 3 ? '#ffcc00' : '#ffd700', 17);
  }

  takeDamage(amount, arg2, arg3) {
    if (this.isDead) return;
    const game = (arg2 && typeof arg2 === 'object' && arg2.spawnSpark) ? arg2 : (arg3 && typeof arg3 === 'object' && arg3.spawnSpark ? arg3 : (window.game || window.gameEngine || null));
    const effectiveDamage = amount >= 300 ? Math.round(amount * 0.42) : Math.round(amount * 0.82);
    this.hp -= effectiveDamage;
    this.flashTimer = 0.08;
    this.recoilX += (this.facing === -1 ? 2.5 : -2.5);

    if (game && game.spawnSpark) {
      game.spawnSpark(this.x + Math.random() * this.width, this.y + Math.random() * this.height);
    }

    if (this.hp <= 0) {
      this.die(game);
    }
  }

  die(game) {
    if (this.isDead && this.state === 'DYING') return;
    this.isDead = true;
    this.state = 'DYING';
    this.hp = 0;
    this.isFlying = false;
    this.y = this.groundY;

    const g = game || window.game || window.gameEngine;
    const finaleRunId = g ? g.runId : null;
    if (g && g.players) {
      g.players.forEach(p => { p.score += 100000; });
    }
    if (g && g.addFloatingText) {
      g.addFloatingText(this.x + this.width / 2, this.y - 35, '👑 KING GHIDORAH DERROTADO! +100000 👑', '#ffd700', 20);
    }
    audio.playGhidorahRoar();


    for (let i = 0; i < 14; i++) {
      setTimeout(() => {
        if (g && g.runId === finaleRunId && g.spawnExplosion) {
          const ex = this.x + Math.random() * this.width;
          const ey = this.y + Math.random() * this.height;
          g.spawnExplosion(ex, ey, 75 + Math.random() * 50);
          audio.playExplosion(true);
          if (g.triggerScreenShake) g.triggerScreenShake(14, 0.35);
        }
      }, i * 110);
    }


    if (g && g.completeGhidorahBattle) {
      g.completeGhidorahBattle(this);
    }
  }
}




class KingKongBoss {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.groundY = y;
    this.width = 280;
    this.height = 360;
    this.spriteScale = 3.0;

    this.hp = 32000;
    this.maxHp = 32000;
    this.flashTimer = 0;
    this.phase = 1;
    this.isDead = false;
    this.isKingKong = true;
    this.type = 'KINGKONG';
    this.phaseLabels = ['FÚRIA URBANA', 'DESTRUIÇÃO TOTAL', 'APOCALIPSE PRIMORDIAL'];
    this.lastAttack = null;


    this.state = 'INTRO_ROAR';
    this.stateTimer = 2.5;
    this.attackCooldown = 0.7;
    this.animTimer = 0;
    this.frameBlend = 0;

    this.vx = 0;
    this.vy = 0;
    this.facing = -1;
    this.targetFacing = -1;
    this.turnTimer = 0;
    this.speed = 3.2;
    this.runSpeed = 6.4;
    this.chaseDistance = 210;
    this.stepTimer = 0;
    this.stepCount = 0;
    this.comboCount = 0;
    this.maxCombo = 3;

    this.isBerserker = false;
    this.boulderCooldown = 0;
    this.carThrowCooldown = 0;

    this.animTime = 0;
    this.bodyBob = 0;
    this.impactTilt = 0;
    this.recoilX = 0;
    this.eyeGlow = 0;
    this.cinematicScale = 1;
    this.cinematicOpacity = 1;
    this.cinematicTilt = 0;

    this.minArenaX = 5200;
    this.maxArenaX = 7150;
  }

  update(dt, player, game) {
    this.animTime += dt;
    this.animTimer = this.animTime;
    if (this.flashTimer > 0) this.flashTimer -= dt;
    if (this.stateTimer > 0) this.stateTimer -= dt;
    if (this.attackCooldown > 0) this.attackCooldown -= dt;
    if (this.boulderCooldown > 0) this.boulderCooldown -= dt;
    if (this.carThrowCooldown > 0) this.carThrowCooldown -= dt;

    this.impactTilt += (0 - this.impactTilt) * 7 * dt;
    this.recoilX += (0 - this.recoilX) * 6 * dt;
    

    this.bodyBob = Math.sin(this.animTime * 2.5) * 3 + Math.cos(this.animTime * 1.8) * 2;

    if (this.isDead || this.state === 'DYING') {
      this.vx = 0;
      this.vy = 0;
      return;
    }


    const hpRatio = this.hp / this.maxHp;
    const nextPhase = hpRatio < 0.30 ? 3 : (hpRatio < 0.65 ? 2 : 1);
    if (nextPhase > this.phase) {
      this.enterPhase(nextPhase, game);
    }

    const targetP = game.getClosestPlayer(this.x + this.width / 2, this.y + this.height / 2);
    const distToTarget = (targetP.x + targetP.width / 2) - (this.x + this.width / 2);
    const absDist = Math.abs(distToTarget);

    if (this.state !== 'THROW_BOULDER' && this.state !== 'THROW_CAR') {
      this.targetFacing = distToTarget >= 0 ? 1 : -1;
    }


    switch (this.state) {
      case 'INTRO_ROAR':
        this.bodyBob = Math.sin(this.animTime * 12) * 6;
        if (this.stateTimer <= 0) {
          audio.playKongRoar();
          game.triggerScreenShake(22, 0.8);
          game.cinematicFlash = 0.5;
          game.cinematicFlashColor = '#ff3300';
          game.addFloatingText(this.x + this.width / 2, this.y - 40, '🦍 KING KONG - O REI DE MANHATTAN! 🦍', '#ff4400', 18);
          this.transition('IDLE');
        }
        break;

      case 'IDLE':
        this.vx = 0;
        this.bodyBob = Math.sin(this.animTime * 6) * 3;
        
        if (this.attackCooldown <= 0) {
          if (absDist < 190) {

            const rand = Math.random();
            if (rand < 0.45) {
              this.transition('PUNCH_COMBO');
            } else if (rand < 0.8) {
              this.transition('GROUND_SLAM');
            } else {
              this.transition('CHEST_POUND');
            }
          } else if (absDist < 420) {

            const rand = Math.random();
            if (rand < 0.4) {
              this.transition(this.isBerserker ? 'RUN' : 'WALK');
            } else if (rand < 0.7) {
              this.transition('ROAR_TAUNT');
            } else {
              this.transition('GROUND_SLAM');
            }
          } else {

            const rand = Math.random();
            if (this.boulderCooldown <= 0 && rand < 0.5) {
              this.transition('THROW_BOULDER');
            } else if (this.carThrowCooldown <= 0 && rand < 0.8) {
              this.transition('THROW_CAR');
            } else {
              this.transition(this.isBerserker ? 'RUN' : 'WALK');
            }
          }
        }
        break;

      case 'WALK':
        this.stepTimer += dt;
        const walkSpeed = this.speed * (this.isBerserker ? 1.5 : 1);
        this.vx = this.targetFacing * walkSpeed;
        this.bodyBob = Math.sin(this.animTime * 7) * 5;
        
        if (this.stepTimer >= 0.38) {
          this.stepTimer = 0;
          this.stepCount++;
          game.triggerScreenShake(5, 0.2);
          audio.playMechaStep();
          game.spawnDust(this.x + (this.facing === 1 ? 40 : this.width - 40), this.y + this.height - 5);
        }

        if (absDist < 170 || this.stateTimer <= 0) {
          this.transition('IDLE');
        }
        break;

      case 'RUN':
        this.stepTimer += dt;
        this.vx = this.targetFacing * this.runSpeed * 1.15;
        this.bodyBob = Math.sin(this.animTime * 16) * 9;
        
        if (this.stepTimer >= 0.18) {
          this.stepTimer = 0;
          game.triggerScreenShake(8, 0.25);
          audio.playMechaStep();
          game.spawnDust(this.x + this.width / 2, this.y + this.height - 5);
          game.spawnSpark(this.x + (this.facing === 1 ? this.width : 0), this.y + this.height - 15);
        }


        if (absDist < 120) {
          this.damageNearbyPlayers(this.x + this.width / 2, this.y + this.height * 0.6, 120, this.phase === 3 ? 50 : 40, game);
          game.triggerScreenShake(12, 0.3);
          this.transition('PUNCH_COMBO');
        } else if (this.stateTimer <= 0) {
          this.transition('IDLE');
        }
        break;

      case 'ROAR_TAUNT':
        this.vx = 0;
        this.bodyBob = Math.sin(this.animTime * 18) * 10;
        
        if (this.stateTimer <= 0) {
          audio.playKongRoar();
          game.triggerScreenShake(16, 0.6);
          game.cinematicFlash = 0.4;
          game.cinematicFlashColor = '#ff4400';
          game.addFloatingText(this.x + this.width / 2, this.y - 30, '🦍 ROAR OF THE PRIMAL KING! 🦍', '#ff3300', 16);
          this.attackCooldown = 0.5;
          this.transition('IDLE');
        }
        break;

      case 'CHEST_POUND':
        this.vx = 0;
        this.bodyBob = Math.sin(this.animTime * 28) * 6;
        
        if (this.stateTimer <= 0) {
          audio.playKongChestPound();
          audio.playKongSlam();
          game.triggerScreenShake(20, 0.6);
          game.cinematicFlash = 0.4;
          game.cinematicFlashColor = '#ffaa00';
          this.damageNearbyPlayers(this.x + this.width / 2, this.y + this.height, 300, this.phase === 3 ? 55 : 42, game);
          

          for (let i = 0; i < 14; i++) {
            const angle = (Math.PI * 2 * i) / 14;
            const dist = 130;
            game.spawnExplosion(
              this.x + this.width / 2 + Math.cos(angle) * dist,
              this.y + this.height - 20 + Math.sin(angle) * dist * 0.3,
              35
            );
          }
          
          this.attackCooldown = 1.4;
          this.transition('IDLE');
        }
        break;

      case 'PUNCH_COMBO':
        this.vx = this.targetFacing * 1.5;
        
        const comboTime = 1.8 - this.stateTimer;
        if (comboTime > 0.35 * this.comboCount && this.comboCount < this.maxCombo) {
          this.comboCount++;
          const punchX = this.x + (this.facing === 1 ? this.width + 10 : -10);
          const punchY = this.y + this.height * 0.45;
          
          game.triggerScreenShake(10, 0.3);
          audio.playKongPunch();
          

          this.damageNearbyPlayers(punchX, punchY, 110, this.phase === 3 ? 42 : 32, game);
          
          for (let i = 0; i < 6; i++) {
            game.spawnSpark(punchX + this.facing * (20 + i * 12), punchY + (Math.random() - 0.5) * 35);
          }
        }
        
        if (this.stateTimer <= 0) {
          this.comboCount = 0;
          this.attackCooldown = 1.0;
          this.transition('IDLE');
        }
        break;

      case 'GROUND_SLAM':
        if (this.stateTimer > 0.7) {
          this.bodyBob = -18 + (1.4 - this.stateTimer) * 28;
        } else if (this.stateTimer > 0) {
          this.bodyBob = 0;
        } else {

          audio.playKongSlam();
          game.triggerScreenShake(26, 0.7);
          game.cinematicFlash = 0.45;
          game.cinematicFlashColor = '#ff6600';
          this.damageNearbyPlayers(this.x + this.width / 2, this.y + this.height, 380, this.phase === 3 ? 60 : 48, game);
          

          for (let i = 0; i < 22; i++) {
            const spreadDist = (i - 11) * 32;
            const shockX = this.x + this.width / 2 + spreadDist;
            const shockY = this.y + this.height - 10;
            game.spawnExplosion(shockX, shockY, 40 + Math.random() * 25);
            game.spawnDust(shockX, shockY);
          }
          
          this.attackCooldown = 1.8;
          this.transition('IDLE');
        }
        break;

      case 'THROW_BOULDER':
        this.vx = 0;
        
        if (this.stateTimer <= 0.45 && this.stateTimer > 0.35) {
          const throwX = this.x + (this.facing === 1 ? this.width + 25 : -25);
          const throwY = this.y + this.height * 0.35;
          const throwAngle = -0.55;
          const throwSpeed = Math.min(18, 13 + absDist / 55);
          
          game.projectiles.push({
            x: throwX,
            y: throwY,
            vx: Math.cos(throwAngle) * throwSpeed * this.facing,
            vy: Math.sin(throwAngle) * throwSpeed,
            width: 38,
            height: 38,
            damage: this.phase === 3 ? 55 : 45,
            type: 'boulder',
            isPlayer: false,
            life: 4.0,
            gravity: 0.55,
            update: function(dt, g) {
              this.vy += this.gravity * dt * 60;
              this.x += this.vx * dt * 60;
              this.y += this.vy * dt * 60;
              this.life -= dt;
              
              if (this.y >= g.canvas.height - 90) {
                g.spawnExplosion(this.x, this.y, 65);
                audio.playExplosion(true);
                g.triggerScreenShake(10, 0.3);
                return false;
              }
              return this.life > 0;
            }
          });
          
          audio.playKongThrow();
          this.boulderCooldown = 3.5;
        }
        
        if (this.stateTimer <= 0) {
          this.attackCooldown = 1.0;
          this.transition('IDLE');
        }
        break;

      case 'THROW_CAR':
        this.vx = 0;
        
        if (this.stateTimer <= 0.55 && this.stateTimer > 0.45) {
          const throwX = this.x + (this.facing === 1 ? this.width + 30 : -30);
          const throwY = this.y + this.height * 0.4;
          const throwAngle = -0.45 - Math.random() * 0.25;
          const throwSpeed = 16;
          
          game.projectiles.push({
            x: throwX,
            y: throwY,
            vx: Math.cos(throwAngle) * throwSpeed * this.facing,
            vy: Math.sin(throwAngle) * throwSpeed,
            width: 54,
            height: 30,
            damage: this.phase === 3 ? 65 : 52,
            type: 'car',
            isPlayer: false,
            life: 5.0,
            rotation: 0,
            rotationSpeed: (Math.random() - 0.5) * 9,
            gravity: 0.5,
            update: function(dt, g) {
              this.vy += this.gravity * dt * 60;
              this.x += this.vx * dt * 60;
              this.y += this.vy * dt * 60;
              this.rotation += this.rotationSpeed * dt;
              this.life -= dt;
              
              if (this.y >= g.canvas.height - 90) {
                g.spawnExplosion(this.x, this.y, 60);
                audio.playExplosion(true);
                g.triggerScreenShake(11, 0.35);
                return false;
              }
              return this.life > 0;
            }
          });
          
          audio.playKongThrow();
          this.carThrowCooldown = 4.5;
        }
        
        if (this.stateTimer <= 0) {
          this.attackCooldown = 1.0;
          this.transition('IDLE');
        }
        break;

      case 'HURT':
        this.vx = this.facing * -2;
        if (this.stateTimer <= 0) {
          this.transition('IDLE');
        }
        break;
    }


    if (this.facing !== this.targetFacing) {
      this.turnTimer += dt;
      if (this.turnTimer >= 0.25) {
        this.facing = this.targetFacing;
        this.turnTimer = 0;
      }
    }


    this.x += this.vx * dt * 60;
    this.x = Math.max(this.minArenaX, Math.min(this.maxArenaX - this.width, this.x));
    this.y = this.groundY;
  }

  transition(newState) {
    this.state = newState;
    this.stateTimer = this.getStateDuration(newState);
  }

  getStateDuration(state) {
    switch (state) {
      case 'INTRO_ROAR': return 2.5;
      case 'WALK': return 2.4;
      case 'RUN': return 1.9;
      case 'ROAR_TAUNT': return 1.7;
      case 'CHEST_POUND': return 1.6;
      case 'PUNCH_COMBO': return 1.7;
      case 'GROUND_SLAM': return 1.4;
      case 'THROW_BOULDER': return 1.1;
      case 'THROW_CAR': return 1.0;
      case 'HURT': return 0.35;
      default: return 1.0;
    }
  }

  damageNearbyPlayers(x, y, radius, damage, game) {
    const titanDamage = Math.round(damage * (this.phase === 3 ? 1.28 : 1.15));
    game.players.forEach(player => {
      if (player.isDead || player.isInvulnerable) return;
      const target = player.inSlug && player.slugRef ? player.slugRef : player;
      const cx = target.x + target.width / 2;
      const cy = target.y + target.height / 2;
      if (Math.hypot(cx - x, cy - y) <= radius) {
        player.takeDamage(titanDamage, game);
        game.spawnDust(cx, target.y + target.height);
      }
    });
  }

  enterPhase(phase, game) {
    this.phase = phase;
    this.speed = phase === 3 ? 4.5 : 3.6;
    this.runSpeed = phase === 3 ? 7.8 : 6.6;
    this.isBerserker = phase === 3;
    this.attackCooldown = 0.4;
    game.triggerScreenShake(phase === 3 ? 24 : 14, 0.6);
    audio.playKongRoar();
    const label = phase === 3 ? '🦍 APOCALIPSE PRIMORDIAL! 🦍' : '💥 KONG ENFURECIDO! 💥';
    game.addFloatingText(this.x + this.width / 2, this.y - 50, label, phase === 3 ? '#ff0000' : '#ff5500', 19);
  }

  takeDamage(amount, arg2, arg3) {
    if (this.isDead) return;
    const game = (arg2 && typeof arg2 === 'object' && arg2.spawnSpark) ? arg2 : (arg3 && typeof arg3 === 'object' && arg3.spawnSpark ? arg3 : (window.game || window.gameEngine || null));
    const effectiveDamage = amount >= 300 ? Math.round(amount * 0.4) : Math.round(amount * 0.8);
    this.hp -= effectiveDamage;
    this.flashTimer = 0.08;
    this.recoilX += (this.facing === -1 ? 3 : -3);

    if (game && game.spawnSpark) {
      game.spawnSpark(this.x + Math.random() * this.width, this.y + Math.random() * this.height);
    }

    if (amount > 50 && Math.random() < 0.25) {
      audio.playKongPunch();
      if (this.state === 'IDLE' || this.state === 'WALK') {
        this.transition('HURT');
      }
    }

    if (this.hp <= 0) {
      this.die(game);
    }
  }

  die(game) {
    if (this.isDead && this.state === 'DYING') return;
    this.isDead = true;
    this.state = 'DYING';
    this.hp = 0;

    const g = game || window.game || window.gameEngine;
    const finaleRunId = g ? g.runId : null;
    if (g && g.players) {
      g.players.forEach(p => { p.score += 150000; });
    }
    if (g && g.addFloatingText) {
      g.addFloatingText(this.x + this.width / 2, this.y - 45, '👑 KING KONG DERROTADO! +150000 👑', '#ffaa00', 22);
    }
    audio.playKongRoar();


    for (let i = 0; i < 20; i++) {
      setTimeout(() => {
        if (g && g.runId === finaleRunId && g.spawnExplosion) {
          const ex = this.x + Math.random() * this.width;
          const ey = this.y + Math.random() * this.height;
          g.spawnExplosion(ex, ey, 85 + Math.random() * 65);
          audio.playExplosion(true);
          if (g.triggerScreenShake) g.triggerScreenShake(16, 0.4);
        }
      }, i * 110);
    }


    if (g && g.completeKongBattle) {
      g.completeKongBattle(this);
    }
  }
}




class SlugVehicle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 72;
    this.height = 48;
    this.vx = 0;
    this.vy = 0;
    this.speed = 4.8;
    this.jumpForce = -9.5;
    this.gravity = 0.48;
    this.onGround = false;
    this.facing = 1;
    this.isOccupied = false;
    this.hp = 300;
    this.maxHp = 300;
    this.cannons = 10;
    this.cannonAngle = 0;
    this.shootCooldown = 0;
  }

  update(dt, input, game) {
    if (this.shootCooldown > 0) this.shootCooldown -= dt;

    if (this.isOccupied) {
      const isP2 = this.driverPlayerIndex === 1;
      const moveLeft = isP2 ? input.isDown('p2_left') : input.isDown('left');
      const moveRight = isP2 ? input.isDown('p2_right') : input.isDown('right');
      const lookUp = isP2 ? input.isDown('p2_up') : input.isDown('up');
      const lookDown = isP2 ? input.isDown('p2_down') : input.isDown('down');
      const jumpPressed = isP2 ? input.isPressed('p2_jump') : input.isPressed('jump');
      const shootDown = isP2 ? input.isDown('p2_shoot') : input.isDown('shoot');
      const bombPressed = isP2 ? input.isPressed('p2_bomb') : input.isPressed('bomb');
      const enterPressed = isP2 ? input.isPressed('p2_enter') : input.isPressed('enter');


      if (moveLeft && !moveRight) {
        this.vx = -this.speed;
        this.facing = -1;
      } else if (moveRight && !moveLeft) {
        this.vx = this.speed;
        this.facing = 1;
      } else {
        this.vx = 0;
      }


      if (jumpPressed && this.onGround) {
        this.vy = this.jumpForce;
        this.onGround = false;
        audio.playJump();
        game.spawnDust(this.x + this.width / 2, this.y + this.height);
      }


      this.cannonAngle = lookUp ? -0.4 : (lookDown ? 0.3 : 0);


      if (shootDown && this.shootCooldown <= 0) {
        this.shootCooldown = 0.07;
        audio.playShootHMG();
        const sx = this.x + (this.facing === 1 ? this.width + 8 : -8);
        const sy = this.y + 16;
        game.projectiles.push(new Projectile(sx, sy, this.facing * 18, (Math.random() - 0.5) * 1.5, 'bullet', 26, true, 5));
        game.spawnCasing(this.x + this.width / 2, this.y + 10, -this.facing);
        game.triggerScreenShake(2, 0.05);
      }


      if (bombPressed && this.cannons > 0) {
        this.cannons--;
        audio.playSlugCannon();
        const sx = this.x + (this.facing === 1 ? this.width + 12 : -12);
        const sy = this.y + 12;
        game.projectiles.push(new Projectile(sx, sy, this.facing * 15, -1, 'slug_cannon', 220, true, 12, 1.5));
        game.triggerScreenShake(7, 0.2);
        game.addFloatingText(this.x + 20, this.y - 15, 'CANNON!', '#ff7700');
      }


      if (enterPressed) {
        game.player.tryEnterSlug(game);
      }
    } else {
      this.vx = 0;
    }


    this.vy += this.gravity;
    if (this.vy > 14) this.vy = 14;

    this.x += this.vx;
    game.resolveHorizontalCollision(this);

    this.y += this.vy;
    this.onGround = false;
    game.resolveVerticalCollision(this);
  }

  takeDamage(amount, game) {
    this.hp -= amount;
    game.triggerScreenShake(5, 0.15);
    game.spawnSpark(this.x + Math.random() * this.width, this.y + Math.random() * this.height);

    if (this.hp <= 0) {

      game.spawnExplosion(this.x + this.width / 2, this.y + this.height / 2, 50);
      audio.playExplosion(true);
      if (this.isOccupied) {
        game.player.inSlug = false;
        game.player.slugRef = null;
        game.player.isInvulnerable = true;
        game.player.invulnerableTimer = 1.5;
        game.player.y = this.y - 40;
        game.player.vy = -8;
      }
      this.hp = 0;
      this.destroyed = true;
    }
  }
}




class POW {
  constructor(x, y, rewardType = 'HMG') {
    this.x = x;
    this.y = y;
    this.width = 26;
    this.height = 42;
    this.rescued = false;
    this.saluteTimer = 0;
    this.rewardType = rewardType;
    this.facing = 1;
    this.vy = 0;
    this.onGround = false;
  }

  update(dt, player, game) {
    if (!this.rescued) {

      const dist = Math.hypot((player.x + player.width / 2) - (this.x + this.width / 2), (player.y + player.height / 2) - (this.y + this.height / 2));
      if (dist < 40) {
        this.free(game);
      }
    } else {
      if (this.saluteTimer > 0) {
        this.saluteTimer -= dt;
        if (this.saluteTimer <= 0) {

          game.pickups.push(new Pickup(this.x + 10, this.y + 10, this.rewardType));
        }
      } else {

        this.x -= 3.5;
      }
    }


    this.vy += 0.48;
    this.y += this.vy;
    game.resolveVerticalCollision(this);
  }

  free(game) {
    if (this.rescued) return;
    this.rescued = true;
    this.saluteTimer = 1.4;
    audio.announce("THANK YOU");
    audio.playItemPickup();
    game.player.score += 1000;
    game.addFloatingText(this.x, this.y - 15, '+1000 RESCUED!', '#ffee00', 12);
  }
}




class Projectile {
  constructor(x, y, vx, vy, type = 'bullet', damage = 20, isPlayer = true, radius = 4, life = 2.0, isHoming = false, hasGravity = false) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.type = type;
    this.damage = damage;
    this.isPlayer = isPlayer;
    this.radius = radius;
    this.life = life;
    this.isHoming = isHoming;
    this.hasGravity = hasGravity;
    this.rotation = 0;
  }

  update(dt, game) {
    this.life -= dt;
    if (this.life <= 0) return false;


    if (this.hasGravity) {
      this.vy += 0.45;
      this.rotation += 0.2;
      this.x += this.vx;
      this.y += this.vy;


      game.map.platforms.forEach(plat => {
        if (this.x > plat.x && this.x < plat.x + plat.width && this.y > plat.y && this.y < plat.y + plat.height) {
          this.y = plat.y - 2;
          this.vy = -this.vy * 0.45;
          this.vx *= 0.7;
          audio.playJump();
        }
      });

      return true;
    }


    if (this.isHoming) {
      const target = this.isPlayer ? game.getClosestEnemy(this.x, this.y) : game.getClosestPlayer(this.x, this.y);
      if (target) {
        const tx = target.x + target.width / 2;
        const ty = target.y + target.height / 2;
        const targetAngle = Math.atan2(ty - this.y, tx - this.x);
        const currentAngle = Math.atan2(this.vy, this.vx);
        let diff = targetAngle - currentAngle;
        while (diff < -Math.PI) diff += Math.PI * 2;
        while (diff > Math.PI) diff -= Math.PI * 2;

        const turnSpeed = 0.08;
        const newAngle = currentAngle + Math.sign(diff) * Math.min(Math.abs(diff), turnSpeed);
        const currentSpeed = Math.hypot(this.vx, this.vy);
        this.vx = Math.cos(newAngle) * currentSpeed;
        this.vy = Math.sin(newAngle) * currentSpeed;
      }

      game.spawnSmoke(this.x, this.y, 4);
    }

    this.x += this.vx;
    this.y += this.vy;
    return true;
  }
}




class Pickup {
  constructor(x, y, type = 'HMG') {
    this.x = x;
    this.y = y;
    this.type = type;
    this.width = 28;
    this.height = 28;

    switch (type) {
      case 'BOW': this.icon = '🏹'; this.color = '#00d9ff'; this.ammo = 120; break;
      case 'AXE': this.icon = '🪓'; this.color = '#ffd700'; this.ammo = 80; break;
      case 'HMG': this.icon = 'H'; this.color = '#ff9900'; this.ammo = 150; break;
      case 'SHOTGUN': this.icon = 'S'; this.color = '#38bdf8'; this.ammo = 30; break;
      case 'ROCKET': this.icon = 'R'; this.color = '#ef4444'; this.ammo = 25; break;
      case 'FLAME': this.icon = 'F'; this.color = '#f97316'; this.ammo = 80; break;
      case 'LASER': this.icon = 'L'; this.color = '#00ffff'; this.ammo = 100; break;
      case 'BOMB': this.icon = 'B'; this.color = '#e11d48'; this.ammo = 10; break;
      default: this.icon = '★'; this.color = '#ffd700'; this.ammo = 0; break;
    }
  }
}
