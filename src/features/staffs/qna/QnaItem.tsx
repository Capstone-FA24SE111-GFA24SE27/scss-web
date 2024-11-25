import { Question } from '@/shared/types'
import React, { useState } from 'react'
import {
	CheckCircle,
	CheckCircleOutlineOutlined,
	ChevronRight,
	Flag,
	HelpOutlineOutlined,
	Visibility,
} from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import {
	TypeOfQuestionType,
	useGetQuestionQuery,
	useGetQuestionsQuery,
	usePostFlagQuestionStatusMutation,
	usePostReviewQuestionStatusMutation,
} from './qna-api';
import { motion } from 'framer-motion';
import { Avatar, Button, Chip, ListItemButton, Menu, MenuItem, Paper, Tooltip, Typography } from '@mui/material';
import { statusColor } from '@/shared/constants';
import { useConfirmDialog } from '@/shared/hooks';
import { useAlertDialog } from '@/shared/hooks';
import { useDispatch } from 'react-redux';
import { NavLinkAdapter, openDialog } from '@/shared/components';
import QnaFlagForm from './QnaFlagFormDialog';


type Props = {
    qna: Question;
   
}

const item = {
	hidden: { opacity: 0, y: 20 },
	show: { opacity: 1, y: 0 },
};

const QnaItem = (props: Props) => {

    const {qna} = props
	const navigate = useNavigate();
  	const location = useLocation()
	const dispatch = useDispatch();
    
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const [reviewQuestion] = usePostReviewQuestionStatusMutation();
	const [flagQuestion] = usePostFlagQuestionStatusMutation();
    
	const handleMenuButtonClick = (
		event: React.MouseEvent<HTMLButtonElement>
	) => {
		setAnchorEl(event.currentTarget as HTMLElement);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};


    const handleVerify = () => {
		useConfirmDialog({
			dispatch: dispatch,
			title: 'Are you sure you want to verify this question?',
			confirmButtonFunction: () => {
				reviewQuestion({
					id: qna.id,
					status: 'VERIFIED',
				}).unwrap().then((result) => {
                    if(result.status === 200){

                        useAlertDialog({
                            title: 'Question card verified successfully',
                            dispatch: dispatch,
                        });
                    } else {
                        useAlertDialog({
                            title: result.message,
                            dispatch: dispatch,
                        });
                    }
                }).catch(err => console.log(err));
			
			},
		});
	};

	const handleFlag = () => {
		dispatch(openDialog({
			children: <QnaFlagForm qna={qna}/>
		}))
	};

    const handleLocalNavigate = (route: string) => {
		const pathSegments = location.pathname.split('/').filter(Boolean);
	
		// Create a new path using the first two segments
		 const newPath = `/${pathSegments[0]}/${route}`;
	
		return newPath
	  }

  return (
    <motion.div variants={item} >
								<Paper className='flex flex-col gap-8 p-12 overflow-hidden shadow'>
									<div className='relative flex items-center '>
										<div className='flex flex-col w-full gap-8'>
											<div className='flex items-center justify-between w-full '>
												<div className='flex gap-8'>
													<Chip
														label={
															qna.questionType ===
															'ACADEMIC'
																? 'Academic'
																: 'Non-Academic'
														}
														color={
															qna.questionType ===
															'ACADEMIC'
																? 'info'
																: 'warning'
														}
														size='small'
													/>
													<Chip
														label={qna.status}
														color={
															statusColor[
																qna.status
															] as
																| 'error'
																| 'default'
																| 'warning'
																| 'success'
														}
														size='small'
													/>
													{qna.closed && (
														<Chip
															label={'Closed'}
															color={'warning'}
															size='small'
														/>
													)}
												</div>
												<div>
													<Button
														onClick={(event) =>
															handleMenuButtonClick(
																event
															)
														}
													>
														Action
													</Button>
													<Menu
														id={qna.id + 'menu'}
														anchorEl={anchorEl}
														open={open}
														onClose={handleClose}
													>
														<MenuItem
															className='w-[14rem] gap-8 font-medium'
															onClick={() => {
																navigate(
																	`${qna.id}/view`
																);
                                                                handleClose()
															}}
														>
															<Visibility color='info' />
															View
														</MenuItem>
														<MenuItem
															onClick={() => {
																handleVerify();
																handleClose();
															}}
															className='w-[14rem] gap-8 font-medium'
														>
															<CheckCircle color='success' />
															Verify
														</MenuItem>
														{/* <MenuItem
															onClick={() => {
																handleReject();
																handleClose();
															}}
															className='w-[14rem] gap-8 font-medium'
														>
															<RemoveCircle color='warning' />
															Reject
														</MenuItem> */}
														<MenuItem
															onClick={() => {
																handleFlag();
																handleClose();
															}}
															className='w-[14rem] gap-8 font-medium'
														>
															<Flag color='error' />
															Flag
														</MenuItem>
													</Menu>
												</div>
											</div>
											<div className='flex items-center flex-1 gap-8'>
												{/* <Divider orientation='vertical' /> */}
												{qna.answer ? (
													<CheckCircleOutlineOutlined color='success' />
												) : (
													<HelpOutlineOutlined color='disabled' />
												)}

												<Typography className='w-full pr-8 font-semibold'>
													{qna.content}
												</Typography>
											</div>
										</div>
									</div>
									<Tooltip
										title={`View ${qna.student.profile.fullName}'s profile`}
									>
									<ListItemButton
										component={NavLinkAdapter}
										to={handleLocalNavigate(`student/${qna.student.profile.id}`)}
										className='w-full rounded shadow bg-primary-light/5'
									>
										<div
											className='flex items-start w-full gap-16'
										>
											<Avatar
												alt={
													qna.student.profile.fullName
												}
												src={
													qna.student.profile
														.avatarLink
												}
											/>
											<div>
												<Typography className='font-semibold text-primary-main'>
													{
														qna.student.profile
															.fullName
													}
												</Typography>
												<Typography color='text.secondary'>
													{qna.student.email ||
														'emailisnull.edu.vn'}
												</Typography>
											</div>
										</div>
									<ChevronRight />

									</ListItemButton>
									</Tooltip>
								</Paper>
							</motion.div>
  )
}

export default QnaItem