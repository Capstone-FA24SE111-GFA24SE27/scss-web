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

import useDebounceValue from '@/shared/hooks/useDebounceValue';
import { Question } from '@/shared/types';

import { useQuestionsSocketListener } from '@/shared/context';
import { selectAccount, useAppSelector } from '@shared/store';
import QnaItem from './QnaItem';

const container = {
	show: {
		transition: {
			staggerChildren: 0.04,
		},
	},
};



const QnaList = () => {
	const [searchKeyword, setSearchKeyword] = useState('');
	const debounceSearchKeyword = useDebounceValue(searchKeyword, 500);
	const [page, setPage] = useState<number>(1);
	const [type, setType] = useState<TypeOfQuestionType>('');
	const debounceType = useDebounceValue(type, 300);

	
	const account = useAppSelector(selectAccount)


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
			<div className='flex w-full gap-16'>
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
			{qnaList?.length > 0 ? (
				<div className='space-y-16'>
					{qnaList.map((qna) => {
						return (
							<QnaItem key={qna.id} qna={qna} />
						);
					})}
				</div>
			) : (
				<div className='flex items-center justify-center w-full h-full'>
					<Typography color='textDisabled' className='text-2xl '>There are currently no questions</Typography>
				</div>
			)}
		</motion.div>
	);
};

export default QnaList;
