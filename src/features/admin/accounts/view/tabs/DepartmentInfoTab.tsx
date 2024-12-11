import {
	useGetDepartmentsQuery,
	useGetMajorsByDepartmentQuery,
} from '@/shared/services';
import {
	Autocomplete,
	CircularProgress,
	MenuItem,
	styled,
	TextField,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { isNaN } from 'lodash';
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';

type Props = {};

const ClearMenuItem = styled(MenuItem)(({ theme }) => ({
	color: theme.palette.error.main,
	fontWeight: theme.typography.fontWeightBold,
	'&:hover': {
		backgroundColor: theme.palette.error.light, // Darker background on hover
	},
}));

const DepartmentInfoTab = (props: Props) => {
	const methods = useFormContext();
	const { control, formState, watch, setValue } = methods;
	const { errors } = formState;

	const formData = watch();

	// Fetch departments
	const { data: departments, isLoading: loadingDepartments } =
		useGetDepartmentsQuery();
	// Fetch majors based on selected department
	const { data: majors, isLoading: loadingMajors } =
		useGetMajorsByDepartmentQuery(formData.departmentId as number, {
			skip: !formData.departmentId,
		});

	const handleDepartmentChange = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		const departmentId = event.target.value;
		console.log('departmentid', departmentId, Number.isNaN(departmentId));
		if (isNaN(departmentId)) {
			setValue('departmentId', 0);
		} else {
			setValue('departmentId', Number.parseInt(departmentId));
		}
		setValue('majorId', 0); // Reset major and specialization when department changes
		// setValue('specializationId', 0); // Reset specialization when major changes
	};

	const handleMajorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const majorId = event.target.value;
		if (isNaN(majorId)) {
			setValue('majorId', 0);
		} else {
			setValue('majorId', Number.parseInt(majorId));
		}
		// setValue('specializationId', 0); // Reset specialization when major changes
	};

	return (
		<div>
			<Controller
				control={control}
				name='departmentId'
				render={({ field }) => (
					<TextField
						value={field.value ? field.value : 0}
						className='mt-8 mb-16'
						select
						type='number'
						label='Department'
						onChange={handleDepartmentChange}
						variant='outlined'
						disabled={loadingDepartments}
						fullWidth
						error={!!errors.departmentId}
						helperText={errors.departmentId?.message as string}
					>
						{loadingDepartments ? (
							<MenuItem disabled>
								<CircularProgress size={24} />
							</MenuItem>
						) : (
							departments?.map((department) => (
								<MenuItem
									key={department.id}
									value={department.id}
								>
									{department.name}
								</MenuItem>
							))
						)}
						{field.value && (
							<ClearMenuItem key='clear-department' value={0}>
								Clear
							</ClearMenuItem>
						)}
					</TextField>
				)}
			/>

			{/* Major Select */}
			<Controller
				control={control}
				name='majorId'
				render={({ field }) => (
					<TextField
						value={field.value ? field.value : 0}
						className='mt-8 mb-16'
						select
						type='number'
						label='Major'
						onChange={handleMajorChange}
						variant='outlined'
						disabled={loadingMajors || !formData.departmentId}
						fullWidth
						error={!!errors.majorId}
						helperText={errors.majorId?.message as string}
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
						{field.value && (
							<ClearMenuItem key='clear-major' value={0}>
								Clear
							</ClearMenuItem>
						)}
					</TextField>
				)}
			/>
		</div>
	);
};

export default DepartmentInfoTab;
