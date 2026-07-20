import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { dimensionsApi } from "../../api/dimensionsApi";
import { achatApi } from "../../api/achatApi";

const emptyForm = {
  idFournisseur: "", idProduit: "", quantiteCommandee: "", montantAchatFcfa: "",
  dateCommande: new Date().toISOString().slice(0, 10),
};

export default function AchatForm({ onCreated }) {
  const [dims, setDims] = useState({ fournisseurs: [], produits: [] });
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [loadingDims, setLoadingDims] = useState(true);

  useEffect(() => {
    async function loadDims() {
      try {
        const [fournisseurs, produits] = await Promise.all([
          dimensionsApi.getFournisseurs(),
          dimensionsApi.getProduits(),
        ]);
        setDims({ fournisseurs: fournisseurs.data, produits: produits.data });
      } catch {
        toast.error("Impossible de charger les listes (fournisseurs, produits)");
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
      await achatApi.create({
        idFournisseur: Number(form.idFournisseur),
        idProduit: Number(form.idProduit),
        quantiteCommandee: Number(form.quantiteCommandee),
        montantAchatFcfa: Number(form.montantAchatFcfa),
        dateCommande: form.dateCommande,
      });
      toast.success("Commande enregistrée");
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
      <h3 className="text-sm font-semibold text-slate-800 mb-4">Nouvelle commande fournisseur</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div>
          <label className={labelClass}>Fournisseur</label>
          <select required className={inputClass} value={form.idFournisseur} onChange={handleChange("idFournisseur")}>
            <option value="">Sélectionner...</option>
            {dims.fournisseurs.map((f) => (
              <option key={f.idFournisseur} value={f.idFournisseur}>{f.nomFournisseur}</option>
            ))}
          </select>
        </div>

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
          <label className={labelClass}>Quantité commandée</label>
          <input required type="number" min="1" className={inputClass} value={form.quantiteCommandee} onChange={handleChange("quantiteCommandee")} />
        </div>

        <div>
          <label className={labelClass}>Montant (FCFA)</label>
          <input required type="number" min="0" className={inputClass} value={form.montantAchatFcfa} onChange={handleChange("montantAchatFcfa")} />
        </div>

        <div>
          <label className={labelClass}>Date de commande</label>
          <input required type="date" className={inputClass} value={form.dateCommande} onChange={handleChange("dateCommande")} />
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="mt-5 bg-indigo-600 text-white text-sm font-medium px-5 py-2 rounded-lg disabled:opacity-60"
      >
        {submitting ? "Enregistrement..." : "Enregistrer la commande"}
      </button>
    </form>
  );
}