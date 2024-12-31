import StudentsOverview from '@/features/managers/dashboard/analytics/students/StudentsAnalytics';
import { FilterTabs, Heading, Scrollbar } from '@/shared/components';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Typography } from '@mui/material';
import CounselorsAnalytics from './counselors/CounselorsAnalytics';
import SupportStaffAnalytics from './support-staffs/SupportStaffsAnalytics';

type Props = {};

const AccountsOverview = (props: Props) => {
	const navigate = useNavigate();

	const [tabValue, setTabValue] = useState(0);

	const overviewAccountTabs = [
		{ label: 'Academic Counselors', value: 'counselor' },
		{ label: 'Non-academic Counselors', value: 'na-counselor', },
		{ label: 'Students', value: 'student' },
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
			view = <CounselorsAnalytics isAcademic={true} />;
			break;
		}
		case 'na-counselor': {
			view = <CounselorsAnalytics isAcademic={false} />;
			break;
		}
		case 'staff': {
			view = <SupportStaffAnalytics />;
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
		<div className='flex flex-col w-full h-full overflow-hidden mt-32'>
			<div className='flex items-center justify-between px-32'>
				<Heading
					title={`Analytics`}
					description='Providing Metrics Summary & Insights'
				/>
			</div>
			<div className='px-16 pt-16 pb-8'>
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
