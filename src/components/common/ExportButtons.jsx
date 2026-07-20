// ============================================================
//  ExportButtons.jsx — Boutons PDF + Excel réutilisables
// ============================================================
import { FileSpreadsheet, FileText } from 'lucide-react';
import { exportToExcel, exportToPDF } from '../../utils/exportUtils';

export default function ExportButtons({ data, columns, filename, title }) {
  if (!data?.length) return null;

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => exportToExcel(data, columns, filename)}
        className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium
                   bg-emerald-50 text-emerald-700 border border-emerald-200
                   rounded-lg hover:bg-emerald-100 transition-colors"
      >
        <FileSpreadsheet size={14} />
        Excel
      </button>
      <button
        onClick={() => exportToPDF(data, columns, filename, title)}
        className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium
                   bg-rose-50 text-rose-700 border border-rose-200
                   rounded-lg hover:bg-rose-100 transition-colors"
      >
        <FileText size={14} />
        PDF
      </button>
    </div>
  );
}