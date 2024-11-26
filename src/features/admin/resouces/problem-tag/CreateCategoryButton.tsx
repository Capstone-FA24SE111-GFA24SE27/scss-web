import { NavLinkAdapter } from '@/shared/components';
import { Add } from '@mui/icons-material';
import { Button } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';

type Props = {};

const CreateCategoryButton = (props: Props) => {
	const navigate = useNavigate();

	return (
		<Button
			variant='contained'
			color='primary'
			sx={{ color: 'white' }}
			component={NavLinkAdapter}
			to={'category/create'}
			startIcon={<Add />}
		>
			Create Category
		</Button>
	);
};

export default CreateCategoryButton;