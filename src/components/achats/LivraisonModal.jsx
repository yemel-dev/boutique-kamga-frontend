import { useState } from "react";
import toast from "react-hot-toast";
import { X } from "lucide-react";
import { achatApi } from "../../api/achatApi";

export default function LivraisonModal({ achat, onClose, onConfirmed }) {
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [submitting, setSubmitting] = useState(false);

  const handleConfirm = async () => {
    setSubmitting(true);
    try {
      await achatApi.confirmerLivraison(achat.idAchat, date);
      toast.success("Réception confirmée");
      onConfirmed();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Échec de la confirmation");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-slate-800">Confirmer la réception</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700">
            <X size={18} />
          </button>
        </div>

        <p className="text-sm text-slate-500 mb-4">
          Commande : <span className="font-medium text-slate-700">{achat.nomProduit}</span> — {achat.nomFournisseur}
        </p>

        <label className="text-xs font-medium text-slate-500 mb-1 block">Date de livraison effective</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border border-slate-200 rounded-lg px-3 py-2 text-sm w-full mb-5"
        />

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 text-sm text-slate-600 rounded-lg hover:bg-slate-50">
            Annuler
          </button>
          <button
            onClick={handleConfirm}
            disabled={submitting}
            className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg disabled:opacity-60"
          >
            {submitting ? "Confirmation..." : "Confirmer"}
          </button>
        </div>
      </div>
    </div>
  );
}