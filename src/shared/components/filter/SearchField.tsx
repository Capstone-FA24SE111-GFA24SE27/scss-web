import React, { ChangeEvent, useCallback } from 'react';
import { TextField, InputAdornment } from '@mui/material';
import { Search } from '@mui/icons-material';
import { debounce } from 'lodash';
import clsx from 'clsx';


interface SearchFieldProps {
  label?: string;
  placeholder?: string;
  debounceDelay?: number;
  className?: string;
  onSearch: (searchTerm: string) => void;
  size?: 'small' | 'medium'
}

const SearchField = ({
  label = 'Search',
  placeholder = 'Enter a keyword...',
  debounceDelay = 500,
  className = '',
  size ='medium',
  onSearch
}: SearchFieldProps) => {
  // Debounce the search input
  const debounceSearch = useCallback(
    debounce((debouncedSearchTerm: string) => {
      onSearch(debouncedSearchTerm);
    }, debounceDelay),
    [onSearch, debounceDelay]
  );

  const handleSearch = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    debounceSearch(event.target.value);
  };

  return (
    <TextField
      label={label}
      placeholder={placeholder}
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
          )
        }
      }}
      onChange={handleSearch}
      size={size}
    />
  );
};

export default SearchField;