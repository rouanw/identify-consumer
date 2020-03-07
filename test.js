const assert = require('assert');
const request = require('supertest');
const express = require('express');
const identifyConsumer = require('.');

function setup(middleware, routeArgs) {
  const app = express();
  app.use(middleware);
  app.get(...routeArgs);
  return app.listen(13000);
}

const return200 = (req, res) => res.sendStatus(200);

describe('identify-consumer', () => {
  let server;
  afterEach(() => {
    server.close();
  });
  it('call the provided callback with a query string param identifying the consumer', (done) => {
    const middleware = identifyConsumer({
      callback: (consumer) => {
        assert.equal(consumer, 'someone');
        done();
      },
    });
    server = setup(middleware, ['/here', return200]);
    request(server)
      .get('/here?consumer=someone')
      .then(() => {});
  });
});
