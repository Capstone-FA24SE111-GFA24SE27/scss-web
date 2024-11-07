import React, { useState } from 'react'
import CounselorListFilterButton from './StudentListFilterButton'
import { Typography } from '@mui/material'
import { DateRangePicker } from '@/shared/components'
import dayjs from 'dayjs'
import StudentListFilterButton from './StudentListFilterButton'

const StudentListSidebarContent = () => {

  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');


  const handleStartDateChange = (date: string) => setStartDate(date);
  const handleEndDateChange = (date: string) => setEndDate(date);

  return (
    <div className='flex flex-col gap-16 p-24'>
      <div className='flex items-center justify-start'>
        <StudentListFilterButton />
      </div>
      <div>
      </div>
    </div>
  )
}

export default StudentListSidebarContent