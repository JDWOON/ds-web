export default class InventoryScene extends Phaser.Scene {
	constructor (handle, parent) {
		super(handle);
		this.parent = parent;
	}

	preload () {
		this.load.image('inventory', 'resource/img/tpl/inven.png');
		this.load.image('inventory-title', 'resource/img/tpl/inven-title.png');
	}

	create () {
		var bg = this.add.image(0, 0, 'inventory').setOrigin(0);

		var title = this.add.image(150, 7, 'inventory-title').setOrigin(0).setScale(0.66);

		this.cameras.main.setViewport(this.parent.x, this.parent.y, InventoryScene.WIDTH, InventoryScene.HEIGHT);
	}

	refresh () {
		this.cameras.main.setPosition(this.parent.x, this.parent.y);

		this.scene.bringToTop();
	}
}

InventoryScene.WIDTH = 394;
InventoryScene.HEIGHT = 212;
InventoryScene.handle = 'InventoryScene';
