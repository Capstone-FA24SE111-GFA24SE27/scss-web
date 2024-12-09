import { Clear, Search } from '@mui/icons-material';
import { Button, Input, Paper } from '@mui/material';
import clsx from 'clsx';
import { debounce } from 'lodash';
import { ChangeEvent, ReactNode, useCallback, useState } from 'react';

interface SearchFieldProps {
  label?: string;
  placeholder?: string;
  debounceDelay?: number;
  className?: string;
  onSearch: (searchTerm: string) => void;
  size?: 'small' | 'medium';
  startIcon?: ReactNode; // Optional prop to replace the default Search icon
  disabled?: boolean; // Optional prop to disable the search field
  type?: 'text' | 'number' | 'search' | 'password'; // Added type prop
  showClearButton?: boolean; // New prop to toggle the clear button
}

export const ContentSearch = ({
  label = 'Search',
  placeholder = 'Enter a keyword...',
  debounceDelay = 500,
  className = '',
  size = 'medium',
  onSearch,
  startIcon = <Search />,
  disabled = false, // Default to false (enabled)
  type = 'text', // Default type to text
  showClearButton = true, // Default to showing the clear button
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
    <Paper
      className={clsx("flex items-center gap-16 p-16 py-8 rounded-full shadow-none border-1", className)}
    >
      <Input
        startAdornment={
          <Search />
        }
        endAdornment={
          showClearButton ?
            <Button onClick={handleClear} >
              <Clear />
            </Button>
            : null
        }
        disableUnderline
        fullWidth
        inputProps={{
          'aria-label': 'Search'
        }}

        placeholder={placeholder}
        value={searchTerm}
        className={"flex w-full text-lg gap-8 pl-8"}
        type={type} // Pass the type prop to TextField
        onChange={handleSearch}
        size={size}
        disabled={disabled} // Apply disabled prop to TextField
      />
    </Paper>
  );
};
export default ContentSearch;
