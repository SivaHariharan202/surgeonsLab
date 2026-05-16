import {
USER,
LOGIN_USER,LOGOUT_USER,CREATE_USER,ALL_USER
} from '../../constants/ActionType';


export const User = (payload) => {

  return {
    type: USER,
    payload,
  };
};


export const loginUser = (payload) => {

  return {
    type: LOGIN_USER,
    payload,
  };
};


export const logoutUser = (payload) => {

  return {
    type: LOGOUT_USER,
    payload,
  };
};

export const createUser = (payload) => {

  return {
    type: CREATE_USER,
    payload,
  };
};

export const allUser = () => {

  return {
    type: ALL_USER,
    
  };
};