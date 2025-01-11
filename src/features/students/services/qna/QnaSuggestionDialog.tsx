import {
  BackdropLoading,
  ContentLoading,
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
  Divider,
  Tab,
  Tabs,
  Typography
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '@shared/store';
import { useEffect, useState } from 'react';
import { usePostQuestionMutation, useEditQuestionMutation, useGetStudentQuestionQuery, useGetBanInfoQuery, useCountOpenQuestionQuery } from './qna-api';
import { QnaFormValues } from './QnaForm';
import { useGetAllPublicQuestionCardsQuery, useSearchContributedQuestionCardsQuery } from '@/shared/pages';
import FaqItem from '@/shared/pages/faq/FaqItem';
import PublicQnaItem from '@/shared/pages/public-qna/PublicQnaItem';
import { useNavigate } from 'react-router-dom';


const QnaSuggestionDialog = ({ data, question }: { data?: QnaFormValues, question?: Question, onSubmit?: () => void }) => {
  const questionId = question?.id
  const editMode = Boolean(questionId);

  const [qnaTab, setQnaTab] = useState(0)
  const dispatch = useAppDispatch()
  function handleChangeTab(event: React.SyntheticEvent, value: number) {
    setQnaTab(value)
  }

  const { data: publicQnasData, isLoading: isLoadingPublicQna } = useGetAllPublicQuestionCardsQuery({
    keyword: data?.title,
    isSuggestion: true,
  });

  const { data: contributedQuestionsData, isLoading: isLoadingFaq } = useSearchContributedQuestionCardsQuery({
    query: data?.title,
    isSuggestion: true,
  });

  const publicQnas = publicQnasData?.content?.data || [];
  const contributedQuestions = contributedQuestionsData?.content?.data || [];

  const navigate = useNavigate()

  const [postQuestion, { isLoading: isPosting }] = usePostQuestionMutation();
  const [editQuestion, { isLoading: isEditing }] = useEditQuestionMutation();
  const onSubmit = () => {

    try {
      if (editMode && questionId) {
        editQuestion({
          questionCardId: Number(questionId),
          question: {
            title: data.title,
            content: data.content,
            questionType: data.questionType,
            departmentId: data.department?.id,
            majorId: data.major?.id,
            expertiseId: data.expertise?.id,
            // specializationId: data.specializationId,
          }
        })
          .unwrap()
          .then(() => {
            useAlertDialog({
              dispatch,
              color: 'success',
              title: 'Question was edit successfully!',
            })
            navigate(-1);
          })
          .catch(error => useAlertDialog({
            dispatch,
            color: 'error',
            title: 'Error editing question',
          }))

      } else {
        postQuestion({
          title: data.title,
          content: data.content,
          questionType: data.questionType,
          departmentId: data.department?.id,
          majorId: data.major?.id,
          expertiseId: data.expertise?.id,
        })
          .unwrap()
          .then(() => {
            useAlertDialog({
              dispatch,
              color: 'success',
              title: 'Question was created successfully!',
            })
            navigate(-1);
          })
          .catch(error => useAlertDialog({
            dispatch,
            color: 'error',
            confirmButtonTitle: `Ok`,
            title: error?.data.message === `Expertise not found with name: none`
              ? `Question does have not have enough context`
              : (error?.data.message || `Error creating question`)
          }))

      }
    } catch (error) {
      console.error("Failed to submit question:", error);
    }
  };

  if (isLoadingFaq || isLoadingPublicQna) {
    return <BackdropLoading />
  }

  return (
    <div className='w-xl p-24'>
      <div className='px-32 '>
        <Typography className='text-text-secondary'>Suggestions for your question</Typography>
        <Typography className='text-lg font-semibold'>{data?.title}</Typography>
      </div>
      <div className='flex flex-col gap-8'>
        <Tabs
          value={qnaTab}
          onChange={handleChangeTab}
          indicatorColor="secondary"
          textColor="secondary"
          variant="scrollable"
          scrollButtons="auto"
          classes={{ root: 'w-full h-32 border-b bg-background-paper px-16' }}
        >
          <Tab
            className="text-lg font-semibold min-h-40 min-w-64 px-16"
            label="FAQs"
          />
          <Tab
            className="text-lg font-semibold min-h-40 min-w-64 px-16"
            label="Public Q&As"
          />
        </Tabs>
        <div className='px-16'>
          {qnaTab === 0 && (
            <div className='space-y-16'>
              {
                isLoadingFaq
                  ? <ContentLoading className='h-md' />
                  : !contributedQuestions?.length ? (
                    <Typography variant='h5' color='textSecondary' className='px-8'>
                      No Q&As found.
                    </Typography>
                  ) : (
                    contributedQuestions?.map((contributedQuestion) => {
                      return (
                        <FaqItem key={contributedQuestion.id} contributedQuestion={contributedQuestion} />
                      )
                    })
                  )
              }
            </div>
          )}
          {qnaTab === 1 && (
            <div className='space-y-16'>
              {
                isLoadingPublicQna
                  ? <ContentLoading className='h-md' />
                  : !publicQnas?.length ? (
                    <Typography variant='h5' color='textSecondary' className='px-8'>
                      No Q&As found.
                    </Typography>
                  ) : (
                    publicQnas.map((publicQna) => {
                      return (
                        <PublicQnaItem key={publicQna.id} publicQna={publicQna} />
                      )
                    })
                  )
              }
            </div>
          )}
        </div>
      </div>
      <DialogActions className='mt-8'>
        <Button variant='contained' color='secondary' onClick={onSubmit} disabled={isPosting || isEditing}>
          Continue to Proceed
        </Button>
      </DialogActions>
    </div>
  )
}

export default QnaSuggestionDialog;
