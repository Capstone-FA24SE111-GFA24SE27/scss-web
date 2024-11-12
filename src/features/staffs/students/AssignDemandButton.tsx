import React from 'react';
import {  usePostCreateDemandByStudentIdMutation, usePutAssignDemandByDemandIdMutation } from '../demands/demand-api';
import { useAppDispatch } from '@shared/store';
import { NavLinkAdapter } from '@/shared/components';
import { Button } from '@mui/material';
import { Add } from '@mui/icons-material';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

type Props = {
	// studentId?: number | string;
};

const AssignDemandButton = (props: Props) => {
	// const { studentId } = props;
    const location = useLocation()
    const { id } = useParams();
    const navigate = useNavigate()



    const pathSegments = location.pathname.split('/').filter(Boolean);
    const isStudentPath = pathSegments.length >= 2 &&
                        pathSegments[pathSegments.length - 2] === 'student' &&
                        pathSegments[pathSegments.length - 1] === id;

	// const [createDemand] = usePostCreateDemandByStudentIdMutation();

	const handleCreate = () => {
        if(isStudentPath ) {
            // createDemand(id);
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
			Assign a Counselor
		</Button>
	);
};

export default AssignDemandButton;
