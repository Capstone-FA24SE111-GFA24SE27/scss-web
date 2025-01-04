//@ts-nocheck

import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { NavLinkAdapter, openDialog } from '@/shared/components';
import { motion } from 'framer-motion';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import {
	Avatar,
	Button,
	CircularProgress,
	IconButton,
	Paper,
	Skeleton,
	Tooltip,
	Typography,
} from '@mui/material';
import { ArrowBack, Delete } from '@mui/icons-material';
import { useAlertDialog, useConfirmDialog } from '@/shared/hooks';
import { useAppDispatch, useAppSelector } from '@shared/store';
import {
	useGetOneAccountQuery,
	usePutBlockAccountByIdMutation,
	usePutUnblockAccountByIdMutation,
	usePutUpdateAcademicCounselorAccountMutation,
	usePutUpdateManagerAccountMutation,
	usePutUpdateNonAcademicCounselorAccountMutation,
	usePutUpdateStaffAccountMutation,
} from '../admin-accounts-api';
import { useFormContext } from 'react-hook-form';
import _ from 'lodash';
import ImageInput from '@/shared/components/image/ImageInput';
import { uploadFile } from '@/shared/services';
import AvatarAppendForm from '../create/forms/AvatarAppendForm';
import { roles } from '@/shared/constants';
import { selectViewAccountTab } from '../admin-view-account-slice';
import BlockIcon from '@mui/icons-material/Block';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';

type Props = {
	changeTab?: any;
};

const AccountDetailAdminViewHeader = (props: Props) => {
	const { changeTab } = props;
	const { id, role } = useParams();
	const dispatch = useAppDispatch();
	const navigate = useNavigate()

	const tabFields = {
		// email: 0,
		gender: 0,
		phoneNumber: 0,
		dateOfBirth: 0,
		fullName: 0,
		departmentId: 1,
		majorId: 1,
		expertiseId: 1,
		specializedSkills: 2,
		otherSkills: 2,
		workHistory: 2,
		achievements: 2,
		qualifications: 2,
		certifications: 2,
	};

	const methods = useFormContext();
	const { formState, watch, setValue, trigger } = methods;
	const { isValid, dirtyFields, errors } = formState;

	const formData = watch();
	const {
		fullName,
		email,
		avatarLink,
		gender,
		phoneNumber,
		dateOfBirth,
		departmentId,
		majorId,
		expertiseId,
		specializedSkills,
		otherSkills,
		workHistory,
		achievements,
		qualifications,
		certifications,
	} = formData;
	const {
		data: accountData,
		isLoading: isLoadingAccount,
		refetch,
	} = useGetOneAccountQuery({ id }, { skip: !id });

	const userViewedAccount = accountData?.content;

	const [blockAccountById] = usePutBlockAccountByIdMutation();
	const [unblockAccountById] = usePutUnblockAccountByIdMutation();

	const handleTrigger = () => {
		if (trigger) {
			trigger();
			handleChangeTab();
		}
	};

	const handleChangeTab = () => {
		if (changeTab) {
			const firstError = Object.keys(errors)[0];
			if (Number.isInteger(tabFields[firstError])) {
				changeTab(tabFields[firstError]);
			}
		}
	};

	const [updateAcademicCounselor] =
		usePutUpdateAcademicCounselorAccountMutation();
	const [updateNonAcademicCounselor] =
		usePutUpdateNonAcademicCounselorAccountMutation();
	const [updateManager] = usePutUpdateManagerAccountMutation();
	const [updateSupportStaff] = usePutUpdateStaffAccountMutation();

	const handleUpdateAccount = () => {
		handleTrigger();
		if (isValid) {
			if (formData) {
				switch (role) {
					default: {
						break;
					}
					case 'a-counselor': {
						updateAcademicCounselor({
							id,
							fullName,
							email,
							avatarLink,
							gender,
							phoneNumber,
							dateOfBirth,
							departmentId,
							majorId,
							specializedSkills,
							otherSkills,
							workHistory,
							achievements,
						})
							.unwrap()
							.then((res) => {
								if (res && res.status === 200) {
									useAlertDialog({
										title: res.message,
										dispatch,
									});
									navigate(-1);
								}
							})
							.catch((err) => {
								console.log(err)
								useAlertDialog({
									title: 'An error occur while updating the account',
									dispatch,
									color: 'error',
								});
							});
						break;
					}
					case 'na-counselor': {
						updateNonAcademicCounselor({
							//@ts-ignore
							id,
							fullName,
							email,
							avatarLink,
							gender,
							phoneNumber,
							dateOfBirth,
							expertiseId,
							specializedSkills,
							otherSkills,
							workHistory,
							achievements,
						})
							.unwrap()
							.then((res) => {
								if (res && res.status === 200) {
									useAlertDialog({
										title: res.message,
										dispatch,
										color: 'error',
									});
									navigate(-1);
								}
							})
							.catch((err) => {
								useAlertDialog({
									title: 'An error occur while updating the account',
									dispatch,
									color: 'error',
								});
							});
						break;
					}
					case 'manager': {
						updateManager({
							id,
							fullName,
							email,
							avatarLink,
							gender,
							phoneNumber,
							dateOfBirth,
						})
							.unwrap()
							.then((res) => {
								if (res && res.status === 200) {
									useAlertDialog({
										title: res.message,
										dispatch,
										color: 'error',
									});
									navigate(-1);
								}
							})
							.catch((err) => {
								useAlertDialog({
									title: 'An error occur while updating the account',
									dispatch,
									color: 'error',
								});
							});
						break;
					}
					case 'staff': {
						updateSupportStaff({
							id,
							fullName,
							email,
							avatarLink,
							gender,
							phoneNumber,
							dateOfBirth,
						})
							.unwrap()
							.then((res) => {
								if (res && res.status === 200) {
									useAlertDialog({
										title: res.message,
										dispatch,
										color: 'error',
									});
									navigate(-1);
								}
							})
							.catch((err) => {
								useAlertDialog({
									title: 'An error occur while updating the account',
									dispatch,
									color: 'error',
								});
							});
						break;
					}
					case 'student': {
						break;
					}
				}
			}
		}
	};

	useEffect(() => {
		handleChangeTab();
	}, [errors]);

	const handleBlockAccount = () => {
		useConfirmDialog({
			dispatch,
			confirmButtonFunction: () => {
				if (id) {
					blockAccountById({ id, role: userViewedAccount.role })
						.unwrap()
						.then((result) => {
							if (result) {
								useAlertDialog({
									dispatch,
									title: result.message,
								});
							}
						})
						.catch((err) => {
							console.log(err);
							useAlertDialog({
								title: 'An error occur while updating the account',
								dispatch,
								color: 'error',
							});
						})
						.finally(() => {
							refetch();
						});
				}
			},
			title: 'Are you sure you want to block this account?',
		});
	};

	const handleUnblockAccount = () => {
		useConfirmDialog({
			dispatch,
			confirmButtonFunction: () => {
				if (id) {
					unblockAccountById({ id, role: userViewedAccount.role })
						.unwrap()
						.then((result) => {
							if (result) {
								useAlertDialog({
									dispatch,
									title: result.message,
								});
							}
						})
						.catch((err) => {
							console.log(err);
							useAlertDialog({
								title: 'An error occur while updating the account',
								dispatch,
								color: 'error',
							});
						})
						.finally(() => {
							refetch();
						});
				}
			},
			title: 'Are you sure you want to unblock this account?',
		});
	};

	const handleUpdateAvatar = () => {
		dispatch(
			openDialog({
				children: (
					<AvatarAppendForm
						onChangeAvatar={(avatar: string) =>
							setValue('avatarLink', avatar)
						}
					/>
				),
			})
		);
	};

	useEffect(() => {
		if (!isLoadingAccount && userViewedAccount) {
			trigger();
		}
	}, [isLoadingAccount]);

	if (isLoadingAccount)
		return <Skeleton variant='rectangular' width='100%' height={120} />;

	return (
		<>
			<div className='flex flex-col px-32 pt-16 pb-0 '>
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
						{userViewedAccount ? (
							<Tooltip title='Edit avatar'>
								<button
									className='relative flex flex-auto w-32 cursor-pointer sm:w-48'
									onClick={handleUpdateAvatar}
								>
									<img
										className='object-contain w-full h-full rounded '
										src={avatarLink}
										alt={fullName}
									/>
									<AddPhotoAlternateIcon className='absolute z-10 cursor-pointer -bottom-10 -right-10' />
								</button>
							</Tooltip>
						) : (
							<Avatar />
						)}
					</motion.div>
					<motion.div
						className='flex flex-col min-w-0 mx-8 sm:mx-16'
						initial={{ x: -20 }}
						animate={{ x: 0, transition: { delay: 0.3 } }}
					>
						<div className='flex items-center gap-8'>
							<Typography className='font-semibold truncate text-16 sm:text-20'>
								{fullName ||
									accountData?.content.profile.fullName ||
									'Account...'}
							</Typography>
							<Tooltip title={accountData?.content.status}>
								<div className='flex items-center max-w-40'>
									{accountData?.content.status ===
									'ACTIVE' ? (
										<VerifiedUserIcon className='text-green' />
									) : (
										<BlockIcon className='text-red' />
									)}
								</div>
							</Tooltip>
						</div>
						<Typography variant='caption' className='font-medium'>
							{email}
						</Typography>
					</motion.div>
				</div>

				<motion.div
					className='flex '
					initial={{ opacity: 0, x: 20 }}
					animate={{ opacity: 1, x: 0, transition: { delay: 0.3 } }}
				>
					<>
						{userViewedAccount?.status === 'ACTIVE' ? (
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
						<Button
							className='mx-4 whitespace-nowrap'
							variant='contained'
							color='primary'
							disabled={_.isEmpty(dirtyFields)}
							onClick={handleUpdateAccount}
						>
							Update
						</Button>
					</>
				</motion.div>
			</div>
		</>
	);
};

export default AccountDetailAdminViewHeader;
