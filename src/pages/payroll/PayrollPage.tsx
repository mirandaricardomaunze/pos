import { useEffect, useState, useCallback } from 'react';
import PayrollForm from '../../components/payroll/PayrollForm';
import { payrollService } from '../../services/payrollService/payrollService';
import type { Payroll } from '../../types/payroll';

const PayrollPage=() =>{
  const [payrolls, setPayrolls] = useState<Payroll[]>([]);

  const fetchPayrolls = useCallback(async () => {
    try {
      const data = await payrollService.getAll();
      setPayrolls(data);
    } catch (error) {
      console.error('Erro ao buscar folhas de pagamento:', error);
    }
  }, []);

  useEffect(() => {
    fetchPayrolls();
  }, [fetchPayrolls]);

  const handleMarkAsPaid = async (id: number) => {
    try {
      await payrollService.markAsPaid(id);
      fetchPayrolls();
    } catch (error) {
      console.error('Erro ao marcar como pago:', error);
      alert('Erro ao marcar como pago.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 pb-10">
      <div className="flex flex-col space-y-6">
        {/* Page Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Gestão de Folhas de Pagamento</h1>
        </div>

        {/* Payroll Form Section */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-blue-600 px-6 py-4">
            <h2 className="text-lg font-semibold text-white">Adicionar Nova Folha</h2>
          </div>
          <div className="p-6">
            <PayrollForm onSuccess={fetchPayrolls} />
          </div>
        </div>

        {/* Payroll List Section */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Histórico de Folhas</h2>
          </div>

          {payrolls.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              Nenhuma folha de pagamento registrada
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {payrolls.map((item) => (
                <div
                  key={item.id}
                  className="p-4 hover:bg-gray-50 transition-colors duration-150"
                >
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Funcionário</p>
                      <p className="font-medium">{item.employee.fullName}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Período</p>
                      <p>{item.month.toString().padStart(2, '0')}/{item.year}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Salário Líquido</p>
                      <p className="font-medium text-blue-600">{item.netSalary.toFixed(2)} MZN</p>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        item.status === 'PAID' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {item.status}
                      </span>

                      {item.status !== 'PAID' && (
                        <button
                          onClick={() => handleMarkAsPaid(item.id)}
                          className="text-sm text-blue-600 underline hover:text-blue-800"
                        >
                          Marcar como pago
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export default PayrollPage;
