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
	'& .FusePageSimple-header': {
		backgroundColor: theme.palette.background.paper,
		boxShadow: `inset 0 0 0 1px  ${theme.palette.divider}`
	}
}));

/**
 * The ProjectDashboardApp page.
 */
function Activity() {
	// const { isLoading } = useGetProjectDashboardWidgetsQuery();
	const pageLayout = useRef(null);
	const routeParams = useParams();
	const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
	const isMobile = false
	useEffect(() => {
		setRightSidebarOpen(Boolean(routeParams.id));
	}, [routeParams]);
	const [tabValue, setTabValue] = useState(0);

	function handleChangeTab(event: React.SyntheticEvent, value: number) {
		setTabValue(value);
	}

	return (
		<Root
			header={<ActivityHeader />}
			rightSidebarContent={<ActivitySidebarContent />}
			rightSidebarOpen={rightSidebarOpen}
			rightSidebarOnClose={() => setRightSidebarOpen(false)}
			rightSidebarWidth={640}
			rightSidebarVariant="temporary"
			content={
				<div className="w-full p-12 pt-16 sm:pt-24 lg:ltr:pr-0 lg:rtl:pl-0">
					<Tabs
						value={tabValue}
						onChange={handleChangeTab}
						indicatorColor="secondary"
						textColor="inherit"
						variant="scrollable"
						scrollButtons={false}
						className="w-full px-24 -mx-4 min-h-40"
						classes={{ indicator: 'flex justify-center bg-transparent w-full h-full' }}
						TabIndicatorProps={{
							children: (
								<Box
									sx={{ bgcolor: 'text.disabled' }}
									className="w-full h-full rounded-full opacity-20"
								/>
							)
						}}
					>
						<Tab
							className="text-14 font-semibold min-h-40 min-w-64 mx-4 px-12"
							disableRipple
							label="Requests"
						/>
						<Tab
							className="text-14 font-semibold min-h-40 min-w-64 mx-4 px-12"
							disableRipple
							label="Appointments"
						/>
						<Tab
							className="text-14 font-semibold min-h-40 min-w-64 mx-4 px-12"
							disableRipple
							label="Events"
						/>
						<Tab
							className="text-14 font-semibold min-h-40 min-w-64 mx-4 px-12"
							disableRipple
							label="Others"
						/>
					</Tabs>
					<div className='my-16'>
						{tabValue === 0 && <RequestsTab />}
						{tabValue === 1 && <AppointmentsTab />}
						{/* {tabValue === 1 && <BudgetTab />}
					{tabValue === 2 && <TeamTab />} */}
					</div>
				</div>
			}
		/>
	);
}


export default Activity;
