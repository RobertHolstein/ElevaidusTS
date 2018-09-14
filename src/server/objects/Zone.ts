import { PlayerInfo } from "../../shared/const"
import { CONST } from '../const/const';

export class Zone {
    name: string;
    x: number;
    y: number;
    players: PlayerInfo[];
    constructor(name:string, x:number, y:number){
        this.name = name;
        this.x = x;
        this.y = y
        this.players = [];
    }
}

export function GetZones() {
    var zones: Array<Zone> = new Array<Zone>();
    CONST.ZONES.forEach(i => {
        zones.push(new Zone(i.name,i.x,i.y))
    });
    return zones;
}