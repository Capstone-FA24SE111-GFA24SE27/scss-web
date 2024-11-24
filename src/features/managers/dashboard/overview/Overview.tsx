import { StatsCard } from '@/shared/components'
import { Archive, AssignmentLate, Class, Description, Handshake, Save, School, SupportAgent, TagFaces } from '@mui/icons-material'
import React from 'react'
import AppointmentChart from './AppointmentChart';
import RequestChart from './RequestChart';
import QnaChart from './QnaChart';

const Overview = () => {
  return (
    <div className='p-32'>
      <div className='grid grid-cols-4 gap-16'>
        <StatsCard
          title={'Students'}
          total={20}
          statChange={{
            prefixText: 'Last month',
            current: 1234,
            previous: 12553
          }}
          icon={<TagFaces />}
        />
        <StatsCard
          title={'Academic Counselors'}
          total={20}
          statChange={{
            prefixText: 'Last month',
            current: 1234,
            previous: 24
          }}
          icon={<School />}
        />
        <StatsCard
          title={'Non-academic Counselors'}
          total={20}
          statChange={{
            prefixText: 'Last month',
            current: 1234,
            previous: 12553
          }}
          icon={<Handshake />}
        />
        <StatsCard
          title={'Support Staffs'}
          total={20}
          statChange={{
            prefixText: 'Last month',
            current: 123234,
            previous: 1553
          }}
          icon={<SupportAgent />}
        />
        <StatsCard
          title={'Requests'}
          total={21}
          statChange={{
            prefixText: 'Last month',
            current: 1234,
            previous: 13
          }}
          icon={<Archive />}
        />

        <StatsCard
          title={'Appointments'}
          total={20}
          statChange={{
            prefixText: 'Last month',
            current: 1234,
            previous: 12553
          }}
          icon={<Description />}
        />

        <StatsCard
          title={'Q&As'}
          total={20}
          statChange={{
            prefixText: 'Last month',
            current: 1234,
            previous: 12553
          }}
          icon={<Class />}
        />

        <StatsCard
          title={'Demands'}
          total={20}
          statChange={{
            prefixText: 'Last month',
            current: 1234,
            previous: 12553
          }}
          icon={<AssignmentLate />}
        />
      </div>
      <div className='mt-16 flex flex-col gap-16'>
        <AppointmentChart />
        <RequestChart />
        <QnaChart />
      </div>
    </div>
  )
}

export default Overview