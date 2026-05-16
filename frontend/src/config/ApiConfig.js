import { getApiHost } from "./ApiHost";
const API_HOST = getApiHost();
export const APICONFIG = Object.freeze({
    HOST:API_HOST,
    USER:{
        // "USER":"hello/",
        "LOGIN_USER":"login/",
        "LOGOUT_USER": "logout/",
        "CREATE_USER":"create-user/",
        "ALL_USER":"get-users/",


    },
    TASK:{
        "CREATE_TASK":"create-task/",
        "UPDATE_TASK":"update-task/",
        "MY_TASK":"my-tasks/",
        "GET_TASK":"get-tasks/",
        "FIND_ALL": "find-all/",
    },

});
