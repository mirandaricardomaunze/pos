// src/components/Report/DateFilter.tsx
import { CalendarIcon } from '@heroicons/react/24/outline';
import Input from '../ui/input';
import type { DateFilterProps } from '../../types/sales';

export function DateFilter({ startDate, endDate, onChange }: DateFilterProps) {
  console.log("DateFilter rendered with start:", startDate, "end:", endDate);

  return (
    <div className="flex gap-4 items-center">
      <label className="flex items-center gap-2">
        <CalendarIcon className="w-5 h-5" />
        <Input type="date" value={startDate} onChange={e => onChange('start', e.target.value)} className="border p-2 rounded" />
      </label>
      <label className="flex items-center gap-2">
        <CalendarIcon className="w-5 h-5" />
        <Input type="date" value={endDate} onChange={e => onChange('end', e.target.value)} className="border p-2 rounded" />
      </label>
    </div>
  );
}
