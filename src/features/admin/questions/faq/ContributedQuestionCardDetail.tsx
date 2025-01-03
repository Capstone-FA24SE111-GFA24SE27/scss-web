import { closeDialog, ExpandableContent, UserListItem } from '@/shared/components';
import { ContributedQuestionAdmin } from '@/shared/types';
import { Box, Chip, Divider, Typography } from '@mui/material';
import { useAppDispatch } from '@shared/store';
import React from 'react';

type Props = {
	question: ContributedQuestionAdmin;
};

const ContributedQuestionCardDetail = (props: Props) => {
	const { question } = props;
	const dispatch = useAppDispatch();

	if (!question) {
		dispatch(closeDialog());
	}

	return (
		<Box className={`p-36 flex flex-col gap-16 max-w-md mt-12`}>
			<div className='flex flex-col gap-16 pb-8'>
				<Typography className='font-extrabold leading-none tracking-tight text-20 md:text-24'>
					Question Details
				</Typography>
				<div className='flex items-center gap-8'>
					{question.status === 'HIDE' ? (
						<Chip
							label={'HIDDEN'}
							color='warning'
							className='items-center font-semibold leading-none'
							size='small'
						/>
					) : (
						<Chip
							label={'VISIBLE'}
							color='success'
							className='items-center font-semibold leading-none'
							size='small'
						/>
					)}

					<Chip
						label={question.category.name}
						className='items-center font-semibold leading-none'
						size='small'
					/>
					<Chip
						label={question.category.type}
						className='items-center font-semibold leading-none'
						size='small'
					/>
				</div>
			</div>

			<Divider />

			<div className='flex flex-col gap-32'>
				<div className='flex flex-col flex-1 gap-8 rounded'>
					<Typography className='text-lg font-semibold text-primary-light'>
						Counselor
					</Typography>
					<div className='flex justify-start gap-16 rounded'>
						<UserListItem
							fullName={question?.counselor.profile.fullName}
							avatarLink={question?.counselor.profile.avatarLink}
							phoneNumber={
								question?.counselor.profile.phoneNumber
							}
							email={question?.counselor.email}
						/>
					</div>
				</div>
			</div>

			<Divider />

			<div className='flex flex-col gap-8'>
				<Typography className='text-lg font-semibold text-primary-light'>
					Question Title:
				</Typography>
				<Typography>{question.title}</Typography>
			</div>

			<Divider />

			<div className='flex flex-col gap-8'>
				<Typography className='text-lg font-semibold text-primary-light'>
					Question:
				</Typography>
				<Typography>{question.question}</Typography>
			</div>

			<div className='flex flex-col gap-8'>
				<Typography className='text-lg font-semibold text-primary-light'>
					Answer:
				</Typography>
				<ExpandableContent>{question.answer}</ExpandableContent>
			</div>
		</Box>
	);
};

export default ContributedQuestionCardDetail;
