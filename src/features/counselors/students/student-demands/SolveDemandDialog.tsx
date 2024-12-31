import Typography from '@mui/material/Typography';
// import NavLinkAdapter from '@fuse/core/NavLinkAdapter';
import { ExpandableText, ItemMenu, UserLabel, UserListItem, closeDialog, openDialog } from '@/shared/components';
import { priorityColor, statusColor } from '@/shared/constants';
import { AccessTime, Add, CalendarMonth, Check, Visibility } from '@mui/icons-material';
import { Chip, ListItem, Paper, Tooltip, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, TextField, Box } from '@mui/material';
import ListItemButton from '@mui/material/ListItemButton';
import { useAppDispatch } from '@shared/store';
import { CounselingDemand } from '@shared/types';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import { openStudentView } from '../../counselors-layout-slice';
import { useSolveCounselingDemandMutation } from './student-demands-api';
import { useState } from 'react'
import { useAlertDialog } from '@/shared/hooks';




const SolveDemandDialog = ({ demand }: { demand: CounselingDemand }) => {
  const [solve, { isLoading: isSolving }] = useSolveCounselingDemandMutation()
  const [summarize, setSummarize] = useState(``)
  const dispatch = useAppDispatch();
  const handleCancelAppointment = () => {
    solve({
      counselingDemandId: demand.id.toString(),
      summarizeNote: summarize
    }).unwrap()
      .then(() => {
        dispatch(closeDialog())
        useAlertDialog({
          dispatch,
          title: 'Counseling Demand solved successfully'
        })
      })
      .catch(() => {
        useAlertDialog({
          dispatch,
          title: 'Failed to solve the demand',
          color: 'error',
        })
      })

  }
  return (
    <div className='w-[40rem]'>
      <DialogTitle id="alert-dialog-title">Solve the selected demand?</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          <div>
            Provide the summarize
          </div>
          <div>
            <TextField
              autoFocus
              margin="dense"
              name={'Summazie'}
              label={'Summazie'}
              fullWidth
              multiline
              rows={4}
              value={summarize}
              className='mt-16'
              slotProps={{
                inputLabel: {
                  shrink: true,
                }
              }}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setSummarize(event.target.value);
              }} />
          </div>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => dispatch(closeDialog())} color="primary">
          Cancel
        </Button>
        <Button
          onClick={handleCancelAppointment}
          color="secondary" variant='contained'
          disabled={!summarize || isSolving}
        >
          Confirm
        </Button>
      </DialogActions>
    </div>
  );
}

export default SolveDemandDialog;
