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

/**
 * The ProjectDashboardAppHeader page.
 */
function ActivityHeader() {
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
            className="flex-0 w-64 h-64"
            alt="user photo"
            src={user?.avatarLink}
          >
            {user?.fullName}
          </Avatar>
          <div className="flex flex-col min-w-0 mx-16">
            <Heading
              title={user?.fullName}
              description={'Appointments throughout FPTU school life'}
            />
          </div>
        </div>
        <Button
          component={NavLinkAdapter}
          to="../calendar"
          variant='contained'
          color='secondary'
          startIcon={<CalendarMonth/>}
        >
          View schedule
        </Button>
      </div>
    </div>
  );
}

export default ActivityHeader;
