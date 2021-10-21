const express = require("express");

const router = express.Router();

//@route  GET   api/auth
//@desc         get logged in user
//@access       private
router.get("/", (req, res) => {
  res.send("Get logged in user");
});

//@route  POST  api/auth
//@desc         log in user and get token
//@access       public
router.post("/", (req, res) => {
  res.send("Authenticate (Log In) user");
});

module.exports = router;
