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
  callback: (consumer) => {
    // do something with this information, e.g. save it to a DB
  },
  noConsumerCallback: () => {
    // do something to record consumers who do not identify themselves
  },
  strict: true, // defaults to false, will return a 400 if no consumer is specified
});
```
