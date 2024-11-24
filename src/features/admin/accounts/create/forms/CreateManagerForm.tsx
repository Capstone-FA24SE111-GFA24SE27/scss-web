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
import { usePostCreateManagerAccountMutation } from '../../admin-accounts-api';
import dayjs from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers';
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
});

type FormType = Required<z.infer<typeof schema>>;

const ClearMenuItem = styled(MenuItem)(({ theme }) => ({
	color: theme.palette.error.main,
	fontWeight: theme.typography.fontWeightBold,
	'&:hover': {
		backgroundColor: theme.palette.error.light, // Darker background on hover
	},
}));

const CreateManagerForm = () => {
	const [showPassword, setShowPassword] = useState(false);
	const initialValues = useAppSelector(selectInitialValues)

	const enteredValues = useAppSelector(selectEnteredValues)
	const dispatch = useAppDispatch()

	const defaultValues = enteredValues['MANAGER']

	const { control, formState, watch, handleSubmit, setValue, reset, getValues } =
		useForm<FormType>({
			// @ts-ignore
			defaultValues,
			resolver: zodResolver(schema),
		});
	const formData = watch();

	const { isValid, dirtyFields, errors } = formState;

	const toggleShowPassword = () => {
		setShowPassword((prev) => !prev);
	};

	const [createAccount] = usePostCreateManagerAccountMutation();

	const onSubmit = () => {
		createAccount(formData)
			.unwrap()
			.then((res) => {
				if(res){

					useAlertDialog({dispatch, title: res.message})
					if(res.status === 200) {

						dispatch(clearEnteredValueByTab('MANAGER'))
						reset(initialValues['MANAGER'])
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
		  dispatch(setEnteredValueByTab({tab: 'MANAGER', formValues: currentValues})); // Save to Redux
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
				<Paper className='flex flex-col w-full gap-16 p-32 mt-16'>
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
								<DatePicker
									className='w-full'
									label='Date of birth'
									value={dayjs(field.value)}
									minDate={dayjs('1900-01-01')}
									slotProps={{
										textField: {
											helperText: 	
												'Please select a valid date of birth',
										},
									}}
									disableFuture
									maxDate={dayjs()}
									views={['year', 'month', 'day']}
									onChange={(date) => {
										console.log(
											'selected dob',
											dayjs(date).format('YYYY-MM-DD')
										);
										setValue(
											'dateOfBirth',
											dayjs(date).format('YYYY-MM-DD')
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
									type={showPassword ? 'text' : 'password'}
									className='relative'
									label='Password'
									fullWidth
									variant='outlined'
									slotProps={{
										input: {
											endAdornment: (
												<IconButton
													onClick={toggleShowPassword}
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
									<MenuItem key={'Male'} value={'MALE'}>
										{'Male'}
									</MenuItem>

									<MenuItem key={'Female'} value={'FEMALE'}>
										{'Female'}
									</MenuItem>
								</TextField>
							)}
						/>
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

export default CreateManagerForm;
