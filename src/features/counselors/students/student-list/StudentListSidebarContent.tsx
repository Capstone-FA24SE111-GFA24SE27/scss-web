import React, { useState } from 'react'
import CounselorListFilterButton from './StudentListFilterButton'
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
      </div>
    </div>
  )
}

export default CounselorListSidebarContent