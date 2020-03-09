module.exports = ({ callback, noConsumerCallback, strict }) => (req, res, next) => {
  const consumer = req.query.consumer || req.body.consumer;
  if (consumer) {
    callback && callback(consumer);
    return next();
  } 
  
  noConsumerCallback && noConsumerCallback();
  
  if (strict) {
    return res.sendStatus(400);
  }
  
  next();
}
