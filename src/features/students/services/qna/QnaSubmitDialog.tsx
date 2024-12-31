
import { closeDialog } from '@/shared/components';
import { Box, Button, Chip, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, ListItem, ListItemButton, Paper, TextField, Tooltip, Typography } from '@mui/material';
import { useAppDispatch } from '@shared/store';

const ApproveAppointmentDialog = ({  }) => {
  const dispatch = useAppDispatch()

  return (
    <div>
      <DialogTitle id="alert-dialog-title">Approve this appointment request?</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => dispatch(closeDialog())}
          color="primary">
          Cancel
        </Button>
        <Button
          
        >
          Confirm
        </Button>
      </DialogActions>
    </div>
  )
}