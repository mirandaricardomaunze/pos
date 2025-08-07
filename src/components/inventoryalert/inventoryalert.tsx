// components/dashboard/InventoryAlert.tsx
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import Card from '../../components/ui/cards';

const InventoryAlert = () => {
  const alerts = [
    { id: 1, product: 'Notebook Dell XPS', current: 2, min: 5 },
    { id: 2, product: 'Mouse Sem Fio', current: 3, min: 10 },
  ];

  return (
    alerts.length > 0 && (
      <Card
        variant="default"
        headerClassName="bg-red-50 border-b border-red-100"
        title={
          <div className="flex items-center text-red-800">
            <ExclamationTriangleIcon className="h-5 w-5 mr-2" />
            Alertas de Estoque Baixo
          </div>
        }
      >
        <ul className="space-y-3">
          {alerts.map((alert) => (
            <li key={alert.id} className="flex justify-between items-center">
              <span className="font-medium">{alert.product}</span>
              <span className="text-sm text-red-600">
                {alert.current} unidades (mínimo: {alert.min})
              </span>
            </li>
          ))}
        </ul>
      </Card>
    )
  );
};
export default InventoryAlert;