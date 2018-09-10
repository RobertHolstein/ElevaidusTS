import * as mysql from 'mysql';
import { PlayerInfo, SHARED } from "../../shared/const"
import { CONST } from '../const/const';
import {Skill, GetSkills} from './Skill';
import {PlayerClass, GetPlayerClasses} from './PlayerClass';

// zones, not sure where else to put them atm
var zones: any = [];
SHARED.ZONES.forEach(zone => {
    zones[zone] = {};
    zones[zone].players = [];
});

const playerClasses: Array<PlayerClass> = GetPlayerClasses();

var loggedInPlayers: PlayerInfo[] = [];

export class Player {
    private io: SocketIO.Server;
    private socket: SocketIO.Socket;
    private db: mysql.Pool;
    private class: string;
    private skills: Skill[]; 
    private id: number;
    private username: string;
    private zone: string;
    private health: number;


    constructor(io: SocketIO.Server, socket: SocketIO.Socket, db: mysql.Pool, playerInfo: any){
       this.io = io;
       this.socket = socket;
       this.Listen();
       this.db = db;
       this.id = playerInfo.player.id;
       this.username = playerInfo.player.username;
       this.skills = GetSkills();
        if(playerInfo.isNew){
            this.CreateNewPlayer();
        }else{
            this.SetPlayerInfo(playerInfo.player);
        }
    }

    private Listen(): void {
        this.socket.on('disconnect', () => {
            console.log(`\n\n===============>\t client disconnected\n`);
            delete zones[this.zone].players[this.socket.id];
            this.socket.to(this.zone).emit('removePlayer', this.FrontendPlayerInfo());
            for (var i = 0; i < loggedInPlayers.length; i++) {
                if (this.id = loggedInPlayers[i].id) { 
                    loggedInPlayers.splice(i, 1);
                    break;
                }
            }
        });
        this.socket.on('chat', (msg: string) =>{
            if(msg){
                this.io.in(this.zone).emit('chat',this.username, msg);
            }
        })
    }

    private SetPlayerInfo(playerInfo: any): void {
        this.SetSkills(playerInfo);
        this.class = playerInfo.class;
        this.zone = playerInfo.zone;
        this.health = playerInfo.health;
        this.Join();
    }

    private CreateNewPlayer(): void {
        this.GenerateClass();
        this.GenerateSkills();
        this.zone = CONST.STARTINGZONE;
        this.health = CONST.STARTINGHEALTH;
        this.saveInDatabase();
        this.Join();
    }

    private Join(): void {    
        var frontEndInfo = this.FrontendPlayerInfo()
        loggedInPlayers.push(frontEndInfo);
        this.socket.emit('join', frontEndInfo);
        this.JoinNewArea(this.zone, true);
    }

    private JoinNewArea(newZone:string, newlyJoin: boolean): void {
        if(!newlyJoin){
            this.socket.leave(this.zone)
            this.socket.to(this.zone).emit('removePlayer', this.FrontendPlayerInfo());
        }
        this.zone = newZone;
        this.socket.join(this.zone);
        //TODO: save new area in database
        let playersInArea: PlayerInfo[] = []
        zones[this.zone].players[this.socket.id] = this.FrontendPlayerInfo();
        for(let p in zones[this.zone].players){
            playersInArea.push(zones[this.zone].players[p])
        };
        this.socket.emit('currentPlayers', playersInArea);
        this.socket.to(this.zone).emit('addPlayer', zones[this.zone].players[this.socket.id]);
    }

    private FrontendPlayerInfo(): PlayerInfo {
        let player: PlayerInfo = {
            id: this.id,
            socketId: this.socket.id,
            username: this.username,
            skills: this.skills,
            class: this.class,
            zone: this.zone,
            health: this.health
        }
        return player;
    }

    private GenerateClass(): void {
        var randomNumber = Math.floor(Math.random()*playerClasses.length) 
        this.class =  playerClasses[randomNumber].name;
    };



    private GenerateSkills(): void {
        this.GenerateRandomSkills();
        let thisPlayerClass = playerClasses.find(i => i.name === this.class)
        thisPlayerClass.skills.forEach(i => {
            let skill = this.skills.find(j => j.name === i.name)
            if(skill === undefined){
                return;
            }
            skill.level += i.level;
        });
    }

    public SetSkills(playerInfo: any): void {
        for(var s = 0; s < this.skills.length; s++){
            for(let prop in playerInfo){
                if(prop === this.skills[s].name){
                    this.skills[s].level = playerInfo[prop];
                    break;
                }
            }
        };
    }

    public GenerateRandomSkills(): void {
        this.skills.forEach(i => {
            i.level = Math.floor(Math.random()*26)
        });
    }

    private saveInDatabase(): void {
        let sql = 'UPDATE player SET zone = ?, health = ?, class = ?, farming = ?, mining = ?, healing = ?, fighting = ?, crafting = ? WHERE id = ?';
        this.db.query(sql, 
            [
                this.zone,
                this.health,
                this.class,
                this.skills.find(i => i.name === 'farming').level,
                this.skills.find(i => i.name === 'mining').level,
                this.skills.find(i => i.name === 'healing').level,
                this.skills.find(i => i.name === 'fighting').level,
                this.skills.find(i => i.name === 'crafting').level,
                this.id
            ],
            (err, res) =>{
                if(err){
                    console.log(err);
                }else{
                    console.log(`\n\n===============>\t Player ${this.id} updated in database \n`);
                }
            }
        )
    }

    PlayerUpdate(data: any){
        
    }
}

export function GetLoggedInUsers(): PlayerInfo[]{
    return loggedInPlayers;
}

export function IsPlayerLoggedIn(id:number): Boolean{
    for (var i = 0; i < loggedInPlayers.length; i++) {
        if (id = loggedInPlayers[i].id) { 
            return true;
        }
    }
    return false;
}

export function DisconnectPlayerIfLoggedIn(id:number, io: SocketIO.Server): void{
    for (var i = 0; i < loggedInPlayers.length; i++) {
        if (id = loggedInPlayers[i].id) { 
            io.sockets.connected[loggedInPlayers[i].socketId].emit('errorFromBackend', 'disconnected');
            io.sockets.connected[loggedInPlayers[i].socketId].disconnect();
            break;
        }
    }
}


