import { Heading, NavLinkAdapter } from '@/shared/components';
import { CalendarMonth } from '@mui/icons-material';
import { Button, darken } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import { selectAccount } from '@shared/store';
import { useAppSelector } from '@shared/store';
import { useState } from 'react';
import { useGetCounselorCounselingAppointmentQuery } from '../counseling/appointments/appointments-api';
import dayjs from 'dayjs';

/**
 * The ProjectDashboardAppHeader page.
 */
function HomeHeader() {
  const today = dayjs().format('YYYY-MM-DD');
  const { data: upcomingAppointmentsData, isLoading, refetch } = useGetCounselorCounselingAppointmentQuery({
    fromDate: today,
    status: `WAITING`,
  });
  const user = useAppSelector(selectAccount)?.profile
  return (

    <div className="flex flex-col w-full px-24 sm:px-32 bg-background-paper">
      <div className="flex flex-col sm:flex-row flex-auto sm:items-center min-w-0 my-16 sm:my-20">
        <div className="flex flex-auto items-center min-w-0">
          <Avatar
            sx={{
              background: (theme) => darken(theme.palette.background.default, 0.05),
              color: (theme) => theme.palette.text.secondary
            }}
            className="flex-0 size-72"
            alt="user photo"
            src={user?.avatarLink}
          >
            {user?.fullName}
          </Avatar>
          <div className="flex flex-col min-w-0 mx-16">
            <Typography className='text-4xl font-semibold'>
              {`Welcome back, ${user?.fullName} !`}
            </Typography>
            <Typography className='text-lg'>
              {`You have ${upcomingAppointmentsData?.content.totalElements} upcoming appointemtns and 4 questions to answer`}
            </Typography>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomeHeader;
