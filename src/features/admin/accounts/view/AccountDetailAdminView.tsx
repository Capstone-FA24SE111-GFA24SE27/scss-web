import React from 'react';
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
	const dispatch = useAppDispatch();

	let view = null;

	const {
		data: counselorAccountData,
		isLoading: isLoadingAccount,
		refetch,
	} = useGetOneAccountQuery({ id }, { skip: !id });

	const counselorAccount = counselorAccountData?.content;

	const [blockAccountById] = usePutBlockAccountByIdMutation();
	const [unblockAccountById] = usePutUnblockAccountByIdMutation();

	const handleBlockAccount = () => {
		console.log(id);
		useConfirmDialog({
			dispatch,
			confirmButtonFunction: () => {
				if (id) {
					blockAccountById({ id, role: counselorAccount.role })
						.unwrap()
						.then((result) => {
							if (result) {
								useAlertDialog({
									dispatch,
									title: result.message,
								});
							}
						})
						.catch((err) => console.log(err))
						.finally(() => {
							refetch();
						});
				}
			},
			title: 'Are you sure you want to block this account?',
		});
	};

	const handleUnblockAccount = () => {
		console.log(id);
		useConfirmDialog({
			dispatch,
			confirmButtonFunction: () => {
				if (id) {
					unblockAccountById({ id, role: counselorAccount.role })
						.unwrap()
						.then((result) => {
							if (result) {
								useAlertDialog({
									dispatch,
									title: result.message,
								});
							}
						})
						.catch((err) => console.log(err))
						.finally(() => {
							refetch();
						});
				}
			},
			title: 'Are you sure you want to unblock this account?',
		});
	};

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
			<div className='flex flex-col p-32 pb-0 '>
				<motion.div
					initial={{ x: 20, opacity: 0 }}
					animate={{ x: 0, opacity: 1, transition: { delay: 0.3 } }}
				>
					<Button
						className='flex items-center w-fit'
						component={NavLinkAdapter}
						role='button'
						to='/accounts/table'
						color='inherit'
					>
						<ArrowBack />
						<span className='flex mx-4 font-medium'>Accounts</span>
					</Button>
				</motion.div>
			</div>
			<div className='flex items-center w-full gap-16 p-32 py-16'>
				<div className='flex items-center flex-1 max-w-full'>
					<motion.div
						className='hidden sm:flex'
						initial={{ scale: 0 }}
						animate={{ scale: 1, transition: { delay: 0.3 } }}
					>
						{counselorAccount ? (
							<img
								className='w-32 rounded sm:w-48'
								src={counselorAccount.profile.avatarLink}
								alt={counselorAccount.profile.fullName}
							/>
						) : (
							<Avatar />
						)}
					</motion.div>
					<motion.div
						className='flex flex-col min-w-0 mx-8 sm:mx-16'
						initial={{ x: -20 }}
						animate={{ x: 0, transition: { delay: 0.3 } }}
					>
						<Typography className='font-semibold truncate text-16 sm:text-20'>
							{counselorAccount?.profile.fullName || 'Counselor'}
						</Typography>
						<Typography variant='caption' className='font-medium'>
							{counselorAccount?.profile.email}
						</Typography>
					</motion.div>
				</div>

				<motion.div
					className='flex '
					initial={{ opacity: 0, x: 20 }}
					animate={{ opacity: 1, x: 0, transition: { delay: 0.3 } }}
				>
					{counselorAccount?.status === 'ACTIVE' ? (
						<Button
							className='mx-4 whitespace-nowrap'
							variant='contained'
							color='secondary'
							onClick={handleBlockAccount}
							startIcon={<Delete />}
						>
							Block
						</Button>
					) : (
						<Button
							className='mx-4 whitespace-nowrap'
							variant='contained'
							color='secondary'
							onClick={handleUnblockAccount}
							startIcon={<Delete />}
						>
							Unblock
						</Button>
					)}
				</motion.div>
				{/* <FilterTabs tabs={accountTabs} tabValue={tabValue} onChangeTab={handleChangeTab}/> */}
			</div>

			<Paper className='flex flex-auto p-16 overflow-hidden'>
				<Scrollbar className='flex-1'>{view}</Scrollbar>
			</Paper>
		</div>
	);
};

export default AccountDetailAdminView;
