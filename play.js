// 中間遊戲區寬度
// const gameWidth = 800;
// const gameHeight = 800;
// const scale = 2;

// const gameWidth = 800;
// const gameHeight = 950;
// const scale = 2;

// 總樓數(999)
var completeFloor =999;

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
var status = "playing";

var platformsStatus ="active";

var breakNewRocord = false;

// memeCat集氣條
var memeCatNameList = [];

// 苦力怕集氣條
var creepNameList = [];

// 排名系統
var rankList = [];

// 排名畫面物件，統一清除畫上，要不然塗層會一直疊
var rankObjectList =[]



// 事件文字面板群
var textPanels =[];

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
  born,
  rageSound,
  explosion,
  cheerfulAnnoyance,  
  pistolFire,
  cashIn,
  healSound,
  bgm,
  monsterBite,
  surprise,
  smokeSFX,
  tapeRewind,
  trainMusic
  ;

// T語錄
let  TVoices = [];

// B語錄
let  BVoices = [];
  
// Genetic Algothrithm Stuff
let 
  populationGreenGuy,
  populationRedGirl,
  populationMoster,
  populationDoge,
  populationT,
  populationB,
  populations = [];
  recordScore = 0;


// whether use cameraEffect
var useCameraEffect = false;

var gec = new GameEffectCenter();


// 遊戲速度常數
var gameSpeed = 1.5;
// var gameSpeed = 1.0;

// 群眾的憤怒
let rage;

var alreadyDown;

// 此層已經被入侵
var FloorAlreadyRush;

// Scoreboard elements
const lifeBar = document.getElementById("life-bar");
const score = document.getElementById("score");
const rageNumber = document.getElementById("rageNumber");
const generation = document.getElementById("generation");
const record = document.getElementById("record");
// const deadnumber = document.getElementById("deadnumber");

var muteBtn, cameraEffectBtn;

var img_Kappa, img_LUL;


// Mute the screaming kids
var gameMute = true;

// T B 家族是否滅絕
var populationBEnd = false;
var populationTEnd = false;

// T B 家族最後希望
var lastPopulationT = false;
var lastPopulationB = false;

// 長話演說
var populationBLongSpeech = false;
var populationTLongSpeech = false;


var playState =
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

    populationBEnd = false;
    populationTEnd = false;

    distance = 0;
    gameSpeed = 1.5;
    // 平台群集
    platforms = [];

    // 道具群集
    itemList = [];

    leftWalls = [];
    rightWalls = [];
    ceilings = [];
    otherPlates = [];
    createBounders();

    status = "playing";

    var logo_LUL = game.add.sprite(1240,160 , 'LUL' );

    logo_LUL.scale.setTo(0.25,0.25);

    var textStyleI= { font: "bold 36px Gothic", fill: "#ffffff", align:"center"};
    var eq = game.add.text(1350,180 , "=", textStyleI);    

    var logo_player3 = game.add.sprite(1390,160 , 'logo_player3' );

    logo_player3.scale.setTo(2,2);

    var logo_LUL = game.add.sprite(1240,280 , 'kappa' );

    logo_LUL.scale.setTo(0.25,0.25);

    var eq2 = game.add.text(1350,300 , "=", textStyleI);    

    var logo_player3 = game.add.sprite(1390,280 , 'logo_player6' );

    logo_player3.scale.setTo(2,2);
    
  
    // 讓遊戲在別的視窗下也能執行， 但有點奇怪， 不論 true、false 都有一樣的效果
    // 有空要研究一下  瀏覽器 requestAnimationFrame 機制
    game.stage.disableVisibilityChange = true;
  
    // Create 0th population 
    if(!initialed){
      // populationGreenGuy = new Population(50, "BOT", 0);  
      // populationRedGirl = new Population(50, "BOT", 1);  
      // populationDoge =  new Population(50, "BOT", 3);  
      // populationT =  new Population(50, "BOT", 4);  
      // populationB =  new Population(50, "BOT", 5);

      // 不輸入BOT 就會由電腦隨機取名
      // populationGreenGuy = new Population(50, "", 0);  
      // populationRedGirl = new Population(50, "", 1);  
      // populationDoge =  new Population(50, "", 3);  
      populationT =  new Population(50, "", 4);  
      populationB =  new Population(50, "", 5);
    
    
      // 先後順序會影像 影像前後，後放的可以蓋過前面
      // populations.push(populationRedGirl);
      // populations.push(populationGreenGuy);
      // populations.push(populationDoge);
      populations.push(populationT);
      populations.push(populationB);

      addAudio();
        
    }  
            
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

    drawNewRank();

    if(initialed)
    {      
      status = "playing"; 
      for (let i = 0; i < populations.length; i++) {
       
        if (!populations[i].done()) {
        // 新場景重生，brain數值一樣，以激發正常物理現象
        populations[i].reBorn();    
        }
        else {
          allDone++;
        }
    
      }                              
    }  
    initialed = true;   

    bgm.loop = true;
    bgm.play();

    
    
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

    if (status == "gameOver" && keyboard.enter.isDown) restart();    
    if (distance === completeFloor) win();    
    if (status != "playing") return;
                              
    var allDone = 0;



    for (let i = 0; i < populations.length; i++) {
       
      if (!populations[i].done()) {
            
        populations[i].update();
        
        // // 最後倖存者 (先取消，要不然功能太雜)
        // if(populations[0].nowAlive ==1 && !lastPopulationT)
        // {
        //   lastPopulationT = true;
        //   createTextPanel("The last hope","lastOne");  
        // }
        // if(populations[1].nowAlive ==1 && !lastPopulationB)
        // {
        //   lastPopulationB = true;
        //   createTextPanel("The last hope","lastOne");  
        // }  
      }
      else if(populations[i].done() && populations[i].isPlayer ) {
        allDone++;
        if(populationBEnd ==false && populations[1].done())
        {
          populationBEnd = true;

          // 另一邊沒死 才會後續啟動
          if(!populationTEnd)
          {
            createTextPanel("The B population(" + generation.innerHTML +") got wiped out on the floor" + distance,"extinguish");          
            // 等文字面板3秒後關閉，直接開講
            setTimeout(( () => populations[0].speech(4) ), 3000); 
          }          
          // console.log("populationBEnd");         
        } 
        if(populationTEnd ==false && populations[0].done())
        {
          populationTEnd = true;

          // 另一邊沒死 才會後續啟動
          if(!populationBEnd)
          {
            createTextPanel("The T population(" + generation.innerHTML +") got wiped out on the floor " + distance,"extinguish");
            // 等文字面板3秒後關閉，直接開講
            setTimeout(( () => populations[1].speech(5) ), 3000); 
          }                  
          // console.log("populationTEnd");
        } 
      }
      else
      {
       

      }
  
    }
      


    // 板塊可動時 才執行
    if(platformsStatus =="active")
    {
      updatePlatforms();
      updateItem(); // 更新筷子 資訊
    
      createPlatforms();
      createItem(); // 創建筷子
    }
      
    
    // 群眾憤怒
    // if(rage)
    // {
    //   if (rage.body.position.y > 400) {
    //     rage.destroy();      
    //   }    
    // }
    
    // 每 50層 怪物入侵一次，且此層尚未被入侵，避免短時間數個update 過於密集，第0層 不入侵
    if(distance% 50 == 0 && !FloorAlreadyRush && distance !=0 )
    {
            
      monsterRush(3);
      // console.log("monsterRush!");
      createTextPanel("Zombies are coming!!!","monster");
      FloorAlreadyRush =true;
    }

    // 兩個家族都死光 (有時有怪物時 會大於2)
    if (allDone >=2) {
      // Restart because this generation all died
  
      // recolorImage(img,255,255,0,11,28,214)
  
      // 先將玩家排序分數，新排行榜      
      checkNewRank();
      
      // 只取前二populations，其他怪物、NPC 都不要
      populations = populations.slice(0,2);

      status = "gameOver";
      console.log("restart");
      restart();
      return;
    }  


    // B 軍死光
    if(populationBEnd && distance% 8 ===0)
    {
      // T 軍 說話
      populations[0].speech(4);


    }

    // T 軍死光
    if(populationTEnd && distance% 8 ===0)
    {     
      // B 軍 說話
      populations[1].speech(5);           

    }

    // 大於5層 安全網會解除 (好像有bug， 之後再看)
    if(distance ==6
       && otherPlates[1])
    {      
      otherPlates[1].animations.play("turn");
      setTimeout(function () {
        otherPlates[1].body.checkCollision.up = false;
        setTimeout(() => {
          otherPlates[1].body.checkCollision.up = true;
          otherPlates[1].destroy();  
          otherPlates = otherPlates.slice(0,1);
        }, 200);
      }, 100);

    }
    
       

  
  
    
    // 創造怪物，(每一次的按壓上下算一次，避免一個FRAME 就被計算一次 )
    if (keyboard.w.isDown){
        monsterRush(10);
    }
  
    if (keyboard.w.isUp) {
      alreadyDown = false;
    }

    // 全殺滅族 幫助快速測試
    if (keyboard.a.isDown){
      for (let i = 0; i < populations.length; i++) {
       
        if (!populations[i].done()) {
              
        populations[i].killAll();
    
        }       
      }

      // populations[0].killAll();
      // populations[1].killAll();
    }




    
      
  }
  
}

// 怪物入侵 (輸入數量)
function monsterRush(amount)
{
  if (!FloorAlreadyRush) {
    populationMoster = new Population(amount,'BOT', 2,true);

    populationMoster.isPlayer = false;


    // 複製目前存活AI 避免弱智新生兒 拖累進度
    populationMoster.copyAliveBrain();

    if(populations.length>2)
    {
      populations[2].players = populations[2].players.concat(populationMoster.players);        
    }
    else
    {
      populations.push(populationMoster);    
    }
    surprise.play();
    FloorAlreadyRush = true;
  }

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
  counter1 = game.add.audio("counter1");
  counter2 = game.add.audio("counter2");
  counter3 = game.add.audio("counter3");
  counter4 = game.add.audio("counter4");
  counter5 = game.add.audio("counter5");
  counter6 = game.add.audio("counter6");
  counter7 = game.add.audio("counter7");
  counter8 = game.add.audio("counter8");
  counter9 = game.add.audio("counter9");
  counter10 = game.add.audio("counter10");
  multi_kill = game.add.audio("multi_kill");
  born = game.add.audio("born");
  rageSound = game.add.audio("rageSound");
  explosion = game.add.audio("explosion");
  cheerfulAnnoyance = game.add.audio("cheerfulAnnoyance");
  pistolFire = game.add.audio("pistolFire");
  cashIn = game.add.audio("cashIn");
  healSound = game.add.audio("healSound");
  bgm = game.add.audio("bgm");
  monsterBite =game.add.audio("monsterBite");
  surprise =game.add.audio("surprise");
  smokeSFX =game.add.audio("smokeSFX");
  tapeRewind =game.add.audio("tapeRewind");
  trainMusic =game.add.audio("trainMusic");
  
  // 只有再初始化時才加入，避免每一輪檔案肥大
  if(!initialed)
  {
    // 批次加入T聲音
    for (var i = 1; i < 129 ;i ++) {

      var TVoice = game.add.audio("TVoice (" + i +")");

      TVoices.push(TVoice);
      
    }

    // 批次加入B聲音
    for (var i = 1; i < 32 ;i ++) {

      var BVoice = game.add.audio("BVoice (" + i +")");

      BVoices.push(BVoice);
    }
  }         
}

function createBounders() {

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


  // 起始安全地板，過5層後才會解除
  // let normal800 = game.add.sprite(gameWidth / 2, 200, "normal400");
  // normal800.scale.setTo(scale, scale);
  // game.physics.arcade.enable(normal800);
  // normal800.body.immovable = true;

  // otherPlates.push(normal800);
    
  // 起始安全fake地板，過5層後才會滑開
  let normal800 = game.add.sprite(gameWidth / 2+17, 200, "fake");

  normal800.animations.add("turn", [0, 1, 2, 3, 4, 5, 0], 14);

  normal800.scale.setTo(8, scale);
  game.physics.arcade.enable(normal800);
  normal800.body.immovable = true;
  normal800.body.setSize(96, 22, 0, 10);// 真實待機SIZE
  otherPlates.push(normal800);
  

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

function createItem() {
  // console.log(platforms);
  // Find the last platform created and keep distance
  const lastiItem = itemList[itemList.length - 1];
  if (lastiItem) {
    const { y } = lastiItem;

    const movedBy = gameHeight - y;
    if (movedBy > 100) {
      createOneItem();
    }

    return;
  } 
  createOneItem();

}


function updateDistance() {
  createOnePlatform();

  distance += 1;
  score.innerHTML = distance;

  if (recordScore < distance) {

    // 破紀錄 放音樂 (第0世代不算S )
    if (!breakNewRocord && generation.innerHTML !="0") {
      newRecord.play();
      breakNewRocord = true;
      createTextPanel("New Record: floor" + distance +" !","newRocord" )
    }

    

    recordScore = distance;
    record.innerHTML = recordScore;
  }

  FloorAlreadyRush =false;

  //破記錄前的提示
  if (recordScore - distance <= 10) {
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
  
  var x = Math.random() * (gameWidth - 96 * scale - 40 * scale) + 20 * scale +400;
  
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

  // platform.body.checkCollision.up = false;
  platform.body.checkCollision.down = false;
  platform.body.checkCollision.left = false;
  platform.body.checkCollision.right = false;
  platform.platformType = platformType;

  platforms.push(platform);
}

function createOneItem() {
  var Item;
  var x = Math.random() * (gameWidth - 96 * scale - 40 * scale) + 20 * scale + 400;
    
  // var y = gameHeight; // 用這個的話，筷子永遠跟某一個板塊平行
 
  var y = gameHeight + Math.random() * gameHeight;
    
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
  y = gameHeight + Math.random() * gameHeight;
  var Item2;

  // 只有一種筷子好像也不必用機率分布來算
  Item2 = game.add.sprite(x, y, "redpotion");
  
  Item2.scale.setTo(scale, scale);
  
  game.physics.arcade.enable(Item2);
  Item2.body.immovable = true;
  
  Item2.platformType = 'redpotion';

  x = Math.random() * (gameWidth - 96 * scale - 40 * scale) + 20 * scale + 400;       
  y = gameHeight + Math.random() * gameHeight;
  var Item3;

  // 只有一種筷子好像也不必用機率分布來算>>>>>>>>>> 物品變多了 該要用機率管理了!!
  Item3 = game.add.sprite(x, y, "helmet");
  
  Item3.scale.setTo(scale, scale);
  
  game.physics.arcade.enable(Item3);
  Item3.body.immovable = true;
  
  Item3.platformType = 'headItem';
  Item3.itemName = 'helmet';

  x = Math.random() * (gameWidth - 96 * scale - 40 * scale) + 20 * scale + 400;       
  y = gameHeight + Math.random() * gameHeight;
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

    // 重直 Y 方向 運動
    platform.body.position.y -= 2 * gameSpeed;

    // 水平 X 方向 運動
    // platform.body.position.x -= 0.75 * gameSpeed;

    if (platform.body.position.y <= -32) {
      platform.destroy();
      platforms.splice(i, 1);
    }
    if (platform.Explodede) {
      platform.destroy();
      platforms.splice(i, 1);
    }
  }
}

function updateItem() {
  for (var i = 0; i < itemList.length; i++) {
    var item = itemList[i];

    // 地板移動速度 受到常數加成
    item.body.position.y -= 2 * gameSpeed;

    if (item.body.position.y <= -32) {
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
function restart() {

  // 死光就閉嘴
  for (let i = 0; i < populations.length; i++) {
    if(populations[i].populationVoice)
    {
      populations[i].populationVoice.stop();
    }    
  }  
    

  bgm.stop();

  // twitch API 報 每一輪 最佳成績 (暫時不用Twitch API 報了，畫面與文字有延遲，容易造成暴雷狀況)
  // ComfyJS.Say(generation.innerHTML + " generation reached " +distance +" floor");
 
  createTextPanel("Generation " + generation.innerHTML + " reached floor" + distance,"extinguish");

  //延遲3秒後  進入 loadState
  loadTo ="cross" ;
  setTimeout(( () => game.state.start('load')), 3000); 

  

  
}

// 遊戲 結束，贏了
function win() {

  game.state.start('win');

}


function muteBtnOnClick() {

  gameMute = !gameMute;

  game.sound.mute = gameMute;

}


function cameraEffectBtnOnClick() {

  useCameraEffect = !useCameraEffect;

}


// 玩家全死光，遊戲結束後，檢查新排名
function checkNewRank() {

  // 排名用array
  var rankPopulation = [];

  // 把所有群集都用在一起
  for (let i = 0; i < populations.length; i++) {
    // 非怪物才加入排名
    if(!populations[i].isMonster)
    {
      rankPopulation = rankPopulation.concat(populations[i].players);
    }    
  }

  // 跟目前前五名和在一起
  if(rankList.length>0)
  {
    rankPopulation = rankPopulation.concat(rankList)
  }
  

  // 新的綜合排名
  rankPopulation.sort(function (a, b) {      
    // return a.score - b.score; 小到大排
     return b.score - a.score  ; //大到小排
  });
  
  // 前八名
  rankList = rankPopulation.slice(0,8);

}


// 新遊戲，重畫新排名
function drawNewRank() {

  var textStyleI= { font: "bold 36px Gothic", fill: "#ffffff", align:"center"};

  var textStyleII= { font: "bold 24px Gothic", fill: "#ffffff", align:"center"};   
 
  // 印之前，先把舊的畫面排名物件清掉，否則圖會一直疊
  for (let i = 0; i < rankObjectList.length; i++) {
   
    rankObjectList[i].destroy();
  }

  rankObjectList = [];

    // 自動印前五名
  for (let i = 0; i < rankList.length; i++) {
    // 排名
    var rank = game.add.text(1500,160 + i*100, i+1 +".", textStyleI);    

    var logo_player = game.add.sprite(1540,160 + i*100, 'logo_player' + rankList[i].species);

    logo_player.scale.setTo(2,2);

    var generation ='th';

    if(rankList[i].gen  == '2')
    {
      generation ='nd';      
    }

    if(rankList[i].gen  == '3')
    {
      generation ='rd';      
    }

    var familyName = game.add.text(1540,200 + i*100, rankList[i].familyName + " the " + rankList[i].gen + generation, textStyleII);    

    var score = game.add.text(1620,160+ i*100,+ rankList[i].score, textStyleI);    


    rankObjectList.push(rank);
    rankObjectList.push(logo_player);
    rankObjectList.push(familyName);
    rankObjectList.push(score);

  }

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

  // nyanMeme事件
  if(eventType=="nyanMeme")
  {
    var nyanMemeLogo = game.add.sprite(130,50, "memeCatRainbow");    
    
      nyanMemeLogo.scale.setTo(0.8, 0.8);
       
      nyanMemeLogo.animations.add("memeCatRainbow", [0,1], 8);

      nyanMemeLogo.animations.play("memeCatRainbow",8,true);      
       
      textPanel.addChild(nyanMemeLogo);          
      
      //延遲幾秒後 秒後 magic
      setTimeout(( () => magicFloorChange() ), 3000); 
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

  //intro 事件
  if(eventType=="intro")
  {
    // var crownLogo = game.add.sprite(200,100, "crown");
                        
    // textPanel.addChild(crownLogo);

    var crownPlayerBLogo = game.add.sprite(200,100, "player5");
  
  
    // cryPlayerLogo.scale.setTo(scale, scale);
    crownPlayerBLogo.scale.setTo(6, 6);
            
    // crown動畫
    crownPlayerBLogo.animations.add("crown", [7,16], 8);

    crownPlayerBLogo.animations.play("crown",8,true);      

    textPanel.addChild(crownPlayerBLogo);

    var crownPlayerTLogo = game.add.sprite(500,100, "player4");


    // cryPlayerLogo.scale.setTo(scale, scale);
    crownPlayerTLogo.scale.setTo(6, 6);
          
    // crown動畫
    crownPlayerTLogo.animations.add("crown", [7,16], 8);

    crownPlayerTLogo.animations.play("crown",8,true);      

    textPanel.addChild(crownPlayerTLogo);
    
    //延遲幾秒後 秒後  播出 倒轉音樂
    setTimeout(( () => tapeRewind.play() ), 7000); 
    
  }
    
}

// 清除事件廣播系統
function cleanTextPanel(textPanelClean) {

  // textPanelClean.body.moveTo(250, 1800, Phaser.ANGLE_RIGHT);

  // TextPanel.body.onMoveComplete.add(( () => TextPanel.destroy()), this);

  // TextPanel.body.onMoveComplete.add(( () => console.log("onMoveComplete!!")), this);
              
}

// 喵咪事件改變地板
function magicFloorChange() {

  var x = Math.random() * (gameWidth - 96 * scale - 40 * scale) + 20 * scale +400;
  
  var y = gameHeight;

  var rand = Math.random() * 100;

  for (var i = 0; i < platforms.length; i++) {
   
    var platform = platforms[i];

    const  smokeTele = game.add.sprite(platform.body.x,platform.body.y, "smoke");
    smokeTele.scale.setTo(4,4);
    smokeTele.animations.add("smoke", [0, 1, 2, 3,4,5], 6).killOnComplete = true;
    smokeTele.animations.play("smoke");
    
    platform.Explodede = true;

    // let platformType = "normal";

    // if (rand < 50) {
    //   platform = game.add.sprite(x, y, "normal");
    // }
    // else if (rand < 60) {
    //   platform = game.add.sprite(x, y, "nails");
    //   platformType = "nails";
    //   game.physics.arcade.enable(platform);
    //   platform.body.setSize(96, 15, 0, 15);
    // }
    // else if (rand < 70) {
    //   platform = game.add.sprite(x, y, "conveyorLeft");
    //   platformType = "conveyorLeft";
    //   platform.animations.add("scroll", [0, 1, 2, 3], 16, true);
    //   platform.play("scroll");
    // }
    // else if (rand < 80) {
    //   platform = game.add.sprite(x, y, "conveyorRight");
    //   platformType = "conveyorRight";
    //   platform.animations.add("scroll", [0, 1, 2, 3], 16, true);
    //   platform.play("scroll");
    // }
    // else if (rand < 90) {
    //   platform = game.add.sprite(x, y, "trampoline");
    //   platformType = "trampoline";
    //   platform.animations.add("jump", [4, 5, 4, 3, 2, 1, 0, 1, 2, 3], 120);
    //   platform.frame = 3;
    // }
    // else {
    //   platform = game.add.sprite(x, y, "fake");
    //   platformType = "fake";
    //   platform.animations.add("turn", [0, 1, 2, 3, 4, 5, 0], 14);
    // }

    // platform.scale.setTo(scale, scale);
    // game.physics.arcade.enable(platform);
    // platform.body.immovable = true;

    // // Offset collison box by 6 of y to actually touch the platform
    // if (platformType === "trampoline") {
    //   platform.body.setSize(96, 22, 0, 6);
    // }

    // if (platformType === "fake") {
    //   platform.body.setSize(96, 22, 0, 10);
    // }

    // // platform.body.checkCollision.up = false;
    // platform.body.checkCollision.down = false;
    // platform.body.checkCollision.left = false;
    // platform.body.checkCollision.right = false;
    // platform.platformType = platformType;
    
    
  }

  smokeSFX.play();
 

}

  
              






