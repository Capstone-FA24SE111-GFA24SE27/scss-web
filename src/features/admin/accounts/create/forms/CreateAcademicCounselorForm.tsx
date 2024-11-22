import { AcademicFilter } from '@/shared/components';
import {
	useGetDepartmentsQuery,
	useGetMajorsByDepartmentQuery,
	useGetSpecializationsByMajorQuery,
} from '@/shared/services';
import { zodResolver } from '@hookform/resolvers/zod';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import {
	Button,
	CircularProgress,
	IconButton,
	MenuItem,
	Paper,
	styled,
	TextField,
	Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { usePostCreateAccountMutation } from '../../admin-accounts-api';

type Props = {};

const schema = z.object({
	email: z.string().email('Invalid email address'), // Validates email format
	password: z.string().min(6, 'Password must be at least 6 characters long'), // Minimum password length
	gender: z.enum(['MALE', 'FEMALE']), // Enum for gender
	phoneNumber: z
		.string()
		.regex(/^\d{10,15}$/, 'Phone number must be between 10 and 15 digits'),
	dateOfBirth: z
		.string()
		.refine(
			(date) => !isNaN(new Date(date).getTime()),
			'Invalid date format'
		), // Validates date string
	fullName: z.string().min(1, 'Full name is required'), // Full name validation
	departmentId: z.number().int('Department ID must be selected'),
	majorId: z.number().int('Major ID must be selected'),
	specializationId: z.number().int('Specialization ID must be selected'),
});

type FormType = Required<z.infer<typeof schema>>;

const ClearMenuItem = styled(MenuItem)(({ theme }) => ({
	color: theme.palette.error.main,
	fontWeight: theme.typography.fontWeightBold,
	'&:hover': {
		backgroundColor: theme.palette.error.light, // Darker background on hover
	},
}));

const CreateAcademicCounselorForm = (props: Props) => {
	const [showPassword, setShowPassword] = useState(false);

	const defaultValues = {
		email: '',
		password: '',
		gender: 'MALE',
		phoneNumber: null,
		dateOfBirth: '',
		fullName: null,
		departmentId: null,
		majorId: null,
		specializationId: null,
	};

	const { control, formState, watch, handleSubmit, setValue, reset } =
		useForm<FormType>({
			// @ts-ignore
			defaultValues,
			resolver: zodResolver(schema),
		});
	const formData = watch();

	const { isValid, dirtyFields, errors } = formState;

	// Fetch departments
	const { data: departments, isLoading: loadingDepartments } =
		useGetDepartmentsQuery();
	// Fetch majors based on selected department
	const { data: majors, isLoading: loadingMajors } =
		useGetMajorsByDepartmentQuery(formData.departmentId, {
			skip: !formData.departmentId,
		});
	// Fetch specializations based on selected major
	const { data: specializations, isLoading: loadingSpecializations } =
		useGetSpecializationsByMajorQuery(formData.majorId, {
			skip: !formData.majorId,
		});

	const toggleShowPassword = () => {
		setShowPassword((prev) => !prev);
	};

	const handleDepartmentChange = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		const departmentId = event.target.value;
		if (Number.isNaN(departmentId)) {
			setValue('departmentId', null);
		} else {
			setValue('departmentId', Number.parseInt(departmentId));
		}
		setValue('majorId', null); // Reset major and specialization when department changes
		setValue('specializationId', null); // Reset specialization when major changes
	};

	const handleMajorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const majorId = event.target.value;
		if (Number.isNaN(majorId)) {
			setValue('majorId', null);
		} else {
			setValue('majorId', Number.parseInt(majorId));
		}
		setValue('specializationId', null); // Reset specialization when major changes
	};

	const handleSpecializationChange = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		const specializationId = event.target.value;
		if (Number.isNaN(specializationId)) {
			setValue('specializationId', null);
		} else {
			setValue('specializationId', Number.parseInt(specializationId));
		}
	};

	const [createAccount] = usePostCreateAccountMutation();

	const onSubmit = () => {
		// createAccount({

		// })
		// 	.unwrap()
		// 	.then(() => navigate(-1))
		// 	.catch((err) => console.log(err));
		console.log('formdata', formData);
		console.log('formdata', isValid);
	};

	return (
		<div className='flex flex-wrap w-full h-full gap-16'>
			<Paper className='flex flex-col gap-32 p-32 mt-16'>
				<div className='flex flex-wrap flex-1 w-full h-full gap-32'>
					<div className='flex flex-col flex-1 gap-16 min-w-320'>
						<Typography className='text-lg font-semibold leading-tight'>
							Enter basic account info:
						</Typography>
						<div className='flex-1 min-w-320'>
							<Controller
								control={control}
								name='fullName'
								render={({ field }) => (
									<TextField
										{...field}
										label='Full name'
										fullWidth
										variant='outlined'
										error={!!errors.fullName}
										helperText={errors.fullName?.message}
									/>
								)}
							/>
						</div>
						<div className='flex-1 min-w-320'>
							<Controller
								control={control}
								name='phoneNumber'
								render={({ field }) => (
									<TextField
										{...field}
										label='Phone number'
										type='tel'
										fullWidth
										variant='outlined'
										error={!!errors.phoneNumber}
										helperText={errors.phoneNumber?.message}
									/>
								)}
							/>
						</div>

            <div className='flex-1 min-w-320'>
							<Controller
								control={control}
								name='dateOfBirth'
								render={({ field }) => (
									<TextField
										{...field}
										label='Date of birth'
										type='date'
										fullWidth
										variant='outlined'
										error={!!errors.dateOfBirth}
										helperText={errors.dateOfBirth?.message}
									/>
								)}
							/>
						</div>

						<div className='flex-1 min-w-320'>
							<Controller
								control={control}
								name='email'
								render={({ field }) => (
									<TextField
										{...field}
										label='Email'
										fullWidth
										variant='outlined'
										error={!!errors.email}
										helperText={errors.email?.message}
									/>
								)}
							/>
						</div>
						<div className='flex-1 min-w-320'>
							<Controller
								control={control}
								name='password'
								render={({ field }) => (
									<TextField
										{...field}
										type={
											showPassword ? 'text' : 'password'
										}
										className='relative'
										label='Password'
										fullWidth
										variant='outlined'
										slotProps={{
											input: {
												endAdornment: (
													<IconButton
														onClick={
															toggleShowPassword
														}
													>
														{showPassword ? (
															<VisibilityOff />
														) : (
															<Visibility />
														)}
													</IconButton>
												),
											},
										}}
										error={!!errors.password}
										helperText={errors.password?.message}
									/>
								)}
							/>
						</div>
					</div>
					<div className='flex flex-col flex-1 gap-16 min-w-320'>
						<Typography className='text-lg font-semibold leading-tight'>
							Select counselor's info:
						</Typography>
						<div className='flex-1 min-w-320'>
							<Controller
								control={control}
								name='departmentId'
								render={({ field }) => (
									<TextField
										value={field.value ? field.value : ''}
										select
										type='number'
										label='Department'
										onChange={handleDepartmentChange}
										variant='outlined'
										disabled={loadingDepartments}
										fullWidth
										error={!!errors.departmentId}
										helperText={
											errors.departmentId?.message
										}
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
											<ClearMenuItem
												key='clear-department'
												value=''
											>
												Clear
											</ClearMenuItem>
										)}
									</TextField>
								)}
							/>
						</div>

						<div className='flex-1 min-w-320'>
							{/* Major Select */}
							<Controller
								control={control}
								name='majorId'
								render={({ field }) => (
									<TextField
										value={field.value ? field.value : ''}
										select
										type='number'
										label='Major'
										onChange={handleMajorChange}
										variant='outlined'
										disabled={
											loadingMajors ||
											!formData.departmentId
										}
										fullWidth
										error={!!errors.majorId}
										helperText={errors.majorId?.message}
									>
										{loadingMajors ? (
											<MenuItem disabled>
												<CircularProgress size={24} />
											</MenuItem>
										) : (
											majors?.map((major) => (
												<MenuItem
													key={major.id}
													value={major.id}
												>
													{major.name}
												</MenuItem>
											))
										)}
										{field.value && (
											<ClearMenuItem
												key='clear-major'
												value=''
											>
												Clear
											</ClearMenuItem>
										)}
									</TextField>
								)}
							/>
						</div>

						<div className='flex-1 min-w-320'>
							{/* Specialization Select */}
							<Controller
								control={control}
								name='specializationId'
								render={({ field }) => (
									<TextField
										value={field.value ? field.value : ''}
										select
										type='number'
										label='Specialization'
										onChange={handleSpecializationChange}
										variant='outlined'
										disabled={
											!formData.majorId ||
											loadingSpecializations
										}
										fullWidth
										error={!!errors.specializationId}
										helperText={
											errors.specializationId?.message
										}
									>
										{loadingSpecializations ? (
											<MenuItem disabled>
												<CircularProgress size={24} />
											</MenuItem>
										) : (
											specializations?.map(
												(specialization) => (
													<MenuItem
														key={specialization.id}
														value={
															specialization.id
														}
													>
														{specialization.name}
													</MenuItem>
												)
											)
										)}
										{field.value && (
											<ClearMenuItem
												key='clear-specialization'
												value=''
											>
												Clear
											</ClearMenuItem>
										)}
									</TextField>
								)}
							/>
						</div>
						<div className='flex-1 min-w-320'></div>
					</div>
				</div>
				<div className='flex items-center justify-end w-full'>
					<Button
						className='max-w-128'
						variant='contained'
						color='secondary'
						// disabled={!isValid}
						onClick={handleSubmit(onSubmit)}
					>
						Confirm
					</Button>
				</div>
			</Paper>
		</div>
	);
};

export default CreateAcademicCounselorForm;
