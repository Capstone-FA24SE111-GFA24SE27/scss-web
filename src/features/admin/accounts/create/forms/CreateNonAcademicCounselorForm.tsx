import {
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
	Paper,
	Step,
	StepLabel,
	Stepper,
	styled,
	TextField,
	Typography,
} from '@mui/material';
import React, { MouseEvent, useEffect, useState } from 'react';
import { Controller, FieldArrayWithId, useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';
import { usePostCreateNonAcademicCounselorAccountMutation } from '../../admin-accounts-api';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { useAppSelector } from '@shared/store';
import { clearEnteredValueByTab, selectEnteredValues, selectInitialValues, setEnteredValueByTab } from './create-account-slice';
import { useAppDispatch } from '@shared/store';
import useAlertDialog from '@/shared/hooks/form/useAlertDialog';
import clsx from 'clsx';
import CertificationAppendForm from './CertificationAppendForm';
import QualificationAppendForm from './QualificationAppendForm';
import { openDialog } from '@/shared/components';



const steps = [
	{
		id: 'Step 1',
		name: 'Account Information',
		fields: [
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
		name: 'Expertise Information',
		fields: ['expertiseId'],
	},
	{
		id: 'Step 3',
		name: 'Relevant Skills',
		fields: [
			'otherSkills',
			'workHistory',
			'achievements',
			'qualifications',
			'certifications'
		],
	},
];

const currentYear = dayjs().year()

const schema = z.object({
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
		const year = dayjs(date).year()
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
	const [activeStep, setActiveStep] = useState(0);

	const { control,
		formState,
		watch,
		handleSubmit,
		setValue,
		reset,
		trigger,
		getValues,} =
		useForm<FormType>({
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

	type FieldName = keyof FormType
	

	const handleNext = async (e: MouseEvent<HTMLButtonElement>) => {
		const fields = steps[activeStep].fields
		const result = await trigger(fields as FieldName[], { shouldFocus: true })

		if (!result) return

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

	useEffect(()=>{
		console.log(formData) 

	},[formData])

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
				// onKeyDown={(e) => {
				// 	if (e.key === 'Enter') {
				// 		e.preventDefault();
				// 		handleSubmit(onSubmit)();
				// 	}
				// }}
			>
				<Paper className='flex flex-col w-full gap-32 p-32 mt-16'>
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
											value={field.value ? dayjs(field.value) : null}
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
												field.onChange(dayjs(date).format('YYYY-MM-DD'));
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
										multiline
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
										multiline
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

						<div className='flex-1 min-w-320'>
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

export default CreateNonAcademicCounselorForm;
