// ============================================================
//  AchatTable.jsx — Tableau achats fournisseurs avec export
// ============================================================
import { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import LivraisonModal from './LivraisonModal';
import ExportButtons from '../common/ExportButtons';

const EXPORT_COLUMNS = [
  { key: 'dateCommande',           label: 'Date commande' },
  { key: 'nomFournisseur',         label: 'Fournisseur' },
  { key: 'nomProduit',             label: 'Produit' },
  { key: 'quantiteCommandee',      label: 'Quantité commandée' },
  { key: 'montantAchatFcfa',       label: 'Montant (FCFA)' },
  { key: 'dateLivraisonEffective', label: 'Date livraison' },
];

export default function AchatTable({ achats, onConfirmed }) {
  const [selected, setSelected] = useState(null);
  const sorted = [...achats].sort((a, b) => new Date(b.dateCommande) - new Date(a.dateCommande));

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-slate-800">Commandes fournisseurs</h3>
        <ExportButtons
          data={sorted}
          columns={EXPORT_COLUMNS}
          filename="achats_boutique_kamga"
          title="Commandes Fournisseurs — Boutique Kamga"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-left">
              <th className="py-2 px-3 text-xs font-medium text-slate-500 uppercase">Date commande</th>
              <th className="py-2 px-3 text-xs font-medium text-slate-500 uppercase">Fournisseur</th>
              <th className="py-2 px-3 text-xs font-medium text-slate-500 uppercase">Produit</th>
              <th className="py-2 px-3 text-xs font-medium text-slate-500 uppercase text-right">Quantité</th>
              <th className="py-2 px-3 text-xs font-medium text-slate-500 uppercase text-right">Montant</th>
              <th className="py-2 px-3 text-xs font-medium text-slate-500 uppercase">Livraison</th>
              <th className="py-2 px-3 text-xs font-medium text-slate-500 uppercase text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((a) => (
              <tr key={a.idAchat} className="border-b border-slate-50 last:border-0 hover:bg-slate-50">
                <td className="py-2.5 px-3 text-slate-600">{a.dateCommande}</td>
                <td className="py-2.5 px-3 text-slate-800 font-medium">{a.nomFournisseur}</td>
                <td className="py-2.5 px-3 text-slate-600">{a.nomProduit}</td>
                <td className="py-2.5 px-3 text-right tabular-nums text-slate-600">{a.quantiteCommandee}</td>
                <td className="py-2.5 px-3 text-right tabular-nums text-slate-800 font-medium">
                  {a.montantAchatFcfa?.toLocaleString()} FCFA
                </td>
                <td className="py-2.5 px-3">
                  {a.dateLivraisonEffective ? (
                    <span className="text-emerald-600 text-xs font-medium flex items-center gap-1">
                      <CheckCircle2 size={13} /> {a.dateLivraisonEffective}
                    </span>
                  ) : (
                    <span className="text-amber-600 text-xs font-medium">En attente</span>
                  )}
                </td>
                <td className="py-2.5 px-3 text-right">
                  {!a.dateLivraisonEffective && (
                    <button
                      onClick={() => setSelected(a)}
                      className="text-xs font-medium text-indigo-600 hover:text-indigo-800"
                    >
                      Confirmer réception
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {sorted.length === 0 && (
              <tr>
                <td colSpan={7} className="py-6 text-center text-slate-400">Aucune commande enregistrée</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selected && (
        <LivraisonModal
          achat={selected}
          onClose={() => setSelected(null)}
          onConfirmed={onConfirmed}
        />
      )}
    </div>
  );
}