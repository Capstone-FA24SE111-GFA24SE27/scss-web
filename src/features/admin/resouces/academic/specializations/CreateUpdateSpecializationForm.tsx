import {
	closeDialog,
	ContentLoading,
	Heading,
	NavLinkAdapter,
} from '@/shared/components';
import { Specialization } from '@/shared/types';
import { zodResolver } from '@hookform/resolvers/zod';
import {
	Button,
	DialogContent,
	DialogTitle,
	MenuItem,
	TextField,
} from '@mui/material';
import { useAppDispatch } from '@shared/store';
import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { motion } from 'framer-motion';
import {
	useGetDepartmentsAdminQuery,
	useGetMajorsAdminQuery,
	useGetSpecializationByIdQuery,
	usePostCreateSpecializationByIdAdminMutation,
	usePutUpdateSpecializationByIdAdminMutation,
} from '../academic-data-admin-api';
import { initial } from 'lodash';
import { useAlertDialog } from '@/shared/hooks';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ArrowBack } from '@mui/icons-material';
import { navigateUp } from '@/shared/utils';

const schema = z.object({
	id: z.union([z.string(), z.number()]).optional(),
	name: z.string().min(1, 'Please enter Specialization name'),
	code: z.string().min(1, 'Please enter Specialization code'),
	departmentId: z.union([
		z.string().min(1, 'Please select a department'),
		z.number().min(1, 'Please select a department'),
	]),
	majorId: z.union([
		z.string().min(1, 'Please select a major'),
		z.number().min(1, 'Please select a major'),
	]),
});

type FormType = Required<z.infer<typeof schema>>;
type Props = {
	initialSpecializationInfo?: Specialization;
};

const CreateUpdateSpecializationForm = (props: Props) => {
	const { initialSpecializationInfo: initialSpecializationInfo } = props;
	const { id } = useParams();
	const dispatch = useAppDispatch();
	const location = useLocation();
	const navigate = useNavigate();

	const { data: fetchedSpecialization, isLoading: isLoadingInitial } =
		useGetSpecializationByIdQuery(id, { skip: !id });

	const { data: departmentsData, isLoading: isLoadingDepartment } =
		useGetDepartmentsAdminQuery({
			size: 999,
		});

	const { data: majorsData, isLoading: isLoadingMajor } =
		useGetMajorsAdminQuery({
			size: 999,
		});

	const departments = departmentsData?.data;
	const majors = majorsData?.data;
	const defaultValues = initialSpecializationInfo
		? initialSpecializationInfo
		: {
				name: '',
				code: '',
				departmentId: '',
				majorId: '',
		  };

	const { handleSubmit, control, formState, watch, reset } =
		useForm<FormType>({
			resolver: zodResolver(schema),
			defaultValues,
			mode: 'onChange',
		});

	const formData = watch();

	const { isValid, isDirty, errors } = formState;

	useEffect(() => {
		if (!isLoadingInitial && fetchedSpecialization) {
			reset(fetchedSpecialization);
		}
	}, [isLoadingInitial]);

	const [updateSpecialization] =
		usePutUpdateSpecializationByIdAdminMutation();
	const [addSpecialization] = usePostCreateSpecializationByIdAdminMutation();
	const handleSubmitForm = (data: FormType) => {
		if (isDirty && isValid) {
			if (initialSpecializationInfo) {
				updateSpecialization({
					...data,
				})
					.unwrap()
					.then((res) => {
						if (schema.safeParse(res).success) {
							useAlertDialog({
								dispatch,
								title: 'Update specialization successfully',
							});
						} else {
							useAlertDialog({
								dispatch,
								title: 'result not type of specialization',
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
				addSpecialization(data)
					.unwrap()
					.then((res) => {
						dispatch(closeDialog());
						if (schema.safeParse(res).success) {
							useAlertDialog({
								dispatch,
								title: 'Create Specialization successfully',
							});
						} else {
							useAlertDialog({
								dispatch,
								title: 'result not type of Specialization',
							});
						}
						navigate(-1);
					})
					.catch((err) => {
						console.error('Error create Specialization', err);
						useAlertDialog({
							dispatch,
							title: 'Error creating Specialization',
							color: 'error',
						});
						navigate(-1);
					});
			}
		}
	};

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
						to={navigateUp(location, 2)}
						color='inherit'
					>
						<ArrowBack />
						<span className='flex mx-4 font-medium'>
							Specializations Table
						</span>
					</Button>
				</motion.div>

				<Heading
					title={
						initialSpecializationInfo || id !== undefined
							? 'Update specialization'
							: 'Create specialization'
					}
					description={
						initialSpecializationInfo || id !== undefined
							? 'Update specialization infos'
							: 'Enter specialization infors'
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
							label='Specialization&#39;s name'
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
							label='Specialization&#39;s code'
							fullWidth
							variant='outlined'
							error={!!errors.code}
							helperText={errors.code?.message}
						/>
					)}
				/>
				{isLoadingDepartment ? (
					<ContentLoading />
				) : (
					<Controller
						name={`departmentId`}
						control={control}
						render={({ field }) => (
							<TextField
								{...field}
								label='Department'
								fullWidth
								select
								variant='outlined'
								error={!!errors.departmentId}
								helperText={errors.departmentId?.message}
							>
								{departments &&
									departments.map((item) => (
										<MenuItem key={item.id} value={item.id}>
											{item.name}
										</MenuItem>
									))}
							</TextField>
						)}
					/>
				)}
				{isLoadingMajor ? (
					<ContentLoading />
				) : (
					<Controller
						name={`majorId`}
						control={control}
						render={({ field }) => (
							<TextField
								{...field}
								label='Major'
								fullWidth
								select
								variant='outlined'
								error={!!errors.majorId}
								helperText={errors.majorId?.message}
							>
								{majors &&
									majors.map((item) => (
										<MenuItem key={item.id} value={item.id}>
											{item.name}
										</MenuItem>
									))}
							</TextField>
						)}
					/>
				)}
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
					{initialSpecializationInfo || id !== undefined
						? 'Update'
						: 'Add'}
				</Button>
			</div>
		</div>
	);
};

export default CreateUpdateSpecializationForm;
