import { NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, ShoppingCart, Package, Truck, LogOut, Store } from "lucide-react";
import { useAuth } from "../../auth/AuthContext";
import { RoleGuard } from "../../auth/RoleGuard";

const roleLabels = {
  ADMIN: "Administrateur",
  PROPRIETAIRE: "Propriétaire",
  VENDEUR: "Vendeur",
};

export default function Sidebar({ onNavigate }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150 ${
      isActive
        ? "bg-indigo-50 text-indigo-700"
        : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
    }`;

  const sectionLabel = "px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2";

  return (
    <aside className="w-64 min-h-screen bg-white border-r border-slate-200 flex flex-col">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 h-16 border-b border-slate-100">
        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shrink-0">
          <Store size={16} className="text-white" />
        </div>
        <h2 className="text-slate-900 font-semibold text-sm">Boutique Kamga</h2>
      </div>

      {/* Navigation regroupée par section */}
      <nav className="flex-1 px-3 py-5 space-y-6">
        <RoleGuard allow={["ADMIN", "PROPRIETAIRE"]}>
          <div>
            <p className={sectionLabel}>Analyse</p>
            <NavLink to="/dashboard" className={linkClass}>
              <LayoutDashboard size={16} /> Tableau de bord
            </NavLink>
          </div>
        </RoleGuard>

        <div>
          <p className={sectionLabel}>Opérations</p>
          <div className="space-y-1">
            <NavLink to="/ventes" className={linkClass} onClick={onNavigate}>
              <ShoppingCart size={16} /> Ventes
            </NavLink>
            <NavLink to="/stocks" className={linkClass} onClick={onNavigate}>
              <Package size={16} /> Stocks
            </NavLink>
            <RoleGuard allow={["ADMIN"]}>
              <NavLink to="/achats" className={linkClass} onClick={onNavigate}>
                <Truck size={16} /> Achats
              </NavLink>
            </RoleGuard>
          </div>
        </div>
      </nav>

      {/* Carte utilisateur en bas */}
      <div className="border-t border-slate-100 p-3">
        <div className="flex items-center gap-3 px-2 py-2 rounded-lg">
          <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-semibold text-sm shrink-0">
            {user?.username?.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-slate-800 truncate">{user?.username}</p>
            <p className="text-xs text-slate-400">{roleLabels[user?.role] || user?.role}</p>
          </div>
          <button
            onClick={handleLogout}
            title="Déconnexion"
            className="p-1.5 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}