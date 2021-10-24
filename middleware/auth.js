const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function (req, res, next) {
  //get the token from the request.header
  const token = req.header("x-auth-token");

  //check if there's a token
  if (!token) {
    //status(401) is unauthorised because there is no token in the header
    return res.status(401).json({
      msg: "No token, authorization denied!",
    });
  }

  //else if there is a token we verify it
  try {
    //jwt.verify(the-token, the-secret)
    const decoded = jwt.verify(token, config.get("jwtSecret"));

    req.user = decoded.user;
    next();
  } catch (err) {
    if (err) {
      res.status(401).json({ msg: "Token is not valid!" });
    }
  }
};
