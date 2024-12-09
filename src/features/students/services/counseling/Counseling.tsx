import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { PageSimple } from '@shared/components';
import CounselorList from './counselor-list';
import CounselingSidebarContent from './CounselingSidebarContent';
import CounselingHeader from './CounselingHeader';
import { Tab, Tabs } from '@mui/material';
import QuickBooking from './quick-booking';
import { useAppDispatch, useAppSelector } from '@shared/store';
import { selectCounselingTab, setCounselingTab } from './counselor-list/counselor-list-slice';


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
	// const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
	// useGetContactsListQuery();
	// useGetContactsCountriesQuery();
	// useGetContactsTagsQuery();
	const dispatch = useAppDispatch()
	const navigate = useNavigate()
	const isMobile = false

	function handleChangeTab(event: React.SyntheticEvent, value: number) {
		dispatch(setCounselingTab(value))
	}
	const counselingTab = useAppSelector(selectCounselingTab)

	useEffect(() => {
		setRightSidebarOpen(Boolean(routeParams.id));
	}, [routeParams]);

	return (
		<Root
			header={
				<div>
					<CounselingHeader />
					<Tabs
						value={counselingTab}
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
						{counselingTab === 0 && <QuickBooking />}
						{counselingTab === 1 && <CounselorList />}
					</div>
				</div>
			}
			ref={pageLayout}
			rightSidebarContent={<CounselingSidebarContent />}
			rightSidebarOpen={rightSidebarOpen}
			rightSidebarOnClose={() => {
				setRightSidebarOpen(false)
				navigate('.')
			}}
			rightSidebarVariant="temporary"
			scroll={isMobile ? 'normal' : 'content'}
		/>
	);
}

export default Counseling;
