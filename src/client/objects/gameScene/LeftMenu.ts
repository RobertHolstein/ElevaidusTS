import { PlayerInfo } from "../../../shared/const";

export function AddPlayerInfo(player:PlayerInfo) {
    $('#playerUsername').html(player.username);
    $('#playerSkills').html(player.skills.toString());
    $('#playerClass').html(player.class);
    $('#playerZone').html(player.zone);
    $('#activeSkill').html(player.activeSkill);
    $('#playerHealth').html(player.health.toString());
    player.skills.forEach(i => {
        $('#skillTable').append(`
        <tr>
            <td ${i.name}Name>${i.name}</td>
            <td id="${i.name}Level">${Math.floor(i.level)}</td>
            <td id="${i.name}Progress">${i.progress}</td>
        </tr>
        `)
    });
}

export function ChangeActiveSkill(socket: SocketIOClient.Socket) {
    $('#farmingBtn').on('click', () =>{
        socket.emit('ChangeActiveSkill', 'farming');
    });
    $('#miningBtn').on('click', () =>{
        socket.emit('ChangeActiveSkill', 'mining');
    });
    $('#fightingBtn').on('click', () =>{
        socket.emit('ChangeActiveSkill', 'fighting');
    });
    $('#craftingBtn').on('click', () =>{
        socket.emit('ChangeActiveSkill', 'crafting');
    });
}

export function UpdatePlayer(player: PlayerInfo){
    $('#playerUsername').html(player.username);
    $('#playerClass').html(player.class);
    $('#playerZone').html(player.zone);
    $('#activeSkill').html(player.activeSkill);
    $('#playerHealth').html(player.health.toString());
    player.skills.forEach(i => {
        player.skills.forEach(i => {
            $(`#${i.name}Level`).html(`${Math.floor(i.level)}`);
            $(`#${i.progress}Progress`).html(`${i.progress}`);
         });
        
    });
}