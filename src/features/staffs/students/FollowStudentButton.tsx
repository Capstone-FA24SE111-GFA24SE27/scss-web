import React from 'react';
import { Add } from '@mui/icons-material';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import useAlertDialog from '@/shared/hooks/form/useAlertDialog';
import {
	useGetStudentFollowStatusQuery,
	usePostFollowStudentsStaffMutation,
} from './followed-list/staff-followed-student-api';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import { Button, Typography } from '@mui/material';
import { LoadingButton, UserLabel } from '@/shared/components';

type Props = {
	// studentId?: number | string;
};

const FollowStudentButton = (props: Props) => {
	// const { studentId } = props;
	const location = useLocation();
	const { id } = useParams();
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const pathSegments = location.pathname.split('/').filter(Boolean);
	const isStudentPath =
		pathSegments.length >= 2 &&
		pathSegments[pathSegments.length - 2] === 'student' &&
		pathSegments[pathSegments.length - 1] === id;

	const [followStudent] = usePostFollowStudentsStaffMutation();
	const { data: studentStatus, isLoading } = useGetStudentFollowStatusQuery(
		id,
		{ skip: !id }
	);

	const handleFollow = async () => {
		if (isStudentPath) {
			const result = await followStudent(id);
			console.log(result);
			if (result.error.data) {
				useAlertDialog({
					title: result.error.data,
					confirmButtonTitle: 'Ok',
					dispatch,
				});
				navigate(-1);
			}
		}
	};

	console.log(studentStatus);

	if (isLoading) {
		return <LoadingButton title='Follow Student' />;
	}

	if (studentStatus?.content.followed) {
		return (
			<div className='flex flex-wrap gap-8'>
				<Typography className='font-semibold' color='textDisabled'>
					Currently followed by:{' '}
				</Typography>
				{studentStatus.content.your ? (
					<Typography className='font-semibold' color='info'>
						You
					</Typography>
				) : (
					<UserLabel
						profile={studentStatus.content.supportStaffDTO.profile}
					/>
				)}
			</div>
		);
	}

	return (
		<Button
			variant='contained'
			color='secondary'
			sx={{ color: 'white' }}
			component={Button}
			onClick={handleFollow}
			startIcon={<BookmarkIcon />}
		>
			Follow Student
		</Button>
	);
};

export default FollowStudentButton;
