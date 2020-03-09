module.exports = ({ consumerCallback, noConsumerCallback, strict } = {}) => (req, res, next) => {
  const body = req.body || {};
  const consumer = req.query.consumer || body.consumer;
  if (consumer) {
    consumerCallback && consumerCallback(consumer, req);
    return next();
  } 
  
  noConsumerCallback && noConsumerCallback(req);
  
  if (strict) {
    return res.sendStatus(400);
  }
  
  next();
}
