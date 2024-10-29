import { Account, Counselor, Student } from "./user";

export type Question = {
    id: number;
    title: string;
    content: string;
    answer: string | null,
    questionType: 'ACADEMIC' | 'NON-ACADEMIC';
    status: 'VERIFIED' | 'PENDING' | 'REJECTED';
    student: Student;
    counselor: Counselor | null;
    chatSession: ChatSession
    closed: boolean;
    taken: boolean;
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
    sendAt: string,
  }
export type QuestionCardStatus = 'VERIFIED' | 'PENDING' | 'FLAGGED' | 'REJECTED'
