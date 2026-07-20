import axiosClient from "./axiosClient";

// N'inclut idBoutique dans les params QUE s'il a une valeur réelle — évite l'envoi de "?idBoutique=" (chaîne vide) quand null, qui fait planter Spring (500 au lieu d'omettre le paramètre)
const params = (idBoutique) => (idBoutique != null ? { idBoutique } : {});

export const olapApi = {
  getTopProduits: (idBoutique) => axiosClient.get("/olap/produits-plus-vendus", { params: params(idBoutique) }),
  getCaMensuel: (idBoutique) => axiosClient.get("/olap/chiffre-affaires-mensuel", { params: params(idBoutique) }),
  getPanierMoyen: (idBoutique) => axiosClient.get("/olap/panier-moyen-client", { params: params(idBoutique) }),
  getMargeProduit: (idBoutique) => axiosClient.get("/olap/marge-produit", { params: params(idBoutique) }),
  getRotationStock: (idBoutique) => axiosClient.get("/olap/taux-rotation-stock", { params: params(idBoutique) }),
  getVentesSaison: (idBoutique) => axiosClient.get("/olap/ventes-saison", { params: params(idBoutique) }),
  getClientsFideles: (idBoutique) => axiosClient.get("/olap/clients-fideles", { params: params(idBoutique) }),
  getClv: (idBoutique) => axiosClient.get("/olap/valeur-vie-client", { params: params(idBoutique) }),
  getVentesPaiement: (idBoutique) => axiosClient.get("/olap/ventes-mode-paiement", { params: params(idBoutique) }),
  getTauxRupture: (idBoutique) => axiosClient.get("/olap/taux-rupture-stock", { params: params(idBoutique) }),

  // KPI 5 et 6 — aucun filtre boutique
  getPerformance: () => axiosClient.get("/olap/performance-boutique"),
  getFournisseurs: () => axiosClient.get("/olap/fournisseurs-fiables"),
};