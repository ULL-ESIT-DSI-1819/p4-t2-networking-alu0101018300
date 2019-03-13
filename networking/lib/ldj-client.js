'use strict';
const EventEmitter = require('events').EventEmitter;
class LDJClient extends EventEmitter {
  constructor(stream) {
    super();
    let buffer = '';
    stream.on('data', data => {
      buffer += data;
      let boundary = buffer.indexOf('\n');
      while (boundary !== -1) {
        const input = buffer.substring(0, boundary);
        buffer = buffer.substring(boundary + 1);
        this.emit('message', JSON.parse(input));
        boundary = buffer.indexOf('\n');
      }
      try {
        this.emit('message', JSON.parse(input));
      } catch(e) {
          throw new Error("El mensaje enviado no es un JSON");
      }
    });
    stream.on('close', () => {
      let boundary = buffer.indexOf('}');
      if(boundary !== -1){
        const input = buffer.substring(0, boundary);
        buffer = buffer.substring(boundary + 1);
      try {
        this.emit('message', JSON.parse(input));
      } catch(e) {
          throw new Error("El mensaje enviado no es un JSON");
      }
      } else {
      buffer = '';
      }
  this.emit('close');
});
  }

  static connect(stream) {
    return new LDJClient(stream);
  }
}

module.exports = LDJClient;
