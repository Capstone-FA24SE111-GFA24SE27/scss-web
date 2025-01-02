import { isValidImage, MAX_FILE_SIZE } from '@/shared/services';
import { Account } from '@/shared/types';
import { zodResolver } from '@hookform/resolvers/zod';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';
import { useGetOneAccountQuery } from '../admin-accounts-api';
import AccountDetailAdminViewHeader from './AccountDetailAdminViewHeader';
import { Paper, Tab, Tabs } from '@mui/material';
import { ContentLoading, Scrollbar } from '@/shared/components';
import AccountInfoTab from './tabs/AccountInfoTab';
import { roles } from '@/shared/constants';
import { checkFirebaseImageUrl, checkImageUrl } from '@/shared/utils';
import GeneralInformation from '@/features/managers/management/students/student/GeneralInformation';
import LearningProcess from '@/features/managers/management/students/student/LearningProcessTab';
import CounselingProfile from '@/features/managers/management/students/student/CounselingProfile';

const currentYear = dayjs().year();

const schema = z.object({
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
});

type FormType = Required<z.infer<typeof schema>>;

type Props = {
	id: string;
};

const StudentAccountAdminView = (props: Props) => {
	const { id } = props;
	const [isInitializing, setIsInitializing] = useState(true);
	const [tabValue, setTabValue] = useState(0);

	const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
		setTabValue(newValue);
	};
	const { data: genericAccountData, isLoading: isLoadingAccount } =
		useGetOneAccountQuery({ id }, { skip: !id });

	const genericAccount: Account | null = genericAccountData?.content;

	const defaultValues = () => {
		return {
			avatarLink: genericAccount?.profile?.avatarLink,
			email: genericAccount?.email,
			// password: counselorAccount?.,
			gender:
				genericAccount?.profile?.gender === 'MALE' ? 'MALE' : 'FEMALE',
			phoneNumber: genericAccount?.profile?.phoneNumber,
			dateOfBirth: dayjs(genericAccount?.profile?.dateOfBirth).format(
				'YYYY-MM-DD'
			),
			fullName: genericAccount?.profile?.fullName,
		};
	};

	const methods = useForm({
		mode: 'onChange',
		defaultValues: {},
		resolver: zodResolver(schema),
	});

	const { reset, watch, formState, trigger } = methods;

	const formData = watch();

	const initializeDefaultValues = () => {
		const values = defaultValues();
		//@ts-ignore
		reset(values);
		trigger();
		setIsInitializing(false);
	};

	useEffect(() => {
		if (!isLoadingAccount) {
			initializeDefaultValues();
		}
	}, [isLoadingAccount]);

	useEffect(() => {
		if (formData) {
			console.log('form data changing', formData);
		}
	}, [formData]);

	if (isLoadingAccount || isInitializing) return <ContentLoading />;

	return (
		<FormProvider {...methods}>
			<AccountDetailAdminViewHeader />
			<Paper className='flex flex-col flex-auto h-full p-16 overflow-hidden'>
				<Tabs
					value={tabValue}
					onChange={handleChangeTab}
					indicatorColor='secondary'
					textColor='secondary'
					variant='scrollable'
					scrollButtons='auto'
					classes={{
						root: 'w-full h-32 border-b bg-background-paper px-16',
					}}
				>
					<Tab
						className='text-lg font-semibold min-h-40 min-w-64 px-16'
						label='General Information'
					/>
					<Tab
						className='text-lg font-semibold min-h-40 min-w-64 px-16'
						label='Learning Process'
					/>
					<Tab
						className='text-lg font-semibold min-h-40 min-w-64 px-16'
						label='Counseling'
					/>
				</Tabs>
				<Scrollbar className='flex-1 w-full max-h-full overflow-auto py-16'>
					{tabValue === 0 && <GeneralInformation />}
					{tabValue === 1 && <LearningProcess />}
					{tabValue === 2 && <CounselingProfile />}
				</Scrollbar>
			</Paper>
		</FormProvider>
	);
};

export default StudentAccountAdminView;
