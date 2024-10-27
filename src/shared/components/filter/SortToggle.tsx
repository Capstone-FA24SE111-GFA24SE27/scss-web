import React, { useState } from 'react';
import { Button, IconButton, Tooltip } from '@mui/material';
import { Sort } from '@mui/icons-material';

interface SortingToggleProps {
  onSortChange: (sortDirection: 'ASC' | 'DESC') => void;
  initialSort?: 'ASC' | 'DESC';
}

const SortingToggle = ({
  onSortChange,
  initialSort = 'ASC',
}: SortingToggleProps) => {
  const [sortDirection, setSortDirection] = useState<'ASC' | 'DESC'>(initialSort);

  const toggleSortDirection = () => {
    const newSortDirection = sortDirection === 'ASC' ? 'DESC' : 'ASC';
    setSortDirection(newSortDirection);
    onSortChange(newSortDirection);
  };

  return (
    <Tooltip title='Sort' className='h-full my-auto'>
      <IconButton onClick={toggleSortDirection} aria-label="Toggle Sort Direction">
        {sortDirection === 'ASC' ? (
          <Sort />
        ) : (
          <Sort className='rotate-180' />
        )}
      </IconButton >
    </Tooltip>
  );
};

export default SortingToggle;
