import Dialog from '@mui/material/Dialog';
import { useAppDispatch, useAppSelector } from '@shared/store';
import { closeDialog, selectDialogProps } from './dialog-slice';

/**
 * FuseDialog component
 * This component renders a material UI ```Dialog``` component
 * with properties pulled from the redux store
 */
function FuseDialog() {
	const dispatch = useAppDispatch();
	const options = useAppSelector(selectDialogProps);

	return (
		<Dialog
			onClose={() => dispatch(closeDialog())}
			aria-labelledby="fuse-dialog-title"
			classes={{
				paper: 'rounded'
			}}
			{...options}
		/>
	);
}

export default FuseDialog;
