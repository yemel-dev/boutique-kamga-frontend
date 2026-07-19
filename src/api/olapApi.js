import axiosClient from "./axiosClient";

export const olapApi = {
  // KPI 1 — Produits les plus vendus
  getTopProduits: () => axiosClient.get("/olap/produits-plus-vendus"),

  // KPI 2 — CA mensuel (inclut le trimestre dans la réponse)
  getCaMensuel: () => axiosClient.get("/olap/chiffre-affaires-mensuel"),

  // KPI 3 — Panier moyen par client
  getPanierMoyen: () => axiosClient.get("/olap/panier-moyen-client"),

  // KPI 4 — Marge bénéficiaire par produit
  getMargeProduit: () => axiosClient.get("/olap/marge-produit"),

  // KPI 5 — Performance par boutique
  getPerformance: () => axiosClient.get("/olap/performance-boutique"),

  // KPI 6 — Fournisseurs les plus fiables
  getFournisseurs: () => axiosClient.get("/olap/fournisseurs-fiables"),

  // KPI 7 — Taux de rotation des stocks
  getRotationStock: () => axiosClient.get("/olap/taux-rotation-stock"),

  // KPI 8 — Ventes par saison camerounaise
  getVentesSaison: () => axiosClient.get("/olap/ventes-saison"),

  // KPI 9 — Clients les plus fidèles
  getClientsFideles: () => axiosClient.get("/olap/clients-fideles"),

  // KPI 10 — Valeur vie client (CLV)
  getClv: () => axiosClient.get("/olap/valeur-vie-client"),

  // KPI 11 — Ventes par mode de paiement
  getVentesPaiement: () => axiosClient.get("/olap/ventes-mode-paiement"),

  // KPI 12 — Taux de rupture de stock
  getTauxRupture: () => axiosClient.get("/olap/taux-rupture-stock"),
};