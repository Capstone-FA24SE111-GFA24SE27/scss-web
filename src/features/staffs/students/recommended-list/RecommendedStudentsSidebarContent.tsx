import { Close } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import React from 'react'
import { Outlet, useNavigate } from 'react-router-dom';
type Props = {}

const RecommendedStudentsSidebarContent = (props: Props) => {
    const navigate = useNavigate();
	return (
		<div className='relative flex-grow-0 h-screen max-h-screen'>
			<IconButton
				className='absolute top-0 right-0 z-10 m-16'
				onClick={() => navigate(-1)}
				size='large'
			>
				<Close />
			</IconButton>

			<Outlet />
		</div>
	);
}

export default RecommendedStudentsSidebarContent