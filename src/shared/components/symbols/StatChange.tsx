import React from 'react';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

interface StatChangeProps {
  current: number;
  previous: number;
  prefixText?: string; // Optional prefix text
}

const StatChange: React.FC<StatChangeProps> = ({ current, previous, prefixText }) => {
  let change: string | number = 0; // To handle special cases
  let isIncrease = false; // To track the direction of change

  // Handle special cases
  if (previous === 0 && current === 0) {
    change = 'No Change';
  } else if (previous === 0) {
    change = 'N/A'; // Impossible to calculate percentage change
    isIncrease = current > 0; // If `current` is positive, it's an increase
  } else if (current === 0) {
    change = '-100'; // A drop to 0 is a 100% decrease
    isIncrease = false; // Always a decrease in this case
  } else {
    // Calculate percentage change
    change = ((current - previous) / previous) * 100;
    isIncrease = change > 0;
  }

  return (
    <div className="flex items-center gap-2">
      {/* Optional prefix text */}
      {prefixText && <span className="text-gray-500">{prefixText}</span>}
      {/* Icon changes based on increase or decrease */}
      {typeof change === 'number' ? (
        isIncrease ? (
          <TrendingUpIcon className="text-green-500" />
        ) : (
          <TrendingDownIcon className="text-red-500" />
        )
      ) : null}
      {/* Display the percentage change or special message */}
      <span
        className={`font-semibold pl-4 ${
          isIncrease ? 'text-green-500' : 'text-red-500'
        }`}
      >
        {typeof change === 'number' ? `${Math.abs(change).toFixed(2)}%` : change}
      </span>
    </div>
  );
};

export default StatChange;
