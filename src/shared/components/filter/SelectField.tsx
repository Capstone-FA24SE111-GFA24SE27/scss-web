import React from 'react';
import { TextField, MenuItem, styled } from '@mui/material';

export type SelectOption = {
  label: string;
  value: string | number;
}

interface SelectFieldProps {
  label: string;
  options: SelectOption[];
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
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
    backgroundColor: theme.palette.error.light, // Darker background on hover
  },
}));

const SelectField = ({
  label,
  options = [],
  value,
  onChange,
  className = '',
  size = 'medium',
  disabled = false,
  showClearOptions = false,
}: SelectFieldProps) => {
  return (
    <TextField
      select
      label={label}
      value={value}
      onChange={onChange}
      className={className}
      variant="outlined"
      disabled={disabled}
      size={size}
    >
      {options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
      {showClearOptions && (
        <ClearMenuItem key="clear" value="">
          Clear
        </ClearMenuItem>
      )}
    </TextField>
  );
};

export default SelectField;
