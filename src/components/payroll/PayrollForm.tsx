import { useEffect, useState } from 'react';
import { payrollService } from '../../services/payrollService/payrollService';
import type { CreatePayrollDto } from '../../types/payroll';
import type { Employee } from '../../types/employee';
import attendanceService from '../../services/attendanceService/attendanceService';
import employeeService from '../../services/employeesService/employeesService';

interface Props {
  onSuccess: () => void;
}

export default function PayrollForm({ onSuccess }: Props) {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [form, setForm] = useState<Omit<CreatePayrollDto, 'baseSalary'>>({
    employeeId: 0,
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    bonuses: 0,
    deductions: 0,
  });

  const [inss, setInss] = useState(0);
  const [irps, setIrps] = useState(0);
  const [netSalary, setNetSalary] = useState(0);
  const [absences, setAbsences] = useState(0);
  const [workingDays, setWorkingDays] = useState(22);
  const [bonusAfterAbsences, setBonusAfterAbsences] = useState(0);

  useEffect(() => {
    async function fetchEmployees() {
      try {
        const data = await employeeService.getAll();
        setEmployees(data);
      } catch (err) {
        console.error('Erro ao buscar funcionários', err);
      }
    }
    fetchEmployees();
  }, []);

  useEffect(() => {
    async function fetchAbsences() {
      if (!form.employeeId || !form.month || !form.year) return;
      try {
        const data = await attendanceService.getAbsencesByMonth(form.employeeId, form.month, form.year);
        setAbsences(data.total);
      } catch (err) {
        console.error('Erro ao buscar faltas', err);
        setAbsences(0);
      }
    }
    fetchAbsences();
  }, [form.employeeId, form.month, form.year]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === 'employeeId') {
      const empId = parseInt(value);
      const emp = employees.find((e) => e.id === empId) || null;
      setSelectedEmployee(emp);
      setForm((prev) => ({ ...prev, employeeId: empId }));
    } else if (name === 'workingDays') {
      setWorkingDays(parseInt(value));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: name === 'month' || name === 'year' ? parseInt(value) : parseFloat(value),
      }));
    }
  };

  const calculaIrps = (grossAnnual: number): number => {
    if (grossAnnual <= 42000) return grossAnnual * 0.10;
    if (grossAnnual <= 168000) return grossAnnual * 0.15 - 2100;
    if (grossAnnual <= 504000) return grossAnnual * 0.20 - 10500;
    if (grossAnnual <= 1512000) return grossAnnual * 0.25 - 37500;
    return grossAnnual * 0.32 - 141540;
  };

  useEffect(() => {
    if (!selectedEmployee  || selectedEmployee.salary==null) return;
    const dailyBonus = form.bonuses / workingDays;
    const adjustedBonus = form.bonuses - dailyBonus * absences;
    setBonusAfterAbsences(adjustedBonus);

    const gross = selectedEmployee.salary + adjustedBonus;
    const annualGross = gross * 12;

    const inssValue = gross * 0.03;
    const irpsValue = calculaIrps(annualGross) / 12;

    setInss(inssValue);
    setIrps(irpsValue);
    setNetSalary(gross - inssValue - irpsValue - form.deductions);
  }, [form, selectedEmployee, absences, workingDays]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedEmployee || selectedEmployee.salary == null) {
      alert('Funcionário inválido ou sem salário definido.');
      return;
    }

    try {
      await payrollService.create({
        ...form,
        baseSalary: selectedEmployee.salary,
        deductions: form.deductions + inss + irps,
      });
      onSuccess();
      alert('Folha criada com sucesso.');
    } catch (err) {
      console.error(err);
      alert('Erro ao criar folha.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-blue-600 px-6 py-4">
          <h2 className="text-xl font-semibold text-white">Cadastrar Folha de Pagamento</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Funcionário *</label>
                <select
                  name="employeeId"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={form.employeeId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Selecione um funcionário</option>
                  {employees.map((emp:any) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.fullName} — {emp.salary.toFixed(2)} MZN
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mês *</label>
                  <input
                    name="month"
                    type="number"
                    min="1"
                    max="12"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={form.month}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ano *</label>
                  <input
                    name="year"
                    type="number"
                    min="2000"
                    max="2100"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={form.year}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Dias Úteis no mês</label>
                <input
                  name="workingDays"
                  type="number"
                  min={1}
                  max={31}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={workingDays}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bónus (MZN)</label>
                <input
                  name="bonuses"
                  type="number"
                  step="0.01"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={form.bonuses}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descontos manuais (MZN)</label>
                <input
                  name="deductions"
                  type="number"
                  step="0.01"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={form.deductions}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {selectedEmployee?.salary && (
            <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
              <h3 className="text-lg font-medium text-gray-800 mb-3">Resumo da Folha</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Salário Base:</span>
                    <span className="text-sm font-medium">{selectedEmployee.salary.toFixed(2)} MZN</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Faltas no mês:</span>
                    <span className="text-sm font-medium">{absences}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Dias úteis:</span>
                    <span className="text-sm font-medium">{workingDays}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Bónus após faltas:</span>
                    <span className="text-sm font-medium">{bonusAfterAbsences.toFixed(2)} MZN</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">INSS (3%):</span>
                    <span className="text-sm font-medium">{inss.toFixed(2)} MZN</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">IRPS estimado:</span>
                    <span className="text-sm font-medium">{irps.toFixed(2)} MZN</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-gray-200">
                    <span className="text-base font-medium text-gray-800">Salário Líquido:</span>
                    <span className="text-base font-bold text-blue-600">{netSalary.toFixed(2)} MZN</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Salvar Folha de Pagamento
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}