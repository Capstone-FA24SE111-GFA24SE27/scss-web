import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import { ContentLoading } from '.';

export default function BackdropLoading() {

  return (
    <div>
      <Backdrop
        sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
        open={true}
      >
        {/* <CircularProgress color="inherit" /> */}  
        <CircularProgress size={96} color='secondary'/>
      </Backdrop>
    </div>
  );
}