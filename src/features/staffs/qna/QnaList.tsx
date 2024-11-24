import React, {
	ChangeEvent,
	ChangeEventHandler,
	SyntheticEvent,
	useEffect,
	useState,
} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
	TypeOfQuestionType,
	useGetQuestionQuery,
	useGetQuestionsQuery,
	usePostFlagQuestionStatusMutation,
	usePostReviewQuestionStatusMutation,
} from './qna-api';
import {
	Avatar,
	Button,
	Chip,
	ListItemButton,
	Menu,
	MenuItem,
	Paper,
	SelectChangeEvent,
	TextField,
	Tooltip,
	Typography,
} from '@mui/material';
import {
	ChatBubbleOutline,
	CheckCircle,
	CheckCircleOutlineOutlined,
	ChevronRight,
	ExpandMore,
	Flag,
	HelpOutlineOutlined,
	Preview,
	RemoveCircle,
	ThumbDownOutlined,
	ThumbUpOutlined,
	Visibility,
} from '@mui/icons-material';
import useDebounceValue from '@/shared/hooks/useDebounceValue';
import { Question } from '@/shared/types';
import { useConfirmDialog } from '@/shared/hooks';
import { useAlertDialog } from '@/shared/hooks';
import { useDispatch } from 'react-redux';
import { NavLinkAdapter, openDialog } from '@/shared/components';
import QnaFlagForm from './QnaFlagFormDialog';
import { useQuestionsSocketListener } from '@/shared/context';
import { selectAccount, useAppSelector } from '@shared/store';
import { statusColor } from '@/shared/constants';

const container = {
	show: {
		transition: {
			staggerChildren: 0.04,
		},
	},
};

const item = {
	hidden: { opacity: 0, y: 20 },
	show: { opacity: 1, y: 0 },
};

const QnaList = () => {
	const [searchKeyword, setSearchKeyword] = useState('');
	const debounceSearchKeyword = useDebounceValue(searchKeyword, 500);
	const [page, setPage] = useState<number>(1);
	const [type, setType] = useState<TypeOfQuestionType>('');
	const debounceType = useDebounceValue(type, 300);

	const [reviewQuestion] = usePostReviewQuestionStatusMutation();
	const [flagQuestion] = usePostFlagQuestionStatusMutation();
	const account = useAppSelector(selectAccount)
	const navigate = useNavigate();
  	const location = useLocation()
	const dispatch = useDispatch();

	const { data: qnaData , refetch} = useGetQuestionsQuery({
		keyword: debounceSearchKeyword,
		sortDirection: 'ASC'	,	
		page: page,
		type: debounceType,
	});
	const qnaList = qnaData?.content?.data || [];

	useQuestionsSocketListener(account?.profile.id, refetch)

	useEffect(() => {
		console.log(qnaData);
	}, [qnaData]);

	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
	const [openId, setOpenId] = useState(null);
	const [selectedQna, setSelectedQna] = useState(null);

	const handleLocalNavigate = (route: string) => {
		const pathSegments = location.pathname.split('/').filter(Boolean);
	
		// Create a new path using the first two segments
		 const newPath = `/${pathSegments[0]}/${route}`;
	
		return newPath
	  }

	const handleMenuButtonClick = (
		event: React.MouseEvent<HTMLButtonElement>,
		qna: Question
	) => {
		setAnchorEl(event.currentTarget as HTMLElement);
		setOpenId(qna.id);
		setSelectedQna(qna);
	};
	const handleClose = () => {
		setAnchorEl(null);
		setOpenId(null);
	};

	const handleVerify = () => {
		useConfirmDialog({
			dispatch: dispatch,
			title: 'Are you sure you want to verify this question?',
			confirmButtonFucntion: async () => {
				const result = await reviewQuestion({
					id: selectedQna.id,
					status: 'VERIFIED',
				});
				useAlertDialog({
					title: result.data.message,
					dispatch: dispatch,
				});
			
			},
		});
	};

	const handleReject = () => {
		useConfirmDialog({
			dispatch: dispatch,
			title: 'Are you sure you want to reject this question?',
			confirmButtonFucntion: async () => {
				const result = await reviewQuestion({
					id: selectedQna.id,
					status: 'REJECTED',
				});
				if (result?.data?.status === 200) {
					useAlertDialog({
						title: 'Question is rejected successfully',
						dispatch: dispatch,
					});
				} else {
					useAlertDialog({
						title: result.data.message,
						dispatch: dispatch,
					});
				}
			},
		});
	};

	const handleFlag = () => {
		dispatch(openDialog({
			children: <QnaFlagForm qna={selectedQna.id}/>
		}))
	};

	const handleTypeSelect = (
		event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		if(event.target.value === 'All') return
		setType(event.target.value as TypeOfQuestionType);
	};

	return (
		<motion.div
			variants={container}
			initial='hidden'
			animate='show'
			className='w-full p-32 space-y-16'
		>
			<div className='flex gap-16'>
				<TextField
					label='Search for questions'
					placeholder='Enter a keyword...'
					onChange={(e) => setSearchKeyword(e.target.value)}
					className='w-320'
					variant='outlined'
					slotProps={{
						inputLabel: {
							shrink: true,
						},
					}}
				/>
				<TextField
					select
					label='Choose type'
					defaultValue={'All'}
					className='w-200 '
					onChange={handleTypeSelect}
					slotProps={{
						inputLabel: {
							shrink: true,
						},
					}}
				>
					<MenuItem value='All'>All</MenuItem>
					<MenuItem value='ACADEMIC'>Academic</MenuItem>
					<MenuItem value='NON_ACADEMIC'>Non-Academic</MenuItem>
				</TextField>
			</div>
			{qnaList?.length > 0 && (
				<div className='space-y-16'>
					{qnaList.map((qna) => {
						return (
							<motion.div variants={item} key={qna.id}>
								<Paper className='flex flex-col gap-8 p-12 overflow-hidden shadow'>
									<div className='relative flex items-center '>
										<div className='flex flex-col w-full gap-8'>
											<div className='flex items-center justify-between w-full '>
												<div className='flex gap-8'>
													<Chip
														label={
															qna.questionType ===
															'ACADEMIC'
																? 'Academic'
																: 'Non-Academic'
														}
														color={
															qna.questionType ===
															'ACADEMIC'
																? 'info'
																: 'warning'
														}
														size='small'
													/>
													<Chip
														label={qna.status}
														color={
															statusColor[
																qna.status
															] as
																| 'error'
																| 'default'
																| 'warning'
																| 'success'
														}
														size='small'
													/>
													{qna.closed && (
														<Chip
															label={'Closed'}
															color={'warning'}
															size='small'
														/>
													)}
												</div>
												<div>
													<Button
														onClick={(event) =>
															handleMenuButtonClick(
																event,
																qna
															)
														}
													>
														Action
													</Button>
													<Menu
														id={qna.id + 'menu'}
														anchorEl={anchorEl}
														open={openId === qna.id}
														onClose={handleClose}
													>
														<MenuItem
															className='w-[14rem] gap-8 font-medium'
															onClick={() => {
																navigate(
																	`${qna.id}/view`
																);
																handleClose();
															}}
														>
															<Visibility color='info' />
															View
														</MenuItem>
														<MenuItem
															onClick={() => {
																handleVerify();
																handleClose();
															}}
															className='w-[14rem] gap-8 font-medium'
														>
															<CheckCircle color='success' />
															Verify
														</MenuItem>
														<MenuItem
															onClick={() => {
																handleReject();
																handleClose();
															}}
															className='w-[14rem] gap-8 font-medium'
														>
															<RemoveCircle color='warning' />
															Reject
														</MenuItem>
														<MenuItem
															onClick={() => {
																handleFlag();
																handleClose();
															}}
															className='w-[14rem] gap-8 font-medium'
														>
															<Flag color='error' />
															Flag
														</MenuItem>
													</Menu>
												</div>
											</div>
											<div className='flex items-center flex-1 gap-8'>
												{/* <Divider orientation='vertical' /> */}
												{qna.answer ? (
													<CheckCircleOutlineOutlined color='success' />
												) : (
													<HelpOutlineOutlined color='disabled' />
												)}

												<Typography className='w-full pr-8 font-semibold'>
													{qna.content}
												</Typography>
											</div>
										</div>
									</div>
									<Tooltip
										title={`View ${qna.student.profile.fullName}'s profile`}
									>
									<ListItemButton
										component={NavLinkAdapter}
										to={handleLocalNavigate(`student/${qna.student.profile.id}`)}
										className='w-full rounded shadow bg-primary-light/5'
									>
										<div
											className='flex items-start w-full gap-16'
										>
											<Avatar
												alt={
													qna.student.profile.fullName
												}
												src={
													qna.student.profile
														.avatarLink
												}
											/>
											<div>
												<Typography className='font-semibold text-primary-main'>
													{
														qna.student.profile
															.fullName
													}
												</Typography>
												<Typography color='text.secondary'>
													{qna.student.email ||
														'emailisnull.edu.vn'}
												</Typography>
											</div>
										</div>
									<ChevronRight />

									</ListItemButton>
									</Tooltip>
								</Paper>
							</motion.div>
						);
					})}
				</div>
			)}
		</motion.div>
	);
};

export default QnaList;
