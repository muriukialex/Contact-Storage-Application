const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function (req, res, next) {
  //get the token from the request.header
  const token = req.header("x-auth-token");

  //check if it's not the token
  if (!token) {
    //status(401) is unauthorised
    return res.status(401).json({
      msg: "No token, authorization denied!",
    });
  }

  //else if there is a token we verify it
  try {
    //jwt.verify(the-token, the-secret)
    const decoded = jwt.verify(token, config.get("jwtSecret"));
  } catch (err) {}
};
