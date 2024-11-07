import { PageSimple } from '@/shared/components';
import { styled } from '@mui/material/styles';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import HomeContent from './HomeContent';
import HomeHeader from './HomeHeader';
import HomeSidebarContent from './HomeSidebarContent';
const Root = styled(PageSimple)(({ theme }) => ({

}));

/**
 * The ProjectDashboardApp page.
 */
function Home() {
	// const { isLoading } = useGetProjectDashboardWidgetsQuery();
	const pageLayout = useRef(null);
	const routeParams = useParams();
	const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
	const [tabValue, setTabValue] = useState(0);
	const isMobile = false
	useEffect(() => {
		setRightSidebarOpen(Boolean(routeParams.id));
	}, [routeParams]);

	return (
		<Root
			header={<div>
				<HomeHeader />
			</div>}
			scroll={isMobile ? 'normal' : 'content'}
			content={<HomeContent />}
		/>
	);
}


export default Home;
