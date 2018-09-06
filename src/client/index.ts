/// <reference path="./phaser.d.ts"/>

import * as io from 'socket.io-client';
import 'phaser';
import { GameScene } from "./scenes/gameScene";

var signInUsername = document.getElementById('signInUsername') as HTMLInputElement;
var signInPassword = document.getElementById('signInPassword') as HTMLInputElement;
var form = document.getElementById('login-form');
var signInBtn = document.getElementById('signInBtn');
var signUpBtn = document.getElementById('signUpBtn');
var game: Phaser.Game;

const config: GameConfig = {
  title: "Elevaidus",
  version: "1.0",
  width: 1280,
  height: 1280,
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
    this.RegisterListeners();
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
  }
  
  public SignUp(): void {
    this.socket.emit('signUp', {username: signInUsername.value, password: signInPassword.value })
  }

  private RegisterListeners(): void {
    this.socket.on('errorFromBackend', (err: string) => {
      alert(err);
    });
    this.socket.on('signedIn', (playerInfo: any) => {
      this.CreateGame(playerInfo);
    })
    this.socket.on('signedUp', (playerInfo: any) => {
      this.CreateGame(playerInfo)
    })
  }
  
  private CreateGame(playerInfo: any): void{
    form.hidden = true;
    if(!game){
    game = new Phaser.Game(config);
    }
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

form.onsubmit=function() {
  return false;
}

