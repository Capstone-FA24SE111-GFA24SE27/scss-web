import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { useState } from 'react';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import { useEffect, useRef } from 'react';
import ActivityHeader from './ActivityHeader';
import { PageSimple } from '@/shared/components';
import { AppointmentsTab, RequestsTab } from './tabs';
import { useParams } from 'react-router-dom';
import ActivitySidebarContent from './ActivitySidebarContent';
import { useAppDispatch } from '@shared/store';
const Root = styled(PageSimple)(({ theme }) => ({

}));

/**
 * The ProjectDashboardApp page.
 */
function Activity() {
	// const { isLoading } = useGetProjectDashboardWidgetsQuery();
	const pageLayout = useRef(null);
	const routeParams = useParams();
	const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
	const [tabValue, setTabValue] = useState(0);
	const isMobile = false
	useEffect(() => {
		setRightSidebarOpen(Boolean(routeParams.id));
	}, [routeParams]);

	function handleChangeTab(event: React.SyntheticEvent, value: number) {
		setTabValue(value);
	}

	return (
		<Root
			header={<div>
				<ActivityHeader />
				<Tabs
					value={tabValue}
					onChange={handleChangeTab}
					indicatorColor="secondary"
					textColor="secondary"
					variant="scrollable"
					scrollButtons="auto"
					classes={{ root: 'w-full h-32 border-b-2 bg-background-paper px-16' }}
				>
					<Tab
						className="text-lg font-semibold min-h-40 min-w-64 px-16"

						label="Requests"
					/>
					<Tab
						className="text-lg font-semibold min-h-40 min-w-64 px-16"

						label="Appointments"
					/>
					<Tab
						className="text-lg font-semibold min-h-40 min-w-64 px-16"

						label="Q&A"
					/>
					<Tab
						className="text-lg font-semibold min-h-40 min-w-64 px-16"

						label="Others"
					/>
				</Tabs>
			</div>}
			rightSidebarContent={<ActivitySidebarContent />}
			rightSidebarOpen={rightSidebarOpen}
			rightSidebarOnClose={() => setRightSidebarOpen(false)}
			rightSidebarWidth={640}
			rightSidebarVariant="persistent"
			scroll={isMobile ? 'normal' : 'content'}
			content={
				<div className="w-full">
					<div className='m-16'>
						{tabValue === 0 && <RequestsTab />}
						{tabValue === 1 && <AppointmentsTab />}
					</div>
				</div>
			}
		/>
	);
}


export default Activity;
