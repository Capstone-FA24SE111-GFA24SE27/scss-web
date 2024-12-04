import React, { useState } from 'react'
import CounselorListFilterButton from './CounselorListFilterButton'
import { Box, Rating, Slider, Typography } from '@mui/material'
import { AcademicFilter, DateRangePicker, SelectField } from '@/shared/components'
import dayjs from 'dayjs'
import { useAppDispatch, useAppSelector } from '@shared/store'
import { selectCounselorType, selectFilter, setAvailableFrom, setAvailableTo, setDepartmentId, setExpertiseId, setMajorId, setRatingFrom, setRatingTo, setSpecializationId } from './counselor-list-slice'
import { useGetCounselorExpertisesQuery, useGetNonAcademicTopicsQuery } from '@/shared/services'

const CounselorListSidebarContent = () => {
  const counselingType = useAppSelector(selectCounselorType)
  const availableFrom = useAppSelector(selectFilter).availableFrom
  const availableTo = useAppSelector(selectFilter).availableTo
  const filter = useAppSelector(selectFilter)
  const dispatch = useAppDispatch()

  const { data: expertisesData, isLoading: isLoadingExpertise } = useGetCounselorExpertisesQuery()
  const expertises = expertisesData?.content
  const expertiseOptions = expertises?.map((expertise) => ({ value: expertise.id, label: expertise.name }))

  const handleStartDateChange = (date: string) => {
    dispatch(setAvailableFrom(date || undefined))
  };
  const handleEndDateChange = (date: string) => {
    dispatch(setAvailableTo(date || undefined))
  };

  const handleDepartmentChange = (departmentId: string) => {
    dispatch(setDepartmentId(Number(departmentId) || undefined))
    if (!departmentId) {
      dispatch(setMajorId(undefined))
      dispatch(setSpecializationId(undefined))
    }
  };

  const handleMajorChange = (majorId: string) => {
    dispatch(setMajorId(Number(majorId) || undefined))
    if (!majorId) {
      dispatch(setSpecializationId(undefined))
    }
  };

  const handleSpecializationChange = (specializationId: string) => {
    dispatch(setSpecializationId(Number(specializationId) || undefined))
  };

  const handleExpertiseChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setExpertiseId(Number(event.target.value)))
  };

  const handleRatingChange = (value: number | number[]) => {
    if (Array.isArray(value)) {
      dispatch(setRatingFrom(value[0])); // Update ratingFrom
    }
  };

  const handleRatingFromChange = (valueFrom: number | null) => {
    dispatch(setRatingFrom(valueFrom || undefined));
    dispatch(setRatingTo(valueFrom ? 5 : undefined));
  };




  return (
    <div className='p-24 flex flex-col gap-16'>
      <div className='flex justify-start items-center gap-16'>
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
      <div>
        <Typography className='font-semibold text-lg mb-8'>Select {counselingType === 'ACADEMIC' ? 'specialization' : 'expertise'}</Typography>
        {
          counselingType === 'ACADEMIC'
            ? <AcademicFilter
              className='mt-8'

              onDepartmentChange={handleDepartmentChange}
              onMajorChange={handleMajorChange}
              onSpecializationChange={handleSpecializationChange}
              showClearOptions={true}
            />
            : <SelectField
              className='mt-8 w-full'
              label="Expertise"
              options={expertiseOptions}
              value={filter.expertiseId?.toString()}
              onChange={handleExpertiseChange}
              showClearOptions
            />
        }

      </div>
      <div>
        <Typography className="font-semibold text-lg mb-8">Filter by Rating</Typography>
        <Box className="flex flex-col gap-8">
          {/* Rating From */}
          <Box className="flex gap-16 items-center  ">
            <Typography className='text-lg text-text-secondary'>From</Typography>
            <Rating
              size='medium'
              name="rating-from"
              value={filter.ratingFrom || null}
              onChange={(_, value) => handleRatingFromChange(value)}
            />
            <Typography className='text-lg text-text-secondary'>and up</Typography>
          </Box>
        </Box>
      </div>
    </div >
  )
}

export default CounselorListSidebarContent