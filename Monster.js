let numOfMonster = 0;
class Monster {
  constructor(familyName, gen,species) {
    this.familyName = familyName;
    this.gen = gen;
    this.species =species;
    
    this.playerTwitchID="";

    numOfMonster++;

    // 碰到15個地板後就會爆炸
    // this.explodedNumer = 15;

    // const player = game.add.sprite(gameWidth / 2, 50, "player");

    // 隨機從0~6 號　共7 個player 中選擇腳色外觀
    // const player = game.add.sprite(gameWidth / 2, 50, "player" + Math.floor(Math.random()*7));

    // Mr.Han MOD
    // const player = game.add.sprite(gameWidth / 2, 50, "player_han");

    // 兩隻選一隻
    // const player = game.add.sprite(gameWidth / 2, 50, "player" + Math.floor(Math.random()*2));


    // 依傳入的0、1家族而定
    const player = game.add.sprite(gameWidth / 2, 50, "player" + species);


    player.scale.setTo(scale, scale);
    player.direction = 10;
    game.physics.arcade.enable(player);
    player.body.gravity.y = gameHeight;
    player.animations.add("left", [0, 1, 2, 3], 8);
    player.animations.add("right", [9, 10, 11, 12], 8);
    player.animations.add("flyleft", [18, 19, 20, 21], 12);
    player.animations.add("flyright", [27, 28, 29, 30], 12);
    player.animations.add("fly", [36, 37, 38, 39], 12);
    player.life = 15;
    player.unbeatableTime = 0;
    player.touchOn = undefined;
    player.touchChopsticksOn = undefined;

    
    this.player = player;


    

    
    // var playerGoLeft = 0;
    // var playerGoRight = 0;

    // this.playerGoLeft = playerGoLeft;
    // this.playerGoRight = playerGoRight;

    // const playerGoBar = new Phaser.Text(
    //   game,
    //   3,
    //   -45,
    //   "playerGoLeft:" + this.playerGoLeft + " playerGoRight:" + this.playerGoRight,
    //   {
    //     fontSize: 12,
    //     fontWeight: "thin",
    //     align: "center",
    //     // fill: "yellow",
    //     fill: "#00EC00"        
    //   }
    // );

    // this.playerGoBar = playerGoBar;

    // this.player.addChild(this.playerGoBar);


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
    this.genomeInputs = 9;
    this.genomeOutputs = 3;
    this.brain = new Genome(this.genomeInputs, this.genomeOutputs);

    this.passframe = 0;
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
    
    game.physics.arcade.collide(this.player, [rage]);

    if (!this.dead) {
      this.score = distance;
      this.updatePlayer();
      this.checkNailCeiling();
      // this.checkleftWalls();
      // this.checkrightWalls();
      

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
       if(this.player.life >= 10)
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
    let { x: playerX, y: playerY ,width:playerWidth} = this.player;

    // 是否有接觸地板
    var isTouched =0;

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

    let closestPlatform,closestPlatXform,closestChopsticks,
      closestDist = gameHeight,
      closestXDist = gameWidth;

    // Find the closest platform
    for (let index = 0; index < platforms.length; index++) {
      // 高度距離
      const distToPlayer = platforms[index].y - playerY;

      // 水平距離
      const distXToPlayer = Math.abs(platforms[index].x - playerX);

      
            
      // 玩家似乎身高為60 ，超過玩家高度的不考量
      if (distToPlayer <= 0) {
        continue;
      }

      // 忽略正再碰觸的當下地板
      if(this.player.touchOn)
      {        
        isTouched = 1;

        if(this.player.touchOn == platforms[index])
        {
          continue;
        }
      }

      if (distToPlayer < closestDist) {
        closestDist = distToPlayer;
        closestPlatform = platforms[index];        
      }

      //水平距離最近的 平台
      if (distXToPlayer < closestXDist) {
        closestXDist = distXToPlayer;
        closestPlatXform = platforms[index];        
      }


    }

    // Find the closest platform
    for (let index = 0; index < chopsticksList.length; index++) {
      // 高度距離
      const distToPlayer = chopsticksList[index].y - playerY;

      // 玩家似乎身高為60 ，超過玩家高度的不考量
      if (distToPlayer <= 0) {
        continue;
      }

      // 忽略正再碰觸的當下筷子
      if (this.player.touchChopsticksOn) {
        if (this.player.touchChopsticksOn == chopsticksList[index]) {
          continue;
        }
      }

      if (distToPlayer < closestDist) {
        closestDist = distToPlayer;
        closestChopsticks = chopsticksList[index];
      }
    }

    

    // If no platform appears yet, use these values
    let platformY = gameHeight,
      platformX = 400,
      platXformY = gameHeight,
      platXformX = 400,
      platCenter =400,
      platXCenter =400,      
      distToPlatformLeftEdge = 0,
      distToPlatformRightEdge = 0,
      platformType = 0,
      playerNowLife = 0,
      playerFromCenter = 0,      
      playerOnLeft = 0,
      playerOnRight = 0,
      playerGoLeft = 0,
      playerGoRight = 0,
      lastChance = 0,
      chopsticksY = gameHeight, // Y方向最近筷子資訊
      chopsticksX = 400;


    if (closestPlatform) {
      const { x, y, width } = closestPlatform;
      platformY = y;

      platformX = x;

      // 平台中心位置
      platCenter = platformX +width/2;

      // 增加視線濾鏡 確定小朋友所見
      // closestPlatform.tint = 0xff00ff;

      distToPlatformLeftEdge = Math.abs(x - playerX);
      distToPlatformRightEdge = Math.abs(x + width - playerX);

      platformType = platformCode[closestPlatform.platformType];


      if((x+width/2)> (playerX + playerWidth/2))
      {
        playerGoLeft = 0;
        playerGoRight = 1;

        // 綠
        // this.player.tint = 0x42f54e;
      }
      if((x+width/2)< (playerX + playerWidth/2))
      {
        playerGoLeft = 1;
        playerGoRight = 0;

        // 紅
        // this.player.tint = 0xff3300;
      }
    }

    if (closestPlatXform) {
      const { x, y, width } = closestPlatXform;
     
      platXformY = y;

      platXformX = x;

      // 平台中心位置
      platXCenter = platXformX +width/2;

      // 增加視線濾鏡 確定小朋友所見
      // closestPlatXform.tint = 0xFF6F61;      
    }

    if (closestChopsticks) {
      const { x, y, width } = closestChopsticks;

      chopsticksY = y;

      chopsticksX = x;
    }


    if(this.player.touchOn)
    {
      if((this.player.touchOn.x + this.player.touchOn.width/2)> playerX + playerWidth/2)
      {
        playerOnLeft = 1;
        playerOnRight = 0;
      }
      if((this.player.touchOn.x + this.player.touchOn.width/2)< playerX + playerWidth/2)
      {
        playerOnLeft = 0;
        playerOnRight = 1;
      }
      // distformLeftEdge = Math.abs(this.player.touchOn.x - playerX);
      // distformRightEdge = Math.abs(this.player.touchOn.x + this.player.touchOn.width - playerX);
    }

    // 腳色距離中線多遠
    // playerFromCenter = Math.abs(playerX -gameWidth/2);

    playerFromCenter = playerX -gameWidth/2;


    // Normalize data
    playerY = this.normalize(playerY, gameHeight);
    playerX = this.normalize(playerX, gameWidth);

    platformY = this.normalize(platformY, gameHeight);

    platformX = this.normalize(platformX, gameWidth);

    chopsticksY = this.normalize(chopsticksY, gameHeight);

    chopsticksX = this.normalize(chopsticksX, gameHeight);

    platCenter = this.normalize(platCenter, gameWidth);

    platXCenter = this.normalize(platXCenter, gameWidth);

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
      // platformX,        
      // platformY,
      platCenter,    
      // isTouched,
      // distToPlatformLeftEdge,
      // distToPlatformRightEdge,
      // playerOnLeft,
      // playerOnRight,
      playerGoLeft,
      playerGoRight,
      platformType,
      playerFromCenter,
      chopsticksY,
      chopsticksX
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
    let clone = new Player(this.familyName, this.gen,this.species);
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
    let child = new Player(this.familyName, this.gen,this.species);
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

        // 怪物不會有傷害
        // this.player.life -= 3;

        // 直接讓天花板殺害必殺，強迫小朋不要龜
        // this.player.life -= 10;

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

  // 怪物衰落直接爆炸
  checkFellPlayer() {
    if (this.player.body.y > gameHeight + 100 && !this.dead) {
      
      // fallSound.play();
      
      cheerfulAnnoyance.stop(); // 死掉音樂停止           

      const  img_explosion = game.add.sprite(this.player.x -192,this.player.y - 192, "img_explosion");
      img_explosion.scale.setTo(12, 12);
      img_explosion.animations.add("explosion", [0, 1, 2, 3,4,5], 8).killOnComplete = true;;
      game.physics.arcade.enable(img_explosion);

      game.physics.arcade.collide(img_explosion, platforms,this.Explodedeffect.bind(img_explosion));
      img_explosion.animations.play("explosion");
      
      // 搖鏡頭
      game.camera.shake(0.050, 500);
      explosion.play();

      // img_explosion.destroy();

      this.dead = true;                   
      // gameOver();
    }
  }

  stopMoving() {
    this.player.body.velocity.x = 0;
  }

  // 一般小朋友除為3.2
  goLeft() {
    this.player.body.velocity.x = -(gameWidth /4.8);
  }

  goRight() {
    this.player.body.velocity.x = gameWidth / 4.8;
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

  // 怪物不受板塊影響
  conveyorRightEffect(player, platform) {
    if (player.touchOn !== platform) {
      if (!conveyorSound.isPlaying) {
        conveyorSound.play();
      }
      player.touchOn = platform;
        // 每碰一個普通地板就會少1滴，血量為0 爆炸
     this.player.life--;

     // this.player.life = this.player.life -15;

     if (player.life <= 0 && !this.dead) {
       cheerfulAnnoyance.stop(); // 死掉音樂停止

       const  img_explosion = game.add.sprite(this.player.x -192,this.player.y - 192, "img_explosion");
       img_explosion.scale.setTo(12, 12);
       img_explosion.animations.add("explosion", [0, 1, 2, 3,4,5], 8).killOnComplete = true;;
       game.physics.arcade.enable(img_explosion);

       game.physics.arcade.collide(img_explosion, platforms,this.Explodedeffect.bind(img_explosion));
       img_explosion.animations.play("explosion");
       
       // 搖鏡頭
       game.camera.shake(0.050, 500);
      explosion.play();

       // img_explosion.destroy();

       this.dead = true;       
     }
    }
    // player.body.x += 2;

   


  }

  conveyorLeftEffect(player, platform) {
    if (player.touchOn !== platform) {
      conveyorSound.play();
      player.touchOn = platform;
       // 每碰一個普通地板就會少1滴，血量為0 爆炸
     this.player.life--;

     // this.player.life = this.player.life -15;

     if (player.life <= 0 && !this.dead) {
       cheerfulAnnoyance.stop(); // 死掉音樂停止

       const  img_explosion = game.add.sprite(this.player.x -192,this.player.y - 192, "img_explosion");
       img_explosion.scale.setTo(12, 12);
       img_explosion.animations.add("explosion", [0, 1, 2, 3,4,5], 8).killOnComplete = true;;
       game.physics.arcade.enable(img_explosion);

       game.physics.arcade.collide(img_explosion, platforms,this.Explodedeffect.bind(img_explosion));
       img_explosion.animations.play("explosion");
       
        // 搖鏡頭
      game.camera.shake(0.050, 500);
      explosion.play();

       // img_explosion.destroy();

       this.dead = true;       
     }
      }
        // player.body.x -= 2;
 }


    
  

  // 怪物彈更高 一般小朋友是2
  trampolineEffect(player, platform) {
    if (player.body.y > platform.body.y) return;
    if (!springSound.isPlaying) {
      springSound.play();
    }

    if (player.life < 10) {
      // player.life += 1;
    }

    // 因為彈簧的BUG 與天花板互夾會觸發連續扣寫，註解掉
    //  // 每碰一個普通地板就會少1滴，血量為0 爆炸
    //  this.player.life--;

    //  // this.player.life = this.player.life -15;

    //  if (player.life <= 0 && !this.dead) {
    //    cheerfulAnnoyance.stop(); // 死掉音樂停止

    //    const  img_explosion = game.add.sprite(this.player.x,this.player.y, "img_explosion");
    //    img_explosion.scale.setTo(4, 4);
    //    img_explosion.animations.add("explosion", [0, 1, 2, 3,4,5], 8).killOnComplete = true;;
    //    game.physics.arcade.enable(img_explosion);

    //    game.physics.arcade.collide(img_explosion, platforms,this.Explodedeffect.bind(img_explosion));
    //    img_explosion.animations.play("explosion");
       
    //    explosion.play();

    //    // img_explosion.destroy();

    //    this.dead = true;
       
    //  }

    platform.animations.play("jump");
    player.body.velocity.y = -(gameHeight / 1.3);
  }

  // 怪物不會受傷
  nailsEffect(player, platform) {
    // So player doesn't get stabbed from the side
    if (player.body.y > platform.body.y) return;
    if (player.touchOn !== platform) {
      if (!stabbedSound.isPlaying) {
        stabbedSound.play();
      }
      // player.life -= 3;



      player.touchOn = platform;

       // 每碰一個普通地板就會少1滴，血量為0 爆炸
       this.player.life--;

       // this.player.life = this.player.life -15;
 
       if (player.life <= 0 && !this.dead) {
         cheerfulAnnoyance.stop(); // 死掉音樂停止
 
         const  img_explosion = game.add.sprite(this.player.x -192,this.player.y - 192, "img_explosion");
         img_explosion.scale.setTo(12, 12);
         img_explosion.animations.add("explosion", [0, 1, 2, 3,4,5], 8).killOnComplete = true;
         game.physics.arcade.enable(img_explosion);
 
         game.physics.arcade.collide(img_explosion, platforms,this.Explodedeffect.bind(img_explosion));
         img_explosion.animations.play("explosion");

           // 搖鏡頭
        game.camera.shake(0.050, 500);
         
        explosion.play();
 
         // img_explosion.destroy();
 
         this.dead = true;
         
       }
      
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

  rageEffect(player, platform) {
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
        // player.life += 1;
      }
      player.touchOn = platform;
      // 每碰一個普通地板就會少1滴，血量為0 爆炸
      this.player.life--;

      // this.player.life = this.player.life -15;

      if (player.life <= 0 && !this.dead) {
        cheerfulAnnoyance.stop(); // 死掉音樂停止

        const  img_explosion = game.add.sprite(this.player.x -192,this.player.y - 192, "img_explosion");
        img_explosion.scale.setTo(12, 12);
        img_explosion.animations.add("explosion", [0, 1, 2, 3,4,5], 8).killOnComplete = true;;
        game.physics.arcade.enable(img_explosion);

        game.physics.arcade.collide(img_explosion, platforms,this.Explodedeffect.bind(img_explosion));


        // 搖鏡頭
        game.camera.shake(0.050, 500);

        img_explosion.animations.play("explosion");
        
        explosion.play();

        // img_explosion.destroy();

        this.dead = true;
        
      }
    }
  }

  // 怪物不會觸發翻轉地板
  fakeEffect(player, platform) {
    // if (player.body.y > platform.body.y) return;
    // if (player.touchOn !== platform) {
    //   if (!spinSound.isPlaying) {
    //     spinSound.play();
    //   }
    //   platform.animations.play("turn");
    //   setTimeout(function () {
    //     platform.body.checkCollision.up = false;
    //     setTimeout(() => {
    //       platform.body.checkCollision.up = true;
    //     }, 200);
    //   }, 100);
    //   player.touchOn = platform;
    //   if (player.life < 10) {
    //     player.life += 1;
    //   }
    // }
  }

    // 觸碰筷子效果
    chopsticksEffect(player, platform) {

      if (player.touchChopsticksOn !== platform) {
  
        player.touchChopsticksOn = platform;

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

    if (platform.key == "chopsticks") {
      this.chopsticksEffect(player, platform);
    }
  }

  Explodedeffect(explosion, platform)
  {
    // if (platform.key == "normal") {   
    //   // platform.destroy();
    //   console.log("normal Explodede");

    //   platform.Explodede = true;
    // }

    platform.Explodede = true;
  }

  destroy() {
    this.player.destroy();
  }
}
