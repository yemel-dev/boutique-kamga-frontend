import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./auth/AuthContext";
import { ProtectedRoute } from "./auth/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import DashboardLayout from "./pages/dashboard/DashboardLayout";
import DashboardOverview from "./pages/dashboard/DashboardOverview";
import DashboardVentesProduits from "./pages/dashboard/DashboardVentesProduits";
import DashboardClients from "./pages/dashboard/DashboardClients";
import DashboardStocksFournisseurs from "./pages/dashboard/DashboardStocksFournisseurs";
import VentesPage from "./pages/VentesPage";
import StocksPage from "./pages/StocksPage";
import AchatsPage from "./pages/AchatsPage";
import AccesRefusePage from "./pages/AccesRefusePage";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/acces-refuse" element={<AccesRefusePage />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allow={["ADMIN", "PROPRIETAIRE"]}>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="vue-ensemble" replace />} />
            <Route path="vue-ensemble" element={<DashboardOverview />} />
            <Route path="ventes-produits" element={<DashboardVentesProduits />} />
            <Route path="clients" element={<DashboardClients />} />
            <Route path="stocks-fournisseurs" element={<DashboardStocksFournisseurs />} />
          </Route>

          <Route
            path="/ventes"
            element={
              <ProtectedRoute>
                <VentesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/stocks"
            element={
              <ProtectedRoute>
                <StocksPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/achats"
            element={
              <ProtectedRoute allow={["ADMIN"]}>
                <AchatsPage />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}