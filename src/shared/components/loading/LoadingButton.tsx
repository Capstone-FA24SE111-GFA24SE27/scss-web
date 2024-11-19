import { Button, CircularProgress } from '@mui/material';
import React from 'react';

const LoadingButton = (props: {title: string}) => {
    const {title} = props
	return (
		<Button
			disabled
			variant='contained'
			color='secondary'
			sx={{ color: 'white' }}
			startIcon={<CircularProgress color='inherit' />}
		>
			{title}
		</Button>
	);
};

export default LoadingButton;
