import React from 'react';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

interface StatChangeProps {
  current: number;
  previous: number;
  prefixText?: string; // Optional prefix text
}

const StatChange: React.FC<StatChangeProps> = ({ current, previous, prefixText }) => {
  // Calculate the percentage change
  const change = ((current - previous) / previous) * 100;
  const isIncrease = change > 0;

  return (
    <div className="flex items-center gap-2">
      {/* Optional prefix text */}
      {prefixText && <span className="text-gray-500">{prefixText}</span>}
      {/* Icon changes based on increase or decrease */}
      {isIncrease ? (
        <TrendingUpIcon className="text-green-500" />
      ) : (
        <TrendingDownIcon className="text-red-500" />
      )}
      {/* Display the percentage change */}
      <span className={`font-semibold ${isIncrease ? 'text-green-500' : 'text-red-500'}`}>
        {Math.abs(change).toFixed(2)}%
      </span>
    </div>
  );
};

export default StatChange;
