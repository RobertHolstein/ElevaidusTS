import { PlayerInfo } from "../../../shared/const"

export function AddCurrentPlayersToPlayersMenu(socketID:string, players:PlayerInfo[]) {
    for (let p = 0; p < players.length; p++) {
        if(players[p].socketId === socketID){
            continue;
        }
        $('#playersMenu table tbody').append(`
            <tr id=${players[p].socketId}>
                <td>${players[p].username}</td>
            </tr>`
        );
    }
}

export function AddNewPlayerToPlayersMenu(player: PlayerInfo) {
    $('#playersMenu table tbody').append(`
        <tr id=${player.socketId}>
            <td>${player.username}</td>
        </tr>`
    );
}

export function RemovePlayerFromPlayersMenu(player:PlayerInfo) {
    $(`#${player.socketId}`).remove();
}

export function WriteChatMessage(username:string, msg:string) {
    var chatRow = $('#chatBody').parent();
    var isScrolledBottom = chatRow[0].scrollTop === (chatRow[0].scrollHeight - chatRow[0].offsetHeight);
    $('#chatBody').append(`
        <div class="row">
            <div class="col-sm">
            <p class="addBorder" style="padding-left:15px;color:white;">${username}<br/>${msg}</p>
            </div>
        </div>`
    );
    if(isScrolledBottom){
        chatRow.scrollTop(chatRow[0].scrollHeight);
    }
}