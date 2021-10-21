const express = require("express");

const router = express.Router();

//@route  GET   api/contacts
//@desc         get all user contacts
//@access       private
router.get("/", (req, res) => {
  res.send("Get all user contacts");
});

//@route  POST  api/contacts
//@desc         add new contact
//@access       private
router.post("/", (req, res) => {
  res.send("add new user contact");
});

//@route  PUT   api/contacts/:id
//@desc         update user contact
//access        private
router.put("/:id", (req, res) => {
  res.send("update user contact");
});

//@route  DELETE  api/contacts/:id
//@desc           delete user contact
//access          private
router.delete("/:id", (req, res) => {
  res.send("delete user contact");
});

module.exports = router;
