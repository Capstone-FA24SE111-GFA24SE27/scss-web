import React from 'react'
import { Box, Divider, Typography } from '@mui/material';
import { useState } from 'react';
import { AcademicFilter, SearchField, SelectField } from '@/shared/components';
import { useAppDispatch, useAppSelector } from '@shared/store';
import { selectFilter, setDepartmentId, setMajorId, setSearchTerm, setSpecializationId } from './recommended-list-slice';
import { Numbers } from '@mui/icons-material';
import { useGetSemestersQuery } from '@/shared/services';
import StaffStudentListFilterButton from '../StaffStudentListFilterButton';
import { filterToggle } from './recommended-list-slice';

const SidebarFilter = () => {

    const filter = useAppSelector(selectFilter)
  const dispatch = useAppDispatch()

  const handleDepartmentChange = (departmentId: string) => {
    dispatch(setDepartmentId(Number(departmentId) || ''))
  };

  const handleMajorChange = (majorId: string) => {
    dispatch(setMajorId(Number(majorId) || ''))

  };

  const handleSpecializationChange = (specializationId: string) => {
    dispatch(setSpecializationId(Number(specializationId) || ''))

  };

  const handleSearch = (searchTerm: string) => {
    dispatch(setSearchTerm(searchTerm))
  };

  const { data: semesterData, isLoading: isLoadingSemesterData } = useGetSemestersQuery();
  const semesterOptions = semesterData?.map((semester) => ({
    label: semester.name, value: semester.id
  }))

  return (
    <div className='flex flex-col gap-16 p-24'>
      <div className='flex items-center justify-start gap-8'>
        <StaffStudentListFilterButton onClick={()=>dispatch(filterToggle())} />
        <Typography className='text-xl text-text-disabled'>
          Filter students
        </Typography>
      </div>
      <div className='flex flex-col w-full gap-16'>
        <SearchField
          onSearch={handleSearch}
          label='Name'
          placeholder='John Doe'
          size='small'
        />
        <Divider />
        <Typography className='font-semibold'>Filter by acadamic details</Typography>
        <AcademicFilter
          size='small'
          onDepartmentChange={handleDepartmentChange}
          onMajorChange={handleMajorChange}
          onSpecializationChange={handleSpecializationChange}
          showClearOptions={true}
        />
        <Divider />
        {/* <Typography className='font-semibold'>Filter by GPA</Typography> */}
        {/* <Box className='flex gap-16'>
          <SearchField
            onSearch={handleSearchMinGPA}
            label='Min GPA'
            placeholder='1.0'
            type='number'
            showClearButton={false}
            startIcon={<Numbers />}
            size='small'
          />
          <SearchField
            onSearch={handleSearchMaxGPA}
            label='Max GPA'
            placeholder='9.9'
            type='number'
            showClearButton={false}
            startIcon={<Numbers />}
            size='small'
          />
          <SelectField
            label="Semester"
            options={semesterOptions}
            value={filter.semesterIdForGPA?.toString()}
            onChange={handleSelectSemester}
            showClearOptions
            className='w-400'
            size='small'
          />
        </Box> */}
      </div>
      <div>
      </div>
    </div>
  )
}

export default SidebarFilter