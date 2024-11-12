import { openStudentView } from '@/features/counselors/counselors-layout-slice';
import { AppLoading, ItemMenu, NavLinkAdapter, UserListItem, closeDialog, openDialog } from '@/shared/components';
import { statusColor } from '@/shared/constants';
import { AppointmentRequest } from '@/shared/types';
import { useApproveAppointmentRequestOfflineMutation, useApproveAppointmentRequestOnlineMutation, useDenyAppointmentRequestMutation } from '@features/counselors/counseling/counseling-api';
import { useGetCounselorAppointmentRequestsQuery } from '@features/counselors/counseling/requests/requests-api';
import { AccessTime, CalendarMonth, ChevronRight, Circle, Visibility } from '@mui/icons-material';
import { Button, Chip, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, ListItem, ListItemButton, Paper, TextField, Tooltip, Typography } from '@mui/material';
import { ExpandableText } from '@shared/components';
import { selectAccount, useAppDispatch, useAppSelector } from '@shared/store';
import dayjs from 'dayjs';
import { ChangeEvent, ReactNode, useState } from 'react';
import { useNavigate } from 'react-router-dom';


const RequestsItem = ({ appointment, onUserClick }: { appointment: AppointmentRequest, onUserClick?: () => void }) => {
  const [denyAppointmentRequest] = useDenyAppointmentRequestMutation();
  const dispatch = useAppDispatch()
  const account = useAppSelector(selectAccount)
  const role = account?.role
  const navigate = useNavigate()
  const handleDenyRequest = (appointment: AppointmentRequest) => {
    console.log(appointment)
    denyAppointmentRequest(appointment.id)
    dispatch(() => closeDialog())
  }

  return (
    <div
      key={appointment.id}
      className="p-16 w-full "
    >
      <div className='flex flex-col w-full gap-16 '>
        <ListItem className='flex gap-24 flex-wrap p-0'
        // secondaryAction={
        //   <ItemMenu
        //     menuItems={[
        //       {
        //         label: 'View details',
        //         onClick: () => {
        //           navigate(`appointment/${appointment.id}`)
        //         },
        //         icon: <Visibility fontSize='small' />
        //       },

        //     ]}
        //   />
        // }
        >

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
        </ListItem>

        <div className='flex gap-8'>
          <Typography className='w-60' color='textSecondary'>Reason: </Typography>
          <ExpandableText text={appointment.reason} limit={175} />
        </div>
        <Tooltip title={`View ${appointment.student.profile.fullName}'s profile`}>
          <ListItemButton
            onClick={onUserClick}
            className='w-full rounded shadow bg-primary-light/5'
          >
            {
              role === 'STUDENT'
                ? <UserListItem
                  fullName={appointment?.counselor.profile.fullName}
                  avatarLink={appointment?.counselor.profile.avatarLink}
                  phoneNumber={appointment?.counselor.profile.phoneNumber}
                  email={appointment?.counselor.email}
                />
                : <UserListItem
                  fullName={appointment?.student.profile.fullName}
                  avatarLink={appointment?.student.profile.avatarLink}
                  phoneNumber={appointment?.student.profile.phoneNumber}
                  email={appointment?.student.email}
                />
            }
          </ListItemButton>
        </Tooltip>
        {
          (role === 'ACADEMIC_COUNSELOR' || role === 'NON_ACADEMIC_COUNSELOR')
          && appointment.status === 'WAITING' && (
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
          )
        }
      </div>
    </div >
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

export default RequestsItem