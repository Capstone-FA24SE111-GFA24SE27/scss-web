import { useEffect, useRef, useState } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { Heading, PageSimple } from '@shared/components';
import MyQnaContent from './MyQnaContent';
import MyQnaSidebarContent from './MyQnaSidebarContent';



/**
 * The ContactsApp page.
 */
function MyQna() {
  const pageLayout = useRef(null);
  const routeParams = useParams();
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
  const isMobile = false
  useEffect(() => {
    setRightSidebarOpen(Boolean(routeParams.id));
  }, [routeParams]);

  return (
    <PageSimple
      header={
        <div className='p-32 bg-background-paper'>
          <Heading title='My Q&A' description='List of your questions and answers' />
        </div>}
      content={<MyQnaContent />}
      ref={pageLayout}
      rightSidebarContent={<MyQnaSidebarContent />}
      rightSidebarOpen={rightSidebarOpen}
      rightSidebarOnClose={() => setRightSidebarOpen(false)}
      rightSidebarVariant="permanent"
      rightSidebarWidth={520}
      scroll={isMobile ? 'normal' : 'content'}
    />
  );
}

export default MyQna;
