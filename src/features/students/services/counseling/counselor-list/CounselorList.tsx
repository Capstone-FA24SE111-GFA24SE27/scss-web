import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { PageSimple } from '@shared/components';
import CounselorList from './CounselorListContent';
import CounselorListContent from './CounselorListContent';


const Root = styled(PageSimple)(({ theme }) => ({
  '& .PageSimple-header': {
    backgroundColor: theme.palette.background.paper
  },
}));

/**
 * The ContactsApp page.
 */
function CounselingList() {
  const pageLayout = useRef(null);
  const routeParams = useParams();
  const [rightSidebarOpen, setRightSidebarOpen] = useState(true);
  // const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
  // useGetContactsListQuery();
  // useGetContactsCountriesQuery();
  // useGetContactsTagsQuery();
  const isMobile = false
  return (
    <div>
      <Root
        className='!min-h-screen'
        header={<div>Header here</div>}
        content={<CounselorList />}
        ref={pageLayout}
        rightSidebarContent={<div>side bar here</div>}
        rightSidebarOpen={rightSidebarOpen}
        rightSidebarOnClose={() => setRightSidebarOpen(false)}
        rightSidebarVariant="permanent"
        scroll={isMobile ? 'normal' : 'content'}
      />
    </div>

  );
}

export default CounselingList;
