import { Heading, PageSimple } from '@/shared/components';
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import FollowedStudentsSidebar from './FollowedStudentsSidebar';
import StaffFollowedStudentsList from './StaffFollowedStudentsList';

type Props = {}

const StaffFollowedStudentLayout = (props: Props) => {
    const routeParams = useParams();
	const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
	const pageLayout = useRef(null);
	const navigate = useNavigate()

	

	useEffect(() => {
		if (routeParams.id || routeParams.date) {
			setRightSidebarOpen(true);
		} else {
			setRightSidebarOpen(false)
		}
	}, [routeParams]);

	const handleCloseRightSideBar = () => {
		navigate('')
	}

	const isMobile = false;

	return (
		<PageSimple
			rightSidebarContent={<FollowedStudentsSidebar />}
			header={<div className='p-32 border-b bg-background-paper'>
				<Heading
				  title='Followed Student List'
				  description='Followed Students'
				/>
			  </div>}
			rightSidebarOpen={rightSidebarOpen}
			rightSidebarOnClose={handleCloseRightSideBar}
			rightSidebarVariant='temporary'
			scroll={isMobile ? 'normal' : 'content'}
			ref={pageLayout}
			rightSidebarWidth={640}
			content={<StaffFollowedStudentsList />}
		/>
	);
}

export default StaffFollowedStudentLayout