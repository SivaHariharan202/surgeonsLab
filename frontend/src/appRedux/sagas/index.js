import { all, fork } from 'redux-saga/effects';
import {loginUserSaga ,UserSaga,logoutUserSaga,createUsersSaga,allUserSaga } from './User';
import {createTaskSaga,updateTaskSaga,myTaskSaga,getTaskSaga,findAllSaga } from './Task1';

export default function* rootSaga() {
  yield all([
    fork(UserSaga),
    fork(loginUserSaga),
    fork(logoutUserSaga),
    fork(createTaskSaga),
    fork(updateTaskSaga),
    fork(myTaskSaga),
    fork(getTaskSaga),  
    fork(findAllSaga) ,
    fork(createUsersSaga),
    fork(allUserSaga),
  ]);
}
