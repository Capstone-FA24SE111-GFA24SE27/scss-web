import React from 'react';
import { TextField, MenuItem } from '@mui/material';

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
  size?: 'small' | 'medium',
  disabled?: boolean;
}

const SelectField = ({
  label,
  options = [],
  value,
  onChange,
  className = '',
  size = 'medium',
  disabled = false
}: SelectFieldProps) => {
  return (
    <TextField
      select
      label={label}
      value={value}
      onChange={onChange}
      className={className}
      slotProps={{
        inputLabel: {
          shrink: true,
        }
      }}
      variant="outlined"
      disabled={disabled}
      size={size}
    >
      {options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  );
};

export default SelectField;