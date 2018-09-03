import * as mysql from 'mysql';
// TODO: Import class array from json
const classArray = [
    "farmer",
    "knight",
    "priest",
    "miner"
]

export class Player {
    private io: SocketIO.Server;
    private socket: SocketIO.EngineSocket;
    private db: mysql.Connection;
    public class: string;
    public skills: Skills; 
    public id: number;
    public zone: string;

    constructor(io: SocketIO.Server, socket: SocketIO.EngineSocket, db: mysql.Connection, playerInfo: any){
       this.io = io;
       this.socket = socket;
       this.db = db;
       this.skills = new Skills();
       this.id = playerInfo.player.id;
        if(playerInfo.isNew){
            this.CreateNewPlayer();
        }else{
            this.SetPlayerInfo(playerInfo.player);
        }
    }

    private SetPlayerInfo(playerInfo: any): void {
        this.skills.SetSkills(playerInfo);
        this.class = playerInfo.class;
    }

    private CreateNewPlayer(): void {
        this.GenerateClass();
        this.GenerateSkills();
        this.saveInDatabase();
    }

    private GenerateClass(): void {
        var randomNumber = Math.floor(Math.random()*classArray.length) 
        // TODO: randomly choose class string
        this.class =  classArray[randomNumber];
    };



    private GenerateSkills(): void {
        this.skills.GenerateRandomSkills();
        if (this.class === "farmer"){
            this.skills.farming += 25;
        }else if (this.class === 'knight') {
            this.skills.fighting += 25;
        }else if (this.class === 'priest') {
            this.skills.healing += 25;
        }else if (this.class === 'miner') {
            this.skills.mining += 25;
        }
    }

    private saveInDatabase(): void {
        // TODO: Save Player to database
        let sql = 'UPDATE player SET class = ?, farming = ?, mining = ?, healing = ?, fighting = ? WHERE id = ?';
        this.db.query(sql, [this.class, this.skills.farming, this.skills.mining, this.skills.healing, this.skills.fighting, this.id], (err, res) =>{
            if(err){
                console.log(err);
            }else{
                console.log(`\n\n===============>\t Player ${this.id} updated in database \n`);
            }
        })
    }


    PlayerUpdate(data: any){
        
    }
}

class Skills {
    farming: number;
    mining: number;
    healing: number;
    fighting: number;

    constructor(){
    }

    public SetSkills(playerInfo: any): void {
        this.farming = playerInfo.farming;
        this.mining = playerInfo.mining;
        this.healing = playerInfo.healing;
        this.fighting = playerInfo.fighting;
    }

    public GenerateRandomSkills(): void {
        this.farming = Math.floor(Math.random()*26);
        this.mining = Math.floor(Math.random()*26);
        this.healing = Math.floor(Math.random()*26);
        this.fighting = Math.floor(Math.random()*26);
    }
}