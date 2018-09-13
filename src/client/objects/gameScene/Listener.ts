import { PlayerInfo } from "../../../shared/const"
import {GameScene} from "../../scenes/gameScene"
import { Player } from "../../objects/Player"; 
import * as RightMenu from './RightMenu'
//import { LightMenu } from './LightMenu'

export class Listener {
    private socket: SocketIOClient.Socket;
    private scene: GameScene;
    private player: Player;
    constructor(scene: GameScene) {
        this.socket = scene.socket;
        this.scene = scene;
        this.player = scene.player;
        this.Listen();
    }

    private Listen():void {

        //
        // passes a list of players that are currently in the zone
        //
        this.socket.on('currentPlayers', (players: PlayerInfo[]) => {
            RightMenu.AddCurrentPlayersToPlayersMenu(this.socket.id, players);
        });

        //
        // passes a player that has just joined the zone
        //
        this.socket.on('addPlayer', (player: PlayerInfo) => {
            RightMenu.AddNewPlayerToPlayersMenu(player);
        });

        //
        // joins current player to game in frontend
        //
        this.socket.on('join', (player:PlayerInfo) => {
            // TODO: rethink how zones are named
            //this.scene.add.zone(1,1,1,1).name
            //this.scene.zones[]
            this.player.JoinPlayerToScene(this.scene, {x:1,y:1})
        });

        //
        // passes a player that has just left the zone
        //
        this.socket.on('removePlayer', (player: PlayerInfo) => {
            RightMenu.RemovePlayerFromPlayersMenu(player);
        });

        //
        // passes a chat from someone in the zone
        //
        this.socket.on('chat', (username:string, msg:string) => {
            RightMenu.WriteChatMessage(username, msg);
        });

        //
        //  chat jquery page listeners TODO: keep here?
        //
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

        //
        //
        //

    }
}