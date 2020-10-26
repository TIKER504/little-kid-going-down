status = "loading";

// 檢查 twitch 聊天室內容

// ComfyJS.Init("chimera4956");

// 這個可以 Oauth 授權成功!!!!! 痛哭流涕 (透過API連接到我的帳號)
ComfyJS.Init("funmoon504", "oauth:1wr03xndowkqnn70fqhw4eujlxmnc2");

// 這是node.js 的套件，先用html 解決之後一起整理。
// var ComfyJS = require("comfy.js");

var initialed = false;

var gameStartime;

var loadingGIFS;

var loadState =
{
  preload : function () {

    
    // 遊戲開始當前時間
    gameStartime = new Date().getTime(); // 獲取當前毫秒數  


    
    game.add.text(400 + gameWidth / 2, 400,'loading...',{font: '30px Courier',fill:'#ffffff'})

    // 這邊才再load 圖片太慢，再做一個proloadState
    // game.load.baseURL = "./assets/";
    // game.load.crossOrigin = "anonymous";

    // game.load.spritesheet("loadingGIFSprite", "loadingGIFSprite.png",300,200);

    loadingGIFS =game.add.sprite(350+ gameWidth / 2, 500, "loadingGIFSprite");
    loadingGIFS.animations.add("loading", [0, 1, 2, 3,4,5,6,7,8,9], 10, true);
    loadingGIFS.play("loading");
  
    if(!initialed)
    {
      // game.load.spritesheet("player", "player.png", 32, 32);
    game.load.spritesheet("player0", "player0.png", 32, 32);
    game.load.spritesheet("player1", "player1.png", 32, 32);
    game.load.spritesheet("player2", "player2.png", 32, 32);
    game.load.spritesheet("player3", "player3.png", 32, 32);
    game.load.spritesheet("player4", "player4.png", 32, 32);
    game.load.spritesheet("player5", "player5.png", 32, 32);
    game.load.spritesheet("player6", "player6.png", 32, 32);    
  
    game.load.spritesheet("img_explosion", "explosion.png", 32, 32);

    // game.load.spritesheet("smokeTele", "smokeTele.png", 60, 60);
    game.load.spritesheet("smoke", "smoke.png", 16, 16);
  
    game.load.spritesheet("killmark", "killmark.png", 32, 32);
  
    // 錢
    game.load.spritesheet("money", "money.png", 32, 14);

    // 表情符號(原圖為16*16 緊鄰的圖，但因為phaser bug 會造成Pixel bleeding 邊緣髒點現象，先暫時手動每個圖加邊緣成為18*18)
    game.load.spritesheet("emotion", "emotion.png", 18, 18);

    //紅水
    game.load.spritesheet("redpotion", "redpotion.png", 32, 32);

    // 大字報
    game.load.spritesheet("textPanel", "textPanel.png", 1200, 400);

    //頭盔
    game.load.spritesheet("helmet", "helmet.png", 32, 32);

    //巫師帽
    game.load.spritesheet("hat", "hat.png", 32, 32);
  
    //按鈕
    game.load.spritesheet('muteBtn', 'mute.png', 170, 150);
    game.load.spritesheet('cameraEffectBtn', 'cameraEffect.png', 100, 100);
  
    game.load.image("background", "background.png");
          
    game.load.image("wall", "wall.png");
    game.load.image("ceiling", "ceiling.png");
    game.load.image("normal", "normal.png");
    game.load.image("nails", "nails.png");
  
    game.load.image("normal400", "normal400.png");
  
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
  
    game.load.image("logo_player4", "logo_player4.png");
    
    game.load.image("logo_player5", "logo_player5.png");

    game.load.image("winT", "winT.png");
    game.load.image("winB", "winB.png");

  
    game.load.spritesheet("conveyorRight", "conveyor_right.png", 98, 16);
    game.load.spritesheet("conveyorLeft", "conveyor_left.png", 98, 16);
    game.load.spritesheet("trampoline", "trampoline.png", 96, 36);
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

    game.load.audio("bgm", "/sounds/bgm.mp3");

    game.load.audio("pistolFire", "/sounds/pistolFire.mp3");
    game.load.audio("cashIn", "/sounds/cashIn.mp3");
    game.load.audio("healSound", "/sounds/healSound.mp3");
    game.load.audio("monsterBite", "/sounds/monsterBite.mp3");
    game.load.audio("surprise", "/sounds/surprise.mp3");
    
    
   
      
    // 批次讀取T聲音
    for (var i = 1; i < 129 ;i ++) {
      game.load.audio("TVoice (" + i +")", "/sounds/TVoices/" + i + ".mp3");    
    }
  
    // 批次讀取B聲音
    for (var i = 1; i < 32 ;i ++) {
      game.load.audio("BVoice (" + i +")", "/sounds/BVoices/" + i + ".mp3");    
    }


    }
    
   
  
  },create : function ()
  {    
    
    status = "playing";
    game.state.start('play');
  }
}







