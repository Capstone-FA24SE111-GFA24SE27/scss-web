import { AcademicFilter, LoadingButton, openDialog } from '@/shared/components';
import {
	isValidImage,
	MAX_FILE_SIZE,
	uploadFile,
	useGetDepartmentsQuery,
	useGetMajorsByDepartmentQuery,
	useGetSpecializationsByMajorQuery,
} from '@/shared/services';
import { zodResolver } from '@hookform/resolvers/zod';
import { Add, Delete, Visibility, VisibilityOff } from '@mui/icons-material';
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
import React, { MouseEvent, useEffect, useRef, useState } from 'react';
import {
	Controller,
	FieldArrayWithId,
	useFieldArray,
	useForm,
} from 'react-hook-form';
import { z } from 'zod';
import { usePostCreateAcademicCounselorAccountMutation } from '../../admin-accounts-api';
import dayjs from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers';
import { findIndex, isNaN } from 'lodash';
import {
	clearEnteredValueByTab,
	selectEnteredValues,
	selectInitialValues,
	setEnteredValueByTab,
} from './create-account-slice';
import { useAppDispatch, useAppSelector } from '@shared/store';
import useAlertDialog from '@/shared/hooks/form/useAlertDialog';
import clsx from 'clsx';
import CertificationAppendForm from './CertificationAppendForm';
import QualificationAppendForm from './QualificationAppendForm';
import ImageInput from '@/shared/components/image/ImageInput';
import Loading from '@/shared/components/loading/AppLoading';

type Props = {};

const steps = [
	{
		id: 'Step 1',
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
		id: 'Step 2',
		name: 'Department Information',
		fields: ['departmentId', 'majorId', 'specializationId'],
	},
	{
		id: 'Step 3',
		name: 'Relevant Skills',
		fields: [
			'otherSkills',
			'workHistory',
			'achievements',
			'qualifications',
			'certifications',
		],
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

	fullName: z.string().min(1, 'Full name is required'), // Full name validation
	departmentId: z.number().gt(0, 'Department ID must be selected'),
	majorId: z.number().gt(0, 'Major ID must be selected'),
	specializationId: z.number().gt(0, 'Specialization ID must be selected'),
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

// async function checkImage(url){

// 	const res = await fetch(url);
// 	const buff = await res.blob();

// 	return buff.type.startsWith('image/')

// }

type FormType = Required<z.infer<typeof schema>>;

// const steps = ['Account Info', 'Department Info', 'Experience'];

const ClearMenuItem = styled(MenuItem)(({ theme }) => ({
	color: theme.palette.error.main,
	fontWeight: theme.typography.fontWeightBold,
	'&:hover': {
		backgroundColor: theme.palette.error.light, // Darker background on hover
	},
}));

const CreateAcademicCounselorForm = (props: Props) => {
	const [showPassword, setShowPassword] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const enteredValues = useAppSelector(selectEnteredValues);
	const initialValues = useAppSelector(selectInitialValues);
	const dispatch = useAppDispatch();

	const defaultValues = enteredValues['ACADEMIC_COUNSELOR'];

	const [activeStep, setActiveStep] = useState(0);
	const [errorMsg, setErrorMsg] = useState(null);

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
		mode: 'onChange',
	});
	const formData = watch();

	const { isValid, isDirty, errors } = formState;

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

	const isSubmittable = !!isDirty && !!isValid;

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

	// Fetch departments
	const { data: departments, isLoading: loadingDepartments } =
		useGetDepartmentsQuery();
	// Fetch majors based on selected department
	const { data: majors, isLoading: loadingMajors } =
		useGetMajorsByDepartmentQuery(formData.departmentId as number, {
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

	const [createAccount] = usePostCreateAcademicCounselorAccountMutation();

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
								clearEnteredValueByTab('ACADEMIC_COUNSELOR')
							);
							reset(initialValues['ACADEMIC_COUNSELOR']);
						} else {
							useAlertDialog({
								dispatch,
								title: res.message,
								color: 'error',
							});
						}
					}
				})
				.catch((err) => console.log('error submiting form', err))
				.finally();
			setErrorMsg('');
		} catch (err) {
			console.error('Image upload failed:', err);
			setErrorMsg('Error while uploading images');
			setIsSubmitting(false);
		}

		console.log('formdata', {
			...formData,
			avatarLink: avatarUrl,
			certifications: certificationsList,
			qualifications: qualificationsList,
		});

		console.log('formdata', isValid);

		setIsSubmitting(false);
	};

	useEffect(() => {
		return () => {
			const currentValues = getValues(); // Get current form values
			dispatch(
				setEnteredValueByTab({
					tab: 'ACADEMIC_COUNSELOR',
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
				<div className='flex flex-col w-full gap-32 p-32 mt-16'>
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
					<div
						className={clsx(
							activeStep !== 0
								? 'hidden'
								: 'flex flex-wrap flex-1 w-full h-full gap-16'
						)}
					>
						<div className='flex flex-col flex-1 gap-16 '>
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
											helperText={
												errors.fullName?.message
											}
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
											helperText={
												errors.phoneNumber?.message
											}
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
														errors.dateOfBirth
															?.message,
												},
											}}
											views={['year', 'month', 'day']}
											onChange={(date) => {
												field.onChange(
													dayjs(date).format(
														'YYYY-MM-DD'
													)
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
									<Typography
										color='error'
										className='text-sm'
									>
										{errors.avatarLink.message}
									</Typography>
								)}
							</div>
						</div>
					</div>

					<div
						className={clsx(
							activeStep !== 1
								? 'hidden'
								: 'flex flex-wrap flex-col flex-1 w-full h-full gap-16 '
						)}
					>
						<Typography className='text-lg font-semibold leading-tight'>
							Select counselor's info:
						</Typography>
						<div className=''>
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
												value={0}
											>
												Clear
											</ClearMenuItem>
										)}
									</TextField>
								)}
							/>
						</div>

						<div className=''>
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
												value={0}
											>
												Clear
											</ClearMenuItem>
										)}
									</TextField>
								)}
							/>
						</div>

						<div className=''>
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
												value={0}
											>
												Clear
											</ClearMenuItem>
										)}
									</TextField>
								)}
							/>
						</div>
					</div>

					<div
						className={clsx(
							activeStep !== 2
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
										helperText={
											errors.achievements?.message
										}
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

						<div className='flex flex-col flex-1 gap-16 '>
							<div className='flex flex-wrap items-center gap-8'>
								<Typography className='font-semibold'>
									Certifications:{' '}
								</Typography>
								{certificationFields.map(
									(certification, index) => (
										<div
											key={certification.id}
											className='flex flex-wrap items-center space-y-8'
										>
											<Chip
												variant='filled'
												label={certification.name}
												onClick={() =>
													handleUpdateCertification(
														certification,
														index
													)
												}
												onDelete={() => {
													removeCertificationField(
														index
													);
												}}
												className='gap-8 mx-8 font-semibold w-fit'
											/>
										</div>
									)
								)}
							</div>

							<Button
								variant='outlined'
								color='primary'
								onClick={handleOpenCertificationAppendDialog}
							>
								<Add />
								Add Certification
							</Button>
						</div>

						<div className='flex flex-col flex-1 gap-16 '>
							<div className='flex flex-wrap items-center space-y-8'>
								<Typography className='font-semibold'>
									Qualifications:{' '}
								</Typography>

								{qualificationsFields.map(
									(qualification, index) => (
										<div
											key={qualification.id}
											className='flex items-center'
										>
											<Chip
												variant='filled'
												label={qualification.degree}
												onClick={() =>
													handleUpdateQualification(
														qualification,
														index
													)
												}
												onDelete={() => {
													removeQualificationField(
														index
													);
												}}
												className='gap-8 mx-8 font-semibold w-fit'
											/>
										</div>
									)
								)}
							</div>

							<Button
								variant='outlined'
								color='primary'
								onClick={handleOpenQualificationAppendDialog}
							>
								<Add />
								Add Qualification
							</Button>
						</div>
					</div>

					{errorMsg && errorMsg.trim() !== '' && (
						<Typography color='error' className='font-semibold'>
							{errorMsg}
						</Typography>
					)}

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

export default CreateAcademicCounselorForm;
