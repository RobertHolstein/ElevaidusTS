import * as mysql from 'mysql';
import { CONST } from '../const/const';
import {Skill, GetSkills} from './Skill';

// TODO: Import class array from json
const playerClasses: Array<PlayerClass> = new Array<PlayerClass>();

export class Player {
    private io: SocketIO.Server;
    private socket: SocketIO.EngineSocket;
    private db: mysql.Connection;
    public class: string;
    public skills: Skill[]; 
    public id: number;
    public zone: string;
    public health: number;

    constructor(io: SocketIO.Server, socket: SocketIO.EngineSocket, db: mysql.Connection, playerInfo: any){
       this.io = io;
       this.socket = socket;
       this.db = db;
       this.skills = GetSkills();
       this.id = playerInfo.player.id;
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
        this.socket.emit('signedIn', {
            id: this.id, skills: this.skills, class: this.class, zone: this.zone, health: this.health
        });
    }

    private CreateNewPlayer(): void {
        this.GenerateClass();
        this.GenerateSkills();
        this.zone = CONST.STARTINGZONE;
        this.health = CONST.STARTINGHEALTH;
        this.saveInDatabase();
        this.socket.emit('signedUp', {
            id: this.id, skills: this.skills, class: this.class, zone: this.zone, health: this.health
        });
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
        for(let i in playerInfo){
            this.skills.forEach(skill => {
                if(i === skill.name){
                    // i.valueOf = skill.level;
                }               
            });
        }
    }

    public GenerateRandomSkills(): void {
        this.skills.forEach(i => {
            i.level = Math.floor(Math.random()*26)
        });
    }

    private saveInDatabase(): void {
        this.db.connect();
        let sql = 'UPDATE player SET zone = ?, health = ?, class = ?, farming = ?, mining = ?, healing = ?, fighting = ? WHERE id = ?';
        this.db.query(sql, 
            [
                this.zone,
                this.health,
                this.class,
                this.skills.find(i => i.name === 'farming').level,
                this.skills.find(i => i.name === 'mining').level,
                this.skills.find(i => i.name === 'healing').level,
                this.skills.find(i => i.name === 'fighting').level,
                this.id
            ],
            (err, res) =>{
                if(err){
                    console.log(err);
                }else{
                    console.log(`\n\n===============>\t Player ${this.id} updated in database \n`);
                }
                this.db.end();
            }
        )
    }

    PlayerUpdate(data: any){
        
    }


}



class PlayerClass {
    name: string;
    skills: Skill[];
    constructor(name:string, skills: Skill[]){
        this.name = name;
        this.skills = skills;
    }
}

playerClasses.push(new PlayerClass("miner", [ {name: 'mining', level: 25, progress: 0 }, {name: 'fighting', level: 5, progress: 0 } ]))
playerClasses.push(new PlayerClass("farmer", [ {name: 'farming', level: 25, progress: 0 }, {name: 'healing', level: 5, progress: 0 } ]))
playerClasses.push(new PlayerClass("priest", [ {name: 'healing', level: 25, progress: 0 }, {name: 'farming', level: 5, progress: 0 } ]))
playerClasses.push(new PlayerClass("fighter", [ {name: 'fighting', level: 25, progress: 0 }, {name: 'healing', level: 5, progress: 0 } ]))
