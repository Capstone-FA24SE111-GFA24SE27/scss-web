import { Avatar, Box, Button, Chip, List, ListItem, ListItemButton, Tooltip, Typography } from '@mui/material'
import { useGetCounselingAppointmentRequestsQuery } from '../activity-api'
import { AppLoading, NavLinkAdapter } from '@/shared/components'
import { AccessTime, CalendarMonth, Circle } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
const AppointmentTab = () => {
  const { data, isLoading } = useGetCounselingAppointmentRequestsQuery({})
  const appointmentRequests = data?.content.data
  console.log(data)

  if (isLoading) {
    return <AppLoading />
  }
  if (!appointmentRequests) {
    return <Typography color='text.secondary' variant='h5'>No appoitment requests</Typography>
  }

  console.log(appointmentRequests)

  const statusColor = {
    'REJECTED': 'error',
    'WAITING': 'warning',
    'APPROVED': 'success'
  }

  return (
    <>
      <List>
        {
          appointmentRequests.map(appointment =>
            <ListItem
              key={appointment.id}
              className="p-16 flex gap-16 mt-8 rounded-lg"
              sx={{ bgcolor: 'background.paper' }}
            // component={NavLinkAdapter}
            // to={`appointment/${appointment.id}`}
            >
              <div className='flex flex-col gap-16 w-full'>
                <div className='flex gap-24'>
                  <div className='flex gap-8 items-center'>
                    <AccessTime />
                    <Typography className=''>{appointment.startTime} - {appointment.endTime}</Typography>
                  </div>
                  <div className='flex gap-8 items-center '>
                    <CalendarMonth />
                    <Typography className='' >{appointment.requireDate}</Typography>
                  </div>
                </div>

                {
                  appointment.meetingType == 'ONLINE' ?
                    <div className='flex gap-24'>
                      <Chip
                        label='Online'
                        icon={<Circle color='success' />}
                        className='font-semibold  items-center'
                      />
                      {appointment.appointmentDetails?.meetUrl && (
                        <Link to={'https://fap.fpt.edu.vn/'} target='_blank' className='py-4 px-8 rounded !text-secondary-main !underline'>
                          Meet URL
                        </Link>
                      )
                      }
                    </div>
                    : appointment.appointmentDetails?.meetUrl && (
                      <div className='flex gap-8 items-center '>
                        <Typography className='w-52'>Address:</Typography>
                        <Typography className='font-semibold'>{appointment.appointmentDetails?.address || ''}</Typography>
                      </div>
                    )

                }
                <div className='flex gap-8'>
                  <Typography className='w-52'>Status:</Typography>
                  <Typography
                    className='font-semibold'
                    color={statusColor[appointment.status]}
                  >
                    {appointment.status}
                  </Typography>
                </div>
                <div className='flex gap-8'>
                  <Typography className='w-52'>Reason: </Typography>
                  <Typography
                  >
                    {appointment.reason}
                  </Typography>
                </div>
                <Tooltip title={`View ${appointment.counselor.profile.fullName}'s profile`}>
                  <ListItemButton
                    component={NavLinkAdapter}
                    to={`/services/counseling/${appointment.counselor.profile.id}`}
                    className='bg-primary-main/10 w-full'
                  >
                    <Avatar
                      alt={appointment.counselor.profile.fullName}
                      src={appointment.counselor.profile.avatarLink}
                    />
                    <div className='ml-16'>
                      <Typography className='font-semibold text-primary-main'>{appointment.counselor.profile.fullName}</Typography>
                      <Typography color='text.secondary'>{appointment.counselor.email || 'counselor@fpt.edu.vn'}</Typography>
                    </div>
                  </ListItemButton>
                </Tooltip>
              </div>
            </ListItem>
          )}
      </List >
    </>
  )
}

export default AppointmentTab