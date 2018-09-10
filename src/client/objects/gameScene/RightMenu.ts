import { CONST } from "../../const/const";
import { PlayerInfo } from "../../../shared/const"
const startPlayersArrayY = CONST.MenuRightStartY + 25;
const startPlayersArrayX = CONST.MenuRightStartX + 15;

export class RightMenu {
    private player: PlayerInfo;
    private players: PlayerInfo[];
    private scene: Phaser.Scene;
    private socket: SocketIOClient.Socket;
    constructor(scene: Phaser.Scene, socket: SocketIOClient.Socket){
        this.scene = scene;
        this.socket = socket;
        this.players = [];
        this.Listen();
        this.Chat();
    }



    private Listen(): void {
        this.socket.on('currentPlayers', (playersInfo: PlayerInfo[]) => {
            this.players = playersInfo;
            for (let p = 0; p < playersInfo.length; p++) {
                if(playersInfo[p].socketId === this.socket.id){
                    this.player = playersInfo[p];
                    continue;
                }
                $('#playersMenu table tbody').append(`
                    <tr id=${playersInfo[p].socketId}>
                        <td>${playersInfo[p].username}</td>
                    </tr>`
                );
            }
        })
        this.socket.on('addPlayer', (playerInfo: PlayerInfo) => {
            this.players.push(playerInfo);
            $('#playersMenu table tbody').append(`
                    <tr id=${playerInfo.socketId}>
                        <td>${playerInfo.username}</td>
                    </tr>`
            );
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

    private Chat(): void {
        $('#chatBtn').on('click', () => {
            var msg = $('#chatInput').val();
            if(msg){
                this.socket.emit('chat', msg);
                $('#chatInput').val('');
                $('#chatBody').parent().scrollTop($('#chatBody').parent()[0].scrollHeight);
            }
        })
        $('#chatInput').keypress(function(event){
            if(event.keyCode == 13){
              $('#chatBtn').click();
            }
        });
        this.socket.on('chat', (username:string, msg:string) => {
            var chatRow = $('#chatBody').parent();
            var isScrolledBottom = chatRow[0].scrollTop === (chatRow[0].scrollHeight - chatRow[0].offsetHeight);
            $('#chatBody').append(`
                <div class="row">
                    <div class="col-sm">
                    <p class="addBorder" style="padding-left:15px;">${username}<br/>${msg}</p>
                    </div>
                </div>`
            );
            if(isScrolledBottom){
                chatRow.scrollTop(chatRow[0].scrollHeight);
            }
        })
    }
}