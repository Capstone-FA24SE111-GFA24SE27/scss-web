import { Appointment } from ".";

export type User = {
  accessToken: string;
  account: Account | null
}

export type Account = {
  id: number,
  email: string,
  role: Role,
  status: string,
  profile: Profile
}

export type Profile = {
  id: number,
  fullName: string,
  phoneNumber: string,
  dateOfBirth: number,
  avatarLink: string,
  gender: string
}

export type Counselor = {
  id: number,
  profile: Profile
  email: string,
  rating?: number,
  expertise?: Expertise,
  specialization?: Specialization,
  // status: 'AVAILABLE' | 'UNAVAILABLE'
  status: string,
  department?: Department
  major?: Major
}

export type Student = {
  id: number,
  profile: Profile
  email: string,
  studentCode: number,
  specialization: Specialization
  department: Department
  major: Major
}

export type Specialization = {
  id: number,
  name: string,
  code: string;
}

export type Department = {
  id: number;
  name: string;
  code: string;
}

export type Major = {
  id: number;
  name: string;
  code: string;
  departmentId: number;
}

export type Expertise = {
  id: number,
  name: string
}


export type Role = "STUDENT" | "ACADEMIC_COUNSELOR" | "SUPPORT_STAFF" | "MANAGER" | "ADMIN" | "NON_ACADEMIC_COUNSELOR"

export type CounselingType = 'ACADEMIC' | 'NON_ACADEMIC'


export type StudentDocument = {
  studentProfile: Student,
  counselingProfile: StudentCounselingDocumentInfo
  counselingAppointment: Appointment[]
}

export type StudentCounselingDocumentInfo = {
  introduction: string;
  currentHealthStatus: string;
  psychologicalStatus: string;
  stressFactors: string;
  academicDifficulties: string;
  studyPlan: string;
  careerGoals: string;
  partTimeExperience: string;
  internshipProgram: string;
  extracurricularActivities: string;
  personalInterests: string;
  socialRelationships: string;
  financialSituation: string;
  financialSupport: string;
  desiredCounselingFields: string;
};


export type Subject = {
  subjectCode: string;
  subjectName: string;
  term: number;
  grade: number | null;
  status: string;
  semester: string;
}