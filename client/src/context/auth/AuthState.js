import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  CLEAR_ERRORS,
} from "../types";
import { useReducer } from "react";

import axios from "axios";

import AuthContext from "./authContext";
import authReducer from "./authReducer";

import setAuthToken from "../../utils/setAuthToken";

const AuthState = (props) => {
  const initialState = {
    token: localStorage.getItem("token"),
    isAuthenticated: null,
    user: null,
    loading: true,
    error: null,
  };

  const [state, dispatch] = useReducer(authReducer, initialState);

  //Load User --> loads all users
  //means we load the users info from the server and put it in the state
  const loadUser = async () => {
    // @todo - load token into global headers
    //if there exists a token in the localStorage
    if (localStorage.token) {
      setAuthToken(localStorage.token);
    }

    try {
      //we make a request to the server
      const res = await axios.get(`/api/auth`);

      //if the response comes back from the server we dispatch smthing to state
      dispatch({
        type: USER_LOADED,
        payload: res.data,
      });
    } catch (err) {
      //if somthing goes wrong we dispatch an error
      dispatch({
        type: AUTH_ERROR,
      });
    }
  };

  //Register User -->register a new user and get a token
  const register = async (formData) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      const res = await axios.post("/api/users", formData, config);

      dispatch({
        type: REGISTER_SUCCESS,
        payload: res.data,
      });

      loadUser();
    } catch (err) {
      dispatch({
        type: REGISTER_FAIL,
        payload: err.response.data.msg,
      });
    }
  };

  //Login User -->login a new user and get a token
  const login = async (formData) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      const res = await axios.post("/api/auth", formData, config);

      dispatch({
        type: LOGIN_SUCCESS,
        payload: res.data,
      });

      loadUser();
    } catch (err) {
      dispatch({
        type: LOGIN_FAIL,
        payload: err.response.data.msg,
      });
      // console.log(err.response.data.msg);
    }
  };

  //Logout User -->logout user and destroy token
  const logout = () =>
    dispatch({
      type: LOGOUT,
    });

  //Clear Errors -->clears out any errors in the state
  const clearErrors = () =>
    dispatch({
      type: CLEAR_ERRORS,
    });

  return (
    <AuthContext.Provider
      value={{
        register,
        loadUser,
        login,
        logout,
        clearErrors,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        loading: state.loading,
        error: state.error,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthState;
