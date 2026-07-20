import axiosClient from "./axiosClient";

export const stockApi = {
  getAll: () => axiosClient.get("/stocks"),
  getByBoutique: (idBoutique) => axiosClient.get(`/stocks/boutique/${idBoutique}`),
  getAlertes: () => axiosClient.get("/stocks/alertes"),

  // Champs attendus : idProduit, idBoutique, quantiteDisponible, seuilReappro, dateInventaire ("YYYY-MM-DD")
  // Ne JAMAIS envoyer statutStock — calculé automatiquement côté serveur
  create: (stock) => axiosClient.post("/stocks", stock),
};