import { Add } from '@mui/icons-material';
import { Button, Chip, TextField, Typography } from '@mui/material';
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


const WorkExperienceTab = (props: Props) => {

	const {useQualificationFieldArray, useCertificationFieldArray} = props

	const methods = useFormContext();
	const { control, formState, trigger } = methods;
	const { errors } = formState;
	const dispatch = useAppDispatch();

	const {
		fields: certificationFields,
		append: appendCertificationField,
		update: updateCertificationField,
		remove: removeCertificationField,
	} = useCertificationFieldArray

	const {
		fields: qualificationsFields,
		append: appendQualificationField,
		update: updateQualificationField,
		remove: removeQualificationField,
	} = useQualificationFieldArray

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

	const handleUpdateQualification = (
		quali: any,
		index: string | number
	) => {
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

	const handleUpdateCertification = (
		certi: any,
		index: string | number
	) => {
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
			<Controller
				control={control}
				name='specializedSkills'
				render={({ field }) => (
					<TextField
						{...field}
						label='Specialized Skills'
						className='mt-8 mb-16'
						fullWidth
						multiline
						variant='outlined'
						error={!!errors.specializedSkills}
						helperText={errors.specializedSkills?.message as string}
					/>
				)}
			/>
			<Controller
				control={control}
				name='otherSkills'
				render={({ field }) => (
					<TextField
						{...field}
						label='Other Skills'
						className='mt-8 mb-16'
						multiline
						fullWidth
						variant='outlined'
						error={!!errors.otherSkills}
						helperText={errors.otherSkills?.message as string}
					/>
				)}
			/>

			<Controller
				control={control}
				name='achievements'
				render={({ field }) => (
					<TextField
						{...field}
						label='Achievements'
						className='mt-8 mb-16'
						multiline
						fullWidth
						variant='outlined'
						error={!!errors.achievements}
						helperText={errors.achievements?.message as string}
					/>
				)}
			/>

			<Controller
				control={control}
				name='workHistory'
				render={({ field }) => (
					<TextField
						{...field}
						label='Work History'
						className='mt-8 mb-16'
						multiline
						fullWidth
						variant='outlined'
						error={!!errors.workHistory}
						helperText={errors.workHistory?.message as string}
					/>
				)}
			/>

			<div className='flex flex-wrap items-center space-y-8'>
				<Typography className='font-semibold'>
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
				<Typography className='font-semibold'>
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
			</div>
		</div>
	);
};

export default WorkExperienceTab;
