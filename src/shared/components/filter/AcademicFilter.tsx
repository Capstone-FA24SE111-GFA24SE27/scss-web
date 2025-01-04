import React, { useState } from 'react';
import { TextField, MenuItem, styled, CircularProgress } from '@mui/material';
import {
  useGetDepartmentsQuery,
  useGetMajorsByDepartmentQuery,
  useGetSpecializationsByMajorQuery,
} from '@shared/services';

export type SelectOption = {
  label: string;
  value: string | number;
};

interface AcademicFilterProps {
  onDepartmentChange: (departmentId: string) => void;
  onMajorChange: (majorId: string) => void;
  onSpecializationChange: (specializationId: string) => void;
  className?: string;
  size?: 'small' | 'medium';
  disabled?: boolean;
  showClearOptions?: boolean;
  initialDeparment?: string;
  initialMajor?: string;
  initialSpecialization?: string;
}

// Custom styled component for the "Clear" option
const ClearMenuItem = styled(MenuItem)(({ theme }) => ({
  color: theme.palette.error.main,
  fontWeight: theme.typography.fontWeightBold,
  '&:hover': {
    backgroundColor: theme.palette.error.light, // Darker background on hover
  },
}));

const AcademicFilter = ({
  onDepartmentChange,
  onMajorChange,
  onSpecializationChange,
  className = '',
  size = 'medium',
  disabled = false,
  showClearOptions = false,
  initialDeparment = '',
  initialMajor = '',
  initialSpecialization= '',
}: AcademicFilterProps) => {
  const [selectedDepartment, setSelectedDepartment] = useState<string>(initialDeparment);
  const [selectedMajor, setSelectedMajor] = useState<string>(initialMajor);
  const [selectedSpecialization, setSelectedSpecialization] = useState<string>(initialSpecialization);

  // Fetch departments
  const { data: departments, isLoading: loadingDepartments } = useGetDepartmentsQuery();
  // Fetch majors based on selected department
  const { data: majors, isLoading: loadingMajors } = useGetMajorsByDepartmentQuery(selectedDepartment, {
    skip: !selectedDepartment,
  });
  // Fetch specializations based on selected major
  const { data: specializations, isLoading: loadingSpecializations } = useGetSpecializationsByMajorQuery(selectedMajor, {
    skip: !selectedMajor,
  });

  const handleDepartmentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const departmentId = event.target.value;
    setSelectedDepartment(departmentId);
    setSelectedMajor(''); // Reset major and specialization when department changes
    setSelectedSpecialization('');
    onDepartmentChange(departmentId);
  };

  const handleMajorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const majorId = event.target.value;
    setSelectedMajor(majorId);
    setSelectedSpecialization(''); // Reset specialization when major changes
    onMajorChange(majorId);
  };

  const handleSpecializationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const specializationId = event.target.value;
    setSelectedSpecialization(specializationId);
    onSpecializationChange(specializationId);
  };

  return (
    <div className={className}>
      {/* Department Select */}
      <TextField
        select
        label="Department"
        value={selectedDepartment}
        onChange={handleDepartmentChange}
        variant="outlined"
        disabled={disabled || loadingDepartments}
        size={size}
        fullWidth
      >
        {loadingDepartments ? (
          <MenuItem disabled>
            <CircularProgress size={24} />
          </MenuItem>
        ) : (
          departments?.map((department) => (
            <MenuItem key={department.id} value={department.id}>
              {department.name}
            </MenuItem>
          ))
        )}
        {showClearOptions && selectedDepartment && (
          <ClearMenuItem key="clear-department" value="">
            Clear
          </ClearMenuItem>
        )}
      </TextField>

      {/* Major Select */}
      <TextField
        select
        label="Major"
        value={selectedMajor}
        onChange={handleMajorChange}
        variant="outlined"
        disabled={disabled || !selectedDepartment || loadingMajors}
        size={size}
        fullWidth
        style={{ marginTop: 16 }}
      >
        {loadingMajors ? (
          <MenuItem disabled>
            <CircularProgress size={24} />
          </MenuItem>
        ) : (
          majors?.map((major) => (
            <MenuItem key={major.id} value={major.id}>
              {major.name}
            </MenuItem>
          ))
        )}
        {showClearOptions && selectedMajor && (
          <ClearMenuItem key="clear-major" value="">
            Clear
          </ClearMenuItem>
        )}
      </TextField>

      {/* Specialization Select */}
      <TextField
        select
        label="Specialization"
        value={selectedSpecialization}
        onChange={handleSpecializationChange}
        variant="outlined"
        disabled={disabled || !selectedMajor || loadingSpecializations}
        size={size}
        fullWidth
        style={{ marginTop: 16 }}
      >
        {loadingSpecializations ? (
          <MenuItem disabled>
            <CircularProgress size={24} />
          </MenuItem>
        ) : (
          specializations?.map((specialization) => (
            <MenuItem key={specialization.id} value={specialization.id}>
              {specialization.name}
            </MenuItem>
          ))
        )}
        {showClearOptions && selectedSpecialization && (
          <ClearMenuItem key="clear-specialization" value="">
            Clear
          </ClearMenuItem>
        )}
      </TextField>
    </div>
  );
};

export default AcademicFilter;
