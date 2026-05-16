
const DEFAULT_HOST = "http://localhost:8000/api/";


export const getApiHost = () => {
  return localStorage.getItem("API_HOST") || DEFAULT_HOST;
};