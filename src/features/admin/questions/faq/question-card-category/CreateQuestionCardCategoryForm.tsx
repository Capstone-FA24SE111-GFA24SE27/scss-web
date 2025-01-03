import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, MenuItem, Paper, TextField, Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { TimePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { useAlertDialog } from '@/shared/hooks';
import { useAppDispatch } from '@shared/store';
import {
	useGetContributedQuestionCardCategoryByIdQuery,
	usePostCreateQuestionCategoryAdminMutation,
	usePutUpdateQuestionCategoryAdminMutation,
} from '../question-card-api';

const schema = z.object({
	name: z.string().min(1, 'Please enter category name'),
	type: z.enum(['ACADEMIC', 'NON_ACADEMIC']),
});

type FormType = Required<z.infer<typeof schema>>;

const CreateTimeSlotForm = () => {
	const { id } = useParams();
	const navigate = useNavigate();

	const { data: initialCategoryData, isLoading } =
		useGetContributedQuestionCardCategoryByIdQuery(id, { skip: !id });

	const defaultValues = {
		name: '',
		type: 'ACADEMIC',
	};

	const { control, formState, watch, handleSubmit, setValue, reset } =
		useForm<FormType>({
			// @ts-ignore
			defaultValues,
			resolver: zodResolver(schema),
		});
	const formData = watch();
	const dispatch = useAppDispatch();

	const [createCategory] = usePostCreateQuestionCategoryAdminMutation();
	const [updateCategory] = usePutUpdateQuestionCategoryAdminMutation();

	const { isValid, dirtyFields, errors } = formState;

	const onSubmit = () => {
		if (id) {
			updateCategory({ id: id, ...formData })
				.unwrap()
				.then((result) => {
					if (result.status === 200) {
						useAlertDialog({
							dispatch,
							title: 'Update category successfully',
						});
						navigate(-1);
					}
				})
				.catch((err) => {
					console.log(err);
					useAlertDialog({
						dispatch,
						title: 'Error while updating category',
					});
				});
		} else {
			createCategory({ ...formData })
				.unwrap()
				.then((result) => {
					if (result.status === 201) {
						useAlertDialog({
							dispatch,
							title: 'Category created successfully',
						});
						navigate(-1);
					}
				})
				.catch((err) => console.log(err));
		}
	};

	useEffect(() => {
		if (!isLoading && initialCategoryData) {
			reset(initialCategoryData.content);
		}
	}, [isLoading]);

	return (
		<div className='flex w-full h-full p-16 pt-32'>
			<div className='flex flex-col w-full max-w-4xl'>
				<Paper className='container flex flex-col flex-auto gap-32 p-32 mt-32'>
					<div className=''>
						<Typography className='text-2xl font-bold tracking-tight'>
							{id
								? 'Update question category'
								: 'Create new question category'}
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
								name='type'
								render={({ field }) => (
									<TextField
										{...field}
										select
										label='Type'
										variant='outlined'
										fullWidth
										error={!!errors.type}
										helperText={errors.type?.message}
									>
										<MenuItem
											key={'Academic'}
											value={'ACADEMIC'}
										>
											{'Academic'}
										</MenuItem>

										<MenuItem
											key={'Non Academic'}
											value={'NON_ACADEMIC'}
										>
											{'Non Academic'}
										</MenuItem>
									</TextField>
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
