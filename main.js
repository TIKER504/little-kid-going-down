// 中間遊戲區寬度
const gameWidth = 800;
const gameHeight = 800;
const scale = 2;

// 畫布寬度
const canvasWidth = 1400;
const canvasHeight = 800;


var game = new Phaser.Game(canvasWidth, canvasHeight, Phaser.AUTO, "", {
  preload: preload,
  create: create,
  update: update,
});

// var player;
var keyboard;

// 平台群集
var platforms = [];

// 筷子群集
var chopsticksList = [];

var leftWalls = [];
var rightWalls = [];
var ceilings = [];

var distance = 0;
var turnDead = 0;
var status = "loading";

var breakNewRocord = false;

// 人民法槌集氣條
var rageNameList = [];

// 苦力怕集氣條
var creepNameList = [];

// 排名系統
var rankList = [];

// 排名畫面物件，統一清除畫上，要不然塗層會一直疊
var rankObjectList =[]

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
  born,
  rageSound,
  explosion,
  cheerfulAnnoyance,
  cut,
  cutDone
  ;

// 韓導語錄
let  hanVoices = [];

// 小英語錄
let  tsaiVoices = [];
  
// Genetic Algothrithm Stuff
let population,
  populationHan,
  populationTsai,
  populationMoster,
  populationChiu,
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



// Scoreboard elements
const lifeBar = document.getElementById("life-bar");
const score = document.getElementById("score");
const rageNumber = document.getElementById("rageNumber");
const generation = document.getElementById("generation");
const record = document.getElementById("record");
// const deadnumber = document.getElementById("deadnumber");

const deadnumberG = document.getElementById("deadnumberG");
const deadnumberB = document.getElementById("deadnumberB");

const numberG = document.getElementById("numberG");
const numberB = document.getElementById("numberB");


var muteBtn, cameraEffectBtn;

var img_Kappa, img_LUL;


// Mute the screaming kids
var gameMute = true;

// 檢查 twitch 聊天室內容

// ComfyJS.Init("chimera4956");

// 這個可以 Oauth 授權成功!!!!! 痛哭流涕
ComfyJS.Init("chimera4956", "oauth:1wr03xndowkqnn70fqhw4eujlxmnc2");

// 這是node.js 的套件，先用html 解決之後一起整理。
// var ComfyJS = require("comfy.js");

ComfyJS.onCommand = (user, command, message, flags, extra) => {

  if (command === "test") {
    console.log("!test was typed in chat" + "(" + user + ")");

    ComfyJS.Say("replying to !test");

    newRecord.play();
  }

  if (command === "kill") {
    console.log("!kill was typed in chat" + "(" + user + ")");
    // population.kill();
  }

  if (command === "clone") {
    console.log("!clone was typed in chat" + "(" + user + ")");
    // 創造新家族
    // populations.push(new Population(10,user)) 
  }


  if (command === "join_b") {
    console.log("!join_b was typed in chat" + "(" + user + ")");

    // B家族新成員
    populationHan.newMember(user, 0)

    // 隨機播放 韓導金句100
    hanVoices[(1+ Math.floor(Math.random()*99))].play();

    // born.play();
  }


  if (command === "join_g") {
    console.log("!join_g was typed in chat" + "(" + user + ")");

    // G家族新成員
    populationTsai.newMember(user, 1)

    // 隨機播放 小英金句
    tsaiVoices[(1+ Math.floor(Math.random()*10))].play();

    // born.play();
  }

  if (command === "kill_b") {
    console.log("!join_b was typed in chat" + "(" + user + ")");

    // B家族隨機殺成員
    populationHan.kill();

    fallSound.play();
  }


  if (command === "kill_g") {
    console.log("!join_g was typed in chat" + "(" + user + ")");

    // G家族隨機殺成員
    populationTsai.kill();

    fallSound.play();
  }

  if (command === "rage") {

    console.log("!rage was typed in chat" + "(" + user + ")");

    rageNameList.push(user);

    if(rageNameList.length >1)
    {
      rage = game.add.sprite(0,0, "rage");
      game.physics.arcade.enable(rage);
      // rage.body.immovable = true;
      rage.body.gravity.y = gameHeight;



3

      var name = new Phaser.Text(game, 3, -60,rageNameList.join(",") , {
        fontSize: 50,
        // fontWeight: "thin",
        align: "center",
        fill: "white",
      });
  
      rage.addChild(name);

      rageNameList =[];

    }
            
  }
  
}


ComfyJS.onChat =( user, message, flags, self, extra )=>
{
  console.log( message +" was typed in chat" + "(" + user + ")");

  //代幣系列


  // 加入綠軍
  if(extra.customRewardId==='f43a4039-41c0-45b4-bb87-71e2ddf1d91f')
  {
   // G家族新成員
   populationTsai.newMember(user, 1);

   ComfyJS.Say(user+'加入綠軍新生兒');
  
   // 隨機播放 小英金句
   tsaiVoices[(1+ Math.floor(Math.random()*10))].play();
  }

  // 加入藍軍
  if(extra.customRewardId==='44227033-e641-4450-be45-d402dc0e111d')
  {
    // B家族新成員
    populationHan.newMember(user, 0);

    ComfyJS.Say(user+'加入藍軍新生兒');

    // 隨機播放 韓導金句100
    hanVoices[(1+ Math.floor(Math.random()*99))].play();
  }

  

  // 人民的法槌
  if(extra.customRewardId==='b901ce1d-a862-4362-aadb-c553310eee1f')
  {
    rage = game.add.sprite(0,0, "rage");
    game.physics.arcade.enable(rage);
    // rage.body.immovable = true;
    rage.body.gravity.y = gameHeight;
    
    var name = new Phaser.Text(game, 3, -60,user+"表示:" + message , {
      fontSize: 80,
      // fontWeight: "thin",
      align: "center",
      fill: "white",
    });

    rage.addChild(name);
              
    rageSound.play();

    ComfyJS.Say(user +'一氣之下直接花費小朋友幣召喚天降之槌');
  }



  if(message==="LUL")
  {
    // G家族新成員
   populationTsai.newMember(user, 1);

   ComfyJS.Say(user+'加入綠軍新生兒');
  
   // 隨機播放 小英金句
   tsaiVoices[(1+ Math.floor(Math.random()*10))].play();
  }


  if(message==="LUL LUL")
  {
    // G家族隨機殺成員
   populationTsai.kill();

   ComfyJS.Say(user+'剷除一名綠軍');

   // 隨機播放 小英金句
   tsaiVoices[(1+ Math.floor(Math.random()*10))].play();
  }



  if(message==="Kappa")
  {
   // B家族新成員
   populationHan.newMember(user, 0);

   ComfyJS.Say(user+'加入藍軍新生兒');

   // 隨機播放 韓導金句100
   hanVoices[(1+ Math.floor(Math.random()*99))].play();
  }

  if(message==="Kappa Kappa")
  {
    // B家族隨機殺成員
    populationHan.kill();

    ComfyJS.Say(user+'剷除一名藍軍');

   // 隨機播放 韓導金句100
   hanVoices[(1+ Math.floor(Math.random()*99))].play();
  }

  if(message==="PogChamp")
  {
   // C家族新成員
   populationChiu.newMember(user, 3);

   if (!cut.isPlaying) {
    cut.play(); // 夾筷子音效
  }

   ComfyJS.Say(user+'加入市議員新生兒');
  }

  if(message==="PogChamp PogChamp")
  {
    // C家族隨機殺成員
    populationChiu.kill();
    
    ComfyJS.Say(user+'剷除一名市議員');

  }


   


  if(message==="BibleThump")
  {
    // console.log("!rage was typed in chat" + "(" + user + ")");

    rageNameList.push(user);
    // // 網頁支援朗讀文字 (英文 中文之間 有空一格 會是不同的語音，英文的配音無法直接連讀英中文一起)
    // var msg = new SpeechSynthesisUtterance(user+'貢獻了人民的法槌，還差一點點了 大家加油');
    // msg.rate = 4; // 0.1 to 10
    // msg.pitch = 1; //0 to 2        
    // window.speechSynthesis.speak(msg);

    // // 網頁支援朗讀文字 (英文 中文之間 有空一格 會是不同的語音，英文的配音無法直接連讀英中文一起)
    // var msg_ch = new SpeechSynthesisUtterance('貢獻了人民的法槌，還差一點點了 大家加油');

    // var voices = window.speechSynthesis.getVoices();
    // msg_ch.voice = voices[10]; // Note: some voices don't support altering params
    // // msg.voiceURI = 'native';
    // // msg.volume = 1; // 0 to 1
    // msg_ch.rate = 4; // 0.1 to 10
    // msg_ch.pitch = 1; //0 to 2
    // // msg.text = 'Hello World';
    // msg_ch.lang = 'zh-tw';
    // window.speechSynthesis.speak(msg_ch);
    // // msg.onend = function(e) {
    // //   console.log('Finished in ' + event.elapsedTime + ' seconds.');
    // // };

    if(rageNameList.length ==1)
    {      
    var msg = new SpeechSynthesisUtterance(user+'首先發難舉起了人民法槌' );

    ComfyJS.Say(user+'首先發難舉起了人民法槌'+'(' + rageNameList.length +"/20)");

    msg.rate = 4; // 0.1 to 10
    msg.pitch = 1; //0 to 2        
    window.speechSynthesis.speak(msg);


    }

    if(rageNameList.length >=2 &&rageNameList.length <=7)
    {      
    var msg = new SpeechSynthesisUtterance(user+'響應人民法槌行列步步向前');

    ComfyJS.Say(user+'響應人民法槌行列步步向前'+'(' + rageNameList.length +"/20)");

    msg.rate = 4; // 0.1 to 10
    msg.pitch = 1; //0 to 2        
    window.speechSynthesis.speak(msg);
    }

    if(rageNameList.length >=8 &&rageNameList.length <=14)
    {      
    var msg = new SpeechSynthesisUtterance(user+'忍無可忍手握法槌一磚一瓦築起制裁之牆');

    ComfyJS.Say(user+'忍無可忍手握法槌一磚一瓦築起制裁之牆'+'(' + rageNameList.length +"/20)");

    msg.rate = 4; // 0.1 to 10
    msg.pitch = 1; //0 to 2        
    window.speechSynthesis.speak(msg);
    }

    if(rageNameList.length >=15 &&rageNameList.length <=19)
    {      
    var msg = new SpeechSynthesisUtterance(user+'手握憤怒法槌制裁之牆即將降下驅逐所有玩家');

    ComfyJS.Say(user+'手握憤怒法槌制裁之牆即將降下驅逐所有玩家'+'(' + rageNameList.length +"/20)");

    msg.rate = 4; // 0.1 to 10
    msg.pitch = 1; //0 to 2        
    window.speechSynthesis.speak(msg);
    }



    if(rageNameList.length >=20)
    {
      rage = game.add.sprite(0,0, "rage");
      game.physics.arcade.enable(rage);
      // rage.body.immovable = true;
      rage.body.gravity.y = gameHeight;


      var lineNumber = 1;

      lineNumber = Math.ceil(rageNameList.length/3)


      for(i = 1; i<=lineNumber; i++)
      {
        var name = new Phaser.Text(game, 3, -60 *i,rageNameList.slice((i-1)*3,(i*3)).join(",") , {
          fontSize: 50,
          // fontWeight: "thin",
          align: "center",
          fill: "white",
        });
    
        rage.addChild(name);
      }
      
      

      

      // 隨機播放 韓導金句100
      // hanVoices[(1+ Math.floor(Math.random()*99))].play();
    
      rageSound.play();

      ComfyJS.Say('這就是萬民的憤怒!!!來自眾英雄:' +rageNameList.join("、")+'，感受眾志成城的壓迫感吧!!!');

      rageNameList =[];

    }
  }

  if(message==="SSSsss")
  {
   // 苦力怕
  //  console.log('苦力怕要來了!');

  creepNameList.push(user);

   if(creepNameList.length >=2)
   {
    // rage = game.add.sprite(0,0, "rage");
    // game.physics.arcade.enable(rage);
    // // rage.body.immovable = true;
    // rage.body.gravity.y = gameHeight;

    // var lineNumber = 1;

    // lineNumber = Math.ceil(rageNameList.length/3)

    // for(i = 1; i<=lineNumber; i++)
    // {
    //   var name = new Phaser.Text(game, 3, -60 *i,rageNameList.slice((i-1)*3,(i*3)).join(",") , {
    //     fontSize: 50,
    //     // fontWeight: "thin",
    //     align: "center",
    //     fill: "white",
    //   });
  
    //   rage.addChild(name);
    // }               

    ComfyJS.Say('來自:' +creepNameList.join("、")+'的負能量，積壓已久民怨化作怪物誕生!!!其學會了現在最厲害小朋友的思路，且無懼於任何機關陷阱， 小心爆炸!!!');

    populationMoster = new Population(1, creepNameList.join(" & "), 2,true);

    // 複製目前存活AI 避免弱智新生兒 拖累進度
    populationMoster.copyAliveBrain();

    populations.push(populationMoster);

    born.play();
    
    cheerfulAnnoyance.loop = true;
    cheerfulAnnoyance.play();

    creepNameList =[];
  }



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

  game.load.spritesheet("img_explosion", "explosion.png", 32, 32);

  game.load.spritesheet("killmark", "killmark.png", 32, 32);

  // 筷子
  game.load.spritesheet("chopsticks", "chopsticks.png", 32, 32);
  

  //按鈕
  game.load.spritesheet('muteBtn', 'mute.png', 170, 150);
  game.load.spritesheet('cameraEffectBtn', 'cameraEffect.png', 100, 100);

  game.load.image("wall", "wall.png");
  game.load.image("ceiling", "ceiling.png");
  game.load.image("normal", "normal.png");
  game.load.image("nails", "nails.png");

  game.load.image("cutPlate", "cutPlate.png"); // 切筷子專用

  game.load.image("rage", "rage.png");
  game.load.image("smallceiling", "smallceiling.png");

  game.load.image("kappa", "kappa.png");
  game.load.image("LUL", "LUL.png");
  game.load.image("BibleThump", "BibleThump.png");
  game.load.image("ssssss", "ssssss.png");
  
  game.load.image("logo_player0", "logo_player0.png");
  game.load.image("kill_player0", "kill_player0.png");
  

  game.load.image("logo_player1", "logo_player1.png");
  game.load.image("kill_player1", "kill_player1.png");

  game.load.image("logo_player2", "logo_player2.png");

  game.load.image("logo_player3", "logo_player3.png");

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
  game.load.audio("rageSound", "/sounds/rageSound.mp3");
  game.load.audio("explosion", "/sounds/explosion.mp3");
  game.load.audio("cheerfulAnnoyance", "/sounds/CheerfulAnnoyance.mp3");
  game.load.audio("cut", "/sounds/cut.mp3");
  game.load.audio("cutDone", "/sounds/cutDone.mp3");
  
  

  // 批次讀取韓導聲音
  for (var i = 1; i < 100 ;i ++) {

    game.load.audio("hanVoice (" + i +")", "/sounds/hanVoice/hanVoice (" + i +").mp3");
    
  }

  // 批次讀取小英聲音
  for (var i = 1; i < 11 ;i ++) {

    game.load.audio("tsaiVoice (" + i +")", "/sounds/tsaiVoice/tsaiVoice (" + i +").mp3");
    
  }


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

  populationHan = new Population(50, "BOT", 0);

  populationTsai = new Population(50, "BOT", 1);

  populationChiu =  new Population(50, "BOT", 3);

  // 先後順序會影像 影像前後，後放的可以蓋過前面
  populations.push(populationTsai);
  populations.push(populationHan);
  populations.push(populationChiu);
  

  // createPlayer();
  // createTextsBoard();


  // 靜音按鈕
  muteBtn = game.add.button(950, 50, 'muteBtn', muteBtnOnClick, this, 2, 1, 0);
  muteBtn.scale.setTo(0.3, 0.3);

  // 關閉鏡頭特效按鈕
  cameraEffectBtn = game.add.button(900, 30, 'cameraEffectBtn', cameraEffectBtnOnClick, this, 0, 0, 0);
  cameraEffectBtn.scale.setTo(0.7, 0.7);

  //指令文字
  var textStyle= { font: "bold 48px Gothic", fill: "#ffffff", align:"center"};
  var textStyleI= { font: "bold 36px Gothic", fill: "#ffffff", align:"center"};
  game.add.text(800,100, "指令:", textStyle);
  // game.add.text(800,160, "!join_b", textStyleI);
  // game.add.text(800,210, "!join_g", textStyleI);
  // game.add.text(800,260, "!kill_b", textStyleI);
  // game.add.text(800,310, "!kill_g", textStyleI);
  // game.add.text(800,360, "!rage", textStyleI);
  
  //遊戲背景顏色
  game.stage.backgroundColor = "#4488AA";


  img_Kappa = game.add.sprite(800,160, 'kappa');
  img_Kappa.scale.setTo(0.20, 0.20);

  game.add.text(890,180, "          =", textStyleI);

  game.add.sprite(1010,160, 'logo_player0').scale.setTo(2,2);;

  game.add.sprite(800,260, 'kappa').scale.setTo(0.20, 0.20);
  game.add.sprite(870,260, 'kappa').scale.setTo(0.20, 0.20);

  game.add.text(890,280, "          =", textStyleI);
  
  game.add.sprite(1010,260, 'kill_player0').scale.setTo(2,2);;
  

  img_LUL = game.add.sprite(800,360, 'LUL');
  img_LUL.scale.setTo(0.20, 0.20);

  game.add.text(890,380, "          =", textStyleI);

  game.add.sprite(1010,360, 'logo_player1').scale.setTo(2,2);;

  game.add.sprite(800,460, 'LUL').scale.setTo(0.20, 0.20);;
  game.add.sprite(870,460, 'LUL').scale.setTo(0.20, 0.20);;

  game.add.text(890,480, "          =", textStyleI);

  game.add.sprite(1010,460, 'kill_player1').scale.setTo(2,2);;

  img_BibleThump = game.add.sprite(800,560, 'BibleThump');
  img_BibleThump.scale.setTo(0.20, 0.20);

  game.add.text(890,580, "X 20  =", textStyleI);

  game.add.sprite(1010,580, 'smallceiling').scale.setTo(2,2);;

  img_ssssss = game.add.sprite(800,660, 'ssssss');
  img_ssssss.scale.setTo(0.20, 0.20);

  game.add.text(890,680, "X 2  =", textStyleI);

  game.add.sprite(1010,680, 'logo_player2').scale.setTo(2,2);;

  
  // 排名系統
  game.add.text(1100,100, "最佳排名:", textStyle);


  


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

  deadnumberG.innerHTML = populationTsai.turnDead;
  deadnumberB.innerHTML = populationHan.turnDead;

  numberG.innerHTML = populationTsai.nowAlive;
  numberB.innerHTML = populationHan.nowAlive;

  var allDone = 0;

  for (let i = 0; i < populations.length; i++) {

    if (!populations[i].done()) {
      
      populations[i].update();
            
    }
    else {
      allDone++;
    }

  }

  // 兩個家族都死光 (有時有怪物時 會大於2)
  if (allDone >=populations.length) {
    // Restart because this generation all died


    // recolorImage(img,255,255,0,11,28,214)

    // 先將玩家排序分數，新排行榜
    checkNewRank();
    console.log("restart");
    restart();
    return;
  }



  updatePlatforms();
  updateChopSticks(); // 更新筷子 資訊

  createPlatforms();
  createChopsticks(); // 創建筷子

  // 群眾憤怒
  // if(rage)
  // {
  //   if (rage.body.position.y > 400) {
  //     rage.destroy();      
  //   }    
  // }

  rageNumber.innerText = rageNameList.length;
  
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
  cut = game.add.audio("cut");
  cutDone = game.add.audio("cutDone");

    // 批次加入韓導聲音
    for (var i = 1; i < 100 ;i ++) {

      var hanVoice = game.add.audio("hanVoice (" + i +")");

      hanVoices.push(hanVoice);
      
    }

    // 批次加入小英聲音
    for (var i = 1; i < 11 ;i ++) {

      var tsaiVoice = game.add.audio("tsaiVoice (" + i +")");

      tsaiVoices.push(tsaiVoice);
    }
     
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

function createChopsticks() {
  // console.log(platforms);
  // Find the last platform created and keep distance
  const lastChopsticks = chopsticksList[chopsticksList.length - 1];
  if (lastChopsticks) {
    const { y } = lastChopsticks;

    const movedBy = gameHeight - y;
    if (movedBy > 100) {
      createOneChopsticks();
    }

    return;
  } 
  createOneChopsticks();

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
    if (!breakNewRocord) {
      newRecord.play();
      breakNewRocord = true;
    }


    recordScore = distance;
    record.innerHTML = recordScore;
  }

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
  var x = Math.random() * (gameWidth - 96 * scale - 40 * scale) + 20 * scale;
  var y = gameHeight;
  var rand = Math.random() * 100;

  let platformType = "normal";

  if (rand < 10) {
    platform = game.add.sprite(x, y, "cutPlate");
  }
  else if (rand < 50) {
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

function createOneChopsticks() {
  var chopsticks;
  var x = Math.random() * (gameWidth - 96 * scale - 40 * scale) + 20 * scale;

  
  
  // var y = gameHeight; // 用這個的話，筷子永遠跟某一個板塊平行
 
  var y = gameHeight + Math.random() * gameHeight;
  var rand = Math.random() * 100;
  
  // if (rand < 90) {
  //   chopsticks = game.add.sprite(x, y, "chopsticks");
  // }

  // 只有一種筷子好像也不必用機率分布來算
  chopsticks = game.add.sprite(x, y, "chopsticks");
  
  chopsticks.scale.setTo(scale, scale);
  game.physics.arcade.enable(chopsticks);
  chopsticks.body.immovable = true;

  // platform.body.checkCollision.down = false;
  // platform.body.checkCollision.left = false;
  // platform.body.checkCollision.right = false;
  // platform.platformType = platformType;
  chopsticks.platformType = 'chopsticks';
  
  chopsticksList.push(chopsticks);
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
    if (platform.Explodede) {
      platform.destroy();
      platforms.splice(i, 1);
    }
  }
}

function updateChopSticks() {
  for (var i = 0; i < chopsticksList.length; i++) {
    var chopsticks = chopsticksList[i];

    // 地板移動速度 受到常數加成
    chopsticks.body.position.y -= 2 * gameSpeed;

    if (chopsticks.body.position.y <= -32) {
      chopsticks.destroy();
      chopsticksList.splice(i, 1);
    }
    if (chopsticks.Explodede) {
      chopsticks.destroy();
      chopsticksList.splice(i, 1);
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
  
  chopsticksList.forEach(function (s) {
    s.destroy();
  });
  chopsticksList = [];

  
  distance = 0;
  breakNewRocord = false;

  // population.naturalSelection();

  // 把後面MOSTER 族群移掉
  if(populations.length >=3)
  {
    // 只取前面三個 家族(han tsai chiu)
    populations = populations.slice(0,3)
  }


  for (let i = 0; i < populations.length; i++) {

    populations[i].naturalSelection();
  }

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
    rankPopulation = rankPopulation.concat(populations[i].players);
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
  
  // 前五名
  rankList = rankPopulation.slice(0,6);

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
    var rank = game.add.text(1100,160 + i*100, i+1 +".", textStyleI);    

    var logo_player = game.add.sprite(1140,160 + i*100, 'logo_player' + rankList[i].species);

    logo_player.scale.setTo(2,2);

    var familyName = game.add.text(1140,200 + i*100, rankList[i].familyName + " " + rankList[i].gen +" 世", textStyleII);    

    var score = game.add.text(1220,160+ i*100,+ rankList[i].score, textStyleI);    


    rankObjectList.push(rank);
    rankObjectList.push(logo_player);
    rankObjectList.push(familyName);
    rankObjectList.push(score);

  }

}


