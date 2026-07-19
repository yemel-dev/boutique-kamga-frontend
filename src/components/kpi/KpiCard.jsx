import { TrendingUp, TrendingDown } from "lucide-react";

export default function KpiCard({ icon: Icon, label, value, delta, deltaDirection = "up" }) {
  const isUp = deltaDirection === "up";

  return (
    <div className="bg-slate-900 border border-slate-800/60 rounded-xl p-5 flex flex-col gap-3">
      <div className="flex items-center gap-2 text-slate-400">
        {Icon && <Icon size={16} />}
        <span className="text-sm font-medium">{label}</span>
      </div>

      <div className="flex items-end justify-between">
        <p className="text-2xl font-semibold text-slate-100 tabular-nums">{value}</p>

        {delta !== undefined && delta !== null && (
          <span
            className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-md ${
              isUp
                ? "bg-emerald-500/10 text-emerald-400"
                : "bg-rose-500/10 text-rose-400"
            }`}
          >
            {isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {delta}
          </span>
        )}
      </div>
    </div>
  );
}