export let SHARED = {
    // map
}

export function Resize(): void {
    var canvas = this.game.canvas, width = window.innerWidth, height = window.innerHeight;
    var wratio = width / height, ratio = canvas.width / canvas.height;
    if (wratio < ratio) {
        canvas.style.width = width + "px";
        canvas.style.height = (width / ratio) + "px";
    } else {
        canvas.style.width = (height * ratio) + "px";
        canvas.style.height = height + "px";
    }
}

export class PlayerInfo {
    id: number;
    socketId: string;
    username: string;
    skills: Skill[];
    class: string;
    zone: string;
    health: number;
}

export class Skill {
    name: string;
    level: number;
    progress: number;
}