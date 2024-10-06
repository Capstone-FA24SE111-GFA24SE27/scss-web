import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { PageSimple } from '@shared/components';
import CounselorList from './CounselorListContent';
import CounselorListHeader from './CounselorListHeader';
import { useAppDispatch, useAppSelector } from '@shared/store';
import { filterClose, selectFilter } from './filter-slice';
import CounselorListSidebarContent from './CounselorListSidebarContent';


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
  const dispatch = useAppDispatch();
  const filter = useAppSelector(selectFilter)
  // const [rightSidebarOpen, setRightSidebarOpen] = useState(true);
  // const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
  // useGetContactsListQuery();
  // useGetContactsCountriesQuery();
  // useGetContactsTagsQuery();
  const isMobile = false
  return (
    <div>
      <Root
        className='!min-h-screen'
        header={<div><CounselorListHeader /></div>}
        content={<CounselorList />}
        ref={pageLayout}
        rightSidebarContent={<CounselorListSidebarContent />}
        rightSidebarOpen={filter.open}
        rightSidebarOnClose={() => dispatch(filterClose())}
        rightSidebarVariant="permanent"
        scroll={isMobile ? 'normal' : 'content'}
        rightSidebarWidth={320}
      />
    </div>

  );
}

export default CounselingList;