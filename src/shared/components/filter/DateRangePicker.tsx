import React from 'react';
import { Box, TextField, Button, IconButton, Tooltip } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { FilterAltOff } from '@mui/icons-material';

interface DateRangePickerProps {
  startDate: Dayjs | null;
  endDate: Dayjs | null;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  labelStart?: string;
  labelEnd?: string;
  showClearButton?: boolean; // New prop to control clear button visibility
}

const DateRangePicker = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  labelStart = "Start Date",
  labelEnd = "End Date",
  showClearButton = false,
}: DateRangePickerProps) => {
  const handleDateChange = (date: Dayjs | null, callback: (formattedDate: string) => void) => {
    const formattedDate = date ? date.format('YYYY-MM-DD') : '';
    callback(formattedDate);
  };

  const handleClearFilter = () => {
    onStartDateChange('');
    onEndDateChange('');
  };

  return (
    <Box display="flex" gap={2} alignItems="center">
      <DatePicker
        label={labelStart}
        value={startDate}
        onChange={(date) => handleDateChange(date, onStartDateChange)}
        maxDate={endDate || undefined}
        slotProps={{
          actionBar: {
            actions: ['clear'],
          },
          textField:{
            fullWidth: true,
          }
        }}
      />
      <DatePicker
        label={labelEnd}
        value={endDate}
        onChange={(date) => handleDateChange(date, onEndDateChange)}
        minDate={startDate || undefined}
        slotProps={{
          actionBar: {
            actions: ['clear'],
          },
          textField:{
            fullWidth: true,
          }
        }}
      />
      {showClearButton && (
        <Tooltip title="Clear date range filter">
          <IconButton onClick={handleClearFilter}>
            <FilterAltOff />
          </IconButton>
        </Tooltip>

      )}
    </Box>
  );
};

export default DateRangePicker;
