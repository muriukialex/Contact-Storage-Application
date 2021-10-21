const express = require("express");

const router = express.Router();

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const config = require("config");

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
    check("name", "Please enter a name").not().isEmpty(),
    check("email", "Please enter a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({
      min: 6,
    }),
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

    //req.body has email, name and password
    const { name, email, password } = req.body;

    try {
      //we check if the user already exists through the email passed
      let user = await User.findOne({ email: email });

      //if the user exists we return a json message that says user already exists
      if (user) {
        return res.status(400).json({ msg: "User already exists!" });
      }

      //else if the user doesnot exist we create a user schema using the User Schema we made
      user = new User({
        name: name,
        email: email,
        password: password,
      });

      //before we store the user into the database we have to encrypt the user's password
      const salt = await bcrypt.genSalt(10);

      //we have to encrypt the password using the bcrypt.hash() method
      user.password = await bcrypt.hash(password, salt);

      //we have to save the user's information into the database and we achieve that using
      //using await returns a promise and save the user's information into the database
      await user.save();

      //we send the payload because we can get specid=fic data
      const payload = {
        user: {
          id: user.id,
        },
      };

      //we add a jsonwbtoken that expires after 36000 seconds
      jwt.sign(
        payload,
        config.get("jwtSecret"),
        {
          expiresIn: 360000,
        },
        (err, token) => {
          if (err) throw err;
          res.json({
            token: token,
          });
        }
      );
    } catch (err) {
      //we return the err.message if there is any error that we encounter
      console.error(err.message);
      //if there is an error message send a http response of 500 meaning server error
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;
