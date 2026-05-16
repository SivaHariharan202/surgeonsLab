import { call, put, takeEvery } from "redux-saga/effects";
import {
   CREATE_TASK,CREATE_TASK_ERROR,CREATE_TASK_SUCCESS,
   UPDATE_TASK,UPDATE_TASK_ERROR,UPDATE_TASK_SUCCESS,
   MY_TASK,MY_TASK_ERROR,MY_TASK_SUCCESS,
   GET_TASK,GET_TASK_ERROR,GET_TASK_SUCCESS,
   FIND_ALL,FIND_ALL_ERROR,FIND_ALL_SUCCESS
} from "../../constants/ActionType";
import { taskServices } from "../../services/taskServices";
// import { APPCONFIG } from "../../config/AppConfig";
import { APPCONFIG } from "../../config/AppConfig"

function* createTaskAsync(action){

    try{
        const response=yield call(taskServices.CREATE_TASK,action.payload);
        console.log("hii from TASK saga")
         const { status, data } = response.data;// API call with payload
  
     if (status === APPCONFIG.API_STATUS.SUCCESS) {
      yield put({ type: CREATE_TASK_SUCCESS, payload: { data, status } });
    }
  
    else {
      yield put({ type: CREATE_TASK_ERROR, payload: { data, status } });
    }
    }
     catch (error) {
    yield put({
      type: CREATE_TASK_ERROR,
      payload: error.response ? error.response.data : { error: 'Something went wrong' },
    });
  }
}

export function* createTaskSaga() {
    yield takeEvery(CREATE_TASK, createTaskAsync);
}


function* updateTaskAsync(action){

    try{
        const response=yield call(taskServices.UPDATE_TASK,action.payload);
        console.log("hii from TASK saga")
         const { status, data } = response.data;// API call with payload
  
     if (status === APPCONFIG.API_STATUS.SUCCESS) {
      yield put({ type: UPDATE_TASK_SUCCESS, payload: { data, status } });
    }
  
    else {
      yield put({ type: UPDATE_TASK_ERROR, payload: { data, status } });
    }
    }
     catch (error) {
    yield put({
      type: UPDATE_TASK_ERROR,
      payload: error.response ? error.response.data : { error: 'Something went wrong' },
    });
  }
}

export function* updateTaskSaga() {
    yield takeEvery(UPDATE_TASK, updateTaskAsync);
}



function* myTaskAsync(){

    try{
        const response=yield call(taskServices.MY_TASK);
        console.log("hii from TASK my saga")
         const { status, data } = response.data;// API call with payload
  
     if (status === APPCONFIG.API_STATUS.SUCCESS) {
      yield put({ type: MY_TASK_SUCCESS, payload: { data, status } });
    }
  
    else {
      yield put({ type: MY_TASK_ERROR, payload: { data, status } });
    }
    }
     catch (error) {
    yield put({
      type: MY_TASK_ERROR,
      payload: error.response ? error.response.data : { error: 'Something went wrong' },
    });
  }
}

export function* myTaskSaga() {
    yield takeEvery(MY_TASK, myTaskAsync);
}


function* getTaskAsync(){

    try{
        const response=yield call(taskServices.GET_TASK);
        console.log("hii from TASK my saga")
         const { status, data } = response.data;// API call with payload
  
     if (status === APPCONFIG.API_STATUS.SUCCESS) {
      yield put({ type: GET_TASK_SUCCESS, payload: { data, status } });
    }
  
    else {
      yield put({ type: GET_TASK_ERROR, payload: { data, status } });
    }
    }
     catch (error) {
    yield put({
      type: GET_TASK_ERROR,
      payload: error.response ? error.response.data : { error: 'Something went wrong' },
    });
  }
}

export function* getTaskSaga() {
    yield takeEvery(GET_TASK, getTaskAsync);
}





function* findAllAsync(){

    try{
        const response=yield call(taskServices.FIND_ALL);
        console.log("hii from TASK my saga")
         const { status, data } = response.data;// API call with payload
  
     if (status === APPCONFIG.API_STATUS.SUCCESS) {
      yield put({ type: FIND_ALL_SUCCESS, payload: { data, status } });
    }
  
    else {
      yield put({ type: FIND_ALL_ERROR, payload: { data, status } });
    }
    }
     catch (error) {
    yield put({
      type: FIND_ALL_ERROR,
      payload: error.response ? error.response.data : { error: 'Something went wrong' },
    });
  }
}

export function* findAllSaga() {
    yield takeEvery(FIND_ALL, findAllAsync);
}
