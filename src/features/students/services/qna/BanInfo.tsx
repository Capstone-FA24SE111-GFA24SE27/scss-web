import Button from '@mui/material/Button';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { Controller, useForm } from 'react-hook-form';
import _ from 'lodash';
import TextField from '@mui/material/TextField';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowBack, ArrowLeft, HelpOutlineOutlined, Warning } from '@mui/icons-material';
import { NavLinkAdapter } from '@/shared/components';
import { Accordion, AccordionDetails, AccordionSummary, Box, Chip, FormControl, FormControlLabel, FormHelperText, MenuItem, Radio, RadioGroup } from '@mui/material';
import { useState, useEffect } from 'react';
import { BanInfo, useEditQuestionMutation, useGetBanInfoQuery, useGetStudentQuestionQuery, usePostQuestionMutation } from './qna-api';
import { formatDateTime } from '@/shared/utils';
import dayjs from 'dayjs';
import { statusColor } from '@/shared/constants';
import { useGetAcademicTopicsQuery, useGetNonAcademicTopicsQuery } from '@/shared/services';


const formSchema = z.object({
  content: z.string().min(1, 'You must enter content'),
  questionType: z.enum(['ACADEMIC', 'NON_ACADEMIC'], {
    errorMap: () => ({ message: 'Please select a question type' }),
  }),
  topicId: z.string().min(1, 'You must select a topic'),

});

type FormValues = {
  questionType: "ACADEMIC" | "NON_ACADEMIC"; // Specify the correct types
  content: string;
  topicId: string;
};


/**
 * The help center support.
 */
function BanInfo({ banInfo }: { banInfo: BanInfo }) {
  return (
    <div className="flex flex-col items-center p-32 container">
      <div className="flex flex-col w-full max-w-4xl gap-16">
        <div className="">
          <Button
            component={NavLinkAdapter}
            to="."
            startIcon={<ArrowBack />}
          >
            Back to QnA
          </Button>
        </div>
        <Paper className="p-16 shadow flex gap-16 bg-red-400 text-white items-center">
          <Warning />
          <Typography className='text-xl font-semibold'>Your account has been banned from posting questions</Typography>
        </Paper>
        <div className='flex gap-16'>
          <Typography className='text-lg font-semibold text-text-secondary'>Time:</Typography>
          <div className='flex gap-16'>
            <Typography className='text-lg font-semibold'>{dayjs(banInfo.banStartDate).format('YYYY-MM-DD HH:mm:ss')}</Typography>
            <Typography className='text-lg font-semibold'>-</Typography>
            <Typography className='text-lg font-semibold'>{dayjs(banInfo.banEndDate).format('YYYY-MM-DD HH:mm:ss')}</Typography>
          </div>
        </div>

        <Typography className='text-lg font-semibold text-text-secondary'>Reasons:</Typography>
        <div>
          {
            banInfo?.questionFlags.map(qna => (
              <Accordion
                className='shadow rounded-lg'
                expanded={true}
              >
                <AccordionSummary >
                  <div className='flex flex-col gap-8 w-full'>
                    <div className='flex gap-8'>
                      <Chip label={qna.questionCard.questionType === 'ACADEMIC' ? 'Academic' : 'Non-Academic'} color={'info'} size='small' />
                      <Chip label={qna.questionCard.topic?.name} variant='outlined' size='small' />
                      {qna.questionCard.closed && <Chip label={'Closed'} color={'warning'} size='small' />}
                    </div>
                    <div className="flex flex-1 items-center gap-8">
                      <HelpOutlineOutlined color='disabled' />
                      <Typography className="pr-8 font-semibold w-full">{qna.questionCard.content}</Typography>
                    </div>
                    <div className='flex'>
                      <Typography className="pr-8 text-text-secondary">Flagged date:</Typography>
                      <Typography className="pr-8 font-semibold">{dayjs(qna.flagDate).format('YYYY-MM-DD HH:mm:ss')}</Typography>
                    </div>
                    <div className='flex'>
                      <Typography className="pr-8 text-text-secondary">Flagged Reason:</Typography>
                      <Typography className="pr-8 font-semibold">{qna.reason}</Typography>
                    </div>

                  </div>

                </AccordionSummary>

                <AccordionDetails className='flex'>

                </AccordionDetails>
                <Box
                  className='bg-primary-light/5 w-full py-8 flex justify-between px-16 '
                >

                </Box>
              </Accordion>
            ))
          }
        </div>
      </div>
    </div>
  );


}

export default BanInfo;
