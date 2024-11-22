import { useAppSelector } from '@shared/store';
import { useAppDispatch } from '@shared/store';
import React, { ReactElement, ReactNode, useEffect } from 'react';
import { closeDialog, openDialog, selectDialogProps } from '../../components/dialog/dialog-slice';
import {
	Alert,
	AlertTitle,
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Typography,
} from '@mui/material';
import { ThunkDispatch } from '@reduxjs/toolkit';

type Props = {
	title?: string;
	confirmButtonTitle?: string;
	color?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
	dispatch: ThunkDispatch<any, any, any>;
};

const useAlertDialog = (props: Props) => {
	const {
		title = '',
		confirmButtonTitle = 'OK',
		color = 'primary', // Default color to 'success'
		dispatch,
	} = props;

	const handleClose = () => {
		dispatch(closeDialog());	
	};

	const customChildren = (
		<div className='flex flex-col bg-background-paper'>
			{/* 	@ts-ignore */}
			<Alert severity={color} className='p-8'>
				<AlertTitle className='font-semibold px-16 text-lg	'>{title}</AlertTitle>
				<Box className='w-full flex justify-end mt-16'>
					<Button onClick={handleClose} autoFocus color={color} >
						{confirmButtonTitle}
					</Button>
				</Box>
			</Alert>
		</div>
	) as ReactElement;

	return dispatch(openDialog({ children: customChildren }));
};

export default useAlertDialog;
