// 畫布寬度
// const canvasWidth = 1800;
// const canvasHeight = 800;

const canvasWidth = 1800;
const canvasHeight = 950;


var game = new Phaser.Game(canvasWidth, canvasHeight, Phaser.AUTO, "");

game.state.add('preload',preloadState);
game.state.add('load',loadState);
game.state.add('preplay',preplayState);
game.state.add('play',playState);
game.state.add('cross',crossState);
game.state.add('win',winState);




game.state.start('preload');






