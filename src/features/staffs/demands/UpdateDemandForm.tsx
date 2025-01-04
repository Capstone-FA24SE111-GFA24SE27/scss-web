import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { isDirty, z } from 'zod';
import {
	useGetDemandByIdForStaffQuery,
	useGetMatchCounselorForStudentStaffQuery,
	usePostCreateDemandByStudentIdForStaffMutation,
	usePutUpdateDemandByDemandIdForStaffMutation,
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
	ContentLoading,
	Heading,
	NavLinkAdapter,
	PageSimple,
} from '@/shared/components';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import CounselorListItem from '../counselors/CounselorListItem';
import { Counselor } from '@/shared/types';
import { useAppDispatch, useAppSelector } from '@shared/store';
import useAlertDialog from '@/shared/hooks/form/useAlertDialog';
import { ArrowBack, Close } from '@mui/icons-material';
import {
	clearDemand,
	selectCounselorUpdateDemand,
	selectUpdateDemandCounselorFormData,
	setAdditionalInfo,
	setCauseDescription,
	setContactNote,
	setCounselor,
	setCounselorId,
	setIssueDescription,
	setPriorityLevel,
} from './update-demand-slice';
import { selectCounselor } from '../counselors/counselor-list-slice';

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
});

type FormType = Required<z.infer<typeof schema>>;

const UpdateDemandForm = () => {
	const { demandId } = useParams();
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const counselor = useAppSelector(selectCounselor);
	const initialData = useAppSelector(selectUpdateDemandCounselorFormData);
	const selectedCounselor = useAppSelector(selectCounselorUpdateDemand);
	// const { data: initialData, isLoading: isLoadingInitial } =
	// 	useGetDemandByIdForStaffQuery(demandId, { skip: !demandId });

	const [reason, setReason] = useState(null);

	const routeParams = useParams();
	const isMobile = false;
	const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
	useEffect(() => {
		setRightSidebarOpen(Boolean(routeParams.id));
	}, [routeParams]);

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
	const quickMatchCounselor = quickMatchData?.content[0] || null;

	const {
		control,
		formState,
		watch,
		handleSubmit,
		setValue,
		trigger,
		reset,
	} = useForm<FormType>({
		// @ts-ignore
		defaultValues: {
			contactNote: initialData?.contactNote || '',
			additionalInformation: initialData?.additionalInformation || '',
			causeDescription: initialData?.causeDescription || '',
			counselorId: initialData?.counselor?.id,
			priorityLevel: initialData?.priorityLevel || 'LOW',
			issueDescription: initialData?.issueDescription || '',
		},
		resolver: zodResolver(schema),
	});
	const formData = watch();

	const { isValid, isDirty, errors } = formState;

	const [updateDemand] = usePutUpdateDemandByDemandIdForStaffMutation();

	const onSubmit = () => {
		if (initialData && initialData.demand) {
			updateDemand({
				body: { ...formData },
				counselingDemandId: initialData.demand.id,
			})
				.unwrap()
				.then((result) => {
					if (result.status === 200) {
						useAlertDialog({
							dispatch,
							title: 'Demand updated successfully',
						});
						dispatch(clearDemand());
						navigate('/demand');
					}
				})
				.catch((err) => {
					console.log(err);

					useAlertDialog({
						dispatch,
						title: 'An error occur while updating demand',
						color: 'error',
					});
				});
		}
	};

	const handleSelectCounselor = (counselor: Counselor) => {
		if (counselor) {
			setValue('counselorId', counselor?.profile?.id);
		} else {
			setValue('counselorId', null);
		}
	};

	const handleNavigateViewCounselor = (counselor: Counselor) => {
		if (counselor) {
			navigate(`counselor/${counselor.profile.id}`);
		}
	};

	const handleQuickMatching = () => {
		trigger('issueDescription');
		if (formData.issueDescription) {
			setReason(formData.issueDescription);
		}
	};

	useEffect(() => {
		if (counselor) {
			setValue('counselorId', counselor?.profile?.id);
			dispatch(setCounselorId(counselor?.profile?.id));
			dispatch(setCounselor(counselor));
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

	useEffect(() => {
		if (initialData && !initialData.demand) {
			navigate('/demand');
		}
	}, [initialData]);

	// if (isLoadingInitial) {
	// 	return <ContentLoading />;
	// }

	return (
		<PageSimple
			header={
				<div className='flex flex-col gap-8 px-32 pt-16'>
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
							to='/demand'
							color='inherit'
						>
							<ArrowBack />
							<span className='flex mx-4 font-medium'>
								Demand List
							</span>
						</Button>
					</motion.div>

					<Heading
						title={`Update demand information for student ${initialData?.demand?.student?.profile.fullName}`}
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
			rightSidebarOnClose={() => {
				setRightSidebarOpen(false);
				navigate(-1);
			}}
			rightSidebarVariant='temporary'
			scroll={isMobile ? 'normal' : 'content'}
			content={
				<div className='flex w-full h-full px-32 overflow-hidden'>
					<div className='flex flex-col flex-1 w-full h-full'>
						<Paper className='flex flex-col w-full gap-32 p-32 mt-16 overflow-auto'>
							<div className='flex flex-col w-full gap-16'>
								<div className='flex flex-col items-center gap-16'>
									<div className='flex items-center w-full gap-8'>
										<Button
											variant='outlined'
											component={NavLinkAdapter}
											role='button'
											to='counselors'
											className='px-32 whitespace-nowrap'
										>
											Pick counselor
										</Button>
										<Typography>or</Typography>
										<Button
											variant='outlined'
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
										{selectedCounselor &&
										formData.counselorId ? (
											<>
												<Typography>
													Selected counselor:
												</Typography>
												<CounselorListItem
													counselor={
														selectedCounselor
													}
													onClick={
														handleNavigateViewCounselor
													}
												/>

												<div className='flex flex-wrap gap-8 py-8'>
													<Typography className='font-semibold'>
														Demand type:
													</Typography>
													<Typography>
														{selectedCounselor.expertise
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
													value={field.value}
													onChange={(event) => {
														const value =
															event.target.value;
														field.onChange(value);
														dispatch(setPriorityLevel(value))
													}}
													error={
														!!errors.priorityLevel
													}
													helperText={
														errors.priorityLevel
															?.message
													}
												>
													<MenuItem
														key={'LOW'}
														value={'LOW'}
													>
														Low
													</MenuItem>
													<MenuItem
														key={'MEDIUM'}
														value={'MEDIUM'}
													>
														Medium
													</MenuItem>
													<MenuItem
														key={'HIGH'}
														value={'HIGH'}
													>
														High
													</MenuItem>
													<MenuItem
														key={'URGENT'}
														value={'URGENT'}
													>
														Urgent
													</MenuItem>
												</TextField>
											)}
										/>
									</div>
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
										disabled={
											!counselor ||
											!formData.counselorId ||
											!formData.contactNote ||
											!formData.issueDescription ||
											!formData.causeDescription
										}
										onClick={handleSubmit(onSubmit)}
									>
										Confirm
									</Button>
								</div>
							</div>
						</Paper>
					</div>
				</div>
			}
		/>
	);
};

export default UpdateDemandForm;
