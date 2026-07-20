import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Loader2, Wallet, Store, Package, Truck } from "lucide-react";
import PageContainer from "../components/layout/PageContainer";
import BoutiqueFilter from "../components/dashboard/BoutiqueFilter";
import { olapApi } from "../api/olapApi";
import { stockAlertesApi } from "../api/stockAlertesApi";
import KpiCard from "../components/kpi/KpiCard";
import KpiBarChart from "../components/kpi/KpiBarChart";
import KpiLineChart from "../components/kpi/KpiLineChart";
import KpiPieChart from "../components/kpi/KpiPieChart";
import KpiTable from "../components/kpi/KpiTable";
import StockAlertesWidget from "../components/kpi/StockAlertesWidget";
import CaMensuelCard from "../components/kpi/CaMensuelCard";

const emptyData = {
  topProduits: [], caMensuel: [], panierMoyen: [], margeProduit: [],
  performance: [], fournisseurs: [], rotationStock: [], ventesSaison: [],
  clientsFideles: [], clv: [], ventesPaiement: [], tauxRupture: [], alertes: [],
};

function getCaDuMois(caMensuel) {
  if (!caMensuel.length) return null;
  const sorted = [...caMensuel].sort((a, b) => b.annee - a.annee || b.mois - a.mois);
  return sorted[0];
}
function getBoutiqueTop(performance) {
  if (!performance.length) return null;
  return performance.reduce((max, b) => (b.chiffreAffaires > max.chiffreAffaires ? b : max), performance[0]);
}
function getProduitTop(topProduits) {
  if (!topProduits.length) return null;
  return topProduits.reduce((max, p) => (p.quantiteTotale > max.quantiteTotale ? p : max), topProduits[0]);
}
function getFournisseurTop(fournisseurs) {
  if (!fournisseurs.length) return null;
  return fournisseurs.reduce((max, f) => (f.noteFiabilite > max.noteFiabilite ? f : max), fournisseurs[0]);
}

export default function DashboardPage() {
  const [idBoutique, setIdBoutique] = useState(null);
  const [data, setData] = useState(emptyData);
  const [loadingFiltrable, setLoadingFiltrable] = useState(true);
  const [loadingFixe, setLoadingFixe] = useState(true);

  // Chargé une seule fois — non affecté par le filtre boutique (KPI 5, 6) + alertes stock
  useEffect(() => {
    async function loadFixe() {
      const results = await Promise.allSettled([
        olapApi.getPerformance(),
        olapApi.getFournisseurs(),
        stockAlertesApi.getAlertes(),
      ]);
      const keys = ["performance", "fournisseurs", "alertes"];
      setData((prev) => {
        const next = { ...prev };
        results.forEach((r, i) => {
          if (r.status === "fulfilled") next[keys[i]] = r.value.data;
        });
        return next;
      });
      setLoadingFixe(false);
    }
    loadFixe();
  }, []);

  // Rechargé à chaque changement de boutique — les 10 KPIs filtrables
  useEffect(() => {
    async function loadFiltrable() {
      setLoadingFiltrable(true);
      const calls = [
        olapApi.getTopProduits(idBoutique), olapApi.getCaMensuel(idBoutique),
        olapApi.getPanierMoyen(idBoutique), olapApi.getMargeProduit(idBoutique),
        olapApi.getRotationStock(idBoutique), olapApi.getVentesSaison(idBoutique),
        olapApi.getClientsFideles(idBoutique), olapApi.getClv(idBoutique),
        olapApi.getVentesPaiement(idBoutique), olapApi.getTauxRupture(idBoutique),
      ];
      const keys = [
        "topProduits", "caMensuel", "panierMoyen", "margeProduit", "rotationStock",
        "ventesSaison", "clientsFideles", "clv", "ventesPaiement", "tauxRupture",
      ];

      const results = await Promise.allSettled(calls);
      const failedCount = results.filter((r) => r.status === "rejected").length;
      if (failedCount > 0) toast.error(`${failedCount} KPI(s) n'ont pas pu être chargés`);

      setData((prev) => {
        const next = { ...prev };
        results.forEach((r, i) => {
          if (r.status === "fulfilled") next[keys[i]] = r.value.data;
        });
        return next;
      });
      setLoadingFiltrable(false);
    }
    loadFiltrable();
  }, [idBoutique]);

  if (loadingFixe) {
    return (
      <PageContainer title="Tableau de bord">
        <div className="flex items-center justify-center py-24 text-slate-400">
          <Loader2 className="animate-spin mr-2" size={20} />
          Chargement des KPIs...
        </div>
      </PageContainer>
    );
  }

  const caDuMois = getCaDuMois(data.caMensuel);
  const boutiqueTop = getBoutiqueTop(data.performance);
  const produitTop = getProduitTop(data.topProduits);
  const fournisseurTop = getFournisseurTop(data.fournisseurs);
  const noteNonFiltrable = idBoutique ? "Toutes boutiques — filtre indisponible sur ce KPI" : undefined;

  return (
    <PageContainer title="Tableau de bord">
      {/* Ligne de filtres */}
      <div className="flex items-center justify-between mb-6">
        <BoutiqueFilter value={idBoutique} onChange={setIdBoutique} />
        {loadingFiltrable && (
          <span className="flex items-center gap-2 text-sm text-slate-400">
            <Loader2 className="animate-spin" size={14} /> Actualisation...
          </span>
        )}
      </div>

      {/* Rangée de synthèse */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        <KpiCard icon={Wallet} label={caDuMois ? `CA — ${caDuMois.nomMois}` : "CA du mois"} value={caDuMois ? `${caDuMois.chiffreAffaires.toLocaleString()} FCFA` : "—"} />
        <KpiCard icon={Store} label="Boutique la plus performante" value={boutiqueTop ? boutiqueTop.nomBoutique : "—"} />
        <KpiCard icon={Package} label="Produit n°1" value={produitTop ? produitTop.nomProduit : "—"} />
        <KpiCard icon={Truck} label="Fournisseur le plus fiable" value={fournisseurTop ? fournisseurTop.nomFournisseur : "—"} />
      </div>

      {/* Grille détaillée */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <KpiBarChart title="Produits les plus vendus" data={data.topProduits} xKey="nomProduit"
          bars={[{ dataKey: "quantiteTotale", color: "#4f46e5", name: "Quantité vendue" }]} />

        <CaMensuelCard data={data.caMensuel} />

        <KpiPieChart title="Performance par boutique" data={data.performance} dataKey="chiffreAffaires" nameKey="nomBoutique" note={noteNonFiltrable} />

        <KpiTable title="Panier moyen par client" data={data.panierMoyen}
          columns={[
            { key: "nomClient", label: "Client" },
            { key: "panierMoyen", label: "Panier moyen", align: "right", format: (v) => `${v?.toLocaleString()} FCFA` },
            { key: "nbAchats", label: "Nb achats", align: "right" },
          ]} />

        <KpiBarChart title="Marge bénéficiaire par produit" data={data.margeProduit} xKey="nomProduit"
          bars={[{ dataKey: "beneficeTotal", color: "#10b981", name: "Bénéfice total" }]} />

        <KpiTable title="Fournisseurs les plus fiables" data={data.fournisseurs} note={noteNonFiltrable}
          columns={[
            { key: "nomFournisseur", label: "Fournisseur" },
            { key: "delaiLivraisonMoyenJ", label: "Délai moy. (j)", align: "right" },
            { key: "noteFiabilite", label: "Fiabilité", align: "right" },
            { key: "nbCommandes", label: "Commandes", align: "right" },
          ]} />

        <KpiBarChart title="Taux de rotation des stocks" data={data.rotationStock} xKey="nomProduit"
          bars={[{ dataKey: "tauxRotation", color: "#0ea5e9", name: "Taux de rotation" }]} />

        <KpiBarChart title="Ventes par saison" data={data.ventesSaison} xKey="saisonCamerounaise"
          bars={[
            { dataKey: "chiffreAffaires", color: "#4f46e5", name: "CA" },
            { dataKey: "nbVentes", color: "#10b981", name: "Nb ventes" },
          ]} />

        <KpiTable title="Clients les plus fidèles" data={data.clientsFideles} limit={10}
          columns={[
            { key: "nomClient", label: "Client" },
            { key: "typeClient", label: "Type" },
            { key: "nbAchats", label: "Achats", align: "right" },
            { key: "totalAchats", label: "Total", align: "right", format: (v) => `${v?.toLocaleString()} FCFA` },
          ]} />

        <KpiTable title="Valeur vie client (CLV)" data={data.clv} limit={10}
          columns={[
            { key: "nomClient", label: "Client" },
            { key: "typeClient", label: "Type" },
            { key: "clv", label: "CLV", align: "right", format: (v) => `${v?.toLocaleString()} FCFA` },
          ]} />

        <KpiPieChart title="Ventes par mode de paiement" data={data.ventesPaiement} dataKey="chiffreAffaires" nameKey="modePaiement" />

        <KpiBarChart title="Taux de rupture de stock" data={data.tauxRupture} xKey="nomProduit"
          bars={[{ dataKey: "tauxRupturePct", color: "#e11d48", name: "Taux de rupture (%)" }]} />
      </div>

      <div className="mt-5">
        <StockAlertesWidget alertes={data.alertes} />
      </div>
    </PageContainer>
  );
}