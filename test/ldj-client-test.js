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

    it('should emit a message event from a single data event', done => {
      client.on('message', message => {
        assert.deepEqual(message, {foo: 'bar'});
        done();
      });
      stream.emit('data', '{"foo":"bar"}\n');
    });
      it('should finish within 5 seconds', done => {
      setTimeout(done,4500);
    }).timeout(5000);
  });
