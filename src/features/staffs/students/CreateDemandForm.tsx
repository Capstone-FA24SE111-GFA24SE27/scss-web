import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { z } from 'zod';
import {
	usePostCreateDemandByStudentIdForStaffMutation,
} from '../demands/demand-api';
import { Button, MenuItem, Paper, TextField, Typography } from '@mui/material';
import { NavLinkAdapter, UserLabel } from '@/shared/components';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { debounce } from 'lodash';
import CounselorPicker from '../counselors/CounselorPicker';
import CounselorListItem from '../counselors/CounselorListItem';
import { Counselor } from '@/shared/types';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '@shared/store';
import {
	selectCounselor,
	setSelectedCounselor,
} from '../counselors/counselor-list-slice';

const schema = z.object({
	counselorId: z.number().min(1, 'Counselor ID is required'),
	contactNote: z.string().min(1, 'Please enter contact note'),
	priorityLevel: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT'], {
		errorMap: () => ({ message: 'Please select priority level' }),
	}),
	departmentId: z.string().optional(),
	additionalInformation: z
		.string()
		.min(4, 'Please enter a valid value')
		.optional()
		.or(z.literal('')),
	issueDescription: z.string().min(1, 'Please enter issue description'),
	causeDescription: z.string().min(1, 'Please enter cause description'),
	demandType: z.enum(['ACADEMIC', 'NON_ACADEMIC'], {
		errorMap: () => ({ message: 'Please select a demand type' }),
	}),
});

type FormType = Required<z.infer<typeof schema>>;

const CreateDemandForm = () => {
	const { id: studentId } = useParams();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const counselor = useAppSelector(selectCounselor);

	const [showCounselorsList, setShowCounselorsList] = useState(false);

	const defaultValues = {
		counselorId: '',
		contactNote: '',
		priorityLevel: 'MEDIUM',
		additionalInformation: '',
		issueDescription: '',
		causeDescription: '',
		demandType: 'ACADEMIC',
	};

	const { control, formState, watch, handleSubmit, setValue } =
		useForm<FormType>({
			// @ts-ignore
			defaultValues,
			resolver: zodResolver(schema),
		});
	const formData = watch();

	const { isValid, dirtyFields, errors } = formState;

	const [createDemand] = usePostCreateDemandByStudentIdForStaffMutation();

	const onSubmit = () => {
		createDemand({
			...formData,
			studentId: studentId
		})
			.unwrap()
			.then(() => navigate(-1))
			.catch((err) => console.log(err));
	};

	const toggleShowCounselorsList = () => {
		setShowCounselorsList((prev) => !prev);
	};

	const handleNavigateViewCounselor = (counselor: Counselor) => {
		if (counselor) {
			navigate(`/student-list/counselor/${counselor.profile.id}`);
		}
	};

	useEffect(() => {
		if (counselor) {
			setValue('counselorId', counselor.profile.id);
		}
	}, [counselor]);

	return (
		<div className='flex w-full h-full p-16 '>
			{showCounselorsList ? (
				<div className='relative flex flex-col flex-1 max-w-4xl max-h-full gap-8 pt-52'>
					<Button
						className='absolute left-0 top-6 aspect-square'
						onClick={toggleShowCounselorsList}
					>
						Back
					</Button>
					<CounselorPicker
						onPickCounselor={(counselor: Counselor) => {
							setValue('counselorId', counselor.profile.id);
							dispatch(setSelectedCounselor(counselor));
							toggleShowCounselorsList();
						}}
					/>
				</div>
			) : (
				<div className='flex flex-col w-full max-w-4xl'>
					<div className='mt-32 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl'>
						Create demand for student
					</div>

					<Paper className='container flex flex-col flex-auto gap-32 p-32 mt-32'>
						<div className=''>
							<Typography className='text-2xl font-bold tracking-tight'>
								Submit your demand request
							</Typography>
							<Typography color='text.secondary'>
								The demand request will be sent to the selected
								counselor
							</Typography>
						</div>
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
										onClick={toggleShowCounselorsList}
									>
										Pick counselor
									</Button>
								</div>
								<div className='w-full'>
									{counselor && formData.counselorId ? (
										<CounselorListItem
											counselor={counselor}
											onClick={
												handleNavigateViewCounselor
											}
										/>
									) : (
										<Typography
											color='textSecondary'
											className='text-sm'
										>
											Counselor not found
										</Typography>
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
												error={!!errors.priorityLevel}
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
								<div className='flex-1'>
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
											rows={2}
											id='Contact'
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
											rows={2}
											id='Issue'
											error={!!errors.issueDescription}
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
											rows={2}
											id='Cause'
											error={!!errors.causeDescription}
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
											rows={2}
											id='Additional infor'
											error={
												!!errors.additionalInformation
											}
											helperText={
												errors?.additionalInformation
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
										!formData.causeDescription ||
										!formData.demandType ||
										!formData.priorityLevel
									}
									onClick={handleSubmit(onSubmit)}
								>
									Confirm
								</Button>
							</div>
						</div>
					</Paper>
				</div>
			)}
		</div>
	);
};

export default CreateDemandForm;
