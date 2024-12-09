import { Breadcrumbs, FilterTabs } from '@/shared/components'
import BehaviorTagsChart from './BehaviorsOverview';
import AppointmentOverview from './AppointmentOverview';

const CounselorsOverview = () => {
  return (
    <div className='p-16'>
      <Breadcrumbs
        parents={[
          {
            label: "Management",
            url: `${location.pathname}`
          },
          {
            label: "Counselors",
            url: `/management/counselors/overview`
          },
        ]}
        currentPage={`Counselors Overview`}
      />
      <div>
        <BehaviorTagsChart />
        <AppointmentOverview />
      </div>
    </div>
  )
}

export default CounselorsOverview