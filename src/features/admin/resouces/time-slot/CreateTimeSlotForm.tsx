import React, { useEffect, useState } from 'react';
import { usePostCreateTimeSlotMutation } from './time-slot-api';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Paper, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { TimePicker } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';

const schema = z.object({
	slotCode: z.string().min(1, 'Counselor ID is required'),
	startTime: z
		.instanceof(dayjs as unknown as typeof Dayjs)
		.transform((time) => {
			console.log('parsing', {
				hour: time.hour(),
				minute: time.minute(),
				second: time.second(),
			});
			return {
				hour: time.hour(),
				minute: time.minute(),
				second: time.second(),
			};
		}),
	endTime: z
		.instanceof(dayjs as unknown as typeof Dayjs)
		.transform((time) => {
			console.log('parsing', {
				hour: time.hour(),
				minute: time.minute(),
				second: time.second(),
			});
			return {
				hour: time.hour(),
				minute: time.minute(),
				second: time.second(),
			};
		}),
	name: z.string().min(1, 'Counselor ID is required'),
});

type FormType = Required<z.infer<typeof schema>>;

const CreateTimeSlotForm = () => {
	const navigate = useNavigate();
	const [createTimeSlot] = usePostCreateTimeSlotMutation();
	const defaultValues = {
		counselorId: '',
		summarizeNote: '',
		contactNote: '',
	};

	const { control, formState, watch, handleSubmit, setValue } =
		useForm<FormType>({
			// @ts-ignore
			defaultValues,
			resolver: zodResolver(schema),
		});
	const formData = watch();

	const { isValid, dirtyFields, errors } = formState;

	const onSubmit = () => {
		// createTimeSlot({
		// 	slotCode: formData.slotCode,
		// 	name: formData.name,
		// 	startTime: {
		//         hour:
		//         minute:
		//         second:
		//     },
		// 	endTime: {
		//     },
		// })
		// 	.unwrap()
		// 	.then(() => navigate(-1));
	};

	useEffect(() => {
		console.log(formData.startTime);
	}, [formData.startTime]);

	return (
		<div className='flex w-full h-full p-16 pt-32'>
			<div className='flex flex-col w-full max-w-4xl'>
				<div className='mt-32 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl'>
					Assign a Counselor to a Demand
				</div>

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
										label='Name'
										placeholder='Name...'
										multiline
										rows={1}
										id='Reason'
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
										multiline
										rows={1}
										id='Reason'
										error={!!errors.slotCode}
										helperText={errors?.slotCode?.message}
										fullWidth
									/>
								)}
							/>
						</div>

						<div className='flex flex-wrap items-center gap-16'>
							<Controller
								control={control}
								name='startTime'
								render={({ field }) => (
									<TimePicker {...field} label='Start time' />
								)}
							/>
							<Controller
								control={control}
								name='endTime'
								render={({ field }) => (
									<TimePicker {...field} label='End time' />
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
