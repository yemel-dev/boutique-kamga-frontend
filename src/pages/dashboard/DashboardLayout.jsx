// ============================================================
//  DashboardLayout.jsx — avec bouton Rapport complet PDF
// ============================================================
import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Loader2, FileText } from 'lucide-react';
import PageContainer from '../../components/layout/PageContainer';
import BoutiqueFilter from '../../components/dashboard/BoutiqueFilter';
import { olapApi } from '../../api/olapApi';
import { stockApi } from '../../api/stockApi';
import { exportRapportDashboard } from '../../utils/exportUtils';

const emptyData = {
  topProduits: [], caMensuel: [], panierMoyen: [], margeProduit: [],
  performance: [], fournisseurs: [], rotationStock: [], ventesSaison: [],
  clientsFideles: [], clv: [], ventesPaiement: [], tauxRupture: [], alertes: [],
};

export default function DashboardLayout() {
  const [idBoutique, setIdBoutique] = useState(null);
  const [data, setData] = useState(emptyData);
  const [loadingFixe, setLoadingFixe] = useState(true);
  const [loadingFiltrable, setLoadingFiltrable] = useState(true);
  const [exportingPDF, setExportingPDF] = useState(false);

  useEffect(() => {
    async function loadFixe() {
      const results = await Promise.allSettled([
        olapApi.getPerformance(),
        olapApi.getFournisseurs(),
        stockApi.getAlertes(),
      ]);
      const keys = ['performance', 'fournisseurs', 'alertes'];
      setData((prev) => {
        const next = { ...prev };
        results.forEach((r, i) => {
          if (r.status === 'fulfilled') next[keys[i]] = r.value.data;
        });
        return next;
      });
      setLoadingFixe(false);
    }
    loadFixe();
  }, []);

  useEffect(() => {
    async function loadFiltrable() {
      setLoadingFiltrable(true);
      const calls = [
        olapApi.getTopProduits(idBoutique), olapApi.getCaMensuel(idBoutique),
        olapApi.getPanierMoyen(idBoutique), olapApi.getMargeProduit(idBoutique),
        olapApi.getRotationStock(idBoutique), olapApi.getVentesSaison(idBoutique),
        olapApi.getClientsFideles(idBoutique), olapApi.getClv(idBoutique),
        olapApi.getVentesPaiement(idBoutique), olapApi.getTauxRupture(idBoutique),
      ];
      const keys = [
        'topProduits', 'caMensuel', 'panierMoyen', 'margeProduit', 'rotationStock',
        'ventesSaison', 'clientsFideles', 'clv', 'ventesPaiement', 'tauxRupture',
      ];
      const results = await Promise.allSettled(calls);
      const failedCount = results.filter((r) => r.status === 'rejected').length;
      if (failedCount > 0) toast.error(`${failedCount} KPI(s) n'ont pas pu être chargés`);
      setData((prev) => {
        const next = { ...prev };
        results.forEach((r, i) => {
          if (r.status === 'fulfilled') next[keys[i]] = r.value.data;
        });
        return next;
      });
      setLoadingFiltrable(false);
    }
    loadFiltrable();
  }, [idBoutique]);

  const handleExportRapport = () => {
    setExportingPDF(true);
    try {
      exportRapportDashboard(data, idBoutique);
      toast.success('Rapport PDF généré avec succès');
    } catch {
      toast.error('Erreur lors de la génération du rapport');
    } finally {
      setExportingPDF(false);
    }
  };

  if (loadingFixe) {
    return (
      <PageContainer title="Tableau de bord">
        <div className="flex items-center justify-center py-24 text-slate-400">
          <Loader2 className="animate-spin mr-2" size={20} />
          Chargement des KPIs...
        </div>
      </PageContainer>
    );
  }

  const noteNonFiltrable = idBoutique
    ? 'Toutes boutiques — filtre indisponible sur ce KPI'
    : undefined;

  return (
    <PageContainer title="Tableau de bord">
      <div className="flex items-center justify-between mb-6">
        <BoutiqueFilter value={idBoutique} onChange={setIdBoutique} />

        <div className="flex items-center gap-3">
          {loadingFiltrable && (
            <span className="flex items-center gap-2 text-sm text-slate-400">
              <Loader2 className="animate-spin" size={14} /> Actualisation...
            </span>
          )}
          <button
            onClick={handleExportRapport}
            disabled={exportingPDF || loadingFiltrable}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium
                       bg-rose-600 text-white rounded-lg hover:bg-rose-700
                       disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {exportingPDF
              ? <Loader2 size={14} className="animate-spin" />
              : <FileText size={14} />
            }
            Rapport PDF complet
          </button>
        </div>
      </div>

      <Outlet context={{ data, idBoutique, loadingFiltrable, noteNonFiltrable }} />
    </PageContainer>
  );
}