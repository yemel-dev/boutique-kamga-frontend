import { useCallback, useEffect, useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import PageContainer from "../components/layout/PageContainer";
import { achatApi } from "../api/achatApi";
import AchatForm from "../components/achats/AchatForm";
import AchatTable from "../components/achats/AchatTable";
import SearchInput from "../components/common/SearchInput";

export default function AchatsPage() {
  const [achats, setAchats] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statutLivraison, setStatutLivraison] = useState("");

  const loadAchats = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await achatApi.getAll();
      setAchats(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAchats();
  }, [loadAchats]);

  const filtered = useMemo(() => {
    return achats.filter((a) => {
      const matchSearch =
        !search ||
        a.nomFournisseur?.toLowerCase().includes(search.toLowerCase()) ||
        a.nomProduit?.toLowerCase().includes(search.toLowerCase());
      const matchStatut =
        !statutLivraison ||
        (statutLivraison === "livre" ? !!a.dateLivraisonEffective : !a.dateLivraisonEffective);
      return matchSearch && matchStatut;
    });
  }, [achats, search, statutLivraison]);

  const selectClass = "border border-slate-200 rounded-lg px-2 py-1.5 text-sm bg-white";

  return (
    <PageContainer title="Achats">
      <div className="space-y-5">
        <AchatForm onCreated={loadAchats} />

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-wrap items-center gap-3">
          <SearchInput value={search} onChange={setSearch} placeholder="Fournisseur ou produit..." />

          <select className={selectClass} value={statutLivraison} onChange={(e) => setStatutLivraison(e.target.value)}>
            <option value="">Tous les statuts</option>
            <option value="attente">En attente</option>
            <option value="livre">Livré</option>
          </select>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16 text-slate-400">
            <Loader2 className="animate-spin mr-2" size={20} />
            Chargement des commandes...
          </div>
        ) : (
          <AchatTable achats={filtered} onConfirmed={loadAchats} />
        )}
      </div>
    </PageContainer>
  );
}