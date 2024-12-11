import {
    useGetCounselorExpertisesQuery,
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

const ExpertiseTab = (props: Props) => {
	const methods = useFormContext();
	const { control, formState, watch, setValue } = methods;
	const { errors } = formState;

	const formData = watch();

	// Fetch departments
	const { data: expertisesData, isLoading: loadingExpertises } =
		useGetCounselorExpertisesQuery();
	// Fetch majors based on selected expertise

    const expertises = expertisesData?.content

	const handleExpertiseChange = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		const expertiseId = event.target.value;
		console.log('expertiseid', expertiseId, Number.isNaN(expertiseId));
		if (isNaN(expertiseId)) {
			setValue('expertiseId', 0);
		} else {
			setValue('expertiseId', Number.parseInt(expertiseId));
		}
	};


	return (
		<div>
			<Controller
				control={control}
				name='expertiseId'
				render={({ field }) => (
					<TextField
						value={field.value ? field.value : ''}
						className='mt-8 mb-16'
						select
						type='number'
						label='Expertise'
						onChange={handleExpertiseChange}
						variant='outlined'
						disabled={loadingExpertises}
						fullWidth
						error={!!errors.expertiseId}
						helperText={errors.expertiseId?.message as string}
					>
						{loadingExpertises ? (
							<MenuItem disabled>
								<CircularProgress size={24} />
							</MenuItem>
						) : (
							expertises?.map((expertise) => (
								<MenuItem
									key={expertise.id}
									value={expertise.id}
								>
									{expertise.name}
								</MenuItem>
							))
						)}
						{field.value && (
							<ClearMenuItem key='clear-expertise' value={0}>
								Clear
							</ClearMenuItem>
						)}
					</TextField>
				)}
			/>

		</div>
	);
};

export default ExpertiseTab;
