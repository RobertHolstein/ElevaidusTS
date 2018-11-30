import { PlayerInfo } from "../../../shared/const";

export function AddPlayerInfo(player:PlayerInfo) {
    $('#playerUsername').append(player.username);
    $('#playerSkills').append(player.skills.toString());
    $('#playerClass').append(player.class);
    $('#playerZone').append(player.zone);
    $('#playerHealth').append(player.health.toString());
    player.skills.forEach(i => {
        $('#skillTable').append(`
    <tr>
        <td ${i.name}Name>${i.name}</td>
        <td id="${i.name}Level">${i.level}</td>
        <td id="${i.name}Progress">${i.progress}</td>
    </tr>
    `)
    });
    
}