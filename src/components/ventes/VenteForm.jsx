import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { dimensionsApi } from "../../api/dimensionsApi";
import { venteApi } from "../../api/venteApi";

const emptyForm = {
  idProduit: "", idBoutique: "", idFournisseur: "", idClient: "",
  idVendeur: "", idPaiement: "", quantiteVendue: "", prixUnitaireFcfa: "",
  remiseFcfa: "0", dateVente: new Date().toISOString().slice(0, 10),
};

export default function VenteForm({ onCreated }) {
  const [dims, setDims] = useState({
    produits: [], boutiques: [], fournisseurs: [], clients: [], vendeurs: [], paiements: [],
  });
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [loadingDims, setLoadingDims] = useState(true);

  useEffect(() => {
    async function loadDims() {
      try {
        const [produits, boutiques, fournisseurs, clients, vendeurs, paiements] = await Promise.all([
          dimensionsApi.getProduits(), dimensionsApi.getBoutiques(), dimensionsApi.getFournisseurs(),
          dimensionsApi.getClients(), dimensionsApi.getVendeurs(), dimensionsApi.getModesPaiement(),
        ]);
        setDims({
          produits: produits.data, boutiques: boutiques.data, fournisseurs: fournisseurs.data,
          clients: clients.data, vendeurs: vendeurs.data, paiements: paiements.data,
        });
      } catch {
        toast.error("Impossible de charger les listes (produits, clients...)");
      } finally {
        setLoadingDims(false);
      }
    }
    loadDims();
  }, []);

  const handleProduitChange = (idProduit) => {
    const produit = dims.produits.find((p) => String(p.idProduit) === idProduit);
    setForm((f) => ({
      ...f,
      idProduit,
      prixUnitaireFcfa: produit ? produit.prixUnitaireFcfa : "",
    }));
  };

  const handleChange = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await venteApi.create({
        idProduit: Number(form.idProduit),
        idBoutique: Number(form.idBoutique),
        idFournisseur: Number(form.idFournisseur),
        idClient: Number(form.idClient),
        idVendeur: Number(form.idVendeur),
        idPaiement: Number(form.idPaiement),
        quantiteVendue: Number(form.quantiteVendue),
        prixUnitaireFcfa: Number(form.prixUnitaireFcfa),
        remiseFcfa: Number(form.remiseFcfa || 0),
        dateVente: form.dateVente,
      });
      toast.success("Vente enregistrée");
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

  const selectClass = "border border-slate-200 rounded-lg px-3 py-2 text-sm w-full bg-white";
  const labelClass = "text-xs font-medium text-slate-500 mb-1 block";

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-slate-800 mb-4">Nouvelle vente</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className={labelClass}>Produit</label>
          <select required className={selectClass} value={form.idProduit} onChange={(e) => handleProduitChange(e.target.value)}>
            <option value="">Sélectionner...</option>
            {dims.produits.map((p) => (
              <option key={p.idProduit} value={p.idProduit}>{p.nomProduit}</option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass}>Boutique</label>
          <select required className={selectClass} value={form.idBoutique} onChange={handleChange("idBoutique")}>
            <option value="">Sélectionner...</option>
            {dims.boutiques.map((b) => (
              <option key={b.idBoutique} value={b.idBoutique}>{b.nomBoutique}</option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass}>Client</label>
          <select required className={selectClass} value={form.idClient} onChange={handleChange("idClient")}>
            <option value="">Sélectionner...</option>
            {dims.clients.map((c) => (
              <option key={c.idClient} value={c.idClient}>{c.nomClient}</option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass}>Vendeur</label>
          <select required className={selectClass} value={form.idVendeur} onChange={handleChange("idVendeur")}>
            <option value="">Sélectionner...</option>
            {dims.vendeurs.map((v) => (
              <option key={v.idVendeur} value={v.idVendeur}>{v.nomVendeur}</option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass}>Fournisseur</label>
          <select required className={selectClass} value={form.idFournisseur} onChange={handleChange("idFournisseur")}>
            <option value="">Sélectionner...</option>
            {dims.fournisseurs.map((f) => (
              <option key={f.idFournisseur} value={f.idFournisseur}>{f.nomFournisseur}</option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass}>Mode de paiement</label>
          <select required className={selectClass} value={form.idPaiement} onChange={handleChange("idPaiement")}>
            <option value="">Sélectionner...</option>
            {dims.paiements.map((m) => (
              <option key={m.idPaiement} value={m.idPaiement}>{m.modePaiement}</option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass}>Quantité</label>
          <input required type="number" min="1" className={selectClass} value={form.quantiteVendue} onChange={handleChange("quantiteVendue")} />
        </div>

        <div>
          <label className={labelClass}>Prix unitaire (FCFA)</label>
          <input required type="number" min="0" className={selectClass} value={form.prixUnitaireFcfa} onChange={handleChange("prixUnitaireFcfa")} />
        </div>

        <div>
          <label className={labelClass}>Remise (FCFA)</label>
          <input type="number" min="0" className={selectClass} value={form.remiseFcfa} onChange={handleChange("remiseFcfa")} />
        </div>

        <div>
          <label className={labelClass}>Date</label>
          <input required type="date" className={selectClass} value={form.dateVente} onChange={handleChange("dateVente")} />
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="mt-5 bg-indigo-600 text-white text-sm font-medium px-5 py-2 rounded-lg disabled:opacity-60"
      >
        {submitting ? "Enregistrement..." : "Enregistrer la vente"}
      </button>
    </form>
  );
}