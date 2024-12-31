import { Breadcrumbs, FilterTabs, Scrollbar } from '@/shared/components';
import BehaviorTagsChart from './BehaviorsOverview';
import AppointmentOverview from './AppointmentOverview';

const CounselorsOverview = () => {
	return (
		<div className='h-full px-24'>
			<BehaviorTagsChart />
		</div>
	);
};

export default CounselorsOverview;
