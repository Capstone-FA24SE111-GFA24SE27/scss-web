import { Topic } from "../services";
import { Account, Counselor, Student } from "./user";


export type QuestionPayload = {
  content: string,
  questionType: 'ACADEMIC' | 'NON_ACADEMIC',
  specializationId?: string,
  departmentId?: string,
  majorId?: string,
  expertiseId?: string,
  title: string,
}
export type SendMessageApiArg = {
  content: string,
  sessionId: number,
}

export type Question = {
  id: number;
  title: string;
  content: string;
  answer: string | null,
  questionType: 'ACADEMIC' | 'NON_ACADEMIC';
  status: QuestionCardStatus;
  student: Student;
  counselor: Counselor | null;
  chatSession: ChatSession;
  closed: boolean;
  taken: boolean;
  topic: Topic,
  createdDate: string;
  difficultyLevel: string;
}

export type ChatSession = {
  id: number,
  closed: boolean,
  lastInteractionDate: string,
  messages: Message[]
}

export type Message = {
  id: number,
  chatSessionId: number,
  content: string,
  read: boolean,
  sender: Account,
  sentAt: string,
}
export type QuestionCardStatus = 'VERIFIED' | 'PENDING' | 'FLAGGED' | 'REJECTED'
