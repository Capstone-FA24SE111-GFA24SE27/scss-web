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
import { Paper, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';

const CreateAccount = () => {
	const { role } = useParams();
	const [tabValue, setTabValue] = useState(0);

	const createAccountTabs = [
		{ label: 'Academic Counselor', value: roles.ACADEMIC_COUNSELOR },
		{
			label: 'Non-academic Counselor',
			value: roles.NON_ACADEMIC_COUNSELOR,
		},
		{ label: 'Manager', value: roles.MANAGER },
		{ label: 'Support Staffs', value: roles.SUPPORT_STAFF },
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
			createAccountForm = <CreateStudentForm />;
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
				<FilterTabs
					tabs={createAccountTabs}
					tabValue={tabValue}
					onChangeTab={handleChangeTab}
				/>
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
