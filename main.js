// 中間遊戲區寬度
const gameWidth = 800;
const gameHeight = 800;
const scale = 2;

// 畫布寬度
const canvasWidth = 1000;
const canvasHeight = 800;


var game = new Phaser.Game(canvasWidth, canvasHeight, Phaser.AUTO, "", {
  preload: preload,
  create: create,
  update: update,  
});

// var player;
var keyboard;

var platforms = [];

var leftWalls = [];
var rightWalls = [];
var ceilings = [];

var distance = 0;
var turnDead = 0;
var status = "loading";

var breakNewRocord =false;

// Phaser.RequestAnimationFrame(game,true);

// game.raf= new Phaser.RequestAnimationFrame(game, true)

// var stage =  new Stage(game);

// stage.disableVisibilityChange = true;

// Current Platform to keep track of the platform
let currentPlatform;

// Sounds
let conveyorSound,
  springSound,
  fallSound,
  platformSound,
  spinSound,
  stabbedSound,
  stabbedScream,
  newRecord,
  counter1,
  counter2,
  counter3,
  counter4,
  counter5,
  counter6,
  counter7,
  counter8,
  counter9,
  counter10,
  multi_kill,
  born;
  
// Genetic Algothrithm Stuff
let population,
  populationHan,
  populationTsai,
  populations =[];
  recordScore = 0;


// whether use cameraEffect
var useCameraEffect =false;  

var gec = new GameEffectCenter();


// 遊戲速度常數
var gameSpeed = 1.5;


// Scoreboard elements
const lifeBar = document.getElementById("life-bar");
const score = document.getElementById("score");
const generation = document.getElementById("generation");
const record = document.getElementById("record");
// const deadnumber = document.getElementById("deadnumber");

const deadnumberG = document.getElementById("deadnumberG");
const deadnumberB = document.getElementById("deadnumberB");

const numberG = document.getElementById("numberG");
const numberB = document.getElementById("numberB");


var muteBtn,cameraEffectBtn;


// Mute the screaming kids
var gameMute = true;

// 檢查 twitch 聊天室內容

ComfyJS.Init( "chimera4956" );

ComfyJS.Init( "Chimera4956", "kjh12bn1hsj78445234");

// var ComfyJS = require("comfy.js");

ComfyJS.onCommand = ( user, command, message, flags, extra ) => {
  
  if(command === "test" ) {
    console.log( "!test was typed in chat" + "(" + user + ")" );

    ComfyJS.Say( "replying to !test" );

    newRecord.play();
  }

  if(command === "kill" ) {
    console.log( "!kill was typed in chat" + "(" + user + ")"  );
    // population.kill();
  }

  if(command === "clone" ) {
    console.log( "!clone was typed in chat" + "(" + user + ")"  );
    // 創造新家族
    // populations.push(new Population(10,user)) 
  }


  if(command === "join_b" ) {
    console.log( "!join_b was typed in chat" + "(" + user + ")"  );    
    
    // B家族新成員
    populationHan.newMember(user,0) 

    born.play();
  }


  if(command === "join_g" ) {
    console.log( "!join_g was typed in chat" + "(" + user + ")"  );    
    
    // G家族新成員
    populationTsai.newMember(user,1) 

    born.play();
  }

  if(command === "kill_b" ) {
    console.log( "!join_b was typed in chat" + "(" + user + ")"  );    
    
    // B家族隨機殺成員
    populationHan.kill();

    fallSound.play();
  }


  if(command === "kill_g" ) {
    console.log( "!join_g was typed in chat" + "(" + user + ")"  );    
    
    // G家族隨機殺成員
    populationTsai.kill();

    fallSound.play();
  }

}



function preload() {
  game.load.baseURL = "./assets/";
  game.load.crossOrigin = "anonymous";
  
  // game.load.spritesheet("player", "player.png", 32, 32);
  game.load.spritesheet("player0", "player0.png", 32, 32);
  game.load.spritesheet("player1", "player1.png", 32, 32);
  game.load.spritesheet("player2", "player2.png", 32, 32);
  game.load.spritesheet("player3", "player3.png", 32, 32);
  game.load.spritesheet("player4", "player4.png", 32, 32);
  game.load.spritesheet("player5", "player5.png", 32, 32);
  game.load.spritesheet("player6", "player6.png", 32, 32);
  // game.load.spritesheet("player_han", "player_han.png", 32, 32);


  game.load.spritesheet('muteBtn', 'mute.png', 170, 150);

  game.load.spritesheet('cameraEffectBtn', 'cameraEffect.png', 100, 100);
   
  game.load.image("wall", "wall.png");
  game.load.image("ceiling", "ceiling.png");
  game.load.image("normal", "normal.png");
  game.load.image("nails", "nails.png");
  game.load.spritesheet("conveyorRight", "conveyor_right.png", 96, 16);
  game.load.spritesheet("conveyorLeft", "conveyor_left.png", 96, 16);
  game.load.spritesheet("trampoline", "trampoline.png", 96, 22);
  game.load.spritesheet("fake", "fake.png", 96, 36);
  game.load.audio("conveyor", "/sounds/Conveyor 1.mp3");
  game.load.audio("spring", "/sounds/Spring 1.mp3");
  game.load.audio("fall", "/sounds/Fall 2.mp3");
  game.load.audio("platform", "/sounds/Platform 2.mp3");
  game.load.audio("spin", "/sounds/Spin 2.mp3");
  game.load.audio("stabbed", "/sounds/Stabbed.mp3");
  game.load.audio("stabbedScream", "/sounds/Stabbed Scream.mp3");
  game.load.audio("newRecord", "/sounds/newRecord.mp3");
  game.load.audio("counter1", "/sounds/1.mp3");
  game.load.audio("counter2", "/sounds/2.mp3");
  game.load.audio("counter3", "/sounds/3.mp3");
  game.load.audio("counter4", "/sounds/4.mp3");
  game.load.audio("counter5", "/sounds/5.mp3");
  game.load.audio("counter6", "/sounds/6.mp3");
  game.load.audio("counter7", "/sounds/7.mp3");
  game.load.audio("counter8", "/sounds/8.mp3");
  game.load.audio("counter9", "/sounds/9.mp3");
  game.load.audio("counter10", "/sounds/10.mp3");
  game.load.audio("multi_kill", "/sounds/multi_kill.mp3");
  game.load.audio("born", "/sounds/born.mp3");
}

// 重新將ｉｍｇ指定色塊轉換顏色用工具，目前只能單一色塊，之後研究一下該如何指定模糊的色群集一起更換
function recolorImage(img, oldRed, oldGreen, oldBlue, newRed, newGreen, newBlue) {

  var c = document.createElement('canvas');
  var ctx = c.getContext("2d");
  var w = img.width;
  var h = img.height;

  c.width = w;
  c.height = h;

  // draw the image on the temporary canvas
  ctx.drawImage(img, 0, 0, w, h);

  // pull the entire image into an array of pixel data
  var imageData = ctx.getImageData(0, 0, w, h);

  // examine every pixel, 
  // change any old rgb to the new-rgb
  for (var i = 0; i < imageData.data.length; i += 4) {
      // is this pixel the old rgb?
      if (imageData.data[i] == oldRed && imageData.data[i + 1] == oldGreen && imageData.data[i + 2] == oldBlue) {
          // change to your new rgb
          imageData.data[i] = newRed;
          imageData.data[i + 1] = newGreen;
          imageData.data[i + 2] = newBlue;
      }
  }
  // put the altered data back on the canvas  
  ctx.putImageData(imageData, 0, 0);
  // put the re-colored image back on the image
  var img1 = document.getElementById("image1");
  img1.src = c.toDataURL('image/png');

  // var s =  c.toDataURL('newplayer.png')

  // var img1 = new Image();
  // img1.src = c.toDataURL('newplayer.png');

  // window.win = open(img1);
  // setTimeout('win.document.execCommand("SaveAs")', 0);
}

function create() {
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

  createBounders();
  addAudio();

 
  // 讓遊戲在別的視窗下也能執行， 但有點奇怪， 不論 true、false 都有一樣的效果
  // 有空要研究一下  瀏覽器 requestAnimationFrame 機制
  game.stage.disableVisibilityChange = true;

  // Create population 
  // population = new Population(200);

  populationHan = new Population(100,"BOT",0);

  populationTsai = new Population(100,"BOT",1);


  populations.push(populationHan);
  populations.push(populationTsai);

  // createPlayer();
  // createTextsBoard();

 
  // 靜音按鈕
  muteBtn = game.add.button(950, 50, 'muteBtn', muteBtnOnClick, this, 2, 1, 0);
  muteBtn.scale.setTo(0.3,0.3);

  // 關閉鏡頭特效按鈕
  cameraEffectBtn = game.add.button(900, 30, 'cameraEffectBtn', cameraEffectBtnOnClick, this, 0, 0, 0);
  cameraEffectBtn.scale.setTo(0.7,0.7);

  //遊戲背景顏色
  game.stage.backgroundColor = "#4488AA";
 
}

function update() {
  // bad
  if (status == "gameOver" && keyboard.enter.isDown) restart();
  if (status != "loading") return;

  // if (population.done()) {
  //   // Restart because this generation all died

   
  //   // recolorImage(img,255,255,0,11,28,214)


  //   console.log("dead");
  //   restart();
  //   return;
  // }

  // 若大於10層
  // if(distance>10)
  // {        
  //   population.beginLevel =0;
  // }

  // population.update();


  // turnDead  = population.turnDead

  // deadnumber.innerHTML = turnDead;

  deadnumberG.innerHTML = populationHan.turnDead;
  deadnumberB.innerHTML = populationTsai.turnDead;

  numberG.innerHTML = populationHan.nowAlive;
  numberB.innerHTML = populationTsai.nowAlive;

  var allDone = false;

  for (let i = 0; i < populations.length; i++) {
            
    if (!populations[i].done() ) {     
      populations[i].update();           
      allDone =false
    }     
    else
    {
      allDone = true;
    }

  }
  
  
  if (allDone) {
    // Restart because this generation all died

   
    // recolorImage(img,255,255,0,11,28,214)


    console.log("dead");
    restart();
    return;
  }



  updatePlatforms();

  createPlatforms();
}

function updateLifeBar() {
  if (player.life <= 0) {
    const boxes = Array.from(lifeBar.children);
    boxes.forEach((elem) => {
      elem.className = "life-empy";
    });
    return;
  }
  const currentLife = player.life;
  const boxes = Array.from(lifeBar.children);

  const actives = boxes.slice(0, currentLife);
  const empties = boxes.slice(currentLife, boxes.length);

  actives.forEach((elem) => {
    elem.className = "life-active";
  });

  empties.forEach((elem) => {
    elem.className = "life-empy";
  });
}

function addAudio() {
  conveyorSound = game.add.audio("conveyor");
  springSound = game.add.audio("spring");
  fallSound = game.add.audio("fall");
  platformSound = game.add.audio("platform");
  spinSound = game.add.audio("spin");
  stabbedSound = game.add.audio("stabbed");
  stabbedScream = game.add.audio("stabbedScream");
  newRecord = game.add.audio("newRecord");
  counter1 = game.add.audio("counter1");
  counter2 = game.add.audio("counter2");
  counter3 = game.add.audio("counter3");
  counter4 = game.add.audio("counter4");
  counter5 = game.add.audio("counter5");
  counter6 = game.add.audio("counter6");
  counter7 = game.add.audio("counter7");
  counter8 = game.add.audio("counter8");
  counter9 = game.add.audio("counter9");
  counter10= game.add.audio("counter10");
  multi_kill= game.add.audio("multi_kill");  
  born= game.add.audio("born");  
}

function createBounders() {
  const ceilingWidth = 400;
  const numberOfCeilings = Math.round(gameWidth / ceilingWidth);

  for (let index = 0; index < numberOfCeilings; index++) {
    let ceiling = game.add.sprite(ceilingWidth * index, 0, "ceiling");
    ceiling.scale.setTo(scale, scale);
    game.physics.arcade.enable(ceiling);
    ceiling.body.immovable = true;
    ceilings.push(ceiling);
  }

  const wallHeight = 400;
  const numberOfWalls = Math.round(gameHeight / 400);
  for (let index = 0; index < numberOfWalls; index++) {
    let leftWall = game.add.sprite(0, wallHeight * index, "wall");
    game.physics.arcade.enable(leftWall);
    leftWall.body.immovable = true;

    leftWalls.push(leftWall);

    let rightWall = game.add.sprite(gameWidth - 17, wallHeight * index, "wall");
    game.physics.arcade.enable(rightWall);
    rightWall.body.immovable = true;

    rightWalls.push(rightWall);
  }
}

var lastTime = 0;
function createPlatforms() {
  // console.log(platforms);
  // Find the last platform created and keep distance
  const lastPlatform = platforms[platforms.length - 1];
  if (lastPlatform) {
    const { y } = lastPlatform;

    const movedBy = gameHeight - y;
    if (movedBy > 100) {
      updateDistance();
    }

    return;
  }

  updateDistance();
}

function updateDistance() {
  createOnePlatform();
  distance += 1;
  score.innerHTML = distance;

  if (recordScore < distance) {

    // // 破紀錄 放音樂
    // if(!breakNewRocord && population.generation !=0)
    // {
    //   newRecord.play();
    //   breakNewRocord  = true;
    // }

    // 破紀錄 放音樂
    if(!breakNewRocord )
    {
      newRecord.play();
      breakNewRocord  = true;
    }
    

    recordScore = distance;
    record.innerHTML = recordScore;
  }

  //破記錄前的提示
  if(recordScore - distance <= 10)
  {
    switch (recordScore - distance) {
      case 10: 
        counter10.play();
        gec.cameraShake(0.001, 500);
        break;
      case 9:       
        counter9.play();
        gec.cameraShake(0.002, 500);
        break;
      case 8:       
        counter8.play();
        gec.cameraShake(0.003, 500);
        break;
      case 7:       
        counter7.play();
        gec.cameraShake(0.004, 500);
        break;
      case 6:       
        counter6.play();
        gec.cameraShake(0.005, 500);
        break;
        case 5: 
        counter5.play();
        gec.cameraShake(0.006, 500);
        break;
      case 4:       
        counter4.play();
        gec.cameraShake(0.007, 500);
        break;
      case 3:       
        counter3.play();
        gec.cameraShake(0.008, 500);
        break;
      case 2:       
        counter2.play();
        gec.cameraShake(0.009, 500);
        break;
      case 1:       
        counter1.play();
        gec.cameraShake(0.010, 500);
        break;
    }
  }

}

function createOnePlatform() {
  var platform;
  var x = Math.random() * (gameWidth - 96 * scale - 40 * scale) + 20 * scale;
  var y = gameHeight;
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

  platform.body.checkCollision.down = false;
  platform.body.checkCollision.left = false;
  platform.body.checkCollision.right = false;
  platform.platformType = platformType;

  platforms.push(platform);
}

function createTextsBoard() {
  var style = { fill: "#ff0000", fontSize: "20px" };
  text3 = game.add.text(
    gameWidth / 2 - 60,
    gameHeight / 2,
    "Enter 重新開始",
    style
  );
  text3.visible = false;
}

function updatePlatforms() {
  for (var i = 0; i < platforms.length; i++) {
    var platform = platforms[i];
    
    // 地板移動速度 受到常數加成
    platform.body.position.y -= 2 * gameSpeed;

    if (platform.body.position.y <= -32) {
      platform.destroy();
      platforms.splice(i, 1);
    }
  }
}

function gameOver() {
  text3.visible = true;
  isStabbedToDeath = false;
  platforms.forEach(function (s) {
    s.destroy();
  });
  platforms = [];
  status = "gameOver";
}

function restart() {
  status = "loading";
  platforms.forEach(function (s) {
    s.destroy();
  });
  platforms = [];
  distance = 0;
  breakNewRocord = false;

  // population.naturalSelection();


  for (let i = 0; i < populations.length; i++) {
            
    populations[i].naturalSelection();     
  }

}


function muteBtnOnClick () {

  gameMute = !gameMute;

  game.sound.mute = gameMute;

}


function cameraEffectBtnOnClick () {

  useCameraEffect = !useCameraEffect;

}
