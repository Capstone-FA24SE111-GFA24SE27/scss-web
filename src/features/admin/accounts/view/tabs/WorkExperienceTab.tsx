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

type Props = {};

const WorkExperienceTab = (props: Props) => {
	const methods = useFormContext();
	const { control, formState, trigger } = methods;
	const { errors } = formState;

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
		</div>
	);
};

export default WorkExperienceTab;
