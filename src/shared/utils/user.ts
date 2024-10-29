export function extractCounselingTypeFromRole(role: string): string {
  const [counselorType] = role.split('_COUNSELOR');
  return counselorType;
}