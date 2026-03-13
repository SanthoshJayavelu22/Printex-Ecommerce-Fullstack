export const USER = 'user';
export const ADMIN = 'admin';
export const SUPER_ADMIN = 'super-admin';

export const ROLES = {
    USER,
    ADMIN,
    SUPER_ADMIN
} as const;

export type Role = typeof ROLES[keyof typeof ROLES];

export default {
    USER,
    ADMIN,
    SUPER_ADMIN,
    ROLES
};
