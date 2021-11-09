import axios from "axios";

const setAuthToken = (token) => {
  //if the token exists
  if (token) {
    axios.defaults.headers.common["x-auth-token"] = token;
  } else {
    //if the token does not exist
    delete axios.defaults.headers.common["x-auth-token"];
  }
};

export default setAuthToken;
