 export function extractCounselingTypeFromRole(role: string): string {
  const [counselorType] = role.split('_COUNSELOR');
  return counselorType;
}

export function calculateGPA(subjects) {
  if (!subjects) {
    return `Calculating...`;
  }
  // Filter subjects with status "PASSED"
  // const passedSubjects = subjects.filter(subject => subject.status === "PASSED");
  const passedSubjects = subjects.filter(subject => subject.status === "PASSED" || subject.status === "NOT_PASSED");

  // Check if there are any passed subjects to avoid division by zero
  if (passedSubjects.length === 0) return 0;

  // Sum up the grades of the passed subjects
  const totalGrade = passedSubjects.reduce((sum, subject) => sum + subject.grade, 0);

  // Calculate the GPA by dividing the total grade by the number of passed subjects
  const gpa = totalGrade / passedSubjects.length;

  // Round the GPA to two decimal places
  return Math.round(gpa * 100) / 100;
}
