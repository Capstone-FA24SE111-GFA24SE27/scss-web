import React, { useEffect, useState } from 'react';
import {
	ContentLoading,
	FilterTabs,
	Heading,
	Scrollbar,
} from '@/shared/components';
import { roles } from '@/shared/constants';
import { Account, Role } from '@/shared/types';
import { Avatar, Button, Paper, Tab, Tabs, Typography } from '@mui/material';
import AccountInfoTab from './tabs/AccountInfoTab';
import { motion } from 'framer-motion';
import { FormProvider, useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';
import { isValidImage, MAX_FILE_SIZE } from '@/shared/services';
import dayjs from 'dayjs';
import { zodResolver } from '@hookform/resolvers/zod';
import { Delete } from '@mui/icons-material';
import { useGetCounselorAdminQuery, useGetOneAccountQuery } from '../admin-accounts-api';
import AccountDetailAdminViewHeader from './AccountDetailAdminViewHeader';
import {
	checkFirebaseImageUrl,
	checkImageUrl,
	fetchImageAsFile,
} from '@/shared/utils';
import DepartmentInfoTab from './tabs/DepartmentInfoTab';
import WorkExperienceTab from './tabs/WorkExperienceTab';
import ExpertiseTab from './tabs/ExpertiseTab';

type Props = {
	id: string;
};

const currentYear = dayjs().year();

const schemaNonAcademic = z.object({
	id: z.union([z.string(), z.number()]).optional(),
	avatarLink: z
		.string()
		.url('Invalid URL')
		.refine(
			async (url) =>
				checkFirebaseImageUrl(url) || (await checkImageUrl(url)),
			'URL must point to a valid image file (jpeg, png, gif)'
		),
	email: z.string().optional(), // Validates email format
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
	expertiseId: z.number().gt(0, 'Expertise must be selected'),
	specializedSkills: z.string().min(1, 'Specialized skill is required'),
	otherSkills: z.string().min(1, 'Other skill is required'),
	workHistory: z.string().min(1, 'Work history is required'),
	achievements: z.string().min(1, 'Achievement is required'),
	qualifications: z.array(
		z.object({
			id: z.union([z.string(), z.number()]).optional(),
			degree: z.string().min(1, 'Degree is required'),
			fieldOfStudy: z.string().min(1, 'Field of study is required'),
			institution: z.string().min(1, 'Institution  is required'),
			yearOfGraduation: z
				.union([
					z.string().refine((value) => /^\d{4}$/.test(value), {
						message: 'Year must be a 4-digit number',
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
				)
				.refine((date) => {
					const year = dayjs(date).year();
					return year >= 1900 && year <= currentYear;
				}, `Year must be between 1900 and ${currentYear}`),
			imageUrl: z
				.string()
				.url()
				.refine(
					async (url) =>
						checkFirebaseImageUrl(url) ||
						(await checkImageUrl(url)),
					{
						message: 'Invalid image URL.',
					}
				), // Validates URL and checks for image extensions
		})
	),
	certifications: z.array(
		z.object({
			id: z.union([z.string(), z.number()]).optional(),
			name: z.string().min(1, 'Please enter'),
			organization: z.string().min(1, 'Please enter'),
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
		})
	),
});

const schemaAcademic = z.object({
	id: z.union([z.string(), z.number()]).optional(),
	avatarLink: z
		.string()
		.url('Invalid URL')
		.refine(
			async (url) =>
				(await checkImageUrl(url)) || checkFirebaseImageUrl(url),
			'URL must point to a valid image file (jpeg, png, gif)'
		),
	email: z.string().optional(), // Validates email format
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
	departmentId: z.number().gt(0, 'Department ID must be selected'),
	majorId: z.number().gt(0, 'Major ID must be selected'),
	// specializationId: z.number().gt(0, 'Specialization ID must be selected'),
	specializedSkills: z.string().min(1, 'Specialized skill is required'),
	otherSkills: z.string().min(1, 'Other skill is required'),
	workHistory: z.string().min(1, 'Work history is required'),
	achievements: z.string().min(1, 'Achievement is required'),
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
	certifications: z.array(
		z.object({
			id: z.union([z.string(), z.number()]).optional(),
			name: z.string().min(1, 'Please enter'),
			organization: z.string().min(1, 'Please enter'),
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
						async (url) => async (url) => {
							const checkValid = await checkImageUrl(url);
							return checkFirebaseImageUrl(url) || checkValid;
						},
						{
							message: 'Invalid image URL.',
						}
					), // Validates URL and checks for image extensions
			]),
		})
	),
});

const CounselorAccountAdminView = (props: Props) => {
	const { id } = props;

	const [tabValue, setTabValue] = useState(0);
	const [isInitializing, setIsInitializing] = useState(true);
	const { data, isLoading } = useGetCounselorAdminQuery(id, { skip: !id });
	const { data: counselorAccountData, isLoading: isLoadingAccount } =
		useGetOneAccountQuery({ id }, { skip: !id });

	const counselor = data?.content;
	const counselorAccount: Account | null = counselorAccountData?.content;

	console.log(counselor);

	const defaultValues = () => {
		// const certifications = counselor?.profile?.certifications
		// 	? await Promise.all(
		// 			counselor?.profile?.certifications.map(
		// 				async (cert, index) => {
		// 					const fetchedImage = await fetchImageAsFile(
		// 						cert.imageUrl,
		// 						`downloaded-image-${cert.imageUrl}`
		// 					);
		// 					console.log({
		// 						...cert,
		// 						imageUrl: fetchedImage,
		// 					});

		// 					return {
		// 						...cert,
		// 						imageUrl: fetchedImage,
		// 					};
		// 				}
		// 			)
		// 	  )
		// 	: [];

		// const qualifications = counselor?.profile?.qualifications
		// 	? await Promise.all(
		// 			counselor?.profile?.qualifications.map(
		// 				async (qual, index) => {
		// 					const fetchedImage = await fetchImageAsFile(
		// 						qual.imageUrl,
		// 						`downloaded-image-${qual.imageUrl}`
		// 					);
		// 					console.log({
		// 						...qual,
		// 						imageUrl: fetchedImage,
		// 					});

		// 					return {
		// 						...qual,
		// 						imageUrl: fetchedImage,
		// 					};
		// 				}
		// 			)
		// 	  )
		// 	: [];

		return {
			avatarLink: counselorAccount?.profile?.avatarLink,
			email: counselorAccount?.email,
			gender:
				counselorAccount?.profile?.gender === 'MALE'
					? 'MALE'
					: 'FEMALE',
			phoneNumber: counselorAccount?.profile?.phoneNumber,
			dateOfBirth: dayjs(counselorAccount?.profile?.dateOfBirth).format(
				'YYYY-MM-DD'
			),
			fullName: counselorAccount?.profile?.fullName,
			departmentId: counselor?.profile?.department?.id,
			majorId: counselor?.profile?.major?.id,
			expertiseId: counselor?.profile?.expertise?.id,
			specializedSkills: counselor?.profile?.specializedSkills,
			otherSkills: counselor?.profile?.otherSkills,
			workHistory: counselor?.profile?.workHistory,
			achievements: counselor?.profile?.achievements,
			qualifications: counselor?.profile?.qualifications,
			certifications: counselor?.profile?.certifications,
		};
	};

	const methods = useForm<
		Required<
			z.infer<typeof schemaAcademic> | z.infer<typeof schemaNonAcademic>
		>
	>({
		mode: 'all',
		defaultValues: {},
		resolver: counselor?.profile?.expertise
			? zodResolver(schemaNonAcademic)
			: zodResolver(schemaAcademic),
	});

	const { reset, watch, control, trigger, formState, setFocus } = methods;
	const { dirtyFields, errors } = formState;

	const formData = watch();

	const useCertificationFieldArray = useFieldArray({
		control,
		keyName: 'uid',
		name: 'certifications',
	});

	const useQualificationFieldArray = useFieldArray({
		control,
		keyName: 'uid',
		name: 'qualifications',
	});

	const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
		setTabValue(newValue);
	};

	const initializeDefaultValues = () => {
		const values = defaultValues();
		//@ts-ignore
		reset(values);
		trigger();
		setIsInitializing(false);
	};

	useEffect(() => {
		if (!isLoading && !isLoadingAccount) {
			initializeDefaultValues();
		}
	}, [isLoading, isLoadingAccount]);

	useEffect(() => {
		if (formData) {
			console.log('form data changing', formData);
		}
	}, [formData]);

	// useEffect(() => {
	// 	const firstError = Object.keys(errors)[0];
	// 	console.log('tabfild', tabFields[firstError]);

	// }, [errors, setFocus]);

	if (isLoading || isLoadingAccount || isInitializing)
		return <ContentLoading />;

	return (
		<FormProvider {...methods}>
			<AccountDetailAdminViewHeader
				changeTab={setTabValue}
			/>
			<Paper className='flex flex-col flex-auto h-full p-16 overflow-hidden'>
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
				<Scrollbar className='flex-1 w-full max-h-full overflow-auto'>
					{tabValue === 0 && <AccountInfoTab />}
					{tabValue === 1 ? (
						counselor?.profile?.expertise ? (
							<ExpertiseTab />
						) : (
							<DepartmentInfoTab />
						)
					) : (
						''
					)}
					{tabValue === 2 && (
						<WorkExperienceTab
							useQualificationFieldArray={
								useQualificationFieldArray
							}
							useCertificationFieldArray={
								useCertificationFieldArray
							}
						/>
					)}
					{/*  */}
				</Scrollbar>
			</Paper>
		</FormProvider>
	);
};

export default CounselorAccountAdminView;
