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
import { Scrollbar } from '@/shared/components';
import AccountInfoTab from './tabs/AccountInfoTab';
import { roles } from '@/shared/constants';

const currentYear = dayjs().year();

const schema = z.object({
	id: z.union([z.string(), z.number()]).optional(),
	avatarLink: z
		.instanceof(File, { message: 'Image is required' })
		.refine((file) => isValidImage(file), {
			message: 'File must be an image',
		})
		.refine((file) => file.size <= MAX_FILE_SIZE, {
			message: 'Image must be less than 5MB',
		}),
	email: z.string().email('Invalid email address'), // Validates email format
	password: z.string().min(6, 'Password must be at least 6 characters long'), // Minimum password length
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

const GenericAccountAdminView = (props: Props) => {
	const { id } = props;

	const { data: genericAccountData, isLoading: isLoadingAccount } =
		useGetOneAccountQuery({ id }, { skip: !id });

	const counselorAccount: Account | null = genericAccountData?.content;

	const defaultValues = {
		avatarLink: counselorAccount?.profile?.avatarLink,
		email: counselorAccount?.email,
		// password: counselorAccount?.,
		gender:
			counselorAccount?.profile?.gender === 'MALE' ? 'MALE' : 'FEMALE',
		phoneNumber: counselorAccount?.profile?.phoneNumber,
		dateOfBirth: dayjs(counselorAccount?.profile?.dateOfBirth).format(
			'YYYY-MM-DD'
		),
		fullName: counselorAccount?.profile?.fullName,
	};

	console.log(defaultValues);

	const methods = useForm({
		mode: 'onChange',
		defaultValues,
		resolver: zodResolver(schema),
	});

	const { reset, watch, formState } = methods;

	const formData = watch();

	return (
		<FormProvider {...methods}>
			<AccountDetailAdminViewHeader role={roles.SUPPORT_STAFF} />
			<Paper className='flex flex-col flex-auto h-full p-16 overflow-hidden'>
				<Tabs
					value={0}
					onChange={() => {}}
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
				</Tabs>
				<Scrollbar className='flex-1 w-full max-h-full overflow-auto'>
					<AccountInfoTab />
				</Scrollbar>
			</Paper>
		</FormProvider>
	);
};

export default GenericAccountAdminView;
