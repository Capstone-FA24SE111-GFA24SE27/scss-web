import {
	isValidImage,
	MAX_FILE_SIZE,
	uploadFile,
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
import {
	clearEnteredValueByTab,
	selectEnteredValues,
	selectInitialValues,
	setEnteredValueByTab,
} from './create-account-slice';
import { useAppDispatch } from '@shared/store';
import useAlertDialog from '@/shared/hooks/form/useAlertDialog';
import ImageInput from '@/shared/components/image/ImageInput';

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

const ClearMenuItem = styled(MenuItem)(({ theme }) => ({
	color: theme.palette.error.main,
	fontWeight: theme.typography.fontWeightBold,
	'&:hover': {
		backgroundColor: theme.palette.error.light, // Darker background on hover
	},
}));

const CreateManagerForm = () => {
	const [showPassword, setShowPassword] = useState(false);
	const initialValues = useAppSelector(selectInitialValues);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [errorMsg, setErrorMsg] = useState(null);

	const enteredValues = useAppSelector(selectEnteredValues);
	const dispatch = useAppDispatch();

	const defaultValues = enteredValues['MANAGER'];

	const {
		control,
		formState,
		watch,
		handleSubmit,
		setValue,
		reset,
		getValues,
	} = useForm<FormType>({
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
							dispatch(clearEnteredValueByTab('MANAGER'));
							reset(initialValues['MANAGER']);
						}
					} else {
						useAlertDialog({
							dispatch,
							title: res.message,
							color: 'error',
						});
					}
				})
				.catch((err) => console.log(err));
			setErrorMsg('');
		} catch (err) {
			console.error('Image upload failed:', err);
			setErrorMsg('Error while uploading images');
			setIsSubmitting(false);
		}

		setIsSubmitting(false);
	};

	useEffect(() => {
		return () => {
			const currentValues = getValues(); // Get current form values
			dispatch(
				setEnteredValueByTab({
					tab: 'MANAGER',
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
				<div className='flex flex-col w-full gap-16 p-32 mt-16'>
					<Typography className='text-lg font-semibold leading-tight'>
						Enter basic account info:
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
										field.value ? dayjs(field.value) : null
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

									<MenuItem key={'Female'} value={'FEMALE'}>
										{'Female'}
									</MenuItem>
								</TextField>
							)}
						/>
					</div>

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

					<div className='flex items-start flex-1 gap-8 '>
						<Typography>Avatar: </Typography>
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

					{errorMsg && errorMsg.trim() !== '' && (
						<Typography color='error' className='font-semibold'>
							{errorMsg}
						</Typography>
					)}

					<div className='flex items-center justify-end w-full'>
						<Button
							className='max-w-128'
							variant='contained'
							color='secondary'
							type='submit'
							disabled={isSubmitting}
						>
							{isSubmitting ? <CircularProgress /> : 'Confirm'}
						</Button>
					</div>
				</div>
			</form>
	);
};

export default CreateManagerForm;
