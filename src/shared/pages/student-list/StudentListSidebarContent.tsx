import { Box, Divider, Typography, ToggleButton, ToggleButtonGroup, Slider, IconButton, TextField } from '@mui/material';
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
  setMinSubjectForAttendance,
} from './student-list-slice';
import { Numbers } from '@mui/icons-material';
import { useGetSemestersQuery } from '@/shared/services';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import PercentIcon from '@mui/icons-material/Percent';
import { debounce } from 'lodash';

const CounselorListSidebarContent = ({ shouldShowToggleButton = true }: { shouldShowToggleButton?: boolean }) => {
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
    dispatch(setSemesterIdForGPA(Number(event.target.value) || ''));
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

  const handleMinSubjectForAttendanceChange = (value: string) => {
    if (Number(value) < 0 || Number(value) > 30) {
      return
    }
    dispatch(setMinSubjectForAttendance(Number(value) || ''));
  };

  const { data: semesterData, isLoading: isLoadingSemesterData } = useGetSemestersQuery();
  const semesterOptions = semesterData?.map((semester) => ({
    label: semester.name,
    value: semester.id,
  }));

  return (
    <div className="flex flex-col gap-8">
      {
        shouldShowToggleButton && (
            <div className="flex justify-start items-center gap-8">
            <CounselorListFilterButton />
            {/* <Typography className="text-xl text-text-disabled">Filter students</Typography> */}
          </div>
        )
      }
      <div className="w-full flex flex-col gap-16">
        <Typography className="font-semibold">Search by name</Typography>
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
        <Typography className="font-semibold">Filter by average grade</Typography>
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
            className=''
          >
            <ToggleButton value="COUNT" aria-label="Count" className='w-144'>
              <FilterAltIcon /> Count
            </ToggleButton>
            <ToggleButton value="PERCENTAGE" aria-label="Percentage" className='w-144'>
              <PercentIcon /> Percentage
            </ToggleButton>
          </ToggleButtonGroup>

        </Box>
        <div className='flex gap-16 w-full'>
          <Box className="flex items-center gap-16 w-full flex-1">
            <TextField
              fullWidth
              type="number"
              label="Min Subjects for Attendance"
              placeholder="0 - 30"
              size="small"
              value={filter.minSubjectForAttendance || ''}
              onChange={(e) => handleMinSubjectForAttendanceChange(e.target.value)}
              slotProps={{
                inputLabel: {
                  shrink: true,
                }
              }}
            />
          </Box>
          <Box className="flex items-center gap-16 w-full flex-1">
            <SelectField
              label="Semester"
              options={semesterOptions}
              value={filter.semesterIdForAttendance?.toString()}
              onChange={handleSemesterAttendanceChange}
              showClearOptions
              className="min-w-full"
              size="small"
            />
          </Box>
        </div>

        {attendanceType === 'COUNT' && (
          <Box className="flex gap-16">
            {/* From (Count) Field */}
            <TextField
              label="From (Count)"
              placeholder="0"
              type="number"
              size="small"
              value={filter.fromForAttendanceCount || ''}
              onChange={(e) => {
                const fromValue = Number(e.target.value) || 0;
                const toValue = filter.toForAttendanceCount || 1;
                // Ensure `fromForAttendanceCount` is less than or equal to `toForAttendanceCount`
                if (fromValue >= toValue) {
                  dispatch(setToForAttendanceCount(fromValue + 1));
                }
                dispatch(setFromForAttendanceCount(fromValue));
              }}
              InputProps={{
                startAdornment: <Numbers />,
              }}
              disabled={!filter.semesterIdForAttendance}

            />
            {/* To (Count) Field */}
            <TextField
              label="To (Count)"
              placeholder="100"
              type="number"
              size="small"
              value={filter.toForAttendanceCount || ''}
              onChange={(e) => {
                const toValue = Number(e.target.value) || 1;
                const fromValue = filter.fromForAttendanceCount || 0;
                // Ensure `toForAttendanceCount` is greater than or equal to `fromForAttendanceCount`
                if (toValue <= fromValue) {
                  dispatch(setFromForAttendanceCount(toValue - 1));
                }
                dispatch(setToForAttendanceCount(toValue));
              }}
              InputProps={{
                startAdornment: <Numbers />,
              }}
              disabled={!filter.semesterIdForAttendance}

            />
          </Box>
        )}
        {attendanceType === 'PERCENTAGE' && (
          <Box className="flex flex-col gap-16">
            {/* Slider for "From Percentage" */}
            <Box className="flex gap-8 items-center">
              <Typography variant="subtitle2" className='w-96'>
                From (%)
              </Typography>
              <Slider
                valueLabelDisplay="on"
                min={0}
                max={100}
                value={filter.fromForAttendancePercentage || 0}
                onChangeCommitted={((_, value) => {
                  const newValue = Math.min(value as number, filter.toForAttendancePercentage || 100 - 1);
                  handleAttendancePercentageChange('fromForAttendancePercentage', newValue);
                })}
                aria-labelledby="From Percentage"
                disabled={!filter.semesterIdForAttendance}

              />
            </Box>

            <Box className="flex gap-8 items-center">
              <Typography variant="subtitle2" className='w-96'>
                To (%)
              </Typography>
              <Slider
                valueLabelDisplay="on"
                min={0}
                max={100}
                value={filter.toForAttendancePercentage || 100}
                onChangeCommitted={(_, value) => {
                  const newValue = Math.max(value as number, filter.fromForAttendancePercentage || 0 + 1);
                  handleAttendancePercentageChange('toForAttendancePercentage', newValue);
                }}
                aria-labelledby="To Percentage"
                disabled={!filter.semesterIdForAttendance}

              />
            </Box>

          </Box>
        )}
      </div>
      <div></div>
    </div>
  );
};

export default CounselorListSidebarContent;
