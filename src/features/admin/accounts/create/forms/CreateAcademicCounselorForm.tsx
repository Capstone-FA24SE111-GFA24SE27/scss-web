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
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import {
	usePostCreateAcademicCounselorAccountMutation,
	usePostCreateAccountMutation,
} from '../../admin-accounts-api';
import dayjs from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers';
import { isNaN } from 'lodash';
import { clearEnteredValueByTab, selectEnteredValues, selectInitialValues, setEnteredValueByTab } from './create-account-slice';
import { useAppDispatch, useAppSelector } from '@shared/store';
import useAlertDialog from '@/shared/hooks/form/useAlertDialog';

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
	departmentId: z.number().gt(0, 'Department ID must be selected'),
	majorId: z.number().gt(0, 'Major ID must be selected'),
	specializationId: z.number().gt(0, 'Specialization ID must be selected'),
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
	const enteredValues = useAppSelector(selectEnteredValues)
	const initialValues = useAppSelector(selectInitialValues)
	const dispatch = useAppDispatch()

	const defaultValues = enteredValues['ACADEMIC_COUNSELOR']

	const { control, formState, watch, handleSubmit, setValue, reset, getValues } =
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
		console.log('departmentid', departmentId, Number.isNaN(departmentId));
		if (isNaN(departmentId)) {
			setValue('departmentId', 0);
		} else {
			setValue('departmentId', Number.parseInt(departmentId));
		}
		setValue('majorId', 0); // Reset major and specialization when department changes
		setValue('specializationId', 0); // Reset specialization when major changes
	};

	const handleMajorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const majorId = event.target.value;
		if (isNaN(majorId)) {
			setValue('majorId', 0);
		} else {
			setValue('majorId', Number.parseInt(majorId));
		}
		setValue('specializationId', 0); // Reset specialization when major changes
	};

	const handleSpecializationChange = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		const specializationId = event.target.value;
		if (isNaN(specializationId)) {
			setValue('specializationId', 0);
		} else {
			setValue('specializationId', Number.parseInt(specializationId));
		}
	};

	const [createAccount] = usePostCreateAcademicCounselorAccountMutation();

	const onSubmit = () => {
		createAccount(formData)
			.unwrap()
			.then((res) => {
				if(res){

					useAlertDialog({dispatch, title: res.message})
					if(res.status === 200) {

						dispatch(clearEnteredValueByTab('ACADEMIC_COUNSELOR'))
						reset(initialValues['ACADEMIC_COUNSELOR'])
					}
				}
			})
			.catch((err) => console.log(err));
		console.log('formdata', formData);
		console.log('formdata', isValid);
	};

	useEffect(() => {
		return () => {
		  const currentValues = getValues(); // Get current form values
		  dispatch(setEnteredValueByTab({tab: 'ACADEMIC_COUNSELOR', formValues: currentValues})); // Save to Redux
		};
	  }, [dispatch, getValues]);

	return (
		<div className='flex flex-wrap w-full h-full gap-16'>
			<form
				className='w-full h-full'
				onSubmit={handleSubmit(onSubmit)}
				onKeyDown={(e) => {
					if (e.key === 'Enter') {
						e.preventDefault();
						handleSubmit(onSubmit)();
					}
				}}
			>
				<Paper className='flex flex-col w-full gap-32 p-32 mt-16'>
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
											helperText={
												errors.fullName?.message
											}
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
											helperText={
												errors.phoneNumber?.message
											}
										/>
									)}
								/>
							</div>

							<div className='flex-1 min-w-320'>
								<Controller
									control={control}
									name='dateOfBirth'
									render={({ field }) => (
										<DatePicker
											className='w-full'
											label='Date of birth'
											value={dayjs(field.value)}
											minDate={dayjs('1900-01-01')}
											disableFuture
											slotProps={{
												textField: {
													helperText:
														'Please select a valid date of birth',
												},
											}}
											views={['year', 'month', 'day']}
											onChange={(date) => {
												console.log(
													'selected dob',
													dayjs(date).format(
														'YYYY-MM-DD'
													)
												);
												setValue(
													'dateOfBirth',
													dayjs(date).format(
														'YYYY-MM-DD'
													)
												);
											}}
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
												showPassword
													? 'text'
													: 'password'
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
											helperText={
												errors.password?.message
											}
										/>
									)}
								/>
							</div>
						</div>
						<div className='flex flex-col flex-1 gap-16 min-w-320'>
							<Typography className='text-lg font-semibold leading-tight'>
								Select counselor's info:
							</Typography>
							<div className='min-w-320'>
								<Controller
									control={control}
									name='departmentId'
									render={({ field }) => (
										<TextField
											value={
												field.value ? field.value : ''
											}
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
													<CircularProgress
														size={24}
													/>
												</MenuItem>
											) : (
												departments?.map(
													(department) => (
														<MenuItem
															key={department.id}
															value={
																department.id
															}
														>
															{department.name}
														</MenuItem>
													)
												)
											)}
											{field.value && (
												<ClearMenuItem
													key='clear-department'
													value={0}
												>
													Clear
												</ClearMenuItem>
											)}
										</TextField>
									)}
								/>
							</div>

							<div className='min-w-320'>
								{/* Major Select */}
								<Controller
									control={control}
									name='majorId'
									render={({ field }) => (
										<TextField
											value={
												field.value ? field.value : ''
											}
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
													<CircularProgress
														size={24}
													/>
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
													value={0}
												>
													Clear
												</ClearMenuItem>
											)}
										</TextField>
									)}
								/>
							</div>

							<div className='min-w-320'>
								{/* Specialization Select */}
								<Controller
									control={control}
									name='specializationId'
									render={({ field }) => (
										<TextField
											value={
												field.value ? field.value : ''
											}
											select
											type='number'
											label='Specialization'
											onChange={
												handleSpecializationChange
											}
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
													<CircularProgress
														size={24}
													/>
												</MenuItem>
											) : (
												specializations?.map(
													(specialization) => (
														<MenuItem
															key={
																specialization.id
															}
															value={
																specialization.id
															}
														>
															{
																specialization.name
															}
														</MenuItem>
													)
												)
											)}
											{field.value && (
												<ClearMenuItem
													key='clear-specialization'
													value={0}
												>
													Clear
												</ClearMenuItem>
											)}
										</TextField>
									)}
								/>
							</div>
							<div className='min-w-320'>
								<Controller
									control={control}
									name='gender'
									render={({ field }) => (
										<TextField
											{...field}
											select
											label='Gender'
											variant='outlined'
											disabled={!formData.gender}
											fullWidth
											error={!!errors.gender}
											helperText={errors.gender?.message}
										>
											<MenuItem
												key={'Male'}
												value={'MALE'}
											>
												{'Male'}
											</MenuItem>

											<MenuItem
												key={'Female'}
												value={'FEMALE'}
											>
												{'Female'}
											</MenuItem>
										</TextField>
									)}
								/>
							</div>
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
			</form>
		</div>
	);
};

export default CreateAcademicCounselorForm;
