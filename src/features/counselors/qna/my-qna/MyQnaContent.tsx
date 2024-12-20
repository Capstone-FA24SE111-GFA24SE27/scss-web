import {
	CheckboxField,
	ContentLoading,
	FilterTabs,
	Heading,
	NavLinkAdapter,
	Pagination,
	SearchField,
	SelectField,
} from '@/shared/components';
import { motion } from 'framer-motion';
import { ChangeEvent, SyntheticEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
	counselorQnaApi,
	useAnswerQuestionMutation,
	useGetMyCounselorQuestionsQuery,
} from '../qna-api';
import MyQnaItem from './MyQnaItem';
import {
	useGetAcademicTopicsQuery,
	useGetNonAcademicTopicsQuery,
} from '@/shared/services';
import { selectAccount, useAppSelector } from '@shared/store';
import { extractCounselingTypeFromRole } from '@/shared/utils';
import { Typography } from '@mui/material';
import { useSocket } from '@/shared/context';
import { QuestionCardStatus } from '@/shared/types';

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

const MyQnaContent = () => {
	const account = useAppSelector(selectAccount);

	const [openAnswers, setOpenAnswers] = useState(true);

	const [expanded, setExpanded] = useState<number | boolean>(false);

	const toggleAccordion =
		(panel: number) => (_: SyntheticEvent, _expanded: boolean) => {
			setExpanded(_expanded ? panel : false);
		};
	const navigate = useNavigate();

	// const [answer, setAnswer] = useState('')

	const [searchTerm, setSearchTerm] = useState('');

	const [tabValue, setTabValue] = useState(0);

	const [isClosed, setIsClosed] = useState(false);

	const [page, setPage] = useState(1);

	const handleSearch = (searchTerm: string) => {
		setSearchTerm(searchTerm);
	};

	

	const socket = useSocket();

	const statusTabs = [
		{ label: 'All', value: undefined },
		{ label: 'Verified', value: 'VERIFIED' },
		{ label: 'Flagged', value: 'FLAGGED' },
		{ label: 'Rejected', value: 'REJECTED' },
	];

	const {
		data: qnaData,
		isLoading,
		refetch,
	} = useGetMyCounselorQuestionsQuery({
		isClosed: isClosed || undefined,
		status: statusTabs[tabValue].value as QuestionCardStatus || undefined,
		keyword: searchTerm,
		page: page,
	});
	const qnaList = qnaData?.content?.data || [];

	console.log(qnaData)

	useEffect(() => {
		if (socket && account) {
			const cb = (data) => {
				console.log('asdasdw', data);
				if (data) {
					refetch();
					counselorQnaApi.util.invalidateTags(['qna']);
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

	// const [answerQuestion, { isLoading: submitingAnswer }] = useAnswerQuestionMutation()

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

	// const topicOptions = account?.role ?
	//   extractCounselingTypeFromRole(account?.role) === 'ACADEMIC' ? academicTopicOptions : nonAcademicTopicOptions
	//   : []

	// const handleSelectTopic = (event: React.ChangeEvent<HTMLInputElement>) => {
	//   setSelectedTopic(event.target.value);
	// };

	const handleCheckboxClose = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		setIsClosed(event.target.checked);
	};

	// const handleSearchStudentCode = (searchStudentCode: string) => {
	//   setSearchStudentCode(searchStudentCode);
	// };

	const handlePageChange = (event: ChangeEvent<unknown>, value: number) => {
		setPage(value);
	};

	const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
		setTabValue(newValue);
	};

	if (isLoading) {
		return <ContentLoading />;
	}

	return (
		<div className='container w-full h-full max-w-xl mx-auto'>
			<motion.div
				variants={container}
				initial='hidden'
				animate='show'
				className='w-full p-32 space-y-16'
			>
				<div className='flex gap-16'>
					<SearchField
						label='Question keyword'
						placeholder='Enter question keyword'
						onSearch={handleSearch}
						className='w-xs'
					/>
					{/* <SelectField
            label="Topic"
            options={topicOptions}
            value={selectedTopic}
            onChange={handleSelectTopic}
            showClearOptions
            className='w-200'
          /> */}
					{/* <SearchField
            onSearch={handleSearchStudentCode}
            label='Student code'
            placeholder='SE1001'
            className='!w-192'
          /> */}
					
				</div>
        <div>
						<div className='flex justify-between'>
							<FilterTabs
								tabs={statusTabs}
								tabValue={tabValue}
								onChangeTab={handleChangeTab}
							/>
							<div className='flex gap-16'>
								{/* <CheckboxField
							label='Is Taken'
							checked={isTaken}
							onChange={handleCheckboxTaken}
						/> */}
								<CheckboxField
									label='Is Close'
									checked={isClosed}
									onChange={handleCheckboxClose}
								/>
							</div>
						</div>
					</div>

				<div className='space-y-16'>
					{!qnaList.length ? (
						<div className='p-32 text-center'>
							<Typography
								variant='h5'
								className='text-text-disabled'
							>
								No questions found
							</Typography>
						</div>
					) : (
						qnaList.map((qna) => (
							<MyQnaItem key={qna.id} qna={qna} />
						))
					)}
				</div>
				<Pagination
					page={page}
					count={qnaData?.content.totalPages}
					handleChange={handlePageChange}
				/>
			</motion.div>
		</div>
	);
};

export default MyQnaContent;
