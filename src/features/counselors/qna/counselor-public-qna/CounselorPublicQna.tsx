import { Heading, NavLinkAdapter, PageSimple } from '@/shared/components';
import { Add, Chat, Forum } from '@mui/icons-material';
import { Button } from '@mui/material';
import { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import QnaSidebarContent from './CounselorPublicQnaSidebarContent';
import { Faq } from '@/shared/pages';
import PublicQna from '@/shared/pages/public-qna/PublicQna';

const CounselorPublicQna = () => {
	const routeParams = useParams();
	const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
	const [tabValue, setTabValue] = useState(0);

	const location = useLocation();
	const navigate = useNavigate();
	const isOpenConversations = Boolean(
		location?.pathname.includes('qna/conversations')
	);
	const isOpenQnaForm = Boolean(
		location?.pathname.includes('faq/create')
		|| location?.pathname.includes('faq/edit')
	);

	function handleChangeTab(event: React.SyntheticEvent, value: number) {
		setTabValue(value);

	}

	// useEffect(() => {
	// 	switch (tabValue) {
	// 		case 0:
	// 			navigate(`question-board`);
	// 			break;
	// 		case 1:
	// 			navigate(`my-qna`);
	// 			break;
	// 		default:
	// 			navigate(`/`);
	// 			break;
	// 	}
	// }, [tabValue]);

	useEffect(() => {
		setTabValue(
			location?.pathname.includes('question-board') ? 0
				: location?.pathname.includes('question-board') ? 1
					: 0
		)
	}, []);

	useEffect(() => {
		setRightSidebarOpen(Boolean(routeParams.id) || isOpenConversations || isOpenQnaForm);
	}, [routeParams]);

	const isMobile = false;

	return (
		<PageSimple
			rightSidebarContent={<QnaSidebarContent />}
			header={
				<div className='border-b'>
					<div className='flex items-center justify-between px-32 py-24 bg-background-paper'>
						<Heading
							title='Public Questions & Answers'
							description='All Q&As from students answered by our counselors'
						/>
					</div>
				</div>
			}
			rightSidebarOpen={rightSidebarOpen}
			rightSidebarOnClose={() => {
				setRightSidebarOpen(false);
				navigate(-1);
			}}
			rightSidebarVariant={
				isOpenConversations ? 'permanent' : 'temporary'
			}
			scroll={isMobile ? 'normal' : 'content'}
			rightSidebarWidth={480}
			content={
				<div className='w-full'>
					<PublicQna />
				</div>
			}
		/>
	);
};

export default CounselorPublicQna;
