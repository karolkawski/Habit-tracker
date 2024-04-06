export const fetchTokenRequest = () => ({
  type: 'FETCH_TOKEN_REQUEST',
});

export const fetchTokenSuccess = (data) => ({
  type: 'FETCH_TOKEN_SUCCESS',
  payload: data,
});

export const removeTokenSuccess = () => ({
  type: 'REMOVE_TOKEN_SUCCESS'
});
export const fetchUserRequest = () => ({
  type: 'FETCH_USER_REQUEST',
});

export const fetchUserSuccess = (data) => ({
  type: 'FETCH_USER_SUCCESS',
  payload: data,
});

export const fetchUserError = (error: string) => ({
  type: 'FETCH_USER_ERROR',
  payload: error,
});
