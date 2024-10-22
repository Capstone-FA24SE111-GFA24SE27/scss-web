import React from 'react';
import { Checkbox, FormControlLabel } from '@mui/material';

interface CheckboxFieldProps {
  label: string;
  checked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

const CheckboxField = ({
  label,
  checked,
  onChange,
  className
}: CheckboxFieldProps) => {
  return (
    <FormControlLabel
      control={
        <Checkbox
          checked={checked}
          onChange={onChange}
          className={className}
        />
      }
      label={label}
    />
  );
};

export default CheckboxField;
