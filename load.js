var status = "loading";

// 檢查 twitch 聊天室內容

// ComfyJS.Init("chimera4956");

// 這個可以 Oauth 授權成功!!!!! 痛哭流涕
ComfyJS.Init("funmoon504", "oauth:1wr03xndowkqnn70fqhw4eujlxmnc2");

// 這是node.js 的套件，先用html 解決之後一起整理。
// var ComfyJS = require("comfy.js");

var initial = false;

var loadState =
{
  preload : function () {

    game.add.text(80,150,'loading...',{font: '30px Courier',fill:'#ffffff'})
    game.load.baseURL = "./assets/";
    game.load.crossOrigin = "anonymous";
  
    if(!initial)
    {
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
    game.load.spritesheet("chopsticks", "chopsticks.png", 32, 14);
    
  
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
    game.load.audio("pistolFire", "/sounds/pistolFire.mp3");
  
    
    
  
    // 批次讀取韓導聲音
    for (var i = 1; i < 100 ;i ++) {
      // game.load.audio("hanVoice (" + i +")", "/sounds/hanVoice/hanVoice (" + i +").mp3");    
    }
  
    // 批次讀取小英聲音
    for (var i = 1; i < 11 ;i ++) {
      // game.load.audio("tsaiVoice (" + i +")", "/sounds/tsaiVoice/tsaiVoice (" + i +").mp3");    
    }


    }
    
    initial = true;
  
  },create : function ()
  {
    game.state.start('play');
  }
}







