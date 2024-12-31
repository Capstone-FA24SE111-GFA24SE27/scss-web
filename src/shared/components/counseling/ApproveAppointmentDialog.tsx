import { closeDialog } from '@/shared/components';
import { useAlertDialog } from '@/shared/hooks';
import { AppointmentRequest } from '@/shared/types';
import { useApproveAppointmentRequestOfflineMutation, useApproveAppointmentRequestOnlineMutation } from '@features/counselors/counseling/counseling-api';
import { Button, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Typography } from '@mui/material';
import { useAppDispatch } from '@shared/store';
import { useState } from 'react';

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
        .unwrap()
        .then(() => {
          dispatch(closeDialog())
          useAlertDialog({
            dispatch,
            title: 'Request Approved'
          })
        })
        .catch(() => {
          useAlertDialog({
            dispatch,
            title: 'Error approving request'
          })
        })
    } else {
      meetingDetails['address'] = address
      approveAppointmentRequestOffline({
        requestId: appointment.id,
        meetingDetails
      })
        .unwrap()
        .then(() => {
          dispatch(closeDialog())
          useAlertDialog({
            dispatch,
            title: 'Request Approved'
          })
        })
        .catch(() => {
          useAlertDialog({
            dispatch,
            title: 'Error approving request'
          })
        })
    }
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
                  label={'Meeting Url'}
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
                  }}
                />
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

export default ApproveAppointmentDialog