import { Heading, NavLinkAdapter, PageSimple } from '@/shared/components'
import { Button } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Outlet, useParams } from 'react-router-dom'
import QnaView from './QnaView'
import QnaList from './QnaList'

const Qna = () => {
  const routeParams = useParams();
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
  console.log('------------------',routeParams.id)
  useEffect(() => {
    setRightSidebarOpen(Boolean(routeParams.id));
  }, [routeParams]);

  return (
    <div>
      <PageSimple
        rightSidebarContent={<QnaView />}
        rightSidebarOpen={rightSidebarOpen}
        rightSidebarOnClose={() => setRightSidebarOpen(false)}
        rightSidebarVariant="permanent"
        content={<QnaList />}
      />

    </div>
  )
}

export default Qna