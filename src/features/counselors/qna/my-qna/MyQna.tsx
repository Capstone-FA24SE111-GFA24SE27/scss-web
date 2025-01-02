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
  const isOpenStudent = Boolean(location?.pathname.includes('student'))

  useEffect(() => {
    setRightSidebarOpen(Boolean(routeParams.id));
  }, [routeParams]);

  return (
    <PageSimple
      header={
        <div className='p-32 bg-background-paper'>
          <Heading title='My Questions' description='List of your assigned questions for the counselor to answer' />
        </div>
      }
      content={<MyQnaContent />}
      ref={pageLayout}
      rightSidebarContent={<MyQnaSidebarContent />}
      rightSidebarOpen={rightSidebarOpen}
      rightSidebarOnClose={() => setRightSidebarOpen(false)}
      rightSidebarVariant={isOpenStudent ? "temporary" : "permanent"}
      rightSidebarWidth={520}
      scroll={isMobile ? 'normal' : 'content'}
    />
  );
}

export default MyQna;
