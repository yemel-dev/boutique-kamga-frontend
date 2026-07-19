import { useNavigate } from "react-router-dom";
import { ShieldAlert } from "lucide-react";

export default function AccesRefusePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-md p-10 text-center max-w-md">
        <ShieldAlert className="mx-auto text-red-500 mb-4" size={48} />
        <h1 className="text-xl font-bold text-slate-800 mb-2">Accès refusé</h1>
        <p className="text-slate-500 text-sm mb-6">
          Votre rôle ne permet pas d'accéder à cette page.
        </p>
        <button
          onClick={() => navigate(-1)}
          className="bg-slate-800 text-white rounded-lg px-5 py-2 text-sm font-semibold"
        >
          Retour
        </button>
      </div>
    </div>
  );
}