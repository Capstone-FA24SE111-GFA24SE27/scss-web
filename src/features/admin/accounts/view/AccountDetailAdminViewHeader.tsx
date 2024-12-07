import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { NavLinkAdapter, openDialog } from '@/shared/components';
import { motion } from 'framer-motion';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import {
	Avatar,
	Button,
	IconButton,
	Paper,
	Skeleton,
	Tooltip,
	Typography,
} from '@mui/material';
import { ArrowBack, Delete } from '@mui/icons-material';
import { useAlertDialog, useConfirmDialog } from '@/shared/hooks';
import { useAppDispatch } from '@shared/store';
import {
	useGetOneAccountQuery,
	usePutBlockAccountByIdMutation,
	usePutUnblockAccountByIdMutation,
} from '../admin-accounts-api';
import { useFormContext } from 'react-hook-form';
import _ from 'lodash';
import ImageInput from '@/shared/components/image/ImageInput';
import { uploadFile } from '@/shared/services';

type Props = {};

const AccountDetailAdminViewHeader = (props: Props) => {
	const { id, role } = useParams();
	const dispatch = useAppDispatch();

	const [avatarFile, setAvatarFile] = useState<File | null>(null);
	const [isLoadingAvatar, setIsLoadingAvatar] = useState<boolean>(false);

	const methods = useFormContext();
	const { formState, watch, getValues, setValue } = methods;
	const { isValid, dirtyFields, errors } = formState;

	const { fullName, email, avatarLink } = watch();

	const {
		data: accountData,
		isLoading: isLoadingAccount,
		refetch,
	} = useGetOneAccountQuery({ id }, { skip: !id });

	const userViewedAccount = accountData?.content;

	const [blockAccountById] = usePutBlockAccountByIdMutation();
	const [unblockAccountById] = usePutUnblockAccountByIdMutation();

	const handleUpdateAccount = () => {};

	const handleBlockAccount = () => {
		console.log(id);
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
						.catch((err) => console.log(err))
						.finally(() => {
							refetch();
						});
				}
			},
			title: 'Are you sure you want to unblock this account?',
		});
	};

	const handleUpload = async (file: File) => {
		if (file) {
			try {
				const res = await uploadFile(
					file,
					`images/${Date.now()}_${file.name}`
				);
				return res;
			} catch (err) {
				useAlertDialog({
					dispatch,
					title: 'Error uploading image',
					color: 'error',
				});
				return false;
			}
		}
	};

	const handleUpdateAvatar = () => {
		useConfirmDialog({
			title: 'Update avatar image:',
			content: (
				<div className='min-w-256 max-w-320'>
					<ImageInput
						onFileChange={setAvatarFile}
						file={avatarFile}
						error={!!errors.avatarLink}
					/>
				</div>
			),
			dispatch,
			confirmButtonFunction: async () => {
				setIsLoadingAvatar(true);
				const res = await handleUpload(avatarFile);
				if (res) {
					setValue('avatarLink', res);
				}
				setIsLoadingAvatar(false);
			},
			confirmButtonTitle: 'Save',
		});
	};

	console.log('dirty', dirtyFields, errors, isValid);

	if (isLoadingAccount)
		return <Skeleton variant='rectangular' width='100%' height={120} />;

	return (
		<>
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
						{userViewedAccount ? (
							<Tooltip title='Edit avatar'>
								<button
									className='relative flex flex-auto w-32 sm:w-48 cursor-pointer'
									onClick={handleUpdateAvatar}
								>
									<img
										className='w-full h-full object-contain rounded '
										src={avatarLink}
										alt={fullName}
									/>
									<AddPhotoAlternateIcon className='absolute -bottom-10 -right-10 z-10  cursor-pointer' />
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
						<Typography className='font-semibold truncate text-16 sm:text-20'>
							{fullName || 'Counselor'}
						</Typography>
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
							className='whitespace-nowrap mx-4'
							variant='contained'
							color='secondary'
							disabled={_.isEmpty(dirtyFields) || !isValid}
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
