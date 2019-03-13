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
  it('Error creating an object with null parameter', done => {
      assert.throws( () => {new LDJClient(null);});
      done();
  });
});
