const isAuthenticated = (req, res, next) => {
  if (req.session.user === undefined) {
    return res.status(401).json("you do not have access.");
  }else if (req.session.user !== undefined){
    return res.status(200).json(`Logged in as ${req.session.user.displayName}`);
  }
  next();
};

module.exports = {
  isAuthenticated,
};
