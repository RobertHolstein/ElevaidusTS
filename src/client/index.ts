/// <reference path="./phaser.d.ts"/>

import * as io from 'socket.io-client';
import 'phaser';
import { GameScene } from "./scenes/gameScene";

var signInDiv = document.getElementById('signInDiv');
var signInUsername = document.getElementById('signInUsername') as HTMLInputElement;
var signInPassword = document.getElementById('signInPassword') as HTMLInputElement;
var signInBtn = document.getElementById('signInBtn');
var signUpBtn = document.getElementById('signUpBtn');

const config: GameConfig = {
  title: "Elevaidus",
  version: "1.0",
  width: 640,
  height: 640,
  type: Phaser.AUTO,
  parent: "game",
  scene: [ GameScene ],
  input: {
    keyboard: true
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  },

};



export class ioService {
    private socket: SocketIOClient.Socket;
  
    constructor() {
      this.socket = io.connect();
    }
  
    // EMITTER
    sendMessage(msg: string) {
      this.socket.emit('messageFromFrontend', msg );
      this.socket.on('messageFromBackend', (m: string) => {
        console.log(`\n\n===============>\t ${m}\n`);
        });
    }

    SignIn(): void {
      this.socket.emit('signIn', {username: signInUsername.value, password: signInPassword.value })
      this.socket.on('signedIn', (info: any) => {
        var game = new Phaser.Game(config);
        signInDiv.hidden = true;
        console.log(info)
      })
    }
  
}

var socket = new ioService();
socket.sendMessage('hello from the frontend!');

signInBtn.onclick = () => {
  socket.SignIn();
}
