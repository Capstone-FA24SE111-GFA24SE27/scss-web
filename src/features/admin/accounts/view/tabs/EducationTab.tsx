import { Add } from '@mui/icons-material';
import {
	Box,
	Button,
	Chip,
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
import QualificationAppendForm from '../../create/forms/QualificationAppendForm';
import { useAppDispatch } from '@shared/store';
import { openDialog } from '@/shared/components';
import { z } from 'zod';
import { isValidImage, MAX_FILE_SIZE } from '@/shared/services';
import { checkImageUrl } from '@/shared/utils';
import dayjs from 'dayjs';

type Props = {
	useQualificationFieldArray: any;
	useCertificationFieldArray: any;
};

const EducationTab = (props: Props) => {
	const { useQualificationFieldArray, useCertificationFieldArray } = props;

	const methods = useFormContext();
	const { control, formState, trigger } = methods;
	const { errors } = formState;
	const dispatch = useAppDispatch();

	const {
		fields: certificationFields,
		append: appendCertificationField,
		update: updateCertificationField,
		remove: removeCertificationField,
	} = useCertificationFieldArray;

	const {
		fields: qualificationsFields,
		append: appendQualificationField,
		update: updateQualificationField,
		remove: removeQualificationField,
	} = useQualificationFieldArray;

	const handleOpenQualificationAppendDialog = () => {
		dispatch(
			openDialog({
				children: (
					<QualificationAppendForm
						trigger={trigger}
						append={appendQualificationField}
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
						trigger={trigger}
						update={updateQualificationField}
						qualificationData={quali}
					/>
				),
			})
		);
	};

	const handleOpenCertificationAppendDialog = () => {
		dispatch(
			openDialog({
				children: (
					<CertificationAppendForm
						trigger={trigger}
						append={appendCertificationField}
					/>
				),
			})
		);
	};

	const handleUpdateCertification = (certi: any, index: string | number) => {
		dispatch(
			openDialog({
				children: (
					<CertificationAppendForm
						trigger={trigger}
						index={index}
						update={updateCertificationField}
						certificationData={certi}
					/>
				),
			})
		);
	};

	return (
		<div>
			{/* <div className='flex flex-wrap items-center space-y-8'>
				<Typography className='font-semibold w-112'>
					Certifications:{' '}
				</Typography>
				{certificationFields.map((certification, index) => (
					<div
						key={certification.id}
						className='flex flex-col items-center justify-center '
					>
						<Chip
							variant='filled'
							color={
								errors?.certifications &&
								errors?.certifications[index]
									? 'error'
									: 'default'
							}
							// @ts-ignore
							label={certification.name}
							onClick={() =>
								handleUpdateCertification(certification, index)
							}
							onDelete={() => {
								removeCertificationField(index);
							}}
							className='gap-8 mx-8 font-semibold w-fit'
						/>
						{errors?.certifications &&
							errors?.certifications[index] &&
							Object.values(
								errors?.certifications[index]
							)?.[0] && (
								<Typography
									color='error'
									className='text-sm font-medium'
								>
									{
										// @ts-ignore
										Object.values(errors?.certifications[index])?.[0].message
									}
								</Typography>
							)}
					</div>
				))}
				<Button
					variant='outlined'
					color='primary'
					onClick={handleOpenCertificationAppendDialog}
				>
					<Add />
					Add Certification
				</Button>
			</div>

			<div className='flex flex-wrap items-center space-y-8'>
				<Typography className='font-semibold w-112'>
					Qualifications:{' '}
				</Typography>

				{qualificationsFields.map((qualification, index) => (
					<div
						key={qualification.id}
						className='flex flex-col items-center justify-center'
					>
						<Chip
							variant='filled'
							color={
								errors?.qualifications &&
								errors?.qualifications[index]
									? 'error'
									: 'default'
							}
							// @ts-ignore
							label={qualification.degree}
							onClick={() =>
								handleUpdateQualification(qualification, index)
							}
							onDelete={() => {
								removeQualificationField(index);
							}}
							className='gap-8 mx-8 font-semibold w-fit'
						/>
						{errors?.qualifications &&
							errors?.qualifications[index] &&
							Object.values(
								errors?.qualifications[index]
							)?.[0] && (
								<Typography
									color='error'
									className='text-sm font-medium'
								>
									{
										// @ts-ignore
										Object.values(errors?.qualifications[index])?.[0].message
									}
								</Typography>
							)}
					</div>
				))}
				<Button
					variant='outlined'
					color='primary'
					onClick={handleOpenQualificationAppendDialog}
				>
					<Add />
					Add Qualification
				</Button>
			</div> */}

			<div className='flex flex-col gap-16'>
				<Typography className='font-semibold'>
					Qualifications
				</Typography>
				<Box className='flex flex-col gap-8'>
					{qualificationsFields?.map((qualification) => (
						<div
							key={qualification.id}
							className='flex items-start gap-16 p-8 rounded shadow'
						>
							<img
								onClick={() => {
									dispatch(
										openDialog({
											children: (
												<img
													className='min-h-sm min-w-sm'
													src={qualification.imageUrl}
													alt={
														qualification.institution
													}
												/>
											),
										})
									);
								}}
								src={qualification.imageUrl}
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
			</div>

			<Divider className='mt-16 mb-24' />

			<div className='flex flex-col gap-16'>
				<Typography className='font-semibold'>
					Certifications
				</Typography>
				<Box className='flex flex-col gap-8'>
					{certificationFields?.map((certification) => (
						<div
							key={certification.id}
							className='flex items-start gap-16 p-8 rounded shadow'
						>
							<img
								src={certification.imageUrl}
								alt={certification.organization}
								onClick={() => {
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
					))}
				</Box>
			</div>
		</div>
	);
};

export default EducationTab;
