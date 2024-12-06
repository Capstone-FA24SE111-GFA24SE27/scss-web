import React, { ChangeEvent, useCallback, useState, ReactNode } from 'react';
import { TextField, InputAdornment, IconButton, Paper, Input, Button } from '@mui/material';
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
  startIcon?: ReactNode; // Optional prop to replace the default Search icon
  disabled?: boolean; // Optional prop to disable the search field
  type?: 'text' | 'number' | 'search' | 'password'; // Added type prop
  showClearButton?: boolean; // New prop to toggle the clear button
}

const SearchField = ({
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
    <TextField
      label={label}
      placeholder={placeholder}
      value={searchTerm}
      className={clsx("flex w-full", className)}
      variant="outlined"
      type={type} // Pass the type prop to TextField
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              {startIcon}
            </InputAdornment>
          ),
          endAdornment: showClearButton ? (
            <InputAdornment position="end">
              <IconButton onClick={handleClear} aria-label="clear search" disabled={disabled}>
                <Clear />
              </IconButton>
            </InputAdornment>
          ) : null, // Conditionally render endAdornment based on showClearButton
        },
      }}
      onChange={handleSearch}
      size={size}
      disabled={disabled} // Apply disabled prop to TextField
    />
  );
};


export default SearchField;


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
// const ContentSearch = () => {
//   return (
//     <div className='w-full p-32 max-w-xl mx-auto'>
//       <Paper className="flex items-center gap-16 p-16 py-8 rounded-full shadow-none border-1">
//         <Input
//           startAdornment={
//             <Search />
//           }
//           placeholder="Search"
//           className="flex flex-1 gap-8 px-8"
//           disableUnderline
//           fullWidth
//           inputProps={{
//             'aria-label': 'Search'
//           }}
//         />
//       </Paper>
//     </div>
//   )
// }