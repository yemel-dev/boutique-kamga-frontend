// ============================================================
//  StockTable.jsx — Tableau stocks avec export
// ============================================================
import ExportButtons from '../common/ExportButtons';

const statutStyles = {
  Normal:   'bg-emerald-50 text-emerald-600',
  Critique: 'bg-amber-50 text-amber-600',
  Rupture:  'bg-rose-50 text-rose-600',
};

const EXPORT_COLUMNS = [
  { key: 'dateInventaire',     label: 'Date' },
  { key: 'nomProduit',         label: 'Produit' },
  { key: 'nomBoutique',        label: 'Boutique' },
  { key: 'quantiteDisponible', label: 'Quantité disponible' },
  { key: 'seuilReappro',       label: 'Seuil réappro.' },
  { key: 'statutStock',        label: 'Statut' },
];

export default function StockTable({ stocks }) {
  const sorted = [...stocks].sort((a, b) => new Date(b.dateInventaire) - new Date(a.dateInventaire));

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-slate-800">Relevés de stock</h3>
        <ExportButtons
          data={sorted}
          columns={EXPORT_COLUMNS}
          filename="stocks_boutique_kamga"
          title="Relevés de Stock — Boutique Kamga"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-left">
              <th className="py-2 px-3 text-xs font-medium text-slate-500 uppercase">Date</th>
              <th className="py-2 px-3 text-xs font-medium text-slate-500 uppercase">Produit</th>
              <th className="py-2 px-3 text-xs font-medium text-slate-500 uppercase">Boutique</th>
              <th className="py-2 px-3 text-xs font-medium text-slate-500 uppercase text-right">Quantité</th>
              <th className="py-2 px-3 text-xs font-medium text-slate-500 uppercase text-right">Seuil</th>
              <th className="py-2 px-3 text-xs font-medium text-slate-500 uppercase text-right">Statut</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((s, i) => (
              <tr key={i} className="border-b border-slate-50 last:border-0 hover:bg-slate-50">
                <td className="py-2.5 px-3 text-slate-600">{s.dateInventaire}</td>
                <td className="py-2.5 px-3 text-slate-800 font-medium">{s.nomProduit}</td>
                <td className="py-2.5 px-3 text-slate-600">{s.nomBoutique}</td>
                <td className="py-2.5 px-3 text-right tabular-nums text-slate-600">{s.quantiteDisponible}</td>
                <td className="py-2.5 px-3 text-right tabular-nums text-slate-400">{s.seuilReappro}</td>
                <td className="py-2.5 px-3 text-right">
                  <span className={`text-xs font-medium px-2 py-1 rounded-md ${statutStyles[s.statutStock] || statutStyles.Normal}`}>
                    {s.statutStock}
                  </span>
                </td>
              </tr>
            ))}
            {sorted.length === 0 && (
              <tr>
                <td colSpan={6} className="py-6 text-center text-slate-400">Aucun relevé enregistré</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}