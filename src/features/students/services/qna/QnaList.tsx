import {
	CheckboxField,
	ContentLoading,
	FilterTabs,
	Pagination,
	SearchField,
	SelectField,
} from '@/shared/components';

import {
	FormControlLabel,
	Switch,
	Typography,
} from '@mui/material';
import { motion } from 'framer-motion';
import { ChangeEvent, SyntheticEvent, useEffect, useState } from 'react';
import {
	studentQnasApi,
	useGetStudentQuestionsQuery,
} from './qna-api';
import { selectAccount, useAppDispatch, useAppSelector } from '@shared/store';
import {
	useGetAcademicTopicsQuery,
	useGetNonAcademicTopicsQuery,
} from '@/shared/services';
import { Question } from '@/shared/types';
import { useSocket } from '@/shared/context';
import QnaItem from './QnaItem';
import { addChatListener, selectChatListeners, selectPassiveChatCallback } from '@/shared/components/chat';

const container = {
	show: {
		transition: {
			staggerChildren: 0.04,
		},
	},
};

const QnaList = () => {
	const [openAnswers, setOpenAnswers] = useState(false);

	const [expanded, setExpanded] = useState<number | boolean>(false);

	const [tabValue, setTabValue] = useState(0);

	const [searchTerm, setSearchTerm] = useState('');

	const [selectedType, setSelectedType] = useState('');

	const [selectedTopic, setSelectedTopic] = useState('');

	const [isClosed, setIsClosed] = useState(false);

	const [isTaken, setIsTaken] = useState(false);

	const [page, setPage] = useState(1);

	const account = useAppSelector(selectAccount);
	const socket = useSocket();
	// const dispatch = useAppDispatch()
	// const chatListeners = useAppSelector(selectChatListeners)
	// const chatPassiveCallback = useAppSelector(selectPassiveChatCallback)


	const toggleAccordion =
		(panel: number) => (_: SyntheticEvent, _expanded: boolean) => {
			setExpanded(_expanded ? panel : false);
		};

	const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
		setTabValue(newValue);
	};

	const handleSearch = (searchTerm: string) => {
		setSearchTerm(searchTerm);
	};

	const handlePageChange = (event: ChangeEvent<unknown>, value: number) => {
		setPage(value);
	};

	const statusTabs = [
		{ label: 'All', value: '' },
		{ label: 'Verified', value: 'VERIFIED' },
		{ label: 'Pending', value: 'PENDING' },
		{ label: 'Flagged', value: 'FLAGGED' },
		{ label: 'Rejected', value: 'REJECTED' },
	];


	const handleSelectType = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSelectedType(event.target.value);
		setSelectedTopic('');
	};

	const typeOptions = [
		{ label: 'All', value: '' },
		{ label: 'Academic', value: 'ACADEMIC' },
		{ label: 'Non-Academic', value: 'NON_ACADEMIC' },
	];

	const { data: academicTopicsData } = useGetAcademicTopicsQuery();
	const { data: nonacademicTopicsData } = useGetNonAcademicTopicsQuery();
	const academicTopics = academicTopicsData?.content;
	const nonAcademicTopics = nonacademicTopicsData?.content;

	const academicTopicOptions = academicTopics?.map((topic) => ({
		label: topic.name,
		value: topic.id,
	}));

	const nonAcademicTopicOptions = nonAcademicTopics?.map((topic) => ({
		label: topic.name,
		value: topic.id,
	}));

	const topicOptions =
		selectedType == 'ACADEMIC'
			? academicTopicOptions
			: nonAcademicTopicOptions || [];

	const handleSelectTopic = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSelectedTopic(event.target.value);
	};

	const handleCheckboxClose = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		setIsClosed(event.target.checked);
	};

	const handleCheckboxTaken = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		setIsTaken(event.target.checked);
	};

	const {
		data: qnaData,
		refetch,
		isLoading,
	} = useGetStudentQuestionsQuery({
		status: statusTabs[tabValue].value,
		keyword: searchTerm,
		type: selectedType,
		topicId: selectedTopic,
		isClosed: isClosed || '',
		isTaken: isTaken || '',
		page: page,
	});
	const qnaList = qnaData?.content?.data || ([] as Question[]);

	

	

	useEffect(() => {
		refetch();
	}, []);

	useEffect(() => {
		if (socket && account) {
			const cb = (data) => {
				console.log('qna socket receive data' , data);
				if (data) {
					refetch()
					studentQnasApi.util.invalidateTags(['qna'])
				}
			};

			const id = account.profile.id;
			socket.on(`/user/${id}/question`, cb);
			console.log(`/user/${id}/question`, socket);
			return () => {
				socket.off(`/user/${id}/question`);
			};
		}
	}, [socket, account]);

	// useEffect(()=>{
	// 	if(qnaList && qnaList.length > 0){
	// 		qnaList.forEach((item) => {
	// 			if(item.chatSession){
	// 				if(!chatListeners.has(item.chatSession.id)){
	// 					socket.on()
	// 					dispatch(addChatListener(item.chatSession.id))
	// 				}
	// 			}
	// 		})
	// 	}
	// },[qnaList])

	if (isLoading) {
		return <ContentLoading />;
	}

	return (
		<motion.div
			variants={container}
			initial='hidden'
			animate='show'
			className='w-full p-32 space-y-16'
		>
			<div className='flex gap-16'>
				<SearchField onSearch={handleSearch} className='w-xs' />
				<SelectField
					label='Type'
					options={typeOptions}
					value={selectedType}
					onChange={handleSelectType}
					className='w-144'
				/>
				{/* <SelectField
					disabled={!selectedType}
					label='Topic'
					options={topicOptions}
					value={selectedTopic}
					onChange={handleSelectTopic}
					className='w-200'
				/> */}
				<div className='flex justify-end flex-1 w-full'>
					<FormControlLabel
						label='Open Answers'
						control={
							<Switch
								onChange={(ev) => {
									setOpenAnswers(ev.target.checked);
								}}
								checked={openAnswers}
								name='hideCompleted'
							/>
						}
					/>
				</div>
			</div>
			<div>
				<div className='flex justify-between'>
					<FilterTabs
						tabs={statusTabs}
						tabValue={tabValue}
						onChangeTab={handleChangeTab}
					/>
					<div className='flex gap-16'>
						<CheckboxField
							label='Is Taken'
							checked={isTaken}
							onChange={handleCheckboxTaken}
						/>
						<CheckboxField
							label='Is Close'
							checked={isClosed}
							onChange={handleCheckboxClose}
						/>
					</div>
				</div>
			</div>

			<div className='space-y-16'>
				{!qnaList?.length ? (
					<Typography variant='h5' color='textSecondary'>
						No questions found.
					</Typography>
				) : (
					qnaList.map((qna) => {
						return (
							<QnaItem key={qna.id} qna={qna} expanded={expanded} openAnswers={openAnswers} toggleAccordion={toggleAccordion} />
						)
					})
				)}
				<Pagination
					page={page}
					count={qnaData?.content.totalPages}
					handleChange={handlePageChange}
				/>
			</div>
		</motion.div>
	);
};

export default QnaList;
