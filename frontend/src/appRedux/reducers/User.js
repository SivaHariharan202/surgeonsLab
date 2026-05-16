// import {
//   LOGIN_USER, LOGIN_USER_ERROR, LOGIN_USER_SUCCESS,ALL_USER,ALL_USER_ERROR,ALL_USER_SUCCESS,
//   LOGOUT_USER, LOGOUT_USER_ERROR, LOGOUT_USER_SUCCESS,CREATE_USER,CREATE_USER_ERROR,CREATE_USER_SUCCESS
// } from '../../constants/ActionType';

// const initialState = {
//   loading:    false,
//   login_user: {},    // cleared on logout so useEffect in Login won't re-fire
//   error:      null,
//   createUser:{},
//   AllUser:{},
// };

// export const User = (state = initialState, action) => {
//   switch (action.type) {

//     // ── LOGIN ─────────────────────────────────────────────────────────────────
//     case LOGIN_USER:
//       return { ...state, loading: true, error: null };

//     case LOGIN_USER_SUCCESS:
//       return { ...state, loading: false, login_user: action.payload, error: null };

//     case LOGIN_USER_ERROR:
//       return { ...state, loading: false, login_user: {}, error: action.payload };

//     // ── LOGOUT ────────────────────────────────────────────────────────────────
//     // KEY FIX: reset login_user to {} so Login's useEffect doesn't
//     // see a stale token and re-populate sessionStorage on next mount
//     case LOGOUT_USER:
//       return { ...state, loading: true };

//     case LOGOUT_USER_SUCCESS:
//       return { loading: false, login_user: {}, error: null };

//     case LOGOUT_USER_ERROR:
//       // Even on error, clear state so user is logged out locally
//       return { loading: false, login_user: {}, error: null };



//     case CREATE_USER:
//       return { ...state, loading: true };

//     case CREATE_USER_SUCCESS:
//       return { loading: false, createUser: action.payload, error: null };

//     case CREATE_USER_ERROR:
//       // Even on error, clear state so user is logged out locally
//       return { loading: false, createUser: action.payload, error: null };


// //    case ALL_USER:
// //       return { ...state, loading: true };

// //     case ALL_USER_SUCCESS:
// //         // console.log("reducer all user ",action.payload)
// //       return { loading: false, AllUser: action.payload, error: null };

// //     case ALL_USER_ERROR:
// //       // Even on error, clear state so user is logged out locally
// //       return { loading: false, AllUser: action.payload, error: null };



// case ALL_USER:
//   return {
//     ...state,
//     loading: true,
//   };

// case ALL_USER_SUCCESS:
// //   console.log(
// //     "REDUCER SUCCESS",
// //     action.payload
// //   );

//   return {
//     ...state,
//     loading: false,
//     AllUser: action.payload,
//     error: null,
//   };


// // case ALL_USER_SUCCESS:
// //   console.log(
// //     "REDUCER SUCCESS",
// //     action.payload
// //   );

// //   return {
// //     ...state,
// //     loading: false,
// //     AllUser: action.payload,
// //     error: null,
// //   };

// case ALL_USER_ERROR:
//   return {
//     ...state,
//     loading: false,
//     AllUser: {},
//     error: action.payload,
//   };


//     default:
//       return state;
//   }
// };



import {
  LOGIN_USER,
  LOGIN_USER_ERROR,
  LOGIN_USER_SUCCESS,
  ALL_USER,
  ALL_USER_ERROR,
  ALL_USER_SUCCESS,
  LOGOUT_USER,
  LOGOUT_USER_ERROR,
  LOGOUT_USER_SUCCESS,
  CREATE_USER,
  CREATE_USER_ERROR,
  CREATE_USER_SUCCESS
} from "../../constants/ActionType";

const initialState = {
  loading: false,
  login_user: {},
  error: null,
  createUser: {},
  AllUser: {},
};

export const User = (
  state = initialState,
  action
) => {
  switch (action.type) {

    // LOGIN
    case LOGIN_USER:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case LOGIN_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        login_user: action.payload,
        error: null,
      };

    case LOGIN_USER_ERROR:
      return {
        ...state,
        loading: false,
        login_user: {},
        error: action.payload,
      };

    // LOGOUT
    case LOGOUT_USER:
      return {
        ...state,
        loading: true,
      };

    case LOGOUT_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        login_user: {},
        error: null,
      };

    case LOGOUT_USER_ERROR:
      return {
        ...state,
        loading: false,
        login_user: {},
        error: null,
      };

    // CREATE USER
    case CREATE_USER:
      return {
        ...state,
        loading: true,
      };

    case CREATE_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        createUser: action.payload,
        error: null,
      };

    case CREATE_USER_ERROR:
      return {
        ...state,
        loading: false,
        createUser: {},
        error: action.payload,
      };

    // ALL USER
    case ALL_USER:
      return {
        ...state,
        loading: true,
      };

    case ALL_USER_SUCCESS:
      console.log(
        "REDUCER SUCCESS",
        action.payload
      );

      return {
        ...state,
        loading: false,
        AllUser: action.payload,
        error: null,
      };

    case ALL_USER_ERROR:
      return {
        ...state,
        loading: false,
        AllUser: {},
        error: action.payload,
      };

    default:
      return state;
  }
};