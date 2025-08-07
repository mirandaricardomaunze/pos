// components/dashboard/ActivityFeed.tsx
import Card from '../ui/cards';
import { CheckCircleIcon, TruckIcon, CreditCardIcon } from '@heroicons/react/24/outline';

const ActivityFeed = () => {
  const activities = [
    { id: 1, type: 'sale', description: 'Novo pedido #10025', time: '2 min atrás', icon: CheckCircleIcon, color: 'text-green-500' },
    { id: 2, type: 'shipping', description: 'Pedido #10024 enviado', time: '1 hora atrás', icon: TruckIcon, color: 'text-blue-500' },
    { id: 3, type: 'payment', description: 'Pagamento recebido #10023', time: '3 horas atrás', icon: CreditCardIcon, color: 'text-purple-500' },
  ];

  return (
    <Card title="Atividades Recentes">
      <div className="flow-root">
        <ul className="-mb-4">
          {activities.map((activity, activityIdx) => (
            <li key={activity.id}>
              <div className="relative pb-4">
                {activityIdx !== activities.length - 1 ? (
                  <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                ) : null}
                <div className="relative flex space-x-3">
                  <div>
                    <span className={`h-8 w-8 rounded-full ${activity.color} bg-opacity-10 flex items-center justify-center`}>
                      <activity.icon className="h-5 w-5" />
                    </span>
                  </div>
                  <div className="min-w-0 flex-1 pt-1.5">
                    <p className="text-sm text-gray-800">{activity.description}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
};

export default ActivityFeed;