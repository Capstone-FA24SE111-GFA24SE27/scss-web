import { MenuItem, Select, SelectChangeEvent } from '@mui/material'
import React, { useState } from 'react'

type PeriodFilterProps = {
  period: string,
  onPeriodChange: (event: SelectChangeEvent) => void;
  shouldShowMonthOnly?: boolean;
}
const PeriodFilter = ({
  period,
  onPeriodChange,
  shouldShowMonthOnly
}: PeriodFilterProps) => {
  return (
    <Select
      size='small'
      className='font-semibold'
      onChange={onPeriodChange}
      value={period}
    >
      <MenuItem value="month">This month</MenuItem>
      {!shouldShowMonthOnly && <MenuItem value="week">Last 7 days</MenuItem>}
      {!shouldShowMonthOnly && <MenuItem value="day">Today</MenuItem>}
    </Select>
  )
}

export default PeriodFilter