import React, { useState } from 'react'
import { IconButton, Typography } from '@mui/material'
import { DateRangePicker, NavLinkAdapter } from '@/shared/components'
import dayjs from 'dayjs'
import { Close } from '@mui/icons-material'
import { Outlet } from 'react-router-dom'

const StudentDemandsSidebarContent = () => {

  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');


  const handleStartDateChange = (date: string) => setStartDate(date);
  const handleEndDateChange = (date: string) => setEndDate(date);

  return (
    <div className="flex flex-col flex-auto max-w-full w-fit">
      <IconButton
        className="absolute top-0 right-0 my-16 mx-32 z-10"
        component={NavLinkAdapter}
        to="."
        size="large"
      >
        <Close />
      </IconButton>

      <Outlet />
    </div>
  )
}

export default StudentDemandsSidebarContent