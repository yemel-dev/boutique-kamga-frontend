import axiosClient from "./axiosClient";

export function login(username, password) {
  return axiosClient.post("/auth/login", { username, password });
}