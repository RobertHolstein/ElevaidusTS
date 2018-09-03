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
    this.sendMessage('hello from the frontend!');
  }

  // EMITTER
  private sendMessage(msg: string) {
    this.socket.emit('messageFromFrontend', msg );
    this.socket.on('messageFromBackend', (m: string) => {
      console.log(`\n\n===============>\t ${m}\n`);
      });
  }

  public SignIn(): void {
    this.socket.emit('signIn', {username: signInUsername.value, password: signInPassword.value })
    this.socket.on('signedIn', (playerInfo: any) => {
      this.CreateGame(playerInfo);
    })
    this.socket.on('errorFromBackend', (err: string) => {
      alert(err);
    })
  }
  
  public SignUp(): void {
    this.socket.emit('signUp', {username: signInUsername.value, password: signInPassword.value })
    this.socket.on('signedUp', (playerInfo: any) => {
      this.CreateGame(playerInfo)
    })
    this.socket.on('errorFromBackend', (err: string) => {
      alert(err);
    })
  }
  
  private CreateGame(playerInfo: any): void{
    signInDiv.hidden = true;
    var game = new Phaser.Game(config);
    console.log(playerInfo)
  }
}

var socket = new ioService();

signInBtn.onclick = () => {
  socket.SignIn();
}
signUpBtn.onclick = () => {
  socket.SignUp();
}