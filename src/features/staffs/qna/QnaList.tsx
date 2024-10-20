import React, { SyntheticEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGetQuestionQuery, useGetQuestionsQuery } from './qna-api';
import {
	Button,
	Chip,
	Menu,
	MenuItem,
	Paper,
	TextField,
	Typography,
} from '@mui/material';
import {
	ChatBubbleOutline,
	CheckCircleOutlineOutlined,
	ExpandMore,
	HelpOutlineOutlined,
	ThumbDownOutlined,
	ThumbUpOutlined,
} from '@mui/icons-material';
import useDebounce from '@/shared/hooks/useDebounce';
import { Question } from '@/shared/types';

type Props = {};

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

const QnaList = (props: Props) => {
	const [searchKeyword, setSearchKeyword] = useState('');
	const debounceSearchKeyword = useDebounce(searchKeyword, 500);
	const [page, setPage] = useState(1);

	const navigate = useNavigate();

	const { data: qnaData } = useGetQuestionsQuery({
		keyword: debounceSearchKeyword,
		page: page,
	});
	const qnaList = qnaData?.content?.data || [];

	const statusColor = {
		PENDING: 'default',
		VERIFIED: 'success',
		FLAGGED: 'warning',
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
					className='w-200'
					slotProps={{
						inputLabel: {
							shrink: true,
						},
					}}
				>
					<MenuItem value='ALL'>All</MenuItem>
					<MenuItem value='ACADEMIC'>Academic</MenuItem>
					<MenuItem value='NON-ACADEMIC'>Non-Academic</MenuItem>
				</TextField>
			</div>
			{qnaList?.length > 0 && (
				<div className='space-y-16'>
					{qnaList.map((qna) => {
						return (
							<motion.div variants={item} key={qna.id}>
								<Paper className='overflow-hidden shadow'>
									<div className='relative flex items-center justify-between p-12'>
										<div className=''>
											<div className='flex flex-col gap-8'>
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
												className='w-[14rem] gap-8'
												onClick={() => {
													navigate(
														`${qna.id}/view`
													);
													handleClose();
												}}
											>
												View
											</MenuItem>
											<MenuItem
												onClick={handleClose}
												className='w-[14rem] gap-8'
											>
												Verify
											</MenuItem>
											<MenuItem
												onClick={handleClose}
												className='w-[14rem] gap-8'
											>
												Reject
											</MenuItem>
										</Menu>
									</div>
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
