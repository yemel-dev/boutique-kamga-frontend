import { useCallback, useEffect, useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import PageContainer from "../components/layout/PageContainer";
import { useAuth } from "../auth/AuthContext";
import { stockApi } from "../api/stockApi";
import StockForm from "../components/stocks/StockForm";
import StockTable from "../components/stocks/StockTable";
import SearchInput from "../components/common/SearchInput";

const STATUTS = ["Normal", "Critique", "Rupture"];

export default function StocksPage() {
  const { user } = useAuth();
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [boutique, setBoutique] = useState("");
  const [statut, setStatut] = useState("");

  const canSaisir = user?.role === "ADMIN" || user?.role === "VENDEUR";

  const loadStocks = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await stockApi.getAll();
      setStocks(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStocks();
  }, [loadStocks]);

  const boutiquesDisponibles = useMemo(
    () => [...new Set(stocks.map((s) => s.nomBoutique).filter(Boolean))].sort(),
    [stocks]
  );

  const filtered = useMemo(() => {
    return stocks.filter((s) => {
      const matchSearch = !search || s.nomProduit?.toLowerCase().includes(search.toLowerCase());
      const matchBoutique = !boutique || s.nomBoutique === boutique;
      const matchStatut = !statut || s.statutStock === statut;
      return matchSearch && matchBoutique && matchStatut;
    });
  }, [stocks, search, boutique, statut]);

  const selectClass = "border border-slate-200 rounded-lg px-2 py-1.5 text-sm bg-white";

  return (
    <PageContainer title="Stocks">
      <div className="space-y-5">
        {canSaisir && <StockForm onCreated={loadStocks} />}

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-wrap items-center gap-3">
          <SearchInput value={search} onChange={setSearch} placeholder="Produit..." />

          <select className={selectClass} value={boutique} onChange={(e) => setBoutique(e.target.value)}>
            <option value="">Toutes les boutiques</option>
            {boutiquesDisponibles.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>

          <select className={selectClass} value={statut} onChange={(e) => setStatut(e.target.value)}>
            <option value="">Tous les statuts</option>
            {STATUTS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16 text-slate-400">
            <Loader2 className="animate-spin mr-2" size={20} />
            Chargement des stocks...
          </div>
        ) : (
          <StockTable stocks={filtered} />
        )}
      </div>
    </PageContainer>
  );
}