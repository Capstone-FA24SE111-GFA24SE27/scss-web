import { StatsCard } from '@/shared/components'
import { Archive, AssignmentLate, Class, Description, EmojiPeople, Face, Handshake, Save, School, SupportAgent, TagFaces } from '@mui/icons-material'
import React from 'react'
import AppointmentChart from './AppointmentChart';
import RequestChart from './RequestChart';
import QnaChart from './QnaChart';
import { Typography } from '@mui/material';
import { getCurrentMonthYear } from '@/shared/utils';
import { useGetAllAppointmentRequestsQuery, useGetAllAppointmentsQuery, useGetAllCounselingDemandsQuery, useGetAllQuestionCardsQuery } from './overview-api';
import { firstDayOfMonth, lastDayOfMonth } from '@/shared/constants';
import DemandChart from './DemadChart';
import { useGetStudentsFilterQuery } from '@/shared/pages';
import { useGetCounselorsAcademicQuery, useGetCounselorsNonAcademicQuery } from '@/features/students/services/counseling/counseling-api';
import { useGetSupportStaffManagementQuery, useGetSupportStaffsManagementQuery } from '../../management/support-staffs/support-staffs-api';
import AppointmentOverview from './AppointmentOverview';

const Overview = () => {
  const { data: appointmentRequestsOverview, isLoading: isLoadingAppoitnmentRequestsOverview } = useGetAllAppointmentRequestsQuery({
    from: firstDayOfMonth,
    to: lastDayOfMonth
  })

  const { data: appointmentsOverview, isLoading: isLoadingAppoitnmentsOverview } = useGetAllAppointmentsQuery({
    from: firstDayOfMonth,
    to: lastDayOfMonth
  })

  const { data: questionCardsOverview, isLoading: isLoadingQuestionCardsOverview } = useGetAllQuestionCardsQuery({
    from: firstDayOfMonth,
    to: lastDayOfMonth
  })

  const { data: counselingDemandsOverview, isLoading: isLoadingCounselingDemandsOverview } = useGetAllCounselingDemandsQuery({
    from: firstDayOfMonth,
    to: lastDayOfMonth
  })

  const { data: students } = useGetStudentsFilterQuery({
    size: 9999
  })

  const { data: academicCounselors } = useGetCounselorsAcademicQuery({
  })

  const { data: nonAcademicCounselors } = useGetCounselorsNonAcademicQuery({
  })

  const { data: supportStaffs } = useGetSupportStaffsManagementQuery({
    size: 9999,
  })

  return (
    <div className='p-32'>
      <Typography className='text-xl font-bold text-text-disabled'>Users Overview</Typography>
      <div className='grid grid-cols-4 gap-16 mt-8'>
        <StatsCard
          title={'Students'}
          total={students?.data.length}
          // statChange={{
          //   prefixText: 'Last month',
          //   current: 1234,
          //   previous: 12553
          // }}
          icon={<Face />}
        />
        <StatsCard
          title={'Academic Counselors'}
          total={academicCounselors?.content.totalElements}
          // statChange={{
          //   prefixText: 'Last month',
          //   current: 1234,
          //   previous: 24
          // }}
          icon={<School />}
        />
        <StatsCard
          title={'Non-academic Counselors'}
          total={nonAcademicCounselors?.content.totalElements}
          // statChange={{
          //   prefixText: 'Last month',
          //   current: 1234,
          //   previous: 12553
          // }}
          icon={<Handshake />}
        />
        <StatsCard
          title={'Support Staffs'}
          total={supportStaffs?.content.totalElements}
          // statChange={{
          //   prefixText: 'Last month',
          //   current: 123234,
          //   previous: 1553
          // }}
          icon={<EmojiPeople />}
        />
      </div>
      <Typography className='text-xl font-bold text-text-disabled mt-24'>Activities Overview - {getCurrentMonthYear()}</Typography>

      <div className='grid grid-cols-4 gap-16 mt-8'>
        <StatsCard
          title={'Requests'}
          total={appointmentRequestsOverview?.content?.length}
          statChange={{
            prefixText: 'Last month',
            current: appointmentRequestsOverview?.content?.length,
            previous: 0
          }}
          icon={<Archive />}
        />

        <StatsCard
          title={'Appointments'}
          total={appointmentsOverview?.content?.length}
          statChange={{
            prefixText: 'Last month',
            current: appointmentsOverview?.content?.length,
            previous: 0
          }}
          icon={<Description />}
        />

        <StatsCard
          title={'Q&As'}
          total={questionCardsOverview?.content?.length}
          statChange={{
            prefixText: 'Last month',
            current: questionCardsOverview?.content?.length,
            previous: 0
          }}
          icon={<Class />}
        />

        <StatsCard
          title={'Demands'}
          total={counselingDemandsOverview?.content?.length}
          statChange={{
            prefixText: 'Last month',
            current: counselingDemandsOverview?.content?.length,
            previous: 0
          }}
          icon={<AssignmentLate />}
        />
      </div>
      <div className='mt-16 flex flex-col gap-16'>
        <AppointmentOverview />
        {/* <AppointmentChart /> */}
        <RequestChart />
        <QnaChart />
        <DemandChart />
      </div>
    </div>
  )
}

export default Overview