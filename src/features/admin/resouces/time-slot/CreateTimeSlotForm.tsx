import React, { useEffect, useState } from 'react';
import {
	useGetTimeSlotByIdQuery,
	usePostCreateTimeSlotMutation,
	usePutUpdateTimeSlotMutation,
} from './time-slot-api';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Paper, TextField, Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { TimePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { useAlertDialog } from '@/shared/hooks';
import { useAppDispatch } from '@shared/store';

const schema = z.object({
	slotCode: z.string().min(1, 'Slot Code is required'),
	startTime: z
		.string()
		.refine((value) => /^([01]\d|2[0-3]):[0-5]\d:[0-5]\d$/.test(value), {
			message: 'Valid slot start time is required.',
		}),

	endTime: z
		.string()
		.refine((value) => /^([01]\d|2[0-3]):[0-5]\d:[0-5]\d$/.test(value), {
			message: 'Valid slot end time is required.',
		}),

	name: z.string().min(1, 'Slot name is required'),
});

type FormType = Required<z.infer<typeof schema>>;

const CreateTimeSlotForm = () => {
	const navigate = useNavigate();
	const { id } = useParams();

	const [createTimeSlot] = usePostCreateTimeSlotMutation();
	const [updateTimeSlot] = usePutUpdateTimeSlotMutation();

	const { data, isLoading } = useGetTimeSlotByIdQuery(id, { skip: !id });

	const initialData = data?.content;

	const defaultValues = {
		slotCode: initialData?.slotCode || '',
		startTime: initialData?.startTime || '',
		endTime: initialData?.endTime || '',
		name: initialData?.name || '',
	};

	const { control, formState, watch, handleSubmit, setValue, reset } =
		useForm<FormType>({
			// @ts-ignore
			defaultValues,
			resolver: zodResolver(schema),
		});
	const formData = watch();
	const dispatch = useAppDispatch();

	const { isValid, dirtyFields, errors } = formState;

	const onSubmit = () => {
		if (id) {
			updateTimeSlot({
				id,
				slotCode: formData.slotCode,
				name: formData.name,
				startTime: formData.startTime,
				endTime: formData.endTime,
			})
				.unwrap()
				.then((res) => {
					if (res && res.status === 200) {
						useAlertDialog({
							dispatch,
							title: 'Time slot updated successfully',
						});
					}
					navigate(-1);
				})
				.catch((err) => {
					console.log('err updating time slot', err);
					useAlertDialog({
						dispatch,
						title: 'An error occur while updating time slots',
						color: 'error',
					});
				});
		} else {
			createTimeSlot({
				slotCode: formData.slotCode,
				name: formData.name,
				startTime: formData.startTime,
				endTime: formData.endTime,
			})
				.unwrap()
				.then((res) => {
					if (res && res.status === 201) {
						useAlertDialog({
							dispatch,
							title: 'Time slot created successfully',
						});
					}
					navigate(-1);
				})
				.catch((err) => {
					console.log('err creating time slot', err);
					useAlertDialog({
						dispatch,
						title: 'An error occur while creating time slots',
						color: 'error',
					});
				});
		}
	};

	useEffect(() => {
		if (!isLoading && data && data.content) {
			reset(data.content);
		}
	}, [isLoading]);

	return (
		<div className='flex w-full h-full p-16 pt-32'>
			<div className='flex flex-col w-full max-w-4xl'>
				<Paper className='container flex flex-col flex-auto gap-32 p-32 mt-32'>
					<div className=''>
						<Typography className='text-2xl font-bold tracking-tight'>
							{id !== undefined
								? 'Update time slot'
								: 'Create new time slot'}
						</Typography>
					</div>
					<div className='flex flex-col w-full gap-16'>
						<div className=''>
							<Controller
								control={control}
								name='name'
								render={({ field }) => (
									<TextField
										{...field}
										label='Slot name'
										placeholder='Name...'
										id='Slot name'
										error={!!errors.name}
										helperText={errors?.name?.message}
										fullWidth
									/>
								)}
							/>
						</div>

						<div className=''>
							<Controller
								control={control}
								name='slotCode'
								render={({ field }) => (
									<TextField
										{...field}
										label='Slot Code'
										placeholder='Slot Code...'
										id='Slot code'
										error={!!errors.slotCode}
										helperText={errors?.slotCode?.message}
										fullWidth
									/>
								)}
							/>
						</div>

						<div className='flex flex-wrap items-start gap-16'>
							<Controller
								control={control}
								name='startTime'
								render={({ field }) => (
									<TimePicker
										value={dayjs(field.value, 'HH:mm:ss')}
										label='Start time'
										onChange={(newValue) => {
											console.log('startTime', newValue);
											field.onChange(
												newValue.format('HH:mm:ss')
											);
										}}
									/>
								)}
							/>
							<Controller
								control={control}
								name='endTime'
								render={({ field }) => (
									<TimePicker
										value={dayjs(field.value, 'HH:mm:ss')}
										slotProps={{
											textField: {
												helperText:
													'End time must be at least 30 minutes after start time',
											},
										}}
										label='End time'
										minTime={
											formData &&
											dayjs(
												formData.startTime,
												'HH:mm:ss'
											).add(30, 'minute')
										}
										onChange={(newValue) => {
											field.onChange(
												newValue.format('HH:mm:ss')
											);
										}}
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
									!formData.name ||
									!formData.slotCode ||
									!formData.startTime ||
									!formData.endTime
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
	);
};

export default CreateTimeSlotForm;
