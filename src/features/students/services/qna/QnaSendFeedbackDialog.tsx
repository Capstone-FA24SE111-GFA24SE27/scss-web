import { closeDialog } from "@/shared/components"
import { Button, DialogActions, DialogContent, DialogContentText, DialogTitle, Rating, TextField, Typography } from "@mui/material"
import { useAppDispatch } from "@shared/store"
import { useState } from "react"
import { useSendQuestionFeedbackStudentMutation } from "./qna-api"

const QnaSndFeedbackDialog = ({ questionCard }) => {
  const [comment, setComment] = useState('')
  const [rating, setRating] = useState(0)
  const dispatch = useAppDispatch()
  const [sendFeedback] = useSendQuestionFeedbackStudentMutation()
  const handleSendFeedback = () => {
    sendFeedback({
      questionCardId: questionCard.id,
      feedback: {
        comment,
        rating
      }
    })
    dispatch(closeDialog())
  }

  return (
    <div className='w-[50rem]'>
      <DialogTitle id="alert-dialog-title">Review the answer?</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          <Typography>Give a feedback for counselor</Typography>
          <TextField
            autoFocus
            margin="dense"
            name={'comment'}
            label={'Comment'}
            fullWidth
            multiline
            rows={4}
            maxRows={4}

            value={comment}
            className='mt-16'
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setComment(event.target.value);
            }} />
          <div className='mt-16'>
            <Typography component="legend">Rate this answer</Typography>
            <Rating
              name="simple-controlled"
              value={rating}
              onChange={(event, newRating) => {
                setRating(newRating);
              }}
            />
          </div>

        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => dispatch(closeDialog())}
          color="primary">
          Cancel
        </Button>
        <Button
          onClick={() => handleSendFeedback()}
          color="secondary" variant='contained'
          disabled={!comment || !rating}
        >
          Confirm
        </Button>
      </DialogActions>
    </div>
  )
}

export default QnaSndFeedbackDialog