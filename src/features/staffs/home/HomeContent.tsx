import { ContentLoading, CounselorAppointmentItem, NavLinkAdapter, RequestItem, Scrollbar, StatChange, StatsCard } from '@/shared/components'
import { CalendarMonth, Cancel, CheckCircle, Class, ConstructionOutlined, Description, DoDisturbOn, Pending } from '@mui/icons-material'
import { Box, Button, Divider, Paper, Typography } from '@mui/material'
import React from 'react'
import dayjs from 'dayjs'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch } from '@shared/store'
import { useAppSelector } from '@shared/store'
import { selectAccount } from '@shared/store'
import { useRequestsSocketListener, useQuestionsSocketListener } from '@/shared/context'
import { getCurrentMonthYear, groupAppointmentsByDate } from '@/shared/utils'
import { staffQnaApi, useGetAllQuestionCardsQuery, useGetQuestionsQuery } from '../qna'
import QnaItem from '../qna/QnaItem'

const HomeContent = () => {
  const account = useAppSelector(selectAccount)
  const today = dayjs().format('YYYY-MM-DD');
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const firstDayOfMonth = dayjs().startOf('month').format('YYYY-MM-DD');
  const lastDayOfMonth = dayjs().endOf('month').format('YYYY-MM-DD');

  const firstDayPreviousMonth = dayjs().subtract(1, 'month').startOf('month').format('YYYY-MM-DD');
  const lastDayOfPreviousMonth = dayjs().subtract(1, 'month').endOf('month').format('YYYY-MM-DD');

  const {data: previousMonthQuestionCardsData, isLoading: isLoadingPreviousMonthQuestions, refetch: refetchPrev} = useGetAllQuestionCardsQuery({from: firstDayPreviousMonth, to: lastDayOfPreviousMonth})
  const {data: currentMonthQuestionCardsData, isLoading: isLoadingCurrentMonthQuestions, refetch: refetchCurr} = useGetAllQuestionCardsQuery({from: firstDayOfMonth, to: lastDayOfMonth})
  const { data: qnaData , refetch, isLoading} = useGetQuestionsQuery({
		sortDirection: 'ASC',	
		page: 1,
	});

  console.log('prev ',previousMonthQuestionCardsData)
  console.log('curr ',currentMonthQuestionCardsData)

  const prevMonthQuestions = previousMonthQuestionCardsData?.content
  const currMonthQuestions = currentMonthQuestionCardsData?.content

  const verifiedQuestionsLastMonth = prevMonthQuestions?.filter((qnaItem) => qnaItem.status !== 'PENDING' && qnaItem.status !== 'REJECTED')
  const verifiedQuestionsCurrentMonth = currMonthQuestions?.filter((qnaItem) => qnaItem.status !== 'PENDING' && qnaItem.status !== 'REJECTED')

  const flaggedQuestionsLastMonth = prevMonthQuestions?.filter((qnaItem) => qnaItem.status === 'FLAGGED')
  const flaggedQuestionsCurrentMonth = currMonthQuestions?.filter((qnaItem) => qnaItem.status === 'FLAGGED')

  const pendingQuestions = qnaData?.content.data

  const refetchQuestions = () => {
    staffQnaApi.util.invalidateTags(['qna'])
  }

	useQuestionsSocketListener(account?.profile.id, refetchQuestions)

  if(!verifiedQuestionsLastMonth || !flaggedQuestionsLastMonth || !pendingQuestions) return


  return (
    <section className='container w-full mx-auto'>

      <div className='flex flex-col gap-16 p-16 '>
        <Typography className='text-xl font-bold text-text-disabled'>Counseling Overview - {getCurrentMonthYear()}</Typography>
        <Box className='flex justify-between w-full gap-16'>

          <StatsCard
            title="Verified Questions"
            total={verifiedQuestionsLastMonth.length}
            statChange={{
              prefixText: 'Last month',
              current: 40,
              previous: 48,
            }}
            icon={<Description />}
            color="primary"  // You can set color to primary, secondary, success, error, etc.
          />

          <StatsCard
            title="Flagged Questions"
            total={flaggedQuestionsLastMonth.length}
            statChange={{
              prefixText: 'Last month',
              current: 52,
              previous: 48,
            }}
            icon={<CheckCircle />}
            color="success"  // You can set color to primary, secondary, success, error, etc.
          />
          {/* <StatsCard
            title="Canceled Appontments"
            total={canceledAppointments?.content?.data.length}
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
            total={pendingAppointments?.content?.data.length}
            statChange={{
              prefixText: 'Last month',
              current: 18,
              previous: 14,
            }}
            icon={<Pending />}
            color="warning"  // You can set color to primary, secondary, success, error, etc.
          /> */}
        </Box>
        <Box className='grid grid-cols-12 gap-16'>
          <Paper className='col-span-4 p-16 shadow'>
            <div className='flex items-center justify-between px-8'>
              <Typography className='text-xl font-semibold'>Pending Requests</Typography>
              <Button
                color='secondary'
                className=''
                onClick={() => navigate(`/counseling/requests`)}
              >View all</Button>
            </div>
            <Scrollbar className='flex flex-col gap-8 p-4 mt-8 overflow-y-auto divide-y-2 min-h-sm max-h-md'>
              {
                isLoading
                  ? <ContentLoading />
                  : !pendingQuestions?.length
                    ? <Typography className='text-center' color='textDisabled'>No pending appointments</Typography>
                    : pendingQuestions.map(question => <div className='rounded shadow' key={question.id} >
                      <QnaItem qna={question}/>
                    </div>
                    )
              }
            </Scrollbar>
          </Paper>
          <Paper className='col-span-8 p-16 shadow'>
            <div className='flex items-center justify-between px-8'>
              <Typography className='text-xl font-semibold'>Upcoming Appointments</Typography>
              <Button
                color='secondary'
                className=''
                onClick={() => navigate(`/counseling/appointments`)}
              >View all</Button>
            </div>

            {/* <Scrollbar className="flex flex-col gap-8 p-4 overflow-y-auto min-h-sm max-h-md ">
              {
                isLoadingAppointment
                  ? <ContentLoading />
                  : Object.keys(groupedAppointments).length === 0
                    ? <Typography className="text-center" color="textDisabled">No pending requests</Typography>
                    : Object.keys(groupedAppointments).map(dateLabel => (
                      <div key={dateLabel} className='px-4 mb-16'>
                        <div className='flex items-start h-full gap-8'>
                          <CalendarMonth color='secondary' fontSize='medium' />
                          <Typography color="textPrimary" className='text-xl font-bold text-secondary-main'>{dateLabel}</Typography>
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
            </Scrollbar> */}
          </Paper>
        </Box>

      </div >
      <div className='flex flex-col gap-16 p-16 mt-8'>
        <Typography className='text-2xl font-bold text-text-disabled'>Question & Answer Overview - {getCurrentMonthYear()}</Typography>
        <Box className='flex justify-between w-full gap-16'>
          {/* <StatsCard
            title="Total Questions"
            total={completedQuestions?.content?.data?.length}
            // statChange={{
            //   prefixText: 'Last month',
            //   current: 40,
            //   previous: 48,
            // }}
            icon={<Class />}
            color="primary"  // You can set color to primary, secondary, success, error, etc.
          />

          <StatsCard
            title="Answered Questions"
            total={totalQuestions?.content?.data?.length}
            // statChange={{
            //   prefixText: 'Last month',
            //   current: 40,
            //   previous: 48,
            // }}
            icon={<CheckCircle fontSize='large' />}
            color="success"  // You can set color to primary, secondary, success, error, etc.
          /> */}

        </Box>
        <Box className='grid gap-16'>
          <Paper className='p-16 shadow'>
            <div className='flex items-center justify-between px-8'>
              <Typography className='text-xl font-semibold'>Unanswered Questions</Typography>
              <Button
                color='secondary'
                className=''
                onClick={() => navigate(`/qna/my-qna`)}
              >View all</Button>
            </div>
            {/* <Scrollbar className='flex flex-col gap-8 p-4 mt-8 min-h-xs'>
              // {
              //   isLoadingQuestions
              //     ? <ContentLoading />
              //     : !unansweredQuestionList?.length
              //       ? <Typography className='text-center' color='textDisabled'>No unanswered questions</Typography>
              //       : <MyQnaItem
              //         qna={unansweredQuestionList[0]}
              //       />
              // } 
            </Scrollbar> */}
          </Paper>

        </Box>
      </div >
    </section>

  )
}

export default HomeContent