import {
	isValidImage,
	MAX_FILE_SIZE,
	uploadFile,
	useGetCounselorExpertisesQuery,
} from '@/shared/services';
import { zodResolver } from '@hookform/resolvers/zod';
import { Add, Visibility, VisibilityOff } from '@mui/icons-material';
import {
	Box,
	Button,
	Chip,
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
import {
	Controller,
	FieldArrayWithId,
	useFieldArray,
	useForm,
} from 'react-hook-form';
import { z } from 'zod';
import { usePostCreateNonAcademicCounselorAccountMutation } from '../../admin-accounts-api';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { useAppSelector } from '@shared/store';
import {
	clearEnteredValueByTab,
	selectEnteredValues,
	selectInitialValues,
	setEnteredValueByTab,
} from './create-account-slice';
import { useAppDispatch } from '@shared/store';
import useAlertDialog from '@/shared/hooks/form/useAlertDialog';
import clsx from 'clsx';
import CertificationAppendForm from './CertificationAppendForm';
import QualificationAppendForm from './QualificationAppendForm';
import { openDialog } from '@/shared/components';
import { checkImageUrl } from '@/shared/utils';
import ImageInput from '@/shared/components/image/ImageInput';

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
	{
		id: 'Step 3',
		name: 'Department Information',
		fields: ['departmentId', 'majorId', 'specializationId'],
	},
	{
		id: 'Step 4',
		name: 'Relevant Skills',
		fields: ['specializedSkills','otherSkills', 'workHistory', 'achievements'],
	},
	{
		id: 'Step 5',
		name: 'Qualifications',
		fields: ['qualifications'],
	},
	{
		id: 'Step 6',
		name: 'Certifications',
		fields: ['certifications'],
	},
];

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

	fullName: z.string().min(1, 'Full name is required'),
	expertiseId: z.number().gt(0, 'Expertise ID must be selected'),
	specializedSkills: z.string().min(1, 'Specialized skill is required'),
	otherSkills: z.string().min(1, 'Other skill is required'),
	workHistory: z.string().min(1, 'Work history is required'),
	achievements: z.string().min(1, 'Achievement is required'),
	qualifications: z.array(
		z.object({
			degree: z.string().min(1, 'Degree is required'),
			fieldOfStudy: z.string().min(1, 'Field of study is required'),
			institution: z.string().min(1, 'Institution  is required'),
			yearOfGraduation: z
				.string()
				.refine(
					(date) => !isNaN(new Date(date).getTime()),
					'Invalid date format'
				),
			imageUrl: z
				.instanceof(File)
				.refine((file) => isValidImage(file), {
					message: 'File must be an image',
				})
				.refine((file) => file.size <= MAX_FILE_SIZE, {
					message: 'Image must be less than 5MB',
				}),
		})
	),
	certifications: z.array(
		z.object({
			name: z.string().min(1, 'Please enter'),
			organization: z.string().min(1, 'Please enter'),
			imageUrl: z
				.instanceof(File)
				.refine((file) => isValidImage(file), {
					message: 'File must be an image',
				})
				.refine((file) => file.size <= MAX_FILE_SIZE, {
					message: 'Image must be less than 5MB',
				}),
		})
	),
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
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [errorMsg, setErrorMsg] = useState(null);

	const initialValues = useAppSelector(selectInitialValues);
	const enteredValues = useAppSelector(selectEnteredValues);
	const dispatch = useAppDispatch();

	const defaultValues = enteredValues['NON_ACADEMIC_COUNSELOR'];
	const [activeStep, setActiveStep] = useState(0);

	const {
		control,
		formState,
		watch,
		handleSubmit,
		setValue,
		reset,
		trigger,
		getValues,
	} = useForm<FormType>({
		// @ts-ignore
		defaultValues,
		resolver: zodResolver(schema),
	});
	const formData = watch();

	const {
		fields: certificationFields,
		append: appendCertificationField,
		update: updateCertificationField,
		remove: removeCertificationField,
	} = useFieldArray({
		name: 'certifications',
		control,
	});

	const {
		fields: qualificationsFields,
		append: appendQualificationField,
		update: updateQualificationField,
		remove: removeQualificationField,
	} = useFieldArray({
		name: 'qualifications',
		control,
	});

	const { isValid, dirtyFields, errors } = formState;

	type FieldName = keyof FormType;

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

	const handleOpenQualificationAppendDialog = () => {
		dispatch(
			openDialog({
				children: (
					<QualificationAppendForm
						append={appendQualificationField}
					/>
				),
			})
		);
	};

	const handleUpdateQualification = (
		quali: FieldArrayWithId<FormType, 'certifications', 'id'>,
		index: string | number
	) => {
		dispatch(
			openDialog({
				children: (
					<QualificationAppendForm
						index={index}
						update={updateQualificationField}
						qualificationData={quali}
					/>
				),
			})
		);
	};

	const handleOpenCertificationAppendDialog = () => {
		dispatch(
			openDialog({
				children: (
					<CertificationAppendForm
						append={appendCertificationField}
					/>
				),
			})
		);
	};

	const handleUpdateCertification = (
		certi: FieldArrayWithId<FormType, 'certifications', 'id'>,
		index: string | number
	) => {
		dispatch(
			openDialog({
				children: (
					<CertificationAppendForm
						index={index}
						update={updateCertificationField}
						certificationData={certi}
					/>
				),
			})
		);
	};

	const [createAccount] = usePostCreateNonAcademicCounselorAccountMutation();

	const handleUpload = async (file: File) => {
		const res = await uploadFile(file, `images/${Date.now()}_${file.name}`);
		return res;
	};

	const onSubmit = async () => {
		setIsSubmitting(true);

		let avatarUrl = null;
		let certificationsList = [];
		let qualificationsList = [];

		try {
			avatarUrl = await handleUpload(formData.avatarLink);

			certificationsList = await Promise.all(
				formData.certifications.map(async (cert) => {
					const url = await handleUpload(cert.imageUrl);
					return {
						...cert,
						imageUrl: url,
					};
				})
			);

			qualificationsList = await Promise.all(
				formData.qualifications.map(async (qual) => {
					const url = await handleUpload(qual.imageUrl);
					return {
						...qual,
						imageUrl: url,
					};
				})
			);

			createAccount({
				...formData,
				avatarLink: avatarUrl,
				certifications: certificationsList,
				qualifications: qualificationsList,
			})
				.unwrap()
				.then((res) => {
					if (res) {
						if (res.status === 200) {
							useAlertDialog({
								dispatch,
								title: res.message,
								color: 'success',
							});
							dispatch(
								clearEnteredValueByTab('NON_ACADEMIC_COUNSELOR')
							);
							reset(initialValues['NON_ACADEMIC_COUNSELOR']);
						} else {
							useAlertDialog({
								dispatch,
								title: res.message,
								color: 'error',
							});
						}
					}
				})
				.catch((err) => {
					console.log('error submiting form', err);
					useAlertDialog({
						dispatch,
						title: 'An error occur while creating account. Please check your information and submit again.',
						color: 'error',
					});
				})
				.finally();
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
		console.log(formData);
	}, [formData]);

	useEffect(() => {
		return () => {
			const currentValues = getValues(); // Get current form values
			dispatch(
				setEnteredValueByTab({
					tab: 'NON_ACADEMIC_COUNSELOR',
					formValues: currentValues,
				})
			); // Save to Redux
		};
	}, [dispatch, getValues]);

	return (
		<form
			className='w-full h-full'
			onSubmit={handleSubmit(onSubmit)}
			// onKeyDown={(e) => {
			// 	if (e.key === 'Enter') {
			// 		e.preventDefault();
			// 		handleSubmit(onSubmit)();
			// 	}
			// }}
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

				<div
					className={clsx(
						activeStep !== 2
							? 'hidden'
							: 'flex flex-wrap flex-col flex-1 w-full h-full gap-16 '
					)}
				>
					<Typography className='text-lg font-semibold leading-tight'>
						Select counselor's info:
					</Typography>
					<Controller
						control={control}
						name='expertiseId'
						render={({ field }) => (
							<TextField
								value={field.value ? field.value : ''}
								select
								type='number'
								label='Expertise'
								onChange={handleExpertiseChange}
								variant='outlined'
								disabled={isExpertiseLoading}
								fullWidth
								error={!!errors.expertiseId}
								helperText={errors.expertiseId?.message}
							>
								{isExpertiseLoading ? (
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

				<div
					className={clsx(
						activeStep !== 3
							? 'hidden'
							: 'flex flex-col flex-wrap flex-1 w-full h-full gap-16'
					)}
				>
					<Typography className='text-lg font-semibold leading-tight'>
						Enter counselor's additional informations:
					</Typography>
					<div className='flex-1 '>
						<Controller
							control={control}
							name='specializedSkills'
							render={({ field }) => (
								<TextField
									{...field}
									label='Specialized Skills'
									fullWidth
									multiline
									variant='outlined'
									error={!!errors.specializedSkills}
									helperText={
										errors.specializedSkills?.message
									}
								/>
							)}
						/>
					</div>
					<div className='flex-1 '>
						<Controller
							control={control}
							name='otherSkills'
							render={({ field }) => (
								<TextField
									{...field}
									label='Other Skills'
									multiline
									fullWidth
									variant='outlined'
									error={!!errors.otherSkills}
									helperText={errors.otherSkills?.message}
								/>
							)}
						/>
					</div>

					<div className='flex-1 '>
						<Controller
							control={control}
							name='achievements'
							render={({ field }) => (
								<TextField
									{...field}
									label='Achievements'
									multiline
									fullWidth
									variant='outlined'
									error={!!errors.achievements}
									helperText={errors.achievements?.message}
								/>
							)}
						/>
					</div>

					<div className='flex-1 '>
						<Controller
							control={control}
							name='workHistory'
							render={({ field }) => (
								<TextField
									{...field}
									label='Work History'
									multiline
									fullWidth
									variant='outlined'
									error={!!errors.workHistory}
									helperText={errors.workHistory?.message}
								/>
							)}
						/>
					</div>
				</div>

				{errorMsg && errorMsg.trim() !== '' && (
					<Typography color='error' className='font-semibold'>
						{errorMsg}
					</Typography>
				)}

				<div
					className={clsx(
						activeStep !== 4
							? 'hidden'
							: 'flex flex-col flex-wrap flex-1 w-full h-full gap-16'
					)}
				>
					<div className='flex flex-col flex-1 gap-16 '>
						<Box className='flex flex-col gap-8'>
							<Typography className='font-semibold'>
								Qualifications:{' '}
							</Typography>
							<div
								className='flex items-center gap-16 p-8 transition-colors rounded shadow hover:cursor-pointer bg-background/50 hover:bg-background'
								onClick={handleOpenQualificationAppendDialog}
							>
								<div className='flex items-center justify-center border rounded cursor-pointer size-72 hover:opacity-90 text-grey-600'>
									<Add />
								</div>
								<Typography className='font-semibold text-text-secondary'>
									Add Qualification
								</Typography>
							</div>
							{qualificationsFields.map(
								(qualification, index) => (
									<div
										key={qualification.id}
										className='flex items-start gap-16 p-8 transition-colors rounded shadow hover:cursor-pointer hover:bg-background'
										onClick={() => {
											handleUpdateQualification(
												qualification,
												index
											);
										}}
									>
										<img
											onClick={(e) => {
												e.stopPropagation();
												dispatch(
													openDialog({
														children: (
															<img
																className='min-h-sm min-w-sm'
																src={
																	qualification.imageUrl instanceof
																	File
																		? URL.createObjectURL(
																				qualification.imageUrl
																		  )
																		: ''
																}
																alt={
																	qualification.institution
																}
															/>
														),
													})
												);
											}}
											src={
												qualification.imageUrl instanceof
												File
													? URL.createObjectURL(
															qualification.imageUrl
													  )
													: ''
											}
											alt={qualification.institution}
											className='object-cover border rounded cursor-pointer size-72 hover:opacity-90'
										/>
										<div className='flex-1'>
											<p className='text-lg font-semibold'>
												{qualification.institution}
											</p>
											<p className=''>
												{qualification.degree} •{' '}
												{qualification.fieldOfStudy}
											</p>
											<p className='text-text-secondary'>
												Graduated:{' '}
												{qualification.yearOfGraduation}
											</p>
										</div>
									</div>
								)
							)}
						</Box>
					</div>
				</div>
				<div
					className={clsx(
						activeStep !== 5
							? 'hidden'
							: 'flex flex-col flex-wrap flex-1 w-full h-full gap-16'
					)}
				>
					<div className='flex flex-col gap-16'>
						<Typography className='font-semibold'>
							Certifications:{' '}
						</Typography>
						<div
							className='flex items-center gap-16 p-8 transition-colors rounded shadow hover:cursor-pointer bg-background/50 hover:bg-background'
							onClick={handleOpenCertificationAppendDialog}
						>
							<div className='flex items-center justify-center border rounded cursor-pointer size-72 hover:opacity-90 text-grey-600'>
								<Add />
							</div>
							<Typography className='font-semibold text-text-secondary'>
								Add Certification
							</Typography>
						</div>
						{certificationFields.map((certification, index) => (
							<div
								key={certification.id}
								className='flex items-start gap-16 p-8 rounded shadow'
								onClick={() => {
									handleUpdateCertification(
										certification,
										index
									);
								}}
							>
								<img
									src={
										certification.imageUrl instanceof File
											? URL.createObjectURL(
													certification.imageUrl
											  )
											: ''
									}
									alt={certification.organization}
									onClick={(e) => {
										e.stopPropagation();
										dispatch(
											openDialog({
												children: (
													<img
														className='min-h-sm min-w-sm'
														src={
															certification.imageUrl instanceof
															File
																? URL.createObjectURL(
																		certification.imageUrl
																  )
																: ''
														}
														alt={
															certification.organization
														}
													/>
												),
											})
										);
									}}
									className='object-cover border rounded cursor-pointer size-72 hover:opacity-90'
								/>
								<div className='flex-1'>
									<p className='text-lg font-semibold'>
										{certification.name}
									</p>
									<p className=''>
										{certification.organization}
									</p>
								</div>
							</div>
						))}
					</div>
				</div>

				<Box display='flex' justifyContent='space-between'>
					<Button
						disabled={activeStep === 0}
						onClick={handleBack}
						variant='outlined'
						color='secondary'
						className='w-96'
						type='button'
						>
						Back
					</Button>
					<div className='flex gap-8'>
						{activeStep === steps.length - 1 ? (
							<Button
								className='max-w-128'
								variant='contained'
								color='secondary'
								onClick={handleSubmit(onSubmit)}

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

export default CreateNonAcademicCounselorForm;
