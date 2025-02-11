import { closeDialog, ImageLoading } from '@/shared/components';
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
import { isValidImage, MAX_FILE_SIZE } from '@/shared/services';
import ImageInput from '@/shared/components/image/ImageInput';
import _ from 'lodash';
import { checkFirebaseImageUrl, checkImageUrl } from '@/shared/utils';

// z
// .string()
// .url('Invalid URL')
// .refine(
// 	async (url) => checkImageUrl(url),
// 	'URL must point to a valid image file (jpg, jpeg, png, gif, webp)'
// ),

const schema = z.object({
	name: z.string().min(1, 'Please enter certification name'),
	organization: z.string().min(1, 'Please enter certification organization'),
	imageUrl: z.union([
		z
			.instanceof(File, { message: 'Image not found' })
			.refine((file) => isValidImage(file), {
				message: 'File must be an image',
			})
			.refine((file) => file.size <= MAX_FILE_SIZE, {
				message: 'Image must be less than 5MB',
			}),
		z
			.string()
			.url()
			.refine(
				async (url) => {
					const checkValid = await checkImageUrl(url);
					return checkFirebaseImageUrl(url) || checkValid;
				},

				{
					message: 'Invalid image URL.',
				}
			), // Validates URL and checks for image extensions
	]),
});

type FormType = Required<z.infer<typeof schema>>;

type Props = {
	append?: any;
	update?: any;
	certificationData?: any;
	index?: string | number;
	trigger?: any;
};

const CertificationAppendForm = (props: Props) => {
	const { append, update, certificationData, index, trigger } = props;
	const dispatch = useAppDispatch();

	console.log({ append, update, certificationData, index });

	const isEdit = certificationData && update && index !== null;

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
		if (trigger) {
			trigger();
		}
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
				<div className='flex flex-col items-center justify-center flex-1 w-full h-full'>
					<Typography>Certification's image</Typography>
					<Controller
						name={`imageUrl`}
						control={control}
						render={({ field }) => (
							<div className='aspect-square max-w-256'>
								<ImageInput
									error={!!errors.imageUrl}
									onFileChange={(file: File) =>
										field.onChange(file)
									}
									url={
										field.value instanceof File
											? URL.createObjectURL(field.value)
											: defaultValues.imageUrl
									}
								/>
							</div>
						)}
					/>
					{errors.imageUrl && (
						<Typography color='error' className='text-sm'>
							{errors.imageUrl.message}
						</Typography>
					)}
				</div>
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
							disabled={!isDirty || !isValid}
							onClick={() => {
								update(index, formData);
								if (trigger) {
									trigger();
								}
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
