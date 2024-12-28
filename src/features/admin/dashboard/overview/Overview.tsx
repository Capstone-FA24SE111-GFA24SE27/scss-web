import { AppLoading, StatsCard } from '@/shared/components'
import { EmojiPeople, Face, Handshake, School, SupervisedUserCircle } from '@mui/icons-material'
import React from 'react'
import { Typography } from '@mui/material';
import { getCurrentMonthYear } from '@/shared/utils';
import { firstDayOfMonth, lastDayOfMonth, roles } from '@/shared/constants';
import { useGetStudentsFilterQuery } from '@/shared/pages';
import { useGetCounselorsAcademicQuery, useGetCounselorsNonAcademicQuery } from '@/features/students/services/counseling/counseling-api';
import { useGetAccountsQuery } from '../../accounts/admin-accounts-api';
import { Role } from '@/shared/types';

const Overview = () => {
  // const { data: appointmentRequestsOverview, isLoading: isLoadingAppoitnmentRequestsOverview } = useGetAllAppointmentRequestsQuery({
  //   from: firstDayOfMonth,
  //   to: lastDayOfMonth
  // })

  // const { data: appointmentsOverview, isLoading: isLoadingAppoitnmentsOverview } = useGetAllAppointmentsQuery({
  //   from: firstDayOfMonth,
  //   to: lastDayOfMonth
  // })

  // const { data: questionCardsOverview, isLoading: isLoadingQuestionCardsOverview } = useGetAllQuestionCardsQuery({
  //   from: firstDayOfMonth,
  //   to: lastDayOfMonth
  // })

  // const { data: counselingDemandsOverview, isLoading: isLoadingCounselingDemandsOverview } = useGetAllCounselingDemandsQuery({
  //   from: firstDayOfMonth,
  //   to: lastDayOfMonth
  // })

  const { data: students, isLoading: isLoadingStudent } = useGetStudentsFilterQuery({
    size: 9999
  })

  const { data: academicCounselors, isLoading: isLoadingACounselor } = useGetCounselorsAcademicQuery({
  })

  const { data: nonAcademicCounselors, isLoading: isLoadingNACounselor } = useGetCounselorsNonAcademicQuery({
  })

  const { data: supportStaffs, isLoading: isLoadingStaff } = useGetAccountsQuery({size: 9999, role: roles.SUPPORT_STAFF as Role})

  const {data: managers, isLoading: isLoadingManager } = useGetAccountsQuery({size: 9999, role: roles.MANAGER as Role})

  if(isLoadingStudent || isLoadingACounselor || isLoadingManager || isLoadingNACounselor || isLoadingStaff){
    return (
      <AppLoading />
    )
  }

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
         <StatsCard
          title={'Managers'}
          total={managers?.content.totalElements}
          // statChange={{
          //   prefixText: 'Last month',
          //   current: 1234,
          //   previous: 24
          // }}
          icon={<SupervisedUserCircle />}
        />
      </div>
      {/* <Typography className='mt-24 text-xl font-bold text-text-disabled'>Activities Overview - {getCurrentMonthYear()}</Typography> */}

      {/* <div className='grid grid-cols-4 gap-16 mt-8'>
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
      </div> */}
      {/* <div className='flex flex-col gap-16 mt-16'>
        <AppointmentOverview />
        <AppointmentChart />
        <RequestChart />
        <QnaChart />
        <DemandChart />
      </div> */}
    </div>
  )
}

export default Overview