// ============================================================
//  DashboardStocksFournisseurs.jsx — avec filename export
// ============================================================
import { useOutletContext } from 'react-router-dom';
import KpiBarChart from '../../components/kpi/KpiBarChart';
import KpiTable from '../../components/kpi/KpiTable';

export default function DashboardStocksFournisseurs() {
  const { data, noteNonFiltrable } = useOutletContext();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      <KpiBarChart
        title="Taux de rotation des stocks"
        data={data.rotationStock}
        xKey="nomProduit"
        bars={[{ dataKey: 'tauxRotation', color: '#0ea5e9', name: 'Taux de rotation' }]}
      />

      <KpiBarChart
        title="Taux de rupture de stock"
        data={data.tauxRupture}
        xKey="nomProduit"
        bars={[{ dataKey: 'tauxRupturePct', color: '#e11d48', name: 'Taux de rupture (%)' }]}
      />

      <KpiTable
        title="Fournisseurs les plus fiables"
        filename="fournisseurs_fiabilite"
        note={noteNonFiltrable}
        data={data.fournisseurs}
        columns={[
          { key: 'nomFournisseur',       label: 'Fournisseur' },
          { key: 'delaiLivraisonMoyenJ', label: 'Délai moy. (j)', align: 'right' },
          { key: 'noteFiabilite',        label: 'Fiabilité', align: 'right' },
          { key: 'nbCommandes',          label: 'Commandes', align: 'right' },
        ]}
      />
    </div>
  );
}