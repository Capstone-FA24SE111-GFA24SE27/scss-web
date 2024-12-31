import { closeDialog, ContentLoading, Heading, NavLinkAdapter } from '@/shared/components';
import { Major } from '@/shared/types';
import { zodResolver } from '@hookform/resolvers/zod';
import {
	Button,
	DialogActions,
	DialogContent,
	DialogTitle,
	MenuItem,
	TextField,
} from '@mui/material';
import { useAppDispatch } from '@shared/store';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import {
	useGetDepartmentsAdminQuery,
	usePostCreateMajorByIdAdminMutation,
	usePutUpdateMajorByIdAdminMutation,
} from '../academic-data-admin-api';
import { initial } from 'lodash';
import { useAlertDialog } from '@/shared/hooks';
import { navigateUp } from '@/shared/utils';
import { ArrowBack } from '@mui/icons-material';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {motion} from 'framer-motion'
const schema = z.object({
	id: z.union([z.string(), z.number()]).optional(),
	name: z.string().min(1, 'Please enter Major name'),
	code: z.string().min(1, 'Please enter Major code'),
	departmentId: z.union([
		z.string().min(1, 'Please select a department'),
		z.number().min(1, 'Please select a department'),
	]),
});

type FormType = Required<z.infer<typeof schema>>;
type Props = {
	initialMajorInfo?: Major;
};

const CreateUpdateMajorForm = (props: Props) => {
	const { initialMajorInfo: initialMajorInfo } = props;
    const {id} = useParams()
	const dispatch = useAppDispatch();
    const location = useLocation();
	const navigate = useNavigate();
    
	const { data: departments, isLoading: isLoadingDepartment } =
		useGetDepartmentsAdminQuery();
	const defaultValues = initialMajorInfo
		? initialMajorInfo
		: {
				name: '',
				code: '',
				departmentId: '',
		  };

	const { handleSubmit, control, formState, watch } = useForm<FormType>({
		resolver: zodResolver(schema),
		defaultValues,
		mode: 'onChange',
	});

	const formData = watch();

	const { isValid, isDirty, errors } = formState;

	const [updateMajor] = usePutUpdateMajorByIdAdminMutation();
	const [addMajor] = usePostCreateMajorByIdAdminMutation();
	const handleSubmitForm = (data: FormType) => {
		if (isDirty && isValid) {
			if (initialMajorInfo || id) {
				updateMajor({
					id: initialMajorInfo.id,
					...data,
				}).unwrap();
			} else {
				addMajor(data)
					.unwrap()
					.then((res) => {
						dispatch(closeDialog());
						if (schema.safeParse(res).success) {
							useAlertDialog({
								dispatch,
								title: 'Create Major successfully',
							});
						} else {
							useAlertDialog({
								dispatch,
								title: 'result not type of Major',
							});
						}
					})
					.catch((err) => {
						console.error('Error create Major', err);
						dispatch(closeDialog());
						useAlertDialog({
							dispatch,
							title: 'Error creating Major',
							color: 'error',
						});
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
							Majors Table
						</span>
					</Button>
				</motion.div>

				<Heading
					title={
						initialMajorInfo
							? 'Update major'
							: 'Create major'
					}
					description={
						initialMajorInfo
							? 'Update major infos'
							: 'Enter major infors'
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
							label='Major&#39;s name'
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
							label='Major&#39;s code'
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
			</div>
			<div className='flex items-center justify-end gap-16 px-32'>
				<Button
					className='px-16 '
					onClick={() => dispatch(closeDialog())}
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
					{initialMajorInfo ? 'Update' : 'Add'}
				</Button>
			</div>
		</div>
	);
};

export default CreateUpdateMajorForm;
