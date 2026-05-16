import { combineReducers } from 'redux';
import {User} from './User';
import {Task} from './Task1';


const createRootReducer = () => combineReducers({
  
  user:User,
  task:Task,

});

export default createRootReducer;
