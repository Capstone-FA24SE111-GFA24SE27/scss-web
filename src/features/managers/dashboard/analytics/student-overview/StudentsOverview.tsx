import { Breadcrumbs, FilterTabs, Scrollbar } from '@/shared/components';
import BehaviorTagsChart from './BehaviorsOverview';
import AppointmentOverview from './AppointmentOverview';

const CounselorsOverview = () => {
	return (
		<div className='h-full overflow-hidden'>
			<Scrollbar className='max-h-full p-16 overflow-auto'>
				<Breadcrumbs
					parents={[
						{
							label: 'Management',
							url: `${location.pathname}`,
						},
						{
							label: 'Students',
							url: `/management/students/overview`,
						},
					]}
					currentPage={`Students Overview`}
				/>
				<div>
					<BehaviorTagsChart />
					<AppointmentOverview />
				</div>
			</Scrollbar>
		</div>
	);
};

export default CounselorsOverview;
