console.log("\n\n===============>\t app starting\n");
import { SHARED } from "../shared/const";
import { CONST } from './const/const';

import * as mysql from 'mysql';
import { createServer, Server } from 'http';
import * as express from 'express';
import * as socketIo from 'socket.io';
import * as path from 'path';
import { Player } from './objects/Player'


export class App {
    public static readonly PORT:number = 8080;
    public app: express.Application;
    private server: Server;
    public io: SocketIO.Server;
    private port: string | number;
    public db: mysql.Connection;
    public zones: any[][];
    private dbConfig = {
        host        : CONST.HOST,
        user        : CONST.DBUSER,
        password    : CONST.DBPASSWORD,
        database    : CONST.DATABASE
    };

    constructor() {
        this.createApp();
        this.config();
        this.createServer();
        this.Routes();
        this.sockets();
        this.listen();
        this.CreateZones();
        this.dbConnect();
    }

    private createApp(): void {
        this.app = express();
    }

    private createServer(): void {
        this.server = createServer(this.app);
    }

    private Routes(): void {
        this.app.use(express.static('./dist/client'));
        this.app.get('/', function (req, res) {
            res.sendFile(path.resolve('./dist/client/index.html'));;
        });
        this.app.use("/assets", express.static('./dist/client/assets'));
    }

    private config(): void {
        this.port = process.env.PORT || 4001;
    }

    private sockets(): void {
        this.io = socketIo.listen(this.server);;
    }

    private CreateZones(): void {
        this.zones = [];
        for (let i = 0; i < SHARED.ZONELTRS.length; i++) {
            this.zones[i]  = []
            for (let j = 1; j < 6; j++) {
                this.zones[i][j] = {name: `${SHARED.ZONELTRS[i]}${j.toString()}`};
            }
            
        }
        // TODO: add more propties in zones
    }

    private listen(): void {
        this.server.listen(this.port, () => {
            console.log(`\n\n===============>\t running server on port ${this.port}\n`);
        });

        this.io.on('connect', (socket: socketIo.EngineSocket) => {
            console.log(`\n\n===============>\t connected client on port ${this.port}\n`);
            socket.on('messageFromFrontend', (m: string) => {
                console.log(`\n\n===============>\t ${m}\n`);
                this.io.emit('messageFromBackend', 'Hello from the backend!');
            });

            socket.on('signIn', (signInInfo: any) => {
                let sql = 'SELECT * FROM player WHERE username = ? AND password = ?';
                var query = this.db.query(sql, [signInInfo.username,signInInfo.password], (err, res) => {
                    if (err) {
                        console.log(err);
                        socket.emit('errorFromBackend', err.code);                        
                    }else if(res.length === 0){
                        socket.emit('errorFromBackend', 'username and or password was incorrect');                 
                    }else{
                        console.log(`\n\n===============>\t Player logging in\n`)
                        console.log(`===============>\t username: ${signInInfo.username}\n`)
                        console.log(`===============>\t password: ${signInInfo.password}\n`)
                        this.CreatePlayer(socket, { player: res[0], isNew: false });
                    }
                })
            })

            socket.on('signUp', (signUpInfo) => {
                let postPlayer = { username: signUpInfo.username, password: signUpInfo.password}
                let sql = 'INSERT INTO player SET ?';
                let query = this.db.query(sql, postPlayer, (err, res) => {
                    if(err){
                        console.log(err);
                        if(err.code === 'ER_DUP_ENTRY'){
                            socket.emit('errorFromBackend', 'this username is already in use');
                        }else{
                            socket.emit('errorFromBackend', err.code);
                        }
                    }else{
                        let player = this.CreatePlayer(socket, {player: {id:res.insertId}, isNew: true});
                    }
                }) 
            })
            
            socket.on('disconnect', () => {
            console.log(`\n\n===============>\t client disconnected\n`);
            });
        });
    }

    private CreatePlayer(socket: socketIo.EngineSocket, playerInfo: any): void {
        let player = new Player(this.io, socket, this.db, playerInfo);
    }

    private dbConnect(): void {
        var db = mysql.createConnection(this.dbConfig);
        db.connect((err) => {
            if (err) {
                throw err
            }else {
                console.log(`\n\n===============>\t ${CONST.DATABASE} database connected\n`);
                let sql = "CREATE TABLE IF NOT EXISTS Player(id int AUTO_INCREMENT, username VARCHAR(30), password VARCHAR(255), zone VARCHAR(30), health int, class VARCHAR(30), farming int, mining int, fighting int, healing int, PRIMARY KEY (id), UNIQUE KEY username (username))"
                db.query(sql, (err, result) => {
                    if (err) {
                        throw err
                    }else {
                        console.log(`\n\n===============>\t ${CONST.DATABASE} database tables check\n`);
                    }
                });
                this.db = db;
            }
        });

        db.on('error', (err) => {
            if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
                var db = mysql.createConnection(this.dbConfig);
                this.db = db;
              } else {                                      // connnection idle timeout (the wait_timeout
                throw err;                                  // server variable configures this)
              }
        })
        // db.connect((err) => {
        //     if (err) {
        //         throw err
        //     }else {
        //         console.log(`\n\n===============>\t mySQL connected\n`);
        //         let sql = 'CREATE DATABASE IF NOT EXISTS elevaidus';
        //         db.query(sql, (err, result) => {
        //             if (err) {
        //                 throw err
        //             }else {
        //                 console.log(`\n\n===============>\t database check\n`);
        //                 db.end();
                        
        //             }
        //         })
        //     }
        // });
    }
}
