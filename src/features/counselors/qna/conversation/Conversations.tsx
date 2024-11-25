import {
	Avatar,
	Chip,
	Divider,
	Input,
	ListItemButton,
	Paper,
	Tooltip,
	Typography,
} from '@mui/material';
import React, { useRef, useState } from 'react';
import { useGetMyCounselorQuestionsQuery } from '../qna-api';
import {
	CheckCircleOutlineOutlined,
	HelpOutlineOutlined,
	Search,
} from '@mui/icons-material';
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import { selectAccount, useAppSelector } from '@shared/store';
import { useEffect } from 'react';
import { Heading, PageSimple, Scrollbar } from '@/shared/components';
import { Question } from '@/shared/types';
import ConversationItem from './ConversationItem';
import ConversationSidebarContent from './ConversationSidebarContent';

const Conversation = () => {
	const { data: qnaData, refetch } = useGetMyCounselorQuestionsQuery({});
	const qnaList =
		qnaData?.content?.data.filter((item) => item.chatSession) || [];
	// const account = useAppSelector(selectAccount);
	const routeParams = useParams();
	const pageRef = useRef(null);
	const listRef = useRef<HTMLDivElement>(null);
	const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
	const [isSmallScreen, setIsSmallScreen] = useState(true);
	const [chatWidth, setChatWidth] = useState(512);
	// const location = useLocation();

	useEffect(() => {
		setRightSidebarOpen(Boolean(routeParams.id));
	}, [routeParams]);
	const isMobile = false;

	const navigate = useNavigate();

	const handleSelectChat = (qnaItem: Question) => {
		navigate(`${qnaItem.id}`);
	};

	useEffect(() => {
		if (pageRef && pageRef.current && listRef) {
			const element = pageRef.current.rootRef.current;

			const resizeObserver = new ResizeObserver((entries) => {
				for (let entry of entries) {
					if (entry.contentRect.width < 850) {
						setIsSmallScreen(true);
						setChatWidth(entry.contentRect.width);
					} else {
						setIsSmallScreen(false);
						const width =
							entry.contentRect.width -
							listRef.current.clientWidth -
							1;
						setChatWidth(width);
					}
				}
			});

			resizeObserver.observe(element);

			return () => {
				resizeObserver.unobserve(element);
			};
		}
	}, [pageRef, listRef]);

	useEffect(() => {
		refetch();
	}, []);

	return (
		<PageSimple
			ref={pageRef}
			rightSidebarContent={<ConversationSidebarContent />}
			header={<></>}
			rightSidebarOpen={rightSidebarOpen}
			rightSidebarOnClose={() => {
				setRightSidebarOpen(false);
				navigate(-1);
			}}
			rightSidebarVariant={isSmallScreen ? 'temporary' : 'permanent'}
			scroll={isMobile ? 'normal' : 'content'}
			rightSidebarWidth={chatWidth}
			content={
				<div className='flex w-full h-full '>
					<div
						ref={listRef}
						className='box-border flex-shrink-0 p-16 space-y-16 border-r min-w-320 bg-background-paper'
					>
						<Typography className='text-3xl font-extrabold'>
							Conversations
						</Typography>
						{/* <Paper className="flex items-center w-full h-40 p-4 px-16 py-4 rounded-full shadow-none border-1">
	  <Search />
	  <Input
		placeholder="Search"
		className="flex flex-1 px-8"
		disableUnderline
		fullWidth
		inputProps={{
		  'aria-label': 'Search'
		}}
	  />
	</Paper> */}
						<Scrollbar className='space-y-8 overflow-y-auto !h-[calc(100vh-212px)]'>
							{qnaList.length === 0 ? (
								<Typography
									className='w-full text-lg text-center'
									color='textSecondary'
								>
									No conversations found
								</Typography>
							) : (
								qnaList.map(
									(qnaItem) =>
										qnaItem.chatSession && (
											<ConversationItem
												key={qnaItem.id}
												onClick={() =>
													handleSelectChat(qnaItem)
												}
												qnaItem={qnaItem}
											/>
										)
								)
							)}
						</Scrollbar>
					</div>
				</div>
			}
		/>
	);
};

export default Conversation;
