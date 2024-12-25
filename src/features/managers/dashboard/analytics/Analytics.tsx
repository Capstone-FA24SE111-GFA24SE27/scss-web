import StudentsOverview from '@/features/managers/dashboard/analytics/student-overview/StudentsOverview';
import SupportStaffOverview from '@/features/managers/dashboard/analytics/support-staff-overview/SupportStaffsOverview';
import { FilterTabs, Heading, Scrollbar } from '@/shared/components';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Typography } from '@mui/material';
import CounselorsOverview from './counselor-overview/CounselorsOverview';

type Props = {};

const AccountsOverview = (props: Props) => {
	const navigate = useNavigate();

	const [tabValue, setTabValue] = useState(0);

	const overviewAccountTabs = [
		{ label: 'Academic Counselor', value: 'counselor' },
		{
			label: 'Non-academic Counselor',
			value: 'na-counselor',
		},
		{ label: 'Student', value: 'student' },
		// { label: 'Manager', value: 'manager' },
		{ label: 'Support Staffs', value: 'staff' },
	];
	// useEffect(() => {
	// 	if (role)
	// 		setTabValue(
	// 			overviewAccountTabs.findIndex((item) => item.value === role)
	// 		);
	// }, []);

	const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
		setTabValue(newValue);
	};

	let view = null;

	switch (overviewAccountTabs[tabValue]?.value) {
		case 'counselor': {
			view = <CounselorsOverview />;
			break;
		}
		case 'na-counselor': {
			view = <CounselorsOverview />;
			break;
		}
		case 'staff': {
			view = <SupportStaffOverview />;
			break;
		}
		case 'student': {
			view = <StudentsOverview />;
			break;
		}
		default: {
			view = (
				<Typography color='error' className='font-semibold'>
					Invalid Tab Value
				</Typography>
			);
			break;
		}
	}

	return (
		<div className='flex flex-col w-full h-full overflow-hidden'>
			<div className='flex items-center justify-between px-32 pt-32'>
				<Heading
					title={`Overview`}
					description='Performance overview of accounts'
				/>
			</div>
			<div className='px-32 py-16'>
				<FilterTabs
					tabs={overviewAccountTabs}
					tabValue={tabValue}
					onChangeTab={handleChangeTab}
				/>
			</div>

			<Scrollbar className='flex-1 overflow-auto'>{view}</Scrollbar>
		</div>
	);
};

export default AccountsOverview;
