import { Avatar, Box, Button, Chip, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, FormControl, FormControlLabel, IconButton, List, ListItem, ListItemButton, Radio, RadioGroup, TextField, Tooltip, Typography } from '@mui/material'
import { Appointment, AppointmentAttendanceStatus, useApproveAppointmentRequestOfflineMutation, useApproveAppointmentRequestOnlineMutation, useDenyAppointmentRequestMutation, useGetCounselingAppointmentRequestsQuery, useTakeAppointmentAttendanceMutation, useUpdateAppointmentDetailsMutation } from './requests-api'
import { AppLoading, NavLinkAdapter, closeDialog, openDialog } from '@/shared/components'
import { AccessTime, CalendarMonth, ChevronRight, Circle, Edit, EditNote } from '@mui/icons-material';
import { Link } from 'react-router-dom'
import { Fragment, useState } from 'react';
import { useAppDispatch } from '@shared/store';
import Dialog from '@shared/components/dialog';
import dayjs from 'dayjs';
const RequestsContent = () => {
  const { data, isLoading } = useGetCounselingAppointmentRequestsQuery({})

  const [denyAppointmentRequest] = useDenyAppointmentRequestMutation();
  const appointmentRequests = data?.content.data
  const dispatch = useAppDispatch()

  if (isLoading) {
    return <AppLoading />
  }
  if (!appointmentRequests) {
    return <Typography color='text.secondary' variant='h5' className='p-16'>No appointment requests</Typography>
  }

  const statusColor = {
    'DENIED': 'error',
    'WAITING': 'warning',
    'APPROVED': 'success'
  }




  const handleDenyRequest = (appointment: Appointment) => {
    console.log(appointment)
    denyAppointmentRequest(appointment.id)
    dispatch(() => closeDialog())
  }

  return (
    <>
      <List className='px-16'>
        {
          appointmentRequests.map(appointment =>
            <ListItem
              key={appointment.id}
              className="p-16 flex gap-16 rounded-lg"
              sx={{ bgcolor: 'background.paper' }}
            // component={NavLinkAdapter}
            // to={`appointment/${appointment.id}`}
            >
              <div className='flex flex-col gap-16 w-full'>
                <div className='flex gap-24'>
                  <div className='flex gap-8 items-center '>
                    <CalendarMonth />
                    <Typography className='' >{appointment.requireDate}</Typography>
                  </div>
                  <div className='flex gap-8 items-center'>
                    <AccessTime />
                    <Typography className=''>{dayjs(appointment.startTime, "HH:mm:ss").format('HH:mm')} - {dayjs(appointment.endTime, "HH:mm:ss").format('HH:mm')}</Typography>
                  </div>
                </div>

                <div className='flex gap-8'>
                  <Typography className='w-60' color='textSecondary'>Type:</Typography>
                  <Typography
                    className='font-semibold'
                  >
                    {appointment.meetingType}
                  </Typography>
                </div>

                {/* <div className='flex gap-4'>
                  {
                    appointment.meetingType === 'ONLINE' ?
                      <div className='flex gap-24 items-center'>
                        <Chip
                          label='Online'
                          icon={<Circle color='success' />}
                          className='font-semibold  items-center'
                        />
                        {appointment.appointmentDetails?.meetUrl && (
                          <div>
                            <Link to={appointment.appointmentDetails?.meetUrl} target='_blank' className='py-4 px-8 rounded !text-secondary-main !underline'>
                              Meet URL
                            </Link>
                          </div>
                        )}
                      </div>
                      : appointment.appointmentDetails?.address && (<div className='flex gap-8 items-center '>
                        <Typography className='w-60' color='textSecondary'>Address:</Typography>
                        <Typography className='font-semibold'>{appointment.appointmentDetails?.address || ''}</Typography>
                      </div>)
                  }
                  {appointment.status === 'APPROVED' && (<Tooltip title={appointment.meetingType === 'ONLINE' ? 'Update meet URL' : 'Update address'}>
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
                  )
                  }
                </div> */}
                <div className='flex gap-8'>
                  <Typography className='w-60' color='textSecondary'>Status:</Typography>
                  <Typography
                    className='font-semibold'
                    color={statusColor[appointment.status]}
                  >
                    {appointment.status}
                  </Typography>
                </div>
                <div className='flex gap-8'>
                  <Typography className='w-60' color='textSecondary'>Reason: </Typography>
                  <Typography
                  >
                    {appointment.reason}
                  </Typography>
                </div>
                {/* <ListItem
                  className='bg-primary-main/5 w-full rounded flex gap-16'
                >
                  <Avatar
                    alt={appointment.student.profile.fullName}
                    src={appointment.student.profile.avatarLink}
                  />
                  <div >
                    <Typography className='font-semibold text-primary-main'>{appointment.student.profile.fullName}</Typography>
                    <Typography color='text.secondary'>{appointment.student.email || 'counselor@fpt.edu.vn'}</Typography>
                  </div>
                </ListItem> */}
                <Tooltip title={`View ${appointment.student.profile.fullName}'s profile`}>
                  <ListItemButton
                    component={NavLinkAdapter}
                    to={`student/${appointment.student.profile.id}`}
                    className='bg-primary-main/10 w-full rounded'
                  >
                    <div className='w-full flex'>
                      <Avatar
                        alt={appointment.student.profile.fullName}
                        src={appointment.student.profile.avatarLink}
                      />
                      <div className='ml-16'>
                        <Typography className='font-semibold text-primary-main'>{appointment.student.profile.fullName}</Typography>
                        <Typography color='text.secondary'>{appointment.student.email || 'counselor@fpt.edu.vn'}</Typography>
                      </div>
                    </div>
                    <ChevronRight />
                  </ListItemButton>
                </Tooltip>
                {
                  appointment.status === 'WAITING' && (
                    <>
                      <Divider />
                      <div className='flex flex-col w-full gap-8 text-secondary-main '>
                        <Typography className='font-semibold'>Do you want to approve this appoitment request?</Typography>
                        <div className='flex gap-16'>
                          <Button color='error' variant='contained' className='w-96'
                            onClick={() => dispatch(openDialog({
                              children: (
                                <div>
                                  <DialogTitle id="alert-dialog-title">Deny this appointment request?</DialogTitle>
                                  <DialogContent>
                                    <DialogContentText id="alert-dialog-description">
                                      This action won't be undo.
                                    </DialogContentText>
                                  </DialogContent>
                                  <DialogActions>
                                    <Button onClick={() => dispatch(closeDialog())} color="primary">
                                      Cancel
                                    </Button>
                                    <Button onClick={() => { handleDenyRequest(appointment); dispatch(closeDialog()) }} color="secondary" variant='contained' autoFocus>
                                      Confirm
                                    </Button>
                                  </DialogActions>
                                </div>
                              )
                            }))}
                          >
                            Deny
                          </Button>

                          <Button color='success' variant='contained' className='w-96'
                            onClick={() => dispatch(openDialog({
                              children: (
                                <ApproveAppointmentDialog appointment={appointment} />
                              )
                            }))}
                          >
                            Approve
                          </Button>
                        </div>
                      </div>

                    </>
                  )
                }
                {/* {
                  appointment.status === 'APPROVED' && (
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
                } */}
              </div>
            </ListItem >
          )}
      </List >
    </>
  )
}

const ApproveAppointmentDialog = ({ appointment }: { appointment: Appointment }) => {
  console.log(appointment.meetingType)
  const [approveAppointmentRequestOnline] = useApproveAppointmentRequestOnlineMutation();
  const [approveAppointmentRequestOffline] = useApproveAppointmentRequestOfflineMutation();
  const [meetUrl, setMeetUrl] = useState('')
  const [address, setAddress] = useState('')
  const dispatch = useAppDispatch()

  const handleApproveRequest = () => {
    const meetingDetails = {}
    if (appointment.meetingType === 'ONLINE') {
      meetingDetails['meetUrl'] = meetUrl
      approveAppointmentRequestOnline({
        requestId: appointment.id,
        meetingDetails
      })
    } else {
      meetingDetails['address'] = address
      approveAppointmentRequestOffline({
        requestId: appointment.id,
        meetingDetails
      })
    }
    dispatch(closeDialog())
  }

  return (
    <div>
      <DialogTitle id="alert-dialog-title">Approve this appointment request?</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          <div>
            {
              appointment.meetingType === 'ONLINE' ?
                <div>
                  <Typography>The couseling appointment will be conducted ONLINE.</Typography>
                  <Typography>
                    Please enter your meet URL.
                  </Typography>
                </div>
                :
                <div>
                  <Typography>The couseling appointment will be conducted OFFLINE.</Typography>
                  <Typography>
                    Please enter your address.
                  </Typography>
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
          onClick={() => handleApproveRequest()}
          color="secondary" variant='contained'
          disabled={!meetUrl && !address}
        >
          Confirm
        </Button>
      </DialogActions>
    </div>
  )
}

export default RequestsContent