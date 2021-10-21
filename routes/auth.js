//this file enables users to login

const express = require("express");

const router = express.Router();

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const config = require("config");

//import the User model from the UserSchema we created in the models/User.js file
const User = require("../models/User");

const { check, validationResult } = require("express-validator/check");

//@route  GET   api/auth
//@desc         get logged in user
//@access       private
router.get("/", (req, res) => {
  res.send("Get logged in user");
});

//@route  POST  api/auth
//@desc         log in user and get token
//@access       public
router.post(
  "/",
  [
    //this array is for validation to ensure that we a get an email and a password from the user
    check("email", "Please enter a valid email").isEmail(),
    check("password", "Please enter the correct password").exists(),
  ],
  async (req, res) => {
    //we have a variable called errors that takes in the errors from the routes
    const errors = validationResult(req);

    //check if the errors array is empty
    if (!errors.isEmpty()) {
      //400 ststus means the user didnot fullfill the required fields for the request
      return res.status(400).json({
        //if the users request body does not meet the checks above return a json with the fields that failed
        errors: errors.array(),
      });
    }

    const { email, password } = req.body;

    try {
      //we check if the user is there and we check using email
      let user = await User.findOne({ email });

      //if there's no user with that email
      if (!user) {
        res.status(400).json({
          msg: "Invalid credentials(email/password)",
        });
      }

      //isMatch has either true or false
      //depending with if the passed password matches the user's password stored in the database
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({
          msg: "Invalid password!",
        });
      }

      //if the user's password matches the password in the database
      //we pass in the payload
      const payload = {
        user: {
          id: user.id,
        },
      };
      //we have the JsonWebToken
      jwt.sign(
        payload,
        config.get("jwtSecret"),
        {
          expiresIn: 36000,
        },
        (err, token) => {
          if (err) throw err;
          res.json({
            token: token,
          });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error!");
    }
  }
);

module.exports = router;
