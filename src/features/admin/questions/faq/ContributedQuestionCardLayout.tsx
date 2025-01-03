import { PageSimple } from '@/shared/components';
import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import QuestionCardHeading from './ContributedQuestionCardHeading';
import QuestionCardCategorySidebarContent from './ContributedQuestionCardSidebarContent';
import QuestionCardCategoryTable from './question-card-category/QuestionCardCategoryTable';
import { useAppSelector } from '@shared/store';
import ContributedQuestionTable from './ContributedQuestionTable';
import { selectContributedQuestionTab } from '../admin-question-slice';

const ContributedQuestionCardLayout = () => {
	const pageLayout = useRef(null);
	const routeParams = useParams();
	const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
	const isMobile = false;
	const navigate = useNavigate();
	const location = useLocation();
	const tab = useAppSelector(selectContributedQuestionTab);

	useEffect(() => {
		if (routeParams.id || location.pathname.split('/').pop() === 'create') {
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
			content={
				<>
					{tab === 0 && <ContributedQuestionTable />}
					{tab === 1 && <QuestionCardCategoryTable />}
				</>
			}
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

export default ContributedQuestionCardLayout;
