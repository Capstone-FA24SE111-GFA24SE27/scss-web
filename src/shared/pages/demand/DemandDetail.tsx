import { BackdropLoading, ContentLoading, ItemMenu, UserListItem, openDialog, openDrawer } from '@/shared/components';
import { counselingTypeColor, priorityColor, statusColor } from '@/shared/constants';
import { CalendarMonth, Circle, Summarize } from '@mui/icons-material';
import {
  Avatar,
  Box,
  Chip,
  Rating,
  Typography,
  Link,
  Paper,
  Divider,
  ListItem,
} from '@mui/material';
import dayjs from 'dayjs';
import { useParams } from 'react-router-dom';
import { useGetDemandByIdQuery } from './demand-api';
import { StudentAppointmentReport, StudentDetailAppointmentItem, StudentView } from '../student';
import { useAppDispatch } from '@shared/store';
import { CounselorView } from '../counselor';

const DemandDetail = ({ id }: { id?: string }) => {
  const { id: demandRouteId } = useParams()
  const demandId = id || demandRouteId
  const { data: demandData, isLoading } = useGetDemandByIdQuery(demandId)
  const demand = demandData
  const dispatch = useAppDispatch()
  if (isLoading) {
    // return <ContentLoading className='min-w-md' />
    return <BackdropLoading />
  }

  if (!demand) {
    return (
      <Typography variant="h5" color="textSecondary" className='min-w-md p-32'>
        No demand
      </Typography>
    );
  }

  return (
    <Box className="p-36 flex flex-col gap-16 min-w-md">
      <Typography className="font-extrabold leading-none tracking-tight text-20 md:text-24">
        Detailed Demand
      </Typography>
      <Box className="flex gap-24 pb-8">
        <Box className='flex gap-8'>
          <div className="flex gap-8 items-center">
            <CalendarMonth fontSize='small' />
            <Typography>{dayjs(demand.startDateTime).format('YYYY-MM-DD')}</Typography>
            <Typography>
              {dayjs(demand.startDateTime).format('HH:mm')}
            </Typography>
          </div>
          <div className="flex gap-8 items-center">
            - {
              demand.endDateTime
                ? <>
                  <CalendarMonth fontSize='small' />
                  <Typography>{dayjs(demand.endDateTime).format('YYYY-MM-DD')}</Typography>
                  <Typography>
                    {dayjs(demand.endDateTime).format('HH:mm')}
                  </Typography>
                </>
                : <Typography>
                  Ongoing
                </Typography>
            }
          </div>
        </Box>
        <Chip
          label={demand.status}
          variant="filled"
          color="warning"
          size="small"
        />
      </Box>

      <Box className="flex flex-col gap-8">
        <div className='flex items-center gap-8'>
          <Typography className='font-semibold text-text-secondary w-112'>Priority:</Typography>
          <Typography className='font-bold' color={priorityColor[demand.priorityLevel]}>{demand.priorityLevel}</Typography>
        </div>
        <div className='flex items-center gap-8'>
          <Typography className='font-semibold text-text-secondary w-112'>Demand type:</Typography>
          <Typography className={`font-bold text-${counselingTypeColor[demand.demandType]}`}>{demand.demandType}</Typography>
        </div>
      </Box>
      <Divider />

      <div className="flex flex-col gap-16">

        <div className="flex flex-col flex-1 gap-8 rounded">
          <Typography className="font-semibold text-text-secondary">
            Student
          </Typography>
          <UserListItem
            onClick={() => dispatch(openDrawer({
              children: <StudentView id={demand.student.profile.id.toString()} />
            }))}
            className='ml-4 bg-primary-light/5 p-8 shadow'
            fullName={demand.student.profile.fullName}
            avatarLink={demand.student.profile.avatarLink}
            phoneNumber={demand.student.profile.phoneNumber}
            email={demand.student.email}
          />
        </div>


        {/* Counselor Information */}

        <div className="flex flex-col flex-1 gap-8 rounded">
          <Typography className="font-semibold text-text-secondary">
            Assignee
          </Typography>
          <UserListItem
            onClick={() => dispatch(openDrawer({
              children: <CounselorView id={demand.counselor.profile.id.toString()} />
            }))}
            className='ml-4 bg-primary-light/5 p-8 shadow'
            fullName={demand.counselor.profile.fullName}
            avatarLink={demand.counselor.profile.avatarLink}
            phoneNumber={demand.counselor.profile.phoneNumber}
            email={demand.counselor.email}
          />
        </div>

        <div className="flex flex-col flex-1 gap-8 rounded">
          <Typography className="font-semibold text-text-secondary">
            Assigner
          </Typography>
          <UserListItem
            className='ml-4 bg-primary-light/5 p-8 shadow'
            fullName={demand.supportStaff.profile.fullName}
            avatarLink={demand.supportStaff.profile.avatarLink}
            phoneNumber={demand.supportStaff.profile.phoneNumber}
          // email={demand.supportStaff.email}
          />
        </div>
      </div>

      <Divider />

      <div className="flex flex-col gap-16">
        <div>
          <Typography className="font-semibold text-text-secondary">
            Summarize Note
          </Typography>
          <Typography>{demand.summarizeNote || 'N/A'}</Typography>
        </div>
        <div>
          <Typography className="font-semibold text-text-secondary">
            Contact Note
          </Typography>
          <Typography>{demand.contactNote || 'N/A'}</Typography>
        </div>
        <div>
          <Typography className="font-semibold text-text-secondary">
            Additional Information
          </Typography>
          <Typography>{demand.additionalInformation || 'N/A'}</Typography>
        </div>
        {/* <div>
          <Typography className="font-semibold text-text-secondary">
            Contact Note
          </Typography>
          <Typography>{demand.contactNote || 'N/A'}</Typography>
        </div> */}
        <div>
          <Typography className="font-semibold text-text-secondary">
            Issue Description
          </Typography>
          <Typography>{demand.issueDescription || 'N/A'}</Typography>
        </div>
        <div>
          <Typography className="font-semibold text-text-secondary">
            Cause Description
          </Typography>
          <Typography>{demand.causeDescription || 'N/A'}</Typography>
        </div>
      </div>

      <Divider />


      <div className="flex flex-col gap-16">
        <Typography className="font-semibold text-text-secondary">
          Associated Appointments
        </Typography>
        <Box className='flex flex-col gap-8'>
          {
            !demand?.appointments?.length
              ? <Typography color='textSecondary'>No appointments found</Typography>
              : demand?.appointments?.map(appointment => <StudentDetailAppointmentItem appointment={appointment} />
              )
          }
        </Box>


      </div>

    </Box >
  );
};

export default DemandDetail;
