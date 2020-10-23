var crossingTime = 30;

countDownObjectList = [];

var crossingTimeInterval;

// crossing 階段可以使用的代幣
crossingRewardIDList = [];

// join B population
crossingRewardIDList.push('f43a4039-41c0-45b4-bb87-71e2ddf1d91f');
// join T population
crossingRewardIDList.push('44227033-e641-4450-be45-d402dc0e111d');

// wait for join Name List
WaitForJoinNameList_B = [];
WaitForJoinNameList_T = [];

var lineB;


ComfyJS.onChat =( user, message, flags, self, extra )=>
{
  // log 紀錄
  // console.log( message +" was typed in chat" + "(" + user + ")");

  //代幣系列
  // 只有在 crossing 階段 才開放代幣加入
  
  if(crossingRewardIDList.includes(extra.customRewardId))
  {
    if(status === "crossing")
    {
      // join B population
      if(extra.customRewardId==='f43a4039-41c0-45b4-bb87-71e2ddf1d91f')
      {
        // 也顯示使用者的話
        populationB.newMember(user, 5,message);

        ComfyJS.Say(user+' join The B population');

         // B 軍 說話
        populations[1].speech(5)
      
      }

      // join T population
      if(extra.customRewardId==='44227033-e641-4450-be45-d402dc0e111d')
      {      
        // 也顯示使用者的話
        populationT.newMember(user, 4,message);

        ComfyJS.Say(user+' join The T population');

        // T 軍 說話
        populations[0].speech(4)
      }
    }
    else
    {
      // join B population later
      if(extra.customRewardId==='f43a4039-41c0-45b4-bb87-71e2ddf1d91f')
      {
        var userData = new User(user, message);

        // 先將使用者資料加入，之後Crossing floor 在補加
        WaitForJoinNameList_B.push(userData);

        ComfyJS.Say('Sorry,this generation has alredy started, ' + user + ' will join B population in next crossing floor');
            
      }

      // join T population later
      if(extra.customRewardId==='44227033-e641-4450-be45-d402dc0e111d')
      {      
        var userData = new User(user, message);

        // 先將使用者資料加入，之後Crossing floor 在補加
        WaitForJoinNameList_T.push(userData);

        ComfyJS.Say('Sorry,this generation has alredy started, '+ user + ' will join T population in next crossing floor');
      
      }      
    }   
  }

    
  // 人民的法槌
  // if(extra.customRewardId==='b901ce1d-a862-4362-aadb-c553310eee1f')
  // {
  //   rage = game.add.sprite(0,0, "rage");
  //   game.physics.arcade.enable(rage);
  //   // rage.body.immovable = true;
  //   rage.body.gravity.y = gameHeight;
    
  //   var name = new Phaser.Text(game, 3, -60,user+"表示:" + message , {
  //     fontSize: 80,
  //     // fontWeight: "thin",
  //     align: "center",
  //     fill: "white",
  //   });

  //   rage.addChild(name);
              
  //   rageSound.play();

  //   ComfyJS.Say(user +'一氣之下直接花費小朋友幣召喚天降之槌');
  // }

  // // 表情符號
  // if(message==="LUL")
  // {
  //   // G家族新成員
  //  populationRedGirl.newMember(user, 1);

  //  ComfyJS.Say(user+'加入綠軍新生兒');
  
  //  // 隨機播放 小英金句
  //  tsaiVoices[(1+ Math.floor(Math.random()*10))].play();
  // }

  // if(message==="Kappa")
  // {
  //  // B家族新成員
  //  populationGreenGuy.newMember(user, 0);

  //  ComfyJS.Say(user+'加入藍軍新生兒');

  //  // 隨機播放 韓導金句100
  //  hanVoices[(1+ Math.floor(Math.random()*99))].play();
  // }

  // if(message==="PogChamp")
  // {
  //  // C家族新成員
  //  populationDoge.newMember(user, 3);

  //  if (!cut.isPlaying) {
  //   cut.play(); // 夾筷子音效
  // }

  //  ComfyJS.Say(user+'加入市議員新生兒');
  // }
   

  // if(message==="BibleThump")
  // {
  //   // console.log("!rage was typed in chat" + "(" + user + ")");

  //   rageNameList.push(user);
  //   // // 網頁支援朗讀文字 (英文 中文之間 有空一格 會是不同的語音，英文的配音無法直接連讀英中文一起)
  //   // var msg = new SpeechSynthesisUtterance(user+'貢獻了人民的法槌，還差一點點了 大家加油');
  //   // msg.rate = 4; // 0.1 to 10
  //   // msg.pitch = 1; //0 to 2        
  //   // window.speechSynthesis.speak(msg);

  //   // // 網頁支援朗讀文字 (英文 中文之間 有空一格 會是不同的語音，英文的配音無法直接連讀英中文一起)
  //   // var msg_ch = new SpeechSynthesisUtterance('貢獻了人民的法槌，還差一點點了 大家加油');

  //   // var voices = window.speechSynthesis.getVoices();
  //   // msg_ch.voice = voices[10]; // Note: some voices don't support altering params
  //   // // msg.voiceURI = 'native';
  //   // // msg.volume = 1; // 0 to 1
  //   // msg_ch.rate = 4; // 0.1 to 10
  //   // msg_ch.pitch = 1; //0 to 2
  //   // // msg.text = 'Hello World';
  //   // msg_ch.lang = 'zh-tw';
  //   // window.speechSynthesis.speak(msg_ch);
  //   // // msg.onend = function(e) {
  //   // //   console.log('Finished in ' + event.elapsedTime + ' seconds.');
  //   // // };

  //   if(rageNameList.length ==1)
  //   {      
  //   var msg = new SpeechSynthesisUtterance(user+'首先發難舉起了人民法槌' );

  //   ComfyJS.Say(user+'首先發難舉起了人民法槌'+'(' + rageNameList.length +"/20)");

  //   msg.rate = 4; // 0.1 to 10
  //   msg.pitch = 1; //0 to 2        
  //   window.speechSynthesis.speak(msg);


  //   }

  //   if(rageNameList.length >=2 &&rageNameList.length <=7)
  //   {      
  //   var msg = new SpeechSynthesisUtterance(user+'響應人民法槌行列步步向前');

  //   ComfyJS.Say(user+'響應人民法槌行列步步向前'+'(' + rageNameList.length +"/20)");

  //   msg.rate = 4; // 0.1 to 10
  //   msg.pitch = 1; //0 to 2        
  //   window.speechSynthesis.speak(msg);
  //   }

  //   if(rageNameList.length >=8 &&rageNameList.length <=14)
  //   {      
  //   var msg = new SpeechSynthesisUtterance(user+'忍無可忍手握法槌一磚一瓦築起制裁之牆');

  //   ComfyJS.Say(user+'忍無可忍手握法槌一磚一瓦築起制裁之牆'+'(' + rageNameList.length +"/20)");

  //   msg.rate = 4; // 0.1 to 10
  //   msg.pitch = 1; //0 to 2        
  //   window.speechSynthesis.speak(msg);
  //   }

  //   if(rageNameList.length >=15 &&rageNameList.length <=19)
  //   {      
  //   var msg = new SpeechSynthesisUtterance(user+'手握憤怒法槌制裁之牆即將降下驅逐所有玩家');

  //   ComfyJS.Say(user+'手握憤怒法槌制裁之牆即將降下驅逐所有玩家'+'(' + rageNameList.length +"/20)");

  //   msg.rate = 4; // 0.1 to 10
  //   msg.pitch = 1; //0 to 2        
  //   window.speechSynthesis.speak(msg);
  //   }



  //   if(rageNameList.length >=20)
  //   {
  //     rage = game.add.sprite(0,0, "rage");
  //     game.physics.arcade.enable(rage);
  //     // rage.body.immovable = true;
  //     rage.body.gravity.y = gameHeight;


  //     var lineNumber = 1;

  //     lineNumber = Math.ceil(rageNameList.length/3)


  //     for(i = 1; i<=lineNumber; i++)
  //     {
  //       var name = new Phaser.Text(game, 3, -60 *i,rageNameList.slice((i-1)*3,(i*3)).join(",") , {
  //         fontSize: 50,
  //         // fontWeight: "thin",
  //         align: "center",
  //         fill: "white",
  //       });
    
  //       rage.addChild(name);
  //     }

  //     rageSound.play();

  //     ComfyJS.Say('這就是萬民的憤怒!!!來自眾英雄:' +rageNameList.join("、")+'，感受眾志成城的壓迫感吧!!!');

  //     rageNameList =[];

  //   }
  // }   


}

// ComfyJS.onJoin =( user, self, extra ) =>
// {

//   ComfyJS.Say(user+' join The Chat');

// }

// ComfyJS.onPart =( user, self, extra ) =>
// {

//   ComfyJS.Say(user+' leave The Chat');

// }

var crossState =
{
  preload : function () {

    status = "crossing";
    
    game.load.baseURL = "./assets/";
    game.load.crossOrigin = "anonymous";

       
  },create : function ()
  { 
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
    

    crossingTime = 30;



    platforms.forEach(function (s) {
      s.destroy();
    });
    platforms = [];

    otherPlates.forEach(function (s) {
      s.destroy();
    });
    otherPlates = [];
    
    itemList.forEach(function (s) {
      s.destroy();
    });
    itemList = [];
  
    
    distance = 0;
    breakNewRocord = false;
    score.innerHTML = 'Crossing';
          
    // 把後面MOSTER 族群移掉
    if(populations.length >=5)
    {
      // 只取前面五個 家族(han tsai chiu T、B)
      populations = populations.slice(0,5)
    }


  


  
 

  const wallHeight = 400;
  const numberOfWalls = Math.round(gameHeight / 400) +1 ;
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

    let centerWall = game.add.sprite(canvasWidth/2 - 17, wallHeight * index, "wall");

    game.physics.arcade.enable(centerWall);
    centerWall.body.immovable = true;

    otherPlates.push(centerWall);
  }

  const numberOfBase = Math.round(canvasWidth / 800) +1 ;

  for (let index = 0; index < numberOfBase; index++) {

    // 地板
    let normal800 = game.add.sprite(800 * index, 800, "normal400");
    normal800.scale.setTo(scale, scale);
    game.physics.arcade.enable(normal800);
    normal800.body.immovable = true;
  
    otherPlates.push(normal800);  
  }

  var crossingText = game.add.text(400 + gameWidth / 2, 400,'crossing...',{font: '30px Courier',fill:'#ffffff'})
  
  
  for (let i = 0; i < populations.length; i++) {

    populations[i].naturalSelection();
  }

  game.add.text(gameWidth / 2, 100,"Now,it's crossing floor,Using channel memeCoin for Joining the evolution" ,{font: '30px Courier',fill:'#ffffff'})

  for (let i = 0; i < WaitForJoinNameList_B.length; i++) {

    populationB.newMember(WaitForJoinNameList_B[i].name, 5,WaitForJoinNameList_B[i].words);

    // B 軍 說話
    populations[1].speech(5)

    ComfyJS.Say(WaitForJoinNameList_B[i].name+' join B population');
  }

  for (let i = 0; i < WaitForJoinNameList_T.length; i++) {

    populationT.newMember(WaitForJoinNameList_T[i].name, 4,WaitForJoinNameList_T[i].words);

    // T 軍 說話
    populations[0].speech(4)

    ComfyJS.Say(WaitForJoinNameList_T[i].name+' join T population');
  }

  WaitForJoinNameList_B=[];
  WaitForJoinNameList_T=[];

  // 畫表現折線圖
  // var lineB = new Phaser.Line(200, 400, 700, 400);
  // game.stage.backgroundColor = '#124184';

  // lineB = new Phaser.Line(200, 400, 700, 400);
  // // var lineB = new Phaser.Line(rightWalls[0].x, rightWalls[0].y, leftWalls[0].x, leftWalls[0].y);

   // add a graphics object to the world
  //  var gra = game.add.graphics(game.world.centerX, game.world.centerY);
 
  //  // make it a red rectangle
  //  gra.lineStyle(3, 0xff0000);

  //  // start by moving to a point
  //  gra.moveTo(0, 0);

  //  // draw a line
  //  gra.lineTo(100, 0);

  
  // function buffer() {      

  //   // 把 cross 場景的地板清光
  //   otherPlates.forEach(function (s) {
  //     s.destroy();
  //   });
  //   otherPlates = [];

  //   game.state.start('play');      
  // }  
  
  // 延遲10 秒後 返回遊戲階段
  // setTimeout(buffer, 10000); 

  
  var timesRun = 0;
  crossingTimeInterval = setInterval(function() {  // 設置倒數計時: 結束時間 - 當前時間      
    if(timesRun === 30){
    clearInterval(interval);
    }    
    timesRun += 1;
    crossingTime--;
    
  }, 1000);

  crossingText.destroy();
  
  },
  update : function() 
  {
    if (status != "crossing") return;

    // 倒數
    // 印之前，先把舊的畫面排名物件清掉，否則圖會一直疊
    for (let i = 0; i < countDownObjectList.length; i++) {
      
      countDownObjectList[i].destroy();
    }

    countDownObjectList = [];
    
    var countDownText = game.add.text(200+ gameWidth / 2, 300,'Next generation will start in ' +crossingTime+'s...',{font: '30px Courier',fill:'#ffffff'})

    countDownObjectList.push(countDownText);
                              
    var allDone = 0;
  
    // 讓 cross 後的腳色 可以隨機移動
    for (let i = 0; i < populations.length; i++) {       
      if (!populations[i].done()) {            
        populations[i].update();  
      }
      else {
        allDone++;
      }  
    }

    // 加快倒數
    if (keyboard.a.isDown){
      crossingTime = crossingTime -10;
    }

  // 倒數結束
  if(crossingTime<= 0)
  {
      // 死光就閉嘴
    for (let i = 0; i < populations.length; i++) {
      if(populations[i].populationVoice)
      {
        populations[i].populationVoice.stop();
      }    
    }  

    clearInterval(crossingTimeInterval);

    // 把 cross 場景的地板清光
    otherPlates.forEach(function (s) {
      s.destroy();
    });
    otherPlates = [];

    game.state.start('play');     

  }


  }
}







