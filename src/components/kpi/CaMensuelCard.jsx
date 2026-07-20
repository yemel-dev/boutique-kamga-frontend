import { useMemo, useState } from "react";
import KpiLineChart from "./KpiLineChart";

export default function CaMensuelCard({ data }) {
  const annees = useMemo(
    () => [...new Set(data.map((d) => d.annee))].sort((a, b) => b - a),
    [data]
  );
  const [annee, setAnnee] = useState(annees[0]);

  const filtered = useMemo(
    () => data.filter((d) => d.annee === annee),
    [data, annee]
  );

  if (annees.length === 0) {
    return <KpiLineChart title="Chiffre d'affaires mensuel" data={[]} xKey="nomMois" lineKey="chiffreAffaires" />;
  }

  return (
    <div className="relative">
      {annees.length > 1 && (
        <select
          value={annee}
          onChange={(e) => setAnnee(Number(e.target.value))}
          className="absolute top-5 right-5 z-10 text-sm border border-slate-200 rounded-lg px-2 py-1 text-slate-600 bg-white"
        >
          {annees.map((a) => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>
      )}
      <KpiLineChart title="Chiffre d'affaires mensuel" data={filtered} xKey="nomMois" lineKey="chiffreAffaires" />
    </div>
  );
}