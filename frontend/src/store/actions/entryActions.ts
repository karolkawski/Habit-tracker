export const fetchDataRequest = () => ({
  type: 'FETCH_ENTRY_REQUEST',
});

export const fetchENTRYSuccess = (data) => ({
  type: 'FETCH_ENTRY_SUCCESS',
  payload: data,
});

export const fetchDataError = (error: string) => ({
  type: 'FETCH_ENTRY_ERROR',
  payload: error,
});
