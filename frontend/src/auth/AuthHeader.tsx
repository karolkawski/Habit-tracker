import { getTokenFromLocalStorage } from '../utils/token';

export const AuthHeader = {
  headers: { Authorization: `Bearer ${getTokenFromLocalStorage()}` },
};
