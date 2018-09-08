

export class Player extends Phaser.GameObjects.Sprite {
    socket: SocketIOClient.Socket;
    mouse: Phaser.Input.Pointer;
    constructor(params: any){
        super(params.scene, params.x, params.y, params.key);
        this.socket = params.socket;
        this.Listen();
        this.mouse = this.scene.input.activePointer;
        params.scene.add.existing(this);
    }

    CheckPlayerMovement(): void {
        if(this.mouse.isDown){
            console.log(this.mouse.x);
            console.log(this.mouse.y);
        }

    }

    private Listen(): void {

    }

}