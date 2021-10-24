const express = require("express");

const router = express.Router();

//we bring in auth to protect our routes
const auth = require("../middleware/auth");

//we bring in the validation checker from express-validator(helps in validation user inputs, eg.emails, passwords)
const { check, validationResult } = require("express-validator/check");

//bring in the User model
const User = require("../models/User");

//bring in the Contact model
const Contact = require("../models/Contact");

//@route  GET   api/contacts
//@desc         get all user contacts
//@access       private
router.get("/", auth, async (req, res) => {
  //since we are deealing with mongoose and a database we use a try catch block
  try {
    //we try to find the contacts where the user matches the request header sent
    //then we sort the results gotten according to the most recent
    const contacts = await Contact.find({ user: req.user.id }).sort({
      date: -1,
    });

    //if there is no error we return the contacts array gotten
    res.json(contacts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error!");
  }
});

//@route  POST  api/contacts
//@desc         add new contact
//@access       private
router.post(
  "/",
  [auth, [check("name", "name is required").not().isEmpty()]],
  // [auth, [check("name", "Name is required")]] this enables multiple checking auth and name is not to be empty
  async (req, res) => {
    const errors = validationResult(req);
    //if errors variable is not empty
    if (!errors.isEmpty()) {
      //http response of 400 means bad request
      return res.status(400).json({ errors: errors.array() });
    }

    //if there are no errors
    //we pull out the data from the request.body
    const { name, email, phone, type } = req.body;

    //so whatever is in the request body can be added to the ContactSchema using a try catch block

    try {
      //we create a newContact that will hold all the user information passed in the req.body
      const newContact = new Contact({
        name: name,
        email: email,
        phone: phone,
        type: type,
        user: req.user.id,
      });
      //save the details to the database
      const contact = await newContact.save();
      //return contact information to the client
      res.json(contact);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

//@route  PUT   api/contacts/:id
//@desc         update user contact
//access        private
router.put("/:id", auth, async (req, res) => {
  const { name, email, phone, type } = req.body;

  //we build a contactFields object that will include the name,email,phone and type in the contactFields object
  //to check if the fields above have been submitted
  const contactFields = {};
  //if name exists we add it to the contactFields object
  if (name) {
    contactFields.name = name;
  }
  //if email exists we add it to the contactFields object
  if (email) {
    contactFields.email = email;
  }
  //if phone exists we add it to the contactFields object
  if (phone) {
    contactFields.phone = phone;
  }
  //if type exists we add it to the contactFields object
  if (type) {
    contactFields.type = type;
  }

  try {
    //we access the contact by it's id in the req.param.id included above (/:id)
    let contact = await Contact.findById(req.params.id);

    //if the contact has not been found we return a 404 status of not found
    if (!contact) {
      return res.status(404).json({ msg: "Contact Not Found" });
    }
    //make sure the user owns the contacts
    //by comparing if the user's id is equal to the req.user.id
    if (contact.user.toString() !== req.user.id) {
      //if the id's do not match we return an unauthorised response to the user
      return res.status(401).json({ msg: "Not authorised" });
    }

    //we enable the contact editing to happen
    contact = await Contact.findByIdAndUpdate(
      req.params.id,
      {
        $set: contactFields,
      },
      {
        //if contact does not exist just create it
        new: true,
      }
    );

    res.json(contact);
  } catch (err) {
    //if all goes wrong we return the error message and a status of 500 for server error
    console.error(err.message);
    return res.status(500).send("Server Error");
  }
});

//@route  DELETE  api/contacts/:id
//@desc           delete user contact
//access          private
router.delete("/:id", auth, async (req, res) => {
  try {
    //we access the contact by it's id in the req.param.id included above (/:id)
    let contact = await Contact.findById(req.params.id);

    //if the contact has not been found we return a 404 status of not found
    if (!contact) {
      return res.status(404).json({ msg: "Contact Not Found" });
    }
    //make sure the user owns the contacts
    //by comparing if the user's id is equal to the req.user.id
    if (contact.user.toString() !== req.user.id) {
      //if the id's do not match we return an unauthorised response to the user
      return res.status(401).json({ msg: "Not authorised" });
    }
    //we find the contact by the id params in the request header
    await Contact.findByIdAndRemove(req.params.id);

    //we return a json message that the contact has been removed
    res.json({ msg: "Contact has been removed" });
  } catch (err) {
    //if all goes wrong we return the error message and a status of 500 for server error
    console.error(err.message);
    return res.status(500).send("Server Error");
  }
});

module.exports = router;
