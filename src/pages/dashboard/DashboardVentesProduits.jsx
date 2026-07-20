import { useOutletContext } from "react-router-dom";
import KpiBarChart from "../../components/kpi/KpiBarChart";
import KpiPieChart from "../../components/kpi/KpiPieChart";

export default function DashboardVentesProduits() {
  const { data, noteNonFiltrable } = useOutletContext();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      <KpiBarChart
        title="Produits les plus vendus"
        data={data.topProduits}
        xKey="nomProduit"
        bars={[{ dataKey: "quantiteTotale", color: "#4f46e5", name: "Quantité vendue" }]}
      />

      <KpiBarChart
        title="Marge bénéficiaire par produit"
        data={data.margeProduit}
        xKey="nomProduit"
        bars={[{ dataKey: "beneficeTotal", color: "#10b981", name: "Bénéfice total" }]}
      />

      <KpiBarChart
        title="Ventes par saison"
        data={data.ventesSaison}
        xKey="saisonCamerounaise"
        bars={[
          { dataKey: "chiffreAffaires", color: "#4f46e5", name: "CA" },
          { dataKey: "nbVentes", color: "#10b981", name: "Nb ventes" },
        ]}
      />

      <KpiPieChart
        title="Ventes par mode de paiement"
        data={data.ventesPaiement}
        dataKey="chiffreAffaires"
        nameKey="modePaiement"
      />

      <KpiPieChart
        title="Performance par boutique"
        data={data.performance}
        dataKey="chiffreAffaires"
        nameKey="nomBoutique"
        note={noteNonFiltrable}
      />
    </div>
  );
}