import React, { ChangeEvent, useCallback, useState } from 'react';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import { Search, Clear } from '@mui/icons-material';
import { debounce } from 'lodash';
import clsx from 'clsx';

interface SearchFieldProps {
  label?: string;
  placeholder?: string;
  debounceDelay?: number;
  className?: string;
  onSearch: (searchTerm: string) => void;
  size?: 'small' | 'medium';
}

const SearchField = ({
  label = 'Search',
  placeholder = 'Enter a keyword...',
  debounceDelay = 500,
  className = '',
  size = 'medium',
  onSearch
}: SearchFieldProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Debounce the search input
  const debounceSearch = useCallback(
    debounce((debouncedSearchTerm: string) => {
      onSearch(debouncedSearchTerm);
    }, debounceDelay),
    [onSearch, debounceDelay]
  );

  const handleSearch = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const value = event.target.value;
    setSearchTerm(value);
    debounceSearch(value);
  };

  const handleClear = (): void => {
    setSearchTerm(''); // Clear the input value
    onSearch(''); // Notify parent component with empty search term
  };

  return (
    <TextField
      label={label}
      placeholder={placeholder}
      value={searchTerm}
      className={clsx("flex w-full", className)}
      variant="outlined"
      slotProps={{
        inputLabel: {
          shrink: true,
        },
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={handleClear} aria-label="clear search">
                <Clear />
              </IconButton>
            </InputAdornment>
          )
        }
      }}
      onChange={handleSearch}
      size={size}
    />
  );
};

export default SearchField;
