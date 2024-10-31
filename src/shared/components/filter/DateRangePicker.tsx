import React from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
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
  showClearButton?: boolean;
  className?: string;
  initialLabelShrink?: boolean; // New prop to control label shrink behavior
}

const DateRangePicker = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  labelStart = "Start Date",
  labelEnd = "End Date",
  showClearButton = false,
  className = "",
  initialLabelShrink = false, // Default to false
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
        className={className}
        label={labelStart}
        value={startDate}
        onChange={(date) => handleDateChange(date, onStartDateChange)}
        maxDate={endDate || undefined}
        slotProps={{
          actionBar: {
            actions: ['clear'],
          },
          textField: {
            fullWidth: true,
            className: className,
            ...(initialLabelShrink && {
              InputLabelProps: {
                shrink: true,
              },
            }),
          },
        }}
      />
      <DatePicker
        className={className}
        label={labelEnd}
        value={endDate}
        onChange={(date) => handleDateChange(date, onEndDateChange)}
        minDate={startDate || undefined}
        slotProps={{
          actionBar: {
            actions: ['clear'],
          },
          textField: {
            fullWidth: true,
            className: className,
            ...(initialLabelShrink && {
              InputLabelProps: {
                shrink: true,
              },
            }),
          },
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
