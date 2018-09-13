
import { SHARED } from "../../shared/const";
import { CONST } from "../const/const";
import { Player } from "../objects/Player"; 
import { Listener } from "../objects/gameScene/Listener"
import * as io from 'socket.io-client';


export class GameScene extends Phaser.Scene {
    public player: Player;
    public socket: SocketIOClient.Socket;
    public zones: any;
    constructor(socket: SocketIOClient.Socket){
        super({
            key: "GameScene"
        })
        this.socket = socket;
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
            map.createStaticLayer(layer.name, tileset, CONST.MAPSTARTX, 0);
        });

        this.player = new Player({
            socket: this.socket,
            scene: this,
            x: CONST.MAPSTARTX + SHARED.ZONESIZE/2,
            y: CONST.MAPSTARTY + SHARED.ZONESIZE/2,
            key: "charactor"
        });
        
        CreateMapZones(this);
        new Listener(this);


        
        var label = this.add.text(0, 0, '', { font: "24px Arial Black" });
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

        //
        // let backend know everything is loaded
        //
        this.socket.emit('gameReady')
    }
}

//
// Creates a 5x5 area of zones on the map 
//
function CreateMapZones(scene: GameScene) {
    const zoneLetters = SHARED.ZONELTRS;
    var zoneX = CONST.MAPSTARTX;
    var zoneY = CONST.MAPSTARTY;
    for (let x = 0; x < zoneLetters.length; x++) {
        this.zones[x] = [];
        for (let y = 0; y < 5; y++) {
             var zoneName = `${zoneLetters[x]}${y+1}`;
             this.zones[x][y] = scene.add.zone(zoneX, zoneY, 128, 128).setName(zoneName).setInteractive();
             scene.add.graphics().lineStyle(2, 0xffff00).strokeRect(zoneX, zoneY, SHARED.ZONESIZE, SHARED.ZONESIZE);
            zoneY += SHARED.ZONESIZE;
        }
        zoneY = 0;
        zoneX += SHARED.ZONESIZE;
    }
}