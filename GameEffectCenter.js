// 遊戲特效果管理中心，統一管理 簡潔程式
class GameEffectCenter {
  constructor() {    
    
  }

  cameraShake(intense,duration) {
    if(useCameraEffect)    
    {
      // 搖鏡頭
      game.camera.shake(intense, duration);
    }       
  }

  cameraFlash(colorCode,duration) {
    if(useCameraEffect)    
    {
      // 閃鏡頭
      game.camera.flash(colorCode, duration);
    }       
  }

  
  
}
