import axios from "axios";
import { APICONFIG } from "../config/ApiConfig";

const HOST = APICONFIG.HOST;
const TASK_API = APICONFIG.TASK;

// ── Helper: always read fresh token from sessionStorage ───────────────────────
const authHeader = () => {
  const token = sessionStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// POST /api/create-task/
// body: { title, description, priority, assigned_to }
const createTaskService = async (payload) => {
  const response = await axios.post(
    HOST + TASK_API.CREATE_TASK,
    payload,
    { headers: { ...authHeader() } }
  );
  return response;
};

// PUT /api/update-task/:id/
// body: { status }
// payload must include { id, status }
const updateTaskService = async (payload) => {
  const { id, ...body } = payload;
  const response = await axios.put(
    `${HOST}${TASK_API.UPDATE_TASK}${id}/`,   // builds → /api/update-task/1/
    body,
    { headers: { ...authHeader() } }
  );
  return response;
};

// GET /api/get-tasks/   (admin — all tasks)
const getTaskService = async () => {
  const response = await axios.get(
    HOST + TASK_API.GET_TASK,
    { headers: { ...authHeader() } }
  );
  return response;
};

// GET /api/my-tasks/   (user — only assigned tasks)
const myTaskService = async () => {
  const response = await axios.get(
    HOST + TASK_API.MY_TASK,
    { headers: { ...authHeader() } }
  );
  return response;
};


const findAllService = async () => {
  const response = await axios.get(
    HOST + TASK_API.FIND_ALL,
    { headers: { ...authHeader() } }
  );
  console.log("responce for find all",response)
  return response;
};

export const taskServices = {
  CREATE_TASK: createTaskService,
  UPDATE_TASK: updateTaskService,
  GET_TASK:    getTaskService,
  MY_TASK:     myTaskService,
  FIND_ALL: findAllService,
};