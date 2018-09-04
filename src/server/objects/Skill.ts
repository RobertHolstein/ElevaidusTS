import { CONST } from '../const/const';

export class Skill {
    name: string;
    level: number;
    progress: number;

    constructor(name:string){
        this.name = name;
        this.level = 0;
        this.progress = 0;
    }
}

export function GetSkills(){
let skills: Array<Skill> = new Array<Skill>();
CONST.SKILLS.forEach(i => {
    skills.push(new Skill(i))    
});
return skills;
}