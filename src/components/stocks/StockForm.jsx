import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { dimensionsApi } from "../../api/dimensionsApi";
import { stockApi } from "../../api/stockApi";

const emptyForm = {
  idProduit: "", idBoutique: "", quantiteDisponible: "", seuilReappro: "",
  dateInventaire: new Date().toISOString().slice(0, 10),
};

export default function StockForm({ onCreated }) {
  const [dims, setDims] = useState({ produits: [], boutiques: [] });
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [loadingDims, setLoadingDims] = useState(true);

  useEffect(() => {
    async function loadDims() {
      try {
        const [produits, boutiques] = await Promise.all([
          dimensionsApi.getProduits(),
          dimensionsApi.getBoutiques(),
        ]);
        setDims({ produits: produits.data, boutiques: boutiques.data });
      } catch {
        toast.error("Impossible de charger les listes (produits, boutiques)");
      } finally {
        setLoadingDims(false);
      }
    }
    loadDims();
  }, []);

  const handleChange = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await stockApi.create({
        idProduit: Number(form.idProduit),
        idBoutique: Number(form.idBoutique),
        quantiteDisponible: Number(form.quantiteDisponible),
        seuilReappro: Number(form.seuilReappro),
        dateInventaire: form.dateInventaire,
      });
      toast.success("Relevé de stock enregistré");
      setForm(emptyForm);
      onCreated?.();
    } catch (err) {
      toast.error(err.response?.data?.message || "Échec de l'enregistrement");
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingDims) {
    return <p className="text-sm text-slate-400">Chargement du formulaire...</p>;
  }

  const inputClass = "border border-slate-200 rounded-lg px-3 py-2 text-sm w-full bg-white";
  const labelClass = "text-xs font-medium text-slate-500 mb-1 block";

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-slate-800 mb-4">Nouveau relevé de stock</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div>
          <label className={labelClass}>Produit</label>
          <select required className={inputClass} value={form.idProduit} onChange={handleChange("idProduit")}>
            <option value="">Sélectionner...</option>
            {dims.produits.map((p) => (
              <option key={p.idProduit} value={p.idProduit}>{p.nomProduit}</option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass}>Boutique</label>
          <select required className={inputClass} value={form.idBoutique} onChange={handleChange("idBoutique")}>
            <option value="">Sélectionner...</option>
            {dims.boutiques.map((b) => (
              <option key={b.idBoutique} value={b.idBoutique}>{b.nomBoutique}</option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass}>Quantité disponible</label>
          <input required type="number" min="0" className={inputClass} value={form.quantiteDisponible} onChange={handleChange("quantiteDisponible")} />
        </div>

        <div>
          <label className={labelClass}>Seuil de réappro</label>
          <input required type="number" min="0" className={inputClass} value={form.seuilReappro} onChange={handleChange("seuilReappro")} />
        </div>

        <div>
          <label className={labelClass}>Date</label>
          <input required type="date" className={inputClass} value={form.dateInventaire} onChange={handleChange("dateInventaire")} />
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="mt-5 bg-indigo-600 text-white text-sm font-medium px-5 py-2 rounded-lg disabled:opacity-60"
      >
        {submitting ? "Enregistrement..." : "Enregistrer le relevé"}
      </button>
    </form>
  );
}