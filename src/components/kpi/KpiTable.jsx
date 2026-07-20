export default function KpiTable({ title, data, columns, limit, note }) {
  const rows = limit ? data.slice(0, limit) : data;
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
      <h3 className="text-sm font-medium text-slate-700 mb-1">{title}</h3>
      {note && <p className="text-xs text-slate-400 mb-3">{note}</p>}
      {/* ... reste du fichier inchangé, juste enlever le mb-4 du h3 ci-dessus */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`py-2 px-3 font-medium text-slate-500 text-xs uppercase tracking-wide ${
                    col.align === "right" ? "text-right" : "text-left"
                  }`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-b border-slate-50 last:border-0 hover:bg-slate-50">
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={`py-2.5 px-3 text-slate-700 ${
                      col.align === "right" ? "text-right tabular-nums" : "text-left"
                    }`}
                  >
                    {col.format ? col.format(row[col.key]) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="py-6 text-center text-slate-400 text-sm">
                  Aucune donnée disponible
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}