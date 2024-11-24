import { useAppSelector } from '@shared/store';
import { useAppDispatch } from '@shared/store';
import React, { ReactElement, ReactNode, useEffect } from 'react';
import { closeDialog, openDialog, selectDialogProps } from '../../components/dialog/dialog-slice';
import {
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
	content?: ReactNode;
	cancelButtonTitle?: string;
	confirmButtonTitle?: string;
	confirmButtonFucntion: any;
	dispatch: ThunkDispatch<any, any, any>
};

const useConfirmDialog = (props: Props) => {
	const {
		title = 'Are you sure?',
		content = '',
		cancelButtonTitle = 'Cancel',
		confirmButtonTitle = 'Confirm',
		confirmButtonFucntion,
		dispatch
	} = props;


	const handleClose = () => {
		dispatch(closeDialog());
	};

	const handleConfirm = () => {
		if (confirmButtonFucntion) {
			confirmButtonFucntion();
		}
		handleClose();
	};

	const customChildren = (
		<div className='flex flex-col bg-background-paper p-4'>
			<DialogTitle id='alert-dialog-title'>{title}</DialogTitle>
			<DialogContent >
				{content}
			</DialogContent>
			<DialogActions>
				<Button onClick={handleClose} color='primary'>{cancelButtonTitle}</Button>
				<Button onClick={handleConfirm} autoFocus color='secondary' variant='contained'>
					{confirmButtonTitle}
				</Button>
			</DialogActions>
		</div>
	) as ReactElement;

	return dispatch(openDialog({ children: customChildren }));
};

export default useConfirmDialog;
