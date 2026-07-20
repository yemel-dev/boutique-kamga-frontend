const BOUTIQUES = [
  { id: null, nom: "Toutes" },
  { id: 1, nom: "Yaoundé" },
  { id: 2, nom: "Bafoussam" },
  { id: 3, nom: "Douala" },
];

export default function BoutiqueFilter({ value, onChange }) {
  return (
    <div className="inline-flex bg-white border border-slate-200 rounded-lg p-1 shadow-sm">
      {BOUTIQUES.map((b) => (
        <button
          key={b.nom}
          onClick={() => onChange(b.id)}
          className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-150 ${
            value === b.id
              ? "bg-indigo-600 text-white"
              : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
          }`}
        >
          {b.nom}
        </button>
      ))}
    </div>
  );
}