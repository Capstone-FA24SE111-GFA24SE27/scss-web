import { PageSimple } from '@/shared/components';
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import StudentHeader from './StudentHeader';
import StudentSidebarContent from './StudentSidebarContent';
import StudentList from './StudentList';
import StudentListLayout from './StudentListLayout';

type Props = {}

const Student = (props: Props) => {
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
			rightSidebarContent={<StudentSidebarContent />}
			header={<StudentHeader />}
			rightSidebarOpen={rightSidebarOpen}
			rightSidebarOnClose={handleCloseRightSideBar}
			rightSidebarVariant='temporary'
			scroll={isMobile ? 'normal' : 'content'}
			ref={pageLayout}
			rightSidebarWidth={640}
			content={<StudentListLayout />}
		/>
	);
}

export default Student