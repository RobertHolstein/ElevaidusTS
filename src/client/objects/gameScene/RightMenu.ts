import { CONST } from "../../const/const";
import { PlayerInfo } from "../../../shared/const"
const startPlayersArrayY = CONST.MenuRightStartY + 25;
const startPlayersArrayX = CONST.MenuRightStartX + 15;

export class RightMenu {
    private players: PlayerInfo[];
    private scene: Phaser.Scene;
    private socket: SocketIOClient.Socket;
    constructor(scene: Phaser.Scene, socket: SocketIOClient.Socket){
        this.scene = scene;
        this.socket = socket;
        this.players = [];
        this.Listen();
    }



    private Listen(): void {
        this.socket.on('currentPlayers', (playersInfo: PlayerInfo[]) => {
            this.players = playersInfo;
            for (let p = 0; p < playersInfo.length; p++) {
                if(playersInfo[p].socketId === this.socket.id){
                    continue;
                }
                $('#playersMenu table tbody').append(`
                    <tr id=${playersInfo[p].socketId}>
                        <td>${playersInfo[p].username}</td>
                    </tr>`
            )   ;
            }
          })
          this.socket.on('addPlayer', (playerInfo: PlayerInfo) => {
            this.players.push(playerInfo);
            $('#playersMenu table tbody').append(`
                    <tr id=${playerInfo.socketId}>
                        <td>${playerInfo.username}</td>
                    </tr>`
            )   ;
            console.log(`\n\n===============>\t new player arrived in your area\n`);
            console.log(playerInfo);
            console.log(this.players);
          })
          this.socket.on('removePlayer', (playerInfo: PlayerInfo) => {
            for (var i = 0; i < this.players.length; i++) {
                if (playerInfo.socketId = this.players[i].socketId) { 
                    this.players.splice(i, 1);
                    break;
                }
            }
            $(`#${playerInfo.socketId}`).remove();
            console.log(`\n\n===============>\t player left your area\n`);
            console.log(playerInfo);
          })
    }
}