import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { PageSimple } from '@shared/components';
import RequestsContent from './RequestContent';
import RequestsHeader from './RequestsHeader';
import RequestsSidebarContent from './RequestsSidebarContent';


const Root = styled(PageSimple)(({ theme }) => ({
	'& .PageSimple-header': {
		backgroundColor: theme.palette.background.paper
	},
}));

/**
 * The ContactsApp page.
 */
function Requests() {
	const pageLayout = useRef(null);
	const routeParams = useParams();
	const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
	// const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
	// useGetContactsListQuery();
	// useGetContactsCountriesQuery();
	// useGetContactsTagsQuery();
	const isMobile = false
	useEffect(() => {
		setRightSidebarOpen(Boolean(routeParams.id));
	}, [routeParams]);

	return (
		<Root
			header={<RequestsHeader />}
			content={<RequestsContent />}
			ref={pageLayout}
			rightSidebarContent={<RequestsSidebarContent />}
			rightSidebarOpen={rightSidebarOpen}
			rightSidebarOnClose={() => setRightSidebarOpen(false)}
			rightSidebarWidth={640}
			rightSidebarVariant="temporary"
			scroll={isMobile ? 'normal' : 'content'}
		/>
	);
}

export default Requests;
