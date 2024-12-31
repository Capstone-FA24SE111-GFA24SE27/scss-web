import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { PageSimple } from '@shared/components';
import CounselorList from './CounselorListContent';
import CounselorListHeader from './CounselorListHeader';
import { useAppDispatch, useAppSelector } from '@shared/store';
import { filterClose, selectFilter } from './counselor-list-slice';
import CounselorListSidebarContent from './CounselorListSidebarContent';


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
      <PageSimple
        className='!min-h-screen'
        header={<CounselorListHeader />}
        content={<CounselorList />}
        ref={pageLayout}
        rightSidebarContent={
          <div className='p-24 '>
            <CounselorListSidebarContent />
          </div>
        }
        rightSidebarOpen={filter.open}
        rightSidebarOnClose={() => dispatch(filterClose())}
        rightSidebarVariant="permanent"
        scroll={isMobile ? 'normal' : 'content'}
        rightSidebarWidth={440}
      />
    </div>

  );
}

export default CounselingList;
