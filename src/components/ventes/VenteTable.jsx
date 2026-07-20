// ============================================================
//  VenteTable.jsx — Tableau des ventes avec export
// ============================================================
import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { RoleGuard } from '../../auth/RoleGuard';
import { venteApi } from '../../api/venteApi';
import ExportButtons from '../common/ExportButtons';

const PAGE_SIZE = 20;

const EXPORT_COLUMNS = [
  { key: 'dateVente',        label: 'Date' },
  { key: 'nomProduit',       label: 'Produit' },
  { key: 'nomClient',        label: 'Client' },
  { key: 'nomBoutique',      label: 'Boutique' },
  { key: 'nomVendeur',       label: 'Vendeur' },
  { key: 'modePaiement',     label: 'Mode paiement' },
  { key: 'quantiteVendue',   label: 'Quantité' },
  { key: 'prixUnitaireFcfa', label: 'Prix unitaire (FCFA)' },
  { key: 'remiseFcfa',       label: 'Remise (FCFA)' },
  { key: 'montantTotalFcfa', label: 'Montant total (FCFA)' },
  { key: 'beneficeFcfa',     label: 'Bénéfice (FCFA)' },
];

export default function VenteTable({ ventes, onDeleted }) {
  const [page, setPage] = useState(1);
  const [deletingId, setDeletingId] = useState(null);

  const sorted = [...ventes].sort((a, b) => new Date(b.dateVente) - new Date(a.dateVente));
  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const pageItems  = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer définitivement cette vente ?')) return;
    setDeletingId(id);
    try {
      await venteApi.remove(id);
      toast.success('Vente supprimée');
      onDeleted?.();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Échec de la suppression');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-slate-800">
          Ventes enregistrées
          {ventes.length > 0 && (
            <span className="ml-2 text-xs font-normal text-slate-400">
              ({ventes.length} résultat{ventes.length > 1 ? 's' : ''})
            </span>
          )}
        </h3>
        <ExportButtons
          data={sorted}
          columns={EXPORT_COLUMNS}
          filename="ventes_boutique_kamga"
          title="Liste des Ventes — Boutique Kamga"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-left">
              <th className="py-2 px-3 text-xs font-medium text-slate-500 uppercase">Date</th>
              <th className="py-2 px-3 text-xs font-medium text-slate-500 uppercase">Produit</th>
              <th className="py-2 px-3 text-xs font-medium text-slate-500 uppercase">Client</th>
              <th className="py-2 px-3 text-xs font-medium text-slate-500 uppercase">Boutique</th>
              <th className="py-2 px-3 text-xs font-medium text-slate-500 uppercase text-right">Qté</th>
              <th className="py-2 px-3 text-xs font-medium text-slate-500 uppercase text-right">Montant</th>
              <th className="py-2 px-3 text-xs font-medium text-slate-500 uppercase text-right">Bénéfice</th>
              <RoleGuard allow={['ADMIN']}>
                <th className="py-2 px-3 text-xs font-medium text-slate-500 uppercase text-right">Action</th>
              </RoleGuard>
            </tr>
          </thead>
          <tbody>
            {pageItems.map((v) => (
              <tr key={v.idVente} className="border-b border-slate-50 last:border-0 hover:bg-slate-50">
                <td className="py-2.5 px-3 text-slate-600">{v.dateVente}</td>
                <td className="py-2.5 px-3 text-slate-800 font-medium">{v.nomProduit}</td>
                <td className="py-2.5 px-3 text-slate-600">{v.nomClient}</td>
                <td className="py-2.5 px-3 text-slate-600">{v.nomBoutique}</td>
                <td className="py-2.5 px-3 text-right tabular-nums text-slate-600">{v.quantiteVendue}</td>
                <td className="py-2.5 px-3 text-right tabular-nums text-slate-800 font-medium">
                  {v.montantTotalFcfa?.toLocaleString()} FCFA
                </td>
                <td className="py-2.5 px-3 text-right tabular-nums text-emerald-600">
                  {v.beneficeFcfa?.toLocaleString()} FCFA
                </td>
                <RoleGuard allow={['ADMIN']}>
                  <td className="py-2.5 px-3 text-right">
                    <button
                      onClick={() => handleDelete(v.idVente)}
                      disabled={deletingId === v.idVente}
                      className="p-1.5 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 disabled:opacity-40"
                    >
                      <Trash2 size={15} />
                    </button>
                  </td>
                </RoleGuard>
              </tr>
            ))}
            {pageItems.length === 0 && (
              <tr>
                <td colSpan={8} className="py-6 text-center text-slate-400">Aucune vente enregistrée</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 text-sm text-slate-500">
          <span>Page {page} / {totalPages}</span>
          <div className="flex gap-2">
            <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
              className="px-3 py-1 border border-slate-200 rounded-md disabled:opacity-40">
              Précédent
            </button>
            <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}
              className="px-3 py-1 border border-slate-200 rounded-md disabled:opacity-40">
              Suivant
            </button>
          </div>
        </div>
      )}
    </div>
  );
}