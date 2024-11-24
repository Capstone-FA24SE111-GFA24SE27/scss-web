import React from 'react';
import { useAppDispatch } from '@shared/store';
import { NavLinkAdapter } from '@/shared/components';
import { Button } from '@mui/material';
import { Add, Remove } from '@mui/icons-material';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { usePutExcludeStudentProblemTagsMutation } from '@/shared/pages/student-list/student-list-api';
import useAlertDialog from '@/shared/hooks/form/useAlertDialog';

type Props = {
	// studentId?: number | string;
};

const ExcludeStudentButton = (props: Props) => {
	// const { studentId } = props;
    const location = useLocation()
    const { id } = useParams();
    const navigate = useNavigate()
	const dispatch = useAppDispatch()


    const pathSegments = location.pathname.split('/').filter(Boolean);
    const isStudentPath = pathSegments.length >= 2 &&
                        pathSegments[pathSegments.length - 2] === 'student' &&
                        pathSegments[pathSegments.length - 1] === id;

	const [exclude] = usePutExcludeStudentProblemTagsMutation();

	const handleExclude = async () => {
        if(isStudentPath ) {
            const result = await exclude(id);
			console.log(result)
			if (result.data.status === 200) {
				useAlertDialog({ title: 'Student excluded successfully', confirmButtonTitle: 'Ok', dispatch })
				navigate(-1)
			}
        }
	};

	return (
		<Button
			variant='contained'
			color='primary'
			sx={{ color: 'white' }}
			component={Button}
			onClick={handleExclude}
			startIcon={<Remove />}
		>
			Exclude Current Behaviour
		</Button>
	);
};

export default ExcludeStudentButton;
