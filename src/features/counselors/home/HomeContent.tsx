import { ContentLoading, CounselorAppointmentItem, NavLinkAdapter, RequestItem, Scrollbar, StatChange } from '@/shared/components'
import { Cancel, CheckCircle, Description, DoDisturbOn, Pending } from '@mui/icons-material'
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
import { useAppointmentsSocketListener, useRequestsSocketListener } from '@/shared/context'

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

  const groupAppointmentsByDate = (appointments) => {
    const today = dayjs();
    const tomorrow = dayjs().add(1, 'day');

    // Sort appointments by startDateTime
    const sortedAppointments = [...(appointments || [])].sort((a, b) =>
      dayjs(a.startDateTime).diff(dayjs(b.startDateTime))
    );

    // Group sorted appointments by date
    return sortedAppointments.reduce((groups, appointment) => {
      const startDate = dayjs(appointment.startDateTime);
      let dateLabel;

      if (startDate.isSame(today, 'day')) {
        dateLabel = 'Today';
      } else if (startDate.isSame(tomorrow, 'day')) {
        dateLabel = 'Tomorrow';
      } else {
        dateLabel = startDate.format('YYYY/MM/DD');
      }

      if (!groups[dateLabel]) {
        groups[dateLabel] = [];
      }
      groups[dateLabel].push(appointment);
      return groups;
    }, {});
  };

  const pendingRequests = requestsCurrentMonthData?.content.data.filter(request => request.status === 'WAITING')
  const upcomingAppointments = upcomingAppointmentsData?.content.data


  const groupedAppointments = groupAppointmentsByDate(upcomingAppointments);


  const navigate = useNavigate()
  return (
    <div className='p-32 w-full flex flex-col gap-16'>
      <Typography className='text-xl font-bold text-text-disabled'>Appointments Overview</Typography>
      <Box className='flex justify-between w-full gap-16'>
        <Paper className='w-full p-16 flex flex-col gap-8 shadow'>
          <div className='flex justify-between'>
            <Typography className='font-semibold text-lg'>Total Appontments</Typography>
            <Description color='info' />
          </div>
          <div className='flex justify-between'>
            <Typography className='text-4xl font-bold' color='info'>113</Typography>
            <StatChange
              prefixText='Last month'
              current={40}
              previous={48}
            />
          </div>
        </Paper>
        <Paper className='w-full p-16 flex flex-col gap-8 shadow'>
          <div className='flex justify-between'>
            <Typography className='font-semibold text-lg'>Completed Counseling</Typography>
            <CheckCircle color='success' />
          </div>
          <div className='flex justify-between'>
            <Typography className='text-4xl font-bold' color='success'>93</Typography>
            <StatChange
              prefixText='Last month'
              current={89}
              previous={48}
            />
          </div>
        </Paper>
        <Paper className='w-full p-16 flex flex-col gap-8 shadow'>
          <div className='flex justify-between'>
            <Typography className='font-semibold text-lg'>Canceled Appontments</Typography>
            <DoDisturbOn color='error' />
          </div>
          <div className='flex justify-between'>
            <Typography className='text-4xl font-bold' color='error'>13</Typography>
            <StatChange
              prefixText='Last month'
              current={10}
              previous={48}
            />
          </div>
        </Paper>
        <Paper className='w-full p-16 flex flex-col gap-8 shadow'>
          <div className='flex justify-between'>
            <Typography className='font-semibold text-lg'>Appointment Requests</Typography>
            <Pending color='primary' />
          </div>
          <div className='flex justify-between'>
            <Typography className='text-4xl font-bold' color='primary'>123</Typography>
            <StatChange
              prefixText='Last month'
              current={10}
              previous={48}
            />
          </div>
        </Paper>
      </Box>
      <Box className='grid grid-cols-12 gap-16'>
        <Paper className='col-span-4 shadow p-16'>
          <div className='flex justify-between items-center px-8'>
            <Typography className='font-semibold text-lg'>Pending Requests</Typography>
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
                  ? <Typography className='text-center' color='textDisabled'>No pending requests</Typography>
                  : pendingRequests.map(request => <div className='rounded shadow' key={request.id} >
                    <RequestItem appointment={request} onUserClick={() => dispatch(openStudentView(request.student.id.toString()))} />
                  </div>
                  )
            }
          </Scrollbar>
        </Paper>
        <Paper className='col-span-8 shadow p-16'>
          <div className='flex justify-between items-center px-8'>
            <Typography className='font-semibold text-lg'>Upcoming Appointments</Typography>
            <Button
              color='secondary'
              className=''
              onClick={() => navigate(`/counseling/appointments`)}
            >View all</Button>
          </div>
          {/* <Scrollbar className='flex flex-col gap-8 h-sm overflow-y-auto p-4 divide-y-2'>
            {
              !upcomingAppointments?.length
                ? <Typography className='text-center' color='textDisabled'>No pending requests</Typography>
                : upcomingAppointments.map(appointment =>
                  <CounselorAppointmentItem appointment={appointment} key={appointment.id} />
                )
            }
          </Scrollbar> */}

          <Scrollbar className="flex flex-col gap-8 min-h-sm max-h-md overflow-y-auto p-4 ">
            {isLoadingAppointment
              ? <ContentLoading />
              : Object.keys(groupedAppointments).length === 0
                ? <Typography className="text-center" color="textDisabled">No pending requests</Typography>
                : Object.keys(groupedAppointments).map(dateLabel => (
                  <div key={dateLabel} className='pt-8'>
                    <Typography color="textPrimary" className='px-4 font-bold text-lg text-primary-light'>{dateLabel}</Typography>
                    <div className='divide-y-2 space-y-8'>
                      {groupedAppointments[dateLabel].map(appointment => (
                        <div key={appointment.id}
                          className='rounded shadow'>
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
    </div >
  )
}

export default HomeContent