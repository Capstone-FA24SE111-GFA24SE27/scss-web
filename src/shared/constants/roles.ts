export const roles = {
  STUDENT: 'STUDENT',
  COUNSELOR: 'COUNSELOR',
  SUPPORT_STAFF: 'SUPPORT_STAFF',
  MANAGER: 'MANAGER',
  ADMIN: 'ADMIN',
}

export type Role = keyof typeof roles