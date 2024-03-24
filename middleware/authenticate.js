const isAuthenticated = (req, res, next) => {
  if (req.sesion.user === undefined) {
    return res.status(401).json("you do not have access.");
  }
  next();
};

module.exports = {
  isAuthenticated,
};
