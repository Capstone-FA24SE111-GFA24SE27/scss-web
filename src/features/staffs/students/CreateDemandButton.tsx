import React from 'react';
import { usePostCreateDemandByStudentIdMutation } from '../demands/demand-api';
import { useAppDispatch } from '@shared/store';
import { NavLinkAdapter } from '@/shared/components';
import { Button } from '@mui/material';
import { Add } from '@mui/icons-material';
import { useLocation, useParams } from 'react-router-dom';

type Props = {
	// studentId?: number | string;
};

const CreateDemandButton = (props: Props) => {
	// const { studentId } = props;
    const location = useLocation()
    const { id } = useParams();

    const pathSegments = location.pathname.split('/').filter(Boolean);
    const isStudentPath = pathSegments.length >= 2 &&
                        pathSegments[pathSegments.length - 2] === 'student' &&
                        pathSegments[pathSegments.length - 1] === id;

	const [createDemand] = usePostCreateDemandByStudentIdMutation();

	const handleCreate = () => {
        if(isStudentPath) {

            createDemand(id);
        }
	};

	return (
		<Button
			variant='contained'
			color='secondary'
			sx={{ color: 'white' }}
			component={Button}
			onClick={handleCreate}
			startIcon={<Add />}
		>
			Create a demand
		</Button>
	);
};

export default CreateDemandButton;
