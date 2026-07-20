import axiosClient from "./axiosClient";

export const stockAlertesApi = {
  getAlertes: () => axiosClient.get("/stocks/alertes"),
};