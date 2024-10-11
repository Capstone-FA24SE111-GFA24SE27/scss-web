export type User = {
  accessToken: string;
  account: Account | null
}

export type Account = {
  id: number,
  email: string,
  role: string,
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
  profile: Profile
  email: string,
  rating?: number,
  expertise?: Expertise,
  specialization?: Specialization
}

export type Student = {
  profile: Profile
  email: string,
  studentCode: number,
}

export type Expertise = {
  id: number,
  name: string
}

export type Specialization = {
  id: number,
  name: string
}

export type CounselingType = 'ACADEMIC' | 'NON-ACADEMIC'