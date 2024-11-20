import React, { ChangeEvent, useState } from 'react';

import { List, Tab, Tabs, Typography } from '@mui/material';

import { Counselor } from '@/shared/types';
import QuickMatchCounselorForm from '../students/QuickMatchCounselorForm';
import CounselorListForStaff from './CounselorListForStaff';

type Props = {
	onPickCounselor: (counselor: Counselor) => void;
};

const CounselorPicker = (props: Props) => {
	const { onPickCounselor } = props;

	const [tabValue, setTabValue] = useState(0);

	function handleChangeTab(event: React.SyntheticEvent, value: number) {
		setTabValue(value);
	}

	return (
		<>
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
					className='px-16 text-lg font-semibold min-h-40 min-w-64'
					label='Quick Booking'
				/>
				<Tab
					className='px-16 text-lg font-semibold min-h-40 min-w-64'
					label='Counselor List'
				/>
			</Tabs>
			{tabValue === 0 && (
				<QuickMatchCounselorForm onPickCounselor={onPickCounselor} />
			)}
			{tabValue === 1 && (
				<CounselorListForStaff onPickCounselor={onPickCounselor} />
			)}
		</>
	);
};

export default CounselorPicker;
