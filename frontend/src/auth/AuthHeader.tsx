export const AuthHeader = (token: string) => {
  return { headers: { Authorization: `Bearer ${token}` } };
};
