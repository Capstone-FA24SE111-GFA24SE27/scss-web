import { Avatar, Box, Button, Chip, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, List, ListItem, ListItemButton, TextField, Tooltip, Typography } from '@mui/material'
import { useApproveAppointmentRequestOfflineMutation, useApproveAppointmentRequestOnlineMutation, useDenyAppointmentRequestMutation, useGetCounselingAppointmentRequestsQuery } from './requests-api'
import { AppLoading, NavLinkAdapter, closeDialog, openDialog } from '@/shared/components'
import { AccessTime, CalendarMonth, Circle } from '@mui/icons-material';
import { Link } from 'react-router-dom'
import { Fragment, useState } from 'react';
import { useAppDispatch } from '@shared/store';
const RequestsContent = () => {
  const { data, isLoading } = useGetCounselingAppointmentRequestsQuery({})
  const [approveAppointmentRequestOffline] = useApproveAppointmentRequestOfflineMutation();
  const [approveAppointmentRequestOnline] = useApproveAppointmentRequestOnlineMutation();
  const [denyAppointmentRequest] = useDenyAppointmentRequestMutation();
  const appointmentRequests = data?.content.data
  const [counselingMeetUrl, setCounselingMeetUrl] = useState('')
  const [counselingAddress, setCounselingAddress] = useState('')
  const dispatch = useAppDispatch()

  if (isLoading) {
    return <AppLoading />
  }
  if (!appointmentRequests) {
    return <Typography color='text.secondary' variant='h5'>No appoitment requests</Typography>
  }

  const statusColor = {
    'REJECTED': 'error',
    'WAITING': 'warning',
    'APPROVED': 'success'
  }


  const handleApproveRequestOnline = () => {
    approveAppointmentRequestOnline
  }

  return (
    <>
      <List className='px-16'>
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
                        <Link to={appointment.appointmentDetails?.meetUrl} target='_blank' className='py-4 px-8 rounded !text-secondary-main !underline'>
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
                <ListItem
                  className='bg-primary-main/10 w-full rounded'
                >
                  <Avatar
                    alt={appointment.student.profile.fullName}
                    src={appointment.student.profile.avatarLink}
                  />
                  <div className='ml-16'>
                    <Typography className='font-semibold text-primary-main'>{appointment.student.profile.fullName}</Typography>
                    <Typography color='text.secondary'>{appointment.student.email || 'counselor@fpt.edu.vn'}</Typography>
                  </div>
                </ListItem>
                {
                  appointment.status === 'WAITING' && (
                    <>
                      <Divider />
                      <div className='flex flex-col w-full justify-end gap-8 text-secondary-main '>
                        <Typography className='font-semibold'>Do you want to approve this appoitment request?</Typography>
                        <div className='flex gap-16'>
                          <Button color='error' variant='outlined' className='w-96'
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
                                    <Button onClick={() => dispatch(closeDialog())} color="secondary" variant='contained' autoFocus>
                                      Confirm
                                    </Button>
                                  </DialogActions>
                                </div>
                              )
                            }))}
                          >
                            Deny
                          </Button>

                          <Button color='success' variant='outlined' className='w-96'
                            onClick={() => dispatch(openDialog({
                              children: (
                                <div>
                                  <DialogTitle id="alert-dialog-title">Approve this appointment request?</DialogTitle>
                                  <DialogContent>
                                    <DialogContentText id="alert-dialog-description">
                                      <div>
                                        {
                                          appointment.meetingType === 'ONLINE' ?
                                            'The couseling appointment will be conducted online. Please enter your meet URL.'
                                            : 'The couseling appointment will be conducted online. Please enter your address.'
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
                                              value={counselingMeetUrl}
                                              variant="standard"
                                              className='mt-16'
                                              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                setCounselingMeetUrl(event.target.value);
                                              }} />
                                            : <TextField
                                              autoFocus
                                              margin="dense"
                                              name={'address'}
                                              label={'Address'}
                                              fullWidth
                                              value={counselingAddress}
                                              variant="standard"
                                              className='mt-16'
                                              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                setCounselingAddress(event.target.value);
                                              }} />
                                        }
                                      </div>

                                    </DialogContentText>
                                  </DialogContent>
                                  <DialogActions>
                                    <Button onClick={() => dispatch(closeDialog())} color="primary">
                                      Cancel
                                    </Button>
                                    <Button onClick={() => dispatch(closeDialog())} color="secondary" variant='contained'>
                                      Confirm
                                    </Button>
                                  </DialogActions>
                                </div>
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
              </div>


            </ListItem>
          )}
      </List >
    </>
  )
}

export default RequestsContent