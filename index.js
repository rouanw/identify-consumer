module.exports = ({ callback, noConsumerCallback }) => (req, res, next) => {
  const consumer = req.query.consumer || req.body.consumer;
  if (consumer) {
    callback && callback(consumer);
  } else {
    noConsumerCallback && noConsumerCallback();
  }
  
  next();
}
