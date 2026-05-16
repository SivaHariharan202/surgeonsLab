import {CREATE_TASK,UPDATE_TASK,MY_TASK,GET_TASK, FIND_ALL
} from '../../constants/ActionType';


export const createTask = (payload) => {
  return {
    type: CREATE_TASK,
    payload,
  };
};

export const updateTask = (payload) => {
  return {
    type: UPDATE_TASK,
    payload,
  };
};

export const myTask = () => {
  return {
    type: MY_TASK,
  };
};


export const getTask = () => {
  return {
    type: GET_TASK,
  };
};



export const findAll = () => {
  return {
    type: FIND_ALL,
  };
};