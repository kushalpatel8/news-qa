export const ROLES = {
  ADMIN: "ADMIN",
  QA_ENGINEER: "QA_ENGINEER",
  EDITOR: "EDITOR",
  VIEWER: "VIEWER",
} as const;

export type Role = keyof typeof ROLES;
