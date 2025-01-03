import { ItemMenu, openDialog } from '@/shared/components';
import { statusColor } from '@/shared/constants';
import { Appointment } from '@/shared/types';
import { AccessTime, CalendarMonth, Circle, Summarize, ViewAgenda, Visibility } from '@mui/icons-material';
import { Chip, ListItem, Paper } from '@mui/material';
import Typography from '@mui/material/Typography';
import { useAppDispatch } from '@shared/store';
import dayjs from 'dayjs';
import StudentAppointmentReport from './StudentAppointmentReport';
import { AppointmentDetail } from '..';
/**
 * The contact view.
 */

function StudentAppointmentItem({ appointment }: { appointment: Appointment }) {
  const dispatch = useAppDispatch()
  return (
    <Paper
      key={appointment.id}
      className='flex justify-between p-4 rounded shadow'
    >
      <ListItem className='flex gap-16 items-center p-4 min-h-32'
        secondaryAction={
          <ItemMenu
            menuItems={[
              {
                label: 'View detail',
                onClick: () => {
                  dispatch(openDialog({
                    children: <AppointmentDetail id={appointment?.id.toString()} />
                  }))
                },
                icon: <Visibility fontSize='small' />
              },
              {
                label: 'View report',
                disabled: !appointment.havingReport,
                onClick: () => {
                  dispatch(openDialog({
                    children: <StudentAppointmentReport id={appointment?.id.toString()} />
                  }))
                },
                icon: <Summarize fontSize='small' />
              },

            ]}
          />
        }
      >
        <div className='flex items-center gap-8 '>
          <CalendarMonth fontSize='small' />
          <Typography className=''>{dayjs(appointment.startDateTime).format('YYYY-MM-DD')}</Typography>
        </div>
        <div className='flex items-center gap-8'>
          <AccessTime fontSize='small' />
          <Typography className=''>{dayjs(appointment.startDateTime).format('HH:mm')} - {dayjs(appointment.endDateTime).format('HH:mm')}</Typography>
        </div>
        <Chip
          label={appointment.meetingType == 'ONLINE' ? 'Online' : 'Offline'}
          icon={<Circle color={appointment.meetingType == 'ONLINE' ? 'success' : 'disabled'} fontSize='small' />}
          className='items-center font-semibold text-sm'
          size='small'
        />

        <Chip
          label={appointment.status}
          variant='filled'
          color={statusColor[appointment.status]}
          size='small'
          className='text-sm'
        />
      </ListItem>
    </Paper>
  );
}

export default StudentAppointmentItem;
