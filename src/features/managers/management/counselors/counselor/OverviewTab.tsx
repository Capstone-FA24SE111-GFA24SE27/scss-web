import { StatsCard } from '@/shared/components'
import { CheckCircle, Class, Description, DoDisturbOn, Pending } from '@mui/icons-material'
import { Box } from '@mui/material'

const OverviewTab = () => {
  return (
    <div className='flex flex-col gap-16'>
      <Box className='flex justify-between w-full gap-16'>

        <StatsCard
          title="Total Appontments"
          total={113}
          statChange={{
            prefixText: 'Last month',
            current: 40,
            previous: 48,
          }}
          icon={<Description />}
          color="primary"  // You can set color to primary, secondary, success, error, etc.
        />

        <StatsCard
          title="Completed Counseling"
          total={93}
          statChange={{
            prefixText: 'Last month',
            current: 52,
            previous: 48,
          }}
          icon={<CheckCircle />}
          color="success"  // You can set color to primary, secondary, success, error, etc.
        />
        <StatsCard
          title="Canceled Appontments"
          total={13}
          statChange={{
            prefixText: 'Last month',
            current: 52,
            previous: 14,
          }}
          icon={<DoDisturbOn />}
          color="error"  // You can set color to primary, secondary, success, error, etc.
        />
        <StatsCard
          title="Appointment Requests"
          total={13}
          statChange={{
            prefixText: 'Last month',
            current: 18,
            previous: 14,
          }}
          icon={<Pending />}
          color="warning"  // You can set color to primary, secondary, success, error, etc.
        />
      </Box>
      <Box className='flex justify-between w-full gap-16'>
        <StatsCard
          title="Total Questions"
          total={23}
          statChange={{
            prefixText: 'Last month',
            current: 40,
            previous: 48,
          }}
          icon={<Class />}
          color="primary"  // You can set color to primary, secondary, success, error, etc.
        />

        <StatsCard
          title="Answered Questions"
          total={113}
          statChange={{
            prefixText: 'Last month',
            current: 40,
            previous: 48,
          }}
          icon={<CheckCircle fontSize='large' />}
          color="success"  // You can set color to primary, secondary, success, error, etc.
        />

      </Box>
    </div>
  )
}

export default OverviewTab