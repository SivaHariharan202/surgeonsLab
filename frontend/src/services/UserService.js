import axios from "axios";
import { APICONFIG } from "../config/ApiConfig";
// import {
//     USER,
//     USER_SUCCESS,
//     USER_ERROR,
//     LOGIN_USER,
//     LOGOUT_USER
// } from "../constants/ActionType";

const authHeader = () => {
  const token = sessionStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};


const HOST = APICONFIG.HOST;
const USER_API = APICONFIG.USER;

const createUser = async (payload) => {
  try {
   
    const response = await axios.post(HOST + USER_API.CREATE_USER, payload, 
      // withCredentials: true,
       { headers: { ...authHeader() } }
    );
    return response;
  } catch (error) {
    throw error;
  }
};

const loginUser = async (payload) => {
  try {
   
    const response = await axios.post(HOST + USER_API.LOGIN_USER, payload, {
      withCredentials: true,
    });
    console.log("call service login")
    return response;
  } catch (error) {
    throw error;
  }
};


const logoutUser = async (payload) => {
  try {
   
    const response = await axios.post(HOST + USER_API.LOGOUT_USER, payload, {
      withCredentials: true,
    });
    console.log("call service login")
    return response;
  } catch (error) {
    throw error;
  }
};




const allUser = async () => {
    const response = await axios.get(
    HOST +  USER_API.ALL_USER,
    
    { headers: { ...authHeader() } }
  );
  return response;
};


export const UserService = {
  CREATE_USER: createUser,
  LOGIN_USER: loginUser,
  LOGOUT_USER:logoutUser,
  ALL_USER :allUser,
};
