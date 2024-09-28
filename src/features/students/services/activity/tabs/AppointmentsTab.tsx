import { Avatar, Box, Button, Chip, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, List, ListItem, ListItemButton, Rating, TextField, Tooltip, Typography } from '@mui/material'
import { useGetCounselingAppointmentRequestsQuery, useSendCouselingAppointmentFeedbackMutation, useGetCounselingAppointmentQuery, Appointment } from '../activity-api'
import { AppLoading, NavLinkAdapter, closeDialog, openDialog } from '@/shared/components'
import { AccessTime, CalendarMonth, ChevronRight, Circle } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { useAppDispatch } from '@shared/store';
import { useState } from 'react'
const AppointmentsTab = () => {
  const { data, isLoading } = useGetCounselingAppointmentQuery({})
  const appointmentRequests = data?.content
  console.log(data)

  if (isLoading) {
    return <AppLoading />
  }
  if (!appointmentRequests) {
    return <Typography color='text.secondary' variant='h5' className='p-16'>No appoitment requests</Typography>
  }

  console.log(appointmentRequests)

  const statusColor = {
    'REJECTED': 'error',
    'ABSENT': 'error',
    'WAITING': 'warning',
    'APPROVED': 'success',
    'ATTEND': 'success'
  }

  const dispatch = useAppDispatch()

  return (
    <>
      <List>
        {
          appointmentRequests.map(appointment =>
            <ListItem
              key={appointment.id}
              className="p-16 flex gap-16 mt-8"
              sx={{ bgcolor: 'background.paper' }}
            // component={NavLinkAdapter}
            // to={`appointment/${appointment.id}`}
            >
              <div className='flex flex-col gap-16 w-full'>
                <div className='flex gap-24'>
                  <div className='flex gap-8 items-center'>
                    <AccessTime />
                    <Typography className=''>{dayjs(appointment.startDateTime).format('HH:mm')} - {dayjs(appointment.endDateTime).format('HH:mm')}</Typography>
                  </div>
                  <div className='flex gap-8 items-center '>
                    <CalendarMonth />
                    <Typography className='' >{dayjs(appointment.requireDate).format('YYYY-MM-DD')}</Typography>
                  </div>
                </div>
                <div className='flex gap-4'>
                  {
                    appointment.meetingType === 'ONLINE' ?
                      <div className='flex gap-24 items-center'>
                        <Chip
                          label='Online'
                          icon={<Circle color='success' />}
                          className='font-semibold  items-center'
                        />
                        {appointment.meetUrl && (
                          <div>
                            <Link to={appointment.meetUrl} target='_blank' className='py-4 px-8 rounded !text-secondary-main !underline'>
                              Meet URL
                            </Link>
                          </div>
                        )}
                      </div>
                      : appointment.address && (<div className='flex gap-16 items-center'>
                        <Typography className='w-68'>Address:</Typography>
                        <Typography className='font-semibold'>{appointment.address || ''}</Typography>
                      </div>)
                  }
                </div>
                <div className='flex gap-16'>
                  <Typography className='w-68'>Attendance:</Typography>
                  <Typography
                    className='font-semibold'
                    color={statusColor[appointment.status]}
                  >
                    {appointment.status}
                  </Typography>
                </div>
                {/* <div className='flex gap-8'>
                  <Typography className='w-52'>Reason: </Typography>
                  <Typography
                  >
                    {appointment.reason}
                  </Typography>
                </div> */}
                <Tooltip title={`View ${appointment.counselorInfo.profile.fullName}'s profile`}>
                  <ListItemButton
                    component={NavLinkAdapter}
                    to={`counselor/${appointment.counselorInfo.profile.id}`}
                    className='bg-primary-main/10 w-full rounded'
                  >
                    <div className='w-full flex'>
                      <Avatar
                        alt={appointment.counselorInfo.profile.fullName}
                        src={appointment.counselorInfo.profile.avatarLink}
                      />
                      <div className='ml-16'>
                        <Typography className='font-semibold text-primary-main'>{appointment.counselorInfo.profile.fullName}</Typography>
                        <Typography color='text.secondary'>{appointment.counselorInfo.email || 'counselor@fpt.edu.vn'}</Typography>
                      </div>
                    </div>
                    <ChevronRight />
                  </ListItemButton>
                </Tooltip>
                {appointment.appointmentFeedback ?
                  <>
                    <div className='w-full'>
                      <Divider className='border border-black' />
                      <div className='flex items-start gap-16 mt-16'>
                        <Typography className='w-96'>Your feedback:</Typography>
                        <div>
                          <div>
                            <div className='flex items-center gap-8'>
                              <Rating
                                size='medium'
                                value={appointment.appointmentFeedback.rating}
                                readOnly
                              />
                              <Typography color='text.secondary'>{dayjs(appointment.appointmentFeedback.createdAt).format('YYYY-MM-DD HH:mm:ss')}</Typography>
                            </div>
                          </div>
                          <Typography className='pl-8 mt-8' sx={{color: 'text.secondary'}}>{appointment.appointmentFeedback.comment}</Typography>
                        </div>
                      </div>
                    </div>
                  </>
                  : appointment.status === 'ATTEND' && <>
                    <Divider />
                    <div className='flex flex-col w-full justify-end gap-8 text-secondary-main '>
                      <Typography className='font-semibold'>Send feedback about the appointment!</Typography>
                      <div className='flex gap-16'>
                        <Button variant='outlined'
                          onClick={() => dispatch(openDialog({
                            children: (
                              <SendFeedbackDialog appointment={appointment} />
                            )
                          }))}
                        >
                          Leave a review
                        </Button>
                      </div>
                    </div>

                  </>
                }
              </div>
            </ListItem>
          )}
      </List >
    </>
  )
}


const SendFeedbackDialog = ({ appointment }: { appointment: Appointment }) => {
  const [comment, setComment] = useState('')
  const [rating, setRating] = useState(0)
  const dispatch = useAppDispatch()
  const [sendFeedback] = useSendCouselingAppointmentFeedbackMutation()
  const handleSendFeedback = () => {
    sendFeedback({
      appointmentId: appointment.id,
      feedback: {
        comment,
        rating
      }
    })
    dispatch(closeDialog())
  }

  return (
    <div className='w-[40rem]'>
      <DialogTitle id="alert-dialog-title">Edit details?</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          <Typography>Edit the current meeting URL</Typography>
          <TextField
            autoFocus
            margin="dense"
            name={'comment'}
            label={'Comment'}
            fullWidth
            value={comment}
            variant="standard"
            className='mt-16'
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setComment(event.target.value);
            }} />
          <div className='mt-16'>
            <Typography component="legend">Rate this session</Typography>
            <Rating
              name="simple-controlled"
              value={rating}
              onChange={(event, newRating) => {
                setRating(newRating);
              }}
            />
          </div>

        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => dispatch(closeDialog())}
          color="primary">
          Cancel
        </Button>
        <Button
          onClick={() => handleSendFeedback()}
          color="secondary" variant='contained'
          disabled={!comment && !rating}
        >
          Confirm
        </Button>
      </DialogActions>
    </div>
  )
}
export default AppointmentsTab