import { TrendingUp, TrendingDown } from "lucide-react";

export default function KpiCard({ icon: Icon, label, value, delta, deltaDirection = "up" }) {
  const isUp = deltaDirection === "up";

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col gap-3 shadow-sm">
      <div className="flex items-center gap-2 text-slate-500">
        {Icon && <Icon size={16} />}
        <span className="text-sm font-medium">{label}</span>
      </div>

      <div className="flex items-end justify-between">
        <p className="text-2xl font-semibold text-slate-900 tabular-nums">{value}</p>

        {delta !== undefined && delta !== null && (
          <span
            className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-md ${
              isUp
                ? "bg-emerald-50 text-emerald-600"
                : "bg-rose-50 text-rose-600"
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