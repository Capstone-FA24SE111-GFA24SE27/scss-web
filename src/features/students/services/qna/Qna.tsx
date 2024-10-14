import { Heading, NavLinkAdapter, PageSimple } from '@/shared/components'
import { Button } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Outlet, useLocation, useParams } from 'react-router-dom'
import QnaList from './QnaList'
import QnaSidebarContent from './QnaSidebarContent'
import QnaForm from './QnaForm'
const Qna = () => {
  const routeParams = useParams();
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
  const location = useLocation()
  useEffect(() => {
    setRightSidebarOpen(Boolean(routeParams.id));
  }, [routeParams]);
  const isMobile = false

  return (
    <PageSimple
      rightSidebarContent={
        <QnaSidebarContent />
      }
      header={
        <div className='flex items-center justify-between bg-background-paper p-32 border-b'>
          <Heading
            title='Questions and Answers'
            description='List of questions and answers you have started'
          />
          <Button variant='contained' color='secondary' component={NavLinkAdapter} to='create'>Ask a question</Button>
        </div>
      }
      rightSidebarOpen={rightSidebarOpen}
      rightSidebarOnClose={() => setRightSidebarOpen(false)}
      rightSidebarVariant="permanent"
      scroll={isMobile ? 'normal' : 'content'}
      rightSidebarWidth={640}
      content={location.pathname.includes('create') ? <QnaForm /> : <QnaList />}
    />
  )
}

export default Qna