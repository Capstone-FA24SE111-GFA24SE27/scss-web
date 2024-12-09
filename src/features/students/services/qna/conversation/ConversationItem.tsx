import { RenderHTML } from '@/shared/components'
import { useGetMessagesQuery } from '@/shared/components/chat/chat-api'
import { Question } from '@/shared/types'
import { CheckCircleOutlineOutlined, HelpOutlineOutlined } from '@mui/icons-material'
import { Avatar, Chip, Divider, ListItemButton, Tooltip, Typography } from '@mui/material'
import { selectAccount } from '@shared/store'
import { useAppSelector } from '@shared/store'
import React from 'react'
import { useParams } from 'react-router-dom'

type Props = {
  onClick: () => void,
  qnaItem: Question
}

const ConversationItem = (props: Props) => {
  const { onClick, qnaItem } = props

  const { data, isLoading } = useGetMessagesQuery(qnaItem.id)
  const chatSession = data?.content
  const account = useAppSelector(selectAccount)
  const { id } = useParams()


  const countUnreadMessages = () => {
    const readMessages = chatSession?.messages.filter(
      (message) => message.sender.id !== account.id && !message.read
    );
    return readMessages?.length;
  };


  return (
    <ListItemButton className='flex-col items-start p-4 rounded' selected={Number(id) == qnaItem.id}
      onClick={onClick}
    >
      <Tooltip title={RenderHTML(qnaItem?.content)}>
        <div className="flex items-center flex-1 gap-8">
          {
            qnaItem.answer
              ? <CheckCircleOutlineOutlined color='success' />
              : <HelpOutlineOutlined color='disabled' />
          }
          <Typography className="w-full pr-8 font-semibold line-clamp-1">{qnaItem?.title}</Typography>
        </div>
      </Tooltip>
      <div className="flex items-center w-full gap-8 p-8"
      >
        <Avatar src={qnaItem.student.profile.avatarLink} alt='Student image' />
        <div className="w-full ml-4">
          <div className='flex items-center justify-between'>
            <Typography className="text-lg font-semibold">{qnaItem.student.profile.fullName}</Typography>
            {/* <Typography className="text-sm text-text-disabled">{dayjs(qnaItem?.chatSession?.lastInteractionDate).format('YYYY-MM-DD')}</Typography> */}
          </div>
          <div className='flex items-center justify-between'>
            <div className="flex-1 text-sm text-primary-light line-clamp-1">{qnaItem.chatSession?.messages?.at(-1)?.content || qnaItem?.title}</div>
            {countUnreadMessages() ? <Chip label={countUnreadMessages()} size='small' color='secondary' /> : ''}
          </div>
        </div>
      </div>
      <Divider />
    </ListItemButton>
  )
}

export default ConversationItem