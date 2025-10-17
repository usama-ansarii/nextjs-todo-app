const { default: axios } = require("axios");

const api = axios.create({
  baseURL: "/api",
  timeout: 35000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api
