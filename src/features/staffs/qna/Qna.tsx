import { PageSimple } from '@/shared/components';
import React, { useEffect, useRef, useState } from 'react';
import QnaSidebarContent from './QnaSidebarContent';
import QnaHeader from './QnaHeader';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import QnaList from './QnaList';


const Qna = () => {
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
			rightSidebarContent={<QnaSidebarContent />}
			header={<QnaHeader />}
			rightSidebarOpen={rightSidebarOpen}
			rightSidebarOnClose={handleCloseRightSideBar}
			rightSidebarVariant='temporary'
			scroll={isMobile ? 'normal' : 'content'}
			ref={pageLayout}
			rightSidebarWidth={640}
			content={<QnaList />}
		/>
	);
};

export default Qna;
