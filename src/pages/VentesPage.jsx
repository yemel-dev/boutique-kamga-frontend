import { useCallback, useEffect, useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import PageContainer from "../components/layout/PageContainer";
import { useAuth } from "../auth/AuthContext";
import { venteApi } from "../api/venteApi";
import { dimensionsApi } from "../api/dimensionsApi";
import VenteForm from "../components/ventes/VenteForm";
import VenteTable from "../components/ventes/VenteTable";
import SearchInput from "../components/common/SearchInput";
import ExportButtons from '../components/common/ExportButtons';

export default function VentesPage() {
  const { user } = useAuth();
  const [ventes, setVentes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtresOptions, setFiltresOptions] = useState({ vendeurs: [], paiements: [] });

  const [search, setSearch] = useState("");
  const [boutique, setBoutique] = useState("");
  const [vendeur, setVendeur] = useState("");
  const [paiement, setPaiement] = useState("");
  const [quantiteMin, setQuantiteMin] = useState("");
  const [quantiteMax, setQuantiteMax] = useState("");
  const [montantMin, setMontantMin] = useState("");
  const [montantMax, setMontantMax] = useState("");

  const COLONNES_EXPORT = [
  { key: 'nomProduit',       label: 'Produit' },
  { key: 'nomClient',        label: 'Client' },
  { key: 'nomBoutique',      label: 'Boutique' },
  { key: 'nomVendeur',       label: 'Vendeur' },
  { key: 'modePaiement',     label: 'Paiement' },
  { key: 'quantiteVendue',   label: 'Quantité' },
  { key: 'prixUnitaireFcfa', label: 'Prix unitaire (FCFA)' },
  { key: 'montantTotalFcfa', label: 'Montant total (FCFA)' },
  { key: 'remiseFcfa',       label: 'Remise (FCFA)' },
  { key: 'beneficeFcfa',     label: 'Bénéfice (FCFA)' },
  { key: 'dateVente',        label: 'Date' },
];
  const canSaisir = user?.role === "ADMIN" || user?.role === "VENDEUR";

  const loadVentes = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await venteApi.getAll();
      setVentes(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadVentes();
    async function loadOptions() {
      const [vendeurs, paiements] = await Promise.all([
        dimensionsApi.getVendeurs(),
        dimensionsApi.getModesPaiement(),
      ]);
      setFiltresOptions({ vendeurs: vendeurs.data, paiements: paiements.data });
    }
    loadOptions();
  }, [loadVentes]);

  // Boutiques réellement présentes dans les ventes chargées — pas de correspondance ID à gérer
  const boutiquesDisponibles = useMemo(
    () => [...new Set(ventes.map((v) => v.nomBoutique).filter(Boolean))].sort(),
    [ventes]
  );

  const filtered = useMemo(() => {
    return ventes.filter((v) => {
      const matchSearch =
        !search ||
        v.nomClient?.toLowerCase().includes(search.toLowerCase()) ||
        v.nomProduit?.toLowerCase().includes(search.toLowerCase());
      const matchBoutique = !boutique || v.nomBoutique === boutique;
      const matchVendeur = !vendeur || v.nomVendeur === vendeur;
      const matchPaiement = !paiement || v.modePaiement === paiement;
      const matchQuantiteMin = !quantiteMin || v.quantiteVendue >= Number(quantiteMin);
      const matchQuantiteMax = !quantiteMax || v.quantiteVendue <= Number(quantiteMax);
      const matchMontantMin = !montantMin || v.montantTotalFcfa >= Number(montantMin);
      const matchMontantMax = !montantMax || v.montantTotalFcfa <= Number(montantMax);
      return (
        matchSearch && matchBoutique && matchVendeur && matchPaiement &&
        matchQuantiteMin && matchQuantiteMax && matchMontantMin && matchMontantMax
      );
    });
  }, [ventes, search, boutique, vendeur, paiement, quantiteMin, quantiteMax, montantMin, montantMax]);

  const selectClass = "border border-slate-200 rounded-lg px-2 py-1.5 text-sm bg-white";

  return (
    <PageContainer title="Ventes">
      <div className="space-y-5">
        {canSaisir && <VenteForm onCreated={loadVentes} />}

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm 
                        flex flex-wrap items-center gap-3">

          <select className={selectClass} value={boutique} onChange={(e) => setBoutique(e.target.value)}>
            <option value="">Toutes les boutiques</option>
            {boutiquesDisponibles.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>

          <select className={selectClass} value={vendeur} onChange={(e) => setVendeur(e.target.value)}>
            <option value="">Tous les vendeurs</option>
            {filtresOptions.vendeurs.map((v) => (
              <option key={v.idVendeur} value={v.nomVendeur}>{v.nomVendeur}</option>
            ))}
          </select>

          <select className={selectClass} value={paiement} onChange={(e) => setPaiement(e.target.value)}>
            <option value="">Tous les paiements</option>
            {filtresOptions.paiements.map((p) => (
              <option key={p.idPaiement} value={p.modePaiement}>{p.modePaiement}</option>
            ))}
          </select>

          <div className="flex items-center gap-1.5 text-sm text-slate-500">
            <span>Qté</span>
            <input type="number" placeholder="min" value={quantiteMin} onChange={(e) => setQuantiteMin(e.target.value)} className="border border-slate-200 rounded-lg px-2 py-1.5 text-sm w-20" />
            <span>–</span>
            <input type="number" placeholder="max" value={quantiteMax} onChange={(e) => setQuantiteMax(e.target.value)} className="border border-slate-200 rounded-lg px-2 py-1.5 text-sm w-20" />
          </div>

          <div className="flex items-center gap-1.5 text-sm text-slate-500">
            <span>Montant</span>
            <input type="number" placeholder="min" value={montantMin} onChange={(e) => setMontantMin(e.target.value)} className="border border-slate-200 rounded-lg px-2 py-1.5 text-sm w-24" />
            <span>–</span>
            <input type="number" placeholder="max" value={montantMax} onChange={(e) => setMontantMax(e.target.value)} className="border border-slate-200 rounded-lg px-2 py-1.5 text-sm w-24" />
          </div>
            <div className="ml-auto">
            <ExportButtons
            data={filtered}
            columns={COLONNES_EXPORT}
            filename="ventes_boutique_kamga"
            title="Liste des Ventes — Boutique Kamga"
            />
        </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16 text-slate-400">
            <Loader2 className="animate-spin mr-2" size={20} />
            Chargement des ventes...
          </div>
        ) : (
          <VenteTable ventes={filtered} onDeleted={loadVentes} />
        )}
      </div>
    </PageContainer>
  );
}