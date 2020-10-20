status = "preloading";

var loadingGIFS;

var preloadState =
{
  preload : function () {
 
    // 這邊才再load 圖片太慢，再做一個proloadState
    game.load.baseURL = "./assets/";
    game.load.crossOrigin = "anonymous";
    game.load.spritesheet("loadingGIFSprite", "loadingGIFSprite.png",300,200);
         
  },create : function ()
  {        
    status = "loading";
    game.state.start('load');
  }
}







