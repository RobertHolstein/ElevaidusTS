export class Player extends Phaser.GameObjects.Sprite {
    socket: SocketIOClient.Socket;
    constructor(params){
        super(params.scene, params.x, params.y, params.key);
        this.socket = params.socket;
    }

}