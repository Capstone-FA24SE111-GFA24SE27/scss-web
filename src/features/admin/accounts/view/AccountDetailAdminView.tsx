import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CounselorAccountAdminView from './CounselorAccountAdminView';
import GenericAccountAdminView from './GenericAccountAdminView';
import StudentAccountAdminView from './StudentAccountAdminView';
import { Heading, NavLinkAdapter, Scrollbar } from '@/shared/components';
import { motion } from 'framer-motion';
import { Avatar, Button, Paper, Typography } from '@mui/material';
import { ArrowBack, Delete } from '@mui/icons-material';
import { useAlertDialog, useConfirmDialog } from '@/shared/hooks';
import { useAppDispatch } from '@shared/store';
import {
	useGetOneAccountQuery,
	usePutBlockAccountByIdMutation,
	usePutUnblockAccountByIdMutation,
} from '../admin-accounts-api';

type Props = {};

const AccountDetailAdminView = () => {
	const { id, role } = useParams();
	const navigate = useNavigate();
	

	let view = null;

	

	switch (role) {
		case 'counselor': {
			view = <CounselorAccountAdminView id={id} />;
			break;
		}
		case 'generic': {
			view = <GenericAccountAdminView id={id} />;
			break;
		}
		case 'student': {
			view = <StudentAccountAdminView id={id} />;
			break;
		}
		default: {
			navigate(-1);
			break;
		}
	}

	return (
		<div className='flex flex-col w-full h-full overflow-hidden'>
			

				{view}
		</div>
	);
};

export default AccountDetailAdminView;
