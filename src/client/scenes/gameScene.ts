
import { SHARED } from "../../shared/const";
import { CONST } from "../const/const";
import { Player } from "../objects/Player"; 
import { RightMenu } from "../objects/gameScene/RightMenu"
import * as io from 'socket.io-client';


export class GameScene extends Phaser.Scene {
    private player: Player;
    private socket: SocketIOClient.Socket;
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
        
        const zoneLetters = SHARED.ZONELTRS;
        var zones: any = [];
        var zoneX = CONST.MAPSTARTX;
        var zoneY = CONST.MAPSTARTY;
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

        var label = this.add.text(0, 0, '', { font: "24px Arial Black" });
        //var leftMenu =this.add.graphics().lineStyle(1, 0xffffff).strokeRect(CONST.MenuLeftStartX,CONST.MenuLeftStartY,CONST.MenuLeftWidth,CONST.MenuLeftHeight);
        var rightMenu = new RightMenu(this, this.socket);
        //var bottomMenu =this.add.graphics().lineStyle(1, 0xffffff).strokeRect(0,640,1280,320);
        //var mapMenu = this.add.graphics().fillStyle(0xffffff);

        
        

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

        this.player = new Player({
            socket: this.socket,
            scene: this,
            x: CONST.MAPSTARTX + SHARED.ZONESIZE/2,
            y: CONST.MAPSTARTY + SHARED.ZONESIZE/2,
            key: "charactor"
        });
        this.socket.emit('gameReady')
    }

    update(): void {
        //this.player.CheckPlayerMovement();
    }
}