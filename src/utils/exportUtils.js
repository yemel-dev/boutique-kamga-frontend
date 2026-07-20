// ============================================================
//  exportUtils.js — Export PDF et Excel
//  IAR418 · Boutique Kamga · Université de Dschang
// ============================================================
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const ENTETE  = 'Boutique Kamga — IAR418 · Université de Dschang';
const BLEU    = [31, 56, 100];
const BLANC   = [255, 255, 255];
const GRIS_L  = [235, 243, 251];
const dateStr = () => new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
const slug    = () => new Date().toISOString().slice(0, 10);

// ── Helpers PDF ───────────────────────────────────────────────
function initPDF(titre, orientation = 'landscape') {
  const doc = new jsPDF({ orientation, unit: 'mm', format: 'a4' });
  doc.setFontSize(16);
  doc.setTextColor(...BLEU);
  doc.text(titre, 14, 18);
  doc.setFontSize(8);
  doc.setTextColor(120);
  doc.text(ENTETE, 14, 24);
  doc.text(`Exporté le ${dateStr()}`, 14, 29);
  return doc;
}

function addPageNumbers(doc) {
  const n = doc.internal.getNumberOfPages();
  for (let i = 1; i <= n; i++) {
    doc.setPage(i);
    doc.setFontSize(7);
    doc.setTextColor(150);
    doc.text(
      `Page ${i} / ${n}`,
      doc.internal.pageSize.getWidth() / 2,
      doc.internal.pageSize.getHeight() - 7,
      { align: 'center' }
    );
  }
}

function addTable(doc, data, columns, startY) {
  autoTable(doc, {
    startY,
    head: [columns.map(c => c.label)],
    body: data.map(row =>
      columns.map(c => {
        const val = row[c.key];
        return c.format ? c.format(val) : (val ?? '');
      })
    ),
    headStyles:          { fillColor: BLEU, textColor: BLANC, fontStyle: 'bold', fontSize: 8 },
    bodyStyles:          { fontSize: 7.5, textColor: [64, 64, 64] },
    alternateRowStyles:  { fillColor: GRIS_L },
    margin:              { left: 14, right: 14 },
  });
  return doc.lastAutoTable.finalY;
}

// ── Export tableau simple → PDF ───────────────────────────────
export function exportToPDF(data, columns, filename, title) {
  if (!data?.length) return;
  const doc = initPDF(title);
  addTable(doc, data, columns, 34);
  addPageNumbers(doc);
  doc.save(`${filename}_${slug()}.pdf`);
}

// ── Export tableau simple → Excel ─────────────────────────────
export function exportToExcel(data, columns, filename, sheetName = 'Données') {
  if (!data?.length) return;
  const rows = data.map(row =>
    Object.fromEntries(
      columns.map(c => {
        const val = row[c.key];
        return [c.label, c.format ? c.format(val) : (val ?? '')];
      })
    )
  );
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(rows);
  ws['!cols'] = columns.map(c => ({ wch: Math.max(c.label.length + 4, 16) }));
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  XLSX.writeFile(wb, `${filename}_${slug()}.xlsx`);
}

// ── Rapport Dashboard complet → PDF (toutes sections) ─────────
export function exportRapportDashboard(data, idBoutique) {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();
  let y = 18;

  const newPage = () => { doc.addPage(); y = 18; };
  const section = (titre) => {
    if (y > H - 50) newPage();
    doc.setFontSize(11);
    doc.setTextColor(...BLEU);
    doc.text(titre, 14, y);
    y += 4;
  };
  const table = (tableData, columns) => {
    if (!tableData?.length) return;
    addTable(doc, tableData, columns, y);
    y = doc.lastAutoTable.finalY + 10;
    if (y > H - 40) newPage();
  };

  // ── Page de garde ──────────────────────────────────────────
  doc.setFontSize(22);
  doc.setTextColor(...BLEU);
  doc.text('Rapport Analytique Complet', 14, y); y += 10;
  doc.setFontSize(13);
  doc.text('Boutique Kamga — IAR418', 14, y); y += 7;
  doc.setFontSize(9);
  doc.setTextColor(100);
  doc.text('Université de Dschang · Superviseur : Dr. AZANGUEZET BENOIT', 14, y); y += 5;
  doc.text(`Exporté le ${dateStr()}${idBoutique ? ' · Boutique filtrée' : ' · Toutes boutiques'}`, 14, y);
  newPage();

  // ── Section 1 — Ventes ────────────────────────────────────
  section('1. Produits les plus vendus');
  table(data.topProduits, [
    { key: 'nomProduit',     label: 'Produit' },
    { key: 'quantiteTotale', label: 'Quantité vendue' },
  ]);

  section('2. Chiffre d\'affaires mensuel');
  table(data.caMensuel, [
    { key: 'nomMois',         label: 'Mois' },
    { key: 'annee',           label: 'Année' },
    { key: 'chiffreAffaires', label: 'CA (FCFA)', format: v => v?.toLocaleString() },
    { key: 'nbVentes',        label: 'Nb ventes' },
  ]);

  section('3. Marge bénéficiaire par produit');
  table(data.margeProduit, [
    { key: 'nomProduit',    label: 'Produit' },
    { key: 'beneficeTotal', label: 'Bénéfice (FCFA)', format: v => v?.toLocaleString() },
    { key: 'margePct',      label: 'Marge (%)', format: v => v != null ? `${v} %` : '' },
  ]);

  section('4. Ventes par saison');
  table(data.ventesSaison, [
    { key: 'saisonCamerounaise', label: 'Saison' },
    { key: 'chiffreAffaires',    label: 'CA (FCFA)', format: v => v?.toLocaleString() },
    { key: 'nbVentes',           label: 'Nb ventes' },
  ]);

  section('5. Ventes par mode de paiement');
  table(data.ventesPaiement, [
    { key: 'modePaiement',   label: 'Mode de paiement' },
    { key: 'nbTransactions', label: 'Nb transactions' },
    { key: 'chiffreAffaires', label: 'CA (FCFA)', format: v => v?.toLocaleString() },
  ]);

  // ── Section 2 — Clients ───────────────────────────────────
  newPage();
  section('6. Panier moyen par client');
  table(data.panierMoyen, [
    { key: 'nomClient',   label: 'Client' },
    { key: 'panierMoyen', label: 'Panier moyen (FCFA)', format: v => v?.toLocaleString() },
    { key: 'nbAchats',    label: 'Nb achats' },
  ]);

  section('7. Clients les plus fidèles (Top 10)');
  table(data.clientsFideles?.slice(0, 10), [
    { key: 'nomClient',   label: 'Client' },
    { key: 'typeClient',  label: 'Type' },
    { key: 'nbAchats',    label: 'Nb achats' },
    { key: 'totalAchats', label: 'Total (FCFA)', format: v => v?.toLocaleString() },
  ]);

  section('8. Valeur vie client — CLV (Top 10)');
  table(data.clv?.slice(0, 10), [
    { key: 'nomClient',  label: 'Client' },
    { key: 'typeClient', label: 'Type' },
    { key: 'clv',        label: 'CLV (FCFA)', format: v => v?.toLocaleString() },
  ]);

  // ── Section 3 — Stocks et Fournisseurs ───────────────────
  newPage();
  section('9. Taux de rotation des stocks');
  table(data.rotationStock, [
    { key: 'nomProduit',          label: 'Produit' },
    { key: 'quantiteVendueTotale', label: 'Qté vendue' },
    { key: 'stockMoyen',          label: 'Stock moyen' },
    { key: 'tauxRotation',        label: 'Taux de rotation' },
  ]);

  section('10. Taux de rupture de stock');
  table(data.tauxRupture, [
    { key: 'nomProduit',    label: 'Produit' },
    { key: 'nbRuptures',    label: 'Nb ruptures' },
    { key: 'tauxRupturePct', label: 'Taux (%)', format: v => v != null ? `${v} %` : '' },
  ]);

  section('11. Fournisseurs les plus fiables');
  table(data.fournisseurs, [
    { key: 'nomFournisseur',        label: 'Fournisseur' },
    { key: 'delaiLivraisonMoyenJ',  label: 'Délai moy. (j)' },
    { key: 'noteFiabilite',         label: 'Fiabilité /10' },
    { key: 'nbCommandes',           label: 'Nb commandes' },
    { key: 'volumeAffaires',        label: 'Volume (FCFA)', format: v => v?.toLocaleString() },
  ]);

  section('12. Performance par boutique');
  table(data.performance, [
    { key: 'nomBoutique',     label: 'Boutique' },
    { key: 'ville',           label: 'Ville' },
    { key: 'chiffreAffaires', label: 'CA (FCFA)', format: v => v?.toLocaleString() },
  ]);

  addPageNumbers(doc);
  doc.save(`rapport_complet_boutique_kamga_${slug()}.pdf`);
}