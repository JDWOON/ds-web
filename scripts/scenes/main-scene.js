import InventoryScene from './inventory-scene.js'

export default class MainScene extends Phaser.Scene {
    constructor () {
        super('MainScene');
    }

	preload () {
		this.load.tilemapTiledJSON('map', 'resource/map/test-tile.json');
		this.load.image('tiles1', 'resource/img/item/item.png');

		this.load.spritesheet('char', 'resource/img/char/100r.bmp',
	        { frameWidth: 32, frameHeight: 32 }
	    );

		this.load.audio('bgm', [
			'resource/bgm/Game5.mp3'
		]);
	}

	create () {
	    this.sound.pauseOnBlur = false;
	    var music = this.sound.add('bgm');
	    //music.play();

		['up', 'down', 'right', 'left'].forEach((item, i) => {
			this.anims.create({
				key: 'char-' + item,
				frames: this.anims.generateFrameNumbers('char', { frames: [(i*3),(i*3)+1,(i*3)+2,(i*3)+1] }),
				frameRate: 3,
				repeat: -1,
				transparent: true
			});
		});

		this.cameras.main.setBounds(0, 0, 3392, 640);
		this.physics.world.setBounds(0, 0, 3392, 640);

		var map = this.make.tilemap({ key: 'map' });
	    var tileset = map.addTilesetImage('item', 'tiles1');
	    var layer = map.createLayer('caosia', tileset, 0, 0);

	    this.cursors = this.input.keyboard.createCursorKeys();

	    this.player = this.physics.add.sprite(32*9+16, 32*6+16, 'char').setCollideWorldBounds(true);
		this.player.anims.play('char-down', true);
		this.player.setInteractive();

		this.cameras.main.startFollow(this.player, true, 1, 1);

	    //this.cameras.main.setZoom(4);
		this.input.on('pointerdown', function(pointer, a, b) {
			var clickX = layer.worldToTileX(this.cameras.main.scrollX + pointer.x),
				clickY = layer.worldToTileY(this.cameras.main.scrollY + pointer.y);
		
			var moveX = layer.tileToWorldX(clickX) + 16 - this.player.x,
				moveY = layer.tileToWorldY(clickY) + 16 - this.player.y;
		
			var distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.player.x + moveX, this.player.y + moveY);
			var duration = distance * 5; // 이동 속도를 조절할 수 있는 값입니다.
		
			if(this.playerTween !== undefined) {
				this.playerTween.stop();
			}
		
			this.player.anims.stop();
		
			this.playerTween = this.tweens.add({
				targets: this.player,
				x: this.player.x + moveX,
				y: this.player.y + moveY,
				duration: duration,
				onStart: function() {
					if(Math.abs(moveX) > Math.abs(moveY)){
						if(moveX < 0){
							this.player.anims.play('char-left', true);
						} else {
							this.player.anims.play('char-right', true);
						}
					} else {
						if(moveY < 0){
							this.player.anims.play('char-up', true);
						} else {
							this.player.anims.play('char-down', true);
						}
					}
				},
				onComplete: function() {
					this.player.anims.stop();
				},
				callbackScope: this
			});
		}, this);

		this.input.keyboard.on('keydown-' + 'W', function (event) {
			this.createWindow(InventoryScene);
		}, this);

		this.input.keyboard.on('keydown-' + 'Q', function (event) {
			if(music.isPlaying){
				music.pause();
			} else if(music.isPaused) {
				music.resume();
			} else {
				music.play();
			}
		}, this);
	}

	update () {
		this.player.setVelocity(0);

		if (this.cursors.left.isDown && this.cursors.right.isDown) {
		} else if (this.cursors.left.isDown) {
	        this.player.setVelocityX(-200);
		    this.player.anims.play('char-left', true);
	    } else if (this.cursors.right.isDown) {
	        this.player.setVelocityX(200);
		    this.player.anims.play('char-right', true);
	    }

		if (this.cursors.up.isDown && this.cursors.down.isDown) {
		} else if (this.cursors.up.isDown) {
	        this.player.setVelocityY(-200);
		    this.player.anims.play('char-up', true);
	    } else if (this.cursors.down.isDown) {
	        this.player.setVelocityY(200);
		    this.player.anims.play('char-down', true);
	    }
	}

    createWindow (func) {
        // var x = Phaser.Math.Between(400, 600);
        // var y = Phaser.Math.Between(64, 128);
		var x = 150, y = 150;

        var handle = func.handle;

		if(!this.scene.get(handle)) {
	        var win = this.add.zone(x, y, func.WIDTH, func.HEIGHT).setInteractive().setOrigin(0);

	        var demo = new func(handle, win);

	        this.input.setDraggable(win);

	        win.on('drag', function (pointer, dragX, dragY) {
				if(demo.scene.isActive()) {
		            this.x = dragX;
		            this.y = dragY;

		            demo.refresh();
				}
	        });

	        this.scene.add(handle, demo, true);
		} else if(this.scene.isVisible(handle)) {
			this.scene.sleep(handle);
		} else {
			this.scene.wake(handle);
		}
    }
}
