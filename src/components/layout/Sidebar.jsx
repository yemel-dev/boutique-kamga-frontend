import { NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, ShoppingCart, Package, Truck, LogOut, Store } from "lucide-react";
import { useAuth } from "../../auth/AuthContext";
import { RoleGuard } from "../../auth/RoleGuard";

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
      isActive
        ? "bg-indigo-50 text-indigo-700"
        : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
    }`;

  return (
    <aside className="w-60 min-h-screen bg-white border-r border-slate-200 flex flex-col p-4">
      <div className="flex items-center gap-2 mb-8 px-2">
        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
          <Store size={16} className="text-white" />
        </div>
        <div>
          <h2 className="text-slate-900 font-semibold text-sm leading-tight">Boutique Kamga</h2>
          <p className="text-slate-400 text-xs">{user?.username} — {user?.role}</p>
        </div>
      </div>

      <nav className="space-y-1 flex-1">
        <RoleGuard allow={["ADMIN", "PROPRIETAIRE"]}>
          <NavLink to="/dashboard" className={linkClass}>
            <LayoutDashboard size={16} /> Tableau de bord
          </NavLink>
        </RoleGuard>

        <NavLink to="/ventes" className={linkClass}>
          <ShoppingCart size={16} /> Ventes
        </NavLink>

        <NavLink to="/stocks" className={linkClass}>
          <Package size={16} /> Stocks
        </NavLink>

        <RoleGuard allow={["ADMIN"]}>
          <NavLink to="/achats" className={linkClass}>
            <Truck size={16} /> Achats
          </NavLink>
        </RoleGuard>
      </nav>

      <button
        onClick={handleLogout}
        className="flex items-center gap-2 text-slate-400 hover:text-slate-900 px-4 py-2 text-sm"
      >
        <LogOut size={16} /> Déconnexion
      </button>
    </aside>
  );
}