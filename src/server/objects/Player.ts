import * as mysql from 'mysql';
import { CONST } from '../const/const';
import {Skill, GetSkills} from './Skill';
import {PlayerClass, GetPlayerClasses} from './PlayerClass';


// TODO: Import class array from json
const playerClasses: Array<PlayerClass> = new Array<PlayerClass>();

export class Player {
    private io: SocketIO.Server;
    private socket: SocketIO.EngineSocket;
    private db: mysql.Pool;
    public class: string;
    public skills: Skill[]; 
    public id: number;
    public username: string;
    public zone: string;
    public health: number;
    public playerClasses: PlayerClass[];

    constructor(io: SocketIO.Server, socket: SocketIO.EngineSocket, db: mysql.Pool, playerInfo: any){
       this.io = io;
       this.socket = socket;
       this.db = db;
       this.id = playerInfo.player.id;
       this.username = playerInfo.player.username;
       this.skills = GetSkills();
       this.playerClasses = GetPlayerClasses();
        if(playerInfo.isNew){
            this.CreateNewPlayer();
        }else{
            this.SetPlayerInfo(playerInfo.player);
        }
    }

    private SetPlayerInfo(playerInfo: any): void {
        this.SetSkills(playerInfo);
        this.class = playerInfo.class;
        this.zone = playerInfo.zone;
        this.health = playerInfo.health;
        this.socket.emit('signedIn', this.FrontendPlayerInfo());
    }

    private CreateNewPlayer(): void {
        this.GenerateClass();
        this.GenerateSkills();
        this.zone = CONST.STARTINGZONE;
        this.health = CONST.STARTINGHEALTH;
        this.saveInDatabase();
        this.socket.emit('signedUp', this.FrontendPlayerInfo());
    }

    private FrontendPlayerInfo(): any {
        let player: any = {
            id: this.id,
            username: this.username,
            skills: this.skills,
            class: this.class,
            zone: this.zone,
            health: this.health
        }
        return player;
    }

    private GenerateClass(): void {
        var randomNumber = Math.floor(Math.random()*this.playerClasses.length) 
        this.class =  this.playerClasses[randomNumber].name;
    };



    private GenerateSkills(): void {
        this.GenerateRandomSkills();
        let thisPlayerClass = this.playerClasses.find(i => i.name === this.class)
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



