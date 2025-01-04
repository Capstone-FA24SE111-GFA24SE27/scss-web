import { Add } from '@mui/icons-material';
import {
	Box,
	Button,
	Chip,
	CircularProgress,
	Divider,
	TextField,
	Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useFieldArray, useForm, useFormContext } from 'react-hook-form';
import QualificationAppendForm from '../../create/forms/QualificationAppendForm';
import { useAppDispatch } from '@shared/store';
import { openDialog } from '@/shared/components';
import { z } from 'zod';
import { isValidImage, MAX_FILE_SIZE, uploadFile } from '@/shared/services';
import { checkFirebaseImageUrl, checkImageUrl } from '@/shared/utils';
import dayjs from 'dayjs';
import {
	useGetCounselorAdminQuery,
	usePostCreateQualificationMutation,
	usePutUpdateQualificationMutation,
} from '../../admin-accounts-api';
import { useParams } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { Qualification } from '@/shared/types';
import { useAlertDialog } from '@/shared/hooks';

type Props = {};

const schema = z.object({
	qualifications: z.array(
		z.object({
			id: z.union([z.string(), z.number()]).optional(),
			degree: z.string().min(1, 'Degree is required'),
			fieldOfStudy: z.string().min(1, 'Field of study is required'),
			institution: z.string().min(1, 'Institution  is required'),
			yearOfGraduation: z
				.union([
					z.string().refine((value) => /^\d{4}$/.test(value), {
						message: 'Year must be a 4-digit number as a string',
					}),
					z
						.number()
						.refine((value) => value >= 1000 && value <= 9999, {
							message: 'Year must be a 4-digit number',
						}),
				])
				.refine(
					(value) => dayjs(value.toString(), 'YYYY', true).isValid(),
					{ message: 'Invalid year' }
				),
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
						(url) => async (url) => {
							const checkValid = await checkImageUrl(url);
							return checkFirebaseImageUrl(url) || checkValid;
						},
						{
							message: 'Invalid image URL. ',
						}
					), // Validates URL and checks for image extensions
			]),
		})
	),
});

const QualificationTab = (props: Props) => {
	const dispatch = useAppDispatch();
	const { id } = useParams();

	const [isLoadingProcess, setIsLoadingProccess] = useState(false);
	const { data, isLoading, refetch } = useGetCounselorAdminQuery(id, {
		skip: !id,
	});
	const counselor = data?.content;

	// const methods = useForm<Required<z.infer<typeof schema>>>({
	// 	mode: 'all',
	// 	defaultValues: {},
	// 	resolver: zodResolver(schema),
	// });

	// const { reset, watch, control, trigger, formState, setFocus } = methods;
	// const { dirtyFields, errors } = formState;

	// const formData = watch();

	// const useQualificationFieldArray = useFieldArray({
	// 	control,
	// 	keyName: 'uid',
	// 	name: 'qualifications',
	// });

	// const {
	// 	fields: qualificationsFields,
	// 	append: appendQualificationField,
	// 	update: updateQualificationField,
	// 	remove: removeQualificationField,
	// } = useQualificationFieldArray;

	const [updateQualification] = usePutUpdateQualificationMutation();
	const [addQualification] = usePostCreateQualificationMutation();

	const handleUpdate = (index: number, quali: any) => {
		if (quali) {
			if (quali.imageUrl instanceof File) {
				try {
					setIsLoadingProccess(true);
					//@ts-ignore
					handleUploadImage(quali.imageUrl).then((url) => {
						updateQualification({
							...quali,
							imageUrl: url as string,
							counselorId: id,
						})
							.unwrap()
							.then((res) => {
								if (res && res.status === 200) {
									useAlertDialog({
										dispatch,
										title: 'Update qualification successfully',
									});
									refetch();
								}
							})
							.catch((err) => {
								useAlertDialog({
									dispatch,
									title: 'An error while updating qualification',
									color: 'error',
								});
							});
					});
					setIsLoadingProccess(false);
				} catch (err) {
					console.error('Image upload failed:', err);
					useAlertDialog({
						dispatch,
						title: 'An error while uploading qualification image',
						color: 'error',
					});
				}
			} else {
				updateQualification({
					...quali,
					counselorId: id,
				})
					.unwrap()
					.then((res) => {
						if (res && res.status === 200) {
							useAlertDialog({
								dispatch,
								title: 'Update qualification successfully',
							});
							refetch();
						}
					})
					.catch((err) => {
						useAlertDialog({
							dispatch,
							title: 'An error while updating qualification',
							color: 'error',
						});
					});
			}
		}
	};

	const handleUploadImage = async (file: File) => {
		const res = await uploadFile(file, `images/${Date.now()}_${file.name}`);
		return res;
	};

	const handleAdd = (quali: Qualification) => {
		if (quali) {
			try {
				setIsLoadingProccess(true);
				//@ts-ignore
				handleUploadImage(quali.imageUrl).then((url) => {
					addQualification({
						...quali,
						imageUrl: url as string,
						counselorId: id,
					})
						.unwrap()
						.then((res) => {
							if (res && res.status === 200) {
								useAlertDialog({
									dispatch,
									title: 'Create qualification successfully',
								});
								refetch();
							}
						})
						.catch((err) => {
							useAlertDialog({
								dispatch,
								title: 'An error while creating qualification',
								color: 'error',
							});
						});
				});
				setIsLoadingProccess(false);
			} catch (err) {
				console.error('Image upload failed:', err);
				useAlertDialog({
					dispatch,
					title: 'An error while uploading qualification image',
					color: 'error',
				});
			}
		}
	};

	const handleOpenQualificationAppendDialog = () => {
		dispatch(
			openDialog({
				children: (
					<QualificationAppendForm
						// trigger={trigger}
						append={handleAdd}
					/>
				),
			})
		);
	};

	const handleUpdateQualification = (quali: any, index: string | number) => {
		console.log(quali);
		dispatch(
			openDialog({
				children: (
					<QualificationAppendForm
						index={index}
						// trigger={trigger}
						update={handleUpdate}
						qualificationData={quali}
					/>
				),
			})
		);
	};

	// useEffect(() => {
	// 	if (!isLoading && counselor) {
	// 		reset({ qualifications: counselor.profile.qualifications });
	// 	}
	// }, [isLoading, counselor]);

	return (
		<Box className='flex flex-col gap-8'>
			<div
				className='flex items-center gap-16 p-8 transition-colors rounded shadow hover:cursor-pointer bg-background/50 hover:bg-background'
				onClick={handleOpenQualificationAppendDialog}
			>
				<div className='flex items-center justify-center border rounded cursor-pointer size-72 hover:opacity-90 text-grey-600'>
					{isLoadingProcess ? <CircularProgress /> : <Add />}
				</div>
				<Typography className='font-semibold text-text-secondary'>
					Add Qualification
				</Typography>
			</div>
			{counselor?.profile?.qualifications?.map((qualification, index) => (
				<div
					key={qualification.id}
					className='flex items-start gap-16 p-8 transition-colors rounded shadow hover:cursor-pointer hover:bg-background'
					onClick={() => {
						handleUpdateQualification(qualification, index);
					}}
				>
					<img
						onClick={(e) => {
							e.stopPropagation();
							dispatch(
								openDialog({
									children: (
										<img
											className='min-h-sm min-w-sm'
											src={qualification.imageUrl}
											alt={qualification.institution}
										/>
									),
								})
							);
						}}
						src={
							// qualification.imageUrl instanceof File
							// 	? URL.createObjectURL(qualification.imageUrl)
							// 	:
							qualification.imageUrl
						}
						alt={qualification.institution}
						className='object-cover border rounded cursor-pointer size-72 hover:opacity-90'
					/>
					<div className='flex-1'>
						<p className='text-lg font-semibold'>
							{qualification.institution}
						</p>
						<p className=''>
							{qualification.degree} •{' '}
							{qualification.fieldOfStudy}
						</p>
						<p className='text-text-secondary'>
							Graduated: {qualification.yearOfGraduation}
						</p>
					</div>
				</div>
			))}
		</Box>
	);
};

export default QualificationTab;
