import { call, put, takeEvery, delay } from "redux-saga/effects";
import {
    USER,USER_SUCCESS,USER_ERROR,ALL_USER,ALL_USER_ERROR,ALL_USER_SUCCESS,
    LOGIN_USER_SUCCESS,LOGOUT_USER,LOGOUT_USER_ERROR,LOGOUT_USER_SUCCESS,
    LOGIN_USER_ERROR,LOGIN_USER,
    CREATE_USER,
    CREATE_USER_SUCCESS,
    CREATE_USER_ERROR,
} from "../../constants/ActionType";
import { UserService } from "../../services/UserService";
import { APPCONFIG } from "../../config/AppConfig";

function* createUserAsync(action){

    try{
        const response=yield call(UserService.USER,action.payload);
        // console.log("hii from saga")
         const { status, data } = response.data;// API call with payload
  
     if (status === APPCONFIG.API_STATUS.SUCCESS) {
      yield put({ type: USER_SUCCESS, payload: { data, status } });
    }
  
    else {
      yield put({ type: USER_ERROR, payload: { data, status } });
    }
    }
     catch (error) {
    yield put({
      type: USER_ERROR,
      payload: error.response ? error.response.data : { error: 'Something went wrong' },
    });
  }
}

export function* UserSaga() {
    yield takeEvery(USER, createUserAsync);
}


function* loginUserAsync(action){

    try{
        const response=yield call(UserService.LOGIN_USER,action.payload);
        // console.log("hii from saga")
         const { status, data } = response.data;// API call with payload
  
     if (status === APPCONFIG.API_STATUS.SUCCESS) {
      yield put({ type: LOGIN_USER_SUCCESS, payload: { data, status } });
    }
  
    else {
      yield put({ type: LOGIN_USER_ERROR, payload: { data, status } });
    }
    }
     catch (error) {
    yield put({
      type: LOGIN_USER_ERROR,
      payload: error.response ? error.response.data : { error: 'Something went wrong' },
    });
  }
}

export function* loginUserSaga() {
    yield takeEvery(LOGIN_USER, loginUserAsync);
}

function* logoutUserAsync(action){

    try{
        const response=yield call(UserService.LOGOUT_USER,action.payload);
        // console.log("hii from saga")
         const { status, data } = response.data;// API call with payload
  
     if (status === APPCONFIG.API_STATUS.SUCCESS) {
      yield put({ type: LOGOUT_USER_SUCCESS, payload: { data, status } });
    }
  
    else {
      yield put({ type: LOGOUT_USER_ERROR, payload: { data, status } });
    }
    }
     catch (error) {
    yield put({
      type: LOGOUT_USER_ERROR,
      payload: error.response ? error.response.data : { error: 'Something went wrong' },
    });
  }
}

export function* logoutUserSaga() {
    yield takeEvery(LOGOUT_USER, logoutUserAsync);
}


function* createUsersAsync(action){

    try{
        const response=yield call(UserService.CREATE_USER,action.payload);
        // console.log("hii from saga")
         const { status, data } = response.data;// API call with payload
  
     if (status === APPCONFIG.API_STATUS.SUCCESS) {
      yield put({ type: CREATE_USER_SUCCESS, payload: { data, status } });
    }
  
    else {
      yield put({ type: CREATE_USER_ERROR, payload: { data, status } });
    }
    }
     catch (error) {
    yield put({
      type: CREATE_USER_ERROR,
      payload: error.response ? error.response.data : { error: 'Something went wrong' },
    });
  }
}

export function* createUsersSaga() {
    yield takeEvery(CREATE_USER, createUsersAsync);
}



function* allUserAsync(){

    try{
        const response=yield call(UserService.ALL_USER);
        // console.log("hii from all user saga")
         const { status, data } = response.data;// API call with payload
        //  console.log("saga data",data)
  
     if (status === APPCONFIG.API_STATUS.SUCCESS) {
      yield put({ type: ALL_USER_SUCCESS, payload: { data, status } });
    }
  
    else {
      yield put({ type: ALL_USER_ERROR, payload: { data, status } });
    }
    }
     catch (error) {
    yield put({
      type: ALL_USER_ERROR,
      payload: error.response ? error.response.data : { error: 'Something went wrong' },
    });
  }
}

export function* allUserSaga() {
    yield takeEvery(ALL_USER, allUserAsync);
}

