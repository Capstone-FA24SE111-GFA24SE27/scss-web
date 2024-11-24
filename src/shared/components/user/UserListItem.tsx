import React from 'react';
import LocalPhoneOutlined from '@mui/icons-material/LocalPhoneOutlined';
import EmailOutlined from '@mui/icons-material/EmailOutlined';
import { Box, Avatar, Typography, Dialog, DialogTitle, DialogContent, DialogContentText } from '@mui/material';
import { openDialog } from '../dialog';
import { useAppDispatch } from '@shared/store';

interface UserListItemProps {
  fullName: string;
  avatarLink: string;
  phoneNumber: string;
  email?: string;
  onClick?: () => void;
  className?: string
}

const UserListItem: React.FC<UserListItemProps> = ({ fullName, avatarLink, phoneNumber, email, onClick, className = ''}) => {
  const dispatch = useAppDispatch()

  return (
    <div className={`${className} flex items-start w-full gap-16 ${onClick ? 'hover:bg-primary-main/5 rounded p-2 hover:cursor-pointer' : ''}`} onClick={onClick}>
      <Avatar alt={fullName} src={avatarLink} className='size-48' />
      <div>
        <Typography className='font-semibold text-primary-main'>{fullName}</Typography>
        <div className="flex items-center gap-16 mt-2">
          <div className="flex items-center w-120">
            <LocalPhoneOutlined fontSize='small' className='size-16' />
            <div className="ml-8 text-text-secondary leading-6">{phoneNumber}</div>
          </div>
          {
            email && (
              <div className="flex items-center">
                <EmailOutlined fontSize='small' className='size-16' />
                <div className="ml-8 text-text-secondary leading-6">{email || 'emailisnull@fpt.edu.vn'}</div>
              </div>
            )
          }
        </div>
      </div>
    </div>
  );
};

export default UserListItem;
