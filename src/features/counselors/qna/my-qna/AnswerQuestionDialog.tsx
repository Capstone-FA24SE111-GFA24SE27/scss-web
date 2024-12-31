import {
  BackdropLoading,
  QuillEditor,
  RenderHTML,
  closeDialog,
  setBackdropLoading
} from '@/shared/components';
import { useAlertDialog, useConfirmDialog } from '@/shared/hooks';
import { Question } from '@/shared/types';
import { validateHTML } from '@/shared/utils';
import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider
} from '@mui/material';
import { useAppDispatch } from '@shared/store';
import { useEffect, useState } from 'react';
import {
  useAnswerQuestionMutation,
  useEditAnswerMutation
} from '../qna-api';

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};



const AnswerQuestionDialog = ({ qna }: { qna: Question }) => {
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
        })
    }
  };

  useEffect(() => {
    dispatch(setBackdropLoading(submitingAnswer || editingAnswer))
  }, [submitingAnswer || editingAnswer]);

  return (
    <div className=' w-xl'>
      <DialogTitle >{qna.title}</DialogTitle>
      <DialogContent className='flex flex-col gap-8'>
        {/* {!qna.closed &&
					qna.status === 'VERIFIED' && (
						<TextField
							disabled={qna?.closed}
							label='My answer'
							placeholder='Enter answer for the question...'
							variant='outlined'
							value={answer}
							onChange={(
								event: ChangeEvent<HTMLInputElement>
							) => {
								setAnswer(
									event.target.value
								);
							}}
							multiline
							minRows={4}
							fullWidth
							slotProps={{
								inputLabel: {
									shrink: true,
								},
							}}
						/>
					)} */}
        <div>{RenderHTML(qna.content)}</div>
        <Divider />
        <QuillEditor
          value={answer}
          onChange={setAnswer}
          // error={errors.content?.message}
          label={editMode ? "Edit your answer" : "Answer the question"}
          placeholder='Write your answer...'
        />
      </DialogContent>
      <DialogActions>
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
          Submit Answer
        </Button>
      </DialogActions>
    </div>
  )
}

export default AnswerQuestionDialog;
