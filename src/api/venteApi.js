import axiosClient from "./axiosClient";

export const venteApi = {
  getAll: () => axiosClient.get("/ventes"),
  getById: (id) => axiosClient.get(`/ventes/${id}`),
  getByBoutique: (idBoutique) => axiosClient.get(`/ventes/boutique/${idBoutique}`),
  getByPeriode: (debut, fin) => axiosClient.get("/ventes/periode", { params: { debut, fin } }),

  // Champs attendus : idProduit, idBoutique, idFournisseur, idClient, idVendeur,
  // idPaiement, quantiteVendue, prixUnitaireFcfa, remiseFcfa, dateVente ("YYYY-MM-DD")
  // Ne JAMAIS envoyer montantTotalFcfa ni beneficeFcfa — calculés côté serveur
  create: (vente) => axiosClient.post("/ventes", vente),

  remove: (id) => axiosClient.delete(`/ventes/${id}`),
};