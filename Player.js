let numOfPlayers = 0;
class Player {
  constructor(familyName, gen, species) {
    this.familyName = familyName;
    this.gen = gen;
    this.species = species;

    this.playerTwitchID = "";

    numOfPlayers++;

    // const player = game.add.sprite(gameWidth / 2, 50, "player");

    // 隨機從0~6 號　共7 個player 中選擇腳色外觀
    // const player = game.add.sprite(gameWidth / 2, 50, "player" + Math.floor(Math.random()*7));

    // Mr.Han MOD
    // const player = game.add.sprite(gameWidth / 2, 50, "player_han");

    // 兩隻選一隻
    // const player = game.add.sprite(gameWidth / 2, 50, "player" + Math.floor(Math.random()*2));


    // 依傳入的0、1家族而定
    const player = game.add.sprite( 400 + gameWidth / 2, 50, "player" + species);


    player.scale.setTo(scale, scale);
    player.direction = 10;
    game.physics.arcade.enable(player);
    player.body.gravity.y = gameHeight;
    player.animations.add("left", [0, 1, 2, 3], 8);
    player.animations.add("right", [9, 10, 11, 12], 8);
    player.animations.add("flyleft", [18, 19, 20, 21], 12);
    player.animations.add("flyright", [27, 28, 29, 30], 12);
    player.animations.add("fly", [36, 37, 38, 39], 12);

    // 攻擊動畫
    player.animations.add("leftAttack", [17, 26], 6);
    player.animations.add("rightAttack", [35, 44], 6);

    player.life = 10;
    player.unbeatableTime = 0;
    player.touchOn = undefined;
    player.touchChopsticksOn = undefined;


    this.player = player;

    // 是否正在播動畫
    this.isPlayingAnimation = false;

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

    // 身上筷子數
    this.gotChopsticks = 0;

    //切斷筷子數
    this.cutChopsticks = 0;

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

    // 是否處在攻擊模式
    this.attackMode = false;
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
    // 和板塊的碰撞事件
    if(game.physics.arcade.collide(this.player, platforms, this.effect.bind(this)))
    {

    }
    else
    {
      this.player.touchOn = undefined;
    }

    // 和筷子的重疊事件
    game.physics.arcade.overlap(this.player, chopsticksList, this.effect.bind(this));

    game.physics.arcade.collide(this.player, [
      ...leftWalls,
      ...rightWalls,
      ...ceilings,
      ...otherPlates
    ]);

    game.physics.arcade.collide(this.player, [rage]);

    // 有怪物populations存活 進入攻擊模式
    if(populations.length >3)
    {
      if (!populations[3].done())
      {
        // this.attackMode = true;

        // 隨機開槍
        this.attackMode = Math.random() >= 0.5;

        // 不開槍的話，這一秒內都不會開槍
        if(!this.attackMode )
        {
          // this.isPlayingAnimation = true;
    
          // // setTimeout(() => {
            
          // //   this.isPlayingAnimation = false;
          // // }, 1000);
        }

      }
      else
      {
        this.attackMode = false;
      }


      
    }

    // 再次確認無血者死
    if (this.player.life <= 0 && !this.dead) {
      
      this.dead = true;
      
    }


    if (!this.dead) {
      // this.score = distance; // 原本分數為跑了多少層

      if(this.species == 0)
      {
        this.score = distance + this.gotChopsticks * 3 + this.cutChopsticks *10; // 現在分數多了 取得筷子加權，藍軍每一雙*3
      }
      if(this.species == 1)
      {
        this.score = distance + this.gotChopsticks * 5 + this.cutChopsticks *10; // 現在分數多了 取得筷子加權，綠軍每一雙*5
      }
      if(this.species ==3)
      {
        this.score = distance + this.cutChopsticks *10; // 現在分數多了 取得筷子加權，每夾斷一雙 結算 +10
      }

      if(this.species ==4)
      {
        this.score = distance ;
      }

      if(this.species ==5)
      {
        this.score = distance ;
      }

      
      this.updatePlayer();
      this.checkNailCeiling();
      // this.checkleftWalls();
      // this.checkrightWalls();


      this.checkFellPlayer();

      // 紅血
      if (this.player.life <= 3) {
        this.healthBar.fill = '#FF0000';
      }

      // 黃血
      if (this.player.life > 3 && this.player.life < 10) {
        this.healthBar.fill = '#F9F900';
      }

      // 綠血
      if (this.player.life == 10) {
        this.healthBar.fill = '#00EC00';
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

    let closestPlatform, closestPlatXform, closestChopsticks,platform0,platform1,platform2,platform3,platform4,platform5,platform6,platform7,
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
      chopsticksY = -gameHeight, // Y方向最近筷子資訊
      chopsticksX = -400,
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

    if (closestChopsticks) {
      const { x, y, width } = closestChopsticks;

      chopsticksY = y;

      chopsticksX = x;
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

    platform0Y = this.normalize(platform0Y, gameWidth);
    platform0X = this.normalize(platform0X, gameWidth);
    platform1Y = this.normalize(platform1Y, gameWidth);
    platform1X = this.normalize(platform1X, gameWidth);
    platform2Y = this.normalize(platform2Y, gameWidth);
    platform2X = this.normalize(platform2X, gameWidth);
    platform3Y = this.normalize(platform3Y, gameWidth);
    platform3X = this.normalize(platform3X, gameWidth);
    platform4Y = this.normalize(platform4Y, gameWidth);
    platform4X = this.normalize(platform4X, gameWidth);
    platform5Y = this.normalize(platform5Y, gameWidth);
    platform5X = this.normalize(platform5Y, gameWidth);
    platform6Y = this.normalize(platform6Y, gameWidth);
    platform6X = this.normalize(platform6X, gameWidth);
    platform7Y = this.normalize(platform7Y, gameWidth);
    platform7X = this.normalize(platform7X, gameWidth);


    chopsticksY = this.normalize(chopsticksY, gameHeight);

    chopsticksX = this.normalize(chopsticksX, gameHeight);

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
      chopsticksY,
      chopsticksX
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

        if(this.player.y >600 && this.player.touchOn)
        {
          this.stopMoving();
          this.moveState = 0;
        }
        else
        {
          this.goLeft();
          this.moveState = 1;
        }
        
        break;
      case 2:
        // if (this.moveState == 2) {
        //   return;
        // }
        if(this.player.y >600 && this.player.touchOn)
        {
          this.stopMoving();
          this.moveState = 0;
        }
        else
        {
          this.goRight();
          this.moveState = 2;
        }
        
        break;
    }
  }

  clone() {
    //Returns a copy of this player
    let clone = new Player(this.familyName, this.gen, this.species);
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
    //Produce a child (代數+1)
    let child = new Player(this.familyName, this.gen +1, this.species);
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

        this.player.life -= 3;

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


  checkleftWalls() {
    // 直接讓牆殺小朋友，強迫小朋友學習不要靠牆
    if (this.player.body.x < 20) {
      this.player.life -= 10;
      this.healthBar.text = this.generateHealthBar(this.player.life);
      if (this.player.life <= 0 && !this.dead) {
        stabbedScream.play();
        this.dead = true;

        console.log("leftWalls to death!");
      }
    }
  }

  checkrightWalls() {
    // 直接讓牆殺小朋友，強迫小朋友學習不要靠牆
    if (this.player.body.x > 715) {
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
      // fallSound.play();

      // 補償機制，若非一血衰落，會以一滴血重新開始
      if(this.player.life >1)
      {
        this.player.life = 1;

        this.player.x = 400 + gameWidth / 2; 

        this.player.y = 50;

        // this.player.tint = 0xff3300;

        // 將Y 方向速度歸零，避免重生時 速度太快入場
        this.player.body.velocity.y =0;        

        // 重生 閃紅光入場
        game.add.tween(this.player).to({
          tint: 0xff3300,
        }, 200, Phaser.Easing.Exponential.Out, true, 0, 0, true);
        
      }
      else
      {
        console.log("fell to death");
        this.dead = true;
      }      
      // gameOver();
    }
  }

  stopMoving() {
    this.player.body.velocity.x = 0;
  }

  goLeft() {
    
    // 綠軍的速度
    if(this.species ==1)
    {
      this.player.body.velocity.x = -(gameWidth / 2.8);
    }
    else
    {
      this.player.body.velocity.x = -(gameWidth / 3.2);
    }
    
  }

  goRight() {
        
    // 綠軍的速度
    if(this.species ==1)
    {
      this.player.body.velocity.x = gameWidth / 2.8;
    }
    else
    {
      this.player.body.velocity.x = gameWidth / 3.2;
    }
  }

  updatePlayer() {
    this.setPlayerAnimate(this.player);
    this.healthBar.text = this.generateHealthBar(this.player.life);
  }

  setPlayerAnimate(player) {
    var x = player.body.velocity.x;
    var y = player.body.velocity.y;

    if(this.species  ==0 && !this.isPlayingAnimation)
    {

      // if (this.attackMode ) {
        
      //   player.animations.play("leftAttack");
  
      //   this.isPlayingAnimation = true;
  
      //   setTimeout(() => {
  
      //     this.isPlayingAnimation = false;
      //     console.log("isPlayingAnimation =  false")
      //   }, 1000);
  
      //   // if (!pistolFire.isPlaying) {
      //   //     pistolFire.play();
      //   // }

      //   pistolFire.play();

      //   // this.killMonster();
        
      // }
      // if (this.attackMode) {
      
      //   player.animations.play("rightAttack");
  
      //   this.isPlayingAnimation = true;
  
      //   setTimeout(() => {
  
      //     this.isPlayingAnimation = false;
      //   }, 1000);
  
      //   if (!pistolFire.isPlaying) {
      //     pistolFire.play();
      //  }
      //  this.killMonster();
      // }

    }


    if (!this.isPlayingAnimation)
    {
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
    }

    
    // // 若沒有這一個 && !this.isPlayingAnimation ，市議員的夾屁股 很容易被站立取代
    if (x == 0 && y == 0 && !this.isPlayingAnimation) {
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

  // 觸碰筷子效果
  chopsticksEffect(player, platform) {

    if (player.touchChopsticksOn !== platform) {

      player.touchChopsticksOn = platform;

      // 取得筷子數增加
      this.gotChopsticks++;

      if(this.species == 0)
      {
        // 系統可能會承受不住，一開始一團人吃到筷子
        // // 隨機播放 韓導金句100
        // var rand = 1+ Math.floor(Math.random()*99);
        // if (!hanVoices[(rand)].isPlaying) {
        //   hanVoices[(rand)].play();
        // }        
        // 藍軍碰觸筷子 可以加三血
        player.life =player.life +3;


      }



    }
  }

  // 最新的 TLOM 用不到， 先註解起來
  // 觸碰夾筷子平台
  // cutEffect(player, platform) {

  //   if (player.touchOn !== platform) {

  //     if (!cut.isPlaying) {
  //       cut.play(); // 夾筷子音效
  //     }
  //     if (!cutDone.isPlaying) {
  //       cutDone.play(); // 夾筷子得分音效
  //     }
                       
  //     this.cutChopsticks = this.gotChopsticks;
      
  //     this.gotChopsticks = 0;

  //     player.touchOn = platform;

  //     this.isPlayingAnimation = true;

  //     player.animations.add("cut", [26, 35, 44], 6,true);
  //     player.animations.play("cut");

  //     setTimeout(() => {

  //       this.isPlayingAnimation = false;
  //     }, 1000);
  //   }
  // }


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

    
    // // 持有筷子 的市議員專用，有筷子才能夾
    // if (platform.key == "cutPlate" && this.species == 3 && this.gotChopsticks >0) {

    //   this.cutEffect(player, platform);
    // }
  }

  destroy() {
    this.player.destroy();
  }



  // killMonster()
  // {
  //   // 找一個來殺
  //   if(populations.length>3)
  //   {
  //     for (let i = 0; i < populations[3].players.length; i++)
  //     {
  //       if (!populations[3].players[i].dead ) {      
          
  //         populations[3].players[i].player.life -=3 ;     

  //         this.player.life += 3;// 回血

  //         var killmark = game.add.sprite(populations[3].players[i].player.x ,populations[3].players[i].player.y, "killmark");

  //         killmark.scale.setTo(2,2);

  //         killmark.animations.add("killmark", [0, 1, 2, 3,4,5], 8).killOnComplete = true;;

  //         killmark.animations.play("killmark");

  //         populations[3].players[i].healthBar.text = populations[3].players[i].generateHealthBar(populations[3].players[i].player.life);

  //         if(populations[3].players[i].player.life  <= 0)
  //         {
  //           populations[3].players[i].dead = true; 
  //         }
                    
  //         break;
  //       }
  //     }        
  //   }
        
  // }

}
