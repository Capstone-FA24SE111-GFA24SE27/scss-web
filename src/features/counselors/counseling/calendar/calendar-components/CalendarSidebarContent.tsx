import { NavLinkAdapter } from '@/shared/components';
import { Close } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

type Props = {};

const CalendarSidebarContent = (props: Props) => {

    const navigate = useNavigate()
	return (
		<div className='z-10 flex flex-col flex-auto max-w-full w-fit'>
			<IconButton
				className='absolute top-0 right-0 m-16 z-999'
				
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
