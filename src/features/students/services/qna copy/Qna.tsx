import { Heading, NavLinkAdapter, PageSimple } from '@/shared/components';
import { Add, Chat, Forum } from '@mui/icons-material';
import { Button } from '@mui/material';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import QnaForm from './QnaForm';
import QnaList from './QnaList';
import QnaSidebarContent from './QnaSidebarContent';
import { Tab, Tabs } from '@mui/material';

const Qna = () => {
	const routeParams = useParams();
	const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
	const [tabValue, setTabValue] = useState(0);

	const location = useLocation();
	const navigate = useNavigate();
	const isOpenConversations = Boolean(
		location?.pathname.includes('conversations')
	);

	function handleChangeTab(event: React.SyntheticEvent, value: number) {
		setTabValue(value);
		switch (value) {
			case 0:
				navigate(`question-board`);
				break;
			case 1:
				navigate(`my-qna`);
				break;
			default:
				navigate(`/`);
				break;
		}
	}

	useEffect(() => {
		setRightSidebarOpen(Boolean(routeParams.id) || isOpenConversations);
	}, [routeParams]);

	const isMobile = false;

	return (
		<PageSimple
			rightSidebarContent={<QnaSidebarContent />}
			header={
				<div className='border-b'>
					<div className='flex items-center justify-between p-32  bg-background-paper'>
						<Heading
							title='Questions and Answers'
							description='Offering a collection of Q&A and resolve student concerns.'
						/>
						<div className='flex gap-8'>
							{!location?.pathname.includes('conversations') && (
								<Button
									variant='contained'
									color='primary'
									component={NavLinkAdapter}
									to='conversations'
									startIcon={<Forum />}
								>
									Conversations
								</Button>
							)}
							<Button
								variant='contained'
								color='secondary'
								component={NavLinkAdapter}
								to='create'
								startIcon={<Add />}
							>
								Ask a question
							</Button>
						</div>
					</div>
					<Tabs
						value={tabValue}
						onChange={handleChangeTab}
						indicatorColor="secondary"
						textColor="secondary"
						variant="scrollable"
						scrollButtons="auto"
						classes={{ root: 'w-full h-32 border-b bg-background-paper px-16' }}
					>
						<Tab
							className="text-lg font-semibold min-h-40 min-w-64 px-16"
							label="Question Board"
						/>
						<Tab
							className="text-lg font-semibold min-h-40 min-w-64 px-16"
							label="My Q&A"
						/>
					</Tabs>
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
				location.pathname.includes('create') ||
					location.pathname.includes('edit') ? (
					<QnaForm />
				) : (
					<QnaList />
				)
			}
		/>
	);
};

export default Qna;
