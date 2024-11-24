import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { Heading, PageSimple } from '@shared/components';
import StudentListContent from './StudentListContent';
import StudentListHeader from './StudentListHeader';
import { useAppDispatch, useAppSelector } from '@shared/store';
import { filterClose, selectFilter } from './student-list-slice';
import StudentListSidebarContent from './StudentListSidebarContent';
import StudentViewSidebar from './StudentViewSidebar';

function StudentList({ isShowingTab = false }) {
  const pageLayout = useRef(null);
  const dispatch = useAppDispatch();
  const filter = useAppSelector(selectFilter)
  const routeParams = useParams();
  const isMobile = false
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
  const navigate = useNavigate()
  useEffect(() => {
    setRightSidebarOpen(Boolean(routeParams.id));
  }, [routeParams]);
  return (
    <PageSimple
      header={
        <div className='p-32 border-b bg-background-paper'>
          <Heading
            title='Student List'
            description='Students in FPTU HCM'
          />
        </div>
      }
      rightSidebarContent={<StudentViewSidebar />}
      rightSidebarOpen={rightSidebarOpen}
      rightSidebarOnClose={() => {
        navigate('.')
        setRightSidebarOpen(false)
      }}
      rightSidebarVariant="temporary"
      scroll={isMobile ? 'normal' : 'content'}
      content={
        <PageSimple
          className='!min-h-screen'
          header={<StudentListHeader isShowingTab={isShowingTab} />}
          content={<StudentListContent />}
          ref={pageLayout}
          rightSidebarContent={<StudentListSidebarContent />}
          rightSidebarOpen={filter.open}
          rightSidebarOnClose={() => {
            dispatch(filterClose())
          }}
          rightSidebarVariant="permanent"
          rightSidebarWidth={432}
        />
      }
    />
  );
}

export default StudentList;
