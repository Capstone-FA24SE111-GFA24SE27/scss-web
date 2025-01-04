import React, { useState } from 'react'
import CounselorListFilterButton from './CounselorListFilterButton'
import { Box, IconButton, Rating, Slider, Tooltip, Typography } from '@mui/material'
import { AcademicFilter, DateRangePicker, SearchField, SelectField } from '@/shared/components'
import dayjs from 'dayjs'
import { useAppDispatch, useAppSelector } from '@shared/store'
import { selectCounselorType, selectFilter, setAvailableFrom, setAvailableTo, setDepartmentId, setExpertiseId, setGender, setMajorId, setRatingFrom, setRatingTo, setSearchTerm, setSpecializationId } from './counselor-list-slice'
import { useGetCounselorExpertisesQuery, useGetNonAcademicTopicsQuery } from '@/shared/services'
import { Close, Female, Male } from '@mui/icons-material'

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
    dispatch(setExpertiseId(Number(event.target.value) || undefined))
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


  const handleSearch = (searchTerm: string) => {
    dispatch(setSearchTerm(searchTerm))
  }


  return (
    <div className='flex flex-col gap-16'>
      <div className='flex justify-start items-center gap-16'>
        <CounselorListFilterButton />
        <Typography className='text-xl'>
          Filter Counselors
        </Typography>
      </div>
      <div>
        <Typography className='font-semibold text-lg'>Search counselor by name</Typography>
        <SearchField
          onSearch={handleSearch}
          className='mt-8'
        />
      </div>
      <div>
        <Typography className='font-semibold text-lg'>Select available date range</Typography>
        <DateRangePicker
          className='mt-8'
          startDate={availableFrom ? dayjs(availableFrom) : null}
          endDate={availableTo ? dayjs(availableTo) : null}
          onStartDateChange={handleStartDateChange}
          onEndDateChange={handleEndDateChange}
        />
      </div>
      <div>
        <Typography className='font-semibold text-lg'>Select {counselingType === 'ACADEMIC' ? 'specialization' : 'expertise'}</Typography>
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
      {/* <div>
        <Typography className="font-semibold text-lg">Filter by rating</Typography>
        <Box className="flex flex-col gap-8">
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
      </div> */}
      <div className='mt-8'>
        <Typography className="font-semibold text-lg">Select by gender</Typography>
        <div className="flex items-center gap-8">
          {/* Male Icon */}
          <Tooltip title="Male">
            <IconButton
              size='small'
              onClick={() => {
                dispatch(setGender('MALE'));
                // field.onChange('MALE');
              }}
              sx={{
                border: filter.gender === 'MALE' ? '2px solid #1976d2' : 'none',
                borderRadius: '50%', // Keep the border round
              }}
            >
              <Male className="text-blue-500" fontSize="large" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Female">
            <IconButton
              size='small'
              onClick={() => {
                dispatch(setGender('FEMALE'));
                // field.onChange('FEMALE');
              }}
              sx={{
                border: filter.gender === 'FEMALE' ? '2px solid #d32f2f' : 'none',
                borderRadius: '50%',
              }}
            >
              <Female className="text-pink-500" fontSize="large" />
            </IconButton>
          </Tooltip>

          <div className='flex justify-end flex-1'>
            {
              filter.gender &&
              <Tooltip title="Clear gender selection">
                <IconButton
                  size='small'
                  onClick={() => {
                    dispatch(setGender(''));
                    // field.onChange(''); 
                  }}
                  sx={{
                    borderRadius: '50%',
                  }}
                >
                  <Close /> {/* X Icon for Clear */}
                </IconButton>
              </Tooltip>
            }
          </div>
        </div>
      </div>
    </div >
  )
}

export default CounselorListSidebarContent