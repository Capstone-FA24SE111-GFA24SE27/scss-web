import React, { useState } from 'react'
import CounselorListFilterButton from './CounselorListFilterButton'
import { Typography } from '@mui/material'
import { AcademicFilter, DateRangePicker, SelectField } from '@/shared/components'
import dayjs from 'dayjs'
import { useAppDispatch, useAppSelector } from '@shared/store'
import { selectCounselorType, selectFilter, setAvailableFrom, setAvailableTo, setDepartmentId, setExpertiseId, setMajorId, setSpecializationId } from './counselor-list-slice'
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

    dispatch(setAvailableFrom(date))
  };
  const handleEndDateChange = (date: string) => {
    dispatch(setAvailableTo(date))
  };

  const handleDepartmentChange = (departmentId: string) => {
    dispatch(setDepartmentId(Number(departmentId) || ''))
    if (!departmentId) {
      dispatch(setMajorId(''))
      dispatch(setSpecializationId(''))
    }
  };

  const handleMajorChange = (majorId: string) => {
    dispatch(setMajorId(Number(majorId) || ''))
    if (!majorId) {
      dispatch(setSpecializationId(''))
    }
  };

  const handleSpecializationChange = (specializationId: string) => {
    dispatch(setSpecializationId(Number(specializationId) || ''))
  };

  const handleExpertiseChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setExpertiseId(Number(event.target.value)))
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
              value={filter.expertiseId.toString()}
              onChange={handleExpertiseChange}
              showClearOptions
            />
        }

      </div>
    </div>
  )
}

export default CounselorListSidebarContent