import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import toast from "react-hot-toast";
import { Store } from "lucide-react";

export default function LoginPage() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(form);
      const destination = user.role === "VENDEUR" ? "/ventes" : "/dashboard";
      navigate(destination);
    } catch (err) {
      toast.error(err.response?.data?.message || "Identifiants incorrects");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-xl overflow-hidden">
        {/* Header incurvé — inspiré du pattern d'accueil mobile, couleurs Boutique Kamga */}
        <div className="relative bg-gradient-to-br from-indigo-600 to-indigo-700 pt-10 pb-16 px-8 text-center">
          <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center mx-auto mb-5">
            <Store size={22} className="text-white" />
          </div>
          <h1 className="text-white text-xl font-semibold leading-tight">
            Bienvenue<br />sur Boutique Kamga
          </h1>
          <p className="text-indigo-100 text-sm mt-2">
            Gérez ventes, stocks et achats en un seul endroit.
          </p>

          {/* Courbe blanche en bas du header */}
          <svg
            className="absolute -bottom-px left-0 w-full"
            viewBox="0 0 400 40"
            preserveAspectRatio="none"
            style={{ height: 40 }}
          >
            <path d="M0,40 C100,0 300,0 400,40 L400,40 L0,40 Z" fill="white" />
          </svg>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="px-8 pt-6 pb-8 space-y-4">
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">Nom d'utilisateur</label>
            <input
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">Mot de passe</label>
            <input
              type="password"
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-full py-3 text-sm font-semibold transition-colors disabled:opacity-60 mt-2"
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>

          <div className="pt-4 border-t border-slate-100 mt-2">
            <p className="text-xs font-medium text-slate-400 mb-2">Comptes de démonstration</p>
            <div className="space-y-1 text-xs text-slate-500">
              <p><span className="font-medium text-slate-700">admin</span> / password123 — ADMIN</p>
              <p><span className="font-medium text-slate-700">kamga.jean</span> / password123 — PROPRIETAIRE</p>
              <p><span className="font-medium text-slate-700">vendeur.douala</span> / password123 — VENDEUR</p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}