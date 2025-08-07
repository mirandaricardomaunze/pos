import { formatCurrency } from "../../utils/formatCurrency";

export function ReportSummary({ total }: { total: number }) {
  return (
    <div className="bg-blue-100 text-blue-800 p-4 rounded shadow-md">
      <h2 className="text-lg font-semibold">Total de Vendas: {formatCurrency(total)}</h2>
    </div>
  );
}
