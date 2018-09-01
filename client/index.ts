import * as io from 'socket.io-client';

export class ioService {
    private socket: SocketIOClient.Socket;
  
    constructor() {
      this.socket = io.connect();
    }
  
    // EMITTER
    sendMessage(msg: string) {
      this.socket.emit('messageFromFrontend', msg );
      this.socket.on('messageFromBackend', (m: string) => {
        console.log(`\n\n===============>\t ${m}\n`);
        });
    }
  
  }

  var socket = new ioService();
  socket.sendMessage('hello from the frontend!');