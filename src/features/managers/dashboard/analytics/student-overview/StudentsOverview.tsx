import { Breadcrumbs, FilterTabs, Scrollbar } from '@/shared/components';
import BehaviorTagsChart from './BehaviorsOverview';
import AppointmentOverview from './AppointmentOverview';

const CounselorsOverview = () => {
	return (
		<div className='h-full overflow-hidden'>
			<Scrollbar className='max-h-full p-16 overflow-auto'>
				<div>
					<BehaviorTagsChart />
					<AppointmentOverview />
				</div>
			</Scrollbar>
		</div>
	);
};

export default CounselorsOverview;
