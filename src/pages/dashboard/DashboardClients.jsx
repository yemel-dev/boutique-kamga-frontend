// ============================================================
//  DashboardClients.jsx — avec filename pour export KpiTable
// ============================================================
import { useOutletContext } from 'react-router-dom';
import KpiTable from '../../components/kpi/KpiTable';

export default function DashboardClients() {
  const { data } = useOutletContext();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      <KpiTable
        title="Panier moyen par client"
        filename="panier_moyen_clients"
        data={data.panierMoyen}
        columns={[
          { key: 'nomClient',   label: 'Client' },
          { key: 'panierMoyen', label: 'Panier moyen', align: 'right',
            format: (v) => `${v?.toLocaleString()} FCFA` },
          { key: 'nbAchats',    label: 'Nb achats', align: 'right' },
        ]}
      />

      <KpiTable
        title="Clients les plus fidèles"
        filename="clients_fideles"
        data={data.clientsFideles}
        limit={10}
        columns={[
          { key: 'nomClient',   label: 'Client' },
          { key: 'typeClient',  label: 'Type' },
          { key: 'nbAchats',    label: 'Achats', align: 'right' },
          { key: 'totalAchats', label: 'Total', align: 'right',
            format: (v) => `${v?.toLocaleString()} FCFA` },
        ]}
      />

      <KpiTable
        title="Valeur vie client (CLV)"
        filename="valeur_vie_client_clv"
        data={data.clv}
        limit={10}
        columns={[
          { key: 'nomClient',  label: 'Client' },
          { key: 'typeClient', label: 'Type' },
          { key: 'clv',        label: 'CLV', align: 'right',
            format: (v) => `${v?.toLocaleString()} FCFA` },
        ]}
      />
    </div>
  );
}