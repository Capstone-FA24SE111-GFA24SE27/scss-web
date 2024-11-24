import { Box, Divider, Typography, ToggleButton, ToggleButtonGroup, Slider, IconButton } from '@mui/material';
import { useState } from 'react';
import CounselorListFilterButton from './StudentListFilterButton';
import { AcademicFilter, SearchField, SelectField } from '@/shared/components';
import { useAppDispatch, useAppSelector } from '@shared/store';
import {
  selectFilter,
  setDepartmentId,
  setMajorId,
  setMaxGPA,
  setMinGPA,
  setSearchTerm,
  setSemesterIdForGPA,
  setSpecializationId,
  setTypeOfAttendanceFilter,
  setFromForAttendanceCount,
  setToForAttendanceCount,
  setFromForAttendancePercentage,
  setToForAttendancePercentage,
  setSemesterIdForAttendance,
} from './student-list-slice';
import { Numbers } from '@mui/icons-material';
import { useGetSemestersQuery } from '@/shared/services';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import PercentIcon from '@mui/icons-material/Percent';

const CounselorListSidebarContent = () => {
  const filter = useAppSelector(selectFilter);
  const dispatch = useAppDispatch();
  const [attendanceType, setAttendanceType] = useState<'COUNT' | 'PERCENTAGE'>('COUNT');

  const handleDepartmentChange = (departmentId: string) => {
    dispatch(setDepartmentId(Number(departmentId) || ''));
    if (!departmentId) {
      dispatch(setMajorId(''));
      dispatch(setSpecializationId(''));
    }
  };

  const handleMajorChange = (majorId: string) => {
    dispatch(setMajorId(Number(majorId) || ''));
    if (!majorId) {
      dispatch(setSpecializationId(''));
    }
  };

  const handleSpecializationChange = (specializationId: string) => {
    dispatch(setSpecializationId(Number(specializationId) || ''));
  };

  const handleSearch = (searchTerm: string) => {
    dispatch(setSearchTerm(searchTerm));
  };

  const handleSearchMinGPA = (searchTerm: string) => {
    dispatch(setMinGPA(Number(searchTerm)));
  };

  const handleSearchMaxGPA = (searchTerm: string) => {
    dispatch(setMaxGPA(Number(searchTerm)));
  };

  const handleSelectSemester = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSemesterIdForGPA(Number(event.target.value)));
  };

  const handleAttendanceTypeChange = (_: any, newType: 'COUNT' | 'PERCENTAGE') => {
    if (newType) {
      setAttendanceType(newType);
      dispatch(setTypeOfAttendanceFilter(newType));
    }
  };

  const handleAttendanceCountChange = (field: 'fromForAttendanceCount' | 'toForAttendanceCount', value: string) => {
    if (field === 'fromForAttendanceCount') {
      dispatch(setFromForAttendanceCount(Number(value) || ''));
    } else {
      dispatch(setToForAttendanceCount(Number(value) || ''));
    }
  };

  const handleAttendancePercentageChange = (field: 'fromForAttendancePercentage' | 'toForAttendancePercentage', value: number | number[]) => {
    if (field === 'fromForAttendancePercentage') {
      dispatch(setFromForAttendancePercentage(value as number));
    } else {
      dispatch(setToForAttendancePercentage(value as number));
    }
  };

  const handleSemesterAttendanceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSemesterIdForAttendance(Number(event.target.value)));
  };

  const { data: semesterData, isLoading: isLoadingSemesterData } = useGetSemestersQuery();
  const semesterOptions = semesterData?.map((semester) => ({
    label: semester.name,
    value: semester.id,
  }));

  return (
    <div className="p-24 flex flex-col gap-16">
      <div className="flex justify-start items-center gap-8">
        <CounselorListFilterButton />
        <Typography className="text-xl text-text-disabled">Filter students</Typography>
      </div>
      <div className="w-full flex flex-col gap-16">
        <SearchField
          onSearch={handleSearch}
          label="Name"
          placeholder="John Doe"
          size="small"
        />
        <Divider />
        <Typography className="font-semibold">Filter by academic details</Typography>
        <AcademicFilter
          size="small"
          onDepartmentChange={handleDepartmentChange}
          onMajorChange={handleMajorChange}
          onSpecializationChange={handleSpecializationChange}
          showClearOptions={true}
        />
        <Divider />
        <Typography className="font-semibold">Filter by GPA</Typography>
        <Box className="flex gap-16">
          <SearchField
            onSearch={handleSearchMinGPA}
            label="Min GPA"
            placeholder="1.0"
            type="number"
            showClearButton={false}
            startIcon={<Numbers />}
            size="small"
          />
          <SearchField
            onSearch={handleSearchMaxGPA}
            label="Max GPA"
            placeholder="9.9"
            type="number"
            showClearButton={false}
            startIcon={<Numbers />}
            size="small"
          />
          <SelectField
            label="Semester"
            options={semesterOptions}
            value={filter.semesterIdForGPA?.toString()}
            onChange={handleSelectSemester}
            showClearOptions
            className="w-400"
            size="small"
          />
        </Box>
        <Divider />
        <Typography className="font-semibold">Filter by attendance</Typography>
        <Box className="flex gap-16 items-center">
          <ToggleButtonGroup
            value={attendanceType}
            exclusive
            onChange={handleAttendanceTypeChange}
            aria-label="Attendance Type"
            size='small'
          >
            <ToggleButton value="COUNT" aria-label="Count">
              <FilterAltIcon /> Count
            </ToggleButton>
            <ToggleButton value="PERCENTAGE" aria-label="Percentage">
              <PercentIcon /> Percentage
            </ToggleButton>
          </ToggleButtonGroup>
          <SelectField
            label="Semester"
            options={semesterOptions}
            value={filter.semesterIdForAttendance?.toString()}
            onChange={handleSemesterAttendanceChange}
            showClearOptions
            className="w-400"
            size="small"
          />
        </Box>
        {attendanceType === 'COUNT' && (
          <Box className="flex gap-16">
            <SearchField
              onSearch={(value) => handleAttendanceCountChange('fromForAttendanceCount', value)}
              label="From (Count)"
              placeholder="0"
              type="number"
              showClearButton={false}
              size="small"
              startIcon={<Numbers />}
            />
            <SearchField
              onSearch={(value) => handleAttendanceCountChange('toForAttendanceCount', value)}
              label="To (Count)"
              placeholder="100"
              type="number"
              showClearButton={false}
              size="small"
              startIcon={<Numbers />}
            />
          </Box>
        )}
        {attendanceType === 'PERCENTAGE' && (
          <Box className="flex flex-col gap-16">
            <Slider
              valueLabelDisplay="auto"
              min={0}
              max={100}
              value={filter.fromForAttendancePercentage || 0}
              onChange={(_, value) =>
                handleAttendancePercentageChange('fromForAttendancePercentage', value)
              }
              aria-labelledby="From Percentage"
            />
            <Slider
              valueLabelDisplay="auto"
              min={0}
              max={100}
              value={filter.toForAttendancePercentage || 100}
              onChange={(_, value) =>
                handleAttendancePercentageChange('toForAttendancePercentage', value)
              }
              aria-labelledby="To Percentage"
            />
          </Box>
        )}
      </div>
      <div></div>
    </div>
  );
};

export default CounselorListSidebarContent;
