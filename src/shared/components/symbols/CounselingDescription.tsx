import React from 'react';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

export default function CounselingDescription() {
  return (
    <Tooltip title="Get guidance on your educational path, course selection, study strategies, and career planning." arrow>
      <IconButton>
        <HelpOutlineIcon color="primary" />
      </IconButton>
    </Tooltip>
  );
}