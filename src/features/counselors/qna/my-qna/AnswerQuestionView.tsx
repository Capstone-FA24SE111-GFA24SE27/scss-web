import {
  BackdropLoading,
  NavLinkAdapter,
  QuillEditor,
  RenderHTML,
  UserLabel,
  closeDialog,
  closeDrawer,
  openDialog,
  setBackdropLoading
} from '@/shared/components';
import { useAlertDialog, useConfirmDialog } from '@/shared/hooks';
import { Question } from '@/shared/types';
import { validateHTML } from '@/shared/utils';
import {
  Button,
  Chip,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Typography
} from '@mui/material';
import { useAppDispatch } from '@shared/store';
import { useEffect, useState } from 'react';
import {
  useAnswerQuestionMutation,
  useEditAnswerMutation
} from '../qna-api';
import { ArrowBack, CheckCircleOutlineOutlined, Close, HelpOutlineOutlined, Lock, ThumbUpOutlined } from '@mui/icons-material';
import { openStudentView } from '../../counselors-layout-slice';
import { difficultyColor, statusColor } from '@/shared/constants';
import dayjs from 'dayjs';
import { StudentView } from '@/shared/pages';

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};



const AnswerQuestionView = ({ qna }: { qna: Question }) => {
  const editMode = Boolean(qna.answer)
  console.log(editMode)

  const [answer, setAnswer] = useState(qna.answer || ``);

  const [answerQuestion, { isLoading: submitingAnswer }] =
    useAnswerQuestionMutation();

  const [editAnswer, { isLoading: editingAnswer }] =
    useEditAnswerMutation();

  const dispatch = useAppDispatch()


  const handleAnswerQuestion = () => {
    useConfirmDialog({
      title: 'Are you sure you want to submit the answer?',
      confirmButtonFunction: onSubmitAnswer,
      dispatch,
    });
  }


  const onSubmitAnswer = () => {
    if (editMode) {
      editAnswer({
        questionCardId: qna.id,
        content: answer,
      })
        .unwrap()
        .then(() => {
          useAlertDialog({
            title: " Answer edited successfully",
            dispatch,
          })
          dispatch(closeDrawer())
        })
    } else {
      answerQuestion({
        questionCardId: qna.id,
        content: answer,
      })
        .unwrap()
        .then(() => {
          useAlertDialog({
            title: " Answer submitted successfully",
            dispatch,
          })
          dispatch(closeDrawer())
        })
    }
  };


  return (
    <div className='px-32 my-24 w-xl space-y-4'>
      <div className="flex justify-end absolute top-16 right-16 z-10">
        <IconButton
          className=""
          size='large'
          onClick={() => dispatch(closeDrawer())}
        >
          <Close />
        </IconButton>
      </div>
      <div className="pt-16 text-2xl font-extrabold  leading-tight tracking-tight">
        {qna?.title}
      </div>
      <div className='flex flex-col gap-8'>
        <div className='flex gap-8 items-center'>
          <UserLabel
            profile={qna?.student?.profile}
            label='Questioned by'
            email={qna?.student.email}
            onClick={() => {
              dispatch(
                openDialog({
                  children: <StudentView id={qna?.student.id.toString()} />
                })
              );
              // dispatch(
              //   openStudentView(qna?.student.id.toString())
              // );
            }}
          />
          <span className='text-text-secondary' >•</span>
          <Typography color='textSecondary'>{`${dayjs(qna.createdDate).format('YYYY-MM-DD HH:mm:ss')}`}</Typography>
        </div>
        <div className='flex gap-8'>
          <Chip
            label={qna.difficultyLevel}
            color={difficultyColor[qna.difficultyLevel as string]}
            size='small'
          />
          <Chip
            label={qna.status.toLocaleLowerCase()}
            color={statusColor[qna.status as string]}
            size='small'
            className='capitalize'
            variant='outlined'
          />
          {qna.answer ? (
            <Chip icon={<CheckCircleOutlineOutlined />} label='Answered' color='success' size='small' variant='outlined' />
          ) : (
            <Chip icon={<HelpOutlineOutlined />} label='Not Answered' size='small' variant='outlined' />

          )}

          {/* <Chip label={qna.topic?.name} size='small' /> */}
          {/* {qna.taken && <Chip label={`Taken by ${qna?.counselor.profile.fullName}`} variant='outlined' color={'success'} size='small' />} */}
          {qna.closed && (
            <Chip
              icon={<Lock />}
              label={'Closed'}
              variant='outlined'
              size='small'
            />
          )}
          {
            qna.accepted && (
              < Chip
                icon={<ThumbUpOutlined />}
                label={`Accepted by ${qna?.student.profile.fullName}`}
                size='small'
                variant='filled'
              />
            )
          }
        </div>
      </div>

      <div className='flex flex-col gap-8'>
        <Divider className='pt-8' />
        <Typography className='text-text-secondary' gutterBottom>
          Content:
        </Typography>
        <div>{RenderHTML(qna.content)}</div>
        <Divider className='pt-8' />
        <QuillEditor
          value={answer}
          onChange={setAnswer}
          label={editMode ? "Your answer" : " Your answer"}
          placeholder='Write your answer...'
        />
      </div>
      <div className="flex items-center justify-end mt-32 pt-24 gap-8">
        <Button
          onClick={() => dispatch(closeDrawer())}
          color="primary"
          type='button'
        >
          Cancel
        </Button>
        <Button
          variant='contained'
          color='secondary'
          className='m-8'
          disabled={
            submitingAnswer
            || !answer.length
            || !validateHTML(answer)
            || qna?.answer === answer
          }
          onClick={() =>
            handleAnswerQuestion()
          }
        >
          {editMode ? `Save` : `Submit`}
        </Button>
      </div>
      {(submitingAnswer || editingAnswer) && <BackdropLoading />}
    </div>
  )
}

export default AnswerQuestionView;
