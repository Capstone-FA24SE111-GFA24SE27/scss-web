import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { PageSimple } from '@shared/components';
import CounselorList from './counselor-list';
import CounselingSidebarContent from './CounselingSidebarContent';
import CounselingHeader from './CounselingHeader';
import { Tab, Tabs } from '@mui/material';
import QuickBooking from './quick-booking';


const Root = styled(PageSimple)(({ theme }) => ({
	'& .PageSimple-header': {
		backgroundColor: theme.palette.background.paper
	},
}));

/**
 * The ContactsApp page.
 */
function Counseling() {
	const pageLayout = useRef(null);
	const routeParams = useParams();
	const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
	const [tabValue, setTabValue] = useState(0);
	// const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
	// useGetContactsListQuery();
	// useGetContactsCountriesQuery();
	// useGetContactsTagsQuery();
	const isMobile = false

	function handleChangeTab(event: React.SyntheticEvent, value: number) {
		setTabValue(value);
	}

	useEffect(() => {
		setRightSidebarOpen(Boolean(routeParams.id));
	}, [routeParams]);

	return (
		<Root
			header={
				<div>
					<CounselingHeader />
					<Tabs
						value={tabValue}
						onChange={handleChangeTab}
						indicatorColor="secondary"
						textColor="secondary"
						variant="scrollable"
						scrollButtons="auto"
						classes={{ root: 'w-full h-32 border-b bg-background-paper px-16' }}
					>
						<Tab
							className="text-lg font-semibold min-h-40 min-w-64 px-16"
							label="Quick Booking"
						/>
						<Tab
							className="text-lg font-semibold min-h-40 min-w-64 px-16"
							label="Counselor List"
						/>
					</Tabs>
				</div>
			}
			content={
				<div className="w-full pr-8">
					<div className=''>
						{tabValue === 0 && <QuickBooking />}
						{tabValue === 1 && <CounselorList/>}
					</div>
				</div>
			}
			ref={pageLayout}
			rightSidebarContent={<CounselingSidebarContent />}
			rightSidebarOpen={rightSidebarOpen}
			rightSidebarOnClose={() => setRightSidebarOpen(false)}
			rightSidebarVariant="temporary"
			scroll={isMobile ? 'normal' : 'content'}
		/>
	);
}

export default Counseling;
