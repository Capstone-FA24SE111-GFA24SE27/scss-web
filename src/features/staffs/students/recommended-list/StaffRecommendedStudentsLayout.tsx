import { Heading, PageSimple } from '@/shared/components';
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import RecommendedStudentsSidebarContent from './RecommendedStudentsSidebarContent';
import Header from './Header';
import { filterClose, selectFilter } from './recommended-list-slice';
import SidebarFilter from './SidebarFilter';
import { useAppDispatch, useAppSelector } from '@shared/store';
import RecommendedStudentList from './RecommendedStudentList';


const StaffRecommendedStudentsLayout = () => {
	const pageLayout = useRef(null);
	const dispatch = useAppDispatch();
	const filter = useAppSelector(selectFilter)
	const routeParams = useParams();
	const isMobile = false
	const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
	useEffect(() => {
	  setRightSidebarOpen(Boolean(routeParams.id));
	}, [routeParams]);
	return (
	  <PageSimple
		header={
		  <div className='p-32 border-b bg-background-paper'>
			<Heading
			  title='Recommended Student List'
			  description='Recommended Students for demand'
			/>
		  </div>
		}
		rightSidebarContent={<RecommendedStudentsSidebarContent />}
		rightSidebarOpen={rightSidebarOpen}
		rightSidebarOnClose={() => setRightSidebarOpen(false)}
		rightSidebarVariant="temporary"
		scroll={isMobile ? 'normal' : 'content'}
		content={
		  <PageSimple
			className='h-full max-h-full overflow-hidden'
			header={<Header   />}
			content={<RecommendedStudentList />}
			ref={pageLayout}
			rightSidebarContent={<SidebarFilter />}
			rightSidebarOpen={filter.open}
			rightSidebarOnClose={() => dispatch(filterClose())}
			rightSidebarVariant="permanent"
			rightSidebarWidth={432}
		  />
		}
	  />
	);
}

export default StaffRecommendedStudentsLayout