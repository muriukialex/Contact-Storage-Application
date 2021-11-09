import React, { Fragment, useContext, useEffect } from "react";

import { CSSTransition, TransitionGroup } from "react-transition-group";

import ContactContext from "../../context/contact/contactContext";

import ContactItem from "./ContactItem";

import Spinner from "../layout/Spinner";

const Contacts = () => {
  const contactContext = useContext(ContactContext);

  const { contacts, filtered, getContacts, loading } = contactContext;

  //useEffect for the following to run only once when the code runs for the first time
  useEffect(() => {
    getContacts();
    //eslint-disable-next-line
  }, []);

  //if there are no contacts show this message
  if (contacts !== null && contacts.length === 0 && !loading) {
    return <h4>Please add a contact.</h4>;
  }

  return (
    <Fragment>
      {/*if the contacts is not empty and not loading*/}
      {contacts !== null && !loading ? (
        <TransitionGroup>
          {/*if the filtered items is not empty, map through those items else map through the contact items*/}
          {filtered !== null
            ? filtered.map((contact) => (
                <CSSTransition
                  key={contact._id}
                  timeout={500}
                  classNames="item"
                >
                  <ContactItem contact={contact} />
                </CSSTransition>
              ))
            : contacts.map((contact) => (
                <CSSTransition
                  key={contact._id}
                  timeout={500}
                  classNames="item"
                >
                  <ContactItem contact={contact} />
                </CSSTransition>
              ))}
        </TransitionGroup>
      ) : (
        <Spinner />
      )}
    </Fragment>
  );
};

export default Contacts;
