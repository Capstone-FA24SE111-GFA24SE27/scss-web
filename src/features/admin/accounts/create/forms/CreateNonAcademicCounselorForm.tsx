import {
	useGetCounselorExpertisesQuery,
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
import { usePostCreateNonAcademicCounselorAccountMutation } from '../../admin-accounts-api';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { useAppSelector } from '@shared/store';
import { clearEnteredValueByTab, selectEnteredValues, selectInitialValues, setEnteredValueByTab } from './create-account-slice';
import { useAppDispatch } from '@shared/store';
import useAlertDialog from '@/shared/hooks/form/useAlertDialog';

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
	expertiseId: z.number().gt(0, 'Expertise ID must be selected'),
});

type FormType = Required<z.infer<typeof schema>>;

const ClearMenuItem = styled(MenuItem)(({ theme }) => ({
	color: theme.palette.error.main,
	fontWeight: theme.typography.fontWeightBold,
	'&:hover': {
		backgroundColor: theme.palette.error.light, // Darker background on hover
	},
}));

const CreateNonAcademicCounselorForm = () => {
	const [showPassword, setShowPassword] = useState(false);

	const initialValues = useAppSelector(selectInitialValues)
	const enteredValues = useAppSelector(selectEnteredValues)
	const dispatch = useAppDispatch()

	const defaultValues = enteredValues['NON_ACADEMIC_COUNSELOR']

	const { control, formState, watch, handleSubmit, setValue, reset, getValues } =
		useForm<FormType>({
			// @ts-ignore
			defaultValues,
			resolver: zodResolver(schema),
		});
	const formData = watch();

	const { isValid, dirtyFields, errors } = formState;

	const { data: expertisesData, isLoading: isExpertiseLoading } =
		useGetCounselorExpertisesQuery();

	const expertises = expertisesData?.content;

	const toggleShowPassword = () => {
		setShowPassword((prev) => !prev);
	};

	const handleExpertiseChange = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		const expertiseId = event.target.value;
		if (Number.isNaN(expertiseId)) {
			setValue('expertiseId', 0);
		} else {
			setValue('expertiseId', Number.parseInt(expertiseId));
		}
	};

	const [createAccount] = usePostCreateNonAcademicCounselorAccountMutation();

	const onSubmit = () => {
		createAccount(formData)
			.unwrap()
			.then((res) => {
				if(res){

					useAlertDialog({dispatch, title: res.message})
					if(res.status === 200) {

						dispatch(clearEnteredValueByTab('NON_ACADEMIC_COUNSELOR'))
						reset(initialValues['NON_ACADEMIC_COUNSELOR'])
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
		  dispatch(setEnteredValueByTab({tab: 'NON_ACADEMIC_COUNSELOR', formValues: currentValues})); // Save to Redux
		};
	  }, [dispatch, getValues]);

	return (
		<div className='flex flex-wrap w-full h-full gap-16'>
			<form
			className='w-full h-full'
				onSubmit={handleSubmit(onSubmit)}
				onKeyDown={(e) => {
					if (e.key === 'Enter' ) {
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
							<div className=' min-w-320'>
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
							<div className=' min-w-320'>
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

							<div className=' min-w-320'>
								<Controller
									name='dateOfBirth'
									control={control}
									render={({ field }) => (
										<DatePicker
											className='w-full'
											label='Date of birth'
											value={dayjs(field.value)}
											disableFuture
											minDate={dayjs('1900-01-01')}
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

							<div className=' min-w-320'>
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
							<div className=' min-w-320'>
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
									name='expertiseId'
									render={({ field }) => (
										<TextField
											value={
												field.value ? field.value : ''
											}
											select
											type='number'
											label='Expertise'
											onChange={handleExpertiseChange}
											variant='outlined'
											disabled={isExpertiseLoading}
											fullWidth
											error={!!errors.expertiseId}
											helperText={
												errors.expertiseId?.message
											}
										>
											{isExpertiseLoading ? (
												<MenuItem disabled>
													<CircularProgress
														size={24}
													/>
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
							type='submit'
						>
							Confirm
						</Button>
					</div>
				</Paper>
			</form>
		</div>
	);
};

export default CreateNonAcademicCounselorForm;
