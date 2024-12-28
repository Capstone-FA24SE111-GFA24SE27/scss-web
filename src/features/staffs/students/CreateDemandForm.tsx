import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { z } from 'zod';
import {
	useGetMatchCounselorForStudentStaffQuery,
	usePostCreateDemandByStudentIdForStaffMutation,
} from '../demands/demand-api';
import {
	Button,
	CircularProgress,
	IconButton,
	MenuItem,
	Paper,
	TextField,
	Typography,
} from '@mui/material';
import {
	Heading,
	LoadingButton,
	NavLinkAdapter,
	PageSimple,
	UserLabel,
} from '@/shared/components';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import CounselorPicker from '../counselors/CounselorPicker';
import CounselorListItem from '../counselors/CounselorListItem';
import { Counselor } from '@/shared/types';
import { useDispatch } from 'react-redux';
import { useAppDispatch, useAppSelector } from '@shared/store';
import {
	selectCounselor,
	setSelectedCounselor,
} from '../counselors/counselor-list-slice';
import {
	selectCreateDemandCounselorFormData,
	setAdditionalInfo,
	setCauseDescription,
	setContactNote,
	setIssueDescription,
	setPriorityLevel,
} from './staff-demand-create-slice';
import useAlertDialog from '@/shared/hooks/form/useAlertDialog';
import { ArrowBack, Close } from '@mui/icons-material';
import { useGetStudentFollowStatusQuery } from './followed-list/staff-followed-student-api';
import { useGetStudentDetailQuery } from '@/shared/pages';

const schema = z.object({
	counselorId: z.number().min(1, 'Counselor ID is required'),
	contactNote: z.string().min(1, 'Please enter contact note'),
	priorityLevel: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT'], {
		errorMap: () => ({ message: 'Please select priority level' }),
	}),
	departmentId: z.string().optional(),
	additionalInformation: z
		.string()
		.min(2, 'Please enter valid infomation')
		.optional()
		.or(z.literal('')),
	issueDescription: z.string().min(1, 'Please enter issue description'),
	causeDescription: z.string().min(1, 'Please enter cause description'),
	// demandType: z.enum(['ACADEMIC', 'NON_ACADEMIC'], {
	// 	errorMap: () => ({ message: 'Please select a demand type' }),
	// }),
});

type FormType = Required<z.infer<typeof schema>>;

const CreateDemandForm = () => {
	const { studentId } = useParams();
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const counselor = useAppSelector(selectCounselor);

	const [reason, setReason] = useState(null);

	const createDemandFormData = useAppSelector(
		selectCreateDemandCounselorFormData
	);
	const routeParams = useParams();
	const isMobile = false;
	const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
	useEffect(() => {
		setRightSidebarOpen(Boolean(routeParams.id));
	}, [routeParams]);

	const defaultValues = {
		counselorId: createDemandFormData?.counselorId,
		contactNote: createDemandFormData?.contactNote,
		priorityLevel: createDemandFormData?.priorityLevel,
		additionalInformation: createDemandFormData?.additionalInformation,
		issueDescription: createDemandFormData?.issueDescription,
		causeDescription: createDemandFormData?.causeDescription,
		// demandType: createDemandFormData.matchType
	};

	const { control, formState, watch, handleSubmit, setValue, trigger } =
		useForm<FormType>({
			// @ts-ignore
			defaultValues,
			resolver: zodResolver(schema),
		});
	const formData = watch();

	const { isValid, dirtyFields, errors } = formState;

	const { data: studentStatus, isLoading } = useGetStudentFollowStatusQuery(
		studentId,
		{ skip: !studentId }
	);

	const { data: studentData, isLoading: isLoadingStudentData } =
		useGetStudentDetailQuery(studentId, { skip: !studentId });

	const [createDemand] = usePostCreateDemandByStudentIdForStaffMutation();

	const {
		data: quickMatchData,
		isLoading: isLoadingQuickMatch,
		isError,
		error,
	} = useGetMatchCounselorForStudentStaffQuery(
		{
			reason,
		},
		{ skip: !reason }
	);

	const quickMatchCounselor = quickMatchData?.content || null;
	console.log(error);

	const onSubmit = () => {
		createDemand({
			...formData,
			demandType: counselor.expertise ? 'NON_ACADEMIC' : 'ACADEMIC',
			studentId: studentId,
		})
			.unwrap()
			.then((result) => {
				if (result.status === 200) {
					useAlertDialog({
						dispatch,
						title: 'Demand created successfully',
					});
					navigate(-1);
				}
				console.log('create demand result', result);
			})
			.catch((err) => console.log(err));
	};

	const handleSelectCounselor = (counselor: Counselor) => {
		if (counselor) {
			setValue('counselorId', counselor.profile.id);
			dispatch(setSelectedCounselor(counselor));
		} else {
			setValue('counselorId', null);
			dispatch(setSelectedCounselor(null));
		}
	};

	const handleNavigateViewCounselor = (counselor: Counselor) => {
		if (counselor) {
			navigate(`counselor/${counselor.profile.id}`);
		}
	};

	const handleQuickMatching = () => {
		trigger('issueDescription');
		trigger('causeDescription');
		if (formData.issueDescription && formData.causeDescription) {
			setReason(
				`${formData.issueDescription}\n${formData.causeDescription}`
			);
		}
	};

	useEffect(() => {
		if (counselor) {
			setValue('counselorId', counselor.profile.id);
		}
	}, [counselor]);

	useEffect(() => {
		if (quickMatchCounselor) {
			handleSelectCounselor(quickMatchCounselor);
		}
	}, [quickMatchCounselor]);

	useEffect(() => {
		if (isError) {
			handleSelectCounselor(null);
		}
	}, [isError]);

	if (!studentStatus?.content.followed || !studentStatus?.content.your) {
		return (
			<div className='flex flex-col items-center justify-center gap-8 p-32'>
				<Typography
					className='text-xl font-semibold'
					color='textDisabled'
				>
					This student is not currently followed by you!
				</Typography>
				<Button
					className='flex items-center w-fit'
					component={NavLinkAdapter}
					role='button'
					to='/students/followed'
					color='inherit'
				>
					<ArrowBack />
					<span className='flex mx-4 font-medium'>Go back</span>
				</Button>
			</div>
		);
	}

	return (
		<PageSimple
			header={
				<div className='flex flex-col gap-8 px-32 pt-32'>
					<motion.div
						initial={{ x: 20, opacity: 0 }}
						animate={{
							x: 0,
							opacity: 1,
							transition: { delay: 0.3 },
						}}
					>
						<Button
							className='flex items-center w-fit'
							component={NavLinkAdapter}
							role='button'
							to='/students/followed'
							color='inherit'
						>
							<ArrowBack />
							<span className='flex mx-4 font-medium'>
								Followed Students
							</span>
						</Button>
					</motion.div>

					<Heading
						title={`Create demand for student ${studentData?.content.profile.fullName}`}
						description='Enter the required information'
					/>
				</div>
			}
			rightSidebarContent={
				<div className='relative flex-grow-0 h-screen max-h-screen'>
					<IconButton
						className='absolute top-0 right-0 z-10 m-16 text-white bg-black/30 hover:bg-black/80'
						onClick={() => navigate(-1)}
						size='large'
					>
						<Close />
					</IconButton>

					<Outlet />
				</div>
			}
			rightSidebarOpen={rightSidebarOpen}
			rightSidebarOnClose={() => setRightSidebarOpen(false)}
			rightSidebarVariant='temporary'
			scroll={isMobile ? 'normal' : 'content'}
			content={
				<div className='flex w-full h-full overflow-hidden'>
					<div className='flex flex-col flex-1 w-full h-full'>
						<Paper className='flex flex-col w-full gap-32 p-32 mt-32 overflow-auto'>
							<div className='flex flex-col w-full gap-16'>
								<div className='flex flex-col items-center gap-16'>
									<div className='flex items-center w-full gap-8'>
										{/* <Controller
										control={control}
										name='counselorId'
										render={({ field }) => (
											
										)}
									/> */}
										<Button
											variant='outlined'
											color='secondary'
											className='px-32 whitespace-nowrap'
											onClick={() => {}}
										>
											Pick counselor
										</Button>
										<Typography>or</Typography>
										<Button
											variant='outlined'
											color='secondary'
											className='px-32 whitespace-nowrap'
											onClick={handleQuickMatching}
										>
											Quick match with a counselor
										</Button>
									</div>
									<div className='w-full'>
										{isLoadingQuickMatch && (
											<CircularProgress />
										)}
										{isError && (
											<Typography
												color='textSecondary'
												className='text-sm '
											>
												Cannot find suitable counselor
											</Typography>
										)}
										{counselor && formData.counselorId ? (
											<>
												<Typography>
													Selected counselor:
												</Typography>
												<CounselorListItem
													counselor={counselor}
													onClick={
														handleNavigateViewCounselor
													}
												/>

												<div className='flex flex-wrap gap-8 py-8'>
													<Typography className='font-semibold'>
														Demand type:
													</Typography>
													<Typography>
														{counselor.expertise
															? 'Non academic'
															: 'Academic'}
													</Typography>
												</div>
											</>
										) : (
											<>
												<Typography
													color='error'
													className='text-sm font-semibold'
												>
													Please pick a counselor
												</Typography>
											</>
										)}
									</div>
								</div>

								<div className='flex flex-wrap items-center justify-between gap-16'>
									<div className='flex-1'>
										<Controller
											control={control}
											name='priorityLevel'
											render={({ field }) => (
												<TextField
													{...field}
													select
													label='Priority Level'
													fullWidth
													variant='outlined'
													onChange={(event) => {
														const value =
															event.target.value;
														field.onChange(value);
														dispatch(
															setPriorityLevel(
																value
															)
														);
													}}
													error={
														!!errors.priorityLevel
													}
													helperText={
														errors.priorityLevel
															?.message
													}
												>
													<MenuItem value={'LOW'}>
														Low
													</MenuItem>
													<MenuItem value={'MEDIUM'}>
														Medium
													</MenuItem>
													<MenuItem value={'HIGH'}>
														High
													</MenuItem>
													<MenuItem value={'URGENT'}>
														Urgent
													</MenuItem>
												</TextField>
											)}
										/>
									</div>
									{/* <div className='flex-1'>
									<Controller
										control={control}
										name='demandType'
										render={({ field }) => (
											<TextField
												{...field}
												select
												label='Demand Type'
												variant='outlined'
												error={!!errors.demandType}
												fullWidth
												helperText={
													errors.demandType?.message
												}
											>
												<MenuItem value={'ACADEMIC'}>
													Academic
												</MenuItem>
												<MenuItem
													value={'NON_ACADEMIC'}
												>
													Non Academic
												</MenuItem>
											</TextField>
										)}
									/>
								</div> */}
								</div>

								<div className=''>
									<Controller
										control={control}
										name='contactNote'
										render={({ field }) => (
											<TextField
												{...field}
												label='Contact Note'
												placeholder='Contact Note...'
												multiline
												id='Contact'
												onChange={(
													event: React.ChangeEvent<HTMLInputElement>
												) => {
													const value =
														event.target.value;
													field.onChange(value);
													dispatch(
														setContactNote(value)
													);
												}}
												error={!!errors.contactNote}
												helperText={
													errors?.contactNote?.message
												}
												fullWidth
											/>
										)}
									/>
								</div>

								<div className=''>
									<Controller
										control={control}
										name='issueDescription'
										render={({ field }) => (
											<TextField
												{...field}
												label='Issue Description'
												placeholder='Issue Description...'
												multiline
												id='Issue'
												onChange={(
													event: React.ChangeEvent<HTMLInputElement>
												) => {
													const value =
														event.target.value;
													field.onChange(value);
													dispatch(
														setIssueDescription(
															value
														)
													);
												}}
												error={
													!!errors.issueDescription
												}
												helperText={
													errors?.issueDescription
														?.message
												}
												fullWidth
											/>
										)}
									/>
								</div>

								<div className=''>
									<Controller
										control={control}
										name='causeDescription'
										render={({ field }) => (
											<TextField
												{...field}
												label='Cause Description'
												placeholder='Cause Description...'
												multiline
												id='Cause'
												onChange={(
													event: React.ChangeEvent<HTMLInputElement>
												) => {
													const value =
														event.target.value;
													field.onChange(value);
													dispatch(
														setCauseDescription(
															value
														)
													);
												}}
												error={
													!!errors.causeDescription
												}
												helperText={
													errors?.causeDescription
														?.message
												}
												fullWidth
											/>
										)}
									/>
								</div>

								<div className=''>
									<Controller
										control={control}
										name='additionalInformation'
										render={({ field }) => (
											<TextField
												{...field}
												label='Additional Information'
												placeholder='Additional Information...'
												multiline
												id='Additional info'
												onChange={(
													event: React.ChangeEvent<HTMLInputElement>
												) => {
													const value =
														event.target.value;
													field.onChange(value);
													dispatch(
														setAdditionalInfo(value)
													);
												}}
												error={
													!!errors.additionalInformation
												}
												helperText={
													errors
														?.additionalInformation
														?.message
												}
												fullWidth
											/>
										)}
									/>
								</div>

								<div className='flex items-center justify-end mt-32'>
									<Button
										className='mx-8'
										onClick={() => navigate(-1)}
									>
										Cancel
									</Button>
									<Button
										variant='contained'
										color='secondary'
										// disabled={
										// 	!counselor ||
										// 	!formData.counselorId ||
										// 	!formData.contactNote ||
										// 	!formData.issueDescription ||
										// 	!formData.causeDescription ||
										// 	!formData.priorityLevel
										// }
										onClick={handleSubmit(onSubmit)}
									>
										Confirm
									</Button>
								</div>
							</div>
						</Paper>
					</div>
					{/* )} */}
				</div>
			}
		/>
	);
};

export default CreateDemandForm;
