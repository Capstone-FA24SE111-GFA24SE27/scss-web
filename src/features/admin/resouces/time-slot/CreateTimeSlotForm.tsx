import React, { useEffect, useState } from 'react';
import { usePostCreateTimeSlotMutation } from './time-slot-api';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Paper, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { TimePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { useAlertDialog } from '@/shared/hooks';
import { useAppDispatch } from '@shared/store';

const schema = z.object({
	slotCode: z.string().min(1, 'Slot Code is required'),
	startTime: z.string().min(6, 'Time is required'),

	endTime: z.string().min(6, 'Time is required'),

	name: z.string().min(1, 'Slot name is required'),
});

type FormType = Required<z.infer<typeof schema>>;

const CreateTimeSlotForm = () => {
	const navigate = useNavigate();
	const [createTimeSlot] = usePostCreateTimeSlotMutation();
	const defaultValues = {
		slotCode: '',
		startTime: '',
		endTime: '',
		name: '',
	};

	const { control, formState, watch, handleSubmit, setValue } =
		useForm<FormType>({
			// @ts-ignore
			defaultValues,
			resolver: zodResolver(schema),
		});
	const formData = watch();
	const dispatch = useAppDispatch();

	const { isValid, dirtyFields, errors } = formState;

	const onSubmit = () => {
		// useAlertDialog({
		// 	dispatch,
		// 	title: 'Time slot created successfully',
		// });
		// navigate(-1);
		createTimeSlot({
			slotCode: formData.slotCode,
			name: formData.name,
			startTime: {
				hour: dayjs(formData.startTime).hour(),
				minute: dayjs(formData.startTime).minute(),
				second: 0,
				nano: 0,
			},
			endTime: {
				hour: dayjs(formData.endTime).hour(),
				minute: dayjs(formData.endTime).minute(),
				second: 0,
				nano: 0,
			},
		})
			.unwrap()
			.then((res) => {})
			.catch((err) => console.log('err creating time slot', err));
	};

	useEffect(() => {
		console.log(formData.startTime);
	}, [formData.startTime]);

	return (
		<div className='flex w-full h-full p-16 pt-32'>
			<div className='flex flex-col w-full max-w-4xl'>
				<Paper className='container flex flex-col flex-auto gap-32 p-32 mt-32'>
					<div className=''>
						<Typography className='text-2xl font-bold tracking-tight'>
							Create new time slot
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
										value={dayjs(field.value)}
										label='Start time'
										onChange={(newValue) => {
											console.log('startTime', newValue);
											field.onChange(newValue.format());
										}}
									/>
								)}
							/>
							<Controller
								control={control}
								name='endTime'
								render={({ field }) => (
									<TimePicker
										value={dayjs(field.value)}
										slotProps={{
											textField: {
												helperText:
													'End time must be at least 30 minutes after start time',
											},
										}}
										label='End time'
										minTime={
											formData &&
											dayjs(formData.startTime).add(
												30,
												'minute'
											)
										}
										onChange={(newValue) => {
											console.log('endtime', newValue);
											field.onChange(newValue.format());
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
									!dayjs(formData.startTime).isValid() ||
									!dayjs(formData.endTime).isValid()
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
