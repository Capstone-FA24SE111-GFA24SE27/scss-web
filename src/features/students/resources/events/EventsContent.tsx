import { Avatar, Box, Button, Chip, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, FormControl, FormControlLabel, IconButton, List, ListItem, ListItemButton, Radio, RadioGroup, Rating, TextField, Tooltip, Typography } from '@mui/material'
import { Appointment, AppointmentAttendanceStatus, useApproveAppointmentRequestOfflineMutation, useApproveAppointmentRequestOnlineMutation, useDenyAppointmentRequestMutation, useGetCounselingAppointmentQuery, useTakeAppointmentAttendanceMutation, useUpdateAppointmentDetailsMutation } from './appointments-api'
import { AppLoading, NavLinkAdapter, closeDialog, openDialog } from '@/shared/components'
import { AccessTime, CalendarMonth, Circle, Edit, EditNote } from '@mui/icons-material';
import { Link } from 'react-router-dom'
import { Fragment, useState } from 'react';
import { useAppDispatch } from '@shared/store';
import Dialog from '@shared/components/dialog';
import dayjs from 'dayjs';
const EventsContent = () => {
  const { data, isLoading } = useGetCounselingAppointmentQuery({})

  const [denyAppointmentRequest] = useDenyAppointmentRequestMutation();
  const appointments = data?.content
  const dispatch = useAppDispatch()

  if (isLoading) {
    return <AppLoading />
  }
  if (!appointments) {
    return <Typography color='text.secondary' variant='h5' className='p-16'>No appointments</Typography>
  }

  const statusColor = {
    'DENIED': 'error',
    'WAITING': 'warning',
    'APPROVED': 'success',
    'ATTEND': 'success',
    'ABSENT': 'error',
  }


  return (
    <>
      <List className='px-16'>
        {
          appointments.map(appointment =>
            <ListItem
              key={appointment.id}
              className="p-16 flex gap-16 rounded-lg"
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
                      : appointment.address && (<div className='flex gap-8 items-center '>
                        <Typography className='w-60'>Address:</Typography>
                        <Typography className='font-semibold'>{appointment.address || ''}</Typography>
                      </div>)
                  }
                  {(<Tooltip title={appointment.meetingType === 'ONLINE' ? 'Update meet URL' : 'Update address'}>
                    <IconButton
                      color='secondary'
                      onClick={() => dispatch(openDialog({
                        children: <UpdateDetailsAppointmentDialog appointment={appointment} />
                      }
                      ))}
                    >
                      <EditNote fontSize='medium' />
                    </IconButton>
                  </Tooltip>
                  )}
                </div>

                {/* <div className='flex gap-8'>
                  <Typography className='w-60'>Reason: </Typography>
                  <Typography
                    color='text.secondary'
                  >
                    {appointment.reason}
                  </Typography>
                </div> */}
                <ListItem
                  className='w-full rounded flex-col bg-primary-light/5 gap-16'
                >
                  <div className='flex gap-16 items-start w-full'>

                    <Avatar
                      alt={appointment.studentInfo.profile.fullName}
                      src={appointment.studentInfo.profile.avatarLink}
                    />
                    <div >
                      <Typography className='font-semibold text-primary-main'>{appointment.studentInfo.profile.fullName}</Typography>
                      <Typography color='text.secondary'>{appointment.studentInfo.email || 'emailisnull.edu.vn'}</Typography>
                    </div>
                    {
                      ['ATTEND', 'ABSENT'].includes(appointment.status) && (
                        <div className='flex'>
                          <div className='flex flex-col ml-36'>
                            <Typography className='w-60'>Status:</Typography>
                            <Typography
                              className='font-semibold'
                              color={statusColor[appointment.status]}
                            >
                              {appointment.status}
                            </Typography>
                          </div>
                          <Tooltip title={'Update attendance'}>
                            <IconButton
                              color='secondary'
                              onClick={() => dispatch(openDialog({
                                children: <CheckAttendanceDialog appointment={appointment} />
                              }
                              ))}
                            >
                              <EditNote fontSize='medium' />
                            </IconButton>
                          </Tooltip>
                        </div>
                      )}
                  </div>
                  {
                    appointment.appointmentFeedback && (
                      <div className='w-full'>
                        <Divider className='border border-black' />
                        <div className=' mt-8'>
                          <div className='flex items-center gap-8'>
                            <Rating
                              size='medium'
                              value={appointment.appointmentFeedback.rating}
                              readOnly
                            />
                            <Typography color='text.secondary'>{dayjs(appointment.appointmentFeedback.createdAt).format('YYYY-MM-DD HH:mm:ss')}</Typography>
                          </div>
                        </div>
                        <Typography className=' mt-8'>{appointment.appointmentFeedback.comment}</Typography>
                      </div>
                    )
                  }
                </ListItem>
                {
                  appointment.status === 'WAITING' && (
                    <div className=''>
                      <Typography className='font-semibold' color='secondary'>Do the student attend the session ?</Typography>
                      <Button className='mt-8' variant='outlined' color='secondary'
                        onClick={() => dispatch(openDialog({
                          children: <CheckAttendanceDialog appointment={appointment} />
                        }
                        ))}
                      >
                        Take attendance
                      </Button>
                    </div>
                  )
                }
              </div>
            </ListItem >
          )}
      </List >
    </>
  )
}

const UpdateDetailsAppointmentDialog = ({ appointment }: { appointment: Appointment }) => {
  const [updateAppointmentDetails] = useUpdateAppointmentDetailsMutation()
  const [meetUrl, setMeetUrl] = useState(appointment.meetUrl)
  const [address, setAddress] = useState(appointment.address)
  const dispatch = useAppDispatch()

  const handleEditDetails = () => {
    const meetingDetails = {}
    if (appointment.meetingType === 'ONLINE') {
      meetingDetails['meetUrl'] = meetUrl
      updateAppointmentDetails({
        requestId: appointment.id,
        meetingDetails
      })
    } else {
      meetingDetails['address'] = address
      updateAppointmentDetails({
        requestId: appointment.id,
        meetingDetails
      })
    }
    dispatch(closeDialog())
  }

  return (
    <div className='w-[40rem]'>
      <DialogTitle id="alert-dialog-title">Edit details?</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          <div>
            {
              appointment.meetingType === 'ONLINE' ?
                <div>
                  <Typography>Edit the current meeting URL</Typography>
                </div>
                :
                <div>
                  <Typography>Edit the current address</Typography>
                </div>
            }
          </div>
          <div>
            {
              appointment.meetingType === 'ONLINE'
                ? <TextField
                  autoFocus
                  margin="dense"
                  name={'meetUrl'}
                  label={'Meet Url'}
                  fullWidth
                  value={meetUrl}
                  variant="standard"
                  className='mt-16'
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setMeetUrl(event.target.value);
                  }} />
                : <TextField
                  autoFocus
                  margin="dense"
                  name={'address'}
                  label={'Address'}
                  fullWidth
                  value={address}
                  variant="standard"
                  className='mt-16'
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setAddress(event.target.value);
                  }} />
            }
          </div>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => dispatch(closeDialog())}
          color="primary">
          Cancel
        </Button>
        <Button
          onClick={() => handleEditDetails()}
          color="secondary" variant='contained'
          disabled={!meetUrl && !address}
        >
          Confirm
        </Button>
      </DialogActions>
    </div>
  )
}

const CheckAttendanceDialog = ({ appointment }: { appointment: Appointment }) => {
  const dispatch = useAppDispatch()
  const [attendanceStatus, setAttendanceStatus] = useState<AppointmentAttendanceStatus>('ATTEND')
  const [takeAttendance] = useTakeAppointmentAttendanceMutation()

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAttendanceStatus((event.target as HTMLInputElement).value as AppointmentAttendanceStatus);
  }

  const handleTakeAttendance = () => {
    takeAttendance({
      appointmentId: appointment.id,
      counselingAppointmentStatus: attendanceStatus as AppointmentAttendanceStatus
    })
    dispatch(closeDialog())
  }

  return (
    <div>
      <DialogTitle id="alert-dialog-title">Update attendance for this student</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description" className='flex flex-col gap-16'>
          <div
            className='rounded flex justify-start gap-16'
          >
            <Avatar
              alt={appointment.studentInfo.profile.fullName}
              src={appointment.studentInfo.profile.avatarLink}
            />
            <div >
              <Typography className='font-semibold text-primary-main'>{appointment.studentInfo.profile.fullName}</Typography>
              <Typography color='text.secondary'>{appointment.studentInfo.email || 'counselor@fpt.edu.vn'}</Typography>
            </div>
          </div>
          <FormControl>
            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              defaultValue="female"
              name="radio-buttons-group"
              value={attendanceStatus}
              onChange={handleRadioChange}
            >
              <div className='flex gap-16'>
                <FormControlLabel value="ATTEND" control={<Radio color='success' />} label="Attended" className='text-black' />
                <FormControlLabel value="ABSENT" control={<Radio color='error' />} label="Absent" className='text-black' />
              </div>
            </RadioGroup>
          </FormControl>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => dispatch(closeDialog())}
          color="primary">
          Cancel
        </Button>
        <Button
          onClick={handleTakeAttendance}
          color="secondary" variant='contained'
        >
          Confirm
        </Button>
      </DialogActions>
    </div>
  )
}

export default EventsContent