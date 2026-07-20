import axiosClient from "./axiosClient";

export const dimensionsApi = {
  getProduits: () => axiosClient.get("/produits"),
  getBoutiques: () => axiosClient.get("/boutiques"),
  getClients: () => axiosClient.get("/clients"),
  getFournisseurs: () => axiosClient.get("/fournisseurs"),
  getVendeurs: () => axiosClient.get("/vendeurs"),
  getModesPaiement: () => axiosClient.get("/modes-paiement"),
};