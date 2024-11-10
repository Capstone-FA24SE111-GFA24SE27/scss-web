import { NavLinkAdapter, PageSimple } from '@/shared/components';
import { Close } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@shared/store';
import { closeCounselorView, selectCounselorView } from './students-layout-slice';
import { lazy } from 'react';
import { CounselorView } from '@/shared/pages';
const Students = () => {
  const dispatch = useAppDispatch()
  const isMobile = false
  const counselorView = useAppSelector(selectCounselorView)
  const isOpenCounselorView = Boolean(counselorView)

  return (
    <PageSimple
      content={<Outlet />}
      rightSidebarContent={
        <div className="flex flex-col flex-auto max-w-full w-fit">
          <IconButton
            className="absolute top-0 right-0 my-16 mx-32 z-10"
            onClick={() => { dispatch(closeCounselorView()) }}
            size="large"
          >
            <Close />
          </IconButton>
          <CounselorView id={counselorView} />
        </div>
      }
      rightSidebarOpen={isOpenCounselorView}
      rightSidebarOnClose={() => { dispatch(closeCounselorView()) }}
      rightSidebarVariant="temporary"
      scroll={isMobile ? 'normal' : 'content'}
    />
  );
}

export default Students