let showBest = true;

class Population {
  constructor(size,FamilyName,species,isMonter) {
    this.players = [];
    this.bestPlayer;
    this.bestFitness = 0;
    this.generation = 0;
    this.matingPool = [];
    this.turnDead = 0;
    this.beginLevel = 1;
    this.nowAlive = 0;

    // 假如有傳家族名子，統一命名，要不然就是系統隨機    
    if(FamilyName)
    {
      if(isMonter)
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

  newMember(name,species)
  {
    var newMember = new Player(name, this.generation,species);

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
    }

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

  done() {
    for (var i = 0; i < this.players.length; i++) {
      if (!this.players[i].dead) {
        return false;
      }
    }

    return true;
  }
}
