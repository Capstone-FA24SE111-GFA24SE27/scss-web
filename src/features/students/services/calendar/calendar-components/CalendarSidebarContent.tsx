import { NavLinkAdapter } from '@/shared/components';
import { Close } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

type Props = {};

const CalendarSidebarContent = (props: Props) => {

    const navigate = useNavigate()
	return (
		<div className='flex flex-col flex-auto max-w-full w-md z-10'>
			<IconButton
				className='absolute top-0 right-0 my-16 mx-32 z-10'
				
				size='large'
                onClick={()=>navigate(-1)}
			>
				<Close />
			</IconButton>

			<Outlet />
		</div>
	);
};

export default CalendarSidebarContent;
