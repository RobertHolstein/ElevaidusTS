import {Skill} from './Skill';
import { CONST } from '../const/const';


export class PlayerClass {
    name: string;
    skills: Skill[];
    constructor(name:string, skills: Skill[]){
        this.name = name;
        this.skills = skills;
    }
}

export function GetPlayerClasses(){
    let playerClasses: Array<PlayerClass> = new Array<PlayerClass>();
    CONST.PLAYERCLASSES.forEach(pClass => {
        playerClasses.push(
            new PlayerClass(
                pClass.name,
                 [ 
                     {name: 'farming', level: pClass.farming, progress: 0 }, 
                     {name: 'mining', level: pClass.mining, progress: 0 }, 
                     {name: 'healing', level: pClass.healing, progress: 0 }, 
                     {name: 'fighting', level: pClass.fighting, progress: 0 },
                     {name: 'crafting', level: pClass.crafting, progress: 0 },
                ]
            )
        )
    });
    return playerClasses;
}
