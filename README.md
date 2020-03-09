# identify-consumer
Express middleware to help you identify who is using your endpoints

## Installation

`npm install identify-consumer`

## Usage

```js
const identifyConsumer = require('identify-consumer');
// ...

const app = express();
app.use(identifyConsumer({
  consumerCallback: (consumer, req) => {
    // do something with this information, e.g. save it to a DB
    // req = the express request object
  },
  noConsumerCallback: (req) => {
    // do something to record consumers who do not identify themselves
    // req = the express request object
  },
  strict: true, // defaults to false, will return a 400 if no consumer is specified
});
```
