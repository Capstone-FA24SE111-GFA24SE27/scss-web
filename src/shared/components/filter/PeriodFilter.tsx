import { MenuItem, Select, SelectChangeEvent } from '@mui/material'
import React, { useState } from 'react'

type PeriodFilterProps = {
  period: string,
  onPeriodChange: (event: SelectChangeEvent) => void;
}
const PeriodFilter = ({
  period,
  onPeriodChange
}: PeriodFilterProps) => {
  return (
    <Select
      size='small'
      className='font-semibold'
      onChange={onPeriodChange}
      value={period}
    >
      <MenuItem value="month">This month</MenuItem>
      <MenuItem value="week">Last 7 days</MenuItem>
      <MenuItem value="day">Today</MenuItem>
    </Select>
  )
}

export default PeriodFilter