// components/DashboardCard.tsx
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/outline';
import { Tooltip } from '@mui/material';
import type { DashboardCardProps } from '../../types/dashboard';



const DashboardCard = ({
  title,
  value,
  icon,
  trend,
  changeText,
  bgColor,
  textColor,
}: DashboardCardProps) => {
  // Função para calcular o tamanho da fonte baseado no comprimento do valor
  const getFontSizeClass = (val: string | number) => {
    const str = val.toString();
    if (str.length > 15) return 'text-lg';
    if (str.length > 10) return 'text-xl';
    return 'text-2xl sm:text-3xl';
  };

  const fontSizeClass = getFontSizeClass(value);
  const needsTooltip = typeof value === 'string' && value.length > 12;

  return (
    <div className={`${bgColor} rounded-xl shadow-lg overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1 min-w-[180px] h-full`}>
      <div className="p-4 sm:p-5 h-full flex flex-col">
        <div className="flex justify-between items-start flex-grow gap-2">
          <div className="flex-1 min-w-0">
            <p className={`text-xs sm:text-sm font-semibold ${textColor} opacity-90 truncate`}>
              {title}
            </p>
            
            <div className={`${fontSizeClass} font-bold ${textColor} mt-1 sm:mt-2 leading-tight`}>
              {needsTooltip ? (
                <Tooltip title={value} arrow>
                  <span className="truncate inline-block max-w-full">
                    {value}
                  </span>
                </Tooltip>
              ) : (
                <span className="break-all">
                  {value}
                </span>
              )}
            </div>
          </div>
          
          <div className={`p-2 sm:p-3 rounded-lg ${textColor} bg-white bg-opacity-20 flex-shrink-0`}>
            {icon}
          </div>
        </div>
        
        {trend !== 'neutral' && (
          <div className="mt-2 sm:mt-3 flex items-center">
            {trend === 'up' ? (
              <ArrowUpIcon className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 mr-1" />
            ) : (
              <ArrowDownIcon className="h-4 w-4 sm:h-5 sm:w-5 text-red-500 mr-1" />
            )}
            <span className={`text-xs sm:text-sm font-semibold ${
              trend === 'up' ? 'text-green-600' : 'text-red-600'
            } truncate`}>
              {changeText}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardCard;