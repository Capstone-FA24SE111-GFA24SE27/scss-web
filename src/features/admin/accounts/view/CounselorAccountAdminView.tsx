import React, { useState } from 'react';
import { useGetCounselorAdminQuery } from '../../profiles/counselor/admin-counselor-api';
import { ContentLoading, FilterTabs, Heading } from '@/shared/components';
import { roles } from '@/shared/constants';
import { Account, Role } from '@/shared/types';
import { Avatar, Button, Paper, Tab, Tabs, Typography } from '@mui/material';
import AccountInfoTab from './tabs/AccountInfoTab';
import { motion } from 'framer-motion';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';
import { isValidImage, MAX_FILE_SIZE } from '@/shared/services';
import dayjs from 'dayjs';
import { zodResolver } from '@hookform/resolvers/zod';
import { Delete } from '@mui/icons-material';
import { useGetOneAccountQuery } from '../admin-accounts-api';

type Props = {
	id: string;
};

const currentYear = dayjs().year();

const schema = z.object({
	avatarLink: z
		.instanceof(File, { message: 'Image is required' })
		.refine((file) => isValidImage(file), {
			message: 'File must be an image',
		})
		.refine((file) => file.size <= MAX_FILE_SIZE, {
			message: 'Image must be less than 5MB',
		}),
	email: z.string().email('Invalid email address'), // Validates email format
	// password: z.string().min(6, 'Password must be at least 6 characters long'), // Minimum password length
	gender: z.enum(['MALE', 'FEMALE']), // Enum for gender
	phoneNumber: z
		.string()
		.regex(/^\d{10,15}$/, 'Phone number must be between 10 and 15 digits'),
	dateOfBirth: z
		.string()
		.refine((date) => {
			return dayjs(date, 'YYYY-MM-DD', true).isValid();
		}, 'Birth date must be a valid date')
		.refine((date) => {
			const year = dayjs(date).year();
			return year >= 1900 && year <= currentYear;
		}, `Year must be between 1900 and ${currentYear}`),

	fullName: z.string().min(1, 'Full name is required'), // Full name validation
	// departmentId: z.number().gt(0, 'Department ID must be selected'),
	// majorId: z.number().gt(0, 'Major ID must be selected'),
	// specializationId: z.number().gt(0, 'Specialization ID must be selected'),
	specializedSkills: z.string().min(1, 'Specialized skill is required'),
	otherSkills: z.string().min(1, 'Other skill is required'),
	workHistory: z.string().min(1, 'Work history is required'),
	achievements: z.string().min(1, 'Achievement is required'),
	qualifications: z.array(
		z.object({
			degree: z.string().min(1, 'Degree is required'),
			fieldOfStudy: z.string().min(1, 'Field of study is required'),
			institution: z.string().min(1, 'Institution  is required'),
			yearOfGraduation: z
				.string()
				.refine(
					(date) => !isNaN(new Date(date).getTime()),
					'Invalid date format'
				),
			imageUrl: z
				.instanceof(File)
				.refine((file) => isValidImage(file), {
					message: 'File must be an image',
				})
				.refine((file) => file.size <= MAX_FILE_SIZE, {
					message: 'Image must be less than 5MB',
				}),
		})
	),
	certifications: z.array(
		z.object({
			name: z.string().min(1, 'Please enter'),
			organization: z.string().min(1, 'Please enter'),
			imageUrl: z
				.instanceof(File)
				.refine((file) => isValidImage(file), {
					message: 'File must be an image',
				})
				.refine((file) => file.size <= MAX_FILE_SIZE, {
					message: 'Image must be less than 5MB',
				}),
		})
	),
});

const CounselorAccountAdminView = (props: Props) => {
	const { id } = props;

	const [tabValue, setTabValue] = useState(0);

	const { data, isLoading } = useGetCounselorAdminQuery(id, { skip: !id });
	const { data: counselorAccountData, isLoading: isLoadingAccount } =
		useGetOneAccountQuery({ id }, { skip: !id });

	console.log('counselordata', data);

	const counselor = data?.content;
	const counselorAccount: Account | null = counselorAccountData?.content;

	const defaultValues = {
		email: counselorAccount?.email,
		// password: counselorAccount?.,
		gender: counselorAccount?.profile?.gender,
		phoneNumber: counselorAccount?.profile?.phoneNumber,
		dateOfBirth: dayjs(
			counselorAccount?.profile?.dateOfBirth,
			'YYYY-MM-DD'
		),
		fullName: counselorAccount?.profile?.fullName,
		departmentId: counselor?.profile?.department?.id,
		majorId: counselor?.profile?.major?.id,
		specializationId: counselor?.profile?.specialization?.id,
		specializedSkills: counselor?.profile?.specializedSkills,
		otherSkills: counselor?.profile?.otherSkills,
		workHistory: counselor?.profile?.workHistory,
		achievements: counselor?.profile?.achievements,
		qualifications: counselor?.profile?.qualifications,
		certifications: counselor?.profile?.certifications,
	}

	console.log(defaultValues)

	const methods = useForm({
		mode: 'onChange',
		defaultValues,
		resolver: zodResolver(schema),
	});

	const { reset, watch } = methods;

	const form = watch();

	const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
		setTabValue(newValue);
	};

	if (isLoading || isLoadingAccount) return <ContentLoading />;

	return (
		<FormProvider {...methods}>
			<div className='w-full h-full'>
				<Tabs
					value={tabValue}
					onChange={handleChangeTab}
					indicatorColor='secondary'
					textColor='secondary'
					variant='scrollable'
					scrollButtons='auto'
					classes={{
						root: 'w-full h-32  bg-background-paper mb-16',
					}}
				>
					<Tab
						className='px-16 text-lg font-semibold min-h-40 min-w-64'
						label='Account info'
					/>
					<Tab
						className='px-16 text-lg font-semibold min-h-40 min-w-64'
						label='Specialization'
					/>
					<Tab
						className='px-16 text-lg font-semibold min-h-40 min-w-64'
						label='Work Experience'
					/>
				</Tabs>
				<div className='w-full p-16'>
					{tabValue === 0 && (
						<AccountInfoTab account={counselorAccount} />
					)}
					{/* {tabValue === 1 && <AppointmentsTable />}
              {tabValue === 2 && <RequestsTable />}
              {tabValue === 3 && <ScheduleTab />}
              {tabValue === 4 && <FeedbackTab />}
              {tabValue === 5 && <QnaTab />}
              {tabValue === 6 && <ProfileTab />} */}
				</div>
			</div>
		</FormProvider>
	);
};

export default CounselorAccountAdminView;
