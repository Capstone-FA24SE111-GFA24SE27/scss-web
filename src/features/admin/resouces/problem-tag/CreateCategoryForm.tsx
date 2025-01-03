import { zodResolver } from '@hookform/resolvers/zod';
import { Button, MenuItem, Paper, TextField, Typography } from '@mui/material';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { z } from 'zod';
import {
	usePostProblemTagsCategoryMutation,
	useUpdateProblemTagsCategoryMutation,
} from './problem-tag-api';
import { useAlertDialog } from '@/shared/hooks';
import { useAppDispatch, useAppSelector } from '@shared/store';
import {
	selectProblemTagCategoryUpdate,
	setProblemTagCategoryUpdate,
} from '../admin-resource-slice';

const schema = z.object({
	name: z.string().min(1, 'Please enter category name'),
});

type FormType = Required<z.infer<typeof schema>>;

const CreateCategoryForm = () => {
	const navigate = useNavigate();
	const { id } = useParams();
	const initial = useAppSelector(selectProblemTagCategoryUpdate);
	console.log(initial)
	const defaultValues = {
		name: initial?.name || '',
	};

	const { control, formState, watch, handleSubmit, setValue } =
		useForm<FormType>({
			// @ts-ignore
			defaultValues,
			resolver: zodResolver(schema),
		});
	const formData = watch();

	const { isValid, dirtyFields, errors } = formState;

	const [createCategory] = usePostProblemTagsCategoryMutation();
	const [updateCategory] = useUpdateProblemTagsCategoryMutation();
	const dispatch = useAppDispatch();

	const onSubmit = () => {
		if (id) {
			updateCategory({ name: formData.name, id })
				.unwrap()
				.then((result) => {
					if (result.status === 200) {
						useAlertDialog({
							dispatch,
							title: 'Category updated successfully',
						});
						dispatch(setProblemTagCategoryUpdate(null));
						navigate(-1);
					}
				})
				.catch((err) => {
					console.log(err);
					useAlertDialog({
						dispatch,
						title: 'An error occur while updating category',
						color: 'error',
					});
				});
		} else {
			createCategory({ name: formData.name })
				.unwrap()
				.then((result) => {
					if (result.status === 200) {
						useAlertDialog({
							dispatch,
							title: 'Category created successfully',
						});
						navigate(-1);
					}
					console.log('create category result', result);
				})
				.catch((err) => {
					console.log(err);
					useAlertDialog({
						dispatch,
						title: 'An error occur while creating category',
						color: 'error',
					});
				});
		}
	};

	return (
		<div className='flex flex-col w-full max-w-4xl p-16'>
			<div className='mt-32 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl'>
				{id
					? 'Update Problem Tag Category'
					: 'Create Problem Tag Category'}
			</div>

			<Paper className='container flex flex-col flex-auto gap-32 p-32 mt-32'>
				<div className=''>
					<Typography className='text-2xl font-bold tracking-tight'>
						Enter category name
					</Typography>
				</div>
				<div className='flex flex-col w-full gap-16'>
					<Controller
						control={control}
						name='name'
						render={({ field }) => (
							<TextField
								{...field}
								label='Category Name'
								placeholder='Category Name...'
								id='category name'
								error={!!errors.name}
								helperText={errors?.name?.message}
								fullWidth
							/>
						)}
					/>

					<div className='flex items-center justify-end mt-32'>
						<Button className='mx-8' onClick={() => navigate(-1)}>
							Cancel
						</Button>
						<Button
							variant='contained'
							color='secondary'
							disabled={false}
							onClick={handleSubmit(onSubmit)}
						>
							Confirm
						</Button>
					</div>
				</div>
			</Paper>
		</div>
	);
};

export default CreateCategoryForm;
