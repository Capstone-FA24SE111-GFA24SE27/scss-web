import React from 'react';
import { usePostCreateDemandByStudentIdMutation } from './demands/demand-api';
import { useAppDispatch } from '@shared/store';
import { NavLinkAdapter, openDialog } from '@/shared/components';
import { Button } from '@mui/material';
import { Add } from '@mui/icons-material';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import useAlertDialog from '@/shared/hooks/form/useAlertDialog';

type Props = {
	// studentId?: number | string;
};

const CreateDemandButton = (props: Props) => {
	// const { studentId } = props;
    const location = useLocation()
    const { id } = useParams();
	const dispatch = useDispatch()
	const navigate = useNavigate()

    const pathSegments = location.pathname.split('/').filter(Boolean);
    const isStudentPath = pathSegments.length >= 2 &&
                        pathSegments[pathSegments.length - 2] === 'student' &&
                        pathSegments[pathSegments.length - 1] === id;

	const [createDemand] = usePostCreateDemandByStudentIdMutation();

	const handleCreate = async () => {
        if(isStudentPath) {

            const result = await createDemand(id);
			if(result.data.status === 200){
				useAlertDialog({title: 'Demand created successfully', confirmButtonTitle: 'Ok', dispatch})
				navigate(-1)
			}
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
