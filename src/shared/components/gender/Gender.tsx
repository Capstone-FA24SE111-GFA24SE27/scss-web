import React from 'react';
import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';
import TransgenderIcon from '@mui/icons-material/Transgender';
import { Tooltip } from '@mui/material';
interface GenderProps {
  gender: string;
  className?: string
}

const Gender = ({ gender, className = '' }: GenderProps) => {
  return (
    <div className={className}>
      {gender === 'MALE'
        ? <Tooltip title='Male'>
          <MaleIcon className='text-blue-500' fontSize='large' />
        </Tooltip>
        : gender === 'FEMALE'
          ? <Tooltip title='Female'>
            <FemaleIcon className='text-pink-500' fontSize='large' />
          </Tooltip>
          : <Tooltip title='Transgender'>
            <TransgenderIcon className='text-gray-500' fontSize='large' />
          </Tooltip>
      }
    </div>
  );
};

export default Gender;