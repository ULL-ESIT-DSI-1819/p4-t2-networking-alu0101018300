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
  it('should throw an error message if it is not a JSON text.', done => {    assert.throws( () => {
      stream.emit('data', 'Not JSON message  ');
      });
      done();
  });
});
