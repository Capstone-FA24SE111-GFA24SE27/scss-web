import { FilterTabs, Heading, Scrollbar } from '@/shared/components';
import { roles } from '@/shared/constants';
import React, { useEffect, useState } from 'react';
import {
	CreateAcademicCounselorForm,
	CreateManagerForm,
	CreateNonAcademicCounselorForm,
	CreateStudentForm,
	CreateSupportStaffForm,
} from './forms';
import { Box, Paper, Tab, Tabs, Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppSelector } from '@shared/store';
import { selectViewAccountTab } from '../admin-view-account-slice';

const CreateAccount = () => {
	const { role } = useParams();
	const tab = useAppSelector(selectViewAccountTab);
	const [tabValue, setTabValue] = useState(tab);
	const navigate = useNavigate();
	const createAccountTabs = [
		{ label: 'Academic Counselor', value: roles.ACADEMIC_COUNSELOR },
		{
			label: 'Non-academic Counselor',
			value: roles.NON_ACADEMIC_COUNSELOR,
		},
		{ label: 'Manager', value: roles.MANAGER },
		{ label: 'Support Staffs', value: roles.SUPPORT_STAFF },
		{ label: 'Student', value: roles.STUDENT },
	];
	useEffect(() => {
		if (role)
			setTabValue(
				createAccountTabs.findIndex((item) => item.value === role)
			);
	}, []);

	let createAccountForm = <></>;
	switch (createAccountTabs[tabValue]?.value) {
		case roles.STUDENT:
			setTabValue(0);
			break;
		case roles.ACADEMIC_COUNSELOR:
			createAccountForm = <CreateAcademicCounselorForm />;
			break;
		case roles.NON_ACADEMIC_COUNSELOR:
			createAccountForm = <CreateNonAcademicCounselorForm />;
			break;
		case roles.MANAGER:
			createAccountForm = <CreateManagerForm />;
			break;

		case roles.SUPPORT_STAFF:
			createAccountForm = <CreateSupportStaffForm />;
			break;
		default:
			createAccountForm = (
				<Typography color='error' className='font-semibold'>
					Invalid Tab Value
				</Typography>
			);
	}

	const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
		setTabValue(newValue);
	};

	return (
		<div className='flex flex-col overflow-hidden'>
			<div className='flex items-center justify-between px-32 pt-32'>
				<Heading
					title={`Create ${createAccountTabs[tabValue].label}`}
					description='Enter the required information for new account creation'
				/>
			</div>
			<div className='px-32 py-16'>
				<Tabs
					value={tabValue}
					onChange={handleChangeTab}
					textColor='inherit'
					variant='scrollable'
					scrollButtons={false}
					className='min-h-40'
					classes={{
						indicator:
							'flex justify-center opacity-15 rounded-full w-full h-full',
					}}
					TabIndicatorProps={{
						children: (
							<Box className='w-full h-full rounded-full bg-primary-light' />
						),
					}}
				>
					<Tab
						className='text-lg font-semibold min-h-40 min-w-64 px-16'
						disableRipple
						label={'Academic Counselor'}
					/>
					<Tab
						className='text-lg font-semibold min-h-40 min-w-64 px-16'
						disableRipple
						label={'Non-Academic Counselor'}
					/>
					<Tab
						className='text-lg font-semibold min-h-40 min-w-64 px-16'
						disableRipple
						label={'Manager'}
					/>
					<Tab
						className='text-lg font-semibold min-h-40 min-w-64 px-16'
						disableRipple
						label={'Support Staff'}
					/>
				</Tabs>
			</div>

			<Paper className='flex overflow-hidden'>
				<Scrollbar className='flex flex-1 max-h-full overflow-auto'>
					{createAccountForm}
				</Scrollbar>
			</Paper>
		</div>
	);
};

export default CreateAccount;
