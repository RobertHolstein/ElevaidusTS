console.log("\n\n===============>\t app starting\n");
import { SHARED } from "../shared/const";
import { CONST } from './const/const';

import * as mysql from 'mysql';
import { createServer, Server } from 'http';
import * as express from 'express';
import * as socketIo from 'socket.io';
import * as path from 'path';
import { Player, DisconnectPlayerIfLoggedIn } from './objects/Player'


export class App {
    private app: express.Application;
    private server: Server;
    private io: SocketIO.Server;
    private port: string | number;
    private db: mysql.Pool;
    private zones: {}[];
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
        this.zones = CONST.ZONES;
        this.dbConnect();
    }

    private createApp(): void {
        this.app = express();
    }

    private config(): void {
        this.port = process.env.PORT || 4001;
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

    private sockets(): void {
        this.io = socketIo.listen(this.server);;
    }

    private listen(): void {
        this.server.listen(this.port, () => {
            console.log(`\n\n===============>\t running server on port ${this.port}\n`);
        });

        this.io.on('connect', (socket: socketIo.Socket) => {
            console.log(`\n\n===============>\t connected client on port ${this.port}\n`);
            socket.on('messageFromFrontend', (m: string) => {
                console.log(`\n\n===============>\t ${m}\n`);
                socket.emit('messageFromBackend', 'testing connectivity from backend');
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
                        DisconnectPlayerIfLoggedIn(res.id, this.io)
                        this.CreatePlayer(socket, { player: res[0], isNew: false });
                    }
                })
            })

            socket.on('signUp', (signUpInfo) => {
                if(!signUpInfo.username || !signUpInfo.password){
                    let error = "no username and or password given";
                    console.log(error);
                    socket.emit('errorFromBackend', error);
                    return;         
                }
                let sql = 'SELECT * FROM player WHERE username = ? AND password = ?';
                let query = this.db.query(sql, [signUpInfo.username, signUpInfo.password], (err, res) => {
                    if(err){
                        console.log(err);
                        socket.emit('errorFromBackend', err.code);
                    }else if(res.length !== 0){
                        socket.emit('errorFromBackend', 'this username is already in use');
                    }else{
                        sql = 'INSERT INTO player SET ?';
                        let query = this.db.query(sql, {username:signUpInfo.username, password:signUpInfo.password}, (err, res) => {
                            if(err){
                                console.log(err);
                            }else{
                                let player = this.CreatePlayer(socket, {player: {id:res.insertId, username:signUpInfo.username}, isNew: true});
                            }
                        });
                    }
                }) 
            })
        });
    }

    private CreatePlayer(socket: socketIo.Socket, playerInfo: any): void {
        socket.emit('signInSuccess')
        socket.on('gameReady', () =>{
            let player = new Player(this.io, socket, this.db, playerInfo);
        })
    }

    private dbConnect(): void {
        var db = mysql.createPool(this.dbConfig);
        db.getConnection((err) => {
            if (err) {
                throw err
            }else {
                console.log(`\n\n===============>\t ${CONST.DATABASE} database connected\n`);
                let sql = "CREATE TABLE IF NOT EXISTS Player(id int AUTO_INCREMENT, username VARCHAR(30), password VARCHAR(255), zone VARCHAR(30), health int, class VARCHAR(30), farming int, mining int, fighting int, healing int, crafting int, PRIMARY KEY (id), UNIQUE KEY username (username))"
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
            if(err.code === 'PROTOCOL_CONNECTION_LOST') {
                console.log(`\n\n===============>\t ${CONST.DATABASE} database tables check\n`);
                var db = mysql.createPool(this.dbConfig);
                this.db = db;
              } else {
                throw err;
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
