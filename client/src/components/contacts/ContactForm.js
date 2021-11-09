import React, { useState, useEffect, useContext } from "react";

import ContactContext from "../../context/contact/contactContext";

const ContactForm = () => {
  const contactContext = useContext(ContactContext);

  //pul out the addContact and setCurrent from the contactContext
  const { addContact, updateContact, current, clearCurrent } = contactContext;

  //we listen to changes in the current value. ie. when the edit button is clicked
  useEffect(() => {
    if (current !== null) {
      setContact(current);
    } else {
      setContact({
        name: "",
        email: "",
        phone: "",
        type: "personal",
      });
    }
  }, [contactContext, current]);

  //we have the contact object in the state that will hold all the variable states for us
  const [contact, setContact] = useState({
    name: "",
    email: "",
    phone: "",
    type: "personal", //default state of personal
  });

  //lets pull the values out of the contact object
  const { name, email, phone, type } = contact;

  const onChange = (e) =>
    setContact({
      ...contact,
      [e.target.name]: e.target.value,
    });

  //clears the contact form
  const clearAll = () => {
    clearCurrent();
  };

  const onSubmit = (e) => {
    e.preventDefault();

    //if the contactForm is not empty onSubmit, add the contact
    //this ensures that the contact to update is not not added as a new contact
    if (current === null) {
      //add the contact object of values entered into the addContact function
      addContact(contact);
    } else {
      //pass in the contact to the updateContact
      updateContact(contact);
      clearCurrent();
    }

    //clear the form after submit
    setContact({
      name: "",
      email: "",
      phone: "",
      type: "personal",
    });
  };

  return (
    <form onSubmit={onSubmit}>
      <h2 className="text-primary">
        {current ? "Edit Contact" : "Add Contact"}
      </h2>
      <input
        type="text"
        placeholder="Name"
        name="name"
        value={name}
        onChange={onChange}
      />
      <input
        type="email"
        placeholder="Email"
        name="email"
        value={email}
        onChange={onChange}
      />
      <input
        type="text"
        placeholder="Phone"
        name="phone"
        value={phone}
        onChange={onChange}
      />
      <h5>Contact Relationship</h5>
      <input
        type="radio"
        name="type"
        value="personal"
        checked={type === "personal"}
        onChange={onChange}
      />
      Personal{" "}
      <input
        type="radio"
        name="type"
        value="professional"
        checked={type === "professional"}
        onChange={onChange}
      />
      Professional
      <div>
        <input
          type="submit"
          value={current ? "Update Contact" : "Add Contact"}
          className="btn btn-primary btn-block"
        />
      </div>
      {current && (
        <div>
          <button className="btn btn-block btn-light" onClick={clearAll}>
            Clear all
          </button>
        </div>
      )}
    </form>
  );
};

export default ContactForm;
