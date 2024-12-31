import { Appointment } from '.';

export type User = {
	accessToken: string;
	refreshToken: string;
	account: Account | null;
};

export type Account = {
	id: number;
	email: string;
	role: Role;
	status: string;
	profile: Profile;
};

export type Profile = {
	id: number;
	fullName: string;
	phoneNumber: string;
	dateOfBirth: number;
	avatarLink: string;
	gender: string;
	email?: string;
};

export type Counselor = {
	id: number;
	profile: Profile;
	email: string;
	rating?: number;
	expertise?: Expertise;
	specialization?: Specialization;
	status: 'AVAILABLE' | 'UNAVAILABLE';
	// status: string,
	academicDegree: string;
	department?: Department;
	major?: Major;
	specializedSkills?: string;
	otherSkills?: string;
	workHistory?: string;
	achievements?: string;
	qualifications?: QualificationList;
	certifications?: CertificationList;
};

export type Student = {
	id: number;
	profile: Profile;
	email: string;
	studentCode: number;
	specialization: Specialization;
	department: Department;
	major: Major;
	behaviorTagList: BehaviorTagList;
};

export type SupportStaff = {
	id: number;
	profile: Profile;
	status: string;
};

export type Specialization = {
	id: number;
	name: string;
	code: string;
	majorId?: string | number;
	departmentId?: string | number;
};

export type Department = {
	id: number;
	name: string;
	code: string;
};

export type Major = {
	id: number;
	name: string;
	code: string;
	departmentId: number;
};

export type Expertise = {
	id: number;
	name: string;
};

export type QualificationList = Qualification[];

export type CertificationList = Certification[];

export type Certification = {
	id: number;
	name: string;
	organization: string;
	imageUrl: string;
};

export type Qualification = {
	id: number;
	degree: string;
	fieldOfStudy: string;
	institution: string;
	yearOfGraduation: string | number;
	imageUrl: string;
};

export type Role =
	| 'STUDENT'
	| 'SUPPORT_STAFF'
	| 'MANAGER'
	| 'ADMIN'
	| 'COUNSELOR'
	| 'ACADEMIC_COUNSELOR'
	| 'NON_ACADEMIC_COUNSELOR';

export type CounselingType = 'ACADEMIC' | 'NON_ACADEMIC';

export type StudentDocument = {
	studentProfile: Student;
	counselingProfile: StudentCounselingDocumentInfo;
	counselingAppointment: Appointment[];
};

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
};

type BehaviorTag = {
	id: number | null;
	studentCode: string | null;
	source: string | null;
	problemTagName: string;
	number: number;
	semesterName: string | null;
	contained: boolean;
	category: string;
};
type BehaviorTagList = BehaviorTag[];
