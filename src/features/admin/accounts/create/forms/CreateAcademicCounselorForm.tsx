import { AcademicFilter, openDialog } from '@/shared/components';
import {
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
	Paper,
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
import { Certification } from '@/shared/types';
import QualificationAppendForm from './QualificationAppendForm';

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
				.string()
				.url('Invalid URL')
				.refine(
					(url) => /\.(jpg|jpeg|png|gif|webp)$/i.test(url),
					'URL must point to a valid image file (jpg, jpeg, png, gif, webp)'
				),
		})
	),
	certifications: z.array(
		z.object({
			name: z.string().min(1, 'Please enter'),
			organization: z.string().min(1, 'Please enter'),
			imageUrl: z
				.string()
				.url('Invalid URL')
				.refine(
					(url) => /\.(jpg|jpeg|png|gif|webp)$/i.test(url),
					'URL must point to a valid image file (jpg, jpeg, png, gif, webp)'
				),
		})
	),
});

// async function checkImage(url){

// 	const res = await fetch(url);
// 	const buff = await res.blob();

// 	return buff.type.startsWith('image/')

// }

type FormType = Required<z.infer<typeof schema>>;

const steps = ['Account Info', 'Department Info', 'Experience'];

const ClearMenuItem = styled(MenuItem)(({ theme }) => ({
	color: theme.palette.error.main,
	fontWeight: theme.typography.fontWeightBold,
	'&:hover': {
		backgroundColor: theme.palette.error.light, // Darker background on hover
	},
}));

const CreateAcademicCounselorForm = (props: Props) => {
	const [showPassword, setShowPassword] = useState(false);
	const enteredValues = useAppSelector(selectEnteredValues);
	const initialValues = useAppSelector(selectInitialValues);
	const dispatch = useAppDispatch();

	const defaultValues = enteredValues['ACADEMIC_COUNSELOR'];

	const [activeStep, setActiveStep] = useState(0);

	const handleNext = (e: MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		setActiveStep((prevActiveStep) => prevActiveStep + 1);
	};
	const handleBack = (e: MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		setActiveStep((prevActiveStep) => prevActiveStep - 1);
	};

	const {
		control,
		register,
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
		console.log('123wdawd');
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
		console.log('123wdawd');
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

	const onSubmit = () => {
		// createAccount(formData)
		// 	.unwrap()
		// 	.then((res) => {
		// 		if(res){

		// 			useAlertDialog({dispatch, title: res.message})
		// 			if(res.status === 200) {

		// 				dispatch(clearEnteredValueByTab('ACADEMIC_COUNSELOR'))
		// 				reset(initialValues['ACADEMIC_COUNSELOR'])
		// 			}
		// 		}
		// 	})
		// 	.catch((err) => console.log(err));
		console.log('formdata', formData);
		console.log('formdata', isValid);
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
					<Stepper
						activeStep={activeStep}
						alternativeLabel
						className='flex mb-16'
					>
						{steps.map((label, index) => (
							<Step key={label} completed={index < activeStep}>
								<StepLabel>{label}</StepLabel>
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
					</div>

					<div
						className={clsx(
							activeStep !== 1
								? 'hidden'
								: 'flex flex-wrap flex-col flex-1 w-full h-full gap-16 min-w-320'
						)}
					>
						<Typography className='text-lg font-semibold leading-tight'>
							Select counselor's info:
						</Typography>
						<div className='min-w-320'>
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

						<div className='min-w-320'>
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

						<div className='min-w-320'>
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
						<div className='flex-1 min-w-320'>
							<Controller
								control={control}
								name='specializedSkills'
								render={({ field }) => (
									<TextField
										{...field}
										label='Specialized Skills'
										fullWidth
										variant='outlined'
										error={!!errors.specializedSkills}
										helperText={
											errors.specializedSkills?.message
										}
									/>
								)}
							/>
						</div>
						<div className='flex-1 min-w-320'>
							<Controller
								control={control}
								name='otherSkills'
								render={({ field }) => (
									<TextField
										{...field}
										label='Other Skills'
										fullWidth
										variant='outlined'
										error={!!errors.otherSkills}
										helperText={errors.otherSkills?.message}
									/>
								)}
							/>
						</div>

						<div className='flex-1 min-w-320'>
							<Controller
								control={control}
								name='achievements'
								render={({ field }) => (
									<TextField
										{...field}
										label='Achievements'
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

						<div className='flex-1 min-w-320'>
							<Controller
								control={control}
								name='workHistory'
								render={({ field }) => (
									<TextField
										{...field}
										label='Work History'
										fullWidth
										variant='outlined'
										error={!!errors.workHistory}
										helperText={errors.workHistory?.message}
									/>
								)}
							/>
						</div>

						<div className='flex flex-col flex-1 gap-16 min-w-320'>
							<div className='flex flex-wrap items-center gap-8'>
								<Typography className='font-semibold'>
									Certifications:{' '}
								</Typography>
								{certificationFields.map(
									(certification, index) => (
										<div className='flex flex-wrap items-center space-y-8'>
											<Chip
												variant='filled'
												label={certification.name}
												key={certification.id}
												onClick={() =>
													handleUpdateCertification(
														certification,
														index
													)
												}
												className='px-16 mx-32 font-semibold w-fit'
											/>
											<IconButton
												onClick={() => {
													removeCertificationField(
														index
													);
												}}
												color='primary'
											>
												<Delete />
											</IconButton>
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

						<div className='flex flex-col flex-1 gap-16 min-w-320'>
							<div className='flex flex-wrap items-center space-y-8'>
								<Typography className='font-semibold'>
									Qualifications:{' '}
								</Typography>

								{qualificationsFields.map(
									(qualification, index) => (
										<div className='flex items-center'>
											<Chip
												variant='filled'
												label={qualification.degree}
												key={qualification.id}
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

					<Box display='flex' justifyContent='space-between' mt={8}>
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
								>
									Confirm
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
				</Paper>
			</form>
		</div>
	);
};

export default CreateAcademicCounselorForm;
