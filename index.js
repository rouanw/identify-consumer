module.exports = ({ callback }) => (req, res, next) => {
  const consumer = req.query.consumer || req.body.consumer;
  callback(consumer);
  next();
}
