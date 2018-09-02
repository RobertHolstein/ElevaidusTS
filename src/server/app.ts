console.log("\n\n===============>\t app starting\n");

import * as mysql from 'mysql';
import { createServer, Server } from 'http';
import * as express from 'express';
import * as socketIo from 'socket.io';
import * as path from 'path';
import * as CONSTANTS from './constants/constants';
import { Player } from './objects/Player'


export class App {
    public static readonly PORT:number = 8080;
    public app: express.Application;
    private server: Server;
    public io: SocketIO.Server;
    private port: string | number;
    public db: mysql.Connection;
    private dbConfig = {
        host        : CONSTANTS.HOST,
        user        : CONSTANTS.USER,
        password    : CONSTANTS.DBPASSWORD,
        database    : ''
    };

    constructor() {
        this.createApp();
        this.config();
        this.createServer();
        this.Routes();
        this.sockets();
        this.listen();
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

            socket.on('signIn', (signInInfo) => {
                // TODO: compare sign in info with DB
                console.log(`\n\n===============>\t Player logging in\n`)
                console.log(`===============>\t username: ${signInInfo.username}\n`)
                console.log(`===============>\t password: ${signInInfo.password}\n`)
                this.CreatePlayer(socket, true, 1);
            })
            
            // TODO: login --> create new player or grab existing player from DB
            this.CreatePlayer(socket, true, 1);
            socket.on('disconnect', () => {
            console.log(`\n\n===============>\t client disconnected\n`);
            });
        });
    }

    private CreatePlayer(socket: socketIo.EngineSocket, isNew: boolean, id: number): void {
        let playerInfo = {
            isNew: isNew,
            id: id
        }
        let player = new Player(this.io, socket, this.db, playerInfo);
        socket.emit('signedIn', {skills: player.skills})
    }

    private dbConnect(): void {
        var db = mysql.createConnection(this.dbConfig);
        db.connect((err) => {
            if (err) {
                throw err
            }else {
                console.log(`\n\n===============>\t mySQL connected\n`);
                let sql = 'CREATE DATABASE IF NOT EXISTS elevaidus';
                db.query(sql, (err, result) => {
                    if (err) {
                        throw err
                    }else {
                        console.log(`\n\n===============>\t database check\n`);
                        db.end();
                        this.dbConfig.database = CONSTANTS.DATABASE;
                        db = mysql.createConnection(this.dbConfig);
                        db.connect((err) => {
                            if (err) {
                                throw err
                            }else {
                                console.log(`\n\n===============>\t ${CONSTANTS.DATABASE} database connected\n`);
                                sql = "CREATE TABLE IF NOT EXISTS Player(id int AUTO_INCREMENT, email VARCHAR(255), username VARCHAR(30), password VARCHAR(255), PRIMARY KEY (id), UNIQUE KEY email (email))"
                                db.query(sql, (err, result) => {
                                    if (err) {
                                        throw err
                                    }else {
                                        console.log(`\n\n===============>\t ${CONSTANTS.DATABASE} database tables check\n`);
                                    }
                                });
                            }
                        }); 
                    }
                })
            }
        });
        this.db = db;
    }

}
