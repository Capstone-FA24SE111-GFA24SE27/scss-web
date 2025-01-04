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
import {
	selectCounselor,
	setSelectedCounselor,
} from '../counselors/counselor-list-slice';
import useAlertDialog from '@/shared/hooks/form/useAlertDialog';
import { ArrowBack, Close } from '@mui/icons-material';

const schema = z.object({
	contactNote: z.string().min(1, 'Please enter contact note'),
	additionalInformation: z
		.string()
		.min(2, 'Please enter valid infomation')
		.optional()
		.or(z.literal('')),
	causeDescription: z.string().min(1, 'Please enter cause description'),
});

type FormType = Required<z.infer<typeof schema>>;

const UpdateDemandForm = () => {
	const { demandId } = useParams();
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const counselor = useAppSelector(selectCounselor);

	const { data: initialData, isLoading: isLoadingInitial } =
		useGetDemandByIdForStaffQuery(demandId, { skip: !demandId });

	const [reason, setReason] = useState(null);

	const routeParams = useParams();
	const isMobile = false;
	const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
	useEffect(() => {
		setRightSidebarOpen(Boolean(routeParams.id));
	}, [routeParams]);

	const defaultValues = {
		contactNote: initialData?.contactNote || '',
		additionalInformation: initialData?.additionalInformation || '',
		causeDescription: initialData?.causeDescription || '',
	};

	const { control, formState, watch, handleSubmit, setValue, trigger } =
		useForm<FormType>({
			// @ts-ignore
			defaultValues,
			resolver: zodResolver(schema),
		});
	const formData = watch();

	const { isValid, isDirty, errors } = formState;

	const [updateDemand] = usePutUpdateDemandByDemandIdForStaffMutation();

	const onSubmit = () => {
		updateDemand({
			body: { ...formData },
			counselingDemandId: demandId,
		})
			.unwrap()
			.then((result) => {
				if (result.status === 200) {
					useAlertDialog({
						dispatch,
						title: 'Demand updated successfully',
					});
					navigate(-1);
				}
			})
			.catch((err) => {
				console.log(err);

				useAlertDialog({
					dispatch,
					title: 'An error occur while updating demand',
					color: 'error',
				});
				navigate(-1);
			});
	};

	if (isLoadingInitial) {
		return <ContentLoading />;
	}

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
						title={`Update demand information for student ${initialData?.student?.profile.fullName}`}
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
				<div className='flex w-full h-full p-32 pt-0 overflow-hidden'>
					<div className='flex flex-col flex-1 w-full h-full'>
						<Paper className='flex flex-col w-full gap-32 p-32 mt-32 overflow-auto'>
							<div className='flex flex-col w-full gap-16'>

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

								<div className='flex items-center justify-end '>
									<Button
										className='mx-8'
										onClick={() => navigate(-1)}
									>
										Cancel
									</Button>
									<Button
										variant='contained'
										color='secondary'
										disabled={!isDirty}
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

export default UpdateDemandForm;
