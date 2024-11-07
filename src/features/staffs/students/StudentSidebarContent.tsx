import { Close } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import React from 'react'
import { Outlet, useNavigate } from 'react-router-dom';


const StudentSidebarContent = () => {
    const navigate = useNavigate();
	return (
		<div className='flex flex-col h-full'>
			<IconButton
				className='absolute top-0 right-0 z-10 m-16 bg-gray-800/30 '
				onClick={() => navigate(-1)}
				size='large'
			>
				<Close className='text-white'/>
			</IconButton>

			<Outlet />
		</div>
	);
}

export default StudentSidebarContent