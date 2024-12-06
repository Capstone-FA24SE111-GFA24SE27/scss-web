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
import { isValidImage, MAX_FILE_SIZE } from '@/shared/services';

const currentYear = dayjs().year();

const schema = z.object({
	degree: z.string().min(1, 'Degree is required'),
	fieldOfStudy: z.string().min(1, 'Field of study is required'),
	institution: z.string().min(1, 'Institution  is required'),
	yearOfGraduation: z
		.string()
		.refine((year) => {
			return dayjs(year, 'YYYY', true).isValid();
		}, 'Year must be a valid 4-digit number')
		.refine((year) => {
			const parsedYear = parseInt(year);
			return parsedYear >= 1900 && parsedYear <= currentYear;
		}, `Year must be between 1900 and ${currentYear}`),
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
	append?: any;
	update?: any;
	qualificationData?: any;
	index?: string | number;
};

const QualificationAppendForm = (props: Props) => {
	const { append, update, qualificationData, index } = props;
	const dispatch = useAppDispatch();

	const isEdit = qualificationData && update && index !== null;

	const defaultValues = isEdit
		? qualificationData
		: {
				degree: '',
				fieldOfStudy: '',
				institution: '',
				yearOfGraduation: '2000',
				imageUrl: '',
		  };

	const { handleSubmit, control, formState, watch, setValue } =
		useForm<FormType>({
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

	useEffect(() => {
		console.log(formData);
		console.log(errors.yearOfGraduation);
	}, [formData]);

	return (
		<div className='min-w-320'>
			<DialogTitle id='alert-dialog-title' className='font-semibold'>
				{isEdit
					? 'Update certification infos'
					: 'Enter certification infos:'}
			</DialogTitle>
			<DialogContent className='space-y-16 '>
				<Controller
					name={`degree`}
					control={control}
					render={({ field }) => (
						<TextField
							{...field}
							className='mt-8'
							label='Degree'
							fullWidth
							variant='outlined'
							error={!!errors.degree}
							helperText={errors.degree?.message}
						/>
					)}
				/>

				<Controller
					name={`institution`}
					control={control}
					render={({ field }) => (
						<TextField
							{...field}
							label='Institution'
							fullWidth
							variant='outlined'
							error={!!errors.institution}
							helperText={errors.institution?.message}
						/>
					)}
				/>

				<Controller
					name={`fieldOfStudy`}
					control={control}
					render={({ field }) => (
						<TextField
							{...field}
							label='Field of Study'
							fullWidth
							variant='outlined'
							error={!!errors.fieldOfStudy}
							helperText={errors.fieldOfStudy?.message}
						/>
					)}
				/>

				<Controller
					name={`yearOfGraduation`}
					control={control}
					render={({ field }) => (
						<DatePicker
							className='w-full'
							label='Year of Graduation'
							value={dayjs(field.value)}
							minDate={dayjs('1900')}
							maxDate={dayjs()}
							disableFuture
							yearsOrder='desc'
							slotProps={{
								textField: {
									helperText:
										errors.yearOfGraduation?.message,
								},
							}}
							views={['year']}
							onChange={(date) => {
								field.onChange(dayjs(date).format('YYYY'));
							}}
						/>
					)}
				/>
				<div className='flex flex-col items-center justify-center flex-1 w-full h-full'>
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
									file={field.value}
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

export default QualificationAppendForm;
