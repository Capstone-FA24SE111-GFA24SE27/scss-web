import { Avatar, Box, Button, Chip, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, FormControl, FormControlLabel, IconButton, List, ListItem, ListItemButton, Paper, Radio, RadioGroup, TextField, Tooltip, Typography } from '@mui/material'
import { useGetCounselorAppointmentRequestsQuery } from './requests-api'
import { AppLoading, DateRangePicker, NavLinkAdapter, Pagination, SelectField, SortingToggle, UserListItem, closeDialog, openDialog } from '@/shared/components'
import { AccessTime, CalendarMonth, ChevronRight, Circle, Edit, EditNote } from '@mui/icons-material';
import { Link } from 'react-router-dom'
import { ChangeEvent, Fragment, useEffect, useState } from 'react';
import { useAppDispatch } from '@shared/store';
import { Dialog } from '@shared/components';
import dayjs, { Dayjs } from 'dayjs';
import { useApproveAppointmentRequestOfflineMutation, useApproveAppointmentRequestOnlineMutation, useDenyAppointmentRequestMutation } from '../counseling-api';
import { Appointment, AppointmentRequest } from '@/shared/types';
import { ExpandableText } from '@shared/components'
import { openStudentView } from '../../counselors-layout-slice';

const RequestsContent = () => {
  const [page, setPage] = useState(1);

  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const [selectedMeetingType, setSelectedMeetingType] = useState('');

  const [sortDirection, setSortDirection] = useState<'ASC' | 'DESC'>('DESC');



  const handlePageChange = (event: ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleSelectMeetingType = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedMeetingType(event.target.value);
  };

  const meetingTypeOptions = [
    { label: 'Online', value: 'ONLINE' },
    { label: 'Offline', value: 'OFFLINE' },
  ]

  const handleStartDateChange = (date: string) => setStartDate(date);
  const handleEndDateChange = (date: string) => setEndDate(date);


  const handleSortChange = (newSortDirection: 'ASC' | 'DESC') => {
    setSortDirection(newSortDirection);
  };

  const { data, isLoading, refetch } = useGetCounselorAppointmentRequestsQuery({
    dateFrom: startDate,
    dateTo: endDate,
    meetingType: selectedMeetingType,
    page: page,
    sortDirection: sortDirection
  })

  const [denyAppointmentRequest] = useDenyAppointmentRequestMutation();
  const appointmentRequests = data?.content.data
  const dispatch = useAppDispatch()



  const statusColor = {
    'REJECTED': 'error',
    'WAITING': 'warning',
    'APPROVED': 'success'
  }


  const handleDenyRequest = (appointment: AppointmentRequest) => {
    console.log(appointment)
    denyAppointmentRequest(appointment.id)
    dispatch(() => closeDialog())
  }

  // useEffect(() => {
  //   refetch()
  // }, []);


  if (isLoading) {
    return <AppLoading />
  }


  return (
    <div className='container mx-auto p-32'>
      <Box className='flex gap-32 justify-between'>
        <div className='flex gap-32'>
          <DateRangePicker
            startDate={startDate ? dayjs(startDate) : null}
            endDate={endDate ? dayjs(endDate) : null}
            onStartDateChange={handleStartDateChange}
            onEndDateChange={handleEndDateChange}
          />
          <SelectField
            label="Meting type"
            options={meetingTypeOptions}
            value={selectedMeetingType}
            onChange={handleSelectMeetingType}
            className='w-192'
            showClearOptions
          />
        </div>
        <SortingToggle
          onSortChange={handleSortChange}
          initialSort='DESC'
        />
      </Box>
      <List className='flex flex-col gap-16'>
        {
          !appointmentRequests?.length
            ? <Typography color='text.secondary' variant='h5' className='p-16'>No appointment requests</Typography>
            : appointmentRequests?.map(appointment =>
              <Paper
                key={appointment.id}
                className="p-16 shadow"
                sx={{ bgcolor: 'background.paper' }}
              // component={NavLinkAdapter}
              // to={`appointment/${appointment.id}`}
              >
                <div className='flex flex-col w-full gap-16'>
                  <div className='flex gap-24 flex-wrap'>
                    <div className='flex items-center gap-8 '>
                      <CalendarMonth />
                      <Typography className='' >{appointment.requireDate}</Typography>
                    </div>
                    <div className='flex items-center gap-8'>
                      <AccessTime />
                      <Typography className=''>{dayjs(appointment.startTime, "HH:mm:ss").format('HH:mm')} - {dayjs(appointment.endTime, "HH:mm:ss").format('HH:mm')}</Typography>
                    </div>

                    <Chip
                      label={appointment.meetingType == 'ONLINE' ? 'Online' : 'Offline'}
                      icon={<Circle color={appointment.meetingType == 'ONLINE' ? 'success' : 'disabled'} />}
                      className='items-center font-semibold'
                      size='small'
                    />

                    <Chip
                      label={appointment.status}
                      variant='filled'
                      color={statusColor[appointment.status]}
                      size='small'
                    />

                  </div>

                  <div className='flex gap-8'>
                    <Typography className='w-60' color='textSecondary'>Reason: </Typography>
                    <ExpandableText text={appointment.reason} limit={175} />
                  </div>
                  {/* <ListItem
                  className='flex w-full gap-16 rounded bg-primary-light/5'
                >
                  <Avatar
                    alt={appointment.studentInfo.profile.fullName}
                    src={appointment.studentInfo.profile.avatarLink}
                  />
                  <div >
                    <Typography className='font-semibold text-primary-main'>{appointment.studentInfo.profile.fullName}</Typography>
                    <Typography color='text.secondary'>{appointment.studentInfo.email || 'counselor@fpt.edu.vn'}</Typography>
                  </div>
                </ListItem> */}
                  <Tooltip title={`View ${appointment.student.profile.fullName}'s profile`}>
                    <ListItemButton
                      // component={NavLinkAdapter}
                      // to={`student/${appointment.student.profile.id}`}
                      className='w-full rounded shadow bg-primary-light/5'
                      onClick={() => dispatch(openStudentView(appointment.student.id.toString()))}
                    >
                      <UserListItem
                        fullName={appointment?.student.profile.fullName}
                        avatarLink={appointment?.student.profile.avatarLink}
                        phoneNumber={appointment?.student.profile.phoneNumber}
                        email={appointment?.student.email}
                      />
                      {/* <ChevronRight /> */}
                    </ListItemButton>
                  </Tooltip>
                  {
                    appointment.status === 'WAITING' && (
                      <>
                        <Divider />
                        <div className='flex flex-col w-full gap-8 text-secondary-main '>
                          <div className='flex gap-16'>
                            <Button color='secondary' variant='outlined' className='w-96'
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

                            <Button color='secondary' variant='contained' className='w-96'
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
                      <Typography className='font-semibold' color='secondary'>Do the studentInfo attend the session ?</Typography>
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
              </Paper >
            )}
      </List >
      <Pagination
        page={page}
        count={data?.content.totalPages}
        handleChange={handlePageChange}
      />
    </div>
  )
}

const ApproveAppointmentDialog = ({ appointment }: { appointment: AppointmentRequest }) => {
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