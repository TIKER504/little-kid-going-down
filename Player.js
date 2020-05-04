let numOfPlayers = 0;
class Player {
  constructor(familyName, gen) {
    this.familyName = familyName;
    this.gen = gen;

    numOfPlayers++;

    const player = game.add.sprite(gameWidth / 2, 50, "player");

    player.scale.setTo(scale, scale);
    player.direction = 10;
    game.physics.arcade.enable(player);
    player.body.gravity.y = gameHeight;
    player.animations.add("left", [0, 1, 2, 3], 8);
    player.animations.add("right", [9, 10, 11, 12], 8);
    player.animations.add("flyleft", [18, 19, 20, 21], 12);
    player.animations.add("flyright", [27, 28, 29, 30], 12);
    player.animations.add("fly", [36, 37, 38, 39], 12);
    player.life = 10;
    player.unbeatableTime = 0;
    player.touchOn = undefined;
    this.player = player;

    const healthBar = new Phaser.Text(
      game,
      3,
      -30,
      this.generateHealthBar(player.life),
      {
        fontSize: 12,
        fontWeight: "thin",
        align: "center",
        // fill: "yellow",
        fill: "#00EC00"        
      }
    );

    this.healthBar = healthBar;

    this.player.addChild(this.healthBar);

    // const childName = this.familyName + " " + this.romanize(this.gen);
    const name = new Phaser.Text(game, 3, -15, this.familyName, {
      fontSize: 12,
      fontWeight: "thin",
      align: "center",
      fill: "white",
    });

    this.player.addChild(name);

    this.fitness = 0;
    this.vision = []; //the input array fed into the neuralNet
    this.decision = []; //the out put of the NN
    this.dead = false;
    this.reportDead = false;
    this.score = 0;
    this.unadjustedFitness;
    this.lifespan = 0; //how long the player lived for this.fitness
    this.bestScore = 0; //stores the this.score achieved used for replay

    this.beginLevel = 1; // 是否為開剛始10 層

    this.moveState = 0; // 0 = not moving, 1 = move left, 2 = move right
    // Inputs for vision, Outputs for actions
    this.genomeInputs = 8;
    this.genomeOutputs = 3;
    this.brain = new Genome(this.genomeInputs, this.genomeOutputs);
  }

  generateHealthBar(number) {
    if (number <= 0) {
      return "";
    }
    let text = "";
    for (let index = 1; index <= number; index++) {
      text += "|";
    }

    

    return text;
  }

  update() {
    game.physics.arcade.collide(this.player, platforms, this.effect.bind(this));
    game.physics.arcade.collide(this.player, [
      ...leftWalls,
      ...rightWalls,
      ...ceilings,
    ]);

    if (!this.dead) {
      this.score = distance;
      this.updatePlayer();
      this.checkNailCeiling();
      this.checkleftWalls();
      this.checkrightWalls();
      

      this.checkFellPlayer();

       // 紅血
       if(this.player.life <= 3)
       {
         this.healthBar.fill ='#FF0000';        
       }
 
       // 黃血
       if(this.player.life > 3 && this.player.life < 10)
       {
         this.healthBar.fill ='#F9F900';        
       }
 
       // 綠血
       if(this.player.life == 10)
       {
         this.healthBar.fill ='#00EC00';        
       }
             

    } else {
      this.destroy();
    }
  }

  normalize(input, base) {
    // Make the number 0 to 1
    let div = input / base;

    if (div > 1) {
      div = 1;
    }

    if (div < -1) {
      div = -1;
    }

    return div;
  }

  look() {
    this.vision = [];
    // Things the AI will "see"
    // player's y position
    // closest platform's y position
    // distance to closest platform's left edge
    // disntace to closest platform's right edge
    // platform type
    let { x: playerX, y: playerY } = this.player;

    // Only distinguish dangerous one and safe one
    // const platformCode = {
    //   normal: 0,
    //   nails: 1,
    //   conveyorLeft: 0,
    //   conveyorRight: 0,
    //   trampoline: 0,
    //   fake: 0,
    // };

    // cat iindex
    // const platformCode = {
    //   normal: 0,
    //   nails: 1,
    //   conveyorLeft: 2,
    //   conveyorRight: 3,
    //   trampoline: 4,
    //   fake: 5,
    // };

    // danger index
    const platformCode = {
      normal: 0,
      nails: 1,
      conveyorLeft: 0.5,
      conveyorRight: 0.5,
      trampoline: 0.3,
      fake: 0.8,
    };

    let closestPlatform,
      closestDist = gameHeight;

    // Find the closest platform
    for (let index = 0; index < platforms.length; index++) {
      // 高度距離
      const distToPlayer = platforms[index].y - playerY;

      // 水平距離
      // const distToPlayer = Math.abs(platforms[index].x - playerX);
            
      // 玩家似乎身高為60 ，超過玩家高度的不考量
      if (distToPlayer <= 0) {
        continue;
      }

      // 忽略正再碰觸的當下地板
      if(this.player.touchOn)
      {
        if(this.player.touchOn == platforms[index])
        {
          continue;
        }
      }

      if (distToPlayer < closestDist) {
        closestDist = distToPlayer;
        closestPlatform = platforms[index];        
      }
    }

    

    // If no platform appears yet, use these values
    let platformY = gameHeight,
      platformX = 400,
      distToPlatformLeftEdge = 0,
      distToPlatformRightEdge = 0,
      platformType = 0,
      playerNowLife = 0,
      playerFromCenter = 0,
      lastChance = 0;


    if (closestPlatform) {
      const { x, y, width } = closestPlatform;
      platformY = y;

      platformX = x;

      // 增加視線濾鏡 確定小朋友所見
      closestPlatform.tint = 0xff00ff;

      distToPlatformLeftEdge = Math.abs(x - playerX);
      distToPlatformRightEdge = Math.abs(x + width - playerX);
      platformType = platformCode[closestPlatform.platformType];
    }

    // 腳色距離中線多遠
    // playerFromCenter = Math.abs(playerX -gameWidth/2);

    playerFromCenter = playerX -gameWidth/2;


    // Normalize data
    playerY = this.normalize(playerY, gameHeight);
    playerX = this.normalize(playerX, gameWidth);

    platformY = this.normalize(platformY, gameHeight);

    platformX = this.normalize(platformX, gameWidth);

    playerFromCenter = this.normalize(playerFromCenter, gameWidth/2);

    distToPlatformLeftEdge = this.normalize(distToPlatformLeftEdge, gameWidth);
    distToPlatformRightEdge = this.normalize(distToPlatformRightEdge,gameWidth);

    playerNowLife = this.normalize(this.player.life,10);


    // if(this.player.life <3)
    // {
    //   lastChance =1;
    // }


    this.vision.push(
      playerY,
      playerX,
      platformX,
      platformY,
      distToPlatformLeftEdge,
      distToPlatformRightEdge,
      platformType,
      playerFromCenter
    );
  }

  think() {
    // Just Move Randomly
    // const rand = Math.random();

    // if (rand < 0.4) {
    //   this.goLeft();
    // }
    // if (rand > 0.6) {
    //   this.goRight();
    // }
    // return;

    this.decision = this.brain.feedForward(this.vision);

    let max = 0;
    let maxIndex = 0;

    for (let i = 0; i < this.decision.length; i++) {
      if (this.decision[i] > max) {
        max = this.decision[i];
        maxIndex = i;
      }
    }

    if (max < 0.8) {
      // Stop
      return;
      // this.stopMoving();
    }

    switch (maxIndex) {
      case 0:
        if (this.moveState == 0) {
          return;
        }
        // Stop Moving
        this.stopMoving();
        this.moveState = 0;
        break;
      case 1:
        // if (this.moveState == 1) {
        //   return;
        // }
        this.goLeft();
        this.moveState = 1;
        break;
      case 2:
        // if (this.moveState == 2) {
        //   return;
        // }
        this.goRight();
        this.moveState = 2;
        break;
    }
  }

  clone() {
    //Returns a copy of this player
    let clone = new Player(this.familyName, this.gen);
    clone.brain = this.brain.clone();
    return clone;
  }

  romanize(num) {
    if (isNaN(num)) return NaN;
    var digits = String(+num).split(""),
      key = [
        "",
        "C",
        "CC",
        "CCC",
        "CD",
        "D",
        "DC",
        "DCC",
        "DCCC",
        "CM",
        "",
        "X",
        "XX",
        "XXX",
        "XL",
        "L",
        "LX",
        "LXX",
        "LXXX",
        "XC",
        "",
        "I",
        "II",
        "III",
        "IV",
        "V",
        "VI",
        "VII",
        "VIII",
        "IX",
      ],
      roman = "",
      i = 3;
    while (i--) roman = (key[+digits.pop() + i * 10] || "") + roman;
    return Array(+digits.join("") + 1).join("M") + roman;
  }

  crossover(parent) {
    //Produce a child
    let child = new Player(this.familyName, this.gen);
    if (parent.fitness < this.fitness)
      child.brain = this.brain.crossover(parent.brain);
    else child.brain = parent.brain.crossover(this.brain);

    child.brain.mutate();
    return child;
  }

  calculateFitness() {
    // Add player's life before death as bonus points

    this.fitness = 1 + this.score * this.score + this.player.life / 10;
    this.fitness /= this.brain.calculateWeight();
  }

  upAGeneration() {
    this.gen++;
  }

  checkNailCeiling() {
    if (this.player.body.y < 35) {
      if (this.player.body.velocity.y < 0) {
        this.player.body.velocity.y = 0;
      }

      if (game.time.now > this.player.unbeatableTime) {
        stabbedSound.play();

        // this.player.life -= 3;

        // 直接讓天花板殺害必殺，強迫小朋不要龜
        this.player.life -= 10;



        this.healthBar.text = this.generateHealthBar(this.player.life);
        
        // 受傷紅光
        // game.camera.flash(0xff0000, 100);        
        gec.cameraFlash(0xff0000, 100);


        this.player.unbeatableTime = game.time.now + 1000;
        if (this.player.life <= 0 && !this.dead) {
          stabbedScream.play();
          this.dead = true;

          console.log("nailsCeiling to death!");
        }
      }
    }
  }


  checkleftWalls(){
    // 直接讓牆殺小朋友，強迫小朋友學習不要靠牆
    if (this.player.body.x < 20)
    {
      this.player.life -= 10;
      this.healthBar.text = this.generateHealthBar(this.player.life);
      if (this.player.life <= 0 && !this.dead) {
        stabbedScream.play();
        this.dead = true;

        console.log("leftWalls to death!");
      }      
    }    
  }

  checkrightWalls(){
    // 直接讓牆殺小朋友，強迫小朋友學習不要靠牆
    if (this.player.body.x > 715)
    {
      this.player.life -= 10;
      this.healthBar.text = this.generateHealthBar(this.player.life);
      if (this.player.life <= 0 && !this.dead) {
        stabbedScream.play();
        this.dead = true;

        console.log("rightWalls to death!");
      }
      
    }   
  }


  checkFellPlayer() {
    if (this.player.body.y > gameHeight + 100 && !this.dead) {
      fallSound.play();
      console.log("fell to death");
      this.dead = true;

      // gameOver();
    }
  }

  stopMoving() {
    this.player.body.velocity.x = 0;
  }

  goLeft() {
    this.player.body.velocity.x = -(gameWidth / 3.2);
  }

  goRight() {
    this.player.body.velocity.x = gameWidth / 3.2;
  }

  updatePlayer() {
    this.setPlayerAnimate(this.player);
    this.healthBar.text = this.generateHealthBar(this.player.life);
  }

  setPlayerAnimate(player) {
    var x = player.body.velocity.x;
    var y = player.body.velocity.y;

    if (x < 0 && y > 0) {
      player.animations.play("flyleft");
    }
    if (x > 0 && y > 0) {
      player.animations.play("flyright");
    }
    if (x < 0 && y == 0) {
      player.animations.play("left");
    }
    if (x > 0 && y == 0) {
      player.animations.play("right");
    }
    if (x == 0 && y != 0) {
      player.animations.play("fly");
    }
    if (x == 0 && y == 0) {
      player.frame = 8;
    }
  }

  conveyorRightEffect(player, platform) {
    if (player.touchOn !== platform) {
      if (!conveyorSound.isPlaying) {
        conveyorSound.play();
      }
      player.touchOn = platform;
      if (player.life < 10) {
        player.life += 1;
      }
    }
    player.body.x += 2;
  }

  conveyorLeftEffect(player, platform) {
    if (player.touchOn !== platform) {
      conveyorSound.play();
      player.touchOn = platform;
      if (player.life < 10) {
        player.life += 1;
      }
    }
    player.body.x -= 2;
  }

  trampolineEffect(player, platform) {
    if (player.body.y > platform.body.y) return;
    if (!springSound.isPlaying) {
      springSound.play();
    }

    if (player.life < 10) {
      player.life += 1;
    }

    platform.animations.play("jump");
    player.body.velocity.y = -(gameHeight / 2);
  }

  nailsEffect(player, platform) {
    // So player doesn't get stabbed from the side
    if (player.body.y > platform.body.y) return;
    if (player.touchOn !== platform) {
      if (!stabbedSound.isPlaying) {
        stabbedSound.play();
      }
      player.life -= 3;



      player.touchOn = platform;
      
      // 受傷紅光
      // game.camera.flash(0xff0000, 100);      
      gec.cameraFlash(0xff0000, 100);


      if (player.life <= 0 && !this.dead) {
        stabbedScream.play();
        this.dead = true;
        console.log("nailsPlatform to death!");
      }
    }
  }

  basicEffect(player, platform) {
    if (player.touchOn !== platform) {
      if (!platformSound.isPlaying) {
        platformSound.play();
      }
      if (player.life < 10) {
        player.life += 1;
      }
      player.touchOn = platform;
    }
  }

  fakeEffect(player, platform) {
    if (player.body.y > platform.body.y) return;
    if (player.touchOn !== platform) {
      if (!spinSound.isPlaying) {
        spinSound.play();
      }
      platform.animations.play("turn");
      setTimeout(function () {
        platform.body.checkCollision.up = false;
        setTimeout(() => {
          platform.body.checkCollision.up = true;
        }, 200);
      }, 100);
      player.touchOn = platform;
      if (player.life < 10) {
        player.life += 1;
      }
    }
  }

  // Effects
  effect(player, platform) {
    if (platform.key == "conveyorRight") {
      this.conveyorRightEffect(player, platform);
    }
    if (platform.key == "conveyorLeft") {
      this.conveyorLeftEffect(player, platform);
    }
    if (platform.key == "trampoline") {
      this.trampolineEffect(player, platform);
    }
    if (platform.key == "nails") {
      this.nailsEffect(player, platform);
    }
    if (platform.key == "normal") {
      this.basicEffect(player, platform);
    }
    if (platform.key == "fake") {
      this.fakeEffect(player, platform);
    }
  }

  destroy() {
    this.player.destroy();
  }
}
