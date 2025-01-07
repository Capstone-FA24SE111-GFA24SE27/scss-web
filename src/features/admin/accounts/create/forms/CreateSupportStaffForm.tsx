import { isValidImage, MAX_FILE_SIZE, uploadFile } from '@/shared/services';
import { zodResolver } from '@hookform/resolvers/zod';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import {
	Box,
	Button,
	CircularProgress,
	IconButton,
	MenuItem,
	Step,
	StepLabel,
	Stepper,
	styled,
	TextField,
	Typography,
} from '@mui/material';
import React, { MouseEvent, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import {
	usePostCreateManagerAccountMutation,
	usePostCreateSupportStaffAccountMutation,
} from '../../admin-accounts-api';
import dayjs from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers';
import { useAppSelector } from '@shared/store';
import {
	clearEnteredValueByTab,
	selectEnteredValues,
	selectInitialValues,
	setEnteredValueByTab,
} from './create-account-slice';
import { useAppDispatch } from '@shared/store';
import useAlertDialog from '@/shared/hooks/form/useAlertDialog';
import ImageInput from '@/shared/components/image/ImageInput';
import clsx from 'clsx';

const currentYear = dayjs().year();

const schema = z.object({
	avatarLink: z
		.instanceof(File, { message: 'Image is required' })
		.refine((file) => isValidImage(file), {
			message: 'File must be an image',
		})
		.refine((file) => file.size <= MAX_FILE_SIZE, {
			message: 'Image must be less than 5MB',
		}),
	email: z.string().email('Invalid email address'), // Validates email format
	password: z.string().min(6, 'Password must be at least 6 characters long'), // Minimum password length
	gender: z.enum(['MALE', 'FEMALE']), // Enum for gender
	phoneNumber: z
		.string()
		.regex(/^\d{10,15}$/, 'Phone number must be between 10 and 15 digits'),
	dateOfBirth: z
		.string()
		.refine((date) => {
			return dayjs(date, 'YYYY-MM-DD', true).isValid();
		}, 'Birth date must be a valid date')
		.refine((date) => {
			const year = dayjs(date).year();
			return year >= 1900 && year <= currentYear;
		}, `Year must be between 1900 and ${currentYear}`),
	fullName: z.string().min(1, 'Full name is required'), // Full name validation
});

type FormType = Required<z.infer<typeof schema>>;

const steps = [
	{
		id: 'Step 1',
		name: 'Login Information',
		fields: ['email', 'password'],
	},
	{
		id: 'Step 2',
		name: 'Account Information',
		fields: [
			'avartarLink',
			'fullName',
			'email',
			'gender',
			'phoneNumber',
			'dateOfBirth',
			'password',
		],
	},
];

const CreateSupportStaffForm = () => {
	const [showPassword, setShowPassword] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [errorMsg, setErrorMsg] = useState(null);
	const initialValues = useAppSelector(selectInitialValues);
	const enteredValues = useAppSelector(selectEnteredValues);
	const dispatch = useAppDispatch();
	const [activeStep, setActiveStep] = useState(0);

	const defaultValues = enteredValues['SUPPORT_STAFF'];

	const {
		control,
		formState,
		watch,
		handleSubmit,
		setValue,
		reset,
		getValues,
		trigger,
	} = useForm<FormType>({
		// @ts-ignore
		defaultValues,
		resolver: zodResolver(schema),
	});
	const formData = watch();

	const { isValid, dirtyFields, errors } = formState;

	type FieldName = keyof FormType;

	const toggleShowPassword = () => {
		setShowPassword((prev) => !prev);
	};

	const handleNext = async (e: MouseEvent<HTMLButtonElement>) => {
		const fields = steps[activeStep].fields;
		const result = await trigger(fields as FieldName[], {
			shouldFocus: true,
		});

		if (!result) return;

		if (activeStep < steps.length - 1) {
			setActiveStep((prevActiveStep) => prevActiveStep + 1);
		}
	};
	const handleBack = (e: MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		setActiveStep((prevActiveStep) => prevActiveStep - 1);
	};

	const [createAccount] = usePostCreateSupportStaffAccountMutation();

	const handleUpload = async (file: File) => {
		const res = await uploadFile(file, `images/${Date.now()}_${file.name}`);
		return res;
	};

	const onSubmit = async () => {
		setIsSubmitting(true);
		try {
			let avatarUrl = null;

			avatarUrl = await handleUpload(formData.avatarLink);

			createAccount({ ...formData, avatarLink: avatarUrl })
				.unwrap()
				.then((res) => {
					if (res) {
						if (res.status === 200) {
							useAlertDialog({
								dispatch,
								title: res.message,
								color: 'success',
							});
							dispatch(clearEnteredValueByTab('SUPPORT_STAFF'));
							reset(initialValues['SUPPORT_STAFF']);
						}
					} else {
						useAlertDialog({
							dispatch,
							title: res.message,
							color: 'error',
						});
					}
				})
				.catch((err) => {
					console.log('error submiting form', err);
					useAlertDialog({
						dispatch,
						title: 'An error occur while creating account. Please check your information and submit again.',
						color: 'error',
					});
				});
			setErrorMsg('');
		} catch (err) {
			console.error('Image upload failed:', err);
			setErrorMsg('Error while uploading images');
			useAlertDialog({
				dispatch,
				title: 'An error occur while uploading image. Please choose another image or submit the form again.',
				color: 'error',
			});
			setIsSubmitting(false);
		}
		setActiveStep(0);
		setIsSubmitting(false);
	};

	useEffect(() => {
		return () => {
			const currentValues = getValues(); // Get current form values
			dispatch(
				setEnteredValueByTab({
					tab: 'SUPPORT_STAFF',
					formValues: currentValues,
				})
			); // Save to Redux
		};
	}, [dispatch, getValues]);

	return (
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
			<div className='flex flex-col flex-1 w-full gap-32 p-32 mt-16'>
				<Stepper
					activeStep={activeStep}
					alternativeLabel
					className='flex mb-16'
				>
					{steps.map((item, index) => (
						<Step key={item.id} completed={index < activeStep}>
							<StepLabel>{item.name}</StepLabel>
						</Step>
					))}
				</Stepper>
				{errorMsg && errorMsg.trim() !== '' && (
					<Typography color='error' className='font-semibold'>
						{errorMsg}
					</Typography>
				)}
				<div
					className={clsx(
						activeStep !== 0
							? 'hidden'
							: 'flex flex-wrap flex-1 w-full h-full gap-16'
					)}
				>
					<div className='flex flex-col flex-1 gap-16 '>
						<Typography className='text-lg font-semibold leading-tight'>
							Enter login information:
						</Typography>
						<div className='flex-1 '>
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
						<div className='flex-1 '>
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
				</div>
				<div
					className={clsx(
						activeStep !== 1
							? 'hidden'
							: 'flex flex-wrap flex-1 w-full h-full gap-16'
					)}
				>
					<div className='flex flex-col flex-1 gap-16 '>
						<Typography className='text-lg font-semibold leading-tight'>
							Enter basic account information:
						</Typography>
						<div className='flex-1 '>
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
						<div className='flex-1 '>
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

						<div className='flex-1 '>
							<Controller
								control={control}
								name='dateOfBirth'
								render={({ field }) => (
									<DatePicker
										className='w-full'
										label='Date of birth'
										value={
											field.value
												? dayjs(field.value)
												: null
										}
										minDate={dayjs('1900-01-01')}
										disableFuture
										format='YYYY-MM-DD'
										slotProps={{
											textField: {
												helperText:
													errors.dateOfBirth?.message,
											},
										}}
										views={['year', 'month', 'day']}
										onChange={(date) => {
											field.onChange(
												dayjs(date).format('YYYY-MM-DD')
											);
										}}
									/>
								)}
							/>
						</div>

						<div className=''>
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
					<div className='flex items-start flex-1 gap-8 '>
						<Typography className='font-semibold'>
							Upload account's avatar:{' '}
						</Typography>
						<Controller
							control={control}
							name='avatarLink'
							render={({ field }) => (
								<div className='flex-1 aspect-square max-w-256'>
									<ImageInput
										error={!!errors.avatarLink}
										onFileChange={(file: File) =>
											field.onChange(file)
										}
										file={field.value}
									/>
								</div>
							)}
						/>
						{errors.avatarLink && (
							<Typography color='error' className='text-sm'>
								{errors.avatarLink.message}
							</Typography>
						)}
					</div>
				</div>

				<Box display='flex' justifyContent='space-between'>
					<Button
						disabled={activeStep === 0}
						onClick={handleBack}
						variant='outlined'
						color='secondary'
						className='w-96'
					>
						Back
					</Button>
					<div className='flex gap-8'>
						{activeStep === steps.length - 1 ? (
							<Button
								className='max-w-128'
								variant='contained'
								color='secondary'
								type='submit'
								disabled={isSubmitting}
							>
								{isSubmitting ? (
									<CircularProgress />
								) : (
									'Confirm'
								)}
							</Button>
						) : (
							<Button
								onClick={handleNext}
								variant='contained'
								color='secondary'
								className='w-96'
								type='button'
							>
								Next
							</Button>
						)}
					</div>
				</Box>
			</div>
		</form>
	);
};

export default CreateSupportStaffForm;
