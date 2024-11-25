import { zodResolver } from '@hookform/resolvers/zod';
import {
	Autocomplete,
	Button,
	MenuItem,
	Paper,
	TextField,
	Typography,
} from '@mui/material';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { z } from 'zod';
import {
	useGetProblemTagsCategoriesQuery,
	usePostProblemTagMutation,
} from './problem-tag-api';
import { useAppDispatch } from '@shared/store';
import { useAlertDialog } from '@/shared/hooks';

const schema = z.object({
	name: z.string().min(1, 'Please enter problem tag name'),
	point: z.number().min(0, 'Pleaser enter problem tag point'),
	category: z.object({
		id: z.number(),
		name: z.string(),
	}),
});

type FormType = Required<z.infer<typeof schema>>;

const CreateProblemTagForm = () => {
	const navigate = useNavigate();

	const { data: categories, isLoading } = useGetProblemTagsCategoriesQuery(
		{}
	);

	const defaultValues = {
		name: '',
		point: 0,
		categoryId: null,
	};

	const { control, formState, watch, handleSubmit, setValue } =
		useForm<FormType>({
			// @ts-ignore
			defaultValues,
			resolver: zodResolver(schema),
		});
	const formData = watch();

	const { isValid, dirtyFields, errors } = formState;

	const [createProblemTag] = usePostProblemTagMutation();
	const dispatch = useAppDispatch();

	const onSubmit = () => {
		console.log({
			name: formData.name,
			point: formData.point,
			categoryId: formData.category.id,
		})
		createProblemTag({
			name: formData.name,
			point: formData.point,
			categoryId: formData.category.id,
		})
			.unwrap()
			.then((result) => {
				if (result.status === 200) {
					useAlertDialog({
						dispatch,
						title: 'Problem tag created successfully',
					});
					navigate(-1);
				}
				console.log('create pt result', result);
			})
			.catch((err) => console.log(err));
	};

	return (
		<div className='flex flex-col w-full max-w-4xl p-16'>
			<div className='mt-32 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl'>
				Create Problem Tag
			</div>

			<Paper className='container flex flex-col flex-auto gap-32 p-32 mt-32'>
				<div className=''>
					<Typography className='text-2xl font-bold tracking-tight'>
						Enter problem tag information
					</Typography>
				</div>
				<div className='flex flex-col w-full gap-16'>
					<Controller
						control={control}
						name='name'
						render={({ field }) => (
							<TextField
								{...field}
								label='Problem Tag Name'
								placeholder='Problem Tag Name...'
								id='problem tag name'
								error={!!errors.name}
								helperText={errors?.name?.message}
								fullWidth
							/>
						)}
					/>
					<Controller
						control={control}
						name='point'
						render={({ field }) => (
							<TextField
								{...field}
								onChange={(e)=>{
									field.onChange(Number.parseInt(e.target.value))
								}}
								label='Point'
								placeholder='Point...'
								id='point'
								type='number'
								error={!!errors?.point}
								helperText={errors?.point?.message}
								fullWidth
							/>
						)}
					/>
					<Controller
						control={control}
						name='category'
						render={({ field }) => (
							<Autocomplete
								{...field}
								disablePortal
								options={categories}
								getOptionLabel={(option) => option.name}
								onChange={(_, value) => {
									field.onChange(value);
									console.log(field.value)
								}}
								value={field.value || null}
								renderInput={(params) => (
									<TextField
										{...params}
										label='Category'
										placeholder='Category...'
										id='category '
										error={!!errors.category}
										helperText={errors?.category?.message}
										fullWidth
									/>
								)}
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

export default CreateProblemTagForm;
