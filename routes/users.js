const express = require("express");

const router = express.Router();

//import the User model from the UserSchema we created in the models/User.js file
const User = require("../models/User");

const { check, validationResult } = require("express-validator/check");

//define the users routes
//@route  POST  api/users
//@desc         Register new user
//@access       Public
router.post(
  "/",
  [
    //express-validator makes all this possible by using check
    //check("field-that-you-want-to-check", "message-if-the-field-condtion-fails")
    //    the .not().isEmpty() ensures that the name field is not empty
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please enter a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({
      min: 5,
    }),
  ],
  (req, res) => {
    res.send(req.body);
  }
);

module.exports = router;
