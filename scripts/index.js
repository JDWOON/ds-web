import MainScene from './scenes/main-scene.js'

var config = {
    type: Phaser.AUTO,
    width: 640,
    height: 480,
	pixelArt: true,
    physics: {
        default: 'arcade'
    },
	scene: [
		MainScene
	]
};

var game = new Phaser.Game(config);
