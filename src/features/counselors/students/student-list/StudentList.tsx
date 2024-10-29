import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { Heading, PageSimple } from '@shared/components';
import StudentList from './StudentListContent';
import StudentListHeader from './StudentListHeader';
import { useAppDispatch, useAppSelector } from '@shared/store';
import { filterClose, selectFilter } from './student-list-slice';
import StudentListSidebarContent from './StudentListSidebarContent';
import StudentViewSidebarContent from './StudentViewSidebarContent';


const Root = styled(PageSimple)(({ theme }) => ({
  // '& .PageSimple-header': {
  //   backgroundColor: theme.palette.background.paper
  // },
}));

/**
 * The ContactsApp page.
 */
function CounselorList() {
  const pageLayout = useRef(null);
  const dispatch = useAppDispatch();
  const filter = useAppSelector(selectFilter)
  const routeParams = useParams();

  // const [rightSidebarOpen, setRightSidebarOpen] = useState(true);
  // const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
  // useGetContactsListQuery();
  // useGetContactsCountriesQuery();
  // useGetContactsTagsQuery();
  const isMobile = false
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
  // const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
  // useGetContactsListQuery();
  // useGetContactsCountriesQuery();
  // useGetContactsTagsQuery();
  useEffect(() => {
    setRightSidebarOpen(Boolean(routeParams.id));
  }, [routeParams]);
  return (
    <PageSimple
      header={
        <div className='p-32 bg-background-paper border-b'>
          <Heading
            title='Student List'
            description='Students fro FPTU HCM'
          />
        </div>
      }
      rightSidebarContent={<StudentViewSidebarContent />}
      rightSidebarOpen={rightSidebarOpen}
      rightSidebarOnClose={() => setRightSidebarOpen(false)}
      rightSidebarVariant="temporary"
      scroll={isMobile ? 'normal' : 'content'}
      content={
        <Root
          className='!min-h-screen'
          header={<StudentListHeader />}
          content={<StudentList />}
          ref={pageLayout}
          rightSidebarContent={<StudentListSidebarContent />}
          rightSidebarOpen={filter.open}
          rightSidebarOnClose={() => dispatch(filterClose())}
          rightSidebarVariant="permanent"
          rightSidebarWidth={432}
        />
      }
    />
  );
}

export default CounselorList;
