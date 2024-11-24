import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { PageSimple } from '@shared/components';
import StudentDemandsHeader from './StudentDemandsHeader';
import StudentDemandsContent from './StudentDemandsContent';
import StudentDemandsSidebarContent from './StudentDemandsSidebarContent';

function StudentDemands() {
  const routeParams = useParams();
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
  // const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
  // useGetContactsListQuery();
  // useGetContactsCountriesQuery();
  // useGetContactsTagsQuery();
  const isMobile = false
  const navigate = useNavigate()
  useEffect(() => {
    setRightSidebarOpen(Boolean(routeParams.id));
  }, [routeParams]);

  return (
    <PageSimple
      header={<StudentDemandsHeader />}
      content={<StudentDemandsContent />}
      rightSidebarContent={<StudentDemandsSidebarContent />}
      rightSidebarOpen={rightSidebarOpen}
      rightSidebarOnClose={() => {
        setRightSidebarOpen(false)
        navigate(-1)
      }}
      rightSidebarVariant="temporary"
      scroll={isMobile ? 'normal' : 'content'}
    />
  );
}

export default StudentDemands;
