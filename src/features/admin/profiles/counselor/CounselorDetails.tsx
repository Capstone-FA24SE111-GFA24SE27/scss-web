import { Breadcrumbs } from '@/shared/components';
import { CounselorView } from '@/shared/pages';
import { navigateUp } from '@/shared/utils';
import { Close } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import React from 'react';
import {
	useLoaderData,
	useLocation,
	useNavigate,
	useParams,
} from 'react-router-dom';

type Props = {};

const CounselorDetails = () => {
	const navigate = useNavigate();
	const { id } = useParams();
	const location = useLocation();
	const counselorUrl = navigateUp(location, 1);
	return (
		<div className='relative h-full'>
			{id && (
				<Breadcrumbs
					className='sticky top-0 z-10 w-full p-16 '
					parents={[
						{
							label: 'Counselors',
							url: counselorUrl,
						},
					]}
					currentPage={"Counselor's details"}
				/>
			)}

			<CounselorView
				shouldShowBooking={false}
				className='w-full'
				id={id}
			/>
		</div>
	);
};

export default CounselorDetails;
