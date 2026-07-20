import { AlertTriangle, TriangleAlert } from "lucide-react";

const statutStyles = {
  Rupture: {
    badge: "bg-rose-50 text-rose-600",
    icon: <TriangleAlert size={14} />,
  },
  Critique: {
    badge: "bg-amber-50 text-amber-600",
    icon: <AlertTriangle size={14} />,
  },
};

export default function StockAlertesWidget({ alertes }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
      <h3 className="text-sm font-medium text-slate-700 mb-4">Alertes stock</h3>

      {alertes.length === 0 ? (
        <p className="text-sm text-slate-400 py-4 text-center">
          Aucune alerte — tous les stocks sont normaux.
        </p>
      ) : (
        <ul className="divide-y divide-slate-50">
          {alertes.map((a, i) => {
            const style = statutStyles[a.statutStock] || statutStyles.Critique;
            return (
              <li key={i} className="flex items-center justify-between py-2.5">
                <div>
                  <p className="text-sm font-medium text-slate-800">{a.nomProduit}</p>
                  <p className="text-xs text-slate-400">
                    {a.nomBoutique} — {a.quantiteDisponible} en stock (seuil {a.seuilReappro})
                  </p>
                </div>
                <span className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-md ${style.badge}`}>
                  {style.icon}
                  {a.statutStock}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}