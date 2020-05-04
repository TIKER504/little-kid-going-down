// 遊戲特效果管理中心，統一管理 簡潔程式
class GameEffectCenter {
  constructor(enabled) {    
    this.enabled = enabled;
  }

  cameraShake(intense,duration) {
    if(this.enabled)    
    {
      // 搖鏡頭
      game.camera.shake(intense, duration);
    }       
  }

  cameraFlash(colorCode,duration) {
    if(this.enabled)    
    {
      // 搖鏡頭
      game.camera.flash(colorCode, duration);
    }       
  }

  
  
}
