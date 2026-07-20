import { useOutletContext } from "react-router-dom";
import { Wallet, Store, Package, Truck } from "lucide-react";
import KpiCard from "../../components/kpi/KpiCard";
import CaMensuelCard from "../../components/kpi/CaMensuelCard";
import StockAlertesWidget from "../../components/kpi/StockAlertesWidget";

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

export default function DashboardOverview() {
  const { data } = useOutletContext();

  const caDuMois = getCaDuMois(data.caMensuel);
  const boutiqueTop = getBoutiqueTop(data.performance);
  const produitTop = getProduitTop(data.topProduits);
  const fournisseurTop = getFournisseurTop(data.fournisseurs);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <KpiCard icon={Wallet} label={caDuMois ? `CA — ${caDuMois.nomMois}` : "CA du mois"} value={caDuMois ? `${caDuMois.chiffreAffaires.toLocaleString()} FCFA` : "—"} />
        <KpiCard icon={Store} label="Boutique la plus performante" value={boutiqueTop ? boutiqueTop.nomBoutique : "—"} />
        <KpiCard icon={Package} label="Produit n°1" value={produitTop ? produitTop.nomProduit : "—"} />
        <KpiCard icon={Truck} label="Fournisseur le plus fiable" value={fournisseurTop ? fournisseurTop.nomFournisseur : "—"} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <CaMensuelCard data={data.caMensuel} />
        <StockAlertesWidget alertes={data.alertes} />
      </div>
    </div>
  );
}