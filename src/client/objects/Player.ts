export class Player extends Phaser.GameObjects.Sprite {
    mouse: Phaser.Input.Pointer;
    constructor(params: any){
        super(params.scene, params.x, params.y, params.key);
        this.mouse = this.scene.input.activePointer;
    }

    JoinPlayerToScene(scene: Phaser.Scene, cords: {x:number,y:number}): void {
        this.x = cords.x;
        this.y = cords.y;
        scene.add.existing(this);
    }

    CheckPlayerMovement(): void {
        if(this.mouse.isDown){
            console.log(this.mouse.x);
            console.log(this.mouse.y);
        }
    }
}