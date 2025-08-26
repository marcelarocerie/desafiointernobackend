export const JWT_SECRET = process.env.JWT_SECRET || 'secret_dev';
export const MAGIC_LINK_EXP_MINUTES = 10;
export const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || 'admin@ficticio.com').split(',');