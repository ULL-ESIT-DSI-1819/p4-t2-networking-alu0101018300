/** gulpfile.js
* @author Adrián Ramos Mejías - Grado en Ingeniería Informática ULL
*/
'use strict';
const assert = require('assert');
const EventEmitter = require('events').EventEmitter;
const LDJClient = require('../lib/ldj-client.js');

describe('LDJClient', () => {
  let stream = null;
  let client = null;

    beforeEach(() => {
      stream = new EventEmitter();
      client = new LDJClient(stream);
    });
  it('should emit a message event from split data events', done => {
    client.on('message', message => {
      assert.deepEqual(message, {foo: 'bar'});
      done();
    });
    stream.emit('data', '{"foo":"bar"}\n');
    process.nextTick(() => stream.emit('data', '"bar"}\n'));
  });
});
