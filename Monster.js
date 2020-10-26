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
    const player = game.add.sprite(400+ gameWidth / 2, 50, "player" + species);

    // const player = game.add.sprite(0, 50, "player" + species);


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
    player.touchitemOn = undefined;

    
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
    this.genomeInputs = 12;
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
      ...otherPlates
    ]);

     // 和道具的重疊事件
     game.physics.arcade.overlap(this.player, itemList, this.effect.bind(this));
    
    game.physics.arcade.collide(this.player, [rage]);

    // game.physics.arcade.collide(this.player, [...populations[0].players,...populations[1].players,...populations[2].players]);

    // 檢驗活著玩家碰撞
    for (let po = 0; po < populations.length-1; po++) {

      if (!populations[po].done()) {
        
        for (let i = 0; i < populations[po].players.length; i++) {
            
          if (!populations[po].players[i].dead ) {      
              
            game.physics.arcade.collide(this.player,populations[po].players[i].player,this.monsterEffect.bind(this));
          }             
        }
              
      }       
    }


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
    let { x: playerX, y: playerY, width: playerWidth } = this.player;

    // 是否有接觸地板
    var isTouched = 0;

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

    let closestPlatform, closestPlatXform, closestitem,platform0,platform1,platform2,platform3,platform4,platform5,platform6,platform7,
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
      if (this.player.touchOn) {
        isTouched = 1;

        if (this.player.touchOn == platforms[index]) {
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
    for (let index = 0; index < itemList.length; index++) {
      // 高度距離
      const distToPlayer = itemList[index].y - playerY;

      // 玩家似乎身高為60 ，超過玩家高度的不考量
      if (distToPlayer <= 0) {
        continue;
      }

      // 忽略正再碰觸的當下筷子
      if (this.player.touchitemOn) {
        if (this.player.touchitemOn == itemList[index]) {
          continue;
        }
      }

      if (distToPlayer < closestDist) {
        closestDist = distToPlayer;
        closestitem = itemList[index];
      }
    }


    //各種 輸入可能性
    // If no platform appears yet, use these values
    let platformY = gameHeight,
      platformX = 400,
      platXformY = gameHeight,
      platXformX = 400,
      platCenter = 400,
      platXCenter = 400,
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
      itemY = -gameHeight, // Y方向最近筷子資訊
      itemX = -400,
      platform0Y = -gameHeight, // 加入畫面所有地板資訊(最多八個)
      platform0X = -400,
      platform1Y = -gameHeight,
      platform1X = -400,
      platform2Y = -gameHeight,
      platform2X = -400,
      platform3Y = -gameHeight,
      platform3X = -400,
      platform4Y = -gameHeight,
      platform4X = -400,
      platform5Y = -gameHeight,
      platform5X = -400,
      platform6Y = -gameHeight,
      platform6X = -400,
      platform7Y = -gameHeight,
      platform7X = -400;


    if(this.score > 10)
    {
      platformX = -400;
    }

    // // 直接抓出 畫面中所有的地板的位置(最多8個)
    // for (let index = 0; index < platforms.length; index++) {

    //   if(index ==0)
    //   {
    //     platform0 = platforms[0];
    //     platform0X = platform0.x;
    //     platform0Y = platform0.y;
    //   }
    //   if(index ==1)
    //   {
    //     platform1 = platforms[1];
    //     platform1X = platform1.x;
    //     platform1Y = platform1.y;
    //   }
    //   if(index ==2)
    //   {
    //     platform2 = platforms[2];
    //     platform2X = platform2.x;
    //     platform2Y = platform2.y;
    //   }
    //   if(index ==3)
    //   {
    //     platform3 = platforms[3];
    //     platform3X = platform3.x;
    //     platform3Y = platform3.y;
    //   }
    //   if(index ==4)
    //   {
    //     platform4 = platforms[4];
    //     platform4X = platform4.x;
    //     platform4Y = platform4.y;
    //   }
    //   if(index ==5)
    //   {
    //     platform5 = platforms[5];
    //     platform5X = platform5.x;
    //     platform5Y = platform5.y;
    //   }
    //   if(index ==6)
    //   {
    //     platform6 = platforms[6];
    //     platform6X = platform6.x;
    //     platform6Y = platform6.y;
    //   }
    //   if(index ==7)
    //   {
    //     platform7 = platforms[7];
    //     platform7X = platform7.x;
    //     platform7Y = platform7.y;
    //   }
    

    // }


    if (closestPlatform) {
      const { x, y, width } = closestPlatform;
      platformY = y;

      platformX = x;

      // 平台中心位置
      platCenter = platformX + width / 2;

      // 增加視線濾鏡 確定小朋友所見
      // closestPlatform.tint = 0xff00ff;

      distToPlatformLeftEdge = Math.abs(x - playerX);
      distToPlatformRightEdge = Math.abs(x + width - playerX);

      platformType = platformCode[closestPlatform.platformType];


      if ((x + width / 2) > (playerX + playerWidth / 2)) {
        playerGoLeft = 0;
        playerGoRight = 10;

        // 綠
        // this.player.tint = 0x42f54e;
      }
      if ((x + width / 2) < (playerX + playerWidth / 2)) {
        playerGoLeft = 10;
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
      platXCenter = platXformX + width / 2;

      // 增加視線濾鏡 確定小朋友所見
      // closestPlatXform.tint = 0xFF6F61;      
    }

    if (closestitem) {
      const { x, y, width } = closestitem;

      itemY = y;

      itemX = x;
    }


    if (this.player.touchOn) {
      if ((this.player.touchOn.x + this.player.touchOn.width / 2) > playerX + playerWidth / 2) {
        playerOnLeft = 1;
        playerOnRight = 0;
      }
      if ((this.player.touchOn.x + this.player.touchOn.width / 2) < playerX + playerWidth / 2) {
        playerOnLeft = 0;
        playerOnRight = 1;
      }
      // distformLeftEdge = Math.abs(this.player.touchOn.x - playerX);
      // distformRightEdge = Math.abs(this.player.touchOn.x + this.player.touchOn.width - playerX);
    }

    // 腳色距離中線多遠
    // playerFromCenter = Math.abs(playerX -gameWidth/2);

    playerFromCenter = playerX - gameWidth / 2;


    // Normalize data
    playerY = this.normalize(playerY, gameHeight);
    playerX = this.normalize(playerX, gameWidth);

    platformY = this.normalize(platformY, gameHeight);

    platformX = this.normalize(platformX, gameWidth);

    // platform0Y = this.normalize(platform0Y, gameWidth);
    // platform0X = this.normalize(platform0X, gameWidth);
    // platform1Y = this.normalize(platform1Y, gameWidth);
    // platform1X = this.normalize(platform1X, gameWidth);
    // platform2Y = this.normalize(platform2Y, gameWidth);
    // platform2X = this.normalize(platform2X, gameWidth);
    // platform3Y = this.normalize(platform3Y, gameWidth);
    // platform3X = this.normalize(platform3X, gameWidth);
    // platform4Y = this.normalize(platform4Y, gameWidth);
    // platform4X = this.normalize(platform4X, gameWidth);
    // platform5Y = this.normalize(platform5Y, gameWidth);
    // platform5X = this.normalize(platform5Y, gameWidth);
    // platform6Y = this.normalize(platform6Y, gameWidth);
    // platform6X = this.normalize(platform6X, gameWidth);
    // platform7Y = this.normalize(platform7Y, gameWidth);
    // platform7X = this.normalize(platform7X, gameWidth);


    itemY = this.normalize(itemY, gameHeight);

    itemX = this.normalize(itemX, gameHeight);

    platCenter = this.normalize(platCenter, gameWidth);

    platXCenter = this.normalize(platXCenter, gameWidth);

    playerFromCenter = this.normalize(playerFromCenter, gameWidth / 2);

    distToPlatformLeftEdge = this.normalize(distToPlatformLeftEdge, gameWidth);
    distToPlatformRightEdge = this.normalize(distToPlatformRightEdge, gameWidth);

    playerNowLife = this.normalize(this.player.life, 10);


    // if(this.player.life <3)
    // {
    //   lastChance =1;
    // }


    this.vision.push(
      playerY,
      playerX,
      platformX,        
      platformY,
      platCenter,
      isTouched,
      // distToPlatformLeftEdge,
      // distToPlatformRightEdge,
      // playerOnLeft,
      // playerOnRight,
      playerGoLeft,
      playerGoRight,
      platformType,
      playerFromCenter,
      itemY,
      itemX
    );
  // }

  // this.vision.push(
  //   playerY,
  //   playerX,
  //   playerGoLeft,
  //   playerGoRight,
  //   platform0Y,
  //   platform0X,
  //   platform1Y,
  //   platform1X,
  //   platform2Y,
  //   platform2X,
  //   platform3Y,
  //   platform3X,
  //   platform4Y,
  //   platform4X,
  //   platform5Y,
  //   platform5X,
  //   platform6Y,
  //   platform6X,
  //   platform7Y,
  //   platform7X,
  // );
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
      
      this.Explode();

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
      this.Explode();  
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
        
      this.Explode();
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
        
        this.Explode();
        
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
        
        this.Explode();

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
  itemEffect(player, platform) {

    // 怪物吃道具 無效果，只會讓道具消失
    // 只能碰一次
    if (player.touchItemOn !== platform) {
      
      player.touchItemOn = platform;

      if(platform.platformType=='money')
      {        
        platform.Explodede = true;
      }
      // 紅水 補血
      if(platform.platformType=='redpotion')
      {       
        platform.Explodede = true;
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
    if (platform.key == "money") {
      this.itemEffect(player, platform);
    }
    if (platform.key == "redpotion") {
      this.itemEffect(player, platform);
    }

  }

    // monsterEffects
    monsterEffect(monster, player) {
      
      // 板塊停止時，怪物不會有傷害
      if(platformsStatus !="active")
      {
        return;
      }

      // 碰到怪物短暫無敵時間，避免 連續判定
      if (game.time.now > player.unbeatableTime) {
      
        player.unbeatableTime = game.time.now + 1000;

        // 碰到扣3滴血
        player.life -= 3;
        // 怪物咬音效
        monsterBite.play();

        // 受傷玩家 閃紅光
        game.add.tween(player).to({
          tint: 0xff3300,
        }, 400, Phaser.Easing.Exponential.Out, true, 0, 0, true);
        
      }

      // 碰觸怪物會擊退回彈
      if(monster.x > player.x)
      {        
        player.x -= 3;
        // player.body.velocity.x = -(gameWidth / 2);        
      }
      else
      {
        player.x += 3;
        // player.body.velocity.x = (gameWidth / 2);     
      }
      

      // if(player.life <=0)
      // {
      //   player.dead =true;
      // }          
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

  Explode() {
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
  }
}
