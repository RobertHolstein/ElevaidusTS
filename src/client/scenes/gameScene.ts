
export class GameScene extends Phaser.Scene {
    constructor(){
        super({
            key: "GameScene"
        })
    }
    preload(): void {
        this.load.image('tiles', './assets/tilesheet.png');
        this.load.tilemapTiledJSON('map', './assets/elevaidus_map.json');
    }

    create(): void {
        const map = this.make.tilemap({key: 'map' })
        const tileset = map.addTilesetImage('tilesheet', 'tiles')
        const groundLayer = map.createStaticLayer("ground", tileset, 0, 0);
        const grassLayer = map.createStaticLayer("grass", tileset, 0, 0);
        const onLayer = map.createStaticLayer("on", tileset, 0, 0);
    }
}