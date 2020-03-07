module.exports = ({ callback }) => (req, res, next) => {
  const consumer = req.query.consumer;
  callback(consumer);
  next();
}
