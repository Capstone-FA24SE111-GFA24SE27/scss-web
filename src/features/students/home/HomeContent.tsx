import { StudentAppointmentItem, NavLinkAdapter, RequestItem, Scrollbar, StatChange, ContentLoading } from '@/shared/components'
import { ArrowForward, CalendarMonth, Cancel, CheckCircle, Description, DoDisturbOn, Pending } from '@mui/icons-material'
import { Box, Button, Divider, Paper, Typography } from '@mui/material'
import React from 'react'
import dayjs from 'dayjs'
import { useNavigate } from 'react-router-dom'
import { useGetCounselingAppointmentQuery, useGetCounselingAppointmentRequestsQuery } from '../services/activity/activity-api'
import { selectAccount, useAppDispatch, useAppSelector } from '@shared/store'
import { openCounselorView } from '../students-layout-slice'
import { useAppointmentsSocketListener, useQuestionsSocketListener, useRequestsSocketListener } from '@/shared/context'
import { groupAppointmentsByDate } from '@/shared/utils'
import { useGetStudentQuestionsQuery } from '../services/qna/qna-api'
import QnaItem from '../services/qna/QnaItem'

const HomeContent = () => {
  const account = useAppSelector(selectAccount)
  const today = dayjs().format('YYYY-MM-DD');

  const firstDayOfMonth = dayjs().startOf('month').format('YYYY-MM-DD');
  const lastDayOfMonth = dayjs().endOf('month').format('YYYY-MM-DD');

  const firstDayPreviousMonth = dayjs().subtract(1, 'month').startOf('month').format('YYYY-MM-DD');
  const lastDayOfPreviousMonth = dayjs().subtract(1, 'month').endOf('month').format('YYYY-MM-DD');

  const { data: requestsCurrentMonthData, isLoading: isLoadingRequest, refetch: refetchRequest } = useGetCounselingAppointmentRequestsQuery({
    dateFrom: firstDayOfMonth,
    dateTo: lastDayOfMonth,
  })

  useRequestsSocketListener(account?.profile.id, refetchRequest)

  const dispatch = useAppDispatch()

  const { data: upcomingAppointmentsData, isLoading: isLoadingAppointment, refetch: refetchAppointments } = useGetCounselingAppointmentQuery({
    fromDate: today,
    // toDate: lastDayOfMonth,
    status: `WAITING`,
  });

  useAppointmentsSocketListener(account?.profile.id, refetchAppointments)


  const pendingRequests = requestsCurrentMonthData?.content.data.filter(request => request.status === 'WAITING')
  const upcomingAppointments = upcomingAppointmentsData?.content.data


  const groupedAppointments = groupAppointmentsByDate(upcomingAppointments);

  const { data: qnaData, isLoading: isLoadingQuestions, refetch: refetchQna } = useGetStudentQuestionsQuery({
  })
  const askingQuestions = qnaData?.content.data.filter(item => !item.closed)
  useQuestionsSocketListener(account?.profile.id, refetchRequest)

  const navigate = useNavigate()
  return (
    <div className='p-16 w-full flex flex-col gap-16'>
      <Box className='grid grid-cols-12 gap-16'>
        <Paper className='col-span-full shadow p-16'>
          <div className='flex justify-between items-center px-8'>
            <Typography className='font-semibold text-xl'>Upcoming Appointments</Typography>
            <Button
              color='secondary'
              className=''
              onClick={() => navigate(`/services/activity`)}
            >View all</Button>
          </div>

          <Scrollbar className="flex flex-col gap-8 min-h-sm max-h-md overflow-y-auto p-4 ">
            {
              isLoadingAppointment
                ? <ContentLoading />
                : Object.keys(groupedAppointments).length === 0
                  ? <div className='flex flex-col justify-center gap-4 items-center'>
                    <Typography
                      color="textDisabled"
                      className='text-center'
                    >
                      You have no upcoming appointments
                    </Typography>
                    <Button
                      className='w-fit'
                      variant='text'
                      component={NavLinkAdapter}
                      to={`/services/counseling`}
                      endIcon={<ArrowForward />}
                    >
                      Book an appointment
                    </Button>
                  </div>
                  : Object.keys(groupedAppointments).map(dateLabel => (
                    <div key={dateLabel} className='px-4 mb-16'>
                      <div className='flex items-start h-full gap-8'>
                        <CalendarMonth color='secondary' fontSize='medium' />
                        <Typography color="textPrimary" className=' font-bold text-xl text-secondary-main'>{dateLabel}</Typography>
                      </div>
                      <div className='space-y-8 border-l-2 px-16 !border-secondary-main ml-16'>
                        {groupedAppointments[dateLabel].map(appointment => (
                          <div key={appointment.id} className='my-8'>
                            {/* @ts-ignored */}
                            <StudentAppointmentItem appointment={appointment} />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
            }
          </Scrollbar>
        </Paper>
      </Box>
      <Box className='grid gap-16'>
        <Paper className='shadow p-16'>
          <div className='flex justify-between items-center px-8'>
            <Typography className='font-semibold text-xl'>Asking Questions</Typography>
            <Button
              color='secondary'
              className=''
              onClick={() => navigate(`/services/qna`)}
            >View all</Button>
          </div>
          <Scrollbar className='flex flex-col gap-8 p-4 mt-8 min-h-xs'>
            {
              isLoadingQuestions
                ? <ContentLoading />
                : !askingQuestions?.length
                  ? <div className='flex flex-col justify-center gap-4 items-center'>
                    <Typography
                      color="textDisabled"
                      className='text-center'
                    >
                      You have not asked any questions
                    </Typography>
                    <Button
                      className='w-fit'
                      variant='text'
                      component={NavLinkAdapter}
                      to={`/services/qna/create`}
                      endIcon={<ArrowForward />}
                    >
                      Ask a question
                    </Button>
                  </div>
                  : <div className='flex flex-col gap-16'>
                    {
                      askingQuestions?.map(item =>
                        <QnaItem
                          key={item?.id}
                          qna={askingQuestions[0]}
                        />
                      )}
                  </div>
            }
          </Scrollbar>
        </Paper>

      </Box>
    </div >
  )
}

export default HomeContent