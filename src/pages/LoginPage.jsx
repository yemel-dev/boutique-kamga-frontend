import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import toast from "react-hot-toast";

export default function LoginPage() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form);
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Identifiants incorrects");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-slate-800 mb-1">Boutique Kamga</h1>
        <p className="text-slate-500 text-sm mb-6">Entrepôt de Données — IAR418</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            className="w-full border rounded-lg px-4 py-2"
            placeholder="Nom d'utilisateur"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
          />
          <input
            className="w-full border rounded-lg px-4 py-2"
            type="password"
            placeholder="Mot de passe"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <button
            className="w-full bg-blue-700 text-white rounded-lg py-2 font-semibold disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        <div className="mt-4 text-xs text-slate-400 space-y-1">
          <p>admin / password123 (ADMIN)</p>
          <p>kamga.jean / password123 (PROPRIETAIRE)</p>
          <p>vendeur.douala / password123 (VENDEUR)</p>
        </div>
      </div>
    </div>
  );
}