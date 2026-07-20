import axiosClient from "./axiosClient";

export const achatApi = {
  getAll: () => axiosClient.get("/achats"),
  getByFournisseur: (idFournisseur) => axiosClient.get(`/achats/fournisseur/${idFournisseur}`),

  // Champs attendus : idFournisseur, idProduit, quantiteCommandee, montantAchatFcfa, dateCommande ("YYYY-MM-DD")
  create: (achat) => axiosClient.post("/achats", achat),

  // Body attendu : { dateLivraisonEffective: "YYYY-MM-DD" }
confirmerLivraison: (id, dateLivraisonEffective) =>
  axiosClient.put(`/achats/${id}/livraison`, null, { params: { dateLivraisonEffective } }),
};