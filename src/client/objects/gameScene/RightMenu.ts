import { CONST } from "../../const/const";
import { PlayerInfo } from "../../../shared/const"
const startPlayersArrayY = CONST.MenuRightStartY + 25;
const startPlayersArrayX = CONST.MenuRightStartX + 15;

export class RightMenu {
    private players: Phaser.GameObjects.Group;
    private scene: Phaser.Scene;
    private socket: SocketIOClient.Socket;
    constructor(scene: Phaser.Scene, socket: SocketIOClient.Socket){
        this.scene = scene;
        this.socket = socket;
        this.MakeMenuOutline();
        this.MakePlayersMenu();
        this.players = scene.add.group();
        this.Listen();
    }

    private MakeMenuOutline(): void {
        var outline = this.scene.add.graphics();
        outline.lineStyle(1, 0xffffff);
        outline.strokeRect(CONST.MenuRightStartX, CONST.MenuRightStartY, CONST.MenuRightWidth, CONST.MenuRightHeight );
    }

    private MakePlayersMenu(): void {
        var playersRect = this.scene.add.graphics();
        playersRect.lineStyle(1, 0xffffff);
        playersRect.strokeRect(CONST.MenuRightStartX, CONST.MenuRightStartY, CONST.MenuRightWidth, CONST.MenuRightHeight/2 );
        var titleRect = this.scene.add.graphics();
        titleRect.lineStyle(1, 0xffffff);
        titleRect.strokeRect(CONST.MenuRightStartX, CONST.MenuRightStartY, CONST.MenuRightWidth, 20 );
        var title = this.scene.add.text(startPlayersArrayX, CONST.MenuRightStartY + 3, 'PLAYERS');
    }

    private Listen(): void {
        this.socket.on('currentPlayers', (playersInfo: PlayerInfo[]) => {
            for (let p = 0; p < playersInfo.length; p++) {
                if(playersInfo[p].socketId === this.socket.id){
                    continue;
                }
                let textObj = this.scene.add.text(startPlayersArrayX, startPlayersArrayY + p*20, playersInfo[p].username);
                textObj.setInteractive().on("pointerdown", (pointer: Phaser.Input.Pointer) => {
                    let rect = new Phaser.Geom.Rectangle(pointer.x - 5, pointer.y - 5, 150, 100);
                    let playersMenuRect = this.scene.add.graphics();
                    playersMenuRect.fillStyle(0xffffff);
                    playersMenuRect.fillRectShape(rect);
                    let menuZone = this.scene.add.zone(pointer.x - 5, pointer.y - 5, 150, 100).setInteractive();
                    menuZone.on('pointerout', () => {
                        playersMenuRect.destroy();
                        setTimeout(function(){
                            menuZone.destroy();
                        }, 20);
                    })
                });
                textObj.name = playersInfo[p].socketId;
                this.players.add(textObj);
            }
          })
          this.socket.on('addPlayer', (playerInfo: PlayerInfo) => {
            var textObj = this.scene.add.text(startPlayersArrayX, startPlayersArrayY + this.players.children.size*20, playerInfo.username);
            textObj.name = playerInfo.socketId;
            this.players.add(textObj);
            console.log(`\n\n===============>\t new player arrived in your area\n`);
            console.log(playerInfo);
          })
          this.socket.on('removePlayer', (playerInfo: PlayerInfo) => {
              //TODO: move players all players after the removed player up 15px
            for (let i = 0; i < this.players.children.entries.length; i++) {
                if(this.players.children.entries[i].name === playerInfo.socketId){
                    for (let j = i + 1; j < this.players.children.entries.length; j++) {
                        let textObject = this.players.children.entries[j] as Phaser.GameObjects.Text;
                        textObject.y -= 20;
                    }
                    this.players.children.entries[i].destroy();
                    this.players.remove(this.players.children.entries[i]);
                    break;
                }
            };
            console.log(`\n\n===============>\t player left your area\n`);
            console.log(playerInfo);
          })
    }
}