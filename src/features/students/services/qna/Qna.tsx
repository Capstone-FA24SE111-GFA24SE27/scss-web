import { Heading, NavLinkAdapter, PageSimple } from '@/shared/components'
import { Add, Chat, Forum } from '@mui/icons-material'
import { Button } from '@mui/material'
import { useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import QnaForm from './QnaForm'
import QnaList from './QnaList'
import QnaSidebarContent from './QnaSidebarContent'
const Qna = () => {
  const routeParams = useParams();
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
  const location = useLocation()
  useEffect(() => {
    setRightSidebarOpen(Boolean(location?.pathname.includes('conversations')));
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
          <div className='flex gap-8'>
            <Button variant='contained' color='primary' component={NavLinkAdapter} to='conversations' startIcon={<Forum />}>Chat</Button>
            <Button variant='contained' color='secondary' component={NavLinkAdapter} to='create' startIcon={<Add />}>Ask a question</Button>
          </div>
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