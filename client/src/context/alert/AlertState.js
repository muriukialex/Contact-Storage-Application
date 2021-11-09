import { SET_ALERT, REMOVE_ALERT } from "../types";

import { useReducer } from "react";
import { v4 as uuid } from "uuid";

import AlertContext from "./alertContext";
import alertReducer from "./alertReducer";

const AlertState = (props) => {
  const initialState = [];

  const [state, dispatch] = useReducer(alertReducer, initialState);

  //actions taken
  //set alert action and remove alerts
  const setAlert = (msg, type, timeout = 8000) => {
    const id = uuid();

    dispatch({
      type: SET_ALERT,
      payload: {
        msg,
        type,
        id,
      },
    });

    //a timeout to show the alert only for 3000ms
    setTimeout(() => {
      dispatch({ type: REMOVE_ALERT, payload: id });
    }, timeout);
  };

  return (
    <AlertContext.Provider
      value={{
        alerts: state,
        setAlert,
      }}
    >
      {props.children}
    </AlertContext.Provider>
  );
};

export default AlertState;
