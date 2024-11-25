import { PageSimple } from '@/shared/components';
import HomeContent from './HomeContent';
import HomeHeader from './HomeHeader';


function Home() {
	// const { isLoading } = useGetProjectDashboardWidgetsQuery();
	const isMobile = false

	return (
		<PageSimple
			header={<div>
				<HomeHeader />
			</div>}
			scroll={isMobile ? 'normal' : 'content'}
			content={<HomeContent />}
		/>
	);
}


export default Home;
