import { Avatar, Box, Button, Chip, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, FormControl, FormControlLabel, IconButton, List, ListItem, ListItemButton, Menu, MenuItem, Popover, Radio, RadioGroup, Rating, TextField, Tooltip, Typography } from '@mui/material'
import { Appointment, AppointmentAttendanceStatus, useApproveAppointmentRequestOfflineMutation, useApproveAppointmentRequestOnlineMutation, useDenyAppointmentRequestMutation, useGetCounselingAppointmentQuery, useTakeAppointmentAttendanceMutation, useUpdateAppointmentDetailsMutation } from './appointments-api'
import { AppLoading, NavLinkAdapter, closeDialog, openDialog } from '@/shared/components'
import { AccessTime, Add, CalendarMonth, ChevronRight, Circle, Clear, Edit, EditNote, MoreVert, Summarize } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom'
import { Fragment, useState } from 'react';
import { useAppDispatch } from '@shared/store';
import Dialog from '@shared/components/dialog';
import dayjs from 'dayjs';
const AppointmentsContent = () => {
  const { data, isLoading } = useGetCounselingAppointmentQuery({})

  const [denyAppointmentRequest] = useDenyAppointmentRequestMutation();
  const appointments = data?.content
  const dispatch = useAppDispatch()

  const statusColor = {
    'DENIED': 'error',
    'WAITING': 'warning',
    'APPROVED': 'success',
    'ATTEND': 'success',
    'ABSENT': 'error',
  }

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const navigate = useNavigate()

  console.log(appointments)

  if (isLoading) {
    return <AppLoading />
  }
  if (!appointments) {
    return <Typography color='text.secondary' variant='h5' className='p-16'>No appointments</Typography>
  }

  return (
    <>
      <List className='px-16'>
        {
          appointments.map(appointment =>
            <ListItem
              key={appointment.id}
              className="p-16 flex gap-8 rounded-lg shadow"
              sx={{ bgcolor: 'background.paper' }}
            // component={NavLinkAdapter}
            // to={`appointment/${appointment.id}`}
            >
              <div className='flex flex-col gap-16 w-full'>
                <div className='flex justify-between'>
                  <div className='flex gap-24'>
                    <div className='flex gap-8 items-center '>
                      <CalendarMonth />
                      <Typography className='' >{dayjs(appointment.requireDate).format('YYYY-MM-DD')}</Typography>
                    </div>
                    <div className='flex gap-8 items-center'>
                      <AccessTime />
                      <Typography className=''>{dayjs(appointment.startDateTime).format('HH:mm')} - {dayjs(appointment.endDateTime).format('HH:mm')}</Typography>
                    </div>
                  </div>
                  <div className='relative' >
                    {
                      appointment.havingReport && ['ATTEND'].includes(appointment.status) && (
                        <div className='size-10 right-10 rounded-full bg-secondary-main absolute'></div>
                      )
                    }
                    <IconButton color='primary' onClick={handleClick}>
                      <MoreVert />
                    </IconButton>
                    <Popover
                      id={id}
                      open={open}
                      anchorEl={anchorEl}
                      onClose={handleClose}
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                      }}
                    >
                      {
                        !appointment.havingReport
                          ? <MenuItem
                            className='w-[14rem] gap-8'
                            onClick={() => { navigate(`${appointment.id}/report`); handleClose() }}
                          >
                            <Summarize />
                            View report
                          </MenuItem>
                          : <MenuItem
                            className='w-[14rem] gap-8'
                            onClick={() => { navigate(`${appointment.id}/report/create`); handleClose() }}
                          >
                            <Add />
                            Create report
                          </MenuItem>
                      }

                    </Popover>
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
                        <Typography className='w-60' color='textSecondary'>Address:</Typography>
                        <Typography className='font-semibold'>{appointment.address || ''}</Typography>
                      </div>)
                  }
                  {(<Tooltip title={appointment.meetingType === 'ONLINE' ? 'Update meet URL' : 'Update address'}>
                    <IconButton
                      color='secondary'
                      onClick={(event) => {
                        event.stopPropagation()
                        event.preventDefault()
                        dispatch(openDialog({
                          children: <UpdateDetailsAppointmentDialog appointment={appointment} />
                        }))
                      }}
                    >
                      <EditNote fontSize='medium' />
                    </IconButton>
                  </Tooltip>
                  )}
                </div>
                <div className='pl-16 border-l-2'>
                  <Tooltip title={`View ${appointment.studentInfo.profile.fullName}'s profile`}>
                    <ListItemButton
                      component={NavLinkAdapter}
                      to={`student/${appointment.studentInfo.profile.id}`}
                      className='bg-primary-main/10 w-full rounded'
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
                      </div>
                      <ChevronRight />
                    </ListItemButton>
                  </Tooltip>
                  <div className='pl-4 mt-8'>
                    {
                      ['ATTEND', 'ABSENT'].includes(appointment.status) && (
                        <div className='flex gap-4'>
                          <div className='flex items-center'>
                            <Typography className={'w-[13rem]'}>Attendance Status:</Typography>
                            <Typography
                              className='font-semibold pl-4'
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
                      )
                    }
                    {
                      appointment.appointmentFeedback && (
                        <div className='w-full'>
                          <div className='flex'>
                            <Typography className='w-[13rem]'>Student feedback:</Typography>
                            <div className='flex flex-col'>
                              <div className='flex items-center gap-8'>
                                <Rating
                                  size='medium'
                                  value={appointment.appointmentFeedback.rating}
                                  readOnly
                                />
                                <Typography color='text.secondary'>{dayjs(appointment.appointmentFeedback.createdAt).format('YYYY-MM-DD HH:mm:ss')}</Typography>
                              </div>
                              <Typography className='pl-8 mt-8'>{appointment.appointmentFeedback.comment}</Typography>
                            </div>
                          </div>
                        </div>

                      )
                    }
                    {
                      appointment.status === 'WAITING' && (
                        <div className='mt-16'>
                          <Typography className='font-semibold' color='secondary'>Do the student attend the session ?</Typography>
                          <Button className='mt-4' variant='contained' color='secondary'
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
                </div>

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
  const [attendanceStatus, setAttendanceStatus] = useState<AppointmentAttendanceStatus>((appointment.status as AppointmentAttendanceStatus) || 'WAITING')
  const [takeAttendance] = useTakeAppointmentAttendanceMutation()

  console.log(attendanceStatus)
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
                <Tooltip title='Clear selection'>
                  <IconButton
                    onClick={() => setAttendanceStatus('WAITING')}
                  >
                    <Clear />
                  </IconButton>
                </Tooltip>
              </div>
            </RadioGroup>
          </FormControl>
          <div>
          </div>
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

export default AppointmentsContent