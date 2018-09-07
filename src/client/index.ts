/// <reference path="./phaser.d.ts"/>

import { PlayerInfo } from "../shared/const"
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
    this.sendMessage('testing connectivity from frontend');
    this.Listen();
  }

  // EMITTER
  private sendMessage(msg: string) {
    this.socket.emit('messageFromFrontend', msg );
  }

  public SignIn(): void {
    this.socket.emit('signIn', {username: signInUsername.value, password: signInPassword.value })
  }
  
  public SignUp(): void {
    this.socket.emit('signUp', {username: signInUsername.value, password: signInPassword.value })
  }

  private Listen(): void {
    this.socket.on('errorFromBackend', (err: string) => {
      alert(err);
    });
    this.socket.on('messageFromBackend', (m: string) => {
      console.log(`\n\n===============>\t ${m}\n`);
    });
    this.socket.on('join', (playerInfo: any) => {
      this.CreateGame(playerInfo);
    })
    this.socket.on('currentPlayers', (playersInfo: PlayerInfo[]) => {
      playersInfo.forEach(player => {
        console.log(player);
      });
    })
    this.socket.on('addPlayer', (playerInfo: PlayerInfo) => {
      console.log(`\n\n===============>\t new player arrived in your area\n`);
      console.log(playerInfo);
    })
    this.socket.on('removePlayer', (playerInfo: PlayerInfo) => {
      console.log(`\n\n===============>\t player left your area\n`);
      console.log(playerInfo);
    })
  }
  
  private CreateGame(playerInfo: any): void{
    form.hidden = true;
    if(!game){
    game = new Phaser.Game(config);
    }
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

