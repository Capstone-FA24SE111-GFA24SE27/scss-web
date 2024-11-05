import React, { useState } from 'react'
import CounselorListFilterButton from './CounselorListFilterButton'
import { Typography } from '@mui/material'
import { DateRangePicker } from '@/shared/components'
import dayjs from 'dayjs'
import { useAppDispatch, useAppSelector } from '@shared/store'
import { selectFilter, setAvailableFrom, setAvailableTo } from './counselor-list-slice'

const CounselorListSidebarContent = () => {

  const availableFrom = useAppSelector(selectFilter).availableFrom
  const availableTo = useAppSelector(selectFilter).availableTo
  const dispatch = useAppDispatch()

  const handleStartDateChange = (date: string) => {
    
    dispatch(setAvailableFrom(date))
  };
  const handleEndDateChange = (date: string) => {
    dispatch(setAvailableTo(date))
  };

  console

  return (
    <div className='p-24 flex flex-col gap-16'>
      <div className='flex justify-start items-center gap-8'>
        <CounselorListFilterButton />
        <Typography className='text-xl'>
          Filter Counselors
        </Typography>
      </div>
      <div>
        <Typography className='font-semibold text-lg mb-8'>Select available date range</Typography>
        <DateRangePicker
          className='mt-8'
          startDate={availableFrom ? dayjs(availableFrom) : null}
          endDate={availableTo ? dayjs(availableTo) : null}
          onStartDateChange={handleStartDateChange}
          onEndDateChange={handleEndDateChange}
        />
      </div>
    </div>
  )
}

export default CounselorListSidebarContent