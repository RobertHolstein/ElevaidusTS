import * as mysql from 'mysql';

export class Player {
    private io: SocketIO.Server;
    private socket: SocketIO.EngineSocket;
    private db: mysql.Connection;
    public class: string;
    public skills: Skills; 

    constructor(io: SocketIO.Server, socket: SocketIO.EngineSocket, db: mysql.Connection, playerInfo: any){
       this.io = io;
       this.socket = socket;
       this.db = db;
       this.skills = new Skills();
        if(playerInfo.isNew){
            this.CreateNewPlayer();
        }else{
            this.GetPlayerInfoFromDB(playerInfo.id);
        }
    }

    private GetPlayerInfoFromDB(id: number): void {
        // TODO: get player info from database using the playerID
    }

    private CreateNewPlayer(): void {
        this.GenerateClass();
        this.GenerateSkills();
        this.saveInDatabase();
    }

    private GenerateClass(): void {
        // TODO: get list of class strings
        // TODO: randomly choose class string
        this.class =  "farmer";
    };



    private GenerateSkills(): void {
        if (this.class === "farmer"){
            this.skills.farming += 25;
        }else if (this.class === 'knight') {
            //fighting can be skill
        }
    }

    private saveInDatabase(): void {
        // TODO: Save Player to database
    }


    PlayerUpdate(data: any){
        
    }
}

class Skills {
    farming: number;
    mining: number;
    healing: number;
    trading: number;
    fighting: number;

    constructor(){
        this.GenerateRandomSkills();
    }

    private GenerateRandomSkills(): void{
        this.farming = Math.floor(Math.random()*26);
        this.mining = Math.floor(Math.random()*26);
        this.healing = Math.floor(Math.random()*26);
        this.fighting = Math.floor(Math.random()*26);
        this.trading = Math.floor(Math.random()*26);
    }
}