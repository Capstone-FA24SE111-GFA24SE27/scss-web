import { PageSimple } from '@/shared/components';
import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import QuestionCardCategoryTable from './QuestionCardCategoryTable';
import QuestionCardCategorySidebarContent from './QuestionCardSidebarContent';
import QuestionCardHeading from './QuestionCardHeading';
type Props = {};

const QuestionCardLayout = () => {
	const pageLayout = useRef(null);
	const routeParams = useParams();
	const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
	const isMobile = false;
	const navigate = useNavigate();
    const location = useLocation()

	useEffect(() => {
		if (routeParams.id || location.pathname.split("/").pop() === "create") {
			setRightSidebarOpen(true);
		} else {
			setRightSidebarOpen(false);
		}
	}, [routeParams]);

	const handleCloseRightSideBar = () => {
		navigate(-1);
	};

	return (
		<PageSimple
			header={<QuestionCardHeading />}
			content={<QuestionCardCategoryTable />}
			ref={pageLayout}
			rightSidebarContent={<QuestionCardCategorySidebarContent />}
			rightSidebarOpen={rightSidebarOpen}
			rightSidebarOnClose={handleCloseRightSideBar}
			rightSidebarVariant={'temporary'}
			rightSidebarWidth={520}
			scroll={isMobile ? 'normal' : 'content'}
		/>
	);
};

export default QuestionCardLayout;
