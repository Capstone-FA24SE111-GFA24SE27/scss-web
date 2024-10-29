import React, { useState } from 'react'
import CounselorListFilterButton from './CounselorListFilterButton'
import { Typography } from '@mui/material'
import { DateRangePicker } from '@/shared/components'
import dayjs from 'dayjs'

const CounselorListSidebarContent = () => {

  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');


  const handleStartDateChange = (date: string) => setStartDate(date);
  const handleEndDateChange = (date: string) => setEndDate(date);

  return (
    <div className='p-24 flex flex-col gap-16'>
      <div className='flex justify-start items-center'>
        <CounselorListFilterButton />
      </div>
      <div>
        <Typography className='font-semibold text-lg mb-8'>Select available date range</Typography>
        <DateRangePicker
          startDate={startDate ? dayjs(startDate) : null}
          endDate={endDate ? dayjs(endDate) : null}
          onStartDateChange={handleStartDateChange}
          onEndDateChange={handleEndDateChange}
        />
      </div>
    </div>
  )
}

export default CounselorListSidebarContent