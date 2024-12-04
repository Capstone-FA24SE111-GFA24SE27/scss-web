import { closeDialog } from '@/shared/components';
import { zodResolver } from '@hookform/resolvers/zod';
import {
	Button,
	DialogActions,
	DialogContent,
	DialogTitle,
	TextField,
	Typography,
} from '@mui/material';
import { useAppDispatch } from '@shared/store';
import { Controller, FieldArrayWithId, useForm } from 'react-hook-form';
import { z } from 'zod';
import { Certification } from '@/shared/types';
import clsx from 'clsx';
import { checkImageUrl } from '@/shared/utils';

const schema = z.object({
	name: z.string().min(1, 'Please enter certification name'),
	organization: z.string().min(1, 'Please enter certification organization'),
	imageUrl: z
		.string()
		.url('Invalid URL')
		.refine(
			async (url) => checkImageUrl(url),
			'URL must point to a valid image file (jpg, jpeg, png, gif, webp)'
		),
});

type FormType = Required<z.infer<typeof schema>>;

type Props = {
	append?: any;
	update?: any;
	certificationData?: any;
	index?: string | number;
};

const CertificationAppendForm = (props: Props) => {
	const { append, update,  certificationData, index } = props;
	const dispatch = useAppDispatch();

	console.log({ append, update,  certificationData, index })

	const isEdit = certificationData && update  && index !== null;

	const defaultValues = isEdit
		? certificationData
		: {
				name: '',
				organization: '',
				imageUrl: '',
		  };

	const { handleSubmit, control, formState, watch } = useForm<FormType>({
		resolver: zodResolver(schema),
		defaultValues,
		mode: 'onChange',
	});

	const formData = watch();

	const { isValid, isDirty, errors } = formState;

	const handleSubmitForm = (data: FormType) => {
		append(data);
		console.log(data);
		dispatch(closeDialog());
	};

	return (
		<div className='min-w-320'>
			<DialogTitle id='alert-dialog-title' className='font-semibold'>
				{isEdit
					? 'Update certification infos'
					: 'Enter certification infos:'}
			</DialogTitle>
			<DialogContent className='space-y-16 '>
				<Controller
					name={`name`}
					control={control}
					render={({ field }) => (
						<TextField
							{...field}
							className='mt-8'
							label='Certification&#39;s name'
							fullWidth
							variant='outlined'
							error={!!errors.name}
							helperText={errors.name?.message}
						/>
					)}
				/>

				<Controller
					name={`organization`}
					control={control}
					render={({ field }) => (
						<TextField
							{...field}
							label='Certification&#39;s organization'
							fullWidth
							variant='outlined'
							error={!!errors.organization}
							helperText={errors.organization?.message}
						/>
					)}
				/>

				<Controller
					name={`imageUrl`}
					control={control}
					render={({ field }) => (
						<TextField
							{...field}
							label='Image URL'
							fullWidth
							variant='outlined'
							error={!!errors.imageUrl}
							helperText={errors.imageUrl?.message}
						/>
					)}
				/>
				<img
					src={formData.imageUrl}
					className={clsx(
						formData.imageUrl.trim() !== '' && !errors.imageUrl
							? 'block h-224 overflow-hidden object-cover'
							: 'hidden'
					)}
				/>
			</DialogContent>
			<DialogActions>
				{isEdit ? (
					<>
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
							onClick={() => {
								update(index, formData);
								dispatch(closeDialog());
							}}
						>
							Update
						</Button>
					</>
				) : (
					<>
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
							onClick={handleSubmit(handleSubmitForm)}
						>
							Add
						</Button>
					</>
				)}
			</DialogActions>
		</div>
	);
};

export default CertificationAppendForm;
