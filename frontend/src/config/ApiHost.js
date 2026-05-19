
  // const DEFAULT_HOST = "http://localhost:8000/api/";
  const DEFAULT_HOST = "https://surgeonslab-backend.onrender.com/api/";


  export const getApiHost = () => {
    return localStorage.getItem("API_HOST") || DEFAULT_HOST;
  };