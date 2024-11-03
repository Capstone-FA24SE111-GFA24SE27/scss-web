import { useEffect, useRef, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { PageSimple } from '@shared/components';
import AppointmentsHeader from './AppointmentsHeader';
import AppointmentsContent from './AppointmentsContent';
import AppointmentsSidebarContent from './AppointmentsSidebarContent';
import AppointmentCreate from './AppointmentCreate';



const Root = styled(PageSimple)(({ theme }) => ({
	'& .PageSimple-header': {
		backgroundColor: theme.palette.background.paper
	},
}));

/**
 * The ContactsApp page.
 */
function Appointments() {
	const routeParams = useParams();
	const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
	const { pathname } = useLocation()
	// const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
	// useGetContactsListQuery();
	// useGetContactsCountriesQuery();
	// useGetContactsTagsQuery();
	const isMobile = false
	useEffect(() => {
		setRightSidebarOpen(Boolean(routeParams.id));
	}, [routeParams]);

	const isShowingForm = pathname.includes('create');

	return (
		<Root
			header={<AppointmentsHeader />}
			content={isShowingForm ? <AppointmentCreate /> : <AppointmentsContent />}
			rightSidebarContent={<AppointmentsSidebarContent />}
			rightSidebarOpen={rightSidebarOpen}
			rightSidebarOnClose={() => setRightSidebarOpen(false)}
			rightSidebarVariant="temporary"
			scroll={isMobile ? 'normal' : 'content'}
		/>
	);
}

export default Appointments;
