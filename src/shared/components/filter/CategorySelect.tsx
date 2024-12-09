import React, { useState } from 'react';
import { Button, Menu, MenuItem, Divider, styled } from '@mui/material';

export type SelectOption = {
  label: string;
  value: string | number;
}

interface CategorySelectProps {
  label: string;
  options: SelectOption[];
  value: string | number;
  onChange: (value: string | number) => void;
  className?: string;
  size?: 'small' | 'medium';
  disabled?: boolean;
  showClearOptions?: boolean;
}

// Custom styled component for the "Clear" option
const ClearMenuItem = styled(MenuItem)(({ theme }) => ({
  color: theme.palette.error.main,
  fontWeight: theme.typography.fontWeightBold,
  '&:hover': {
    backgroundColor: theme.palette.error.light,
  },
}));

const CategorySelect = ({
  label,
  options = [],
  value,
  onChange,
  className = '',
  size = 'medium',
  disabled = false,
  showClearOptions = false,
}: CategorySelectProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelect = (selectedValue: string | number) => {
    onChange(selectedValue);
    handleClose();
  };

  const handleClear = () => {
    onChange('');
    handleClose();
  };

  return (
    <div className={className}>
      {/* F */}

      {/* <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'category-select-button',
        }}
      > */}
      {options.map((option) => (
        <MenuItem
          key={option.value}
          onClick={() => handleSelect(option.value)}
          className='rounded-md'
        >
          {option.label}
        </MenuItem>
      ))}

      {showClearOptions && (
        <>
          <Divider />
          <ClearMenuItem onClick={handleClear}>
            Clear
          </ClearMenuItem>
        </>
      )}
      {/* </Menu> */}
    </div>
  );
};

export default CategorySelect;
