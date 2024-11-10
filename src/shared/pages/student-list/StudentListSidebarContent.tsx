import { Box, Divider, Typography } from '@mui/material';
import { useState } from 'react';
import CounselorListFilterButton from './StudentListFilterButton';
import { AcademicFilter, SearchField, SelectField } from '@/shared/components';
import { useAppDispatch, useAppSelector } from '@shared/store';
import { selectFilter, selectSearchTerm, setDepartmentId, setMajorId, setMaxGPA, setMinGPA, setSearchTerm, setSemesterIdForGPA, setSpecializationId } from './student-list-slice';
import { Numbers } from '@mui/icons-material';
import { useGetSemestersQuery } from '@/shared/services';

const CounselorListSidebarContent = () => {

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

  const handleSearchMinGPA = (searchTerm: string) => {
    dispatch(setMinGPA(Number(searchTerm)))
  };

  const handleSearchMaxGPA = (searchTerm: string) => {
    dispatch(setMaxGPA(Number(searchTerm)))
  };

  const handleSelectSemester = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSemesterIdForGPA(Number(event.target.value)))
  };

  const { data: semesterData, isLoading: isLoadingSemesterData } = useGetSemestersQuery();
  const semesterOptions = semesterData?.map((semester) => ({
    label: semester.name, value: semester.id
  }))

  // const semesterOptions = [
  //   { label: '1', value: '1' },
  //   { label: '2', value: '2' },
  //   { label: '3', value: '3' },
  //   { label: '4', value: '4' },
  //   { label: '5', value: '5' },
  //   { label: '6', value: '6' },
  //   { label: '7', value: '7' },
  //   { label: '8', value: '8' },
  //   { label: '9', value: '9' },
  // ];

  return (
    <div className='p-24 flex flex-col gap-16'>
      <div className='flex justify-start items-center gap-8'>
        <CounselorListFilterButton />
        <Typography className='text-xl text-text-disabled'>
          Filter students
        </Typography>
      </div>
      <div className='w-full flex flex-col gap-16'>
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
        <Typography className='font-semibold'>Filter by GPA</Typography>
        <Box className='flex gap-16'>
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
        </Box>
      </div>
      <div>
      </div>
    </div>
  )
}

export default CounselorListSidebarContent