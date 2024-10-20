import { PageSimple } from '@/shared/components';
import React, { useEffect, useState } from 'react';
import QnaSidebarContent from './QnaSidebarContent';
import QnaHeader from './QnaHeader';
import { useLocation, useParams } from 'react-router-dom';
import QnaList from './QnaList';


const Qna = () => {
	const routeParams = useParams();
	const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
	const location = useLocation();

	useEffect(() => {
		setRightSidebarOpen(Boolean(routeParams.id));
	}, [routeParams]);

	const isMobile = false;

	return (
		<PageSimple
			rightSidebarContent={<QnaSidebarContent />}
			header={<QnaHeader />}
			rightSidebarOpen={rightSidebarOpen}
			rightSidebarOnClose={() => setRightSidebarOpen(false)}
			rightSidebarVariant='permanent'
			scroll={isMobile ? 'normal' : 'content'}
			rightSidebarWidth={640}
			content={<QnaList />}
		/>
	);
};

export default Qna;
