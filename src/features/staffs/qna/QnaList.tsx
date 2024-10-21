import React, { ChangeEvent, ChangeEventHandler, SyntheticEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import useDebounce from '@/shared/hooks/useDebounce';
import { Question } from '@/shared/types';

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
	const debounceSearchKeyword = useDebounce(searchKeyword, 500);
	const [page, setPage] = useState<number>(1);
	const [type, setType] = useState<TypeOfQuestionType>('');
	const debounceType = useDebounce(type, 300);

	const [reviewQuestion] = usePostReviewQuestionStatusMutation();
	const [flagQuestion] = usePostFlagQuestionStatusMutation();

	const navigate = useNavigate();

	const { data: qnaData } = useGetQuestionsQuery({
		keyword: debounceSearchKeyword,
		page: page,
		type: debounceType
	});
	const qnaList = qnaData?.content?.data || [];

	const statusColor = {
		PENDING: 'warning',
		VERIFIED: 'success',
		FLAGGED: 'error',
		REJECTED: 'error',
	};

	useEffect(() => {
		console.log(qnaData);
	}, [qnaData]);

	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
	const [openId, setOpenId] = useState(null);
	const [selectedQna, setSelectedQna] = useState(null);

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
		reviewQuestion({ id: selectedQna.id, status: 'VERIFIED' });
	};

	const handleReject = () => {
		reviewQuestion({ id: selectedQna.id, status: 'REJECTED' });
	};

	const handleFlag = () => {
		flagQuestion({ id: selectedQna.id });
	};

	const handleTypeSelect = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		setType(event.target.value as TypeOfQuestionType)
	}

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
					defaultValue={''}
					className='w-200 '
					onChange={handleTypeSelect}
					slotProps={{
						inputLabel: {
							shrink: true,
						},
					}}
				>
					<MenuItem value=''>All</MenuItem>
					<MenuItem value='ACADEMIC'>Academic</MenuItem>
					<MenuItem value='NON-ACADEMIC'>Non-Academic</MenuItem>
				</TextField>
			</div>
			{qnaList?.length > 0 && (
				<div className='space-y-16'>
					{qnaList.map((qna) => {
						return (
							<motion.div variants={item} key={qna.id}>
								<Paper className='overflow-hidden shadow p-12 gap-8 flex flex-col'>
									<div className='relative flex items-center '>
										<div className='flex flex-col gap-8 w-full'>
											<div className='flex  items-center justify-between w-full '>
												<div className='gap-8 flex'>
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
															<Visibility color='info'/>
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
									{/* <Tooltip
										title={`View ${qna.student.profile.fullName}'s profile`}
									> */}
									<ListItemButton
										// component={NavLinkAdapter}
										// to={handleLocalNavigate(`student/${qna.student.profile.id}`)}
										className='w-full rounded shadow bg-primary-light/5'
									>
										<div
											// onClick={handleNavClicked}
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
									</ListItemButton>
									{/* </Tooltip> */}
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
