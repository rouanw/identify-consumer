const assert = require('assert');
const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser')
const identifyConsumer = require('.');

function setup(middleware, routeArgs) {
  const app = express();
  app.use(bodyParser.json());
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
  it('calls the provided callback with a query string param identifying the consumer', (done) => {
    const middleware = identifyConsumer({
      callback: (consumer) => {
        assert.equal(consumer, 'someone');
        done();
      },
    });
    server = setup(middleware, ['/here', return200]);
    request(server)
      .get('/here?consumer=someone')
      .end(() => {
        // do nothing, wait for callback instead
      });
  });
  it('calls the provided callback with a key on the body identifying the consumer', (done) => {
    const middleware = identifyConsumer({
      callback: (consumer) => {
        assert.equal(consumer, 'someone');
        done();
      },
    });
    server = setup(middleware, ['/here', return200]);
    request(server)
      .post('/here')
      .send({ stuff: 'stuff', consumer: 'someone' })
      .end(() => {});
  });
});
