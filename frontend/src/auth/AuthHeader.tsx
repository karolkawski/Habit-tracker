export const AuthHeader = (token) => {
  return { headers: { Authorization: `Bearer ${token}` } };
};
