import { StatsCard } from '@/shared/components'
import { useAppointmentsSocketListener, useQuestionsSocketListener, useRequestsSocketListener } from '@/shared/context'
import { getCurrentMonthYear, groupAppointmentsByDate } from '@/shared/utils'
import { CheckCircle, Class, Description, DoDisturbOn, DoNotDisturb, Pending } from '@mui/icons-material'
import { Box, Divider, Typography } from '@mui/material'
import { selectAccount, useAppDispatch, useAppSelector } from '@shared/store'
import dayjs from 'dayjs'
import { useNavigate, useParams } from 'react-router-dom'
import { useGetCounselorAppointmentsManagementQuery, useGetCounselorAppointmentRequestsManagementQuery, useGetCounselorQuestionCardsManagementQuery } from '../counselors-api'
import CounselorQuestionsDistribution from './CounselorQuestionsDistribution'
import CounselorQuestionsWorkload from './CounselorQuestionsWorkload'
import AppointmentsChart from '@/features/managers/dashboard/overview/AppointmentsOverview'
import AppointmentsDistribution from '@/features/managers/dashboard/overview/AppointmentsDistribution'
import CounselorAppointmentsWorkload from './CounselorAppointmentsWorkload'
import CounselorAppointmentsDistribution from './CounselorAppointmentsDistribution'

const OverViewTab = () => {
  const { id } = useParams()

  const today = dayjs().format('YYYY-MM-DD');
  const dispatch = useAppDispatch()
  const firstDayOfMonth = dayjs().startOf('month').format('YYYY-MM-DD');
  const lastDayOfMonth = dayjs().endOf('month').format('YYYY-MM-DD');

  const firstDayPreviousMonth = dayjs().subtract(1, 'month').startOf('month').format('YYYY-MM-DD');
  const lastDayOfPreviousMonth = dayjs().subtract(1, 'month').endOf('month').format('YYYY-MM-DD');




  const { data: totalAppointments } = useGetCounselorAppointmentsManagementQuery({
    size: 9999,
    fromDate: firstDayOfMonth,
    toDate: lastDayOfMonth,
    counselorId: Number(id)
  });
  const { data: completedAppointments } = useGetCounselorAppointmentsManagementQuery({
    status: `ATTEND`,
    fromDate: firstDayOfMonth,
    toDate: lastDayOfMonth,
    counselorId: Number(id)
  });
  const { data: canceledAppointments } = useGetCounselorAppointmentsManagementQuery({
    status: `CANCELED`,
    fromDate: firstDayOfMonth,
    toDate: lastDayOfMonth,
    counselorId: Number(id)
  });

  const { data: appointmentRequests, refetch: refetchAppointmentRequests } = useGetCounselorAppointmentRequestsManagementQuery({
    size: 9999,
    dateFrom: firstDayOfMonth,
    dateTo: lastDayOfMonth,
    counselorId: Number(id)

  })


  const { data: totalAppointmentsPreviousMonth } = useGetCounselorAppointmentsManagementQuery({
    size: 9999,
    fromDate: firstDayPreviousMonth,
    toDate: lastDayOfPreviousMonth,
    counselorId: Number(id)

  });
  const { data: completedAppointmentsPreviousMonth } = useGetCounselorAppointmentsManagementQuery({
    status: `ATTEND`,
    size: 9999,
    fromDate: firstDayPreviousMonth,
    toDate: lastDayOfPreviousMonth,
    counselorId: Number(id)

  });
  const { data: canceledAppointmentsPreviousMonth } = useGetCounselorAppointmentsManagementQuery({
    status: `CANCELED`,
    size: 9999,
    fromDate: firstDayPreviousMonth,
    toDate: lastDayOfPreviousMonth,
    counselorId: Number(id)

  });

  const { data: appointmentRequestsPreviousMonth } = useGetCounselorAppointmentRequestsManagementQuery({
    size: 9999,
    dateFrom: firstDayPreviousMonth,
    dateTo: lastDayOfPreviousMonth,
    counselorId: Number(id)
  })


  const { data: totalQuestions, isLoading: isLoadingTotalQuetions, refetch: refetchTotalQuesionts } = useGetCounselorQuestionCardsManagementQuery({
    counselorId: Number(id),
    size: 9999,
  })

  const completedQuestions = totalQuestions?.content?.data.filter(qna => qna.answer) || []
  const rejectedQuestions = totalQuestions?.content?.data.filter(qna => ['REJECTED', 'FLAGGED'].includes(qna.status)) || []


  console.log(totalAppointments)
  return (
    <section className='w-full container mx-auto'>
      <div className='p-16 flex flex-col gap-16 '>
        <Typography className='text-xl font-bold text-text-disabled'>Booking Overview - {getCurrentMonthYear()}</Typography>
        <Box className='flex justify-between w-full gap-16'>

          <StatsCard
            title="Total Appontments"
            total={totalAppointments?.content?.data.length}
            statChange={{
              prefixText: 'Last month',
              current: totalAppointments?.content?.data.length,
              previous: totalAppointmentsPreviousMonth?.content?.data.length,
            }}
            icon={<Description />}
            color="primary"  // You can set color to primary, secondary, success, error, etc.
          />

          <StatsCard
            title="Completed Appointment"
            total={completedAppointments?.content?.data.length}
            statChange={{
              prefixText: 'Last month',
              current: completedAppointments?.content?.data.length,
              previous: completedAppointmentsPreviousMonth?.content?.data.length,
            }}
            icon={<CheckCircle />}
            color="success"  // You can set color to primary, secondary, success, error, etc.
          />
          <StatsCard
            title="Canceled Appontments"
            total={canceledAppointments?.content?.data.length}
            statChange={{
              prefixText: 'Last month',
              current: canceledAppointments?.content?.data.length,
              previous: canceledAppointmentsPreviousMonth?.content?.data.length,
            }}
            icon={<DoDisturbOn />}
            color="error"  // You can set color to primary, secondary, success, error, etc.
          />
          <StatsCard
            title="Appointment Requests"
            total={appointmentRequests?.content?.data.length}
            statChange={{
              prefixText: 'Last month',
              current: appointmentRequests?.content?.data.length,
              previous: appointmentRequestsPreviousMonth?.content?.data.length,
            }}
            icon={<Pending />}
            color="warning"  // You can set color to primary, secondary, success, error, etc.
          />
        </Box>
        <div className='grid grid-cols-2 gap-16'>
          <CounselorAppointmentsWorkload />
          <CounselorAppointmentsDistribution />
        </div>
      </div >
      <Divider className='mt-16' />
      <div className='p-16 flex flex-col gap-16 mt-8'>
        <Typography className='text-xl font-bold text-text-disabled'>Question & Answer Overview - {getCurrentMonthYear()}</Typography>
        <Box className='flex justify-between w-full gap-16'>
          <StatsCard
            title="Total Questions"
            total={totalQuestions?.content?.data?.length}
            statChange={{
              prefixText: 'Last month',
              current: totalQuestions?.content?.data?.length,
              previous: 0,
            }}
            icon={<Class />}
            color="primary"  // You can set color to primary, secondary, success, error, etc.
          />

          <StatsCard
            title="Answered Questions"
            total={completedQuestions.length}
            statChange={{
              prefixText: 'Last month',
              current: completedQuestions.length,
              previous: 0,
            }}
            icon={<CheckCircle fontSize='large' />}
            color="success"  // You can set color to primary, secondary, success, error, etc.
          />

          <StatsCard
            title="Rejected/Flagged Questions"
            total={rejectedQuestions.length}
            statChange={{
              prefixText: 'Last month',
              current: rejectedQuestions.length,
              previous: 0,
            }}
            icon={<DoNotDisturb fontSize='large' />}
            color="error"  // You can set color to primary, secondary, success, error, etc.
          />
        </Box>
        <div className='grid grid-cols-2 gap-16'>
          <CounselorQuestionsWorkload />
          <CounselorQuestionsDistribution />
        </div>
      </div >
    </section>

  )
}

export default OverViewTab