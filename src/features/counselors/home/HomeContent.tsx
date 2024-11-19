import { ContentLoading, CounselorAppointmentItem, NavLinkAdapter, RequestItem, Scrollbar, StatChange, StatsCard } from '@/shared/components'
import { CalendarMonth, Cancel, CheckCircle, Class, Description, DoDisturbOn, Pending } from '@mui/icons-material'
import { Box, Button, Divider, Paper, Typography } from '@mui/material'
import React from 'react'
import { useGetCounselorAppointmentRequestsQuery } from '../counseling/requests/requests-api'
import dayjs from 'dayjs'
import { useGetCounselorCounselingAppointmentQuery } from '../counseling/appointments/appointments-api'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch } from '@shared/store'
import { openStudentView } from '../counselors-layout-slice'
import { useAppSelector } from '@shared/store'
import { selectAccount } from '@shared/store'
import { useAppointmentsSocketListener, useRequestsSocketListener, useQuestionsSocketListener } from '@/shared/context'
import { groupAppointmentsByDate } from '@/shared/utils'
import { useGetMyCounselorQuestionsQuery } from '../qna/qna-api'
import MyQnaItem from '../qna/my-qna/MyQnaItem'
import { motion } from 'framer-motion';
import { motionVariants } from '@/shared/configs'
import FeedbackTab from '@/features/managers/management/counselors/counselor/FeedbackTab'
import CounselorFeedbackTab from './CounselorFeedback'

const HomeContent = () => {
  const account = useAppSelector(selectAccount)
  const today = dayjs().format('YYYY-MM-DD');
  const dispatch = useAppDispatch()
  const firstDayOfMonth = dayjs().startOf('month').format('YYYY-MM-DD');
  const lastDayOfMonth = dayjs().endOf('month').format('YYYY-MM-DD');

  const firstDayPreviousMonth = dayjs().subtract(1, 'month').startOf('month').format('YYYY-MM-DD');
  const lastDayOfPreviousMonth = dayjs().subtract(1, 'month').endOf('month').format('YYYY-MM-DD');

  const { data: requestsCurrentMonthData, isLoading: isLoadingRequest, refetch: refetchRequest } = useGetCounselorAppointmentRequestsQuery({
    dateFrom: firstDayOfMonth,
    dateTo: lastDayOfMonth,
  })

  useRequestsSocketListener(account?.profile.id, refetchRequest)


  const { data: upcomingAppointmentsData, isLoading: isLoadingAppointment, refetch: refetchAppointments } = useGetCounselorCounselingAppointmentQuery({
    fromDate: today,
    // toDate: lastDayOfMonth,
    status: `WAITING`,
  });

  useAppointmentsSocketListener(account?.profile.id, refetchAppointments)

  const pendingRequests = requestsCurrentMonthData?.content.data.filter(request => request.status === 'WAITING')
  const upcomingAppointments = upcomingAppointmentsData?.content.data


  const groupedAppointments = groupAppointmentsByDate(upcomingAppointments);

  const { data: qnaData, isLoading: isLoadingQuestions, refetch: refetchQna } = useGetMyCounselorQuestionsQuery({})
  const unansweredQuestionList = qnaData?.content?.data?.filter(question => !question.answer) || []

  useQuestionsSocketListener(account?.profile.id, refetchQna)

  const navigate = useNavigate()
  return (
    <section className='w-full container mx-auto'>

      <div className='p-16 flex flex-col gap-16 '>
        <Typography className='text-xl font-bold text-text-disabled'>Counseling Overview</Typography>
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
        <Box className='grid grid-cols-12 gap-16'>
          <Paper className='col-span-4 shadow p-16'>
            <div className='flex justify-between items-center px-8'>
              <Typography className='font-semibold text-xl'>Pending Requests</Typography>
              <Button
                color='secondary'
                className=''
                onClick={() => navigate(`/counseling/requests`)}
              >View all</Button>
            </div>
            <Scrollbar className='flex flex-col gap-8 min-h-sm max-h-md overflow-y-auto p-4 divide-y-2 mt-8'>
              {
                isLoadingRequest
                  ? <ContentLoading />
                  : !pendingRequests?.length
                    ? <Typography className='text-center' color='textDisabled'>No pending appointments</Typography>
                    : pendingRequests.map(request => <div className='rounded shadow' key={request.id} >
                      <RequestItem appointment={request} onUserClick={() => dispatch(openStudentView(request.student.id.toString()))} />
                    </div>
                    )
              }
            </Scrollbar>
          </Paper>
          <Paper className='col-span-8 shadow p-16'>
            <div className='flex justify-between items-center px-8'>
              <Typography className='font-semibold text-xl'>Upcoming Appointments</Typography>
              <Button
                color='secondary'
                className=''
                onClick={() => navigate(`/counseling/appointments`)}
              >View all</Button>
            </div>

            <Scrollbar className="flex flex-col gap-8 min-h-sm max-h-md overflow-y-auto p-4 ">
              {
                isLoadingAppointment
                  ? <ContentLoading />
                  : Object.keys(groupedAppointments).length === 0
                    ? <Typography className="text-center" color="textDisabled">No pending requests</Typography>
                    : Object.keys(groupedAppointments).map(dateLabel => (
                      <div key={dateLabel} className='px-4 mb-16'>
                        <div className='flex items-start h-full gap-8'>
                          <CalendarMonth color='secondary' fontSize='medium' />
                          <Typography color="textPrimary" className=' font-bold text-xl text-secondary-main'>{dateLabel}</Typography>
                        </div>
                        <div className='space-y-8 border-l-2 px-16 !border-secondary-main ml-16'>
                          {groupedAppointments[dateLabel].map(appointment => (
                            <div key={appointment.id} className='py-8'>
                              <CounselorAppointmentItem appointment={appointment} />
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
              }
            </Scrollbar>
          </Paper>
        </Box>
        <Paper className={`flex flex-col gap-16 bg-white p-16 shadow`}>
          <Typography className='font-semibold text-xl px-8'>Recent Feedbacks</Typography>
          <CounselorFeedbackTab />
        </Paper>

      </div >
      <div className='p-16 flex flex-col gap-16 mt-8'>
        <Typography className='text-2xl font-bold text-text-disabled'>Question & Answer Overview</Typography>
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
        <Box className='grid gap-16'>
          <Paper className='shadow p-16'>
            <div className='flex justify-between items-center px-8'>
              <Typography className='font-semibold text-xl'>Unanswered Questions</Typography>
              <Button
                color='secondary'
                className=''
                onClick={() => navigate(`/qna/my-qna`)}
              >View all</Button>
            </div>
            <Scrollbar className='flex flex-col gap-8 p-4 mt-8 min-h-xs'>
              {
                isLoadingQuestions
                  ? <ContentLoading />
                  : !unansweredQuestionList?.length
                    ? <Typography className='text-center' color='textDisabled'>No unanswered questions</Typography>
                    : <MyQnaItem
                      qna={unansweredQuestionList[0]}
                    />
              }
            </Scrollbar>
          </Paper>

        </Box>
      </div >
    </section>

  )
}

export default HomeContent