
import { SHARED } from "../../shared/const"
import { Player } from "../objects/Player"; 

export class GameScene extends Phaser.Scene {
    private player: Player;
    constructor(){
        super({
            key: "GameScene"
        })
    }
    preload(): void {
        this.load.image('tiles', './assets/tilesheet.png');
        this.load.tilemapTiledJSON('map', './assets/elevaidus_map.json');
        this.load.spritesheet('charactor', 'assets/sprites/charactor.png', { frameWidth: 48, frameHeight: 48 })
    }

    create(): void {
        const map = this.make.tilemap({key: 'map' })
        const tileset = map.addTilesetImage('tilesheet', 'tiles')
        const groundLayer = map.createStaticLayer("ground", tileset, 0, 0);
        const grassLayer = map.createStaticLayer("grass", tileset, 0, 0);
        const onLayer = map.createStaticLayer("on", tileset, 0, 0);
        
        const zoneLetters = SHARED.ZONELTRS;
        var zones: any = [];
        var zoneX = 0;
        var zoneY = 0;
        for (let x = 0; x < zoneLetters.length; x++) {
            zones[x] = [];
            for (let y = 0; y < 5; y++) {
                zones[x][y] = {name: `${zoneLetters[x]}${y+1}`};
                this.add.zone(zoneX, zoneY, 128, 128).setName(zones[x][y].name).setInteractive();
                this.add.graphics().lineStyle(2, 0xffff00).strokeRect(zoneX, zoneY, SHARED.ZONESIZE, SHARED.ZONESIZE);
                console.log(zoneX + " " + zoneY)
                zoneY += SHARED.ZONESIZE;
            }
            zoneY = 0;
            zoneX += SHARED.ZONESIZE;
        }
        this.player = new Player({
            scene: this,
            x: SHARED.ZONESIZE/2,
            y: SHARED.ZONESIZE/2,
            key: "charactor"
        });
        var label = this.add.text(0, 0, '', { font: "24px Arial Black" });
        var menu = this.add.graphics().fillStyle(0xffffff);
        this.input.on('gameobjectdown', (pointer: Phaser.Input.Pointer, gameObject: Phaser.GameObjects.Zone) => {
            label.setText(gameObject.name);
            label.x = gameObject.x;
            label.y = gameObject.y;
            menu.fillRect(gameObject.x,gameObject.y,SHARED.ZONESIZE,SHARED.ZONESIZE/3);
            menu.fillRect(gameObject.x, gameObject.y + 2 * SHARED.ZONESIZE/3,SHARED.ZONESIZE,SHARED.ZONESIZE/3);

            this.player.setPosition(gameObject.x + SHARED.ZONESIZE/2, gameObject.y + SHARED.ZONESIZE/2)
        })
    }

    update(): void {
        this.player.CheckPlayerMovement();
    }
}