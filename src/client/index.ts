/// <reference path="./phaser.d.ts"/>


import * as io from 'socket.io-client';
import 'phaser';
import { GameScene } from "./scenes/gameScene";
import * as $ from "jquery";

var signInUsername = document.getElementById('signInUsername') as HTMLInputElement;
var signInPassword = document.getElementById('signInPassword') as HTMLInputElement;
var loginDiv = document.getElementById('login-form');
var signInBtn = document.getElementById('signInBtn');
var signUpBtn = document.getElementById('signUpBtn');

const config: GameConfig = {
  title: "Elevaidus",
  version: "1.0",
  width: 640,
  height: 640,
  type: Phaser.AUTO,
  parent: "game",
  scene: [ ],
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



export class LoginService {
  private socket: SocketIOClient.Socket;

  constructor(socket:  SocketIOClient.Socket) {
    this.socket = socket;
    this.SendMessage('testing connectivity from frontend');
    this.Listen();
  }

  // EMITTER
  private SendMessage(msg: string) {
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
    this.socket.on('signInSuccess', (playerInfo: any) => {
      this.CreateGame();
    })
  }
  
  private CreateGame(): void{
    loginDiv.hidden = true;
    config.scene = [new GameScene(socket)];
    var game = new Phaser.Game(config);
    $('#GameContainer').show()
  }
}


var socket = io.connect();
var loginService = new LoginService(socket);

signInBtn.onclick = () => {
  loginService.SignIn();
}
signUpBtn.onclick = () => {
  loginService.SignUp();
}


