export let SHARED = {
    // map
    ZONELTRS: ['a', 'b', 'c', 'd', 'e'],
    ZONES: ['a1','a2','a3','a4','a5','b1','b2','b3','b4','b5','c1','c2','c3','c4','c5','d1','d2','d3','d4','d5','e1','e2','e3','e4','e5',],
    ZONESIZE: 128,
    MAPSTARTX: 320,
    MAPSTARTY: 0,
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
    skills: {}[];
    class: string;
    zone: string;
    health: number;
}