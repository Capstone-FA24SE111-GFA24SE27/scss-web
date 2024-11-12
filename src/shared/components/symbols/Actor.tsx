import React from 'react';
import { SvgIcon, SvgIconProps } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SchoolIcon from '@mui/icons-material/School';
import GroupIcon from '@mui/icons-material/Group';
import { Badge, EmojiPeople, Handshake, SupervisedUserCircle, SupportAgent } from '@mui/icons-material';
import { Role } from '@/shared/types';

interface ActorProps extends SvgIconProps {
  name: Role;
}

const Actor: React.FC<ActorProps> = ({ name, color = 'inherit', ...props }) => {
  let IconComponent: React.ReactElement | null = null;

  switch (name) {
    case 'STUDENT':
      IconComponent = <Badge {...props} color={color} />;
      break;
    case 'COUNSELOR':
      IconComponent = <SupportAgent {...props} color={color} />;
      break;
    case 'NON_ACADEMIC_COUNSELOR':
      IconComponent = <Handshake {...props} color={color} />;
      break;
    case 'ACADEMIC_COUNSELOR':
      IconComponent = <SchoolIcon {...props} color={color} />;
      break;
    case 'SUPPORT_STAFF':
      IconComponent = <EmojiPeople {...props} color={color} />;
      break;
    default:
      IconComponent = null;  // Default if no valid name is passed
      break;
  }

  return IconComponent ? IconComponent : <SvgIcon {...props} color={color}>❌</SvgIcon>;
};

export default Actor;