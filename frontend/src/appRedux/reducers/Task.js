// import {
//   CREATE_TASK, CREATE_TASK_ERROR, CREATE_TASK_SUCCESS,
//   UPDATE_TASK, UPDATE_TASK_ERROR, UPDATE_TASK_SUCCESS,
//   MY_TASK,    MY_TASK_ERROR,    MY_TASK_SUCCESS,
//   GET_TASK,   GET_TASK_ERROR,   GET_TASK_SUCCESS,
//   FIND_ALL,FIND_ALL_ERROR,FIND_ALL_SUCCESS
// } from '../../constants/ActionType';

// const initialState = {
//   loading: false,
//   create:  null,
//   update:  null,
//   my:      [],    // array of tasks for current user
//   get:     [],    // array of all tasks (admin)
//   find:[],
//   error:   null,
// };

// export const Task = (state = initialState, action) => {
//   switch (action.type) {

//     // ── CREATE ──────────────────────────────────────────────────────────────
//     case CREATE_TASK:
//       return { ...state, loading: true, error: null };

//     case CREATE_TASK_SUCCESS:
//       // action.payload = { data: { ...newTask }, status: "Ok" }
//       // Optimistically prepend new task to both lists so UI updates instantly
//       return {
//         ...state,
//         loading: false,
//         create:  action.payload.data,
//         get:     [action.payload.data, ...state.get],   // admin list
//         my:      [action.payload.data, ...state.my],    // user list
//         error:   null,
//       };

//     case CREATE_TASK_ERROR:
//       return { ...state, loading: false, error: action.payload?.error || "Failed to create task" };

//     // ── UPDATE ──────────────────────────────────────────────────────────────
//     case UPDATE_TASK:
//       return { ...state, loading: true, error: null };

//     case UPDATE_TASK_SUCCESS:
//       // action.payload = { data: { ...updatedTask }, status: "Ok" }
//       // Replace the task in both lists by id
//       return {
//         ...state,
//         loading: false,
//         update:  action.payload.data,
//         get: state.get.map((t) =>
//           t.id === action.payload.data.id ? action.payload.data : t
//         ),
//         my: state.my.map((t) =>
//           t.id === action.payload.data.id ? action.payload.data : t
//         ),
//         error: null,
//       };

//     case UPDATE_TASK_ERROR:
//       return { ...state, loading: false, error: action.payload?.error || "Failed to update task" };

//     // ── MY TASKS ─────────────────────────────────────────────────────────────
//     case MY_TASK:
//       return { ...state, loading: true, error: null };

//     case MY_TASK_SUCCESS:
//       // action.payload = { data: [...tasks], status: "Ok" }
//       return {
//         ...state,
//         loading: false,
//         my:      Array.isArray(action.payload.data) ? action.payload.data : [],
//         error:   null,
//       };

//     case MY_TASK_ERROR:
//       return { ...state, loading: false, my: [], error: action.payload?.error || "Failed to load tasks" };

//     // ── GET ALL TASKS ─────────────────────────────────────────────────────────
//     case GET_TASK:
//       return { ...state, loading: true, error: null };

//     case GET_TASK_SUCCESS:
//       // action.payload = { data: [...tasks], status: "Ok" }
//       return {
//         ...state,
//         loading: false,
//         get:     Array.isArray(action.payload.data) ? action.payload.data : [],
//         error:   null,
//       };

//     case GET_TASK_ERROR:
//       return { ...state, loading: false, get: [], error: action.payload?.error || "Failed to load tasks" };



//          // ── GET ALL TASKS ─────────────────────────────────────────────────────────
//     case FIND_ALL:
//       return { ...state, loading: true, error: null };

//     case FIND_ALL_SUCCESS:
//       // action.payload = { data: [...tasks], status: "Ok" }
//       return {
//         ...state,
//         loading: false,
//         find:     Array.isArray(action.payload.data) ? action.payload.data : [],
//         error:   null,
//       };

//     case FIND_ALL_ERROR:
//       return { ...state, loading: false, find: [], error: action.payload?.error || "Failed to load tasks" };

//     default:
//       return state;
//   }
// };


import {
  CREATE_TASK, CREATE_TASK_ERROR, CREATE_TASK_SUCCESS,
  UPDATE_TASK, UPDATE_TASK_ERROR, UPDATE_TASK_SUCCESS,
  MY_TASK,    MY_TASK_ERROR,    MY_TASK_SUCCESS,
  GET_TASK,   GET_TASK_ERROR,   GET_TASK_SUCCESS,
} from '../../constants/ActionType';

const initialState = {
  loading: false,
  create:  null,
  update:  null,
  my:      [],
  get:     [],
  summary: { total_tasks: 0, status: { pending: 0, in_progress: 0, completed: 0 }, priority: { high: 0, medium: 0, low: 0 } },
  error:   null,
};

export const Task = (state = initialState, action) => {
  switch (action.type) {

    case CREATE_TASK:
      return { ...state, loading: true, error: null };

    case CREATE_TASK_SUCCESS: {
      // data = single task object
      const newTask = action.payload.data;
      return {
        ...state,
        loading: false,
        create:  newTask,
        // prepend to both lists so UI updates instantly
        get: [newTask, ...state.get],
        my:  [newTask, ...state.my],
        error: null,
      };
    }

    case CREATE_TASK_ERROR:
      return { ...state, loading: false, error: action.payload?.error || action.payload?.message || "Failed to create task" };

    case UPDATE_TASK:
      return { ...state, loading: true, error: null };

    case UPDATE_TASK_SUCCESS: {
      // data = updated task object
      const updated = action.payload.data;
      return {
        ...state,
        loading: false,
        update: updated,
        // replace in both lists
        get: state.get.map((t) => t.id === updated.id ? updated : t),
        my:  state.my.map((t) => t.id === updated.id ? updated : t),
        error: null,
      };
    }

    case UPDATE_TASK_ERROR:
      return { ...state, loading: false, error: action.payload?.error || action.payload?.message || "Failed to update" };

    case MY_TASK:
      return { ...state, loading: true, error: null };

    case MY_TASK_SUCCESS: {
      // API returns { data: { summary: {...}, tasks: [...] } }
      const tasks   = action.payload.data?.tasks   ?? action.payload.data ?? [];
      const summary = action.payload.data?.summary ?? state.summary;
      return { ...state, loading: false, my: Array.isArray(tasks) ? tasks : [], summary, error: null };
    }

    case MY_TASK_ERROR:
      return { ...state, loading: false, my: [], error: action.payload?.error || "Failed to load tasks" };

    case GET_TASK:
      return { ...state, loading: true, error: null };

    case GET_TASK_SUCCESS: {
      // API returns { data: { summary: {...}, tasks: [...] } }
      const tasks   = action.payload.data?.tasks   ?? action.payload.data ?? [];
      const summary = action.payload.data?.summary ?? state.summary;
      return { ...state, loading: false, get: Array.isArray(tasks) ? tasks : [], summary, error: null };
    }

    case GET_TASK_ERROR:
      return { ...state, loading: false, get: [], error: action.payload?.error || "Failed to load tasks" };

    default:
      return state;
  }
};