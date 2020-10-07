var crossState =
{
  preload : function () {

    status = "crossing";

    game.add.text(400 + gameWidth / 2, 400,'crossing...',{font: '30px Courier',fill:'#ffffff'})

    game.load.baseURL = "./assets/";
    game.load.crossOrigin = "anonymous";
    

  },create : function ()
  { 
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
    score.innerHTML = 'Cross';
          
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
  
  
    for (let i = 0; i < populations.length; i++) {
  
      populations[i].naturalSelection();
    }

    function buffer() {      

      // 把 cross 場景的地板清光
      otherPlates.forEach(function (s) {
        s.destroy();
      });
      otherPlates = [];

      game.state.start('play');      
    }  
    
    setTimeout(buffer, 5000); 
  
  },
  update : function() 
  {
    if (status != "crossing") return;
                              
    var allDone = 0;
  
    for (let i = 0; i < populations.length; i++) {
       
      if (!populations[i].done()) {
            
      populations[i].update();
  
      }
      else {
        allDone++;
      }
  
    }
  }
}







