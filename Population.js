let showBest = true;

class Population {
  constructor(size,FamilyName,species,isMonster) {
    this.players = [];
    this.bestPlayer;
    this.bestFitness = 0;
    this.generation = 0;
    this.matingPool = [];
    this.turnDead = 0;
    this.beginLevel = 1;
    this.nowAlive = 0;
    this.isMonster =isMonster;
    this.populationVoice =undefined;
    // 說了幾段話
    this.populationSpeechCounter =0;

    // 假如有傳家族名子，統一命名，要不然就是系統隨機    
    if(FamilyName)
    {
      if(isMonster)
      {
        for (let i = 0; i < size; i++) {
          this.players.push(new Monster(FamilyName, this.generation,species));
          this.players[i].brain.generateNetwork();
          this.players[i].brain.mutate();
        }
      }
      else
      {
        for (let i = 0; i < size; i++) {
          this.players.push(new Player(FamilyName, this.generation,species));
          this.players[i].brain.generateNetwork();
          this.players[i].brain.mutate();
        }
      }
      
    }
    else
    {
      for (let i = 0; i < size; i++) {
        this.players.push(new Player(FamilyNames[i], this.generation,species));
        this.players[i].brain.generateNetwork();
        this.players[i].brain.mutate();
      }
    }


  }

  update() {
    this.updateAlive();
  }

  kill()
  {
    // 找一個來殺
    for (let i = 0; i < this.players.length; i++)
    {
      if (!this.players[i].dead ) {      
        this.players[i].life =0;     

        var killmark = game.add.sprite(this.players[i].player.x ,this.players[i].player.y, "killmark");

        killmark.scale.setTo(2,2);

        killmark.animations.add("killmark", [0, 1, 2, 3,4,5], 8).killOnComplete = true;;

        killmark.animations.play("killmark");

        this.players[i].healthBar.text = this.players[i].generateHealthBar(this.players[i].life =0);

        this.players[i].dead = true; 
        
        break;
      }
    }        
  }

  // 全殺
  killAll()
  {    
    for (let i = 0; i < this.players.length; i++)
    {
      if (!this.players[i].dead ) {      
        this.players[i].life =0;     

        var killmark = game.add.sprite(this.players[i].player.x ,this.players[i].player.y, "killmark");

        killmark.scale.setTo(2,2);

        killmark.animations.add("killmark", [0, 1, 2, 3,4,5], 8).killOnComplete = true;;

        killmark.animations.play("killmark");

        this.players[i].healthBar.text = this.players[i].generateHealthBar(this.players[i].life =0);

        this.players[i].dead = true;                 
      }
    }        
  }

  // 回到起始點重生 (brain、素質 相同)
  reBorn()
  {    
    var reBornList = [];

    for (let i = 0; i < this.players.length; i++)
    {
      if (!this.players[i].dead ) {      
                
        var newMember = new Player(this.players[i].familyName, this.generation,this.players[i].species);

        // 新隨機腦
        // newMember.brain.generateNetwork();
        // newMember.brain.mutate();

        //舊cross 後的腦
        newMember.brain = this.players[i].brain;

        reBornList.push(newMember);
      }
    }        

    // 重生後 說過的話數歸零
    this.populationSpeechCounter =0;

    this.players = reBornList.slice(0);
  }

  newMember(name,species,words)
  {
    var newMember = new Player(name, this.generation,species,words);

    newMember.brain.generateNetwork();
    newMember.brain.mutate();

    this.players.push(newMember);

  }

  // 複製目前還活著的AI 避免新生兒太笨的問題 拖累進度
  copyAliveBrain()
  {
    // 取得活大腦
    var aliveBrain;

    for (let i = 0; i < populations.length; i++) {
      if (!populations[i].done()) {
        for (let i2 = 0; i2 < populations[i].players.length; i2++)
        {
          if (!populations[i].players[i2].dead ) {      
            aliveBrain = populations[i].players[i2].brain;

            break;
          }
        }                             
      }              
    }


    // 遞給族群內所有人
    for (let i = 0; i < this.players.length; i++)
    {
      if (!this.players[i].dead ) {      
        this.players[i].brain = aliveBrain;        
      }
    }        
  }

  updateAlive() {

    var suddenlyDeadNumber = 0;

    var alive = 0;

    for (let i = 0; i < this.players.length; i++) {
      
      
      if (!this.players[i].dead ) {      

        // if(!this.players[i].isPlayingAnimation)
        // {
        //   this.players[i].look();
        //   this.players[i].think();
        // }        
        this.players[i].update();               

        alive++;
      }
      // 每6frame 才會更新一次行動邏輯，以節省效能
      if (!this.players[i].dead && this.players[i].passframe >=6 &&!this.players[i].isPlayingAnimation) {
        this.players[i].look();
        this.players[i].think();
        // this.players[i].update();        
        // 歸零
        this.players[i].passframe = 0;
      }
      else if(this.players[i].passframe <6)
      {
        this.players[i].passframe +=1;
      }
      // 計算死亡數
      else if (this.players[i].dead & !this.players[i].reportDead)
      {
        this.turnDead ++;
        this.players[i].reportDead = true;

        suddenlyDeadNumber++;
      }

      if(this.beginLevel ==0)
      {
        this.players[i].beginLevel = 0;
      }

    }

    // 雙殺以上 為多殺
    // if(suddenlyDeadNumber >2)
    // {
    //   multi_kill.play();

    //   // 搖鏡頭
    //   // game.camera.shake(0.05, 500);
    //   // 統一由 gec 管理，一齊控制開關
    //   gec.cameraShake(0.05, 500);
    // }

    // if (showBest && this.bestPlayer && !this.bestPlayer.dead) {
    //   this.bestPlayer.look();
    //   this.bestPlayer.think();
    //   this.bestPlayer.update();
    // }
    
    this.nowAlive = alive;
  }

  done() {
    for (let i = 0; i < this.players.length; i++) {
      if (!this.players[i].dead) {
        return false;
      }
    }

    return true;
  }

  naturalSelection() {
    this.calculateFitness();
    let averageSum = this.getAverageScore();
    let children = [];

    var crossoverTimes = 0;
    this.fillMatingPool();
    for (let i = 0; i < this.players.length; i++) {
      let parent1 = this.selectPlayer();
      let parent2 = this.selectPlayer();

      if (parent1.fitness > parent2.fitness)
      {
        children.push(parent1.crossover(parent2));
      }        
      else
      {
        children.push(parent2.crossover(parent1));
      } 

      crossoverTimes++;
    }

    // 清除舊家族
    this.players.forEach((element) => {
      element.destroy();
    });

    this.players.splice(0, this.players.length);
    this.players = children.slice(0);
    this.generation++;
    this.players.forEach((element) => {
      element.brain.generateNetwork();
    });

    console.log("Generation " + this.generation);

    generation.innerHTML = this.generation;

    this.bestPlayer.lifespan = 0;
    this.bestPlayer.dead = false;
    this.bestPlayer.score = 1;
  }

  calculateFitness() {
    let currentMax = 0;
    this.players.forEach((element) => {
      element.calculateFitness();
      if (element.fitness > this.bestFitness) {
        this.bestFitness = element.fitness;
        this.bestPlayer = element.clone();
        this.bestPlayer.brain.id = "BestGenome";

        // console.log("best player", this.bestPlayer);
        // this.bestPlayer.brain.draw();
      }

      if (element.fitness > currentMax) currentMax = element.fitness;
    });

    //Normalize
    this.players.forEach((element, elementN) => {
      element.fitness /= currentMax;
    });
  }

  // 分數高的個體，可以獲得較高的抽crossing加權
  fillMatingPool() {
    this.matingPool.splice(0, this.matingPool.length);
    this.players.forEach((element, elementN) => {
      let n = element.fitness * 100;
      for (let i = 0; i < n; i++) this.matingPool.push(elementN);
    });
  }

  selectPlayer() {
    let rand = Math.floor(Math.random() * this.matingPool.length);
    return this.players[this.matingPool[rand]];
  }

  getAverageScore() {
    let avSum = 0;
    this.players.forEach((element) => {
      avSum += element.score;
    });

    return avSum / this.players.length;
  }

  // population 死光
  done() {
    for (var i = 0; i < this.players.length; i++) {
      if (!this.players[i].dead) {
        return false;
      }
    }
    return true;
  }

  // 全家族一起演講(單聲道)
  speech(species) {
      // 隨機播放 B金句          
    if(species ===5)
    {          
      if(this.populationVoice===undefined)
      {
        this.populationVoice = BVoices[(1+ Math.floor(Math.random()*30))];
        this.populationVoice.play();
                
        // 話說完了
        this.populationVoice.onStop.add(function() {
          
          console.log("B_Speech " + this.populationSpeechCounter);

          if(this.populationSpeechCounter ==0)
          {
            freeze(10);
          }

          // 活著的傢伙 通通播演講動畫
          for (let i = 0; i < this.players.length; i++)
          {
            if (!this.players[i].dead ) {   
              this.players[i].isPlayingAnimation = false;              
            }
          }       


          this.populationSpeechCounter++;

        }, this);

      }

      if(!this.populationVoice.isPlaying)
      {
        this.populationVoice = BVoices[(1+ Math.floor(Math.random()*30))];
        this.populationVoice.play();

              
        // 話說完了
        this.populationVoice.onStop.add(function() {
          
          console.log("B_Speech " + this.populationSpeechCounter);

          if(this.populationSpeechCounter ==0)
          {
            freeze(10);
          }

          // 活著的傢伙 通通播演講動畫
          for (let i = 0; i < this.players.length; i++)
          {
            if (!this.players[i].dead ) {   
              this.players[i].isPlayingAnimation = false;              
            }
          }       


          this.populationSpeechCounter++;

        }, this);
      }
      
    }

    // 隨機播放 T金句          
    if(species ===4)
    {
      if(this.populationVoice===undefined)
      {
        this.populationVoice = TVoices[(1+ Math.floor(Math.random()*127))];
        this.populationVoice.play();

       // 話說完了
       this.populationVoice.onStop.add(function() {
          
        console.log("T_Speech " + this.populationSpeechCounter);

        if(this.populationSpeechCounter ==0)
        {
          freeze(10);
        }

          // 活著的傢伙 通通播演講動畫
          for (let i = 0; i < this.players.length; i++)
          {
            if (!this.players[i].dead ) {   
              this.players[i].isPlayingAnimation = false;              
            }
          }       

        this.populationSpeechCounter++;

      }, this);
      }
      if(!this.populationVoice.isPlaying)
      {
        this.populationVoice = TVoices[(1+ Math.floor(Math.random()*127))];
        this.populationVoice.play();

         // 話說完了
         this.populationVoice.onStop.add(function() {
          
          console.log("T_Speech " + this.populationSpeechCounter);

          if(this.populationSpeechCounter ==0)
          {
            freeze(10);
          }

          // 活著的傢伙 通通播演講動畫
          for (let i = 0; i < this.players.length; i++)
          {
            if (!this.players[i].dead ) {   
              this.players[i].isPlayingAnimation = false;              
            }
          }       


          this.populationSpeechCounter++;

        }, this);
      }
      
    }           

    // 活著的傢伙 通通播演講動畫
    for (let i = 0; i < this.players.length; i++)
    {
      if (!this.players[i].dead ) {   
        this.players[i].isPlayingAnimation = true;
        this.players[i].player.animations.play("speech",8,true);      
      }
    } 
  }


}




