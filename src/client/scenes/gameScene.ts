
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
        this.load.tilemapTiledJSON('map', './assets/elevaidus_mapv2.json');
        this.load.spritesheet('charactor', 'assets/sprites/charactor.png', { frameWidth: 48, frameHeight: 48 });
    }

    create(): void {
        const map = this.make.tilemap({key: 'map' });
        const tileset = map.addTilesetImage('tilesheet', 'tiles');
        map.layers.forEach(layer => {
            map.createStaticLayer(layer.name, tileset, SHARED.MAPSTARTX, 0);
        });
        
        const zoneLetters = SHARED.ZONELTRS;
        var zones: any = [];
        var zoneX = SHARED.MAPSTARTX;
        var zoneY = SHARED.MAPSTARTY;
        for (let x = 0; x < zoneLetters.length; x++) {
            zones[x] = [];
            for (let y = 0; y < 5; y++) {
                 var zoneName = `${zoneLetters[x]}${y+1}`;
                 zones[x][y] = this.add.zone(zoneX, zoneY, 128, 128).setName(zoneName).setInteractive();
                this.add.graphics().lineStyle(2, 0xffff00).strokeRect(zoneX, zoneY, SHARED.ZONESIZE, SHARED.ZONESIZE);
                zoneY += SHARED.ZONESIZE;
            }
            zoneY = 0;
            zoneX += SHARED.ZONESIZE;
        }
        this.player = new Player({
            scene: this,
            x: SHARED.MAPSTARTX + SHARED.ZONESIZE/2,
            y: SHARED.MAPSTARTY + SHARED.ZONESIZE/2,
            key: "charactor"
        });
        var label = this.add.text(0, 0, '', { font: "24px Arial Black" });
        var leftMenu =this.add.graphics().lineStyle(1, 0xffffff).strokeRect(0,0,320,640);
        var rightMenu =this.add.graphics().lineStyle(1, 0xffffff).strokeRect(960,0,320,640);
        var bottomMenu =this.add.graphics().lineStyle(1, 0xffffff).strokeRect(0,640,1280,320);

        var mapMenu = this.add.graphics().fillStyle(0xffffff);

        this.input.on('gameobjectdown', (pointer: Phaser.Input.Pointer, gameObject: any) => {
            if(SHARED.ZONES.indexOf(gameObject.name) > -1){
                label.setText(gameObject.name);
                label.x = gameObject.x;
                label.y = gameObject.y;
                this.player.setPosition(gameObject.x + SHARED.ZONESIZE/2, gameObject.y + SHARED.ZONESIZE/2);
            }
            // TODO: make menu
            // menu.fillRect(gameObject.x,gameObject.y,SHARED.ZONESIZE,SHARED.ZONESIZE/3);
            // menu.fillRect(gameObject.x, gameObject.y + 2 * SHARED.ZONESIZE/3,SHARED.ZONESIZE,SHARED.ZONESIZE/3);

        })
    }

    update(): void {
        //this.player.CheckPlayerMovement();
    }
}