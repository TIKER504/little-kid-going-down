// 中間遊戲區寬度
// const gameWidth = 800;
// const gameHeight = 800;
// const scale = 2;

const gameWidth = 800;
const gameHeight = 950;
const scale = 2;

// 總樓數(999)
var completeFloor =600;

// var player;
var keyboard;

// 平台群集
var platforms = [];

// 道具群集
var itemList = [];

var leftWalls = [];
var rightWalls = [];
var ceilings = [];

var otherPlates = [];

var distance = 0;
var turnDead = 0;
var status = "preplaying";

var platformsStatus ="active";

var slowdown = false;

// whether use cameraEffect
var useCameraEffect = false;

var gec = new GameEffectCenter();


// 遊戲速度常數
var gameSpeed = 1.5;
// var gameSpeed = 1.0;

var alreadyDown;

// 此層已經被入侵
var FloorAlreadyRush;

// Scoreboard elements
// const lifeBar = document.getElementById("life-bar");
// const score = document.getElementById("score");
// const rageNumber = document.getElementById("rageNumber");
// const generation = document.getElementById("generation");
// const record = document.getElementById("record");
// const deadnumber = document.getElementById("deadnumber");

var muteBtn, cameraEffectBtn;

// Mute the screaming kids
var gameMute = true;




var preplayState =
{  
  create : function () {
    keyboard = game.input.keyboard.addKeys({
      enter: Phaser.Keyboard.ENTER,
      up: Phaser.Keyboard.UP,
      down: Phaser.Keyboard.DOWN,
      left: Phaser.Keyboard.LEFT,
      right: Phaser.Keyboard.RIGHT,
      w: Phaser.Keyboard.W,
      a: Phaser.Keyboard.A,
      s: Phaser.Keyboard.S,
      d: Phaser.Keyboard.D,
    });

    distance =999;
    gameSpeed = 1.5;
    // 平台群集
    platforms = [];

    // 道具群集
    itemList = [];

    leftWalls = [];
    rightWalls = [];
    ceilings = [];
    otherPlates = [];

    createBounders_pre();

    status = "preplaying"; 
    slowdown = false;
    // 讓遊戲在別的視窗下也能執行， 但有點奇怪， 不論 true、false 都有一樣的效果
    // 有空要研究一下  瀏覽器 requestAnimationFrame 機制
    game.stage.disableVisibilityChange = true;
              
    // createPlayer();
    // createTextsBoard();
    
    // 靜音按鈕
    muteBtn = game.add.button(1600, 50, 'muteBtn', muteBtnOnClick, this, 2, 1, 0);
    muteBtn.scale.setTo(0.3, 0.3);
  
    // 關閉鏡頭特效按鈕
    cameraEffectBtn = game.add.button(1650, 30, 'cameraEffectBtn', cameraEffectBtnOnClick, this, 0, 0, 0);
    cameraEffectBtn.scale.setTo(0.7, 0.7);
              
    //遊戲背景顏色  
    // game.stage.backgroundColor = "#064C7D";
    var textStyle= { font: "bold 48px Gothic", fill: "#ffffff", align:"center"};
    // 排名系統
    game.add.text(1500,100, "Leaderboard:", textStyle);

    score.innerHTML = distance;

    tapeRewind =game.add.audio("tapeRewind");

    
    crown = game.add.sprite( 50 + gameWidth / 2,0, "crown");
    
    crown.scale.setTo(6, 6);
    
    game.physics.arcade.enable(crown);
    crown.body.immovable = true;

    // crown.animations.add("shiny", [0, 1, 2, 3,4], 10, true);
    // crown.play("shiny");

    itemList.push(crown);

    createTextPanel("Help them win the crown by reaching floor 999!","intro"); 
    
  },
  update : function() {
    
    // 凍結畫面 10秒
    if (keyboard.s.isDown){
      freeze(10);
    }

    // 解凍畫面
    if (keyboard.d.isDown){
      unfreeze();
    }

    // 加快倒數
    if (keyboard.a.isDown){
      distance=  10;
    }
    
    if (distance <= 0)
    {
      game.state.start('play');
    }     
    if (status != "preplaying") return;
    
 
    

    // 板塊可動時 才執行
    if(platformsStatus =="active")
    {
      updatePlatforms_pre();
      updateItem_pre(); // 更新筷子 資訊
    
      createPlatforms_pre();
      createItem_pre(); // 創建筷子
    }
          
    
         
  }
  
}

function createBounders_pre() {

  // 增加背景
  let background = game.add.tileSprite(0 ,0,1000,1000, "background");

  background.scale.setTo(scale, scale);

  

  // background.autoScroll(-16);

  background.autoScroll(0,-30);

  // background.autoScroll(-16,-30);

  const ceilingWidth = 400;
  // const numberOfCeilings = Math.round(gameWidth / ceilingWidth);

  const numberOfCeilings = 1;

  for (let index = 0; index < numberOfCeilings; index++) {
    let ceiling = game.add.sprite(400 + ceilingWidth * index, 0, "ceiling");
    ceiling.scale.setTo(scale, scale);
    game.physics.arcade.enable(ceiling);
    ceiling.body.immovable = true;
    ceilings.push(ceiling);
  }

  const wallHeight = 400;
  const numberOfWalls = Math.round(gameHeight / 400) +1 ;
  for (let index = 0; index < numberOfWalls; index++) {
    // let leftWall = game.add.sprite(0, wallHeight * index, "wall");

    let leftWall = game.add.sprite(400, wallHeight * index, "wall");

    game.physics.arcade.enable(leftWall);
    leftWall.body.immovable = true;

    leftWalls.push(leftWall);

    // let rightWall = game.add.sprite(gameWidth - 17, wallHeight * index, "wall");

    let rightWall = game.add.sprite(400 + gameWidth - 17, wallHeight * index, "wall");

    game.physics.arcade.enable(rightWall);
    rightWall.body.immovable = true;

    rightWalls.push(rightWall);
  }

  // 最右最左牆
  for (let index = 0; index < numberOfWalls; index++) {
    // let leftWall = game.add.sprite(0, wallHeight * index, "wall");

    let leftWall = game.add.sprite(0, wallHeight * index, "wall");

    game.physics.arcade.enable(leftWall);
    leftWall.body.immovable = true;

    leftWalls.push(leftWall);

    // let rightWall = game.add.sprite(gameWidth - 17, wallHeight * index, "wall");

    let rightWall = game.add.sprite(canvasWidth - 17, wallHeight * index, "wall");

    game.physics.arcade.enable(rightWall);
    rightWall.body.immovable = true;

    rightWalls.push(rightWall);
  }

  // 左上角平台
  let normal400 = game.add.sprite(0, 300, "normal400");
  // 寬度不變，高*2
  normal400.scale.setTo(1, scale);
  game.physics.arcade.enable(normal400);
  normal400.body.immovable = true;

  otherPlates.push(normal400);
  
}

var lastTime = 0;
function createPlatforms_pre() {
  // console.log(platforms);
  // Find the last platform created and keep distance
  const lastPlatform = platforms[platforms.length - 1];
  if (lastPlatform) {
    const { y } = lastPlatform;

    const movedBy =  y;
    if (movedBy > 100) {
      updateDistance_pre();
    }

    return;
  }

  updateDistance_pre();
}

function createItem_pre() {
  // console.log(platforms);
  // Find the last platform created and keep distance
  const lastiItem = itemList[itemList.length - 1];
  if (lastiItem) {
    const { y } = lastiItem;

    const movedBy =  y;
    if (movedBy > 100) {
      createOneItem_pre();
    }

    return;
  } 
  createOneItem_pre();

}


function updateDistance_pre() {
  createOnePlatform_pre();

  if(distance >Math.floor(1*gameSpeed))
  {
    distance -= Math.floor(1*gameSpeed);
  }
  else
  {
    distance= 0;
  }
  

  score.innerHTML = distance;  

  if(!slowdown)
  {
    gameSpeed = gameSpeed*1.10
  }
  else
  {
    gameSpeed = gameSpeed*0.9
  }
  
  if(gameSpeed >55)
  {
    slowdown = true;
  }
}

function createOnePlatform_pre() {
  var platform;
  
  var x = Math.random() * (gameWidth - 96 * scale - 40 * scale) + 20 * scale +400;
  
  var y = 0;
  
  var rand = Math.random() * 100;

  let platformType = "normal";

  if (rand < 50) {
    platform = game.add.sprite(x, y, "normal");
  }
  else if (rand < 60) {
    platform = game.add.sprite(x, y, "nails");
    platformType = "nails";
    game.physics.arcade.enable(platform);
    platform.body.setSize(96, 15, 0, 15);
  }
  else if (rand < 70) {
    platform = game.add.sprite(x, y, "conveyorLeft");
    platformType = "conveyorLeft";
    platform.animations.add("scroll", [0, 1, 2, 3], 16, true);
    platform.play("scroll");
  }
  else if (rand < 80) {
    platform = game.add.sprite(x, y, "conveyorRight");
    platformType = "conveyorRight";
    platform.animations.add("scroll", [0, 1, 2, 3], 16, true);
    platform.play("scroll");
  }
  else if (rand < 90) {
    platform = game.add.sprite(x, y, "trampoline");
    platformType = "trampoline";
    platform.animations.add("jump", [4, 5, 4, 3, 2, 1, 0, 1, 2, 3], 120);
    platform.frame = 3;
  }
  else {
    platform = game.add.sprite(x, y, "fake");
    platformType = "fake";
    platform.animations.add("turn", [0, 1, 2, 3, 4, 5, 0], 14);
  }

  platform.scale.setTo(scale, scale);
  game.physics.arcade.enable(platform);
  platform.body.immovable = true;

  // Offset collison box by 6 of y to actually touch the platform
  if (platformType === "trampoline") {
    platform.body.setSize(96, 22, 0, 6);
  }

  if (platformType === "fake") {
    platform.body.setSize(96, 22, 0, 10);
  }

  // platform.body.checkCollision.up = false;
  platform.body.checkCollision.down = false;
  platform.body.checkCollision.left = false;
  platform.body.checkCollision.right = false;
  platform.platformType = platformType;

  platforms.push(platform);
}

function createOneItem_pre() {
  var Item;
  var x = Math.random() * (gameWidth - 96 * scale - 40 * scale) + 20 * scale + 400;
    
  // var y = gameHeight; // 用這個的話，筷子永遠跟某一個板塊平行
 
  var y = 0 - Math.random() * gameHeight;
    
  // 只有一種筷子好像也不必用機率分布來算
  Item = game.add.sprite(x, y, "money");
  
  Item.scale.setTo(scale, scale);
  
  game.physics.arcade.enable(Item);
  Item.body.immovable = true;

  // platform.body.checkCollision.down = false;
  // platform.body.checkCollision.left = false;
  // platform.body.checkCollision.right = false;
  // platform.platformType = platformType;
  Item.platformType = 'money';

  Item.animations.add("shiny", [0, 1, 2, 3,4], 10, true);
  Item.play("shiny");


  x = Math.random() * (gameWidth - 96 * scale - 40 * scale) + 20 * scale + 400;       
  y = 0 - Math.random() * gameHeight;
  var Item2;

  // 只有一種筷子好像也不必用機率分布來算
  Item2 = game.add.sprite(x, y, "redpotion");
  
  Item2.scale.setTo(scale, scale);
  
  game.physics.arcade.enable(Item2);
  Item2.body.immovable = true;
  
  Item2.platformType = 'redpotion';

  x = Math.random() * (gameWidth - 96 * scale - 40 * scale) + 20 * scale + 400;       
  y = 0 - Math.random() * gameHeight;
  var Item3;

  // 只有一種筷子好像也不必用機率分布來算>>>>>>>>>> 物品變多了 該要用機率管理了!!
  Item3 = game.add.sprite(x, y, "helmet");
  
  Item3.scale.setTo(scale, scale);
  
  game.physics.arcade.enable(Item3);
  Item3.body.immovable = true;
  
  Item3.platformType = 'headItem';
  Item3.itemName = 'helmet';

  x = Math.random() * (gameWidth - 96 * scale - 40 * scale) + 20 * scale + 400;       
  y = 0 - Math.random() * gameHeight;
  var Item4;

  // 只有一種筷子好像也不必用機率分布來算>>>>>>>>>> 物品變多了 該要用機率管理了!!
  Item4 = game.add.sprite(x, y, "hat");
  
  Item4.scale.setTo(scale, scale);
  
  game.physics.arcade.enable(Item4);
  Item4.body.immovable = true;
  
  Item4.platformType = 'headItem';
  Item4.itemName = 'hat';

  
  itemList.push(Item);
  itemList.push(Item2);
  itemList.push(Item3);
  itemList.push(Item4);
}



function updatePlatforms_pre() {
  for (var i = 0; i < platforms.length; i++) {
    var platform = platforms[i];

    // 地板移動速度 受到常數加成

    // 重直 Y 方向 運動
    platform.body.position.y += 2 * gameSpeed;

    // 水平 X 方向 運動
    // platform.body.position.x -= 0.75 * gameSpeed;

    if (platform.body.position.y >= gameHeight +32) {
      platform.destroy();
      platforms.splice(i, 1);
    }
    if (platform.Explodede) {
      platform.destroy();
      platforms.splice(i, 1);
    }
  }
}

function updateItem_pre() {
  for (var i = 0; i < itemList.length; i++) {
    var item = itemList[i];

    // 地板移動速度 受到常數加成
    item.body.position.y += 2 * gameSpeed;

    if (item.body.position.y >= gameHeight +32) {
      item.destroy();
      itemList.splice(i, 1);
    }
    if (item.Explodede) {
      item.destroy();
      itemList.splice(i, 1);
    }
  }
}

function gameOver() {
  text3.visible = true;
  isStabbedToDeath = false;

  // 清空所有地板
  platforms.forEach(function (s) {
    s.destroy();
  });
  platforms = [];

  // 清空所有對話視窗
  textPanels.forEach(function (s) {
    s.destroy();
  });
  textPanels = [];
  
  status = "gameOver";
}

// 新一輪
function restart_pre() {

  //延遲3秒後  進入 cross 
  setTimeout(( () => game.state.start('cross')), 3000); 

}

function muteBtnOnClick() {

  gameMute = !gameMute;

  game.sound.mute = gameMute;

}


function cameraEffectBtnOnClick() {

  useCameraEffect = !useCameraEffect;

}


// 將板塊卡住 幾秒;
function freeze(duration)
{
  platformsStatus = "freeze";
  // console.log("freeze!");

  
  //延遲幾秒後 秒後 解凍
  setTimeout(unfreeze, duration*1000); 
}

//板塊繼續
function unfreeze()
{
  platformsStatus ="active";
  // console.log("unfreeze!");
}

// 事件廣播系統
function createTextPanel(text,eventType) {
  
  // 凍結3 秒
  freeze(3);

  // textPanel = game.add.sprite(gameWidth/2-200, gameHeight/2-300, "textPanel");

  var textPanel = game.add.sprite(-1200, gameHeight/2-300, "textPanel");

  game.physics.arcade.enable(textPanel);

  //  Move the Body 300 pixels to the right, over 2000 ms
  textPanel.body.moveTo(250, 1200+ gameWidth/2-200, Phaser.ANGLE_RIGHT);
  
  //延遲幾秒後 秒後  移出
  setTimeout(( () => textPanel.body.moveTo(250, 1800, Phaser.ANGLE_RIGHT) ), 3000); 

  
  const paneltxt = new Phaser.Text(game,200, 300, text, {
    font: '30px Courier',    
    align: "center",
    fill: "white",
  });

  textPanel.addChild(paneltxt);
    
  textPanels.push(textPanel);

  // 滅絕事件
  if(eventType=="extinguish")
  {
    if(populationBEnd && !populationTEnd)
    {
  
      var cryPlayerLogo = game.add.sprite(200,100, "player5");
  
  
      // cryPlayerLogo.scale.setTo(scale, scale);
      cryPlayerLogo.scale.setTo(6, 6);
             
       // 哭動畫
       cryPlayerLogo.animations.add("cry", [26,35], 8);
  
       cryPlayerLogo.animations.play("cry",8,true);      
  
       textPanel.addChild(cryPlayerLogo);
  
    }
  
    if(populationTEnd && !populationBEnd)
    {
  
      var cryPlayerLogo = game.add.sprite(200,100, "player4");
  
  
      // cryPlayerLogo.scale.setTo(scale, scale);
      cryPlayerLogo.scale.setTo(6, 6);
             
       // 哭動畫
       cryPlayerLogo.animations.add("cry", [26,35], 8);
  
       cryPlayerLogo.animations.play("cry",8,true);      
  
       textPanel.addChild(cryPlayerLogo);
  
    }
  
    if(populationBEnd && populationTEnd)
    {
  
      var cryPlayerBLogo = game.add.sprite(200,100, "player5");
  
  
      // cryPlayerLogo.scale.setTo(scale, scale);
      cryPlayerBLogo.scale.setTo(6, 6);
             
       // 哭動畫
       cryPlayerBLogo.animations.add("cry", [26,35], 8);
  
       cryPlayerBLogo.animations.play("cry",8,true);      
  
       textPanel.addChild(cryPlayerBLogo);
  
       var cryPlayerTLogo = game.add.sprite(500,100, "player4");
  
  
       // cryPlayerLogo.scale.setTo(scale, scale);
       cryPlayerTLogo.scale.setTo(6, 6);
              
        // 哭動畫
        cryPlayerTLogo.animations.add("cry", [26,35], 8);
   
        cryPlayerTLogo.animations.play("cry",8,true);      
   
        textPanel.addChild(cryPlayerTLogo);
  
    }


  }

  // 破紀錄事件
  if(eventType=="newRocord")
  {
    if(!populationTEnd)
    {
      var coolPlayerLogo = game.add.sprite(500,100, "player4");
  
  
      // cryPlayerLogo.scale.setTo(scale, scale);
      coolPlayerLogo.scale.setTo(6, 6);
             
       // 酷動畫
      //  coolPlayerLogo.animations.add("cry", [26,35], 8);
  
      //  coolPlayerLogo.animations.play("cry",8,true);      
  
       coolPlayerLogo.frame = 44;
       textPanel.addChild(coolPlayerLogo);
     
    }  
    if(!populationBEnd)
    {  
      var coolPlayerLogo = game.add.sprite(200,100, "player5");
  
  
      // cryPlayerLogo.scale.setTo(scale, scale);
      coolPlayerLogo.scale.setTo(6, 6);
             
       // 酷動畫
      //  coolPlayerLogo.animations.add("cry", [26,35], 8);
  
      //  coolPlayerLogo.animations.play("cry",8,true);      
  
      coolPlayerLogo.frame = 44;
      textPanel.addChild(coolPlayerLogo);         
    }
    
  }

  //Monster 事件
  if(eventType=="monster")
  {
    var monsterLogo = game.add.sprite(200,100, "player2");
  
  
      // cryPlayerLogo.scale.setTo(scale, scale);
      monsterLogo.scale.setTo(6, 6);
                  
      monsterLogo.animations.add("right", [9, 10, 11, 12], 8);
  
      monsterLogo.animations.play("right",8,true);      
        
      textPanel.addChild(monsterLogo);
    
  }

    
}

// 清除事件廣播系統
function cleanTextPanel(textPanelClean) {

  // textPanelClean.body.moveTo(250, 1800, Phaser.ANGLE_RIGHT);

  // TextPanel.body.onMoveComplete.add(( () => TextPanel.destroy()), this);

  // TextPanel.body.onMoveComplete.add(( () => console.log("onMoveComplete!!")), this);
              
}



