// src/api/auth.api.js
import api from "./api";

/* ADMIN LOGIN */
export const loginAdmin = (email, password) => {
  return api.post("/auth/login", {
    email,
    password,
  });
};
