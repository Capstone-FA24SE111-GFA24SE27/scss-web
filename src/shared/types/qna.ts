import { Account, Counselor, Student } from "./user";

export type Question = {
  id: number;
  title: string;
  content: string;
  answer: string | null,
  questionType: 'ACADEMIC' | 'NON_ACADEMIC';
  status: 'VERIFIED' | 'PENDING' | 'REJECTED';
  student: Student;
  counselor: Counselor | null;
  chatSession: ChatSession
  closed: boolean;
  taken: boolean;
  topic: {
    id: number;
    name: string;
    type: string;
  };
}


export type ChatSession = {
  id: number,
  closed: boolean,
  lastInteractionDate: string,
  messages: Message[]
}

export type Message = {
  id: number,
  chatSession: string,
  content: string,
  read: boolean,
  sender: Account,
  sentAt: string,
}
export type QuestionCardStatus = 'VERIFIED' | 'PENDING' | 'FLAGGED' | 'REJECTED'
