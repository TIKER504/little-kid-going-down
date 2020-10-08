var crossingTime = 30;

countDownObjectList = [];

// crossing 階段可以使用的代幣
crossingRewardIDList = [];

// join B population
crossingRewardIDList.push('f43a4039-41c0-45b4-bb87-71e2ddf1d91f');
// join T population
crossingRewardIDList.push('44227033-e641-4450-be45-d402dc0e111d');

// wait for join Name List
WaitForJoinNameList_B = [];
WaitForJoinNameList_T = [];


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

        populationB.newMember(user, 5);

        ComfyJS.Say(user+' join B population');
      
        //  // 隨機播放 小英金句
        //  tsaiVoices[(1+ Math.floor(Math.random()*10))].play();
      }

      // join T population
      if(extra.customRewardId==='44227033-e641-4450-be45-d402dc0e111d')
      {      
        populationT.newMember(user, 4);

        ComfyJS.Say(user+' join T population');

        // // 隨機播放 韓導金句100
        // hanVoices[(1+ Math.floor(Math.random()*99))].play();
      }
    }
    else
    {
      // join B population later
      if(extra.customRewardId==='f43a4039-41c0-45b4-bb87-71e2ddf1d91f')
      {
        // 先將名字加入，之後Crossing floor 在補加
        WaitForJoinNameList_B.push(user);

        ComfyJS.Say('Sorry,this generation has alredy started, ' + user + ' will join B population in next crossing floor');
            
      }

      // join T population later
      if(extra.customRewardId==='44227033-e641-4450-be45-d402dc0e111d')
      {      
        // 先將名字加入，之後Crossing floor 在補加
        WaitForJoinNameList_T.push(user);

        ComfyJS.Say('Sorry,this generation has alredy started, '+ user + ' will join T population in next crossing floor');
      
      }      
    }   
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

  // 表情符號
  if(message==="LUL")
  {
    // G家族新成員
   populationRedGirl.newMember(user, 1);

   ComfyJS.Say(user+'加入綠軍新生兒');
  
   // 隨機播放 小英金句
   tsaiVoices[(1+ Math.floor(Math.random()*10))].play();
  }

  if(message==="Kappa")
  {
   // B家族新成員
   populationGreenGuy.newMember(user, 0);

   ComfyJS.Say(user+'加入藍軍新生兒');

   // 隨機播放 韓導金句100
   hanVoices[(1+ Math.floor(Math.random()*99))].play();
  }

  if(message==="PogChamp")
  {
   // C家族新成員
   populationDoge.newMember(user, 3);

   if (!cut.isPlaying) {
    cut.play(); // 夾筷子音效
  }

   ComfyJS.Say(user+'加入市議員新生兒');
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

      rageSound.play();

      ComfyJS.Say('這就是萬民的憤怒!!!來自眾英雄:' +rageNameList.join("、")+'，感受眾志成城的壓迫感吧!!!');

      rageNameList =[];

    }
  }   
}

var crossState =
{
  preload : function () {

    status = "crossing";
    
    game.load.baseURL = "./assets/";
    game.load.crossOrigin = "anonymous";

       
  },create : function ()
  { 
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


  // 地板
  let normal800 = game.add.sprite(0, 800, "normal400");
  normal800.scale.setTo(5, scale);
  game.physics.arcade.enable(normal800);
  normal800.body.immovable = true;

  otherPlates.push(normal800);


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
  }

  var crossingText = game.add.text(400 + gameWidth / 2, 400,'crossing...',{font: '30px Courier',fill:'#ffffff'})
  
  
  for (let i = 0; i < populations.length; i++) {

    populations[i].naturalSelection();
  }

  for (let i = 0; i < WaitForJoinNameList_B.length; i++) {

    populationB.newMember(WaitForJoinNameList_B[i], 5);

    ComfyJS.Say(WaitForJoinNameList_B[i]+' join B population');
  }

  for (let i = 0; i < WaitForJoinNameList_T.length; i++) {

    populationT.newMember(WaitForJoinNameList_T[i], 5);

    ComfyJS.Say(WaitForJoinNameList_T[i]+' join T population');
  }

  WaitForJoinNameList_B=[];
  WaitForJoinNameList_T=[];


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
  var interval = setInterval(function() {  // 設置倒數計時: 結束時間 - 當前時間      
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

    var countDownText = game.add.text(200+ gameWidth / 2, 400,'Next generation will start...in ' +crossingTime+'s',{font: '30px Courier',fill:'#ffffff'})

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

  // 倒數結束
  if(crossingTime<= 0)
  {
    // 把 cross 場景的地板清光
    otherPlates.forEach(function (s) {
      s.destroy();
    });
    otherPlates = [];

    game.state.start('play');     

  }


  }
}






