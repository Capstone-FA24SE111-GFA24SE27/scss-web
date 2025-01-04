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
import {
	Controller,
	FieldArrayWithId,
	useFieldArray,
	useFormContext,
} from 'react-hook-form';
import CertificationAppendForm from '../../create/forms/CertificationAppendForm';
import { useAppDispatch } from '@shared/store';
import { openDialog } from '@/shared/components';
import { z } from 'zod';
import { isValidImage, MAX_FILE_SIZE, uploadFile } from '@/shared/services';
import { checkImageUrl } from '@/shared/utils';
import dayjs from 'dayjs';
import {
	useGetCounselorAdminQuery,
	usePostCreateCertificationMutation,
	usePutUpdateCertificationMutation,
} from '../../admin-accounts-api';
import { useParams } from 'react-router-dom';
import { Certification } from '@/shared/types';
import { useAlertDialog } from '@/shared/hooks';

type Props = {};

const CertificationTab = (props: Props) => {
	const dispatch = useAppDispatch();
	const { id } = useParams();

	const [isLoadingProcess, setIsLoadingProccess] = useState(false);
	const { data, isLoading, refetch } = useGetCounselorAdminQuery(id, {
		skip: !id,
	});
	const counselor = data?.content;

	const [updateCertification] = usePutUpdateCertificationMutation();
	const [addCertification] = usePostCreateCertificationMutation();

	const handleUpdate = (index: number, cert: any) => {
		if (cert) {
			if (cert.imageUrl instanceof File) {
				try {
					setIsLoadingProccess(true);
					//@ts-ignore
					handleUploadImage(cert.imageUrl).then((url) => {
						updateCertification({
							...cert,
							imageUrl: url as string,
							counselorId: id,
						})
							.unwrap()
							.then((res) => {
								if (res && res.status === 200) {
									useAlertDialog({
										dispatch,
										title: 'Update certification successfully',
									});
									refetch();
								}
							})
							.catch((err) => {
								useAlertDialog({
									dispatch,
									title: 'An error while updating certification',
									color: 'error',
								});
							});
					});
					setIsLoadingProccess(false);
				} catch (err) {
					console.error('Image upload failed:', err);
					useAlertDialog({
						dispatch,
						title: 'An error while uploading certification image',
						color: 'error',
					});
				}
			} else {
				updateCertification({
					...cert,
					counselorId: id,
				})
					.unwrap()
					.then((res) => {
						if (res && res.status === 200) {
							useAlertDialog({
								dispatch,
								title: 'Update certification successfully',
							});
							refetch();
						}
					})
					.catch((err) => {
						useAlertDialog({
							dispatch,
							title: 'An error while updating certification',
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

	const handleAdd = (cert: Certification) => {
		if (cert) {
			try {
				setIsLoadingProccess(true);
				//@ts-ignore
				handleUploadImage(cert.imageUrl).then((url) => {
					addCertification({
						...cert,
						imageUrl: url as string,
						counselorId: id,
					})
						.unwrap()
						.then((res) => {
							if (res && res.status === 200) {
								useAlertDialog({
									dispatch,
									title: 'Create certification successfully',
								});
								refetch();
							}
						})
						.catch((err) => {
							useAlertDialog({
								dispatch,
								title: 'An error while creating certification',
								color: 'error',
							});
						});
				});
				setIsLoadingProccess(false);
			} catch (err) {
				console.error('Image upload failed:', err);
				useAlertDialog({
					dispatch,
					title: 'An error while uploading certification image',
					color: 'error',
				});
			}
		}
	};

	const handleOpenCertificationAppendDialog = () => {
		dispatch(
			openDialog({
				children: <CertificationAppendForm append={handleAdd} />,
			})
		);
	};

	const handleUpdateCertification = (certi: any, index: string | number) => {
		dispatch(
			openDialog({
				children: (
					<CertificationAppendForm
						index={index}
						update={handleUpdate}
						certificationData={certi}
					/>
				),
			})
		);
	};

	return (
		<div>
			<div className='flex flex-col gap-16'>
				<div
					className='flex items-center gap-16 p-8 transition-colors rounded shadow hover:cursor-pointer bg-background/50 hover:bg-background'
					onClick={handleOpenCertificationAppendDialog}
				>
					<div className='flex items-center justify-center border rounded cursor-pointer size-72 hover:opacity-90 text-grey-600'>
						{isLoadingProcess ? <CircularProgress /> : <Add />}
					</div>
					<Typography className='font-semibold text-text-secondary'>
						Add Certification
					</Typography>
				</div>
				{counselor?.profile?.certifications?.map(
					(certification, index) => (
						<div
							key={certification.id}
							className='flex items-start gap-16 p-8 rounded shadow'
							onClick={() => {
								handleUpdateCertification(certification, index);
							}}
						>
							<img
								src={certification.imageUrl}
								alt={certification.organization}
								onClick={(e) => {
									e.stopPropagation();
									dispatch(
										openDialog({
											children: (
												<img
													className='min-h-sm min-w-sm'
													src={certification.imageUrl}
													alt={
														certification.organization
													}
												/>
											),
										})
									);
								}}
								className='object-cover border rounded cursor-pointer size-72 hover:opacity-90'
							/>
							<div className='flex-1'>
								<p className='text-lg font-semibold'>
									{certification.name}
								</p>
								<p className=''>{certification.organization}</p>
							</div>
						</div>
					)
				)}
			</div>
		</div>
	);
};

export default CertificationTab;
