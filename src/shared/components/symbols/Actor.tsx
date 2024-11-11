import React from 'react';
import { SvgIcon, SvgIconProps } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SchoolIcon from '@mui/icons-material/School';
import GroupIcon from '@mui/icons-material/Group';

interface CustomIconProps extends SvgIconProps {
  name: 'COUNSELOR' | 'STUDENT' | 'SUPPORT_STAFF';
}

const CustomIcon: React.FC<CustomIconProps> = ({ name, color = 'inherit', ...props }) => {
  let IconComponent: React.ReactElement | null = null;

  switch (name) {
    case 'COUNSELOR':
      IconComponent = <AccountCircleIcon {...props} color={color} />;
      break;
    case 'STUDENT':
      IconComponent = <SchoolIcon {...props} color={color} />;
      break;
    case 'SUPPORT_STAFF':
      IconComponent = <GroupIcon {...props} color={color} />;
      break;
    default:
      IconComponent = null;  // Default if no valid name is passed
      break;
  }

  return IconComponent ? IconComponent : <SvgIcon {...props} color={color}>❌</SvgIcon>;
};