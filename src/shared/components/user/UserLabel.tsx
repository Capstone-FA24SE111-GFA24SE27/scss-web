import React from 'react';
import { Box, Avatar, Typography } from '@mui/material';
interface UserLabelProps {
  fullName: string;
  avatarLink: string;
  profileId?: number;
  label?: string;
}

const UserLabel: React.FC<UserLabelProps> = ({ fullName, avatarLink, profileId, label = `` }) => {
  return (
    <div className="flex items-center px-8 text-sm text-text-secondary gap-4">
      {label}
      <Box
        className="flex gap-8 items-center group"
      // component={NavLinkAdapter}
      // to={`counselor/${profileId}`}
      >
        <Avatar className="size-24" alt={fullName} src={avatarLink} />
        <div>
          <Typography className="font-semibold group-hover:underline underline-offset-2">
            {fullName}
          </Typography>
        </div>
      </Box>
    </div>
  );
};

export default UserLabel;
