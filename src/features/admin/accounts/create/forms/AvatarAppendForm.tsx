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
import { Certification } from '@/shared/types';
import clsx from 'clsx';
import { checkImageUrl } from '@/shared/utils';
import dayjs from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers';
import { useEffect } from 'react';
import ImageInput from '@/shared/components/image/ImageInput';
import { isValidImage, MAX_FILE_SIZE, uploadFile } from '@/shared/services';
import { useAlertDialog } from '@/shared/hooks';

const currentYear = dayjs().year();

const schema = z.object({
	imageUrl: z
		.instanceof(File, { message: 'Image is required' })
		.refine((file) => isValidImage(file), {
			message: 'File must be an image',
		})
		.refine((file) => file.size <= MAX_FILE_SIZE, {
			message: 'Image must be less than 5MB',
		}),
});

type FormType = Required<z.infer<typeof schema>>;

type Props = {
	avatarData?: any;
	onChangeAvatar: any;
};

const AvatarAppendForm = (props: Props) => {
	const { avatarData, onChangeAvatar } = props;
	const dispatch = useAppDispatch();

	const defaultValues = {
		imageUrl: null,
	};

	const { handleSubmit, control, formState, watch, setValue } =
		useForm<FormType>({
			resolver: zodResolver(schema),
			defaultValues,
			mode: 'onChange',
		});

	const formData = watch();

	const { imageUrl } = formData;

	const { dirtyFields, errors } = formState;

	const handleUpload = async (data: FormType) => {
		if (data) {
			console.log(data);
			const imageUrl = data.imageUrl;
			try {
				const res = await uploadFile(
					imageUrl,
					`images/${Date.now()}_${imageUrl.name}`
				);
				return res;
			} catch (err) {
				useAlertDialog({
					dispatch,
					title: 'Error uploading image',
					color: 'error',
				});
				return false;
			}
		}
	};

	const handleSubmitForm = async (data: FormType) => {
		const res = await handleUpload(data);
		if (res) {
			onChangeAvatar(res);
		}
		dispatch(closeDialog());
	};

	useEffect(() => {
		console.log(formData);
		console.log(dirtyFields);
	}, [formData]);

	return (
		<div className='min-w-320'>
			<DialogTitle id='alert-dialog-title' className='font-semibold'>
				Upload avatar
			</DialogTitle>
			<DialogContent className='space-y-16 '>
				<div className='flex flex-col items-center justify-center flex-1 w-full h-full'>
					<Controller
						name={`imageUrl`}
						control={control}
						render={({ field }) => (
							<div className='aspect-square max-w-256'>
								{field.value instanceof File ? (
									<ImageInput
										error={!!errors.imageUrl}
										onFileChange={(file: File) =>
											field.onChange(file)
										}
										file={field.value}
									/>
								) : (
									<ImageInput
										error={!!errors.imageUrl}
										onFileChange={(file: File) =>
											field.onChange(file)
										}
										url={defaultValues.imageUrl}
									/>
								)}
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
					Save
				</Button>
			</DialogActions>
		</div>
	);
};

export default AvatarAppendForm;
