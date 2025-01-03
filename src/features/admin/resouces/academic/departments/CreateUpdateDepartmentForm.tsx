import { closeDialog, Heading, NavLinkAdapter } from '@/shared/components';
import { Department } from '@/shared/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, TextField } from '@mui/material';
import { motion } from 'framer-motion';
import { useAppDispatch } from '@shared/store';
import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import {
	useGetDepartmentByIdQuery,
	usePostCreateDepartmentByIdAdminMutation,
	usePutUpdateDepartmentByIdAdminMutation,
} from '../academic-data-admin-api';
import _, { initial } from 'lodash';
import { useAlertDialog } from '@/shared/hooks';
import { ArrowBack } from '@mui/icons-material';
import { navigateUp } from '@/shared/utils';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

const schema = z.object({
	id: z.union([z.string(), z.number()]).optional(),
	name: z.string().min(1, 'Please enter department name'),
	code: z.string().min(1, 'Please enter department code'),
});

type FormType = Required<z.infer<typeof schema>>;
type Props = {
	departmentInfo?: Department;
};

const CreateUpdateDepartmentForm = (props: Props) => {
	const { departmentInfo } = props;
	const { id } = useParams();
	console.log('id', id);
	const dispatch = useAppDispatch();
	const location = useLocation();
	const navigate = useNavigate();

	const { data: fetchedDepartment, isLoading: isLoadingInitial } =
		useGetDepartmentByIdQuery(id, { skip: !id });

	const initialDepartmentInfo = departmentInfo;

	const defaultValues = initialDepartmentInfo
		? initialDepartmentInfo
		: {
				name: '',
				code: '',
		  };

	const { handleSubmit, control, formState, watch, reset } =
		useForm<FormType>({
			resolver: zodResolver(schema),
			defaultValues,
			mode: 'onChange',
		});

	const formData = watch();

	const { isValid, isDirty, errors } = formState;

	const [updateDepartment] = usePutUpdateDepartmentByIdAdminMutation();
	const [addDepartment] = usePostCreateDepartmentByIdAdminMutation();
	const handleSubmitForm = (data: FormType) => {
		if (isDirty && isValid) {
			if (initialDepartmentInfo || id !== undefined) {
				updateDepartment({
					...data,
				})
					.unwrap()
					.then((res) => {
						if (schema.safeParse(res).success) {
							useAlertDialog({
								dispatch,
								title: 'Update department successfully',
							});
						} else {
							useAlertDialog({
								dispatch,
								title: 'result not type of department',
							});
						}
						navigate(-1);
					})
					.catch((err) => {
						console.error('Error update department', err);
						useAlertDialog({
							dispatch,
							title: 'Error updating department',
							color: 'error',
						});
						navigate(-1);
					});
			} else {
				addDepartment(data)
					.unwrap()
					.then((res) => {
						if (schema.safeParse(res).success) {
							useAlertDialog({
								dispatch,
								title: 'Create department successfully',
							});
						} else {
							useAlertDialog({
								dispatch,
								title: 'result not type of department',
							});
						}
						navigate(-1);
					})
					.catch((err) => {
						console.error('Error create department', err);
						useAlertDialog({
							dispatch,
							title: 'Error creating department',
							color: 'error',
						});
						navigate(-1);
					});
			}
		}
	};

	useEffect(() => {
		if (!isLoadingInitial && fetchedDepartment) {
			reset(fetchedDepartment);
		}
	}, [isLoadingInitial]);

	return (
		<div className='w-full h-full '>
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
						to={'/resources/academic'}
						color='inherit'
					>
						<ArrowBack />
						<span className='flex mx-4 font-medium'>
							Departments Table
						</span>
					</Button>
				</motion.div>

				<Heading
					title={
						initialDepartmentInfo || id !== undefined
							? 'Update department'
							: 'Create department'
					}
					description={
						initialDepartmentInfo || id !== undefined
							? 'Update department infos'
							: 'Enter department infors'
					}
				/>
			</div>

			<div className='p-32 space-y-16'>
				<Controller
					name={`name`}
					control={control}
					render={({ field }) => (
						<TextField
							{...field}
							className='mt-8'
							label='Department&#39;s name'
							fullWidth
							variant='outlined'
							error={!!errors.name}
							helperText={errors.name?.message}
						/>
					)}
				/>

				<Controller
					name={`code`}
					control={control}
					render={({ field }) => (
						<TextField
							{...field}
							label='Department&#39;s code'
							fullWidth
							variant='outlined'
							error={!!errors.code}
							helperText={errors.code?.message}
						/>
					)}
				/>
			</div>
			<div className='flex items-center justify-end gap-16 px-32'>
				<Button
					className='px-16 '
					onClick={() => navigate(-1)}
					color='primary'
				>
					Cancel
				</Button>

				<Button
					className='px-16'
					color='secondary'
					variant='contained'
					disabled={!isDirty || !isValid}
					onClick={handleSubmit(handleSubmitForm)}
				>
					{initialDepartmentInfo || id !== undefined
						? 'Update'
						: 'Add'}
				</Button>
			</div>
		</div>
	);
};

export default CreateUpdateDepartmentForm;
