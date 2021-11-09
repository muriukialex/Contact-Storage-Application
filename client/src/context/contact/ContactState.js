import React, { useReducer } from "react"; //enables us to use state and actions
import axios from "axios"; //to enable us interact with the server

import ContactContext from "./contactContext"; //bring in our context
import contactReducer from "./contactReducer"; //bring in our reducer

import {
  ADD_CONTACT,
  DELETE_CONTACT,
  SET_CURRENT,
  CLEAR_CURRENT,
  UPDATE_CONTACT,
  FILTER_CONTACTS,
  CLEAR_FILTER,
  CONTACT_ERROR,
  GET_CONTACTS,
  CLEAR_CONTACTS,
} from "../types";

const ContactState = (props) => {
  //set up an initial state containing objects...
  //later on we fill up this state by making requests to the backend for data
  const initialState = {
    contacts: null,
    current: null, //whatever is being edited is added to this current value
    filtered: null,
    error: null,
  };

  //state allow to use anything in our state
  //dispatch allow to dispatch objects to the reducer
  const [state, dispatch] = useReducer(contactReducer, initialState);

  //our actions go here

  //get contacts
  //we fetch(get) contacts from the api/contacts/
  //for a specific user
  const getContacts = async () => {
    try {
      const res = await axios.get("/api/contacts");

      dispatch({
        type: GET_CONTACTS,
        payload: res.data,
      });
    } catch (err) {
      dispatch({
        type: CONTACT_ERROR,
        payload: err.response.msg,
      });
    }
  };

  //add contact
  //obj is an object that has the contact values
  //contact --> is an object
  const addContact = async (contact) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    //this is where we interact with the server to add the contact (which is object)
    try {
      const res = await axios.post("/api/contacts", contact, config);

      dispatch({
        type: ADD_CONTACT,
        payload: res.data,
      });
    } catch (err) {
      dispatch({
        type: CONTACT_ERROR,
        payload: err.response.msg,
      });
    }
  };

  //delete contact
  const deleteContact = async (_id) => {
    //works by filtering out an item using it's id
    dispatch({ type: DELETE_CONTACT, payload: _id });
    //send a request to the server to delete the contact using the id passed
    try {
      await axios.delete(`/api/contacts/${_id}`);

      dispatch({
        type: DELETE_CONTACT,
        payload: _id,
      });
    } catch (err) {
      dispatch({
        type: CONTACT_ERROR,
        payload: err.response.msg,
      });
    }
  };

  //update contact
  const updateContact = async (contact) => {
    //because we are sending data to a server we need a config with a header and content type
    const config = {
      header: {
        "Content-Type": "application/json",
      },
    };

    try {
      const res = await axios.put(
        `/api/contacts/${contact._id}`,
        contact,
        config
      );

      dispatch({
        type: UPDATE_CONTACT,
        payload: res.data,
      });
    } catch (err) {
      dispatch({
        type: CONTACT_ERROR,
        payload: err.response.msg,
      });
    }
    dispatch({ type: UPDATE_CONTACT, payload: contact });
  };

  //set current contact (for editing in the contact form)
  const setCurrent = (contact) => {
    dispatch({ type: SET_CURRENT, payload: contact });
  };

  //clear current contact (responsible for dropping whatever is in the contact form)
  const clearCurrent = () => {
    dispatch({ type: CLEAR_CURRENT });
  };

  //filter contact
  const filterContacts = (text) => {
    dispatch({ type: FILTER_CONTACTS, payload: text });
  };

  //clear filter
  const clearFilter = () => {
    dispatch({ type: CLEAR_FILTER });
  };

  //we clear contacts from state immediately the user logs out
  const clearContacts = () => {
    dispatch({
      type: CLEAR_CONTACTS,
    });
  };

  //we enable the application to have access to this context
  return (
    <ContactContext.Provider
      //anything we want to access in our application including state and actions go here
      value={{
        contacts: state.contacts,
        current: state.current,
        filtered: state.filtered,
        error: state.error,
        addContact,
        deleteContact,
        setCurrent,
        clearCurrent,
        updateContact,
        filterContacts,
        clearFilter,
        getContacts,
        clearContacts,
      }}
    >
      {props.children}
    </ContactContext.Provider>
  );
};

export default ContactState;
