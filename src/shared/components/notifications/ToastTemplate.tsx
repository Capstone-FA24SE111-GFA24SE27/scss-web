import { CheckCircle, Close, Error, Warning } from '@mui/icons-material';
import { Card, IconButton, Typography, useTheme } from '@mui/material';
import { convertFieldResponseIntoMuiTextFieldProps } from '@mui/x-date-pickers/internals';
import { SnackbarContent } from 'notistack';
import { ForwardedRef, forwardRef, MouseEvent } from 'react';
import clsx from 'clsx';

type Props = {
	message: string;
	variant: 'success' | 'error' | 'warning';
	onClose: () => void;
};

/**
 * The notification template.
 */
const ToastTemplate = forwardRef(
	(props: Props, ref: ForwardedRef<HTMLDivElement>) => {
		const { message, onClose, variant } = props;
		const theme = useTheme();

		const color = {
			success: '#51b848',
			error: '#f44336',
			warning: '#feaa2e',
		};

        const icon = {
            success: <CheckCircle color={variant} />,
			error: <Error color={variant}/>,
			warning: <Warning color={variant} />,
        }

		const handleClose = (ev: MouseEvent<HTMLButtonElement>) => {
			ev.preventDefault();
			ev.stopPropagation();

			if (onClose) {
				onClose();
			}
		};

		return (
			<SnackbarContent
				className='relative py-4 mx-auto pointer-events-auto w-fit max-w-512'
				ref={ref}
			>
				<Card
					className='relative flex items-center w-full px-12 space-x-8 shadow min-h-48 rounded-16'
					sx={{
						backgroundColor: theme.palette.background.paper,
						color: 'theme.primary',
					}}
					elevation={1}
				>
					<div className='flex items-center justify-between flex-auto '>
						<div className='flex items-center gap-4'>
                            {icon[variant]}
							<Typography
                            color={variant}
								className={clsx(' font-semibold line-clamp-1')}
							>
								{message}
							</Typography>
						</div>

						<IconButton
							disableRipple
							className='p-8'
							color='inherit'
							size='small'
							onClick={handleClose}
						>
							<Close />
						</IconButton>
					</div>
				</Card>
			</SnackbarContent>
		);
	}
);

export default ToastTemplate;
