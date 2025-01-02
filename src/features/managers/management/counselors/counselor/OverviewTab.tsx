import { PeriodFilter, StatsCard, SubHeading } from '@/shared/components'
import { useAppointmentsSocketListener, useQuestionsSocketListener, useRequestsSocketListener } from '@/shared/context'
import { getCurrentMonthYear, groupAppointmentsByDate } from '@/shared/utils'
import { Assignment, CheckCircle, Class, Description, DoDisturbOn, DoNotDisturb, Pending, Reviews } from '@mui/icons-material'
import { Box, Divider, SelectChangeEvent, Typography } from '@mui/material'
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
import CounselorAppointmentFeedbacksDistribution from './CounselorAppointmentFeedbacksDistribution'
import CounselorRecentAppointmentFeedbacks from './CounselorRecentAppointmentFeedbacks'
import CounselorRecentQuestionFeedbacks from './CounselorRecentQuestionFeedbacks'
import CounselorQuestionFeedbacksDistribution from './CounselorQuestionFeedbacksDistribution'
import { useState } from 'react'
import { useGetAllCounselingDemandsQuery } from '@/features/managers/dashboard/overview/overview-api'
import { periodDateRange } from '@/shared/constants'
import CounselorDemandsOverview from './CounselorDemandsOverview'
import { MonthCalendar } from '@mui/x-date-pickers'

const OverViewTab = ({ counselorId }: { counselorId?: string }) => {
  const { id: routeId } = useParams()
  const id = counselorId || routeId

  const today = dayjs().format('YYYY-MM-DD');
  const dispatch = useAppDispatch()
  const firstDayOfMonth = dayjs().startOf('month').format('YYYY-MM-DD');
  const lastDayOfMonth = dayjs().endOf('month').format('YYYY-MM-DD');

  const firstDayPreviousMonth = dayjs().subtract(1, 'month').startOf('month').format('YYYY-MM-DD');
  const lastDayOfPreviousMonth = dayjs().subtract(1, 'month').endOf('month').format('YYYY-MM-DD');

  const [selectedPeriod, setSelectedPeriod] = useState(`month`)

  const handlePeriodChange = (event: SelectChangeEvent) => {
    setSelectedPeriod(event.target.value as string);
  };

  const { data: totalAppointments } = useGetCounselorAppointmentsManagementQuery({
    size: 9999,
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

  const { data: appointmentRequestsPreviousMonth } = useGetCounselorAppointmentRequestsManagementQuery({
    size: 9999,
    dateFrom: firstDayPreviousMonth,
    dateTo: lastDayOfPreviousMonth,
    counselorId: Number(id)
  })


  const { data: totalQuestions, isLoading: isLoadingTotalQuetions, refetch: refetchTotalQuesionts } = useGetCounselorQuestionCardsManagementQuery({
    counselorId: Number(id),
    from: firstDayOfMonth,
    to: lastDayOfMonth,
    size: 9999,
  })

  const { data: totalQuestionsPreviousMonth, isLoading: isLoadingTotalQuetionsPreviousMonth, refetch: refetchTotalQuesiontsPreviousMonth } = useGetCounselorQuestionCardsManagementQuery({
    counselorId: Number(id),
    from: firstDayPreviousMonth,
    to: lastDayOfPreviousMonth,
    size: 9999,
  })


  const { data: demandsDataAll } = useGetAllCounselingDemandsQuery({
    from: periodDateRange[selectedPeriod].from,
    to: periodDateRange[selectedPeriod].to,
  });

  const demands = demandsDataAll?.content.filter(demand => demand.counselor?.id === Number(counselorId))

  const completedAppointments = totalAppointments?.content.data?.filter(item => item.status === 'ATTEND')
  const completedAppointmentsPreviousMonth = totalAppointmentsPreviousMonth?.content.data?.filter(item => item.status === 'ATTEND')

  const completedQuestions = totalQuestions?.content?.data.filter(qna => qna.answer) || []
  const rejectedQuestions = totalQuestions?.content?.data.filter(qna => ['REJECTED', 'FLAGGED'].includes(qna.status)) || []

  const completedQuestionsPreviousMonth = totalQuestionsPreviousMonth?.content?.data.filter(qna => qna.answer) || []
  // const rejectedQuestionsPreviousMonth = totalQuestionsPreviousMonth?.content?.data.filter(qna => ['REJECTED', 'FLAGGED'].includes(qna.status)) || []

  console.log(`😎`, totalAppointments)
  return (
    <section className='w-full container'>
      <div className='p-16 flex flex-col gap-16 '>
        <div className='flex justify-between'>
          <SubHeading title={`Appointments Overview - ${getCurrentMonthYear()}`} className='text-xl' size='large' />
          <PeriodFilter
            onPeriodChange={handlePeriodChange}
            period={selectedPeriod}
          />
        </div>
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
            total={completedAppointments?.length}
            statChange={{
              prefixText: 'Last month',
              current: completedAppointments?.length,
              previous: completedAppointmentsPreviousMonth?.length,
            }}
            icon={<CheckCircle />}
            color="success"  // You can set color to primary, secondary, success, error, etc.
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
          <StatsCard
            title="Appointment Feedbacks"
            total={totalAppointments?.content?.data.filter(item => item.appointmentFeedback).length}
            statChange={{
              prefixText: 'Last month',
              current: totalAppointments?.content?.data.filter(item => item.appointmentFeedback).length,
              previous: totalAppointmentsPreviousMonth?.content?.data.filter(item => item.appointmentFeedback).length,
            }}
            icon={<Reviews />}
            color="action"  // You can set color to primary, secondary, success, error, etc.
          />
        </Box>
        <div className='grid grid-cols-2 gap-16'>
          <CounselorAppointmentsWorkload counselorId={id} />
          <CounselorAppointmentsDistribution counselorId={id} />
        </div>
        <div className='grid grid-cols-4 gap-16'>
          <div className='col-span-3'>
            <CounselorRecentAppointmentFeedbacks counselorId={id} />
          </div>
          <CounselorAppointmentFeedbacksDistribution counselorId={id} />
        </div>

      </div >
      <div className='p-16 flex flex-col gap-16 mt-8'>
        {/* <Typography className='text-xl font-bold text-text-disabled'></Typography> */}
        <div className='flex justify-between'>
          <SubHeading title={`Question & Answer Overview - ${getCurrentMonthYear()}`} className='text-xl' size='large' />
          <PeriodFilter
            onPeriodChange={handlePeriodChange}
            period={selectedPeriod}
          />
        </div>
        <Box className='flex justify-between w-full gap-16'>
          <StatsCard
            title="Total Questions"
            total={totalQuestions?.content?.data?.length}
            statChange={{
              prefixText: 'Last month',
              current: totalQuestions?.content?.data?.length,
              previous: totalQuestionsPreviousMonth?.content?.data?.length,
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
              previous: completedQuestionsPreviousMonth.length,
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
              previous: completedQuestionsPreviousMonth.length,
            }}
            icon={<DoNotDisturb fontSize='large' />}
            color="error"  // You can set color to primary, secondary, success, error, etc.
          />

          <StatsCard
            title="Q&A Feedbacks"
            total={totalQuestions?.content?.data?.filter(item => item.feedback).length}
            statChange={{
              prefixText: 'Last month',
              current: totalQuestions?.content?.data?.filter(item => item.feedback).length,
              previous: totalQuestionsPreviousMonth?.content?.data?.filter(item => item.feedback).length,
            }}
            icon={<Reviews />}
            color="action"  // You can set color to primary, secondary, success, error, etc.
          />
        </Box>
        <div className='grid grid-cols-2 gap-16'>
          <CounselorQuestionsWorkload counselorId={id} />
          <CounselorQuestionsDistribution counselorId={id} />
        </div>

        <div className='grid grid-cols-4 gap-16'>
          <div className='col-span-3'>
            <CounselorRecentQuestionFeedbacks counselorId={id} />
          </div>
          <CounselorQuestionFeedbacksDistribution counselorId={id} />
        </div>
      </div >

      <div className='p-16 flex flex-col gap-16 mt-8'>
        <div className="flex justify-between gap-16">
          <SubHeading title={`Counseling Demands Overview - ${getCurrentMonthYear()}`} className='text-xl' size='large' />
          <PeriodFilter
            onPeriodChange={handlePeriodChange}
            period={selectedPeriod}
          />
        </div>
        <Box className='flex justify-between w-full gap-16'>
          <StatsCard
            title="Total Counseling Demands"
            total={demands?.length}
            statChange={{
              prefixText: 'Last month',
              current: totalQuestions?.content?.data?.length,
              previous: totalQuestionsPreviousMonth?.content?.data?.length,
            }}
            icon={<Assignment />}
            color="primary"  // You can set color to primary, secondary, success, error, etc.
          />

          <StatsCard
            title="Solved Counseling Demands"
            total={demands?.filter(item => item.status === `DONE`).length}
            statChange={{
              prefixText: 'Last month',
              current: completedQuestions.length,
              previous: completedQuestionsPreviousMonth.length,
            }}
            icon={<CheckCircle fontSize='large' />}
            color="success"  // You can set color to primary, secondary, success, error, etc.
          />
        </Box>
        <div >
          <CounselorDemandsOverview />
        </div>
      </div >
    </section>

  )
}

export default OverViewTab