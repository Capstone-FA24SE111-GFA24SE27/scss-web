import { useAppDispatch } from '@shared/store';
import React, { ReactElement } from 'react';
import { closeDialog, openDialog } from '../../components/dialog/dialog-slice';
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
import InfoIcon from '@mui/icons-material/Info';
import { ThunkDispatch } from '@reduxjs/toolkit';

type Props = {
	title?: string;
	confirmButtonTitle?: string;
	color?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
	dispatch: ThunkDispatch<any, any, any>;
	confirmFunction?: () => void; // Optional confirm function
};

const useAlertDialog = (props: Props) => {
	const {
		title = 'Alert',
		confirmButtonTitle = 'OK',
		color = 'success',
		dispatch,
		confirmFunction,
	} = props;

	const handleClose = () => {
		dispatch(closeDialog());
		if (confirmFunction) {
			confirmFunction(); // Call the confirm function if provided
		}
	};

	const customChildren = (
		<Alert
			/* 	@ts-ignore */
			severity={color}
			icon={!color ? <InfoIcon /> : ''}
			className='p-16 w-full flex'
		>
			<AlertTitle className='font-semibold px-16 text-xl w-full min-w-xs'>{title}</AlertTitle>
			<Box className='w-full flex justify-end mt-32'>
				<Button
					onClick={handleClose}
					autoFocus
					color={color}
					size='large'
				>
					{confirmButtonTitle}
				</Button>
			</Box>
		</Alert>
	) as ReactElement;

	return dispatch(openDialog({ children: customChildren }));
};

export default useAlertDialog;
