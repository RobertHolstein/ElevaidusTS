import { PlayerInfo, SHARED } from "../../../shared/const"
import { CONST } from "../../const/const";
import {GameScene} from "../../scenes/gameScene"
import { Player } from "../../objects/Player"; 
import * as RightMenu from './RightMenu'
import * as LeftMenu from './LeftMenu'
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
        LeftMenu.ChangeActiveSkill(scene.socket);
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
            for (let i = 0; i < CONST.ZONES.length; i++) {
                if(player.zone === CONST.ZONES[i].name){
                    var zone = this.scene.zones[CONST.ZONES[i].x][CONST.ZONES[i].y] as Phaser.GameObjects.Zone;
                    this.player.JoinPlayerToScene(this.scene, {x:zone.x + CONST.ZONESIZE/2 ,y:zone.y + CONST.ZONESIZE/2})
                    LeftMenu.AddPlayerInfo(player);
                    break;
                }
            }
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
        // Updates player info on front end
        //
        this.socket.on('updatePlayer', (player: PlayerInfo) => {
            LeftMenu.UpdatePlayer(player);
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
    }
}