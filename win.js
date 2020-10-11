
var winState =
{
  preload : function () {

    status = "win";
    
    game.load.baseURL = "./assets/";
    game.load.crossOrigin = "anonymous";

       
  },create : function ()
  { 
    
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


  var winner = 'The T population & The B population';

  if(populationTEnd)
  {
    winner = 'The B population';
    var winplayer = game.add.sprite(200+ gameWidth / 2, 400, 'winB');

  }
  else if(populationBEnd)
  {
    winner = 'The T population';
    var winplayer = game.add.sprite(200+ gameWidth / 2, 400, 'winT');
  }
  else if(!populationTEnd &&!populationBEnd)
  {
    winner = 'The T population & The B population';
    var winplayerT = game.add.sprite(-200+ gameWidth / 2, 400, 'winT');
    var winplayerB = game.add.sprite(400+ gameWidth / 2, 400, 'winB');

  }


  // 倒數計時: 差值
  
  var gameWintime = new Date().getTime(); // 獲取當前毫秒數  
  var costTime = (gameWintime - gameStartime) / 1000; // ** 以秒為單位
  var sec = parseInt(costTime % 60); // 秒
  var min = parseInt((costTime / 60) % 60); // 分 ex: 90秒
  var hr = parseInt(costTime / 60 / 60); // 時


  var thxText = game.add.text(200+ gameWidth / 2, 200,'You guys are so Awesome!!! ' ,{font: '30px Courier',fill:'#ffffff'})
  var timeText = game.add.text(200+ gameWidth / 2, 300,'Time cost:' + hr +'hr ' + min +'min ' + sec + 'sec ' ,{font: '30px Courier',fill:'#ffffff'})
  var wnnerText = game.add.text(200+ gameWidth / 2, 400,winner + ' win this time.',{font: '30px Courier',fill:'#ffffff'})

  
    
  },
  update : function() 
  {
    

  }  
}







