module.exports = ({ callback, noConsumerCallback, strict } = {}) => (req, res, next) => {
  const body = req.body || {};
  const consumer = req.query.consumer || body.consumer;
  if (consumer) {
    callback && callback(consumer, req);
    return next();
  } 
  
  noConsumerCallback && noConsumerCallback(req);
  
  if (strict) {
    return res.sendStatus(400);
  }
  
  next();
}
