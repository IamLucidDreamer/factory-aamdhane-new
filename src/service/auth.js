import { request } from './common';

export const getLoggedInUser = () => request('/api/auth/app-user/login', 'GET');

export const logout = () => request('/api/auth/logout', 'DELETE');
