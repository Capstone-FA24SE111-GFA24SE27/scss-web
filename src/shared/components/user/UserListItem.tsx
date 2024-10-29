import React from 'react';
import { Avatar, Typography } from '@mui/material';
import LocalPhoneOutlined from '@mui/icons-material/LocalPhoneOutlined';
import EmailOutlined from '@mui/icons-material/EmailOutlined';

interface UserListItemProps {
  fullName: string;
  avatarLink: string;
  phoneNumber: string;
  email: string;
}

const UserListItem: React.FC<UserListItemProps> = ({ fullName, avatarLink, phoneNumber, email }) => {
  return (
    <div className='flex items-start w-full gap-16'>
      <Avatar alt={fullName} src={avatarLink} className='size-48'/>
      <div>
        <Typography className='font-semibold text-primary-main'>{fullName}</Typography>
        <div className="flex items-center gap-16 mt-2">
          <div className="flex items-center w-120">
            <LocalPhoneOutlined fontSize='small' className='size-16' />
            <div className="ml-8 text-text-secondary leading-6">{phoneNumber}</div>
          </div>
          <div className="flex items-center">
            <EmailOutlined fontSize='small' className='size-16' />
            <div className="ml-8 text-text-secondary leading-6">{email || 'emailisnull.edu.vn'}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserListItem;
